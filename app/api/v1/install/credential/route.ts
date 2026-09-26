import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
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
import {
    isWellFormedCredential,
    hashDeviceCredential,
    verifyDeviceCredential,
} from '@/lib/device-credential';

export const runtime = 'nodejs';

/**
 * POST /api/v1/install/credential
 *
 * O DISPOSITIVO registra a PRÓPRIA credencial.
 *
 * Por que o dispositivo gera o token em vez de receber do servidor:
 *  - nenhum segredo trafega servidor -> app, então não há janela em que o token
 *    poderia ser interceptado ou ficar parado no navegador;
 *  - o app já tem DPAPI para guardar segredo, então o caminho é o mesmo;
 *  - o vínculo no site acontece pelo NAVEGADOR (que autentica por sessão), não
 *    pelo app. Emitir a credencial no /install/link gravava o hash sem que
 *    ninguém tivesse o token — e o app ficava travado em "credencial inválida".
 *
 * Regras:
 *  - sem hash gravado: aceita e grava o hash do token apresentado;
 *  - com hash gravado e token igual: idempotente, devolve ok;
 *  - com hash gravado e token diferente: 409. NUNCA sobrescreve — senão quem
 *    soubesse o installation_id poderia tomar a posse da credencial.
 */
export async function POST(request: NextRequest) {
    const correlationId = getOrCreateCorrelationId(request);
    const ctx = startOperation('INSTALL_CREDENTIAL', correlationId);

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

    const presented = pick('device_credential');
    if (!isWellFormedCredential(presented)) {
        return errorWithCorrelation(ctx, 400, 'INVALID_CREDENTIAL', 'device_credential ausente ou malformado.');
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
        return errorWithCorrelation(ctx, 500, 'SERVER_CONFIG', 'Configuracao do servidor incompleta.');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: installation, error: readError } = await supabase
        .from('installations')
        .select('id, device_credential_hash')
        .eq('id', installationId)
        .maybeSingle();

    if (readError) {
        logSupabaseError(ctx, 'buscar instalacao', readError);
        return errorWithCorrelation(ctx, 500, 'DB_READ_FAILED', 'Erro ao verificar instalacao.', {
            expose: true,
            details: { pg_code: readError.code ?? null },
        });
    }

    if (!installation) {
        return errorWithCorrelation(
            ctx,
            404,
            'INSTALLATION_NOT_FOUND',
            'Dispositivo ainda nao registrado. Abra o app para registrar a maquina antes.'
        );
    }

    const now = new Date().toISOString();

    // Ja existe credencial?
    if (installation.device_credential_hash) {
        if (verifyDeviceCredential(presented, installation.device_credential_hash)) {
            logSuccess(ctx, 'credencial ja registrada (idempotente)');
            return jsonWithCorrelation(ctx, {
                success: true,
                already_registered: true,
                installation_id: installationId,
            });
        }

        logWarn(ctx, 'credencial ja registrada e diferente: recusando sobrescrever');
        return errorWithCorrelation(
            ctx,
            409,
            'CREDENTIAL_ALREADY_REGISTERED',
            'Este dispositivo ja possui uma credencial. Revincule pela conta para reemitir.'
        );
    }

    // Registro pela primeira vez.
    const { error: writeError } = await supabase
        .from('installations')
        .update({
            device_credential_hash: hashDeviceCredential(presented),
            device_credential_issued: now,
        })
        .eq('id', installationId)
        .is('device_credential_hash', null);

    if (writeError) {
        logSupabaseError(ctx, 'registrar credencial', writeError);
        return errorWithCorrelation(ctx, 500, 'DB_WRITE_FAILED', 'Nao foi possivel registrar a credencial.', {
            expose: true,
            details: { pg_code: writeError.code ?? null },
        });
    }

    // Confirmacao pos-escrita (regra 19).
    const { data: confirmed } = await supabase
        .from('installations')
        .select('device_credential_hash')
        .eq('id', installationId)
        .single();

    if (!verifyDeviceCredential(presented, confirmed?.device_credential_hash ?? null)) {
        logSupabaseError(ctx, 'confirmar registro da credencial', null);
        return errorWithCorrelation(
            ctx,
            500,
            'CREDENTIAL_NOT_CONFIRMED',
            'O registro da credencial nao pode ser confirmado.'
        );
    }

    logSuccess(ctx, 'credencial de dispositivo registrada pelo proprio device');

    return jsonWithCorrelation(ctx, {
        success: true,
        verified: true,
        installation_id: installationId,
    });
}

/** Health check do endpoint. */
export async function GET() {
    return Response.json({ status: 'ok', endpoint: 'install/credential' });
}
