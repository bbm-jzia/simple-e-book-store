// Supabase client setup
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ejrczxskptcmnkcjpsqe.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqcmN6eHNrcHRjbW5rY2pwc3FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MzY4MDcsImV4cCI6MjA3NzQxMjgwN30.83WjSTYR6pQgv-4t9B1vBreGt2ACI1cS3XudUIVyT2E',
  {
    global: {
      headers: {
        'x-webapp-id': '6913cc492fc93bbd8d7e13c7'
      }
    }
  }
)

// Helper functions for password hashing and token generation
// In a real app, use a proper crypto library
async function hashPassword(password) {
  // This is a simplified version - in production use bcrypt or similar
  return `hashed_${password}`;
}

async function verifyPassword(password, hash) {
  // This is a simplified version - in production use bcrypt or similar
  return hash === `hashed_${password}`;
}

function generateToken() {
  // This is a simplified version - in production use a proper token library
  return `token_${Math.random().toString(36).substring(2, 15)}`;
}

// Authentication helpers
export const authHelpers = {
  async signUp(email, password, name) {
    const passwordHash = await hashPassword(password)
    const { data, error } = await supabase
      .from('webapp_users')
      .insert({ 
        webapp_id: '6913cc492fc93bbd8d7e13c7',
        email, 
        password_hash: passwordHash, 
        name 
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async signIn(email, password) {
    const { data: user, error } = await supabase
      .from('webapp_users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) throw new Error('User not found')
    
    const isValid = await verifyPassword(password, user.password_hash)
    if (!isValid) throw new Error('Invalid password')
    
    // Create session
    const token = generateToken()
    await supabase
      .from('webapp_sessions')
      .insert({ 
        webapp_id: '6913cc492fc93bbd8d7e13c7',
        user_id: user.id, 
        token, 
        expires_at: new Date(Date.now() + 7*24*60*60*1000) 
      })
    
    return { user, token }
  },

  async signOut(token) {
    await supabase
      .from('webapp_sessions')
      .delete()
      .eq('token', token)
  },

  async getCurrentUser(token) {
    const { data: session, error } = await supabase
      .from('webapp_sessions')
      .select('user_id')
      .eq('token', token)
      .single()
    
    if (error) return null
    
    const { data: user } = await supabase
      .from('webapp_users')
      .select('*')
      .eq('id', session.user_id)
      .single()
    
    return user
  }
}