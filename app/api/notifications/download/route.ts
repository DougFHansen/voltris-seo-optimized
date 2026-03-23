import { NextRequest, NextResponse } from 'next/server';
import { TelegramService } from '@/services/telegramService';

/**
 * POST /api/notifications/download
 * Acionado quando um usuário clica num botão de download
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[API] Download notification request received:', body);
    const { fileName, pageUrl } = body;

    if (!fileName) {
      return NextResponse.json({ error: 'Missing fileName' }, { status: 400 });
    }

    // Enviar notificação para o Telegram via service (sem aguardar para não travar o cliente)
    TelegramService.notifyDownload(fileName, pageUrl || 'Desconhecida')
      .then(() => console.log(`[API] Telegram notification sent for: ${fileName}`))
      .catch(err => console.error('[API] Telegram notification failed:', err));

    return NextResponse.json({ success: true, message: 'Notification queued' });
  } catch (error) {
    console.error('[API] Download notification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
