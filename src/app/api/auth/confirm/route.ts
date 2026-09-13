import { type EmailOtpType } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  // Using PKCE flow, the URL will have a code instead of token_hash
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // successful login, redirect to the desired URL
      return NextResponse.redirect(new URL(`/${next.slice(1)}`, request.url))
    }
  }

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    if (!error) {
      return NextResponse.redirect(new URL(`/${next.slice(1)}`, request.url))
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(new URL('/login?error=Invalid%20or%20expired%20link', request.url))
}
