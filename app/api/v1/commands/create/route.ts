import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { installation_id, command_type, payload } = body;

        if (!installation_id || !command_type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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
            console.error('[API/COMMANDS/CREATE] Installation not found:', installError);
            return NextResponse.json({ error: 'Installation not found' }, { status: 404 });
        }

        // Criar comando na tabela device_commands
        const { data, error } = await supabase
            .from('device_commands')
            .insert({
                installation_id: installation.id,
                command_type,
                payload: payload || {},
                status: 'pending'
            })
            .select()
            .single();

        if (error) {
            console.error('[API/COMMANDS/CREATE] Insert error:', error);
            throw error;
        }

        console.log('[API/COMMANDS/CREATE] Command created successfully:', data);
        return NextResponse.json({ success: true, command: data });

    } catch (error: any) {
        console.error('[API/COMMANDS/CREATE] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
