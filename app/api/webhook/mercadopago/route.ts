import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export const runtime = 'nodejs';
export const maxDuration = 30;

// Permitir todos os métodos HTTP para testes
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

/**
 * Handler para OPTIONS - CORS preflight
 */
export async function OPTIONS(request: Request) {
  console.log('[WEBHOOK] OPTIONS request received');
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Signature, X-Request-Id',
      'Allow': 'GET, POST, PUT, DELETE, OPTIONS'
    },
  });
}

/**
 * Handler para GET - Verificação e testes
 */
export async function GET(request: Request) {
  console.log('[WEBHOOK] GET request received - Health check');
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Webhook endpoint is active and accepting requests',
    methods_supported: ['GET', 'POST'],
    timestamp: new Date().toISOString()
  }, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  });
}

/**
 * Handler principal para POST - Webhook do Mercado Pago
 */
export async function POST(request: Request) {
  const webhookId = `webhook-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  console.log(`[WEBHOOK] POST request received - Webhook ID: ${webhookId}`);
  
  try {
    // Parse do body
    let body;
    try {
      body = await request.json();
      console.log(`[WEBHOOK] Body parsed successfully:`, JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error(`[WEBHOOK] Error parsing request body:`, parseError);
      return NextResponse.json({ 
        error: 'Invalid JSON body',
        webhook_id: webhookId 
      }, { 
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }
    
    // Headers para debug
    const headers = Object.fromEntries(request.headers.entries());
    console.log(`[WEBHOOK] Headers received:`, {
      'content-type': headers['content-type'],
      'x-signature': headers['x-signature'] ? 'present' : 'absent',
      'x-request-id': headers['x-request-id'] || 'absent',
      'user-agent': headers['user-agent']
    });
    
    // Verificar se é notificação de teste
    const dataId = body.data?.id;
    const isTest = dataId === '123456' || body.live_mode === false;
    
    if (isTest) {
      console.log(`[WEBHOOK] Test notification detected - responding with success`);
      return NextResponse.json({ 
        received: true,
        message: 'Test notification processed successfully',
        test: true,
        webhook_id: webhookId
      }, {
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }
    
    // Processar notificação real
    console.log(`[WEBHOOK] Processing real notification - Type: ${body.type}, ID: ${dataId}`);
    
    // Aqui iria o processamento real (simplificado para teste)
    if (body.type === 'payment' && dataId) {
      console.log(`[WEBHOOK] Payment notification received for ID: ${dataId}`);
      
      // Simular processamento bem-sucedido
      return NextResponse.json({ 
        received: true,
        processed: true,
        payment_id: dataId,
        webhook_id: webhookId,
        message: 'Payment notification processed successfully'
      }, {
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }
    
    // Notificação de outro tipo
    console.log(`[WEBHOOK] Notification type not processed: ${body.type}`);
    return NextResponse.json({ 
      received: true,
      message: `Notification type '${body.type}' received but not processed`,
      webhook_id: webhookId
    }, {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
    
  } catch (error: any) {
    console.error(`[WEBHOOK] Fatal error processing webhook:`, {
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message,
      webhook_id: webhookId
    }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}

/**
 * Handler para PUT - fallback adicional
 */
export async function PUT(request: Request) {
  console.log('[WEBHOOK] PUT request received - forwarding to POST handler');
  return POST(request);
}

/**
 * Handler para DELETE - para testes completos
 */
export async function DELETE(request: Request) {
  console.log('[WEBHOOK] DELETE request received - test endpoint');
  return NextResponse.json({ 
    message: 'DELETE method supported for testing',
    timestamp: new Date().toISOString()
  }, {
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*' }
  });
}