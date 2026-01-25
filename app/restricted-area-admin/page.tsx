'use client';

import { useAuth } from '@/app/hooks/useAuth';
import AuthGuard from '@/components/AuthGuard';
import { useState, useEffect } from 'react';
import { FiUsers, FiPackage, FiMessageSquare, FiMail, FiFileText, FiZap } from 'react-icons/fi';
import { ClipboardList, TicketCheck } from 'lucide-react';
import AdminOrdersTab from './orders/AdminOrdersTab';
import AdminTicketsTab from './tickets/AdminTicketsTab';
import AdminNewsletterTab from './newsletter/AdminNewsletterTab';
import AdminUsersTab from './users/AdminUsersTab';
import AdminOptimizerTab from './AdminOptimizerTab';

import NotificationTester from '../components/NotificationTester';

const tabs = [
  {
    label: 'Pedidos',
    value: 'orders',
    icon: <ClipboardList size={20} className="text-[#31A8FF]" />,
  },
  {
    label: 'Tickets',
    value: 'tickets',
    icon: <TicketCheck size={20} className="text-[#8B31FF]" />,
  },
  {
    label: 'Newsletter',
    value: 'newsletter',
    icon: <FiMail size={20} className="text-[#FF4B6B]" />,
  },

  {
    label: 'Usuários',
    value: 'users',
    icon: <FiUsers size={20} className="text-[#31A8FF]" />,
  },
  {
    label: 'Optimizer',
    value: 'optimizer',
    icon: <FiZap size={20} className="text-[#FFD700]" />,
  },
];

export default function AdminDashboard() {
  const { user, isAdmin, loading, error } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#18181b] via-[#23232b] to-[#18181b] text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF4B6B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-400">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requireAdmin={true}>
      <div className="text-white h-full">
        {/* Header com espaçamento otimizado */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
          <div className="w-full">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text leading-tight">
              Painel Administrativo
            </h1>
            <p className="text-gray-300 text-lg mt-3 leading-relaxed">
              Bem-vindo ao painel administrativo, {user?.email}
            </p>
          </div>
          {error && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-sm w-full lg:w-auto">
              <p className="text-yellow-400 font-medium">Aviso de Conexão</p>
              <p className="text-yellow-300 text-xs">{error}</p>
            </div>
          )}
        </div>

        {/* Tabs com design premium */}
        <div className="mb-8">
          <div className="flex flex-nowrap gap-3 border-b border-[#8B31FF]/20 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex items-center justify-center gap-3 min-w-[100px] px-6 py-4 font-semibold text-base rounded-t-xl transition-all duration-300 whitespace-nowrap
                  ${activeTab === tab.value
                    ? 'bg-gradient-to-r from-[#FF4B6B]/20 via-[#8B31FF]/20 to-[#31A8FF]/20 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-[#1E1E1E]/40'}
                `}
                style={{ borderBottom: activeTab === tab.value ? '3px solid #8B31FF' : '3px solid transparent' }}
              >
                {tab.icon}
                <span className="text-center">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo das abas - layout fluido */}
        <div className="w-full">
          {activeTab === 'orders' && <AdminOrdersTab />}
          {activeTab === 'tickets' && <AdminTicketsTab />}
          {activeTab === 'newsletter' && <AdminNewsletterTab />}
          {activeTab === 'users' && <AdminUsersTab />}
          {activeTab === 'optimizer' && <AdminOptimizerTab />}
        </div>

        {/* Testador de Notificações Push - Apenas para Administradores */}
        <div className="mt-12 p-6 bg-gradient-to-r from-[#1E1E1E]/80 to-[#2A2A2A]/80 rounded-xl border border-[#8B31FF]/20">
          <NotificationTester />
        </div>
      </div>
    </AuthGuard>
  );
} 
