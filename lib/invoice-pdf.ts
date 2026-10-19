/**
 * GERAÇÃO DA FATURA COMERCIAL EM PDF (missão §6).
 *
 * Decisões técnicas e o porquê de cada uma:
 *
 *  - `pdf-lib`: biblioteca 100% JavaScript, sem binário nativo, que roda no
 *    runtime Node da Vercel sem subir um browser (cold start de segundos,
 *    centenas de MB) e sem depender de arquivo de fonte externo. As fontes
 *    standard usam WinAnsiEncoding, que cobre integralmente o português
 *    (á, â, ç, ã, é, ê, í, ó, ô, õ, ú, ü).
 *  - A identidade visual (degradê rosa -> roxo -> azul, cabeçalho premium,
 *    cartão do plano, rodapé) é desenhada nativamente com as primitivas do
 *    PDF, no mesmo vocabulário de cor do site
 *    (#FF4B6B rosa, #8B31FF roxo, #31A8FF azul).
 *  - O glifo "V" da marca é redesenhado em paths a partir de public/logo.png,
 *    para que o documento NUNCA saia sem identidade — mesmo que o arquivo de
 *    imagem não esteja disponível no bundle.
 *  - Layout por CURSOR ÚNICO: cada bloco informa quanto consumiu e o próximo
 *    começa exatamente abaixo. É o que garante que nada sobreponha nada,
 *    qualquer que seja o tamanho do conteúdo (nome longo, chave, observação).
 *  - O documento é gerado a partir dos fatos gravados no Supabase (espelho da
 *    Stripe). Se faltar dado histórico, o campo mostra "—" em vez de valor
 *    inventado (missão §6: "Se faltarem informações históricas, não invente").
 */

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type RGB } from 'pdf-lib';
import { getCompanyInfo, type CompanyInfo } from '@/lib/company';
import type { InvoiceKind } from '@/lib/invoice-data';

// ============================================================================
// PALETA — mesma da identidade do site (globals.css / Header / Footer)
// ============================================================================
const BRAND_PINK: RGB = rgb(1.0, 0.294, 0.42);    // #FF4B6B
const BRAND_PURPLE: RGB = rgb(0.545, 0.192, 1.0); // #8B31FF
const BRAND_BLUE: RGB = rgb(0.192, 0.659, 1.0);  // #31A8FF
const INK: RGB = rgb(0.09, 0.11, 0.16);           // #161C29
const INK_SOFT: RGB = rgb(0.42, 0.46, 0.54);      // #6B7589
const INK_MUTED: RGB = rgb(0.58, 0.62, 0.69);     // #949EB0
const PAPER: RGB = rgb(1, 1, 1);
const SURFACE: RGB = rgb(0.968, 0.976, 0.992);
const HAIRLINE: RGB = rgb(0.82, 0.85, 0.90);
const DANGER: RGB = rgb(0.82, 0.18, 0.26);
const SUCCESS: RGB = rgb(0.04, 0.52, 0.36);
const WARNING: RGB = rgb(0.72, 0.45, 0.05);

// A4 exato em pontos (72 dpi): 595,28 x 841,89
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 46;
const CONTENT_W = PAGE_W - MARGIN * 2;

const CHIP_BG_PURPLE = rgb(0.945, 0.933, 1);
const CHIP_BG_BLUE = rgb(0.906, 0.957, 1);
const CHIP_BG_NEUTRAL = rgb(0.957, 0.965, 0.98);

// ============================================================================
// TIPOGRAFIA / FORMATAÇÃO
// ============================================================================

/**
 * Fuso usado no documento.
 *
 * Fixo em America/Sao_Paulo de propósito: uma fatura brasileira precisa mostrar
 * a data no horário do contrato. Sem isso, o mesmo pagamento apareceria como
 * "18/11" ao rodar no servidor UTC da Vercel e "19/11" rodando local — o
 * documento mudaria de data conforme ONDE foi gerado. Este é o bug que os
 * testes pegaram.
 */
export const INVOICE_TIMEZONE = 'America/Sao_Paulo';

/** 15/08/2026 · 14:32 (pt-BR) — nunca o formato americano. */
export function formatDateTimeBR(iso: string | number | Date | null | undefined): string {
    if (iso === null || iso === undefined || iso === '') return '—';
    const date = iso instanceof Date ? iso : new Date(typeof iso === 'number'
        ? (iso < 1e11 ? iso * 1000 : iso)
        : iso);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
        timeZone: INVOICE_TIMEZONE,
    });
}

/** 15/08/2026 */
export function formatDateBR(iso: string | number | Date | null | undefined): string {
    if (iso === null || iso === undefined || iso === '') return '—';
    const date = iso instanceof Date ? iso : new Date(typeof iso === 'number'
        ? (iso < 1e11 ? iso * 1000 : iso)
        : iso);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('pt-BR', { timeZone: INVOICE_TIMEZONE });
}

/** R$ 1.234,56 — nunca US$. */
export function formatBRL(value: number | string | null | undefined, currency = 'BRL'): string {
    const n = typeof value === 'string' ? Number(value) : value;
    if (n === null || n === undefined || !Number.isFinite(n)) return '—';
    return n.toLocaleString('pt-BR', {
        style: 'currency',
        currency: (currency || 'BRL').toUpperCase(),
    });
}

/**
 * Quebra de linha por largura real. Usa `widthOfTextAtSize` (medição de
 * verdade, não estimativa), com fallback para não quebrar em texto sem espaço.
 */
function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
    const source = String(text ?? '');
    if (source === '') return [''];

    const lines: string[] = [];
    let current = '';

    for (const word of source.split(/\s+/)) {
        const candidate = current ? `${current} ${word}` : word;
        if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
            current = candidate;
            continue;
        }
        if (current) lines.push(current);
        // Palavra sozinha maior que a linha: corta por caractere.
        if (font.widthOfTextAtSize(word, size) > maxWidth) {
            let chunk = '';
            for (const ch of word) {
                if (font.widthOfTextAtSize(chunk + ch, size) > maxWidth && chunk) {
                    lines.push(chunk);
                    chunk = ch;
                } else {
                    chunk += ch;
                }
            }
            current = chunk;
        } else {
            current = word;
        }
    }
    if (current) lines.push(current);
    return lines.length > 0 ? lines : [''];
}

/**
 * Reduz o corpo da fonte até o texto caber em `maxWidth` (e, se ainda não
 * couber, trunca com reticências). Usado em chaves de licença, que têm
 * comprimento variável mas nunca devem estourar o cartão.
 */
function fitText(
    text: string,
    font: PDFFont,
    maxWidth: number,
    startSize: number,
    minSize = 7
): { text: string; size: number } {
    let size = startSize;
    while (size > minSize && font.widthOfTextAtSize(text, size) > maxWidth) {
        size -= 0.5;
    }
    if (font.widthOfTextAtSize(text, size) <= maxWidth) return { text, size };

    let clipped = text;
    while (clipped.length > 4 && font.widthOfTextAtSize(`${clipped}…`, size) > maxWidth) {
        clipped = clipped.slice(0, -1);
    }
    return { text: `${clipped}…`, size };
}

// ============================================================================
// PRIMITIVAS DE DESENHO
// ============================================================================

interface Fonts {
    regular: PDFFont;
    bold: PDFFont;
    italic: PDFFont;
}

/** Amostra de faixas que reproduz o degradê rosa -> roxo -> azul da marca. */
function drawBrandGradient(page: PDFPage, x: number, y: number, w: number, h: number) {
    const pr = BRAND_PINK.red, pg = BRAND_PINK.green, pb = BRAND_PINK.blue;
    const ur = BRAND_PURPLE.red, ug = BRAND_PURPLE.green, ub = BRAND_PURPLE.blue;
    const br = BRAND_BLUE.red, bg = BRAND_BLUE.green, bb = BRAND_BLUE.blue;

    const steps = 16;
    const sw = w / steps;
    for (let i = 0; i < steps; i++) {
        const t = steps > 1 ? i / (steps - 1) : 0;
        const k = t < 0.5 ? t / 0.5 : (t - 0.5) / 0.5;
        const from = t < 0.5 ? [pr, pg, pb] : [ur, ug, ub];
        const to = t < 0.5 ? [ur, ug, ub] : [br, bg, bb];
        const color = rgb(
            from[0] + (to[0] - from[0]) * k,
            from[1] + (to[1] - from[1]) * k,
            from[2] + (to[2] - from[2]) * k
        );
        page.drawRectangle({ x: x + i * sw, y, width: sw + 0.6, height: h, color });
    }
}

/**
 * Retângulo arredondado de verdade (curvas de Bézier), não o "quase arredondado"
 * de três retângulos sobrepostos — que deixava os cantos internos aparecendo
 * quando o preenchimento e a borda tinham cores diferentes.
 */
function roundedRect(
    page: PDFPage,
    x: number, y: number, w: number, h: number, r: number,
    opts: { color?: RGB; borderColor?: RGB; borderWidth?: number } = {}
) {
    const rad = Math.max(0, Math.min(r, w / 2, h / 2));
    if (rad === 0) {
        page.drawRectangle({
            x, y, width: w, height: h,
            color: opts.color, borderColor: opts.borderColor, borderWidth: opts.borderWidth ?? 0,
        });
        return;
    }

    const k = rad * 0.5523;
    const x2 = x + w, y2 = y + h;

    const path = [
        `M ${x + rad} ${y}`,
        `L ${x2 - rad} ${y}`,
        `C ${x2 - rad + k} ${y} ${x2} ${y + rad - k} ${x2} ${y + rad}`,
        `L ${x2} ${y2 - rad}`,
        `C ${x2} ${y2 - rad + k} ${x2 - rad + k} ${y2} ${x2 - rad} ${y2}`,
        `L ${x + rad} ${y2}`,
        `C ${x + rad - k} ${y2} ${x} ${y2 - rad + k} ${x} ${y2 - rad}`,
        `L ${x} ${y + rad}`,
        `C ${x} ${y + rad - k} ${x + rad - k} ${y} ${x + rad} ${y}`,
        'Z',
    ].join(' ');

    page.drawSvgPath(path, {
        x: 0, y: 0,
        color: opts.color,
        borderColor: opts.borderColor,
        borderWidth: opts.borderWidth ?? 0,
    });
}

/**
 * Glifo "V" da VOLTRIS — versão vetorial do logo oficial (public/logo.png),
 * com as três lâminas em rosa, roxo e azul.
 */
function drawVoltrisMark(page: PDFPage, x: number, y: number, s: number) {
    // Feito com `drawLine` (traço grosso) e não com `drawSvgPath`: o
    // interpretador de SVG do pdf-lib usa Y-para-baixo, enquanto o PDF usa
    // Y-para-cima — o caminho saía espelhado e fora da página.
    page.drawLine({
        start: { x: x + s * 0.06, y: y + s * 0.94 },
        end: { x: x + s * 0.30, y: y + s * 0.06 },
        thickness: s * 0.17, color: BRAND_PINK,
    });
    page.drawLine({
        start: { x: x + s * 0.26, y: y + s * 0.90 },
        end: { x: x + s * 0.46, y: y + s * 0.08 },
        thickness: s * 0.16, color: BRAND_PURPLE,
    });
    page.drawLine({
        start: { x: x + s * 0.88, y: y + s * 0.88 },
        end: { x: x + s * 0.52, y: y + s * 0.04 },
        thickness: s * 0.18, color: BRAND_BLUE,
    });
}

/** Chip colorido. Devolve a largura consumida para o cursor horizontal. */
function drawChip(
    page: PDFPage, fonts: Fonts,
    x: number, y: number, text: string, color: RGB, bg: RGB
): number {
    const label = text.toUpperCase();
    const size = 6.6;
    const padX = 7;
    const w = fonts.bold.widthOfTextAtSize(label, size) + padX * 2;
    const h = 14;
    roundedRect(page, x, y, w, h, 7, { color: bg });
    page.drawText(label, { x: x + padX, y: y + 4.4, size, font: fonts.bold, color });
    return w;
}

/** Título de seção com sublinhado na cor da marca. */
function drawSectionTitle(page: PDFPage, fonts: Fonts, x: number, y: number, text: string) {
    page.drawText(text, { x, y, size: 8.4, font: fonts.bold, color: BRAND_PURPLE });
    page.drawRectangle({ x, y: y - 5.5, width: 48, height: 1.8, color: BRAND_PINK });
}

// ============================================================================
// TÍTULO POR TIPO DE COBRANÇA (missão §6: distinguir compra de renovação)
// ============================================================================

export function invoiceTitle(kind: InvoiceKind): string {
    switch (kind) {
        case 'renewal': return 'Fatura de Renovação';
        case 'refund': return 'Comprovante de Reembolso';
        case 'service': return 'Fatura de Serviço';
        case 'purchase':
        default: return 'Fatura Comercial';
    }
}

function invoiceSubtitle(kind: InvoiceKind): string {
    switch (kind) {
        case 'renewal': return 'Cobrança recorrente do período contratado.';
        case 'refund': return 'Valor devolvido ao cliente.';
        case 'service': return 'Serviço profissional contratado.';
        case 'purchase':
        default: return 'Assinatura inicial do Voltris Optimizer.';
    }
}

/** Rótulo curto para o chip (o chip tem largura limitada pelo cartão). */
function shortPlanChip(label: string): string {
    return label.replace(/^VOLTRIS\s*/i, '');
}

// ============================================================================
// DADOS DA FATURA
// ============================================================================

export interface InvoiceData {
    /** Identificador comercial impresso no documento. */
    invoiceNumber: string;
    kind: InvoiceKind;
    /** uuid da compra no banco (identificador interno). */
    purchaseId: string | null;
    /** `in_…` — fatura da Stripe (quando existe). */
    stripeInvoiceId: string | null;
    /** `pi_…` — PaymentIntent. */
    stripePaymentId: string | null;
    stripeChargeId: string | null;
    stripeSubscriptionId: string | null;
    purchasedAt: string | null;
    paidAt: string | null;

    customerName: string | null;
    customerEmail: string | null;
    customerDocument: string | null;

    productName: string;
    planLabel: string;
    billingLabel: string;

    /** Valor EFETIVAMENTE pago nesta cobrança (nunca o preço do plano). */
    amountPaid: number;
    /** Valor devolvido, quando reembolsado. */
    amountRefunded: number | null;
    currency: string;

    paymentStatusLabel: string;
    paymentStatusTone: 'ok' | 'warn' | 'bad';

    licenseKey: string | null;
    maxDevices: number | null;
    devicesInUse: number | null;
    licenseStartedAt: string | null;
    licenseExpiresAt: string | null;
    licenseStateLabel: string;
    licenseStateTone: 'ok' | 'warn' | 'bad';

    periodStart: string | null;
    periodEnd: string | null;

    /** Texto legal específico (ex.: motivo do reembolso). */
    legalNote: string | null;
}

export interface GeneratedInvoice {
    bytes: Uint8Array;
    fileName: string;
}

// ============================================================================
// GERADOR
// ============================================================================

/**
 * Gera o PDF da fatura.
 *
 * Todo campo vem de `InvoiceData`, que por sua vez é montado a partir do banco
 * (espelho da Stripe) depois da checagem de posse na rota. Não existe valor,
 * nome ou chave hard-coded aqui.
 */
export async function generateInvoicePdf(data: InvoiceData): Promise<GeneratedInvoice> {
    const { info: company } = getCompanyInfo();

    const doc = await PDFDocument.create();
    doc.setTitle(`${invoiceTitle(data.kind)} ${data.invoiceNumber}`);
    doc.setAuthor(company.razaoSocial);
    doc.setSubject(`Documento comercial VOLTRIS — ${data.invoiceNumber}`);
    // Observação: o pdf-lib reescreve /Producer no `save()` com o próprio nome da
    // biblioteca, então este call é inefetivo. Os campos que importam para um
    // documento comercial (Title, Author, Subject, CreationDate) são preservados
    // e definem quem produziu/assinou o arquivo nos leitores de PDF.
    doc.setCreator('VOLTRIS');

    // Metadata determinística: o mesmo documento para a mesma cobrança.
    doc.setCreationDate(new Date(data.purchasedAt ?? Date.now()));
    if (data.paidAt) doc.setModificationDate(new Date(data.paidAt));

    const fonts: Fonts = {
        regular: await doc.embedFont(StandardFonts.Helvetica),
        bold: await doc.embedFont(StandardFonts.HelveticaBold),
        italic: await doc.embedFont(StandardFonts.HelveticaOblique),
    };

    const page = doc.addPage([PAGE_W, PAGE_H]);
    page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: PAPER });

    let y = drawHeader(page, fonts, company, data);

    // ---------------------------------------------------------------------
    // Cartão "destaque do plano"
    // ---------------------------------------------------------------------
    y -= 10;
    const cardH = 84;
    const cardTop = y;
    roundedRect(page, MARGIN, cardTop - cardH, CONTENT_W, cardH, 10, {
        color: SURFACE, borderColor: HAIRLINE, borderWidth: 0.8,
    });
    drawBrandGradient(page, MARGIN + 1, cardTop - cardH + 8, 4.5, cardH - 16);

    const cardTextX = MARGIN + 20;
    page.drawText(fitText(data.productName, fonts.bold, CONTENT_W * 0.56, 16, 11).text, {
        x: cardTextX, y: cardTop - 28, size: 16, font: fonts.bold, color: INK,
    });
    page.drawText(invoiceSubtitle(data.kind), {
        x: cardTextX, y: cardTop - 43, size: 8.2, font: fonts.regular, color: INK_SOFT,
    });

    // Chips — largura disponível à esquerda do valor
    const amountText = formatBRL(data.amountPaid, data.currency);
    const amountSize = 22;
    const amountW = fonts.bold.widthOfTextAtSize(amountText, amountSize);
    const amountX = PAGE_W - MARGIN - 18 - amountW;
    const chipsRightLimit = amountX - 24;

    let chipX = cardTextX;
    const chipY = cardTop - cardH + 16;
    const chipDefs: Array<[string, RGB, RGB]> = [
        [shortPlanChip(data.planLabel), BRAND_PURPLE, CHIP_BG_PURPLE],
        [data.billingLabel.split(' — ')[0], BRAND_BLUE, CHIP_BG_BLUE],
        [data.paymentStatusLabel, toneColor(data.paymentStatusTone), CHIP_BG_NEUTRAL],
    ];
    for (const [label, color, bg] of chipDefs) {
        const probe = fonts.bold.widthOfTextAtSize(label.toUpperCase(), 6.6) + 14;
        if (chipX + probe > chipsRightLimit) break;   // sem transbordar o cartão
        chipX += drawChip(page, fonts, chipX, chipY, label, color, bg) + 6;
    }

    page.drawText(amountText, {
        x: amountX, y: cardTop - 32, size: amountSize, font: fonts.bold, color: INK,
    });
    page.drawText('VALOR PAGO NESTA COBRANÇA', {
        x: PAGE_W - MARGIN - 18 - 140, y: cardTop - 44, size: 6.4, font: fonts.regular, color: INK_MUTED,
    });

    if (typeof data.amountRefunded === 'number' && data.amountRefunded > 0) {
        const refundText = `Reembolsado: ${formatBRL(data.amountRefunded, data.currency)}`;
        page.drawText(refundText, {
            x: PAGE_W - MARGIN - 18 - fonts.regular.widthOfTextAtSize(refundText, 8.4),
            y: cardTop - 57, size: 8.4, font: fonts.bold, color: DANGER,
        });
    }

    y = cardTop - cardH - 26;

    // ---------------------------------------------------------------------
    // Dados da transação (duas colunas alinhadas)
    // ---------------------------------------------------------------------
    drawSectionTitle(page, fonts, MARGIN, y, 'DADOS DA TRANSAÇÃO');
    y -= 22;

    const colGap = 26;
    const colW = (CONTENT_W - colGap) / 2;
    const colX = [MARGIN, MARGIN + colW + colGap];

    const leftRows: Array<[string, string]> = [
        ['Identificador da compra', data.purchaseId ?? '—'],
        ['Referência do pagamento', data.stripePaymentId ?? '—'],
        ['Data da compra', formatDateTimeBR(data.purchasedAt)],
        ['Pagamento confirmado em', formatDateTimeBR(data.paidAt)],
        ['Modalidade de cobrança', data.billingLabel],
    ];
    const rightRows: Array<[string, string]> = [
        ['Fatura Stripe', data.stripeInvoiceId ?? '—'],
        ['Cobrança Stripe', data.stripeChargeId ?? '—'],
        ['Período pago', data.periodStart || data.periodEnd
            ? `${formatDateBR(data.periodStart)} a ${formatDateBR(data.periodEnd)}`
            : '—'],
        ['Assinatura', data.stripeSubscriptionId ?? '— (compra avulsa)'],
        ['Plano adquirido', data.planLabel],
    ];

    const rows = Math.max(leftRows.length, rightRows.length);
    for (let i = 0; i < rows; i++) {
        const used = Math.max(
            i < leftRows.length ? drawInfoRow(page, fonts, colX[0], y, colW, leftRows[i][0], leftRows[i][1]) : 0,
            i < rightRows.length ? drawInfoRow(page, fonts, colX[1], y, colW, rightRows[i][0], rightRows[i][1]) : 0,
        );
        y = used - 20;
    }

    // ---------------------------------------------------------------------
    // Licença
    // ---------------------------------------------------------------------
    drawSectionTitle(page, fonts, MARGIN, y, 'LICENÇA VOLTRIS OPTIMIZER');
    y -= 22;

    const licH = 78;
    roundedRect(page, MARGIN, y - licH, CONTENT_W, licH, 10, {
        color: SURFACE, borderColor: rgb(0.82, 0.85, 0.90), borderWidth: 0.9,
    });

    const licLeftW = CONTENT_W * 0.52;
    page.drawText('Chave de licença', {
        x: MARGIN + 16, y: y - 19, size: 7.2, font: fonts.regular, color: INK_MUTED,
    });
    const keyFitted = fitText(data.licenseKey ?? '—', fonts.bold, licLeftW - 32, 10.5, 7);
    page.drawText(keyFitted.text, {
        x: MARGIN + 16, y: y - 34, size: keyFitted.size, font: fonts.bold, color: INK,
    });

    page.drawText('Dispositivos', {
        x: MARGIN + 16, y: y - 54, size: 7.2, font: fonts.regular, color: INK_MUTED,
    });
    const devices = typeof data.maxDevices === 'number'
        ? (data.maxDevices >= 9999
            ? 'Ilimitados'
            : `${data.maxDevices} permitido${data.maxDevices === 1 ? '' : 's'}${data.devicesInUse !== null ? ` · ${data.devicesInUse} em uso` : ''}`)
        : '—';
    page.drawText(devices, { x: MARGIN + 16, y: y - 67, size: 9, font: fonts.bold, color: INK });

    const licRightX = MARGIN + licLeftW + 14;
    const licRightW = CONTENT_W - licLeftW - 30;
    let ly = y - 19;
    ly = drawInfoRow(page, fonts, licRightX, ly, licRightW, 'Início da vigência', formatDateTimeBR(data.licenseStartedAt), { size: 8.6, valueFont: fonts.regular });
    ly = drawInfoRow(page, fonts, licRightX, ly, licRightW, 'Expiração', formatDateTimeBR(data.licenseExpiresAt), { size: 8.6, valueFont: fonts.regular });
    drawInfoRow(page, fonts, licRightX, ly, licRightW, 'Situação', data.licenseStateLabel, {
        size: 8.6, valueColor: toneColor(data.licenseStateTone),
    });

    y -= licH + 26;

    // ---------------------------------------------------------------------
    // Observação específica (ex.: motivo do reembolso)
    // ---------------------------------------------------------------------
    if (data.legalNote) {
        const noteLines = wrapText(data.legalNote, fonts.regular, 8.2, CONTENT_W - 28);
        const noteH = 22 + noteLines.length * 11;
        roundedRect(page, MARGIN, y - noteH, CONTENT_W, noteH, 8, {
            color: rgb(0.995, 0.985, 0.945), borderColor: rgb(0.93, 0.86, 0.62), borderWidth: 0.8,
        });
        page.drawText('OBSERVAÇÃO', { x: MARGIN + 14, y: y - 17, size: 7, font: fonts.bold, color: rgb(0.58, 0.42, 0.05) });
        let ny = y - 29;
        for (const line of noteLines) {
            page.drawText(line, { x: MARGIN + 14, y: ny, size: 8.2, font: fonts.regular, color: INK });
            ny -= 11;
        }
        y -= noteH + 22;
    }

    drawFooter(page, fonts, company);

    const bytes = await doc.save();

    // Nome de arquivo ASCII-safe: acentos em `Content-Disposition` quebram em
    // alguns navegadores e proxies.
    const safeNumber = data.invoiceNumber.replace(/[^A-Za-z0-9._-]/g, '-');
    const safeKind = invoiceTitle(data.kind)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-');

    return {
        bytes,
        fileName: `VOLTRIS-${safeKind}-${safeNumber}.pdf`,
    };
}

function toneColor(tone: 'ok' | 'warn' | 'bad'): RGB {
    return tone === 'ok' ? SUCCESS : tone === 'bad' ? DANGER : WARNING;
}

// ============================================================================
// BLOCOS COM CURSOR ÚNICO
// ============================================================================

/**
 * Linha rótulo -> valor com quebra real. Devolve o Y da PRÓXIMA linha (ou seja,
 * o quanto o bloco consumiu), o que é o que impede o desalinhamento Progressivo
 * entre as duas colunas.
 */
function drawInfoRow(
    page: PDFPage, fonts: Fonts,
    x: number, y: number, w: number, label: string, value: string,
    opts: { valueColor?: RGB; valueFont?: PDFFont; size?: number } = {}
): number {
    const size = opts.size ?? 9;
    const valueFont = opts.valueFont ?? fonts.bold;
    const valueColor = opts.valueColor ?? INK;

    const labelW = Math.min(122, w * 0.48);
    page.drawText(label, { x, y, size: 8, font: fonts.regular, color: INK_SOFT });

    const valueX = x + labelW;
    const lines = wrapText(value ?? '—', valueFont, size, w - labelW);
    lines.forEach((line, i) => {
        page.drawText(line, { x: valueX, y: y - i * 11.5, size, font: valueFont, color: valueColor });
    });

    return y - lines.length * 11.5;
}

/** Cabeçalho: marca, documento, emitente e cliente. Devolve o cursor livre. */
function drawHeader(page: PDFPage, fonts: Fonts, company: CompanyInfo, invoice: InvoiceData): number {
    const top = PAGE_H - MARGIN;

    // Faixa de marca no topo da página
    drawBrandGradient(page, 0, top + MARGIN - 12, PAGE_W, 5);

    // Logo + nome
    drawVoltrisMark(page, MARGIN, top - 26, 32);
    page.drawText('VOLTRIS', { x: MARGIN + 42, y: top - 12, size: 19, font: fonts.bold, color: INK });
    page.drawText('VOLTRIS OPTIMIZER', {
        x: MARGIN + 43, y: top - 25, size: 7.2, font: fonts.regular, color: BRAND_PURPLE,
    });

    // Documento (à direita)
    page.drawText(invoiceTitle(invoice.kind), {
        x: PAGE_W - MARGIN - 190, y: top - 12, size: 12, font: fonts.bold, color: INK,
    });
    page.drawText(invoice.invoiceNumber, {
        x: PAGE_W - MARGIN - 190, y: top - 25, size: 8.6, font: fonts.regular, color: INK_SOFT,
    });

    let y = top - 40;

    page.drawRectangle({ x: MARGIN, y, width: CONTENT_W, height: 0.8, color: HAIRLINE });
    y -= 20;

    // Emitente / Cliente — altura calculada pelo maior bloco
    const colGap = 26;
    const colW = (CONTENT_W - colGap) / 2;

    const emitterLines: string[] = [
        company.razaoSocial,
        company.cnpj ? `CNPJ: ${company.cnpj}` : 'CNPJ: não informado',
        company.endereco,
        company.email,
    ];
    const clientLines: string[] = [
        invoice.customerName ?? '—',
        invoice.customerEmail ?? '—',
        invoice.customerDocument ? `ID do cliente: ${invoice.customerDocument}` : 'ID do cliente: —',
    ];

    const emitBottom = drawField(page, fonts, MARGIN, y, colW, 'EMITENTE', emitterLines);
    const clientBottom = drawField(page, fonts, MARGIN + colW + colGap, y, colW, 'CLIENTE', clientLines);

    return Math.min(emitBottom, clientBottom) - 4;
}

/** Bloco "rótulo em cima, lista de linhas embaixo". Devolve o Y final. */
function drawField(
    page: PDFPage, fonts: Fonts,
    x: number, y: number, w: number, label: string, lines: string[]
): number {
    page.drawText(label, { x, y, size: 6.8, font: fonts.bold, color: BRAND_PURPLE });

    let ly = y - 13;
    for (const line of lines) {
        for (const wrapped of wrapText(line, fonts.regular, 8.4, w)) {
            page.drawText(wrapped, { x, y: ly, size: 8.4, font: fonts.regular, color: INK });
            ly -= 11;
        }
    }
    return ly;
}

/** Rodapé com o aviso legal obrigatório (missão §6). */
function drawFooter(page: PDFPage, fonts: Fonts, company: CompanyInfo) {
    const y = MARGIN + 30;

    page.drawRectangle({ x: MARGIN, y: y + 22, width: CONTENT_W, height: 0.8, color: HAIRLINE });

    let ly = y + 10;
    for (const line of wrapText(company.avisoDocumento, fonts.italic, 7.6, CONTENT_W)) {
        page.drawText(line, { x: MARGIN, y: ly, size: 7.6, font: fonts.italic, color: INK_SOFT });
        ly -= 9.5;
    }

    page.drawText(`${company.site.replace(/^https?:\/\//, '')}  ·  ${company.email}`, {
        x: MARGIN, y: MARGIN - 6, size: 7, font: fonts.regular, color: INK_MUTED,
    });
}