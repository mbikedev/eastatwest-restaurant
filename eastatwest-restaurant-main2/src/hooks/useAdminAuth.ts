'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

const ALLOWED_ADMIN_EMAILS = [
  'mbagnickg@gmail.com',
  'infos.east.west@gmail.com',
  'hannamoubayed@hotmail.com'
]

export function useAdminAuth() {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      try {
        console.log('🔐 useAdminAuth: Starting auth check...')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        console.log('🔐 useAdminAuth: Session check result:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email,
          error: sessionError
        })

        if (!mounted) {
          console.log('🔐 useAdminAuth: Component unmounted, aborting')
          return
        }

        if (!session || !session.user) {
          console.log('🔐 useAdminAuth: No session found, redirecting to login')
          const redirectUrl = '/login?redirect=' + encodeURIComponent(window.location.pathname)
          console.log('🔐 useAdminAuth: Redirect URL:', redirectUrl)
          // Keep loading true to prevent rendering protected content
          router.replace(redirectUrl)
          return
        }

        // Check if user's email is in the whitelist
        const isAllowedEmail = ALLOWED_ADMIN_EMAILS.includes(session.user.email?.toLowerCase() || '')
        console.log('🔐 useAdminAuth: Email whitelist check:', {
          email: session.user.email?.toLowerCase(),
          isAllowed: isAllowedEmail
        })

        if (!isAllowedEmail) {
          console.log('🔐 useAdminAuth: User not in whitelist, signing out')
          await supabase.auth.signOut()
          // Keep loading true to prevent rendering protected content
          router.replace('/login?redirect=' + encodeURIComponent(window.location.pathname))
          return
        }

        if (mounted) {
          console.log('🔐 useAdminAuth: Authentication successful!')
          setIsAuthenticated(true)
          setLoading(false)
        }
      } catch (error) {
        console.error('🔐 useAdminAuth: Auth error:', error)
        router.replace('/login')
        // Keep loading true to prevent rendering protected content
      }
    }

    checkAuth()

    return () => {
      mounted = false
    }
  }, [router])

  return { loading, isAuthenticated }
}
