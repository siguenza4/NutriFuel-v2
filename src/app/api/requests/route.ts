import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let requests

    if (session.user.role === 'COACH') {
      requests = await prisma.changeRequest.findMany({
        where: { coachId: session.user.id },
        include: {
          client: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      })
    } else {
      requests = await prisma.changeRequest.findMany({
        where: { clientId: session.user.id },
        include: {
          coach: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      })
    }

    return NextResponse.json(requests)
  } catch (error) {
    console.error('GET /api/requests error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'CLIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const { type, description } = data

    if (!type || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get client's coach
    const client = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { coachId: true },
    })

    if (!client?.coachId) {
      return NextResponse.json({ error: 'No coach assigned' }, { status: 400 })
    }

    const request = await prisma.changeRequest.create({
      data: {
        clientId: session.user.id,
        coachId: client.coachId,
        type: type as any,
        description,
        status: 'PENDING',
      },
      include: {
        coach: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json(request, { status: 201 })
  } catch (error) {
    console.error('POST /api/requests error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'COACH') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const requestId = searchParams.get('id')

    if (!requestId) {
      return NextResponse.json({ error: 'Missing request id' }, { status: 400 })
    }

    const data = await req.json()
    const { status } = data // 'APPROVED' | 'REJECTED'

    // Verify coach owns this request
    const changeRequest = await prisma.changeRequest.findUnique({
      where: { id: parseInt(requestId) },
    })

    if (!changeRequest || changeRequest.coachId !== session.user.id) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    const updated = await prisma.changeRequest.update({
      where: { id: parseInt(requestId) },
      data: { status: status as any },
      include: {
        client: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('PUT /api/requests error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
