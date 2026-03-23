import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

/**
 * Helper para proteger rotas de admin.
 * Retorna { user, error } onde error é um NextResponse pronto para retornar se não autorizado.
 */
export async function requireAdmin(): Promise<
    | { user: { id: string; email?: string }; error: null }
    | { user: null; error: NextResponse }
> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { user: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }

    const adminClient = createAdminClient();
    const { data: profile } = await adminClient
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

    if (!profile?.is_admin) {
        return { user: null, error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
    }

    return { user, error: null };
}
