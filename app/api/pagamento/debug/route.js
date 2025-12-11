import { MercadoPagoConfig, Preference } from 'mercadopago';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * Endpoint de debug para verificar configuração do Mercado Pago
 */
export async function GET(request) {
  try {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    const dominio = process.env.NEXT_PUBLIC_SITE_URL || 'https://voltris.com.br';

    const debugInfo = {
      token_configured: !!accessToken,
      token_prefix: accessToken ? accessToken.substring(0, 10) : 'N/A',
      token_length: accessToken ? accessToken.length : 0,
      dominio: dominio,
      timestamp: new Date().toISOString(),
    };

    // Tentar criar uma preferência de teste simples
    if (accessToken) {
      try {
        const client = new MercadoPagoConfig({
          accessToken: accessToken,
        });

        const preference = new Preference(client);

        // Criar preferência mínima para teste
        const testPreference = await preference.create({
          body: {
            items: [
              {
                id: 'test-item',
                title: 'Teste Debug',
                description: 'Teste de debug',
                quantity: 1,
                currency_id: 'BRL',
                unit_price: 0.01, // Valor mínimo
              }
            ],
            back_urls: {
              success: `${dominio}/sucesso`,
              failure: `${dominio}/falha`,
              pending: `${dominio}/falha`
            },
            auto_return: 'approved',
          }
        });

        debugInfo.preference_created = true;
        debugInfo.preference_id = testPreference.id;
        debugInfo.init_point = testPreference.init_point;
        debugInfo.sandbox_init_point = testPreference.sandbox_init_point;
        debugInfo.test_mode = testPreference.test_mode;
        debugInfo.status = 'success';
      } catch (mpError) {
        debugInfo.preference_created = false;
        debugInfo.error = mpError.message;
        debugInfo.error_details = mpError.cause || mpError.stack;
        debugInfo.status = 'error';
      }
    } else {
      debugInfo.status = 'error';
      debugInfo.error = 'MP_ACCESS_TOKEN not configured';
    }

    return new Response(JSON.stringify(debugInfo, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: 'error',
      error: error.message,
      stack: error.stack,
    }, null, 2), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}






