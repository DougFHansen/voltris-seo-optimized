'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { 
  FiHome, FiShoppingBag, FiUser, FiHeadphones, 
  FiBell, FiX, FiLogOut, FiMonitor, 
  FiLayout, FiChevronLeft, FiChevronRight, FiCreditCard
} from 'react-icons/fi';
import { useDashboard } from '@/app/context/DashboardContext';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

export default function Sidebar({ mobileOpen = false, setMobileOpen, collapsed, setCollapsed }: SidebarProps) {
  const { transparencyMode } = useDashboard();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const supabase = useMemo(() => createClient(), []);

  // Sync user info
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, [supabase.auth]);

  const tabs = [
    { label: 'Visão Geral', value: 'overview', icon: FiHome, path: '/dashboard', query: { tab: 'overview' }, color: '#31A8FF' },
    { label: 'Meu Computador', value: 'pc', icon: FiMonitor, path: '/dashboard', query: { tab: 'pc' }, color: '#00C9A7' },
    { label: 'Minhas Licenças', value: 'licenses', icon: FiCreditCard, path: '/dashboard', query: { tab: 'licenses' }, color: '#8B31FF' },
    { label: 'Novos Pedidos', value: 'orders', icon: FiShoppingBag, path: '/dashboard/new-order', color: '#FF4B6B' },
    { label: 'Empresas', value: 'companies', icon: FiLayout, path: '/dashboard/companies', color: '#FF9F43' },
    { label: 'Meu Perfil', value: 'profile', icon: FiUser, path: '/dashboard/profile', color: '#00D2FF' },
    { label: 'Suporte', value: 'tickets', icon: FiHeadphones, path: '/dashboard/tickets', color: '#FF3E3E' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className={`h-full flex flex-col transition-all duration-500 ${!isMobile && collapsed ? 'items-center px-4' : 'px-6'} py-8 relative`}>
      
      {/* Sidebar Header / Logo (Mobile/Collapsed Desktop) */}
      <div className={`flex items-center gap-4 mb-10 transition-all duration-500 ${!isMobile && collapsed ? 'justify-center' : ''}`}>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] flex items-center justify-center text-white shadow-[0_0_25px_rgba(139,49,255,0.4)] flex-shrink-0 animate-float">
          <span className="text-xl font-black">V</span>
        </div>
        {(!collapsed || isMobile) && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="font-black text-xs tracking-[0.3em] uppercase text-white leading-none mb-1">Voltris</span>
            <span className="text-[10px] font-bold text-[#31A8FF] uppercase tracking-widest leading-none">Dashboard</span>
          </motion.div>
        )}
      </div>

      {/* Desktop Collapse Toggle */}
      {!isMobile && (
        <button 
          onClick={() => setCollapsed?.(!collapsed)}
          className="absolute -right-3 top-10 w-6 h-6 rounded-full bg-white/10 hover:bg-[#31A8FF] border border-white/10 flex items-center justify-center text-white transition-all z-50 backdrop-blur-xl group hover:scale-110"
        >
          {collapsed ? <FiChevronRight className="w-3 h-3" /> : <FiChevronLeft className="w-3 h-3" />}
        </button>
      )}

      {/* Profile Section */}
      <div className={`mb-10 transition-all duration-500 ${!isMobile && collapsed ? 'w-12 mx-auto overflow-hidden' : 'w-full'}`}>
        <div className={`flex items-center gap-4 p-3 rounded-2xl voltris-glass border border-white/5 transition-all group overflow-hidden ${!isMobile && collapsed ? 'justify-center' : ''}`}>
           <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white flex-shrink-0 relative overflow-hidden group-hover:border-[#31A8FF]/50">
             <span className="text-sm font-black relative z-10">{user?.email?.[0]?.toUpperCase() || '?'}</span>
             <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#31A8FF] opacity-50"></div>
           </div>
           {(!collapsed || isMobile) && (
             <div className="min-w-0 flex-1 flex flex-col">
                <h3 className="text-white font-black text-xs truncate uppercase tracking-wider">
                  {user?.user_metadata?.full_name?.split(' ')[0] || 'Gamer'}
                </h3>
                <span className="text-[9px] font-bold text-emerald-400/80 uppercase tracking-widest">Ativo Agora</span>
             </div>
           )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar relative z-10">
         {tabs.map((tab) => {
            const Icon = tab.icon;
            let isActive = false;
            
            if (tab.path === '/dashboard') {
              if (tab.query?.tab === 'overview') {
                isActive = pathname === '/dashboard' && (!searchParams.get('tab') || searchParams.get('tab') === 'overview');
              } else {
                isActive = pathname === '/dashboard' && searchParams.get('tab') === tab.query?.tab;
              }
            } else {
              isActive = pathname.startsWith(tab.path);
            }

            return (
              <Link
                key={tab.label}
                href={tab.query ? { pathname: tab.path, query: tab.query } : tab.path}
                onClick={() => setMobileOpen?.(false)}
                className={`group flex items-center gap-4 transition-all duration-300 rounded-2xl relative
                  ${!isMobile && collapsed ? 'p-4 justify-center' : 'p-4'}
                  ${isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'}
                `}
                title={collapsed && !isMobile ? tab.label : ''}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-2xl"
                    style={{ 
                      background: `linear-gradient(to right, ${tab.color}15, transparent)`,
                      border: `1px solid ${tab.color}20`
                    }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon 
                  className={`w-5 h-5 relative z-10 transition-all duration-300 ${isActive ? 'scale-110' : 'opacity-70 group-hover:opacity-100'}`} 
                  style={{ color: tab.color }}
                />
                {(!collapsed || isMobile) && (
                  <span className={`relative z-10 font-bold text-xs uppercase tracking-widest transition-all ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`} style={{ color: isActive ? tab.color : 'inherit' }}>
                    {tab.label}
                  </span>
                )}
                {isActive && (
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-full" 
                    style={{ 
                      background: `linear-gradient(to bottom, ${tab.color}, ${tab.color}bb)`,
                      boxShadow: `0 0 15px ${tab.color}`
                    }}
                  ></div>
                )}
              </Link>
            );
         })}
      </nav>

      {/* Logout / Bottom */}
      <div className="pt-8 mt-4 border-t border-white/5 flex-shrink-0">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group overflow-hidden ${!isMobile && collapsed ? 'justify-center' : ''}`}
        >
          <FiLogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform flex-shrink-0" />
          {(!collapsed || isMobile) && (
            <span className="font-black text-[10px] uppercase tracking-[0.2em]">Sair</span>
          )}
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Shell */}
      <div className="hidden lg:block h-full w-full">
        <SidebarContent />
      </div>

      {/* Mobile Drawer Shell */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[150] lg:hidden">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setMobileOpen?.(false)}
            />
            
            {/* Drawer Surface */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 h-full w-[85%] max-w-sm bg-[#050510] border-r border-white/10 shadow-3xl"
            >
              <SidebarContent isMobile />
              {/* Mobile Swipe-Close Handle */}
              <div className="absolute top-1/2 -right-4 w-12 h-20 flex items-center justify-center lg:hidden">
                <div className="w-1.5 h-12 rounded-full bg-white/10"></div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}