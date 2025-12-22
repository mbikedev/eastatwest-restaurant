'use client'

import Link from 'next/link'
import { useTheme } from '../context/ThemeContext'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AdminNav() {
  const { theme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '🏠' },
    { href: '/admin/reservations', label: 'Reservations', icon: '📅' },
    { href: '/admin/holidays', label: 'Holidays', icon: '🎄' },
    { href: '/admin/comments', label: 'Comments', icon: '💬' },
    { href: '/admin/orders', label: 'Orders', icon: '🛒' },
  ]

  return (
    <div className={`sticky top-16 z-40 border-b transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-[#1A1A1A]/95 backdrop-blur-sm border-white/10'
        : 'bg-white/95 backdrop-blur-sm border-gray-200 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1 py-3 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? theme === 'dark'
                      ? 'bg-[#A8D5BA] text-white'
                      : 'bg-[#A8D5BA] text-white'
                    : theme === 'dark'
                      ? 'text-white/70 hover:bg-white/10 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                theme === 'dark'
                  ? 'text-white/70 hover:bg-white/10 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span>🏠</span>
              <span>View Site</span>
            </Link>
            <button
              onClick={handleSignOut}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                theme === 'dark'
                  ? 'text-white/70 hover:bg-red-500/20 hover:text-red-400'
                  : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <span>🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}
