'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiMonitor, FiMaximize2, FiMinimize2, FiSettings, FiLayout, FiShield, FiSliders } from 'react-icons/fi';
import { useDashboard } from '@/app/context/DashboardContext';

interface UISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UISettingsModal({ isOpen, onClose }: UISettingsModalProps) {
  const { 
    transparencyMode, 
    toggleTransparency, 
    sidebarCollapsed, 
    setSidebarCollapsed,
    hardwareIDProtection,
    toggleHardwareIDProtection
  } = useDashboard();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl p-8 rounded-[3rem] bg-white border border-gray-200 shadow-xl overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-[#8B31FF]/20 to-transparent blur-[100px] pointer-events-none"></div>
            
            <div className="relative z-10 space-y-10">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#8B31FF] to-[#6010FF] text-gray-900">
                        <FiSettings className="w-5 h-5" />
                      </div>
                      <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Configurações <span className="text-[#8B31FF] not-italic">UI</span></h2>
                   </div>
                   <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest pl-1">Personalização Operacional do Terminal</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-900 transition-all border border-gray-200"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Settings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {/* Transparency Mode */}
                 <button 
                   onClick={toggleTransparency}
                   className={`p-6 rounded-[2rem] border transition-all duration-300 flex flex-col gap-4 text-left group
                     ${transparencyMode ? 'bg-[#31A8FF]/10 border-[#31A8FF]/30 text-[#31A8FF]' : 'bg-gray-100 border-gray-200 text-gray-400 hover:border-gray-300'}
                   `}
                 >
                    <div className="flex items-center justify-between w-full">
                       <FiMaximize2 className="w-6 h-6" />
                       {transparencyMode && <FiCheck className="w-5 h-5" />}
                    </div>
                    <div>
                       <h4 className="font-black uppercase italic tracking-wider text-sm mb-1 text-gray-900">Modo Transparente</h4>
                       <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Fundo translúcido (Glassmorphism)</p>
                    </div>
                 </button>

                 {/* Solid Mode */}
                 <button 
                   onClick={toggleTransparency}
                   className={`p-6 rounded-[2rem] border transition-all duration-300 flex flex-col gap-4 text-left group
                     ${!transparencyMode ? 'bg-[#8B31FF]/10 border-[#8B31FF]/30 text-[#8B31FF]' : 'bg-gray-100 border-gray-200 text-gray-400 hover:border-gray-300'}
                   `}
                 >
                    <div className="flex items-center justify-between w-full">
                       <FiMinimize2 className="w-6 h-6" />
                       {!transparencyMode && <FiCheck className="w-5 h-5" />}
                    </div>
                    <div>
                       <h4 className="font-black uppercase italic tracking-wider text-sm mb-1 text-gray-900">Modo Sólido</h4>
                       <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Fundo opaco de alto contraste</p>
                    </div>
                 </button>

                 {/* Sidebar Collapsed */}
                 <button 
                   onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                   className={`p-6 rounded-[2rem] border transition-all duration-300 flex flex-col gap-4 text-left group
                     ${sidebarCollapsed ? 'bg-[#FF4B6B]/10 border-[#FF4B6B]/30 text-[#FF4B6B]' : 'bg-gray-100 border-gray-200 text-gray-400 hover:border-gray-300'}
                   `}
                 >
                    <div className="flex items-center justify-between w-full">
                       <FiLayout className="w-6 h-6" />
                       {sidebarCollapsed && <FiCheck className="w-5 h-5" />}
                    </div>
                    <div>
                       <h4 className="font-black uppercase italic tracking-wider text-sm mb-1 text-gray-900">Sidebar Compacto</h4>
                       <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Reduz o menu lateral apenas a ícones</p>
                    </div>
                 </button>

                 {/* Hardware ID Protection Mode */}
                 <button 
                   onClick={toggleHardwareIDProtection}
                   className={`p-6 rounded-[2rem] border transition-all duration-300 flex flex-col gap-4 text-left group
                     ${hardwareIDProtection ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-gray-100 border-gray-200 text-gray-400 hover:border-gray-300'}
                   `}
                 >
                    <div className="flex items-center justify-between w-full">
                       <FiShield className="w-6 h-6" />
                       {hardwareIDProtection && <FiCheck className="w-5 h-5" />}
                    </div>
                    <div>
                       <h4 className="font-black uppercase italic tracking-wider text-sm mb-1 text-gray-900">Proteção HID</h4>
                       <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Segurança de Hardware ID em tempo real</p>
                    </div>
                 </button>
              </div>

              <div className="pt-6 border-t border-gray-200">
                 <p className="text-center text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em]">As alterações são salvas automaticamente na nuvem</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
