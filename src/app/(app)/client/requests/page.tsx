'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function RequestsPage() {
  const { data: session } = useSession()
  const [requests, setRequests] = useState<any[]>([])
  const [selectedType, setSelectedType] = useState('meal_swap')
  const [description, setDescription] = useState('')

  const requestTypes = [
    { value: 'meal_swap', label: 'Swap a Meal' },
    { value: 'routine_change', label: 'Change Routine' },
    { value: 'goal_adjust', label: 'Adjust Goal' },
  ]

  const addRequest = () => {
    if (!description) return

    const newRequest = {
      id: Date.now(),
      type: selectedType,
      description,
      status: 'pending',
      createdAt: new Date().toLocaleDateString(),
    }

    setRequests([...requests, newRequest])
    setDescription('')
  }

  return (
    <div className="min-h-screen bg-[#0B0D10] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-display font-bold text-gold mb-8">Change Requests</h1>

        {/* New Request Form */}
        <div className="card-glass p-6 mb-8">
          <h2 className="text-xl font-display font-bold text-text mb-4">Send a Request</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-muted mb-2">Request Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(201,162,75,0.18)] rounded-lg text-text focus:outline-none focus:border-gold"
              >
                {requestTypes.map((type) => (
                  <option key={type.value} value={type.value} className="bg-[#0B0D10]">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain your request..."
                className="w-full px-4 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(201,162,75,0.18)] rounded-lg text-text focus:outline-none focus:border-gold resize-none"
                rows={4}
              />
            </div>

            <button
              onClick={addRequest}
              className="w-full bg-gold text-[#0B0D10] font-medium py-2 rounded-lg hover:bg-[#E3C77E] transition-colors"
            >
              Send Request
            </button>
          </div>
        </div>

        {/* Requests List */}
        {requests.length > 0 && (
          <div className="card-glass p-6">
            <h2 className="text-xl font-display font-bold text-text mb-4">Your Requests</h2>

            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="p-4 bg-[rgba(255,255,255,0.04)] rounded-lg border border-[rgba(201,162,75,0.18)]">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-text font-medium capitalize">
                        {requestTypes.find((t) => t.value === request.type)?.label}
                      </p>
                      <p className="text-xs text-text-muted mt-1">{request.createdAt}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : request.status === 'approved'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-text-muted text-sm">{request.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {requests.length === 0 && (
          <div className="card-glass p-8 text-center">
            <p className="text-text-muted">No requests yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
