import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { command_id, status, result_data } = body;

        console.log('[API/COMMANDS/UPDATE] ===== INÍCIO =====');
        console.log('[API/COMMANDS/UPDATE] command_id:', command_id);
        console.log('[API/COMMANDS/UPDATE] status:', status);
        console.log('[API/COMMANDS/UPDATE] result_data:', JSON.stringify(result_data));

        if (!command_id || !status) {
            console.error('[API/COMMANDS/UPDATE] Parâmetros inválidos!');
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        console.log('[API/COMMANDS/UPDATE] Atualizando comando no banco...');
        const { error } = await supabaseAdmin
            .from('device_commands')
            .update({
                status: status,
                result_data: result_data,
                executed_at: new Date().toISOString(),
            })
            .eq('id', command_id);

        if (error) {
            console.error('[API/COMMANDS/UPDATE] Erro ao atualizar:', error);
            return NextResponse.json({ error: 'Update failed' }, { status: 500 });
        }

        console.log('[API/COMMANDS/UPDATE] ✅ Comando atualizado com sucesso!');
        console.log('[API/COMMANDS/UPDATE] ===== FIM =====');
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[API/COMMANDS/UPDATE] Erro geral:', err);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
