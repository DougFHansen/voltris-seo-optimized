'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  profile: any | null;
  loading: boolean;
  error: string | null;
}

// Cache de módulo para evitar múltiplas requisições entre componentes
let authCache: {
  user: User | null;
  isAdmin: boolean;
  profile: any | null;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    profile: null,
    loading: true,
    error: null
  });

  const supabaseRef = useRef(createClient());

  const isCacheValid = useCallback(() => {
    if (!authCache) return false;
    return Date.now() - authCache.timestamp < CACHE_DURATION;
  }, []);

  const fetchAndSetUser = useCallback(async (user: User | null) => {
    if (!user) {
      authCache = { user: null, isAdmin: false, profile: null, timestamp: Date.now() };
      setAuthState({ user: null, isAdmin: false, profile: null, loading: false, error: null });
      return;
    }

    try {
      const { data: profile } = await supabaseRef.current
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const isAdmin = profile?.is_admin || false;

      authCache = { user, isAdmin, profile, timestamp: Date.now() };
      setAuthState({ user, isAdmin, profile, loading: false, error: null });
    } catch {
      // Perfil não encontrado, mas usuário está autenticado
      authCache = { user, isAdmin: false, profile: null, timestamp: Date.now() };
      setAuthState({ user, isAdmin: false, profile: null, loading: false, error: null });
    }
  }, []);

  const getCurrentUser = useCallback(async (): Promise<void> => {
    // Usar cache se válido
    if (isCacheValid() && authCache) {
      setAuthState({
        user: authCache.user,
        isAdmin: authCache.isAdmin,
        profile: authCache.profile,
        loading: false,
        error: null
      });
      return;
    }

    try {
      const { data: { user }, error } = await supabaseRef.current.auth.getUser();

      if (error && error.name !== 'AuthSessionMissingError') {
        throw error;
      }

      await fetchAndSetUser(user ?? null);
    } catch (error: any) {
      if (error?.name === 'AuthSessionMissingError' || error?.message?.includes('Auth session missing')) {
        await fetchAndSetUser(null);
        return;
      }
      // Usar cache antigo se disponível
      if (authCache) {
        setAuthState({ user: authCache.user, isAdmin: authCache.isAdmin, profile: authCache.profile, loading: false, error: null });
      } else {
        setAuthState({ user: null, isAdmin: false, profile: null, loading: false, error: 'Erro ao carregar autenticação' });
      }
    }
  }, [isCacheValid, fetchAndSetUser]);

  useEffect(() => {
    getCurrentUser();

    // Listener ativo para detectar login/logout em tempo real
    const { data: { subscription } } = supabaseRef.current.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Invalidar cache e buscar dados frescos
        authCache = null;
        await fetchAndSetUser(session?.user ?? null);
      } else if (event === 'SIGNED_OUT') {
        authCache = null;
        setAuthState({ user: null, isAdmin: false, profile: null, loading: false, error: null });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [getCurrentUser, fetchAndSetUser]);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabaseRef.current.auth.signOut();
      if (error) return { success: false, error };
      authCache = null;
      setAuthState({ user: null, isAdmin: false, profile: null, loading: false, error: null });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    authCache = null;
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    await getCurrentUser();
  }, [getCurrentUser]);

  return {
    user: authState.user,
    isAdmin: authState.isAdmin,
    profile: authState.profile,
    loading: authState.loading,
    error: authState.error,
    signOut,
    refreshAuth
  };
}
