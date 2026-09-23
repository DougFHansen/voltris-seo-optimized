import { NextRequest, NextResponse } from 'next/server';
import { TelegramService } from '@/services/telegramService';

// Rate limiting simples em memória — evita spam de notificações no Telegram
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // requisições por minuto por IP

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now >= entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
        return true;
    }
    if (entry.count >= RATE_LIMIT) return false;
    entry.count++;
    return true;
}

/**
 * POST /api/notifications/download
 * Acionado quando um usuário clica num botão de download
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limiting por IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }

    const body = await req.json();
    console.log('[API] Download notification request received:', body);
    const { fileName, pageUrl, browserInfo, location } = body;

    if (!fileName) {
      return NextResponse.json({ error: 'Missing fileName' }, { status: 400 });
    }

    console.log(`[API] Download notification details:`, {
      fileName,
      pageUrl,
      browserInfo: browserInfo ? {
        browser: browserInfo.browser,
        version: browserInfo.version,
        os: browserInfo.os,
        deviceType: browserInfo.deviceType
      } : undefined,
      location: location ? {
        country: location.country,
        region: location.region,
        city: location.city
      } : undefined
    });

    // Enviar notificação para o Telegram via service (usar await para Vercel não desligar)
    try {
      await TelegramService.notifyDownload(
        fileName, 
        pageUrl || 'Desconhecida',
        browserInfo,
        location
      );
      console.log(`[API] Telegram notification sent for: ${fileName}`);
    } catch (err) {
      console.error('[API] Telegram notification failed:', err);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Notification sent',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[API] Download notification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
