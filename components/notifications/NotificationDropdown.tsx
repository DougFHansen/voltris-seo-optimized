import React from 'react';
import { useNotificationContext } from './NotificationContext';
import { createPortal } from 'react-dom';
import VoltrisIcon from '@/components/dashboard/VoltrisIcon';
import { ICONE_POR_TIPO, COR_POR_TIPO, ROTULO_POR_TIPO } from '@/lib/notification-kinds';

/**
 * Sino de notificações do site (cabeçalho).
 *
 * Regras que ele cumpre:
 *  - só mostra as notificações DO USUÁRIO (o contexto já filtra por
 *    `user_id` no servidor);
 *  - clicar na notificação marca como lida E leva para o destino
 *    (`action_url`), quando o schema novo está aplicado;
 *  - funciona no celular: o painel abre em tela cheia no mobile e respeita a
 *    largura da viewport (era um dropdown de 384px fixo, que estourava).
 */
export default function NotificationDropdown() {
  const { notifications, unreadCount, markAllAsRead, markAsRead, loading, error } = useNotificationContext();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  // Fecha ao clicar fora / apertar Esc.
  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const abrir = async (n: (typeof notifications)[number]) => {
    await markAsRead(n.id);
    setOpen(false);
    if (n.action_url) {
      window.location.href = n.action_url;
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className="relative p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition group"
        onClick={() => setOpen(v => !v)}
        aria-label={`Notificações${unreadCount > 0 ? ` (${unreadCount} não lidas)` : ''}`}
        aria-expanded={open}
      >
        <span className="inline-block transition-transform group-hover:scale-105">
          <VoltrisIcon name="bell" size={18} />
        </span>
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center shadow-lg">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-x-3 top-16 sm:inset-x-auto sm:right-6 sm:w-96 max-w-full bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 z-[9999] p-4 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-3 gap-3">
            <div>
              <span className="font-bold text-sm text-white">Notificações</span>
              {unreadCount > 0 && (
                <span className="ml-2 text-[10px] font-semibold text-rose-400">
                  {unreadCount} não lida{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <button
              className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition disabled:opacity-40"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Marcar todas como lidas
            </button>
          </div>

          {error && (
            <p className="mb-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-300">
              {error}
            </p>
          )}

          <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto divide-y divide-slate-800/70 custom-scrollbar">
            {loading && notifications.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">Carregando…</div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8">
                <VoltrisIcon name="bell" size={22} className="mx-auto text-slate-600" />
                <p className="mt-2 text-xs text-slate-500">Nenhuma notificação por aqui.</p>
              </div>
            ) : notifications.slice(0, 10).map(n => {
              const cor = COR_POR_TIPO[n.type] ?? '#8B31FF';
              return (
                <button
                  key={n.id}
                  onClick={() => abrir(n)}
                  className="w-full text-left py-3 flex gap-3 items-start hover:bg-slate-800/40 transition-colors rounded-lg px-1"
                >
                  <span
                    className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${cor} 10%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${cor} 20%, transparent)`,
                    }}
                  >
                    <VoltrisIcon
                      name={(ICONE_POR_TIPO[n.type] ?? 'info') as any}
                      size={15}
                      style={{ color: cor }}
                    />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-2">
                      <span className={`text-xs font-semibold truncate ${n.read ? 'text-slate-400' : 'text-white'}`}>
                        {n.title}
                      </span>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />}
                    </span>
                    <span className="block text-[11px] text-slate-400 mt-0.5 line-clamp-2">{n.message}</span>
                    <span className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-500">{new Date(n.created_at).toLocaleString('pt-BR')}</span>
                      <span className="text-[10px] text-slate-600">• {ROTULO_POR_TIPO[n.type] ?? n.type}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 text-center">
            <a href="/dashboard/notifications" className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition">
              Ver todas as notificações
            </a>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
