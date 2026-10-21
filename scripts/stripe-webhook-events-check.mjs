/**
 * CONFERÊNCIA (E CORREÇÃO) DOS EVENTOS DO WEBHOOK DA STRIPE.
 *
 * O webhook do projeto trata 10 eventos (lib/stripe-events.ts). Se o endpoint
 * no painel da Stripe não estiver inscrito em todos, metade do ciclo de vida
 * da assinatura simplesmente não chega ao painel: falha de cobrança não vira
 * FALHA_NO_PAGAMENTO, cancelamento feito no painel da Stripe não espelha,
 * reembolso não chega.
 *
 * Uso:
 *   node --import ./scripts/register-alias.mjs scripts/stripe-webhook-events-check.mjs
 *   node --import ./scripts/register-alias.mjs scripts/stripe-webhook-events-check.mjs --apply
 *
 * O `--apply` só altera endpoints cujo caminho é o do nosso webhook
 * (`/api/webhook/stripe`) — nenhum outro endpoint da conta é tocado.
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
const { STRIPE_SUPPORTED_EVENTS } = await import('../lib/stripe-events.ts');

const CHAVE = process.env.STRIPE_SECRET_KEY;
if (!CHAVE) {
    console.error('STRIPE_SECRET_KEY ausente — nada a conferir.');
    process.exit(2);
}

const aplicar = process.argv.includes('--apply');
const CAMINHO_NOSSO = '/api/webhook/stripe';

const stripe = new Stripe(CHAVE);
const endpoints = await stripe.webhookEndpoints.list({ limit: 50 });

console.log(`Modo: ${CHAVE.startsWith('sk_test') ? 'TESTE' : 'PRODUÇÃO'}`);
console.log(`Eventos suportados pelo código: ${STRIPE_SUPPORTED_EVENTS.length}\n`);

let foraDoPadrao = 0;

for (const ep of endpoints.data) {
    const nosso = (ep.url || '').includes(CAMINHO_NOSSO);
    const atuais = new Set(ep.enabled_events || []);
    const faltando = STRIPE_SUPPORTED_EVENTS.filter((e) => !atuais.has(e));
    const extras = (ep.enabled_events || []).filter((e) => !STRIPE_SUPPORTED_EVENTS.includes(e));

    console.log(`- ${ep.id}`);
    console.log(`  url:    ${ep.url}`);
    console.log(`  status: ${ep.status}`);
    console.log(`  inscritos: ${(ep.enabled_events || []).length}/${STRIPE_SUPPORTED_EVENTS.length}`);
    if (faltando.length) console.log(`  FALTANDO: ${faltando.join(', ')}`);
    if (extras.length) console.log(`  extras (sem handler no código): ${extras.join(', ')}`);

    if (!nosso) {
        console.log('  -> endpoint de outro serviço: NÃO tocado');
        continue;
    }

    if (!faltando.length) {
        console.log('  -> OK: inscrito em todos os eventos suportados');
        continue;
    }

    foraDoPadrao++;
    if (!aplicar) {
        console.log('  -> rode com --apply para corrigir');
        continue;
    }

    const novos = [...new Set([...(ep.enabled_events || []), ...STRIPE_SUPPORTED_EVENTS])];
    const atualizado = await stripe.webhookEndpoints.update(ep.id, { enabled_events: novos });
    console.log(`  -> CORRIGIDO: inscrito em ${atualizado.enabled_events.length} eventos`);
}

if (aplicar && foraDoPadrao) {
    console.log(`\n${foraDoPadrao} endpoint(s) corrigido(s).`);
} else if (!aplicar && foraDoPadrao) {
    console.error(`\n${foraDoPadrao} endpoint(s) do projeto estão com eventos faltando.`);
    process.exit(1);
} else {
    console.log('\nOK — todos os endpoints do projeto estão inscritos nos eventos suportados.');
}
