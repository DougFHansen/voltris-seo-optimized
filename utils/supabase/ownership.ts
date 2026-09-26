import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

/**
 * Helpers de propriedade de recursos.
 *
 * Estrategia: os endpoints de instalacao/licenca/comandos sao chamados tanto pelo
 * dashboard web (sessao autenticada via cookie) quanto pelo app desktop (sem
 * sessao, autenticado apenas pelo installation_id que ele mesmo gerou).
 *
 * - Chamador COM sessao: o recurso precisa pertencer a ele. Senao 403.
 * - Chamador SEM sessao (desktop): segue o fluxo proprio do dispositivo, que ja
 *   opera apenas sobre o proprio installation_id.
 *
 * Importante: endpoints que aceitam escrita a partir de um id recebido do
 * cliente (desvinculo, envio de comando) exigem sessao de forma explicita —
 * ver /api/v1/install/unlink. Aqui so fica a checagem de leitura.
 */

export async function installationOwnershipErrorIfAuthenticated(
    installationId: string
): Promise<NextResponse | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const admin = createAdminClient();
    const { data: installation } = await admin
        .from('installations')
        .select('user_id')
        .eq('id', installationId)
        .maybeSingle();

    // Instalacao inexistente ou ainda nao vinculada: deixa o fluxo decidir.
    if (!installation || !installation.user_id) return null;

    if (installation.user_id !== user.id) {
        return NextResponse.json(
            { error: 'Forbidden', code: 'NOT_OWNER' },
            { status: 403 }
        );
    }
    return null;
}

export async function commandOwnershipErrorIfAuthenticated(
    commandId: string
): Promise<NextResponse | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const admin = createAdminClient();
    const { data: command } = await admin
        .from('device_commands')
        .select('installation_id')
        .eq('id', commandId)
        .maybeSingle();

    if (!command) {
        return NextResponse.json({ error: 'Command not found', code: 'COMMAND_NOT_FOUND' }, { status: 404 });
    }

    const { data: installation } = await admin
        .from('installations')
        .select('user_id')
        .eq('id', command.installation_id)
        .maybeSingle();

    if (installation && installation.user_id && installation.user_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden', code: 'NOT_OWNER' }, { status: 403 });
    }
    return null;
}

export async function licenseOwnershipErrorIfAuthenticated(
    license: { user_id?: string | null; email?: string | null; customer_email?: string | null },
    sessionUser: { id: string; email?: string | null } | null
): Promise<NextResponse | null> {
    if (!sessionUser) return null;

    if (license.user_id) {
        if (license.user_id !== sessionUser.id) {
            return NextResponse.json({ error: 'Forbidden', code: 'NOT_OWNER' }, { status: 403 });
        }
        return null;
    }

    // Linha legada sem user_id: cai para o email.
    const owner = (license.email ?? license.customer_email ?? '').toLowerCase();
    if (owner && sessionUser.email && owner !== sessionUser.email.toLowerCase()) {
        return NextResponse.json({ error: 'Forbidden', code: 'NOT_OWNER' }, { status: 403 });
    }
    return null;
}

/**
 * Retorna o usuario da sessao, se existir (sem falhar para chamadas desktop).
 */
export async function getOptionalSessionUser(): Promise<{ id: string; email?: string | null } | null> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        return { id: user.id, email: user.email ?? null };
    } catch {
        return null;
    }
}
