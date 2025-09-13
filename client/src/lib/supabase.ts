import { createClient } from '@supabase/supabase-js'

// For development, use the environment variables directly
// In production, these would be set as VITE_ prefixed variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://project-id.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'anon-key'

console.log('Supabase config:', { 
  url: supabaseUrl, 
  key: supabaseAnonKey?.substring(0, 20) + '...' 
})

export const supabase = createClient(supabaseUrl, supabaseAnonKey)