import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import { commandOwnershipErrorIfAuthenticated } from '@/utils/supabase/ownership';
import {
    startOperation,
    getOrCreateCorrelationId,
    logRequest,
    logSuccess,
    logSupabaseError,
    jsonWithCorrelation,
    errorWithCorrelation,
} from '@/lib/voltris-log';

export const runtime = 'nodejs';

const ALLOWED_STATUS = ['pending', 'running', 'completed', 'success', 'failed', 'error', 'cancelled'] as const;

/**
 * POST /api/v1/commands/update
 *
 * O dispositivo reporta o resultado da execucao de um comando.
 *
 * 한 comando so pode ser reportado uma vez: o UPDATE exige o status anterior,
 * o que impede replay e duplicidade de confirmacao.
 */
export async function POST(req: NextRequest) {
    const correlationId = getOrCreateCorrelationId(req);
    const ctx = startOperation('COMMAND_UPDATE', correlationId);

    let body: any;
    try {
        body = await req.json();
    } catch {
        logRequest(ctx, req);
        return errorWithCorrelation(ctx, 400, 'INVALID_JSON', 'JSON invalido no corpo da requisicao.');
    }
    logRequest(ctx, req, body);

    const pick = (...keys: string[]) => {
        for (const k of keys) {
            const camel = k.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
            const v = body?.[k] ?? body?.[camel];
            if (v !== undefined && v !== null) return v;
        }
        return undefined;
    };

    const commandId = String(pick('command_id') ?? '').trim();
    const status = String(pick('status') ?? '').trim();

    if (!commandId || !status) {
        return errorWithCorrelation(ctx, 400, 'MISSING_FIELDS', 'Invalid payload');
    }

    if (!(ALLOWED_STATUS as readonly string[]).includes(status)) {
        return errorWithCorrelation(ctx, 400, 'INVALID_STATUS', 'Invalid status');
    }

    const ownershipError = await commandOwnershipErrorIfAuthenticated(commandId);
    if (ownershipError) return ownershipError;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
        return errorWithCorrelation(ctx, 500, 'SERVER_CONFIG', 'Database configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    const resultData = pick('result_data');

    // WHERE status = 'pending'/'running' garante single-write (idempotencia).
    const { data, error } = await supabase
        .from('device_commands')
        .update({
            status,
            result_data: resultData && typeof resultData === 'object' ? resultData : null,
            executed_at: new Date().toISOString(),
        })
        .eq('id', commandId)
        .in('status', ['pending', 'running'])
        .select('id, status')
        .maybeSingle();

    if (error) {
        logSupabaseError(ctx, 'atualizar device_commands', error);
        return errorWithCorrelation(ctx, 500, 'DB_COMMAND_UPDATE_FAILED', 'Update failed');
    }

    if (!data) {
        const { data: current } = await supabase
            .from('device_commands')
            .select('id, status')
            .eq('id', commandId)
            .maybeSingle();

        if (!current) {
            return errorWithCorrelation(ctx, 404, 'COMMAND_NOT_FOUND', 'Command not found');
        }
        // Ja estava finalizado: nada a fazer, mas nao e erro.
        logSuccess(ctx, 'comando ja finalizado; nada alterado', { commandId, currentStatus: current.status });
        return jsonWithCorrelation(ctx, { success: true, already_finalized: true, status: current.status });
    }

    logSuccess(ctx, 'comando atualizado', { commandId, status });
    return jsonWithCorrelation(ctx, { success: true, status: data.status });
}
