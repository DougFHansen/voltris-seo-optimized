/**
 * CONTRATO ENTRE A ROTA DE CONCILIAÇÃO E A TELA.
 *
 * O defeito real: a rota devolvia EMIT_LICENSE / APPROVE_PAYMENT /
 * LINK_SUBSCRIPTION / MARK_UNPAID, mas a tela conhecia ISSUE_LICENSE /
 * MARK_PAID / LINK_ONLY. Toda ação caía no fallback "Conferência manual" e o
 * contador de aplicáveis dava zero — o botão "Aplicar" NUNCA aparecia.
 *
 * Este teste lê os dois arquivos e compara os vocabulários. Se alguém renomear
 * uma ação em um lado só, quebra aqui em vez de quebrar em produção.
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const rota = readFileSync('app/api/admin/reconcile/route.ts', 'utf8');
const tela = readFileSync('app/restricted-area-admin/reconcile/AdminReconcileTab.tsx', 'utf8');

function acoesDaRota(): string[] {
    const bloco = /type ReconcileAction\s*=([\s\S]*?);/.exec(rota)?.[1] ?? '';
    return [...bloco.matchAll(/'([A-Z_]+)'/g)].map((m) => m[1]);
}

function acoesDaTela(): string[] {
    const bloco = /const ACAO[^{]*\{([\s\S]*?)\n\};/.exec(tela)?.[1] ?? '';
    return [...bloco.matchAll(/^\s{4}([A-Z_]+):/gm)].map((m) => m[1]);
}

describe('toda ação da rota tem rótulo na tela', () => {
    test('os dois vocabulários são idênticos', () => {
        const rotaAcoes = acoesDaRota().sort();
        const telaAcoes = acoesDaTela().sort();

        assert.ok(rotaAcoes.length >= 5, 'não foi possível ler as ações da rota');
        assert.ok(telaAcoes.length >= 5, 'não foi possível ler os rótulos da tela');
        assert.deepEqual(
            telaAcoes,
            rotaAcoes,
            `tela e rota divergiram.\n  rota: ${rotaAcoes.join(', ')}\n  tela: ${telaAcoes.join(', ')}`
        );
    });

    test('o conjunto de ações aplicáveis cobre tudo que o apply executa', () => {
        const aplicaveis = /const APLICAVEIS = new Set\(\[([^\]]+)\]\)/.exec(tela)?.[1] ?? '';
        const nomes = [...aplicaveis.matchAll(/'([A-Z_]+)'/g)].map((m) => m[1]);

        for (const acao of acoesDaRota()) {
            if (acao === 'WAIT_STRIPE' || acao === 'NEEDS_MANUAL') continue;
            assert.ok(
                nomes.includes(acao),
                `${acao} é aplicável pela rota mas não está em APLICAVEIS — o botão não a contaria`
            );
        }
        assert.equal(nomes.includes('WAIT_STRIPE'), false);
        assert.equal(nomes.includes('NEEDS_MANUAL'), false);
    });
});

describe('pagamento comprovado pela Stripe não fica pendente', () => {
    test('ALREADY_ISSUED não é pulado no apply', () => {
        const linha = /if \(row\.action[^\n]*continue;/.exec(rota)?.[0] ?? '';
        assert.ok(linha.length > 0, 'não achei o filtro de ações no apply');
        assert.equal(
            /ALREADY_ISSUED/.test(linha),
            false,
            'ALREADY_ISSUED continua sendo pulado: um pagante com licença já emitida ficaria "pending" para sempre'
        );
    });

    test('o acerto do pagamento preenche paid_at quando vazio', () => {
        assert.ok(/function settlementPatch/.test(rota), 'não existe o acerto padronizado');
        assert.ok(/if \(!payment\.paid_at\) patch\.paid_at/.test(rota), 'paid_at não é preenchido');
    });

    test('o efeito de LINK_SUBSCRIPTION diz que o pagamento é aprovado', () => {
        assert.ok(
            /LINK_SUBSCRIPTION[\s\S]{0,400}payments\.status -> "approved"/.test(rota),
            'o texto do relatório esconde que o pagamento é aprovado'
        );
    });
});
