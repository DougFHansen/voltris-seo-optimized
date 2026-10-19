/**
 * TESTES DO FLUXO DE RECUPERAÇÃO DE SENHA (Parte 15 do Corrigir.txt).
 *
 * Cobrem os 25 cenários pedidos, na parte que é verificável sem navegador e
 * sem enviar e-mail. Os que dependem de caixa de e-mail e de navegador real
 * estão marcados como PENDENTES no relatório — declarados, não escondidos.
 *
 * O que estes testes fixam:
 *   - os DOIS formatos de link do Supabase são reconhecidos;
 *   - link expirado/inválido/ausente produz mensagem que DIZ O QUE FAZER;
 *   - a senha só é aceita se atender aos requisitos do produto;
 *   - sessão de Google não é tratada como conta com senha local;
 *   - nada de logout forçado antes da troca (quebraria a redefinição).
 *
 * Rodar: npm test
 */

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';

import {
    interpretRecoveryLink,
    validatePassword,
    isPasswordAcceptable,
    passwordsMatch,
    hasPasswordIdentity,
    explainUpdateError,
    MIN_PASSWORD_LENGTH,
    type RecoveryUrlParts,
} from '../lib/password-recovery.ts';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const AT = 'eyJhbGciOiJIUzI1NiJ9.token-de-acesso';
const RT = 'v1-refresh-token';

function url(hash: string, search = ''): RecoveryUrlParts {
    return { hash, search };
}

describe('referência a arquivos do fluxo', () => {
    test('login envia para /reset-password (formato que a página entende)', async () => {
        const { readFileSync } = await import('node:fs');
        const src = readFileSync('app/login/page.tsx', 'utf8');
        assert.ok(
            src.includes('/reset-password'),
            'o redirectTo precisa apontar para a página que resolve o link'
        );
    });

    test('a página não faz logout antes de trocar a senha', async () => {
        const { readFileSync } = await import('node:fs');
        const src = readFileSync('app/reset-password/page.tsx', 'utf8');
        const idxUpdate = src.indexOf('updateUser({ password })');
        const idxSignOut = src.indexOf('auth.signOut()');
        assert.ok(idxUpdate > 0, 'updateUser precisa existir');
        assert.ok(idxSignOut > 0, 'signOut precisa existir (política pós-troca)');
        assert.ok(
            idxSignOut > idxUpdate,
            'signOut ANTES de updateUser destruiria a sessão de recuperação'
        );
    });

    test('não existe middleware redirecionando a recuperação', async () => {
        const { existsSync } = await import('node:fs');
        assert.equal(
            existsSync('middleware.ts'),
            false,
            'se um middleware passar a existir, ele NÃO pode mandar /reset-password para /dashboard'
        );
    });
});

// ===========================================================================
// Cenário 16/17/18 — link expirado, inválido, reutilizado
// ===========================================================================

describe('link expirado ou inválido é reconhecido e explicado', () => {
    test('otp_expired vira mensagem de expiração, com instrução', () => {
        const r = interpretRecoveryLink(url('error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired'));
        assert.equal(r.kind, 'error');
        if (r.kind !== 'error') return;
        assert.equal(r.reason, 'expired');
        assert.ok(r.message.includes('expirou'));
        assert.ok(
            r.message.includes('Peça um novo') || r.message.includes('utilizado'),
            'a mensagem precisa dizer o que fazer'
        );
    });

    test('token inválido genérico não é tratado como expirado', () => {
        const r = interpretRecoveryLink(url('error=access_denied&error_code=otp_disabled'));
        assert.equal(r.kind, 'error');
        if (r.kind !== 'error') return;
        assert.equal(r.reason, 'malformed');
    });

    test('erro com descrição é repassado ao usuário', () => {
        const r = interpretRecoveryLink(url('error=server_error&error_description=Cadastro+nao+encontrado'));
        assert.equal(r.kind, 'error');
        if (r.kind !== 'error') return;
        assert.ok(r.message.includes('Cadastro nao encontrado'));
    });

    test('erro no QUERY também é lido (não só no fragmento)', () => {
        const r = interpretRecoveryLink(url('', 'error_code=otp_expired&error=access_denied'));
        assert.equal(r.kind, 'error');
        if (r.kind !== 'error') return;
        assert.equal(r.reason, 'expired');
    });

    test('página aberta sem NENHUM token diz que precisa vir do e-mail', () => {
        // Este é o caso do usuário que digita /reset-password na mão.
        const r = interpretRecoveryLink(url(''));
        assert.equal(r.kind, 'error');
        if (r.kind !== 'error') return;
        assert.equal(r.reason, 'missing');
        assert.ok(r.message.includes('link enviado por e-mail'));
    });

    test('hash vazio com query vazia não é interpretado como válido', () => {
        const r = interpretRecoveryLink(url('#'));
        assert.equal(r.kind, 'error');
    });
});

// ===========================================================================
// Cenário 5/6 — link válido nos DOIS formatos
// ===========================================================================

describe('link válido é reconhecido nos dois formatos do Supabase', () => {
    test('formato IMPLÍCITO: token no fragmento', () => {
        // O fragmento NUNCA chega ao servidor. É por isso que a troca tem de
        // acontecer no navegador.
        const r = interpretRecoveryLink(url(`access_token=${AT}&refresh_token=${RT}&type=recovery`));
        assert.equal(r.kind, 'implicit');
        if (r.kind !== 'implicit') return;
        assert.equal(r.accessToken, AT);
        assert.equal(r.refreshToken, RT);
    });

    test('formato PKCE: código na query', () => {
        const r = interpretRecoveryLink(url('', 'code=abc-123'));
        assert.equal(r.kind, 'pkce');
        if (r.kind !== 'pkce') return;
        assert.equal(r.code, 'abc-123');
    });

    test('fragmento SEM refresh_token não é aceito como válido', () => {
        // Sem os dois, não há como renovar a sessão: melhor pedir o link de novo
        // do que exibir um formulário que vai falhar na hora de enviar.
        const r = interpretRecoveryLink(url(`access_token=${AT}`));
        assert.equal(r.kind, 'error');
    });

    test('o link com "#" inicial é tratado igual ao sem "#"', () => {
        // readLocationParts já remove o "#", mas a função não pode depender
        // disso para estar correta.
        const comHash = interpretRecoveryLink(url(`#access_token=${AT}&refresh_token=${RT}`));
        assert.equal(comHash.kind, 'implicit');
    });

    test('parâmetros extras do Supabase não quebram a leitura', () => {
        const r = interpretRecoveryLink(url(
            `access_token=${AT}&refresh_token=${RT}&token_type=bearer&expires_in=3600&type=recovery`
        ));
        assert.equal(r.kind, 'implicit');
    });

    test('erro tem PRECEDÊNCIA sobre token', () => {
        // Se o Supabase mandou os dois, o erro é a informação verdadeira.
        const r = interpretRecoveryLink(url(`error=access_denied&error_code=otp_expired&access_token=${AT}&refresh_token=${RT}`));
        assert.equal(r.kind, 'error');
    });
});

// ===========================================================================
// Cenário 10/11 — senha inválida e senhas diferentes
// ===========================================================================

describe('requisitos de senha', () => {
    test('senha curta é recusada', () => {
        assert.equal(isPasswordAcceptable('Ab1'), false);
    });

    test('senha sem número é recusada', () => {
        assert.equal(isPasswordAcceptable('abcdefghij'), false);
    });

    test('senha sem letra é recusada', () => {
        assert.equal(isPasswordAcceptable('1234567890'), false);
    });

    test('senha válida é aceita', () => {
        assert.equal(isPasswordAcceptable('Voltris2026'), true);
    });

    test('o limite de comprimento é exatamente onde deve estar', () => {
        assert.equal(MIN_PASSWORD_LENGTH, 8);
        // 7 caracteres: tem letra e número, mas é curta demais.
        assert.equal(isPasswordAcceptable('a'.repeat(6) + '1'), false);
        // 8 caracteres, no limite exato: passa.
        assert.equal(isPasswordAcceptable('a'.repeat(7) + '1'), true);
    });

    test('cada requisito é reportado individualmente', () => {
        const checks = validatePassword('Ab1');
        assert.equal(checks.length, 3);
        // Só o primeiro passa: 3 caracteres < 8.
        assert.equal(checks[0].ok, false);
        assert.ok(checks.every((c) => typeof c.label === 'string' && c.label.length > 0));
    });

    test('senhas diferentes são rejeitadas', () => {
        assert.equal(passwordsMatch('Voltris2026', 'Voltris2027'), false);
    });

    test('senhas iguais são aceitas', () => {
        assert.equal(passwordsMatch('Voltris2026', 'Voltris2026'), true);
    });

    test('campo vazio nunca é considerado "coincide"', () => {
        // Sem isso, dois campos vazios liberariam o botão de confirmar.
        assert.equal(passwordsMatch('', ''), false);
    });
});

// ===========================================================================
// Cenário 20 — sessão de outra conta
// ===========================================================================

describe('identidade do usuário', () => {
    test('conta com senha local é reconhecida', () => {
        assert.equal(hasPasswordIdentity([{ provider: 'email' }]), true);
    });

    test('conta só do Google NÃO tem senha local', () => {
        // Parte 15, item 25: não presumir senha local em conta Google.
        assert.equal(hasPasswordIdentity([{ provider: 'google' }]), false);
    });

    test('conta híbrida (Google + e-mail) TEM senha local', () => {
        assert.equal(
            hasPasswordIdentity([{ provider: 'google' }, { provider: 'email' }]),
            true
        );
    });

    test('sem metadado, não se inventa restrição', () => {
        // Bloquear aqui deixaria contas legítimas sem caminho para senha —
        // o `updateUser` do Supabase é quem decide, com autoridade.
        assert.equal(hasPasswordIdentity([]), true);
        assert.equal(hasPasswordIdentity(null), true);
    });
});

// ===========================================================================
// Cenário 22 — erro visível e acionável
// ===========================================================================

describe('erro do Supabase nunca chega cru na tela', () => {
    test('erro de sessão vira instrução para pedir novo link', () => {
        const m = explainUpdateError('Auth session missing');
        assert.ok(!/missing/i.test(m), 'a mensagem crua não pode vazar');
        assert.ok(m.includes('Peça um novo link'));
    });

    test('senha igual à atual é explicada', () => {
        const m = explainUpdateError('New password should be different from the old password');
        assert.ok(m.includes('diferente'));
    });

    test('e-mail não confirmado é explicado', () => {
        const m = explainUpdateError('Email not confirmed');
        assert.ok(m.toLowerCase().includes('confirmado'));
    });

    test('rate limit é explicado', () => {
        const m = explainUpdateError('Too many requests');
        assert.ok(m.includes('tentativas'));
    });

    test('erro desconhecido devolve algo exibível, nunca vazio', () => {
        assert.ok(explainUpdateError('').length > 0);
        assert.ok(explainUpdateError('falha genérica').length > 0);
    });
});

// ===========================================================================
// Parte 16 — integridade: nada de recriar usuário
// ===========================================================================

describe('integridade da conta (Parte 16)', () => {
    test('a página de reset não insere em profiles', async () => {
        const { readFileSync } = await import('node:fs');
        const src = readFileSync('app/reset-password/page.tsx', 'utf8');
        assert.equal(
            /\.from\(\s*['"]profiles['"]\s*\)\s*\.\s*insert/.test(src),
            false,
            'recriar ou inserir perfil na recuperação violaria a Parte 16'
        );
    });

    test('a página não chama signup nem signIn', async () => {
        const { readFileSync } = await import('node:fs');
        const src = readFileSync('app/reset-password/page.tsx', 'utf8');
        assert.equal(/auth\.signUp/.test(src), false, 'signup criaria usuário novo');
        assert.equal(/auth\.signIn/.test(src), false, 'signIn autenticaria outra conta');
    });

    test('a troca é feita só por updateUser com a nova senha', async () => {
        const { readFileSync } = await import('node:fs');
        const src = readFileSync('app/reset-password/page.tsx', 'utf8');
        assert.ok(src.includes('auth.updateUser({ password })'));
    });
});

// ===========================================================================
// Parte 14 — interface obrigatória
// ===========================================================================

describe('a tela entrega o que a Parte 14 exige', () => {
    test('título é "Criar nova senha"', async () => {
        const { readFileSync } = await import('node:fs');
        const src = readFileSync('app/reset-password/page.tsx', 'utf8');
        assert.ok(src.includes('Criar nova senha'));
    });

    test('tem mostrar/ocultar senha', async () => {
        const { readFileSync } = await import('node:fs');
        const src = readFileSync('app/reset-password/page.tsx', 'utf8');
        assert.ok(src.includes('showPw'));
        assert.ok(/Ocultar senhas|Mostrar senhas/.test(src));
    });

    test('tem estado de carregamento', async () => {
        const { readFileSync } = await import('node:fs');
        const src = readFileSync('app/reset-password/page.tsx', 'utf8');
        assert.ok(/Validando seu link/.test(src));
        assert.ok(/Redefinindo/.test(src));
    });

    test('tem mensagem de sucesso', async () => {
        const { readFileSync } = await import('node:fs');
        const src = readFileSync('app/reset-password/page.tsx', 'utf8');
        assert.ok(/Senha redefinida/.test(src));
    });

    test('tem tratamento de link expirado com opção de pedir outro', async () => {
        const { readFileSync } = await import('node:fs');
        const src = readFileSync('app/reset-password/page.tsx', 'utf8');
        assert.ok(/Link inválido/.test(src));
        assert.ok(/Enviar um novo link/.test(src));
    });

    test('erros têm role=alert (anunciados a leitor de tela)', async () => {
        const { readFileSync } = await import('node:fs');
        const src = readFileSync('app/reset-password/page.tsx', 'utf8');
        assert.ok(src.includes('role="alert"'));
    });

    test('é responsivo e não deixa o texto sair da tela', async () => {
        const { readFileSync } = await import('node:fs');
        const src = readFileSync('app/reset-password/page.tsx', 'utf8');
        assert.ok(src.includes('max-w-md'), 'precisa de largura máxima');
        assert.ok(src.includes('px-4'), 'precisa de respiro lateral no mobile');
        assert.ok(src.includes('w-full'), 'o cartão precisa ocupar a largura disponível');
        // A chave da licença e o e-mail podem ser longos: sem quebrar, vazam.
        assert.ok(
            src.includes('break-all') || src.includes('break-words') || src.includes('truncate'),
            'texto longo (e-mail) precisa poder quebrar'
        );
    });

    test('o botão só habilita com senha válida E confirmação', async () => {
        const { readFileSync } = await import('node:fs');
        const src = readFileSync('app/reset-password/page.tsx', 'utf8');
        assert.ok(
            /disabled=\{loading \|\| !passwordOk \|\| !match\}/.test(src),
            'o botão precisa das três condições'
        );
    });
});
