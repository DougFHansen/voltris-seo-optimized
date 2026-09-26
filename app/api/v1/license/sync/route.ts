import { NextRequest } from 'next/server';
import {
    startOperation,
    getOrCreateCorrelationId,
    logRequest,
    logSuccess,
    logWarn,
    logSupabaseError,
    jsonWithCorrelation,
    errorWithCorrelation,
    normalizeUuid,
} from '@/lib/voltris-log';
import { installationOwnershipErrorIfAuthenticated } from '@/utils/supabase/ownership';
import {
    getServiceClient,
    isLicenseActive,
    isLicenseExpired,
    findLicenseByKey,
} from '@/lib/license-schema';

export const runtime = 'nodejs';
export const maxDuration = 30;

const VALID_STATUS = ['trial', 'active', 'expired', 'revoked'] as const;
type LicenseStatus = (typeof VALID_STATUS)[number];

/**
 * POST /api/v1/license/sync
 *
 * Sincroniza o status real de licenca do dispositivo para installations, e
 * devolve o estado autoritativo do servidor.
 *
 * Antes esta rota era um stub que respondia `success: true` sem fazer nada —
 * o que produzia estado falso. Agora ela grava de verdade e responde apenas
 * depois de releitura.
 */
export async function POST(request: NextRequest) {
    const correlationId = getOrCreateCorrelationId(request);
    const ctx = startOperation('LICENSE_SYNC', correlationId);

    let body: any;
    try {
        body = await request.json();
    } catch {
        body = {};
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

    const installationId = normalizeUuid(pick('installation_id'));
    const reportedStatus = String(pick('license_status') ?? pick('status') ?? '').trim().toLowerCase();
    const reportedKey = pick('license_key');
    const reportedExpiresAt = pick('license_expires_at') ?? pick('expires_at');

    if (!installationId) {
        return errorWithCorrelation(ctx, 400, 'MISSING_INSTALLATION_ID', 'Missing or invalid installation_id');
    }
    ctx.installationId = installationId;

    if (reportedStatus && !(VALID_STATUS as readonly string[]).includes(reportedStatus)) {
        return errorWithCorrelation(ctx, 400, 'INVALID_STATUS', 'license_status invalido', {
            details: { allowed: VALID_STATUS },
        });
    }

    const ownershipError = await installationOwnershipErrorIfAuthenticated(installationId);
    if (ownershipError) return ownershipError;

    let supabase;
    try {
        supabase = getServiceClient();
    } catch {
        return errorWithCorrelation(ctx, 500, 'SERVER_CONFIG', 'Configuracao do servidor incompleta');
    }

    const { data: installation, error: readError } = await supabase
        .from('installations')
        .select('id, user_id, license_key, license_status, license_expires_at')
        .eq('id', installationId)
        .maybeSingle();

    if (readError) {
        logSupabaseError(ctx, 'buscar instalacao', readError);
        return errorWithCorrelation(ctx, 500, 'DB_READ_FAILED', 'Erro ao consultar o dispositivo');
    }
    if (!installation) {
        return errorWithCorrelation(ctx, 404, 'INSTALLATION_NOT_FOUND', 'Dispositivo nao registrado');
    }

    // Resolve a licenca: a chave da instalacao tem precedencia sobre a reportada.
    const licenseKey = (installation.license_key ?? (reportedKey ? String(reportedKey).trim().toUpperCase() : null));

    let serverStatus: LicenseStatus = (installation.license_status as LicenseStatus) ?? 'trial';
    let serverExpiresAt: string | null = installation.license_expires_at ?? null;
    let authoritative = false;

    if (licenseKey) {
        const license = await findLicenseByKey(licenseKey);
        if (license) {
            authoritative = true;
            serverExpiresAt = license.expires_at;
            serverStatus = license.revoked === true ? 'revoked' : isLicenseExpired(license) ? 'expired' : isLicenseActive(license) ? 'active' : 'expired';
        } else {
            logWarn(ctx, 'licenca reportada nao existe no servidor', { licenseKey });
        }
    }

    // Se nao ha chave confiavel no servidor, aceita o status reportado pelo
    // dispositivo (unica fonte disponivel para o trial do app).
    if (!authoritative && reportedStatus) {
        serverStatus = reportedStatus as LicenseStatus;
    }

    const patch: Record<string, unknown> = {
        license_status: serverStatus,
        updated_at: new Date().toISOString(),
    };
    if (authoritative) patch.license_expires_at = serverExpiresAt;
    else if (reportedExpiresAt && !serverExpiresAt) {
        const d = new Date(String(reportedExpiresAt));
        if (!Number.isNaN(d.getTime())) patch.license_expires_at = d.toISOString();
    }
    if (licenseKey && authoritative) patch.license_key = licenseKey;

    const { error: writeError } = await supabase
        .from('installations')
        .update(patch)
        .eq('id', installationId);

    if (writeError) {
        logSupabaseError(ctx, 'sync license_status', writeError);
        return errorWithCorrelation(ctx, 500, 'DB_SYNC_FAILED', 'Nao foi possivel sincronizar o status da licenca', {
            expose: true,
            details: { pg_code: writeError.code ?? null },
        });
    }

    // Confirmacao pos-escrita (regra 19).
    const { data: confirmed } = await supabase
        .from('installations')
        .select('license_status, license_expires_at, license_key')
        .eq('id', installationId)
        .single();

    if (!confirmed || confirmed.license_status !== serverStatus) {
        logSupabaseError(ctx, 'confirmar sync de licenca', null);
        return errorWithCorrelation(
            ctx,
            500,
            'SYNC_NOT_CONFIRMED',
            'O status da licenca nao pode ser confirmado no banco.'
        );
    }

    logSuccess(ctx, 'status de licenca sincronizado', {
        licenseStatus: serverStatus,
        authoritative,
    });

    return jsonWithCorrelation(ctx, {
        success: true,
        verified: true,
        installation_id: installationId,
        license_status: confirmed.license_status,
        license_expires_at: confirmed.license_expires_at,
        license_key: confirmed.license_key,
        authoritative,
    });
}

/** Health check do endpoint. */
export async function GET() {
    return Response.json({ status: 'ok', endpoint: 'license/sync' });
}
