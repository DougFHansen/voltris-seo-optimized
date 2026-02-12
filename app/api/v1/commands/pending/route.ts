import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const machine_id = searchParams.get('machine_id');

        if (!machine_id) {
            return NextResponse.json({ error: 'Missing machine_id' }, { status: 400 });
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Buscar installation_id usando machine_id
        const { data: installation } = await supabaseAdmin
            .from('installations')
            .select('id')
            .eq('id', machine_id)
            .single();

        if (!installation) {
            return NextResponse.json({ commands: [] }); // Silent fail for unregistered devices
        }

        // Buscar comandos pendentes na tabela device_commands
        const { data: commands, error } = await supabaseAdmin
            .from('device_commands')
            .select('id, command_type, payload, status, created_at')
            .eq('installation_id', installation.id)
            .eq('status', 'pending')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('[API/COMMANDS/PENDING] Error:', error);
            return NextResponse.json({ commands: [] });
        }

        return NextResponse.json({ commands: commands || [] });

    } catch (err) {
        console.error('[API/COMMANDS/PENDING] Server Error:', err);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
