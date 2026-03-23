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
    try {
      if (!user) {
        setAuthState(prev => ({ ...prev, user: null, isAdmin: false, profile: null, loading: false }));
        return;
      }

      const { data: profile, error } = await supabaseRef.current
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('[AUTH] Erro ao buscar perfil:', error.message);
      }

      setAuthState({
        user,
        isAdmin: profile?.is_admin ?? false,
        profile: profile ?? null,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      console.error('[AUTH] Falha inesperada no fetchProfile:', err);
      setAuthState(prev => ({ ...prev, loading: false, user }));
    }
  }, []);

  useEffect(() => {
    const supabase = supabaseRef.current;
    let mounted = true;

    async function initSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          if (session?.user) {
            await fetchProfile(session.user);
          } else {
            setAuthState(prev => ({ ...prev, loading: false }));
          }
        }
      } catch (err) {
        if (mounted) setAuthState(prev => ({ ...prev, loading: false }));
      }
    }

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setAuthState({ user: null, isAdmin: false, profile: null, loading: false, error: null });
      } else if (session?.user) {
        await fetchProfile(session.user);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

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
