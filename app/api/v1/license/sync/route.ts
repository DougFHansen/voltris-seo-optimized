import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

/**
 * API para sincronizar status de licença do programa com o servidor
 * Chamada pelo programa quando uma licença é ativada
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { installation_id, license_key, license_status, expires_at } = body;

        console.log('[API/LICENSE/SYNC] ===== INÍCIO =====');
        console.log('[API/LICENSE/SYNC] installation_id:', installation_id);
        console.log('[API/LICENSE/SYNC] license_status:', license_status);
        console.log('[API/LICENSE/SYNC] license_key:', license_key ? 'presente' : 'ausente');

        if (!installation_id) {
            console.error('[API/LICENSE/SYNC] installation_id faltando!');
            return NextResponse.json({ error: 'Missing installation_id' }, { status: 400 });
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Verificar se a instalação existe
        console.log('[API/LICENSE/SYNC] Verificando instalação...');
        const { data: installation, error: installError } = await supabaseAdmin
            .from('installations')
            .select('id')
            .eq('id', installation_id)
            .single();

        if (installError || !installation) {
            console.error('[API/LICENSE/SYNC] Instalação não encontrada:', installError);
            return NextResponse.json({ error: 'Installation not found' }, { status: 404 });
        }

        // Atualizar informações de licença
        console.log('[API/LICENSE/SYNC] Atualizando licença...');
        const updateData: any = {
            license_status: license_status || 'trial',
            license_activated_at: new Date().toISOString()
        };

        if (license_key) {
            updateData.license_key = license_key;
        }

        if (expires_at) {
            updateData.license_expires_at = expires_at;
        }

        const { error: updateError } = await supabaseAdmin
            .from('installations')
            .update(updateData)
            .eq('id', installation_id);

        if (updateError) {
            console.error('[API/LICENSE/SYNC] Erro ao atualizar:', updateError);
            return NextResponse.json({ error: 'Update failed' }, { status: 500 });
        }

        console.log('[API/LICENSE/SYNC] ✅ Licença sincronizada com sucesso!');
        console.log('[API/LICENSE/SYNC] ===== FIM =====');

        return NextResponse.json({ 
            success: true,
            message: 'License synced successfully'
        });

    } catch (error: any) {
        console.error('[API/LICENSE/SYNC] Erro geral:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
