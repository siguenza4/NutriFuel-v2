'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0D10]">
        <p className="text-gold">Loading...</p>
      </div>
    )
  }

  const isCoach = session.user?.role === 'COACH'
  const clientNavItems = [
    { href: '/client/home', label: 'Home', icon: '🏠' },
    { href: '/client/meals', label: 'Meals', icon: '🍽️' },
    { href: '/client/routines', label: 'Workouts', icon: '💪' },
    { href: '/client/progress', label: 'Progress', icon: '📈' },
    { href: '/client/requests', label: 'Requests', icon: '📝' },
  ]

  const coachNavItems = [
    { href: '/coach/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/coach/clients', label: 'Clients', icon: '👥' },
    { href: '/coach/meals', label: 'Meals', icon: '🍽️' },
    { href: '/coach/reports', label: 'Reports', icon: '📈' },
  ]

  const navItems = isCoach ? coachNavItems : clientNavItems

  return (
    <div className="min-h-screen bg-[#0B0D10] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[rgba(255,255,255,0.02)] border-r border-[rgba(201,162,75,0.18)] p-6 sticky top-0 h-screen overflow-y-auto">
        {/* Logo */}
        <Link href={isCoach ? '/coach/dashboard' : '/client/home'} className="block mb-8">
          <h1 className="text-2xl font-display font-bold text-gold">NutriFuel</h1>
          <p className="text-xs text-text-muted mt-1">{isCoach ? 'Coach' : 'Client'}</p>
        </Link>

        {/* Navigation */}
        <nav className="space-y-2 mb-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gold/20 text-gold border border-gold/30'
                    : 'text-text-muted hover:bg-[rgba(255,255,255,0.04)] hover:text-text'
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Info + Sign Out */}
        <div className="pt-6 border-t border-[rgba(201,162,75,0.18)]">
          <p className="text-xs text-text-muted mb-3 px-4">Logged in as</p>
          <p className="text-sm text-text font-medium px-4 mb-4 truncate">{session.user?.email}</p>
          <button
            onClick={() => signOut({ redirect: true })}
            className="w-full px-4 py-2 bg-[rgba(201,162,75,0.18)] hover:bg-[rgba(201,162,75,0.3)] text-gold rounded-lg transition-colors text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
