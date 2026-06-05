import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';

/**
 * GET /api/v1/license/me
 * Retorna todas as licenças do usuário autenticado.
 * REQUER Token JWT no Header Authorization.
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Verificar sessão/token
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        // Buscar licenças do usuário (via user_id ou email)
        const { data: licenses, error } = await supabase
            .from('licenses')
            .select(`
                *,
                devices:license_devices(device_id, device_name, machine_name, last_used_at)
            `)
            .or(`user_id.eq.${user.id},email.eq.${user.email}`)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[LICENSE ME] Erro ao buscar licenças:', error);
            return NextResponse.json({ error: 'Erro ao buscar licenças' }, { status: 500 });
        }

        // Formatar resposta premium para o App
        const formattedLicenses = licenses.map(lic => {
            const now = new Date();
            const expires = lic.expires_at ? new Date(lic.expires_at) : null;
            const isExpired = expires ? expires < now : false;

            return {
                id: lic.id,
                key: lic.license_key,
                type: lic.license_type,
                isActive: lic.is_active && !isExpired,
                isExpired,
                expiresAt: lic.expires_at,
                maxDevices: lic.max_devices,
                devicesInUse: lic.devices?.length || 0,
                devices: lic.devices || []
            };
        });

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.user_metadata?.full_name || 'Usuário Voltris'
            },
            licenses: formattedLicenses
        });

    } catch (err: any) {
        console.error('[LICENSE ME] Erro fatal:', err);
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
}
