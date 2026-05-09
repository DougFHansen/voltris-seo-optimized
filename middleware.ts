import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
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

    // ============================================================
    // CANONICALIZAÇÃO GLOBAL ÚNICA - ENTERPRISE-GRADE
    // Responsabilidade única: middleware.ts (next.config.js não faz canonicalização)
    //
    // Regras:
    // 1. http:// → https:// (exceto localhost)
    // 2. voltris.com.br → www.voltris.com.br
    // 3. Apenas 1 hop até URL final (sem chains)
    // 4. Status 301 permanente para SEO
    // 5. Preserva porta customizada (usando url.host ao invés de url.hostname)
    // ============================================================

    const protocol = request.nextUrl.protocol;
    const hostname = request.nextUrl.hostname;

    // Verifica se é localhost - não forçar HTTPS (desenvolvimento)
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';

    // Verifica se precisa de redirect (única verificação)
    const needsProtocolRedirect = protocol === 'http:' && !isLocalhost;
    const needsHostnameRedirect = hostname === 'voltris.com.br';

    if (needsProtocolRedirect || needsHostnameRedirect) {
        const url = request.nextUrl.clone();

        // Força HTTPS (apenas se não for localhost)
        if (!isLocalhost) {
            url.protocol = 'https:';
        }

        // Força WWW (usando host para preservar porta customizada)
        if (hostname === 'voltris.com.br') {
            url.host = 'www.voltris.com.br';
        }

        // Status 301 permanente para SEO - apenas 1 hop
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

    // CORREÇÃO: Early return se não tiver credenciais Supabase
    if (!supabaseUrl || !supabaseAnonKey) {
        return response
    }

    const protectedRoutes = ['/dashboard', '/restricted-area-admin']
    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    )

    // CORREÇÃO: Early return se não for rota protegida e não tiver cookies de sessão
    // Evita criação desnecessária de Supabase client para usuários anônimos em rotas públicas
    const hasAuthCookie = request.cookies.getAll().some(c => c.name.includes('supabase') || c.name.includes('sb-'));

    if (!isProtectedRoute && !hasAuthCookie) {
        return response
    }

    // Apenas cria Supabase client se necessário (rota protegida ou tem cookie de sessão)
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

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf)$).*)',
    ],
}
