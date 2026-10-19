/**
 * Testes dos TEMPLATES DE E-MAIL (missão §5, §6, §9 e §15).
 *
 * Aqui o que se verifica não é "a string contém X", são as PROPRIEDADES que a
 * missão exige e que uma alteração futura quebraria sem ninguém perceber:
 *
 *  - compatibilidade de cliente (tabelas, sem degradê sem fallback);
 *  - formatação brasileira de dinheiro e data (o defeito antigo era "R$ 15.00");
 *  - ausência de promessa falsa: e-mail de solicitação de reembolso NÃO pode
 *    dizer que o dinheiro foi devolvido, e o de falha de pagamento NÃO pode
 *    prometer revogação;
 *  - escape de dado do cliente — nome com `<script>` precisa virar texto;
 *  - identidade visual escura da marca.
 */

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';

import {
    escapeHtml,
    getEmailContext,
    renderPurchaseEmail,
    renderRenewalEmail,
    renderCancellationEmail,
    renderRefundEmail,
    renderPaymentFailedEmail,
    type PurchaseEmailData,
    type RenewalEmailData,
    type CancellationEmailData,
    type RefundEmailData,
    type PaymentFailedEmailData,
} from '../lib/email-templates.ts';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const COMPRA: PurchaseEmailData = {
    customerName: 'Douglas Felipe Becker',
    planName: 'VOLTRIS PRO',
    billingLabel: 'Mensal',
    amountPaid: 15,
    currency: 'BRL',
    purchasedAt: '2026-10-19T12:30:00.000Z',
    periodEnd: '2026-11-19T12:30:00.000Z',
    licenseKey: 'VOLT-AAAA-BBBB-CCCC-DDDD',
    maxDevices: 3,
    devicesInUse: 1,
    purchaseId: 'pay_123',
    stripeReference: 'pi_123',
    hasInvoiceAttachment: true,
};

const RENOVACAO: RenewalEmailData = {
    customerName: 'Douglas Felipe Becker',
    planName: 'VOLTRIS PRO',
    billingLabel: 'Mensal',
    amountPaid: 15,
    currency: 'BRL',
    chargedAt: '2026-11-19T12:30:00.000Z',
    periodStart: '2026-11-19T12:30:00.000Z',
    periodEnd: '2026-12-19T12:30:00.000Z',
    licenseExpiresAt: '2026-12-19T12:30:00.000Z',
    nextBillingAt: '2026-12-19T12:30:00.000Z',
    renewalEnabled: true,
    purchaseId: 'pay_456',
    hasInvoiceAttachment: true,
};

const CANCELAMENTO: CancellationEmailData = {
    customerName: 'Douglas Felipe Becker',
    planName: 'VOLTRIS PRO',
    accessUntil: '2026-12-19T12:30:00.000Z',
    renewalOnly: true,
    canResume: true,
    subscriptionId: 'sub_123',
};

const REEMBOLSO_BASE: RefundEmailData = {
    customerName: 'Douglas Felipe Becker',
    stage: 'confirmed',
    planName: 'VOLTRIS PRO',
    amount: 15,
    currency: 'BRL',
    purchaseId: 'pay_123',
    refundId: 're_123',
    requestedAt: '2026-10-19T12:00:00.000Z',
    resolvedAt: '2026-10-19T12:05:00.000Z',
};

const FALHA: PaymentFailedEmailData = {
    customerName: 'Douglas Felipe Becker',
    planName: 'VOLTRIS PRO',
    amount: 15,
    currency: 'BRL',
    attemptedAt: '2026-12-19T12:30:00.000Z',
    accessUntil: '2026-12-19T12:30:00.000Z',
    subscriptionId: 'sub_123',
};

// ===========================================================================
// Escape — dado do cliente nunca vira HTML executável
// ===========================================================================

describe('escapeHtml', () => {
    test('escapa as cinco entidades HTML', () => {
        assert.equal(
            escapeHtml('<script>alert("x")</script>'),
            '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;'
        );
        assert.equal(escapeHtml("'aspas'"), '&#39;aspas&#39;');
        assert.equal(escapeHtml('a & b'), 'a &amp; b');
    });

    test('trata null/undefined como string vazia', () => {
        assert.equal(escapeHtml(null), '');
        assert.equal(escapeHtml(undefined), '');
    });

    test('preserva acentos pt-BR', () => {
        assert.equal(escapeHtml('Renovação —não há multa'), 'Renovação —não há multa');
    });
});

describe('escapeHtml aplicado ao nome do cliente', () => {
    test('nome com HTML não é interpretado pelo cliente de e-mail', () => {
        const email = renderPurchaseEmail({ ...COMPRA, customerName: '<b>Ana</b>' });
        assert.equal(email.html.includes('<b>Ana</b>'), false);
        assert.ok(email.html.includes('&lt;b&gt;Ana&lt;/b&gt;'));
    });
});

// ===========================================================================
// Envelope — base de todos os e-mails
// ===========================================================================

describe('envelope comum a todos os e-mails', () => {
    const todas = [
        renderPurchaseEmail(COMPRA),
        renderRenewalEmail(RENOVACAO),
        renderCancellationEmail(CANCELAMENTO),
        renderRefundEmail(REEMBOLSO_BASE),
        renderPaymentFailedEmail(FALHA),
    ];

    test('declara idioma, charset e viewport', () => {
        for (const e of todas) {
            assert.ok(e.html.startsWith('<!DOCTYPE html>'), 'falta DOCTYPE');
            assert.ok(e.html.includes('lang="pt-BR"'), 'falta lang pt-BR');
            assert.ok(e.html.includes('<meta charset="utf-8">'), 'falta charset');
            assert.ok(e.html.includes('width=device-width'), 'falta viewport');
        }
    });

    test('tem versão em texto puro sempre', () => {
        for (const e of todas) {
            assert.ok(e.text.length > 80, 'texto puro curto demais para ser útil');
            assert.equal(e.text.includes('<'), false, 'o texto puro não deve conter HTML');
        }
    });

    test('não deixaStylesheet nem script dentro do corpo', () => {
        // Script em e-mail é bloqueado pela maioria dos clientes e é o vetor
        // clássico de rastreamento não autorizado.
        for (const e of todas) {
            assert.equal(/<script/i.test(e.html), false, 'há <script> no e-mail');
        }
    });

    test('não usa emoji no assunto (renderiza como lixo em vários clientes)', () => {
        for (const e of todas) {
            assert.ok(
                !/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(e.subject),
                `assunto com emoji: ${e.subject}`
            );
        }
    });

    test('todo link é absoluto (nada de caminho relativo quebrado)', () => {
        for (const e of todas) {
            const hrefs = [...e.html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
            for (const h of hrefs) {
                assert.ok(
                    h.startsWith('https://') || h.startsWith('mailto:'),
                    `link relativo ou perigoso: ${h}`
                );
            }
        }
    });

    test('o botão tem alternativa em texto (clientes que ignoram CSS)', () => {
        const e = renderPurchaseEmail(COMPRA);
        assert.ok(
            e.html.includes('Acessar meu Dashboard'),
            'falta o texto do botão'
        );
    });
});

// ===========================================================================
// Compatibilidade de cliente de e-mail (missão §5)
// ===========================================================================

describe('compatibilidade com Outlook e Gmail', () => {
    const email = renderPurchaseEmail(COMPRA);

    test('layout é feito com <table role="presentation">', () => {
        assert.ok(email.html.includes('role="presentation"'));
        assert.equal(
            /display\s*:\s*(flex|grid)/i.test(email.html),
            false,
            'flex/grid não é suportado em Outlook'
        );
    });

    test('degradê tem cor sólida de reserva (sem isso o Outlook mostra branco)', () => {
        // Todo elemento com `background-image` precisa ter `background-color`.
        const comGradiente = [...email.html.matchAll(/<td[^>]*background-image[^>]*>/g)];
        assert.ok(comGradiente.length > 0, 'esperado ao menos um degradê de marca');
        for (const m of comGradiente) {
            assert.ok(
                m[0].includes('background-color'),
                `degradê sem fallback sólido: ${m[0].slice(0, 120)}`
            );
        }
    });

    test('não aplica border-radius em <td>/<tr> (é ignorado silenciosamente)', () => {
        const celulas = [...email.html.matchAll(/<t[dr][^>]*style="[^"]*border-radius[^"]*"/g)];
        assert.equal(celulas.length, 0, 'border-radius em célula de tabela é ignorado por vários clientes');
    });

    test('declara fallback de cor para modo claro', () => {
        assert.ok(email.html.includes('color-scheme'));
        assert.ok(email.html.includes('prefers-color-scheme'));
    });

    test('tem media query para telas estreitas', () => {
        assert.ok(email.html.includes('@media only screen and (max-width:620px)'));
    });
});

// ===========================================================================
// Identidade visual escura (missão §5)
// ===========================================================================

describe('identidade visual VOLTRIS', () => {
    const email = renderPurchaseEmail(COMPRA);

    test('usa base escura, não clara', () => {
        assert.ok(email.html.includes('#08080c'), 'fundo escuro da marca ausente');
    });

    test('usa as cores da marca', () => {
        for (const cor of ['#FF4B6B', '#8B31FF', '#31A8FF']) {
            assert.ok(email.html.includes(cor), `cor da marca ausente: ${cor}`);
        }
    });

    test('mostra a marca VOLTRIS', () => {
        assert.ok(email.html.includes('VOLTRIS'));
    });
});

// ===========================================================================
// Valores — formatação brasileira (o defeito antigo era "R$ 15.00")
// ===========================================================================

describe('formatação de dinheiro e data em pt-BR', () => {
    test('o valor usa vírgula decimal e prefixo de real', () => {
        const email = renderPurchaseEmail(COMPRA);
        assert.ok(email.html.includes('R$'), 'faltou o prefixo R$');
        assert.equal(
            /R\$\s*15\.00/.test(email.html),
            false,
            'valor com separador decimal americano'
        );
    });

    test('a versão em texto também usa vírgula', () => {
        const email = renderPurchaseEmail(COMPRA);
        assert.equal(/R\$\s*15\.00/.test(email.text), false);
        assert.ok(email.text.includes('R$'));
    });

    test('datas aparecem no formato brasileiro', () => {
        const email = renderPurchaseEmail(COMPRA);
        // 19/10/2026 em algum dos formatos de data BR.
        assert.ok(
            /19\/10\/2026|19 de outubro de 2026/i.test(email.html),
            'data não encontrada no formato esperado'
        );
    });

    test('a chave da licença aparece em monoespaçada para evitar erro de digitação', () => {
        const email = renderPurchaseEmail(COMPRA);
        assert.ok(email.html.includes(COMPRA.licenseKey!));
        assert.ok(email.html.toLowerCase().includes("font-family:'sfmono-regular'"));
    });
});

// ===========================================================================
// 1. Compra confirmada (FASE 4)
// ===========================================================================

describe('e-mail de compra confirmada', () => {
    const email = renderPurchaseEmail(COMPRA);

    test('entrega a chave e o valor pago', () => {
        assert.ok(email.html.includes(COMPRA.licenseKey!));
        assert.ok(email.text.includes(COMPRA.licenseKey!));
    });

    test('avisa que a fatura em PDF está anexada', () => {
        assert.ok(email.html.toLowerCase().includes('anexad'));
    });

    test('explica a renovação automática e como desligá-la', () => {
        assert.ok(email.text.toLowerCase().includes('renovada automaticamente'));
        assert.ok(email.text.toLowerCase().includes('sem multa'));
    });

    test('saúda pelo primeiro nome', () => {
        assert.ok(email.text.includes('Douglas'));
        assert.equal(email.text.includes('Douglas Felipe Becker'), false);
    });

    test('sem chave de licença, diz onde encontrá-la em vez de mostrar vazio', () => {
        const semChave = renderPurchaseEmail({ ...COMPRA, licenseKey: null });
        assert.ok(semChave.html.includes('disponível no seu painel'));
        assert.equal(semChave.html.includes('undefined'), false);
    });

    test('sem nome do cliente, a saudação não quebra', () => {
        const semNome = renderPurchaseEmail({ ...COMPRA, customerName: null });
        assert.ok(semNome.text.startsWith('Olá.'));
        assert.equal(semNome.html.includes('undefined'), false);
    });

    test('sem anexo, o texto não afirma que há anexo', () => {
        const semAnexo = renderPurchaseEmail({ ...COMPRA, hasInvoiceAttachment: false });
        assert.equal(semAnexo.text.includes('anexada'), false);
        assert.ok(semAnexo.text.includes('disponível no seu painel'));
    });
});

// ===========================================================================
// 2. Renovação (FASE 7)
// ===========================================================================

describe('e-mail de renovação', () => {
    test('NÃO é o e-mail de compra: assunto e chave são próprios', () => {
        const renovacao = renderRenewalEmail(RENOVACAO);
        assert.notEqual(renovacao.subject, renderPurchaseEmail(COMPRA).subject);
        assert.ok(renovacao.subject.toLowerCase().includes('renovada'));
    });

    test('informa o novo período e a nova validade', () => {
        const email = renderRenewalEmail(RENOVACAO);
        assert.ok(email.text.includes('Novo período'));
        assert.ok(email.text.includes('Nova validade'));
    });

    test('quando a renovação foi desligada, o e-mail NÃO promete nova cobrança', () => {
        const email = renderRenewalEmail({ ...RENOVACAO, renewalEnabled: false, nextBillingAt: null });
        assert.ok(email.text.includes('desligada'));
        assert.equal(email.text.includes('Próxima cobrança'), false);
    });

    test('quando está ativa, mostra a próxima cobrança', () => {
        const email = renderRenewalEmail(RENOVACAO);
        assert.ok(email.text.includes('Próxima cobrança'));
    });
});

// ===========================================================================
// 3. Cancelamento (FASE 8)
// ===========================================================================

describe('e-mail de cancelamento de renovação', () => {
    test('deixa explícito que NÃO há multa e que o acesso continua', () => {
        const email = renderCancellationEmail(CANCELAMENTO);
        assert.ok(email.text.includes('Não há multa'));
        assert.ok(email.text.toLowerCase().includes('até o fim do período já pago'));
    });

    test('informa até quando o acesso continua', () => {
        const email = renderCancellationEmail(CANCELAMENTO);
        assert.ok(email.text.includes('Acesso até'));
    });

    test('oferece reativação quando ainda é possível', () => {
        const email = renderCancellationEmail(CANCELAMENTO);
        assert.ok(email.html.includes('reativar a renovação automática'));
    });

    test('não oferece reativação quando a assinatura foi encerrada', () => {
        const email = renderCancellationEmail({ ...CANCELAMENTO, renewalOnly: false, canResume: false });
        assert.equal(email.html.includes('reativar a renovação automática'), false);
        assert.ok(email.html.includes('assinatura foi encerrada'));
    });
});

// ===========================================================================
// 4. Reembolso (FASE 9) — a parte onde é fácil mentir sem querer
// ===========================================================================

describe('e-mail de reembolso — cada estágio diz a verdade correspondente', () => {
    test('solicitação NÃO afirma que o dinheiro foi devolvido', () => {
        const email = renderRefundEmail({ ...REEMBOLSO_BASE, stage: 'requested', manualReview: true });
        assert.equal(
            email.text.includes('foi confirmado'),
            false,
            'e-mail de solicitação não pode dizer que foi confirmado'
        );
        assert.ok(email.text.toLowerCase().includes('em análise'));
        assert.ok(
            email.text.includes('NÃO devolvemos'),
            'a versão em texto precisa do mesmo qualifier do HTML'
        );
    });

    test('solicitação fora do prazo menciona análise humana e diz que não houve devolução', () => {
        const email = renderRefundEmail({ ...REEMBOLSO_BASE, stage: 'requested', manualReview: true });
        assert.ok(email.html.includes('Não afirmamos que o valor já foi devolvido'));
    });

    test('"em processamento" NÃO afirma crédito done', () => {
        const email = renderRefundEmail({ ...REEMBOLSO_BASE, stage: 'processing' });
        assert.ok(email.text.includes('ainda não foi creditado'));
        assert.equal(email.text.includes('devolvido ao meio de pagamento'), false);
    });

    test('"confirmado" só aparece com o valor e o identificador do reembolso', () => {
        const email = renderRefundEmail({ ...REEMBOLSO_BASE, stage: 'confirmed' });
        assert.ok(email.text.includes('confirmado'));
        assert.ok(email.text.includes(REEMBOLSO_BASE.refundId!));
    });

    test('cada estágio tem assunto próprio (o cliente distingue os três avisos)', () => {
        const assuntos = (['requested', 'processing', 'confirmed', 'failed'] as const)
            .map((stage) => renderRefundEmail({ ...REEMBOLSO_BASE, stage }).subject);
        assert.equal(new Set(assuntos).size, 4, 'assuntos repetidos entre estágios');
    });

    test('falha diz que a equipe foi avisada, sem prometer estorno', () => {
        const email = renderRefundEmail({ ...REEMBOLSO_BASE, stage: 'failed', refundId: null });
        assert.ok(email.text.includes('Nossa equipe foi avisada'));
        assert.equal(email.text.includes('foi confirmado'), false);
    });

    test('não promete revogação imediata da licença', () => {
        const email = renderRefundEmail({ ...REEMBOLSO_BASE, stage: 'confirmed' });
        assert.equal(
            /licença (foi|será) (revogada|cancelada)/i.test(email.text),
            false
        );
    });
});

// ===========================================================================
// 5. Falha no pagamento (FASE 10)
// ===========================================================================

describe('e-mail de falha de pagamento', () => {
    const email = renderPaymentFailedEmail(FALHA);

    test('diz que o acesso CONTINUA até o fim do período pago', () => {
        assert.ok(email.text.includes('Acesso garantido até'));
    });

    test('NÃO promete revogação — é o erro que mais prejudica o cliente', () => {
        assert.equal(
            /será (revogada|cancelada|encerrada)/i.test(email.text),
            false,
            'não pode anunciar revogação de acesso já pago'
        );
    });

    test('NUNCA pede dados de cartão por e-mail', () => {
        assert.ok(email.text.toLowerCase().includes('não pedimos dados de cartão'));
        assert.ok(email.html.toLowerCase().includes('não pedimos dados de cartão'));
    });

    test('direciona para um ambiente seguro, sem link de cartão', () => {
        const hrefs = [...email.html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
        for (const h of hrefs) {
            assert.equal(/checkout\.stripe|update.*payment/i.test(h), false, `link de pagamento: ${h}`);
        }
    });
});

// ===========================================================================
// Contexto — URLs nunca hard-coded
// ===========================================================================

describe('getEmailContext', () => {
    test('monta a URL do dashboard a partir do ambiente', () => {
        const ctx = getEmailContext();
        assert.ok(ctx.siteUrl.startsWith('http'));
        assert.ok(ctx.dashboardUrl.startsWith(ctx.siteUrl));
        assert.ok(!ctx.dashboardUrl.endsWith('/'), 'barra final quebraria o link');
    });

    test('o e-mail de cada evento aponta para o mesmo painel', () => {
        const ctx = getEmailContext();
        const emails = [
            renderPurchaseEmail(COMPRA),
            renderRenewalEmail(RENOVACAO),
            renderCancellationEmail(CANCELAMENTO),
            renderRefundEmail(REEMBOLSO_BASE),
            renderPaymentFailedEmail(FALHA),
        ];
        for (const e of emails) {
            assert.ok(e.html.includes(ctx.dashboardUrl), 'e-mail sem link para o painel');
        }
    });
});
