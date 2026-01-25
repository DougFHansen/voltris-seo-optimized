'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import {
  FiPackage, FiClock, FiCheckCircle, FiRefreshCw, FiPlus,
  FiSearch, FiFilter, FiMoreVertical, FiArrowRight, FiActivity
} from 'react-icons/fi';
import type { Order } from '@/types/order';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/app/hooks/useAuth';
import AuthGuard from '@/components/AuthGuard';
import UserOptimizerSection from './UserOptimizerSection';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';


// Componente de Card de Estatística Ultra-Moderno
const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="relative group overflow-hidden bg-[#121218] border border-white/5 p-6 rounded-3xl hover:border-white/10 transition-all duration-500"
  >
    <div className={`absolute -right-6 -top-6 w-32 h-32 bg-${color}-500/10 rounded-full blur-3xl group-hover:bg-${color}-500/20 transition-all duration-500`}></div>
    <div className="relative z-10 flex justify-between items-start">
      <div>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">{title}</p>
        <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
      </div>
      <div className={`p-3 rounded-2xl bg-${color}-500/10 border border-${color}-500/20 text-${color}-400 group-hover:scale-110 transition-transform duration-500`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    {/* Progress Bar Decorativa */}
    <div className="mt-6 w-full h-1 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 1.5, delay: delay + 0.2 }}
        className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-400`}
      />
    </div>
  </motion.div>
);

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#8B31FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const { user, profile, loading } = useAuth();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const supabase = createClient();

  // Lógica de Redirecionamento (Google Only) - Mantida e Segura
  useEffect(() => {
    if (profile && user) {
      const isGoogle = user.app_metadata?.provider === 'google' ||
        user.identities?.some((id: any) => id.provider === 'google');

      if (isGoogle) {
        const missingFields = !profile.phone || !profile.city;
        if (missingFields) {
          // window.location.replace('/perfil?completar=1&force=1'); // Descomentar se quiser forçar
        }
      }
    }
  }, [profile, user]);

  const fetchData = useCallback(async (showLoading = true) => {
    if (!user) return;
    try {
      if (showLoading) setIsLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao atualizar dashboard');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]);

  const filteredOrders = orders.filter(order => filter === 'all' || order.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'completed').length
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#8B31FF] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 animate-pulse">Sincronizando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="h-[calc(100vh-140px)] flex flex-col gap-6 overflow-hidden">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              Dashboard <span className="text-xs px-2 py-1 rounded bg-[#31A8FF]/10 text-[#31A8FF] border border-[#31A8FF]/20">PRO</span>
            </h1>
            <p className="text-slate-400 mt-1">Visão geral da sua conta e serviços ativos.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setIsRefreshing(true); fetchData(false).finally(() => setIsRefreshing(false)); }}
              className="p-3 bg-[#1A1A22] border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
              title="Atualizar"
            >
              <FiRefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <Link href="/servicos" className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <FiPlus className="w-5 h-5" />
              <span>Novo Pedido</span>
            </Link>
          </div>
        </div>

        {/* Conditional Sections based on Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-6 flex-1 min-h-0"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-shrink-0">
              <StatCard title="Total de Pedidos" value={stats.total} icon={FiPackage} color="blue" delay={0.1} />
              <StatCard title="Em Andamento" value={stats.pending} icon={FiActivity} color="purple" delay={0.2} />
              <StatCard title="Concluídos" value={stats.completed} icon={FiCheckCircle} color="green" delay={0.3} />
            </div>

            {/* List Content */}
            <div className="flex-1 min-h-0 bg-[#121218] border border-white/5 rounded-3xl overflow-hidden flex flex-col relative group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] opacity-50 block"></div>

              <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 flex-shrink-0 bg-[#121218]">
                <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto no-scrollbar">
                  {['all', 'pending', 'completed'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${filter === f
                        ? 'bg-white text-black'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendentes' : 'Concluídos'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                <AnimatePresence>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, i) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-[#1A1A22] border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${order.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-purple-500/10 text-purple-400'}`}>
                            <FiPackage className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-white font-bold">Pedido #{order.id.substring(0, 8)}</h4>
                            <p className="text-sm text-slate-400">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="text-xs text-slate-500 uppercase tracking-widest">Valor</p>
                            <p className="text-white font-bold">R$ {order.total.toFixed(2)}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${order.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
                            {order.status === 'completed' ? 'Concluído' : 'Processando'}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                      <FiPackage className="w-16 h-16 text-slate-600 mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Sem pedidos por aqui</h3>
                      <p className="text-slate-400">Seus pedidos aparecerão nesta área.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'pc' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1"
          >
            <UserOptimizerSection userId={user?.id || ''} />
          </motion.div>
        )}
      </div>

      {/* Invisible Setup */}

    </AuthGuard>
  );
}