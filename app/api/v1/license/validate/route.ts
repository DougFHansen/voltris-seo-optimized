import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { installationOwnershipErrorIfAuthenticated } from '@/utils/supabase/ownership';
import {
    startOperation,
    getOrCreateCorrelationId,
    logSuccess,
    logSupabaseError,
    jsonWithCorrelation,
    errorWithCorrelation,
    normalizeUuid,
} from '@/lib/voltris-log';

export const runtime = 'nodejs';

const TRIAL_DAYS = 7;

/**
 * GET /api/v1/license/validate?installation_id=...
 *
 * Estado autoritativo da licenca do dispositivo, para o app desktop.
 * Nao aceita status vindo do cliente: le do servidor.
 */
export async function GET(req: NextRequest) {
    const correlationId = getOrCreateCorrelationId(req);
    const ctx = startOperation('LICENSE_VALIDATE', correlationId);

    const installationId = normalizeUuid(req.nextUrl.searchParams.get('installation_id'));
    if (!installationId) {
        return errorWithCorrelation(ctx, 400, 'MISSING_INSTALLATION_ID', 'Missing or invalid installation_id', {
            details: { valid: false },
        });
    }
    ctx.installationId = installationId;

    const ownershipError = await installationOwnershipErrorIfAuthenticated(installationId);
    if (ownershipError) return ownershipError;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
        return errorWithCorrelation(ctx, 500, 'SERVER_CONFIG', 'Configuracao do servidor incompleta', {
            details: { valid: false },
        });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: installation, error } = await supabase
        .from('installations')
        .select('id, license_status, license_key, license_expires_at, created_at, trial_started_at, app_version')
        .eq('id', installationId)
        .maybeSingle();

    if (error) {
        logSupabaseError(ctx, 'buscar instalacao', error);
        return errorWithCorrelation(ctx, 500, 'DB_READ_FAILED', 'Erro ao consultar o dispositivo', {
            details: { valid: false },
        });
    }
    if (!installation) {
        return errorWithCorrelation(ctx, 404, 'INSTALLATION_NOT_FOUND', 'Dispositivo nao encontrado', {
            details: { valid: false, reason: 'installation_not_found' },
        });
    }

    const status = installation.license_status as 'trial' | 'active' | 'expired' | 'revoked';

    if (status === 'active' && installation.license_key) {
        if (installation.license_expires_at && new Date(installation.license_expires_at) < new Date()) {
            logSuccess(ctx, 'licenca expirada');
            return jsonWithCorrelation(ctx, {
                valid: false,
                license_status: 'expired',
                reason: 'license_expired',
                message: 'Licenca expirada. Renove para continuar.',
            });
        }

        logSuccess(ctx, 'licenca ativa');
        return jsonWithCorrelation(ctx, {
            valid: true,
            license_status: 'active',
            license_key: installation.license_key,
            license_expires_at: installation.license_expires_at,
            message: 'Licenca ativa',
        });
    }

    if (status === 'trial') {
        // O trial comeca quando o dispositivo e registrado, nao na criacao da
        // conta: usar trial_started_at evita trial zerado em maquinas antigas.
        const trialStart = installation.trial_started_at ?? installation.created_at;
        const daysSince = Math.max(
            0,
            Math.floor((Date.now() - new Date(trialStart).getTime()) / (1000 * 60 * 60 * 24))
        );
        const daysRemaining = Math.max(0, TRIAL_DAYS - daysSince);

        if (daysRemaining === 0) {
            logSuccess(ctx, 'trial expirado', { daysSince });
            return jsonWithCorrelation(ctx, {
                valid: false,
                license_status: 'expired',
                reason: 'trial_expired',
                trial_days_remaining: 0,
                message: 'Periodo de teste expirado. Ative uma licenca para continuar.',
            });
        }

        logSuccess(ctx, 'trial ativo', { daysRemaining });
        return jsonWithCorrelation(ctx, {
            valid: true,
            license_status: 'trial',
            trial_days_remaining: daysRemaining,
            message: `Trial ativo - ${daysRemaining} dia(s) restante(s)`,
        });
    }

    logSuccess(ctx, 'licenca sem acesso', { status });
    return jsonWithCorrelation(ctx, {
        valid: false,
        license_status: status,
        reason: status === 'revoked' ? 'license_revoked' : 'trial_expired',
        message:
            status === 'revoked'
                ? 'Licenca revogada. Entre em contato com o suporte.'
                : 'Periodo de teste expirado. Ative uma licenca para continuar.',
    });
}
