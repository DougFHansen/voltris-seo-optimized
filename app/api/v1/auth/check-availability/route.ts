import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Chave administrativa usada apenas no servidor para checagens do sistema.
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Janela de 60s por IP. O teto é folgado para uso humano real (uma checagem por
// campo ao cadastrar) e derruba varredura automatizada de bases de contas.
const WINDOW_MS = 60_000;
const MAX_PER_IP = 25;
const attempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = attempts.get(ip);
    if (!entry || now >= entry.resetAt) {
        attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
        return false;
    }
    if (entry.count >= MAX_PER_IP) return true;
    entry.count += 1;
    return false;
}

export async function POST(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            || req.headers.get('x-real-ip')
            || 'local';
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { available: false, error: 'Muitas tentativas em sequência. Aguarde um instante e tente novamente.' },
                { status: 429, headers: { 'retry-after': '60' } }
            );
        }

        const { email, login, phone } = await req.json();
        const conflicts: string[] = [];

        // 1. Check Login (Username)
        if (login) {
            const { data } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('login', login)
                .maybeSingle();
            if (data) conflicts.push('usuário');
        }

        // 2. Check Email
        if (email) {
            const { data } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('email', email)
                .maybeSingle();
            if (data) conflicts.push('e-mail');

            // SEGURANÇA/PERFORMANCE: verificar no Auth de forma pontual
            // (getUserByEmail) em vez de listar TODOS os usuários (listUsers),
            // o que era lento e expunha enumeração massiva de contas.
            const { data: authData } = await supabaseAdmin.auth.admin.getUserByEmail(email);
            if (authData?.user && !conflicts.includes('e-mail')) conflicts.push('e-mail');
        }

        // 3. Check Phone
        if (phone) {
            const cleanPhone = phone.replace(/\D/g, '');
            const { data } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .or(`phone.eq.${cleanPhone},phone.ilike.%${cleanPhone}%`)
                .maybeSingle();
            if (data) conflicts.push('WhatsApp');
        }

        if (conflicts.length > 0) {
            const msg = `O seguinte já está em uso: ${conflicts.join(', ')}.`;
            return NextResponse.json({ available: false, error: msg });
        }

        return NextResponse.json({ available: true });

    } catch (error) {
        console.error('[AVAILABILITY CHECK ERROR]', error);
        return NextResponse.json({ available: true }); // Fallback
    }
}
