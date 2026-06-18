import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'CLIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const weights = await prisma.weightLog.findMany({
      where: { clientId: session.user.id },
      orderBy: { loggedDate: 'desc' },
      take: 90, // Last 90 days
    })

    return NextResponse.json(weights)
  } catch (error) {
    console.error('GET /api/weight error:', error)
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
    const { weight } = data

    if (weight === undefined || weight <= 0) {
      return NextResponse.json({ error: 'Invalid weight value' }, { status: 400 })
    }

    const log = await prisma.weightLog.create({
      data: {
        clientId: session.user.id,
        weight: parseFloat(weight),
        loggedDate: new Date(),
      },
    })

    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    console.error('POST /api/weight error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
