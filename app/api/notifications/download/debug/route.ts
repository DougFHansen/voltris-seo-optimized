import { NextRequest, NextResponse } from 'next/server';
import { TelegramService } from '@/services/telegramService';

/**
 * GET /api/notifications/download/debug
 * Rota de diagnóstico para testar a comunicação com o Telegram
 */
export async function GET(req: NextRequest) {
  const token = (process.env.TELEGRAM_BOT_TOKEN || "").replace(/['"]/g, "").trim();
  const chatId = (process.env.TELEGRAM_CHAT_ID || "").replace(/['"]/g, "").trim();

  const debugInfo = {
    hasToken: !!token,
    tokenPrefix: token ? token.substring(0, 10) + "..." : "EMPTY",
    hasChatId: !!chatId,
    chatId: chatId,
    envStatus: process.env.NODE_ENV,
  };

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `🔧 <b>Teste de Diagnóstico Voltris</b>\n\nEste teste foi iniciado via /api/notifications/download/debug.\n\n✅ Se você recebeu isso, as credenciais estão 100% corretas no servidor!`,
        parse_mode: 'HTML',
      }),
    });

    const telegramResult = await response.json();

    return NextResponse.json({
      success: telegramResult.ok,
      diagnostics: debugInfo,
      telegramResponse: telegramResult
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      diagnostics: debugInfo,
      error: error.message || 'Unknown error during fetch'
    }, { status: 500 });
  }
}
