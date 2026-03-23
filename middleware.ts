import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
}

export async function middleware(request: NextRequest) {
    let response = NextResponse.next()

    // Aplicar headers de segurança em todas as respostas
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value)
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

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
                    response = NextResponse.next({ request })
                    response.cookies.set({ name, value, ...options })
                    // Reaplicar headers após criar nova response
                    Object.entries(SECURITY_HEADERS).forEach(([k, v]) => {
                        response.headers.set(k, v)
                    })
                },
                remove: (name: string, options: CookieOptions) => {
                    request.cookies.set({ name, value: '', ...options })
                    response = NextResponse.next({ request })
                    response.cookies.set({ name, value: '', ...options })
                    Object.entries(SECURITY_HEADERS).forEach(([k, v]) => {
                        response.headers.set(k, v)
                    })
                },
            },
        }
    )

    // SEGURO: getUser() valida o token no servidor, getSession() não valida
    const { data: { user } } = await supabase.auth.getUser()

    const protectedRoutes = ['/dashboard', '/restricted-area-admin']
    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    )

    if (isProtectedRoute && !user) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('next', request.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf)$).*)',
    ],
}
