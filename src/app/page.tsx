"use client"

import dynamic from 'next/dynamic'

// Dynamically import the WeightTracker component with SSR disabled
const WeightTrackerWithSupabase = dynamic(() => import('@/components/WeightTrackerWithSupabase'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-3 py-4 md:px-6 md:py-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    </div>
  )
})

export default function Home() {
  return <WeightTrackerWithSupabase userId="user-123" />
}