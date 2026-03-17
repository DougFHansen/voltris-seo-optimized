import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next()

  // Verificar se as variáveis de ambiente estão configuradas
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Se as variáveis não estiverem configuradas, apenas retornar a resposta sem autenticação
  if (!supabaseUrl || !supabaseAnonKey) {
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

  // Example: Protect the dashboard and admin routes
  const protectedRoutes = ['/dashboard', '/admin'] // Add other routes here as needed

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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public folder)
     * - api (api routes are handled independently)
     * - assets (custom static folders)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf)$).*)',
    // Excluir explicitamente rotas que não precisam de middleware de auth
    '/((?!login|register|forgot-password).*)',
    '/dashboard/:path*',
    '/admin/:path*',
  ],
}