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
import {
    DEVICE_CREDENTIAL_FIELD,
    DEVICE_CREDENTIAL_HEADER,
    generateDeviceCredential,
    hashDeviceCredential,
    readPresentedCredential,
    verifyDeviceCredential,
} from '@/lib/device-credential';

export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/v1/install/status
 *
 * Estado de vínculo usado pelo app desktop.
 *
 * AUTENTICACAO DO DISPOSITIVO
 * O app não tem sessão. Ele se apresenta com a credencial de dispositivo
 * (header x-voltris-device-credential). Três casos:
 *
 *   1. sem credencial no banco  -> emite uma e devolve (dispositivo legado que
 *      ainda não reivindicou). O installation_id é um UUID v4 do app e, com o
 *      RLS corrigido, não é mais enumerável por anon.
 *   2. credencial correta       -> devolve o email do dono.
 *   3. credencial incorreta     -> devolve apenas `linked`, SEM email e sem
 *      reemitir. O app orienta a revincular.
 *
 * Sem esse portão, este endpoint virava um oráculo de e-mail: bastava saber o
 * installation_id para descobrir a quem a máquina pertence.
 *
 * `is_linked === false` só é devolvido com HTTP 200 quando a resposta é
 * conclusiva — é isso que impede o app de tratar "rede caiu" como "desvinculado".
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
        .select('id, user_id, linked_at, updated_at, last_heartbeat, device_credential_hash')
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

    // Credencial apresentada pelo app.
    const presented = readPresentedCredential(
        request.headers.get(DEVICE_CREDENTIAL_HEADER),
        null
    );

    let issuedCredential: string | null = null;
    let credentialValid = false;
    let credentialInvalid = false;

    if (isLinked) {
        if (!installation.device_credential_hash) {
            // Caso 1: haven't claimed it yet. Emite uma agora.
            issuedCredential = generateDeviceCredential();
            const { error: issueError } = await supabase
                .from('installations')
                .update({
                    device_credential_hash: hashDeviceCredential(issuedCredential),
                    device_credential_issued: new Date().toISOString(),
                })
                .eq('id', installationId);

            if (issueError) {
                logSupabaseError(ctx, 'emitir credencial (bootstrap)', issueError);
                issuedCredential = null;
            } else {
                credentialValid = true;
                logSuccess(ctx, 'credencial emitida no bootstrap');
            }
        } else {
            // Hash ja existe: ou o app tem a credencial, ou nao tem.
            credentialValid = verifyDeviceCredential(presented, installation.device_credential_hash);
            credentialInvalid = !credentialValid;

            if (credentialInvalid) {
                logWarn(ctx, 'credencial ausente ou invalida; email nao sera devolvido', {
                    presented: Boolean(presented),
                });
            }
        }
    }

    let userEmail: string | null = null;
    if (isLinked && installation.user_id && credentialValid) {
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

    logSuccess(ctx, 'status consultado', {
        isLinked,
        credentialValid,
        credentialInvalid,
        user: maskEmail(userEmail),
    });

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
            credential_valid: isLinked ? credentialValid : null,
            credential_invalid: isLinked ? credentialInvalid : null,
            ...(issuedCredential ? { [DEVICE_CREDENTIAL_FIELD]: issuedCredential } : {}),
        },
        200
    );
}
