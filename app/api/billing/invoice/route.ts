import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { buildInvoiceData, findLicenseForPayment, isInvoicable, type PaymentInvoiceRow } from '@/lib/invoice-data';
import { generateInvoicePdf } from '@/lib/invoice-pdf';
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

const QuerySchema = z.object({
    payment_id: z.string().uuid(),
});

/**
 * GET /api/billing/invoice?payment_id=<uuid> — fatura em PDF (missão §5 e §6).
 *
 * Cadeia de segurança, na ordem:
 *   1. sessão Supabase válida;
 *   2. rate limit;
 *   3. a cobrança é lida com `.eq('user_id', user.id)` — a posse é decidida
 *      pelo UUID da sessão, NUNCA pelo id enviado pelo navegador. Um
 *      `payment_id` de outro cliente simplesmente não é encontrado;
 *   4. o PDF é gerado em memória e devolvido como anexo. Nada é salvo em disco
 *      e nenhum dado sensível entra em URL: o `payment_id` já está autorizado
 *      pelo passo 3 e a resposta tem `Content-Disposition: attachment` +
 *      `Cache-Control: private, no-store`.
 *
 * Estados não silenciosos:
 *   - compra pendente -> 409 com "aguardando confirmação do pagamento"
 *     (nunca emite comprovante de pagamento não confirmado);
 *   - registro ausente -> 404 sem confirmar se o id existe para outra conta.
 */
export async function GET(req: NextRequest) {
    const correlationId = getOrCreateCorrelationId(req);
    const ctx = startOperation('INVOICE_PDF', correlationId);

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
            logWarn(ctx, 'INVOICE_PDF_RATE_LIMIT', { retryAfterSec: guard.retryAfterSec });
            return rateLimitedResponse(guard, correlationId);
        }

        const parsed = QuerySchema.safeParse({
            payment_id: req.nextUrl.searchParams.get('payment_id'),
        });
        if (!parsed.success) {
            return errorWithCorrelation(ctx, 400, 'INVALID_INPUT', 'Informe uma compra válida.');
        }

        const admin = createAdminClient();

        const { data, error } = await admin
            .from('payments')
            .select('*')
            .eq('id', parsed.data.payment_id)
            .eq('user_id', user.id)   // <- prova de propriedade
            .maybeSingle();

        if (error) {
            logSupabaseError(ctx, 'buscar pagamento para fatura', error);
            return errorWithCorrelation(ctx, 500, 'DB_READ_FAILED', 'Não foi possível montar a fatura.');
        }

        const row = data as PaymentInvoiceRow | null;

        if (!row) {
            logWarn(ctx, 'fatura solicitada para compra inexistente ou de terceiro', {
                user: maskEmail(user.email),
            });
            return errorWithCorrelation(ctx, 404, 'PAYMENT_NOT_FOUND', 'Compra não encontrada.');
        }

        if (!isInvoicable(row.status)) {
            return jsonWithCorrelation(
                ctx,
                {
                    error: 'Fatura indisponível: aguardando confirmação do pagamento.',
                    code: 'PAYMENT_NOT_CONFIRMED',
                    paymentStatus: row.status,
                },
                409
            );
        }

        const license = await findLicenseForPayment(admin, row);

        const invoiceData = buildInvoiceData({
            row,
            license,
            customerDocument: user.user_metadata?.cpf ?? null,
        });

        const pdf = await generateInvoicePdf(invoiceData);

        logSuccess(ctx, 'fatura gerada', {
            user: maskEmail(user.email),
            payment: row.id,
            kind: invoiceData.kind,
            amount: invoiceData.amountPaid,
            bytes: pdf.bytes.length,
        });

        return new Response(pdf.bytes as unknown as BodyInit, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${pdf.fileName}"`,
                'Content-Length': String(pdf.bytes.length),
                // Documento do cliente: nunca em cache compartilhado.
                'Cache-Control': 'private, no-store, max-age=0',
                'X-Content-Type-Options': 'nosniff',
                'x-correlation-id': correlationId,
            },
        });
    } catch (error: any) {
        logError(ctx, 'geracao da fatura falhou', { error: error?.message });
        return errorWithCorrelation(
            ctx, 500, 'PDF_GENERATION_FAILED',
            'Não foi possível preparar a fatura. Tente novamente.'
        );
    }
}