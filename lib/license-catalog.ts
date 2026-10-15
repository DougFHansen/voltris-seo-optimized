/**
 * Fonte CANONICA unica do produto VOLTRIS no backend.
 *
 * Missao secao 2: mapeamento validado no backend entre plano, periodo, preco,
 * dispositivos e (quando cadastrados) os Price IDs da Stripe. O navegador NUNCA
 * decide plano, valor ou dispositivos — apenas escolhe uma chave deste catalogo.
 *
 * Limites de dispositivos confirmados no mecanismo canono (RPC v3 + gerador C#):
 *   standard=1, pro=3, enterprise=9999 (ilimitado), trial=1.
 */

export type PlanType = 'standard' | 'pro' | 'enterprise';
export type BillingPeriod = 'month' | 'year';

export interface PlanDefinition {
    /** codigo de 3 letras embutido na license_key */
    code: string;
    maxDevices: number;
    displayName: string;
}

export const LICENSE_PLANS: Record<PlanType, PlanDefinition> = {
    standard: { code: 'STA', maxDevices: 1, displayName: 'VOLTRIS STANDARD' },
    pro: { code: 'PRO', maxDevices: 3, displayName: 'VOLTRIS PRO' },
    enterprise: { code: 'ENT', maxDevices: 9999, displayName: 'VOLTRIS ENTERPRISE' },
};

export interface ProductDefinition {
    /** nome exibido na Stripe */
    name: string;
    /** preco em reais (autoridade = servidor, nunca o cliente) */
    amount: number;
    /** Price ID real cadastrado na Stripe (live). Opcional ate o cadastro;
     *  quando presente, o checkout usa price (IDs oficiais) em vez de price_data. */
    stripePriceId?: string;
}

export const LICENSE_CATALOG: Record<PlanType, Record<BillingPeriod, ProductDefinition>> = {
    standard: {
        month: { name: 'Licença Standard Mensal', amount: 4.99 },
        year: { name: 'Licença Standard Anual', amount: 29.90 },
    },
    pro: {
        month: { name: 'Licença Pro Gamer Mensal', amount: 15.00 },
        year: { name: 'Licença Pro Gamer Anual', amount: 59.90 },
    },
    enterprise: {
        month: { name: 'Licença Enterprise Mensal', amount: 299.90 },
        year: { name: 'Licença Enterprise Anual', amount: 1099.90 },
    },
};

/** Servicos (pagamento unico) — continuam fora do fluxo de licenca. */
export const SERVICE_CATALOG: Record<string, ProductDefinition & { mode: 'payment' }> = {
    formatacao_basica: { name: 'Formatação Básica', amount: 99.90, mode: 'payment' },
    formatacao_media: { name: 'Formatação Média', amount: 149.90, mode: 'payment' },
    formatacao_avancada: { name: 'Formatação Avançada', amount: 199.90, mode: 'payment' },
    formatacao_corporativa: { name: 'Formatação Corporativa', amount: 349.90, mode: 'payment' },
    formatacao_gamer: { name: 'Formatação Gamer', amount: 449.90, mode: 'payment' },
    otimizacao_basica: { name: 'Otimização Básica', amount: 79.90, mode: 'payment' },
    otimizacao_media: { name: 'Otimização Média', amount: 99.90, mode: 'payment' },
    otimizacao_avancada: { name: 'Otimização Avançada', amount: 149.90, mode: 'payment' },
    correcao_windows: { name: 'Correção de Erros no Windows', amount: 49.90, mode: 'payment' },
    impressora_basica: { name: 'Instalação de Impressora', amount: 49.90, mode: 'payment' },
    virus_basica: { name: 'Remoção de Vírus', amount: 39.90, mode: 'payment' },
    recuperacao_basica: { name: 'Recuperação Básica', amount: 100.00, mode: 'payment' },
    recuperacao_media: { name: 'Recuperação Média', amount: 150.00, mode: 'payment' },
    recuperacao_avancada: { name: 'Recuperação Avançada', amount: 200.00, mode: 'payment' },
};

export function isPlanType(value: unknown): value is PlanType {
    return typeof value === 'string' && Object.prototype.hasOwnProperty.call(LICENSE_PLANS, value.toLowerCase());
}

export function isBillingPeriod(value: unknown): value is BillingPeriod {
    return value === 'month' || value === 'year';
}

/** Resolve (plan, period) -> produto do catalogo, ou null se combinacao invalida. */
export function resolveLicenseProduct(plan: unknown, period: unknown): (ProductDefinition & { plan: PlanType; period: BillingPeriod; maxDevices: number }) | null {
    if (!isPlanType(plan) || !isBillingPeriod(period)) return null;
    const product = LICENSE_CATALOG[plan][period];
    if (!product) return null;
    return { ...product, plan, period, maxDevices: LICENSE_PLANS[plan].maxDevices };
}

/** Reconciliacao Stripe->plano pelo Price ID quando cadastrado (fonte autoridade). */
export function planFromStripePriceId(priceId: unknown): { plan: PlanType; period: BillingPeriod } | null {
    if (typeof priceId !== 'string') return null;
    for (const plan of Object.keys(LICENSE_CATALOG) as PlanType[]) {
        for (const period of Object.keys(LICENSE_CATALOG[plan]) as BillingPeriod[]) {
            if (LICENSE_CATALOG[plan][period].stripePriceId === priceId) return { plan, period };
        }
    }
    return null;
}
