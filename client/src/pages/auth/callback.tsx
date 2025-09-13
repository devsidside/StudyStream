import { useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const { user } = useAuth()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error during auth callback:', error)
        // Redirect to login page with error
        window.location.href = '/?error=auth_callback_failed'
        return
      }

      if (data.session) {
        // Successfully authenticated, redirect to dashboard
        window.location.href = '/dashboard'
      } else {
        // No session, redirect to home
        window.location.href = '/'
      }
    }

    handleAuthCallback()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}