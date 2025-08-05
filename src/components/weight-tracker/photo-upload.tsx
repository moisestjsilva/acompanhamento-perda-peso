"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Upload, X, Camera, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

interface PhotoUploadProps {
  userId: string
  weightRecordId: string
  onPhotoUploaded?: (photo: any) => void
  existingPhotos?: any[]
}

export default function PhotoUpload({ 
  userId, 
  weightRecordId, 
  onPhotoUploaded, 
  existingPhotos = [] 
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [description, setDescription] = useState('')
  const [photos, setPhotos] = useState(existingPhotos)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  const handleUpload = async (file: File) => {
    if (!file) return

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo de arquivo inválido. Apenas JPEG, PNG e WebP são permitidos.')
      return
    }

    // Validar tamanho do arquivo (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      toast.error('Arquivo muito grande. Tamanho máximo é 10MB.')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', userId)
      formData.append('weightRecordId', weightRecordId)
      if (description) {
        formData.append('description', description)
      }

      const response = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao fazer upload')
      }

      const newPhoto = await response.json()
      setPhotos(prev => [newPhoto, ...prev])
      setDescription('')
      onPhotoUploaded?.(newPhoto)
      toast.success('Foto enviada com sucesso!')
    } catch (error) {
      console.error('Error uploading photo:', error)
      toast.error('Erro ao enviar foto. Tente novamente.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDeletePhoto = async (photoId: string) => {
    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar foto')
      }

      setPhotos(prev => prev.filter(photo => photo.id !== photoId))
      toast.success('Foto deletada com sucesso!')
    } catch (error) {
      console.error('Error deleting photo:', error)
      toast.error('Erro ao deletar foto. Tente novamente.')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Camera className="h-5 w-5 text-pink-500" />
            Enviar Fotos
          </CardTitle>
          <CardDescription className="text-sm">
            Adicione fotos para acompanhar sua evolução
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Descrição (opcional)</Label>
            <Input
              id="description"
              placeholder="Ex: Foto frontal, lateral, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-0 bg-gray-50 dark:bg-gray-700/50 focus:bg-white dark:focus:bg-gray-700"
            />
          </div>
          
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              id="photo-upload"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full h-12 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 border-0 text-white font-medium"
            >
              <Upload className="h-5 w-5 mr-2" />
              {uploading ? 'Enviando...' : 'Selecionar Foto'}
            </Button>
            
            <div className="text-xs text-center text-muted-foreground bg-gray-50 dark:bg-gray-700/30 rounded-lg p-2">
              Formatos: JPEG, PNG, WebP • Máximo: 10MB
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photos Grid */}
      {photos.length > 0 && (
        <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-blue-500" />
              Fotos Enviadas ({photos.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-square rounded-xl overflow-hidden border-0 shadow-sm">
                    <img
                      src={photo.filePath}
                      alt={photo.description || photo.originalName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-xl flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 border-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    {photo.description && (
                      <p className="text-xs font-medium text-foreground truncate">{photo.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0">
                        {formatFileSize(photo.fileSize)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(photo.createdAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}