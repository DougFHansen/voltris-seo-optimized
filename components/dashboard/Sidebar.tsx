'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { FiHome, FiShoppingBag, FiUser, FiHeadphones, FiBell, FiMenu, FiX, FiLogOut, FiMonitor } from 'react-icons/fi';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, [supabase.auth]);

  const tabs = [
    { label: 'Visão Geral', value: 'overview', icon: FiHome, path: '/dashboard', query: { tab: 'overview' } },
    { label: 'Meu PC', value: 'pc', icon: FiMonitor, path: '/dashboard', query: { tab: 'pc' } },
    { label: 'Meus Pedidos', value: 'orders', icon: FiShoppingBag, path: '/dashboard/orders' },
    { label: 'Meu Perfil', value: 'profile', icon: FiUser, path: '/perfil' },
    { label: 'Suporte', value: 'tickets', icon: FiHeadphones, path: '/dashboard/tickets' },
    { label: 'Notificações', value: 'notifications', icon: FiBell, path: '/dashboard/notifications' }
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="flex-1 bg-[#121218]/90 backdrop-blur-2xl rounded-3xl border border-white/5 shadow-2xl p-6 flex flex-col relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#8B31FF]/10 rounded-full blur-3xl"></div>

        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-white/[0.03] rounded-2xl border border-white/5 relative z-10 transition-all hover:bg-white/[0.05]">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B31FF] to-[#31A8FF] flex items-center justify-center text-white shadow-lg relative flex-shrink-0">
            <span className="text-lg font-bold">{user?.email?.[0]?.toUpperCase()}</span>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#00FF94] rounded-full border-2 border-[#121218] shadow-[0_0_5px_#00FF94]"></div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-bold truncate text-sm">
              {user?.user_metadata?.full_name?.split(' ')[0] || 'Cliente'}
            </h3>
            <p className="text-xs text-slate-400 truncate">Conta Verificada</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1 relative z-10 overflow-y-auto custom-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            // Lógica para marcar ativo (home exact match, others startsWith)
            const currentTab = searchParams.get('tab') || 'overview';

            let isActive = false;
            if (tab.path === '/dashboard' && !tab.query) {
              // Caso base /dashboard puro
              isActive = pathname === '/dashboard' && !searchParams.get('tab');
            } else if (tab.query) {
              // Caso com query param (tab=pc, etc)
              isActive = pathname === '/dashboard' && searchParams.get('tab') === tab.query.tab;
            } else {
              // Outras páginas
              isActive = pathname.startsWith(tab.path);
            }

            return (
              <Link
                href={tab.query ? { pathname: tab.path, query: tab.query } : tab.path}
                key={tab.label}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden ${isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-[#31A8FF]/10 border border-[#31A8FF]/20 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 transition-colors duration-300 ${isActive ? 'text-[#31A8FF]' : 'group-hover:text-[#31A8FF]'}`} />
                <span className="relative z-10 font-medium text-sm">{tab.label}</span>
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#31A8FF] rounded-r-full shadow-[0_0_10px_#31A8FF]"></div>}
              </Link>
            )
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="pt-6 mt-6 border-t border-white/5 relative z-10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all font-medium text-sm group"
          >
            <FiLogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Sair da Conta</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden fixed top-20 left-4 z-40">
        <button
          className="p-3 rounded-xl bg-[#121218]/90 backdrop-blur-xl border border-white/10 text-white shadow-lg"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <FiMenu className="w-6 h-6" />
        </button>
      </div>

      <div className="hidden lg:block h-full w-80 flex-shrink-0">
        <SidebarContent />
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 h-full w-4/5 max-w-sm bg-[#050510] shadow-2xl"
            >
              <div className="h-full">
                <SidebarContent />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}