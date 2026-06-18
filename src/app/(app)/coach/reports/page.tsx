'use client'

import { useSession } from 'next-auth/react'

export default function ReportsPage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-[#0B0D10] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-display font-bold text-gold mb-8">Business Reports</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card-glass p-6">
            <p className="text-text-muted text-sm mb-2">Total Clients</p>
            <p className="text-3xl font-bold text-gold">0</p>
          </div>
          <div className="card-glass p-6">
            <p className="text-text-muted text-sm mb-2">Active This Week</p>
            <p className="text-3xl font-bold text-gold">0</p>
          </div>
          <div className="card-glass p-6">
            <p className="text-text-muted text-sm mb-2">Avg. Adherence</p>
            <p className="text-3xl font-bold text-gold">0%</p>
          </div>
          <div className="card-glass p-6">
            <p className="text-text-muted text-sm mb-2">Monthly Revenue</p>
            <p className="text-3xl font-bold text-gold">$0</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card-glass p-6">
            <h2 className="text-xl font-display font-bold text-text mb-4">Client Growth</h2>
            <div className="h-64 flex items-center justify-center text-text-muted">
              No data yet
            </div>
          </div>

          <div className="card-glass p-6">
            <h2 className="text-xl font-display font-bold text-text mb-4">Revenue Trend</h2>
            <div className="h-64 flex items-center justify-center text-text-muted">
              No data yet
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="card-glass p-6">
          <h2 className="text-xl font-display font-bold text-text mb-4">Client Performance</h2>
          <div className="text-center py-8 text-text-muted">
            <p>No clients to display</p>
          </div>
        </div>
      </div>
    </div>
  )
}
