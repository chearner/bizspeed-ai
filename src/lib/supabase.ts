import { createClient } from '@supabase/supabase-js'

// Default to empty strings to prevent initialization errors
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create client with error handling
let supabase: ReturnType<typeof createClient>

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} catch (error) {
  console.error('Failed to initialize Supabase client:', error)
  // Provide a mock client to prevent app crashes
  supabase = {
    storage: {
      from: () => ({
        upload: async () => ({ error: new Error('Supabase not configured') })
      })
    }
  } as ReturnType<typeof createClient>
}

export { supabase }