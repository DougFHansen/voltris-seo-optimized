'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import {
  FiPackage, FiClock, FiCheckCircle, FiRefreshCw, FiPlus,
  FiActivity, FiAlertTriangle, FiSearch
} from 'react-icons/fi';
import type { Order } from '@/types/order';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/app/hooks/useAuth';
import AuthGuard from '@/components/AuthGuard';
import MyComputerPage from './MyComputerPage';
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

export default function DashboardClient() {
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
  const activeTab = searchParams.get('tab') || (searchParams.get('checkout_success') === 'true' ? 'licenses' : 'overview');

  const [orders, setOrders] = useState<Order[]>([]);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const supabase = useMemo(() => createClient(), []);

  // Lógica de Redirecionamento (Google Only)
  useEffect(() => {
    if (profile && user) {
      const isGoogle = user.app_metadata?.provider === 'google' ||
        user.identities?.some((id: any) => id.provider === 'google');

      if (isGoogle) {
        const missingFields = !profile.phone || !profile.city;
        if (missingFields) {
          // window.location.replace('/perfil?completar=1&force=1');
        }
      }
    }
  }, [profile, user]);

  const fetchData = useCallback(async (showLoading = true) => {
    if (!user) return;
    try {
      if (showLoading) setIsLoading(true);

      // Executar buscas em paralelo para performance máxima
      const [ordersRes, licensesRes] = await Promise.all([
        supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('licenses').select('*').eq('email', user.email).order('created_at', { ascending: false })
      ]);

      if (ordersRes.error) throw ordersRes.error;
      setOrders(ordersRes.data || []);
      
      if (!licensesRes.error) {
        setLicenses(licensesRes.data || []);
      }

    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao atualizar dashboard');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (user) {
      // Segurança: Destravar carregamento se houver lentidão na rede (3s)
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 3000);

      fetchData().finally(() => clearTimeout(timeout));
    }
  }, [user, fetchData]);

  // DETECTAR SUCESSO NO CHECKOUT (STRIPE)
  // Usar ref separado para evitar chamar mais de uma vez
  const [licenseConfirmed, setLicenseConfirmed] = useState(false);

  // SUCESSO NO CHECKOUT (RELATÓRIO STRIPE)
  useEffect(() => {
    const success = searchParams.get('checkout_success');
    if (success !== 'true' || loading) return;

    // Toast de boas-vindas
    toast.success('Pagamento iniciado! Sua licença será ativada em breves instantes.', {
      duration: 5000,
      position: 'top-center',
      icon: '🚀',
      style: { background: '#121218', color: '#fff' },
    });

    // Refresh inicial e após delay curto (esperando webhook)
    fetchData(false);
    const timer = setTimeout(() => fetchData(false), 5000);
    return () => clearTimeout(timer);
  }, [searchParams, loading, fetchData]);

  const filteredOrders = orders.filter(order => filter === 'all' || order.status === filter);

  const stats = {
    total: orders.length,
    licenses: licenses.length,
    active: licenses.filter(l => l.is_active).length
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#8B31FF] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 animate-pulse">Sincronizando seus serviços...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-full pb-20 lg:pb-0 h-full overflow-y-auto custom-scrollbar-modern">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0 px-2 sm:px-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3 flex-wrap">
              Dashboard <span className="text-[10px] sm:text-xs px-2 py-1 rounded bg-[#31A8FF]/10 text-[#31A8FF] border border-[#31A8FF]/20">PRO</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-1">Bem-vindo, {profile?.full_name?.split(' ')[0] || 'Gamer'}.</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => { setIsRefreshing(true); fetchData(false).finally(() => setIsRefreshing(false)); }}
              className="p-2.5 sm:p-3 bg-[#1A1A22] border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-slate-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Atualizar"
            >
              <FiRefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <Link href="/servicos" className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)] text-sm sm:text-base min-h-[44px]">
              <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Novo Pedido</span>
            </Link>
          </div>
        </div>

        {/* Tabs Switcher */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-3 px-1">
          {['overview', 'licenses', 'pc'].map((tab) => (
            <Link
              key={tab}
              href={`/dashboard?tab=${tab}`}
              className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 group relative ${activeTab === tab
                ? 'bg-[#31A8FF] text-white shadow-[0_8px_20px_rgba(49,168,255,0.25)] scale-105'
                : 'bg-[#1A1A22] text-slate-400 hover:text-white border border-white/5 hover:bg-white/5'
                }`}
            >
              {tab === 'overview' && <FiActivity className="w-4 h-4" />}
              {tab === 'licenses' && <FiCheckCircle className="w-4 h-4" />}
              {tab === 'pc' && <FiPackage className="w-4 h-4" />}
              <span>{tab === 'overview' ? 'Geral' : tab === 'licenses' ? 'Minhas Licenças' : 'Meu Computador'}</span>
            </Link>
          ))}
        </div>

        {/* Conditional Sections */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <StatCard title="Total de Pedidos" value={stats.total} icon={FiPackage} color="blue" delay={0.1} />
              <StatCard title="Licenças Ativas" value={stats.active} icon={FiCheckCircle} color="green" delay={0.2} />
              <StatCard title="Computadores" value={orders.filter(o => o.status === 'completed').length} icon={FiActivity} color="purple" delay={0.3} />
            </div>

            <div className="bg-[#121218] border border-white/5 rounded-3xl p-6 text-center py-12">
              <FiPackage className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <h3 className="text-white font-bold">Use as abas acima para gerenciar suas licenças e computadores.</h3>
            </div>
          </motion.div>
        )}

        {/* LICENSES TAB */}
        {activeTab === 'licenses' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            {/* Recovery Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-3">
                <FiAlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <p className="text-sm text-amber-200 font-medium">Pagou mas a licença não apareceu?</p>
              </div>
              <button
                onClick={() => fetchData(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-xl transition-all whitespace-nowrap"
              >
                <FiRefreshCw className="w-4 h-4" /> Atualizar Status
              </button>
            </div>

            {licenses.length > 0 ? (
              licenses.map((lic, i) => (
                <div key={lic.id} className="bg-[#0A0A0E]/80 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] relative overflow-hidden group hover:border-[#31A8FF]/30 transition-all duration-500 shadow-2xl">
                  <div className={`absolute -top-10 -right-10 w-40 h-40 ${lic.is_active ? 'bg-[#31A8FF]/10' : 'bg-red-500/10'} blur-[80px] rounded-full`}></div>
                  
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center ${lic.is_active ? 'bg-[#31A8FF]/10 border border-[#31A8FF]/20 text-[#31A8FF]' : 'bg-slate-500/10 text-slate-400'} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                        <FiCheckCircle className="w-10 h-10" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{lic.license_type}</h4>
                          <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${lic.is_active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                            {lic.is_active ? 'ATIVA' : 'SUSPENSA'}
                          </span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1">
                          <p className="text-slate-400 text-sm font-medium">Expira em: <span className="text-white">{new Date(lic.expires_at).toLocaleDateString('pt-BR')}</span></p>
                          <div className={`hidden sm:block w-1 h-1 rounded-full ${lic.is_active ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                          <p className="text-slate-400 text-sm font-medium">Dispositivos: <span className="text-[#31A8FF] font-bold">{lic.devices_in_use}/{lic.max_devices}</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:w-auto flex flex-col gap-3">
                      <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Chave de Ativação Única</span>
                      <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl group-hover:border-[#31A8FF]/50 transition-colors">
                        <code className="text-[#31A8FF] font-mono font-black text-sm sm:text-lg select-all letter-spacing-1">{lic.license_key}</code>
                        <div className="w-px h-6 bg-white/10 mx-2"></div>
                        <button
                          onClick={() => { navigator.clipboard.writeText(lic.license_key); toast.success('Chave copiada para a área de transferência!'); }}
                          className="p-2 hover:bg-[#31A8FF]/20 rounded-xl transition-all text-[#31A8FF] hover:text-white"
                          title="Copiar Chave"
                        >
                          <FiRefreshCw className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#0A0A0E] border border-white/5 rounded-[2.5rem] p-16 text-center shadow-2xl">
                <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10">
                   <FiPackage className="w-12 h-12 text-slate-700" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">Nenhuma Licença Ativa</h3>
                <p className="text-slate-400 mb-10 max-w-md mx-auto leading-relaxed">Libere o poder total do Voltris Optimizer adquirindo um de nossos planos profissionais.</p>
                <Link href="/adquirir-licenca" className="inline-flex items-center px-10 py-5 bg-[#31A8FF] hover:bg-[#1070FF] text-white font-black text-lg rounded-2xl transition-all shadow-[0_10px_30px_rgba(49,168,255,0.3)] hover:scale-[1.05]">
                  ADQUIRIR LICENÇA
                </Link>
              </div>
            )}
          </motion.div>
        )}

        {/* MY COMPUTER TAB */}
        {activeTab === 'pc' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 h-full">
            <MyComputerPage userId={user?.id || ''} />
          </motion.div>
        )}
      </div>
    </AuthGuard>
  );
}