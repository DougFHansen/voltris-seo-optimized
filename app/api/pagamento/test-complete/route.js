import { MercadoPagoConfig, Preference } from 'mercadopago';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * Endpoint de teste COMPLETO - Retorna TODOS os detalhes da preferência
 * Use este endpoint para diagnosticar problemas no sandbox
 */
export async function GET(request) {
  try {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    const { searchParams } = new URL(request.url);
    const plan = searchParams.get('plan') || 'pro';
    const email = searchParams.get('email') || 'teste@teste.com';
    
    if (!accessToken) {
      return new Response(JSON.stringify({ 
        error: 'MP_ACCESS_TOKEN not configured' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const planConfig = {
      trial: { price: 0.01, title: 'Licença Voltris - Trial', months: 0 },
      pro: { price: 49.90, title: 'Licença Voltris - Pro', months: 1 },
      premium: { price: 99.90, title: 'Licença Voltris - Premium', months: 3 },
    };
    
    const selectedPlan = planConfig[plan] || planConfig.pro;
    const dominio = 'https://www.voltris.com.br';

    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    // Preferência ULTRA SIMPLIFICADA - apenas o essencial
    // Adicionar payer para melhor compatibilidade com sandbox
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
      payer: {
        email: email || 'test@testuser.com',
      },
      statement_descriptor: 'VOLTRIS TEST',
    };

    console.log('[TEST-COMPLETE] Criando preferência:', JSON.stringify(preferenceBody, null, 2));

    let response;
    try {
      response = await preference.create({ body: preferenceBody });
      
      // Retornar TODOS os detalhes da resposta
      return new Response(JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        token_info: {
          prefix: accessToken.substring(0, 15),
          length: accessToken.length,
          is_test: accessToken.startsWith('TEST-') || accessToken.includes('sandbox'),
        },
        preference_created: true,
        preference_full_response: response, // TODA a resposta do MP
        checkout_urls: {
          init_point: response.init_point,
          sandbox_init_point: response.sandbox_init_point,
          test_mode: response.test_mode,
        },
        diagnostic: {
          has_sandbox_url: !!response.sandbox_init_point,
          has_production_url: !!response.init_point,
          test_mode_active: response.test_mode === true,
          token_is_test: accessToken.startsWith('TEST-'),
          token_is_app_usr: accessToken.startsWith('APP_USR-'),
          recommendation: response.sandbox_init_point 
            ? '⚠️ ATENÇÃO: Token não está em modo teste, mas sandbox_init_point está disponível. Use o sandbox_init_point e certifique-se de estar logado com conta de TESTE do comprador.' 
            : 'sandbox_init_point não disponível - verifique token',
          critical_warning: !accessToken.startsWith('TEST-') && response.test_mode !== true
            ? '🚨 PROBLEMA: Token não está sendo reconhecido como teste. Mesmo usando sandbox_init_point, pode haver problemas. Recomendado: obter token que comece com TEST- ou verificar configuração da aplicação no painel.'
            : null,
        },
        next_steps: [
          '1. Copie o sandbox_init_point acima',
          '2. Abra em nova aba (com você logado na conta de teste do comprador)',
          '3. Use cartão de teste: 5031 4332 1540 6351 (CVV: 123)',
          '4. Se ainda falhar, verifique se está logado com conta de TESTE do comprador',
        ]
      }, null, 2), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (mpError) {
      console.error('[TEST-COMPLETE] Erro ao criar preferência:', mpError);
      
      return new Response(JSON.stringify({
        success: false,
        error: {
          message: mpError.message,
          status: mpError.status,
          statusCode: mpError.statusCode,
          cause: mpError.cause?.toString(),
          stack: mpError.stack,
        },
        diagnostic: {
          token_prefix: accessToken.substring(0, 15),
          token_length: accessToken.length,
          error_type: mpError.statusCode === 401 ? 'Token inválido' : 
                      mpError.statusCode === 400 ? 'Dados inválidos' : 
                      'Erro desconhecido',
        }
      }, null, 2), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: {
        message: error.message,
        stack: error.stack,
      }
    }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

