'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function ProgressPage() {
  const { data: session } = useSession()
  const [weightEntries, setWeightEntries] = useState<any[]>([])
  const [newWeight, setNewWeight] = useState('')
  const [loading, setLoading] = useState(true)
  const [photos, setPhotos] = useState<{ id: number; url: string; caption: string; date: string }[]>([])

  useEffect(() => {
    if (session) {
      fetchWeights()
    }
  }, [session])

  const fetchWeights = async () => {
    try {
      const res = await fetch('/api/weight')
      if (res.ok) {
        const data = await res.json()
        setWeightEntries(data)
      }
    } catch (error) {
      console.error('Error fetching weights:', error)
    } finally {
      setLoading(false)
    }
  }

  const addWeight = async () => {
    if (!newWeight) return
    try {
      const res = await fetch('/api/weight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight: parseFloat(newWeight) }),
      })
      if (res.ok) {
        const entry = await res.json()
        setWeightEntries([entry, ...weightEntries])
        setNewWeight('')
      }
    } catch (error) {
      console.error('Error adding weight:', error)
    }
  }

  const addPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const photo = {
        id: Date.now(),
        url: event.target?.result as string,
        caption: '',
        date: new Date().toLocaleDateString(),
      }
      setPhotos([...photos, photo])
    }
    reader.readAsDataURL(file)
  }

  const removePhoto = (id: number) => {
    setPhotos(photos.filter((p) => p.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#0B0D10] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-display font-bold text-gold mb-8">My Progress</h1>

        {/* Weight Tracking */}
        <div className="card-glass p-6 mb-8">
          <h2 className="text-xl font-display font-bold text-text mb-4">Weight Tracking</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-text-muted mb-2">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="70.5"
                className="w-full px-4 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(201,162,75,0.18)] rounded-lg text-text focus:outline-none focus:border-gold"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={addWeight}
                className="w-full bg-gold text-[#0B0D10] font-medium py-2 rounded-lg hover:bg-[#E3C77E] transition-colors"
              >
                Log Weight
              </button>
            </div>
          </div>

          {weightEntries.length > 0 && (
            <div className="space-y-2">
              {[...weightEntries].reverse().map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.04)] rounded-lg">
                  <p className="text-text-muted text-sm">{entry.date}</p>
                  <p className="text-gold font-bold text-lg">{entry.weight} kg</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Progress Photos */}
        <div className="card-glass p-6">
          <h2 className="text-xl font-display font-bold text-text mb-4">Progress Photos</h2>

          <div className="mb-6">
            <label className="block text-sm text-text-muted mb-2">Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={addPhoto}
              className="block w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gold file:text-[#0B0D10] hover:file:bg-[#E3C77E]"
            />
          </div>

          {photos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img src={photo.url} alt="Progress" className="w-full h-64 object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-xs text-text-muted mt-2">{photo.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
