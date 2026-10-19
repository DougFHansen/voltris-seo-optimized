/**
 * CSP (Content-Security-Policy) E GOOGLE ANALYTICS — travas de regressão.
 *
 * O erro reportado no console era:
 *
 *   Connecting to 'https://analytics.google.com/g/collect?…' violates the
 *   following Content Security Policy directive: "connect-src …"
 *
 * Causa: o `connect-src` autorizava `https://www.google-analytics.com` (a
 * origem padrão do collect), mas o GA4 também envia o beacon para
 * `https://analytics.google.com/g/collect`. A origem faltava.
 *
 * Além do conserto, estes testes garantem que a correção continue MÍNIMA e
 * específica (a missão proíbe `connect-src *`, remoção da CSP e enlargamento
 * genérico de permissões) e que o Analytics não seja inicializado duas vezes
 * (duas page_view na primeira carga).
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const config = readFileSync('next.config.mjs', 'utf8');
const layout = readFileSync('app/layout.tsx', 'utf8');
const analytics = readFileSync('components/GoogleAnalytics.tsx', 'utf8');

function diretiva(nome: string): string {
    const m = new RegExp(`"${nome} ([^"]*)"`).exec(config);
    assert.ok(m, `a diretiva ${nome} não existe na CSP`);
    return m[1];
}

describe('CSP — a origem que faltava está autorizada (e só ela)', () => {
    test('connect-src autoriza as duas origens de collect do GA4', () => {
        const connect = diretiva('connect-src');
        assert.match(connect, /https:\/\/www\.google-analytics\.com/);
        assert.match(
            connect,
            /https:\/\/analytics\.google\.com/,
            'https://analytics.google.com/g/collect é a origem bloqueada no console'
        );
    });

    test('connect-src mantém as origens legítimas já existentes', () => {
        const connect = diretiva('connect-src');
        for (const origem of [
            "'self'",
            'https://*.supabase.co',
            'wss://*.supabase.co',
            'https://api.stripe.com',
            'https://checkout.stripe.com',
            'https://pagead2.googlesyndication.com',
            'https://*.adtrafficquality.google',
            'https://static.cloudflareinsights.com',
            'https://accounts.google.com',
        ]) {
            assert.ok(connect.includes(origem), `connect-src perdeu ${origem}`);
        }
    });

    test('script-src mantém o Google Tag, o Stripe e as redes de anúncios', () => {
        const script = diretiva('script-src');
        for (const origem of [
            'https://www.googletagmanager.com',
            'https://www.google-analytics.com',
            'https://js.stripe.com',
            'https://pagead2.googlesyndication.com',
            'https://adservice.google.com.br',
            'https://adservice.google.com',
            'https://static.cloudflareinsights.com',
        ]) {
            assert.ok(script.includes(origem), `script-src perdeu ${origem}`);
        }
    });

    test('frame-src e form-action continuam liberados para o OAuth do Google', () => {
        assert.ok(diretiva('frame-src').includes('https://accounts.google.com'));
        assert.ok(diretiva('form-action').includes('https://accounts.google.com'));
        assert.ok(diretiva('form-action').includes('https://*.supabase.co'));
    });

    test('a CSP não foi afrouxada', () => {
        const connect = diretiva('connect-src');
        assert.ok(!/connect-src[^;]*\*/.test(connect), 'connect-src não pode usar curinga');
        // "https:" como esquema SOLTO (sem "//") seria liberar qualquer host.
        assert.ok(
            !/(^|\s)https:(\s|$)/.test(connect),
            'connect-src não pode liberar https: inteiro'
        );
        assert.equal(diretiva('object-src'), "'none'");
        assert.equal(diretiva('frame-ancestors'), "'none'");
        assert.equal(diretiva('base-uri'), "'self'");
        assert.ok(diretiva('default-src').includes("'self'"));
    });

    test('os cabeçalhos de segurança continuam no lugar', () => {
        assert.match(config, /Strict-Transport-Security/);
        assert.match(config, /X-Content-Type-Options/);
        assert.match(config, /X-Frame-Options/);
        assert.match(config, /Referrer-Policy/);
        assert.match(config, /Permissions-Policy/);
    });

    test('as rotas de API não recebem CSP (o webhook da Stripe precisa funcionar)', () => {
        assert.match(config, /source: '\/api\/\(\.\*\)'/);
    });

    test('existe UMA origem de CSP no projeto (sem política duplicada)', () => {
        const ocorrencias = (config.match(/Content-Security-Policy/g) || []).length;
        assert.equal(ocorrencias, 1, 'há mais de uma definição de CSP no next.config');
        // Não existe middleware aplicando outra política por cima.
        const temMiddleware = ['middleware.ts', 'middleware.js', 'middleware.tsx', 'proxy.ts']
            .some((f) => {
                try { readFileSync(f); return true; } catch { return false; }
            });
        assert.equal(temMiddleware, false, 'há um middleware que pode aplicar outra CSP');
    });
});

describe('Google Analytics — inicialização única', () => {
    test('o gtag.js é carregado UMA vez, no layout', () => {
        const scripts = layout.match(/googletagmanager\.com\/gtag\/js/g) || [];
        assert.equal(scripts.length, 1, 'o gtag.js está sendo carregado mais de uma vez');
    });

    test('o layout faz UM config (é ele que envia a primeira page_view)', () => {
        const configs = layout.match(/gtag\('config'/g) || [];
        assert.equal(configs.length, 1);
    });

    test('o componente de navegação NÃO reinicia o GA (não duplica page_view)', () => {
        // Comentários não contam: o que interessa é o CÓDIGO executado.
        const codigo = analytics
            .split('\n')
            .filter((l) => !l.trim().startsWith('*') && !l.trim().startsWith('//'))
            .join('\n');
        assert.ok(
            !/gtag\('config'/.test(codigo),
            'gtag("config") na navegação reenvia page_view e duplica a medição'
        );
        assert.match(codigo, /gtag\('event', 'page_view'/);
    });

    test('a navegação no app continua sendo medida', () => {
        assert.match(analytics, /page_path: pathname/);
        assert.match(analytics, /page_location:/);
    });
});
