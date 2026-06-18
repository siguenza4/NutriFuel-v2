'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function ClientsPage() {
  const { data: session } = useSession()
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ email: '', name: '', calories: '2000', protein: '150' })

  useEffect(() => {
    if (session) {
      fetchClients()
    }
  }, [session])

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients')
      if (res.ok) {
        const data = await res.json()
        setClients(data)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const addClient = async () => {
    if (!formData.email || !formData.name) return

    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
        }),
      })

      if (res.ok) {
        const newClient = await res.json()
        setClients([...clients, newClient])
        setFormData({ email: '', name: '', calories: '2000', protein: '150' })
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error adding client:', error)
    }
  }

  const deleteClient = async (id: string) => {
    // TODO: Add DELETE endpoint for clients
    setClients(clients.filter((c) => c.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#0B0D10] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold text-gold">My Clients</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-gold text-[#0B0D10] font-medium rounded-lg hover:bg-[#E3C77E] transition-colors"
          >
            + Add Client
          </button>
        </div>

        {/* Add Client Form */}
        {showForm && (
          <div className="card-glass p-6 mb-8">
            <h2 className="text-xl font-display font-bold text-text mb-4">Add New Client</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-text-muted mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="client@example.com"
                  className="w-full px-4 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(201,162,75,0.18)] rounded-lg text-text focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(201,162,75,0.18)] rounded-lg text-text focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-2">Calorie Goal</label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  placeholder="2000"
                  className="w-full px-4 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(201,162,75,0.18)] rounded-lg text-text focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-2">Protein Goal (g)</label>
                <input
                  type="number"
                  value={formData.protein}
                  onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                  placeholder="150"
                  className="w-full px-4 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(201,162,75,0.18)] rounded-lg text-text focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={addClient}
                className="flex-1 bg-gold text-[#0B0D10] font-medium py-2 rounded-lg hover:bg-[#E3C77E] transition-colors"
              >
                Create Client
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-[rgba(255,255,255,0.04)] text-text font-medium py-2 rounded-lg hover:bg-[rgba(255,255,255,0.08)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Clients Table */}
        {clients.length > 0 ? (
          <div className="card-glass overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-[rgba(201,162,75,0.18)]">
                <tr>
                  <th className="text-left p-4 text-text-muted text-sm font-medium">Name</th>
                  <th className="text-left p-4 text-text-muted text-sm font-medium">Email</th>
                  <th className="text-left p-4 text-text-muted text-sm font-medium">Cal Goal</th>
                  <th className="text-left p-4 text-text-muted text-sm font-medium">Protein Goal</th>
                  <th className="text-left p-4 text-text-muted text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b border-[rgba(201,162,75,0.1)] hover:bg-[rgba(255,255,255,0.04)] transition-colors">
                    <td className="p-4 text-text font-medium">{client.name}</td>
                    <td className="p-4 text-text-muted text-sm">{client.email}</td>
                    <td className="p-4 text-text">{client.calories}</td>
                    <td className="p-4 text-text">{client.protein}g</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/coach/clients/${client.id}`}
                          className="px-3 py-1 text-sm bg-gold/20 text-gold rounded hover:bg-gold/30 transition-colors"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => deleteClient(client.id)}
                          className="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card-glass p-8 text-center">
            <p className="text-text-muted mb-4">No clients yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-gold text-[#0B0D10] font-medium rounded-lg hover:bg-[#E3C77E] transition-colors"
            >
              Add Your First Client
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
