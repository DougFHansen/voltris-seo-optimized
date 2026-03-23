import { NextRequest, NextResponse } from 'next/server';
import { TelegramService } from '@/services/telegramService';

/**
 * POST /api/notifications/download
 * Acionado quando um usuário clica num botão de download
 */
export async function POST(req: NextRequest) {
  try {
    const { fileName, pageUrl } = await req.json();

    if (!fileName) {
      return NextResponse.json({ error: 'Missing fileName' }, { status: 400 });
    }

    // Enviar notificação para o Telegram via service (sem aguardar para não travar o cliente)
    TelegramService.notifyDownload(fileName, pageUrl || 'Desconhecida').catch(err => {
      console.error('Telegram notification failed:', err);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Download notification API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
