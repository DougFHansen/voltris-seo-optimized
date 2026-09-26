import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { installationOwnershipErrorIfAuthenticated } from '@/utils/supabase/ownership';
import {
    startOperation,
    getOrCreateCorrelationId,
    logSuccess,
    logWarn,
    logSupabaseError,
    jsonWithCorrelation,
    errorWithCorrelation,
    normalizeUuid,
    maskEmail,
} from '@/lib/voltris-log';

export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/v1/install/status
 *
 * Consulta de estado usada pelo app desktop para saber se esta vinculado.
 *
 * Sem este campo `linked`, o programa tratava falha de rede como "desvinculado"
 * e apagava o estado local. Por isso o app desktop so pode limpar o estado local
 * quando `is_linked === false` com HTTP 200.
 */
export async function GET(request: NextRequest) {
    const correlationId = getOrCreateCorrelationId(request);
    const ctx = startOperation('INSTALL_STATUS', correlationId);

    const { searchParams } = request.nextUrl;
    const installationId = normalizeUuid(searchParams.get('installation_id'));
    const since = searchParams.get('since');

    if (!installationId) {
        return errorWithCorrelation(ctx, 400, 'INVALID_INSTALLATION_ID', 'Missing or invalid installation_id.', {
            details: { is_linked: false },
        });
    }
    ctx.installationId = installationId;

    const ownershipError = await installationOwnershipErrorIfAuthenticated(installationId);
    if (ownershipError) return ownershipError;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
        return errorWithCorrelation(ctx, 500, 'SERVER_CONFIG', 'Database configuration missing.', {
            details: { is_linked: false },
        });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: installation, error } = await supabase
        .from('installations')
        .select('id, user_id, linked_at, updated_at, last_heartbeat')
        .eq('id', installationId)
        .maybeSingle();

    if (error) {
        logSupabaseError(ctx, 'buscar instalacao', error);
        return errorWithCorrelation(ctx, 500, 'DB_READ_FAILED', 'Falha ao consultar o dispositivo.', {
            details: { is_linked: false, linked: null },
        });
    }

    if (!installation) {
        logWarn(ctx, 'instalacao nao encontrada', { since: since ?? null });
        return errorWithCorrelation(ctx, 404, 'INSTALLATION_NOT_FOUND', 'Installation not found.', {
            details: { linked: null, is_linked: false, email: null },
        });
    }

    let isLinked = Boolean(installation.user_id);

    if (isLinked && since) {
        const sinceDate = new Date(since);
        if (!Number.isNaN(sinceDate.getTime()) && installation.linked_at) {
            if (new Date(installation.linked_at) <= sinceDate) {
                logSuccess(ctx, 'vinculo anterior ao since, ignorado', { since });
                isLinked = false;
            }
        }
    }

    let userEmail: string | null = null;
    if (isLinked && installation.user_id) {
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(installation.user_id);
        if (userError) {
            logSupabaseError(ctx, 'buscar email do usuario', userError);
        } else {
            userEmail = userData?.user?.email ?? null;
        }
    }

    // Marca que o dispositivo consultou o estado (usado para diagnostico).
    try {
        await supabase
            .from('installations')
            .update({ last_link_check_at: new Date().toISOString() })
            .eq('id', installationId);
    } catch (e) {
        logWarn(ctx, 'nao foi possivel registrar last_link_check_at', { reason: (e as Error)?.message });
    }

    logSuccess(ctx, 'status consultado', { isLinked, user: maskEmail(userEmail) });

    return jsonWithCorrelation(
        ctx,
        {
            linked: isLinked,
            is_linked: isLinked,
            email: userEmail,
            user_email: userEmail,
            user_id: installation.user_id,
            installation_id: installationId,
            linked_at: installation.linked_at,
            last_updated: installation.updated_at,
            last_heartbeat: installation.last_heartbeat,
        },
        200
    );
}
