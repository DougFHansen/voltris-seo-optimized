/**
 * Testes de ESTRUTURA das rotas financeiras (missão §11 e §12).
 *
 * Estes testes leem o código-fonte das rotas e verificam invariantes que
 * quebram silenciosamente quando alguém edita o arquivo: presença dos filtros
 * de propriedade, ausência dos padrões que causavam os bugs originais, e uso
 * das operações corretas da API da Stripe.
 *
 * Não substituem teste de integração contra a Stripe — mas pegam regressão de
 * segurança no mesmo commit em que ela é introduzida, que é o objetivo.
 *
 * Rodar: npm test
 */

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');

function ler(rel: string): string {
    const caminho = join(ROOT, rel);
    assert.ok(existsSync(caminho), `arquivo não encontrado: ${rel}`);
    return readFileSync(caminho, 'utf8');
}

/**
 * Remove comentários antes de procurar padrões PROIBIDOS.
 *
 * Sem isto, o teste que verifica "o código não usa customers.list({ email })"
 * acusaria a própria documentação do arquivo, que cita o padrão antigo para
 * explicar por que ele foi removido. O que importa é o código executável.
 */
function semComentarios(src: string): string {
    return src
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

const INVOICE_ROUTE = ler('app/api/billing/invoice/route.ts');
const INVOICE_LIST_ROUTE = ler('app/api/billing/invoices/route.ts');
const REFUND_ROUTE = ler('app/api/stripe/refund/route.ts');
const CANCEL_ROUTE = ler('app/api/stripe/cancel/route.ts');
const SYNC_ROUTE = ler('app/api/stripe/sync/route.ts');
const PORTAL_ROUTE = ler('app/api/stripe/portal/route.ts');
const CHECKOUT_ROUTE = ler('app/api/stripe/checkout/route.ts');
const WEBHOOK_ROUTE = ler('app/api/webhook/stripe/route.ts');
const DASHBOARD = ler('app/dashboard/DashboardClient.tsx');

describe('§11 — fatura PDF: ninguém fatura a compra de outro cliente', () => {
    test('a sessão Supabase é validada antes de qualquer coisa', () => {
        assert.match(INVOICE_ROUTE, /auth\.getUser\(\)/);
        assert.match(INVOICE_ROUTE, /401/);
    });

    test('a posse é decidida pelo user_id DA SESSÃO, nunca pelo id enviado', () => {
        assert.match(
            INVOICE_ROUTE,
            /\.eq\('id', parsed\.data\.payment_id\)\s*\.eq\('user_id', user\.id\)/,
            'a consulta do PDF precisa filtrar por id E por user_id da sessão'
        );
    });

    test('o payment_id é validado como UUID (sem injeção de filtro no PostgREST)', () => {
        assert.match(INVOICE_ROUTE, /z\.string\(\)\.uuid\(\)/);
    });

    test('compra inexistente devolve 404 sem confirmar a existência para terceiros', () => {
        assert.match(INVOICE_ROUTE, /PAYMENT_NOT_FOUND/);
    });

    test('pagamento não confirmado NÃO gera documento', () => {
        assert.match(INVOICE_ROUTE, /isInvoicable/);
        assert.match(INVOICE_ROUTE, /PAYMENT_NOT_CONFIRMED/);
        assert.match(INVOICE_ROUTE, /409/);
    });

    test('a resposta é anexo privado, sem cache compartilhado', () => {
        assert.match(INVOICE_ROUTE, /Content-Type': 'application\/pdf'/);
        assert.match(INVOICE_ROUTE, /attachment; filename=/);
        assert.match(INVOICE_ROUTE, /Cache-Control': 'private, no-store/);
        assert.match(INVOICE_ROUTE, /X-Content-Type-Options': 'nosniff'/);
    });

    test('a listagem também é filtrada pela sessão', () => {
        assert.match(INVOICE_LIST_ROUTE, /\.eq\('user_id', user\.id\)/);
    });
});

describe('§8 — reembolso: a operação é real, idemNot repeatable, e não é ampla', () => {
    test('o reembolso é executado na API da Stripe (não é só registro local)', () => {
        assert.match(REFUND_ROUTE, /stripe\.refunds\.create\(/);
    });

    test('usa chave de idempotência (clique duplo não devolve duas vezes)', () => {
        assert.match(REFUND_ROUTE, /idempotencyKey/);
        assert.match(REFUND_ROUTE, /voltris-refund-/);
    });

    test('a elegibilidade vem da política publicada, não de um if solto', () => {
        assert.match(REFUND_ROUTE, /evaluateRefund/);
        assert.match(REFUND_ROUTE, /from '@\/lib\/billing-policy'/);
    });

    test('fora da janela o código responde 202 + revisão manual, sem mentir', () => {
        assert.match(REFUND_ROUTE, /202/);
        assert.match(REFUND_ROUTE, /MANUAL_REVIEW/);
    });

    test('NÃO revoga todas as licenças do cliente por e-mail', () => {
        // O código antigo fazia .eq('email', user.email) em licenses (coluna que
        // nem existe) e em subscriptions/payments sem filtro de plano.
        assert.doesNotMatch(semComentarios(REFUND_ROUTE),
            /from\('licenses'\)[\s\S]{0,200}\.eq\('email',\s*user\.email/,
            'revogação por e-mail do cliente continua no código'
        );
        assert.doesNotMatch(semComentarios(REFUND_ROUTE), /\.eq\('email',\s*user\.email!\)/);
    });

    test('a revogação por reembolso é restrita a (user_id, plan_type)', () => {
        assert.match(REFUND_ROUTE, /\.eq\('user_id', payment\.user_id\)/);
        assert.match(REFUND_ROUTE, /\.eq\('plan_type', \(payment\.plan_type \?\? ''\)\.toLowerCase\(\)\)/);
    });

    test('reembolso de renovação NÃO revoga a licença inteira', () => {
        assert.match(REFUND_ROUTE, /const isInitialCharge/);
        assert.match(REFUND_ROUTE, /fullyRefunded && isInitialCharge/);
    });

    test('reembolso também encerra a recorrência (são duas operações distintas)', () => {
        assert.match(REFUND_ROUTE, /stripe\.subscriptions\.cancel\(/);
        assert.match(REFUND_ROUTE, /extractChargeInvoiceId/);
    });

    test('usa o campo atual da API (charge.invoice foi removido)', () => {
        assert.match(REFUND_ROUTE, /from '@\/lib\/billing-state'/);
        assert.doesNotMatch(semComentarios(REFUND_ROUTE), /latestCharge\.invoice\b/);
    });

    test('a cobrança alvo é a escolhida pelo usuário, não "a última da lista"', () => {
        assert.match(REFUND_ROUTE, /payment_id: z\.string\(\)\.uuid\(\)\.optional\(\)/);
    });

    test('a posse da cobrança alvo também é filtrada pela sessão', () => {
        assert.match(
            REFUND_ROUTE,
            /\.eq\('id', paymentId\)\.eq\('user_id', user\.id\)/,
            'sem .eq(user_id) um payment_id de outro cliente seria reembolsado'
        );
    });

    test('rate limit aplicado (não dá para martelar a rota)', () => {
        assert.match(REFUND_ROUTE, /licenseRateGuard/);
        assert.match(REFUND_ROUTE, /rateLimitedResponse/);
    });
});

describe('§7 — cancelamento: operação real, confirmada e persistida', () => {
    test('chama a operação de cancelamento ao fim do período na Stripe', () => {
        assert.match(CANCEL_ROUTE, /stripe\.subscriptions\.update\(/);
        assert.match(CANCEL_ROUTE, /cancel_at_period_end: true/);
    });

    test('não confia no update: relê a resposta da Stripe antes de declarar sucesso', () => {
        assert.match(CANCEL_ROUTE, /updated\.cancel_at_period_end === \(action === 'cancel'\)/);
        assert.match(CANCEL_ROUTE, /STRIPE_NOT_CONFIRMED/);
        assert.match(CANCEL_ROUTE, /502/);
    });

    test('NÃO usa profiles.stripe_customer_id (coluna que não existe no schema)', () => {
        for (const [nome, src] of [['cancel', CANCEL_ROUTE], ['portal', PORTAL_ROUTE], ['refund', REFUND_ROUTE]] as const) {
            assert.doesNotMatch(
                semComentarios(src),
                /from\('profiles'\)[\s\S]{0,160}stripe_customer_id/,
                `${nome} ainda lê coluna inexistente`
            );
        }
    });

    test('NÃO usa e-mail como prova de propriedade', () => {
        for (const [nome, src] of [['cancel', CANCEL_ROUTE], ['portal', PORTAL_ROUTE], ['refund', REFUND_ROUTE]] as const) {
            assert.doesNotMatch(
                semComentarios(src),
                /customers\.list\(\{\s*email/,
                `${nome} ainda identifica o cliente por e-mail`
            );
        }
    });

    test('a assinatura vem de subscriptions.user_id (UUID da sessão)', () => {
        assert.match(CANCEL_ROUTE, /\.from\('subscriptions'\)[\s\S]{0,300}\.eq\('user_id', user\.id\)/);
    });

    test('assinatura de terceiro devolve 404/403 e fica registrada', () => {
        assert.match(CANCEL_ROUTE, /SUBSCRIPTION_NOT_FOUND/);
        assert.match(CANCEL_ROUTE, /OWNERSHIP_MISMATCH/);
        assert.match(CANCEL_ROUTE, /assinatura de terceiro/);
    });

    test('grava o espelho local depois de confirmar na Stripe', () => {
        assert.match(CANCEL_ROUTE, /syncSubscriptionRow\(/);
    });

    test('devolve até quando o acesso continua (informação que o cliente tem direito)', () => {
        assert.match(CANCEL_ROUTE, /accessUntil/);
    });

    test('estado já aplicado é idempotente, sem chamar a Stripe de novo', () => {
        assert.match(CANCEL_ROUTE, /alreadyApplied/);
    });

    test('existe operação de REATIVAÇÃO quando a assinatura é elegível', () => {
        assert.match(CANCEL_ROUTE, /cancel_at_period_end: false/);
        assert.match(CANCEL_ROUTE, /'resume'/);
    });
});

describe('§9 — sincronizar agora reconcilia com a Stripe (não relê o banco)', () => {
    test('consulta a assinatura NA Stripe', () => {
        assert.match(SYNC_ROUTE, /stripe\.subscriptions\.retrieve\(/);
        assert.match(SYNC_ROUTE, /stripe\.invoices\.list\(/);
    });

    test('apenas assinaturas do próprio usuário', () => {
        assert.match(SYNC_ROUTE, /\.eq\('user_id', user\.id\)/);
    });

    test('sucesso só depois de reconciliar tudo', () => {
        assert.match(SYNC_ROUTE, /syncSubscriptionRow\(/);
    });

    test('parcial devolve ok:false (não é 200 falso)', () => {
        assert.match(SYNC_ROUTE, /ok: problems\.length === 0/);
    });

    test('rate limit (não pode ser usado para martelar a Stripe)', () => {
        assert.match(SYNC_ROUTE, /licenseRateGuard\('sync'/);
    });

    test('não muda status de pagamento (prova é do webhook, não do sync)', () => {
        assert.doesNotMatch(semComentarios(SYNC_ROUTE), /update\(\{[^}]*status:\s*'approved'/);
    });
});

describe('§3 — checkout: assinatura recorrente real e consentimento informado', () => {
    test('cria/reutiliza o Stripe Customer e persiste o cus_', () => {
        assert.match(CHECKOUT_ROUTE, /resolveOrCreateCustomer/);
        assert.match(CHECKOUT_ROUTE, /stripe_customer_id: customerId/);
        assert.match(CHECKOUT_ROUTE, /customer: customerId/);
    });

    test('modo subscription para licença e payment para serviço', () => {
        assert.match(CHECKOUT_ROUTE, /const mode = isLicense \? 'subscription' : 'payment'/);
        assert.match(CHECKOUT_ROUTE, /recurring: \{ interval: product!\.period \}/);
    });

    test('os metadados da assinatura carregam a vínculo (eventos fora de ordem)', () => {
        assert.match(CHECKOUT_ROUTE, /subscription_data: \{ metadata: subscriptionMetadata \}/);
        assert.match(CHECKOUT_ROUTE, /client_reference_id: referenceId/);
    });

    test('o preço NUNCA vem do corpo do navegador', () => {
        assert.match(CHECKOUT_ROUTE, /resolveLicenseProduct/);
        assert.doesNotMatch(semComentarios(CHECKOUT_ROUTE), /body\.amount/);
        assert.doesNotMatch(semComentarios(CHECKOUT_ROUTE), /body\.price/);
    });

    test('as condições de renovação são mostradas ANTES do pagamento', () => {
        assert.match(CHECKOUT_ROUTE, /custom_text: \{ submit: \{ message: RENEWAL_DISCLOSURE \} \}/);
        assert.match(CHECKOUT_ROUTE, /7 dias corridos/);
        assert.match(CHECKOUT_ROUTE, /cancelar a renovação a qualquer momento/);
    });

    test('a identidade vem da sessão, não do body', () => {
        assert.match(CHECKOUT_ROUTE, /const email = user\.email!/);
        assert.doesNotMatch(semComentarios(CHECKOUT_ROUTE), /const email = body\./);
        assert.doesNotMatch(semComentarios(CHECKOUT_ROUTE), /user_id: body\./);
    });
});

describe('§10 — webhook: idempotência, cobertura de eventos e nada de 200 falso', () => {
    test('a assinatura do webhook é validada', () => {
        assert.match(WEBHOOK_ROUTE, /stripe\.webhooks\.constructEvent/);
        assert.match(WEBHOOK_ROUTE, /STRIPE_WEBHOOK_SECRET/);
    });

    test('idempotência persistente por event.id', () => {
        assert.match(WEBHOOK_ROUTE, /stripe_event_log/);
        assert.match(WEBHOOK_ROUTE, /23505/);
        assert.match(WEBHOOK_ROUTE, /duplicate/);
    });

    test('falha de processamento devolve 500 (permite retry da Stripe)', () => {
        assert.match(WEBHOOK_ROUTE, /PROCESSING_FAILED/);
        assert.match(WEBHOOK_ROUTE, /status: 500/);
    });

    test('cobre TODOS os eventos necessários para o ciclo de faturamento', () => {
        const obrigatorios = [
            'checkout.session.completed',
            'checkout.session.async_payment_succeeded',
            'checkout.session.async_payment_failed',
            'invoice.paid',
            'invoice.payment_failed',
            'customer.subscription.created',
            'customer.subscription.updated',
            'customer.subscription.deleted',
            'charge.refunded',
            'refund.updated',
        ];
        for (const evento of obrigatorios) {
            assert.match(WEBHOOK_ROUTE, new RegExp(evento.replace('.', '\\.')), `evento ausente: ${evento}`);
        }
    });

    test('a lista de eventos suportados está num módulo conferível (não na rota)', () => {
        // O Next.js só permite exportar handlers de um arquivo de rota; por isso
        // a lista vive em lib/stripe-events.ts, onde dá para testá-la e imprimi-la
        // no checklist de conferência do painel.
        const EVENTS = ler('lib/stripe-events.ts');
        assert.match(EVENTS, /export const STRIPE_SUPPORTED_EVENTS/);
        assert.match(WEBHOOK_ROUTE, /from '@\/lib\/stripe-events'/);
        assert.doesNotMatch(
            semComentarios(WEBHOOK_ROUTE),
            /export const [A-Z_]+ = \[/,
            'a rota não deve exportar constantes arbitrárias'
        );
    });

    test('invoice.payment_failed NÃO revoga o período já pago', () => {
        const bloco = WEBHOOK_ROUTE.slice(
            WEBHOOK_ROUTE.indexOf('async function handleInvoicePaymentFailed'),
            WEBHOOK_ROUTE.indexOf('// Sincronizacao de estado da assinatura')
        );
        assert.ok(bloco.length > 0);
        assert.doesNotMatch(semComentarios(bloco), /from\('licenses'\)[\s\S]{0,200}revoked: true/);
    });

    test('só emite licença com payment_status paid', () => {
        assert.match(WEBHOOK_ROUTE, /session\.payment_status !== 'paid'/);
    });

    test('a renovação usa o período AUTORITATIVO da Stripe', () => {
        assert.match(WEBHOOK_ROUTE, /p_period_end: periodEnd/);
        assert.match(WEBHOOK_ROUTE, /renew_subscription_license/);
    });

    test('grava next_billing_at e cancel_at_period_end (causa raiz do bug de renovação)', () => {
        assert.match(WEBHOOK_ROUTE, /syncSubscriptionRow\(/);
        const SYNC = ler('lib/stripe-sync.ts');
        assert.match(SYNC, /next_billing_at: nextBillingAt/);
        assert.match(SYNC, /cancel_at_period_end: snapshot\.cancelAtPeriodEnd/);
    });

    test('cancelamento confirmado não é sobrescrito por sincronização', () => {
        const SYNC = ler('lib/stripe-sync.ts');
        assert.match(SYNC, /canceled_at[\s\S]{0,200}existing\?\.canceled_at/);
    });
});

describe('§5 — o painel não promete o que o backend não entrega', () => {
    test('o botão "Gerenciar no Portal Stripe" saiu do cartão de licença', () => {
        assert.doesNotMatch(semComentarios(DASHBOARD),
            />\s*Gerenciar no Portal Stripe/,
            'o botão do Portal ainda está no cartão de licença'
        );
    });

    test('existe "Baixar Fatura (PDF)" no cartão de licença', () => {
        assert.match(DASHBOARD, /Baixar Fatura \(PDF\)/);
    });

    test('a mensagem "Verificando pagamento com a Stripe…" saiu do rodapé', () => {
        assert.doesNotMatch(semComentarios(DASHBOARD),
            /'Verificando pagamento com a Stripe/,
            'a mensagem de carregamento antiga ainda está no rodapé'
        );
    });

    test('o download tem timeout explícito (nunca carregamento infinito)', () => {
        assert.match(DASHBOARD, /AbortController/);
        assert.match(DASHBOARD, /INVOICE_TIMEOUT_MS/);
    });

    test('o download tem tratamento de erro e nova tentativa', () => {
        assert.match(DASHBOARD, /Não foi possível preparar a fatura\. Tentar novamente\./);
        assert.match(DASHBOARD, /Baixar novamente/);
    });

    test('os estados do documento são os textos verdadeiros exigidos', () => {
        assert.match(DASHBOARD, /Preparando sua fatura/);
        assert.match(DASHBOARD, /Fatura disponível para download\./);
        assert.match(DASHBOARD, /Fatura indisponível: aguardando confirmação do pagamento\./);
    });

    test('"Sincronizar Agora" chama a rota de sincronização real', () => {
        assert.match(DASHBOARD, /\/api\/stripe\/sync/);
    });

    test('o reembolso NÃO usa window.confirm (modal profissional, §7/§8)', () => {
        assert.doesNotMatch(semComentarios(DASHBOARD), /window\.confirm\(/);
        assert.match(DASHBOARD, /Solicitar reembolso/);
    });

    test('o modal de cancelamento informa o fim do acesso', () => {
        assert.match(DASHBOARD, /Acesso até/);
    });
});