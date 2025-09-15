import { createClient } from '@supabase/supabase-js'

// Use environment variables from Replit secrets
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Missing Supabase environment variables, using fallback values')
}

// Server-side Supabase client - will use anon key if service key not available
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseServiceKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Profile-related types
export interface Profile {
  id: string
  email: string
  first_name?: string
  last_name?: string
  role: 'student' | 'vendor' | 'admin'
  profile_image_url?: string
  university?: string
  course?: string
  year?: string
  business_type?: string
  business_name?: string
  created_at: string
  updated_at: string
}

// Profile management functions
export const profileService = {
  // Get profile by user ID
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Error in getProfile:', error)
      return null
    }
  },

  // Create a new profile
  async createProfile(profileData: Omit<Profile, 'created_at' | 'updated_at'>): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single()
      
      if (error) {
        console.error('Error creating profile:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Error in createProfile:', error)
      return null
    }
  },

  // Update existing profile
  async updateProfile(userId: string, updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      
      if (error) {
        console.error('Error updating profile:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Error in updateProfile:', error)
      return null
    }
  },

  // Check if profile exists
  async profileExists(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single()
      
      return !error && !!data
    } catch (error) {
      return false
    }
  }
}