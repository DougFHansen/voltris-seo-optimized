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
 * - Validações de segurança
 * 
 * Query params:
 * - plan: tipo de licença (trial, pro, premium) - default: pro
 * - email: email do comprador (opcional, mas recomendado)
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
      return new Response(JSON.stringify({ 
        error: 'MP_ACCESS_TOKEN not configured',
        message: 'Token de acesso do Mercado Pago não está configurado. Configure a variável MP_ACCESS_TOKEN no Vercel.'
      }), {
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
    
    // Validar plano
    const validPlans = ['trial', 'pro', 'premium'];
    if (!validPlans.includes(plan)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid plan',
        message: `Plano inválido. Use: ${validPlans.join(', ')}`
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Validar email se fornecido
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid email',
        message: 'Formato de email inválido'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Configurar preços e tipos de licença
    const planConfig = {
      trial: { price: 0, title: 'Licença Voltris - Trial', months: 0 },
      pro: { price: 49.90, title: 'Licença Voltris - Pro', months: 1 },
      premium: { price: 99.90, title: 'Licença Voltris - Premium', months: 3 },
    };
    
    const selectedPlan = planConfig[plan];
    
    const client = new MercadoPagoConfig({
      accessToken: accessToken,
    });

    const preference = new Preference(client);
    console.log(`[Pagamento ${requestId}] Cliente Mercado Pago configurado`);
    
    // Domínio do site (pode ser variável de ambiente)
    // Garantir que não tenha barra no final
    let dominio = process.env.NEXT_PUBLIC_SITE_URL || 'https://voltris.com.br';
    dominio = dominio.replace(/\/$/, ''); // Remove barra final se houver
    
    // Criar registro de pagamento no banco ANTES de criar a preferência
    // Usar service_role key para bypass RLS
    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    // Se tiver service_role key, usar ela (bypass RLS)
    // Senão, usar cliente normal (vai depender das políticas RLS)
    const supabase = supabaseServiceKey 
      ? createSupabaseClient(supabaseUrl, supabaseServiceKey)
      : await createClient();
    
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
    
    // Construir corpo da preferência - VERSÃO MÍNIMA para testar no sandbox
    // Removendo TUDO que pode causar problemas para isolar o problema
    const preferenceBody = {
      items: [
        {
          title: selectedPlan.title,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: selectedPlan.price,
        }
      ],
      back_urls: {
        success: `${dominio}/sucesso`,
        failure: `${dominio}/falha`,
        pending: `${dominio}/falha`
      },
    };
    
    // Adicionar apenas campos essenciais se necessário
    // Removendo auto_return, notification_url, metadata, external_reference temporariamente

    console.log(`[Pagamento ${requestId}] Criando preferência MÍNIMA para teste sandbox:`, {
      plan: plan,
      price: selectedPlan.price,
      email: email || 'não informado',
      preference_body: JSON.stringify(preferenceBody),
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