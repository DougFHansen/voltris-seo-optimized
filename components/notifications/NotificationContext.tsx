'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { createClient } from '@/utils/supabase/client';
import NotificationPermissionModal from './NotificationPermissionModal';
import { toast } from 'react-hot-toast';
import { ICONE_POR_TIPO, ROTULO_POR_TIPO, ehVisivelParaCliente } from '@/lib/notification-kinds';
import { ativarPush, lerEstadoPush, type EstadoPush } from '@/lib/push-client';

export type NotificationType =
    | 'ticket' | 'order' | 'system' | 'profile' | 'newsletter' | 'comment'
    | 'ticket_status' | 'license' | 'refund' | 'service';

export type NotificationSound = 'ping' | 'chime' | 'tone';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  sound: NotificationSound;
  created_at: string;
  action_url?: string | null;
  data?: Record<string, unknown> | null;
  audience?: string | null;
}

export interface NotificationSettings {
  notifications_enabled: boolean;
  sound_enabled: boolean;
  notification_categories: NotificationType[];
  sound_theme: string;
  volume: number;
  sound_volume?: number;
}

interface NotificationContextProps {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings | null;
  loading: boolean;
  showPermissionModal: boolean;
  setShowPermissionModal: (show: boolean) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  /** Marca como vistas as notificacoes que o usuario viu em tela. */
  marcarVistas: (ids: string[]) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  /** Permissão do navegador: 'default' | 'granted' | 'denied' | 'unsupported'. */
  browserPermission: NotificationPermission | 'unsupported';
  /** Ativa (ou reativa) as notificações do navegador. */
  enableBrowserNotifications: () => Promise<boolean>;
  /** Houve erro ao falar com o servidor de notificações? */
  error: string | null;
  /** Estado real do Web Push (permissão, inscrição, VAPID). */
  estadoPush: EstadoPush | null;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

/* ------------------------------------------------------------------ Som */

let audioContext: AudioContext | null = null;
let userInteracted = false;
const soundBuffers: Record<string, AudioBuffer | null> = { ping: null, chime: null, tone: null };

/** Arquivos de som que EXISTEM em /public (não inventar arquivo). */
const SOM_ARQUIVO: Record<string, string> = {
    ping: '/ping.wav',
    chime: '/alert.mp3',
    tone: '/tone.wav',
};

async function loadSoundBuffer(sound: string): Promise<AudioBuffer | null> {
    if (typeof window === 'undefined') return null;
    if (!audioContext) {
        const AC = window.AudioContext || (window as any).webkitAudioContext;
        if (!AC) return null;
        audioContext = new AC();
    }
    if (soundBuffers[sound] !== null && soundBuffers[sound] !== undefined) {
        return soundBuffers[sound];
    }
    const src = SOM_ARQUIVO[sound] || SOM_ARQUIVO.ping;
    try {
        const response = await fetch(src);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = await audioContext.decodeAudioData(arrayBuffer);
        soundBuffers[sound] = buffer;
        return buffer;
    } catch (e) {
        console.warn(`[notificações] não foi possível carregar o som ${src}:`, e);
        soundBuffers[sound] = null;
        return null;
    }
}

export async function playNotificationSound(sound: string, volume: number = 0.7) {
    if (typeof window === 'undefined') return;
    if (!sound) return;
    const buffer = await loadSoundBuffer(sound);
    if (!buffer || !audioContext) return;
    if (audioContext.state === 'suspended') {
        try { await audioContext.resume(); } catch { /* bloqueado pelo navegador */ }
    }
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    const gain = audioContext.createGain();
    gain.gain.value = Math.max(0, Math.min(1, volume));
    source.connect(gain).connect(audioContext.destination);
    try {
        source.start(0);
    } catch (e) {
        console.warn('[notificações] falha ao tocar som:', e);
    }
}

function ensureAudioUnlocked() {
    if (userInteracted || typeof window === 'undefined') return;
    try {
        if (!audioContext) {
            const AC = window.AudioContext || (window as any).webkitAudioContext;
            if (AC) audioContext = new AC();
        }
        if (audioContext && audioContext.state === 'suspended') audioContext.resume();
    } catch { /* ignora */ }
    userInteracted = true;
}

/* ------------------------------------------------------------- Provider */

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAdmin } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission | 'unsupported'>(
      typeof window !== 'undefined' && 'Notification' in window ? window.Notification.permission : 'unsupported'
  );
  const [estadoPush, setEstadoPush] = useState<EstadoPush | null>(null);
  const supabase = useRef(createClient());
  const lastNotifId = useRef<string | null>(null);
  const lastPlayedId = useRef<string | null>(null);
  /**
   * Ids que JA estavam no banco quando a tela abriu.
   *
   * Sem isto, toda vez que o usuario entrava no dashboard (ou atualizava a
   * pagina) a notificacao antiga TOCAVA o som e abria o toast de novo — era
   * o "ficar aparecendo" que o operador reclamou. Notificacao que ja estava
   * na lista quando a tela abriu e' historico: ela nao avisa de novo.
   */
  const idsJaCarregados = useRef<Set<string>>(new Set());

  /** Token da sessão (o servidor exige Authorization). */
  const tokenRef = useRef<string | null>(null);

  /* --------------------------------------------------- carregamento */

  const carregarNotificacoes = useCallback(async (silencioso = false) => {
      if (!user) {
        setNotifications([]);
        setLoading(false);
        return;
      }
      if (!silencioso) setLoading(true);
      try {
        const { data: sessao } = await supabase.current.auth.getSession();
        const token = sessao.session?.access_token ?? null;
        tokenRef.current = token;
        if (!token) {
            setNotifications([]);
            return;
        }

        const res = await fetch('/api/notifications?limit=50', {
            cache: 'no-store',
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
            setNotifications([]);
            setError('Sessão expirada. Faça login novamente.');
            return;
        }
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || 'Falha ao carregar notificações.');

        let lista: Notification[] = json.notifications ?? [];
        // Regra do projeto: newsletter e comentário social não são do cliente.
        if (!isAdmin) {
            lista = lista.filter((n) => ehVisivelParaCliente(n.type));
        }
        // Marca como já vistas as que vieram do banco: elas são histórico e
        // não podem tocar o som nem abrir toast de novo a cada entrada.
        for (const n of lista) idsJaCarregados.current.add(n.id);
        setNotifications(lista);
        setError(null);
      } catch (e: any) {
        setError(e?.message || 'Não foi possível carregar as notificações.');
      } finally {
        setLoading(false);
      }
  }, [user, isAdmin]);

  // Configurações (preferências do usuário)
  const carregarConfiguracoes = useCallback(async () => {
      if (!user) {
          setSettings(null);
          return;
      }
      const { data } = await supabase.current
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

      if (!data) {
          const { data: novo } = await supabase.current
              .from('user_settings')
              .insert({
                  user_id: user.id,
                  notifications_enabled: null,
                  sound_enabled: true,
                  notification_categories: ['ticket', 'order', 'system', 'profile'],
                  sound_theme: 'default',
                  volume: 1.0,
              })
              .select()
              .maybeSingle();
          setSettings(novo ?? null);
          setShowPermissionModal(true);
          return;
      }

      setSettings(data);
      if (data.notifications_enabled === null) setShowPermissionModal(true);
  }, [user]);

  useEffect(() => {
      if (!user) {
          setNotifications([]);
          setSettings(null);
          setLoading(false);
          return;
      }
      void (async () => {
          await Promise.all([carregarNotificacoes(), carregarConfiguracoes()]);
          setEstadoPush(await lerEstadoPush());
      })();
  }, [user?.id, isAdmin, carregarNotificacoes, carregarConfiguracoes]);

  /* ---------------------------------------------------------- Realtime */

  useEffect(() => {
      if (!user) return;
      let channel: any = null;
      let ativo = true;

      const supabaseClient = supabase.current;
      channel = supabaseClient
          .channel(`notifications:${user.id}`)
          .on(
              'postgres_changes',
              { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
              (payload: any) => {
                  if (!ativo) return;
                  const nova = payload.new as Notification;
                  if (!nova?.id) return;
                  if (!isAdmin && !ehVisivelParaCliente(nova.type)) return;
                  setNotifications((prev) => (prev.some((n) => n.id === nova.id) ? prev : [nova, ...prev]));
              }
          )
          .subscribe();

      return () => {
          ativo = false;
          if (channel) supabaseClient.removeChannel(channel);
      };
  }, [user?.id, isAdmin]);

  /* ------------------------------------- fallback: polling (sem Realtime) */

  useEffect(() => {
      if (!user) return;
      const intervalo = setInterval(() => {
          // Só sonda com a aba visível: em segundo plano quem cuida é o
          // Realtime (e o navegador não gasta bateria à toa).
          if (typeof document !== 'undefined' && document.hidden) return;
          void carregarNotificacoes(true);
      }, 45_000);
      return () => clearInterval(intervalo);
  }, [user?.id, carregarNotificacoes]);

  /* ------------------------------- som + toast + notificação do navegador */

  useEffect(() => {
      if (!settings || notifications.length === 0) return;
      const latest = notifications[0];
      if (!latest || latest.id === lastNotifId.current) return;
      lastNotifId.current = latest.id;
      // Ja estava na tela quando ela abriu? Entao e' historico: nao avisa de novo.
      if (idsJaCarregados.current.has(latest.id)) return;

      const volume = settings.sound_volume !== undefined
          ? Math.max(0, Math.min(1, settings.sound_volume / 100))
          : (settings.volume ?? 0.7);

      const categoriaAtiva = !settings.notification_categories?.length
          || settings.notification_categories.includes(latest.type);
      const habilitado = settings.notifications_enabled !== false;

      if (settings.sound_enabled && habilitado && categoriaAtiva && latest.sound && !latest.read) {
          if (lastPlayedId.current !== latest.id) {
              void playNotificationSound(latest.sound, volume);
              lastPlayedId.current = latest.id;
          }
      }

      // Toast (sempre, para o usuário saber na hora).
      toast(latest.title + (latest.message ? `\n${latest.message}` : ''), {
          icon: ICONE_POR_TIPO[latest.type] === 'license' ? '🪪' : ICONE_POR_TIPO[latest.type] === 'ticket' ? '🎫' : '🔔',
          duration: 6000,
          style: {
              background: '#18181b',
              color: '#fff',
              border: '1px solid #8B31FF',
              fontWeight: 500,
          },
      });

      // Notificação do navegador (desktop e mobile). Só quando a aba está em
      // segundo plano — senão o toast já resolve e duplica.
      if (typeof document !== 'undefined' && document.hidden && habilitado) {
          mostrarNotificacaoDoNavegador(latest, settings);
      }
  }, [notifications, settings]);

  /* --------------------------------- desbloqueio de áudio na 1ª interação */

  useEffect(() => {
      if (typeof document === 'undefined') return;
      document.addEventListener('click', ensureAudioUnlocked, { once: true });
      return () => document.removeEventListener('click', ensureAudioUnlocked);
  }, []);

  /* ---------------------------------------------------------- ações */

  const unreadCount = notifications.filter((n) => !n.read).length;

  const marcarComoLidaNoServidor = useCallback(async (ids: string[] | 'all') => {
      const token = tokenRef.current;
      if (!token) return false;
      const res = await fetch('/api/notifications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(ids === 'all' ? { all: true } : { ids }),
      });
      if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          setError(json?.error || 'Não foi possível marcar as notificações como lidas.');
          return false;
      }
      return true;
  }, []);

  const markAsRead = useCallback(async (id: string) => {
      if (!user) return;
      // Otimista: a tela responde na hora; se o servidor recusar, revertemos.
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      const ok = await marcarComoLidaNoServidor([id]);
      if (!ok) {
          setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: false } : n)));
      }
  }, [user, marcarComoLidaNoServidor]);

  const markAllAsRead = useCallback(async () => {
      if (!user) return;
      const anteriores = notifications;
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      const ok = await marcarComoLidaNoServidor('all');
      if (!ok) setNotifications(anteriores);
  }, [user, notifications, marcarComoLidaNoServidor]);

  /**
   * Marca como VISTAS as notificacoes que apareceram em tela.
   *
   * E o que um sistema profissional faz: o que o usuario viu, ele leu. Sem
   * isto, o sino continuava apontando para avisos ja lidos e a notificacao
   * "reaparecia" toda vez que a pagina era recarregada.
   */
  const marcarVistas = useCallback(async (ids: string[]) => {
      if (!user || !ids.length) return;
      const unicas = [...new Set(ids)];
      if (!unicas.length) return;
      setNotifications((prev) => prev.map((n) => (unicas.includes(n.id) ? { ...n, read: true } : n)));
      const ok = await marcarComoLidaNoServidor(unicas);
      if (!ok) {
          setNotifications((prev) => prev.map((n) => (unicas.includes(n.id) ? { ...n, read: false } : n)));
      }
  }, [user, marcarComoLidaNoServidor]);

  const refreshNotifications = useCallback(async () => {
      await carregarNotificacoes();
  }, [carregarNotificacoes]);

  const updateSettings = useCallback(async (novo: Partial<NotificationSettings>) => {
      if (!user) return;
      const { data, error: err } = await supabase.current
          .from('user_settings')
          .update(novo)
          .eq('user_id', user.id)
          .select()
          .maybeSingle();
      if (err) {
          setError(err.message || 'Não foi possível salvar as preferências.');
          return;
      }
      if (data) setSettings(data);
  }, [user]);

  const clearAllNotifications = useCallback(async () => {
      if (!user) return;
      const token = tokenRef.current;
      if (!token) return;
      const anteriores = notifications;
      setNotifications([]);
      try {
          const res = await fetch('/api/notifications', {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error('Falha ao limpar as notificações.');
          setError(null);
      } catch (e: any) {
          setNotifications(anteriores);
          setError(e?.message || 'Não foi possível limpar as notificações.');
      }
  }, [user, notifications]);

  const enableBrowserNotifications = useCallback(async () => {
      if (typeof window === 'undefined' || !('Notification' in window)) {
          setBrowserPermission('unsupported');
          return false;
      }
      // Fluxo real: permissão -> service worker -> inscrição de Web Push.
      // Antes só era pedida a permissão e nada era assinado — o usuário
      // achava que tinha ativado, mas o aviso com o site fechado nunca
      // chegava.
      const resultado = await ativarPush();
      setEstadoPush(resultado.estado);
      setBrowserPermission(resultado.estado.permissao);
      if (!resultado.ok && resultado.erro) setError(resultado.erro);
      return resultado.ok;
  }, []);

  const handleActivateNotifications = useCallback(async () => {
      if (user) {
          await updateSettings({ notifications_enabled: true });
          await enableBrowserNotifications();
      }
  }, [user, updateSettings, enableBrowserNotifications]);

  const handleDismissNotifications = useCallback(() => { }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      settings,
      loading,
      error,
      showPermissionModal,
      setShowPermissionModal,
      markAsRead,
      markAllAsRead,
      marcarVistas,
      refreshNotifications,
      updateSettings,
      clearAllNotifications,
      browserPermission,
      enableBrowserNotifications,
      estadoPush,
    }}>
      {user && (
        <NotificationPermissionModal
          onActivate={handleActivateNotifications}
          onDismiss={handleDismissNotifications}
        />
      )}
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Notificação do navegador. Usa o Service Worker quando existe (é o caminho
 * que funciona no Android/iOS e no desktop com aba fechada) e cai para a
 * Web Notification API quando não há SW.
 */
function mostrarNotificacaoDoNavegador(n: Notification, settings: NotificationSettings | null) {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (window.Notification.permission !== 'granted') return;

    const opcoes: NotificationOptions & { actions?: any[] } = {
        body: n.message,
        icon: '/logo-v2.webp',
        badge: '/logo.png',
        tag: `voltris-${n.id}`,
        data: { url: n.action_url || '/dashboard/notifications', id: n.id },
        requireInteraction: false,
    };

    try {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready
                .then((reg) => reg.showNotification(n.title, opcoes as any))
                .catch(() => {
                    new window.Notification(n.title, opcoes as any);
                });
            return;
        }
    } catch { /* cai para a API direta */ }

    try {
        new window.Notification(n.title, opcoes as any);
    } catch (e) {
        console.warn('[notificações] navegador recusou a notificação:', e);
    }
}

export function useNotificationContext() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotificationContext deve ser usado dentro de NotificationProvider');
  return ctx;
}
