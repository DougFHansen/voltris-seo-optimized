'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { precisaComplementar } from '@/lib/profile-completeness';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

/**
 * PARA ONDE VOLTAR — com a query string INTEIRA.
 *
 * Antes, o redirecionamento carregava só o `pathname`. O efeito era
 * visível: quem voltava da Stripe caía em `/dashboard?checkout_success=true`
 * e, se a sessão ou o perfil exigissem uma passagem pelo `/login` ou pelo
 * `/perfil`, a query string era DESCARTADA no caminho. O cliente terminava
 * em `/dashboard` sem parâmetro — ou seja, na aba "Visão Geral", sem a aba
 * "Minhas Licenças" e sem o aviso de compra confirmada.
 *
 * Agora o destino é `pathname + search`, e o `/login` e o `/perfil`
 * devolvem o cliente para exatamente onde ele queria ir.
 *
 * A query string é lida de `window.location.search` (e não de
 * `useSearchParams`) de propósito: o AuthGuard é usado em páginas que não
 * declaram `force-dynamic`, e o `useSearchParams` obrigaria cada uma delas
 * a ter uma fronteira de Suspense. Aqui o destino só importa no momento do
 * redirecionamento — ou seja, com a URL da TELA, que é a URL real.
 */
function destinoAtual(pathname: string): string {
  if (typeof window === 'undefined') return pathname;
  const query = window.location.search.replace(/^\?/, '');
  return query ? `${pathname}?${query}` : pathname;
}

export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { user, isAdmin, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    if (loading) return;

    const destinoCompleto = destinoAtual(pathname);

    if (!user) {
      // Guarda o destino: quem voltou da Stripe precisa cair em Minhas Licenças,
      // não na Visão Geral depois de logar.
      router.push(`/login?redirect=${encodeURIComponent(destinoCompleto)}`);
      return;
    }

    // Perfil incompleto em conta social (Google): o usuário tem de completar
    // os dados antes de usar o site. `profile === null` significa "ainda
    // carregando" — esperar para não expulsar quem tem o perfil completo.
    if (profile !== null && precisaComplementar(user, profile) && pathname !== '/perfil') {
      router.replace(`/perfil?force=1&redirect=${encodeURIComponent(destinoCompleto)}`);
      return;
    }

    // MFA Enforcement Logic
    const checkMfa = async () => {
      const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (error) return;
      if (data.nextLevel === 'aal2' && data.currentLevel !== 'aal2') {
        router.push(`/login?mfa=challenge&redirect=${encodeURIComponent(destinoCompleto)}`);
      }
    };
    checkMfa();

    if (requireAdmin && !isAdmin) {
      // Wait until profile is fetched before redirecting
      if (profile === null) return;
      router.push('/dashboard');
    }
  }, [user, isAdmin, profile, loading, requireAdmin, router, pathname]);

  // Enquanto carrega o estado inicial de SESSÃO, não bloqueia nada (para evitar flickering) ou aguarda
  // Mas se já temos o usuário, podemos renderizar, mesmo que o perfil ainda esteja em loading
  if (loading && !user) return null;

  // Sem usuário: não renderiza nada (redirect em andamento)
  if (!user) return null;

  // Perfil social incompleto: não renderiza a página protegida (redirect em andamento)
  if (profile !== null && pathname !== '/perfil' && precisaComplementar(user, profile)) return null;

  if (requireAdmin && !isAdmin) return null;

  return <>{children}</>;
}
