import { NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { licenseRateGuard, rateLimitedResponse } from '@/lib/license-rate-guard';
import {
    startOperation,
    getOrCreateCorrelationId,
    logSuccess,
    logWarn,
    logError,
    logSupabaseError,
    maskEmail,
    jsonWithCorrelation,
    errorWithCorrelation,
} from '@/lib/voltris-log';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/stripe/portal — Portal de cobrança da Stripe.
 *
 * Observação de escopo (missão §5): o botão do Portal foi REMOVIDO da tela de
 * licenças e substituído pela fatura PDF. Esta rota continua existindo porque
 * outros fluxos (atualização de cartão, download de recibo da Stripe) dependem
 * dela — o que a missão autoriza explicitamente.
 *
 * Correção real aplicada aqui: a versão anterior lia
 * `profiles.stripe_customer_id`, coluna que NÃO EXISTE no schema real de
 * `public.profiles`. A consulta falhava, `profile` vinha `undefined`, e o
 * código caía no `customers.list({ email })` — prova de propriedade por
 * e-mail, proibido pela missão §11. Agora o `cus_` vem de
 * `subscriptions.stripe_customer_id` / `payments.stripe_customer_id`, que são
 * gravados pelo checkout e pelo webhook a partir do UUID da sessão.
 */
export async function POST(req: NextRequest) {
    const correlationId = getOrCreateCorrelationId(req);
    const ctx = startOperation('STRIPE_PORTAL', correlationId);

    try {
        const supabase = await createClient();
        const { data: sessionData, error: authError } = await supabase.auth.getUser();
        const user = sessionData?.user ?? null;

        if (authError || !user) {
            return errorWithCorrelation(ctx, 401, 'UNAUTHORIZED', 'Não autorizado');
        }
        ctx.userId = user.id;

        const guard = licenseRateGuard('sync', req, user.id);
        if (!guard.allowed) {
            logWarn(ctx, 'PORTAL_RATE_LIMIT', { retryAfterSec: guard.retryAfterSec });
            return rateLimitedResponse(guard, correlationId);
        }

        const admin = createAdminClient();

        // 1) Assinatura do próprio usuário.
        const { data: subs, error: subErr } = await admin
            .from('subscriptions')
            .select('stripe_customer_id')
            .eq('user_id', user.id)
            .not('stripe_customer_id', 'is', null)
            .limit(1);
        if (subErr) logSupabaseError(ctx, 'buscar customer nas assinaturas', subErr);

        // 2) Cobrança do próprio usuário.
        const { data: pays } = await admin
            .from('payments')
            .select('stripe_customer_id')
            .eq('user_id', user.id)
            .not('stripe_customer_id', 'is', null)
            .limit(1);

        const customerId = subs?.[0]?.stripe_customer_id ?? pays?.[0]?.stripe_customer_id ?? null;

        if (!customerId) {
            return jsonWithCorrelation(
                ctx,
                {
                    error: 'Nenhuma cobrança encontrada para esta conta.',
                    code: 'NO_CUSTOMER',
                },
                404
            );
        }

        // 3) Confirma que o customer ainda existe na Stripe antes de abrir a
        //    sessão do portal (evita erro 500 opaco para o cliente).
        try {
            await stripe.customers.retrieve(customerId);
        } catch (err: any) {
            logError(ctx, 'customer registrado não existe mais na Stripe', {
                customer: customerId, error: String(err?.message ?? err).slice(0, 120),
            });
            return errorWithCorrelation(
                ctx, 404, 'CUSTOMER_NOT_FOUND',
                'Não localizamos sua conta no processador de pagamentos.'
            );
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.voltris.com.br'}/dashboard?tab=licenses`,
        });

        logSuccess(ctx, 'sessao do portal criada', { user: maskEmail(user.email), customer: customerId });

        return jsonWithCorrelation(ctx, { url: session.url });
    } catch (error: any) {
        logError(ctx, 'portal falhou', { error: error?.message });
        return errorWithCorrelation(ctx, 500, 'PORTAL_FAILED', 'Erro ao conectar com o financeiro.');
    }
}