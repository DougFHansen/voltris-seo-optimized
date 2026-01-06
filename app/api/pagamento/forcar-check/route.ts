import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * API de DEBUG para forçar verificação manual de pagamento PIX
 * Usar quando o webhook não funciona
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get('payment_id');
  
  if (!paymentId) {
    return NextResponse.json({ error: 'payment_id required' }, { status: 400 });
  }
  
  try {
    console.log(`[DEBUG] Forçando check do pagamento ${paymentId}...`);
    
    // Buscar pagamento no Mercado Pago
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN_PROD || process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ error: 'Token not configured' }, { status: 500 });
    }
    
    const client = new MercadoPagoConfig({ accessToken });
    const paymentAPI = new Payment(client);
    
    const paymentData = await paymentAPI.get({ id: paymentId });
    
    console.log(`[DEBUG] Status atual:`, paymentData.status);
    console.log(`[DEBUG] Status detail:`, paymentData.status_detail);
    
    // Se aprovado, processar
    if (paymentData.status === 'approved') {
      console.log(`[DEBUG] Pagamento APROVADO! Processando...`);
      
      // Determinar URL do site
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://voltris.com.br';
      const webhookUrl = `${siteUrl.replace(/\/$/, '')}/api/webhook/mercadopago`;
      
      console.log(`[DEBUG] Chamando webhook:`, webhookUrl);
      
      // Chamar webhook manualmente
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'payment',
          action: 'payment.updated',
          data: { id: paymentId },
          live_mode: true,
        }),
      });
      
      const webhookResult = await webhookResponse.json();
      
      return NextResponse.json({
        payment_status: paymentData.status,
        payment_detail: paymentData.status_detail,
        webhook_called: true,
        webhook_result: webhookResult,
        message: 'Processamento forçado com sucesso!',
      });
    }
    
    // Se ainda pendente
    return NextResponse.json({
      payment_status: paymentData.status,
      payment_detail: paymentData.status_detail,
      webhook_called: false,
      message: 'Pagamento ainda está pendente no Mercado Pago. Aguarde alguns segundos e tente novamente.',
    });
    
  } catch (error: any) {
    console.error(`[DEBUG] Erro:`, error);
    return NextResponse.json({
      error: error.message,
      details: error.cause || error.response?.data,
    }, { status: 500 });
  }
}
