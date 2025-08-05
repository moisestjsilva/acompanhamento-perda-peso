"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Camera, ArrowLeft, ArrowRight, Maximize2 } from 'lucide-react'

interface PhotoComparisonProps {
  photos: any[]
  weightRecords: any[]
}

export default function PhotoComparison({ photos, weightRecords }: PhotoComparisonProps) {
  const [selectedBefore, setSelectedBefore] = useState<string>('')
  const [selectedAfter, setSelectedAfter] = useState<string>('')
  const [comparisonMode, setComparisonMode] = useState<'side-by-side' | 'slider'>('side-by-side')

  // Agrupar fotos por data
  const photosByDate = photos.reduce((acc, photo) => {
    const date = photo.createdAt.split('T')[0]
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(photo)
    return acc
  }, {} as Record<string, any[]>)

  // Ordenar datas
  const sortedDates = Object.keys(photosByDate).sort()

  // Encontrar registros de peso correspondentes
  const getWeightRecordForPhoto = (photo: any) => {
    return weightRecords.find(record => record.id === photo.weightRecordId)
  }

  // Obter fotos disponíveis para comparação
  const availablePhotos = photos.filter(photo => {
    const record = getWeightRecordForPhoto(photo)
    return record && record.weight
  })

  // Fotos selecionadas para comparação
  const beforePhoto = availablePhotos.find(p => p.id === selectedBefore)
  const afterPhoto = availablePhotos.find(p => p.id === selectedAfter)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Fotos</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{photos.length}</div>
            <p className="text-xs text-muted-foreground">
              {sortedDates.length} dias registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Período</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {sortedDates.length > 1 ? `${sortedDates.length} dias` : '1 dia'}
            </div>
            <p className="text-xs text-muted-foreground">
              {sortedDates.length > 0 && (
                `${new Date(sortedDates[0]).toLocaleDateString('pt-BR')} - ${new Date(sortedDates[sortedDates.length - 1]).toLocaleDateString('pt-BR')}`
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modo de Visualização</CardTitle>
            <Maximize2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Select value={comparisonMode} onValueChange={(value: 'side-by-side' | 'slider') => setComparisonMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="side-by-side">Lado a Lado</SelectItem>
                <SelectItem value="slider">Slider</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Seletor de Fotos para Comparação */}
      {availablePhotos.length >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Comparar Fotos</CardTitle>
            <CardDescription>Selecione duas fotos para comparar seu progresso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Foto "Antes"</label>
                <Select value={selectedBefore} onValueChange={setSelectedBefore}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a foto inicial" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePhotos.map((photo) => {
                      const record = getWeightRecordForPhoto(photo)
                      return (
                        <SelectItem key={photo.id} value={photo.id}>
                          <div className="flex items-center gap-2">
                            <div>
                              <div className="font-medium">{record?.weight.toFixed(1)} kg</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(photo.createdAt).toLocaleDateString('pt-BR')}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Foto "Depois"</label>
                <Select value={selectedAfter} onValueChange={setSelectedAfter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a foto atual" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePhotos.map((photo) => {
                      const record = getWeightRecordForPhoto(photo)
                      return (
                        <SelectItem key={photo.id} value={photo.id}>
                          <div className="flex items-center gap-2">
                            <div>
                              <div className="font-medium">{record?.weight.toFixed(1)} kg</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(photo.createdAt).toLocaleDateString('pt-BR')}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Visualização da Comparação */}
            {beforePhoto && afterPhoto && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Comparação Visual</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {beforePhoto.description || 'Antes'}
                    </Badge>
                    <ArrowRight className="h-4 w-4" />
                    <Badge variant="outline">
                      {afterPhoto.description || 'Depois'}
                    </Badge>
                  </div>
                </div>

                {comparisonMode === 'side-by-side' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-center">
                        <Badge variant="secondary">
                          {getWeightRecordForPhoto(beforePhoto)?.weight.toFixed(1)} kg - {new Date(beforePhoto.createdAt).toLocaleDateString('pt-BR')}
                        </Badge>
                      </div>
                      <div className="aspect-square rounded-lg overflow-hidden border">
                        <img
                          src={beforePhoto.filePath}
                          alt={beforePhoto.description || 'Foto antes'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {beforePhoto.description && (
                        <p className="text-sm text-muted-foreground text-center">{beforePhoto.description}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="text-center">
                        <Badge variant="secondary">
                          {getWeightRecordForPhoto(afterPhoto)?.weight.toFixed(1)} kg - {new Date(afterPhoto.createdAt).toLocaleDateString('pt-BR')}
                        </Badge>
                      </div>
                      <div className="aspect-square rounded-lg overflow-hidden border">
                        <img
                          src={afterPhoto.filePath}
                          alt={afterPhoto.description || 'Foto depois'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {afterPhoto.description && (
                        <p className="text-sm text-muted-foreground text-center">{afterPhoto.description}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Badge variant="secondary">
                        Arraste para comparar antes e depois
                      </Badge>
                    </div>
                    <div className="relative aspect-square rounded-lg overflow-hidden border group cursor-pointer">
                      <img
                        src={beforePhoto.filePath}
                        alt="Foto antes"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 overflow-hidden">
                        <img
                          src={afterPhoto.filePath}
                          alt="Foto depois"
                          className="w-full h-full object-cover"
                          style={{ clipPath: 'inset(0 50% 0 0)' }}
                        />
                      </div>
                      <div className="absolute inset-y-0 left-1/2 w-1 bg-white cursor-ew-resize transform -translate-x-1/2">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                          <div className="w-4 h-0.5 bg-gray-400"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Estatísticas da Comparação */}
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-sm text-muted-foreground">Peso Inicial</div>
                      <div className="font-bold">{getWeightRecordForPhoto(beforePhoto)?.weight.toFixed(1)} kg</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Peso Atual</div>
                      <div className="font-bold">{getWeightRecordForPhoto(afterPhoto)?.weight.toFixed(1)} kg</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Diferença</div>
                      <div className="font-bold text-green-600">
                        {(getWeightRecordForPhoto(beforePhoto)!.weight - getWeightRecordForPhoto(afterPhoto)!.weight).toFixed(1)} kg
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Dias</div>
                      <div className="font-bold">
                        {Math.ceil((new Date(afterPhoto.createdAt).getTime() - new Date(beforePhoto.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Linha do Tempo de Fotos */}
      <Card>
        <CardHeader>
          <CardTitle>Linha do Tempo de Progresso</CardTitle>
          <CardDescription>Suas fotos organizadas por data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sortedDates.map((date, index) => (
              <div key={date} className="relative">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{new Date(date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                      {photosByDate[date].length > 0 && (
                        <Badge variant="secondary">
                          {photosByDate[date].length} foto(s)
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {photosByDate[date].map((photo) => {
                        const record = getWeightRecordForPhoto(photo)
                        return (
                          <Dialog key={photo.id}>
                            <DialogTrigger asChild>
                              <div className="relative group cursor-pointer">
                                <div className="aspect-square rounded-lg overflow-hidden border">
                                  <img
                                    src={photo.filePath}
                                    alt={photo.description || 'Foto de progresso'}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                  <Maximize2 className="h-6 w-6 text-white" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 rounded-b-lg">
                                  <div className="text-white text-xs font-medium">
                                    {record?.weight.toFixed(1)} kg
                                  </div>
                                </div>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>
                                  Foto de Progresso - {new Date(photo.createdAt).toLocaleDateString('pt-BR')}
                                </DialogTitle>
                                <DialogDescription>
                                  {record?.weight.toFixed(1)} kg {photo.description && `- ${photo.description}`}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <img
                                    src={photo.filePath}
                                    alt={photo.description || 'Foto de progresso'}
                                    className="w-full rounded-lg"
                                  />
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Informações</h4>
                                    <div className="space-y-2 text-sm">
                                      <div><strong>Data:</strong> {new Date(photo.createdAt).toLocaleDateString('pt-BR')}</div>
                                      <div><strong>Peso:</strong> {record?.weight.toFixed(1)} kg</div>
                                      <div><strong>Descrição:</strong> {photo.description || 'Sem descrição'}</div>
                                      <div><strong>Tamanho:</strong> {formatFileSize(photo.fileSize)}</div>
                                      <div><strong>Tipo:</strong> {photo.mimeType}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )
                      })}
                    </div>
                  </div>
                </div>
                {index < sortedDates.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-6 bg-border"></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}