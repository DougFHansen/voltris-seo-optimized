import { NextRequest, NextResponse } from 'next/server';
import { TelegramService } from '@/services/telegramService';

// Rate limiting simples em memória — o endpoint dispara notificações no Telegram,
// então precisa ser limitado para evitar spam/abuso.
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
 * POST /api/notifications/event
 * Acionado para eventos estratégicos (Page View, Purchase Click)
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limiting por IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }

    const body = await req.json();
    const { eventType, details, pageUrl, browserInfo, location, timestamp } = body;

    if (!eventType) {
      return NextResponse.json({ error: 'Missing eventType' }, { status: 400 });
    }

    // SEGURANÇA: apenas tipos de evento conhecidos (evita disparo arbitrário
    // de mensagens no Telegram com payloads controlados pelo atacante).
    const ALLOWED_EVENTS = ['PAGE_VIEW', 'PURCHASE_CLICK'];
    if (!ALLOWED_EVENTS.includes(eventType)) {
      return NextResponse.json({ error: 'Invalid eventType' }, { status: 400 });
    }

    console.log(`[API] ${eventType} notification received:`, {
      details,
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

    // Processar baseado no tipo de evento
    try {
        if (eventType === 'PAGE_VIEW') {
            await TelegramService.notifyPageView(
              details || 'Página Estratégica', 
              pageUrl || 'Desconhecida',
              browserInfo,
              location
            );
        } else if (eventType === 'PURCHASE_CLICK') {
            await TelegramService.notifyPurchaseClick(
              details || 'Clique em Compra', 
              pageUrl || 'Desconhecida',
              browserInfo,
              location
            );
        } else {
            console.warn(`[API] Unknown event type: ${eventType}`);
        }
    } catch (err) {
      console.error('[API] Telegram event notification failed:', err);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Event notification sent',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[API] Event notification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
