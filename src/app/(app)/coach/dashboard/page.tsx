'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function CoachDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0D10]">
        <p className="text-gold">Loading...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0B0D10]">
      {/* Header */}
      <header className="bg-[#0B0D10] border-b border-[rgba(201,162,75,0.18)] sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-gold">NutriFuel Coach</h1>
          <div className="flex items-center gap-4">
            <span className="text-text-muted">{session.user?.email}</span>
            <button
              onClick={() => signOut({ redirect: true })}
              className="px-4 py-2 bg-[rgba(201,162,75,0.18)] hover:bg-[rgba(201,162,75,0.3)] text-gold rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Clients Card */}
          <Link
            href="/coach/clients"
            className="card-glass p-6 hover:bg-[rgba(255,255,255,0.06)] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold text-text">Clients</h2>
              <div className="text-4xl">👥</div>
            </div>
            <p className="text-text-muted">Manage your clients and track progress</p>
          </Link>

          {/* Create Meals Card */}
          <Link
            href="/coach/meals"
            className="card-glass p-6 hover:bg-[rgba(255,255,255,0.06)] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold text-text">Meals</h2>
              <div className="text-4xl">🍽️</div>
            </div>
            <p className="text-text-muted">Create custom meal plans</p>
          </Link>

          {/* Reports Card */}
          <Link
            href="/coach/reports"
            className="card-glass p-6 hover:bg-[rgba(255,255,255,0.06)] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold text-text">Reports</h2>
              <div className="text-4xl">📊</div>
            </div>
            <p className="text-text-muted">View business metrics and analytics</p>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <h2 className="text-2xl font-display font-bold text-gold mb-6">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card-glass p-6">
              <p className="text-text-muted text-sm">Total Clients</p>
              <p className="text-3xl font-bold text-gold mt-2">0</p>
            </div>
            <div className="card-glass p-6">
              <p className="text-text-muted text-sm">Active This Week</p>
              <p className="text-3xl font-bold text-gold mt-2">0</p>
            </div>
            <div className="card-glass p-6">
              <p className="text-text-muted text-sm">Avg. Adherence</p>
              <p className="text-3xl font-bold text-gold mt-2">0%</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
