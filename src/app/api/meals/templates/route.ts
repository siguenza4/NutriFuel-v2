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

    if (session.user.role !== 'COACH') {
      return NextResponse.json({ error: 'Only coaches can view meal templates' }, { status: 403 })
    }

    const templates = await prisma.mealTemplate.findMany({
      where: { coachId: session.user.id },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('GET /api/meals/templates error:', error)
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
    const { name, items } = data // items: [{ foodId, gramsDefault }]

    if (!name || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const template = await prisma.mealTemplate.create({
      data: {
        coachId: session.user.id,
        name,
        items: {
          create: items,
        },
      },
      include: { items: true },
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error('POST /api/meals/templates error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
