'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [supabase.auth]);

  const tabs = [
    {
      label: 'Visão Geral',
      value: 'overview',
      icon: <i className="fas fa-chart-line text-xl"></i>,
      path: '/dashboard'
    },
    {
      label: 'Meus Pedidos',
      value: 'orders',
      icon: <i className="fas fa-shopping-cart text-xl"></i>,
      path: '/dashboard/orders'
    },
    {
      label: 'Meu Perfil',
      value: 'profile',
      icon: <i className="fas fa-user text-xl"></i>,
      path: '/dashboard/profile'
    },
    {
      label: 'Tickets',
      value: 'tickets',
      icon: <i className="fas fa-ticket-alt text-xl"></i>,
      path: '/dashboard/tickets'
    },
    {
      label: 'Notificações',
      value: 'notifications',
      icon: <i className="fas fa-bell text-xl"></i>,
      path: '/dashboard/notifications'
    }
  ];

  // Sidebar principal (desktop/tablet)
  const sidebarContent = (
    <div className="h-full bg-[#1E1E1E]/40 backdrop-blur-xl rounded-2xl border border-gray-800/30 p-6 w-64 min-w-[220px] max-w-xs">
      {/* User Profile Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF4B6B] to-[#8B31FF] flex items-center justify-center text-white shadow-lg shadow-[#8B31FF]/20">
            <i className="fas fa-user text-xl"></i>
          </div>
          <div>
            <h3 className="text-white font-medium min-h-[1.25rem]">
              {isLoading ? '' : (user?.user_metadata?.full_name || user?.email || '')}
            </h3>
            <p className="text-sm text-gray-400">Cliente VOLTRIS</p>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
      </div>
      {/* Navigation */}
      <nav className="space-y-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path || activeTab === tab.value;
          return (
            <Link
              key={tab.value}
              href={tab.path}
              onClick={() => onTabChange?.(tab.value)}
              className={`relative group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-[#FF4B6B]/20 via-[#8B31FF]/20 to-[#31A8FF]/20 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#171313]/50'
              }`}
            >
              {/* Ícone */}
              <div className={`transition-all duration-300 ${
                isActive
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]'
                  : 'group-hover:text-[#8B31FF]'
              }`}>
                {tab.icon}
              </div>
              {/* Label */}
              <span className={`font-medium transition-all duration-300 ${
                isActive
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]'
                  : 'group-hover:text-white'
              }`}>
                {tab.label}
              </span>
              {/* Indicador ativo */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 w-1 h-8 bg-gradient-to-b from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] rounded-r-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              {/* Efeito de hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B6B]/5 via-[#8B31FF]/5 to-[#31A8FF]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          );
        })}
      </nav>
      {/* Separador */}
      <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
    </div>
  );

  return (
    <>
      {/* Botão hamburguer para mobile */}
      <div className="lg:hidden flex items-center mb-4">
        <button
          className="p-2 rounded-lg bg-[#1E1E1E]/80 text-white focus:outline-none focus:ring-2 focus:ring-[#8B31FF]"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Abrir menu do dashboard"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Sidebar desktop/tablet */}
      <div className="hidden lg:block h-full">
        {sidebarContent}
      </div>
      {/* Drawer mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex"
          >
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Drawer */}
            <div className="relative z-10 w-64 max-w-[80vw] h-full bg-[#1E1E1E] shadow-2xl border-r border-[#8B31FF]/20 flex flex-col">
              <div className="flex justify-end p-4">
                <button
                  className="p-2 rounded-lg bg-[#2a2a2e] text-white focus:outline-none focus:ring-2 focus:ring-[#8B31FF]"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Fechar menu do dashboard"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {sidebarContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}