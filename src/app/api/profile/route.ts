import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const profile = await db.userProfile.findUnique({
      where: { userId }
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, height, initialWeight, targetWeight, birthDate, gender, activityLevel } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const existingProfile = await db.userProfile.findUnique({
      where: { userId }
    })

    let profile
    if (existingProfile) {
      profile = await db.userProfile.update({
        where: { userId },
        data: {
          height: height ? parseFloat(height) : existingProfile.height,
          initialWeight: initialWeight ? parseFloat(initialWeight) : existingProfile.initialWeight,
          targetWeight: targetWeight ? parseFloat(targetWeight) : existingProfile.targetWeight,
          birthDate: birthDate ? new Date(birthDate) : existingProfile.birthDate,
          gender: gender || existingProfile.gender,
          activityLevel: activityLevel || existingProfile.activityLevel
        }
      })
    } else {
      profile = await db.userProfile.create({
        data: {
          userId,
          height: height ? parseFloat(height) : null,
          initialWeight: initialWeight ? parseFloat(initialWeight) : null,
          targetWeight: targetWeight ? parseFloat(targetWeight) : null,
          birthDate: birthDate ? new Date(birthDate) : null,
          gender: gender || null,
          activityLevel: activityLevel || null
        }
      })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}