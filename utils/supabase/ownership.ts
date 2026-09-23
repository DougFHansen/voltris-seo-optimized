import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

/**
 * Helpers de propriedade de recursos.
 *
 * Estratégia "opcional mas reforçada": os endpoints de instalação/licença/comandos
 * são chamados tanto pelo dashboard web (sessão autenticada) quanto pelo app desktop
 * (sem sessão). Quando o chamador está autenticado, validamos que o recurso pertence
 * a ele (retorna 403 se pertencer a outro usuário). Quando não está autenticado
 * (fluxo desktop), o helper retorna null e o fluxo original segue intacto.
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

    // Instalação inexistente ou ainda não vinculada: deixa o fluxo original decidir
    if (!installation || !installation.user_id) return null;

    if (installation.user_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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
        return NextResponse.json({ error: 'Command not found' }, { status: 404 });
    }

    const { data: installation } = await admin
        .from('installations')
        .select('user_id')
        .eq('id', command.installation_id)
        .maybeSingle();

    if (installation && installation.user_id && installation.user_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return null;
}

export async function licenseOwnershipErrorIfAuthenticated(
    license: { user_id?: string | null; email?: string | null },
    sessionUser: { id: string; email?: string | null } | null
): Promise<NextResponse | null> {
    if (!sessionUser) return null;

    if (license.user_id && license.user_id !== sessionUser.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (
        license.email &&
        sessionUser.email &&
        license.email.toLowerCase() !== sessionUser.email.toLowerCase()
    ) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return null;
}

/**
 * Retorna o usuário da sessão, se existir (sem falhar para chamadas desktop sem sessão).
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