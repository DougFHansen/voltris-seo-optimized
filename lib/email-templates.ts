/**
 * TEMPLATES DE E-MAIL TRANSACIONAL VOLTRIS (missão §5 e §3).
 *
 * Este é o ÚNICO lugar do projeto que escreve HTML de e-mail. Templates
 * duplicados por evento é a forma mais rápida de o cliente receber duas
 * versões diferentes do mesmo aviso.
 *
 * Compatibilidade de cliente (missão §5) — as regras que valem para TODOS os
 * clientes, e que são fáceis de quebrar sem querer:
 *   - layout em `<table>` com `role="presentation"`: Gmail e Outlook não
 *     suportam layout em flex/grid;
 *   - sem `border-radius` em `<td>`/`<tr>`: é ignorado em vários clientes.
 *     O arredondamento é feito por imagens ou simplesmente não é usado;
 *   - degradê de fundo SEMPRE com fallback de cor sólida atrás. `linear-gradient`
 *     é ignorado no Outlook/Word — sem o fallback, o e-mail fica branco;
 *   - styles inline em tudo que importa (cor, tamanho, espaçamento);
 *   - `<style>` no `<head>` só para media query e `prefers-color-scheme`;
 *   - largura fixa de 600px com `max-width` para o mobile;
 *   - texto sempre com alternativa em `text/plain` (ver `renderText`).
 *
 * Identidade visual: mesma paleta do site (#FF4B6B rosa, #8B31FF roxo,
 * #31A8FF azul) e base escura, conforme pede a missão.
 */

import { formatBRL, formatDateBR, formatDateTimeBR, INVOICE_TIMEZONE } from '@/lib/invoice-pdf';
import { getCompanyInfo } from '@/lib/company';
import { resolveSiteUrl } from '@/lib/site-url';

// ============================================================================
// PALETA E CONSTANTES DE LAYOUT
// ============================================================================

const C = {
    bg: '#08080c',
    surface: '#12121a',
    surfaceAlt: '#1a1a26',
    border: '#2a2a3a',
    text: '#f2f3f7',
    textSoft: '#a8adbd',
    textMuted: '#6f7488',
    pink: '#FF4B6B',
    purple: '#8B31FF',
    blue: '#31A8FF',
    green: '#22c55e',
    amber: '#f59e0b',
    rose: '#f43f5e',
    cyan: '#22d3ee',
} as const;

const WIDTH = 600;

/** Logo da marca como texto + barra de cor (imagem externa seria bloqueada). */
function logoBlock(): string {
    return `
        <tr>
          <td style="padding:32px 32px 20px 32px;" align="left">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="6" style="width:6px;background:${C.pink};font-size:0;line-height:0;">&nbsp;</td>
                <td width="4" style="width:4px;background:${C.purple};font-size:0;line-height:0;">&nbsp;</td>
                <td width="4" style="width:4px;background:${C.blue};font-size:0;line-height:0;">&nbsp;</td>
                <td style="padding-left:16px;">
                  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:22px;font-weight:800;letter-spacing:2px;color:${C.text};line-height:1;">VOLTRIS</div>
                  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:3px;color:${C.purple};padding-top:5px;">${escapeHtml(getCompanyInfo().info.nomeFantasia.toUpperCase())}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
}

/** Faixa colorida da marca, com fallback sólido (Gmail/Outlook). */
function brandBar(): string {
    return `
        <tr>
          <td height="5" style="height:5px;background:${C.purple};font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>
        </tr>`;
}

/** Cabeçalho com degradê de verdade + fundo sólido de reserva. */
function hero(kicker: string, title: string, subtitle?: string): string {
    return `
        <tr>
          <td style="padding:0;" align="center"
              bgcolor="${C.surfaceAlt}"
              style="padding:0;background-color:${C.surfaceAlt};background-image:linear-gradient(135deg, ${C.pink} 0%, ${C.purple} 52%, ${C.blue} 100%);">
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:2.5px;color:rgba(255,255,255,0.82);padding-top:26px;text-transform:uppercase;">
              ${escapeHtml(kicker)}
            </div>
            <h1 style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:24px;font-weight:800;color:#ffffff;margin:10px 28px 0 28px;line-height:1.28;">
              ${escapeHtml(title)}
            </h1>
            ${subtitle ? `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.9);margin:10px 28px 26px 28px;line-height:1.55;">${escapeHtml(subtitle)}</div>` : '<div style="font-size:0;line-height:0;">&nbsp;</div>'}
          </td>
        </tr>`;
}

/**
 * Botão do e-mail.
 *
 * `bgcolor` + `<a>` é a única forma de botão que o Outlook renderiza com
 * Reliability. O comentário acima dizia "VML" e não havia VML: o que funciona
 * é a cor de fundo na própria célula.
 *
 * SEM `border-radius` DE PROPÓSITO. O botão sai quadrado porque `border-radius`
 * em `<td>` é silenciosamente ignorado pelo Outlook/Word Engine — o resultado
 * seria um retângulo com as quinas cortadas em parte dos clientes e inteiro em
 * outros, o que é pior do que um botão reto e consistente.
 *
 * O link em texto logo abaixo é obrigatório: se o botão quebrar, o cliente
 * ainda consegue chegar ao destino colando o endereço.
 */
function button(label: string, href: string): string {
    return `
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
          <tr>
            <td align="center" bgcolor="${C.purple}" style="background-color:${C.purple};">
              <a href="${escapeHtml(href)}"
                 style="display:inline-block;padding:14px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.3px;">
                ${escapeHtml(label)}
              </a>
            </td>
          </tr>
        </table>
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:11px;color:${C.textMuted};line-height:1.5;">
          Se o botão não funcionar, copie e cole este endereço no seu navegador:<br>
          <a href="${escapeHtml(href)}" style="color:${C.blue};word-break:break-all;">${escapeHtml(href)}</a>
        </div>`;
}

/** Card de dados: rótulo em cima, valor embaixo. */
function dataCard(rows: Array<[string, string]>, accent: string = C.purple): string {
    const body = rows.map(([label, value], i) => `
        <tr>
          <td style="padding:13px 18px;border-bottom:1px solid ${C.border};${i === rows.length - 1 ? '' : ''}">
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:1.2px;color:${C.textMuted};text-transform:uppercase;">
              ${escapeHtml(label)}
            </div>
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:14px;font-weight:600;color:${C.text};padding-top:5px;line-height:1.45;word-break:break-word;">
              ${value}
            </div>
          </td>
        </tr>`).join('');

    return `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               bgcolor="${C.surface}" style="background-color:${C.surface};border:1px solid ${C.border};border-left:3px solid ${accent};margin:18px 0;">
          ${body}
        </table>`;
}

/** Caixa de destaque para a chave da licença. */
function licenseKeyBlock(licenseKey: string | null, devicesInUse?: number | null, maxDevices?: number | null): string {
    if (!licenseKey) {
        return `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.surface}" style="background-color:${C.surface};border:1px solid ${C.border};margin:18px 0;">
          <tr><td style="padding:16px 18px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:13px;color:${C.textSoft};line-height:1.6;">
            A chave da sua licença já está disponível no seu painel.
          </td></tr>
        </table>`;
    }

    const devices = typeof maxDevices === 'number'
        ? (maxDevices >= 9999
            ? 'Ilimitados'
            : `${maxDevices}${typeof devicesInUse === 'number' ? ` (${devicesInUse} em uso)` : ''}`)
        : null;

    return `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.surface}" style="background-color:${C.surface};border:1px solid ${C.border};border-left:3px solid ${C.green};margin:18px 0;">
          <tr>
            <td style="padding:16px 18px;">
              <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:1.2px;color:${C.textMuted};text-transform:uppercase;">
                Chave de ativação
              </div>
              <div style="font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;font-size:15px;font-weight:700;color:${C.green};padding:8px 0 4px 0;word-break:break-all;letter-spacing:0.4px;">
                ${escapeHtml(licenseKey)}
              </div>
              ${devices ? `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:11px;color:${C.textSoft};padding-top:2px;">Dispositivos permitidos: ${escapeHtml(devices)}</div>` : ''}
            </td>
          </tr>
        </table>
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:11px;color:${C.textMuted};line-height:1.6;padding:0 2px;">
          Guarde esta chave em local seguro: ela é o acesso à sua licença.
        </div>`;
}

/** Nota / aviso em faixa. */
function noteBlock(text: string, tone: 'info' | 'warn' | 'ok' = 'info'): string {
    const color = tone === 'warn' ? C.amber : tone === 'ok' ? C.green : C.blue;
    return `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.surface}" style="background-color:${C.surface};border:1px solid ${C.border};border-left:3px solid ${color};margin:18px 0;">
          <tr><td style="padding:14px 18px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:13px;color:${C.textSoft};line-height:1.65;">
            ${text}
          </td></tr>
        </table>`;
}

function footer(): string {
    const { info } = getCompanyInfo();
    return `
        <tr>
          <td style="padding:26px 32px 32px 32px;border-top:1px solid ${C.border};">
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:12px;font-weight:700;color:${C.text};padding-bottom:6px;">VOLTRIS</div>
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:11px;color:${C.textMuted};line-height:1.8;">
              ${info.cnpj ? `CNPJ ${escapeHtml(info.cnpj)}<br>` : ''}
              <a href="${escapeHtml(info.site)}" style="color:${C.blue};text-decoration:none;">${escapeHtml(info.site.replace(/^https?:\/\//, ''))}</a>
              &nbsp;&middot;&nbsp;
              <a href="mailto:${escapeHtml(info.email)}" style="color:${C.blue};text-decoration:none;">${escapeHtml(info.email)}</a>
              ${info.telefone ? `<br>${escapeHtml(info.telefone)}` : ''}
            </div>
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:10px;color:#4b5061;line-height:1.7;padding-top:14px;">
              Você recebeu esta mensagem porque possui uma conta ou uma compra no voltris.com.br.<br>
              &copy; ${new Date().getFullYear()} VOLTRIS. Todos os direitos reservados.
            </div>
          </td>
        </tr>`;
}

/** Envelope completo. */
function shell(title: string, preheader: string, body: string): string {
    return `<!DOCTYPE html>
<html lang="pt-BR" xmlns="v=urn:schemas-microsoft-com:office:outlook" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="dark light">
  <meta name="supported-color-schemes" content="dark light">
  <title>${escapeHtml(title)}</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
    table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}
    img{-ms-interpolation-mode:bicubic;border:0;height:auto;line-height:100%;outline:none;text-decoration:none;}
    body{margin:0!important;padding:0!important;width:100%!important;background-color:${C.bg};}
    a{color:${C.blue};}
    @media only screen and (max-width:620px){
      .voltris-container{width:100%!important;}
      .voltris-pad{padding-left:20px!important;padding-right:20px!important;}
      .voltris-h1{font-size:20px!important;line-height:1.3!important;}
      .voltris-btn{width:100%!important;text-align:center!important;}
    }
    @media (prefers-color-scheme: light){
      .voltris-shell{background-color:#f4f5f8!important;}
    }
  </style>
</head>
<body class="voltris-shell" style="margin:0;padding:0;background-color:${C.bg};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.bg};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" class="voltris-container" width="${WIDTH}" cellpadding="0" cellspacing="0" border="0"
               bgcolor="${C.surface}" style="width:${WIDTH}px;max-width:${WIDTH}px;background-color:${C.surface};border:1px solid ${C.border};">
          ${brandBar()}
          ${logoBlock()}
          ${body}
          ${footer()}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Escape HTML. Todo dado que vem do banco passa por aqui. */
export function escapeHtml(value: unknown): string {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

const PARAGRAPH = (text: string) =>
    `<p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:14px;color:${C.textSoft};line-height:1.7;margin:0 0 14px 0;">${text}</p>`;

// ============================================================================
// DADOS COMPARTILHADOS
// ============================================================================

export interface EmailContext {
    siteUrl: string;
    dashboardUrl: string;
    supportEmail: string;
}

/** URLs construídas a partir do ambiente — nunca hard-coded (§10). */
export function getEmailContext(): EmailContext {
    // Mesma resolução do checkout (lib/site-url.ts): https garantido, sem
    // barra final e com a URL canônica do site. O e-mail de compra aponta
    // para `/dashboard?tab=licenses` — a aba que o cliente deve ver.
    const site = resolveSiteUrl();
    return {
        siteUrl: site,
        dashboardUrl: `${site}/dashboard?tab=licenses`,
        supportEmail: process.env.VOLTRIS_EMAIL || 'contato@voltris.com.br',
    };
}

export interface RenderedEmail {
    subject: string;
    html: string;
    text: string;
}

// ============================================================================
// 1. PAGAMENTO CONFIRMADO + ENTREGA DA LICENÇA (FASE 4)
// ============================================================================

export interface PurchaseEmailData {
    customerName?: string | null;
    planName: string;
    billingLabel: string;
    amountPaid: number;
    currency: string;
    purchasedAt: string | null;
    periodEnd: string | null;
    licenseKey: string | null;
    maxDevices: number | null;
    devicesInUse?: number | null;
    purchaseId: string | null;
    stripeReference: string | null;
    hasInvoiceAttachment: boolean;
}

export function renderPurchaseEmail(data: PurchaseEmailData): RenderedEmail {
    const ctx = getEmailContext();
    const greeting = data.customerName?.trim()
        ? `Olá, ${escapeHtml(data.customerName.trim().split(' ')[0])}.`
        : 'Olá.';

    const body = `
        ${hero('Pagamento confirmado', 'Sua licença VOLTRIS OPTIMIZER está disponível',
            'Compra aprovada e licença emitida com sucesso.')}

        <tr><td class="voltris-pad" style="padding:26px 32px 8px 32px;">
          ${PARAGRAPH(`${greeting} Recebemos e confirmamos o seu pagamento. Sua licença já está ativa e o aplicativo pode ser usado agora mesmo.`)}
          ${dataCard([
              ['Plano adquirido', escapeHtml(data.planName)],
              ['Modalidade', escapeHtml(data.billingLabel)],
              ['Valor pago', `<strong>${escapeHtml(formatBRL(data.amountPaid, data.currency))}</strong>`],
              ['Data da compra', escapeHtml(formatDateTimeBR(data.purchasedAt))],
              ['Válido até', escapeHtml(formatDateBR(data.periodEnd))],
              ...(data.purchaseId ? ([['ID da compra', escapeHtml(data.purchaseId)]] as Array<[string, string]>) : []),
          ], C.purple)}

          ${licenseKeyBlock(data.licenseKey, data.devicesInUse, data.maxDevices)}

          ${noteBlock(`
            ${data.hasInvoiceAttachment
              ? 'A <strong>fatura comercial em PDF</strong> está anexada a este e-mail e também disponível para download no seu painel.'
              : 'A fatura comercial fica disponível para download no seu painel.'}
            <br><br>
            Esta assinatura é <strong>renovada automaticamente</strong> a cada ${escapeHtml(data.billingLabel.toLowerCase())}.
            Você pode desligar a renovação a qualquer momento, sem multa, e continua com acesso até o fim do período já pago.
          `)}

          ${button('Acessar meu Dashboard', ctx.dashboardUrl)}
        </td></tr>`;

    const text = [
        greeting,
        '',
        'Recebemos e confirmamos o seu pagamento. Sua licença VOLTRIS OPTIMIZER está ativa.',
        '',
        `Plano: ${data.planName}`,
        `Modalidade: ${data.billingLabel}`,
        `Valor pago: ${formatBRL(data.amountPaid, data.currency)}`,
        `Data da compra: ${formatDateTimeBR(data.purchasedAt)}`,
        `Válido até: ${formatDateBR(data.periodEnd)}`,
        data.purchaseId ? `ID da compra: ${data.purchaseId}` : '',
        '',
        data.licenseKey ? `CHAVE DE ATIVAÇÃO:\n${data.licenseKey}` : '',
        data.licenseKey ? '\nGuarde esta chave em local seguro: ela é o acesso à sua licença.' : '',
        '',
        data.hasInvoiceAttachment ? 'A fatura comercial em PDF está anexada e também disponível no seu painel.' : 'A fatura comercial está disponível no seu painel.',
        `Esta assinatura é renovada automaticamente. Para desligar a renovação, sem multa, acesse: ${ctx.dashboardUrl}`,
        '',
        `Dashboard: ${ctx.dashboardUrl}`,
        `Suporte: ${ctx.supportEmail}`,
    ].filter((l) => l !== undefined).join('\n');

    return {
        subject: 'VOLTRIS — Pagamento confirmado e sua licença está disponível',
        html: shell('Pagamento confirmado e sua licença está disponível',
            `Plano ${data.planName} confirmado. Sua chave e sua fatura estão prontas.`, body),
        text,
    };
}

// ============================================================================
// 2. RENOVAÇÃO (FASE 7)
// ============================================================================

export interface RenewalEmailData {
    customerName?: string | null;
    planName: string;
    billingLabel: string;
    amountPaid: number;
    currency: string;
    chargedAt: string | null;
    periodStart: string | null;
    periodEnd: string | null;
    licenseExpiresAt: string | null;
    nextBillingAt: string | null;
    renewalEnabled: boolean;
    purchaseId: string | null;
    hasInvoiceAttachment: boolean;
}

export function renderRenewalEmail(data: RenewalEmailData): RenderedEmail {
    const ctx = getEmailContext();
    const greeting = data.customerName?.trim()
        ? `Olá, ${escapeHtml(data.customerName.trim().split(' ')[0])}.`
        : 'Olá.';

    const body = `
        ${hero('Assinatura renovada', 'Sua renovação foi concluída com sucesso',
            'A nova cobrança foi aprovada e seu período foi estendido.')}

        <tr><td class="voltris-pad" style="padding:26px 32px 8px 32px;">
          ${PARAGRAPH(`${greeting} A cobrança recorrente da sua assinatura foi aprovada e o período de acesso foi estendido automaticamente.`)}
          ${dataCard([
              ['Plano', escapeHtml(data.planName)],
              ['Valor cobrado', `<strong>${escapeHtml(formatBRL(data.amountPaid, data.currency))}</strong>`],
              ['Data da cobrança', escapeHtml(formatDateTimeBR(data.chargedAt))],
              ['Novo período', `${escapeHtml(formatDateBR(data.periodStart))} a ${escapeHtml(formatDateBR(data.periodEnd))}`],
              ['Nova validade da licença', escapeHtml(formatDateBR(data.licenseExpiresAt))],
              ...(data.nextBillingAt
                  ? ([['Próxima cobrança', escapeHtml(formatDateTimeBR(data.nextBillingAt))]] as Array<[string, string]>)
                  : []),
              ...(data.purchaseId ? ([['ID da cobrança', escapeHtml(data.purchaseId)]] as Array<[string, string]>) : []),
          ], C.green)}

          ${noteBlock(data.renewalEnabled
            ? `A renovação automática continua <strong>ativa</strong>. A próxima cobrança está programada${
                data.nextBillingAt ? ` para <strong>${escapeHtml(formatDateTimeBR(data.nextBillingAt))}</strong>` : ''
              }. Você pode desligá-la a qualquer momento pelo painel, sem multa.`
            : `A <strong>renovação automática está desligada</strong>. Seu acesso segue válido até <strong>${escapeHtml(formatDateTimeBR(data.licenseExpiresAt))}</strong> e nenhuma nova cobrança será feita.`,
            data.renewalEnabled ? 'info' : 'ok')}

          ${data.hasInvoiceAttachment
            ? PARAGRAPH('A fatura desta cobrança está anexada e também disponível no seu painel.')
            : ''}

          ${button('Ver minha assinatura', ctx.dashboardUrl)}
        </td></tr>`;

    const text = [
        greeting,
        '',
        'A cobrança recorrente da sua assinatura foi aprovada e o período de acesso foi estendido.',
        '',
        `Plano: ${data.planName}`,
        `Valor cobrado: ${formatBRL(data.amountPaid, data.currency)}`,
        `Data da cobrança: ${formatDateTimeBR(data.chargedAt)}`,
        `Novo período: ${formatDateBR(data.periodStart)} a ${formatDateBR(data.periodEnd)}`,
        `Nova validade da licença: ${formatDateBR(data.licenseExpiresAt)}`,
        data.nextBillingAt ? `Próxima cobrança: ${formatDateTimeBR(data.nextBillingAt)}` : 'Renovação automática: desligada',
        '',
        `Dashboard: ${ctx.dashboardUrl}`,
        `Suporte: ${ctx.supportEmail}`,
    ].join('\n');

    return {
        subject: 'VOLTRIS — Sua assinatura foi renovada com sucesso',
        html: shell('Sua assinatura foi renovada com sucesso',
            `Novo período válido até ${formatDateBR(data.licenseExpiresAt)}.`, body),
        text,
    };
}

// ============================================================================
// 3. CANCELAMENTO DE RENOVAÇÃO (FASE 8)
// ============================================================================

export interface CancellationEmailData {
    customerName?: string | null;
    planName: string;
    accessUntil: string | null;
    /** false quando a assinatura foi ENCERRADA, não apenas a renovação. */
    renewalOnly: boolean;
    canResume: boolean;
    subscriptionId: string | null;
}

export function renderCancellationEmail(data: CancellationEmailData): RenderedEmail {
    const ctx = getEmailContext();
    const greeting = data.customerName?.trim()
        ? `Olá, ${escapeHtml(data.customerName.trim().split(' ')[0])}.`
        : 'Olá.';

    const body = `
        ${hero('Renovação automática', 'Sua renovação automática foi desativada',
            data.renewalOnly
                ? 'Nenhuma nova cobrança será feita. Seu acesso atual continua normalmente.'
                : 'A sua assinatura foi encerrada.')}

        <tr><td class="voltris-pad" style="padding:26px 32px 8px 32px;">
          ${PARAGRAPH(`${greeting} Confirmamos a sua solicitação. ${data.renewalOnly
            ? 'A próxima cobrança programada foi removida e o seu acesso continua até o fim do período já pago.'
            : 'A sua assinatura foi encerrada e o acesso termina na data abaixo.'}`)}

          ${dataCard([
              ['Plano afetado', escapeHtml(data.planName)],
              ['Estado da renovação', data.renewalOnly ? 'Renovação automática desligada' : 'Assinatura encerrada'],
              [data.renewalOnly ? 'Acesso até' : 'Fim do acesso', escapeHtml(formatDateTimeBR(data.accessUntil))],
              ...(data.subscriptionId ? ([['Assinatura', escapeHtml(data.subscriptionId)]] as Array<[string, string]>) : []),
          ], C.cyan)}

          ${noteBlock(data.renewalOnly
            ? 'Você <strong>não paga nada a mais</strong> e <strong>não há multa</strong> por cancelar a renovação. Todos os recursos do seu plano continuam liberados normalmente até a data acima.'
            : 'O encerramento foi confirmado no processador de pagamentos. Se precisar revisar algum detalhe, fale com nosso suporte.',
            'ok')}
          ${data.canResume && data.renewalOnly
            ? PARAGRAPH('Se mudou de ideia, você pode reativar a renovação automática a qualquer momento antes da data acima, pelo seu painel.')
            : ''}

          ${button('Abrir meu painel', ctx.dashboardUrl)}
        </td></tr>`;

    const text = [
        greeting,
        '',
        data.renewalOnly
            ? 'A próxima cobrança programada foi removida e o seu acesso continua até o fim do período já pago.'
            : 'A sua assinatura foi encerrada.',
        '',
        `Plano: ${data.planName}`,
        `Estado: ${data.renewalOnly ? 'Renovação automática desligada' : 'Assinatura encerrada'}`,
        `${data.renewalOnly ? 'Acesso até' : 'Fim do acesso'}: ${formatDateTimeBR(data.accessUntil)}`,
        '',
        data.renewalOnly ? 'Não há multa e todos os recursos continuam liberados até a data acima.' : '',
        `Dashboard: ${ctx.dashboardUrl}`,
        `Suporte: ${ctx.supportEmail}`,
    ].filter(Boolean).join('\n');

    return {
        subject: 'VOLTRIS — Renovação automática desativada',
        html: shell('Renovação automática desativada',
            `Seu acesso continua até ${formatDateBR(data.accessUntil)}.`, body),
        text,
    };
}

// ============================================================================
// 4. REEMBOLSO (FASE 9) — três estados distintos, três mensagens distintas
// ============================================================================

export interface RefundEmailData {
    customerName?: string | null;
    stage: 'requested' | 'processing' | 'confirmed' | 'failed';
    planName: string;
    amount: number;
    currency: string;
    purchaseId: string | null;
    refundId: string | null;
    requestedAt?: string | null;
    resolvedAt?: string | null;
    /** Prazo de contrato restante quando o reembolso é de uma renovação. */
    accessUntil?: string | null;
    /**true quando a solicitação depende de análise humana. */
    manualReview?: boolean;
    reason?: string | null;
}

export function renderRefundEmail(data: RefundEmailData): RenderedEmail {
    const ctx = getEmailContext();
    const greeting = data.customerName?.trim()
        ? `Olá, ${escapeHtml(data.customerName.trim().split(' ')[0])}.`
        : 'Olá.';

    const META = {
        requested: {
            hero: 'Solicitação registrada',
            title: 'Recebemos sua solicitação de reembolso',
            sub: 'Nossa equipe vai analisar e entrará em contato.',
            accent: C.amber,
        },
        processing: {
            hero: 'Reembolso em processamento',
            title: 'Seu reembolso está sendo processado',
            sub: 'O processador de pagamentos está concluindo a operação.',
            accent: C.blue,
        },
        confirmed: {
            hero: 'Reembolso confirmado',
            title: 'Seu reembolso foi confirmado',
            sub: 'O valor devolvido é o que consta abaixo.',
            accent: C.green,
        },
        failed: {
            hero: 'Reembolso não concluído',
            title: 'Não foi possível concluir seu reembolso',
            sub: 'Nossa equipe foi avisada para revisar a operação.',
            accent: C.rose,
        },
    } as const;

    const meta = META[data.stage];

    const statusCard = dataCard([
        ['Compra', escapeHtml(data.purchaseId ?? '—')],
        ['Valor', `<strong>${escapeHtml(formatBRL(data.amount, data.currency))}</strong>`],
        ...(data.refundId ? ([['Identificador do reembolso', escapeHtml(data.refundId)]] as Array<[string, string]>) : []),
        ['Data da solicitação', escapeHtml(formatDateTimeBR(data.requestedAt))],
        ...(data.resolvedAt ? ([['Conclusão', escapeHtml(formatDateTimeBR(data.resolvedAt))]] as Array<[string, string]>) : []),
    ], meta.accent);

    const explain = {
        requested: data.manualReview
            ? noteBlock(
                `Sua solicitação está <strong>em análise</strong>. O prazo automático de 7 dias corridos já encerrou, e a política de reembolso prevê a avaliação caso a caso. <strong>Não afirmamos que o valor já foi devolvido</strong> — informaremos assim que houver uma decisão.`,
                'warn'
            )
            : noteBlock('Registramos sua solicitação. Você receberá a confirmação assim que o processamento for concluído.', 'info'),

        processing: noteBlock(
            'O reembolso foi criado e está em processamento no processador de pagamentos. <strong>O valor ainda não foi creditado</strong> — a prazo de disponibilidade depende da instituição emissora do cartão.',
            'info'
        ),

        confirmed: noteBlock(
            `O valor de <strong>${escapeHtml(formatBRL(data.amount, data.currency))}</strong> foi devolvido ao meio de pagamento original. O prazo para aparecer na fatura depende da instituição emissora: normalmente de 1 a 2 faturas para cartão.`,
            'ok'
        ),

        failed: noteBlock(
            'A operação de reembolso não pôde ser concluída. Nossa equipe foi notificada e vai revisar o caso. Se você efetuou a compra nos últimos 7 dias corridos, o direito de arrependimento permanece integralmente garantido.',
            'warn'
        ),
    }[data.stage];

    const accessBlock = data.stage === 'confirmed' && data.accessUntil
        ? noteBlock(
            `Sobre a sua licença: o acesso está garantido até <strong>${escapeHtml(formatDateTimeBR(data.accessUntil))}</strong>. Períodos já pagos que não foram reembolsados continuam válidos.`,
            'info'
        )
        : '';

    const body = `
        ${hero(meta.hero, meta.title, meta.sub)}

        <tr><td class="voltris-pad" style="padding:26px 32px 8px 32px;">
          ${PARAGRAPH(`${greeting} ${data.stage === 'confirmed'
                ? 'Informamos que o reembolso da sua compra foi confirmado.'
                : data.stage === 'processing'
                  ? 'O reembolso da sua compra foi enviado ao processador de pagamentos.'
                  : data.stage === 'failed'
                    ? 'Houve um problema ao concluir o reembolso da sua compra.'
                    : 'Registramos o seu pedido de reembolso.'}`)}

          ${statusCard}
          ${explain}
          ${accessBlock}

          ${button('Acessar meu painel', ctx.dashboardUrl)}
        </td></tr>`;

    /**
     * Versão em texto puro.
     *
     * Não é uma transcrição do HTML: cada estágio carrega a QUALIFIER que
     * evita uma leitura enganosa. Um cliente que lê em modo texto precisa
     * encontrar "ainda não foi creditado" e "não afirmamos que o valor já foi
     * devolvido" exatamente como quem vê o HTML encontra — senão a alternativa
     * textual vira um canal de comunicação menos preciso que o principal.
     */
    const textQualifier = {
        requested: data.manualReview
            ? 'Sua solicitação está EM ANÁLISE. Ainda NÃO devolvemos o valor — informaremos assim que houver uma decisão.'
            : 'Registramos sua solicitação. Você receberá a confirmação quando o processamento for concluído.',
        processing: 'O reembolso foi enviado ao processador de pagamentos, mas o valor AINDA NÃO FOI CREDITADO. A prazo de disponibilidade depende da instituição emissora do cartão.',
        confirmed: `O valor foi devolvido ao meio de pagamento original. O prazo para aparecer na fatura depende da instituição emissora (normalmente de 1 a 2 faturas).`,
        failed: 'A operação não pôde ser concluída. Nossa equipe foi avisada e vai revisar o caso. Se você comprou nos últimos 7 dias corridos, o direito de arrependimento permanece garantido.',
    }[data.stage];

    const text = [
        greeting,
        '',
        data.stage === 'confirmed' ? 'O reembolso da sua compra foi confirmado.'
            : data.stage === 'processing' ? 'O reembolso está sendo processado; o valor ainda não foi creditado.'
              : data.stage === 'failed' ? 'Não foi possível concluir o reembolso. Nossa equipe foi avisada.'
                : 'Registramos o seu pedido de reembolso.',
        '',
        textQualifier,
        '',
        `Compra: ${data.purchaseId ?? '—'}`,
        `Valor: ${formatBRL(data.amount, data.currency)}`,
        data.refundId ? `Reembolso: ${data.refundId}` : '',
        `Solicitado em: ${formatDateTimeBR(data.requestedAt)}`,
        data.accessUntil && data.stage === 'confirmed' ? `Acesso garantido até: ${formatDateTimeBR(data.accessUntil)}` : '',
        '',
        `Dashboard: ${ctx.dashboardUrl}`,
        `Suporte: ${ctx.supportEmail}`,
    ].filter((l) => l !== '').join('\n');

    const SUBJECTS = {
        requested: 'VOLTRIS — Recebemos sua solicitação de reembolso',
        processing: 'VOLTRIS — Seu reembolso está em processamento',
        confirmed: 'VOLTRIS — Seu reembolso foi confirmado',
        failed: 'VOLTRIS — Não foi possível concluir seu reembolso',
    } as const;

    return {
        subject: SUBJECTS[data.stage],
        html: shell(meta.title, meta.sub, body),
        text,
    };
}

// ============================================================================
// 5. FALHA NO PAGAMENTO (FASE 10)
// ============================================================================

export interface PaymentFailedEmailData {
    customerName?: string | null;
    planName: string;
    amount: number;
    currency: string;
    attemptedAt: string | null;
    accessUntil: string | null;
    subscriptionId: string | null;
}

export function renderPaymentFailedEmail(data: PaymentFailedEmailData): RenderedEmail {
    const ctx = getEmailContext();
    const greeting = data.customerName?.trim()
        ? `Olá, ${escapeHtml(data.customerName.trim().split(' ')[0])}.`
        : 'Olá.';

    const body = `
        ${hero('Falha na cobrança', 'Não foi possível processar sua renovação',
            'Atualize seu método de pagamento para manter a assinatura ativa.')}

        <tr><td class="voltris-pad" style="padding:26px 32px 8px 32px;">
          ${PARAGRAPH(`${greeting} A cobrança da sua assinatura não foi aprovada pelo processo de pagamento.`)}
          ${dataCard([
              ['Plano', escapeHtml(data.planName)],
              ['Valor da cobrança', `<strong>${escapeHtml(formatBRL(data.amount, data.currency))}</strong>`],
              ['Data da tentativa', escapeHtml(formatDateTimeBR(data.attemptedAt))],
              ['Situação da assinatura', 'Pagamento recusado — aguardando regularização'],
              ['Acesso até', escapeHtml(formatDateTimeBR(data.accessUntil))],
          ], C.rose)}

          ${noteBlock(
            `Seu <strong>acesso continua ativo</strong> até ${escapeHtml(formatDateTimeBR(data.accessUntil))}. Não pedimos dados de cartão por e-mail: a atualização é feita diretamente no ambiente seguro de pagamento.`,
            'warn'
          )}

          ${button('Atualizar forma de pagamento', ctx.dashboardUrl)}
        </td></tr>`;

    const text = [
        greeting,
        '',
        'A cobrança da sua assinatura não foi aprovada pelo processo de pagamento.',
        '',
        `Plano: ${data.planName}`,
        `Valor: ${formatBRL(data.amount, data.currency)}`,
        `Data da tentativa: ${formatDateTimeBR(data.attemptedAt)}`,
        `Acesso garantido até: ${formatDateTimeBR(data.accessUntil)}`,
        '',
        'Não pedimos dados de cartão por e-mail. Atualize pelo painel:',
        ctx.dashboardUrl,
        '',
        `Suporte: ${ctx.supportEmail}`,
    ].join('\n');

    return {
        subject: 'VOLTRIS — Não foi possível processar sua renovação',
        html: shell('Não foi possível processar sua renovação',
            'Atualize sua forma de pagamento para manter a assinatura ativa.', body),
        text,
    };
}

export { INVOICE_TIMEZONE };
