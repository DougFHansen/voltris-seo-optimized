import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const installation_id = searchParams.get('installation_id');

        console.log('[API/LICENSE/VALIDATE] ===== INÍCIO =====');
        console.log('[API/LICENSE/VALIDATE] installation_id:', installation_id);

        if (!installation_id) {
            console.error('[API/LICENSE/VALIDATE] installation_id faltando!');
            return NextResponse.json({ error: 'Missing installation_id' }, { status: 400 });
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Buscar instalação
        console.log('[API/LICENSE/VALIDATE] Buscando instalação...');
        const { data: installation, error: installError } = await supabaseAdmin
            .from('installations')
            .select('id, license_status, license_key, created_at, app_version')
            .eq('id', installation_id)
            .single();

        if (installError || !installation) {
            console.error('[API/LICENSE/VALIDATE] Instalação não encontrada:', installError);
            return NextResponse.json({ 
                valid: false, 
                reason: 'installation_not_found',
                message: 'Dispositivo não encontrado'
            });
        }

        console.log('[API/LICENSE/VALIDATE] Instalação encontrada:', installation);

        // Verificar se tem licença ativa
        if (installation.license_status === 'active' && installation.license_key) {
            console.log('[API/LICENSE/VALIDATE] ✅ Licença ativa encontrada');
            return NextResponse.json({
                valid: true,
                license_status: 'active',
                license_key: installation.license_key,
                message: 'Licença ativa'
            });
        }

        // Verificar período de trial (7 dias)
        const createdAt = new Date(installation.created_at);
        const now = new Date();
        const daysSinceInstall = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
        const trialDaysRemaining = Math.max(0, 7 - daysSinceInstall);

        console.log('[API/LICENSE/VALIDATE] Dias desde instalação:', daysSinceInstall);
        console.log('[API/LICENSE/VALIDATE] Dias de trial restantes:', trialDaysRemaining);

        if (trialDaysRemaining > 0) {
            console.log('[API/LICENSE/VALIDATE] ✅ Trial ativo');
            return NextResponse.json({
                valid: true,
                license_status: 'trial',
                trial_days_remaining: trialDaysRemaining,
                message: `Trial ativo - ${trialDaysRemaining} dia(s) restante(s)`
            });
        }

        // Trial expirado e sem licença
        console.log('[API/LICENSE/VALIDATE] ❌ Trial expirado e sem licença');
        return NextResponse.json({
            valid: false,
            license_status: 'expired',
            reason: 'trial_expired',
            trial_days_remaining: 0,
            message: 'Período de teste expirado. Ative uma licença para continuar.'
        });

    } catch (err: any) {
        console.error('[API/LICENSE/VALIDATE] Erro geral:', err);
        return NextResponse.json({ 
            valid: false,
            reason: 'server_error',
            error: err.message 
        }, { status: 500 });
    }
}
