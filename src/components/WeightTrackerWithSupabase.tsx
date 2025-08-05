"use client"

import { useState } from 'react'
import { useSupabaseWeightTracker } from '@/hooks/useSupabaseWeightTracker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Scale, Target, TrendingDown } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface WeightTrackerWithSupabaseProps {
  userId: string
}

export default function WeightTrackerWithSupabase({ userId }: WeightTrackerWithSupabaseProps) {
  const { 
    weightRecords, 
    userProfile, 
    loading, 
    error, 
    addWeightRecord, 
    updateUserProfile 
  } = useSupabaseWeightTracker(userId)

  const [newWeight, setNewWeight] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleAddWeight = async () => {
    if (!newWeight) return

    setSubmitting(true)
    try {
      await addWeightRecord(parseFloat(newWeight), newNotes)
      setNewWeight('')
      setNewNotes('')
    } catch (err) {
      console.error('Erro ao adicionar peso:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando seus dados...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Erro: {error}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  const currentWeight = weightRecords.length > 0 ? weightRecords[weightRecords.length - 1].weight : 0
  const initialWeight = userProfile?.initial_weight || 0
  const targetWeight = userProfile?.target_weight || 0
  const weightLost = initialWeight - currentWeight
  const weightToGo = currentWeight - targetWeight

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Scale className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Peso Atual</p>
                <p className="text-2xl font-bold">{currentWeight.toFixed(1)} kg</p>
                {weightLost > 0 && (
                  <p className="text-sm text-green-600">-{weightLost.toFixed(1)} kg</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Meta</p>
                <p className="text-2xl font-bold">{targetWeight.toFixed(1)} kg</p>
                {weightToGo > 0 && (
                  <p className="text-sm text-orange-600">{weightToGo.toFixed(1)} kg restantes</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Registros</p>
                <p className="text-2xl font-bold">{weightRecords.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução do Peso</CardTitle>
            <CardDescription>Seu progresso ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightRecords}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
                    formatter={(value: number) => [`${value.toFixed(1)} kg`, 'Peso']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Adicionar Peso */}
        <Card>
          <CardHeader>
            <CardTitle>Novo Registro</CardTitle>
            <CardDescription>Adicione seu peso atual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="Ex: 70.5"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Input
                id="notes"
                placeholder="Ex: Após treino, manhã, etc."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
              />
            </div>
            <Button
              onClick={handleAddWeight}
              disabled={submitting || !newWeight}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              {submitting ? 'Registrando...' : 'Registrar Peso'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Histórico */}
      {weightRecords.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Histórico</CardTitle>
            <CardDescription>Seus últimos registros</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {weightRecords.slice().reverse().map((record, index) => {
                const previousRecord = weightRecords[weightRecords.findIndex(r => r.id === record.id) - 1]
                const weightDiff = previousRecord ? previousRecord.weight - record.weight : 0

                return (
                  <div key={record.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{record.weight.toFixed(1)} kg</span>
                        {weightDiff !== 0 && (
                          <span className={`text-sm px-2 py-1 rounded ${
                            weightDiff > 0 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {weightDiff > 0 ? '-' : '+'}{Math.abs(weightDiff).toFixed(1)} kg
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString('pt-BR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short'
                        })}
                      </div>
                      {record.notes && (
                        <div className="text-sm text-muted-foreground italic">{record.notes}</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}