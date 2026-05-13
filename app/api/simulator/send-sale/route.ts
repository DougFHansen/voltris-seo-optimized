import { NextRequest, NextResponse } from 'next/server';
import { generateSimulatedSale } from '@/services/salesSimulator';

/**
 * API Route para enviar notificação de venda simulada no Telegram
 * Chamada pelo cron job a cada 5 minutos
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autorização via header ou query param
    const authHeader = request.headers.get('authorization');
    const url = new URL(request.url);
    const secretKey = url.searchParams.get('key');
    const expectedKey = process.env.SIMULATOR_SECRET_KEY || 'voltris-sales-simulator-2026';

    // Aceitar via header Bearer ou query param key
    const isAuthorized = 
      (authHeader && authHeader === `Bearer ${expectedKey}`) ||
      (secretKey && secretKey === expectedKey);

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { sale, message } = generateSimulatedSale();

    // Enviar mensagem para o Telegram
    const token = (process.env.TELEGRAM_BOT_TOKEN || '').replace(/['"]/g, '').trim();
    const chatId = (process.env.TELEGRAM_CHAT_ID || '-1003839628448').replace(/['"]/g, '').trim();

    if (!token || !chatId) {
      console.warn('[SalesSimulator] Telegram credentials missing.');
      return NextResponse.json(
        { error: 'Telegram credentials not configured' },
        { status: 500 }
      );
    }

    const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[SalesSimulator] Telegram API Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to send Telegram message', details: errorData },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sale: {
        plan: sale.plan,
        period: sale.period,
        price: sale.price,
        customer: sale.customerName,
        location: `${sale.city}/${sale.state}`,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('[SalesSimulator] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// Também aceitar POST para flexibilidade
export async function POST(request: NextRequest) {
  return GET(request);
}
