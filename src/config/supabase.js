import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names
export const TABLES = {
  USER_PROFILES: 'user_profiles',
  RFPS: 'rfps',
  ACTIVITIES: 'activities',
  NOTIFICATIONS: 'notifications',
  TEAM_MEMBERS: 'team_members'
}

// Helper function to handle Supabase errors
export const handleSupabaseError = (error) => {
  console.error('Supabase Error:', error)
  return {
    success: false,
    error: error.message || 'An unexpected error occurred'
  }
}

// Helper function for successful responses
export const handleSupabaseSuccess = (data) => {
  return {
    success: true,
    data
  }
}
