/**
 * REDEFINIÇÃO DE SENHA — o defeito real do link.
 *
 * O que o usuário relatava: clicava no link do e-mail, abria uma aba nova,
 * caía na tela de login por um instante, via um erro vermelho que passava
 * rápido e, "do nada", ficava logado na própria conta — em vez de ver a
 * tela de criar nova senha.
 *
 * CAUSA RAIZ (medida em produção, 2026-10-19)
 *
 *   O link de recuperação do Supabase tem como destino padrão o "Site URL"
 *   do projeto. Se a URL de redirecionamento não estiver na LISTA PERMITIDA
 *   do Supabase, o `redirectTo` enviado pelo site é IGNORADO e o link leva
 *   o usuário para o Site URL — com o token no fragmento.
 *
 *   Experimento (generate_link + seguir o link):
 *       redirectTo: https://www.voltris.com.br/reset-password
 *       -> 303 para http://voltris.com.br#access_token=…
 *
 *   E com o token no fragmento, o `supabase-js` ABRE SESSÃO sozinho
 *   (`detectSessionInUrl`): por isso o usuário "logava" sem querer.
 *
 * Estes testes travam a correção:
 *   1. o app reconhece o link onde ele cair e encaminha para /reset-password;
 *   2. o app NÃO abre sessão sozinho com o token de recuperação;
 *   3. depois da troca, o usuário vai para o painel (não é expulso).
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
    pareceLinkDeRecuperacao,
    urlDeRedirecionamentoParaReset,
    interpretRecoveryLink,
} from '../lib/password-recovery.ts';

const clienteSupabase = readFileSync('utils/supabase/client.ts', 'utf8');
const contexto = readFileSync('app/context/AuthContext.tsx', 'utf8');
const resetPage = readFileSync('app/reset-password/page.tsx', 'utf8');
const loginPage = readFileSync('app/login/page.tsx', 'utf8');

describe('reconhecer o link de recuperação', () => {
    test('link implícito (fragmento) é reconhecido', () => {
        const partes = {
            hash: 'access_token=abc.def&refresh_token=xyz&type=recovery',
            search: '',
        };
        assert.equal(pareceLinkDeRecuperacao(partes, '/'), true);
        assert.equal(pareceLinkDeRecuperacao(partes, '/login'), true);
    });

    test('link expirado (erro no fragmento) é reconhecido', () => {
        assert.equal(
            pareceLinkDeRecuperacao({ hash: 'error=access_denied&error_code=otp_expired', search: '' }, '/'),
            true
        );
    });

    test('PKCE só é recuperação na própria página de reset', () => {
        const partes = { hash: '', search: 'code=pkce-123' };
        assert.equal(pareceLinkDeRecuperacao(partes, '/reset-password'), true);
        // Em outra página, `?code=` é o callback do OAuth (Google) e NÃO
        // pode ser tratado como recuperação.
        assert.equal(pareceLinkDeRecuperacao(partes, '/auth/callback'), false);
    });

    test('uma URL comum não é link de recuperação', () => {
        assert.equal(pareceLinkDeRecuperacao({ hash: '', search: '' }, '/dashboard'), false);
        assert.equal(pareceLinkDeRecuperacao({ hash: '', search: 'tab=licenses' }, '/dashboard'), false);
    });

    test('o destino preserva o token (fragmento e query)', () => {
        assert.equal(
            urlDeRedirecionamentoParaReset({ hash: 'access_token=abc&type=recovery', search: '' }),
            '/reset-password#access_token=abc&type=recovery'
        );
        assert.equal(
            urlDeRedirecionamentoParaReset({ hash: '', search: 'code=pkce' }),
            '/reset-password?code=pkce'
        );
    });
});

describe('o token de recuperação NÃO abre sessão no site', () => {
    test('o cliente do navegador desliga a detecção automática no link', () => {
        assert.match(clienteSupabase, /detectSessionInUrl: !linkDeRecuperacao/);
        assert.match(clienteSupabase, /pareceLinkDeRecuperacao/);
    });

    test('o contexto encaminha o link para /reset-password', () => {
        assert.match(contexto, /pareceLinkDeRecuperacao/);
        assert.match(contexto, /urlDeRedirecionamentoParaReset/);
        assert.match(contexto, /window\.location\.replace/);
    });
});

describe('depois de trocar a senha, o usuário vai para o painel', () => {
    test('não há mais signOut expulsando o usuário da própria conta', () => {
        assert.ok(
            !/auth\.signOut\(\)/.test(resetPage),
            'o signOut depois da troca jogava o usuário no login'
        );
        assert.match(resetPage, /router\.replace\('\/dashboard'\)/);
    });

    test('a tela de login pede o link com o destino certo e sem `alert`', () => {
        assert.match(loginPage, /redirectTo: `\$\{window\.location\.origin\}\/reset-password`/);
        assert.ok(!/alert\("Email enviado!"\)/.test(loginPage), 'a confirmação usa alert cru');
        assert.match(loginPage, /setRecoverySent\(true\)/);
    });
});

describe('a interpretação do link continua correta', () => {
    test('fragmento válido', () => {
        const r = interpretRecoveryLink({
            hash: 'access_token=abc&refresh_token=xyz',
            search: '',
        });
        assert.equal(r.kind, 'implicit');
    });

    test('PKCE', () => {
        const r = interpretRecoveryLink({ hash: '', search: 'code=abc' });
        assert.equal(r.kind, 'pkce');
    });

    test('link expirado', () => {
        const r = interpretRecoveryLink({ hash: 'error_code=otp_expired', search: '' });
        assert.equal(r.kind, 'error');
    });
});
