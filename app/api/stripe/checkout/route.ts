import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/utils/supabase/admin';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://voltris.com.br';

const PRICE_MAP: Record<string, any> = {
  // Licenças (Assinaturas)
  standard: {
    month: { name: 'Licença Standard Mensal', amount: 49.90, mode: 'subscription' },
    year:  { name: 'Licença Standard Anual',  amount: 369.90, mode: 'subscription' },
  },
  pro: {
    month: { name: 'Licença Pro Gamer Mensal', amount: 349.90, mode: 'subscription' },
    year:  { name: 'Licença Pro Gamer Anual',  amount: 789.90, mode: 'subscription' },
  },
  enterprise: {
    month: { name: 'Licença Enterprise Mensal', amount: 1490.90, mode: 'subscription' },
    year:  { name: 'Licença Enterprise Anual',  amount: 5489.90, mode: 'subscription' },
  },
  // Serviços (Pagamento Único)
  formatacao_basica: { name: 'Formatação Básica', amount: 99.90, mode: 'payment' },
  formatacao_media: { name: 'Formatação Média', amount: 149.90, mode: 'payment' },
  formatacao_avancada: { name: 'Formatação Avançada', amount: 199.90, mode: 'payment' },
  formatacao_corporativa: { name: 'Formatação Corporativa', amount: 349.90, mode: 'payment' },
  formatacao_gamer: { name: 'Formatação Gamer', amount: 449.90, mode: 'payment' },
  otimizacao_basica: { name: 'Otimização Básica', amount: 79.90, mode: 'payment' },
  otimizacao_media: { name: 'Otimização Média', amount: 99.90, mode: 'payment' },
  otimizacao_avancada: { name: 'Otimização Avançada', amount: 149.90, mode: 'payment' },
  correcao_windows: { name: 'Correção de Erros no Windows', amount: 49.90, mode: 'payment' },
  impressora_basica: { name: 'Instalação de Impressora', amount: 49.90, mode: 'payment' },
  virus_basica: { name: 'Remoção de Vírus', amount: 39.90, mode: 'payment' },
  recuperacao_basica: { name: 'Recuperação Básica', amount: 100.00, mode: 'payment' },
  recuperacao_media: { name: 'Recuperação Média', amount: 150.00, mode: 'payment' },
  recuperacao_avancada: { name: 'Recuperação Avançada', amount: 200.00, mode: 'payment' },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { license_type, user_id, customer_email, customer_name, billing_period = 'month' } = body;

    let itemData = PRICE_MAP[license_type];
    if (itemData && itemData[billing_period]) {
        itemData = itemData[billing_period];
    }

    if (!itemData) {
      return NextResponse.json({ error: 'Plano ou serviço inválido' }, { status: 400 });
    }

    const mode = itemData.mode || 'subscription';
    const referenceId = `${mode === 'payment' ? 'sv' : 'st'}_${Date.now()}`;
    const supabase = createAdminClient();

    // 1. Gravar intenção de pagamento no Supabase
    await supabase.from('payments').insert([{
      reference_id: referenceId,
      user_id: user_id || null,
      email: customer_email,
      customer_name: customer_name || 'Cliente Voltris',
      plan_type: license_type,
      amount: itemData.amount,
      status: 'pending'
    }]);

    // 2. Criar a sessão no Stripe
    const sessionOptions: any = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: itemData.name,
              description: mode === 'payment' ? 'Serviço Profissional Voltris' : `Assinatura ${billing_period === 'month' ? 'Mensal' : 'Anual'} - Voltris Optimizer`,
            },
            unit_amount: Math.round(itemData.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: `${BASE_URL}/dashboard?checkout_success=true&type=${mode === 'payment' ? 'service' : 'license'}&ref=${referenceId}`,
      cancel_url: mode === 'payment' ? `${BASE_URL}/servicos` : `${BASE_URL}/adquirir-licenca`,
      customer_email: customer_email,
      metadata: {
        reference_id: referenceId,
        user_id: user_id,
        license_type: license_type,
        billing_period: mode === 'subscription' ? billing_period : null,
        type: mode === 'payment' ? 'service' : 'license'
      },
    };

    if (mode === 'subscription') {
      sessionOptions.line_items[0].price_data.recurring = { interval: billing_period as 'month' | 'year' };
    }

    const session = await stripe.checkout.sessions.create(sessionOptions);

    return NextResponse.json({ id: session.id, url: session.url });

  } catch (error: any) {
    console.error('[STRIPE CHECKOUT ERROR]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
