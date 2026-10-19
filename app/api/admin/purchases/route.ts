import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireCapability } from '@/lib/admin-auth';
import { createAdminClient } from '@/utils/supabase/admin';
import { readPage, paginate, sanitizeSearch, maskEmail } from '@/lib/admin-queries';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/purchases — COMPRAS REAIS (PARTE 5).
 *
 * Existe porque a aba "Clientes" responde "QUEM é cliente", e a pergunta do
 * dia a dia do VOLTRIS é outra: "QUEM PAGOU, QUANDO e POR QUANTO". Uma tela
 * de perfis com contagem de compras não responde nenhuma das três.
 *
 * Uma linha por COMPRA, não por cliente. Um cliente com três cobranças é três
 * linhas — que é como a reconciliação financeira funciona.
 *
 * O e-mail vem COMPLETO aqui. A diferença em relação à lista de clientes é
 * deliberada e é a justificativa: esta tela existe para conciliação
 * financeira e para responder a "qual foi a data da minha compra". O
 * operador precisa do dado. A lista de clientes, usada só para navegação,
 * mantém a máscara.
 */

const Query = z.object({
    q: z.string().trim().max(120).optional(),
    status: z.string().trim().max(30).optional(),
    plan: z.string().trim().max(30).optional(),
    /** Período em dias, para o filtro rápido. */
    days: z.coerce.number().int().min(1).max(3650).optional(),
    limit: z.string().optional(),
    offset: z.string().optional(),
});

export async function GET(req: NextRequest) {
    const { response } = await requireCapability('payments.read');
    if (response) return response;

    const parsed = Query.safeParse(Object.fromEntries(req.nextUrl.searchParams));
    if (!parsed.success) {
        return NextResponse.json({ error: 'Filtros inválidos.', code: 'INVALID_QUERY' }, { status: 400 });
    }

    const { limit, offset } = readPage(req.nextUrl.searchParams);
    const term = parsed.data.q ? sanitizeSearch(parsed.data.q) : '';
    const db = createAdminClient();

    try {
        let query = db
            .from('payments')
            .select(
                `id, reference_id, user_id, email, customer_name, customer_name_snapshot,
                 plan_type, billing_period, amount, currency, status, provider, invoice_kind,
                 created_at, paid_at, stripe_id, stripe_invoice_id, stripe_subscription_id,
                 refunded_amount, refunded_at`,
                { count: 'exact' }
            )
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (parsed.data.status && parsed.data.status !== 'all') {
            query = query.eq('status', parsed.data.status);
        }
        if (parsed.data.plan && parsed.data.plan !== 'all') {
            query = query.eq('plan_type', parsed.data.plan);
        }
        if (parsed.data.days) {
            query = query.gte('created_at', new Date(Date.now() - parsed.data.days * 86_400_000).toISOString());
        }
        if (term) {
            const like = `%${term}%`;
            query = query.or(
                `email.ilike.${like},customer_name.ilike.${like},customer_name_snapshot.ilike.${like},reference_id.ilike.${like},stripe_id.ilike.${like}`
            );
        }

        const { data, error, count } = await query;

        if (error) {
            return NextResponse.json(
                { error: 'Falha ao consultar compras.', code: 'QUERY_FAILED', detail: error.message },
                { status: 500 }
            );
        }

        const rows = (data ?? []) as any[];

        // Licença gerada por compra: uma consulta só, com os ids já em memória.
        // Evita N+1, que a Parte 18 proíbe.
        const paymentIds = rows.map((r) => r.id);
        let licenseByPayment = new Map<string, { key: string; expires: string | null }>();
        if (paymentIds.length > 0) {
            const { data: lics } = await db
                .from('licenses')
                .select('payment_id, license_key, expires_at')
                .in('payment_id', paymentIds);
            for (const l of (lics ?? []) as any[]) {
                if (l.payment_id) licenseByPayment.set(l.payment_id, { key: l.license_key, expires: l.expires_at });
            }
        }

        // Soma por cliente, para a coluna "total gasto" fazer sentido.
        let totalsByUser = new Map<string, number>();
        let totalsByEmail = new Map<string, number>();
        if (parsed.data.days) {
            const { data: all } = await db
                .from('payments')
                .select('user_id, email, amount, status')
                .in('status', ['approved', 'paid', 'succeeded'])
                .gte('created_at', new Date(Date.now() - parsed.data.days * 86_400_000).toISOString());
            for (const p of (all ?? []) as any[]) {
                const v = Number(p.amount ?? 0);
                if (p.user_id) totalsByUser.set(p.user_id, (totalsByUser.get(p.user_id) ?? 0) + v);
                if (p.email) totalsByEmail.set(String(p.email).toLowerCase(), (totalsByEmail.get(String(p.email).toLowerCase()) ?? 0) + v);
            }
        }

        const items = rows.map((r) => {
            const email = r.email ?? null;
            const nome = r.customer_name_snapshot ?? r.customer_name ?? null;
            const lic = licenseByPayment.get(r.id);
            return {
                id: r.id,
                reference: r.reference_id,
                userId: r.user_id,
                nome: nome ?? '(sem nome)',
                // E-mail COMPLETO: esta tela é de conciliação financeira.
                email: email ?? '—',
                emailMasked: maskEmail(email),
                plano: r.plan_type,
                modalidade: r.billing_period,
                tipo: r.invoice_kind === 'renewal' ? 'Renovação' : r.invoice_kind === 'service' ? 'Serviço' : 'Compra',
                valor: Number(r.amount ?? 0),
                moeda: (r.currency ?? 'BRL').toUpperCase(),
                status: r.status,
                /** DATA DA COMPRA — o dado que faltava na aba de clientes. */
                dataCompra: r.paid_at ?? r.created_at,
                dataPago: r.paid_at,
                reembolsado: r.refunded_amount != null ? Number(r.refunded_amount) : null,
                dataReembolso: r.refunded_at,
                stripePaymentIntent: r.stripe_id,
                stripeInvoice: r.stripe_invoice_id,
                stripeSubscription: r.stripe_subscription_id,
                licencaGerada: lic?.key ?? null,
                licencaValidade: lic?.expires ?? null,
            };
        });

        return NextResponse.json(paginate(items, count ?? items.length, limit, offset));
    } catch {
        return NextResponse.json(
            { error: 'Erro inesperado ao listar compras.', code: 'UNEXPECTED' },
            { status: 500 }
        );
    }
}
