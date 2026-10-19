/**
 * LÓGICA DA RECUPERAÇÃO DE SENHA (VOLTRIS BRASIL)
 * =================================================
 *
 * Fica fora do componente por dois motivos práticos:
 *
 *  1. Next.js só permite exportar `default` e algumas constantes de rota de um
 *     arquivo `page.tsx` — exportar função de página quebra a validação de
 *     tipos do `.next/types`.
 *  2. Separar a lógica permite TESTÁ-LA sem navegador e sem Supabase, que é o
 *     que a Parte 15 exige: 25 cenários de recuperação, dos quais a maioria
 *     não precisa de rede.
 *
 * -------------------------------------------------------------------------
 * O QUE ESTAVA QUEBRADO
 * -------------------------------------------------------------------------
 * O link de recuperação do Supabase chega em um de dois formatos, e o projeto
 * não tratava nenhum:
 *
 *   IMPLÍCITO  /reset-password#access_token=…&type=recovery
 *               O fragmento NUNCA é enviado ao servidor — só o navegador o vê.
 *
 *   PKCE       /reset-password?code=…
 *
 * A página antiga ignorava os dois e chamava `updateUser()` na primeira vez
 * que alguém clicava em "Redefinir". Isso produzia exatamente os dois sintomas
 * relatados:
 *
 *   - erro que impede concluir a redefinição
 *       Um link expirado chega como `#error=otp_expired&error_code=…`. A
 *       página não lia isso, mostrava um formulário normal, e o usuário só
 *       descobria a falha ao enviar.
 *
 *   - "o site apareceu como se minha conta estivesse logada"
 *       O supabase-js absorve o token do fragmento e abre sessão. Isso é o
 *       comportamento OFICIAL do Supabase, e não uma sessão velha que
 *       sobreviveu ao logout: é a SESSÃO DE RECUPERAÇÃO, criada
 *       legitimamente pelo link. O que faltava era dizer isso ao usuário.
 */

/** Mínimo de senha, igual ao exigido no cadastro. */
export const MIN_PASSWORD_LENGTH = 8;

export interface PasswordCheck {
    ok: boolean;
    label: string;
}

export function validatePassword(pw: string): PasswordCheck[] {
    return [
        { ok: pw.length >= MIN_PASSWORD_LENGTH, label: `Pelo menos ${MIN_PASSWORD_LENGTH} caracteres` },
        { ok: /[A-Za-z]/.test(pw), label: 'Ao menos uma letra' },
        { ok: /\d/.test(pw), label: 'Ao menos um número' },
    ];
}

export function isPasswordAcceptable(pw: string): boolean {
    return validatePassword(pw).every((c) => c.ok);
}

export function passwordsMatch(a: string, b: string): boolean {
    return a.length > 0 && a === b;
}

// ---------------------------------------------------------------------------
// Interpretação do link
// ---------------------------------------------------------------------------

export type RecoveryErrorReason = 'expired' | 'malformed' | 'missing';

export type RecoveryLinkState =
    | { status: 'checking' }
    | { status: 'valid'; hasPasswordIdentity: boolean }
    | { status: 'invalid'; reason: RecoveryErrorReason; message: string };

/** Entrada crua da URL, isolada para poder ser testada sem `window`. */
export interface RecoveryUrlParts {
    hash: string;
    search: string;
}

/** Lê `window.location` isoladamente, para injetar em teste. */
export function readLocationParts(): RecoveryUrlParts {
    if (typeof window === 'undefined') return { hash: '', search: '' };
    const raw = window.location.hash;
    return {
        hash: raw.startsWith('#') ? raw.slice(1) : raw,
        search: window.location.search.startsWith('?') ? window.location.search.slice(1) : window.location.search,
    };
}

/**
 * Interpreta a URL do link SEM tocar em rede.
 *
 * Devolve o que fazer, não o resultado da chamada: quem executa é o chamador,
 * porque `setSession`/`exchangeCodeForSession` são assíncronos. Separar as duas
 * responsabilidades é o que permite testar os 4 formatos de link — válido,
 * expirado, inválido e ausente — sem Supabase nenhum.
 */
export function interpretRecoveryLink(parts: RecoveryUrlParts):
    | { kind: 'error'; reason: RecoveryErrorReason; message: string }
    | { kind: 'pkce'; code: string }
    | { kind: 'implicit'; accessToken: string; refreshToken: string }
    | { kind: 'validating' } {

    // A URL é fronteira de confiança: o parser não pode depender de o chamador
    // ter limpado o "#". Sem esta normalização, `URLSearchParams` leria a
    // chave como "#access_token" e o link válido cairia no caso "sem token",
    // exibindo "link inválido" para quem clicou num link perfeito.
    const rawHash = parts.hash ?? '';
    const hash = (rawHash.startsWith('#') ? rawHash.slice(1) : rawHash).replace(/^\/+/, '');
    const rawSearch = parts.search ?? '';
    const search = rawSearch.startsWith('?') ? rawSearch.slice(1) : rawSearch;

    const hashParams = new URLSearchParams(hash);
    const query = new URLSearchParams(search);

    // 1. Erro explícito — link expirado, já usado ou token inválido.
    const code = hashParams.get('error_code') || query.get('error_code');
    const name = hashParams.get('error') || query.get('error');
    const desc = hashParams.get('error_description') || query.get('error_description');

    if (code || name) {
        // Só `otp_expired` é expiração. `otp_disabled` significa que o
        // envio por e-mail está DESLIGADO no projeto — problema de
        // configuração, não de link vencido, e a orientação ao usuário é outra.
        const expirado = /otp_expired/i.test(`${code ?? ''} ${name ?? ''}`);
        return {
            kind: 'error',
            reason: expirado ? 'expired' : 'malformed',
            message: expirado
                ? 'Este link expirou ou já foi utilizado. Links de redefinição valem por pouco tempo e só podem ser usados uma vez.'
                : desc
                    ? `Não foi possível validar este link: ${desc}`
                    : 'Não foi possível validar este link de redefinição.',
        };
    }

    // 2. PKCE.
    const pkce = query.get('code');
    if (pkce) return { kind: 'pkce', code: pkce };

    // 3. Implícito.
    const at = hashParams.get('access_token');
    const rt = hashParams.get('refresh_token');
    if (at && rt) return { kind: 'implicit', accessToken: at, refreshToken: rt };

    // 4. Sem token nenhum.
    return {
        kind: 'error',
        reason: 'missing',
        message:
            'Esta página só funciona a partir do link enviado por e-mail. Se você abriu a página diretamente, o endereço não carrega a autorização necessária.',
    };
}

/**
 * O usuário tem senha local?
 *
 * Conta criada só com Google não tem identidade `email`. Definir a senha nela
 * CRIA uma segunda identidade — o acesso por Google continua funcionando. Isso
 * é comportamento legítimo, mas precisa ser dito, porque a alternativa
 * (recusar) deixaria quem entrou por Google sem caminho para senha.
 */
export function hasPasswordIdentity(identities: Array<{ provider?: string }> | null | undefined): boolean {
    const list = identities ?? [];
    // Sem metadado de identidades, não se inventa restrição: o `updateUser`
    // decide. Bloquear aqui deixaria contas legítimas sem acesso.
    if (list.length === 0) return true;
    return list.some((i) => i.provider === 'email');
}

// ---------------------------------------------------------------------------
// Mensagens de erro do Supabase, traduzidas para algo acionável
// ---------------------------------------------------------------------------

/**
 * `updateUser` devolve mensagens cruas em inglês. Um erro cru é exatamente o
 * defeito relatado ("surge um erro que não consigo ver"), então cada caso
 * conhecido vira uma frase que diz o que fazer.
 */
export function explainUpdateError(message: string): string {
    const m = (message ?? '').toLowerCase();
    if (/session|token|jwt|expired|invalid/i.test(m)) {
        return 'Sua sessão de recuperação expirou. Peça um novo link para redefinir a senha.';
    }
    if (/new password should be different/i.test(m)) {
        return 'A nova senha precisa ser diferente da senha atual.';
    }
    if (/same as the old/i.test(m)) {
        return 'A nova senha precisa ser diferente da senha atual.';
    }
    if (/email.*confirm|not confirmed/i.test(m)) {
        return 'Este e-mail ainda não foi confirmado no cadastro. Confirme-o antes de redefinir a senha.';
    }
    if (/rate|too many/i.test(m)) {
        return 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente de novo.';
    }
    return message || 'Não foi possível redefinir a senha. Tente novamente.';
}
