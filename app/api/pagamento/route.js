import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function GET(request) {
  try {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN || '',
    });

    const preference = new Preference(client);
    
    // Domínio correto para o seu site
    const dominio = 'https://voltris.com.br';
    
    const response = await preference.create({
      body: {
        items: [
          {
            id: 'voltris-license',
            title: 'Licença Voltris',
            quantity: 1,
            currency_id: 'BRL',
            unit_price: 10.00,
          }
        ],
        back_urls: {
          success: `${dominio}/sucesso.html`,
          failure: `${dominio}/falha.html`,
          pending: `${dominio}/falha.html`
        },
        auto_return: 'approved'
      }
    });

    return new Response(JSON.stringify({ init_point: response.init_point }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating payment preference:', error);
    return new Response(JSON.stringify({ error: 'Failed to create payment preference' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}