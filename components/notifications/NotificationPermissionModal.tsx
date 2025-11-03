'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function NotificationPermissionModal({ onActivate, onDismiss }: { onActivate: () => void, onDismiss: () => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const answered = localStorage.getItem('voltris_notifications_permission');
    if (!answered) setShow(true);
  }, []);

  const handleActivate = async () => {
    if ('Notification' in window) {
      await window.Notification.requestPermission();
    }
    localStorage.setItem('voltris_notifications_permission', 'true');
    onActivate();
    setShow(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('voltris_notifications_permission', 'false');
    onDismiss();
    setShow(false);
  };

  if (!show) return null;

  return (
    <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className="bg-white/30 dark:bg-zinc-900/40 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/20 backdrop-blur-xl flex flex-col items-center gap-4"
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
        <div className="text-2xl font-bold mb-2">Notificações VOLTRIS</div>
        <div className="text-zinc-700 dark:text-zinc-300 mb-4 text-center">
          Deseja ativar as notificações da VOLTRIS para receber alertas em tempo real?
        </div>
        <div className="flex gap-4 mt-2">
          <button className="px-6 py-2 rounded-xl bg-zinc-900/80 text-white font-semibold shadow hover:scale-105 transition"
            onClick={handleActivate}>✅ Ativar Notificações</button>
          <button className="px-6 py-2 rounded-xl bg-white/60 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 font-semibold border border-zinc-300 dark:border-zinc-700 hover:scale-105 transition"
            onClick={handleDismiss}>❌ Não agora</button>
        </div>
      </motion.div>
    </motion.div>
  );
} 