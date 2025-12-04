'use client';

import NotificationList from '@/components/notifications/NotificationList';
import { useNotificationContext } from '@/components/notifications/NotificationContext';
import { useAuth } from '@/app/hooks/useAuth';

export default function NotificationsPage() {
  const { notifications } = useNotificationContext();
  const { isAdmin } = useAuth();
  const filteredNotifications = notifications.filter(n => isAdmin || (n.type !== 'newsletter' && n.type !== 'comment'));
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Todas as notificações</h1>
      <NotificationList notifications={filteredNotifications} />
    </div>
  );
} 