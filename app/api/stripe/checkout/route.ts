import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import {
    SERVICE_CATALOG,
    resolveLicenseProduct,
} from '@/lib/license-catalog';
import {
    startOperation,
    getOrCreateCorrelationId,
    logSuccess,
    logError,
    logSupabaseError,
    maskEmail,
} from '@/lib/voltris-log';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.voltris.com.br';

/**
 * POST /api/stripe/checkout
 *
 * Correcoes da auditoria (missao secoes 2 e 9):
 *  - usuario/email sai da SESSAO (cookie), nunca do body do navegador;
 *  - plano/periodo validados contra o catalogo canonico (lib/license-catalog);
 *  - preco definido SO no servidor;
 *  - payments gravado completo (provider/billing_period) com erro verificado;
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

        const supabase = createAdminClient();

        // 2. Registrar intencao de pagamento (erro verificado — sem silent fail).
        const { error: payInsertError } = await supabase.from('payments').insert([{
            reference_id: referenceId,
            provider: 'stripe',
            user_id: user.id,
            email,
            customer_name: user.user_metadata?.full_name || 'Cliente Voltris',
            plan_type: licenseType,
            billing_period: isLicense ? billingPeriod : null,
            amount,
            status: 'pending',
        }]);

        if (payInsertError) {
            logSupabaseError(ctx, 'registrar pagamento pendente', payInsertError);
            return NextResponse.json({ error: 'Não foi possível iniciar o pagamento' }, { status: 500 });
        }

        // 3. Sessao Stripe (preco sempre do servidor).
        const sessionOptions: any = {
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name,
                            description: isLicense
                                ? `Assinatura ${billingPeriod === 'month' ? 'Mensal' : 'Anual'} - Voltris Optimizer`
                                : 'Serviço Profissional Voltris',
                        },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            mode,
            success_url: `${BASE_URL}/dashboard?checkout_success=true&type=${isLicense ? 'license' : 'service'}&ref=${referenceId}`,
            cancel_url: isLicense ? `${BASE_URL}/adquirir-licenca` : `${BASE_URL}/servicos`,
            customer_email: email,
            metadata: {
                reference_id: referenceId,
                user_id: user.id,
                license_type: isLicense ? product.plan : licenseType,
                billing_period: isLicense ? product.period : '',
                type: isLicense ? 'license' : 'service',
            },
        };

        if (isLicense) {
            sessionOptions.line_items[0].price_data.recurring = { interval: product.period };
        }

        const session = await stripe.checkout.sessions.create(sessionOptions);

        logSuccess(ctx, 'sessao stripe criada', {
            ref: referenceId,
            plan: licenseType,
            period: billingPeriod,
            user: maskEmail(email),
            session: session.id,
        });

        return NextResponse.json({ id: session.id, url: session.url });
    } catch (error: any) {
        logError(ctx, 'checkout falhou', { error: error?.message });
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
