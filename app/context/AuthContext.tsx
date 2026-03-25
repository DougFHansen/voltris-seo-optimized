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
  // Ref para acessar o estado atual dentro de callbacks (evita stale closure)
  const authStateRef = useRef(authState);
  authStateRef.current = authState;

  const fetchProfile = useCallback(async (user: User | null) => {
    try {
      if (!user) {
        setAuthState(prev => ({ ...prev, user: null, isAdmin: false, profile: null, loading: false }));
        return;
      }

      // CORREÇÃO: Liberar o user IMEDIATAMENTE (loading=false) e buscar profile em background.
      // Isso evita que o dashboard fique travado em "Sincronizando..." quando o Supabase está lento.
      setAuthState(prev => ({
        ...prev,
        user,
        loading: false, // Liberar UI imediatamente com o user
      }));

      // Buscar profile em background (não bloqueia a UI)
      try {
        const { data: profile, error } = await supabaseRef.current
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.warn('[AUTH] Erro ao buscar perfil:', error.message);
        }

        // Atualizar com profile quando chegar (sem setar loading)
        setAuthState(prev => ({
          ...prev,
          user, // Manter user atualizado
          isAdmin: profile?.is_admin ?? prev.isAdmin,
          profile: profile ?? prev.profile,
          error: null,
        }));
      } catch (profileErr: any) {
        console.warn('[AUTH] Perfil indisponível (background):', profileErr.message);
        // Não bloquear — user já está liberado
      }
    } catch (err: any) {
      console.error('[AUTH] Falha inesperada no fetchProfile:', err);
      setAuthState(prev => ({ 
        ...prev, 
        user, 
        loading: false,
        profile: prev.profile || null,
        isAdmin: prev.isAdmin || false 
      }));
    }
  }, []);

  useEffect(() => {
    const supabase = supabaseRef.current;
    let mounted = true;

    async function initSession() {
      // Fail-safe: Se o banco demorar mais de 10s para responder, libera o loading o mais rápido possível.
      const timeout = setTimeout(() => {
        if (mounted) {
          setAuthState(prev => prev.loading ? { ...prev, loading: false } : prev);
          console.warn('[AUTH] Timeout de segurança atingido (10s). Liberando loading forçadamente.');
        }
      }, 10000);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        clearTimeout(timeout);
        
        if (mounted) {
          if (session?.user) {
            setAuthState(prev => ({ ...prev, user: session.user, loading: true }));
            await fetchProfile(session.user);
          } else {
            setAuthState(prev => ({ ...prev, user: null, loading: false }));
          }
        }
      } catch (err) {
        clearTimeout(timeout);
        if (mounted) setAuthState(prev => ({ ...prev, loading: false }));
      }
    }

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setAuthState({ user: null, isAdmin: false, profile: null, loading: false, error: null });
      } else if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED')) {
        // TOKEN_REFRESHED acontece quando o usuário volta para a aba (visibilitychange).
        // NÃO setar loading=true se já temos user+profile — evita flash de "Sincronizando..."
        const isTokenRefresh = event === 'TOKEN_REFRESHED';
        const currentState = authStateRef.current;
        const alreadyHasData = currentState.user && currentState.profile && !currentState.loading;

        if (isTokenRefresh && alreadyHasData) {
          // Refresh silencioso — atualiza user sem mostrar loading
          setAuthState(prev => ({ ...prev, user: session.user }));
          // Buscar perfil em background sem bloquear UI
          fetchProfile(session.user);
        } else {
          // Login inicial ou update de usuário — mostrar loading normalmente
          setAuthState(prev => ({ ...prev, user: session.user, loading: true }));
          await fetchProfile(session.user);
        }
      } else if (event === 'INITIAL_SESSION' && !session) {
        setAuthState(prev => ({ ...prev, loading: false }));
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
