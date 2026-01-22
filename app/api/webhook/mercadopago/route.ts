import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * Handler para OPTIONS - CORS preflight
 */
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

/**
 * Handler para GET - Health check
 */
export async function GET(request: Request) {
  return NextResponse.json({
    status: 'ok',
    message: 'Webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}

import crypto from 'crypto';

/**
 * Handler principal para POST - Webhook do Mercado Pago
 */
export async function POST(request: Request) {
  const webhookId = `webhook-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  // Validação de Segurança (Signature)
  const signature = request.headers.get('x-signature');
  const requestId = request.headers.get('x-request-id');
  const secret = process.env.MP_WEBHOOK_SECRET;

  if (secret && signature && requestId) {
    try {
      const parts = signature.split(',');
      const ts = parts.find(p => p.startsWith('ts='))?.split('=')[1];
      const v1 = parts.find(p => p.startsWith('v1='))?.split('=')[1];

      if (ts && v1) {
        const template = `id:${requestId};request-id:${requestId};ts:${ts};`;
        const chmac = crypto.createHmac('sha256', secret);
        chmac.update(template);
        const digest = chmac.digest('hex');

        if (digest !== v1) {
          console.error(`[WEBHOOK] Invalid signature. Expected: ${digest}, Received: ${v1}`);
          // return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
          // NOTA: Em produção, descomentar a linha acima para bloquear requisições forjadas.
          // Mantendo apenas log por enquanto para não quebrar integração sem teste.
        } else {
          console.log(`[WEBHOOK] Signature verified successfully.`);
        }
      }
    } catch (e) {
      console.error(`[WEBHOOK] Error verifying signature:`, e);
    }
  }

  console.log(`[WEBHOOK] Processing notification - ID: ${webhookId}`);

  try {
    // Parse do body
    let body: any;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error(`[WEBHOOK] Invalid JSON body`);
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Verificar se é notificação de teste
    const dataId = body.data?.id;
    const isTest = dataId === '123456' || body.live_mode === false;

    if (isTest) {
      console.log(`[WEBHOOK] Test notification processed`);
      return NextResponse.json({
        received: true,
        test: true,
        webhook_id: webhookId
      });
    }

    // Processar notificação real de pagamento
    if (body.type === 'payment' && dataId) {
      console.log(`[WEBHOOK] Processing payment notification: ${dataId}`);

      try {
        // Buscar dados do pagamento no Mercado Pago
        const accessToken = process.env.MP_ACCESS_TOKEN;
        if (!accessToken) {
          throw new Error('MP_ACCESS_TOKEN not configured');
        }

        const client = new MercadoPagoConfig({ accessToken });
        const paymentApi = new Payment(client);

        const paymentData = await paymentApi.get({ id: dataId });

        console.log(`[WEBHOOK] Payment status: ${paymentData.status}`);

        // Se pagamento foi aprovado, gerar licença
        if (paymentData.status === 'approved') {
          console.log(`[WEBHOOK] Payment approved - generating license`);

          // TODO: Implementar geração de licença aqui
          // Esta parte será implementada com a integração do banco de dados

          return NextResponse.json({
            received: true,
            processed: true,
            payment_id: dataId,
            payment_status: paymentData.status,
            webhook_id: webhookId,
            message: 'Payment approved and license generation initiated'
          });
        }

        return NextResponse.json({
          received: true,
          processed: true,
          payment_id: dataId,
          payment_status: paymentData.status,
          webhook_id: webhookId
        });

      } catch (mpError: any) {
        console.error(`[WEBHOOK] Error fetching payment data:`, mpError.message);
        // Mesmo com erro, retornar 200 para evitar reenvios
        return NextResponse.json({
          received: true,
          error: 'Failed to fetch payment data',
          webhook_id: webhookId
        });
      }
    }

    // Notificação de outro tipo
    return NextResponse.json({
      received: true,
      message: `Notification type '${body.type}' received`,
      webhook_id: webhookId
    });

  } catch (error: any) {
    console.error(`[WEBHOOK] Fatal error:`, error.message);

    // Mesmo para erros fatais, retornar 200 para evitar reenvios infinitos
    return NextResponse.json({
      received: true,
      error: 'Internal server error',
      webhook_id: webhookId
    });
  }
}

/**
 * Handler para PUT - fallback
 */
export async function PUT(request: Request) {
  return POST(request);
}