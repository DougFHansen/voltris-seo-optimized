/**
 * SERVIÇO ÚNICO DE FATURA (missão §6 — "a fatura enviada por e-mail DEVE ser a
 * mesma disponibilizada para download no Dashboard").
 *
 * Por que este módulo existe: quando o PDF do e-mail e o PDF do painel são
 * montados em lugares diferentes, eles divergem na primeira mudança de layout —
 * e o cliente passa a receber um documento diferente do que baixou no site.
 * Aqui os dois chamam a MESMA função, com os MESMOS fatos do banco.
 *
 * Ponto importante de segurança: `loadPaymentForOwner` exige o `user_id` da
 * sessão. É o que garante que nem o download no painel nem o anexo do e-mail
 * aceitem um `payment_id` de outro cliente.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import {
    buildInvoiceData,
    findLicenseForPayment,
    type PaymentInvoiceRow,
    type LicenseFacts,
} from '@/lib/invoice-data';
import { generateInvoicePdf, type GeneratedInvoice } from '@/lib/invoice-pdf';

export interface LoadInvoiceResult {
    ok: boolean;
    /** Motivo quando `ok` é false — já é texto exibível ao usuário. */
    error?: string;
    code?: 'PAYMENT_NOT_FOUND' | 'PAYMENT_NOT_CONFIRMED';
    invoice?: GeneratedInvoice;
    data?: ReturnType<typeof buildInvoiceData>;
}

/**
 * Carrega uma cobrança CONFIRMADA de um usuário e gera o PDF.
 *
 * @param ownerUserId UUID da sessão. Passar `null` é PROIBIDO: é a única coisa
 *        que separa "minha fatura" de "a fatura de qualquer um".
 */
export async function loadInvoiceForOwner(
    supabase: SupabaseClient,
    paymentId: string,
    ownerUserId: string | null,
    opts: { legalNote?: string | null } = {}
): Promise<LoadInvoiceResult> {
    if (!ownerUserId) {
        return { ok: false, code: 'PAYMENT_NOT_FOUND', error: 'Sessão obrigatória.' };
    }

    const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .eq('user_id', ownerUserId)   // <- prova de propriedade
        .maybeSingle();

    if (error) {
        return { ok: false, code: 'PAYMENT_NOT_FOUND', error: 'Não foi possível consultar a compra.' };
    }

    const row = data as PaymentInvoiceRow | null;
    if (!row) {
        return { ok: false, code: 'PAYMENT_NOT_FOUND', error: 'Compra não encontrada.' };
    }

    // Confirmação financeira é pré-requisito: nunca emitir documento que diga
    // "Pago" para transação não liquidada.
    const status = (row.status ?? '').toLowerCase();
    const CONFIRMED = ['approved', 'paid', 'refunded', 'partially_refunded', 'charged_back'];
    if (!CONFIRMED.includes(status)) {
        return {
            ok: false,
            code: 'PAYMENT_NOT_CONFIRMED',
            error: 'Fatura indisponível: aguardando confirmação do pagamento.',
        };
    }

    const license: LicenseFacts | null = await findLicenseForPayment(supabase, row);
    const invoiceData = buildInvoiceData({ row, license, legalNote: opts.legalNote ?? null });
    const invoice = await generateInvoicePdf(invoiceData);

    return { ok: true, invoice, data: invoiceData };
}

/**
 * Monta o contexto de e-mail a partir dos MESMOS fatos do PDF.
 *
 * Existe para que o e-mail e o documento nunca discordem: se o PDF diz
 * "R$ 15,00 e vence 19/11", o e-mail diz exatamente o mesmo, porque sai da
 * mesma estrutura de dados.
 */
export function emailDataFromInvoice(
    invoiceData: NonNullable<ReturnType<typeof buildInvoiceData>>,
    extras: {
        customerName?: string | null;
        stripeSubscriptionId?: string | null;
    } = {}
) {
    return {
        customerName: extras.customerName ?? invoiceData.customerName,
        customerEmailForEmail: invoiceData.customerEmail,
        planName: invoiceData.planLabel,
        billingLabel: invoiceData.billingLabel,
        amountPaid: invoiceData.amountPaid,
        currency: invoiceData.currency,
        purchasedAt: invoiceData.purchasedAt,
        paidAt: invoiceData.paidAt,
        periodStart: invoiceData.periodStart,
        periodEnd: invoiceData.periodEnd,
        licenseExpiresAt: invoiceData.licenseExpiresAt,
        licenseKey: invoiceData.licenseKey,
        maxDevices: invoiceData.maxDevices,
        devicesInUse: invoiceData.devicesInUse,
        purchaseId: invoiceData.purchaseId,
        stripeSubscriptionId: extras.stripeSubscriptionId ?? invoiceData.stripeSubscriptionId,
    };
}