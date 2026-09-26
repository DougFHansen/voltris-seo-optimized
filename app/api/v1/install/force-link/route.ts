import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/utils/supabase/requireAdmin';
import {
    startOperation,
    getOrCreateCorrelationId,
    logRequest,
    logSuccess,
    logSupabaseError,
    jsonWithCorrelation,
    errorWithCorrelation,
    normalizeUuid,
} from '@/lib/voltris-log';

export const runtime = 'nodejs';

/**
 * POST /api/v1/install/force-link
 *
 * Vincula uma instalacao a um usuario arbitrario. Operacao de ADMIN.
 * Usarios comuns usam /api/v1/install/link (autenticado pela propria sessao).
 */
export async function POST(request: NextRequest) {
    const correlationId = getOrCreateCorrelationId(request);
    const ctx = startOperation('INSTALL_FORCE_LINK', correlationId);

    const admin = await requireAdmin();
    if (admin.error) return admin.error;
    ctx.userId = admin.user.id;

    let body: any;
    try {
        body = await request.json();
    } catch {
        logRequest(ctx, request);
        return errorWithCorrelation(ctx, 400, 'INVALID_JSON', 'JSON invalido no corpo da requisicao.');
    }
    logRequest(ctx, request, body);

    const installationId = normalizeUuid(body?.installation_id ?? body?.installationId);
    if (!installationId) {
        return errorWithCorrelation(ctx, 400, 'INVALID_INSTALLATION_ID', 'Missing or invalid installation_id.');
    }
    ctx.installationId = installationId;

    const targetUserId = normalizeUuid(body?.user_id ?? body?.userId);
    if (!targetUserId) {
        return errorWithCorrelation(ctx, 400, 'INVALID_USER_ID', 'Missing or invalid user_id.');
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
        return errorWithCorrelation(ctx, 500, 'SERVER_CONFIG', 'Database configuration missing.');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    // installations.user_id tem FK para profiles.id: validar evita 23503 opaco.
    const { data: targetProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('id', targetUserId)
        .maybeSingle();

    if (profileError) {
        logSupabaseError(ctx, 'buscar perfil alvo', profileError);
        return errorWithCorrelation(ctx, 500, 'PROFILE_LOOKUP_FAILED', 'Erro ao validar o usuario alvo.');
    }
    if (!targetProfile) {
        return errorWithCorrelation(ctx, 404, 'PROFILE_NOT_FOUND', 'Usuario alvo nao possui perfil.');
    }

    const now = new Date().toISOString();
    const { data: existing, error: lookupError } = await supabase
        .from('installations')
        .select('id')
        .eq('id', installationId)
        .maybeSingle();

    if (lookupError) {
        logSupabaseError(ctx, 'buscar instalacao', lookupError);
        return errorWithCorrelation(ctx, 500, 'DB_READ_FAILED', 'Erro ao verificar instalacao.');
    }

    const nowIso = new Date().toISOString();
    const payload = {
        id: installationId,
        user_id: targetUserId,
        linked_at: nowIso,
        last_link_check_at: now,
        updated_at: now,
        ...(existing ? {} : { created_at: nowIso, app_version: '1.0.0', last_heartbeat: now }),
    };

    const { error: writeError } = await supabase
        .from('installations')
        .upsert(payload, { onConflict: 'id' });

    if (writeError) {
        logSupabaseError(ctx, 'upsert force-link', writeError);
        return errorWithCorrelation(ctx, 500, 'DB_FORCE_LINK_FAILED', 'Erro ao forcar a vinculacao.', {
            expose: true,
            details: { pg_code: writeError.code ?? null },
        });
    }

    const { data: confirmed, error: confirmError } = await supabase
        .from('installations')
        .select('id, user_id, linked_at')
        .eq('id', installationId)
        .single();

    if (confirmError || !confirmed || confirmed.user_id !== targetUserId) {
        logSupabaseError(ctx, 'confirmar force-link', confirmError);
        return errorWithCorrelation(ctx, 500, 'LINK_NOT_CONFIRMED', 'Vinculacao forcada nao confirmada.');
    }

    logSuccess(ctx, 'vinculacao forcada confirmada', { created: !existing, targetUserId });

    return jsonWithCorrelation(ctx, {
        success: true,
        verified: true,
        created: !existing,
        installation: confirmed,
    });
}
