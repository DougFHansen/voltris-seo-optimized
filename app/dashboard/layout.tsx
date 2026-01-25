'use client';
import React, { Suspense } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/dashboard/Sidebar'
import ClientNotificationModal from './ClientNotificationModal';

// Dashboard Layout Enterprise - No Scroll Global
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-[#050510] flex flex-col overflow-hidden selection:bg-[#8B31FF]/30 font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none z-0"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#31A8FF]/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

      {/* Header Fixo */}
      <div className="relative z-50">
        <Header />
      </div>

      <div className="flex flex-1 min-h-0 relative z-10 pt-20 lg:pt-24 px-4 pb-4 gap-4 max-w-[1920px] mx-auto w-full">
        {/* Sidebar Fixa - Desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0 h-full">
          <Suspense fallback={<div className="w-full h-full bg-white/5 animate-pulse rounded-3xl" />}>
            <Sidebar />
          </Suspense>
        </div>

        {/* Main Content Area - Onde o conteúdo das páginas é renderizado */}
        <main className="flex-1 bg-[#0A0A0F]/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative group">
          {/* Gradient Border Hint */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] opacity-50"></div>

          {/* Content Scrollable Container */}
          {/* As páginas devem preencher este container. Se precisarem de scroll, devem gerenciar internamente ou usar h-full */}
          <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-6 md:p-10">
            {children}
          </div>
        </main>
      </div>

      <ClientNotificationModal />
    </div>
  )
}