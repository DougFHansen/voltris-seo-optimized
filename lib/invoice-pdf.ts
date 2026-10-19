/**
 * FATURA EM PDF — redesenhada para ser IDÊNTICA ao documento do aplicativo
 * desktop (referência: "Fatura_VOLTRIS_PRO_Alvaro_Araujo.pdf" entregue pelo
 * operador).
 *
 * O desenho NÃO foi inventado: ele foi extraído do PDF de referência
 * (streams de conteúdo, cores, coordenadas, fontes e textos) e reproduzido com
 * `pdf-lib` + as MESMAS fontes (Lato Black/Semibold/Regular/Bold e DejaVu Sans
 * Mono), depositadas em `assets/fonts`.
 *
 * Especificação (A4 = 595,2756 x 841,8898 pt):
 *
 *   topo ............ barra em gradiente rosa -> azul (7 pt)
 *   cabeçalho ........ banda #111327 (y 632..842) + faixa #161A34 (y 632..694)
 *                      + hachuras diagonais #2E3156 + marca VOLTRIS
 *   corpo ............ fundo branco, seções com título roxo #9C47DB
 *   emitente/cliente . duas colunas separadas por um fio em x=298
 *   detalhamento ..... cartão #F5F6FC (509x147)
 *   total ............ cartão #F2ECFA (509x38), valor em #7741C7
 *   chave ............ cartão escuro #111327 (509x91) com barra azul
 *   rodapé .......... avisos em #69738C e assinatura #6A4FA6
 */

import {
    PDFDocument,
    StandardFonts,
    rgb,
    appendBezierCurve,
    closePath,
    fill,
    lineTo,
    moveTo,
    popGraphicsState,
    pushGraphicsState,
    setFillingRgbColor,
    type Color,
    type PDFFont,
    type PDFPage,
    type RGB,
} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getCompanyInfo } from '@/lib/company';

/* ------------------------------------------------------------------ cores */

const C = {
    white: rgb(1, 1, 1),
    header: rgb(0.066667, 0.07451, 0.152941),       // #111327
    headerAccent: rgb(0.086275, 0.101961, 0.203922), // #161A34
    headerLine: rgb(0.180392, 0.192157, 0.337255),   // #2E3156
    brandPink: rgb(1, 0.247059, 0.454902),          // #FF3F74
    brandBlue: rgb(0.090196, 0.407843, 0.847059),    // #1768D8
    violet: rgb(0.611765, 0.278431, 0.858824),       // #9C47DB
    blue: rgb(0.090196, 0.407843, 0.847059),         // #1768D8
    ink: rgb(0.094118, 0.12549, 0.231373),           // #18203B
    inkSoft: rgb(0.411765, 0.45098, 0.54902),        // #69738C
    inkMuted: rgb(0.643137, 0.670588, 0.807843),     // #A4ABCE
    inkLight: rgb(0.768627, 0.788235, 0.878431),     // #C4C9E0
    onDark: rgb(0.65098, 0.976471, 0.831373),        // #A6F9D4
    onDark2: rgb(0.85098, 0.866667, 0.945098),       // #D9DDF1
    onDark3: rgb(0.843137, 0.756863, 0.960784),      // #D7C1F5
    onDark4: rgb(0.745098, 0.772549, 0.905882),      // #BEC5E7
    total: rgb(0.466667, 0.254902, 0.780392),         // #7741C7
    footer: rgb(0.415686, 0.309804, 0.65098),         // #6A4FA6
    cardSoft: rgb(0.960784, 0.964706, 0.988235),     // #F5F6FC
    cardTotal: rgb(0.94902, 0.92549, 0.980392),      // #F2ECFA
    hairline: rgb(0.882353, 0.898039, 0.937255),     // #E1E5EF
    divider: rgb(0.858824, 0.87451, 0.933333),       // #DBDFEE
    pillBg: rgb(0.129412, 0.235294, 0.270588),       // #213C45
    checkGreen: rgb(0.196078, 0.811765, 0.584314),   // #32CF95
    mark: rgb(0.113725, 0.137255, 0.25098),          // #1D2350
};

/* ------------------------------------------------------------------ página */

const PAGE_W = 595.2756;
const PAGE_H = 841.8898;

/* ------------------------------------------------------------------ fontes */

interface Fonts {
    heavy: PDFFont;
    semibold: PDFFont;
    regular: PDFFont;
    bold: PDFFont;
    mono: PDFFont;
}

/**
 * Os ARQUIVOS das fontes ficam em cache (leitura uma vez por processo), mas a
 * FONTE EMBUTIDA é criada por documento.
 *
 * Por quê: um `PDFFont` pertence ao `PDFDocument` em que foi criado. Reusar
 * o mesmo objeto em outro documento produz um PDF com glifos/cMap do
 * documento anterior — o arquivo saía correto no primeiro pedido e quebrado
 * no segundo (texto ilegível). Este é o tipo de bug que só aparece em
 * produção, no segundo usuário.
 */
let fontFiles: { heavy: Buffer; semibold: Buffer; regular: Buffer; bold: Buffer; mono: Buffer } | null = null;

async function lerFontes(): Promise<NonNullable<typeof fontFiles>> {
    if (fontFiles) return fontFiles;
    const dir = path.join(process.cwd(), 'assets', 'fonts');
    const ler = (nome: string) => readFile(path.join(dir, nome));
    fontFiles = {
        heavy: await ler('Lato-Black.ttf'),
        semibold: await ler('Lato-SemiBold.ttf'),
        regular: await ler('Lato-Regular.ttf'),
        bold: await ler('Lato-Bold.ttf'),
        mono: await ler('DejaVuSansMono.ttf'),
    };
    return fontFiles;
}

async function carregarFontes(doc: PDFDocument): Promise<Fonts> {
    doc.registerFontkit(fontkit as never);
    const f = await lerFontes();
    const emb = (bytes: Buffer) => doc.embedFont(bytes as never, { subset: true } as never);
    return {
        heavy: await emb(f.heavy),
        semibold: await emb(f.semibold),
        regular: await emb(f.regular),
        bold: await emb(f.bold),
        mono: await emb(f.mono),
    };
}

/* --------------------------------------------------------------- formatos */

export const INVOICE_TIMEZONE = 'America/Sao_Paulo';

export function formatDateTimeBR(iso: string | number | Date | null | undefined): string {
    if (iso === null || iso === undefined || iso === '') return '—';
    const d = iso instanceof Date ? iso : new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    try {
        return d.toLocaleString('pt-BR', {
            timeZone: INVOICE_TIMEZONE,
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    } catch {
        return '-';
    }
}

export function formatDateBR(iso: string | number | Date | null | undefined): string {
    if (iso === null || iso === undefined || iso === '') return '—';
    const d = iso instanceof Date ? iso : new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    try {
        return d.toLocaleDateString('pt-BR', {
            timeZone: INVOICE_TIMEZONE,
            day: '2-digit', month: '2-digit', year: 'numeric',
        });
    } catch {
        return '-';
    }
}

export function formatBRL(value: number | string | null | undefined, currency = 'BRL'): string {
    const n = typeof value === 'string' ? Number(value) : value;
    if (value === null || value === undefined || value === '' || !Number.isFinite(n as number)) return '—';
    try {
        return (n as number).toLocaleString('pt-BR', { style: 'currency', currency });
    } catch {
        return '-';
    }
}

/** Identificadores longos não podem quebrar o layout: encurta preservando o início e o fim. */
export function shortenRef(value: string | null | undefined, keep = 8): string {
    const v = (value ?? '').trim();
    if (!v) return '—';
    if (v.length <= keep * 2 + 1) return v;
    return `${v.slice(0, keep)}…${v.slice(-keep)}`;
}

/** "17 OUT 2026" — o formato do topo do documento. */
function dataLongaBR(iso: string | null | undefined): string {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    try {
        const partes = new Intl.DateTimeFormat('en-CA', {
            timeZone: INVOICE_TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit',
        }).formatToParts(d);
        const get = (tipo: string) => partes.find((p) => p.type === tipo)?.value ?? '';
        return `${get('day')} ${meses[Number(get('month')) - 1] ?? ''} ${get('year')}`;
    } catch {
        return '—';
    }
}

/** Ciclo curto: "Mensal", "Anual", "Pagamento único". */
function cicloCurto(billingPeriod: string | null | undefined): string {
    const p = (billingPeriod ?? '').trim().toLowerCase();
    if (!p) return '';
    if (['year', 'anual', 'annual', 'y'].includes(p)) return 'Anual';
    if (['month', 'mensal', 'monthly', 'm'].includes(p)) return 'Mensal';
    if (['week', 'semanal'].includes(p)) return 'Semanal';
    if (['day', 'diario', 'diário'].includes(p)) return 'Diário';
    if (p.includes('único') || p.includes('unico')) return 'Pagamento único';
    if (p.includes('recorrente')) return 'Mensal';
    if (p.includes('avulsa')) return 'Mensal';
    return '';
}

/* ------------------------------------------------------------------ dados */

export type InvoiceKind = 'purchase' | 'renewal' | 'service' | 'refund';

export interface InvoiceData {
    invoiceNumber: string;
    kind: InvoiceKind;
    purchaseId: string | null;
    stripeInvoiceId: string | null;
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
    /** Ciclo cru ('month' | 'year'), para o rótulo curto do documento. */
    billingPeriod?: string | null;
    /** Descrição da modalidade, ex.: "Licenciamento digital". */
    productKindLabel?: string | null;

    amountPaid: number;
    amountRefunded: number | null;
    currency: string;

    paymentStatusLabel: string;
    paymentStatusTone: 'ok' | 'warn' | 'bad';

    licenseKey: string | null;
    clientId: string | null;
    maxDevices: number | null;
    devicesInUse: number | null;
    licenseStartedAt: string | null;
    licenseExpiresAt: string | null;
    licenseStateLabel: string;
    licenseStateTone: 'ok' | 'warn' | 'bad';

    periodStart: string | null;
    periodEnd: string | null;

    legalNote: string | null;
}

export interface GeneratedInvoice {
    bytes: Uint8Array;
    fileName: string;
}

export function invoiceTitle(kind: InvoiceKind): string {
    switch (kind) {
        case 'renewal': return 'Fatura de Renovação';
        case 'service': return 'Fatura de Serviço';
        case 'refund': return 'Comprovante de Reembolso';
        default: return 'Fatura Comercial';
    }
}

/* -------------------------------------------------------------- auxiliares */

/** Retângulo de cantos arredondados (raio de 4 pt, como no documento original). */
function caixaArredondada(
    page: PDFPage,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    color: RGB | Color
) {
    const k = 0.5523 * r;
    const c = color as RGB;
    page.pushOperators(
        pushGraphicsState(),
        setFillingRgbColor(c.red, c.green, c.blue),
        moveTo(x + r, y),
        lineTo(x + w - r, y),
        appendBezierCurve(x + w - r + k, y, x + w, y + r - k, x + w, y + r),
        lineTo(x + w, y + h - r),
        appendBezierCurve(x + w, y + h - r + k, x + w - r + k, y + h, x + w - r, y + h),
        lineTo(x + r, y + h),
        appendBezierCurve(x + r - k, y + h, x, y + h - r + k, x, y + h - r),
        lineTo(x, y + r),
        appendBezierCurve(x, y + r - k, x + r - k, y, x + r, y),
        closePath(),
        fill(),
        popGraphicsState()
    );
}

function texto(
    page: PDFPage,
    font: PDFFont,
    x: number,
    y: number,
    size: number,
    value: string,
    color: Color = C.ink
) {
    if (!value) return;
    page.drawText(value, { x, y, size, font, color });
}

function textoDireita(
    page: PDFPage,
    font: PDFFont,
    xDireita: number,
    y: number,
    size: number,
    value: string,
    color: Color = C.ink
) {
    if (!value) return;
    const w = font.widthOfTextAtSize(value, size);
    page.drawText(value, { x: xDireita - w, y, size, font, color });
}

function linha(page: PDFPage, x1: number, y1: number, x2: number, y2: number, color: Color, width = 0.7) {
    page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, color, thickness: width });
}

/* --------------------------------------------------------------- gerador */

export async function generateInvoicePdf(data: InvoiceData): Promise<GeneratedInvoice> {
    const { info: company } = getCompanyInfo();

    const doc = await PDFDocument.create();
    const fonts = await carregarFontes(doc);
    doc.setTitle(`${invoiceTitle(data.kind)} ${data.invoiceNumber}`);
    doc.setAuthor(company.razaoSocial);
    // Rastreabilidade: os identificadores da Stripe vão nos METADADOS do
    // PDF. O papel segue com o desenho aprovado (apenas ID da compra e
    // Referência), mas o arquivo continua permitindo localizar a transação.
    doc.setSubject(
        `Documento comercial VOLTRIS — ${data.invoiceNumber}` +
        (data.purchaseId ? ` | compra: ${data.purchaseId}` : '') +
        (data.stripePaymentId ? ` | pagamento: ${data.stripePaymentId}` : '') +
        (data.stripeInvoiceId ? ` | fatura: ${data.stripeInvoiceId}` : '') +
        (data.stripeSubscriptionId ? ` | assinatura: ${data.stripeSubscriptionId}` : '') +
        (data.stripeChargeId ? ` | cobranca: ${data.stripeChargeId}` : '')
    );
    doc.setKeywords([
        data.purchaseId, data.invoiceNumber, data.stripePaymentId,
        data.stripeInvoiceId, data.stripeSubscriptionId, data.stripeChargeId,
        data.licenseKey,
    ].filter(Boolean).map(String) as string[]);
    doc.setProducer('VOLTRIS');
    doc.setCreator('VOLTRIS');

    const page = doc.addPage([PAGE_W, PAGE_H]);

    /* ------------------------------------------------------------- fundo */
    page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: C.white });

    /* --------------------------------------------------------- cabeçalho */
    page.drawRectangle({ x: 0, y: 632, width: PAGE_W, height: 210, color: C.header });
    page.drawRectangle({ x: 0, y: 632, width: PAGE_W, height: 62, color: C.headerAccent });

    for (let i = 0; i < 8; i++) {
        const x = 410 + i * 25;
        linha(page, x, 705, x + 58, 842, C.headerLine, 0.7);
    }
    for (const y of [723, 745, 767, 789]) {
        linha(page, 352, y, 595, y, C.headerLine, 0.7);
    }

    /* ---------------------------------------------------------------------
     * FAIXA EM GRADIENTE (topo) e SEU CONTINUÁVEL (canto inferior direito)
     *
     * A faixa é desenhada DEPOIS da banda escura: se viesse antes, a banda
     * opaca a cobriria e o papel sairia sem a faixa rosa no topo — foi
     * exatamente o que aconteceu na primeira versão.
     * ------------------------------------------------------------------- */
    const fita = (x: number, y: number, w: number, h: number, de: RGB, ate: RGB) => {
        const passos = 40;
        for (let i = 0; i < passos; i++) {
            const t = i / (passos - 1);
            const cor = rgb(
                de.red + (ate.red - de.red) * t,
                de.green + (ate.green - de.green) * t,
                de.blue + (ate.blue - de.blue) * t
            );
            const largura = w / passos;
            page.drawRectangle({ x: x + i * largura, y, width: largura + 0.4, height: h, color: cor });
        }
    };
    // topo: rosa -> azul, largura toda
    fita(0, PAGE_H - 7, PAGE_W, 7, C.brandPink, C.brandBlue);
    // canto inferior direito: o continuidade da fita, em azul
    fita(523.8425, 629, PAGE_W - 523.8425, 4, C.brandBlue, C.brandBlue);

    /* ------------------------------------------------------ marca VOLTRIS */
    caixaArredondada(page, 43, 764, 37, 37, 6, C.mark);
    // "V" em rosa (traço grosso) + selo de confirmação em azul (traço fino)
    page.drawLine({ start: { x: 51, y: 790 }, end: { x: 61.6, y: 774 }, color: C.brandPink, thickness: 5.1 });
    page.drawLine({ start: { x: 61.6, y: 774 }, end: { x: 70.4, y: 790 }, color: C.brandPink, thickness: 5.1 });
    page.drawLine({ start: { x: 61.6, y: 774 }, end: { x: 70.4, y: 790 }, color: C.brandBlue, thickness: 1 });

    texto(page, fonts.heavy, 89, 786, 20, 'VOLTRIS', C.white);
    texto(page, fonts.semibold, 91, 772, 8, 'OPTIMIZER  /  SOFTWARE', C.inkMuted);

    const titulo = invoiceTitle(data.kind).toUpperCase();
    texto(page, fonts.heavy, 44, 721, 27, titulo, C.white);

    const ciclo = cicloCurto(data.billingPeriod ?? data.billingLabel);
    const planoCurto = data.planLabel.replace(/^VOLTRIS\s*/i, '');
    const subtitulo = `${data.productKindLabel ?? 'Licenciamento digital'}  •  Plano ${planoCurto}${ciclo ? ` ${ciclo.toLowerCase()}` : ''}`;
    texto(page, fonts.regular, 45, 700, 10.1, subtitulo, C.inkLight);

    /* -------------------------------------------- pílula de status + data */
    caixaArredondada(page, 43, 651, 196, 28, 8, C.pillBg);
    page.drawCircle({ x: 60.5, y: 664.5, size: 3.5, color: C.checkGreen });
    const rotuloStatus =
        data.paymentStatusTone === 'ok'
            ? 'PAGAMENTO CONFIRMADO'
            : data.paymentStatusTone === 'bad'
                ? (data.kind === 'refund' ? 'REEMBOLSO PROCESSADO' : 'PAGAMENTO RECUSADO')
                : 'PAGAMENTO EM ANÁLISE';
    texto(page, fonts.bold, 73, 660, 9.1, rotuloStatus, data.paymentStatusTone === 'ok' ? C.onDark : C.inkLight);
    textoDireita(page, fonts.bold, 551, 660, 10.3, dataLongaBR(data.purchasedAt ?? data.paidAt), C.onDark2);

    /* ------------------------------------------------------ dados da fatura */
    texto(page, fonts.heavy, 44, 606, 9.3, 'DADOS DA FATURA', C.violet);
    textoDireita(page, fonts.bold, 551, 606, 9.5, `EMISSÃO  ${formatDateBR(new Date())}`, C.inkSoft);

    /* ---------------------------------------------------------------------
     * CARTÃO DO BLOCO EMITENTE/CLIENTE
     *
     * A ORDEM DE DESENHO IMPORTA: o cartão é opaco. Se ele for desenhado
     * DEPOIS dos textos, ele COBRE o bloco inteiro — o documento saía com
     * um cartão vazio e sem os dados do emitente e do cliente.
     *
     * O mesmo vale para os outros cartões: fundo primeiro, texto depois.
     * ------------------------------------------------------------------- */
    caixaArredondada(page, 43, 439, 509, 147, 8, C.cardSoft);

    /* ----------------------------------------------------------- emitente */
    texto(page, fonts.heavy, 61, 561, 8.5, 'EMITENTE', C.violet);
    texto(page, fonts.heavy, 61, 537, 12.5, company.razaoSocial.toUpperCase(), C.ink);
    if (company.cnpj) {
        texto(page, fonts.semibold, 61, 515, 10, `CNPJ  ${company.cnpj}`, C.inkSoft);
    }
    const cidade = [company.cidade, company.uf].filter(Boolean).join(' - ');
    texto(page, fonts.regular, 61, 495, 9.7, `${cidade}, Brasil`, C.inkSoft);
    texto(page, fonts.regular, 61, 476, 9.7, company.email, C.inkSoft);

    /* ------------------------------------------------------------ cliente */
    texto(page, fonts.heavy, 318, 561, 8.5, 'CLIENTE', C.blue);
    texto(page, fonts.heavy, 318, 537, 12.5, data.customerName?.trim() || '—', C.ink);
    texto(page, fonts.regular, 318, 515, 9.5, data.customerEmail?.trim() || '—', C.inkSoft);
    texto(page, fonts.semibold, 318, 495, 9.9, `${data.planLabel}  •  ${ciclo}`, C.ink);
    if (data.maxDevices) {
        texto(page, fonts.regular, 318, 476, 9.5, `Licença para até ${data.maxDevices} dispositivos`, C.inkSoft);
    }

    linha(page, 298, 455, 298, 571, C.divider, 1);

    /* ------------------------------------------------- detalhamento da compra */
    texto(page, fonts.heavy, 44, 406, 10.4, 'DETALHAMENTO DA COMPRA', C.ink);

    texto(page, fonts.bold, 53, 378, 8.2, 'PRODUTO / DESCRIÇÃO', C.inkSoft);
    textoDireita(page, fonts.bold, 552, 378, 8.2, 'VALOR', C.inkSoft);
    linha(page, 43, 395, 552, 395, C.hairline, 0.7);

    const nomeProduto = `${data.productName}  •  ${data.kind === 'service' ? 'SERVIÇO' : `LICENÇA ${planoCurto}`}`;
    texto(page, fonts.heavy, 53, 346, 11.1, nomeProduto.toUpperCase(), C.ink);

    const descricao: string[] = [];
    descricao.push(ciclo === 'Pagamento único' ? 'Pagamento único' : `Assinatura ${ciclo.toLowerCase()}`);
    if (data.periodStart && data.periodEnd) {
        descricao.push(`${formatDateBR(data.periodStart)} a ${formatDateBR(data.periodEnd)}`);
    }
    texto(page, fonts.regular, 53, 329, 9.6, descricao.join('  •  '), C.inkSoft);

    textoDireita(page, fonts.heavy, 552, 342, 12.7, formatBRL(data.amountPaid, data.currency), C.ink);
    linha(page, 43, 366, 552, 366, C.hairline, 0.7);

    /* --------------------------------------------------------------- total */
    caixaArredondada(page, 43, 266, 509, 38, 8, C.cardTotal);
    texto(page, fonts.bold, 56, 279, 10.2, 'TOTAL PAGO', C.ink);
    textoDireita(page, fonts.heavy, 540, 276, 21, formatBRL(data.amountPaid, data.currency), C.total);
    linha(page, 43, 312, 552, 312, C.hairline, 0.7);

    /* ----------------------------------------------- identificação da compra */
    texto(page, fonts.heavy, 44, 241, 10.4, 'IDENTIFICAÇÃO DA COMPRA', C.ink);
    texto(page, fonts.bold, 44, 220, 9.3, 'ID da compra', C.inkSoft);
    texto(page, fonts.mono, 163, 220, 9, data.purchaseId ?? '—', C.ink);
    texto(page, fonts.bold, 44, 201, 9.3, 'Referência', C.inkSoft);
    texto(page, fonts.mono, 163, 201, 9.2, data.invoiceNumber, C.ink);

    /* ---------------------------------------------------- chave de ativação */
    if (data.licenseKey) {
        caixaArredondada(page, 43, 94, 509, 91, 8, C.header);
        for (let i = 0; i < 24; i++) {
            const t = i / 23;
            const cor = rgb(
                0.1182 + (0.090196 - 0.1182) * t,
                0.400895 + (0.407843 - 0.400895) * t,
                0.84769 - (0.84769 - 0.847059) * t
            );
            page.drawRectangle({
                x: 47.83 + i * (1.033333 / 24), y: 94,
                width: 1.033333 / 24 + 0.02, height: 91, color: cor,
            });
        }
        texto(page, fonts.heavy, 60, 162, 9.5, 'CHAVE DE ATIVAÇÃO', C.onDark3);
        texto(page, fonts.mono, 60, 138, 10.05, data.licenseKey, C.white);
        texto(page, fonts.regular, 60, 113, 9.4, 'Ative no VOLTRIS OPTIMIZER  •  Uso reservado ao titular', C.onDark4);
    }

    /* -------------------------------------------------------------- rodapé */
    linha(page, 43, 63, 552, 63, C.hairline, 0.7);
    // Mesma cadência do documento de referência: a observação principal em
    // 9,2 pt (y 75) e as linhas de rodapé em 8,25 pt (y 47 e y 34).
    let yAviso = 75;
    if (data.licenseKey) {
        texto(page, fonts.regular, 44, yAviso, 9.2, 'A licença deve ser inserida na área de ativação do aplicativo.', C.inkSoft);
        yAviso = 47;
    }
    if (data.legalNote) {
        texto(page, fonts.regular, 44, yAviso, 8.25, data.legalNote, C.inkSoft);
        yAviso = 34;
    }
    texto(page, fonts.regular, 44, 47, 8.25, 'Fatura comercial: não substitui nota fiscal de serviços (NFS-e).', C.inkSoft);
    texto(page, fonts.regular, 44, 34, 8.25, `Dados do emitente: ${company.site.replace(/^https?:\/\/(www\.)?/, '')}`, C.inkSoft);
    textoDireita(page, fonts.bold, 551, 34, 8.3, 'VOLTRIS  ©  Tecnologia & Performance', C.footer);

    const bytes = await doc.save();
    const planoArquivo = (data.planLabel || 'COMPRA').replace(/^VOLTRIS[\s_-]*/i, '').toUpperCase();
    // Nome do arquivo sem acento e com "_" entre as palavras — o mesmo padrão
    // do documento do aplicativo desktop ("Fatura_VOLTRIS_PRO_Alvaro_araujo.pdf").
    const clienteArquivo = (data.customerName || 'cliente')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w]+/g, '_')
        .replace(/^_+|_+$/g, '');
    return {
        bytes,
        fileName: `Fatura_VOLTRIS_${planoArquivo}_${clienteArquivo}.pdf`,
    };
}
