'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { FiHome, FiShoppingBag, FiUser, FiHeadphones, FiBell, FiMenu, FiX, FiLogOut, FiMonitor, FiLayout } from 'react-icons/fi';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({ activeTab, onTabChange, mobileOpen = false, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  // Fechar menu ao navegar
  useEffect(() => {
    if (setMobileOpen) setMobileOpen(false);
  }, [pathname, searchParams, setMobileOpen]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, [supabase.auth]);

  const tabs = [
    { label: 'Visão Geral', value: 'overview', icon: FiHome, path: '/dashboard', query: { tab: 'overview' } },
    { label: 'Meu Computador', value: 'pc', icon: FiMonitor, path: '/dashboard', query: { tab: 'pc' } },
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
      <div className="flex-1 bg-[#121218] lg:bg-[#121218]/90 backdrop-blur-2xl rounded-tr-3xl rounded-br-3xl lg:rounded-3xl border-r lg:border border-white/5 shadow-2xl p-6 flex flex-col relative overflow-hidden h-full">
        {/* Background Decor (Apenas Desktop para performance ou estilo) */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]"></div>

        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end mb-4">
          <button
            onClick={() => setMobileOpen?.(false)}
            className="p-2 bg-white/5 rounded-lg text-white hover:bg-white/10"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

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
        <nav className="space-y-2 flex-1 relative z-10 overflow-y-auto custom-scrollbar pr-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            // Lógica robusta de active state
            let isActive = false;
            if (tab.path === '/dashboard') {
              if (!tab.query) isActive = pathname === '/dashboard' && !searchParams.get('tab');
              else isActive = pathname === '/dashboard' && searchParams.get('tab') === tab.query.tab;
              if (tab.value === 'overview' && pathname === '/dashboard' && !searchParams.get('tab')) isActive = true;
            } else {
              isActive = pathname.startsWith(tab.path);
            }

            return (
              <Link
                href={tab.query ? { pathname: tab.path, query: tab.query } : tab.path}
                key={tab.label}
                onClick={() => setMobileOpen?.(false)}
                className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'}`}
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
        <div className="pt-6 mt-6 border-t border-white/5 relative z-10 flex-shrink-0">
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
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full w-full">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[110] lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setMobileOpen?.(false)}
            />
            {/* Drawer Content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 h-full w-[85%] max-w-sm bg-[#050510] shadow-2xl"
            >
              <SidebarContent />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}