import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * API para criar preferência de pagamento no Mercado Pago
 * 
 * Suporta:
 * - Diferentes planos (trial, pro, premium)
 * - Webhook para processamento automático
 * - Modo teste/produção
 * 
 * Query params:
 * - plan: tipo de licença (trial, pro, premium) - default: pro
 * - email: email do comprador (opcional)
 */
export async function GET(request) {
  try {
    // Verifica se o token está configurado
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'MP_ACCESS_TOKEN not configured' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Obter parâmetros da query
    const { searchParams } = new URL(request.url);
    const plan = searchParams.get('plan') || 'pro';
    const email = searchParams.get('email') || '';
    
    // Configurar preços e tipos de licença
    const planConfig = {
      trial: { price: 0, title: 'Licença Voltris - Trial', months: 0 },
      pro: { price: 49.90, title: 'Licença Voltris - Pro', months: 1 },
      premium: { price: 99.90, title: 'Licença Voltris - Premium', months: 3 },
    };
    
    const selectedPlan = planConfig[plan] || planConfig.pro;
    
    const client = new MercadoPagoConfig({
      accessToken: accessToken,
    });

    const preference = new Preference(client);
    
    // Domínio do site (pode ser variável de ambiente)
    const dominio = process.env.NEXT_PUBLIC_SITE_URL || 'https://voltris.com.br';
    
    // Criar registro de pagamento no banco ANTES de criar a preferência
    const supabase = await createClient();
    let paymentRecord = null;
    
    try {
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          email: email || 'unknown@example.com',
          license_type: plan,
          amount: selectedPlan.price,
          currency: 'BRL',
          status: 'pending',
        })
        .select()
        .single();
      
      if (paymentError) {
        console.error('[Pagamento] Erro ao criar registro:', paymentError);
      } else {
        paymentRecord = payment;
      }
    } catch (dbError) {
      console.error('[Pagamento] Erro ao acessar banco:', dbError);
      // Continuar mesmo se falhar (modo degradado)
    }
    
    // URL do webhook (Mercado Pago notificará aqui quando houver mudanças)
    const webhookUrl = `${dominio}/api/webhook/mercadopago`;
    
    const response = await preference.create({
      body: {
        items: [
          {
            id: `voltris-license-${plan}`,
            title: selectedPlan.title,
            description: `Licença ${plan.toUpperCase()} - ${selectedPlan.months} mês(es)`,
            quantity: 1,
            currency_id: 'BRL',
            unit_price: selectedPlan.price,
          }
        ],
        payer: email ? {
          email: email,
        } : undefined,
        back_urls: {
          success: `${dominio}/sucesso?preference_id={preference_id}`,
          failure: `${dominio}/falha?preference_id={preference_id}`,
          pending: `${dominio}/falha?preference_id={preference_id}`
        },
        notification_url: webhookUrl, // Webhook para processamento automático
        auto_return: 'approved',
        external_reference: paymentRecord?.id || `payment-${Date.now()}`, // ID do nosso registro
        metadata: {
          plan: plan,
          email: email,
          payment_id: paymentRecord?.id || null,
        }
      }
    });

    // Atualizar registro com preference_id
    if (paymentRecord && response.id) {
      try {
        await supabase
          .from('payments')
          .update({ preference_id: response.id })
          .eq('id', paymentRecord.id);
      } catch (updateError) {
        console.error('[Pagamento] Erro ao atualizar preference_id:', updateError);
      }
    }

    return new Response(JSON.stringify({ 
      init_point: response.init_point,
      preference_id: response.id,
      payment_id: paymentRecord?.id || null,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating payment preference:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to create payment preference', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}