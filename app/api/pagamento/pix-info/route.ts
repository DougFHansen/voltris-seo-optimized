import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * API para buscar informações do PIX
 * 
 * Query params:
 * - payment_id: ID do pagamento no Mercado Pago
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('payment_id');
    
    if (!paymentId) {
      return NextResponse.json(
        { error: 'payment_id é obrigatório' },
        { status: 400 }
      );
    }
    
    console.log(`[PIX INFO] Buscando informações do pagamento ${paymentId}...`);
    
    // Configurar Mercado Pago
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN_PROD || process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      console.error('[PIX INFO] Token Mercado Pago não configurado');
      return NextResponse.json(
        { error: 'Configuração inválida do servidor' },
        { status: 500 }
      );
    }
    
    const client = new MercadoPagoConfig({ accessToken });
    const paymentAPI = new Payment(client);
    
    // Buscar pagamento
    const payment = await paymentAPI.get({ id: paymentId });
    
    console.log(`[PIX INFO] Pagamento encontrado:`, {
      id: payment.id,
      status: payment.status,
      payment_method_id: payment.payment_method_id,
    });
    
    // Verificar se tem dados do PIX
    const pointOfInteraction = (payment as any).point_of_interaction;
    
    if (!pointOfInteraction?.transaction_data) {
      console.log('[PIX INFO] Pagamento não contém dados de PIX');
      return NextResponse.json({
        status: payment.status,
        payment_method_id: payment.payment_method_id,
      });
    }
    
    const transactionData = pointOfInteraction.transaction_data;
    
    return NextResponse.json({
      status: payment.status,
      payment_method_id: payment.payment_method_id,
      qr_code: transactionData.qr_code || null,
      qr_code_base64: transactionData.qr_code_base64 || null,
      ticket_url: transactionData.ticket_url || null,
    });
    
  } catch (error: any) {
    console.error('[PIX INFO] Erro:', {
      message: error.message,
      stack: error.stack,
    });
    
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar informações do PIX' },
      { status: 500 }
    );
  }
}
