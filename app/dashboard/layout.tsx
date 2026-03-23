'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import ClientNotificationModal from './ClientNotificationModal';
import { FiMenu, FiMinimize2, FiMaximize2, FiSettings } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardProvider, useDashboard } from '@/app/context/DashboardContext';

// Inner component to access context
function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const { transparencyMode, toggleTransparency, sidebarCollapsed, setSidebarCollapsed } = useDashboard();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (e: any) => {
      setScrolled(e.target.scrollTop > 20);
    };
    const mainContent = document.getElementById('main-dashboard-scroll');
    mainContent?.addEventListener('scroll', handleScroll);
    return () => mainContent?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`h-screen relative flex flex-col overflow-hidden selection:bg-[#8B31FF]/30 font-sans transition-all duration-700
      ${transparencyMode ? 'text-white' : 'bg-[#050510] text-white'}
    `}
    style={{
      '--v-glass-bg': transparencyMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(10, 10, 15, 0.95)',
      '--v-glass-blur': transparencyMode ? '40px' : '0px',
      '--v-glass-border': transparencyMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.02)',
    } as React.CSSProperties}>
      
      {/* BACKGROUND LAYER - Ultra-Premium Ambient Decor */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        {/* Grain Noise Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.08] mix-blend-overlay"></div>
        
        {/* Dynamic Bloom Orbs */}
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
        
        {/* Technical Grid (Subtle) */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-screen" 
          style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />
      </div>

      {/* Header - Adaptive & Floating Style */}
      <div className={`relative z-[100] transition-all duration-500`}>
        <Header />
      </div>

      {/* Main Layout Body */}
      <div className="flex flex-1 min-h-0 relative z-10 px-0 lg:px-6 pb-0 lg:pb-6 pt-0 lg:pt-20 gap-0 lg:gap-6 max-w-[2000px] mx-auto w-full">
        
        {/* Sidebar - Modern App Structure */}
        <aside className={`hidden lg:block transition-all duration-500 ease-in-out h-full ${sidebarCollapsed ? 'w-24' : 'w-72 xl:w-80'}`}>
          <div className={`w-full h-full rounded-[2.5rem] voltris-glass transition-all duration-500 overflow-hidden shadow-2xl relative group`}>
             <div className="absolute inset-0 bg-gradient-to-b from-[#31A8FF]/5 via-transparent to-[#8B31FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
             <Suspense fallback={<div className="w-full h-full animate-pulse bg-white/5" />}>
               <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
             </Suspense>
          </div>
        </aside>

        {/* Mobile Swipe-out Sidebar */}
        <div className="lg:hidden">
          <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
        </div>

        {/* Content Viewport - The Central Stage */}
        <main className={`flex-1 flex flex-col min-h-0 overflow-hidden relative transition-all duration-700
          ${transparencyMode 
            ? 'rounded-none lg:rounded-[3.5rem] voltris-glass shadow-[0_40px_100px_rgba(0,0,0,0.6)]' 
            : 'rounded-none lg:rounded-[3.5rem] bg-[#0A0A12] border border-white/5'
          }
        `}>
          
          {/* Mobile Navigation Bar */}
          <div className={`lg:hidden flex items-center justify-between px-6 px-safe py-4 transition-all duration-300 z-[60] ${scrolled ? 'bg-black/60 backdrop-blur-2xl border-b border-white/10' : 'bg-transparent'}`}>
             <div className="flex items-center gap-3">
               <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#31A8FF] to-[#8B31FF] flex items-center justify-center text-xs font-black text-white shadow-[0_0_20px_rgba(49,168,255,0.3)]">V</div>
               <div className="flex flex-col">
                 <span className="font-black text-[10px] tracking-[0.2em] uppercase text-white/90">Voltris Optimizer</span>
                 <span className="text-[9px] font-bold text-[#31A8FF] uppercase tracking-widest">Dashboard Pro</span>
               </div>
             </div>
             <button onClick={() => setMobileMenuOpen(true)} className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center active:scale-90 transition-all">
                <FiMenu className="w-5 h-5 text-white" />
             </button>
          </div>

          {/* Premium Animated Progress Line (Top Decor) */}
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#31A8FF] to-transparent opacity-20 z-20"></div>

          {/* Scrolling Page Content Container */}
          <div 
            id="main-dashboard-scroll"
            className="flex-1 overflow-y-auto custom-scrollbar-modern px-4 sm:px-8 lg:px-12 py-2 sm:py-6 lg:py-10 relative z-10 scroll-smooth"
          >
             <motion.div 
               key={transparencyMode ? 'glass' : 'solid'}
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ type: "spring", damping: 25, stiffness: 100 }}
               className="h-full min-h-fit"
             >
               {children}
               {/* Padding mobile bottom to account for floating elements if any */}
               <div className="h-20 lg:h-0"></div>
             </motion.div>
          </div>

          {/* Floating UI Elements Hook (Transparency Control, Settings, etc) */}
          <div className="absolute bottom-8 right-8 z-[70] hidden xl:flex flex-col gap-4">
            <motion.button 
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTransparency}
              className="p-4 rounded-3xl voltris-glass shadow-2xl flex items-center justify-center text-white/70 hover:text-[#31A8FF] transition-colors group"
              title={transparencyMode ? 'Desativar Transparência' : 'Ativar Transparência'}
            >
              {transparencyMode ? <FiMinimize2 className="w-5 h-5" /> : <FiMaximize2 className="w-5 h-5" />}
              <div className="absolute right-full mr-4 px-4 py-2 rounded-xl bg-black/80 backdrop-blur-xl text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {transparencyMode ? 'Modo Sólido' : 'Modo Transparente'}
              </div>
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 rounded-3xl voltris-glass shadow-2xl flex items-center justify-center text-white/70 hover:text-[#8B31FF] transition-colors group"
            >
              <FiSettings className="w-5 h-5" />
              <div className="absolute right-full mr-4 px-4 py-2 rounded-xl bg-black/80 backdrop-blur-xl text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Configurações UI
              </div>
            </motion.button>
          </div>
        </main>
      </div>

      <ClientNotificationModal />
      
      {/* Mobile-only Bottom Navigation for quick actions if needed (optional) */}
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