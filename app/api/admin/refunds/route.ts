import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/utils/supabase/admin';
import { requireCapability, auditAction, rateLimit } from '@/lib/admin-auth';
import { readPage, paginate, maskEmail } from '@/lib/admin-queries';
import { stripe } from '@/lib/stripe';
import { toStripeIdString } from '@/lib/billing-state';
import { NotificationService } from '@/services/notificationService';
import { rotulo, tomDoStatus } from '@/lib/admin-labels';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * REEMBOLSOS — a fila que o cliente abre pelo painel e o operador resolve.
 *
 * O que o cliente faz: pede o reembolso no dashboard (`/api/stripe/refund`).
 * O que acontece no servidor: a solicitação é gravada em `refund_requests` e o
 * admin é notificado. Até aqui, a solicitação NÃO aparecia em lugar nenhum do
 * painel — o operador só descobria a demanda por e-mail ou Telegram.
 *
 * Esta rota entrega a fila completa, com o que o atendimento precisa para
 * decidir: quem pediu (nome, e-mail, telefone), o que foi comprado (plano,
 * ciclo, valor, licença e chave), a política aplicada e o estado real do
 * pedido no processador.
 */

const db = createAdminClient();

const PAGAMENTOS = `
    id, reference_id, plan_type, billing_period, amount, currency, status,
    email, customer_name_snapshot, paid_at, created_at, user_id,
    stripe_charge_id, stripe_invoice_id, stripe_id, stripe_subscription_id,
    refunded_amount, refunded_at
`;

const PERFIS = 'id, full_name, email, phone, login, city, state';

interface RefundRequestRow {
    id: string;
    payment_id: string | null;
    user_id: string | null;
    subscription_id: string | null;
    stripe_charge_id: string | null;
    stripe_refund_id: string | null;
    amount: number | string | null;
    currency: string | null;
    status: string | null;
    reason: string | null;
    source: string | null;
    customer_message: string | null;
    outcome_message: string | null;
    policy_basis: string | null;
    created_at: string | null;
    updated_at: string | null;
    resolved_at: string | null;
    processed_by: string | null;
    processed_at: string | null;
}

export async function GET(req: NextRequest) {
    const { actor, response } = await requireCapability('refunds.read');
    if (response) return response;

    const { limit, offset } = readPage(req.nextUrl.searchParams);
    const status = (req.nextUrl.searchParams.get('status') ?? '').trim().toLowerCase();

    try {
        let query = db
            .from('refund_requests')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);
        if (status && status !== 'all') query = query.eq('status', status);

        const { data, error, count } = await query;
        if (error) {
            console.error('[api/admin/refunds] erro ao listar:', error);
            return NextResponse.json(
                { error: 'Não foi possível carregar os reembolsos.', code: 'DB_READ_FAILED' },
                { status: 500 }
            );
        }

        const requests = (data ?? []) as unknown as RefundRequestRow[];

        const paymentIds = [...new Set(requests.map((r) => r.payment_id).filter(Boolean))] as string[];
        const userIds = [...new Set(requests.map((r) => r.user_id).filter(Boolean))] as string[];

        const [pagamentosRes, perfisRes, licencasRes] = await Promise.all([
            paymentIds.length
                ? db.from('payments').select(PAGAMENTOS).in('id', paymentIds)
                : Promise.resolve({ data: [] as any[] }),
            userIds.length
                ? db.from('profiles').select(PERFIS).in('id', userIds)
                : Promise.resolve({ data: [] as any[] }),
            userIds.length
                ? db.from('licenses')
                    .select('license_key, plan_type, max_devices, expires_at, revoked, client_id, user_id, created_at')
                    .in('user_id', userIds)
                    .order('created_at', { ascending: false })
                : Promise.resolve({ data: [] as any[] }),
        ]);

        const pagamentos = new Map<string, any>((pagamentosRes.data ?? []).map((p: any) => [p.id, p]));
        const perfis = new Map<string, any>((perfisRes.data ?? []).map((p: any) => [p.id, p]));
        const licencasPorUsuario = new Map<string, any[]>();
        for (const l of (licencasRes.data ?? []) as any[]) {
            const lista = licencasPorUsuario.get(l.user_id) ?? [];
            lista.push(l);
            licencasPorUsuario.set(l.user_id, lista);
        }

        const itens = requests.map((r) => {
            const pagamento = r.payment_id ? pagamentos.get(r.payment_id) ?? null : null;
            const perfil = r.user_id ? perfis.get(r.user_id) ?? null : null;
            const licencas = r.user_id ? licencasPorUsuario.get(r.user_id) ?? [] : [];
            const licencaDaCompra = pagamento
                ? licencas.find((l) => l.client_id && pagamento.id ? false : false) ?? null
                : null;
            return {
                id: r.id,
                status: r.status,
                statusRotulo: rotulo(r.status, 'reembolso'),
                tom: tomDoStatus(r.status),
                amount: Number(r.amount ?? 0),
                currency: (r.currency ?? 'BRL').toUpperCase(),
                reason: r.reason,
                source: r.source,
                customerMessage: r.customer_message,
                outcomeMessage: r.outcome_message,
                policyBasis: r.policy_basis,
                createdAt: r.created_at,
                updatedAt: r.updated_at,
                resolvedAt: r.resolved_at,
                processedBy: r.processed_by,
                processedAt: r.processed_at,
                stripeChargeId: r.stripe_charge_id,
                stripeRefundId: r.stripe_refund_id,
                cliente: {
                    nome: perfil?.full_name ?? pagamento?.customer_name_snapshot ?? null,
                    email: perfil?.email ? maskEmail(perfil.email) : (pagamento?.email ? maskEmail(pagamento.email) : null),
                    emailCompleto: perfil?.email ?? pagamento?.email ?? null,
                    telefone: perfil?.phone ?? null,
                    login: perfil?.login ?? null,
                    cidade: perfil?.city ?? null,
                    uf: perfil?.state ?? null,
                    userId: r.user_id,
                },
                compra: pagamento
                    ? {
                        id: pagamento.id,
                        referencia: pagamento.reference_id,
                        plano: pagamento.plan_type,
                        ciclo: pagamento.billing_period,
                        valor: Number(pagamento.amount ?? 0),
                        status: pagamento.status,
                        pagoEm: pagamento.paid_at,
                        reembolsoEm: pagamento.refunded_at,
                        valorReembolsado: pagamento.refunded_amount,
                        stripeChargeId: pagamento.stripe_charge_id,
                    }
                    : null,
                licencas: licencas.map((l) => ({
                    chave: l.license_key,
                    plano: l.plan_type,
                    dispositivos: l.max_devices,
                    expiraEm: l.expires_at,
                    revogada: l.revoked,
                    clienteInterno: l.client_id,
                })),
                licencaDaCompra: licencaDaCompra,
            };
        });

        await auditAction(actor!, {
            resource: 'refunds',
            resourceId: null,
            action: 'REFUNDS_VIEWED',
            outcome: 'OK',
            after: { total: count ?? 0, status: status || 'all' },
        });

        return NextResponse.json({
            ...paginate(itens, count ?? itens.length, limit, offset),
        });
    } catch (err: any) {
        console.error('[api/admin/refunds] exceção:', err);
        return NextResponse.json(
            { error: 'Não foi possível carregar os reembolsos.', code: 'UNKNOWN' },
            { status: 500 }
        );
    }
}

const Body = z.object({
    id: z.string().uuid('Identificador inválido.'),
    action: z.enum(['approve', 'reject']),
    reason: z.string().trim().min(5, 'Justifique a decisão.').max(500),
});

/**
 * Decide a solicitação: aprovar (executa o reembolso na Stripe) ou recusar.
 *
 * O reembolso é executado com chave de idempotência determinística: o mesmo
 * pedido nunca devolve dinheiro duas vezes, mesmo com retry ou redeploy.
 */
export async function PATCH(req: NextRequest) {
    const { actor, response } = await requireCapability('refunds.write');
    if (response) return response;

    const parsed = Body.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.', code: 'INVALID_BODY' },
            { status: 400 }
        );
    }
    const { id, action, reason } = parsed.data;

    if (!rateLimit(`admin-refund:${id}`, 10, 60_000)) {
        return NextResponse.json(
            { error: 'Muitas alterações em pouco tempo. Aguarde um instante.', code: 'RATE_LIMITED' },
            { status: 429 }
        );
    }

    const { data: request, error: readErr } = await db
        .from('refund_requests')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (readErr || !request) {
        return NextResponse.json({ error: 'Solicitação não encontrada.', code: 'NOT_FOUND' }, { status: 404 });
    }
    const reqRow = request as unknown as RefundRequestRow;

    if (reqRow.status && ['succeeded', 'rejected'].includes(reqRow.status)) {
        return NextResponse.json(
            { error: 'Esta solicitação já foi decidida.', code: 'ALREADY_RESOLVED' },
            { status: 409 }
        );
    }

    const { data: pagamento } = reqRow.payment_id
        ? await db.from('payments').select(PAGAMENTOS).eq('id', reqRow.payment_id).maybeSingle()
        : { data: null };

    if (!pagamento) {
        return NextResponse.json(
            { error: 'A cobrança desta solicitação não foi encontrada.', code: 'NOT_FOUND' },
            { status: 404 }
        );
    }
    const pay = pagamento as any;

    /* ------------------------------------------------------------- recusa */
    if (action === 'reject') {
        const { error: updErr } = await db
            .from('refund_requests')
            .update({
                status: 'rejected',
                outcome_message: reason,
                resolved_at: new Date().toISOString(),
                processed_by: actor!.userId,
                processed_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', id);

        if (updErr) {
            return NextResponse.json(
                { error: 'Não foi possível registrar a recusa.', code: 'DB_WRITE_FAILED' },
                { status: 500 }
            );
        }

        try {
            await NotificationService.notify({
                recipients: [pay.user_id].filter(Boolean),
                kind: 'refund',
                title: 'Reembolso recusado',
                message: reason,
                actionUrl: '/dashboard?tab=licenses',
                data: { payment_id: pay.id, kind: 'refund', stage: 'rejected' },
            });
        } catch (e) {
            console.error('[api/admin/refunds] recusa registrada, mas notificação falhou:', e);
        }

        await auditAction(actor!, {
            resource: 'refunds',
            resourceId: id,
            action: 'REFUND_REJECTED',
            before: reqRow,
            after: { status: 'rejected' },
            reason,
            outcome: 'OK',
        });

        return NextResponse.json({ ok: true, status: 'rejected' });
    }

    /* ----------------------------------------------------------- aprovação */
    let chargeId: string | null =
        reqRow.stripe_charge_id ?? pay.stripe_charge_id ?? null;

    if (!chargeId && pay.stripe_invoice_id) {
        try {
            const invoice = await stripe.invoices.retrieve(pay.stripe_invoice_id);
            // A API da Stripe mudou o campo `charge` ao longo do tempo; o
            // espelho local (`payments.stripe_charge_id`) e o PaymentIntent
            // cobrem o resto.
            const qualquer = invoice as unknown as Record<string, any>;
            chargeId = toStripeIdString(qualquer?.charge ?? null);
        } catch { /* tenta o payment intent a seguir */ }
    }
    if (!chargeId && pay.stripe_id) {
        try {
            const pi = await stripe.paymentIntents.retrieve(pay.stripe_id);
            chargeId = toStripeIdString(pi.latest_charge);
        } catch { /* sem cobrança localizada */ }
    }
    if (!chargeId) {
        return NextResponse.json(
            {
                error: 'A cobrança não foi localizada no processador. Resolva manualmente e registre o resultado.',
                code: 'CHARGE_NOT_FOUND',
            },
            { status: 409 }
        );
    }

    try {
        const refund = await stripe.refunds.create(
            {
                charge: chargeId,
                reason: 'requested_by_customer',
                metadata: {
                    payment_id: pay.id,
                    user_id: pay.user_id ?? '',
                    subscription_id: pay.stripe_subscription_id ?? '',
                    origin: 'voltris.com.br/admin/refunds',
                },
            },
            { idempotencyKey: `voltris-refund-${pay.id}` }
        );

        if (refund.status !== 'succeeded' && refund.status !== 'pending') {
            return NextResponse.json(
                { error: 'O processador não confirmou o reembolso. Nada foi devolvido.', code: 'REFUND_NOT_CONFIRMED' },
                { status: 502 }
            );
        }

        const succeeded = refund.status === 'succeeded';
        await db.from('payments').update({
            status: succeeded ? 'refunded' : 'partially_refunded',
            stripe_refund_id: refund.id,
            stripe_charge_id: chargeId,
            refunded_amount: refund.amount / 100,
            refunded_at: succeeded ? new Date(refund.created * 1000).toISOString() : null,
            updated_at: new Date().toISOString(),
        }).eq('id', pay.id);

        await db.from('refund_requests').update({
            status: succeeded ? 'succeeded' : 'processing',
            stripe_charge_id: chargeId,
            stripe_refund_id: refund.id,
            amount: refund.amount / 100,
            outcome_message: reason,
            resolved_at: succeeded ? new Date().toISOString() : null,
            processed_by: actor!.userId,
            processed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }).eq('id', id);

        try {
            await NotificationService.notify({
                recipients: [pay.user_id].filter(Boolean),
                kind: 'refund',
                title: succeeded ? 'Reembolso confirmado' : 'Reembolso em processamento',
                message: succeeded
                    ? 'O valor foi devolvido. O prazo do estorno depende da sua operadora.'
                    : 'O processo foi aceito pelo processador. O crédito ainda não caiu.',
                actionUrl: '/dashboard?tab=licenses',
                data: { payment_id: pay.id, kind: 'refund', stage: succeeded ? 'confirmed' : 'processing' },
            });
        } catch (e) {
            console.error('[api/admin/refunds] reembolso executado, mas notificação falhou:', e);
        }

        await auditAction(actor!, {
            resource: 'refunds',
            resourceId: id,
            action: 'REFUND_APPROVED',
            before: reqRow,
            after: { status: succeeded ? 'succeeded' : 'processing', refund: refund.id },
            reason,
            outcome: 'OK',
        });

        return NextResponse.json({ ok: true, status: succeeded ? 'succeeded' : 'processing', refundId: refund.id });
    } catch (err: any) {
        console.error('[api/admin/refunds] falha ao executar o reembolso:', err);
        return NextResponse.json(
            { error: 'Não foi possível executar o reembolso no processador.', code: 'STRIPE_ERROR', detail: String(err?.message ?? err).slice(0, 200) },
            { status: 502 }
        );
    }
}
