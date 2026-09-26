import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
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
} from '@/lib/voltris-log';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/** Comandos expirados nao sao entregues: evita replay de comando antigo. */
const COMMAND_TTL_MINUTES = 30;

/**
 * GET /api/v1/commands/pending
 *
 * Entrega os comandos pendentes de UMA maquina. O dispositivo authentica pelo
 * proprio installation_id (que ele gera e persiste localmente).
 */
export async function GET(req: NextRequest) {
    const correlationId = getOrCreateCorrelationId(req);
    const ctx = startOperation('COMMAND_PENDING', correlationId);

    const { searchParams } = req.nextUrl;
    const rawId = searchParams.get('machine_id') ?? searchParams.get('device_id');
    const machineId = normalizeUuid(rawId);

    if (!machineId) {
        return errorWithCorrelation(ctx, 400, 'INVALID_MACHINE_ID', 'Missing or invalid machine_id', {
            details: { commands: [] },
        });
    }
    ctx.installationId = machineId;

    const ownershipError = await installationOwnershipErrorIfAuthenticated(machineId);
    if (ownershipError) return ownershipError;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
        return errorWithCorrelation(ctx, 500, 'SERVER_CONFIG', 'Database configuration missing', {
            details: { commands: [] },
        });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: installation, error: installError } = await supabase
        .from('installations')
        .select('id')
        .eq('id', machineId)
        .maybeSingle();

    if (installError) {
        logSupabaseError(ctx, 'buscar instalacao', installError);
        return errorWithCorrelation(ctx, 500, 'DB_READ_FAILED', 'Erro ao consultar o dispositivo.', {
            details: { commands: [] },
        });
    }

    if (!installation) {
        // Dispositivo ainda nao registrado: responde lista vazia (nao erro) para
        // o app nao entrar em loop de retry.
        logWarn(ctx, 'instalacao nao encontrada; retornando lista vazia');
        return jsonWithCorrelation(ctx, { commands: [], registered: false });
    }

    const notExpired = new Date(Date.now() - COMMAND_TTL_MINUTES * 60_000).toISOString();

    const { data: commands, error } = await supabase
        .from('device_commands')
        .select('id, command_type, payload, status, created_at')
        .eq('installation_id', installation.id)
        .eq('status', 'pending')
        .gte('created_at', notExpired)
        .order('created_at', { ascending: true });

    if (error) {
        logSupabaseError(ctx, 'buscar device_commands pendentes', error);
        return errorWithCorrelation(ctx, 500, 'DB_COMMAND_READ_FAILED', 'Erro ao buscar comandos.', {
            details: { commands: [] },
        });
    }

    logSuccess(ctx, 'comandos pendentes entregues', { count: commands?.length ?? 0 });

    return jsonWithCorrelation(
        ctx,
        { commands: commands ?? [], registered: true },
        200
    );
}
