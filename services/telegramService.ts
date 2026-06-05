/**
 * Serviço de Integração com Telegram
 * Usado para enviar notificações de eventos importantes no site
 */

interface BrowserInfo {
  browser: string;
  version: string;
  engine: string;
  os: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  language: string;
  timezone: string;
  screenResolution: string;
  platform: string;
  isMobile: boolean;
  isBot: boolean;
}

interface LocationInfo {
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  ip?: string;
}

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatBrowserInfo(browserInfo?: BrowserInfo): string {
  if (!browserInfo) return '📱 <b>Navegador:</b> Desconhecido';
  
  const deviceIcon = browserInfo.isMobile ? '📱' : '🖥️';
  const botWarning = browserInfo.isBot ? ' 🤖' : '';
  
  return [
    `${deviceIcon} <b>Navegador:</b> ${browserInfo.browser} ${browserInfo.version}${botWarning}`,
    `⚙️ <b>Engine:</b> ${browserInfo.engine}`,
    `💻 <b>Sistema:</b> ${browserInfo.os}`,
    `📏 <b>Tela:</b> ${browserInfo.screenResolution}`,
    `🌐 <b>Idioma:</b> ${browserInfo.language}`
  ].join('\n');
}

function formatLocationInfo(location?: LocationInfo): string {
  if (!location) return '🌍 <b>Localização:</b> Desconhecida';
  
  return [
    `🌍 <b>País:</b> ${location.country}`,
    `📍 <b>Região:</b> ${location.region}`,
    `🏙️ <b>Cidade:</b> ${location.city}`,
    `🕐 <b>Fuso:</b> ${location.timezone}`,
    `🔌 <b>IP:</b> ${location.ip}`
  ].join('\n');
}

export const TelegramService = {
  /**
   * Envia uma mensagem para o chat configurado via variáveis de ambiente
   */
  async sendMessage(message: string) {
    // ID Migrado do Supergrupo: -1003839628448
    const token = (process.env.TELEGRAM_BOT_TOKEN || "").replace(/['"]/g, "").trim();
    const chatId = (process.env.TELEGRAM_CHAT_ID || "-1003839628448").replace(/['"]/g, "").trim();

    if (!token || !chatId) {
      console.warn('[Telegram] Credentials missing or empty.');
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
  async notifyDownload(fileName: string, pageUrl: string, browserInfo?: BrowserInfo, location?: LocationInfo) {
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
      `📊 <b>Informações do Dispositivo:</b>`,
      formatBrowserInfo(browserInfo),
      ``,
      `🗺️ <b>Localização:</b>`,
      formatLocationInfo(location),
      ``,
      `#voptimizer #download #voltris`
    ].join('\n');

    return this.sendMessage(message);
  },

  /**
   * Notifica acesso a uma página estratégica
   */
  async notifyPageView(pageName: string, pageUrl: string, browserInfo?: BrowserInfo, location?: LocationInfo) {
    const timestamp = new Date().toLocaleString('pt-BR');
    const safePageName = escapeHtml(pageName);
    const safePageUrl = escapeHtml(pageUrl);

    const message = [
      `👁 <b>Novo Acesso Detectado!</b>`,
      ``,
      `🏙 <b>Página:</b> ${safePageName}`,
      `🌐 <b>URL:</b> ${safePageUrl}`,
      `⏰ <b>Data/Hora:</b> ${timestamp}`,
      ``,
      `📊 <b>Informações do Dispositivo:</b>`,
      formatBrowserInfo(browserInfo),
      ``,
      `🗺️ <b>Localização:</b>`,
      formatLocationInfo(location),
      ``,
      `#voptimizer #acesso #leads`
    ].join('\n');

    return this.sendMessage(message);
  },

  /**
   * Notifica clique em botão de compra
   */
  async notifyPurchaseClick(planDetails: string, pageUrl: string, browserInfo?: BrowserInfo, location?: LocationInfo) {
    const timestamp = new Date().toLocaleString('pt-BR');
    const safePlanDetails = escapeHtml(planDetails);
    const safePageUrl = escapeHtml(pageUrl);

    const message = [
      `💳 <b>Intenção de Compra!</b>`,
      ``,
      `🎟 <b>Detalhes:</b> ${safePlanDetails}`,
      `🌐 <b>URL:</b> ${safePageUrl}`,
      `⏰ <b>Data/Hora:</b> ${timestamp}`,
      ``,
      `📊 <b>Informações do Dispositivo:</b>`,
      formatBrowserInfo(browserInfo),
      ``,
      `🗺️ <b>Localização:</b>`,
      formatLocationInfo(location),
      ``,
      `🚨 🔥 <b>USUÁRIO EM CHECKOUT!</b> 🔥 🚨`,
      ``,
      `#voptimizer #vendas #checkout #stripe`
    ].join('\n');

    return this.sendMessage(message);
  }
};
