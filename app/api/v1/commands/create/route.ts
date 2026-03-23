import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

// Rate limiting simples em memória
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30; // requisições por minuto por IP

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
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    if (!checkRateLimit(ip)) {
        return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }

    try {
        const body = await request.json();
        const { installation_id, command_type, payload } = body;

        if (!installation_id || !command_type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validar tipos permitidos de comando para evitar injeção de comandos arbitrários
        const ALLOWED_COMMANDS = ['optimize', 'scan', 'update_settings', 'heartbeat', 'report_status'];
        if (!ALLOWED_COMMANDS.includes(command_type)) {
            return NextResponse.json({ error: 'Invalid command_type' }, { status: 400 });
        }

        // Validar formato do installation_id (UUID)
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(installation_id)) {
            return NextResponse.json({ error: 'Invalid installation_id format' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Verificar se a instalação existe
        const { data: installation, error: installError } = await supabase
            .from('installations')
            .select('id, user_id')
            .eq('id', installation_id)
            .single();

        if (installError || !installation) {
            return NextResponse.json({ error: 'Installation not found' }, { status: 404 });
        }

        // Sanitizar payload — aceitar apenas objetos simples
        const safePayload = payload && typeof payload === 'object' && !Array.isArray(payload)
            ? payload
            : {};

        const { data, error } = await supabase
            .from('device_commands')
            .insert({
                installation_id: installation.id,
                command_type,
                payload: safePayload,
                status: 'pending'
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, command: data });
    } catch (error: any) {
        console.error('[API/COMMANDS/CREATE] Erro:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
