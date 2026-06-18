export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-display font-bold text-gold mb-4">
          NutriFuel
        </h1>
        <p className="text-xl text-text-muted mb-8">
          Elite Nutrition & Fitness Coaching Platform
        </p>
        <div className="flex gap-4 justify-center">
          <button className="btn-primary">Login</button>
          <button className="btn-secondary">Register</button>
        </div>
      </div>
    </main>
  )
}
