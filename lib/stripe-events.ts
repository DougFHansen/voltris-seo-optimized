/**
 * LISTA DE EVENTOS STRIPE SUPORTADOS PELO WEBHOOK (missão §4 e §12).
 *
 * Vive aqui, e não dentro de `app/api/webhook/stripe/route.ts`, por dois motivos:
 *
 *  1. O Next.js restringe o que um arquivo de rota pode exportar (só handlers e
 *     um punhado de constantes de rota). Exportar um array daqui quebraria a
 *     validação de tipos do build.
 *  2. A lista precisa ser conferível FORA do código do webhook — é o contrato
 *     com o painel da Stripe. Com ela em um módulo, dá para testá-la e imprimi-la
 *     no checklist de entrega, em vez de descer até o handler para conferir.
 */

/** Eventos que o webhook trata, cada um com UMA responsabilidade definida. */
export const STRIPE_SUPPORTED_EVENTS = [
    'checkout.session.completed',
    'checkout.session.async_payment_succeeded',
    'checkout.session.async_payment_failed',
    'checkout.session.expired',
    'invoice.paid',
    'invoice.payment_failed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'charge.refunded',
    'refund.updated',
] as const;

export type StripeSupportedEvent = (typeof STRIPE_SUPPORTED_EVENTS)[number];

const SUPPORTED = new Set<string>(STRIPE_SUPPORTED_EVENTS);

export function isSupportedStripeEvent(type: string): boolean {
    return SUPPORTED.has(type);
}

/**
 * Lista formatada para conferência manual no painel da Stripe
 * (Dashboard > Desenvolvedores > Webhooks > Editar endpoint > Eventos).
 */
export function stripeEventsForChecklist(): string {
    return STRIPE_SUPPORTED_EVENTS.map((e) => `  - ${e}`).join('\n');
}