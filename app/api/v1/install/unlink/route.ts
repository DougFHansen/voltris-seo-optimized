import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/utils/supabase/server';
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
 * POST /api/v1/install/unlink
 *
 * Desvincula a maquina do usuario. Exige sessao: desvinculacao e sempre uma
 * acao do dono, nunca do dispositivo.
 *
 * O `installation_id` e aceito no body OU na query string, porque o app desktop
 * enviava apenas na query (e recebia 400 "Missing installation_id").
 */
export async function POST(request: NextRequest) {
    const correlationId = getOrCreateCorrelationId(request);
    const ctx = startOperation('INSTALL_UNLINK', correlationId);

    let body: any = {};
    try {
        body = await request.json();
    } catch {
        // body vazio e aceitavel quando o id vem na query string
        body = {};
    }
    logRequest(ctx, request, body);

    const rawId =
        body?.installation_id ??
        body?.installationId ??
        request.nextUrl.searchParams.get('installation_id');

    const installationId = normalizeUuid(rawId);
    if (!installationId) {
        return errorWithCorrelation(ctx, 400, 'INVALID_INSTALLATION_ID', 'Missing or invalid installation_id.');
    }
    ctx.installationId = installationId;

    const supabase = await createServerClient();
    const { data: sessionData, error: authError } = await supabase.auth.getUser();
    const user = sessionData?.user ?? null;

    if (!user) {
        return errorWithCorrelation(ctx, 401, 'UNAUTHORIZED', 'Unauthorized - sessao invalida ou expirada.');
    }
    ctx.userId = user.id;
    void authError;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
        return errorWithCorrelation(ctx, 500, 'SERVER_CONFIG', 'Configuracao do servidor incompleta.');
    }

    const admin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: installation, error: fetchError } = await admin
        .from('installations')
        .select('id, user_id')
        .eq('id', installationId)
        .maybeSingle();

    if (fetchError) {
        logSupabaseError(ctx, 'buscar instalacao', fetchError);
        return errorWithCorrelation(ctx, 500, 'DB_READ_FAILED', 'Erro ao verificar instalacao.', {
            expose: true,
            details: { pg_code: fetchError.code ?? null },
        });
    }

    if (!installation) {
        return errorWithCorrelation(ctx, 404, 'INSTALLATION_NOT_FOUND', 'Instalacao nao encontrada.');
    }

    if (installation.user_id !== user.id) {
        return errorWithCorrelation(ctx, 403, 'NOT_OWNER', 'Voce nao e dono desta instalacao.');
    }

    if (installation.user_id === null) {
        // Ja desvinculado: idempotente, nao e erro.
        logSuccess(ctx, 'instalacao ja estava desvinculada');
        return jsonWithCorrelation(ctx, { success: true, already_unlinked: true, installation_id: installationId });
    }

    const { error: updateError } = await admin
        .from('installations')
        .update({ user_id: null, linked_at: null, updated_at: new Date().toISOString() })
        .eq('id', installationId)
        .eq('user_id', user.id);

    if (updateError) {
        logSupabaseError(ctx, 'desvincular instalacao', updateError);
        return errorWithCorrelation(ctx, 500, 'DB_UNLINK_FAILED', 'Erro ao desvincular dispositivo.', {
            expose: true,
            details: { pg_code: updateError.code ?? null },
        });
    }

    // Confirmacao pos-escrita (regra 19).
    const { data: confirmed, error: confirmError } = await admin
        .from('installations')
        .select('id, user_id')
        .eq('id', installationId)
        .single();

    if (confirmError || !confirmed || confirmed.user_id !== null) {
        logSupabaseError(ctx, 'confirmar desvinculo', confirmError);
        return errorWithCorrelation(
            ctx,
            500,
            'UNLINK_NOT_CONFIRMED',
            'A desvinculacao nao pode ser confirmada no banco.'
        );
    }

    // Limpeza de comandos pendentes. Nao e mais engolida em silencio: se
    // falhar, o vinculo continua desfeito e o cliente recebe o aviso.
    let pendingRemoved = 0;
    let cleanupWarning: string | null = null;
    try {
        const { count, error: cmdError } = await admin
            .from('device_commands')
            .delete({ count: 'exact' })
            .eq('installation_id', installationId)
            .eq('status', 'pending');
        if (cmdError) throw cmdError;
        pendingRemoved = count ?? 0;
    } catch (cmdError: any) {
        cleanupWarning = 'Comandos pendentes nao foram limpos.';
        logSupabaseError(ctx, 'limpar device_commands pendentes', cmdError ?? null);
    }

    logSuccess(ctx, 'desvinculacao confirmada', { pendingRemoved, cleanupWarning });

    return jsonWithCorrelation(ctx, {
        success: true,
        verified: true,
        installation_id: confirmed.id,
        pending_commands_removed: pendingRemoved,
        ...(cleanupWarning ? { warning: cleanupWarning } : {}),
    });
}

/** Health check do endpoint. */
export async function GET() {
    return Response.json({ status: 'ok', endpoint: 'install/unlink' });
}
