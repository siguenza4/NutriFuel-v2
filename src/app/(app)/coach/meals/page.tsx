'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

const FOODS = [
  { id: 1, name: 'Chicken Breast (Cooked)', kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: 2, name: 'Rice (Cooked)', kcal: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { id: 3, name: 'Eggs', kcal: 155, protein: 13, carbs: 1.1, fat: 11 },
  { id: 4, name: 'Salmon', kcal: 208, protein: 20, carbs: 0, fat: 13 },
  { id: 5, name: 'Broccoli', kcal: 34, protein: 2.8, carbs: 7, fat: 0.4 },
]

export default function MealsPage() {
  const { data: session } = useSession()
  const [meals, setMeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [mealName, setMealName] = useState('')
  const [mealItems, setMealItems] = useState<{ foodId: number; quantity: number }[]>([{ foodId: 1, quantity: 100 }])

  useEffect(() => {
    if (session) {
      fetchMeals()
    }
  }, [session])

  const fetchMeals = async () => {
    try {
      const res = await fetch('/api/meals/templates')
      if (res.ok) {
        const data = await res.json()
        setMeals(data)
      }
    } catch (error) {
      console.error('Error fetching meals:', error)
    } finally {
      setLoading(false)
    }
  }

  const addItem = () => {
    setMealItems([...mealItems, { foodId: 1, quantity: 100 }])
  }

  const removeItem = (index: number) => {
    setMealItems(mealItems.filter((_, i) => i !== index))
  }

  const calculateMealMacros = () => {
    return mealItems.reduce(
      (acc, item) => {
        const food = FOODS.find((f) => f.id === item.foodId)
        if (!food) return acc
        const factor = item.quantity / 100
        return {
          calories: acc.calories + food.kcal * factor,
          protein: acc.protein + food.protein * factor,
          carbs: acc.carbs + food.carbs * factor,
          fat: acc.fat + food.fat * factor,
        }
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    )
  }

  const saveMeal = async () => {
    if (!mealName || mealItems.length === 0) return

    try {
      const res = await fetch('/api/meals/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: mealName,
          items: mealItems,
        }),
      })

      if (res.ok) {
        const newMeal = await res.json()
        setMeals([...meals, newMeal])
        setMealName('')
        setMealItems([{ foodId: 1, quantity: 100 }])
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error saving meal:', error)
    }
  }

  const deleteMeal = (id: string) => {
    // TODO: Add DELETE endpoint for meal templates
    setMeals(meals.filter((m) => m.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#0B0D10] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold text-gold">Custom Meals</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-gold text-[#0B0D10] font-medium rounded-lg hover:bg-[#E3C77E] transition-colors"
          >
            + Create Meal
          </button>
        </div>

        {/* Create Meal Form */}
        {showForm && (
          <div className="card-glass p-6 mb-8">
            <h2 className="text-xl font-display font-bold text-text mb-4">Create Custom Meal</h2>

            <div className="mb-4">
              <label className="block text-sm text-text-muted mb-2">Meal Name</label>
              <input
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="e.g., Protein Bowl"
                className="w-full px-4 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(201,162,75,0.18)] rounded-lg text-text focus:outline-none focus:border-gold"
              />
            </div>

            {/* Meal Items */}
            <div className="mb-6">
              <p className="text-text font-medium mb-4">Add Ingredients</p>
              <div className="space-y-3 mb-4">
                {mealItems.map((item, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <select
                        value={item.foodId}
                        onChange={(e) => {
                          const newItems = [...mealItems]
                          newItems[index].foodId = parseInt(e.target.value)
                          setMealItems(newItems)
                        }}
                        className="w-full px-4 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(201,162,75,0.18)] rounded-lg text-text focus:outline-none focus:border-gold"
                      >
                        {FOODS.map((food) => (
                          <option key={food.id} value={food.id} className="bg-[#0B0D10]">
                            {food.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newItems = [...mealItems]
                          newItems[index].quantity = parseInt(e.target.value)
                          setMealItems(newItems)
                        }}
                        placeholder="100"
                        className="w-full px-4 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(201,162,75,0.18)] rounded-lg text-text focus:outline-none focus:border-gold"
                      />
                    </div>
                    {mealItems.length > 1 && (
                      <button
                        onClick={() => removeItem(index)}
                        className="px-3 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={addItem}
                className="px-4 py-2 bg-[rgba(201,162,75,0.18)] text-gold rounded hover:bg-[rgba(201,162,75,0.3)] transition-colors"
              >
                + Add Ingredient
              </button>
            </div>

            {/* Macro Preview */}
            <div className="p-4 bg-[rgba(201,162,75,0.1)] rounded-lg border border-[rgba(201,162,75,0.2)] mb-6">
              <p className="text-sm text-text-muted mb-3">Total Macros:</p>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-text-muted">Calories</p>
                  <p className="text-gold font-bold">{Math.round(calculateMealMacros().calories)}</p>
                </div>
                <div>
                  <p className="text-text-muted">Protein</p>
                  <p className="text-[#E07A5F] font-bold">{Math.round(calculateMealMacros().protein)}g</p>
                </div>
                <div>
                  <p className="text-text-muted">Carbs</p>
                  <p className="text-[#81B29A] font-bold">{Math.round(calculateMealMacros().carbs)}g</p>
                </div>
                <div>
                  <p className="text-text-muted">Fat</p>
                  <p className="text-[#6C9BD1] font-bold">{Math.round(calculateMealMacros().fat)}g</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={saveMeal}
                className="flex-1 bg-gold text-[#0B0D10] font-medium py-2 rounded-lg hover:bg-[#E3C77E] transition-colors"
              >
                Save Meal
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

        {/* Meals List */}
        {meals.length > 0 ? (
          <div className="space-y-4">
            {meals.map((meal) => (
              <div key={meal.id} className="card-glass p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-display font-bold text-text">{meal.name}</h3>
                    <p className="text-sm text-text-muted">{meal.createdAt}</p>
                  </div>
                  <button
                    onClick={() => deleteMeal(meal.id)}
                    className="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                  >
                    Delete
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-text-muted text-sm">Calories</p>
                    <p className="text-gold font-bold">{Math.round(meal.calories)}</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-sm">Protein</p>
                    <p className="text-[#E07A5F] font-bold">{Math.round(meal.protein)}g</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-sm">Carbs</p>
                    <p className="text-[#81B29A] font-bold">{Math.round(meal.carbs)}g</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-sm">Fat</p>
                    <p className="text-[#6C9BD1] font-bold">{Math.round(meal.fat)}g</p>
                  </div>
                </div>

                <div className="text-sm text-text-muted">
                  <p className="font-medium mb-2">Ingredients:</p>
                  <ul className="space-y-1">
                    {meal.items.map((item: any, idx: number) => (
                      <li key={idx}>
                        {item.foodName} - {item.quantity}g
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-glass p-8 text-center">
            <p className="text-text-muted mb-4">No custom meals yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-gold text-[#0B0D10] font-medium rounded-lg hover:bg-[#E3C77E] transition-colors"
            >
              Create Your First Meal
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
