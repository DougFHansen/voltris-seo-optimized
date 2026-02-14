'use client';
import React, { Suspense, useState } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/dashboard/Sidebar'
import ClientNotificationModal from './ClientNotificationModal';
import { FiMenu, FiLayout } from 'react-icons/fi';

// Dashboard Layout Enterprise - No Scroll Global
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen bg-[#050510] flex flex-col overflow-hidden selection:bg-[#8B31FF]/30 font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none z-0"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#31A8FF]/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

      {/* Header Fixo */}
      <div className="relative z-50">
        <Header />
      </div>

      {/* Spacer para o Header Fixo (Global) */}
      <div className="h-16 lg:h-20 flex-shrink-0" />

      {/* Mobile Dashboard Sub-Header */}
      <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#121218]/80 backdrop-blur-md border-b border-white/10 relative z-40 flex-shrink-0">
        <div className="flex items-center gap-2">
          <FiLayout className="text-[#31A8FF]" />
          <span className="font-bold text-white text-sm tracking-wide">DASHBOARD</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 -mr-2 text-white hover:bg-white/10 rounded-lg active:scale-95 transition-transform"
        >
          <FiMenu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-1 min-h-0 relative z-10 px-0 lg:px-2 pb-0 lg:pb-2 pt-0 lg:pt-2 gap-0 lg:gap-2 max-w-[1920px] mx-auto w-full">
        {/* Sidebar Fixa - Desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0 h-full">
          <Suspense fallback={<div className="w-full h-full bg-white/5 animate-pulse rounded-3xl" />}>
            {/* Desktop instance - Props de mobile ignoradas aqui */}
            <Sidebar />
          </Suspense>
        </div>

        {/* Sidebar Instance para Mobile (Drawer Control) */}
        <div className="lg:hidden">
          <Suspense fallback={null}>
            <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
          </Suspense>
        </div>

        {/* Main Content Area - Onde o conteúdo das páginas é renderizado */}
        <main className="flex-1 bg-[#0A0A0F]/80 backdrop-blur-2xl rounded-none lg:rounded-[2.5rem] border-0 lg:border border-white/5 shadow-2xl overflow-hidden relative group">
          {/* Gradient Border Hint */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] opacity-50"></div>

          {/* Content Scrollable Container */}
          {/* As páginas devem preencher este container. Se precisarem de scroll, devem gerenciar internamente ou usar h-full */}
          <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-2 md:p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>

      <ClientNotificationModal />
    </div>
  )
}