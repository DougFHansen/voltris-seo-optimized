import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { installationOwnershipErrorIfAuthenticated } from '@/utils/supabase/ownership';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const raw_id = searchParams.get('installation_id');
        const installation_id = raw_id?.trim();
        const since = searchParams.get('since'); // ISO timestamp — só retorna vinculado se updated_at > since

        if (!installation_id) {
            console.error('[API/STATUS] installation_id faltando');
            return NextResponse.json({ error: 'Missing installation_id' }, { status: 400 });
        }

        // SEGURANÇA: se o chamador estiver autenticado (dashboard web), só permite
        // consultar instalações da própria conta. Chamadas desktop sem sessão seguem normais.
        const ownershipError = await installationOwnershipErrorIfAuthenticated(installation_id);
        if (ownershipError) return ownershipError;

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error('[API/STATUS] Configuração do banco faltando');
            return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        console.log(`[API/STATUS] Consultando ID: ${installation_id}`);
        const { data: installation, error } = await supabase
            .from('installations')
            .select(`
                id,
                user_id,
                updated_at,
                last_heartbeat
            `)
            .eq('id', installation_id)
            .single();

        if (error) {
            console.warn(`[API/STATUS] ID não encontrado no banco [404]: ${installation_id}`);
            return NextResponse.json({ 
                linked: null,
                is_linked: false,
                email: null,
                user_email: null,
                error: 'Installation not found' 
            }, { status: 404 });
        }

        // Verificar se está vinculado (tem user_id)
        // Se `since` foi passado, só considerar vinculado se a vinculação ocorreu APÓS esse timestamp
        // Isso evita detectar vinculações antigas de sessões anteriores
        let isLinked = installation && installation.user_id ? true : false;
        if (isLinked && since) {
            try {
                const sinceDate = new Date(since);
                const updatedAt = new Date(installation.updated_at);
                if (updatedAt <= sinceDate) {
                    console.log(`[API/STATUS] Vinculação existente mas anterior ao since (${since}), ignorando`);
                    isLinked = false;
                }
            } catch {
                // Se o parse falhar, ignorar o filtro
            }
        }

        // Se vinculado, buscar o email do usuário
        let userEmail: string | null = null;
        if (isLinked && installation.user_id) {
            try {
                const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
                if (!usersError && users) {
                    const linkedUser = users.find(u => u.id === installation.user_id);
                    if (linkedUser) {
                        userEmail = linkedUser.email || null;
                        console.log(`[API/STATUS] Email encontrado: ${userEmail}`);
                    }
                }
            } catch (err) {
                console.warn(`[API/STATUS] Erro ao buscar email do usuário:`, err);
            }
        }

        return NextResponse.json({
            linked: isLinked,
            is_linked: isLinked,
            email: userEmail,
            user_email: userEmail,
            installation_id: installation_id,
            linked_at: installation.updated_at,
            last_updated: installation.updated_at
        });
    } catch (error: any) {
        console.error('[API/STATUS] Erro inesperado:', error);
        return NextResponse.json({ linked: null, is_linked: false, email: null, error: error.message }, { status: 500 });
    }
}
