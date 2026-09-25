import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        let installation_id: string | undefined;

        try {
            const body = await request.json();
            installation_id = body?.installation_id;
        } catch {
            return NextResponse.json({ error: 'JSON inválido no corpo da requisição.' }, { status: 400 });
        }

        if (!installation_id) {
            return NextResponse.json({ error: 'Missing installation_id' }, { status: 400 });
        }

        // SEGURANÇA: exigir sessão — desvincular só é feito pelo dashboard web.
        const supabaseSession = await createServerClient();
        const { data: { user }, error: authError } = await supabaseSession.auth.getUser();

        console.log('[API/UNLINK] user:', user?.id, 'authError:', authError?.message);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized — sessão inválida ou expirada.' }, { status: 401 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // SEGURANÇA: verificar que a instalação pertence ao usuário logado
        const { data: installation, error: fetchError } = await supabase
            .from('installations')
            .select('id, user_id')
            .eq('id', installation_id)
            .maybeSingle();

        console.log('[API/UNLINK] installation:', installation, 'fetchError:', fetchError?.message);

        if (fetchError) {
            console.error('[API/UNLINK] Erro ao buscar instalação:', fetchError);
            return NextResponse.json({ error: 'Erro ao verificar instalação.' }, { status: 500 });
        }

        if (!installation) {
            return NextResponse.json({ error: 'Instalação não encontrada.' }, { status: 404 });
        }

        if (installation.user_id && installation.user_id !== user.id) {
            console.warn(`[API/UNLINK] ACESSO NEGADO: user ${user.id} tentou desvincular instalação de ${installation.user_id}`);
            return NextResponse.json({ error: 'Forbidden — você não é dono desta instalação.' }, { status: 403 });
        }

        // Desvincular: user_id = null
        const { error: updateError } = await supabase
            .from('installations')
            .update({
                user_id: null,
                updated_at: new Date().toISOString()
            })
            .eq('id', installation_id);

        if (updateError) {
            console.error('[API/UNLINK] Erro ao desvincular:', updateError);
            throw updateError;
        }

        console.log(`[API/UNLINK] ✅ Instalação ${installation_id} desvinculada com sucesso.`);

        // Limpar comandos pendentes — opcional, não falha se tabela não existir
        try {
            await supabase
                .from('device_commands')
                .delete()
                .eq('installation_id', installation_id)
                .eq('status', 'pending');
        } catch (cmdError) {
            console.warn('[API/UNLINK] Aviso: não foi possível limpar device_commands (não crítico):', cmdError);
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('[API/UNLINK] ❌ ERRO CRÍTICO:', error?.message, error?.code);
        return NextResponse.json({ error: error?.message || 'Erro interno ao desvincular.' }, { status: 500 });
    }
}
