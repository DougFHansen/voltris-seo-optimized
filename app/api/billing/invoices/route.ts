import { NextRequest } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import {
    isInvoicable,
    resolveInvoiceKind,
    type PaymentInvoiceRow,
} from '@/lib/invoice-data';
import { licenseRateGuard, rateLimitedResponse } from '@/lib/license-rate-guard';
import {
    startOperation,
    getOrCreateCorrelationId,
    logSuccess,
    logWarn,
    logError,
    logSupabaseError,
    maskEmail,
    jsonWithCorrelation,
    errorWithCorrelation,
} from '@/lib/voltris-log';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/billing/invoices — o que o usuário pode baixar (missão §5).
 *
 * Por que existe uma rota de LISTAGEM separada do download:
 *  - o painel precisa saber, ANTES de mostrar o botão, se existe documento
 *    disponível para aquela cobrança — e com qual estado real;
 *  - o download continua sendo uma operação autenticada separada, com
 *    autorização checada de novo (defesa em profundidade);
 *  - não há consulta à Stripe nesta rota: tudo vem do espelho local, o que
 *    mantém a tela rápida e evita martelar a API a cada render.
 *
 * Nenhuma linha de outro usuário é devolvida: o filtro é `user_id` da sessão.
 */
export async function GET(req: NextRequest) {
    const correlationId = getOrCreateCorrelationId(req);
    const ctx = startOperation('INVOICE_LIST', correlationId);

    try {
        const supabase = await createClient();
        const { data: sessionData, error: authError } = await supabase.auth.getUser();
        const user = sessionData?.user ?? null;

        if (authError || !user) {
            return errorWithCorrelation(ctx, 401, 'UNAUTHORIZED', 'Não autorizado');
        }
        ctx.userId = user.id;

        const guard = licenseRateGuard('me', req, user.id);
        if (!guard.allowed) {
            logWarn(ctx, 'INVOICE_LIST_RATE_LIMIT', { retryAfterSec: guard.retryAfterSec });
            return rateLimitedResponse(guard, correlationId);
        }

        const admin = createAdminClient();

        const { data, error } = await admin
            .from('payments')
            .select('id,reference_id,plan_type,billing_period,amount,currency,status,invoice_kind,stripe_invoice_id,stripe_subscription_id,stripe_refund_id,paid_at,period_start,period_end,created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            logSupabaseError(ctx, 'listar pagamentos do usuario', error);
            return errorWithCorrelation(ctx, 500, 'DB_READ_FAILED', 'Não foi possível consultar suas faturas.');
        }

        const rows = (data ?? []) as PaymentInvoiceRow[];

        const invoices = rows.map((row) => {
            const kind = resolveInvoiceKind(row);
            const available = isInvoicable(row.status);
            return {
                paymentId: row.id,
                reference: row.reference_id,
                kind,
                status: row.status,
                available,
                planType: row.plan_type,
                billingPeriod: row.billing_period,
                amount: typeof row.amount === 'string' ? Number(row.amount) : row.amount,
                currency: row.currency ?? 'BRL',
                invoiceNumber: row.stripe_invoice_id ?? null,
                paidAt: row.paid_at ?? null,
                createdAt: row.created_at,
                periodStart: row.period_start,
                periodEnd: row.period_end,
                refunded: (row.status ?? '').toLowerCase() === 'refunded' || !!row.stripe_refund_id,
                // Motivo pelo qual não há documento — a UI mostra estado real.
                unavailableReason: available
                    ? null
                    : (row.status ?? '').toLowerCase() === 'pending'
                        ? 'Aguardando confirmação do pagamento'
                        : 'Fatura indisponível: aguardando confirmação do pagamento.',
            };
        });

        logSuccess(ctx, 'faturas listadas', {
            user: maskEmail(user.email),
            total: invoices.length,
            disponiveis: invoices.filter((i) => i.available).length,
        });

        return jsonWithCorrelation(ctx, {
            invoices,
            hasAny: invoices.some((i) => i.available),
        });
    } catch (error) {
        logError(ctx, 'listagem de faturas falhou', { error: String((error as Error)?.message ?? error) });
        return errorWithCorrelation(ctx, 500, 'INVOICE_LIST_FAILED', 'Erro ao listar faturas.');
    }
}