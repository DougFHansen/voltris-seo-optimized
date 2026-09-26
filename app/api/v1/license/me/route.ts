import { NextRequest } from 'next/server';
import { createClient as createServerClient } from '@/utils/supabase/server';
import {
    startOperation,
    getOrCreateCorrelationId,
    logSuccess,
    logSupabaseError,
    jsonWithCorrelation,
    errorWithCorrelation,
    maskEmail,
} from '@/lib/voltris-log';
import {
    getServiceClient,
    isLicenseActive,
    isLicenseExpired,
    licenseDisplayName,
    countLicenseDevices,
    licenseIsOwnedBy,
    type LicenseRow,
} from '@/lib/license-schema';

export const runtime = 'nodejs';

/**
 * GET /api/v1/license/me
 *
 * Licencas do usuario autenticado. Requer sessao (cookie OU Bearer token).
 *
 * O filtro e feito no SERVIDOR com service_role, usando o email da sessao como
 * criterio adicional. A RLS de licenses ja restringe o acesso direto do
 * navegador; aqui o service_role e seguro porque o userId vem da sessao.
 */
export async function GET(request: NextRequest) {
    const correlationId = getOrCreateCorrelationId(request);
    const ctx = startOperation('LICENSE_ME', correlationId);

    const supabase = await createServerClient();
    const { data: sessionData, error: authError } = await supabase.auth.getUser();
    const user = sessionData?.user ?? null;

    if (authError || !user) {
        return errorWithCorrelation(ctx, 401, 'UNAUTHORIZED', 'Nao autorizado');
    }
    ctx.userId = user.id;

    const admin = getServiceClient();

    // Duas consultas determinísticas em vez de um `.or()`:
    // o PostgREST exige aspas em valores de filtro que contenham caracteres
    // especiais (o "@" do e-mail), e o supabase-js não as aplica. Filtrar por
    // user_id primeiro e cair para o e-mail só quando necessário é previsível.
    const byUser = await admin
        .from('licenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (byUser.error) {
        logSupabaseError(ctx, 'buscar licencas por user_id', byUser.error);
        return errorWithCorrelation(ctx, 500, 'DB_READ_FAILED', 'Erro ao buscar licencas');
    }

    let candidates = (byUser.data ?? []) as LicenseRow[];

    if (candidates.length === 0 && user.email) {
        const byEmail = await admin
            .from('licenses')
            .select('*')
            .eq('customer_email', user.email)
            .order('created_at', { ascending: false });

        if (byEmail.error) {
            logSupabaseError(ctx, 'buscar licencas por email', byEmail.error);
            return errorWithCorrelation(ctx, 500, 'DB_READ_FAILED', 'Erro ao buscar licencas');
        }

        candidates = (byEmail.data ?? []) as LicenseRow[];
    }

    const session = { id: user.id, email: user.email ?? null };
    const owned = candidates.filter((l) => licenseIsOwnedBy(l, session));

    const formatted = await Promise.all(
        owned.map(async (license) => {
            const devicesInUse = await countLicenseDevices(license.license_key);
            return {
                license_key: license.license_key,
                type: license.plan_type ?? 'standard',
                displayName: licenseDisplayName(license),
                isActive: isLicenseActive(license),
                isExpired: isLicenseExpired(license),
                expiresAt: license.expires_at,
                maxDevices: license.max_devices ?? 1,
                devicesInUse,
                activatedAt: license.activated_at,
            };
        })
    );

    logSuccess(ctx, 'licencas do usuario', { count: formatted.length, user: maskEmail(user.email) });

    return jsonWithCorrelation(ctx, {
        user: {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || 'Usuario Voltris',
        },
        licenses: formatted,
    });
}
