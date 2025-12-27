'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function RedirectPage() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Wait for session to be determined
    if (status === 'loading') return

    // If not authenticated, go to login
    if (status === 'unauthenticated') {
      router.replace('/login')
      return
    }

    // If authenticated, check role and redirect
    const checkRoleAndRedirect = async () => {
      try {
        console.log('[redirect] Fetching role...')
        const res = await fetch('/api/auth/check-role')
        const data = await res.json()

        console.log('[redirect] API Response:', data)

        // Use the redirect from API response
        const redirectTo = data.redirect || '/assessment'

        console.log('[redirect] Redirecting to:', redirectTo)

        // Use replace to prevent back button issues
        router.replace(redirectTo)
      } catch (error) {
        console.error('[redirect] Error checking role:', error)
        router.replace('/assessment')
      }
    }

    checkRoleAndRedirect()
  }, [status, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 to-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Setting up your dashboard...</p>
        <p className="text-gray-400 text-sm mt-2">Please wait...</p>
      </div>
    </div>
  )
}
