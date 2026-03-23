/**
 * Notifica o backend sobre um download iniciado
 */
export async function notifyDownload(fileName: string) {
  try {
    await fetch('/api/notifications/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName,
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      }),
    });
  } catch (error) {
    console.error('Failed to report download:', error);
  }
}
