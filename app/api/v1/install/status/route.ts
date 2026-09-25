import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { installationOwnershipErrorIfAuthenticated } from '@/utils/supabase/ownership';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    try {
        console.log('[API/STATUS] ========== INICIANDO GET /api/v1/install/status ==========');
        console.log('[API/STATUS] Timestamp:', new Date().toISOString());
        
        const { searchParams } = new URL(request.url);
        const raw_id = searchParams.get('installation_id');
        const installation_id = raw_id?.trim();
        const since = searchParams.get('since');

        console.log('[API/STATUS] Query params:', { installation_id, since });

        if (!installation_id) {
            console.error('[API/STATUS] ❌ installation_id faltando');
            return NextResponse.json({ error: 'Missing installation_id', is_linked: false }, { status: 400 });
        }

        const ownershipError = await installationOwnershipErrorIfAuthenticated(installation_id);
        if (ownershipError) {
            console.warn('[API/STATUS] ⚠️ Ownership check retornou erro');
            return ownershipError;
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error('[API/STATUS] ❌ Configuração faltando');
            return NextResponse.json({ error: 'Database configuration missing', is_linked: false }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Normalizar UUID para lowercase
        const normalizedId = installation_id.toLowerCase();
        
        console.log(`[API/STATUS] Consultando installation_id: ${normalizedId}`);
        const { data: installation, error } = await supabase
            .from('installations')
            .select('id, user_id, updated_at, last_heartbeat')
            .eq('id', normalizedId)
            .single();

        if (error) {
            console.warn(`[API/STATUS] ⚠️ Instalação não encontrada [${error.code}]:`, error.message);
            return NextResponse.json({ 
                linked: null,
                is_linked: false,
                email: null,
                error: 'Installation not found',
                debug_error: error.message
            }, { status: 404 });
        }

        console.log('[API/STATUS] ✅ Instalação encontrada:', installation);

        // Verificar se está vinculado
        let isLinked = installation && installation.user_id ? true : false;
        console.log('[API/STATUS] isLinked:', isLinked, 'user_id:', installation.user_id);

        if (isLinked && since) {
            try {
                const sinceDate = new Date(since);
                const updatedAt = new Date(installation.updated_at);
                if (updatedAt <= sinceDate) {
                    console.log(`[API/STATUS] Vinculação anterior ao since, ignorando`);
                    isLinked = false;
                }
            } catch {
                console.warn('[API/STATUS] Erro ao parsear since timestamp');
            }
        }

        // Se vinculado, buscar o email do usuário
        let userEmail: string | null = null;
        if (isLinked && installation.user_id) {
            try {
                console.log(`[API/STATUS] Buscando email para user_id: ${installation.user_id}`);
                const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(installation.user_id);
                
                if (userError) {
                    console.error(`[API/STATUS] ❌ Erro ao buscar usuário:`, {
                        code: userError.code,
                        message: userError.message
                    });
                } else if (user) {
                    userEmail = user.email || null;
                    console.log(`[API/STATUS] ✅ Email encontrado:`, userEmail);
                } else {
                    console.warn(`[API/STATUS] ⚠️ getUserById retornou null para user_id: ${installation.user_id}`);
                }
            } catch (err: any) {
                console.error(`[API/STATUS] ❌ Exception ao buscar email:`, {
                    name: err.name,
                    message: err.message,
                    stack: err.stack
                });
            }
        }

        const response = {
            linked: isLinked,
            is_linked: isLinked,
            email: userEmail,
            user_email: userEmail,
            user_id: installation.user_id,
            installation_id: installation_id,
            linked_at: installation.updated_at,
            last_updated: installation.updated_at
        };

        console.log('[API/STATUS] ✅ Response a enviar:', response);
        return NextResponse.json(response);

    } catch (error: any) {
        console.error('[API/STATUS] ❌❌❌ ERRO CRÍTICO NA RAIZ:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        return NextResponse.json({ 
            linked: null, 
            is_linked: false, 
            email: null, 
            error: error.message 
        }, { status: 500 });
    }
}
