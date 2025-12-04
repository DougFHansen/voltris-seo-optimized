import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const supabase = await createClient()

  await supabase.auth.signOut()

  // Redirect to the login page after signing out
  return NextResponse.redirect(`${requestUrl.origin}/login`, {
    status: 301,
  })
} 