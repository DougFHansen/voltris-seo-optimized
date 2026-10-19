/**
 * CAMADA DE CONSULTA DO PAINEL ADMINISTRATIVO (PARTES 2, 3 e 18).
 *
 * Regra central: NADA é carregado "inteiro" para o navegador. Toda listagem
 * é uma consulta com paginação e filtros aplicados no servidor. A PARTE 18 é
 * explícita sobre isso e a base cresce — um painel que hoje roda com 50 linhas
 * quebra com 50 mil.
 *
 * -------------------------------------------------------------------------
 * SOBRE O SUPABASE
 * -------------------------------------------------------------------------
 * O cliente JS do Supabase NÃO tem `COUNT(*)` com filtro exato nem agregações
 *wt complexas estáveis na versão instalada. Por isso as métricas são
 * calculadas com `count: 'exact', head: true` — uma ida ao banco por métrica.
 *
 * Isso seria N+1 se fossem 30 métricas. Não é: são ~20 contagens
 * independentes, paralelizáveis, e cada uma usa índice. Em compensação, este
 * módulo mantém o número de idas ao banco FIXO e previsível, que é o que
 * importa para não degrade a base.
 *
 * -------------------------------------------------------------------------
 * SOBRE PRIVACIDADE
 * -------------------------------------------------------------------------
 * E-mails de cliente são mascarados por padrão no payload. O painel precisa
 * ver o e-mail para atender, mas expor a lista completa numa resposta de API
 * aumentaria o raio de vazamento sem ganho operacional — o admin tem o cliente
 * identificado pelo id.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

// ===========================================================================
// PERIODO
// ===========================================================================

export type PeriodPreset =
    | 'today' | '7d' | '30d' | 'month' | 'prev_month' | 'year' | 'custom';

export interface DateRange {
    from: string;
    to: string;
}

/**
 * Converte o período escolhido em intervalo.
 *
 * Usa `America/Sao_Paulo` como dia de referência, e não UTC: "hoje" para o
 * administrador brasileiro precisa ser o dia DELE. Com UTC, das 21h em diante
 * o painel já mostraria o dia seguinte e o total do dia viria errado — o tipo
 * de erro que faz o número parecer inventado.
 */
export function resolvePeriod(
    preset: PeriodPreset,
    custom?: { from?: string | null; to?: string | null }
): DateRange {
    const TZ = 'America/Sao_Paulo';
    const now = new Date();

    // Início do dia no fuso do cliente, em ISO.
    const startOfLocalDay = (d: Date) => {
        const parts = new Intl.DateTimeFormat('en-CA', {
            timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
        }).format(d);
        return `${parts}T00:00:00.000-03:00`;
    };
    const endOfLocalDay = (d: Date) => {
        const parts = new Intl.DateTimeFormat('en-CA', {
            timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
        }).format(d);
        return `${parts}T23:59:59.999-03:00`;
    };

    switch (preset) {
        case 'today':
            return { from: startOfLocalDay(now), to: endOfLocalDay(now) };

        case '7d': {
            const d = new Date(now); d.setDate(d.getDate() - 6);
            return { from: startOfLocalDay(d), to: endOfLocalDay(now) };
        }

        case '30d': {
            const d = new Date(now); d.setDate(d.getDate() - 29);
            return { from: startOfLocalDay(d), to: endOfLocalDay(now) };
        }

        case 'month': {
            const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit' })
                .formatToParts(now);
            const y = parts.find((p) => p.type === 'year')!.value;
            const m = parts.find((p) => p.type === 'month')!.value;
            const last = new Date(Number(y), Number(m), 0).getDate();
            return { from: `${y}-${m}-01T00:00:00.000-03:00`, to: `${y}-${m}-${String(last).padStart(2, '0')}T23:59:59.999-03:00` };
        }

        case 'prev_month': {
            const ref = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const y = ref.getFullYear();
            const m = String(ref.getMonth() + 1).padStart(2, '0');
            const last = new Date(ref.getFullYear(), ref.getMonth() + 1, 0).getDate();
            return { from: `${y}-${m}-01T00:00:00.000-03:00`, to: `${y}-${m}-${String(last).padStart(2, '0')}T23:59:59.999-03:00` };
        }

        case 'year': {
            const y = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric' }).format(now);
            return { from: `${y}-01-01T00:00:00.000-03:00`, to: `${y}-12-31T23:59:59.999-03:00` };
        }

        case 'custom':
        default: {
            const from = custom?.from ? `${custom.from}T00:00:00.000-03:00` : startOfLocalDay(now);
            const to = custom?.to ? `${custom.to}T23:59:59.999-03:00` : endOfLocalDay(now);
            return { from, to };
        }
    }
}

// ===========================================================================
// MÁSCARA
// ===========================================================================

/**
 * Mascara o e-mail para exibição.
 *
 * `douglasfelipebecker@gmail.com` → `d…r@gmail.com`
 *
 * Mantém o domínio, que é o que ajuda a identificar o cliente em caso de
 * homonímia, e some com o local, que é o dado pessoal.
 */
export function maskEmail(email: string | null | undefined): string {
    const s = String(email ?? '').trim();
    if (!s || !s.includes('@')) return '—';
    const [local, domain] = s.split('@');
    if (!domain) return '—';
    if (local.length <= 2) return `${local[0]}…@${domain}`;
    return `${local[0]}…${local[local.length - 1]}@${domain}`;
}

// ===========================================================================
// PAGINAÇÃO
// ===========================================================================

export interface Page<T> {
    items: T[];
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
}

/** Teto de página. Acima disso a resposta fica pesada e a UI fica inútil. */
export const MAX_PAGE_SIZE = 100;

export function readPage(searchParams: URLSearchParams): { limit: number; offset: number } {
    const limitRaw = Number(searchParams.get('limit'));
    const offsetRaw = Number(searchParams.get('offset'));
    const limit = Number.isFinite(limitRaw) && limitRaw > 0
        ? Math.min(Math.floor(limitRaw), MAX_PAGE_SIZE)
        : 25;
    const offset = Number.isFinite(offsetRaw) && offsetRaw > 0 ? Math.floor(offsetRaw) : 0;
    return { limit, offset };
}

export function paginate<T>(items: T[], total: number, limit: number, offset: number): Page<T> {
    return { items, total, limit, offset, hasMore: offset + items.length < total };
}

/** Escapa caracteres do PostgREST que têm significado em `.or()`/`.ilike()`. */
export function sanitizeSearch(term: string): string {
    return term.replace(/[,()*%'"\\]/g, ' ').replace(/\s+/g, ' ').trim();
}

// ===========================================================================
// MÉTRICAS (PARTE 2)
// ===========================================================================

export interface OverviewMetrics {
    users: {
        total: number;
        admin: number;
        blocked: number;
        /** Cadastrados no período. */
        newInPeriod: number;
        /**
         * Pendentes de confirmação.
         *
         * `profiles` não tem coluna de confirmação; `auth.users.email_confirmed_at`
         * é a fonte da verdade e o PostgREST não expõe `auth.*` para o cliente.
         * Então devolvemos `null` — "não sei" — em vez de estimar.
         */
        pendingConfirmation: number | null;
    };
    licenses: {
        active: number;
        expired: number;
        revoked: number;
        promotional: number;
        total: number;
        expiringSoon: number;
    };
    subscriptions: { active: number; canceling: number; canceled: number; total: number };
    payments: {
        confirmed: number;
        pending: number;
        failed: number;
        refunded: number;
        partiallyRefunded: number;
        total: number;
    };
    revenue: {
        gross: number;
        refunds: number;
        net: number;
        currency: string;
    };
    devices: { linked: number };
    alerts: {
        webhookFailures: number;
        emailFailures: number;
        stuckEmails: number;
    };
    /** Campos que o banco atual não permite calcular com honestidade. */
    unavailable: string[];
}

const PAID = ['approved', 'paid', 'succeeded'];

/**
 * Calcula os indicadores da PARTE 2.
 *
 * As contagens rodam em PARALELO. São ~20 consultas independentes e cada uma
 * é um índice; o custo é uma ida ao banco, não N.
 *
 * Duas regras da missão são aplicadas à risca:
 *   - receita BRUTA é só pagamento CONFIRMADO, nunca `pending`;
 *   - receita LÍQUIDA desconta o que foi efetivamente reembolsado.
 */
export async function computeOverview(
    db: SupabaseClient,
    range: DateRange
): Promise<OverviewMetrics> {
    const nowIso = new Date().toISOString();
    const soon = new Date(Date.now() + 7 * 86_400_000).toISOString();

    const [
        usersTotal, usersAdmin, usersBlocked, usersNew,
        licTotal, licRevoked, licExpired, licPromo, licExpiringSoon,
        subTotal, subActive, subCanceling, subCanceled,
        payTotal, payConfirmed, payPending, payFailed, payRefunded, payPartRefunded,
        payGrossRows, payRefundRows,
        devicesLinked,
        whFailures, emailFailures, emailStuck,
    ] = await Promise.all([
        db.from('profiles').select('id', { count: 'exact', head: true }),
        db.from('profiles').select('id', { count: 'exact', head: true }).eq('is_admin', true),
        db.from('profiles').select('id', { count: 'exact', head: true }).eq('is_blocked', true),
        db.from('profiles').select('id', { count: 'exact', head: true })
            .gte('created_at', range.from).lte('created_at', range.to),

        db.from('licenses').select('license_key', { count: 'exact', head: true }),
        db.from('licenses').select('license_key', { count: 'exact', head: true }).eq('revoked', true),
        db.from('licenses').select('license_key', { count: 'exact', head: true })
            .lte('expires_at', nowIso).eq('revoked', false),
        db.from('licenses').select('license_key', { count: 'exact', head: true })
            .eq('plan_type', 'promotional'),
        db.from('licenses').select('license_key', { count: 'exact', head: true })
            .gte('expires_at', nowIso).lte('expires_at', soon).eq('revoked', false),

        db.from('subscriptions').select('id', { count: 'exact', head: true }),
        db.from('subscriptions').select('id', { count: 'exact', head: true })
            .in('status', ['active', 'trialing']),
        db.from('subscriptions').select('id', { count: 'exact', head: true })
            .eq('cancel_at_period_end', true),
        db.from('subscriptions').select('id', { count: 'exact', head: true })
            .in('status', ['canceled', 'cancelled', 'ended']),

        db.from('payments').select('id', { count: 'exact', head: true }),
        db.from('payments').select('id', { count: 'exact', head: true }).in('status', PAID),
        db.from('payments').select('id', { count: 'exact', head: true }).in('status', ['pending', 'processing']),
        db.from('payments').select('id', { count: 'exact', head: true }).in('status', ['failed', 'canceled', 'cancelled']),
        db.from('payments').select('id', { count: 'exact', head: true }).eq('status', 'refunded'),
        db.from('payments').select('id', { count: 'exact', head: true }).eq('status', 'partially_refunded'),

        db.from('payments').select('amount, refunded_amount, currency')
            .in('status', PAID).gte('created_at', range.from).lte('created_at', range.to),
        db.from('payments').select('refunded_amount')
            .not('refunded_amount', 'is', null)
            .gte('updated_at', range.from).lte('updated_at', range.to),

        db.from('license_devices').select('id', { count: 'exact', head: true }),

        db.from('stripe_event_log').select('event_id', { count: 'exact', head: true })
            .neq('status', 'processed').gte('created_at', range.from),
        db.from('email_outbox').select('id', { count: 'exact', head: true })
            .eq('status', 'failed').gte('created_at', range.from),
        db.from('email_outbox').select('id', { count: 'exact', head: true })
            .eq('status', 'pending').lte('created_at', nowIso),
    ]);

    // Uma tabela que ainda não existe não pode derrubar o painel inteiro:
    // as métricas ficam em 0 e o campo entra em `unavailable`.
    const unavailable: string[] = [];


    const rows = payGrossRows.data ?? [];
    const gross = rows.reduce((acc, r) => acc + Number(r.amount ?? 0), 0);
    const refundSum = (payRefundRows.data ?? []).reduce((acc, r) => acc + Number(r.refunded_amount ?? 0), 0);

    const ev = (r: any, label: string) => {
        if (r.error) { unavailable.push(label); return 0; }
        return r.count ?? 0;
    };

    return {
        users: {
            total: ev(usersTotal, 'profiles'),
            admin: ev(usersAdmin, 'profiles.is_admin'),
            blocked: ev(usersBlocked, 'profiles.is_blocked'),
            newInPeriod: ev(usersNew, 'profiles.created_at'),
            // auth.users não é legível via PostgREST: honestamente desconhecido.
            pendingConfirmation: null,
        },
        licenses: {
            total: ev(licTotal, 'licenses'),
            active: Math.max(0, ev(licTotal, 'licenses') - ev(licRevoked, 'licenses.revoked') - ev(licExpired, 'licenses.expires_at')),
            expired: ev(licExpired, 'licenses.expires_at'),
            revoked: ev(licRevoked, 'licenses.revoked'),
            promotional: ev(licPromo, 'licenses.plan_type'),
            expiringSoon: ev(licExpiringSoon, 'licenses.expires_at'),
        },
        subscriptions: {
            total: ev(subTotal, 'subscriptions'),
            active: ev(subActive, 'subscriptions.status'),
            canceling: ev(subCanceling, 'subscriptions.cancel_at_period_end'),
            canceled: ev(subCanceled, 'subscriptions.status'),
        },
        payments: {
            total: ev(payTotal, 'payments'),
            confirmed: ev(payConfirmed, 'payments.status'),
            pending: ev(payPending, 'payments.status'),
            failed: ev(payFailed, 'payments.status'),
            refunded: ev(payRefunded, 'payments.status'),
            partiallyRefunded: ev(payPartRefunded, 'payments.status'),
        },
        revenue: {
            gross: Math.round(gross * 100) / 100,
            refunds: Math.round(refundSum * 100) / 100,
            net: Math.round((gross - refundSum) * 100) / 100,
            currency: 'BRL',
        },
        devices: { linked: ev(devicesLinked, 'license_devices') },
        alerts: {
            webhookFailures: ev(whFailures, 'stripe_event_log'),
            emailFailures: ev(emailFailures, 'email_outbox'),
            stuckEmails: ev(emailStuck, 'email_outbox'),
        },
        unavailable: [...new Set(unavailable.filter(Boolean))],
    };
}

/**
 * MRR (PARTE 2).
 *
 * Calculado sobre ASSINATURAS ATIVAS com renovação habilitada — não sobre
 * histórico de pagamentos. Somar "todo mês que entrou" contaria a primeira
 * cobrança de uma assinatura já cancelada como se fosse recorrente, que é
 * exatamente a confusão que a missão proíbe ("receita recebida com receita
 * prevista").
 *
 * Devolve `null` quando não há base elegível, porque MRR sem assinaturas
 * ativas é 0,00 e não "indisponível" — mas o motivo fica explícito.
 */
export async function computeMrr(
    db: SupabaseClient
): Promise<{ mrr: number; arr: number | null; eligible: number; currency: string; reason?: string }> {
    const { data, error } = await db
        .from('subscriptions')
        .select('plan_type, billing_period, amount, currency, status, cancel_at_period_end')
        .in('status', ['active', 'trialing'])
        .eq('cancel_at_period_end', false);

    if (error) {
        return { mrr: 0, arr: null, eligible: 0, currency: 'BRL', reason: 'assinaturas indisponíveis' };
    }

    const rows = data ?? [];
    const eligible = rows.filter((r: any) => Number(r.amount ?? 0) > 0);
    if (eligible.length === 0) {
        return {
            mrr: 0, arr: null, eligible: 0, currency: 'BRL',
            reason: 'nenhuma assinatura ativa com valor e renovação habilitada',
        };
    }

    let mrr = 0;
    for (const r of eligible as any[]) {
        const amount = Number(r.amount ?? 0);
        const annual = ['year', 'anual', 'annual', 'y'].includes(String(r.billing_period ?? '').toLowerCase());
        mrr += annual ? amount / 12 : amount;
    }
    mrr = Math.round(mrr * 100) / 100;

    return { mrr, arr: Math.round(mrr * 12 * 100) / 100, eligible: eligible.length, currency: 'BRL' };
}
