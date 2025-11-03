import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { 
  generateSecureBrowserFingerprint, 
  collectBrowserInfo, 
  supportsPushNotifications,
  getBrowserCompatibility 
} from '../utils/browserFingerprint';
import { getVapidPublicKey } from '../utils/vapid';

export interface PWANotificationState {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  subscription: PushSubscription | null;
  loading: boolean;
  error: string | null;
  browserInfo: ReturnType<typeof collectBrowserInfo> | null;
  browserFingerprint: string | null;
  subscriptionId: string | null;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  platform: string;
}

export interface PWANotificationActions {
  requestPermission: () => Promise<void>;
  subscribeToPushNotifications: () => Promise<void>;
  unsubscribeFromPushNotifications: () => Promise<void>;
  testNotification: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  clearError: () => void;
}

export function usePWANotifications(): PWANotificationState & PWANotificationActions {
  const { user } = useAuth();
  const [state, setState] = useState<PWANotificationState>({
    isSupported: false,
    permission: 'default',
    isSubscribed: false,
    subscription: null,
    loading: false,
    error: null,
    browserInfo: null,
    browserFingerprint: null,
    subscriptionId: null,
    deviceType: 'desktop',
    platform: 'Unknown'
  });

  const serviceWorkerRegistration = useRef<ServiceWorkerRegistration | null>(null);
  const isInitialized = useRef(false);

  // Inicialização do sistema
  useEffect(() => {
    if (isInitialized.current) return;
    
    const initializePWASystem = async () => {
      try {
        // Verificar compatibilidade
        const compatibility = getBrowserCompatibility();
        const isSupported = compatibility.pushNotifications && compatibility.serviceWorker && compatibility.webPush;
        
        if (!isSupported) {
          setState(prev => ({ ...prev, isSupported: false }));
          return;
        }

        // Coletar informações do navegador
        const browserInfo = collectBrowserInfo();
        const browserFingerprint = await generateSecureBrowserFingerprint();
        
        setState(prev => ({
          ...prev,
          isSupported: true,
          browserInfo,
          browserFingerprint,
          deviceType: browserInfo.deviceType,
          platform: browserInfo.platform,
          permission: Notification.permission
        }));

        // Verificar inscrição existente
        await checkExistingSubscription();
        
        isInitialized.current = true;
      } catch (error) {
        console.error('❌ Erro ao inicializar sistema PWA:', error);
        setState(prev => ({ ...prev, error: 'Erro ao inicializar sistema PWA' }));
      }
    };

    initializePWASystem();
  }, []);

  // Verificar inscrição existente
  const checkExistingSubscription = useCallback(async () => {
    try {
      if (!state.browserFingerprint || !user?.id) return;

      // Buscar inscrição existente no servidor
      const response = await fetch(
        `/api/push-subscription?userId=${user.id}&browserFingerprint=${state.browserFingerprint}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.subscriptions.length > 0) {
          const subscription = data.subscriptions[0];
          
          // Verificar se a inscrição ainda é válida no navegador
          const registration = await navigator.serviceWorker.getRegistration('/sw-notifications.js');
          if (registration) {
            const pushSubscription = await registration.pushManager.getSubscription();
            if (pushSubscription && pushSubscription.endpoint === subscription.endpoint) {
              setState(prev => ({
                ...prev,
                isSubscribed: true,
                subscription: pushSubscription,
                subscriptionId: subscription.id
              }));
              return;
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Erro ao verificar inscrição existente:', error);
    }
  }, [state.browserFingerprint, user?.id]);

  // Solicitar permissão
  const requestPermission = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await Notification.requestPermission();
      setState(prev => ({ ...prev, permission: result }));
      
      if (result === 'granted') {
        await subscribeToPushNotifications();
      } else {
        setState(prev => ({ 
          ...prev, 
          error: 'Permissão negada para notificações. Você pode alterar isso nas configurações do navegador.' 
        }));
      }
    } catch (error) {
      console.error('❌ Erro ao solicitar permissão:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Erro ao solicitar permissão para notificações' 
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Inscrever para notificações push
  const subscribeToPushNotifications = useCallback(async () => {
    try {
      if (!state.browserFingerprint || !user?.id) {
        throw new Error('Informações do navegador ou usuário não disponíveis');
      }

      setState(prev => ({ ...prev, loading: true, error: null }));
      
      console.log('🔍 Iniciando inscrição para notificações push...');
      
      // Verificar HTTPS
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        throw new Error('Notificações push só funcionam em HTTPS ou localhost');
      }
      
      // Registrar/obter service worker
      let registration = await navigator.serviceWorker.getRegistration('/sw-notifications.js');
      
      if (!registration) {
        console.log('🆕 Registrando novo Service Worker...');
        registration = await navigator.serviceWorker.register('/sw-notifications.js', {
          scope: '/',
          updateViaCache: 'none'
        });
        console.log('✅ Novo Service Worker registrado:', registration);
      } else {
        console.log('🔄 Service Worker já registrado, verificando atualizações...');
        await registration.update();
      }
      
      serviceWorkerRegistration.current = registration;
      
      // Aguardar ativação
      if (registration.waiting) {
        await new Promise<void>((resolve) => {
          const listener = () => {
            registration.removeEventListener('activate', listener);
            resolve();
          };
          registration.addEventListener('activate', listener);
        });
      }
      
      // Verificar inscrição existente
      let pushSubscription = await registration.pushManager.getSubscription();
      
      if (!pushSubscription) {
        console.log('🆕 Criando nova inscrição...');
        pushSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: getVapidPublicKey()
        });
        console.log('✅ Nova inscrição criada:', pushSubscription);
      }
      
      // Salvar no servidor
      const browserInfo = collectBrowserInfo();
      const response = await fetch('/api/push-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: pushSubscription.toJSON(),
          userId: user.id,
          browserInfo: {
            userAgent: browserInfo.userAgent,
            platform: browserInfo.platform,
            deviceType: browserInfo.deviceType,
            browserFingerprint: state.browserFingerprint
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Erro ao salvar inscrição no servidor');
      }
      
      const result = await response.json();
      
      setState(prev => ({
        ...prev,
        isSubscribed: true,
        subscription: pushSubscription,
        subscriptionId: result.subscription.id
      }));
      
      console.log('🎉 Inscrito para notificações push com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao inscrever para notificações push:', error);
      
      let errorMessage = 'Erro ao inscrever para notificações push';
      if (error instanceof Error) {
        if (error.message.includes('HTTPS')) {
          errorMessage = 'Notificações push só funcionam em HTTPS.';
        } else if (error.message.includes('Service Worker')) {
          errorMessage = 'Erro no Service Worker. Tente recarregar a página.';
        } else if (error.message.includes('Permission')) {
          errorMessage = 'Permissão negada para notificações.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setState(prev => ({ ...prev, error: errorMessage }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.browserFingerprint, user?.id]);

  // Desinscrever das notificações push
  const unsubscribeFromPushNotifications = useCallback(async () => {
    try {
      if (!state.subscription || !state.subscriptionId || !user?.id) return;
      
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Desinscrever do navegador
      await state.subscription.unsubscribe();
      
      // Marcar como inativa no servidor
      await fetch('/api/push-subscription', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: state.subscriptionId,
          userId: user.id
        })
      });
      
      setState(prev => ({
        ...prev,
        isSubscribed: false,
        subscription: null,
        subscriptionId: null
      }));
      
      console.log('✅ Desinscrito das notificações push com sucesso');
      
    } catch (error) {
      console.error('❌ Erro ao desinscrever:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Erro ao desinscrever das notificações push' 
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.subscription, state.subscriptionId, user?.id]);

  // Testar notificação
  const testNotification = useCallback(async () => {
    try {
      if (!serviceWorkerRegistration.current) {
        throw new Error('Service Worker não registrado');
      }
      
      await serviceWorkerRegistration.current.showNotification('VOLTRIS - Teste', {
        body: 'Esta é uma notificação de teste! Seu sistema PWA está funcionando perfeitamente! 🎉',
        icon: '/logo-v2.webp',
        badge: '/logo-v2.webp',
        tag: 'test-notification',
        requireInteraction: true,
        actions: [
          {
            action: 'view',
            title: 'Ver mais',
            icon: '/logo-v2.webp'
          },
          {
            action: 'close',
            title: 'Fechar',
            icon: '/logo-v2.webp'
          }
        ]
      });
      
      console.log('✅ Notificação de teste enviada com sucesso');
      
    } catch (error) {
      console.error('❌ Erro ao enviar notificação de teste:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Erro ao enviar notificação de teste' 
      }));
    }
  }, []);

  // Atualizar inscrição
  const refreshSubscription = useCallback(async () => {
    await checkExistingSubscription();
  }, [checkExistingSubscription]);

  // Limpar erro
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    requestPermission,
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
    testNotification,
    refreshSubscription,
    clearError
  };
}
