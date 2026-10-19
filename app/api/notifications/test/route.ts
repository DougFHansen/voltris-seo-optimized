import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/utils/supabase/server';
import { NotificationService } from '@/services/notificationService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * TESTE REAL DO SISTEMA DE NOTIFICAÇÕES.
 *
 * O botão "Testar" do painel (cliente e admin) precisa provar que o
 * FUNCIONAMENTO INTEIRO está de pé:
 *
 *   1. a notificação entra na lista (in-app) do próprio usuário;
 *   2. o Web Push é enviado para os dispositivos inscritos dele;
 *   3. a resposta traz o resultado real ("2 dispositivos avisados",
 *      "nenhum dispositivo inscrito") — nada de "deu tudo certo" na cara.
 *
 * A notificação de teste é gravada com `kind: 'system'` e fica marcada como
 * teste em `data`, para o painel conseguir distinguir (e limpar) depois.
 */

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/** Evita spam: 1 teste a cada 10 segundos por usuário. */
const ultimoTeste = new Map<string, number>();
const INTERVALO_MS = 10_000;

async function usuarioDaSessao(req: NextRequest): Promise<string | null> {
    // 1) Sessão pelo cookie (mesma via do resto do painel).
    try {
        const sessao = await createServerClient();
        const { data } = await sessao.auth.getUser();
        if (data?.user?.id) return data.user.id;
    } catch { /* sem cookie: tenta o token */ }

    // 2) Token Bearer (usado pelos clientes que já têm a sessão em memória).
    const auth = req.headers.get('authorization');
    if (!auth?.toLowerCase().startsWith('bearer ')) return null;
    const token = auth.slice(7).trim();
    if (!token) return null;
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user?.id) return null;
    return data.user.id;
}

export async function POST(req: NextRequest) {
    const userId = await usuarioDaSessao(req);
    if (!userId) {
        return NextResponse.json(
            { ok: false, erro: 'Sessão inválida ou expirada. Entre novamente.' },
            { status: 401 }
        );
    }

    const agora = Date.now();
    const anterior = ultimoTeste.get(userId) ?? 0;
    if (agora - anterior < INTERVALO_MS) {
        return NextResponse.json(
            { ok: false, erro: 'Aguarde alguns segundos antes de testar de novo.' },
            { status: 429 }
        );
    }
    ultimoTeste.set(userId, agora);

    const titulo = 'VOLTRIS — notificação de teste';
    const mensagem =
        'Se você leu isto, o sistema de notificações está funcionando: aviso dentro do site e aviso com o site fechado.';

    // 1) In-app: a notificação entra na lista do próprio usuário.
    let inApp = false;
    try {
        await NotificationService.notify({
            recipients: [userId],
            kind: 'system',
            title: titulo,
            message: mensagem,
            actionUrl: '/dashboard',
            data: { teste: true },
            audience: 'user',
            semPush: true,
        });
        inApp = true;
    } catch (e: any) {
        return NextResponse.json(
            {
                ok: false,
                erro: `Não foi possível registrar a notificação: ${e?.message ?? 'erro desconhecido'}`,
            },
            { status: 500 }
        );
    }

    // 2) Web Push: aviso real para os dispositivos inscritos.
    let push: { enviados: number; motivo?: string } = { enviados: 0 };
    try {
        push = await NotificationService.sendWebPush({
            recipients: [userId],
            kind: 'system',
            title: titulo,
            message: mensagem,
            actionUrl: '/dashboard',
            data: { teste: true },
        });
    } catch (e: any) {
        push = { enviados: 0, motivo: e?.message ?? 'falha no envio' };
    }

    return NextResponse.json({
        ok: true,
        inApp,
        push,
        mensagem:
            push.enviados > 0
                ? `Notificação de teste enviada para ${push.enviados} dispositivo(s).`
                : 'Notificação de teste registrada no painel. Nenhum dispositivo inscrito para receber avisos ainda.',
    });
}
