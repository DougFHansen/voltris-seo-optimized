/**
 * FLUXO COMPLETO DA COMPRA -> VOLTA PARA "MINHAS LICENÇAS".
 *
 * Este arquivo é a prova de que o defeito relatado ("após finalizar a
 * compra no checkout da Stripe, não redireciona para o dashboard na aba de
 * Minhas Licenças") está corrigido em TODAS as 3 licenças, nos 2 períodos
 * (mensal e anual), sem depender de navegador ou de rede.
 *
 * A cadeia real é:
 *
 *   1. `POST /api/stripe/checkout` cria a sessão da Stripe.
 *      -> `success_url` = <base>/dashboard?tab=licenses&checkout_success=true...
 *   2. O cliente paga e a Stripe redireciona para essa URL.
 *   3. O painel abre a aba "Minhas Licenças".
 *      -> `resolveDashboardTab()` decide a aba (mesma função do menu lateral).
 *   4. Se a sessão ou o perfil exigirem uma passagem por `/login` ou
 *      `/perfil`, o destino é PRESERVADO (query string inteira).
 *
 * Rodar: npm test
 */

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
    normalizeBaseUrl,
    resolveSiteUrl,
    requestOriginOf,
    isTrustedOrigin,
    baseDomain,
    SITE_URL_PADRAO,
} from '../lib/site-url.ts';
import { buildCheckoutReturnUrls, CANCEL_PATH } from '../lib/checkout-redirect.ts';
import { safeInternalRedirect, withQuery } from '../lib/safe-redirect.ts';
import { resolveDashboardTab, isDashboardTabActive, DASHBOARD_TABS } from '../components/dashboard/dashboardTabs.ts';
import { LICENSE_CATALOG, resolveLicenseProduct, type PlanType, type BillingPeriod } from '../lib/license-catalog.ts';
import { STRIPE_SUPPORTED_EVENTS, stripeEventsForChecklist } from '../lib/stripe-events.ts';

const ROOT = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const read = (...parts: string[]) => readFileSync(path.join(ROOT, ...parts), 'utf8');

const PLANOS = Object.keys(LICENSE_CATALOG) as PlanType[];
const PERIODOS: BillingPeriod[] = ['month', 'year'];

/** Headers de requisição como o Node entrega. */
function headers(map: Record<string, string>) {
    return { get: (name: string) => map[name.toLowerCase()] ?? null };
}

// ============================================================================
// 1. A URL BASE DO SITE — o defeito que derrubava o redirecionamento
// ============================================================================

describe('URL base do site (lib/site-url.ts)', () => {
    test('http:// fora de localhost é normalizado para https://', () => {
        assert.equal(normalizeBaseUrl('http://voltris.com.br'), 'https://voltris.com.br');
        assert.equal(normalizeBaseUrl('http://www.voltris.com.br'), 'https://www.voltris.com.br');
    });

    test('localhost mantém http e a porta (desenvolvimento)', () => {
        assert.equal(normalizeBaseUrl('http://localhost:3000'), 'http://localhost:3000');
        assert.equal(normalizeBaseUrl('http://127.0.0.1:3000/'), 'http://127.0.0.1:3000');
    });

    test('barra final e caminho sobrando são removidos', () => {
        assert.equal(normalizeBaseUrl('https://www.voltris.com.br/'), 'https://www.voltris.com.br');
        assert.equal(normalizeBaseUrl('https://www.voltris.com.br/dashboard'), 'https://www.voltris.com.br');
        assert.equal(normalizeBaseUrl('https://www.voltris.com.br/x?y=1#z'), 'https://www.voltris.com.br');
    });

    test('entrada inútil cai no padrão canônico', () => {
        assert.equal(normalizeBaseUrl(''), SITE_URL_PADRAO);
        assert.equal(normalizeBaseUrl(null), SITE_URL_PADRAO);
        assert.equal(normalizeBaseUrl('nao-e-url'), SITE_URL_PADRAO);
        assert.equal(normalizeBaseUrl('javascript:alert(1)'), SITE_URL_PADRAO);
    });

    test('domínio de raiz ignora o www (mesmo site)', () => {
        assert.equal(baseDomain('www.voltris.com.br'), baseDomain('voltris.com.br'));
        assert.equal(baseDomain('WWW.Voltris.com.BR'), 'voltris.com.br');
    });

    test('a ORIGEM da requisição vence o ambiente (o defeito real do checkout)', () => {
        // Cenário de produção que existia: ambiente dizia http://voltris.com.br
        // e o cliente comprava em https://www.voltris.com.br.
        const url = resolveSiteUrl({
            env: { NEXT_PUBLIC_BASE_URL: 'http://voltris.com.br' },
            requestOrigin: 'https://www.voltris.com.br',
            isProduction: true,
        });
        assert.equal(url, 'https://www.voltris.com.br');
    });

    test('em desenvolvimento a volta é para o servidor local, não para produção', () => {
        const url = resolveSiteUrl({
            env: { NEXT_PUBLIC_BASE_URL: 'http://voltris.com.br' },
            requestOrigin: 'http://localhost:3000',
            isProduction: false,
        });
        assert.equal(url, 'http://localhost:3000');
    });

    test('origem de site terceiro NÃO é aceita (nada de open redirect)', () => {
        const url = resolveSiteUrl({
            env: { NEXT_PUBLIC_BASE_URL: 'https://www.voltris.com.br' },
            requestOrigin: 'https://site-do-atacante.com',
            isProduction: true,
        });
        assert.equal(url, 'https://www.voltris.com.br');
    });

    test('IP literal é rejeitado como origem', () => {
        assert.equal(isTrustedOrigin('http://1.2.3.4', 'https://www.voltris.com.br', true), false);
        assert.equal(isTrustedOrigin('https://www.voltris.com.br', 'https://www.voltris.com.br', true), true);
    });

    test('sem origem de requisição vale o valor configurado (normalizado)', () => {
        const url = resolveSiteUrl({
            env: { NEXT_PUBLIC_BASE_URL: 'http://voltris.com.br' },
            requestOrigin: null,
            isProduction: true,
        });
        assert.equal(url, 'https://voltris.com.br');
    });

    test('a origem sai do header Origin, do Referer ou do Host', () => {
        assert.equal(
            requestOriginOf(headers({ origin: 'https://www.voltris.com.br' })),
            'https://www.voltris.com.br',
        );
        assert.equal(
            requestOriginOf(headers({ referer: 'https://www.voltris.com.br/adquirir-licenca?plan=pro' })),
            'https://www.voltris.com.br',
        );
        assert.equal(
            requestOriginOf(headers({ host: 'www.voltris.com.br', 'x-forwarded-proto': 'https' })),
            'https://www.voltris.com.br',
        );
        assert.equal(requestOriginOf(headers({})), null);
    });
});

// ============================================================================
// 2. AS URLS DE RETORNO — para as 3 licenças × 2 períodos
// ============================================================================

describe('URLs de retorno do checkout (lib/checkout-redirect.ts)', () => {
    test('TODAS as 3 licenças × 2 períodos voltam para a aba Minhas Licenças', () => {
        for (const plan of PLANOS) {
            for (const period of PERIODOS) {
                const produto = resolveLicenseProduct(plan, period);
                assert.ok(produto, `${plan}/${period} não existe no catálogo`);

                const { success_url, cancel_url } = buildCheckoutReturnUrls('https://www.voltris.com.br', {
                    isLicense: true,
                    referenceId: `st_1792107372038`,
                });

                const url = new URL(success_url);
                assert.equal(url.origin, 'https://www.voltris.com.br');
                assert.equal(url.pathname, '/dashboard', `${plan}/${period} não volta para /dashboard`);
                assert.equal(url.searchParams.get('tab'), 'licenses',
                    `${plan}/${period} não abre a aba Minhas Licenças`);
                assert.equal(url.searchParams.get('checkout_success'), 'true',
                    `${plan}/${period} não dispara o aviso de compra confirmada`);
                assert.equal(url.searchParams.get('type'), 'license',
                    `${plan}/${period} não identifica o tipo como licença`);
                assert.equal(url.searchParams.get('ref'), 'st_1792107372038');

                assert.equal(cancel_url, `https://www.voltris.com.br${CANCEL_PATH.license}`);
            }
        }
    });

    test('serviço (pagamento único) também volta para o painel com type=service', () => {
        const { success_url, cancel_url } = buildCheckoutReturnUrls('https://www.voltris.com.br', {
            isLicense: false,
            referenceId: 'sv_1792107372038',
        });
        const url = new URL(success_url);
        assert.equal(url.searchParams.get('type'), 'service');
        assert.equal(url.searchParams.get('tab'), 'licenses');
        assert.equal(cancel_url, `https://www.voltris.com.br${CANCEL_PATH.service}`);
    });

    test('nenhuma URL de retorno nasce em http (fora de localhost)', () => {
        for (const plan of PLANOS) {
            for (const period of PERIODOS) {
                const urls = buildCheckoutReturnUrls('http://voltris.com.br', {
                    isLicense: true,
                    referenceId: `st_${plan}_${period}`,
                });
                assert.match(urls.success_url, /^https:\/\//, `${plan}/${period}: success_url em http`);
                assert.match(urls.cancel_url, /^https:\/\//, `${plan}/${period}: cancel_url em http`);
            }
        }
    });

    test('a referência da compra viaja sem caractere especial', () => {
        const { success_url } = buildCheckoutReturnUrls('https://www.voltris.com.br', {
            isLicense: true,
            referenceId: 'st_123&drop=1',
        });
        assert.equal(new URL(success_url).searchParams.get('ref'), 'st_123&drop=1');
    });
});

// ============================================================================
// 3. A ABA DO PAINEL — conteúdo e menu lateral concordam
// ============================================================================

describe('aba do painel (components/dashboard/dashboardTabs.ts)', () => {
    test('volta da Stripe (checkout_success=true) abre Minhas Licenças', () => {
        const params = new URLSearchParams('tab=licenses&checkout_success=true&type=license&ref=st_1');
        assert.equal(resolveDashboardTab(params), 'licenses');
    });

    test('checkout_success=true SEM tab= também abre Minhas Licenças', () => {
        assert.equal(resolveDashboardTab(new URLSearchParams('checkout_success=true&type=license')), 'licenses');
    });

    test('tab explícito sempre manda', () => {
        assert.equal(resolveDashboardTab(new URLSearchParams('tab=orders')), 'orders');
        assert.equal(resolveDashboardTab(new URLSearchParams('tab=overview&checkout_success=true')), 'overview');
    });

    test('sem parâmetro nenhum não há aba (o painel assume Visão Geral)', () => {
        assert.equal(resolveDashboardTab(new URLSearchParams('')), null);
        assert.equal(resolveDashboardTab(null), null);
    });

    test('o menu lateral marca "Minhas Licenças" na volta da Stripe', () => {
        const abaLicencas = DASHBOARD_TABS.find((t) => t.value === 'licenses')!;
        const abaGeral = DASHBOARD_TABS.find((t) => t.value === 'overview')!;
        const params = new URLSearchParams('checkout_success=true&type=license&ref=st_1');

        assert.equal(isDashboardTabActive(abaLicencas, '/dashboard', params), true,
            'a aba Minhas Licenças deveria estar ativa');
        assert.equal(isDashboardTabActive(abaGeral, '/dashboard', params), false,
            'a aba Visão Geral NÃO deveria estar ativa ao mesmo tempo');
    });

    test('o menu lateral marca "Minhas Licenças" com ?tab=licenses', () => {
        const abaLicencas = DASHBOARD_TABS.find((t) => t.value === 'licenses')!;
        const abaGeral = DASHBOARD_TABS.find((t) => t.value === 'overview')!;
        const params = new URLSearchParams('tab=licenses&checkout_success=true');
        assert.equal(isDashboardTabActive(abaLicencas, '/dashboard', params), true);
        assert.equal(isDashboardTabActive(abaGeral, '/dashboard', params), false);
    });

    test('sem parâmetro, a aba ativa é a Visão Geral', () => {
        const abaGeral = DASHBOARD_TABS.find((t) => t.value === 'overview')!;
        assert.equal(isDashboardTabActive(abaGeral, '/dashboard', new URLSearchParams('')), true);
    });
});

// ============================================================================
// 4. O DESTINO SOBREVIVE A /login E A /perfil
// ============================================================================

describe('o destino sobrevive aos desvios de autenticação', () => {
    test('safeInternalRedirect aceita caminho interno com query string', () => {
        const destino = '/dashboard?tab=licenses&checkout_success=true&type=license&ref=st_1';
        assert.equal(safeInternalRedirect(destino), destino);
    });

    test('safeInternalRedirect barra destino fora do site', () => {
        assert.equal(safeInternalRedirect('https://site-do-atacante.com'), '/dashboard');
        assert.equal(safeInternalRedirect('//site-do-atacante.com'), '/dashboard');
        assert.equal(safeInternalRedirect('/\\site-do-atacante.com'), '/dashboard');
        assert.equal(safeInternalRedirect('javascript:alert(1)'), '/dashboard');
        assert.equal(safeInternalRedirect(''), '/dashboard');
        assert.equal(safeInternalRedirect(null), '/dashboard');
    });

    test('withQuery junta caminho e query sem duplicar "?"', () => {
        assert.equal(withQuery('/dashboard', 'tab=licenses'), '/dashboard?tab=licenses');
        assert.equal(withQuery('/dashboard', '?tab=licenses'), '/dashboard?tab=licenses');
        assert.equal(withQuery('/dashboard', ''), '/dashboard');
    });

    test('o AuthGuard leva o destino INTEIRO para /login e para /perfil', () => {
        const guard = read('components', 'AuthGuard.tsx');
        assert.match(guard, /function destinoAtual\(/,
            'o AuthGuard precisa montar o destino com a query string');
        assert.match(guard, /window\.location\.search/,
            'o destino precisa carregar a query string');
        assert.match(guard, /router\.push\(`\/login\?redirect=\$\{encodeURIComponent\(destinoCompleto\)\}`\)/,
            'o desvio para /login está perdendo o destino');
        assert.match(guard, /router\.replace\(`\/perfil\?force=1&redirect=\$\{encodeURIComponent\(destinoCompleto\)\}`\)/,
            'o desvio para /perfil está perdendo o destino');
        assert.doesNotMatch(guard, /router\.push\('\/login'\)/,
            'redirecto cru para /login (sem destino) ainda existe');
    });

    test('o AuthGuard não exige fronteira de Suspense (sem useSearchParams)', () => {
        const guard = read('components', 'AuthGuard.tsx');
        assert.doesNotMatch(guard, /import\s*\{[^}]*useSearchParams/,
            'o AuthGuard não pode exigir Suspense nas páginas que o usam');
        assert.doesNotMatch(guard, /useSearchParams\(\)/,
            'o AuthGuard não pode exigir Suspense nas páginas que o usam');
    });

    test('a página de perfil devolve o cliente ao destino recebido', () => {
        const perfil = read('app', 'perfil', 'page.tsx');
        assert.match(perfil, /safeInternalRedirect\(searchParams\.get\('redirect'\)/,
            'o perfil precisa usar o destino recebido (filtrado)');
        assert.match(perfil, /router\.replace\(destino\)/,
            'o perfil precisa devolver o cliente ao destino');
    });

    test('o login devolve o cliente ao destino recebido', () => {
        const login = read('app', 'login', 'page.tsx');
        assert.match(login, /safeInternalRedirect\(redirectUrl/,
            'o login precisa usar o destino recebido (filtrado)');
        assert.ok(
            !/redirectUrl && redirectUrl !== '\/'/.test(login),
            'o login ainda usa o redirectUrl cru',
        );
    });
});

// ============================================================================
// 5. A ROTA DE CHECKOUT USA A FUNÇÃO TESTADA
// ============================================================================

describe('a rota de checkout usa as URLs de retorno testadas', () => {
    const rota = read('app', 'api', 'stripe', 'checkout', 'route.ts');

    test('a rota chama buildCheckoutReturnUrls (fonte única)', () => {
        assert.match(rota, /buildCheckoutReturnUrls\(/);
        assert.match(rota, /from '@\/lib\/checkout-redirect'/);
    });

    test('a rota resolve a URL base pela requisição (não por constante do ambiente)', () => {
        assert.match(rota, /resolveSiteUrl\(/);
        assert.match(rota, /requestOriginOf\(req\.headers\)/);
        assert.doesNotMatch(
            rota,
            /const BASE_URL = process\.env\.NEXT_PUBLIC_BASE_URL/,
            'a rota ainda fixa a URL base numa constante do ambiente',
        );
    });

    test('a rota não perde o preço/Plano do navegador (regressão §2)', () => {
        assert.doesNotMatch(rota, /body\.amount/, 'preço vindo do navegador');
        assert.doesNotMatch(rota, /body\.price/i, 'preço vindo do navegador');
    });

    test('o portal de cobrança volta para a mesma aba', () => {
        const portal = read('app', 'api', 'stripe', 'portal', 'route.ts');
        assert.match(portal, /return_url: `\$\{resolveSiteUrl\(/);
        assert.match(portal, /\/dashboard\?tab=licenses`/);
    });

    test('o e-mail de compra aponta para a aba de Minhas Licenças', () => {
        const templates = read('lib', 'email-templates.ts');
        assert.match(templates, /dashboardUrl: `\$\{site\}\/dashboard\?tab=licenses`/);
        assert.match(templates, /resolveSiteUrl\(/);
    });
});

// ============================================================================
// 6. O REFERENCE_ID DA ASSINATURA (prefixo duplo que quebrava o casamento)
// ============================================================================

describe('reference_id da assinatura', () => {
    const sync = read('lib', 'stripe-sync.ts');

    test('não há mais o prefixo duplo (sub_sub_...)', () => {
        assert.doesNotMatch(sync, /`sub_\$\{snapshot\.stripeSubscriptionId\}`/,
            'o reference_id está sendo prefixado duas vezes');
        assert.match(sync, /fallback\?\.referenceId \?\? snapshot\.stripeSubscriptionId/);
    });
});

// ============================================================================
// 7. O WEBHOOK TEM QUE TRATAR TODOS OS EVENTOS QUE O PAINEL DECLARA SUPORTAR
// ============================================================================

describe('contrato de eventos do webhook', () => {
    test('todo evento declarado suportado tem handler na rota', () => {
        const rota = read('app', 'api', 'webhook', 'stripe', 'route.ts');
        for (const evento of STRIPE_SUPPORTED_EVENTS) {
            assert.ok(
                rota.includes(`'${evento}'`),
                `o evento ${evento} está na lista de suportados mas não tem handler na rota`,
            );
        }
    });

    test('a lista de eventos é a mesma usada no checklist de conferência', () => {
        const checklist = stripeEventsForChecklist();
        for (const evento of STRIPE_SUPPORTED_EVENTS) {
            assert.ok(checklist.includes(evento), `${evento} ausente do checklist`);
        }
    });
});
