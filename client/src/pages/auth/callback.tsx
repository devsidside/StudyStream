import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import OAuthRoleSelection from '@/components/auth/oauth-role-selection'

export default function AuthCallback() {
  const { user, profile, refreshProfile } = useAuth()
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Exchange code for session if needed
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error during auth callback:', error)
          window.location.href = '/?error=auth_callback_failed'
          return
        }

        if (!data.session) {
          window.location.href = '/'
          return
        }

        // Wait a moment for the auth context to update
        setTimeout(async () => {
          // Refresh profile to get latest data
          await refreshProfile()
          
          // Check if user needs to complete profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single()

          if (!profileData) {
            // Profile doesn't exist - this is a new OAuth user
            setShowRoleSelection(true)
            setLoading(false)
          } else if (!profileData.role || profileData.role === 'student' && !profileData.university) {
            // Profile exists but is incomplete
            setShowRoleSelection(true)
            setLoading(false)
          } else {
            // Profile is complete, redirect based on role
            if (profileData.role === 'vendor') {
              window.location.href = '/vendors/dashboard'
            } else {
              window.location.href = '/dashboard'
            }
          }
        }, 1000)

      } catch (error) {
        console.error('Unexpected error during auth callback:', error)
        window.location.href = '/?error=unexpected_error'
      }
    }

    handleAuthCallback()
  }, [refreshProfile])

  const handleRoleSelectionComplete = () => {
    setShowRoleSelection(false)
    // Redirect based on completed profile
    if (profile?.role === 'vendor') {
      window.location.href = '/vendors/dashboard'
    } else {
      window.location.href = '/dashboard'
    }
  }

  if (loading && !showRoleSelection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Completing authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Setting up your account...</p>
        </div>
      </div>
      
      <OAuthRoleSelection
        open={showRoleSelection}
        onOpenChange={setShowRoleSelection}
        onComplete={handleRoleSelectionComplete}
      />
    </>
  )
}