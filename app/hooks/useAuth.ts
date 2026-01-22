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

// Cache para evitar múltiplas requisições
let authCache: {
  user: User | null;
  isAdmin: boolean;
  profile: any | null;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos (aumentado)
const TIMEOUT_DURATION = 10000; // 10 segundos

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    profile: null,
    loading: true,
    error: null
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  const supabaseRef = useRef(createClient());

  // Função para limpar timeout
  const clearAuthTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Função para verificar se o cache é válido
  const isCacheValid = useCallback(() => {
    if (!authCache) return false;
    return Date.now() - authCache.timestamp < CACHE_DURATION;
  }, []);

  // Função para obter usuário com timeout e retry
  const getCurrentUser = useCallback(async (): Promise<void> => {
    try {
      // Verificar cache primeiro
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

      // Configurar timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          reject(new Error('Timeout ao carregar autenticação'));
        }, TIMEOUT_DURATION);
      });

      // Promise para obter usuário
      const userPromise = supabaseRef.current.auth.getUser();

      // Race entre timeout e requisição
      const { data: { user }, error } = await Promise.race([
        userPromise,
        timeoutPromise
      ]);

      clearAuthTimeout();

      if (error) {
        // Ignorar erro de sessão ausente, tratar como não autenticado
        if (error.name === 'AuthSessionMissingError' || error.message?.includes('Auth session missing')) {
          // Não lançar erro, user será undefined e cairá no bloco else do if(user)
        } else {
          throw error;
        }
      }

      if (user) {
        // Buscar perfil completo
        const profilePromise = supabaseRef.current
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        const adminTimeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Timeout ao verificar admin')), 5000);
        });
        let profile;
        try {
          const result = await Promise.race([profilePromise, adminTimeoutPromise]);
          profile = result.data;
        } catch (profileError) {
          console.warn('Erro ao buscar perfil, assumindo vazio:', profileError);
          profile = null;
        }
        const isAdmin = profile?.is_admin || false;
        // Atualizar cache
        authCache = {
          user,
          isAdmin,
          profile,
          timestamp: Date.now()
        };
        setAuthState({
          user,
          isAdmin,
          profile,
          loading: false,
          error: null
        });
        retryCountRef.current = 0; // Reset retry count on success
      } else {
        // Usuário não autenticado
        authCache = {
          user: null,
          isAdmin: false,
          profile: null,
          timestamp: Date.now()
        };
        setAuthState({
          user: null,
          isAdmin: false,
          profile: null,
          loading: false,
          error: null
        });
        retryCountRef.current = 0;
      }
    } catch (error: any) {
      clearAuthTimeout();

      // Silenciar erro de sessão faltando
      if (error?.name === 'AuthSessionMissingError' || error?.message?.includes('Auth session missing')) {
        // Usuário não autenticado
        authCache = {
          user: null,
          isAdmin: false,
          profile: null,
          timestamp: Date.now()
        };
        setAuthState({
          user: null,
          isAdmin: false,
          profile: null,
          loading: false,
          error: null
        });
        retryCountRef.current = 0;
        return;
      }

      console.error('Erro no useAuth:', error); // Se todas as tentativas falharam, usar cache antigo se disponível
      if (authCache) {
        setAuthState({
          user: authCache.user,
          isAdmin: authCache.isAdmin,
          profile: authCache.profile,
          loading: false,
          error: 'Erro de conexão - usando dados em cache'
        });
      } else {
        setAuthState({
          user: null,
          isAdmin: false,
          profile: null,
          loading: false,
          error: 'Erro ao carregar autenticação'
        });
      }
    }
  }, [clearAuthTimeout, isCacheValid]);

  useEffect(() => {
    getCurrentUser();

    // Removido listener de mudanças de auth para evitar atualizações automáticas
    // const { data: { subscription } } = supabase.auth.onAuthStateChange(...)

    return () => {
      clearAuthTimeout();
      // subscription.unsubscribe();
    };
  }, [getCurrentUser, clearAuthTimeout]);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabaseRef.current.auth.signOut();
      if (error) {
        console.error('Erro ao fazer logout:', error);
        return { success: false, error };
      }

      // Limpar cache
      authCache = null;

      setAuthState({
        user: null,
        isAdmin: false,
        profile: null,
        loading: false,
        error: null
      });

      return { success: true };
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      return { success: false, error };
    }
  }, []);

  // Função para forçar refresh dos dados
  const refreshAuth = useCallback(() => {
    authCache = null;
    retryCountRef.current = 0;
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    getCurrentUser();
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