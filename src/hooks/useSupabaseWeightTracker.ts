import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface WeightRecord {
  id: string
  weight: number
  date: string
  notes?: string
  user_id: string
  created_at: string
}

interface UserProfile {
  id: string
  height?: number
  initial_weight?: number
  target_weight?: number
  user_id: string
}

export function useSupabaseWeightTracker(userId: string) {
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar registros de peso
  const fetchWeightRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('weight_records')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true })

      if (error) throw error
      setWeightRecords(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar registros')
    }
  }

  // Buscar perfil do usuário
  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_weight_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setUserProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar perfil')
    }
  }

  // Adicionar novo registro de peso
  const addWeightRecord = async (weight: number, notes?: string) => {
    try {
      const { data, error } = await supabase
        .from('weight_records')
        .insert([
          {
            user_id: userId,
            weight,
            notes,
            date: new Date().toISOString().split('T')[0]
          }
        ])
        .select()
        .single()

      if (error) throw error
      
      setWeightRecords(prev => [...prev, data])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar registro')
      throw err
    }
  }

  // Atualizar perfil do usuário
  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    try {
      const { data, error } = await supabase
        .from('user_weight_profiles')
        .upsert([
          {
            user_id: userId,
            ...profile
          }
        ])
        .select()
        .single()

      if (error) throw error
      
      setUserProfile(data)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil')
      throw err
    }
  }

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        fetchWeightRecords(),
        fetchUserProfile()
      ])
      setLoading(false)
    }

    if (userId) {
      loadData()
    }
  }, [userId])

  return {
    weightRecords,
    userProfile,
    loading,
    error,
    addWeightRecord,
    updateUserProfile,
    refetch: () => {
      fetchWeightRecords()
      fetchUserProfile()
    }
  }
}