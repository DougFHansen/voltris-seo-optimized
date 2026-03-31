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
  const [scrolled, setScrolled] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
        
        {/* Neural Grid Overlay - Tactical aesthetic */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-screen" 
          style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />
      </div>

      {/* Header - Adaptive & Floating Style - Desktop Only to avoid mobile navigation conflicts */}
      <div className={`hidden lg:block relative z-[100] transition-all duration-500`}>
        <Header />
      </div>

      {/* Main Layout Body */}
      <div className="flex flex-1 min-h-0 relative z-10 px-0 lg:px-6 pb-0 lg:pb-6 pt-0 lg:pt-20 gap-0 lg:gap-6 max-w-[2000px] mx-auto w-full">
        
        {/* Sidebar - Modern App Structure */}
        <aside className={`hidden lg:block transition-all duration-500 ease-in-out h-full ${sidebarCollapsed ? 'w-24' : 'w-72 xl:w-80'}`}>
          <div className={`w-full h-full rounded-[2.5rem] voltris-glass transition-all duration-500 overflow-visible shadow-2xl relative group`}>
             <div className="absolute inset-0 bg-gradient-to-b from-[#31A8FF]/5 via-transparent to-[#8B31FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2.5rem]"></div>
             <Suspense fallback={<div className="w-full h-full animate-pulse bg-white/5" />}>
               <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
             </Suspense>
          </div>
        </aside>

        {/* Mobile Swipe-out Sidebar */}
        <div className="lg:hidden">
          <Suspense fallback={null}>
            <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
          </Suspense>
        </div>


      {/* Content Viewport - The Central Stage */}
      <main className={`flex-1 flex flex-col min-h-0 overflow-hidden relative transition-all duration-700 w-full
        ${transparencyMode 
          ? 'rounded-none lg:rounded-[3.5rem] voltris-glass shadow-[0_40px_100px_rgba(0,0,0,0.6)]' 
          : 'rounded-none lg:rounded-[3.5rem] bg-[#0A0A12] border border-white/5'
        }
      `}>
          
        {/* Mobile Navigation Bar - Fixed at top with blur */}
        <div className={`lg:hidden flex items-center justify-between px-6 py-4 transition-all duration-300 z-[60] sticky top-0 ${scrolled ? 'bg-[#050510]/80 backdrop-blur-2xl border-b border-white/10' : 'bg-transparent'}`}>
           <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#31A8FF] to-[#8B31FF] flex items-center justify-center text-xs font-black text-white shadow-[0_0_20px_rgba(49,168,255,0.3)]">V</div>
             <div className="flex flex-col">
               <span className="font-black text-[10px] tracking-[0.2em] uppercase text-white/90">Voltris</span>
               <span className="text-[9px] font-bold text-[#31A8FF] uppercase tracking-widest leading-none">Painel Pro</span>
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
          className="flex-1 w-full max-w-full overflow-y-auto overflow-x-hidden custom-scrollbar-modern px-4 sm:px-8 lg:px-12 py-4 sm:py-6 lg:py-10 relative z-10 scroll-smooth"
        >
           <motion.div 
             key={transparencyMode ? 'glass' : 'solid'}
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ type: "spring", damping: 25, stiffness: 100 }}
             className="h-full min-h-fit"
           >
             {children}
             {/* Padding mobile bottom to account for Bottom Nav */}
             <div className="h-28 lg:h-0"></div>
           </motion.div>
        </div>

        {/* Mobile Bottom Navigation - Quick Access Tabs */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] w-[90%] max-w-[400px]">
           <nav className="flex items-center justify-around p-2.5 rounded-[2rem] bg-[#0A0A0F]/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {[
                { id: 'overview', icon: FiLayout, label: 'Início', path: '/dashboard?tab=overview' },
                { id: 'licenses', icon: FiCreditCard, label: 'Licenças', path: '/dashboard?tab=licenses' },
                { id: 'pc', icon: FiMonitor, label: 'PC', path: '/dashboard?tab=pc' },
                { id: 'support', icon: FiSettings, label: 'Suporte', path: '/dashboard/tickets' }
              ].map((item) => (
                <Link key={item.id} href={item.path} className="flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all">
                   <item.icon className={`w-5 h-5 ${item.path.includes('tab=overview') ? 'text-white' : 'text-white/40'}`} />
                   <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{item.label}</span>
                </Link>
              ))}
           </nav>
        </div>

        {/* Floating UI Elements Hook (Desktop only) - Discreto e à Direita */}
        <div className="absolute bottom-10 right-10 z-[70] hidden xl:flex flex-col gap-3">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTransparency}
            className="p-3 rounded-2xl voltris-glass shadow-2xl flex items-center justify-center text-white/50 hover:text-[#31A8FF] transition-all group border border-white/5 hover:border-[#31A8FF]/30"
            title={transparencyMode ? 'Modo Sólido' : 'Modo Transparente'}
          >
            {transparencyMode ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
            <div className="absolute right-full mr-4 px-3 py-1.5 rounded-lg bg-black/90 backdrop-blur-xl text-[9px] font-black uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
              {transparencyMode ? 'Modo Sólido' : 'Modo Transparente'}
            </div>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSettingsOpen(true)}
            className="p-3 rounded-2xl voltris-glass shadow-2xl flex items-center justify-center text-white/50 hover:text-[#8B31FF] transition-all group border border-white/5 hover:border-[#8B31FF]/30"
          >
            <FiSettings className="w-4 h-4" />
            <div className="absolute right-full mr-4 px-3 py-1.5 rounded-lg bg-black/90 backdrop-blur-xl text-[9px] font-black uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
              Configurações UI
            </div>
          </motion.button>
        </div>
      </main>
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