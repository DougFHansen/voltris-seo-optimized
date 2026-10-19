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

export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { user, isAdmin, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    // Perfil incompleto em conta social (Google): o usuário tem de completar
    // os dados antes de usar o site. `profile === null` significa "ainda
    // carregando" — esperar para não expulsar quem tem o perfil completo.
    if (profile !== null && precisaComplementar(user, profile) && pathname !== '/perfil') {
      router.replace(`/perfil?force=1&redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // MFA Enforcement Logic
    const checkMfa = async () => {
      const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (error) return;
      if (data.nextLevel === 'aal2' && data.currentLevel !== 'aal2') {
        router.push('/login?mfa=challenge');
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
