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
import { TrendingDown, Target, Calendar, Plus, Scale } from 'lucide-react'

interface WeightRecord {
  id: string
  weight: number
  date: string
  notes?: string
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

export default function Home() {
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile>({})
  const [goals, setGoals] = useState<Goal[]>([])
  const [newWeight, setNewWeight] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [loading, setLoading] = useState(false)

  // Dados mockados para demonstração
  useEffect(() => {
    // Simulando dados iniciais
    setWeightRecords([
      { id: '1', weight: 75.5, date: '2024-01-01', notes: 'Peso inicial' },
      { id: '2', weight: 74.8, date: '2024-01-08', notes: 'Primeira semana' },
      { id: '3', weight: 74.2, date: '2024-01-15', notes: 'Progresso bom' },
      { id: '4', weight: 73.5, date: '2024-01-22', notes: 'Continuando' },
      { id: '5', weight: 72.8, date: '2024-01-29', notes: 'Ótimo progresso' },
    ])
    
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
  }, [])

  const currentWeight = weightRecords.length > 0 ? weightRecords[weightRecords.length - 1].weight : 0
  const weightLost = userProfile.initialWeight ? userProfile.initialWeight - currentWeight : 0
  const weightToGo = userProfile.targetWeight ? currentWeight - userProfile.targetWeight : 0
  const totalGoal = userProfile.initialWeight && userProfile.targetWeight ? userProfile.initialWeight - userProfile.targetWeight : 0
  const progressPercentage = totalGoal > 0 ? (weightLost / totalGoal) * 100 : 0

  const handleAddWeight = async () => {
    if (!newWeight) return
    
    setLoading(true)
    const newRecord: WeightRecord = {
      id: Date.now().toString(),
      weight: parseFloat(newWeight),
      date: new Date().toISOString().split('T')[0],
      notes: newNotes
    }
    
    setWeightRecords([...weightRecords, newRecord])
    setNewWeight('')
    setNewNotes('')
    setLoading(false)
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

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Acompanhamento de Perda de Peso
          </h1>
          <p className="text-muted-foreground">
            Acompanhe sua evolução e alcance seus objetivos de saúde
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peso Atual</CardTitle>
              <Scale className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentWeight.toFixed(1)} kg</div>
              <p className="text-xs text-muted-foreground">
                {weightLost > 0 ? `-${weightLost.toFixed(1)} kg` : 'Sem mudança'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meta</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProfile.targetWeight?.toFixed(1) || '0'} kg</div>
              <p className="text-xs text-muted-foreground">
                {weightToGo > 0 ? `${weightToGo.toFixed(1)} kg restantes` : 'Meta alcançada!'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">IMC</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bmi.toFixed(1)}</div>
              <Badge variant="secondary" className={`${bmiInfo.color} text-white`}>
                {bmiInfo.category}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progresso</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressPercentage.toFixed(0)}%</div>
              <Progress value={progressPercentage} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="chart" className="space-y-4">
          <TabsList>
            <TabsTrigger value="chart">Gráfico de Evolução</TabsTrigger>
            <TabsTrigger value="register">Registrar Peso</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="goals">Metas</TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Evolução do Peso</CardTitle>
                <CardDescription>Acompanhe seu progresso ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightRecords}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
                        formatter={(value: number) => [`${value.toFixed(1)} kg`, 'Peso']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#2563eb" 
                        strokeWidth={2}
                        dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Registrar Novo Peso</CardTitle>
                <CardDescription>Adicione seu peso atual para acompanhar sua evolução</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="Digite seu peso"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações (opcional)</Label>
                  <Input
                    id="notes"
                    placeholder="Ex: Treino intenso hoje"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddWeight} disabled={loading || !newWeight}>
                  <Plus className="w-4 h-4 mr-2" />
                  {loading ? 'Registrando...' : 'Registrar Peso'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Registros</CardTitle>
                <CardDescription>Todos os seus registros de peso</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {weightRecords.map((record) => (
                    <div key={record.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{record.weight.toFixed(1)} kg</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(record.date).toLocaleDateString('pt-BR')}
                        </div>
                        {record.notes && (
                          <div className="text-sm text-muted-foreground mt-1">{record.notes}</div>
                        )}
                      </div>
                      <div className="text-right">
                        {record.id !== weightRecords[weightRecords.length - 1]?.id && (
                          <div className="text-sm text-green-600">
                            -{(weightRecords[weightRecords.findIndex(r => r.id === record.id) - 1]?.weight - record.weight).toFixed(1)} kg
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Metas de Perda de Peso</CardTitle>
                <CardDescription>Acompanhe suas metas e progresso</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{goal.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Meta: {goal.targetWeight.toFixed(1)} kg
                          </p>
                        </div>
                        <Badge variant={goal.isActive ? 'default' : 'secondary'}>
                          {goal.isActive ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div>Início: {new Date(goal.startDate).toLocaleDateString('pt-BR')}</div>
                        <div>Término: {new Date(goal.targetDate).toLocaleDateString('pt-BR')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}