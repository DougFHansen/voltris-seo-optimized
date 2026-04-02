'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { user, isAdmin, profile, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
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
  }, [user, isAdmin, profile, loading, requireAdmin, router]);

  // Enquanto carrega o estado inicial de SESSÃO, não bloqueia nada (para evitar flickering) ou aguarda
  // Mas se já temos o usuário, podemos renderizar, mesmo que o perfil ainda esteja em loading
  if (loading && !user) return null;

  // Sem usuário: não renderiza nada (redirect em andamento)
  if (!user) return null;

  if (requireAdmin && !isAdmin) return null;

  return <>{children}</>;
}
