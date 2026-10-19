/**
 * PONTO ÚNICO DE DISPARO DOS E-MAILS TRANSACIONAIS (missão §3 e §4).
 *
 * Este módulo é a fronteira entre "o negócio aconteceu" e "o cliente foi
 * avisado". Ele SEMPRE enfileira e NUNCA envia direto, porque:
 *
 *   "A emissão da licença e a confirmação do pagamento não podem depender de a
 *    Resend estar disponível." (§11, regra crítica)
 *
 * Contrato garantido por todas as funções deste arquivo:
 *   - não lançam exceção, em nenhum cenário;
 *   - uma falha de e-mail aparece como log, nunca como erro do webhook;
 *   - a fatura anexada é a MESMA do Dashboard (via `loadInvoiceForOwner`);
 *   - a chave de idempotência é derivada do fato de negócio, não do relógio.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/utils/supabase/admin';
import { enqueueEmail, processOutbox, type EmailTemplateType } from '@/lib/email-outbox';
import {
    renderPurchaseEmail,
    renderRenewalEmail,
    renderCancellationEmail,
    renderRefundEmail,
    renderPaymentFailedEmail,
} from '@/lib/email-templates';
import { loadInvoiceForOwner, emailDataFromInvoice } from '@/lib/invoice-service';
import { formatBRL, formatDateTimeBR } from '@/lib/invoice-pdf';
import { LICENSE_PLANS } from '@/lib/license-catalog';
import {
    logInfo,
    logWarn,
    logError,
    maskEmail,
    type OperationContext,
    type VoltrisOperation,
} from '@/lib/voltris-log';

/**
 * Drena a fila depois de enfileirar.
 *
 * É uma otimização de LATÊNCIA, não o mecanismo de entrega: se esta chamada
 * falhar ou a função morrer, a linha continua `pending` e é processada pela
 * rota de worker (cron da Vercel). É por isso que nunca pode rodar em série
 * bloqueando o webhook.
 */
async function drainQueue(supabase: SupabaseClient, ctx?: OperationContext): Promise<void> {
    try {
        await processOutbox(2, supabase, ctx);
    } catch (err: any) {
        logWarn(ctx ?? fallbackCtx('EMAIL_ENQUEUE'), 'drenagem da fila falhou (a linha permanece pendente)', {
            error: String(err?.message ?? err).slice(0, 160),
        });
    }
}

function fallbackCtx(operation: VoltrisOperation = 'EMAIL_ENQUEUE'): OperationContext {
    return {
        correlationId: `EMAIL-${Date.now().toString(36)}`,
        operation,
        startedAt: Date.now(),
        meta: {},
    };
}

// ============================================================================
// 1. PAGAMENTO CONFIRMADO + ENTREGA DA LICENÇA (FASE 4)
// ============================================================================

/**
 * Só deve ser chamado com a cobrança JÁ CONFIRMADA (payment_status='paid' na
 * Stripe, gravado pelo webhook). A função NÃO verifica isso de novo por conta
 * própria — quem chama é o webhook, que já aplicou o gate — mas nunca envia
 * para pagamento pendente porque depende de `paymentId` existir.
 */
export async function notifyPurchaseConfirmed(params: {
    paymentId: string;
    userId: string | null;
    customerName?: string | null;
    supabase?: SupabaseClient;
    ctx?: OperationContext;
}): Promise<void> {
    const supabase = params.supabase ?? createAdminClient();
    const ctx = params.ctx ?? fallbackCtx();

    try {
        const loaded = await loadInvoiceForOwner(supabase, params.paymentId, params.userId);
        if (!loaded.ok || !loaded.invoice || !loaded.data) {
            logWarn(ctx, 'fatura indisponivel — e-mail de compra sem anexo', {
                payment: params.paymentId,
                code: loaded.code,
            });
            return;
        }

        const facts = emailDataFromInvoice(loaded.data, { customerName: params.customerName });

        const email = renderPurchaseEmail({
            customerName: facts.customerName,
            planName: facts.planName,
            billingLabel: facts.billingLabel,
            amountPaid: facts.amountPaid,
            currency: facts.currency,
            purchasedAt: facts.purchasedAt,
            periodEnd: facts.licenseExpiresAt ?? facts.periodEnd,
            licenseKey: facts.licenseKey,
            maxDevices: facts.maxDevices,
            devicesInUse: facts.devicesInUse,
            purchaseId: facts.purchaseId,
            stripeReference: loaded.data.stripePaymentId,
            hasInvoiceAttachment: true,
        });

        const result = await enqueueEmail({
            template: 'purchase_confirmation',
            to: facts.customerEmailForEmail ?? null,
            userId: params.userId,
            paymentId: params.paymentId,
            licenseKey: facts.licenseKey,
            subscriptionId: facts.stripeSubscriptionId,
            // Uma compra, um e-mail. A chave é o próprio pagamento.
            idempotencyKey: `purchase:${params.paymentId}`,
            subject: email.subject,
            html: email.html,
            text: email.text,
            attachment: {
                filename: loaded.invoice.fileName,
                content: Buffer.from(loaded.invoice.bytes),
            },
            meta: { amount: facts.amountPaid, plan: facts.planName },
        }, supabase, ctx);

        logInfo(ctx, 'confirmacao de compra processada', {
            queued: result.queued,
            duplicate: result.duplicate,
        });

        void drainQueue(supabase, ctx);
    } catch (err: any) {
        // Regra crítica: e-mail quebrado NÃO pode derrubar a emissão da licença.
        logError(ctx, 'falha ao preparar e-mail de compra (compra permanece válida)', {
            payment: params.paymentId,
            error: String(err?.message ?? err).slice(0, 200),
        });
    }
}

// ============================================================================
// 2. RENOVAÇÃO (FASE 7)
// ============================================================================

/**
 * Uma renovação NÃO é compra inicial: subject, texto e chave de idempotência são
 * diferentes, e a fatura anexada é a DESTA cobrança.
 */
export async function notifySubscriptionRenewed(params: {
    paymentId: string;
    userId: string | null;
    customerName?: string | null;
    renewalEnabled: boolean;
    nextBillingAt?: string | null;
    supabase?: SupabaseClient;
    ctx?: OperationContext;
}): Promise<void> {
    const supabase = params.supabase ?? createAdminClient();
    const ctx = params.ctx ?? fallbackCtx();

    try {
        const loaded = await loadInvoiceForOwner(supabase, params.paymentId, params.userId);
        if (!loaded.ok || !loaded.invoice || !loaded.data) {
            logWarn(ctx, 'fatura de renovacao indisponivel — e-mail sem anexo', {
                payment: params.paymentId, code: loaded.code,
            });
            return;
        }

        const facts = emailDataFromInvoice(loaded.data, { customerName: params.customerName });

        const email = renderRenewalEmail({
            customerName: facts.customerName,
            planName: facts.planName,
            billingLabel: facts.billingLabel,
            amountPaid: facts.amountPaid,
            currency: facts.currency,
            chargedAt: facts.paidAt ?? facts.purchasedAt,
            periodStart: facts.periodStart,
            periodEnd: facts.periodEnd,
            licenseExpiresAt: facts.licenseExpiresAt,
            nextBillingAt: params.nextBillingAt ?? null,
            renewalEnabled: params.renewalEnabled,
            purchaseId: facts.purchaseId,
            hasInvoiceAttachment: true,
        });

        // Chave pela COBRANÇA, não pela assinatura: uma assinatura tem várias
        // renovações e cada uma rende exatamente um e-mail.
        const invoiceId = loaded.data.stripeInvoiceId ?? params.paymentId;

        const result = await enqueueEmail({
            template: 'subscription_renewed',
            to: facts.customerEmailForEmail ?? null,
            userId: params.userId,
            paymentId: params.paymentId,
            licenseKey: facts.licenseKey,
            subscriptionId: facts.stripeSubscriptionId,
            idempotencyKey: `renewal:${invoiceId}`,
            subject: email.subject,
            html: email.html,
            text: email.text,
            attachment: {
                filename: loaded.invoice.fileName,
                content: Buffer.from(loaded.invoice.bytes),
            },
            meta: { amount: facts.amountPaid },
        }, supabase, ctx);

        logInfo(ctx, 'renovacao processada', { queued: result.queued, duplicate: result.duplicate });
        void drainQueue(supabase, ctx);
    } catch (err: any) {
        logError(ctx, 'falha ao preparar e-mail de renovacao (licenca ja foi renovada)', {
            payment: params.paymentId,
            error: String(err?.message ?? err).slice(0, 200),
        });
    }
}

// ============================================================================
// 3. CANCELAMENTO DE RENOVAÇÃO (FASE 8)
// ============================================================================

/**
 * Só chamar APÓS a Stripe confirmar a operação. Se a chamada falhar, o
 * e-mail de cancelamento NÃO pode ter sido enviado — é o que a missão proíbe.
 */
export async function notifyRenewalCanceled(params: {
    subscriptionId: string | null;
    userId: string | null;
    customerEmail: string | null;
    customerName?: string | null;
    planType: string | null;
    accessUntil: string | null;
    renewalOnly: boolean;
    canResume: boolean;
    supabase?: SupabaseClient;
    ctx?: OperationContext;
}): Promise<void> {
    const supabase = params.supabase ?? createAdminClient();
    const ctx = params.ctx ?? fallbackCtx();

    try {
        const email = renderCancellationEmail({
            customerName: params.customerName,
            planName: planLabel(params.planType),
            accessUntil: params.accessUntil,
            renewalOnly: params.renewalOnly,
            canResume: params.canResume,
            subscriptionId: params.subscriptionId,
        });

        // Inclui o DIA (não só o instante): o mesmo cancelamento no mesmo dia
        // gera um e-mail; o segundo clique no mesmo dia não gera outro.
        const day = params.accessUntil
            ? String(params.accessUntil).slice(0, 10)
            : new Date().toISOString().slice(0, 10);

        const result = await enqueueEmail({
            template: 'renewal_canceled',
            to: params.customerEmail,
            userId: params.userId,
            subscriptionId: params.subscriptionId,
            idempotencyKey: `cancel:${params.subscriptionId ?? params.userId}:${day}`,
            subject: email.subject,
            html: email.html,
            text: email.text,
            meta: { renewal_only: params.renewalOnly },
        }, supabase, ctx);

        logInfo(ctx, 'cancelamento processado', { queued: result.queued, duplicate: result.duplicate });
        void drainQueue(supabase, ctx);
    } catch (err: any) {
        logError(ctx, 'falha ao preparar e-mail de cancelamento (operacao ja concluida)', {
            error: String(err?.message ?? err).slice(0, 200),
        });
    }
}

// ============================================================================
// 4. REEMBOLSO (FASE 9)
// ============================================================================

export async function notifyRefund(params: {
    stage: 'requested' | 'processing' | 'confirmed' | 'failed';
    paymentId: string | null;
    userId: string | null;
    customerEmail: string | null;
    customerName?: string | null;
    planType: string | null;
    amount: number;
    currency: string;
    refundId?: string | null;
    requestedAt?: string | null;
    resolvedAt?: string | null;
    accessUntil?: string | null;
    manualReview?: boolean;
    supabase?: SupabaseClient;
    ctx?: OperationContext;
}): Promise<void> {
    const supabase = params.supabase ?? createAdminClient();
    const ctx = params.ctx ?? fallbackCtx();

    try {
        const email = renderRefundEmail({
            customerName: params.customerName,
            stage: params.stage,
            planName: planLabel(params.planType),
            amount: params.amount,
            currency: params.currency,
            purchaseId: params.paymentId,
            refundId: params.refundId ?? null,
            requestedAt: params.requestedAt ?? new Date().toISOString(),
            resolvedAt: params.resolvedAt ?? null,
            accessUntil: params.accessUntil ?? null,
            manualReview: params.manualReview ?? false,
        });

        // Cada ESTÁGIO é um evento distinto: solicitação, processamento e
        // confirmação geram chaves diferentes — é o que permite avisar sobre a
        // evolução sem duplicar o aviso de um estágio.
        const stageSuffix =
            params.stage === 'requested' ? 'requested'
                : params.stage === 'processing' ? 'processing'
                    : params.stage === 'confirmed' ? 'confirmed'
                        : 'failed';

        const anchor = params.refundId ?? params.paymentId ?? params.userId ?? 'desconhecido';
        const template: EmailTemplateType =
            params.stage === 'requested' ? 'refund_requested'
                : params.stage === 'processing' ? 'refund_processing'
                    : params.stage === 'confirmed' ? 'refund_confirmed'
                        : 'refund_failed';

        const result = await enqueueEmail({
            template,
            to: params.customerEmail,
            userId: params.userId,
            paymentId: params.paymentId,
            subscriptionId: null,
            idempotencyKey: `refund:${anchor}:${stageSuffix}`,
            subject: email.subject,
            html: email.html,
            text: email.text,
            meta: { stage: params.stage, amount: params.amount },
        }, supabase, ctx);

        logInfo(ctx, `reembolso/${params.stage} processado`, {
            queued: result.queued, duplicate: result.duplicate, to: maskEmail(params.customerEmail),
        });
        void drainQueue(supabase, ctx);
    } catch (err: any) {
        logError(ctx, 'falha ao preparar e-mail de reembolso', {
            stage: params.stage,
            error: String(err?.message ?? err).slice(0, 200),
        });
    }
}

// ============================================================================
// 5. FALHA NO PAGAMENTO (FASE 10)
// ============================================================================

export async function notifyPaymentFailed(params: {
    subscriptionId: string | null;
    userId: string | null;
    customerEmail: string | null;
    customerName?: string | null;
    planType: string | null;
    amount: number;
    currency: string;
    attemptedAt?: string | null;
    accessUntil?: string | null;
    supabase?: SupabaseClient;
    ctx?: OperationContext;
}): Promise<void> {
    const supabase = params.supabase ?? createAdminClient();
    const ctx = params.ctx ?? fallbackCtx();

    try {
        const email = renderPaymentFailedEmail({
            customerName: params.customerName,
            planName: planLabel(params.planType),
            amount: params.amount,
            currency: params.currency,
            attemptedAt: params.attemptedAt ?? new Date().toISOString(),
            accessUntil: params.accessUntil ?? null,
            subscriptionId: params.subscriptionId,
        });

        // Chave pela fatura + dia: o cliente pode ter VÁRIAS tentativas
        // recusadas no mesmo dia e não deve receber um e-mail por tentativa.
        const day = (params.attemptedAt ?? new Date().toISOString()).slice(0, 10);
        const anchor = params.subscriptionId ?? params.userId ?? 'desconhecido';

        const result = await enqueueEmail({
            template: 'payment_failed',
            to: params.customerEmail,
            userId: params.userId,
            subscriptionId: params.subscriptionId,
            idempotencyKey: `payment_failed:${anchor}:${day}`,
            subject: email.subject,
            html: email.html,
            text: email.text,
            meta: { amount: params.amount },
        }, supabase, ctx);

        logInfo(ctx, 'falha de pagamento processada', {
            queued: result.queued, duplicate: result.duplicate,
        });
        void drainQueue(supabase, ctx);
    } catch (err: any) {
        logError(ctx, 'falha ao preparar e-mail de pagamento recusado', {
            error: String(err?.message ?? err).slice(0, 200),
        });
    }
}

// ============================================================================

function planLabel(planType: string | null): string {
    const key = (planType ?? '').trim().toLowerCase() as keyof typeof LICENSE_PLANS;
    return LICENSE_PLANS[key]?.displayName ?? (planType ?? 'VOLTRIS').toUpperCase();
}

export { formatBRL, formatDateTimeBR };