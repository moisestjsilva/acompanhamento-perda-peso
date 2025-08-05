"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingDown, Target, Calendar, Plus, Scale, Camera, Image as ImageIcon, Activity, Trophy } from 'lucide-react'
import PhotoUpload from '@/components/weight-tracker/photo-upload'
import PhotoComparison from '@/components/weight-tracker/photo-comparison'

interface WeightRecord {
  id: string
  weight: number
  date: string
  notes?: string
  photos?: any[]
}

interface UserProfile {
  height?: number
  initialWeight?: number
  targetWeight?: number
}

interface Goal {
  id: string
  title: string
  targetWeight: number
  startDate: string
  targetDate: string
  isActive: boolean
  achieved: boolean
}

export default function WeightTracker() {
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile>({})
  const [goals, setGoals] = useState<Goal[]>([])
  const [newWeight, setNewWeight] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<WeightRecord | null>(null)
  const [allPhotos, setAllPhotos] = useState<any[]>([])

  // Mock user ID para demonstração
  const mockUserId = 'user-123'

  // Utility function for consistent date formatting
  const formatDate = (dateString: string, options: Intl.DateTimeFormatOptions) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', options)
    } catch (error) {
      return dateString
    }
  }

  // Dados mockados para demonstração
  useEffect(() => {
    // Simulando dados iniciais
    const mockRecords: WeightRecord[] = [
      { id: '1', weight: 75.5, date: '2024-01-01', notes: 'Peso inicial', photos: [] },
      { id: '2', weight: 74.8, date: '2024-01-08', notes: 'Primeira semana', photos: [] },
      { id: '3', weight: 74.2, date: '2024-01-15', notes: 'Progresso bom', photos: [] },
      { id: '4', weight: 73.5, date: '2024-01-22', notes: 'Continuando', photos: [] },
      { id: '5', weight: 72.8, date: '2024-01-29', notes: 'Ótimo progresso', photos: [] },
    ]
    setWeightRecords(mockRecords)

    setUserProfile({
      height: 170,
      initialWeight: 75.5,
      targetWeight: 68.0
    })

    setGoals([
      {
        id: '1',
        title: 'Perder 7.5kg',
        targetWeight: 68.0,
        startDate: '2024-01-01',
        targetDate: '2024-04-01',
        isActive: true,
        achieved: false
      }
    ])

    // Simular algumas fotos
    const mockPhotos = [
      {
        id: 'photo-1',
        filename: 'progress-1.jpg',
        originalName: 'foto-inicial.jpg',
        filePath: '/uploads/progress-1.jpg',
        fileSize: 1024000,
        mimeType: 'image/jpeg',
        description: 'Foto inicial - frente',
        weightRecordId: '1',
        createdAt: '2024-01-01T10:00:00.000Z'
      },
      {
        id: 'photo-2',
        filename: 'progress-2.jpg',
        originalName: 'foto-progresso.jpg',
        filePath: '/uploads/progress-2.jpg',
        fileSize: 1150000,
        mimeType: 'image/jpeg',
        description: 'Após 1 mês - frente',
        weightRecordId: '5',
        createdAt: '2024-01-29T10:00:00.000Z'
      }
    ]
    setAllPhotos(mockPhotos)
  }, [])

  const currentWeight = weightRecords.length > 0 ? weightRecords[weightRecords.length - 1].weight : 0
  const weightLost = userProfile.initialWeight ? userProfile.initialWeight - currentWeight : 0
  const weightToGo = userProfile.targetWeight ? currentWeight - userProfile.targetWeight : 0
  const totalGoal = userProfile.initialWeight && userProfile.targetWeight ? userProfile.initialWeight - userProfile.targetWeight : 0
  const progressPercentage = totalGoal > 0 ? (weightLost / totalGoal) * 100 : 0

  const handleAddWeight = async () => {
    if (!newWeight) return

    setLoading(true)
    const now = new Date()
    const newRecord: WeightRecord = {
      id: `record-${now.getTime()}`,
      weight: parseFloat(newWeight),
      date: now.toISOString().split('T')[0],
      notes: newNotes,
      photos: []
    }

    setWeightRecords([...weightRecords, newRecord])
    setNewWeight('')
    setNewNotes('')
    setLoading(false)
  }

  const handlePhotoUploaded = (photo: any) => {
    setAllPhotos(prev => [photo, ...prev])
  }

  const calculateBMI = () => {
    if (!userProfile.height || !currentWeight) return 0
    const heightInMeters = userProfile.height / 100
    return currentWeight / (heightInMeters * heightInMeters)
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Abaixo do peso', color: 'bg-blue-500' }
    if (bmi < 25) return { category: 'Peso normal', color: 'bg-green-500' }
    if (bmi < 30) return { category: 'Sobrepeso', color: 'bg-yellow-500' }
    return { category: 'Obesidade', color: 'bg-red-500' }
  }

  const bmi = calculateBMI()
  const bmiInfo = getBMICategory(bmi)

  const getPhotosForRecord = (recordId: string) => {
    return allPhotos.filter(photo => photo.weightRecordId === recordId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-3 py-4 md:px-6 md:py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Meu Progresso
              </h1>
              <p className="text-sm text-muted-foreground">
                Acompanhe sua jornada de saúde
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Atual</p>
                  <p className="text-lg font-bold text-foreground truncate">{currentWeight.toFixed(1)} kg</p>
                  {weightLost > 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400">-{weightLost.toFixed(1)} kg</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Meta</p>
                  <p className="text-lg font-bold text-foreground truncate">{userProfile.targetWeight?.toFixed(1) || '0'} kg</p>
                  {weightToGo > 0 && (
                    <p className="text-xs text-orange-600 dark:text-orange-400">{weightToGo.toFixed(1)} kg restantes</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">IMC</p>
                  <p className="text-lg font-bold text-foreground">{bmi.toFixed(1)}</p>
                  <Badge variant="secondary" className={`text-xs ${bmiInfo.color} text-white border-0`}>
                    {bmiInfo.category}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                  <Camera className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Fotos</p>
                  <p className="text-lg font-bold text-foreground">{allPhotos.length}</p>
                  <p className="text-xs text-muted-foreground">registros</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        {totalGoal > 0 && (
          <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 backdrop-blur-sm mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">Progresso da Meta</span>
                </div>
                <span className="text-sm font-bold text-foreground">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {weightLost.toFixed(1)} kg de {totalGoal.toFixed(1)} kg perdidos
              </p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="chart" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-sm h-auto p-1">
            <TabsTrigger value="chart" className="flex flex-col gap-1 py-2 px-2 text-xs data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <TrendingDown className="h-4 w-4" />
              <span className="hidden sm:inline">Gráfico</span>
            </TabsTrigger>
            <TabsTrigger value="register" className="flex flex-col gap-1 py-2 px-2 text-xs data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Adicionar</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex flex-col gap-1 py-2 px-2 text-xs data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Histórico</span>
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex flex-col gap-1 py-2 px-2 text-xs data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Fotos</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex flex-col gap-1 py-2 px-2 text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Metas</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="space-y-4">
            <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-blue-500" />
                  Evolução do Peso
                </CardTitle>
                <CardDescription className="text-sm">Seu progresso ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-64 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightRecords} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => formatDate(value, { month: 'short', day: 'numeric' })}
                        fontSize={12}
                        stroke="#64748b"
                      />
                      <YAxis
                        domain={['dataMin - 1', 'dataMax + 1']}
                        fontSize={12}
                        stroke="#64748b"
                      />
                      <Tooltip
                        labelFormatter={(value) => formatDate(value, {})}
                        formatter={(value: number) => [`${value.toFixed(1)} kg`, 'Peso']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="url(#gradient)"
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#1d4ed8' }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="h-5 w-5 text-green-500" />
                  Novo Registro
                </CardTitle>
                <CardDescription className="text-sm">Adicione seu peso atual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-sm font-medium">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 70.5"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      className="h-12 text-lg border-0 bg-gray-50 dark:bg-gray-700/50 focus:bg-white dark:focus:bg-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium">Observações (opcional)</Label>
                    <Input
                      id="notes"
                      placeholder="Ex: Após treino, manhã, etc."
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      className="border-0 bg-gray-50 dark:bg-gray-700/50 focus:bg-white dark:focus:bg-gray-700"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddWeight}
                  disabled={loading || !newWeight}
                  className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 text-white font-medium"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {loading ? 'Registrando...' : 'Registrar Peso'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  Histórico
                </CardTitle>
                <CardDescription className="text-sm">Seus registros de peso</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {weightRecords.slice().reverse().map((record, index) => {
                    const recordPhotos = getPhotosForRecord(record.id)
                    const previousRecord = weightRecords[weightRecords.findIndex(r => r.id === record.id) - 1]
                    const weightDiff = previousRecord ? previousRecord.weight - record.weight : 0

                    return (
                      <div key={record.id} className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="text-xl font-bold text-foreground">{record.weight.toFixed(1)} kg</div>
                              {weightDiff !== 0 && (
                                <Badge
                                  variant="secondary"
                                  className={`text-xs border-0 ${weightDiff > 0
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    }`}
                                >
                                  {weightDiff > 0 ? '-' : '+'}{Math.abs(weightDiff).toFixed(1)} kg
                                </Badge>
                              )}
                              {recordPhotos.length > 0 && (
                                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0">
                                  <Camera className="h-3 w-3 mr-1" />
                                  {recordPhotos.length}
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground mb-1">
                              {formatDate(record.date, {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short'
                              })}
                            </div>
                            {record.notes && (
                              <div className="text-sm text-muted-foreground italic">{record.notes}</div>
                            )}
                            {recordPhotos.length > 0 && (
                              <div className="mt-3">
                                <div className="flex gap-2">
                                  {recordPhotos.slice(0, 4).map((photo) => (
                                    <div key={photo.id} className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white dark:border-gray-600">
                                      <img
                                        src={photo.filePath}
                                        alt={photo.description}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                                  {recordPhotos.length > 4 && (
                                    <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-medium">
                                      +{recordPhotos.length - 4}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos" className="space-y-4">
            <div className="space-y-4">
              {/* Seletor de registro para associar fotos */}
              <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Camera className="h-5 w-5 text-pink-500" />
                    Fotos de Progresso
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Selecione um registro para adicionar fotos
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {weightRecords.slice(-8).map((record) => (
                      <Button
                        key={record.id}
                        variant={selectedRecord?.id === record.id ? "default" : "outline"}
                        onClick={() => setSelectedRecord(record)}
                        className={`h-auto p-3 flex flex-col gap-1 border-0 ${selectedRecord?.id === record.id
                          ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white'
                          : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                      >
                        <div className="font-semibold text-sm">{record.weight.toFixed(1)} kg</div>
                        <div className="text-xs opacity-80">
                          {formatDate(record.date, { day: 'numeric', month: 'short' })}
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Componente de upload de fotos */}
              {selectedRecord && (
                <PhotoUpload
                  userId={mockUserId}
                  weightRecordId={selectedRecord.id}
                  onPhotoUploaded={handlePhotoUploaded}
                  existingPhotos={getPhotosForRecord(selectedRecord.id)}
                />
              )}

              {/* Galeria geral de fotos */}
              {allPhotos.length > 0 && (
                <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-blue-500" />
                      Galeria ({allPhotos.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {allPhotos.map((photo) => {
                        const record = weightRecords.find(r => r.id === photo.weightRecordId)
                        return (
                          <div key={photo.id} className="relative group">
                            <div className="aspect-square rounded-xl overflow-hidden border-0 shadow-sm">
                              <img
                                src={photo.filePath}
                                alt={photo.description || photo.originalName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 rounded-b-xl">
                              <div className="text-white text-xs font-medium">
                                {record?.weight.toFixed(1)} kg
                              </div>
                              <div className="text-white/80 text-xs">
                                {formatDate(photo.createdAt, { day: 'numeric', month: 'short' })}
                              </div>
                            </div>
                            {photo.description && (
                              <div className="mt-2">
                                <p className="text-xs font-medium text-foreground truncate">{photo.description}</p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Componente de comparação de fotos */}
              {allPhotos.length >= 2 && (
                <PhotoComparison
                  photos={allPhotos}
                  weightRecords={weightRecords}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  Metas de Peso
                </CardTitle>
                <CardDescription className="text-sm">Acompanhe seu progresso</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-4 border-0">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{goal.title}</h3>
                            <Badge
                              variant={goal.isActive ? 'default' : 'secondary'}
                              className={`text-xs border-0 ${goal.isActive
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                }`}
                            >
                              {goal.isActive ? 'Ativa' : 'Inativa'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Meta: <span className="font-medium text-foreground">{goal.targetWeight.toFixed(1)} kg</span>
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Início:</span>
                              <div className="font-medium text-foreground">
                                {formatDate(goal.startDate, { day: 'numeric', month: 'short', year: 'numeric' })}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Término:</span>
                              <div className="font-medium text-foreground">
                                {formatDate(goal.targetDate, { day: 'numeric', month: 'short', year: 'numeric' })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso</span>
                          <span className="font-medium">{Math.round(progressPercentage)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 p-2">
          <div className="flex justify-center">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1">
              {/* Mobile navigation buttons would go here */}
            </div>
          </div>
        </div>

        {/* Spacer for mobile bottom navigation */}
        <div className="h-16 md:hidden"></div>
      </div>
    </div>
  )
}