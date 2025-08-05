import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { unlink } from 'fs/promises'
import { join } from 'path'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const photoId = params.id

    // Buscar a foto no banco de dados
    const photo = await db.photo.findUnique({
      where: { id: photoId }
    })

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      )
    }

    // Deletar o arquivo físico
    const filePath = join(process.cwd(), 'public', 'uploads', photo.filename)
    try {
      await unlink(filePath)
    } catch (error) {
      console.error('Error deleting physical file:', error)
      // Continuar mesmo se não conseguir deletar o arquivo físico
    }

    // Deletar o registro do banco de dados
    await db.photo.delete({
      where: { id: photoId }
    })

    return NextResponse.json({ message: 'Photo deleted successfully' })
  } catch (error) {
    console.error('Error deleting photo:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}