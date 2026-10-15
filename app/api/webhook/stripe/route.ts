import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/utils/supabase/admin';

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
    const payload = await req.text();
    const sig = req.headers.get('stripe-signature')!;

    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, WEBHOOK_SECRET!);
    } catch (err: any) {
        console.error(`⚠️ Webhook error: ${err.message}`);
        return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Eventos principais que nos interessam
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            const referenceId = session.metadata?.reference_id;
            const email = session.customer_email || session.metadata?.customer_email;
            const licenseType = session.metadata?.license_type;
            const userId = session.metadata?.user_id;
            const billingPeriod = session.metadata?.billing_period || 'month';
            const subscriptionId = session.subscription as string;

            const type = session.metadata?.type || 'license';

            console.log(`[STRIPE WEBHOOK] Checkout completado para ${email} (Ref: ${referenceId}, Tipo: ${type}, payment_status: ${session.payment_status})`);

            // 1. Localiza o pagamento REAL criado pelo checkout. A emissao so e
            //    feita contra um payment_id verdadeiro (idempotencia da RPC).
            //    O update antigo usava `pagbank_id`, coluna inexistente em
            //    public.payments — falhava silenciosamente e nao aprovava nada.
            const { data: payRow, error: payLookupError } = await supabase
                .from('payments')
                .select('id, status, plan_type, user_id, email')
                .eq('reference_id', referenceId)
                .maybeSingle();

            if (payLookupError) {
                console.error('[STRIPE WEBHOOK] Erro ao buscar pagamento:', payLookupError);
            }

            // 2. Registra a assinatura (apenas se for licença)
            if (subscriptionId) {
                await supabase.from('subscriptions').upsert({
                    reference_id: referenceId,
                    pagbank_subscription_id: subscriptionId,
                    user_id: userId || null,
                    email: email,
                    plan_type: licenseType,
                    billing_period: billingPeriod,
                    status: session.payment_status === 'paid' ? 'ACTIVE' : 'TRIALING'
                }, { onConflict: 'pagbank_subscription_id' });
            }

            // 3. Chama o RPC apenas para licencas
            if (type === 'license') {
                // Gate de liquidacao (item 6): so emite com pagamento liquidado
                // na Stripe. Sem prova de liquidacao, nada e emitido nem aprovado.
                if (session.payment_status !== 'paid') {
                    console.warn(`[STRIPE WEBHOOK] Sessao ${session.id} com payment_status="${session.payment_status}"; emissao adiada (invoice.paid cuidara da cobranca recorrente).`);
                    break;
                }

                let paymentId: string | null = payRow?.id ?? null;

                if (!paymentId) {
                    // Recuperacao deterministica: o checkout nao registrou o
                    // pagamento. Cria a linha com o stripe_id da sessao (prova
                    // de liquidacao) para entao emitir contra seu id real.
                    const { data: created, error: createErr } = await supabase
                        .from('payments')
                        .insert({
                            reference_id: referenceId,
                            provider: 'stripe',
                            stripe_id: session.id,
                            status: 'pending',
                            user_id: userId || null,
                            email: email,
                            plan_type: licenseType,
                            billing_period: billingPeriod,
                            amount: (session.amount_total ?? 0) / 100,
                        })
                        .select('id')
                        .single();

                    if (createErr || !created) {
                        console.error('[STRIPE WEBHOOK] Falha ao registrar pagamento da sessao:', createErr);
                        return NextResponse.json({ error: 'PAYMENT_REGISTRATION_FAILED' }, { status: 500 });
                    }
                    paymentId = created.id;
                }

                const { data, error } = await supabase.rpc('generate_complete_license_v3', {
                    p_payment_id: paymentId,
                    p_user_id: userId || null,
                    p_email: email,
                    p_plan_type: licenseType,
                    p_billing_period: billingPeriod,
                    p_stripe_session_id: session.id
                });

                if (error) {
                    // Sem NULL silencioso (item 4): a RPC canonica agora RAISE
                    // excecoes explicitas; responder 500 faz a Stripe reenviar.
                    console.error('[STRIPE WEBHOOK] Erro explicito na RPC de emissao:', error);
                    return NextResponse.json({ error: 'LICENSE_ISSUE_FAILED', detail: error.message }, { status: 500 });
                }

                const issuedKey = (data as { license_key?: string } | null)?.license_key ?? null;
                if (issuedKey) {
                    console.log(`[STRIPE WEBHOOK] Licenca ${billingPeriod} ok (${issuedKey.slice(0, 12)}…); vinculo user/payment e aprovacao do pagamento ocorreram na mesma transacao da RPC.`);
                } else {
                    console.error('[STRIPE WEBHOOK] RPC respondeu sem license_key — tratar como falha:', data);
                    return NextResponse.json({ error: 'LICENSE_ISSUE_MALFORMED' }, { status: 500 });
                }
            } else {
                console.log(`[STRIPE WEBHOOK] Serviço ${licenseType} registrado como aprovado.`);
            }

            break;
        }

        case 'invoice.paid': {
            const invoice = event.data.object as any;
            const subscriptionId = invoice.subscription as string;
            
            if (subscriptionId) {
                console.log(`[STRIPE WEBHOOK] Renovação: Fatura paga (${invoice.id}) para ${invoice.customer_email}`);
                // Chama a renovação no Supabase
                const { data, error } = await supabase.rpc('renew_subscription_license', {
                    p_subscription_pagbank_id: subscriptionId,
                    p_payment_id: null
                });
                
                if (error) console.error('[STRIPE WEBHOOK] Erro ao renovar via RPC:', error);
                else console.log('[STRIPE WEBHOOK] ✅ Renovação processada com sucesso.');
            }
            break;
        }

        case 'customer.subscription.deleted':
        case 'invoice.payment_failed': {
            const obj = event.data.object as any;
            const subscriptionId = (obj.subscription || obj.id) as string;
            
            console.log(`[STRIPE WEBHOOK] Assinatura cancelada ou falha: ${subscriptionId}`);

            // 1. Atualiza status da assinatura
            const { data: sub } = await supabase.from('subscriptions')
                .update({ status: 'CANCELED', updated_at: new Date().toISOString() })
                .eq('pagbank_subscription_id', subscriptionId)
                .select()
                .single();

            if (sub) {
                // 2. Revoga as licenças vinculadas.
                // Schema canônico: revogação é `revoked = true` e o plano é
                // `plan_type`. O código antigo usava `is_active`/`email`/
                // `license_type`, colunas que não existem em public.licenses
                // (42703 em cancelamento).
                //
                // Sem `.or()` com e-mail: o PostgREST exige aspas em valores de
                // filtro com caracteres especiais e o supabase-js não as aplica.
                // Busca por user_id e, se não houver, por customer_email.
                const patch = { revoked: true, notes: 'Cancelada via Stripe' };

                const byUser = sub.user_id
                    ? await supabase
                          .from('licenses')
                          .update(patch)
                          .eq('plan_type', sub.plan_type)
                          .eq('user_id', sub.user_id)
                          .select('license_key')
                    : { data: null, error: null };

                if (byUser.error) {
                    console.error('[STRIPE WEBHOOK] Erro ao revogar por user_id:', byUser.error);
                } else if (!byUser.data || byUser.data.length === 0) {
                    const byEmail = await supabase
                        .from('licenses')
                        .update(patch)
                        .eq('plan_type', sub.plan_type)
                        .eq('customer_email', sub.email)
                        .select('license_key');

                    if (byEmail.error) {
                        console.error('[STRIPE WEBHOOK] Erro ao revogar por e-mail:', byEmail.error);
                    } else {
                        console.log(
                            `[STRIPE WEBHOOK] ${byEmail.data?.length ?? 0} licença(s) de ${sub.email} revogada(s).`
                        );
                    }
                } else {
                    console.log(
                        `[STRIPE WEBHOOK] ${byUser.data.length} licença(s) de ${sub.email} revogada(s).`
                    );
                }
            }
            break;
        }

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
