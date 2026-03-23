import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/utils/supabase/admin';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://voltris.com.br';

const PLAN_CONFIG: Record<string, { name: string; amount: number; interval: 'year' | 'month' | null }> = {
  standard:   { name: 'Licença Standard Anual',      amount: 1.00,  interval: 'year' },
  pro:        { name: 'Licença Pro Gamer Anual',     amount: 1.00,  interval: 'year' },
  enterprise: { name: 'Licença Enterprise Vitalícia', amount: 1.00,  interval: null }, // Vitalício pode ser pagamento único
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { license_type, user_id, customer_email, customer_name } = body;

    const plan = PLAN_CONFIG[license_type];
    if (!plan) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });
    }

    const referenceId = `stripe_${Date.now()}`;
    const supabase = createAdminClient();

    // 1. Gravar intenção de pagamento no Supabase
    await supabase.from('payments').insert([{
      reference_id: referenceId,
      user_id: user_id || null,
      email: customer_email,
      customer_name: customer_name || 'Cliente Voltris',
      plan_type: license_type,
      amount: plan.amount,
      status: 'pending'
    }]);

    // 2. Criar a sessão no Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Adicione 'pix' se a conta stripe brasil suportar no modo checkout
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: plan.name,
              description: `Ativação da licença ${license_type.toUpperCase()} - Voltris`,
            },
            unit_amount: Math.round(plan.amount * 100), // Preço correto em centavos
            // Se for recorrente, adicionamos o intervalo
            ...(plan.interval ? { recurring: { interval: plan.interval } } : {}),
          },
          quantity: 1,
        },
      ],
      mode: plan.interval ? 'subscription' : 'payment',
      success_url: `${BASE_URL}/dashboard?checkout_success=true&ref=${referenceId}`,
      cancel_url: `${BASE_URL}/adquirir-licenca`,
      customer_email: customer_email,
      metadata: {
        reference_id: referenceId,
        user_id: user_id,
        license_type: license_type,
      },
    });

    return NextResponse.json({ id: session.id, url: session.url });

  } catch (error: any) {
    console.error('[STRIPE CHECKOUT ERROR]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
