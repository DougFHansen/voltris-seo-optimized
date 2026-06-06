'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import ClientNotificationModal from './ClientNotificationModal';
import { FiMenu, FiMinimize2, FiMaximize2, FiSettings, FiLayout, FiCreditCard, FiMonitor } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardProvider, useDashboard } from '@/app/context/DashboardContext';
import Link from 'next/link';
import UISettingsModal from './UISettingsModal';

// Inner component to access context
function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const { transparencyMode, toggleTransparency, sidebarCollapsed, setSidebarCollapsed } = useDashboard();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className={`flex h-screen w-screen overflow-hidden selection:bg-[#8B31FF]/30 font-sans transition-all duration-700 bg-[#0a0a0f] text-white`}
    style={{
      '--v-glass-bg': transparencyMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(10, 10, 15, 0.95)',
      '--v-glass-blur': transparencyMode ? '40px' : '0px',
      '--v-glass-border': transparencyMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.02)',
    } as React.CSSProperties}>
      
      {/* BACKGROUND LAYER */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E')] opacity-[0.08] mix-blend-overlay"></div>
        <motion.div 
          animate={{ x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -right-[5%] w-[1200px] h-[1200px] bg-gradient-to-br from-[#31A8FF]/15 via-transparent to-transparent rounded-full blur-[150px]" 
        />
        <motion.div 
          animate={{ x: [0, -60, 0], y: [0, 80, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute -bottom-[20%] -left-[10%] w-[1000px] h-[1000px] bg-gradient-to-tr from-[#8B31FF]/10 via-transparent to-transparent rounded-full blur-[120px]" 
        />
        <div className="absolute inset-0 opacity-[0.02] mix-blend-screen" 
          style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />
      </div>

      {/* Sidebar - Fixa lateral idêntica ao Restaurante */}
      <aside className={`hidden lg:block h-full transition-all duration-500 ease-in-out border-r border-white/5 z-50 ${sidebarCollapsed ? 'w-24' : 'w-72 xl:w-80'} ${transparencyMode ? 'voltris-glass' : 'bg-[#12121A]'}`}>
        <Suspense fallback={<div className="w-full h-full animate-pulse bg-white/5" />}>
          <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        </Suspense>
      </aside>

      {/* Mobile Drawer Hook */}
      <div className="lg:hidden">
        <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      </div>

      {/* Main Body */}
      <div className="flex flex-1 flex-col min-h-0 overflow-hidden relative">
        
        {/* Topbar Header (Desktop) */}
        <header className="hidden lg:flex h-20 lg:h-24 px-6 sm:px-10 items-center justify-between border-b border-white/5 z-40 shrink-0 transition-all duration-500 relative">
          <div className={`absolute inset-0 ${transparencyMode ? 'voltris-glass' : 'bg-[#0a0a0f]/80 backdrop-blur-2xl'} -z-10`}></div>
          <div className="flex items-center gap-4">
             <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-white leading-tight tracking-tighter uppercase italic">
                  Central do Usuário
                </h2>
                <p className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1">
                  Gerencie seus serviços e hardware
                </p>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-widest text-gray-300 flex items-center gap-2">
               Voltar ao Site
            </Link>
          </div>
        </header>

        {/* Mobile Topbar */}
        <div className={`lg:hidden flex items-center justify-between px-6 py-4 bg-[#0a0a0f]/80 backdrop-blur-2xl border-b border-white/5 z-[60] sticky top-0`}>
           <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#31A8FF] to-[#1070FF] flex items-center justify-center text-xs font-black text-white shadow-[0_0_20px_rgba(49,168,255,0.3)]">V</div>
             <div className="flex flex-col">
               <span className="font-black text-[10px] tracking-[0.2em] uppercase text-white">Voltris</span>
               <span className="text-[9px] font-bold text-[#31A8FF] uppercase tracking-widest leading-none">Painel Pro</span>
             </div>
          </div>
           <button onClick={() => setMobileMenuOpen(true)} className="w-11 h-11 rounded-2xl bg-[#12121A] border border-white/10 flex items-center justify-center active:scale-90 transition-all hover:bg-white/5">
              <FiMenu className="w-5 h-5 text-white" />
           </button>
        </div>

        {/* Scrollable Main Content */}
        <main id="main-dashboard-scroll" className={`flex-1 overflow-y-auto px-4 sm:px-8 py-6 relative z-10 scroll-smooth custom-scrollbar-modern ${transparencyMode ? 'voltris-glass' : 'bg-transparent'}`}>
           <motion.div 
             key={transparencyMode ? 'glass' : 'solid'}
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ type: "spring", damping: 25, stiffness: 100 }}
             className="mx-auto max-w-7xl h-full min-h-fit"
           >
             {children}
             <div className="h-28 lg:h-8"></div>
           </motion.div>
        </main>

        {/* Floating UI Elements (Settings) */}
        <div className="absolute bottom-8 right-8 z-[70] hidden xl:flex flex-col gap-3">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTransparency}
            className="p-3 rounded-2xl bg-[#12121A] shadow-xl flex items-center justify-center text-gray-400 hover:text-[#31A8FF] transition-all group border border-white/10 hover:border-[#31A8FF]/30"
          >
            {transparencyMode ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSettingsOpen(true)}
            className="p-3 rounded-2xl bg-[#12121A] shadow-xl flex items-center justify-center text-gray-400 hover:text-[#8B31FF] transition-all group border border-white/10 hover:border-[#8B31FF]/30"
          >
            <FiSettings className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <ClientNotificationModal />
      <UISettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardLayoutInner>
        {children}
      </DashboardLayoutInner>
    </DashboardProvider>
  );
}
