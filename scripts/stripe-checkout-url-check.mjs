/**
 * PROVA DE QUE A VOLTA DO CHECKOUT VAI PARA "MINHAS LICENÇAS".
 *
 * Este script usa a API REAL da Stripe (modo teste) para criar uma sessão de
 * checkout para CADA uma das 3 licenças × 2 períodos (mensal e anual), com a
 * URL que o NOSSO código gera, e depois lê a sessão de volta para conferir
 * que a Stripe guardou exatamente aquela URL de retorno.
 *
 * Não é simulação: é a mesma chamada que `POST /api/stripe/checkout` faz.
 * As sessões criadas são EXPIRADAS no final (nada fica pendente).
 *
 * Uso:
 *   node --import ./scripts/register-alias.mjs scripts/stripe-checkout-url-check.mjs
 *
 * Saída esperada: "OK — as 6 combinações voltam para /dashboard?tab=licenses".
 */
import { readFileSync } from 'node:fs';

function loadEnv() {
    for (const f of ['.env.local', '.env']) {
        try {
            const raw = readFileSync(f, 'utf8');
            for (const line of raw.split(/\r?\n/)) {
                const m = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/.exec(line);
                if (!m) continue;
                let v = m[2].trim();
                if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
                if (!process.env[m[1]]) process.env[m[1]] = v;
            }
        } catch { /* arquivo opcional */ }
    }
}
loadEnv();

const { default: Stripe } = await import('stripe');
const { buildCheckoutReturnUrls } = await import('../lib/checkout-redirect.ts');
const { resolveSiteUrl } = await import('../lib/site-url.ts');
const { LICENSE_CATALOG, resolveLicenseProduct } = await import('../lib/license-catalog.ts');

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
    console.error('STRIPE_SECRET_KEY ausente — nada a verificar.');
    process.exit(2);
}

const stripe = new Stripe(secretKey);

// A URL base que o checkout REALMENTE usaria, com a origem da requisição
// simulada (o site de produção, como o navegador mandaria).
const ORIGEM = process.env.CHECKOUT_ORIGIN || 'https://www.voltris.com.br';
const BASE_URL = resolveSiteUrl({ requestOrigin: ORIGEM });

console.log(`Modo:            ${secretKey.startsWith('sk_test') ? 'TESTE' : 'PRODUÇÃO'}`);
console.log(`Origem (browser): ${ORIGEM}`);
console.log(`URL base usada:  ${BASE_URL}`);
console.log('');

const PLANOS = Object.keys(LICENSE_CATALOG);
const PERIODOS = ['month', 'year'];
const criadas = [];
let falhas = 0;

for (const plan of PLANOS) {
    for (const period of PERIODOS) {
        const produto = resolveLicenseProduct(plan, period);
        if (!produto) {
            console.error(`FALHA  ${plan}/${period}: não existe no catálogo`);
            falhas++;
            continue;
        }

        const referenceId = `st_verificacao_${plan}_${period}`;
        const urls = buildCheckoutReturnUrls(BASE_URL, { isLicense: true, referenceId });

        // Mesma linha de item que a rota real monta (price_data ad-hoc).
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            customer_email: 'verificacao@example.com',
            client_reference_id: referenceId,
            line_items: [{
                price_data: {
                    currency: 'brl',
                    product_data: { name: produto.name },
                    unit_amount: Math.round(produto.amount * 100),
                    recurring: { interval: produto.period },
                },
                quantity: 1,
            }],
            success_url: urls.success_url,
            cancel_url: urls.cancel_url,
            metadata: {
                reference_id: referenceId,
                license_type: produto.plan,
                billing_period: produto.period,
                type: 'license',
            },
        });
        criadas.push(session.id);

        // Relê da API: o que a Stripe GUARDOU é o que importa.
        const lida = await stripe.checkout.sessions.retrieve(session.id);
        const guardado = new URL(lida.success_url);
        const guardadoCancel = new URL(lida.cancel_url);

        const problemas = [];
        if (guardado.pathname !== '/dashboard') problemas.push(`caminho ${guardado.pathname}`);
        if (guardado.searchParams.get('tab') !== 'licenses') problemas.push('tab != licenses');
        if (guardado.searchParams.get('checkout_success') !== 'true') problemas.push('sem checkout_success');
        if (guardado.searchParams.get('type') !== 'license') problemas.push('type != license');
        if (guardado.searchParams.get('ref') !== referenceId) problemas.push('ref trocado');
        if (guardado.protocol !== 'https:') problemas.push(`protocolo ${guardado.protocol}`);
        if (guardadoCancel.pathname !== '/adquirir-licenca') problemas.push(`cancel ${guardadoCancel.pathname}`);

        if (problemas.length) {
            console.error(`FALHA  ${plan}/${period}: ${problemas.join(' | ')}`);
            console.error(`       guardada: ${lida.success_url}`);
            falhas++;
        } else {
            console.log(`OK     ${plan}/${period}  ${produto.name.padEnd(30)} -> ${lida.success_url}`);
        }
    }
}

// Limpeza: nada fica pendente na Stripe.
for (const id of criadas) {
    try {
        await stripe.checkout.sessions.expire(id);
    } catch { /* já expirada */ }
}
console.log(`\n${criadas.length} sessões de teste expiradas (nada pendente).`);

if (falhas) {
    console.error(`\nFALHOU: ${falhas} combinação(ões) com URL de retorno errada.`);
    process.exit(1);
}

console.log(`\nOK — as ${PLANOS.length * PERIODOS.length} combinações (3 licenças × 2 períodos) voltam para /dashboard?tab=licenses.`);
