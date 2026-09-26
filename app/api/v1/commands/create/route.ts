import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getOptionalSessionUser } from '@/utils/supabase/ownership';
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

// Rate limiting simples em memoria
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30; // requisicoes por minuto por IP

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now >= entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
        return true;
    }
    if (entry.count >= RATE_LIMIT) return false;
    entry.count++;
    return true;
}

/** Comandos que o app desktop sabe executar. Allowlist = nao ha execucao arbitraria. */
const ALLOWED_COMMANDS = [
    // Sistema
    'optimize', 'quick_optimize', 'quick_cleanup', 'shutdown', 'restart_link', 'prepare_pc',
    // Limpeza
    'cleanup_analyze', 'cleanup_execute',
    // Reparo
    'repair_full', 'repair_dism_sfc', 'repair_disk_cleanup',
    // Gamer
    'gamer_mode', 'gamer_activate', 'gamer_deactivate', 'gamer_scan_games',
    // Rede
    'network_optimize', 'network_flush_dns', 'network_reset_winsock', 'network_reset_tcp',
    // Desempenho
    'performance_optimize', 'performance_revert',
    // Shield
    'shield_toggle', 'shield_quick_scan', 'shield_full_scan', 'shield_adware_scan',
    // Drivers
    'drivers_scan', 'drivers_update_all',
    // Interno
    'heartbeat', 'scan', 'update_settings', 'report_status',
] as const;

/** Tempo maximo que um comando fica disponivel para o dispositivo executar. */
const COMMAND_TTL_MINUTES = 30;

export async function POST(request: NextRequest) {
    const correlationId = getOrCreateCorrelationId(request);
    const ctx = startOperation('COMMAND_CREATE', correlationId);

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!checkRateLimit(ip)) {
        return errorWithCorrelation(ctx, 429, 'RATE_LIMITED', 'Too Many Requests');
    }

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
    const commandType = String(pick('command_type') ?? '').trim();

    if (!installationId || !commandType) {
        return errorWithCorrelation(ctx, 400, 'MISSING_FIELDS', 'Missing installation_id or command_type');
    }
    ctx.installationId = installationId;

    if (!(ALLOWED_COMMANDS as readonly string[]).includes(commandType)) {
        return errorWithCorrelation(ctx, 400, 'INVALID_COMMAND_TYPE', 'Invalid command_type');
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
        return errorWithCorrelation(ctx, 500, 'SERVER_CONFIG', 'Database configuration missing');
    }
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: installation, error: installError } = await supabase
        .from('installations')
        .select('id, user_id')
        .eq('id', installationId)
        .maybeSingle();

    if (installError) {
        logSupabaseError(ctx, 'buscar instalacao', installError);
        return errorWithCorrelation(ctx, 500, 'DB_READ_FAILED', 'Erro ao verificar instalacao.');
    }
    if (!installation) {
        return errorWithCorrelation(ctx, 404, 'INSTALLATION_NOT_FOUND', 'Installation not found');
    }

    // O comando so pode ser criado para uma maquina vinculada a alguem.
    if (!installation.user_id) {
        return errorWithCorrelation(
            ctx,
            409,
            'INSTALLATION_NOT_LINKED',
            'Nao e possivel enviar comandos para uma maquina nao vinculada.'
        );
    }

    // Se ha sessao (painel web), so o dono. Sem sessao = chamada do proprio
    // dispositivo, que so executa, nao cria.
    const sessionUser = await getOptionalSessionUser();
    if (sessionUser) {
        ctx.userId = sessionUser.id;
        if (installation.user_id !== sessionUser.id) {
            return errorWithCorrelation(ctx, 403, 'NOT_OWNER', 'Forbidden');
        }
    }

    const safePayload =
        body?.payload && typeof body.payload === 'object' && !Array.isArray(body.payload)
            ? body.payload
            : {};

    const expiresAt = new Date(Date.now() + COMMAND_TTL_MINUTES * 60_000).toISOString();

    const { data, error } = await supabase
        .from('device_commands')
        .insert({
            installation_id: installation.id,
            command_type: commandType,
            payload: { ...safePayload, correlation_id: correlationId },
            status: 'pending',
            created_at: new Date().toISOString(),
        })
        .select('id, command_type, status, created_at')
        .single();

    if (error) {
        logSupabaseError(ctx, 'inserir device_commands', error);
        return errorWithCorrelation(ctx, 500, 'DB_COMMAND_FAILED', 'Internal server error', {
            details: { pg_code: error.code ?? null },
        });
    }

    logSuccess(ctx, 'comando criado', { commandId: data?.id, commandType, expiresAt });

    return jsonWithCorrelation(ctx, {
        success: true,
        command: data,
        expires_at: expiresAt,
    });
}
