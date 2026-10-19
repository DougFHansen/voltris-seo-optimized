/**
 * PAINEL ADMINISTRATIVO 100% EM PORTUGUÊS.
 *
 * O painel mostrava o status CRU do banco: "approved", "partially_refunded",
 * "pending", "active", "low"… — em inglês, no meio de uma interface toda em
 * português. O operador precisava traduzir mentalmente antes de decidir, e
 * nenhuma tela dizia "por que isso aparece assim".
 *
 * Estes testes travam a tradução (lib/admin-labels.ts) e proíbem que o status
 * cru volte a aparecer em qualquer aba.
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { rotulo, tomDoStatus, classeDoTom, rotuloPapel } from '../lib/admin-labels.ts';

function abas(): string[] {
    const out: string[] = [];
    const walk = (d: string) => {
        for (const e of readdirSync(d)) {
            const p = join(d, e);
            if (statSync(p).isDirectory()) walk(p);
            else if (p.endsWith('.tsx')) out.push(p);
        }
    };
    walk('app/restricted-area-admin');
    return out;
}

const ARQUIVOS = abas();

describe('tradução de status para pt-BR', () => {
    test('status de pagamento', () => {
        assert.equal(rotulo('approved', 'pagamento'), 'Aprovado');
        assert.equal(rotulo('paid', 'pagamento'), 'Pago');
        assert.equal(rotulo('pending', 'pagamento'), 'Pendente');
        assert.equal(rotulo('refunded', 'pagamento'), 'Reembolsado');
        assert.equal(rotulo('partially_refunded', 'pagamento'), 'Reembolsado parcialmente');
        assert.equal(rotulo('failed', 'pagamento'), 'Falhou');
        assert.equal(rotulo('cancelled', 'pagamento'), 'Cancelado');
    });

    test('status de assinatura, ticket, e-mail, prioridade, plano e ciclo', () => {
        assert.equal(rotulo('active', 'assinatura'), 'Ativa');
        assert.equal(rotulo('past_due', 'assinatura'), 'Em atraso');
        assert.equal(rotulo('open', 'ticket'), 'Aberto');
        assert.equal(rotulo('in_progress', 'ticket'), 'Em andamento');
        assert.equal(rotulo('failed', 'email'), 'Falhou');
        assert.equal(rotulo('delivered', 'email'), 'Entregue');
        assert.equal(rotulo('urgent', 'prioridade'), 'Urgente');
        assert.equal(rotulo('medium', 'prioridade'), 'Média');
        assert.equal(rotulo('basic', 'plano'), 'Básico');
        assert.equal(rotulo('month', 'ciclo'), 'Mensal');
        assert.equal(rotulo('year', 'ciclo'), 'Anual');
    });

    test('valor desconhecido nunca vaza o código cru', () => {
        const r = rotulo('algo_novo_do_banco', 'pagamento');
        assert.ok(!r.includes('_'), `o valor cru vazou: ${r}`);
        assert.equal(r, 'Algo novo do banco');
    });

    test('valor vazio vira "—"', () => {
        assert.equal(rotulo(null, 'pagamento'), '—');
        assert.equal(rotulo('   ', 'pagamento'), '—');
    });

    test('cor do chip por status', () => {
        assert.equal(tomDoStatus('approved'), 'ok');
        assert.equal(tomDoStatus('pending'), 'aviso');
        assert.equal(tomDoStatus('failed'), 'perigo');
        assert.equal(tomDoStatus('refunded'), 'info');
        assert.match(classeDoTom('ok'), /emerald/);
    });

    test('papel de administração em pt-BR (com o legado)', () => {
        assert.equal(rotuloPapel('financeiro', true), 'Financeiro');
        assert.equal(rotuloPapel('leitura', true), 'Leitura');
        assert.equal(rotuloPapel(null, true), 'Super administrador (legado)');
        assert.equal(rotuloPapel(null, false), 'Cliente');
    });
});

describe('nenhuma aba mostra o status cru do banco', () => {
    for (const f of ARQUIVOS) {
        const nome = f.split(/[\\/]/).slice(-2).join('/');
        const src = readFileSync(f, 'utf8');

        test(`${nome} não renderiza status/prioridade crus`, () => {
            // "{r.status}" como FILHO do JSX é o defeito. O mesmo texto como
            // PROPS (`status={r.status}`) é o conserto — quem traduz é o
            // componente (StatusBadge/Status) ou o `rotulo(...)`.
            const crudos = [...src.matchAll(/(?<!=)\{(r|row|item)\.(status|priority|role|billing_period)\}/g)]
                .map((m) => m[0]);
            assert.deepEqual(
                crudos,
                [],
                `${nome} mostra o valor cru do banco: ${crudos.join(', ')}`
            );
        });

        test(`${nome} traduz o status que exibe`, () => {
            const exibeStatus =
                /<StatusBadge|<Status\b|rotulo\((r|row|item)\.status/.test(src);
            if (!exibeStatus) return;
            const traduz =
                /rotulo\(/.test(src) ||
                /rotuloPapel\(/.test(src) ||
                /import \{[^}]*rotulo[^}]*\} from '@\/lib\/admin-labels'/.test(src);
            assert.ok(
                traduz,
                `${nome} exibe status sem o tradutor de lib/admin-labels`
            );
        });
    }
});

describe('o modal do cliente segue o design do dashboard', () => {
    const src = readFileSync('app/restricted-area-admin/clients/AdminClientsTab.tsx', 'utf8');

    test('usa o sistema de ícones e o gradiente da marca', () => {
        assert.match(src, /from '@\/components\/dashboard\/VoltrisIcon'/);
        assert.match(src, /linear-gradient\(135deg, #FF4B6B 0%, #8B31FF 55%, #31A8FF 100%\)/);
    });

    test('cartões e abas no padrão do dashboard', () => {
        assert.match(src, /rounded-2xl border border-slate-800\/80 bg-slate-900\/50/);
        assert.match(src, /bg-indigo-600 text-white/);
        assert.match(src, /border-slate-800\/80/);
    });

    test('o painel inteiro usa o mesmo kit visual', () => {
        const ui = readFileSync('app/restricted-area-admin/_ui.tsx', 'utf8');
        assert.match(ui, /rounded-2xl/);
        assert.match(ui, /bg-slate-900\/50/);
    });
});
