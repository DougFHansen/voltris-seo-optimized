import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import {
    SERVICE_CATALOG,
    resolveLicenseProduct,
    type PlanType,
} from '@/lib/license-catalog';
import {
    startOperation,
    getOrCreateCorrelationId,
    logSuccess,
    logError,
    logSupabaseError,
    maskEmail,
} from '@/lib/voltris-log';

export const runtime = 'nodejs';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.voltris.com.br';

/**
 * Texto legal exibido NA PÁGINA DE CHECKOUT da Stripe, antes do pagamento
 * (missão §3: "O usuário deverá ser informado claramente, antes de pagar,
 * sobre valor, frequência, renovação automática e condições de cancelamento").
 *
 * `submit.message` aparece no rodapé do botão "Assinar", ou seja, no momento
 * em que o cliente ainda pode desistir.
 */
const RENEWAL_DISCLOSURE = [
    'Assinatura recorrente VOLTRIS: será cobrada automaticamente a cada período contratado.',
    'Você pode cancelar a renovação a qualquer momento no seu painel, sem multa, e continua com acesso até o fim do período já pago.',
    'Direito de arrependimento: reembolso integral em até 7 dias corridos após a contratação.',
].join(' ');

function recurrenceLabel(period: string): string {
    return period === 'year' ? 'anualmente' : 'mensalmente';
}

/**
 * Localiza (ou cria) o Stripe Customer do usuário e grava o cus_ no banco.
 *
 * Por que isso era obrigatório e não estava feito: sem `customer`, a Stripe
 * cria um customer novo a cada checkout e o `cancel`/`refund`/`portal` antigos
 * só conseguiam achar a assinatura adivinhando pelo e-mail — caminho que a
 * missão proíbe ("Não usar apenas o e-mail como prova de propriedade").
 */
async function resolveOrCreateCustomer(
    userId: string,
    email: string,
    fullName: string | null
): Promise<string> {
    // 1. Preferência: assinatura já espelhada no banco (fonte local confiável).
    const admin = createAdminClient();
    const { data: fromSub } = await admin
        .from('subscriptions')
        .select('stripe_customer_id')
        .eq('user_id', userId)
        .not('stripe_customer_id', 'is', null)
        .limit(1)
        .maybeSingle();

    if (fromSub?.stripe_customer_id) {
        if (await customerIsAlive(fromSub.stripe_customer_id)) return fromSub.stripe_customer_id;
    }

    // 2. Segundo melhor: cobrança anterior deste usuário.
    const { data: fromPay } = await admin
        .from('payments')
        .select('stripe_customer_id')
        .eq('user_id', userId)
        .not('stripe_customer_id', 'is', null)
        .limit(1)
        .maybeSingle();

    if (fromPay?.stripe_customer_id) {
        if (await customerIsAlive(fromPay.stripe_customer_id)) return fromPay.stripe_customer_id;
    }

    // 3. E-mail exato no Stripe (evita duplicar cliente em migrações antigas).
    const existing = await stripe.customers.list({ email, limit: 10 });
    const exact = existing.data.find(
        (c) => !c.deleted && (c.email ?? '').toLowerCase() === email.toLowerCase()
    );
    if (exact) return exact.id;

    // 4. Novo cliente.
    const created = await stripe.customers.create({
        email,
        name: fullName || undefined,
        metadata: { supabase_user_id: userId, source: 'voltris.com.br' },
    });
    return created.id;
}

/** Um cliente removido na Stripe não pode ser reutilizado (o checkout falharia). */
async function customerIsAlive(customerId: string): Promise<boolean> {
    try {
        const customer = await stripe.customers.retrieve(customerId);
        return (customer as { deleted?: boolean }).deleted !== true;
    } catch {
        return false;
    }
}

/**
 * POST /api/stripe/checkout
 *
 * Correcoes da auditoria (missao secoes 2, 3 e 9):
 *  - usuario/email sai da SESSAO (cookie), nunca do body do navegador;
 *  - plano/periodo validados contra o catalogo canonico (lib/license-catalog);
 *  - preco definido SO no servidor;
 *  - Stripe Customer criado/reutilizado e persistido (strk_customer_id);
 *  - metadados da assinatura gravados em `subscription_data.metadata`, para que
 *    `customer.subscription.created` chegue completo mesmo fora de ordem;
 *  - disclosure de renovacao AUTOMATICA mostrado na Stripe antes do pagamento;
 *  - payments gravado completo (provider/billing_period/invoice_kind) com erro
 *    verificado;
 *  - log estruturado com correlation id.
 */
export async function POST(req: NextRequest) {
    const correlationId = getOrCreateCorrelationId(req);
    const ctx = startOperation('STRIPE_CHECKOUT', correlationId);

    try {
        const body = await req.json().catch(() => ({}));
        const licenseType = String(body.license_type ?? '').toLowerCase();
        const billingPeriod = String(body.billing_period ?? 'month');

        // 1. Identidade: sessao autenticada e a unica fonte de user_id/email.
        const auth = await createClient();
        const { data: sessionData, error: authError } = await auth.auth.getUser();
        const user = sessionData?.user ?? null;

        if (authError || !user) {
            logError(ctx, 'checkout sem sessao autenticada', { ip: req.headers.get('x-forwarded-for') });
            return NextResponse.json(
                { error: 'Faça login para comprar uma licença.' },
                { status: 401 }
            );
        }
        ctx.userId = user.id;

        const service = SERVICE_CATALOG[licenseType];
        const product = resolveLicenseProduct(licenseType, billingPeriod);

        if (!product && !service) {
            return NextResponse.json({ error: 'Plano ou serviço inválido' }, { status: 400 });
        }

        const isLicense = !!product;
        const mode = isLicense ? 'subscription' : 'payment';
        const name = isLicense ? product.name : service.name;
        const amount = isLicense ? product.amount : service.amount;
        const referenceId = `${isLicense ? 'st' : 'sv'}_${Date.now()}`;
        const email = user.email!;
        const fullName = (user.user_metadata?.full_name as string | undefined) ?? null;

        const supabase = createAdminClient();

        // 2. Stripe Customer: criado/reutilizado e persistido.
        const customerId = await resolveOrCreateCustomer(user.id, email, fullName);

        // 3. Registrar intencao de pagamento (erro verificado — sem silent fail).
        const { error: payInsertError } = await supabase.from('payments').insert([{
            reference_id: referenceId,
            provider: 'stripe',
            user_id: user.id,
            email,
            customer_name: fullName || 'Cliente Voltris',
            customer_name_snapshot: fullName || 'Cliente Voltris',
            stripe_customer_id: customerId,
            plan_type: licenseType,
            billing_period: isLicense ? billingPeriod : null,
            amount,
            currency: 'BRL',
            status: 'pending',
            invoice_kind: isLicense ? 'purchase' : 'service',
        }]);

        if (payInsertError) {
            logSupabaseError(ctx, 'registrar pagamento pendente', payInsertError);
            return NextResponse.json({ error: 'Não foi possível iniciar o pagamento' }, { status: 500 });
        }

        // 4. Linha unica de item. Quando existe Price ID oficial cadastrado no
        //    catálogo, ele é usado (autoridade da Stripe para plano/intervalo);
        //    senão cai para price_data ad-hoc, que é o comportamento atual e
        //    não pode ser quebrado por quem não criou os preços ainda.
        const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = product?.stripePriceId
            ? { price: product.stripePriceId, quantity: 1 }
            : {
                price_data: {
                    currency: 'brl',
                    product_data: {
                        name,
                        description: isLicense
                            ? `Assinatura ${billingPeriod === 'month' ? 'Mensal' : 'Anual'} - Voltris Optimizer`
                            : 'Serviço Profissional Voltris',
                    },
                    unit_amount: Math.round(amount * 100),
                    ...(isLicense ? { recurring: { interval: product!.period } } : {}),
                } as Stripe.Checkout.SessionCreateParams.LineItem.PriceData,
                quantity: 1,
            };

        const subscriptionMetadata: Record<string, string> = isLicense
            ? {
                reference_id: referenceId,
                user_id: user.id,
                license_type: (product!.plan as PlanType),
                billing_period: product!.period,
                type: 'license',
            }
            : {};

        const sessionOptions: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            line_items: [lineItem],
            mode,
            customer: customerId,
            // Vincula a sessão ao usuário no próprio Stripe: a reconciliação
            // admin passa a conseguir casar pendência sem depender de e-mail.
            client_reference_id: referenceId,
            success_url: `${BASE_URL}/dashboard?checkout_success=true&type=${isLicense ? 'license' : 'service'}&ref=${referenceId}`,
            cancel_url: isLicense ? `${BASE_URL}/adquirir-licenca` : `${BASE_URL}/servicos`,
            metadata: {
                reference_id: referenceId,
                user_id: user.id,
                license_type: isLicense ? product!.plan : licenseType,
                billing_period: isLicense ? product!.period : '',
                type: isLicense ? 'license' : 'service',
                customer_email: email,
            },
            ...(isLicense
                ? {
                    subscription_data: { metadata: subscriptionMetadata },
                    custom_text: { submit: { message: RENEWAL_DISCLOSURE } },
                }
                : {}),
        };

        const session = await stripe.checkout.sessions.create(sessionOptions);

        logSuccess(ctx, 'sessao stripe criada', {
            ref: referenceId,
            plan: licenseType,
            period: billingPeriod,
            user: maskEmail(email),
            session: session.id,
            customer: customerId,
            recurring: isLicense ? recurrenceLabel(billingPeriod) : null,
            price_id: product?.stripePriceId ?? 'price_data (ad-hoc)',
        });

        return NextResponse.json({ id: session.id, url: session.url });
    } catch (error: any) {
        logError(ctx, 'checkout falhou', { error: error?.message });
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}