/**
 * Notifica o backend sobre um download iniciado
 */
export async function notifyDownload(fileName: string) {
  console.log(`[Notification] Triggering download notification for: ${fileName}`);
  try {
    const response = await fetch('/api/notifications/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName,
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('[Notification] Failed to report download:', error);
  }
}

/**
 * Notifica o backend sobre o acesso a uma página estratégica
 */
export async function notifyPageView(pageName: string) {
  try {
    await fetch('/api/notifications/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'PAGE_VIEW',
        details: pageName,
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      }),
    });
  } catch (error) {
    console.error('[Notification] Failed to report page view:', error);
  }
}

/**
 * Notifica o backend sobre uma tentativa de compra (clique no checkout)
 */
export async function notifyPurchaseAttempt(planName: string, billingPeriod: string) {
  try {
    await fetch('/api/notifications/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'PURCHASE_CLICK',
        details: `Plano: ${planName} (${billingPeriod === 'month' ? 'Mensal' : 'Anual'})`,
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      }),
    });
  } catch (error) {
    console.error('[Notification] Failed to report purchase attempt:', error);
  }
}
