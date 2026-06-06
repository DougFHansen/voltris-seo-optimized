'use client';

import { useAuth } from '@/app/hooks/useAuth';
import AuthGuard from '@/components/AuthGuard';
import { useState, useEffect } from 'react';
import { FiUsers, FiPackage, FiMessageSquare, FiMail, FiFileText, FiZap, FiMenu, FiChevronLeft, FiChevronRight, FiLogOut, FiHome } from 'react-icons/fi';
import { ClipboardList, TicketCheck } from 'lucide-react';
import AdminOrdersTab from './orders/AdminOrdersTab';
import AdminTicketsTab from './tickets/AdminTicketsTab';
import AdminNewsletterTab from './newsletter/AdminNewsletterTab';
import AdminUsersTab from './users/AdminUsersTab';
import NotificationTester from '../components/NotificationTester';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const tabs = [
  { label: 'Visão Geral', value: 'overview', icon: <FiHome size={20} className="text-[#31A8FF]" /> },
  { label: 'Pedidos', value: 'orders', icon: <ClipboardList size={20} className="text-[#FF4B6B]" /> },
  { label: 'Tickets', value: 'tickets', icon: <TicketCheck size={20} className="text-[#8B31FF]" /> },
  { label: 'Newsletter', value: 'newsletter', icon: <FiMail size={20} className="text-[#FF9F43]" /> },
  { label: 'Usuários', value: 'users', icon: <FiUsers size={20} className="text-[#00C9A7]" /> },
];

export default function AdminDashboard() {
  const { user, isAdmin, loading, error, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#18181b] via-[#23232b] to-[#18181b] text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF4B6B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Iniciando Terminal de Comando...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className={`h-full flex flex-col transition-all duration-500 ${!isMobile && sidebarCollapsed ? 'items-center px-4' : 'px-6'} py-8 relative`}>
      {/* Sidebar Header / Logo */}
      <div className={`flex items-center gap-4 mb-10 transition-all duration-500 ${!isMobile && sidebarCollapsed ? 'justify-center' : ''}`}>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] flex items-center justify-center text-white shadow-[0_0_25px_rgba(139,49,255,0.4)] flex-shrink-0">
          <span className="text-xl font-black">A</span>
        </div>
        {(!sidebarCollapsed || isMobile) && (
          <div className="flex flex-col">
            <span className="font-black text-xs tracking-[0.3em] uppercase text-white leading-none mb-1">Voltris</span>
            <span className="text-[10px] font-bold text-[#FF4B6B] uppercase tracking-widest leading-none">Admin Terminal</span>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      {!isMobile && (
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-10 w-6 h-6 rounded-full bg-gray-800 hover:bg-[#FF4B6B] border border-gray-700 flex items-center justify-center text-gray-300 hover:text-white transition-all z-50 group"
        >
          {sidebarCollapsed ? <FiChevronRight className="w-3 h-3" /> : <FiChevronLeft className="w-3 h-3" />}
        </button>
      )}

      {/* Admin Profile */}
      <div className={`mb-10 transition-all duration-500 ${!isMobile && sidebarCollapsed ? 'w-12 mx-auto overflow-hidden' : 'w-full'}`}>
        <div className={`flex items-center gap-4 p-3 rounded-2xl bg-[#23232b] border border-gray-800/50 transition-all group overflow-hidden ${!isMobile && sidebarCollapsed ? 'justify-center' : ''}`}>
           <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-white flex-shrink-0 relative overflow-hidden group-hover:border-[#FF4B6B]/50">
             <span className="text-sm font-black relative z-10">{user?.email?.[0]?.toUpperCase() || 'A'}</span>
             <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#FF4B6B] opacity-50"></div>
           </div>
           {(!sidebarCollapsed || isMobile) && (
             <div className="min-w-0 flex-1 flex flex-col">
                <h3 className="text-white font-black text-xs truncate uppercase tracking-wider">
                  System Admin
                </h3>
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Nível Supremo</span>
             </div>
           )}
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-2 overflow-y-auto relative z-10 custom-scrollbar-modern">
         {tabs.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => { setActiveTab(tab.value); setMobileMenuOpen(false); }}
                className={`w-full group flex items-center gap-4 transition-all duration-300 rounded-2xl relative
                  ${!isMobile && sidebarCollapsed ? 'p-4 justify-center' : 'p-4'}
                  ${isActive ? 'text-white bg-[#23232b]' : 'text-gray-400 hover:text-white hover:bg-[#2a2a35]'}
                `}
                title={sidebarCollapsed && !isMobile ? tab.label : ''}
              >
                {isActive && (
                  <motion.div
                    layoutId="admin-sidebar-active"
                    className="absolute inset-0 rounded-2xl border border-gray-700/50 shadow-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className={`relative z-10 transition-all duration-300 ${isActive ? 'scale-110' : 'opacity-70 group-hover:opacity-100'}`}>
                   {tab.icon}
                </div>
                {(!sidebarCollapsed || isMobile) && (
                  <span className={`relative z-10 font-bold text-xs uppercase tracking-widest transition-all ${isActive ? 'text-white' : ''}`}>
                    {tab.label}
                  </span>
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-full bg-gradient-to-b from-[#8B31FF] to-[#31A8FF] shadow-[0_0_15px_#8B31FF]"></div>
                )}
              </button>
            );
         })}
      </nav>

      {/* Logout */}
      <div className="pt-8 mt-4 border-t border-gray-800/50 flex-shrink-0">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group overflow-hidden ${!isMobile && sidebarCollapsed ? 'justify-center' : ''}`}
        >
          <FiLogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && (
            <span className="font-black text-[10px] uppercase tracking-[0.2em]">Desconectar</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <AuthGuard requireAdmin={true}>
      <div className="flex h-screen w-screen bg-gradient-to-br from-[#18181b] via-[#23232b] to-[#18181b] text-white overflow-hidden">
        
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:block h-full transition-all duration-500 border-r border-gray-800/50 bg-[#18181b]/80 backdrop-blur-3xl z-50 ${sidebarCollapsed ? 'w-24' : 'w-72 xl:w-80'}`}>
          <SidebarContent />
        </aside>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-[150] lg:hidden">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setMobileMenuOpen(false)} />
              <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute top-0 left-0 h-full w-[85%] max-w-sm bg-[#18181b] border-r border-gray-800 shadow-2xl">
                <SidebarContent isMobile />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Main Area */}
        <div className="flex flex-1 flex-col overflow-hidden relative">
          
          {/* Top Header */}
          <header className="h-20 lg:h-24 px-6 sm:px-10 flex items-center justify-between border-b border-gray-800/50 bg-[#18181b]/50 backdrop-blur-2xl z-40 shrink-0">
             <div className="flex items-center gap-4">
                <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-3 rounded-xl bg-gray-800 border border-gray-700 text-white">
                  <FiMenu className="w-5 h-5" />
                </button>
                <div>
                   <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text leading-tight tracking-tighter uppercase italic">
                     Centro de Operações
                   </h2>
                   <p className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1">
                     {tabs.find(t => t.value === activeTab)?.label}
                   </p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <Link href="/dashboard" className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800/50 border border-gray-700 hover:bg-gray-700 transition-colors text-xs font-bold uppercase tracking-widest text-gray-300">
                   Painel Usuário <FiZap className="w-4 h-4 text-yellow-400" />
                </Link>
             </div>
          </header>

          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar-modern px-4 sm:px-8 lg:px-12 py-8 scroll-smooth relative z-10">
             <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 100 }}
                className="max-w-[1600px] mx-auto w-full pb-20"
             >
                {error && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-sm w-full mb-8 flex items-center gap-4">
                    <FiZap className="w-6 h-6 text-yellow-400" />
                    <div>
                      <p className="text-yellow-400 font-black uppercase tracking-widest text-[10px]">Alerta do Sistema</p>
                      <p className="text-yellow-300/80 text-xs mt-1">{error}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-[#23232b] p-8 rounded-3xl border border-gray-800/50">
                        <h3 className="text-lg font-black text-white uppercase italic tracking-tighter mb-4">Bem-vindo, {user?.email}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">Você está no terminal de nível supremo. Utilize a barra lateral para gerenciar pedidos, responder tickets e controlar assinaturas.</p>
                     </div>
                     <div className="bg-[#23232b] p-8 rounded-3xl border border-gray-800/50">
                        <NotificationTester />
                     </div>
                  </div>
                )}
                
                {activeTab === 'orders' && <AdminOrdersTab />}
                {activeTab === 'tickets' && <AdminTicketsTab />}
                {activeTab === 'newsletter' && <AdminNewsletterTab />}
                {activeTab === 'users' && <AdminUsersTab />}
             </motion.div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
} 
