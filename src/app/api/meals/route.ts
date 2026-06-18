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

    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    if (session.user.role !== 'CLIENT') {
      return NextResponse.json({ error: 'Only clients can view meals' }, { status: 403 })
    }

    const meals = await prisma.meal.findMany({
      where: {
        clientId: session.user.id,
        mealDate: {
          gte: new Date(date),
          lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(meals)
  } catch (error) {
    console.error('GET /api/meals error:', error)
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
    const { name, calories, protein, carbs, fat } = data

    if (!name || calories === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const meal = await prisma.meal.create({
      data: {
        clientId: session.user.id,
        name,
        calories: Math.round(calories),
        protein: Math.round(protein || 0),
        carbs: Math.round(carbs || 0),
        fat: Math.round(fat || 0),
        mealDate: new Date(),
      },
    })

    return NextResponse.json(meal, { status: 201 })
  } catch (error) {
    console.error('POST /api/meals error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'CLIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const mealId = searchParams.get('id')

    if (!mealId) {
      return NextResponse.json({ error: 'Missing meal id' }, { status: 400 })
    }

    // Check meal belongs to user
    const meal = await prisma.meal.findUnique({ where: { id: parseInt(mealId) } })
    if (!meal || meal.clientId !== session.user.id) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 })
    }

    await prisma.meal.delete({ where: { id: parseInt(mealId) } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/meals error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
