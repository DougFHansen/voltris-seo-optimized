'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { createClient } from '@/utils/supabase/client';
import NotificationPermissionModal from './NotificationPermissionModal';
import { toast } from 'react-hot-toast';

export type NotificationType = 'ticket' | 'order' | 'system' | 'profile' | 'newsletter' | 'comment' | 'ticket_status';
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
}

export interface NotificationSettings {
  notifications_enabled: boolean;
  sound_enabled: boolean;
  notification_categories: NotificationType[];
  sound_theme: string;
  volume: number;
  sound_volume?: number; // Adicionado para suportar o novo volume
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
  refreshNotifications: () => Promise<void>;
  updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

/**
 * NotificationContext fornece:
 * - notifications: lista das notificações do usuário
 * - unreadCount: quantidade de não lidas
 * - settings: configurações do usuário
 * - loading: status de carregamento
 * - showPermissionModal: exibe modal de permissão
 * - setShowPermissionModal: controla modal
 * - markAsRead: marca uma notificação como lida
 * - markAllAsRead: marca todas como lidas
 * - refreshNotifications: recarrega notificações
 * - updateSettings: atualiza configurações
 * - clearAllNotifications: apaga todas as notificações
 */
// Utilitário para tocar som de notificação com Web Audio API e fallback
let audioContext: AudioContext | null = null;
let lastPlayedId: string | null = null;
let userInteracted = false;
let soundBuffers: Record<string, AudioBuffer | null> = { ping: null, chime: null, tone: null };

async function loadSoundBuffer(sound: string): Promise<AudioBuffer | null> {
  if (!audioContext) audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (soundBuffers[sound]) return soundBuffers[sound];
  let src = '/ping.wav';
  if (sound === 'chime') src = '/alert.mp3';
  if (sound === 'tone') src = '/tone.wav';
  try {
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = await audioContext.decodeAudioData(arrayBuffer);
    soundBuffers[sound] = buffer;
    return buffer;
  } catch (e) {
    return null;
  }
}

async function playNotificationSound(sound: string, volume: number = 1, type?: string) {
  // Removido: if (type === 'order') { sound = 'chime'; }
  console.log('[DEBUG] playNotificationSound chamado:', { sound, volume });
  if (!sound) {
    console.warn('[DEBUG] Som não especificado, abortando.');
    return;
  }
  if (!audioContext) audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (audioContext.state === 'suspended') {
    try { await audioContext.resume(); } catch (e) { console.warn('[DEBUG] Falha ao retomar AudioContext:', e); }
  }
  const buffer = await loadSoundBuffer(sound);
  if (!buffer) {
    console.warn('[DEBUG] Buffer de áudio não carregado:', sound);
    return;
  }
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  const gain = audioContext.createGain();
  gain.gain.value = volume;
  source.connect(gain).connect(audioContext.destination);
  try {
    source.start(0);
  } catch (e) {
    console.warn('[DEBUG] Falha ao tocar som:', e);
  }
}

// Detectar bloqueio de autoplay e pedir permissão na primeira interação
function ensureAudioUnlocked() {
  if (userInteracted) return;
  if (!audioContext) audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  userInteracted = true;
}

// Listener global para postMessage (fallback)
function handleNotificationSoundMessage(event: any, settings: NotificationSettings | null) {
  if (event.data && event.data.type === 'PLAY_NOTIFICATION_SOUND') {
    const vol = settings?.sound_volume !== undefined ? Math.max(0, Math.min(1, settings.sound_volume / 100)) : (settings?.volume ?? 0.7);
    playNotificationSound(event.data.sound, vol);
  }
}

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAdmin } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const supabase = useRef(createClient());
  const lastNotifId = useRef<string | null>(null);

  // Carregar notificações e configurações do Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setNotifications([]);
        setSettings(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      // Buscar notificações (últimas 50)
      const { data: notifs, error: notifError } = await supabase.current
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      let filteredNotifs = notifs || [];
      if (!isAdmin) {
        filteredNotifs = filteredNotifs.filter(n => n.type !== 'newsletter' && n.type !== 'comment');
      }
      if (notifError) {
        setNotifications([]);
      } else {
        setNotifications(filteredNotifs);
      }
      // Buscar configurações
      let settingsData = null;
      let settingsError = null;
      const settingsResp = await supabase.current
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      settingsData = settingsResp.data;
      settingsError = settingsResp.error;
      if (settingsError || !settingsData) {
        // Criar registro default se não existir
        const { data: newSettings } = await supabase.current
          .from('user_settings')
          .insert({
            user_id: user.id,
            notifications_enabled: null,
            sound_enabled: true,
            notification_categories: ['ticket', 'order', 'system', 'profile'],
            sound_theme: 'default',
            volume: 1.0
          })
          .select()
          .single();
        setSettings(newSettings);
        setShowPermissionModal(true);
      } else {
        setSettings(settingsData || null);
        if (settingsData && settingsData.notifications_enabled === null) {
          setShowPermissionModal(true);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [user, isAdmin]);

  // SUPABASE REALTIME - deve ser um useEffect separado
  useEffect(() => {
    if (!user) return;
    let channel: any = null;
    const supabaseClient = supabase.current;
    console.log('[Realtime] Registrando canal de notificações (com filtro por user_id)');
    channel = supabaseClient
      .channel('realtime:notifications_admin')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload: any) => {
          console.log('[Realtime] Evento recebido (admin):', payload);
          if (!isAdmin && (payload.new?.type === 'newsletter' || payload.new?.type === 'comment')) return;
          if (payload.eventType === 'INSERT') {
            setNotifications(prev => {
              if (prev.some(n => n.id === payload.new.id)) return prev;
              // Tocar som imediatamente ao receber nova notificação
              if (payload.new.sound) {
                const vol = settings?.sound_volume !== undefined ? Math.max(0, Math.min(1, settings.sound_volume / 100)) : (settings?.volume ?? 0.7);
                playNotificationSound(payload.new.sound, vol, payload.new.type);
              }
              return [payload.new, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            setNotifications(prev => prev.map(n => n.id === payload.new.id ? payload.new : n));
          } else if (payload.eventType === 'DELETE') {
            setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Canal subscribe status (admin):', status);
      });
    return () => {
      if (channel) {
        console.log('[Realtime] Removendo canal de notificações (admin)');
        supabaseClient.removeChannel(channel);
      }
    };
  }, [user?.id, isAdmin, settings]);

  // Realtime: tocar som ao receber nova notificação e exibir toast para ticket_status
  useEffect(() => {
    if (!settings?.sound_enabled) {
      console.log('[DEBUG] Som de notificação desativado nas configurações.');
      return;
    }
    if (notifications.length === 0) return;
    const latest = notifications[0];
    if (latest && latest.id !== lastNotifId.current && !latest.read) {
      console.log('[DEBUG] Nova notificação detectada:', latest);
      if (!latest.sound) {
        console.warn('[DEBUG] Notificação recebida sem campo sound:', latest);
      }
      if (lastPlayedId !== latest.id) {
        const vol = settings.sound_volume !== undefined ? Math.max(0, Math.min(1, settings.sound_volume / 100)) : (settings.volume ?? 0.7);
        playNotificationSound(latest.sound, vol, latest.type); // Passa o tipo para garantir 'order' = 'chime'
        lastPlayedId = latest.id;
      }
      // Exibir toast para ticket_status e pedidos
      if (latest.type === 'ticket_status' || latest.type === 'order') {
        const icon = latest.type === 'order' ? '🛍️' : '🎫';
        toast(latest.title + (latest.message ? ('\n' + latest.message) : ''), {
          icon: icon,
          duration: 6000,
          style: {
            background: '#18181b',
            color: '#fff',
            border: '1px solid #8B31FF',
            fontWeight: 500,
          },
        });
      }
      lastNotifId.current = latest.id;
    }
  }, [notifications, settings]);

  // BroadcastChannel para receber comando do SW
  useEffect(() => {
    if (!settings?.sound_enabled) return;
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      let channel: BroadcastChannel | null = null;
      let messageHandler: any = null;
      if ('BroadcastChannel' in window) {
        channel = new BroadcastChannel('voltris_notifications');
        channel.onmessage = (event) => {
          if (event.data && event.data.type === 'PLAY_NOTIFICATION_SOUND') {
            const vol = settings?.sound_volume !== undefined ? Math.max(0, Math.min(1, settings.sound_volume / 100)) : (settings?.volume ?? 0.7);
            console.log('[DEBUG] BroadcastChannel: comando para tocar som:', event.data);
            playNotificationSound(event.data.sound, vol);
          }
        };
      } else {
        messageHandler = (event: any) => {
          console.log('[DEBUG] postMessage: comando para tocar som:', event.data);
          handleNotificationSoundMessage(event, settings);
        };
        (window as any).addEventListener('message', messageHandler);
      }
      return () => {
        if (channel) channel.close();
        if (messageHandler && typeof window.removeEventListener === 'function') (window as any).removeEventListener('message', messageHandler);
      };
    }
  }, [settings]);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      document.addEventListener('click', ensureAudioUnlocked, { once: true });
      return () => {
        document.removeEventListener('click', ensureAudioUnlocked);
      };
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id: string) => {
    if (!user) return;
    await supabase.current
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = async () => {
    if (!user) return;
    await supabase.current
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const refreshNotifications = async () => {
    if (!user) return;
    setLoading(true);
    const { data: notifs } = await supabase.current
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    setNotifications(notifs || []);
    setLoading(false);
  };

  const refreshSettings = async () => {
    if (!user) return;
    setLoading(true);
    const { data: settingsData } = await supabase.current
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();
    setSettings(settingsData || null);
    setLoading(false);
  };

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    if (!user) return;
    const { data, error } = await supabase.current
      .from('user_settings')
      .update(newSettings)
      .eq('user_id', user.id)
      .select()
      .single();
    if (!error && data) {
      setSettings(data);
      await refreshSettings(); // Garante sincronização após update
    }
  };

  const clearAllNotifications = async () => {
    if (!user) return;
    await supabase.current
      .from('notifications')
      .delete()
      .eq('user_id', user.id);
    setNotifications([]);
  };

  // Função para ativar notificações (chamada pelo modal)
  const handleActivateNotifications = async () => {
    if (user) {
      await supabase.current
        .from('user_settings')
        .update({ notifications_enabled: true })
        .eq('user_id', user.id);
      // Registra o Service Worker
      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.register('/sw.js');
        } catch (e) { /* ignore */ }
      }
      // Atualiza estado local
      setSettings((prev) => prev ? { ...prev, notifications_enabled: true } : prev);
    }
  };
  // Função para ignorar (não faz nada extra)
  const handleDismissNotifications = () => { };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      settings,
      loading,
      showPermissionModal,
      setShowPermissionModal,
      markAsRead,
      markAllAsRead,
      refreshNotifications,
      updateSettings,
      clearAllNotifications
    }}>
      {/* Modal só para usuários autenticados e nunca respondeu (checa localStorage) */}
      {user && <NotificationPermissionModal onActivate={handleActivateNotifications} onDismiss={handleDismissNotifications} />}
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotificationContext() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotificationContext deve ser usado dentro de NotificationProvider');
  return ctx;
} 