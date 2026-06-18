'use client'

import { useSession } from 'next-auth/react'

export default function RoutinesPage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-[#0B0D10] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-display font-bold text-gold mb-8">My Workouts</h1>

        <div className="card-glass p-8 text-center">
          <p className="text-text-muted mb-4">No routines assigned yet</p>
          <p className="text-sm text-text-muted">Your coach will assign workouts here</p>
        </div>
      </div>
    </div>
  )
}
