import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Extract the actual URL from the environment variable (handle concatenated env vars)
const extractUrl = (rawUrl: string) => {
  if (!rawUrl) return ''
  
  // Look for https:// pattern in the string
  const urlMatch = rawUrl.match(/https:\/\/[^\s]+\.supabase\.co/)
  return urlMatch ? urlMatch[0] : rawUrl.trim()
}

const supabaseUrl = extractUrl(rawUrl)


if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  })
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})