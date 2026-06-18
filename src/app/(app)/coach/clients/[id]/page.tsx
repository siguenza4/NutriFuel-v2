'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'

export default function ClientDetailPage() {
  const { data: session } = useSession()
  const params = useParams()
  const clientId = params.id as string
  const [client, setClient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [meals, setMeals] = useState<any[]>([])
  const [goals, setGoals] = useState({ calories: 2000, protein: 150, carbs: 200, fat: 65 })
  const [weights, setWeights] = useState<any[]>([])

  useEffect(() => {
    if (clientId) {
      fetchClientData()
    }
  }, [clientId])

  const fetchClientData = async () => {
    try {
      // TODO: Create GET /api/clients/[id] endpoint
      // For now, fetch from the clients list
      const res = await fetch(`/api/clients`)
      if (res.ok) {
        const data = await res.json()
        const foundClient = data.find((c: any) => c.id === clientId)
        setClient(foundClient)
      }
    } catch (error) {
      console.error('Error fetching client:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-gold">Loading...</div>
  }

  if (!client) {
    return <div className="text-text-muted">Client not found</div>
  }

  return (
    <div className="min-h-screen bg-[#0B0D10] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Client Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gold mb-2">{client.name}</h1>
          <p className="text-text-muted">{client.email}</p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Overview Card */}
          <div className="card-glass p-6">
            <h2 className="text-xl font-display font-bold text-text mb-4">Overview</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Status</span>
                <span className="text-gold font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Joined</span>
                <span className="text-text">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Calorie Goal</span>
                <span className="text-text">{goals.calories}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Protein Goal</span>
                <span className="text-text">{goals.protein}g</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card-glass p-6">
            <h2 className="text-xl font-display font-bold text-text mb-4">This Week</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Days Logged</span>
                <span className="text-gold font-bold">{meals.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Weight Logs</span>
                <span className="text-gold font-bold">{weights.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Adherence</span>
                <span className="text-gold font-bold">--</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Plan</span>
                <span className="text-text">--</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="card-glass p-6 mb-8">
          <h2 className="text-xl font-display font-bold text-text mb-4">Actions</h2>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-gold/20 text-gold rounded hover:bg-gold/30 transition-colors">
              Assign Diet
            </button>
            <button className="px-4 py-2 bg-gold/20 text-gold rounded hover:bg-gold/30 transition-colors">
              Assign Routine
            </button>
            <button className="px-4 py-2 bg-gold/20 text-gold rounded hover:bg-gold/30 transition-colors">
              View Requests
            </button>
            <button className="px-4 py-2 bg-gold/20 text-gold rounded hover:bg-gold/30 transition-colors">
              Manage Subscription
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card-glass p-6">
          <h2 className="text-xl font-display font-bold text-text mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-text-muted">
            <p>No activity yet</p>
          </div>
        </div>
      </div>
    </div>
  )
}
