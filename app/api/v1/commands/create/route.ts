import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { installation_id, command_type, payload } = body;

        console.log('[API/COMMANDS/CREATE] ===== INÍCIO =====');
        console.log('[API/COMMANDS/CREATE] installation_id:', installation_id);
        console.log('[API/COMMANDS/CREATE] command_type:', command_type);
        console.log('[API/COMMANDS/CREATE] payload:', payload);

        if (!installation_id || !command_type) {
            console.error('[API/COMMANDS/CREATE] Parâmetros faltando!');
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Verificar se a instalação existe
        console.log('[API/COMMANDS/CREATE] Verificando se instalação existe...');
        const { data: installation, error: installError } = await supabase
            .from('installations')
            .select('id, user_id')
            .eq('id', installation_id)
            .single();

        if (installError || !installation) {
            console.error('[API/COMMANDS/CREATE] Instalação não encontrada:', installError);
            return NextResponse.json({ error: 'Installation not found' }, { status: 404 });
        }

        console.log('[API/COMMANDS/CREATE] Instalação encontrada:', installation);

        // Criar comando na tabela device_commands
        console.log('[API/COMMANDS/CREATE] Criando comando...');
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
            console.error('[API/COMMANDS/CREATE] Erro ao inserir comando:', error);
            throw error;
        }

        console.log('[API/COMMANDS/CREATE] Comando criado com sucesso:', data);
        console.log('[API/COMMANDS/CREATE] ===== FIM =====');
        
        return NextResponse.json({ success: true, command: data });

    } catch (error: any) {
        console.error('[API/COMMANDS/CREATE] Erro geral:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
