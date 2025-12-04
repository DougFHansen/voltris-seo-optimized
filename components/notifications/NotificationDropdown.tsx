import React from 'react';
import { useNotificationContext } from './NotificationContext';
import { Bell } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function NotificationDropdown() {
  const { notifications, unreadCount, markAllAsRead, loading } = useNotificationContext();
  const [open, setOpen] = React.useState(false);

  const categoryIcons: Record<string, string> = {
    order: '📦',
    ticket: '🎫',
    system: '⚙️',
    profile: '👤',
    newsletter: '📧',
    comment: '💬',
  };

  return (
    <div className="relative">
      <button
        className="relative p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition group"
        onClick={() => setOpen(v => !v)}
        aria-label="Notificações"
      >
        <span className="inline-block transition-transform group-hover:scale-105">
          <Bell className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
        </span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 animate-pulse shadow-lg transition-transform duration-300 scale-110">
            {unreadCount}
          </span>
        )}
      </button>
      {open && typeof window !== 'undefined' && createPortal(
        <div className="fixed top-16 right-6 w-96 max-w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 z-[9999] p-4 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-lg">Notificações</span>
            <button className="text-xs text-blue-600 hover:underline" onClick={markAllAsRead}>
              Marcar todas como lidas
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-zinc-200 dark:divide-zinc-800">
            {loading ? (
              <div className="text-center py-8 text-zinc-400">Carregando...</div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-zinc-400">Nenhuma notificação</div>
            ) : notifications.slice(0, 10).map(n => (
              <div key={n.id} className="py-3 flex gap-3 items-start">
                {/* Ícone por categoria futuramente */}
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
          <div className="mt-3 text-center">
            <a href="/dashboard/notifications" className="text-blue-600 hover:underline font-medium">Ver todas</a>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
} 