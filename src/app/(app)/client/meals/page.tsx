'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { MacroRings } from '@/components/MacroRings'

const FOOD_DB = [
  { id: 1, name: 'Chicken Breast (Cooked)', kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: 2, name: 'Rice (Cooked)', kcal: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { id: 3, name: 'Eggs', kcal: 155, protein: 13, carbs: 1.1, fat: 11 },
  { id: 4, name: 'Salmon', kcal: 208, protein: 20, carbs: 0, fat: 13 },
  { id: 5, name: 'Broccoli', kcal: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { id: 6, name: 'Banana', kcal: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { id: 7, name: 'Almonds', kcal: 579, protein: 21, carbs: 22, fat: 50 },
  { id: 8, name: 'Oats', kcal: 389, protein: 17, carbs: 66, fat: 6.9 },
]

export default function MealsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [goals, setGoals] = useState({ calories: 2000, protein: 150, carbs: 200, fat: 65 })
  const [meals, setMeals] = useState<any[]>([])
  const [selectedFood, setSelectedFood] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('g')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div className="text-gold">Loading...</div>
  }

  const calculateMacros = () => {
    if (!selectedFood || !quantity) return null
    const food = FOOD_DB.find((f) => f.id === parseInt(selectedFood))
    if (!food) return null

    const grams = unit === 'g' ? parseFloat(quantity) : parseFloat(quantity) * 28.35
    const factor = grams / 100

    return {
      name: food.name,
      calories: food.kcal * factor,
      protein: food.protein * factor,
      carbs: food.carbs * factor,
      fat: food.fat * factor,
    }
  }

  const addMeal = () => {
    const macros = calculateMacros()
    if (!macros) return

    const newMeal = {
      id: Date.now(),
      ...macros,
      quantity,
      unit,
    }

    setMeals([...meals, newMeal])
    setSelectedFood('')
    setQuantity('')
  }

  const removeMeal = (id: number) => {
    setMeals(meals.filter((m) => m.id !== id))
  }

  const totalMacros = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  return (
    <div className="min-h-screen bg-[#0B0D10] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-display font-bold text-gold mb-8">Meal Tracker</h1>

        {/* Macro Rings */}
        <div className="mb-12">
          <h2 className="text-xl font-display font-bold text-text mb-8">Today's Progress</h2>
          <MacroRings
            calories={{ current: Math.round(totalMacros.calories), goal: goals.calories }}
            protein={{ current: Math.round(totalMacros.protein), goal: goals.protein }}
            carbs={{ current: Math.round(totalMacros.carbs), goal: goals.carbs }}
            fat={{ current: Math.round(totalMacros.fat), goal: goals.fat }}
          />
        </div>

        {/* Add Meal Section */}
        <div className="card-glass p-6 mb-8">
          <h2 className="text-xl font-display font-bold text-text mb-4">Add Meal</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-text-muted mb-2">Food</label>
              <select
                value={selectedFood}
                onChange={(e) => setSelectedFood(e.target.value)}
                className="w-full px-4 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(201,162,75,0.18)] rounded-lg text-text focus:outline-none focus:border-gold"
              >
                <option value="">Select food...</option>
                {FOOD_DB.map((food) => (
                  <option key={food.id} value={food.id} className="bg-[#0B0D10]">
                    {food.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-2">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="100"
                className="w-full px-4 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(201,162,75,0.18)] rounded-lg text-text focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-2">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-4 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(201,162,75,0.18)] rounded-lg text-text focus:outline-none focus:border-gold"
              >
                <option value="g">Grams (g)</option>
                <option value="oz">Ounces (oz)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={addMeal}
                className="w-full bg-gold text-[#0B0D10] font-medium py-2 rounded-lg hover:bg-[#E3C77E] transition-colors"
              >
                Add Meal
              </button>
            </div>
          </div>

          {/* Preview */}
          {calculateMacros() && (
            <div className="mt-4 p-4 bg-[rgba(201,162,75,0.1)] rounded-lg border border-[rgba(201,162,75,0.2)]">
              <p className="text-sm text-text-muted mb-2">Preview:</p>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-text-muted">Calories</p>
                  <p className="text-gold font-bold">{Math.round(calculateMacros()!.calories)}</p>
                </div>
                <div>
                  <p className="text-text-muted">Protein</p>
                  <p className="text-[#E07A5F] font-bold">{Math.round(calculateMacros()!.protein)}g</p>
                </div>
                <div>
                  <p className="text-text-muted">Carbs</p>
                  <p className="text-[#81B29A] font-bold">{Math.round(calculateMacros()!.carbs)}g</p>
                </div>
                <div>
                  <p className="text-text-muted">Fat</p>
                  <p className="text-[#6C9BD1] font-bold">{Math.round(calculateMacros()!.fat)}g</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Meals List */}
        {meals.length > 0 && (
          <div className="card-glass p-6">
            <h2 className="text-xl font-display font-bold text-text mb-4">Today's Meals</h2>
            <div className="space-y-2">
              {meals.map((meal) => (
                <div key={meal.id} className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.04)] rounded-lg">
                  <div className="flex-1">
                    <p className="text-text font-medium">{meal.name}</p>
                    <p className="text-sm text-text-muted">
                      {meal.quantity} {meal.unit}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 mr-4">
                    <div className="text-sm">
                      <p className="text-text-muted">Cal</p>
                      <p className="text-gold font-bold">{Math.round(meal.calories)}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-text-muted">P</p>
                      <p className="text-[#E07A5F] font-bold">{Math.round(meal.protein)}g</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-text-muted">C</p>
                      <p className="text-[#81B29A] font-bold">{Math.round(meal.carbs)}g</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-text-muted">F</p>
                      <p className="text-[#6C9BD1] font-bold">{Math.round(meal.fat)}g</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeMeal(meal.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
