/**
 * POLÍTICA DE REEMBOLSO VOLTRIS (missão §8) — motor de elegibilidade.
 *
 * Fonte da verdade: a política PÚBLICA em /reembolso-cancelamento, que reproduz
 * o art. 49 do CDC:
 *   - 7 (sete) dias CORRIDOS a contar da assinatura/contratação, sem
 *     necessidade de justificativa, reembolso de 100% do valor pago e
 *     cancelamento imediato da licença;
 *   - depois de 7 dias o reembolso é ANALISADO caso a caso (licença já
 *     ativada e vinculada a hardware só com falha técnica comprovada;
 *     incompatibilidade grave sem solução em 48h úteis também pode ser pedida).
 *
 * Por que um módulo próprio: a elegibilidade precisa ser testável sem Stripe e
 * sem banco, e precisa ser a MESMA regra na rota, no painel e nos testes. Se a
 * decisão morar num `if` dentro do handler, ela diverge do texto publicado.
 *
 * Regra de contagem (CDC art. 49 + art. 66 CDC): o dia da contratação conta
 * como dia 0; o prazo termina às 23:59:59 do 7º dia corrido. Ou seja, o cliente
 * tem 7 dias INTEIROS para desistir, e não 6.
 */

/** Janela automática de reembolso, em dias corridos. */
export const REFUND_WINDOW_DAYS = 7;

/** Motivo do resultado — a interface mapeia cada um para uma frase verdadeira. */
export type RefundOutcome =
    /** Pode devolver sozinho, agora, na Stripe. */
    | 'AUTO_ELIGIBLE'
    /** Passou da janela: precisa de análise humana (não devolver automaticamente). */
    | 'REQUIRES_REVIEW'
    /** Ainda dá para pedir, mas já passou da janela automática. */
    | 'REQUIRES_REVIEW_HINT'
    /** Não existe reembolso em duplicidade para esta cobrança. */
    | 'ALREADY_REFUNDED'
    /** Reembolso já solicitado e em andamento. */
    | 'ALREADY_REQUESTED'
    /** Não existe compra pagada para reembolsar. */
    | 'NOT_A_PAID_PURCHASE'
    /** Sem dados suficientes para decidir com segurança. */
    | 'MISSING_DATA';

export interface RefundEvaluation {
    outcome: RefundOutcome;
    /** true somente em AUTO_ELIGIBLE. */
    eligible: boolean;
    /** true quando vale a pena abrir um ticket para análise humana. */
    needsReview: boolean;
    /** Prazo total em dias corridos já consumido (inteiro, >= 0). */
    daysElapsed: number | null;
    /** Dias corridos que ainda faltam (0 quando já estourou). */
    daysRemaining: number;
    /** 7º dia em ISO — data em que a janela automática fecha. */
    deadlineAt: string | null;
    /** Frase honesta para o modal do painel. */
    message: string;
    /** Artigo/regra citada, para a tela não parecer arbitrária. */
    basis: string;
}

const BASIS_CDC = 'Política VOLTRIS de reembolso (art. 49 do Código de Defesa do Consumidor)';

const MILLIS_PER_DAY = 86_400_000;

/**
 * Normaliza a data da contratação para epoch em ms.
 *
 * Aceita o que realmente existe no banco (`timestamptz` ISO) e o que a Stripe
 * devolve (epoch em segundos). Retorna null quando não há data confiável —
 * nesse caso NUNCA devolvemos automático (missão §8: não inventar evidência).
 */
export function toEpochMs(value: string | number | Date | null | undefined): number | null {
    if (value === null || value === undefined || value === '') return null;

    if (value instanceof Date) {
        const ms = value.getTime();
        return Number.isNaN(ms) ? null : ms;
    }

    if (typeof value === 'number') {
        if (!Number.isFinite(value)) return null;
        // Segundos vs milissegundos (Stripe usa segundos; banco usa ISO).
        return value < 1e11 ? Math.round(value * 1000) : Math.round(value);
    }

    const numeric = Number(value);
    if (Number.isFinite(numeric) && String(value).trim() !== '' && /^\d+$/.test(String(value).trim())) {
        return numeric < 1e11 ? Math.round(numeric * 1000) : Math.round(numeric);
    }

    const ms = new Date(value).getTime();
    return Number.isNaN(ms) ? null : ms;
}

/** Fim do 7º dia corrido (23:59:59.999 em UTC) a partir da contratação. */
export function refundDeadline(purchasedAtMs: number, windowDays = REFUND_WINDOW_DAYS): number {
    return purchasedAtMs + windowDays * MILLIS_PER_DAY - 1;
}

export interface EvaluateRefundInput {
    /** Data da contratação da COBRANCA específica (não a data da assinatura). */
    purchasedAt?: string | number | Date | null;
    /** `public.payments.status` da cobrança. */
    paymentStatus?: string | null;
    /** Já existe `stripe_refund_id` gravado para esta cobrança? */
    refundId?: string | null;
    /** Existe solicitação manual já aberta e não resolvida? */
    openRequestId?: string | null;
    /** Valor pago nesta cobrança (BRL), para exibir na confirmação. */
    amount?: number | null;
    /** Injetável para teste; default = agora. */
    now?: number;
}

const REFUNDED_STATUS = ['refunded', 'charged_back', 'chargeback', 'estornado', 'devolvido', 'partially_refunded'];
const PAID_STATUS = ['approved', 'paid', 'succeeded', 'complete', 'completed'];
const PENDING_STATUS = ['pending', 'processing', 'open', 'requires_payment_method', 'unpaid', 'criado', 'novo'];

function brl(amount: number): string {
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * Decide o que pode ser feito com a cobrança indicada.
 *
 * Não toca em nada: é uma função pura, usada tanto pela rota (antes de chamar a
 * Stripe) quanto pelo painel (para habilitar ou adaptar o botão).
 */
export function evaluateRefund(input: EvaluateRefundInput): RefundEvaluation {
    const now = input.now ?? Date.now();
    const status = (input.paymentStatus ?? '').trim().toLowerCase();
    const amount = typeof input.amount === 'number' && Number.isFinite(input.amount) ? input.amount : null;

    // 1. Idempotência: nunca devolver duas vezes a mesma cobrança.
    if (REFUNDED_STATUS.includes(status) || (input.refundId ?? '').trim() !== '') {
        return {
            outcome: 'ALREADY_REFUNDED',
            eligible: false,
            needsReview: false,
            daysElapsed: null,
            daysRemaining: 0,
            deadlineAt: null,
            message: 'Este pagamento já foi reembolsado.',
            basis: BASIS_CDC,
        };
    }

    if ((input.openRequestId ?? '').trim() !== '') {
        return {
            outcome: 'ALREADY_REQUESTED',
            eligible: false,
            needsReview: false,
            daysElapsed: null,
            daysRemaining: 0,
            deadlineAt: null,
            message: 'Já existe uma solicitação de reembolso em andamento para esta cobrança.',
            basis: BASIS_CDC,
        };
    }

    // 2. Nada pago não é reembolsável (e não pode virar "aprovado" por via do reembolso).
    if (PENDING_STATUS.includes(status) || status === '') {
        return {
            outcome: 'NOT_A_PAID_PURCHASE',
            eligible: false,
            needsReview: false,
            daysElapsed: null,
            daysRemaining: 0,
            deadlineAt: null,
            message: 'Não há pagamento confirmado para reembolsar nesta cobrança.',
            basis: BASIS_CDC,
        };
    }

    if (!PAID_STATUS.includes(status)) {
        // Recusado/cancelado do lado do Stripe: o dinheiro não entrou.
        return {
            outcome: 'NOT_A_PAID_PURCHASE',
            eligible: false,
            needsReview: false,
            daysElapsed: null,
            daysRemaining: 0,
            deadlineAt: null,
            message: 'Esta cobrança não foi aprovada, portanto não há valor a devolver.',
            basis: BASIS_CDC,
        };
    }

    // 3. Sem data confiável não se automatiza decisão financeira.
    const purchasedMs = toEpochMs(input.purchasedAt);
    if (purchasedMs === null) {
        return {
            outcome: 'MISSING_DATA',
            eligible: false,
            needsReview: true,
            daysElapsed: null,
            daysRemaining: 0,
            deadlineAt: null,
            message:
                'Não localizamos a data desta cobrança para validar o prazo de 7 dias. Abra um chamado e resolvemos manualmente.',
            basis: BASIS_CDC,
        };
    }

    const deadline = refundDeadline(purchasedMs);
    const deadlineAt = new Date(deadline).toISOString();
    const elapsedExact = (now - purchasedMs) / MILLIS_PER_DAY;
    const daysElapsed = Math.max(0, Math.floor(elapsedExact));
    const withinWindow = now <= deadline;

    if (withinWindow) {
        const daysRemaining = Math.max(1, Math.ceil((deadline - now) / MILLIS_PER_DAY));
        return {
            outcome: 'AUTO_ELIGIBLE',
            eligible: true,
            needsReview: false,
            daysElapsed,
            daysRemaining,
            deadlineAt,
            message:
                `Dentro do prazo de ${REFUND_WINDOW_DAYS} dias corridos` +
                (amount !== null ? `. Reembolso integral de ${brl(amount)}` : '') +
                (daysRemaining <= 1 ? ', encerrando hoje.' : `, com ${daysRemaining} dia(s) restante(s).`),
            basis: BASIS_CDC,
        };
    }

    // 4. Fora da janela: NÃO devolver sozinho. A política manda analisar.
    return {
        outcome: 'REQUIRES_REVIEW',
        eligible: false,
        needsReview: true,
        daysElapsed,
        daysRemaining: 0,
        deadlineAt,
        message:
            `O prazo automático de ${REFUND_WINDOW_DAYS} dias encerrou em ` +
            `${new Date(deadline).toLocaleDateString('pt-BR')}. Sua solicitação segue para análise da equipe ` +
            'conforme a regra de software ativado / falha técnica da política.',
        basis: BASIS_CDC,
    };
}