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

            console.log(`[STRIPE WEBHOOK] Checkout completado para ${email} (Ref: ${referenceId}, Tipo: ${type})`);

            // 1. Atualiza status do pagamento no Supabase
            await supabase.from('payments')
                .update({ status: 'approved', pagbank_id: session.id })
                .eq('reference_id', referenceId);

            // 2. Registra a assinatura (apenas se for licença)
            if (subscriptionId) {
                await supabase.from('subscriptions').upsert({
                    reference_id: referenceId,
                    pagbank_subscription_id: subscriptionId,
                    user_id: userId || null,
                    email: email,
                    plan_type: licenseType,
                    billing_period: billingPeriod,
                    status: 'ACTIVE'
                }, { onConflict: 'pagbank_subscription_id' });
            }

            // 3. Chama o RPC apenas para licenças
            if (type === 'license') {
                const { data, error } = await supabase.rpc('generate_complete_license_v3', {
                    p_payment_id: null,
                    p_user_id: userId,
                    p_email: email,
                    p_plan_type: licenseType,
                    p_billing_period: billingPeriod
                });

                if (error) {
                    console.error('[STRIPE WEBHOOK] Erro ao gerar licença:', error);
                } else {
                    console.log(`[STRIPE WEBHOOK] Licença ${billingPeriod} gerada com sucesso.`);

                    // A RPC grava a chave, mas o vinculo com a conta (user_id)
                    // precisa ser persistido: sem isso a licença não aparece no
                    // painel do cliente. Preenchido aqui, de forma idempotente.
                    const generatedKey =
                        (data as { license_key?: string } | null)?.license_key ?? null;

                    if (generatedKey) {
                        const patch: Record<string, unknown> = {
                            license_display_name: (licenseType ?? 'standard').toUpperCase(),
                        };
                        if (userId) patch.user_id = userId;
                        if (email) patch.email = email;

                        const { error: linkError } = await supabase
                            .from('licenses')
                            .update(patch)
                            .eq('license_key', generatedKey);

                        if (linkError) {
                            console.error('[STRIPE WEBHOOK] Erro ao vincular licença ao usuário:', linkError);
                        }
                    }
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
