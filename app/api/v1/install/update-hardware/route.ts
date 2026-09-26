import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { installationOwnershipErrorIfAuthenticated } from '@/utils/supabase/ownership';
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
 * POST /api/v1/install/update-hardware
 *
 * Atualiza SOMente o inventario de hardware. Nunca toca em user_id/licenca —
 * quem controla vinculo e /install/link.
 */
export async function POST(request: NextRequest) {
    const correlationId = getOrCreateCorrelationId(request);
    const ctx = startOperation('INSTALL_HARDWARE', correlationId);

    let body: any;
    try {
        body = await request.json();
    } catch {
        logRequest(ctx, request);
        return errorWithCorrelation(ctx, 400, 'INVALID_JSON', 'JSON invalido no corpo da requisicao.');
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
    if (!installationId) {
        return errorWithCorrelation(ctx, 400, 'INVALID_INSTALLATION_ID', 'Missing or invalid installation_id.');
    }
    ctx.installationId = installationId;

    const ownershipError = await installationOwnershipErrorIfAuthenticated(installationId);
    if (ownershipError) return ownershipError;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
        return errorWithCorrelation(ctx, 500, 'SERVER_CONFIG', 'Database configuration missing.');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    const hardware = body?.hardware ?? {};
    const h = (...keys: string[]) => {
        for (const k of keys) {
            const camel = k.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
            const v = hardware?.[k] ?? hardware?.[camel];
            if (v !== undefined && v !== null) return v;
        }
        return null;
    };

    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    const assign = (column: string, value: unknown) => {
        if (value !== null) patch[column] = value;
    };

    assign('cpu_name', h('cpu_name', 'cpu', 'processor'));
    assign('gpu_name', h('gpu_name', 'gpu', 'graphics'));
    assign('disk_type', h('disk_type', 'disk'));
    assign('os_name', h('os_name', 'os'));
    assign('os_build', h('os_build', 'build'));
    assign('windows_edition', h('windows_edition', 'edition'));
    assign('architecture', h('architecture'));
    assign('pc_name', h('pc_name', 'hostname', 'pc'));

    const ram = h('ram_gb_total', 'ram', 'memory');
    if (ram !== null) {
        const n = Number(ram);
        if (Number.isFinite(n)) patch.ram_gb_total = Math.round(n);
    }

    const { error } = await supabase.from('installations').update(patch).eq('id', installationId);

    if (error) {
        logSupabaseError(ctx, 'update hardware', error);
        return errorWithCorrelation(ctx, 500, 'DB_UPDATE_FAILED', 'Nao foi possivel atualizar o hardware.', {
            expose: true,
            details: { pg_code: error.code ?? null },
        });
    }

    logSuccess(ctx, 'hardware atualizado', { columns: Object.keys(patch) });
    return jsonWithCorrelation(ctx, { success: true, installation_id: installationId });
}
