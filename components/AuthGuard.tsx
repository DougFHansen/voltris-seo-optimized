'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { user, isAdmin, loading, error } = useAuth();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!loading && !hasRedirected) {
      if (!user) {
        setHasRedirected(true);
        router.push('/login');
        return;
      }

      if (requireAdmin && !isAdmin) {
        setHasRedirected(true);
        router.push('/dashboard');
        return;
      }
    }
  }, [user, isAdmin, loading, requireAdmin, router, hasRedirected]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#171313] text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF4B6B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#171313] text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF4B6B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-400">Redirecionando para login...</p>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#171313] text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF4B6B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-400">Redirecionando para dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 