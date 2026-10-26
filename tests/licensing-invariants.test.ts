/**
 * Invariantes do ciclo de licenciamento no SITE (missões §2, §4, §5, §7, §9, §12).
 *
 * Estes testes leem o código real do repositório e falham se alguém reintroduzir
 * as vulnerabilidades que foram corrigidas: preço vindo do navegador, webhook sem
 * idempotência, renovação "agora + intervalo", service_role no cliente, rota de
 * licença sem rate limit ou segredo/chave completa em log.
 *
 * Rodar: npm test
 */

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const read = (...parts: string[]) => readFileSync(path.join(ROOT, ...parts), 'utf8');

/** Walk `.ts`/`.tsx` dentro de uma pasta do repo. */
function sourcesIn(dir: string): string[] {
    const out: string[] = [];
    const walk = (d: string) => {
        for (const entry of readdirSync(d, { withFileTypes: true })) {
            const full = path.join(d, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (/\.tsx?$/.test(entry.name)) out.push(full);
        }
    };
    if (existsSync(dir)) walk(dir);
    return out;
}

const rel = (p: string) => path.relative(ROOT, p).split(path.sep).join('/');

/** Só linhas de CÓDIGO: um comentário descrevendo a arquitetura não é vazamento. */
function codeOnly(src: string): string {
    return src
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith('//') && !l.startsWith('/*') && !l.startsWith('*'))
        .join('\n');
}

describe('§2 — preço/plano/dispositivos são autoridade do servidor', () => {
    const checkout = read('app', 'api', 'stripe', 'checkout', 'route.ts');

    test('checkout valida (plano, período) pelo catálogo canônico', () => {
        assert.match(checkout, /resolveLicenseProduct\(/, 'checkout deveria usar o catálogo');
        assert.match(checkout, /from '@\/lib\/license-catalog'/, 'checkout deveria importar o catálogo');
    });

    test('checkout NÃO lê preço/valor do corpo da requisição', () => {
        assert.doesNotMatch(checkout, /body\.amount/, 'preço vindo do navegador');
        assert.doesNotMatch(checkout, /body\.price/i, 'preço vindo do navegador');
        assert.doesNotMatch(checkout, /unit_amount:\s*(?:body|price)/, 'unit_amount do cliente');
        assert.match(checkout, /unit_amount:\s*Math\.round\(amount \* 100\)/, 'unit_amount deveria vir do catálogo');
    });

    test('identidade (email/user) vem da sessão, não do navegador', () => {
        assert.match(checkout, /auth\.getUser\(\)/, 'checkout deveria exigir sessão');
        assert.match(checkout, /customer_email:\s*email/, 'email do checkout deveria vir da sessão');
    });

    test('limite de dispositivos do plano está no catálogo (1 / 3 / 9999)', () => {
        const catalog = read('lib', 'license-catalog.ts');
        assert.match(catalog, /standard:\s*\{\s*code: 'STA',\s*maxDevices: 1/);
        assert.match(catalog, /pro:\s*\{\s*code: 'PRO',\s*maxDevices: 3/);
        assert.match(catalog, /enterprise:\s*\{\s*code: 'ENT',\s*maxDevices: 9999/);
    });
});

describe('§4 — webhook idempotente, completo e sem 200 falso', () => {
    const webhook = read('app', 'api', 'webhook', 'stripe', 'route.ts');

    test('todos os eventos do ciclo são tratados', () => {
        const required = [
            'checkout.session.completed',
            'checkout.session.async_payment_succeeded',
            'checkout.session.async_payment_failed',
            'invoice.paid',
            'invoice.payment_failed',
            'customer.subscription.created',
            'customer.subscription.updated',
            'customer.subscription.deleted',
        ];
        for (const ev of required) {
            assert.ok(webhook.includes(`'${ev}'`), `evento ${ev} não tratado no webhook`);
        }
    });

    test('assinatura do webhook é verificada antes de processar', () => {
        assert.match(webhook, /constructEvent\(/, 'sem verificação de assinatura do Stripe');
        assert.match(webhook, /STRIPE_WEBHOOK_SECRET/, 'sem segredo do webhook');
    });

    test('idempotência persistida por event.id (stripe_event_log)', () => {
        assert.match(webhook, /stripe_event_log/, 'sem log persistente de eventos');
        assert.match(webhook, /23505/, 'sem tratamento de chave duplicada');
        assert.match(webhook, /duplicate/, 'sem caminho de evento duplicado');
    });

    test('falha de processamento devolve 500 (nunca 200 falso)', () => {
        assert.match(webhook, /status:\s*500|\{\s*status:\s*500\s*\}|'PROCESSING_FAILED'[\s\S]{0,120}500/, 'erro deveria virar retry da Stripe');
        assert.match(webhook, /finishEvent\(supabase, event\.id, 'error'/, 'evento deveria ficar marcado como error para retry');
    });

    test('licença só é emitida com prova de liquidação', () => {
        assert.match(webhook, /payment_status !== 'paid'/, 'deveria barrar emissão sem pagamento aprovado');
        assert.match(webhook, /generate_complete_license_v3/, 'deveria emitir pela RPC canônica');
    });

    test('falha de cobrança NÃO revoga (período já pago é respeitado)', () => {
        assert.match(webhook, /PAST_DUE/, 'deveria marcar PAST_DUE em vez de revogar');
    });
});

describe('§7 — renovação usa o período AUTORITATIVO da Stripe', () => {
    const webhook = read('app', 'api', 'webhook', 'stripe', 'route.ts');

    test('a data nova vem do period.end da invoice', () => {
        assert.match(webhook, /period\?\.end|period\.end/, 'renovação deveria ler o período da invoice');
    });

    test('nada de "agora + intervalo" no caminho de renovação', () => {
        assert.doesNotMatch(webhook, /AddMonths|addMonths\(/, 'renovação aritmética no cliente do Stripe');
        assert.doesNotMatch(webhook, /new Date\(.{0,40}\)\s*\+\s*\d+\s*\*\s*86_?400_?000.{0,40}(renew|expires)/i,
            'expiração calculada por arithmetic local');
    });

    test('a data autoritativa entra na emissão por parâmetro (não é inventada)', () => {
        const renewal = read('SQLCOMPLETO.sql');
        const emitter = read('SQLCOMPLETO.sql');
        assert.match(emitter, /p_valid_until\s+date/i,
            'a RPC canônica de emissão deveria receber a data autoritativa como parâmetro');
        assert.match(renewal, /generate_complete_license_v3\([\s\S]{0,400}?date\(p_period_end\)/i,
            'a renovação deveria repassar date(p_period_end) da Stripe à emissão');
        assert.match(renewal, /COALESCE\(\s*\n?\s*p_period_end,/i,
            'o period_end da Stripe deveria ter prioridade sobre qualquer cálculo local');
        assert.doesNotMatch(renewal, /expires_at\s*=\s*NOW\(\)\s*\+\s*interval/i,
            'a renovação não deveria calcular expiração no banco');
    });
});

describe('§9 — segredos, service_role e rate limit', () => {
    test('service_role nunca aparece em CÓDIGO de cliente ("use client")', () => {
        const offenders = sourcesIn(path.join(ROOT, 'app'))
            .concat(sourcesIn(path.join(ROOT, 'components')))
            .filter((f) => {
                const src = readFileSync(f, 'utf8');
                if (!/['"]use client['"]/.test(src)) return false;
                // (1) forma de credencial: proibida até dentro de comentário/string.
                if (/SERVICE_ROLE_KEY|serviceRoleKey|service_role_key/.test(src)) return true;
                if (/(?:create|get)\w*Client\s*\([\s\S]{0,160}service_role/i.test(src)) return true;
                // (2) menção em código real = uso indevido.
                return /service_role/i.test(codeOnly(src));
            })
            .map(rel);
        assert.deepEqual(offenders, [], `service_role em client component: ${offenders.join(', ')}`);
    });

    test('não existe NEXT_PUBLIC_*SERVICE_ROLE (chave administrativa jamais pública)', () => {
        const offenders = sourcesIn(path.join(ROOT, 'app'))
            .concat(sourcesIn(path.join(ROOT, 'lib'))).concat(sourcesIn(path.join(ROOT, 'utils')))
            .filter((f) => /NEXT_PUBLIC_[A-Z_]*SERVICE_ROLE/i.test(readFileSync(f, 'utf8')))
            .map(rel);
        assert.deepEqual(offenders, [], `variável pública de service_role: ${offenders.join(', ')}`);
    });

    test('rotas de licença voltadas ao app têm rate limit (proteção contra força bruta)', () => {
        const routes = ['activate', 'validate', 'deactivate', 'sync', 'info', 'renewal'];
        for (const r of routes) {
            const f = path.join(ROOT, 'app', 'api', 'v1', 'license', r, 'route.ts');
            assert.ok(existsSync(f), `rota ${r} desapareceu`);
            const src = readFileSync(f, 'utf8');
            assert.match(
                src,
                /license-rate-guard|checkRateLimit/,
                `/api/v1/license/${r} deveria aplicar rate limit (missão §9)`
            );
        }
    });

    test('nenhum log imprime chave de licença ou segredo por extenso', () => {
        const files = sourcesIn(path.join(ROOT, 'app', 'api'))
            .concat(sourcesIn(path.join(ROOT, 'lib')))
            .filter((f) => !f.includes(`${path.sep}tests${path.sep}`));

        for (const f of files) {
            const src = readFileSync(f, 'utf8');
            const bad = src
                .split('\n')
                .filter((l) => /console\.(log|warn|error)|logInfo|logSuccess|logWarn|logError/.test(l))
                .filter((l) => /\$\{licenseKey\}|\$\{fullKey\}|license_key:\s*license_key\b|SERVICE_ROLE_KEY\s*\)/.test(l)
                    && !/slice\(|mask|\.\.\.|SECRET_[A-Z]+\s*\)/.test(l));
            assert.deepEqual(bad, [], `vazamento em ${rel(f)}:\n${bad.join('\n')}`);
        }
    });

    test('o segredo legado não foi copiado para o código do painel', () => {
        const offenders = sourcesIn(path.join(ROOT, 'app'))
            .concat(sourcesIn(path.join(ROOT, 'lib')))
            .filter((f) => /VOLTRIS_SECRET_LICENSE_KEY_2025/.test(readFileSync(f, 'utf8')))
            .map(rel);
        assert.deepEqual(offenders, [], 'segredo hard-coded no painel: ' + offenders.join(', '));
    });
});

describe('§6/§12 — painel consome o estado canônico do servidor', () => {
    const dash = read('app', 'dashboard', 'DashboardClient.tsx');
    const me = read('app', 'api', 'v1', 'license', 'me', 'route.ts');

    test('painel lê a rota canônica em vez de consultar licenses direto', () => {
        assert.match(dash, /fetch\('\/api\/v1\/license\/me'/, 'painel deveria usar a rota canônica');
        assert.doesNotMatch(dash, /supabase\.from\('licenses'\)/, 'painel não deve consultar licenses no cliente');
    });

    test('os 6 estados têm estilo e os seis rótulos chegam do servidor', () => {
        for (const state of ['ATIVA', 'PAGAMENTO_PENDENTE', 'FALHA_NO_PAGAMENTO', 'CANCELAMENTO_AGENDADO', 'EXPIRADA', 'REVOGADA']) {
            assert.ok(dash.includes(`${state}:`), `estado ${state} sem representação no painel`);
        }
        for (const field of ['state', 'stateLabel', 'hasAccess', 'expiringSoon', 'daysLeft', 'billingPeriodLabel', 'activatedAt', 'devicesInUse', 'maxDevices', 'paymentStatus', 'subscriptionStatus', 'nextBillingAt', 'canceledAt']) {
            assert.ok(me.includes(field), `rota /me não expõe ${field}`);
        }
    });

    test('painel não usa mais o badge binário Ativa/Expirada', () => {
        assert.doesNotMatch(dash, /isActive \? 'Ativa' : 'Expirada'/, 'badge binário voltou (missão §6)');
        assert.match(dash, /lic\.stateLabel/, 'painel deveria exibir o estado canônico');
    });

    test('polling tem limite de tentativas (não roda para sempre)', () => {
        assert.match(dash, /LICENSE_POLL_MAX_ATTEMPTS\s*=\s*\d+/, 'sem teto de tentativas');
        assert.match(dash, /LICENSE_POLL_INTERVAL_MS\s*=\s*\d+/, 'sem intervalo definido');
        assert.match(dash, /attempts > LICENSE_POLL_MAX_ATTEMPTS/, 'sem corte do polling');
    });

    test('chave de licença é mascarada por padrão no painel', () => {
        assert.match(dash, /maskLicenseKey/, 'painel deveria mascarar a chave');
        assert.match(dash, /revealed \? lic\.license_key : maskLicenseKey/, 'chave integral não deveria ser o padrão');
    });

    test('rota /me reporta pagamentos pendentes e tempo do servidor', () => {
        assert.match(me, /pendingPurchases/, 'sem lista de compras pendentes');
        assert.match(me, /hasPending/, 'sem flag de pendência (polling limitado)');
        assert.match(me, /server_time/, 'sem carimbo do servidor');
    });
});

describe('§5 — sem endpoints mortos', () => {
    test('nenhum chamador no painel aponta para as Edge Functions mortas', () => {
        const offenders = sourcesIn(path.join(ROOT, 'app'))
            .concat(sourcesIn(path.join(ROOT, 'lib')))
            .filter((f) => /functions\/v1\/(validate-license|activate-license)/.test(readFileSync(f, 'utf8')))
            .map(rel);
        assert.deepEqual(offenders, [], 'chamada para função Edge inexistente: ' + offenders.join(', '));
    });
});

describe('§10 — reconciliação dos pendentes só age com prova', () => {
    const route = read('app', 'api', 'admin', 'reconcile', 'route.ts');

    test('rota existe e é gated por admin (profiles.is_admin)', () => {
        assert.ok(existsSync(path.join(ROOT, 'app', 'api', 'admin', 'reconcile', 'route.ts')), 'rota de reconciliação desapareceu');
        assert.match(route, /is_admin/, 'reconciliação sem gate de admin');
        assert.match(route, /FORBIDDEN/, 'gate deveria responder 403 para não-admin');
    });

    test('dry-run é o padrão e apply exige frase literal de confirmação', () => {
        assert.match(route, /RECONCILE-APPLY/, 'apply sem frase de confirmação');
        assert.match(route, /body\.apply === true/, 'apply não deveria ser inferido de qualquer boolean');
        assert.match(route, /mode: apply \? \('apply' as const\) : \('dry_run' as const\)/, 'resumo deveria declarar o modo');
    });

    test('sem prova na Stripe o caso é NEEDS_MANUAL — nunca "não pago"', () => {
        const noProof = /if \(!base\.stripe\.found\) \{[\s\S]{0,900}?\}/.exec(route);
        assert.ok(noProof, 'bloco de "sem match na Stripe" não encontrado');
        assert.match(noProof![0], /NEEDS_MANUAL/, 'sem prova deveria ser NEEDS_MANUAL');
        assert.doesNotMatch(noProof![0], /MARK_UNPAID/, 'sem prova NÃO pode marcar como não pago (perde acesso de quem pagou)');
    });

    test('junção por e-mail só vale quando é única (não chuta dono)', () => {
        assert.match(route, /byEmail/, 'índice por e-mail sumiu');
        assert.match(route, /matches\.length === 1/, 'deveria exigir sessão única para atribuir por e-mail');
        assert.match(route, /emailAmbiguous/, 'múltiplas sessões do mesmo e-mail deveriam virar revisão humana');
    });

    test('aplicação usa a RPC canônica e falha devolve 500 (sem 200 falso)', () => {
        assert.match(route, /generate_complete_license_v3/, 'reconciliação deveria emitir pela RPC canônica');
        assert.match(route, /failed: errors\.length/, 'parcialmente aplicado deveria reportar contagem de falhas');
        assert.match(route, /jsonWithCorrelation\(ctx, \{ \.\.\.payload, failed: errors\.length \}, 500\)/, 'apply com erro não pode retornar 2xx');
    });
});
