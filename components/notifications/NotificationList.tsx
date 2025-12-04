import React, { useState } from 'react';
import { useNotificationContext, NotificationType } from './NotificationContext';
import { useAuth } from '@/app/hooks/useAuth';

const categoryIcons: Record<string, string> = {
  order: '📦',
  ticket: '🎫',
  system: '⚙️',
  profile: '👤',
  newsletter: '📧',
  comment: '💬',
};

interface NotificationListProps {
  notifications?: any[];
}

export default function NotificationList({ notifications: notificationsProp }: NotificationListProps) {
  const context = useNotificationContext();
  const notifications = notificationsProp ?? context.notifications;
  const { loading, markAllAsRead, clearAllNotifications } = context;
  const { isAdmin } = useAuth();
  const [filter, setFilter] = useState<NotificationType | 'all'>('all');

  const categories: { label: string; value: NotificationType | 'all'; icon: string }[] = [
    { label: 'Todos', value: 'all', icon: '🔔' },
    { label: 'Pedidos', value: 'order', icon: '📦' },
    { label: 'Tickets', value: 'ticket', icon: '🎫' },
    { label: 'Sistema', value: 'system', icon: '⚙️' },
    { label: 'Perfil', value: 'profile', icon: '👤' },
    ...(isAdmin ? [
      { label: 'Newsletter', value: 'newsletter' as NotificationType, icon: '📧' },
      { label: 'Comentários', value: 'comment' as NotificationType, icon: '💬' },
    ] : [])
  ];

  // TODO: Implementar scroll infinito

  const filtered = filter === 'all'
    ? notifications.filter(n => isAdmin || (n.type !== 'newsletter' && n.type !== 'comment'))
    : notifications.filter(n => n.type === filter && (isAdmin || (n.type !== 'newsletter' && n.type !== 'comment')));

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="flex gap-2 mb-4 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat.value}
            className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium transition ${filter === cat.value ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200'}`}
            onClick={() => setFilter(cat.value as any)}
          >
            <span>{cat.icon}</span> {cat.label}
          </button>
        ))}
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-lg">Histórico de Notificações</span>
        <div className="flex gap-2">
          <button className="text-xs text-blue-600 hover:underline" onClick={markAllAsRead}>
            Marcar todas como lidas
          </button>
          <button className="text-xs text-red-600 hover:underline" onClick={clearAllNotifications}>
            Limpar todas
          </button>
        </div>
      </div>
      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {loading ? (
          <div className="text-center py-8 text-zinc-400">Carregando...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-zinc-400">Nenhuma notificação</div>
        ) : filtered.map(n => (
          <div key={n.id} className="py-4 flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl">
              {categoryIcons[n.type] || '🔔'}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">{n.title}</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-300">{n.message}</div>
              <div className="text-xs text-zinc-400 mt-1">{new Date(n.created_at).toLocaleString('pt-BR')}</div>
            </div>
          </div>
        ))}
      </div>
      {/* TODO: Botão Limpar todas, scroll infinito, lazy loading */}
    </div>
  );
} 