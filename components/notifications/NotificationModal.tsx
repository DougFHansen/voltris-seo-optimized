'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationContext } from './NotificationContext';
import { FiBell, FiCheck, FiX } from 'react-icons/fi';

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
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleDismiss}
      >
        <motion.div
          className="bg-[#0A0A0F] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full relative overflow-hidden"
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background Gradient Decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#31A8FF]/5 blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#8B31FF]/5 blur-3xl -z-10"></div>

          <div className="flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#31A8FF]/20 to-[#8B31FF]/20 border border-[#31A8FF]/30 rounded-2xl flex items-center justify-center">
              <FiBell className="w-8 h-8 text-[#31A8FF]" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Notificações VOLTRIS</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Deseja ativar as notificações?<br />
                Receba alertas em tempo real sobre seus dispositivos, pedidos e atualizações críticas.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] text-white font-bold rounded-xl shadow-lg shadow-[#31A8FF]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                onClick={handleEnable}
              >
                <FiCheck className="w-4 h-4" />
                <span>Sim, Ativar</span>
              </button>
              <button
                className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2"
                onClick={handleDismiss}
              >
                <FiX className="w-4 h-4" />
                <span>Não Agora</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 