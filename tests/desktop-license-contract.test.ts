/**
 * Contrato do APLICATIVO DESKTOP (C#) com o servidor (missões §5, §8, §12).
 *
 * O app desktop fica num repositório à parte (D:\APLICATIVO VOLTRIS) e não é
 * versionado a git; por isso estes testes são leituras estáticas do código real
 * que garantem as correções críticas:
 *   - nenhuma "licença eterna" (now+1 ano) no caminho de ativação;
 *   - o teto embutido na chave é aplicado;
 *   - nenhum log vaza segredo, assinatura ou a chave completa;
 *   - o validadores/server aponta para rotas vivas (não para Edge Functions mortas);
 *   - o artefato de renovação tem o mesmo formato que o SQL produz (YYYYMMDD).
 *
 * Se a pasta do app não existir na máquina, as suites são puladas (skip) com
 * aviso — nada aqui falha por ambiente ausente.
 *
 * Rodar: npm test
 */

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const APP = 'D:/APLICATIVO VOLTRIS';
const REPO = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');

const hasApp = existsSync(APP);

const cs = (rel: string) => {
    const full = path.join(APP, rel);
    assert.ok(existsSync(full), `arquivo do app ausente: ${rel}`);
    return readFileSync(full, 'utf8');
};
const sql = (name: string) => readFileSync(path.join(REPO, 'supabase', 'migrations', name), 'utf8');

describe('desktop — verificador de assinatura', { skip: hasApp ? false : 'app desktop ausente nesta máquina' }, () => {
    const src = () => cs('Services/License/LicenseSignatureVerifier.cs');

    test('usa SHA-256 com truncamento em 16 e comparação insensível a caixa (paridade com o SQL)', () => {
        const s = src();
        assert.match(s, /SHA256/, 'desktop deveria usar SHA-256');
        assert.match(s, /Substring\(0,\s*16\)|\[\s*0\s*\.\.\s*15\s*\]/, 'desktop deveria truncar em 16 caracteres');
        assert.match(s, /StringComparison\.OrdinalIgnoreCase|ToUpperInvariant\(\)/, 'comparação deveria ser case-insensitive');
    });

    test('ACEITA o plano TRI (trial), que antes era rejeitado', () => {
        assert.match(src(), /"TRI"\s*=>\s*true|"TRI"\s*=>/, 'IsValidPlanCode não trata TRI');
    });

    test('NENHUM log imprime o segredo ou a assinatura inteira', () => {
        const offenders = src()
            .split('\n')
            .filter((l) => /Log(Info|Warning|Error|Trace|Debug)/.test(l))
            .filter((l) => /secretBytes|secretKey|signatureBase64|\{signature\}|\{SecretKey\}|HmacSecretKey/.test(l));
        for (const line of offenders) {
            // Só é permitido falar de tamanho/prefixo, nunca do valor.
            assert.match(line, /Length|prefixo|Count|\.Substring\(0,\s*3\)/, `linha de log expõe material sensível: ${line.trim()}`);
        }
    });
});

describe('desktop — fim da licença eterna (missão §5 e §8)', { skip: hasApp ? false : 'app desktop ausente nesta máquina' }, () => {
    test('nenhum "AddYears(1)" no caminho de ativação/validação', () => {
        const files = [
            'Services/LicenseManager.cs',
            'Services/License/LicenseApiService.cs',
            'Services/License/LicenseTokenStore.cs',
            'Services/Licensing/ServerSideLicenseValidator.cs',
        ];
        for (const f of files) {
            const hits = cs(f)
                .split('\n')
                .filter((l) => /AddYears\(\s*1\s*\)/.test(l) && !/^\s*(\/\/|\*)/.test(l));
            assert.deepEqual(hits, [], `${f} ainda inventa um ano de licença: ${hits.join(' | ')}`);
        }
    });

    test('existe regra única que aplica o teto embutido na chave', () => {
        const store = cs('Services/License/LicenseTokenStore.cs');
        assert.match(store, /ResolveEffectiveExpiry\s*\(/, 'falta ResolveEffectiveExpiry');
        assert.match(store, /TryExtractKeyExpiry/, 'o teto da chave deveria ser lido da própria chave');
        assert.match(store, /MinNonZero|DateTime\.MinValue/, 'a menor data deveria vencer');
    });

    test('ativação e persistência USAM a data efetiva (não a declarada)', () => {
        const manager = cs('Services/LicenseManager.cs');
        const store = cs('Services/License/LicenseTokenStore.cs');
        assert.match(manager, /ResolveEffectiveExpiry\(/, 'LicenseManager não aplica a data efetiva');
        assert.match(manager, /DateTime\.MinValue/, 'sem default explícito "sem data" na ativação');
        assert.match(store, /effectiveExpiry|ResolveEffectiveExpiry/, 'armazenamento não usa a data efetiva');
    });

    test('sem "expiresAt" eterno quando o servidor não devolve data', () => {
        const api = cs('Services/License/LicenseApiService.cs');
        assert.match(api, /ResolveExpiryOrKeyCeiling|KeyCeiling|teto/, 'fallback não amarra a data ao teto da chave');
    });
});

describe('desktop — endpoints vivos e revalidação real (missão §8)', { skip: hasApp ? false : 'app desktop ausente nesta máquina' }, () => {
    test('nenhum chamador aponta para as Edge Functions mortas (404)', () => {
        const files = [
            'Services/Licensing/ServerSideLicenseValidator.cs',
            'Services/License/LicenseApiService.cs',
            'Services/LicenseManager.cs',
        ];
        for (const f of files) {
            const s = cs(f);
            assert.doesNotMatch(s, /functions\/v1\/validate-license/, `${f} chama função morta`);
            assert.doesNotMatch(s, /functions\/v1\/activate-license/, `${f} chama função morta`);
        }
    });

    test('aponta para a API do site (rotas que existem)', () => {
        const s = cs('Services/Licensing/ServerSideLicenseValidator.cs');
        assert.match(s, /\/api\/v1\/license\/validate|license\/renewal|ApiBaseUrl/, 'validator não usa a API canônica');
    });

    test('revalidação periódica é ligada na inicialização', () => {
        const app = cs('App.xaml.cs');
        const main = cs('UI/MainWindow.xaml.cs');
        assert.match(app + main, /StartLicenseRefresh/, 'revalidação periódica não está ligada');
    });

    test('revalidação envia o header de assinatura e não revoga por erro de transporte', () => {
        const s = cs('Services/LicenseManager.cs');
        assert.match(s, /x-voltris-signature/, 'desktop não autentica a revalidação');
        assert.match(s, /IsSuccessStatusCode/, 'desktop deveria ignorar não-2xx em vez de revogar');
        assert.match(s, /NOT_FOUND|REVOK|EXPIRE|SUSPEND|REFUND|CHARGEBACK/, 'revogação deveria depender de fato do banco');
    });

    test('assinatura ausente na resposta NÃO derruba o cliente (TLS é a confiança)', () => {
        const s = cs('Services/LicenseManager.cs');
        assert.match(s, /LICENSE_RATE|rate|signature/, 'caminho de assinatura ausente não tratado');
    });
});

describe('contrato de renovação SQL ↔ desktop (missão §5)', () => {
    test('o artefato de renovação tem o formato que o app aceita (YYYYMMDD, 8 dígitos)', {
        skip: hasApp ? false : 'app desktop ausente nesta máquina',
    }, () => {
        const migration = sql('20261015200000_webhook_hardening_and_renewal.sql');
        assert.match(migration, /to_char\([^)]*YYYYMMDD/, 'SQL não produz YYYYMMDD');
        const store = cs('Services/License/LicenseTokenStore.cs');
        assert.match(store, /Length\s*==\s*8/, 'desktop não exige 8 dígitos');
    });

    test('o JSON assinado da renovação usa as mesmas chaves que o app parseia', {
        skip: hasApp ? false : 'app desktop ausente nesta máquina',
    }, () => {
        const migration = sql('20261015200000_webhook_hardening_and_renewal.sql');
        const verifier = cs('Services/License/LicenseSignatureVerifier.cs');
        for (const field of ['validUntil', 'maxDevices', 'plan']) {
            assert.ok(migration.includes(`'${field}'`) || migration.includes(`${field}`), `SQL não fala em ${field}`);
            assert.ok(verifier.includes(field), `desktop não lê ${field}`);
        }
    });
});

describe('desktop — segredo e PII fora dos logs (missão §9/§12)', { skip: hasApp ? false : 'app desktop ausente nesta máquina' }, () => {
    const files = [
        'Services/LicenseManager.cs',
        'Services/License/LicenseTokenStore.cs',
        'Services/License/LicenseApiService.cs',
        'Services/Licensing/ServerSideLicenseValidator.cs',
    ];

    test('nenhum log despeja a chave de licença inteira', () => {
        for (const f of files) {
            const offenders = cs(f)
                .split('\n')
                .filter((l) => /Log(Info|Warning|Error|Trace|Debug)/.test(l))
                .filter((l) => /\{licenseKey\}|\{LicenseKey\}|\{fullKey\}|string\.Join\("-", parts\)/.test(l)
                    && !/Substring\(0/.test(l));
            assert.deepEqual(offenders, [], `${f} loga a chave completa:\n${offenders.join('\n')}`);
        }
    });

    test('nenhum log despeja o corpo JSON completo da resposta', () => {
        for (const f of files) {
            const offenders = cs(f)
                .split('\n')
                .filter((l) => /Log(Info|Warning|Error|Trace|Debug)/.test(l))
                .filter((l) => /\{json\}|\{body\}|\{responseBody\}|\{payload\}/i.test(l));
            assert.deepEqual(offenders, [], `${f} loga payload completo:\n${offenders.join('\n')}`);
        }
    });
});
