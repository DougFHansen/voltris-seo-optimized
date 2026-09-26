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
    countLicenseDevices,
    licenseIsOwnedBy,
    findLicenseByKey,
    type LicenseDeviceRow,
} from '@/lib/license-schema';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * POST /api/v1/license/deactivate
 *
 * Libera o slot de um dispositivo. Chamado pelo app desktop (chave + deviceId)
 * ou pelo painel (dono da licenca).
 */
export async function POST(request: NextRequest) {
    const correlationId = getOrCreateCorrelationId(request);
    const ctx = startOperation('LICENSE_DEACTIVATE', correlationId);

    let body: any;
    try {
        body = await request.json();
    } catch {
        logRequest(ctx, request);
        return errorWithCorrelation(ctx, 400, 'INVALID_JSON', 'Corpo da requisicao invalido', {
            details: { success: false, errorCode: 'INVALID_JSON' },
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

    if (!licenseKey) {
        return errorWithCorrelation(ctx, 400, 'MISSING_LICENSE_KEY', 'Chave de licenca e obrigatoria', {
            details: { success: false, errorCode: 'MISSING_LICENSE_KEY' },
        });
    }
    if (!deviceId) {
        return errorWithCorrelation(ctx, 400, 'MISSING_DEVICE_ID', 'ID do dispositivo e obrigatorio', {
            details: { success: false, errorCode: 'MISSING_DEVICE_ID' },
        });
    }

    let supabase;
    try {
        supabase = getServiceClient();
    } catch {
        return errorWithCorrelation(ctx, 500, 'SERVER_CONFIG', 'Erro de configuracao do servidor', {
            details: { success: false, errorCode: 'SERVER_CONFIG_ERROR' },
        });
    }

    let license;
    try {
        license = await findLicenseByKey(licenseKey);
    } catch {
        return errorWithCorrelation(ctx, 500, 'DB_READ_FAILED', 'Erro ao consultar licenca', {
            details: { success: false, errorCode: 'DEACTIVATION_ERROR' },
        });
    }

    if (!license) {
        return errorWithCorrelation(ctx, 404, 'LICENSE_NOT_FOUND', 'Licenca nao encontrada', {
            details: { success: false, errorCode: 'LICENSE_NOT_FOUND' },
        });
    }

    const sessionUser = await getOptionalSessionUser();
    if (sessionUser) {
        ctx.userId = sessionUser.id;
        if (!licenseIsOwnedBy(license, sessionUser)) {
            return errorWithCorrelation(ctx, 403, 'NOT_OWNER', 'Esta licenca pertence a outra conta.', {
                details: { success: false, errorCode: 'FORBIDDEN' },
            });
        }
    }

    const { data: device, error: deviceError } = await supabase
        .from('license_devices')
        .select('*')
        .eq('license_key', licenseKey)
        .eq('device_id', deviceId)
        .maybeSingle();

    if (deviceError) {
        logSupabaseError(ctx, 'buscar dispositivo da licenca', deviceError);
        return errorWithCorrelation(ctx, 500, 'DB_READ_FAILED', 'Erro ao consultar o dispositivo', {
            details: { success: false, errorCode: 'DEACTIVATION_ERROR' },
        });
    }

    if (!device) {
        // Idempotente: ja esta livre.
        logSuccess(ctx, 'dispositivo nao estava registrado', { deviceId });
        return jsonWithCorrelation(ctx, {
            success: true,
            already_released: true,
            devicesInUse: await countLicenseDevices(licenseKey),
            maxDevices: license.max_devices ?? 1,
        });
    }

    const { error: deleteError } = await supabase
        .from('license_devices')
        .delete()
        .eq('id', (device as LicenseDeviceRow).id);

    if (deleteError) {
        logSupabaseError(ctx, 'remover license_devices', deleteError);
        return errorWithCorrelation(ctx, 500, 'DEACTIVATION_ERROR', 'Erro ao desativar dispositivo', {
            details: { success: false, pg_code: deleteError.code ?? null },
        });
    }

    const { data: stillThere } = await supabase
        .from('license_devices')
        .select('id')
        .eq('id', (device as LicenseDeviceRow).id)
        .maybeSingle();

    if (stillThere) {
        logSupabaseError(ctx, 'confirmar remocao do dispositivo', null);
        return errorWithCorrelation(
            ctx,
            500,
            'DEACTIVATION_NOT_CONFIRMED',
            'A remocao do dispositivo nao pode ser confirmada.'
        );
    }

    const devicesInUse = await countLicenseDevices(licenseKey);
    logSuccess(ctx, 'dispositivo desativado e confirmado', { deviceId, devicesInUse });

    return jsonWithCorrelation(ctx, {
        success: true,
        verified: true,
        message: 'Dispositivo desativado com sucesso',
        devicesInUse,
        maxDevices: license.max_devices ?? 1,
    });
}

/** Health check do endpoint. */
export async function GET() {
    return Response.json({ status: 'ok', endpoint: 'license/deactivate' });
}
