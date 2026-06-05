import { NextRequest, NextResponse } from 'next/server';
import { TelegramService } from '@/services/telegramService';

/**
 * POST /api/notifications/event
 * Acionado para eventos estratégicos (Page View, Purchase Click)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventType, details, pageUrl, browserInfo, location, timestamp } = body;

    if (!eventType) {
      return NextResponse.json({ error: 'Missing eventType' }, { status: 400 });
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
