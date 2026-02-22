'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, ShoppingCart, User, Ticket } from 'lucide-react';

export default function MobileTabs() {
  const pathname = usePathname();

  const tabs = [
    {
      label: 'Visão Geral',
      value: 'overview',
      icon: <BarChart3 size={20} />,
      path: '/dashboard'
    },
    {
      label: 'Meus Pedidos',
      value: 'orders',
      icon: <ShoppingCart size={20} />,
      path: '/dashboard/orders'
    },
    {
      label: 'Meu Perfil',
      value: 'profile',
      icon: <User size={20} />,
      path: '/dashboard/profile'
    },
    {
      label: 'Tickets',
      value: 'tickets',
      icon: <Ticket size={20} />,
      path: '/dashboard/tickets'
    }
  ];

  return (
    <div className="bg-[#1E1E1E]/95 backdrop-blur-xl border border-gray-800/30 rounded-xl shadow-lg w-full overflow-hidden">
      <div className="px-4 py-4 w-full">
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2 w-full -webkit-overflow-scrolling-touch">
          {tabs.map((tab) => {
            const isActive = pathname === tab.path;
            return (
              <Link
                key={tab.value}
                href={tab.path}
                className={`relative flex-shrink-0 flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-300 min-h-[52px] min-w-[52px] ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF4B6B]/20 via-[#8B31FF]/20 to-[#31A8FF]/20 text-white border border-[#8B31FF]/30 shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-[#171313]/50 border border-transparent hover:border-[#8B31FF]/20'
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
                <span className={`font-medium text-base transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]'
                    : 'group-hover:text-white'
                }`}>
                  {tab.label}
                </span>
                {/* Indicador ativo */}
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                {/* Efeito de hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B6B]/5 via-[#8B31FF]/5 to-[#31A8FF]/5 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}