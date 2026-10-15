import { NextRequest } from 'next/server';
import {
    startOperation,
    getOrCreateCorrelationId,
    logSuccess,
    logError,
    jsonWithCorrelation,
    errorWithCorrelation,
} from '@/lib/voltris-log';
import { getServiceClient } from '@/lib/license-schema';
import { checkRateLimit } from '@/lib/telemetry-security';

export const runtime = 'nodejs';
export const maxDuration = 15;

/**
 * GET /api/v1/license/renewal?license_key=VOLTRIS-...&device_id=...
 *
 * Servidor autoritativo de validade para o app desktop (missão seções 5, 7 e 8).
 *
 * O desktop trata a data embutida na chave como TETO anti-fraude; uma renovação
 * legítima muda apenas licenses.expires_at no banco. Esta rota devolve, além do
 * vencimento real, um comprovante assinado com o MESMO mecanismo canônico da
 * emissão (generate_voltris_signature sobre o JSON {id,validUntil,plan,maxDevices}),
 * permitindo ao app re-verificar localmente sem confiar em dados do navegador/cache.
 *
 * Segurança: nada de PII é retornado; a RPC só roda com service_role; rate limit
 * por chave+IP; chave mascarada nos logs.
 */
export async function GET(request: NextRequest) {
    const correlationId = getOrCreateCorrelationId(request);
    const ctx = startOperation('LICENSE_RENEWAL', correlationId);

    const licenseKey = (request.nextUrl.searchParams.get('license_key')
        ?? request.nextUrl.searchParams.get('key') ?? '').trim().toUpperCase();

    if (licenseKey.length < 10 || !licenseKey.startsWith('VOLTRIS-')) {
        return errorWithCorrelation(ctx, 400, 'MISSING_LICENSE_KEY', 'Chave de licença obrigatória', {
            details: { valid: false },
        });
    }

    const deviceId = (request.nextUrl.searchParams.get('device_id') ?? '').trim();
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'local';

    const limited = await checkRateLimit(`renewal:${ip}:${licenseKey.slice(-8)}`, 1, 'FREE');
    if (!limited.allowed) {
        logError(ctx, 'LICENSE_RATE_LIMIT: demasiadas consultas de renovação', {
            details: { retryAt: new Date(limited.resetAt).toISOString() },
        });
        return errorWithCorrelation(ctx, 429, 'RATE_LIMITED', 'Muitas consultas. Tente novamente em instantes.', {
            details: { valid: false, retry_after_ms: limited.resetAt - Date.now() },
        });
    }

    let supabase;
    try {
        supabase = getServiceClient();
    } catch {
        return errorWithCorrelation(ctx, 500, 'SERVER_CONFIG', 'Configuração do servidor incompleta', {
            details: { valid: false },
        });
    }

    const { data, error } = await supabase.rpc('get_license_renewal_artifact', {
        p_license_key: licenseKey,
        p_device_id: deviceId || null,
    });

    if (error) {
        const message = String(error.message ?? '');
        const notFound = message.includes('LICENSE_NOT_FOUND');
        // Sem 200 falso: qualquer falha real vaza como erro para o app poder
        // distinguir "não sei" de "inválida".
        logError(ctx, `${notFound ? 'LICENSE_NOT_FOUND' : 'RENEWAL_ARTIFACT_FAILED'}: falha ao gerar artefato de renovação`, {
            details: { reason: message.slice(0, 160) },
        });
        return errorWithCorrelation(
            ctx,
            notFound ? 404 : 500,
            notFound ? 'LICENSE_NOT_FOUND' : 'RENEWAL_ARTIFACT_FAILED',
            notFound ? 'Licença não encontrada' : 'Não foi possível consultar a renovação',
            { details: { valid: false } },
        );
    }

    const artifact = (data ?? {}) as Record<string, unknown>;
    logSuccess(ctx, 'artefato de renovação emitido', {
        keyTail: licenseKey.slice(-4),
        valid: artifact.valid,
        revoked: artifact.revoked,
        expiresAt: artifact.expires_at,
        deviceRegistered: artifact.device_registered,
    });

    return jsonWithCorrelation(ctx, {
        valid: Boolean(artifact.valid),
        revoked: Boolean(artifact.revoked),
        license_key: artifact.license_key,
        plan_type: artifact.plan_type,
        billing_period: artifact.billing_period,
        max_devices: artifact.max_devices,
        expires_at: artifact.expires_at,
        renewal_valid_until: artifact.renewal_valid_until,
        renewal_signature: artifact.renewal_signature,
        device_registered: artifact.device_registered,
        server_time: artifact.server_time,
    });
}
