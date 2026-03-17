'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth.store'

const navItems = [
  { href: '/counter', label: 'My Counter', icon: '🖥️', roles: ['AGENT', 'SUPERVISOR', 'ADMIN'] },
  { href: '/reception', label: 'Issue Ticket', icon: '🎫', roles: ['RECEPTION', 'SUPERVISOR', 'ADMIN'] },
  { href: '/supervisor', label: 'Live Dashboard', icon: '📊', roles: ['SUPERVISOR', 'ADMIN'] },
  { href: '/reports', label: 'Reports', icon: '📈', roles: ['SUPERVISOR', 'ADMIN'] },
  { href: '/admin/branches', label: 'Branches', icon: '🏢', roles: ['ADMIN'] },
  { href: '/admin/services', label: 'Services', icon: '⚙️', roles: ['ADMIN'] },
  { href: '/admin/counters', label: 'Counters', icon: '🔢', roles: ['ADMIN'] },
  { href: '/admin/users', label: 'Users', icon: '👥', roles: ['ADMIN'] },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loadUser, logout } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    loadUser().then(() => {
      if (!useAuthStore.getState().user) router.push('/login')
    })
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  const visibleNav = navItems.filter(n => n.roles.includes(user.role))

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-blue-900 text-white flex flex-col">
        <div className="p-5 border-b border-blue-800">
          <div className="text-xl font-bold">🎫 Ticket Man</div>
          <div className="text-blue-300 text-xs mt-1">{user.branch?.name || 'No Branch'}</div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {visibleNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                pathname === item.href
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-800">
          <div className="text-sm font-medium">{user.firstName} {user.lastName}</div>
          <div className="text-blue-300 text-xs mb-3">{user.role}</div>
          <button
            onClick={logout}
            className="w-full text-sm bg-blue-800 hover:bg-blue-700 text-blue-200 py-2 rounded-lg transition"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
