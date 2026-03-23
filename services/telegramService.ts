/**
 * Serviço de Integração com Telegram
 * Usado para enviar notificações de eventos importantes no site
 */
export const TelegramService = {
  /**
   * Envia uma mensagem para o chat configurado via variáveis de ambiente
   */
  async sendMessage(message: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.warn('Telegram API credentials missing. Notification will not be sent.');
      return;
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error sending Telegram notification:', error);
      }
    } catch (error) {
      console.error('Failed to send Telegram notification:', error);
    }
  },

  /**
   * Notifica que um download foi iniciado
   */
  async notifyDownload(fileName: string, pageUrl: string) {
    const timestamp = new Date().toLocaleString('pt-BR');
    const message = `
🚀 <b>Novo Download Iniciado!</b>

📁 <b>Arquivo:</b> ${fileName}
🌐 <b>Página:</b> ${pageUrl}
⏰ <b>Data/Hora:</b> ${timestamp}

#voptimizer #download #voltris
    `.trim();

    return this.sendMessage(message);
  }
};
