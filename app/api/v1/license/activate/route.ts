import { NextRequest } from 'next/server';
import { getOptionalSessionUser } from '@/utils/supabase/ownership';
import {
    startOperation,
    getOrCreateCorrelationId,
    logRequest,
    logSuccess,
    logSupabaseError,
    jsonWithCorrelation,
    errorWithCorrelation,
} from '@/lib/voltris-log';
import {
    getServiceClient,
    isLicenseExpired,
    licenseDisplayName,
    countLicenseDevices,
    licenseIsOwnedBy,
    findLicenseByKey,
} from '@/lib/license-schema';

export const runtime = 'nodejs';
export const maxDuration = 30;

const DEVICE_ID_RE = /^[A-Za-z0-9._:-]{8,128}$/;

/**
 * POST /api/v1/license/activate
 *
 * Registra um dispositivo em uma licenca. O limite de dispositivos e contado a
 * partir de license_devices (fonte da verdade), nunca de um contador denormalizado.
 */
export async function POST(request: NextRequest) {
    const correlationId = getOrCreateCorrelationId(request);
    const ctx = startOperation('LICENSE_ACTIVATE', correlationId);

    let body: any;
    try {
        body = await request.json();
    } catch {
        logRequest(ctx, request);
        return errorWithCorrelation(ctx, 400, 'INVALID_JSON', 'Corpo da requisicao invalido', {
            details: { success: false },
        });
    }
    logRequest(ctx, request, body);

    const pick = (...keys: string[]) => {
        for (const k of keys) {
            const camel = k.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
            const v = body?.[k] ?? body?.[camel];
            if (v !== undefined && v !== null) return v;
        }
        return undefined;
    };

    const licenseKey = String(pick('license_key') ?? '').trim().toUpperCase();
    const deviceId = String(pick('device_id') ?? '').trim();
    const machineName = pick('machine_name') ?? pick('device_name') ?? null;
    const osVersion = pick('os_version') ?? null;
    const appVersion = pick('app_version') ?? null;
    const processorCount = Number(pick('processor_count') ?? 0) || null;

    if (!licenseKey || !deviceId) {
        return errorWithCorrelation(ctx, 400, 'MISSING_FIELDS', 'License key and device ID are required', {
            details: { success: false, errorCode: 'MISSING_FIELDS' },
        });
    }

    if (!DEVICE_ID_RE.test(deviceId)) {
        return errorWithCorrelation(ctx, 400, 'INVALID_DEVICE_ID', 'Invalid device ID format', {
            details: { success: false, errorCode: 'INVALID_DEVICE_ID' },
        });
    }

    let supabase;
    try {
        supabase = getServiceClient();
    } catch {
        return errorWithCorrelation(ctx, 500, 'SERVER_CONFIG', 'Server configuration error', {
            details: { success: false },
        });
    }

    let license;
    try {
        license = await findLicenseByKey(licenseKey);
    } catch {
        logSupabaseError(ctx, 'buscar licenca', null);
        return errorWithCorrelation(ctx, 500, 'DB_READ_FAILED', 'Erro ao consultar licenca', {
            details: { success: false, errorCode: 'DB_ERROR' },
        });
    }

    if (!license) {
        return errorWithCorrelation(ctx, 404, 'LICENSE_NOT_FOUND', 'License not found', {
            details: { success: false, errorCode: 'LICENSE_NOT_FOUND' },
        });
    }

    // Se houver sessao autenticada, so o dono pode ativar.
    const sessionUser = await getOptionalSessionUser();
    if (sessionUser && !licenseIsOwnedBy(license, sessionUser)) {
        return errorWithCorrelation(ctx, 403, 'NOT_OWNER', 'This license belongs to another account.', {
            details: { success: false, errorCode: 'FORBIDDEN' },
        });
    }

    if (license.revoked === true) {
        return errorWithCorrelation(ctx, 403, 'LICENSE_REVOKED', 'Licenca revogada', {
            details: { success: false, errorCode: 'LICENSE_REVOKED' },
        });
    }

    if (isLicenseExpired(license)) {
        return errorWithCorrelation(ctx, 403, 'LICENSE_EXPIRED', 'Licenca expirada', {
            details: { success: false, errorCode: 'LICENSE_EXPIRED' },
        });
    }

    const now = new Date().toISOString();
    const maxDevices = license.max_devices ?? 1;
    const isUnlimited = maxDevices >= 9999 || (license.plan_type ?? '').toLowerCase() === 'enterprise';

    const { data: existingDevice } = await supabase
        .from('license_devices')
        .select('id')
        .eq('license_key', licenseKey)
        .eq('device_id', deviceId)
        .maybeSingle();

    if (existingDevice) {
        const { error: touchError } = await supabase
            .from('license_devices')
            .update({
                last_used_at: now,
                last_seen_at: now,
                device_name: machineName,
                machine_name: machineName,
                os_version: osVersion,
                app_version: appVersion,
            })
            .eq('id', existingDevice.id);

        if (touchError) {
            logSupabaseError(ctx, 'atualizar last_used_at', touchError);
        }

        logSuccess(ctx, 'dispositivo ja autorizado; ultimo uso atualizado', { deviceId });
        return jsonWithCorrelation(ctx, {
            success: true,
            message: 'Device already authorized.',
            licenseType: license.plan_type,
            licenseDisplayName: licenseDisplayName(license),
            expiresAt: license.expires_at,
            maxDevices,
            devicesInUse: await countLicenseDevices(licenseKey),
        });
    }

    const currentDevices = await countLicenseDevices(licenseKey);

    if (!isUnlimited && currentDevices >= maxDevices) {
        return errorWithCorrelation(
            ctx,
            409,
            'DEVICE_LIMIT_REACHED',
            `Limite de dispositivos atingido (${maxDevices}). Remova um dispositivo antigo no site.`,
            { details: { success: false, errorCode: 'DEVICE_LIMIT_REACHED', devicesInUse: currentDevices } }
        );
    }

    const { error: insertError } = await supabase.from('license_devices').insert({
        license_key: licenseKey,
        device_id: deviceId,
        device_name: machineName ?? 'Unknown PC',
        machine_name: machineName,
        os_version: osVersion,
        app_version: appVersion,
        processor_count: processorCount,
        activated_at: now,
        last_used_at: now,
        last_seen_at: now,
    });

    if (insertError) {
        logSupabaseError(ctx, 'inserir license_devices', insertError);
        const conflict = insertError.code === '23505';
        return errorWithCorrelation(
            ctx,
            conflict ? 409 : 500,
            conflict ? 'DEVICE_ALREADY_REGISTERED' : 'DB_INSERT_FAILED',
            conflict ? 'Dispositivo ja registrado nesta licenca.' : 'Erro ao registrar o dispositivo.',
            { details: { success: false, pg_code: insertError.code ?? null } }
        );
    }

    // Confirmacao pos-escrita (regra 19).
    const { data: confirmed } = await supabase
        .from('license_devices')
        .select('id, license_key, device_id')
        .eq('license_key', licenseKey)
        .eq('device_id', deviceId)
        .maybeSingle();

    if (!confirmed) {
        logSupabaseError(ctx, 'confirmar ativacao', null);
        return errorWithCorrelation(
            ctx,
            500,
            'ACTIVATION_NOT_CONFIRMED',
            'A ativacao nao pode ser confirmada no banco.'
        );
    }

    // Mantém a licenca ativa marcada com carimbo de uso.
    if (!license.activated_at) {
        await supabase.from('licenses').update({ activated_at: now }).eq('license_key', licenseKey);
    }

    const devicesInUse = await countLicenseDevices(licenseKey);
    logSuccess(ctx, 'licenca ativada e confirmada', { deviceId, devicesInUse, maxDevices });

    return jsonWithCorrelation(ctx, {
        success: true,
        verified: true,
        message: 'License successfully activated on this device!',
        licenseType: license.plan_type,
        licenseDisplayName: licenseDisplayName(license),
        expiresAt: license.expires_at,
        maxDevices,
        devicesInUse,
    });
}
