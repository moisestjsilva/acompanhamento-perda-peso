import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string
    const weightRecordId = formData.get('weightRecordId') as string
    const description = formData.get('description') as string
    
    if (!file || !userId || !weightRecordId) {
      return NextResponse.json(
        { error: 'File, userId, and weightRecordId are required' },
        { status: 400 }
      )
    }

    // Verificar se o registro de peso existe e pertence ao usuário
    const weightRecord = await db.weightRecord.findFirst({
      where: {
        id: weightRecordId,
        userId: userId
      }
    })

    if (!weightRecord) {
      return NextResponse.json(
        { error: 'Weight record not found or does not belong to user' },
        { status: 404 }
      )
    }

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validar tamanho do arquivo (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Gerar nome de arquivo único
    const fileExtension = file.name.split('.').pop()
    const filename = `${uuidv4()}.${fileExtension}`
    const filePath = join(process.cwd(), 'public', 'uploads', filename)

    // Converter File para Buffer e salvar
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Salvar informações no banco de dados
    const photo = await db.photo.create({
      data: {
        userId,
        weightRecordId,
        filename,
        originalName: file.name,
        filePath: `/uploads/${filename}`,
        fileSize: file.size,
        mimeType: file.type,
        description: description || null
      }
    })

    return NextResponse.json({
      id: photo.id,
      filename: photo.filename,
      originalName: photo.originalName,
      filePath: photo.filePath,
      fileSize: photo.fileSize,
      mimeType: photo.mimeType,
      description: photo.description,
      createdAt: photo.createdAt
    }, { status: 201 })

  } catch (error) {
    console.error('Error uploading photo:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const weightRecordId = searchParams.get('weightRecordId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const whereClause: any = { userId }
    if (weightRecordId) {
      whereClause.weightRecordId = weightRecordId
    }

    const photos = await db.photo.findMany({
      where: whereClause,
      include: {
        weightRecord: {
          select: {
            date: true,
            weight: true
          }
        }
      },
      orderBy: { takenAt: 'desc' }
    })

    return NextResponse.json(photos)
  } catch (error) {
    console.error('Error fetching photos:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}