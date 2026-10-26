/**
 * TESTES DE SEGURANÇA DO PAINEL ADMINISTRATIVO (PARTE 11).
 *
 * A Parte 11 é declarada "obrigatória e não negociável". Estes testes fixam as
 * propriedades que a tornam verdadeira:
 *
 *   - toda rota /api/admin exige capacidade no SERVIDOR;
 *   - as capacidades segue o princípio do menor privilégio (reembolso e
 *     revogação em papéis diferentes);
 *   - admin existente (is_admin sem `role`) NÃO perde acesso;
 *   - conta bloqueada/excluída perde acesso mesmo sendo admin;
 *   - segredo nunca chega ao audit_logs;
 *   - o SQL entregue não é destrutivo nem desabilita RLS.
 *
 * Rodar: npm test
 */

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

import {
    ADMIN_CAPABILITIES,
    can,
    scrubForAudit,
    rateLimit,
    type AdminActor,
    type AdminRole,
    type AdminCapability,
} from '../lib/admin-auth.ts';
import { resolvePeriod, maskEmail, sanitizeSearch, readPage, MAX_PAGE_SIZE } from '../lib/admin-queries.ts';

// ===========================================================================
// Menor privilégio
// ===========================================================================

describe('matriz de capacidades aplica o menor privilégio', () => {
    function actor(role: AdminRole): AdminActor {
        return { userId: 'u1', email: 'a@b.c', role, legacyAdmin: false };
    }

    test('leitura não altera NADA', () => {
        const a = actor('leitura');
        const escritas: AdminCapability[] = [
            'licenses.write', 'payments.write', 'subscriptions.write',
            'devices.write', 'refunds.write', 'reconcile.apply',
            'roles.write', 'invoices.resend', 'emails.resend',
        ];
        for (const c of escritas) {
            assert.equal(can(a, c), false, `leitura não deveria poder ${c}`);
        }
    });

    test('leitura VEJA tudo o que é leitura', () => {
        const a = actor('leitura');
        const leituras: AdminCapability[] = [
            'overview.read', 'clients.read', 'licenses.read', 'payments.read',
            'subscriptions.read', 'devices.read', 'invoices.read', 'emails.read',
        ];
        for (const c of leituras) {
            assert.equal(can(a, c), true, `leitura deveria poder ${c}`);
        }
    });

    test('suporte NÃO mexe em dinheiro', () => {
        const a = actor('suporte');
        assert.equal(can(a, 'refunds.write'), false, 'suporte não deve reembolsar');
        assert.equal(can(a, 'payments.write'), false, 'suporte não deve alterar pagamento');
        assert.equal(can(a, 'reconcile.apply'), false, 'suporte não deve aplicar conciliação');
    });

    test('suporte PODE atender cliente', () => {
        const a = actor('suporte');
        assert.equal(can(a, 'licenses.write'), true);
        assert.equal(can(a, 'devices.write'), true);
        assert.equal(can(a, 'emails.resend'), true);
    });

    test('financeiro NÃO revoga licença', () => {
        // Responsabilidades separadas de propósito: mexer no direito do
        // cliente não é da mesma pessoa que mexe no dinheiro.
        const a = actor('financeiro');
        assert.equal(can(a, 'refunds.write'), true);
        assert.equal(can(a, 'payments.write'), true);
        assert.equal(can(a, 'licenses.write'), false, 'financeiro não deve revogar licença');
        assert.equal(can(a, 'devices.write'), false);
    });

    test('só superadmin edita papéis', () => {
        for (const role of ['leitura', 'suporte', 'financeiro'] as AdminRole[]) {
            assert.equal(can(actor(role), 'roles.write'), false, `${role} não deve editar papéis`);
        }
        assert.equal(can(actor('superadmin'), 'roles.write'), true);
    });

    test('superadmin pode tudo', () => {
        const a = actor('superadmin');
        for (const c of Object.keys(ADMIN_CAPABILITIES) as AdminCapability[]) {
            assert.equal(can(a, c), true, `superadmin deveria poder ${c}`);
        }
    });

    test('toda capacidade tem pelo menos um papel', () => {
        for (const [cap, roles] of Object.entries(ADMIN_CAPABILITIES)) {
            assert.ok(roles.length > 0, `capacidade ${cap} sem nenhum papel`);
        }
    });
});

// ===========================================================================
// Compatibilidade e negação
// ===========================================================================

describe('regra de acesso (ver resolveAdminActor no código)', () => {
    test('admin sem `role` é tratado como superadmin', () => {
        // Este é o caminho de compatibilidade: os admins de produção têm
        // is_admin=true e role NULL. Se exigíssemos papel preenchido, TODO o
        // painel quebraria no primeiro deploy.
        const source = readFileSync('lib/admin-auth.ts', 'utf8');
        assert.ok(
            source.includes('legacyAdmin: !known'),
            'a flag de compatibilidade precisa existir'
        );
        assert.ok(
            source.includes("'superadmin'") && source.includes('known ?'),
            'admin sem papel precisa cair em superadmin'
        );
    });

    test('perfil bloqueado ou excluído é negado', () => {
        const source = readFileSync('lib/admin-auth.ts', 'utf8');
        assert.ok(source.includes('is_blocked === true'), 'is_blocked precisa ser verificado');
        assert.ok(source.includes('is_deleted === true'), 'is_deleted precisa ser verificado');
        // E precisam vir ANTES do retorno de sucesso.
        const iBlocked = source.indexOf('is_blocked === true');
        const iRole = source.indexOf('role: known');
        assert.ok(iBlocked > 0 && iBlocked < iRole, 'bloqueio precisa ser checado antes do papel');
    });

    test('o papel vem do BANCO, nunca do pedido', () => {
        const source = readFileSync('lib/admin-auth.ts', 'utf8');
        // Não pode haver leitura de papel em searchParams/body/headers.
        assert.equal(/searchParams.*role|body.*role|headers.*role/.test(source), false);
        assert.ok(source.includes('createAdminClient'), 'a leitura precisa ser pelo service_role no servidor');
    });
});

// ===========================================================================
// Auditoria
// ===========================================================================

describe('segredos nunca entram na trilha de auditoria', () => {
    test('campos sensíveis são redigidos', () => {
        const out = scrubForAudit({
            email: 'cliente@exemplo.com',
            password: 'super-secreta',
            token: 're_abc',
            access_token: 'eyJ',
            refresh_token: 'v1',
            api_key: 'k',
            secret: 's',
            authorization: 'Bearer x',
            otp: '123456',
        }) as Record<string, unknown>;

        assert.equal(out.email, 'cliente@exemplo.com', 'e-mail não é segredo para auditoria');
        for (const k of ['password', 'token', 'access_token', 'refresh_token', 'api_key', 'secret', 'authorization', 'otp']) {
            assert.equal(out[k], '[REDACTED]', `${k} deveria estar redigido`);
        }
    });

    test('redige também dentro de objetos aninhados', () => {
        const out = scrubForAudit({
            outer: { inner: { password: 'x' }, lista: [{ token: 'y' }] },
        }) as any;
        assert.equal(out.outer.inner.password, '[REDACTED]');
        assert.equal(out.outer.lista[0].token, '[REDACTED]');
    });

    test('a correspondência ignora maiúsculas e variações', () => {
        const out = scrubForAudit({ PassWord: 'a', API_KEY: 'b', 'api-key': 'c' }) as Record<string, unknown>;
        assert.equal(out.PassWord, '[REDACTED]');
        assert.equal(out.API_KEY, '[REDACTED]');
        assert.equal(out['api-key'], '[REDACTED]');
    });

    test('não entra em recursão infinita', () => {
        const circular: any = { name: 'raiz' };
        circular.self = circular;
        const out = scrubForAudit(circular) as any;
        assert.equal(out.name, 'raiz');
        assert.ok(JSON.stringify(out).length < 10_000, 'estrutura circular deve ser truncada');
    });

    test('a auditoria registra quem, o quê, antes e depois', () => {
        const source = readFileSync('lib/admin-auth.ts', 'utf8');
        for (const campo of ['admin_id', 'resource', 'action', 'outcome', 'before', 'after', 'reason']) {
            assert.ok(source.includes(campo), `falta ${campo} no registro de auditoria`);
        }
    });

    test('falha de auditoria NÃO impede a ação de proseguir', () => {
        const source = readFileSync('lib/admin-auth.ts', 'utf8');
        const fn = source.slice(source.indexOf('export async function auditAction'));
        assert.ok(
            fn.includes('catch'),
            'auditAction precisa capturar erro: uma falha de log não desfaz uma ação ya realizada no provedor'
        );
    });
});

// ===========================================================================
// Toda rota admin é protegida
// ===========================================================================

describe('toda rota /api/admin exige autorização no servidor', () => {
    function rotasAdmin(dir = 'app/api/admin'): string[] {
        if (!existsSync(dir)) return [];
        const out: string[] = [];
        for (const e of readdirSync(dir)) {
            const p = join(dir, e);
            if (statSync(p).isDirectory()) out.push(...rotasAdmin(p));
            else if (e === 'route.ts') out.push(p);
        }
        return out;
    }

    test('existe ao menos uma rota admin', () => {
        assert.ok(rotasAdmin().length > 0, 'nenhuma rota admin encontrada');
    });

    for (const rota of rotasAdmin()) {
        test(`${rota} tem guarda de capacidade`, () => {
            const src = readFileSync(rota, 'utf8');
            const temGuard =
                src.includes('requireCapability') || src.includes('requireAdmin');
            assert.ok(
                temGuard,
                `${rota} não chama requireCapability nem requireAdmin — rota desprotegida`
            );
        });

        test(`${rota} não expõe a service role no cliente`, () => {
            const src = readFileSync(rota, 'utf8');
            assert.equal(
                /['"]use client['"]/.test(src),
                false,
                `${rota} não pode ser Client Component`
            );
        });
    }
});

// ===========================================================================
// Página do painel não decide papel no cliente
// ===========================================================================

describe('o frontend não concede acesso', () => {
    test('nenhum componente do admin altera o próprio papel', () => {
        const dir = 'app/restricted-area-admin';
        const arquivos: string[] = [];
        const walk = (d: string) => {
            for (const e of readdirSync(d)) {
                const p = join(d, e);
                if (statSync(p).isDirectory()) walk(p);
                else if (/\.tsx?$/.test(e)) arquivos.push(p);
            }
        };
        if (existsSync(dir)) walk(dir);

        for (const f of arquivos) {
            const src = readFileSync(f, 'utf8');
            // Escrever em `role` ou `is_admin` a partir do navegador seria o
            // caminho que a Parte 11 proíbe explicitamente.
            const escreve = /update\s*\(\s*\{[^}]*(is_admin|role)\s*:/s.test(src);
            assert.equal(escreve, false, `${f} escreve is_admin/role pelo cliente`);
        }
    });
});

// ===========================================================================
// SQL entregue
// ===========================================================================

describe('admin.sql é seguro de executar', () => {
    // Comentários são removidos ANTES das verificações: o arquivo documenta
    // "nenhum DROP, nenhum TRUNCATE, nenhum DELETE", e um teste que acuse a
    // própria documentação de ser perigosa não serve para nada.
    const sql = readFileSync('SQLCOMPLETO.sql', 'utf8')
        .split('\n')
        .filter((l) => !l.trimStart().startsWith('--'))
        .join('\n');

    /**
     * O arquivo é o schema INTEIRO do site. O corpo das funções (`$$ ... $$`)
     * é CÓDIGO que só roda quando a função é chamada — um DELETE dentro de
     * `cleanup_expired_trials()` é a lógica dela, não uma operação que o
     * script aplica no banco. Por isso o corpo das funções sai da análise:
     * o que interessa aqui é o que o ARQUIVO executa ao ser aplicado.
     */
    const sqlExecutado = sql.replace(/\$\$[\s\S]*?\$\$/g, ' ');

    test('não apaga dados', () => {
        // DROP TRIGGER IF EXISTS é padrão idempotente de migration e não
        // apaga registro nenhum; DROP TABLE/TRUNCATE/DELETE, sim.
        assert.equal(/DROP\s+TABLE/i.test(sqlExecutado), false, 'o schema não pode derrubar tabela');
        assert.equal(/TRUNCATE/i.test(sqlExecutado), false, 'o schema não pode truncar');
        assert.equal(/^\s*DELETE\s+FROM/im.test(sqlExecutado), false, 'o schema não pode apagar linha');
        assert.equal(/^\s*UPDATE\s+public\./im.test(sqlExecutado), false, 'o schema não altera dados existentes');
    });

    test('nunca desabilita RLS', () => {
        assert.equal(/DISABLE\s+ROW\s+LEVEL\s+SECURITY/i.test(sqlExecutado), false);
    });

    test('habilita RLS nas tabelas novas', () => {
        const novas = ['email_outbox', 'admin_audit_log', 'admin_role_grants', 'admin_roles'];
        for (const t of novas) {
            assert.ok(
                new RegExp(`ALTER TABLE public\\.${t} ENABLE ROW LEVEL SECURITY`).test(sql),
                `${t} precisa de RLS ligado`
            );
        }
    });

    test('revoga acesso de anon e authenticated nas tabelas sensíveis', () => {
        for (const t of ['email_outbox', 'admin_audit_log', 'admin_role_grants']) {
            // O schema é organizado por fases (RLS numa, REVOKE noutra),
            // então o REVOKE é procurado no arquivo inteiro — mas precisa
            // ser DA TABELA certa.
            const re = new RegExp(
                `REVOKE ALL ON (public\\.)?${t}\\b[^;]*FROM\\s+PUBLIC,\\s*anon,\\s*authenticated`,
                'i',
            );
            assert.ok(
                re.test(sql),
                `${t} precisa ter REVOKE ALL para anon/authenticated`,
            );
        }
    });

    test('toda tabela nova tem índice único ou PK para idempotência/identificação', () => {
        assert.ok(sql.includes('PRIMARY KEY'), 'tabelas novas precisam de PK');
        assert.ok(
            sql.includes('uniq_email_outbox_idempotency_key'),
            'a idempotência do outbox precisa ser garantida por índice único'
        );
    });

    test('traz as migrations pendentes que nunca foram aplicadas', () => {
        // Sem email_outbox no banco, a aba E-mails do painel não funciona.
        assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS public.email_outbox'));
        assert.ok(sql.includes('ADD COLUMN IF NOT EXISTS stripe_invoice_id'));
        assert.ok(sql.includes('ADD COLUMN IF NOT EXISTS cancel_at_period_end'));
    });

    test('é idempotente', () => {
        const ifNotExists = (sql.match(/IF NOT EXISTS/gi) ?? []).length;
        assert.ok(ifNotExists > 15, `poucas cláusulas IF NOT EXISTS (${ifNotExists})`);
    });
});

// ===========================================================================
// Período e máscara
// ===========================================================================

describe('período do painel usa o dia do administrador', () => {
    test('cada preset devolve um intervalo válido', () => {
        for (const p of ['today', '7d', '30d', 'month', 'prev_month', 'year'] as const) {
            const r = resolvePeriod(p);
            assert.ok(r.from < r.to, `${p}: intervalo invertido`);
            assert.ok(!Number.isNaN(Date.parse(r.from)), `${p}: from inválido`);
            assert.ok(!Number.isNaN(Date.parse(r.to)), `${p}: to inválido`);
        }
    });

    test('30 dias inclui hoje e vai 29 dias atrás', () => {
        const r = resolvePeriod('30d');
        const dias = Math.round((Date.parse(r.to) - Date.parse(r.from)) / 86_400_000);
        assert.ok(dias >= 29 && dias <= 31, `intervalo inesperado: ${dias} dias`);
    });

    test('intervalo personalizado respeita as datas informadas', () => {
        const r = resolvePeriod('custom', { from: '2026-01-01', to: '2026-01-31' });
        assert.ok(r.from.startsWith('2026-01-01'));
        assert.ok(r.to.startsWith('2026-01-31'));
    });

    test('mês anterior é ANTERIOR ao mês atual', () => {
        const atual = resolvePeriod('month');
        const anterior = resolvePeriod('prev_month');
        assert.ok(Date.parse(anterior.to) < Date.parse(atual.from));
    });
});

describe('paginação server-side é limitada', () => {
    test('página tem teto, para não virar dump', () => {
        const p = readPage(new URLSearchParams('limit=99999'));
        assert.equal(p.limit, MAX_PAGE_SIZE);
    });

    test('valores absurdos caem no padrão', () => {
        const p = readPage(new URLSearchParams('limit=abc&offset=-5'));
        assert.equal(p.limit, 25);
        assert.equal(p.offset, 0);
    });
});

describe('busca é higienizada antes de virar filtro', () => {
    test('remove os caracteres com significado no PostgREST', () => {
        const s = sanitizeSearch(`ana,ou(jo%ao)*'teste'`);
        assert.equal(/[,()*%'"]/.test(s), false, `ainda tem caractere especial: ${s}`);
    });

    test('preserva o texto útil', () => {
        assert.equal(sanitizeSearch('  Douglas  Felipe  '), 'Douglas Felipe');
    });
});

describe('e-mail mascarado na listagem', () => {
    test('esconde o local, mantém o domínio', () => {
        const m = maskEmail('douglasfelipebecker@gmail.com');
        assert.ok(m.endsWith('@gmail.com'));
        assert.equal(m.includes('douglasfelipebecker'), false);
        assert.equal(m.includes('@gmail.com') && m.length < 20, true);
    });

    test('valores inválidos viram travessão, nunca "undefined"', () => {
        assert.equal(maskEmail(null), '—');
        assert.equal(maskEmail(''), '—');
        assert.equal(maskEmail('sem-arroba'), '—');
    });

    test('local curto não quebra', () => {
        assert.equal(maskEmail('ab@voltris.com.br'), 'a…@voltris.com.br');
    });
});

// ===========================================================================
// Rate limiting
// ===========================================================================

describe('rate limit protege contra erro de duplo clique', () => {
    test('bloqueia depois do limite', () => {
        const key = `test-${Date.now()}-a`;
        assert.equal(rateLimit(key, 3, 60_000), true);
        assert.equal(rateLimit(key, 3, 60_000), true);
        assert.equal(rateLimit(key, 3, 60_000), true);
        assert.equal(rateLimit(key, 3, 60_000), false, 'deveria bloquear na 4a chamada');
    });

    test('chaves diferentes não se interferem', () => {
        const t = Date.now();
        assert.equal(rateLimit(`x-${t}-1`, 1, 60_000), true);
        assert.equal(rateLimit(`x-${t}-2`, 1, 60_000), true);
    });
});
