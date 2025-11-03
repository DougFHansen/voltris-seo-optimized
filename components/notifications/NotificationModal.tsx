'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useNotificationContext } from './NotificationContext';

export default function NotificationModal() {
  const { showPermissionModal, setShowPermissionModal, updateSettings } = useNotificationContext();

  if (!showPermissionModal) return null;

  const handleEnable = async () => {
    await updateSettings({ notifications_enabled: true });
    setShowPermissionModal(false);
  };
  const handleDismiss = () => {
    setShowPermissionModal(false);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/30 dark:bg-zinc-900/40 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/20 backdrop-blur-xl flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-8"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <div className="text-3xl mb-2 font-bold text-zinc-900 dark:text-zinc-100">Notificações VOLTRIS</div>
        <div className="text-zinc-700 dark:text-zinc-300 mb-4 text-center">
          Deseja ativar as notificações da VOLTRIS?<br />
          Você receberá alertas importantes sobre pedidos, tickets e novidades.
        </div>
        <div className="flex gap-4 mt-2">
          <button
            className="px-6 py-2 rounded-xl bg-zinc-900/80 text-white font-semibold shadow hover:scale-105 transition"
            onClick={handleEnable}
          >
            ✅ Ativar
          </button>
          <button
            className="px-6 py-2 rounded-xl bg-white/60 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 font-semibold border border-zinc-300 dark:border-zinc-700 hover:scale-105 transition"
            onClick={handleDismiss}
          >
            ❌ Não agora
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
} 