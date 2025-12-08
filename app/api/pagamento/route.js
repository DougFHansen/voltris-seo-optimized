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
  const startTime = Date.now();
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  console.log(`[Pagamento ${requestId}] Iniciando requisição`);
  
  try {
    // Verifica se o token está configurado
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      console.error(`[Pagamento ${requestId}] MP_ACCESS_TOKEN não configurado`);
      return new Response(JSON.stringify({ error: 'MP_ACCESS_TOKEN not configured' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    console.log(`[Pagamento ${requestId}] Token encontrado: ${accessToken.substring(0, 20)}...`);

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
    console.log(`[Pagamento ${requestId}] Cliente Mercado Pago configurado`);
    
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
    
    const preferenceBody = {
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
    };

    console.log(`[Pagamento ${requestId}] Criando preferência:`, {
      plan: plan,
      price: selectedPlan.price,
      email: email || 'não informado',
      payment_id: paymentRecord?.id || 'não criado',
      webhook_url: webhookUrl,
    });

    let response;
    try {
      response = await preference.create({
        body: preferenceBody
      });
      console.log(`[Pagamento ${requestId}] Preferência criada com sucesso:`, {
        preference_id: response.id,
        init_point: response.init_point,
        sandbox_init_point: response.sandbox_init_point,
        test_mode: response.test_mode,
      });
    } catch (mpError) {
      console.error(`[Pagamento ${requestId}] Erro ao criar preferência:`, {
        message: mpError.message,
        cause: mpError.cause,
        status: mpError.status,
        statusCode: mpError.statusCode,
        stack: mpError.stack,
      });
      throw mpError;
    }

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

    const duration = Date.now() - startTime;
    console.log(`[Pagamento ${requestId}] Requisição concluída em ${duration}ms`);

    return new Response(JSON.stringify({ 
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
      preference_id: response.id,
      payment_id: paymentRecord?.id || null,
      test_mode: response.test_mode,
      debug: {
        request_id: requestId,
        duration_ms: duration,
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Pagamento ${requestId}] Erro após ${duration}ms:`, {
      message: error.message,
      cause: error.cause,
      status: error.status,
      statusCode: error.statusCode,
      stack: error.stack,
    });

    return new Response(JSON.stringify({ 
      error: 'Failed to create payment preference', 
      details: error.message,
      request_id: requestId,
      debug: {
        cause: error.cause?.toString(),
        status: error.status,
        statusCode: error.statusCode,
      },
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}