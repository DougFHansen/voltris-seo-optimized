import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function GET(request) {
  try {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN || '',
    });

    const preference = new Preference(client);
    
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
          success: 'https://your-success-url.com',
          failure: 'https://your-failure-url.com',
          pending: 'https://your-pending-url.com'
        },
        auto_return: 'approved'
      }
    });

    return new Response(JSON.stringify({ url: response.init_point }), {
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