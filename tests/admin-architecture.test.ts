/**
 * TESTES DE ARQUITETURA DO PAINEL (PARTE 11 e PARTE 18).
 *
 * Estes testes existem por causa de um defeito REAL encontrado na auditoria:
 * cinco abas liam o Supabase DIRETO DO NAVEGADOR com a chave `anon`. O
 * efeito era tela vazia sem mensagem de erro quando faltava policy RLS — o
 * administrador concluía que "não há dados" quando na verdade a consulta
 * estava sendo bloqueada.
 *
 * O que fica travado aqui:
 *   - nenhuma aba do painel volta a ler o banco pelo navegador;
 *   - toda aba tem estado de carregamento, de erro e de vazio DIFERENCIADO;
 *   - toda escrita administrativa exige justificativa e vai para o servidor;
 *   - a distinção "vazio porque não há dados" vs "vazio porque falhou"
 *     é explícita na interface.
 */

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// ===========================================================================
// Helpers
// ===========================================================================

function componentes(dir = 'app/restricted-area-admin'): string[] {
    const out: string[] = [];
    const walk = (d: string) => {
        for (const e of readdirSync(d)) {
            const p = join(d, e);
            if (statSync(p).isDirectory()) walk(p);
            else if (/\.tsx$/.test(e)) out.push(p);
        }
    };
    if (readdirSync(dir).length) walk(dir);
    return out;
}

/** Arquivos de aba (exclui o shell e o kit compartilhado "_ui.tsx"). */
function abas(): string[] {
    return componentes().filter((f) => {
        const base = f.split(/[\\/]/).pop()!;
        if (base.startsWith('_')) return false; // kit de UI: não é uma aba
        return !['page.tsx', 'layout.tsx'].includes(base);
    });
}

const ARQUIVOS = abas();

/**
 * Fonte efetiva de uma aba.
 *
 * As abas passaram a usar o kit compartilhado (_ui.tsx) para os estados de
 * carregamento, erro e vazio. A verificação precisa olhar as DUAS fontes:
 * exigir o texto literal dentro de cada aba reprovaria código correto.
 */
const KIT = readFileSync('app/restricted-area-admin/_ui.tsx', 'utf8');
function fonteDaAba(arquivo: string): string {
    const src = readFileSync(arquivo, 'utf8');
    return /from '\.\.\/_ui'/.test(src) ? src + '\n' + KIT : src;
}

// ===========================================================================
// 1. Nenhuma aba lê o banco pelo navegador
// ===========================================================================

describe('nenhuma aba do painel consulta o Supabase pelo navegador', () => {
    test('existe alguma aba para auditar', () => {
        assert.ok(ARQUIVOS.length >= 7, `esperava >=7 abas, achei ${ARQUIVOS.length}`);
    });

    for (const f of ARQUIVOS) {
        test(`${f.split(/[\\/]/).slice(-2).join('/')} não usa o cliente do navegador`, () => {
            const src = readFileSync(f, 'utf8');
            // O import do cliente de navegador é o que habilita a leitura
            // direta. Não pode existir em nenhuma aba.
            assert.equal(
                /@\/utils\/supabase\/client/.test(src),
                false,
                `${f} importa o cliente do navegador: a leitura depende de RLS e falha em silêncio`
            );
        });

        test(`${f.split(/[\\/]/).slice(-2).join('/')} busca dados em API do servidor`, () => {
            const src = readFileSync(f, 'utf8');
            assert.ok(
                /fetch\(\s*[`'"]\/api\//.test(src),
                `${f} não busca dados em nenhuma rota /api — de onde vem a lista?`
            );
        });
    }

    test('o layout pode usar o cliente SERVIDOR (leitura de sessão)', () => {
        // O layout é Server Component e precisa ler a sessão. O que não pode
        // é o cliente do navegador.
        const src = readFileSync('app/restricted-area-admin/layout.tsx', 'utf8');
        assert.equal(/@\/utils\/supabase\/client/.test(src), false);
        assert.ok(/@\/utils\/supabase\/server/.test(src), 'layout deve ler a sessão no servidor');
    });
});

// ===========================================================================
// 2. Estados de interface — carregando, erro e vazio são distintos
// ===========================================================================

describe('cada aba distingue carregando, erro e vazio', () => {
    for (const f of ARQUIVOS) {
        const nome = f.split(/[\\/]/).slice(-2).join('/');

        test(`${nome} tem estado de carregamento`, () => {
            const src = fonteDaAba(f);
            assert.ok(
                /loading|Loading|Carregando/.test(src),
                `${nome} não mostra estado de carregamento`
            );
        });

        test(`${nome} tem estado de erro com retry`, () => {
            const src = fonteDaAba(f);
            assert.ok(/error|setError/.test(src), `${nome} não trata erro`);
            assert.ok(
                /role="alert"/.test(src),
                `${nome} não marca o erro com role="alert" (leitor de tela não anuncia)`
            );
        });

        test(`${nome} tem estado vazio ou fallback de "sem dados"`, () => {
            const src = fonteDaAba(f);
            // Um painel de cartões (Visão Geral) não tem "lista vazia": o
            // equivalente é ter um caminho explícito para "não há dado" —
            // seja uma lista vazia, seja um aviso de dado indisponível.
            // Aceita tambem a forma negada (`!lista.length`), que e o mesmo
            // estado vazio escrito de outra maneira.
            const temListaVazia = /rows\.length === 0|length === 0|!\s*[A-Za-z_$][\w$?.]*\.length/.test(src);
            const temFallback = /unavailable|sem dados|nenhum registro|Nenhum\s+\w+\s+registrad|Confirme|confirmado no banco/i.test(src);
            assert.ok(
                temListaVazia || temFallback,
                `${nome} não tem tratamento para "sem dados" — a tela ficaria vazia e silenciosa`
            );
        });

        test(`${nome} nunca usa alert() bloqueante`, () => {
            const src = readFileSync(f, 'utf8');
            // Comentários são removidos: documentar "alert foi trocado" não é
            // usar alert.
            const codigo = src.split('\n').filter((l) => !l.trimStart().startsWith('*') && !l.trimStart().startsWith('//')).join('\n');
            assert.equal(/\balert\(/.test(codigo), false, `${nome} usa alert() bloqueante`);
        });

        test(`${nome} não engole erro de fetch`, () => {
            const src = fonteDaAba(f);
            // `catch {` e `catch (e)` são igualmente válidos; exigir só o
            // parêntesis reprovaria código correto.
            assert.ok(
                /catch\s*[({]/.test(src) && /set(Error|Erro)/.test(src),
                `${nome} pode ficar em carregamento eterno se o fetch falhar`
            );
        });
    }
});

// ===========================================================================
// 3. Escrita administrativa
// ===========================================================================

describe('escrita administrativa vai para o servidor com justificativa', () => {
    const rota = readFileSync('app/api/admin/directory/route.ts', 'utf8');

    test('a rota exige autorização no servidor', () => {
        assert.ok(/requireCapability/.test(rota));
    });

    test('toda escrita exige justificativa de tamanho mínimo', () => {
        // Sem isso, a trilha de auditoria registra "alterado" sem dizer por quê.
        assert.ok(
            /reason:[\s\S]{0,120}min\(5/.test(rota),
            'a justificativa não tem comprimento mínimo'
        );
    });

    test('a gravação registra antes e depois', () => {
        assert.ok(/before/.test(rota) && /after/.test(rota));
    });

    test('remoção é restrita a recurso que NÃO é dado financeiro', () => {
        // Licença, pagamento e assinatura nunca podem ser apagados por aqui.
        assert.ok(
            /resource !== 'newsletter'/.test(rota),
            'a rota permite apagar algo que não deveria'
        );
        const corpos = ['licenses', 'payments', 'subscriptions'];
        const blocoDelete = rota.slice(rota.indexOf("action === 'delete'"));
        for (const t of corpos) {
            assert.equal(
                new RegExp(`from\\('${t}'\\)\\.delete`).test(blocoDelete),
                false,
                `a rota pode apagar ${t}`
            );
        }
    });

    test('existe amortecedor contra duplo clique em escrita', () => {
        assert.ok(/rateLimit/.test(rota));
    });

    test('as abas com escrita pedem justificativa antes de enviar', () => {
        for (const f of ['app/restricted-area-admin/tickets/AdminTicketsTab.tsx',
                          'app/restricted-area-admin/newsletter/AdminNewsletterTab.tsx']) {
            const src = readFileSync(f, 'utf8');
            assert.ok(/reason|motivo/i.test(src), `${f} envia escrita sem pedir justificativa`);
        }
    });
});

// ===========================================================================
// 4. Painel único — sem sistema paralelo
// ===========================================================================

describe('o painel tem uma porta só', () => {
    test('não existe segunda página de admin', () => {
        // Havia /restricted-area-admin/orders duplicando a aba Pedidos, com
        // leitura própria pelo navegador. Duplicar é o que a Parte 1 proíbe.
        assert.equal(
            readdirSync('app/restricted-area-admin/orders').includes('page.tsx'),
            false,
            'ainda existe uma página de admin paralela em orders/page.tsx'
        );
    });

    test('o painel aceita deep link por ?tab=', () => {
        const src = readFileSync('app/restricted-area-admin/page.tsx', 'utf8');
        // Aceita tanto `new URLSearchParams(...).get('tab')` quanto
        // `useSearchParams().get('tab')`.
        assert.ok(
            /(URLSearchParams|useSearchParams)[\s\S]{0,60}get\(\s*['"]tab['"]\s*\)/.test(src),
            'sem ?tab= não há deep link, e o link antigo da notificação quebraria'
        );
    });

    test('a notificação de pedido aponta para a porta única', () => {
        const src = readFileSync('app/api/orders/route.ts', 'utf8');
        assert.ok(
            src.includes('/restricted-area-admin?tab=orders'),
            'a notificação ainda aponta para a página duplicada'
        );
    });

    test('nenhuma aba é renderizada duas vezes', () => {
        // Comentários são removidos antes da contagem: o bloco que registra a
        // correção fala justamente de `activeTab === 'overview'`, e um teste que
        // accuse a própria documentação não serve para nada.
        const src = readFileSync('app/restricted-area-admin/page.tsx', 'utf8')
            .split('\n')
            .filter((l) => !l.trimStart().startsWith('*') && !l.trimStart().startsWith('{/*') && !l.trimStart().startsWith('//'))
            .join('\n');
        const condicoes = [...src.matchAll(/activeTab === '(\w+)'\s*&&\s*<Admin/g)].map((m) => m[1]);
        const repetidas = condicoes.filter((c, i) => condicoes.indexOf(c) !== i);
        assert.deepEqual(repetidas, [], `aba(s) renderizada(s) duas vezes: ${repetidas.join(', ')}`);
    });
});

// ===========================================================================
// 5. Privacidade do que volta para o navegador
// ===========================================================================

describe('o que a API devolve é o mínimo necessário', () => {
    test('a lista de clientes mascara o e-mail', () => {
        const src = readFileSync('app/api/admin/clients/route.ts', 'utf8');
        assert.ok(/maskEmail/.test(src), 'a lista de clientes devolve o e-mail em claro');
    });

    test('a lista de usuários mascara o e-mail', () => {
        const src = readFileSync('app/api/admin/directory/route.ts', 'utf8');
        assert.ok(
            /resource === 'users'[\s\S]{0,200}maskEmail/.test(src),
            'a lista de usuários devolve o e-mail em claro'
        );
    });

    test('a newsletter NÃO mascara: ali o e-mail é o dado', () => {
        const src = readFileSync('app/api/admin/directory/route.ts', 'utf8');
        // Mascar o e-mail numa lista de disparo próprio inutiliza a tela.
        assert.equal(
            /resource === 'newsletter'[\s\S]{0,200}maskEmail/.test(src),
            false,
            'a newsletter está mascarando o e-mail'
        );
    });

    test('nenhuma rota usa select(\'*\') na listagem de clientes', () => {
        const src = readFileSync('app/api/admin/clients/route.ts', 'utf8');
        const blocoLista = src.slice(0, src.indexOf('export async function PUT'));
        assert.equal(/select\('\*'\)/.test(blocoLista), false, "select('*') traz colunas desnecessárias");
    });

    test('a paginação tem teto', () => {
        const src = readFileSync('app/api/admin/directory/route.ts', 'utf8');
        assert.ok(/readPage/.test(src), 'sem readPage a rota pode devolver a tabela inteira');
    });
});


// ===========================================================================
// 5. O kit compartilhado precisa trazer os estados que as abas usam
// ===========================================================================

describe('kit de UI do painel', () => {
    const kit = readFileSync('app/restricted-area-admin/_ui.tsx', 'utf8');

    test('o kit existe e é importado pelas abas', () => {
        assert.ok(kit.length > 100, 'kit vazio');
        const abasQueUsam = abas().filter((a) => /from '\.\.\/_ui'/.test(readFileSync(a, 'utf8')));
        assert.ok(abasQueUsam.length >= 1, 'nenhuma aba usa o kit compartilhado');
    });

    test('o kit tem estado de erro anunciado (role="alert")', () => {
        assert.match(kit, /role="alert"/);
        assert.match(kit, /AdminErrorState/);
    });

    test('o kit tem estado vazio e de carregamento', () => {
        assert.match(kit, /AdminEmptyState/);
        assert.match(kit, /AdminLoading/);
    });

    test('o kit usa o visual do dashboard (cards rounded-2xl, slate-900/50)', () => {
        assert.match(kit, /rounded-2xl/);
        assert.match(kit, /bg-slate-900\/50/);
    });
});
