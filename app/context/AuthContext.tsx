'use client';

import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  profile: any | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  signOut: () => Promise<{ success: boolean; error?: any }>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    profile: null,
    loading: true,
    error: null,
  });

  // Usar ref para o cliente Supabase — evita recriar em cada render
  const supabaseRef = useRef(createClient());
  // Evitar chamadas paralelas simultâneas
  const fetchingRef = useRef(false);

  const fetchProfile = useCallback(async (user: User | null) => {
    if (!user) {
      setAuthState({ user: null, isAdmin: false, profile: null, loading: false, error: null });
      return;
    }

    try {
      const { data: profile } = await supabaseRef.current
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setAuthState({
        user,
        isAdmin: profile?.is_admin ?? false,
        profile: profile ?? null,
        loading: false,
        error: null,
      });
    } catch {
      setAuthState({ user, isAdmin: false, profile: null, loading: false, error: null });
    }
  }, []);

  useEffect(() => {
    const supabase = supabaseRef.current;

    // 1. Tentar pegar a sessão imediatamente para reduzir o tempo de "loading"
    const checkInitialSession = async () => {
      // Se já estamos buscando via onAuthStateChange, não precisamos repetir
      if (fetchingRef.current) return;
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && !authState.user) {
          await fetchProfile(session.user);
        } else if (!session && authState.loading) {
          // Se não tem sessão e ainda consta como carregando, liberar
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (err) {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    checkInitialSession();

    // 2. onAuthStateChange - Fonte de verdade para eventos subsequentes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Evitar chamadas paralelas se já estivermos gerenciando uma mudança
      if (fetchingRef.current) return;
      fetchingRef.current = true;

      try {
        if (event === 'SIGNED_OUT') {
          setAuthState({ user: null, isAdmin: false, profile: null, loading: false, error: null });
        } else if (session?.user) {
          await fetchProfile(session.user);
        } else if (event === 'INITIAL_SESSION' && !session) {
          setAuthState({ user: null, isAdmin: false, profile: null, loading: false, error: null });
        }
      } finally {
        fetchingRef.current = false;
      }
    });

    // 3. Fallback de Segurança - Garantir que o loading não fique travado para sempre
    const timer = setTimeout(() => {
      setAuthState(prev => {
        if (prev.loading) return { ...prev, loading: false };
        return prev;
      });
    }, 5000); // 5 segundos de limite máximo para o spinner de auth

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [fetchProfile, authState.user, authState.loading]);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabaseRef.current.auth.signOut();
      if (error) return { success: false, error };
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    const { data: { session } } = await supabaseRef.current.auth.getSession();
    await fetchProfile(session?.user ?? null);
  }, [fetchProfile]);

  return (
    <AuthContext.Provider value={{ ...authState, signOut, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Fora do AuthProvider (ex: prerender SSG) — retorna estado neutro
    return {
      user: null,
      isAdmin: false,
      profile: null,
      loading: false,
      error: null,
      signOut: async () => ({ success: false }),
      refreshAuth: async () => {},
    } as AuthContextValue;
  }
  return ctx;
}
