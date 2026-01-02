import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * Endpoint de debug ULTRA DETALHADO para diagnóstico de problemas com cartão
 * Retorna TODOS os detalhes da preferência criada
 */
export async function GET(request: Request) {
  const debugId = `debug-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  console.log(`[DEBUG CARTÃO] ========== INÍCIO ${debugId} ==========`);
  
  try {
    const { searchParams } = new URL(request.url);
    const plan = searchParams.get('plan') || 'pro';
    const email = searchParams.get('email') || 'test@testuser.com';
    
    const accessToken = process.env.MP_ACCESS_TOKEN;
    
    if (!accessToken) {
      return NextResponse.json({
        error: 'MP_ACCESS_TOKEN não configurado',
        debug_id: debugId,
      }, { status: 500 });
    }

    console.log(`[DEBUG CARTÃO] Token:`, {
      prefix: accessToken.substring(0, 20),
      length: accessToken.length,
      tipo: accessToken.startsWith('APP_USR-') ? 'PRODUÇÃO' : 'OUTRO',
    });

    const planConfig = {
      trial: { price: 0.01, title: 'Licença Voltris - Trial', months: 0 },
      pro: { price: 1.00, title: 'Licença Voltris - Pro', months: 1 },
      premium: { price: 1.00, title: 'Licença Voltris - Premium', months: 3 },
    };
    
    const selectedPlan = planConfig[plan as keyof typeof planConfig] || planConfig.pro;
    const dominio = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.voltris.com.br';

    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    // Preferência COMPLETA com TODAS as configurações para cartão
    const preferenceBody = {
      items: [
        {
          id: `voltris-${plan}`,
          title: selectedPlan.title,
          description: `Licença ${plan} - ${selectedPlan.months} meses`,
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
      auto_return: 'approved',
      notification_url: `${dominio}/api/webhook/mercadopago`,
      statement_descriptor: 'VOLTRIS',
      payer: {
        email: email,
      },
      external_reference: `voltris-${plan}-${Date.now()}`,
      payment_methods: {
        installments: 12,
        default_installments: 1,
      },
      shipments: {
        cost: 0,
        mode: 'not_specified',
      },
      expires: false,
    };

    console.log(`[DEBUG CARTÃO] ========== PAYLOAD COMPLETO ==========`);
    console.log(JSON.stringify(preferenceBody, null, 2));

    let response;
    let responseError = null;

    try {
      response = await preference.create({ body: preferenceBody });
      
      console.log(`[DEBUG CARTÃO] ========== PREFERÊNCIA CRIADA COM SUCESSO ==========`);
      console.log(`[DEBUG CARTÃO] Preference ID:`, response.id);
      console.log(`[DEBUG CARTÃO] Init Point:`, response.init_point);
      console.log(`[DEBUG CARTÃO] Sandbox Init Point:`, response.sandbox_init_point);
      
    } catch (mpError: any) {
      console.error(`[DEBUG CARTÃO] ========== ERRO AO CRIAR PREFERÊNCIA ==========`);
      console.error(`[DEBUG CARTÃO] Erro:`, mpError.message);
      console.error(`[DEBUG CARTÃO] Status:`, mpError.status || mpError.statusCode);
      console.error(`[DEBUG CARTÃO] Causa:`, mpError.cause);
      
      if (mpError.response) {
        console.error(`[DEBUG CARTÃO] Response data:`, mpError.response.data);
      }
      
      if (mpError.apiResponse) {
        console.error(`[DEBUG CARTÃO] API Response:`, mpError.apiResponse);
      }
      
      responseError = {
        message: mpError.message,
        status: mpError.status || mpError.statusCode,
        cause: mpError.cause,
        response: mpError.response?.data,
        apiResponse: mpError.apiResponse,
        stack: mpError.stack,
      };
      
      throw mpError;
    }

    // Retornar TUDO para análise
    return NextResponse.json({
      success: true,
      debug_id: debugId,
      timestamp: new Date().toISOString(),
      
      // Configuração do token
      token_info: {
        prefix: accessToken.substring(0, 20),
        length: accessToken.length,
        tipo: accessToken.startsWith('APP_USR-') ? 'PRODUÇÃO' : 'OUTRO',
      },
      
      // Payload enviado
      payload_sent: preferenceBody,
      
      // Resposta completa do Mercado Pago
      mercadopago_response: {
        id: response.id,
        init_point: response.init_point,
        sandbox_init_point: response.sandbox_init_point,
        date_created: (response as any).date_created,
        expiration_date_from: (response as any).expiration_date_from,
        expiration_date_to: (response as any).expiration_date_to,
        collector_id: (response as any).collector_id,
        client_id: (response as any).client_id,
        marketplace: (response as any).marketplace,
        operation_type: (response as any).operation_type,
        additional_info: (response as any).additional_info,
        auto_return: (response as any).auto_return,
        back_urls: (response as any).back_urls,
        binary_mode: (response as any).binary_mode,
        external_reference: (response as any).external_reference,
        expires: (response as any).expires,
        items: (response as any).items,
        marketplace_fee: (response as any).marketplace_fee,
        metadata: (response as any).metadata,
        notification_url: (response as any).notification_url,
        payer: (response as any).payer,
        payment_methods: (response as any).payment_methods,
        processing_modes: (response as any).processing_modes,
        shipments: (response as any).shipments,
        site_id: (response as any).site_id,
        statement_descriptor: (response as any).statement_descriptor,
        taxes: (response as any).taxes,
        total_amount: (response as any).total_amount,
        
        // Resposta RAW completa
        full_response: response,
      },
      
      // URLs geradas
      checkout_urls: {
        production: response.init_point,
        sandbox: response.sandbox_init_point,
        use_this_for_testing: response.sandbox_init_point || response.init_point,
      },
      
      // Instruções de teste
      test_instructions: {
        step_1: 'Copie a URL do checkout (use_this_for_testing)',
        step_2: 'Abra em nova aba',
        step_3: 'Faça login com test user (comprador)',
        step_4: 'Digite código de verificação (últimos 6 dígitos do user ID)',
        step_5: 'Tente pagar com cartão: 5031 4332 1540 6351',
        step_6: 'Se der erro, veja os logs do navegador (F12 > Console)',
        step_7: 'Se der erro, copie TODA a mensagem de erro',
      },
      
      // Checklist de validação
      validation: {
        token_configured: !!accessToken,
        token_tipo: accessToken.startsWith('APP_USR-') ? 'PRODUÇÃO' : 'OUTRO',
        preference_created: !!response.id,
        sandbox_url_available: !!response.sandbox_init_point,
        payment_methods_configured: !!preferenceBody.payment_methods,
        installments_configured: preferenceBody.payment_methods.installments === 12,
        payer_info_complete: !!preferenceBody.payer.email,
      },
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error: any) {
    console.error(`[DEBUG CARTÃO] ========== ERRO GERAL ==========`);
    console.error(`[DEBUG CARTÃO] Mensagem:`, error.message);
    console.error(`[DEBUG CARTÃO] Stack:`, error.stack);
    
    return NextResponse.json({
      success: false,
      debug_id: debugId,
      error: error.message,
      error_details: {
        message: error.message,
        status: error.status || error.statusCode,
        cause: error.cause,
        response: error.response?.data,
        apiResponse: error.apiResponse,
        stack: error.stack,
      },
    }, {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
