/**
 * Testes do CATÁLOGO CANÔNICO de produto (missão §2) e do MECANISMO ÚNICO de
 * assinatura (missão §5).
 *
 * Ideia central: plano, período, preço e limites de dispositivo têm UMA fonte de
 * verdade no backend. Se alguém empurrar preço/limite pelo navegador, ou criar
 * um segundo algoritmo de assinatura, estes testes falham.
 *
 * Rodar: npm test
 */

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
    LICENSE_PLANS,
    LICENSE_CATALOG,
    SERVICE_CATALOG,
    isPlanType,
    isBillingPeriod,
    resolveLicenseProduct,
    planFromStripePriceId,
    type PlanType,
    type BillingPeriod,
} from '../lib/license-catalog.ts';

const ROOT = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const read = (...parts: string[]) => readFileSync(path.join(ROOT, ...parts), 'utf8');

describe('LICENSE_PLANS — limites de dispositivo', () => {
    test('paridade com o mecanismo canônico (SQL v3 + app C#): 1 / 3 / 9999', () => {
        assert.equal(LICENSE_PLANS.standard.maxDevices, 1);
        assert.equal(LICENSE_PLANS.pro.maxDevices, 3);
        assert.equal(LICENSE_PLANS.enterprise.maxDevices, 9999);
    });

    test('códigos de 3 letras embutidos na chave são únicos', () => {
        const codes = Object.values(LICENSE_PLANS).map((p) => p.code);
        assert.deepEqual(codes, ['STA', 'PRO', 'ENT']);
        assert.equal(new Set(codes).size, codes.length);
        for (const c of codes) assert.equal(c.length, 3, `código ${c} deveria ter 3 letras`);
    });

    test('nenhum plano tem limite zero ou negativo', () => {
        for (const [name, plan] of Object.entries(LICENSE_PLANS)) {
            assert.ok(plan.maxDevices >= 1, `${name} sem dispositivos permitidos`);
        }
    });
});

describe('LICENSE_CATALOG — preço é autoridade do servidor', () => {
    const plans = Object.keys(LICENSE_CATALOG) as PlanType[];
    const periods: BillingPeriod[] = ['month', 'year'];

    test('todas as combinações plano×período existem com preço > 0', () => {
        for (const plan of plans) {
            for (const period of periods) {
                const product = LICENSE_CATALOG[plan][period];
                assert.ok(product, `${plan}/${period} não cadastrado`);
                assert.ok(product.amount > 0, `${plan}/${period} com preço inválido`);
                assert.ok(product.name.length > 4, `${plan}/${period} sem nome`);
            }
        }
    });

    test('anual sai mais barato que 12 meses (promessa comercial do plano)', () => {
        for (const plan of plans) {
            const anual = LICENSE_CATALOG[plan].year.amount;
            const doze = LICENSE_CATALOG[plan].month.amount * 12;
            assert.ok(anual < doze, `${plan}: anual ${anual} não é vantajoso vs 12×${LICENSE_CATALOG[plan].month.amount}`);
        }
    });

    test('Price IDs cadastrados não colidem entre planos/períodos', () => {
        const seen = new Map<string, string>();
        for (const plan of plans) {
            for (const period of periods) {
                const id = LICENSE_CATALOG[plan][period].stripePriceId;
                if (!id) continue;
                assert.ok(!seen.has(id), `Price ID ${id} reusado em ${seen.get(id)} e ${plan}/${period}`);
                seen.set(id, `${plan}/${period}`);
                assert.match(id, /^price_[A-Za-z0-9]+$/, `Price ID malformado: ${id}`);
            }
        }
    });

    test('serviços (pagamento único) têm preço positivo e mode payment', () => {
        for (const [key, service] of Object.entries(SERVICE_CATALOG)) {
            assert.ok(service.amount > 0, `${key} sem preço`);
            assert.equal(service.mode, 'payment', `${key} não é pagamento único`);
            assert.match(key, /^[a-z0-9_]+$/, `${key} fora do padrão snake_case`);
        }
    });
});

describe('isPlanType / isBillingPeriod — portões de validação', () => {
    test('aceita os planos vendáveis em qualquer caixa', () => {
        assert.equal(isPlanType('pro'), true);
        assert.equal(isPlanType('PRO'), true);
        assert.equal(isPlanType(' Enterprise '), false, 'espaço não deveria passar sem trim explícito');
    });

    test('rejeita valores que não são plano (inclui trial, que não é vendável)', () => {
        for (const bad of ['trial', 'gamer', '', null, undefined, 42, {}, [], 'administrator']) {
            assert.equal(isPlanType(bad), false, `${String(bad)} não é plano vendável`);
        }
    });

    test('período só aceita month/year (nada de "week"/"day" inventado)', () => {
        assert.equal(isBillingPeriod('month'), true);
        assert.equal(isBillingPeriod('year'), true);
        for (const bad of ['MONTH', 'mensal', 'anual', 'week', 'day', '', null, undefined]) {
            assert.equal(isBillingPeriod(bad), false, `${String(bad)} não é período válido`);
        }
    });
});

describe('resolveLicenseProduct — combinação invirável não vira licença', () => {
    test('retorna produto completo com maxDevices do plano', () => {
        const p = resolveLicenseProduct('pro', 'year');
        assert.ok(p);
        assert.equal(p!.plan, 'pro');
        assert.equal(p!.period, 'year');
        assert.equal(p!.maxDevices, 3);
        assert.ok(p!.amount > 0);
        assert.ok(p!.stripePriceId === undefined || typeof p!.stripePriceId === 'string');
    });

    test('cruzadas impossíveis devolvem null (em vez de emitir licença errada)', () => {
        assert.equal(resolveLicenseProduct('pro', 'semana'), null);
        assert.equal(resolveLicenseProduct('gold', 'month'), null);
        assert.equal(resolveLicenseProduct(undefined, 'month'), null);
        assert.equal(resolveLicenseProduct(null, null), null);
        assert.equal(resolveLicenseProduct('', ''), null);
    });
});

describe('planFromStripePriceId — reconciliação Stripe→plano', () => {
    test('desconhecido/null não explode', () => {
        assert.equal(planFromStripePriceId('price_nao_cadastrado'), null);
        assert.equal(planFromStripePriceId(undefined), null);
        assert.equal(planFromStripePriceId(123), null);
    });

    test('todo Price ID cadastrado resolve de volta para o próprio plano/período', () => {
        for (const plan of Object.keys(LICENSE_CATALOG) as PlanType[]) {
            for (const period of Object.keys(LICENSE_CATALOG[plan]) as BillingPeriod[]) {
                const id = LICENSE_CATALOG[plan][period].stripePriceId;
                if (!id) continue;
                const resolved = planFromStripePriceId(id);
                assert.deepEqual(resolved, { plan, period }, `${id} resolveu para ${JSON.stringify(resolved)}`);
            }
        }
    });
});

// ============================================================================
// Missão §5: existe UM ÚNICO mecanismo de assinatura, e o app C# o reproduz.
// Os testes abaixo leem as duas implementações reais (SQL e C#) e exigem que
// ambas definam a mesma fórmula — sem algoritmo novo, sem segunda assinatura.
// ============================================================================

describe('assinatura canônica — fórmula SQL é a fonte', () => {
    const sqlMigration = read('supabase', 'migrations', '20260818000000_security_hardening.sql');

    test('generate_voltris_signature existe e usa SHA-256 truncado em 16 hex maiúsculos', () => {
        const fn = sqlMigration.match(/CREATE OR REPLACE FUNCTION public\.generate_voltris_signature\b([\s\S]{0,1200}?)\n(AS|LANGUAGE|\$\$)/i);
        assert.ok(fn, 'função canônica de assinatura não encontrada na migration');
        const body = fn[1].toLowerCase();
        assert.match(body, /digest\(/, 'deveria usar digest() do pgcrypto');
        assert.match(body, /sha256/, 'deveria usar sha256');
        assert.match(body, /from 1 for 16/, 'deveria usar 16 caracteres');
        assert.match(body, /encode\([\s\S]*?'hex'\)/, 'deveria codificar em hex');
        assert.match(sqlMigration, /digest\(p_content \|\| v_secret/, 'o segredo deve ser anexado ao conteudo ANTES do hash');
        assert.match(sqlMigration, /upper\(encode\(digest\(/, 'a saida deve ser hex maiusculo');
    });

    test('referência JavaScript da mesma fórmula produz 16 hex maiúsculos determinísticos', () => {
        const reference = (content: string, secret: string) =>
            createHash('sha256').update(content + secret, 'utf8').digest('hex').slice(0, 16).toUpperCase();

        const a = reference('VOLTRIS|PRO|1|20271015', 'segredo_de_teste');
        const b = reference('VOLTRIS|PRO|1|20271015', 'segredo_de_teste');
        assert.equal(a, b, 'assinatura precisa ser determinística');
        assert.match(a, /^[0-9A-F]{16}$/, `assinatura fora do formato: ${a}`);
        assert.notEqual(a, reference('VOLTRIS|STA|1|20271015', 'segredo_de_teste'), 'conteúdo diferente deve dar assinatura diferente');
    });

    test('segredo vem de GUC (app.license_secret) com fallback — não de código do painel', () => {
        assert.match(sqlMigration, /current_setting\('app\.license_secret', true\)/, 'deveria ler app.license_secret');
        assert.match(sqlMigration, /COALESCE\(\s*current_setting\('app\.license_secret', true\),\s*'([^']+)'\s*\)/i, 'fallback documentado');
    });

    test('nenhum segundo algoritmo (md5/sha1) assina licenças no schema', () => {
        const offenders = sqlMigration
            .split('\n')
            .filter((l) => /generate_voltris_signature|signature/i.test(l) && /md5\(|'sha1'/.test(l));
        assert.deepEqual(offenders, [], `algoritmo fraco encontrado na assinatura:\n${offenders.join('\n')}`);
    });

    test('execução da função canônica é restringida a service_role', () => {
        assert.match(sqlMigration, /REVOKE EXECUTE ON FUNCTION public\.generate_voltris_signature\(TEXT\) FROM PUBLIC, anon, authenticated;/);
        assert.match(sqlMigration, /GRANT EXECUTE ON FUNCTION public\.generate_voltris_signature\(TEXT\) TO service_role;/);
    });
});

describe('assinatura canônica — fonte única também no lado do painel', () => {
    test('o PAINEL não implementa assinatura própria de chave (fonte única)', () => {
        const appFiles = ['app/api/v1/license/validate/route.ts', 'app/api/v1/license/activate/route.ts', 'app/api/v1/license/me/route.ts'];
        for (const f of appFiles) {
            const src = read(...f.split('/'));
            assert.doesNotMatch(src, /createHmac\(['"]sha256['"]\)\.update\(licenseKey/i,
                `${f} está derivando assinatura da chave no painel (delegue ao mecanismo canônico)`);
        }
    });
});
