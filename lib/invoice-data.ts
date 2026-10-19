/**
 * MONTAGEM DA FATURA A PARTIR DOS FATOS GRAVADOS (missão §6).
 *
 * Separação deliberada entre "ler/validar" (rota, com sessão e posse) e
 * "formatar" (aqui + lib/invoice-pdf.ts). Assim a fatura pode ser testada sem
 * Stripe, sem banco e sem rede — e a rota só concerns de autorização.
 *
 * Regra central: NENHUM valor é inventado. Campo que não existe na base vira
 * "—". Um documento que mostra "—" em um campo histórico é honesto; um que
 * mostra R$ 15,00 numa cobrança de R$ 4,99 é uma mentira contábil.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { LICENSE_PLANS } from '@/lib/license-catalog';
import type { InvoiceData } from '@/lib/invoice-pdf';

export type InvoiceKind = 'purchase' | 'renewal' | 'service' | 'refund';

/** Colunas lidas de `public.payments` (todas existem; ver schema real). */
export interface PaymentInvoiceRow {
    id: string;
    reference_id: string | null;
    user_id: string | null;
    email: string | null;
    customer_name: string | null;
    customer_name_snapshot: string | null;
    plan_type: string | null;
    billing_period: string | null;
    amount: number | string | null;
    currency: string | null;
    status: string | null;
    provider: string | null;
    invoice_kind: string | null;
    stripe_id: string | null;
    stripe_charge_id: string | null;
    stripe_invoice_id: string | null;
    stripe_subscription_id: string | null;
    stripe_refund_id: string | null;
    refunded_amount: number | string | null;
    refunded_at: string | null;
    paid_at: string | null;
    period_start: string | null;
    period_end: string | null;
    created_at: string | null;
}

const SERVICE_PLAN_PATTERN = /formatacao|otimizacao|correcao|impressora|virus|recuperacao|reconfiguracao/;

function toNumber(value: number | string | null | undefined): number | null {
    if (value === null || value === undefined || value === '') return null;
    const n = typeof value === 'string' ? Number(value) : value;
    return Number.isFinite(n) ? n : null;
}

/** Tipo do documento a partir dos fatos da própria linha. */
export function resolveInvoiceKind(row: PaymentInvoiceRow): InvoiceKind {
    const explicit = (row.invoice_kind ?? '').trim().toLowerCase();
    if (explicit === 'renewal' || explicit === 'purchase' || explicit === 'service') {
        return explicit;
    }
    // Sem a coluna preenchida (linhas antigas): deduz só o que é DEDUTÍVEL.
    // Renovação tem assinatura; serviço tem plano de serviço; o resto é compra.
    const plan = (row.plan_type ?? '').toLowerCase();
    if (SERVICE_PLAN_PATTERN.test(plan)) return 'service';
    if (row.stripe_subscription_id && (row.reference_id ?? '').startsWith('renew_')) return 'renewal';
    if (row.stripe_subscription_id) return 'purchase';
    return 'purchase';
}

const PAYMENT_STATUS_LABEL: Record<string, { label: string; tone: 'ok' | 'warn' | 'bad' }> = {
    approved: { label: 'Pago', tone: 'ok' },
    paid: { label: 'Pago', tone: 'ok' },
    succeeded: { label: 'Pago', tone: 'ok' },
    pending: { label: 'Aguardando confirmação', tone: 'warn' },
    processing: { label: 'Em processamento', tone: 'warn' },
    open: { label: 'Aguardando confirmação', tone: 'warn' },
    failed: { label: 'Recusado', tone: 'bad' },
    canceled: { label: 'Cancelado', tone: 'bad' },
    cancelled: { label: 'Cancelado', tone: 'bad' },
    refunded: { label: 'Reembolsado', tone: 'bad' },
    partially_refunded: { label: 'Parcialmente reembolsado', tone: 'warn' },
    charged_back: { label: 'Estornado pelo banco', tone: 'bad' },
};

export function describePaymentStatus(status: string | null | undefined): { label: string; tone: 'ok' | 'warn' | 'bad' } {
    return PAYMENT_STATUS_LABEL[(status ?? '').trim().toLowerCase()] ?? {
        label: (status ?? 'desconhecido').toString().toUpperCase(),
        tone: 'warn',
    };
}

function planLabel(planType: string | null): string {
    const key = (planType ?? '').trim().toLowerCase() as keyof typeof LICENSE_PLANS;
    return LICENSE_PLANS[key]?.displayName ?? (planType ?? 'Produto VOLTRIS').toUpperCase();
}

function billingLabel(period: string | null, kind: InvoiceKind): string {
    const p = (period ?? '').trim().toLowerCase();
    const base = ['year', 'anual', 'annual', 'y'].includes(p) ? 'Anual' : 'Mensal';
    if (kind === 'service') return 'Pagamento único';
    return `${base} — assinatura recorrente`;
}

export interface LicenseFacts {
    license_key: string | null;
    plan_type: string | null;
    max_devices: number | null;
    created_at: string | null;
    activated_at: string | null;
    expires_at: string | null;
    revoked: boolean | null;
    user_id: string | null;
    devicesInUse: number | null;
}

export interface BuildInvoiceOptions {
    row: PaymentInvoiceRow;
    license: LicenseFacts | null;
    /** `cnpj`-like identificador do cliente, quando conhecido. */
    customerDocument?: string | null;
    /** Texto legal específico (ex.: motivo do reembolso). */
    legalNote?: string | null;
    /** Data/hora de geração (injetável para teste determinístico). */
    now?: number;
}

/**
 * Monta `InvoiceData` a partir de uma linha de pagamento + licença vinculada.
 * É uma função pura: mesma entrada, mesmo documento.
 */
export function buildInvoiceData(options: BuildInvoiceOptions): InvoiceData {
    const { row, license } = options;
    const kind = resolveInvoiceKind(row);
    const effectiveKind: InvoiceKind =
        (row.status ?? '').toLowerCase() === 'refunded' ? 'refund' : kind;

    const amountPaid = toNumber(row.amount) ?? 0;
    const refunded = toNumber(row.refunded_amount);

    const paymentStatus = describePaymentStatus(row.status);

    const licenseTone: 'ok' | 'warn' | 'bad' = license
        ? (license.revoked === true ? 'bad' : 'ok')
        : 'warn';

    const licenseStateLabel = !license
        ? 'Sem licença vinculada a esta cobrança'
        : license.revoked === true
            ? 'Revogada'
            : 'Ativa';

    const purchasedAt = row.paid_at ?? row.created_at;

    return {
        invoiceNumber: row.reference_id ?? `pay-${row.id.slice(0, 8)}`,
        kind: effectiveKind,
        purchaseId: row.id,
        stripeInvoiceId: row.stripe_invoice_id ?? null,
        stripePaymentId: row.stripe_id ?? null,
        stripeChargeId: row.stripe_charge_id ?? null,
        stripeSubscriptionId: row.stripe_subscription_id ?? null,
        purchasedAt,
        paidAt: row.paid_at ?? null,

        customerName: row.customer_name_snapshot ?? row.customer_name ?? null,
        customerEmail: row.email ?? null,
        customerDocument: options.customerDocument ?? null,

        productName: kind === 'service'
            ? `Serviço Profissional — ${(row.plan_type ?? '').replace(/_/g, ' ').toUpperCase()}`
            : 'VOLTRIS OPTIMIZER',
        planLabel: kind === 'service' ? 'Serviço' : planLabel(row.plan_type),
        billingLabel: billingLabel(row.billing_period, kind),

        amountPaid,
        amountRefunded: refunded !== null && refunded > 0 ? refunded : null,
        currency: (row.currency ?? 'BRL').toUpperCase(),

        paymentStatusLabel: paymentStatus.label,
        paymentStatusTone: paymentStatus.tone,

        licenseKey: license?.license_key ?? null,
        maxDevices: license?.max_devices ?? LICENSE_PLANS[
            (row.plan_type ?? '').toLowerCase() as keyof typeof LICENSE_PLANS
        ]?.maxDevices ?? null,
        licenseStartedAt: license?.activated_at ?? license?.created_at ?? null,
        licenseExpiresAt: license?.expires_at ?? null,
        licenseStateLabel,
        licenseStateTone: licenseTone,

        periodStart: row.period_start ?? null,
        periodEnd: row.period_end ?? license?.expires_at ?? null,
        devicesInUse: license?.devicesInUse ?? null,

        legalNote: options.legalNote ?? null,
    };
}

/**
 * Status que podem virar comprovante.
 *
 * Um pagamento `pending` NÃO gera fatura: emitir comprovante de pagamento não
 * confirmado é o que a missão §9 proíbe ("Não disponibilizar comprovante de
 * pagamento confirmado"). Os demais status geram documento — com o rótulo
 * verdadeiro no cabeçalho e no chip de status.
 */
export const INVOICABLE_STATUSES = new Set([
    'approved', 'paid', 'succeeded', 'refunded', 'partially_refunded', 'charged_back',
]);

export function isInvoicable(status: string | null | undefined): boolean {
    return INVOICABLE_STATUSES.has((status ?? '').trim().toLowerCase());
}

/**
 * Licença vinculada à compra. Usa `payment_id` (o vínculo canônico gravado pela
 * RPC de emissão). Para compras antigas sem `payment_id`, cai para
 * (user_id, plan_type) pegando a mais recente — e o chamador já validou a posse.
 */
export async function findLicenseForPayment(
    supabase: SupabaseClient,
    row: PaymentInvoiceRow
): Promise<LicenseFacts | null> {
    let candidates: Array<Record<string, unknown>> = [];

    if (row.id) {
        const { data } = await supabase
            .from('licenses')
            .select('license_key,plan_type,max_devices,created_at,activated_at,expires_at,revoked,user_id')
            .eq('payment_id', row.id)
            .order('created_at', { ascending: false })
            .limit(1);
        candidates = (data ?? []) as Array<Record<string, unknown>>;
    }

    if (candidates.length === 0 && row.user_id) {
        const { data } = await supabase
            .from('licenses')
            .select('license_key,plan_type,max_devices,created_at,activated_at,expires_at,revoked,user_id')
            .eq('user_id', row.user_id)
            .eq('plan_type', (row.plan_type ?? '').toLowerCase())
            .order('created_at', { ascending: false })
            .limit(1);
        candidates = (data ?? []) as Array<Record<string, unknown>>;
    }

    if (candidates.length === 0) return null;

    const lic = candidates[0];

    let devicesInUse: number | null = null;
    if (typeof lic.license_key === 'string') {
        const { count } = await supabase
            .from('license_devices')
            .select('id', { count: 'exact', head: true })
            .eq('license_key', lic.license_key);
        devicesInUse = count ?? 0;
    }

    return {
        license_key: (lic.license_key as string) ?? null,
        plan_type: (lic.plan_type as string) ?? null,
        max_devices: typeof lic.max_devices === 'number' ? lic.max_devices : null,
        created_at: (lic.created_at as string) ?? null,
        activated_at: (lic.activated_at as string) ?? null,
        expires_at: (lic.expires_at as string) ?? null,
        revoked: (lic.revoked as boolean) ?? null,
        user_id: (lic.user_id as string) ?? null,
        devicesInUse,
    };
}