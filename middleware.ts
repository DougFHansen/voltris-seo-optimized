import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next()

  // Verificar se as variáveis de ambiente estão configuradas
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables are not configured')
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get: (name: string) => request.cookies.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => {
          request.cookies.set({ name, value, ...options })
        },
        remove: (name: string, options: CookieOptions) => {
          request.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.getSession()

  // Example: Protect the /services route
  const protectedRoutes = ['/services'] // Add other routes here as needed

  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute && !data.session) {
    // Redirect to login page if not authenticated
    const loginUrl = new URL('/login', request.url)
    // Optional: Add a 'next' parameter to redirect back after login
    // loginUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl)
  }

  // Allow authenticated users or unprotected routes to proceed
  return response
}

export const config = {
  // Matcher for protected routes
  matcher: ['/services/:path*'], // Adjust this regex to include all protected routes
} 