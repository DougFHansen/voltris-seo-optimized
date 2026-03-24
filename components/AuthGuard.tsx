'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (requireAdmin && !isAdmin) {
      router.push('/dashboard');
    }
  }, [user, isAdmin, loading, requireAdmin, router]);

  // Enquanto carrega o estado inicial de SESSÃO, não bloqueia nada (para evitar flickering) ou aguarda
  // Mas se já temos o usuário, podemos renderizar, mesmo que o perfil ainda esteja em loading
  if (loading && !user) return null;

  // Sem usuário: não renderiza nada (redirect em andamento)
  if (!user) return null;

  if (requireAdmin && !isAdmin) return null;

  return <>{children}</>;
}
