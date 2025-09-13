import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Use default values if environment variables are not set
const defaultUrl = supabaseUrl || 'https://placeholder.supabase.co'
const defaultKey = supabaseAnonKey || 'placeholder-key'

export const supabase = createClient(defaultUrl, defaultKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})