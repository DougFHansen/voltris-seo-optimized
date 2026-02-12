import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const machine_id = searchParams.get('machine_id');

        console.log('[API/COMMANDS/PENDING] ===== INÍCIO =====');
        console.log('[API/COMMANDS/PENDING] machine_id:', machine_id);

        if (!machine_id) {
            console.error('[API/COMMANDS/PENDING] machine_id faltando!');
            return NextResponse.json({ error: 'Missing machine_id' }, { status: 400 });
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Buscar installation_id usando machine_id
        console.log('[API/COMMANDS/PENDING] Buscando instalação...');
        const { data: installation, error: installError } = await supabaseAdmin
            .from('installations')
            .select('id')
            .eq('id', machine_id)
            .single();

        if (installError || !installation) {
            console.error('[API/COMMANDS/PENDING] Instalação não encontrada:', installError);
            return NextResponse.json({ commands: [] }); // Silent fail for unregistered devices
        }

        console.log('[API/COMMANDS/PENDING] Instalação encontrada:', installation.id);

        // Buscar comandos pendentes na tabela device_commands
        console.log('[API/COMMANDS/PENDING] Buscando comandos pendentes...');
        const { data: commands, error } = await supabaseAdmin
            .from('device_commands')
            .select('id, command_type, payload, status, created_at')
            .eq('installation_id', installation.id)
            .eq('status', 'pending')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('[API/COMMANDS/PENDING] Erro ao buscar comandos:', error);
            return NextResponse.json({ commands: [] });
        }

        console.log('[API/COMMANDS/PENDING] Comandos encontrados:', commands?.length || 0);
        if (commands && commands.length > 0) {
            console.log('[API/COMMANDS/PENDING] Detalhes dos comandos:', JSON.stringify(commands, null, 2));
        }
        console.log('[API/COMMANDS/PENDING] ===== FIM =====');

        return NextResponse.json({ commands: commands || [] });

    } catch (err) {
        console.error('[API/COMMANDS/PENDING] Erro geral:', err);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
