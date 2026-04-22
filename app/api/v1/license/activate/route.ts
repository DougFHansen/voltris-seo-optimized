import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';

/**
 * Retorna o nome completo para exibição da licença
 */
function getLicenseDisplayName(licenseType: string): string {
    switch (licenseType?.toLowerCase()) {
        case 'trial':
            return 'Trial';
        case 'standard':
            return 'VOLTRIS STANDARD';
        case 'pro':
            return 'VOLTRIS PRO';
        case 'enterprise':
            return 'VOLTRIS ENTERPRISE';
        default:
            return licenseType || 'Unknown';
    }
}

/**
 * API de Ativação de Licença - Voltris Optimizer
 * POST /api/v1/license/activate
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const licenseKey = body.license_key || body.licenseKey;
        const deviceId = body.device_id || body.deviceId;
        const machineName = body.machine_name || body.machineName;
        const osVersion = body.os_version || body.osVersion;
        const processorCount = body.processor_count || body.processorCount;

        if (!licenseKey || !deviceId) {
            return NextResponse.json({ success: false, errorMessage: 'License key and device ID are required' }, { status: 400 });
        }

        const supabase = await createClient();

        // 1. Buscar a licença
        const { data: license, error: licError } = await supabase
            .from('licenses')
            .select('*')
            .eq('license_key', licenseKey)
            .single();

        if (licError || !license) {
            return NextResponse.json({ success: false, errorMessage: 'License not found', errorCode: 'LICENSE_NOT_FOUND' }, { status: 404 });
        }

        // 2. Verificar se está ativa e não expirada
        if (!license.is_active) {
            return NextResponse.json({ success: false, errorMessage: 'Inactive license', errorCode: 'LICENSE_INACTIVE' });
        }

        if (license.expires_at) {
            const expiryDate = new Date(license.expires_at);
            if (expiryDate < new Date()) {
                return NextResponse.json({ success: false, errorMessage: 'License expired', errorCode: 'LICENSE_EXPIRED' });
            }
        }

        // 3. Segurança: Se a licença tem user_id, verificar se o usuário logado bate (Se houver login)
        const { data: { user } } = await supabase.auth.getUser();
        if (license.user_id && user && license.user_id !== user.id) {
            return NextResponse.json({ success: false, errorMessage: 'This license belongs to another account.', errorCode: 'FORBIDDEN' }, { status: 403 });
        }

        // 4. Verificar se o dispositivo já está registrado para esta licença
        const { data: existingDevice } = await supabase
            .from('license_devices')
            .select('*')
            .eq('license_id', license.id)
            .eq('device_id', deviceId)
            .single();

        if (existingDevice) {
            // Apenas atualizar o last_used_at
            await supabase
                .from('license_devices')
                .update({ 
                    last_used_at: new Date().toISOString(),
                    machine_name: machineName,
                    os_version: osVersion
                })
                .eq('id', existingDevice.id);

            return NextResponse.json({
                success: true,
                message: 'Dashboard: Device already authorized.',
                licenseType: license.license_type,
                licenseDisplayName: getLicenseDisplayName(license.license_type),
                expiresAt: license.expires_at ? new Date(license.expires_at).toISOString() : null,
                maxDevices: license.max_devices
            });
        }

        // 5. Verificar limite de dispositivos
        // Contar dispositivos atuais diretamente do banco (mais confiável que o contador da tabela licenses)
        const { count, error: countError } = await supabase
            .from('license_devices')
            .select('*', { count: 'exact', head: true })
            .eq('license_id', license.id);

        const currentDevices = count || 0;
        const maxDevices = license.max_devices || 1;

        if (license.license_type !== 'enterprise' && currentDevices >= maxDevices) {
            return NextResponse.json({
                success: false,
                errorMessage: `Device limit reached (${maxDevices}). Remove an old device on the website.`,
                errorCode: 'DEVICE_LIMIT_REACHED'
            });
        }

        // 6. Registrar novo dispositivo
        const { error: insertError } = await supabase
            .from('license_devices')
            .insert({
                license_id: license.id,
                device_id: deviceId,
                device_name: machineName || 'Unknown PC',
                machine_name: machineName,
                os_version: osVersion,
                processor_count: processorCount
            });

        if (insertError) {
            console.error('[ACTIVATION] Erro ao inserir dispositivo:', insertError);
            return NextResponse.json({ success: false, errorMessage: 'Error registering device in database.' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'License successfully activated on this device!',
            licenseType: license.license_type,
            licenseDisplayName: getLicenseDisplayName(license.license_type),
            expiresAt: license.expires_at ? new Date(license.expires_at).toISOString() : null,
            maxDevices: license.max_devices
        });

    } catch (err: any) {
        console.error('[ACTIVATION] Erro interno:', err);
        return NextResponse.json({ success: false, errorMessage: 'Internal error on activation server.' }, { status: 500 });
    }
}
