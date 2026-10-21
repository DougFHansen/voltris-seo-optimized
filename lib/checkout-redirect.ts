/**
 * URLS DE RETORNO DO CHECKOUT DA STRIPE.
 *
 * Função PURA (sem rede, sem banco): é ela que decide para onde o cliente
 * volta depois de pagar. Isolada assim, dá para provar em teste que as 3
 * licenças × 2 períodos (mensal e anual) saem exatamente para a aba
 * "Minhas Licenças" do painel.
 *
 * ---------------------------------------------------------------------------
 * O QUE A URL DE VOLTA PRECISA CARREGAR
 * ---------------------------------------------------------------------------
 *
 *   /dashboard?tab=licenses&checkout_success=true&type=license&ref=st_...
 *
 *   - `tab=licenses`      -> o painel abre a aba de MINHAS LICENÇAS e o menu
 *                            lateral marca a aba certa (mesma função de
 *                            resolução para conteúdo e navegação);
 *   - `checkout_success=true` -> dispara o aviso "Pedido confirmado" e a
 *                            releitura automática dos dados (o webhook pode
 *                            ainda estar processando);
 *   - `type=license|service` -> o aviso fala do coisa certa (licença ou
 *                            serviço);
 *   - `ref=<reference_id>` -> o painel sabe QUAL compra foi concluída.
 *
 * O `cancel_url` leva de volta à tela de origem do pedido.
 */

import { normalizeBaseUrl, SITE_URL_PADRAO } from '@/lib/site-url';

export interface CheckoutReturnUrls {
    success_url: string;
    cancel_url: string;
}

export interface CheckoutReturnOptions {
    /** `true` para licença (assinatura), `false` para serviço (pagamento único). */
    isLicense: boolean;
    /** `reference_id` da compra (`st_...` ou `sv_...`). */
    referenceId: string;
}

/** Caminhos de origem do pedido (para o `cancel_url`). */
export const CANCEL_PATH = {
    license: '/adquirir-licenca',
    service: '/servicos',
} as const;

/**
 * Monta as URLs de retorno do checkout.
 *
 * @param baseUrl URL base do site, já resolvida e normalizada
 *                (ver `lib/site-url.ts` — nunca `http://` fora de localhost).
 */
export function buildCheckoutReturnUrls(
    baseUrl: string,
    options: CheckoutReturnOptions,
): CheckoutReturnUrls {
    // Normaliza aqui também (e não só na origem): mesmo que alguém passe uma
    // URL em http, a URL de retorno NUNCA nasce em texto claro fora de
    // localhost. É a última barreira antes do cliente ser mandado para algum
    // lugar.
    const base = normalizeBaseUrl(baseUrl, SITE_URL_PADRAO);
    const tipo = options.isLicense ? 'license' : 'service';
    const ref = encodeURIComponent(options.referenceId);

    return {
        success_url:
            `${base}/dashboard?tab=licenses&checkout_success=true&type=${tipo}&ref=${ref}`,
        cancel_url: `${base}${options.isLicense ? CANCEL_PATH.license : CANCEL_PATH.service}`,
    };
}
