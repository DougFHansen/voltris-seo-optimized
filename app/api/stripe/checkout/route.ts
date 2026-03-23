import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/utils/supabase/admin';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://voltris.com.br';

const PRICE_MAP: Record<string, Record<'month' | 'year', { name: string; amount: number }>> = {
  standard: {
    month: { name: 'Licença Standard Mensal', amount: 49.90 },
    year:  { name: 'Licença Standard Anual',  amount: 369.90 },
  },
  pro: {
    month: { name: 'Licença Pro Gamer Mensal', amount: 349.90 },
    year:  { name: 'Licença Pro Gamer Anual',  amount: 789.90 },
  },
  enterprise: {
    month: { name: 'Licença Enterprise Mensal', amount: 1490.90 },
    year:  { name: 'Licença Enterprise Anual',  amount: 5489.90 },
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { license_type, user_id, customer_email, customer_name, billing_period = 'month' } = body;

    const planData = PRICE_MAP[license_type]?.[billing_period as 'month' | 'year'];
    if (!planData) {
      return NextResponse.json({ error: 'Plano ou período inválido' }, { status: 400 });
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
      amount: planData.amount,
      status: 'pending'
    }]);

    // 2. Criar a sessão no Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: planData.name,
              description: `Assinatura ${billing_period === 'month' ? 'Mensal' : 'Anual'} - Voltris Optimizer`,
            },
            unit_amount: Math.round(planData.amount * 100),
            recurring: { interval: billing_period as 'month' | 'year' },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${BASE_URL}/dashboard?checkout_success=true&ref=${referenceId}`,
      cancel_url: `${BASE_URL}/adquirir-licenca`,
      customer_email: customer_email,
      metadata: {
        reference_id: referenceId,
        user_id: user_id,
        license_type: license_type,
        billing_period: billing_period,
      },
    });

    return NextResponse.json({ id: session.id, url: session.url });

  } catch (error: any) {
    console.error('[STRIPE CHECKOUT ERROR]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
