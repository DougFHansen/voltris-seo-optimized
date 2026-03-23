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
    const data = await response.json();
    console.log('[Notification] Backend response:', data);
  } catch (error) {
    console.error('[Notification] Failed to report download:', error);
  }
}
