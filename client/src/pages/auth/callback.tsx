import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/services/supabase'
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

        // Refresh profile to get latest data
        await refreshProfile()
        
        // Check if user needs to complete profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single()

        if (!profileData) {
          // Profile doesn't exist - create minimal profile for OAuth user
          const { error: createError } = await supabase
            .from('profiles')
            .upsert({
              id: data.session.user.id,
              email: data.session.user.email || '',
              first_name: data.session.user.user_metadata?.first_name || 
                          data.session.user.user_metadata?.firstName || '',
              last_name: data.session.user.user_metadata?.last_name || 
                         data.session.user.user_metadata?.lastName || '',
              role: 'student' // Default role for OAuth users
            }, {
              onConflict: 'id'
            })
          
          if (createError) {
            console.error('Error creating profile:', createError)
          }
          
          // Refresh profile after creation
          await refreshProfile()
          setShowRoleSelection(true)
          setLoading(false)
        } else if (!profileData.role || (profileData.role === 'student' && !profileData.university) || (profileData.role === 'vendor' && !profileData.business_name)) {
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