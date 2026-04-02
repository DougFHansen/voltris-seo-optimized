import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Service Role for system-level checks (Bypasses RLS)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
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

            // Also check Auth directly
            const { data: authData } = await supabaseAdmin.auth.admin.listUsers();
            const existingAuthUser = authData.users.find(u => u.email === email);
            if (existingAuthUser && !conflicts.includes('e-mail')) conflicts.push('e-mail');
        }

        // 3. Check Phone
        if (phone) {
            const cleanPhone = phone.replace(/\D/g, '');
            const { data } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .or(`phone.eq.${phone},phone.ilike.%${cleanPhone}%`)
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
