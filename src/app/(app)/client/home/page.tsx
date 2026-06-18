'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function ClientHome() {
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
          <h1 className="text-2xl font-display font-bold text-gold">NutriFuel</h1>
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
        <div className="mb-12">
          <h2 className="text-3xl font-display font-bold text-text mb-2">
            Welcome back!
          </h2>
          <p className="text-text-muted">Track your nutrition and workouts</p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Meals Card */}
          <Link
            href="/client/meals"
            className="card-glass p-6 hover:bg-[rgba(255,255,255,0.06)] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-display font-bold text-text">Today's Meals</h3>
              <div className="text-4xl">🍽️</div>
            </div>
            <p className="text-text-muted">Log your meals and track macros</p>
          </Link>

          {/* Routines Card */}
          <Link
            href="/client/routines"
            className="card-glass p-6 hover:bg-[rgba(255,255,255,0.06)] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-display font-bold text-text">Workouts</h3>
              <div className="text-4xl">💪</div>
            </div>
            <p className="text-text-muted">Track your training progress</p>
          </Link>

          {/* Progress Card */}
          <Link
            href="/client/progress"
            className="card-glass p-6 hover:bg-[rgba(255,255,255,0.06)] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-display font-bold text-text">Progress</h3>
              <div className="text-4xl">📈</div>
            </div>
            <p className="text-text-muted">View your results and metrics</p>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <h2 className="text-2xl font-display font-bold text-gold mb-6">Today's Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card-glass p-6">
              <p className="text-text-muted text-sm">Calories</p>
              <p className="text-4xl font-bold text-gold mt-2">0 / 2000</p>
              <div className="mt-4 h-2 bg-[rgba(201,162,75,0.1)] rounded-full overflow-hidden">
                <div className="h-full bg-gold w-0"></div>
              </div>
            </div>
            <div className="card-glass p-6">
              <p className="text-text-muted text-sm">Workouts</p>
              <p className="text-4xl font-bold text-gold mt-2">0 / 1</p>
              <div className="mt-4 h-2 bg-[rgba(201,162,75,0.1)] rounded-full overflow-hidden">
                <div className="h-full bg-gold w-0"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
