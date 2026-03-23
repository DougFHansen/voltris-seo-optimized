/**
 * Serviço de Integração com Telegram
 * Usado para enviar notificações de eventos importantes no site
 */

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const TelegramService = {
  /**
   * Envia uma mensagem para o chat configurado via variáveis de ambiente
   */
  async sendMessage(message: string) {
    // Limpando aspas ou espaços que o Vercel ou .env.local podem injetar acidentalmente
    const token = (process.env.TELEGRAM_BOT_TOKEN || "").replace(/['"]/g, "").trim();
    const chatId = (process.env.TELEGRAM_CHAT_ID || "").replace(/['"]/g, "").trim();

    if (!token || !chatId) {
      console.warn('[Telegram] Credentials missing or empty. Check: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID');
      return;
    }

    try {
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      const response = await fetch(url, {
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
        console.error('[Telegram] API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
      }
    } catch (error) {
      console.error('[Telegram] Fetch failed:', error);
    }
  },

  /**
   * Notifica que um download foi iniciado
   */
  async notifyDownload(fileName: string, pageUrl: string) {
    const timestamp = new Date().toLocaleString('pt-BR');
    const safeFileName = escapeHtml(fileName);
    const safePageUrl = escapeHtml(pageUrl);

    const message = [
      `🚀 <b>Novo Download Iniciado!</b>`,
      ``,
      `📁 <b>Arquivo:</b> ${safeFileName}`,
      `🌐 <b>Página:</b> ${safePageUrl}`,
      `⏰ <b>Data/Hora:</b> ${timestamp}`,
      ``,
      `#voptimizer #download #voltris`
    ].join('\n');

    return this.sendMessage(message);
  }
};
