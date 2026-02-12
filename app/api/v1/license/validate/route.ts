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

        // PRIORIDADE 1: Verificar se tem licença ativa
        if (installation.license_status === 'active' && installation.license_key) {
            console.log('[API/LICENSE/VALIDATE] ✅ Licença ativa encontrada');
            
            // Verificar se a licença expirou (se tiver data de expiração)
            if (installation.license_expires_at) {
                const expiresAt = new Date(installation.license_expires_at);
                const now = new Date();
                
                if (expiresAt < now) {
                    console.log('[API/LICENSE/VALIDATE] ❌ Licença expirada');
                    return NextResponse.json({
                        valid: false,
                        license_status: 'expired',
                        reason: 'license_expired',
                        message: 'Licença expirada. Renove para continuar.'
                    });
                }
            }
            
            return NextResponse.json({
                valid: true,
                license_status: 'active',
                license_key: installation.license_key,
                message: 'Licença ativa'
            });
        }

        // PRIORIDADE 2: Verificar status de trial (sincronizado pelo programa)
        // O programa envia o status real do trial via /api/v1/license/sync
        if (installation.license_status === 'trial') {
            console.log('[API/LICENSE/VALIDATE] ✅ Trial ativo (sincronizado pelo programa)');
            
            // Calcular dias restantes baseado em created_at como fallback
            const createdAt = new Date(installation.created_at);
            const now = new Date();
            const daysSinceInstall = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
            const trialDaysRemaining = Math.max(0, 7 - daysSinceInstall);
            
            return NextResponse.json({
                valid: true,
                license_status: 'trial',
                trial_days_remaining: trialDaysRemaining,
                message: `Trial ativo - ${trialDaysRemaining} dia(s) restante(s)`
            });
        }

        // PRIORIDADE 3: Status 'expired' ou 'revoked'
        if (installation.license_status === 'expired' || installation.license_status === 'revoked') {
            console.log('[API/LICENSE/VALIDATE] ❌ Licença expirada ou revogada');
            return NextResponse.json({
                valid: false,
                license_status: installation.license_status,
                reason: installation.license_status === 'revoked' ? 'license_revoked' : 'trial_expired',
                message: installation.license_status === 'revoked' 
                    ? 'Licença revogada. Entre em contato com o suporte.'
                    : 'Período de teste expirado. Ative uma licença para continuar.'
            });
        }

        // FALLBACK: Se não tem status definido, considerar trial expirado
        console.log('[API/LICENSE/VALIDATE] ❌ Status indefinido - considerando expirado');
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
