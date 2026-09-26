import { NextRequest } from 'next/server';
import {
    startOperation,
    getOrCreateCorrelationId,
    logSuccess,
    jsonWithCorrelation,
    errorWithCorrelation,
    maskEmail,
} from '@/lib/voltris-log';
import {
    isLicenseActive,
    isLicenseExpired,
    licenseDisplayName,
    countLicenseDevices,
    licenseIsOwnedBy,
    findLicenseByKey,
    getServiceClient,
    type LicenseDeviceRow,
} from '@/lib/license-schema';
import { getOptionalSessionUser } from '@/utils/supabase/ownership';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * GET /api/v1/license/info?key=VOLTRIS-...
 *
 * Dados publicos da licenca para qualquer chamador; dados sensiveis (email do
 * cliente e lista de dispositivos) somente para o dono autenticado.
 */
export async function GET(request: NextRequest) {
    const correlationId = getOrCreateCorrelationId(request);
    const ctx = startOperation('LICENSE_INFO', correlationId);

    const licenseKey = (request.nextUrl.searchParams.get('key') ?? '').trim().toUpperCase();
    if (!licenseKey) {
        return errorWithCorrelation(ctx, 400, 'MISSING_LICENSE_KEY', 'Chave de licenca e obrigatoria', {
            details: { valid: false },
        });
    }

    let license;
    try {
        license = await findLicenseByKey(licenseKey);
    } catch {
        return errorWithCorrelation(ctx, 500, 'DB_READ_FAILED', 'Erro ao consultar licenca', {
            details: { valid: false, errorCode: 'DB_ERROR' },
        });
    }

    if (!license) {
        return errorWithCorrelation(ctx, 404, 'LICENSE_NOT_FOUND', 'Licenca nao encontrada', {
            details: { valid: false, errorCode: 'LICENSE_NOT_FOUND' },
        });
    }

    const sessionUser = await getOptionalSessionUser();
    const ownsLicense = licenseIsOwnedBy(license, sessionUser);
    if (sessionUser) ctx.userId = sessionUser.id;

    let customerEmail: string | null = null;
    let registeredDevices: Array<Record<string, unknown>> = [];
    let devicesInUse = 0;

    if (ownsLicense) {
        customerEmail = license.email ?? license.customer_email ?? null;
        const supabase = getServiceClient();
        const { data: devices } = await supabase
            .from('license_devices')
            .select('id, license_key, device_id, device_name, machine_name, os_version, app_version, activated_at, last_used_at, last_seen_at')
            .eq('license_key', licenseKey)
            .order('activated_at', { ascending: false });

        registeredDevices = ((devices ?? []) as LicenseDeviceRow[]).map((d) => ({
            deviceId: d.device_id,
            deviceName: d.device_name ?? d.machine_name,
            machineName: d.machine_name,
            osVersion: d.os_version,
            appVersion: d.app_version,
            activatedAt: d.activated_at,
            lastUsedAt: d.last_used_at ?? d.last_seen_at,
        }));
        devicesInUse = registeredDevices.length;
    } else {
        // Contagem e barata e nao expoe PII.
        devicesInUse = await countLicenseDevices(licenseKey);
    }

    const isActive = isLicenseActive(license);
    const expired = isLicenseExpired(license);

    logSuccess(ctx, 'licenca consultada', { ownsLicense, isActive, expired, customer: maskEmail(customerEmail) });

    return jsonWithCorrelation(ctx, {
        valid: isActive && !expired,
        type: license.plan_type,
        displayName: licenseDisplayName(license),
        maxDevices: license.max_devices ?? 1,
        devicesInUse,
        expiresAt: license.expires_at,
        activatedAt: license.activated_at,
        billingPeriod: license.billing_period,
        customerEmail,
        registeredDevices,
        isActive,
        isExpired: expired,
    });
}
