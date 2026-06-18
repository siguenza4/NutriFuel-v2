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

    let assignments

    if (session.user.role === 'COACH') {
      assignments = await prisma.assignment.findMany({
        where: { coachId: session.user.id },
        include: {
          client: { select: { id: true, name: true, email: true } },
        },
      })
    } else {
      assignments = await prisma.assignment.findMany({
        where: { clientId: session.user.id },
        include: {
          coach: { select: { id: true, name: true } },
        },
      })
    }

    return NextResponse.json(assignments)
  } catch (error) {
    console.error('GET /api/assignments error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'COACH') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const { clientId, type, targetId } = data // type: 'diet' | 'routine', targetId: meal_template or routine id

    if (!clientId || !type || !targetId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify coach owns this client
    const client = await prisma.user.findFirst({
      where: { id: clientId, coachId: session.user.id },
    })

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const assignment = await prisma.assignment.create({
      data: {
        coachId: session.user.id,
        clientId,
        type: type as any,
        targetId: parseInt(targetId),
      },
      include: {
        client: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    console.error('POST /api/assignments error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'COACH') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const assignmentId = searchParams.get('id')

    if (!assignmentId) {
      return NextResponse.json({ error: 'Missing assignment id' }, { status: 400 })
    }

    // Verify coach owns this assignment
    const assignment = await prisma.assignment.findUnique({
      where: { id: parseInt(assignmentId) },
    })

    if (!assignment || assignment.coachId !== session.user.id) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    await prisma.assignment.delete({
      where: { id: parseInt(assignmentId) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/assignments error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
