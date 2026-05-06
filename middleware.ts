import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-DNS-Prefetch-Control': 'on',
    'Server': 'Voltris Web Network',
}

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname.toLowerCase();
    
    // BLOQUEIO SEO 410: URLs de teste nunca devem ser indexadas
    const TEST_URL_PATTERNS = [
        'indexnow-test',
        'performance-test',
    ];
    
    const isTestUrl = TEST_URL_PATTERNS.some(pattern => pathname.includes(pattern));
    if (isTestUrl) {
        return new NextResponse(null, { status: 410 });
    }

    // Redirecionamento 301: voltris.com.br → www.voltris.com.br
    const hostname = request.nextUrl.hostname;
    if (hostname === 'voltris.com.br') {
        const url = request.nextUrl.clone();
        url.hostname = 'www.voltris.com.br';
        return NextResponse.redirect(url, 301);
    }

    let response = NextResponse.next()

    // Aplicar headers de segurança em todas as respostas
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value)
    })

    // Ocultar informações de infraestrutura
    response.headers.delete('x-powered-by')
    response.headers.delete('x-vercel-id')
    response.headers.delete('x-vercel-cache')

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

    const protectedRoutes = ['/dashboard', '/restricted-area-admin']
    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    )

    // Otimização de Performance: Ignorar getUser() (API Call) se o usuário não tem cookies de sessão
    // e está acessando uma rota pública (ex: home, guias). Reduz TTFB em 100-200ms para anônimos.
    const hasAuthCookie = request.cookies.getAll().some(c => c.name.includes('supabase') || c.name.includes('sb-'));

    if (isProtectedRoute || hasAuthCookie) {
        // SEGURO: getUser() valida o token no servidor, getSession() não valida
        const { data: { user } } = await supabase.auth.getUser()

        if (isProtectedRoute) {
            if (!user) {
                const loginUrl = new URL('/login', request.url)
                loginUrl.searchParams.set('next', request.nextUrl.pathname)
                return NextResponse.redirect(loginUrl)
            }

            // SEGURANÇA EXTRA: Bloquear acesso admin no middleware se não for admin
            if (request.nextUrl.pathname.startsWith('/restricted-area-admin')) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('is_admin')
                    .eq('id', user.id)
                    .single()

                if (!profile?.is_admin) {
                    return NextResponse.redirect(new URL('/dashboard', request.url))
                }
            }
        }
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf)$).*)',
    ],
}
