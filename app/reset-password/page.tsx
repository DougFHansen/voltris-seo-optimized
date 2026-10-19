'use client';

/**
 * PÁGINA "CRIAR NOVA SENHA" — VOLTRIS BRASIL
 * ============================================
 *
 * Esta página é a ponta visível do fluxo; a lógica está em
 * `lib/password-recovery.ts` (o Next.js não permite exportar funções de um
 * `page.tsx`, e assim ela também fica testável sem navegador).
 *
 * O que mudou em relação à versão anterior, e por quê:
 *
 * 1. RESOLVE O LINK nos dois formatos do Supabase (fragmento e PKCE).
 *    Antes, nenhum era lido: a página aparecia e o `updateUser()` era chamado
 *    no primeiro clique, falhando.
 *
 * 2. DISTINGUE link válido de expirado. Um `#error=otp_expired` no fragmento
 *    era engolido; agora vira uma tela que explica e oferece um novo link.
 *
 * 3. SINALIZA QUE HÁ SESSÃO DE RECUPERAÇÃO. O usuário relatou "o site
 *    apareceu como se minha conta estivesse logada". Isso é o comportamento
 *    oficial do Supabase — o token do link abre sessão. Dizer isso na tela
 *    resolve a confusão melhor do que forçar um logout que quebraria a
 *    própria redefinição.
 *
 * 4. EXIGE contexto de recuperação antes de habilitar o formulário. É o que
 *    impede que uma sessão de outra conta altere esta senha.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FiEye, FiEyeOff, FiAlertTriangle, FiCheckCircle, FiMail } from 'react-icons/fi';
import {
    interpretRecoveryLink,
    readLocationParts,
    validatePassword,
    isPasswordAcceptable,
    passwordsMatch,
    hasPasswordIdentity,
    explainUpdateError,
    type RecoveryLinkState,
} from '@/lib/password-recovery';

export default function ResetPasswordPage() {
    const [link, setLink] = useState<RecoveryLinkState>({ status: 'checking' });
    const [email, setEmail] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [resending, setResending] = useState(false);

    const router = useRouter();
    const supabase = useMemo(() => createClient(), []);
    const mounted = useRef(true);

    const checks = validatePassword(password);
    const passwordOk = isPasswordAcceptable(password);
    const match = passwordsMatch(password, confirm);

    useEffect(() => {
        mounted.current = true;

        (async () => {
            const parsed = interpretRecoveryLink(readLocationParts());

            if (parsed.kind === 'error') {
                setLink({ status: 'invalid', reason: parsed.reason, message: parsed.message });
                return;
            }

            if (parsed.kind === 'validating') {
                setLink({
                    status: 'invalid',
                    reason: 'missing',
                    message: 'Não foi possível ler o link de recuperação.',
                });
                return;
            }

            // Executa a troca de token. O erro vira mensagem ACTIONÁVEL, nunca
            // um "erro" cru que o usuário não sabe o que fazer.
            try {
                const { data, error: sessionError } =
                    parsed.kind === 'pkce'
                        ? await supabase.auth.exchangeCodeForSession(parsed.code)
                        : await supabase.auth.setSession({
                            access_token: parsed.accessToken,
                            refresh_token: parsed.refreshToken,
                        });

                if (sessionError || !data.session) {
                    setLink({
                        status: 'invalid',
                        reason: 'expired',
                        message: 'Este link expirou ou já foi utilizado. Peça um novo para continuar.',
                    });
                    return;
                }

                // Consome o fragmento: sem isso o botão "voltar" do navegador
                // reapresenta a URL com o token, e um refresh reexecuta a troca.
                window.history.replaceState({}, '', window.location.pathname);

                if (mounted.current) {
                    setEmail(data.session.user?.email ?? null);
                    setLink({
                        status: 'valid',
                        hasPasswordIdentity: hasPasswordIdentity(data.session.user?.identities),
                    });
                }
            } catch {
                if (mounted.current) {
                    setLink({
                        status: 'invalid',
                        reason: 'malformed',
                        message: 'Não foi possível validar este link. Peça um novo para continuar.',
                    });
                }
            }
        })();

        // Um PASSWORD_RECOVERY tardio revalida a tela.
        const { data: sub } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
            if (!mounted.current) return;
            if (event === 'PASSWORD_RECOVERY' && session) {
                setEmail(session.user?.email ?? null);
                setLink({
                    status: 'valid',
                    hasPasswordIdentity: hasPasswordIdentity(session.user?.identities),
                });
            }
        });

        return () => {
            mounted.current = false;
            sub.subscription.unsubscribe();
        };
    }, [supabase]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!passwordOk) {
            setError('A senha não atende aos requisitos mínimos.');
            return;
        }
        if (!match) {
            setError('As senhas não coincidem.');
            return;
        }

        setLoading(true);
        try {
            const { error: updateError } = await supabase.auth.updateUser({ password });
            if (updateError) {
                setError(explainUpdateError(updateError.message));
                return;
            }

            setSuccess(true);

            // O signOut vem DEPOIS da troca. Antes disso ele destruiria
            // exatamente a sessão que autorizou a troca.
            window.setTimeout(async () => {
                try { await supabase.auth.signOut(); } catch { /* senha já trocada */ }
                router.replace('/login?senha=alterada');
            }, 2500);
        } finally {
            setLoading(false);
        }
    };

    const resend = async () => {
        if (!email) { router.push('/login?modo=recuperar'); return; }
        setResending(true);
        try {
            await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            router.push('/login?link=reenviado');
        } finally {
            setResending(false);
        }
    };

    return (
        <>
            <Header />
            <div className="pt-16 sm:pt-20 bg-gray-50 min-h-screen flex items-center justify-center px-4 py-10">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-200">

                    {link.status === 'checking' && (
                        <div className="text-center py-8" role="status" aria-live="polite">
                            <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="mt-4 text-sm text-gray-600">Validando seu link…</p>
                        </div>
                    )}

                    {link.status === 'invalid' && (
                        <div role="alert">
                            <div className="flex items-start gap-3 mb-4">
                                <FiAlertTriangle className="text-amber-500 mt-1 shrink-0" size={22} />
                                <h2 className="text-xl font-bold text-gray-900">Link inválido</h2>
                            </div>
                            <p className="text-sm text-gray-700 mb-6">{link.message}</p>
                            <button
                                onClick={resend}
                                disabled={resending}
                                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white font-semibold transition-all disabled:opacity-50"
                            >
                                {resending ? 'Enviando…' : 'Enviar um novo link'}
                            </button>
                            <Link href="/login" className="mt-4 block text-center text-sm text-purple-600 hover:underline">
                                Voltar para o login
                            </Link>
                        </div>
                    )}

                    {link.status === 'valid' && !success && (
                        <>
                            <h2 className="text-2xl font-bold text-center mb-1 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600">
                                Criar nova senha
                            </h2>
                            <p className="text-center text-sm text-gray-500 mb-6 break-all">{email}</p>

                            {!link.hasPasswordIdentity && (
                                <div className="mb-5 flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
                                    <FiMail className="mt-0.5 shrink-0 text-blue-500" size={16} />
                                    <p className="text-xs text-blue-800">
                                        Sua conta usa login por Google. Ao definir a senha, ela passa a ser uma
                                        segunda forma de entrar — seu acesso por Google continua igual.
                                    </p>
                                </div>
                            )}

                            <form onSubmit={submit} noValidate>
                                <div className="mb-4">
                                    <label htmlFor="password" className="block text-gray-900 text-sm font-bold mb-2">
                                        Nova senha
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPw ? 'text' : 'password'}
                                            id="password"
                                            autoComplete="new-password"
                                            className="w-full px-4 py-2 pr-11 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:border-purple-400 focus:outline-none"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            aria-describedby="password-reqs"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPw((v) => !v)}
                                            aria-label={showPw ? 'Ocultar senhas' : 'Mostrar senhas'}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <ul id="password-reqs" className="mb-5 space-y-1">
                                    {checks.map((c) => (
                                        <li
                                            key={c.label}
                                            className={`text-xs flex items-center gap-1.5 ${c.ok ? 'text-emerald-600' : 'text-gray-400'}`}
                                        >
                                            <FiCheckCircle size={12} className={c.ok ? '' : 'opacity-30'} />
                                            {c.label}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mb-4">
                                    <label htmlFor="confirmPassword" className="block text-gray-900 text-sm font-bold mb-2">
                                        Confirmar nova senha
                                    </label>
                                    <input
                                        type={showPw ? 'text' : 'password'}
                                        id="confirmPassword"
                                        autoComplete="new-password"
                                        className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:border-purple-400 focus:outline-none"
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        aria-describedby="match-hint"
                                    />
                                    <p id="match-hint" aria-live="polite" className="mt-1 text-xs">
                                        {confirm.length > 0 && !match && (
                                            <span className="text-red-600">As senhas não coincidem.</span>
                                        )}
                                    </p>
                                </div>

                                {error && (
                                    <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !passwordOk || !match}
                                    className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Redefinindo…' : 'Confirmar nova senha'}
                                </button>
                            </form>
                        </>
                    )}

                    {success && (
                        <div className="text-center py-6" role="status" aria-live="polite">
                            <FiCheckCircle className="text-emerald-500 mx-auto mb-4" size={44} />
                            <p className="text-lg font-semibold text-gray-900 mb-1">Senha redefinida!</p>
                            <p className="text-sm text-gray-600">Encerrando a sessão e levando você para o login…</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
