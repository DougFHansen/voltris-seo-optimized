import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Rate limiting para prevenir enumeração de usuários
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // 5 tentativas por minuto por IP

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now >= entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
        return true;
    }
    if (entry.count >= RATE_LIMIT) return false;
    entry.count++;
    return true;
}

export async function POST(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

    if (!checkRateLimit(ip)) {
        // Delay para dificultar brute force
        await new Promise(r => setTimeout(r, 1000));
        return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }

    try {
        const { username } = await request.json();

        if (!username || typeof username !== 'string' || username.length > 50) {
            return NextResponse.json({ error: 'Username required' }, { status: 400 });
        }

        // Sanitizar username
        const sanitized = username.trim().replace(/[^a-zA-Z0-9_.-]/g, '');
        if (!sanitized) {
            return NextResponse.json({ error: 'Username inválido' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data, error } = await supabase
            .from('profiles')
            .select('email')
            .eq('login', sanitized)
            .single();

        // Resposta genérica para não revelar se usuário existe ou não
        if (error || !data) {
            // Delay constante para evitar timing attacks
            await new Promise(r => setTimeout(r, 300));
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        await new Promise(r => setTimeout(r, 300));
        return NextResponse.json({ email: data.email });
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
