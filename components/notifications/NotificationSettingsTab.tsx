import React, { useEffect } from 'react';
import { useNotificationContext, NotificationType } from './NotificationContext';

const categories: { label: string; value: NotificationType; icon: string }[] = [
  { label: 'Pedidos', value: 'order', icon: '📦' },
  { label: 'Tickets', value: 'ticket', icon: '🎫' },
  { label: 'Sistema', value: 'system', icon: '⚙️' },
  { label: 'Perfil', value: 'profile', icon: '👤' },
  { label: 'Newsletter', value: 'newsletter', icon: '📧' },
  { label: 'Comentários', value: 'comment', icon: '💬' },
];

export default function NotificationSettingsTab() {
  const { settings, updateSettings, loading } = useNotificationContext();

  if (loading || !settings) return <div className="p-8 text-center text-zinc-400">Carregando...</div>;

  const handleToggle = (field: keyof typeof settings) => {
    updateSettings({ [field]: !settings[field] });
  };

  const handleCategoryToggle = (cat: NotificationType) => {
    const current = settings.notification_categories || [];
    const next = current.includes(cat)
      ? current.filter(c => c !== cat)
      : [...current, cat];
    updateSettings({ notification_categories: next });
  };

  const handleTestSound = () => {
    let src = '/soft_ping.mp3';
    if (settings.sound_theme === 'tech') src = '/deep_tone.mp3';
    if (settings.sound_theme === 'soft') src = '/chime_alert.mp3';
    const audio = new Audio(src);
    audio.volume = settings.volume;
    audio.play();
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Notificações</h2>
      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={settings.notifications_enabled} onChange={() => handleToggle('notifications_enabled')} />
          Ativar notificações
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={settings.sound_enabled} onChange={() => handleToggle('sound_enabled')} />
          Ativar som
        </label>
        <div>
          <div className="font-medium mb-2">Categorias de notificação:</div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <label key={cat.value} className="flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium cursor-pointer transition select-none
                ${settings.notification_categories?.includes(cat.value) ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200'}
              ">
                <input
                  type="checkbox"
                  checked={settings.notification_categories?.includes(cat.value)}
                  onChange={() => handleCategoryToggle(cat.value)}
                  className="mr-1"
                />
                <span>{cat.icon}</span> {cat.label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <div className="font-medium mb-2">Tema sonoro:</div>
          <select
            value={settings.sound_theme}
            onChange={e => updateSettings({ sound_theme: e.target.value })}
            className="rounded-lg border px-3 py-1"
          >
            <option value="default">Padrão</option>
            <option value="soft">Suave</option>
            <option value="tech">Tecnológico</option>
          </select>
        </div>
        <div>
          <div className="font-medium mb-2">Volume:</div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={settings.sound_volume ?? 70}
            onChange={e => updateSettings({ sound_volume: Number(e.target.value) })}
            className="w-full"
          />
          <div className="text-xs text-zinc-500 mt-1">{settings.sound_volume ?? 70}%</div>
        </div>
        <button
          className="mt-4 px-6 py-2 rounded-xl bg-zinc-900/80 text-white font-semibold shadow hover:scale-105 transition"
          onClick={() => window?.Notification?.requestPermission?.()}
        >
          🔄 Reconfigurar permissão do navegador
        </button>
        <button
          className="mt-2 px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow hover:scale-105 transition"
          onClick={handleTestSound}
        >
          🔊 Testar som
        </button>
      </div>
    </div>
  );
} 