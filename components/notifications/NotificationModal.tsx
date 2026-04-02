'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationContext } from './NotificationContext';
import { FiBell, FiCheck, FiX, FiShield, FiCpu } from 'react-icons/fi';
import { useDashboard } from '@/app/context/DashboardContext';

export default function NotificationModal() {
  const { transparencyMode } = useDashboard();
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
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
        <motion.div
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleDismiss}
        />
        
        <motion.div
          className={`relative w-full max-w-lg p-12 rounded-[4rem] border border-white/10 shadow-3xl overflow-hidden
            ${transparencyMode ? 'voltris-glass' : 'bg-[#0A0A10]'}
          `}
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Visual Accents */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B]"></div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#31A8FF]/5 blur-[100px] rounded-full"></div>
          
          <div className="flex flex-col items-center text-center gap-10">
            <div className="relative">
              <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-[#31A8FF]/10 to-[#8B31FF]/10 border border-[#31A8FF]/20 flex items-center justify-center text-[#31A8FF] shadow-2xl relative z-10">
                <FiBell className="w-10 h-10 animate-float" />
              </div>
              <div className="absolute inset-0 rounded-[2.5rem] bg-[#31A8FF] blur-3xl opacity-20 animate-pulse"></div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Ativar <span className="text-[#31A8FF] not-italic">Notificações</span></h2>
              <div className="flex flex-col gap-2">
                 <p className="text-white/40 font-bold text-xs uppercase tracking-[0.2em] leading-relaxed px-4">
                   Estabeleça uma conexão direta para receber atualizações em tempo real e avisos críticos de segurança.
                 </p>
                 <div className="flex items-center justify-center gap-4 pt-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                       <FiShield className="w-3 h-3 text-[#00FF88]" />
                       <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">CRIPTOGRAFADO</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                       <FiCpu className="w-3 h-3 text-[#31A8FF]" />
                       <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">BAIXO CONSUMO</span>
                    </div>
                 </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full pt-4">
              <button
                className="w-full py-6 bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] text-white font-black uppercase italic tracking-[0.3em] rounded-3xl shadow-3xl hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-4 text-xs"
                onClick={handleEnable}
              >
                <FiCheck className="w-5 h-5" />
                <span>Iniciar Conexão</span>
              </button>
              <button
                className="w-full py-5 text-white/20 hover:text-white/60 font-black uppercase tracking-[0.3em] text-[10px] transition-all"
                onClick={handleDismiss}
              >
                Agora não
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
} 