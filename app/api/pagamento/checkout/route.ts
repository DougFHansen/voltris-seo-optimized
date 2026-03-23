import { NextRequest, NextResponse } from 'next/server';
import { createPaymentLink, getPaymentLink } from '@/lib/pagbank-client';
import { createAdminClient } from '@/utils/supabase/admin';

export const runtime = 'nodejs';

const PLAN_CONFIG: Record<string, { name: string; amountCents: number }> = {
  standard:   { name: 'Licença Standard Anual — Voltris',       amountCents: 14990  },
  pro:        { name: 'Licença Pro Gamer Anual — Voltris',      amountCents: 44990  },
  enterprise: { name: 'Licença Enterprise Vitalícia — Voltris', amountCents: 149090 },
};

export async function POST(req: NextRequest) {
  const requestId = `checkout-${Date.now()}`;

  try {
    const body = await req.json();
    const { customer, license_type = 'standard', user_id } = body;

    if (!customer?.email) {
      return NextResponse.json({ error: 'Email obrigatório' }, { status: 400 });
    }

    const plan = PLAN_CONFIG[license_type] ?? PLAN_CONFIG['standard'];
    const supabase = createAdminClient();
    const referenceId = `VOLTRIS-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://voltris.com.br';
    const webhookToken = process.env.PAGBANK_WEBHOOK_AUTH_TOKEN;

    console.log(`[CHECKOUT ${requestId}] ${license_type} para ${customer.email}`);

    // 1. Persistir no banco
    try {
      await supabase.from('payments').insert([{
        reference_id: referenceId,
        user_id: user_id || null,
        email: customer.email,
        customer_name: (customer.name || 'Cliente Voltris').substring(0, 200),
        plan_type: license_type,
        amount: plan.amountCents / 100,
        status: 'pending',
      }]);
    } catch (e) {
      console.error(`[CHECKOUT ${requestId}] Erro Supabase:`, e);
    }

    // 2. Criar Payment Link via proxy Cloudflare Worker
    const checkoutResponse = await createPaymentLink({
      name: plan.name,
      reference_id: referenceId,
      expiration_date: '2030-12-31T23:59:59-03:00',
      customer: {
        name: customer.name || 'Cliente Voltris',
        email: customer.email,
      },
      items: [{
        reference_id: license_type,
        name: plan.name,
        quantity: 1,
        unit_amount: plan.amountCents,
      }],
      payment_methods: [
        { type: 'CREDIT_CARD' },
        { type: 'PIX' },
        { type: 'BOLETO' },
      ],
      notification_urls: [`${baseUrl}/api/webhook/pagbank?auth=${webhookToken}`],
      redirect_url: `${baseUrl}/dashboard?checkout_success=true&ref=${referenceId}&tab=licenses`,
    });

    const paymentUrl = getPaymentLink(checkoutResponse);

    if (!paymentUrl) {
      console.error(`[CHECKOUT ${requestId}] Sem URL na resposta:`, checkoutResponse);
      throw new Error('PagBank não retornou URL de pagamento.');
    }

    console.log(`[CHECKOUT ${requestId}] ✅ URL gerada: ${paymentUrl}`);

    return NextResponse.json({
      success: true,
      checkout_url: paymentUrl,
      reference_id: referenceId,
    });

  } catch (error: any) {
    console.error(`[CHECKOUT ${requestId}] Falha:`, error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
