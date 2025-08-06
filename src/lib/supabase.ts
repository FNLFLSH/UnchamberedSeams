import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Product {
  id: number
  title: string
  description?: string
  price: number
  image_url?: string
  image_file?: string
  category_id: number
  category: Category
  is_staff_pick: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  email: string
  name: string
  role: string
  created_at: string
  updated_at: string
} 