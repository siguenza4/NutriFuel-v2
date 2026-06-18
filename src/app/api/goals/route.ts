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

    let goals = await prisma.goals.findUnique({
      where: { userId: session.user.id },
    })

    // Create default goals if not exist
    if (!goals) {
      goals = await prisma.goals.create({
        data: {
          userId: session.user.id,
          calories: 2000,
          protein: 150,
          carbs: 200,
          fat: 65,
        },
      })
    }

    return NextResponse.json(goals)
  } catch (error) {
    console.error('GET /api/goals error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const { calories, protein, carbs, fat } = data

    let goals = await prisma.goals.findUnique({
      where: { userId: session.user.id },
    })

    if (!goals) {
      goals = await prisma.goals.create({
        data: {
          userId: session.user.id,
          calories: calories || 2000,
          protein: protein || 150,
          carbs: carbs || 200,
          fat: fat || 65,
        },
      })
    } else {
      goals = await prisma.goals.update({
        where: { userId: session.user.id },
        data: {
          ...(calories !== undefined && { calories }),
          ...(protein !== undefined && { protein }),
          ...(carbs !== undefined && { carbs }),
          ...(fat !== undefined && { fat }),
        },
      })
    }

    return NextResponse.json(goals)
  } catch (error) {
    console.error('PUT /api/goals error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
