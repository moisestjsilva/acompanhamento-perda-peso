import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const goals = await db.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(goals)
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, description, targetWeight, startDate, targetDate } = body

    if (!userId || !title || !targetWeight || !startDate || !targetDate) {
      return NextResponse.json({ 
        error: 'User ID, title, target weight, start date, and target date are required' 
      }, { status: 400 })
    }

    const goal = await db.goal.create({
      data: {
        userId,
        title,
        description: description || null,
        targetWeight: parseFloat(targetWeight),
        startDate: new Date(startDate),
        targetDate: new Date(targetDate)
      }
    })

    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}