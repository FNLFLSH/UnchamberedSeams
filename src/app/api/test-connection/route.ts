import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test the connection by trying to fetch categories
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .limit(1)

    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          message: 'Database connection failed. Make sure you ran the SQL migration.'
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful!',
      data: data
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Connection test failed',
        message: 'Check your environment variables and database setup.'
      },
      { status: 500 }
    )
  }
} 