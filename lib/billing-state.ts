/**
 * ESTADO CANÔNICO DO FATURAMENTO (missão §3, §9 e §11).
 *
 * Objetivo: o Dashboard NENHUMA vez deriva renovação/cancelamento por conta
 * própria. Este módulo é o único lugar que traduz o estado real da Stripe para
 * o vocabulário que a interface consome, e ele é 100% puro (sem I/O) para poder
 * ser testado exaustivamente.
 *
 * Regra de ouro da missão §3: "Apenas exiba Renovação: Ativada quando isso
 * corresponder à realidade do Stripe." Por isso `renewalEnabled` só é verdadeiro
 * quando TODOS os fatos abaixo são verdadeiros:
 *   - existe assinatura (não é compra avulsa);
 *   - a Stripe ainda considera a assinatura renovável (active/trialing/past_due);
 *   - não há cancelamento no fim do período já pago (cancel_at_period_end);
 *   - a assinatura não terminou (canceled/unpaid/incomplete_expired);
 *   - o pagamento não está estornado nem recusado de forma definitiva.
 *
 * Nenhum campo aqui confia em dado enviado pelo navegador: a entrada é sempre a
 * linha lida no Supabase, que por sua vez só é escrita pelo webhook Stripe
 * (ver app/api/webhook/stripe/route.ts) ou por uma rota autenticada que
 * reconcilia com a API da Stripe.
 */

/** Estados da assinatura gravados em `public.subscriptions.status`. */
export type SubscriptionStatus =
    | 'ACTIVE'
    | 'CANCEL_SCHEDULED'
    | 'CANCELED'
    | 'PAST_DUE'
    | 'TRIALING'
    | 'INCOMPLETE'
    | 'INCOMPLETE_EXPIRED'
    | 'UNPAID'
    | 'PAUSED'
    | 'PENDING'
    | 'REFUNDED'
    | 'UNKNOWN';

/** Situação COMPLETA que a interface usa para desenhar ações e mensagens. */
export type BillingState =
    /** Compra avulsa, sem assinatura: não existe renovação. */
    | 'ONE_TIME'
    /** Assinatura ativa e a Stripe vai cobrar de novo. */
    | 'ACTIVE_RENEWING'
    /** Renovação desligada; acesso segue até o fim do período pago. */
    | 'CANCEL_SCHEDULED'
    /** Assinatura terminou (canceled / deleted). */
    | 'ENDED'
    /** Cobrança recorrente recusada; a Stripe ainda tenta recuperar. */
    | 'PAYMENT_FAILED'
    /** Sem pagamento e sem tentativa de recuperação. */
    | 'UNPAID'
    /** Cadastro started/incomplete: ainda não virou assinatura válida. */
    | 'INCOMPLETE'
    /** Período de teste. */
    | 'TRIALING'
    /** Pausada pelo Stripe. */
    | 'PAUSED'
    /** Cobrança em aberto (payment ainda não liquidou). */
    | 'PAYMENT_PENDING'
    /** Reembolso confirmado nesta cobrança/assinatura. */
    | 'REFUNDED'
    /** Sem assinatura e sem pagamento confirmado. */
    | 'NONE';

// ============================================================================
// MAPEAMENTO STRIPE -> BANCO
// ============================================================================

/**
 * Traduz o status da assinatura Stripe para o vocabulário persistido.
 *
 * `cancel_at_period_end` tem prioridade sobre `active` porque é o que decide se
 * haverá nova cobrança — é exatamente o bug original do painel ("Renovação:
 * desligada" mesmo com assinatura viva e `current_period_end` no futuro).
 */
export function toSubscriptionStatus(input: {
    stripeStatus?: string | null;
    cancelAtPeriodEnd?: boolean | null;
    refunded?: boolean | null;
}): SubscriptionStatus {
    if (input.refunded === true) return 'REFUNDED';

    const s = (input.stripeStatus ?? '').trim().toLowerCase();

    switch (s) {
        case 'active':
            return input.cancelAtPeriodEnd === true ? 'CANCEL_SCHEDULED' : 'ACTIVE';
        case 'trialing':
            return 'TRIALING';
        case 'past_due':
            return 'PAST_DUE';
        case 'unpaid':
            return 'UNPAID';
        case 'paused':
            return 'PAUSED';
        case 'canceled':
            return 'CANCELED';
        case 'incomplete':
            return 'INCOMPLETE';
        case 'incomplete_expired':
            return 'INCOMPLETE_EXPIRED';
        case '':
        case 'null':
        case 'undefined':
            return 'UNKNOWN';
        default:
            return 'UNKNOWN';
    }
}

// ============================================================================
// MAPEAMENTO BANCO -> SITUAÇÃO DE TELA
// ============================================================================

export interface BillingStateInput {
    /** `public.subscriptions.status` — null quando o usuário não tem assinatura. */
    subscriptionStatus?: string | null;
    /** Existe linha em `subscriptions` para o usuário? */
    hasSubscription?: boolean;
    /** `public.payments.status` da compra que originou a licença. */
    paymentStatus?: string | null;
    /** A Stripe ainda tem a assinatura marcada para renovAR? */
    cancelAtPeriodEnd?: boolean | null;
    /** ISO da próxima cobrança; null quando não há cobrança futura. */
    nextBillingAt?: string | null;
}

export interface BillingStateResult {
    state: BillingState;
    /** Rótulo curto em português para o chip do painel. */
    label: string;
    /** true SOMENTE quando a Stripe confirma renovação futura programada. */
    renewalEnabled: boolean;
    /** Existe assinatura (renovável ou não)? Usado para escolher os botões. */
    hasSubscription: boolean;
    /** Ação de cancelamento faz sentido agora? */
    canCancelRenewal: boolean;
    /** Ação de reativação faz sentido agora? */
    canResumeRenewal: boolean;
    /** Botão de reembolso deve ser oferecido? */
    canRequestRefund: boolean;
    /** Frase honesta explicando o porquê (sem jargão e sem prometer o que não é verdade). */
    hint: string;
}

const PENDING_PAYMENT = ['pending', 'processing', 'open', 'requires_payment_method', 'unpaid', 'criado', 'novo'];
const FAILED_PAYMENT = ['failed', 'past_due', 'payment_failed', 'declined', 'canceled', 'cancelled', 'expired'];
const REFUNDED_PAYMENT = ['refunded', 'charged_back', 'chargeback', 'estornado', 'devolvido'];

const LABEL: Record<BillingState, string> = {
    ONE_TIME: 'Compra avulsa',
    ACTIVE_RENEWING: 'Ativa',
    CANCEL_SCHEDULED: 'Cancelamento agendado',
    ENDED: 'Encerrada',
    PAYMENT_FAILED: 'Cobrança falhou',
    UNPAID: 'Sem pagamento',
    INCOMPLETE: 'Cadastro incompleto',
    TRIALING: 'Período de teste',
    PAUSED: 'Pausada',
    PAYMENT_PENDING: 'Pagamento pendente',
    REFUNDED: 'Reembolsada',
    NONE: 'Sem assinatura',
};

/**
 * Dica de `ACTIVE_RENEWING` com duas variantes.
 *
 * A variante sem data é obrigatória: o estado pode ser ativo enquanto
 * `next_billing_at` ainda está vazio (assinatura criada antes do espelho existir,
 * ou webhook atrasado). Dizer "a próxima cobrança está programada" nessa
 * situação seria exatamente o tipo de afirmação que o painel não pode fazer.
 */
const ACTIVE_HINT =
    'Assinatura ativa: a próxima cobrança está programada na Stripe.';
const ACTIVE_HINT_NO_DATE =
    'Assinatura ativa, mas ainda não temos a data da próxima cobrança registrada. ' +
    'Use “Sincronizar Agora” para conferir com o processador de pagamentos.';

const HINT: Record<BillingState, string> = {
    ONE_TIME: 'Compra única. Não há renovação automática para este plano.',
    ACTIVE_RENEWING: ACTIVE_HINT,
    CANCEL_SCHEDULED: 'Renovação desligada. Seu acesso continua até o fim do período já pago.',
    ENDED: 'A assinatura foi encerrada na Stripe. Não haverá novas cobranças.',
    PAYMENT_FAILED: 'A cobrança recorrente foi recusada. Regularize o cartão para não perder a renovação.',
    UNPAID: 'A cobrança está em aberto na Stripe e o acesso pode ser interrompido ao fim do período pago.',
    INCOMPLETE: 'O cadastro da assinatura não foi concluído na Stripe. Nenhuma cobrança foi confirmada.',
    TRIALING: 'Período de teste em andamento na Stripe.',
    PAUSED: 'A assinatura está pausada na Stripe.',
    PAYMENT_PENDING: 'O pagamento ainda não foi confirmado. Nada é liberado antes da confirmação da Stripe.',
    REFUNDED: 'O pagamento foi reembolsado. O acesso correspondente foi encerrado.',
    NONE: 'Nenhuma assinatura recorrente encontrada.',
};

/**
 * Decide a situação da assinatura + quais ações o painel pode oferecer.
 *
 * Regra de precedência (impede o painel de mentir):
 *   1. Reembolso confirmado vence tudo (não existe "assinatura ativa" cobrada e devolvida).
 *   2. Assinatura cancelada/encerrada -> ENDED (não oferecer "cancelar" de novo).
 *   3. Pagamento pendente sem assinatura -> PAYMENT_PENDING.
 *   4. Cancelamento agendado -> CANCEL_SCHEDULED (acesso preservado).
 *   5. past_due/unpaid/failed -> falha (acesso do período pago é problema do
 *      license-schema, aqui é só o faturamento).
 *   6. active + não cancelado -> ACTIVE_RENEWING.
 *
 * Separação importante entre três coisas que NÃO são a mesma:
 *   `renewalEnabled`    -> a Stripe vai COBRAR de novo? (exige data futura)
 *   `canCancelRenewal`  -> a OPERAÇÃO de desligar existe? (independe da data)
 *   `hint`              -> o que podemos AFIRMAR ao cliente sem especular
 */
export function resolveBillingState(input: BillingStateInput): BillingStateResult {
    const sub = (input.subscriptionStatus ?? '').trim().toUpperCase();
    const pay = (input.paymentStatus ?? '').trim().toLowerCase();
    const hasSubscription = input.hasSubscription === true || (sub !== '' && sub !== 'UNKNOWN');

    const hasFutureBilling = !!input.nextBillingAt && !Number.isNaN(new Date(input.nextBillingAt).getTime());

    const build = (
        state: BillingState,
        opts?: { cancelAtPeriodEnd?: boolean | null }
    ): BillingStateResult => {
        // A renovação só é "Ativada" quando a Stripe confirma que ainda vai cobrar:
        // assinatura renovável + sem cancelamento agendado + com data futura.
        const cancelAt = opts?.cancelAtPeriodEnd ?? input.cancelAtPeriodEnd ?? false;
        const renewalEnabled =
            state === 'ACTIVE_RENEWING' && !cancelAt && hasFutureBilling;

        // O botão de cancelamento depende da OPERAÇÃO existir, não da data estar
        // gravada: quem sabe se a cobrança futura existe é a Stripe, e o
        // `next_billing_at` local serve só para EXIBIR a data. Esconder o botão
        // por causa de um espelho incompleto tiraria do cliente um direito que
        // ele tem por contrato.
        const canCancelRenewal = state === 'ACTIVE_RENEWING' && !cancelAt;
        const canResumeRenewal = state === 'CANCEL_SCHEDULED' && cancelAt;

        return {
            state,
            label: LABEL[state],
            renewalEnabled,
            hasSubscription,
            canCancelRenewal,
            canResumeRenewal,
            // Reembolso só é oferecido com pagamento CONFIRMADO e assinatura que
            // ainda pode ser encerrada. A elegibilidade temporal é avaliada na
            // rota (lib/billing-policy.ts) — aqui só evitamos botão morto.
            canRequestRefund: !REFUNDED_PAYMENT.includes(pay) && sub !== 'CANCELED' && sub !== 'REFUNDED',
            // Nunca afirmar "cobrança programada" sem a data que a comprova.
            hint: state === 'ACTIVE_RENEWING' && !hasFutureBilling && !cancelAt
                ? ACTIVE_HINT_NO_DATE
                : HINT[state],
        };
    };

    // 1. Reembolso confirmado.
    if (sub === 'REFUNDED' || REFUNDED_PAYMENT.includes(pay)) return build('REFUNDED');

    // 2. Assinatura encerrada de fato.
    if (sub === 'CANCELED' || sub === 'INCOMPLETE_EXPIRED') return build('ENDED');

    // 3. Estados sem assinatura válida.
    if (sub === 'INCOMPLETE') return build('INCOMPLETE');
    if (sub === 'PAUSED') return build('PAUSED');
    if (sub === 'UNPAID') return build('UNPAID');
    if (sub === 'TRIALING') return build('TRIALING');

    // 4. Cobrança em aberto/recusada.
    if (sub === 'PAST_DUE') return build('PAYMENT_FAILED');
    if (!sub && !hasSubscription && PENDING_PAYMENT.includes(pay)) return build('PAYMENT_PENDING');

    // 5. Cancelamento agendado: acesso continua, renovação não.
    if (sub === 'CANCEL_SCHEDULED') {
        return build('CANCEL_SCHEDULED', { cancelAtPeriodEnd: true });
    }

    // 6. Ativa.
    if (sub === 'ACTIVE') {
        // ACTIVE sem data futura é uma assinatura que a Stripe não vai mais
        // cobrar (ou registro incompleto): o honesto é dizer isso, e não
        // "Renovação: Ativada".
        // ACTIVE sem data futura é uma assinatura que a Stripe não vai mais
        // cobrar (ou registro incompleto). O rótulo continua "Ativa" — o
        // acesso continua — mas `renewalEnabled` já é falso, porque
        // `hasFutureBilling` é falso. Não há o que decidir aqui.
        return build('ACTIVE_RENEWING');
    }

    // 7. Compra avulsa confirmada (sem assinatura).
    if (!hasSubscription) {
        if (pay === '' || PENDING_PAYMENT.includes(pay)) return build('PAYMENT_PENDING');
        if (FAILED_PAYMENT.includes(pay)) return build('PAYMENT_FAILED');
        return build('ONE_TIME');
    }

    // 8. Fallback honesto: existe registro mas não dá para afirmar renovação.
    return build('NONE');
}

/**
 * Extrai o id da assinatura de uma invoice da Stripe cobrindo TODOS os formatos
 * de payload: as versões mais recentes do API moveram `subscription` para
 * `parent.subscription_details.subscription`, e algumas deixa `parent` como
 * string (id da invoice-pai). Sem isso, `invoice.paid` era silenciosamente
 * ignorado em parte das renovações.
 */
export function extractInvoiceSubscriptionId(invoice: unknown): string | null {
    if (!invoice || typeof invoice !== 'object') return null;
    const inv = invoice as Record<string, any>;

    const direct = inv.subscription;
    if (typeof direct === 'string' && direct.startsWith('sub_')) return direct;
    if (direct && typeof direct === 'object' && typeof direct.id === 'string') return direct.id;

    const parent = inv.parent;
    if (parent && typeof parent === 'object') {
        const details = parent.subscription_details ?? parent.subscription;
        const candidate = details?.subscription ?? details;
        if (typeof candidate === 'string' && candidate.startsWith('sub_')) return candidate;
        if (candidate && typeof candidate === 'object' && typeof candidate.id === 'string') {
            return candidate.id;
        }
    }

    const lines = Array.isArray(inv.lines?.data) ? inv.lines.data : [];
    for (const line of lines) {
        const p = line?.parent?.subscription_item_details?.subscription ?? line?.subscription;
        if (typeof p === 'string' && p.startsWith('sub_')) return p;
        if (p && typeof p === 'object' && typeof p.id === 'string') return p.id;
    }

    return null;
}

/** Mesma ideia do helper acima, mas tolerante ao `charge` (api 2025+). */
export function extractChargeInvoiceId(charge: unknown): string | null {
    if (!charge || typeof charge !== 'object') return null;
    const c = charge as Record<string, any>;

    // API >= 2025-03 removeu `charge.invoice`; `invoice_id` é o campo canônico.
    if (typeof c.invoice_id === 'string' && c.invoice_id) return c.invoice_id;
    if (typeof c.invoice === 'string' && c.invoice) return c.invoice;
    if (c.invoice && typeof c.invoice === 'object' && typeof c.invoice.id === 'string') {
        return c.invoice.id;
    }
    return null;
}

/** Id do pagamento (PaymentIntent) de uma invoice, tolerante a `payments`. */
export function extractInvoicePaymentIntentId(invoice: unknown): string | null {
    if (!invoice || typeof invoice !== 'object') return null;
    const inv = invoice as Record<string, any>;

    if (typeof inv.payment_intent === 'string' && inv.payment_intent) return inv.payment_intent;
    if (inv.payment_intent && typeof inv.payment_intent === 'object' && inv.payment_intent.id) {
        return inv.payment_intent.id as string;
    }

    const parent = inv.parent;
    const chargeDetails = parent?.charge_details ?? parent?.payment_details ?? parent;
    const charges = chargeDetails?.charges?.data;
    if (Array.isArray(charges) && charges.length > 0) {
        const first = charges[0];
        if (typeof first?.payment_intent === 'string') return first.payment_intent;
        if (first?.payment_intent?.id) return first.payment_intent.id;
    }

    return null;
}

/**
 * Inverso de `extractInvoiceSubscriptionId`: garante o tipo certo para gravar em
 * `payments.stripe_subscription_id` sem exploding quando a Stripe manda objeto.
 */
export function toStripeIdString(value: unknown): string | null {
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (value && typeof value === 'object') {
        const id = (value as { id?: unknown }).id;
        if (typeof id === 'string' && id.trim()) return id.trim();
    }
    return null;
}