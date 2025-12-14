'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

interface AdminAuthGuardProps {
  children: React.ReactNode
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const checkAuth = useCallback(async () => {
    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        console.error('Session error:', sessionError)
        setError('Authentication error')
        router.push('/login')
        return
      }

      if (!session || !session.user) {
        // No session, redirect to login
        router.push('/login?redirect=/admin')
        return
      }

      // Check if user has admin role (check user metadata or a custom claims)
      // For now, we'll just check if user is authenticated
      // You can add role checking here if needed:
      // const isAdmin = session.user.user_metadata?.role === 'admin'

      setUser(session.user)
      setLoading(false)
    } catch (err) {
      console.error('Auth check error:', err)
      setError('Failed to verify authentication')
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-transparent border-[#A8D5BA] rounded-full animate-spin"></div>
          <p className="text-lg text-gray-900 dark:text-white">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-2xl">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Access Denied</h2>
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Redirecting...
  }

  // User is authenticated, render children
  return <>{children}</>
}
