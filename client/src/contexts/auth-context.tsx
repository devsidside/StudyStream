import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface Profile {
  id: string
  email: string
  first_name?: string
  last_name?: string
  profile_image_url?: string
  role: 'student' | 'vendor' | 'admin'
  university?: string
  course?: string
  year?: string
  business_type?: string
  business_name?: string
  created_at?: string
  updated_at?: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error?: any }>
  signIn: (email: string, password: string) => Promise<{ error?: any }>
  signOut: () => Promise<void>
  resendConfirmation: (email: string) => Promise<{ error?: any }>
  signInWithOAuth: (provider: 'google' | 'facebook') => Promise<{ error?: any }>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: any }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to fetch user profile with retry for race condition handling
  const fetchProfile = async (userId: string, retries: number = 3): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        // If no profile found and we have retries left, wait and try again
        // This handles the race condition where user signup completes before trigger runs
        if (error.code === 'PGRST116' && retries > 0) {
          console.log(`Profile not found, retrying in 500ms... (${retries} attempts left)`)
          await new Promise(resolve => setTimeout(resolve, 500))
          return fetchProfile(userId, retries - 1)
        }
        
        console.error('Error fetching profile:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  // Function to refresh profile
  const refreshProfile = async () => {
    if (!user?.id) return
    const profileData = await fetchProfile(user.id)
    setProfile(profileData)
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      // Fetch profile if user exists
      if (session?.user?.id) {
        try {
          const profileData = await fetchProfile(session.user.id)
          setProfile(profileData)
        } catch (error) {
          console.error('Error fetching profile:', error)
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
      
      setLoading(false)
    }).catch((error) => {
      console.error('Error getting session:', error)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        // Fetch profile when user changes
        if (session?.user?.id) {
          try {
            const profileData = await fetchProfile(session.user.id)
            setProfile(profileData)
          } catch (error) {
            console.error('Error fetching profile:', error)
            setProfile(null)
          }
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: metadata || {}
      }
    })
    
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const resendConfirmation = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })
    return { error }
  }

  const signInWithOAuth = async (provider: 'google' | 'facebook') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { error }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user?.id) {
      return { error: { message: 'No user found' } }
    }

    // Security: Strip protected fields that users shouldn't be able to change
    const safeUpdates = { ...updates }
    delete (safeUpdates as any).id // Prevent primary key tampering
    delete (safeUpdates as any).role // Prevent role escalation
    delete (safeUpdates as any).created_at // Prevent timestamp manipulation
    delete (safeUpdates as any).updated_at // Prevent timestamp manipulation

    // Additional validation for role changes
    if (updates.role) {
      return { error: { message: 'Role changes are not permitted via client updates' } }
    }

    // Update existing user record (trigger should have created it during signup)
    const { error } = await supabase
      .from('users')
      .update(safeUpdates)
      .eq('id', user.id)

    if (!error) {
      // Refresh profile after update
      await refreshProfile()
    }

    return { error }
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      resendConfirmation,
      signInWithOAuth,
      updateProfile,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}