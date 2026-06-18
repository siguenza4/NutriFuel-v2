'use client'

interface MacroRingsProps {
  calories: { current: number; goal: number }
  protein: { current: number; goal: number }
  carbs: { current: number; goal: number }
  fat: { current: number; goal: number }
}

export function MacroRings({ calories, protein, carbs, fat }: MacroRingsProps) {
  const rings = [
    { label: 'Calories', color: '#C9A24B', current: calories.current, goal: calories.goal },
    { label: 'Protein', color: '#E07A5F', current: protein.current, goal: protein.goal },
    { label: 'Carbs', color: '#81B29A', current: carbs.current, goal: carbs.goal },
    { label: 'Fat', color: '#6C9BD1', current: fat.current, goal: fat.goal },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {rings.map((ring) => {
        const percentage = Math.min((ring.current / ring.goal) * 100, 100)
        const circumference = 2 * Math.PI * 45
        const strokeDashoffset = circumference - (percentage / 100) * circumference

        return (
          <div key={ring.label} className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                {/* Background ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke="rgba(201,162,75,0.1)"
                  strokeWidth="8"
                />
                {/* Progress ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke={ring.color}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-white">{Math.round(percentage)}%</p>
                <p className="text-xs text-text-muted">{ring.current} g</p>
              </div>
            </div>
            <p className="text-center font-medium text-text">{ring.label}</p>
            <p className="text-center text-sm text-text-muted">Goal: {ring.goal}g</p>
          </div>
        )
      })}
    </div>
  )
}
