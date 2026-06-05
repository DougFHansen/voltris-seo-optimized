/**
 * Tipos para o sistema PWA de notificações VOLTRIS
 */

export interface BrowserInfo {
  userAgent: string;
  platform: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  language: string;
  timezone: string;
  screenResolution: string;
  colorDepth: number;
  hardwareConcurrency: number;
  maxTouchPoints: number;
  cookieEnabled: boolean;
  doNotTrack: string | null;
}

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface PushSubscriptionRequest {
  subscription: PushSubscriptionData;
  userId: string;
  browserInfo: {
    userAgent: string;
    platform: string;
    deviceType: 'desktop' | 'mobile' | 'tablet';
    browserFingerprint: string;
  };
}

export interface PushSubscriptionResponse {
  success: boolean;
  message: string;
  subscription?: {
    id: string;
    endpoint: string;
    platform: string;
    deviceType: string;
    isActive: boolean;
    createdAt: string;
  };
}

export interface PushSubscriptionListResponse {
  success: boolean;
  subscriptions: PushSubscriptionRecord[];
  count: number;
}

export interface PushSubscriptionRecord {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  user_agent: string;
  browser_fingerprint: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
  platform: string;
  is_active: boolean;
  last_used: string;
  created_at: string;
  updated_at: string;
}

export interface PWANotificationState {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  subscription: PushSubscription | null;
  loading: boolean;
  error: string | null;
  browserInfo: BrowserInfo | null;
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

export interface BrowserCompatibility {
  pushNotifications: boolean;
  pwa: boolean;
  serviceWorker: boolean;
  webPush: boolean;
}

export interface NotificationPayload {
  title: string;
  body: string;
  tag?: string;
  data?: Record<string, any>;
  type?: 'ticket' | 'order' | 'system' | 'profile' | 'newsletter' | 'comment';
  icon?: string;
  badge?: string;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
  sound?: string;
}

export interface ServiceWorkerMessage {
  type: 'PUSH_NOTIFICATION' | 'PLAY_NOTIFICATION_SOUND' | 'UPDATE_SUBSCRIPTION';
  data?: any;
}

export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAInstallState {
  deferredPrompt: PWAInstallPrompt | null;
  showInstallPrompt: boolean;
  isInstalled: boolean;
  isMobile: boolean;
}

export interface PWAInstallActions {
  handleInstallClick: () => Promise<void>;
  dismissInstallPrompt: () => void;
}
