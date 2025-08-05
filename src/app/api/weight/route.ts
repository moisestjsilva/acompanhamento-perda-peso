import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const weightRecords = await db.weightRecord.findMany({
      where: { userId },
      orderBy: { date: 'asc' }
    })

    return NextResponse.json(weightRecords)
  } catch (error) {
    console.error('Error fetching weight records:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, weight, date, notes } = body

    if (!userId || !weight) {
      return NextResponse.json({ error: 'User ID and weight are required' }, { status: 400 })
    }

    const weightRecord = await db.weightRecord.create({
      data: {
        userId,
        weight: parseFloat(weight),
        date: date ? new Date(date) : new Date(),
        notes: notes || null
      }
    })

    return NextResponse.json(weightRecord, { status: 201 })
  } catch (error) {
    console.error('Error creating weight record:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}