'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import {
  FiPackage, FiClock, FiCheckCircle, FiRefreshCw, FiPlus,
  FiActivity, FiAlertTriangle, FiSearch, FiCopy, FiExternalLink, FiCpu, FiShield,
  FiMonitor, FiDownload, FiCreditCard, FiRotateCcw, FiX
} from 'react-icons/fi';

import type { Order } from '@/types/order';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/app/hooks/useAuth';
import AuthGuard from '@/components/AuthGuard';
import MyComputerPage from './MyComputerPage';
import SecurityPage from './SecurityPage';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useDashboard } from '@/app/context/DashboardContext';
import { notifyPageView } from '@/utils/notifications';


// Componente de Card de Estatística Ultra-Moderno
const StatCard = ({ title, value, icon: Icon, color, delay }: any) => {
  const { transparencyMode } = useDashboard();
  
  const colors: any = {
    blue: 'from-[#31A8FF] to-[#1070FF]',
    purple: 'from-[#8B31FF] to-[#6010FF]',
    green: 'from-[#00FF88] to-[#00CC6A]',
    pink: 'from-[#FF4B6B] to-[#FF2244]',
  };

  const glowColors: any = {
    blue: 'rgba(49,168,255,0.4)',
    purple: 'rgba(139,49,255,0.4)',
    green: 'rgba(0,255,136,0.4)',
    pink: 'rgba(255,75,107,0.4)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
      className={`relative group overflow-hidden p-5 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border transition-all duration-500
        ${transparencyMode ? 'voltris-glass' : 'bg-[#12121A] border-white/5 shadow-xl'}
        hover:border-white/10 hover:-translate-y-2
      `}
    >
      <div className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${colors[color]} opacity-5 blur-[60px] group-hover:opacity-15 transition-all duration-700`}></div>
      
      <div className="relative z-10 flex flex-col h-full justify-center gap-4 sm:gap-6">
        <div className="flex justify-between items-start">
          <div className={`p-3 sm:p-4 rounded-2xl bg-gradient-to-br ${colors[color]} shadow-lg flex items-center justify-center text-white relative`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            <div className={`absolute inset-0 rounded-2xl blur-lg opacity-40 bg-gradient-to-br ${colors[color]}`}></div>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Status</span>
             <div className="flex items-center gap-1.5">
               <div className={`w-1.5 h-1.5 rounded-full animate-pulse bg-gradient-to-r ${colors[color]}`}></div>
               <span className="text-[9px] sm:text-[10px] font-bold text-gray-700 uppercase tracking-widest leading-none">SINCRONIZADO</span>
             </div>
          </div>
        </div>

        <div className="space-y-1">
           <p className="text-gray-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tighter">{value}</h3>
          </div>
        </div>

        {/* Decorative Progress Line */}
        <div className="relative h-1 w-full bg-gray-200 rounded-full overflow-hidden mt-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, delay: delay + 0.3 }}
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colors[color]}`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default function DashboardClient() {
  return (
    <Suspense fallback={
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 border-t-4 border-l-4 border-b-4 border-transparent border-r-4 border-r-[#31A8FF] rounded-full animate-spin"></div>
          <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-xs animate-pulse">Iniciando Terminal...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const { user, profile, loading } = useAuth();
  const { transparencyMode } = useDashboard();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || (searchParams.get('checkout_success') === 'true' ? 'licenses' : 'overview');

  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [installationsCount, setInstallationsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  const fetchData = useCallback(async (showLoading = true) => {
    if (!user) return;
    try {
      if (showLoading) setIsLoading(true);

      const [ordersRes, licensesRes, installationsRes, paymentsRes] = await Promise.all([
        supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('licenses').select('*').eq('email', user.email).order('created_at', { ascending: false }),
        supabase.from('installations').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('payments').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      ]);

      if (ordersRes.error) throw ordersRes.error;
      setOrders(ordersRes.data || []);
      setPayments(paymentsRes.data || []);
      
      if (!licensesRes.error) {
        setLicenses(licensesRes.data || []);
      }

      setInstallationsCount(installationsRes.count || 0);

    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao atualizar dashboard');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [user?.id, user?.email, supabase]); // Depende apenas do ID e email, não do objeto user inteiro

  const handleManageBilling = async () => {
    const toastId = toast.loading('Conectando ao Stripe...');
    try {
      const response = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Erro ao abrir portal');
      }
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleRequestRefund = async () => {
    if (!window.confirm("Aviso: O reembolso cancelará sua assinatura imediatamente e desativará seu acesso. O valor será estornado se a compra foi feita nos últimos 7 dias. Deseja prosseguir?")) {
      return;
    }

    const toastId = toast.loading('Processando reembolso com a Stripe...');
    try {
      const response = await fetch('/api/stripe/refund', { method: 'POST' });
      const data = await response.json();
      
      if (response.ok) {
        toast.success(data.message || 'Reembolso efetuado com sucesso!', { id: toastId });
        fetchData(false);
      } else {
        throw new Error(data.error || 'Erro ao processar reembolso');
      }
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    const toastId = toast.loading('Processando cancelamento...');
    try {
      const response = await fetch('/api/stripe/cancel', { method: 'POST' });
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Assinatura cancelada! Você ainda terá acesso até o fim do período.', { id: toastId });
        setIsCancelModalOpen(false);
        fetchData(false);
      } else {
        throw new Error(data.error || 'Erro ao cancelar');
      }
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsCancelling(false);
    }
  };

  // Carregar dados apenas na montagem e quando o ID do usuário mudar de fato
  const userIdRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    // Se o auth terminou de carregar e não temos usuário, paramos o loading local
    // para permitir que o AuthGuard execute o redirecionamento.
    if (!loading && !user) {
      setIsLoading(false);
      return;
    }

    if (!user?.id) return;
    
    // Só buscar se o ID mudou (evita refetch em token refresh que recria o objeto user)
    if (userIdRef.current === user.id) return;
    userIdRef.current = user.id;
    fetchData();
  }, [user?.id, loading, fetchData]);

  // Notificar visualização da aba de licenças no Dashboard
  useEffect(() => {
    if (activeTab === 'licenses') {
      notifyPageView("Aba de Licenças (Dashboard Interno)");
    }
  }, [activeTab]);

  useEffect(() => {
    const success = searchParams.get('checkout_success');
    if (success !== 'true' || loading) return;

    const type = searchParams.get('type');
    const successMsg = type === 'service' ? 'Serviço adquirido com sucesso!' : 'Pedido confirmado! Processando sua licença...';
    const successIcon = type === 'service' ? '🛠️' : '💎';

    toast.success(successMsg, {
      duration: 6000,
      position: 'top-center',
      icon: successIcon,
      style: { 
        background: 'rgba(10, 10, 15, 0.9)', 
        color: '#fff',
        border: '1px solid rgba(49, 168, 255, 0.3)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1rem',
        fontWeight: 'bold'
      },
    });

    fetchData(false);
    const timer = setTimeout(() => fetchData(false), 5000);
    return () => clearTimeout(timer);
  }, [searchParams, loading, fetchData]);

  const stats = {
    totalOrders: orders.length + payments.length,
    activeLicenses: licenses.filter(l => l.is_active).length,
    computers: installationsCount
  };

  const hardwareIDProtection = stats.activeLicenses > 0;

  return (
    <AuthGuard>
      {isLoading ? (
        <div className="h-full w-full flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 border-r-4 border-[#31A8FF] rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-20 h-20 border-t-4 border-[#8B31FF] rounded-full animate-spin-slow"></div>
            </div>
            <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Sincronizando com Supabase Cloud...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8 w-full max-w-full min-h-screen">
        {/* Dashboard Header - Premium UI */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 text-center lg:text-left">
          <div className="space-y-1.5 flex-1 min-w-0 flex flex-col items-center lg:items-start w-full">
            <div className="flex flex-col lg:flex-row items-center gap-2 sm:gap-3">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tighter uppercase italic leading-none break-words">Centro de <span className="text-[#31A8FF] not-italic">Painel</span></h2>
              
              {/* Hardware ID Protection Status Badge */}
               <div className={`flex items-center gap-2 px-3 py-1 rounded-full border backdrop-blur-md transition-all duration-500
                 ${hardwareIDProtection 
                   ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                   : 'bg-red-500/10 border-red-500/20 text-red-400'}
               `}>
                 <div className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-lg
                   ${hardwareIDProtection ? 'bg-emerald-400 shadow-emerald-500/50' : 'bg-red-400 shadow-red-500/50'}
                 `}></div>
                 <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                   PROT HID: {hardwareIDProtection ? 'ATIVA' : 'OFFLINE'}
                 </span>
               </div>
            </div>
            <p className="text-gray-500 font-bold text-[8px] xs:text-[10px] sm:text-xs tracking-wide uppercase px-2 lg:px-0 opacity-80 line-clamp-1">Operação tática disponível para <span className="text-[#8B31FF]">{profile?.full_name?.toUpperCase() || 'USUÁRIO'}</span></p>
          </div>

          <div className="flex items-center justify-center lg:justify-end gap-3 px-4 lg:px-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { 
                setIsRefreshing(true); 
                fetchData(false)
                  .then(() => toast.success('Dados atualizados!'))
                  .finally(() => setIsRefreshing(false)); 
              }}
              className={`p-4 rounded-2xl bg-[#12121A] border border-white/5 text-gray-400 hover:text-white hover:bg-white/5 transition-all ${isRefreshing ? 'opacity-50' : ''}`}
            >
              <FiRefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </motion.button>
            <Link href="/servicos" className="flex-1 lg:flex-none">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(49, 168, 255, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-black uppercase italic tracking-[0.15em] rounded-2xl shadow-2xl text-xs"
              >
                <FiPlus className="w-4 h-4" />
                <span>Novo Pedido</span>
              </motion.button>
            </Link>
          </div>
        </header>

        {/* Tabs Horizontais Removidas - Navegação unificada na Sidebar lateral inspirada no Restaurante */}

        {/* Tab Content Rendering */}
        <div className="flex-1 min-h-0 relative">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              >
                <StatCard title="Serviços Adquiridos" value={stats.totalOrders} icon={FiPackage} color="blue" delay={0.1} />
                <StatCard title="Licenças Disponíveis" value={stats.activeLicenses} icon={FiCheckCircle} color="purple" delay={0.2} />
                <StatCard title="Computadores Vinculados" value={stats.computers} icon={FiMonitor} color="green" delay={0.3} />
                   {/* Tactical Billboard */}
                <div className={`md:col-span-2 lg:col-span-3 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-white/5 relative overflow-hidden group ${transparencyMode ? 'voltris-glass' : 'bg-[#12121A] shadow-xl'}`}>
                   <div className="absolute inset-0 bg-gradient-to-r from-[#31A8FF]/10 via-transparent to-[#8B31FF]/10 opacity-30"></div>
                   <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10 text-center lg:text-left">
                     <div className="space-y-4">
                        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl w-fit mx-auto lg:mx-0">
                          <FiDownload className="w-8 h-8 text-[#31A8FF]" />
                        </div>
                        <h2 className="text-xl sm:text-2xl lg:text-4xl font-black text-white italic uppercase tracking-tighter">Performance Máxima <span className="text-[#31A8FF] not-italic">Liberada</span></h2>
                        <p className="text-gray-500 font-bold text-[10px] sm:text-sm max-w-xl uppercase tracking-widest leading-relaxed">Baixe o Voltris Optimizer agora para aplicar os ajustes de hardware e eliminar o input lag em segundos.</p>
                     </div>
                     <Link href="/voltrisoptimizer" className="w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 bg-white text-black font-black uppercase italic text-[10px] sm:text-xs rounded-2xl hover:scale-105 transition-all shadow-2xl tracking-widest text-center">
                        Baixar Voltris Optimizer
                     </Link>
                   </div>
                </div>

                {/* Billing & Subscription Hub */}
                <div className={`md:col-span-2 lg:col-span-3 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-white/5 relative overflow-hidden group ${transparencyMode ? 'voltris-glass' : 'bg-[#12121A] shadow-xl'}`}>
                   <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-blue-500/5 opacity-30"></div>
                   <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10 text-center lg:text-left">
                     <div className="space-y-4">
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl w-fit mx-auto lg:mx-0">
                          <FiCreditCard className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h2 className="text-xl sm:text-2xl lg:text-4xl font-black text-white italic uppercase tracking-tighter">Centro de <span className="text-emerald-500 not-italic">Faturamento</span></h2>
                        <p className="text-gray-500 font-bold text-[10px] sm:text-sm max-w-xl uppercase tracking-widest leading-relaxed">Gerencie suas assinaturas, cancele renovações automáticas ou solicite reembolsos dentro do prazo de garantia.</p>
                     </div>
                     <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button 
                            onClick={() => setIsCancelModalOpen(true)}
                            className="px-8 py-4 bg-gray-900 text-white font-black uppercase italic text-[10px] sm:text-xs rounded-2xl hover:scale-105 transition-all shadow-2xl tracking-widest"
                        >
                            Cancelar Renovação
                        </button>
                        <button 
                            onClick={handleRequestRefund}
                            className="px-8 py-4 bg-[#12121A] border border-white/10 text-white font-black uppercase italic text-[10px] sm:text-xs rounded-2xl hover:bg-white/5 transition-all tracking-widest"
                        >
                            Solicitar Reembolso
                        </button>
                     </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'licenses' && (
              <motion.div 
                key="licenses"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="space-y-6"
              >
                {/* Urgent Warning with Integrated Billing Actions */}
                <div className="flex flex-col gap-4 p-6 sm:p-8 rounded-[2rem] bg-amber-50 border border-amber-200 shadow-lg">
                   <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                         <FiAlertTriangle className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                         <h4 className="font-black text-white uppercase italic tracking-wider text-sm sm:text-base">Gestão de Licença & Pagamento</h4>
                         <p className="text-amber-700 text-[9px] sm:text-xs font-bold uppercase tracking-widest mt-1">Sua segurança é nossa prioridade. Gerencie sua assinatura ou peça reembolso abaixo.</p>
                      </div>
                      <button onClick={() => fetchData(true)} className="w-full sm:w-auto px-6 py-3 bg-amber-400 text-black font-black uppercase italic text-[10px] rounded-xl shadow-md hover:scale-105 transition-all">
                         Sync Agora
                      </button>
                   </div>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-amber-200">
                      <button 
                         onClick={() => setIsCancelModalOpen(true)}
                         className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white font-black uppercase italic text-[10px] rounded-xl hover:bg-black transition-all shadow-xl"
                      >
                         <FiX className="w-4 h-4" /> Cancelar Renovação Automática
                      </button>
                      <button 
                         onClick={handleRequestRefund}
                         className="flex items-center justify-center gap-2 px-6 py-4 bg-amber-500/10 border border-amber-500/20 text-amber-500 font-black uppercase italic text-[10px] rounded-xl hover:bg-amber-500/20 transition-all shadow-sm"
                      >
                         <FiRotateCcw className="w-4 h-4" /> Solicitar Reembolso (7 Dias)
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {licenses.length > 0 ? (
                    licenses.map((lic, i) => (
                      <motion.div 
                        key={lic.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`group relative p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border transition-all duration-500 overflow-hidden ${transparencyMode ? 'voltris-glass' : 'bg-[#12121A] border-white/5 shadow-xl'} hover:border-[#31A8FF]/40`}
                      >
                        {/* Interactive Background Elements */}
                        <div className={`absolute -right-20 -bottom-20 w-80 h-80 ${lic.is_active ? 'bg-[#31A8FF]/10' : 'bg-red-500/10'} blur-[100px] rounded-full group-hover:scale-110 transition-transform duration-700`}></div>
                        
                        <div className="relative z-10 flex flex-col gap-8">
                          {/* Card Top */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center relative transition-all duration-500 ${lic.is_active ? 'bg-gradient-to-br from-[#31A8FF] to-[#1070FF] text-white' : 'bg-white/5 border border-white/10 text-gray-400'}`}>
                                <FiCheckCircle className="w-8 h-8" />
                                <div className={`absolute inset-0 blur-lg opacity-40 ${lic.is_active ? 'bg-[#31A8FF]' : 'bg-transparent'}`}></div>
                              </div>
                              <div className="flex flex-col">
                                <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">{lic.license_type}</h4>
                                <span className={`text-[9px] font-black tracking-[0.2em] px-3 py-1 rounded-full uppercase w-fit mt-1 border ${lic.is_active ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 'bg-red-400/10 text-red-400 border-red-400/20'}`}>
                                   {lic.is_active ? 'Ativa' : 'Expirada'}
                                </span>
                              </div>
                            </div>
                            <div className="hidden sm:flex flex-col items-end">
                               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Validade</span>
                               <span className="text-sm font-black text-white italic">{new Date(lic.expires_at).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>

                          {/* Key Section - Dark Box */}
                          <div className="bg-[#0a0a0f] rounded-[2rem] p-6 border border-white/5 group-hover:border-[#31A8FF]/20 transition-all">
                             <span className="text-[9px] font-black text-[#31A8FF] uppercase tracking-[0.3em] mb-4 block">Chave de Ativação</span>
                             <div className="flex items-center justify-between gap-4">
                                <code className="flex-1 font-mono text-base font-black text-white tracking-widest truncate select-all">{lic.license_key}</code>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => { navigator.clipboard.writeText(lic.license_key); toast.success('Key copiada!'); }}
                                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/10"
                                    title="Copiar Chave"
                                  >
                                    <FiCopy className="w-4 h-4" />
                                  </button>
                                  <Link href={`/dashboard?tab=pc`} className="p-3 rounded-xl bg-[#31A8FF]/10 hover:bg-[#31A8FF] text-[#31A8FF] hover:text-white transition-all border border-[#31A8FF]/20">
                                     <FiExternalLink className="w-4 h-4" />
                                  </Link>
                                </div>
                             </div>
                          </div>

                          {/* Footer Info */}
                          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                             <div className="flex items-center gap-8">
                                <div className="flex flex-col">
                                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Dispositivos</span>
                                   <span className="text-sm font-black text-white">{lic.devices_in_use}/{lic.max_devices}</span>
                                </div>
                                <div className="flex flex-col">
                                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Hardware ID</span>
                                   <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Vinculado</span>
                                </div>
                             </div>
                              <div className="flex items-center gap-4">
                                <Link href="/voltrisoptimizer" className="text-[10px] font-black text-[#8B31FF] uppercase tracking-[0.2em] flex items-center gap-2 hover:translate-x-1 transition-transform">
                                   Baixar App <FiPlus className="w-3 h-3" />
                                </Link>
                              </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className={`col-span-1 xl:col-span-2 p-20 rounded-[4rem] text-center border border-white/5 flex flex-col items-center gap-8 ${transparencyMode ? 'voltris-glass' : 'bg-[#0a0a0f] shadow-xl'}`}>
                       <div className="w-24 h-24 rounded-[2rem] bg-[#12121A] border border-white/10 flex items-center justify-center text-gray-400">
                          <FiShield className="w-12 h-12" />
                       </div>
                       <div className="space-y-4">
                         <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Armazém de Licenças Vazio</h3>
                         <p className="text-gray-500 font-bold max-w-lg mx-auto uppercase tracking-wide text-xs">Você ainda não possui licenças operacionais vinculadas a esta conta. Adquira uma agora para desbloquear o Optimizer.</p>
                       </div>
                       <Link href="/adquirir-licenca">
                          <button className="px-12 py-5 bg-white text-black font-black uppercase italic tracking-widest rounded-2xl hover:scale-105 transition-all shadow-3xl">
                             Explorar Planos PRO
                          </button>
                       </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div 
                key="orders"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="space-y-6"
              >
                <div className={`p-8 rounded-[2rem] sm:rounded-[3rem] border ${transparencyMode ? 'voltris-glass' : 'bg-[#12121A] border-white/5 shadow-xl'}`}>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-gradient-to-br from-[#31A8FF] to-[#1070FF] rounded-2xl text-white shadow-lg shadow-blue-500/20">
                        <FiPackage className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Histórico de Pedidos</h2>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Acompanhe todos os seus serviços e licenças</p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="pb-4 px-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Serviço / Licença</th>
                          <th className="pb-4 px-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hidden sm:table-cell">Data</th>
                          <th className="pb-4 px-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Valor</th>
                          <th className="pb-4 px-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {/* Mesclagem de Pedidos e Pagamentos */}
                        {[
                          ...orders.map(o => ({ ...o, display_type: 'SERVICE_LEGACY', display_name: o.service_name, display_plan: o.plan_type, amount: o.total || o.final_price })),
                          ...payments.map(p => {
                            const isService = ['formatacao', 'otimizacao', 'correcao', 'impressora', 'virus', 'recuperacao'].some(key => p.plan_type?.includes(key));
                            return { 
                              ...p, 
                              display_type: isService ? 'SERVICE' : 'LICENSE', 
                              display_name: isService ? (p.plan_type?.replace(/_/g, ' ').toUpperCase() || 'SERVIÇO') : `LICENÇA: ${p.plan_type?.toUpperCase()}`, 
                              display_plan: isService ? 'SERVIÇO PROFISSIONAL' : 'SUPORTE PRIORITÁRIO', 
                              amount: p.amount 
                            };
                          })
                        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).length > 0 ? (
                          [
                            ...orders.map(o => ({ ...o, display_type: 'SERVICE_LEGACY', display_name: o.service_name, display_plan: o.plan_type, amount: o.total || o.final_price })),
                            ...payments.map(p => {
                              const isService = ['formatacao', 'otimizacao', 'correcao', 'impressora', 'virus', 'recuperacao'].some(key => p.plan_type?.includes(key));
                              return { 
                                ...p, 
                                display_type: isService ? 'SERVICE' : 'LICENSE', 
                                display_name: isService ? (p.plan_type?.replace(/_/g, ' ').toUpperCase() || 'SERVIÇO') : `LICENÇA: ${p.plan_type?.toUpperCase()}`, 
                                display_plan: isService ? 'SERVIÇO PROFISSIONAL' : 'SUPORTE PRIORITÁRIO', 
                                amount: p.amount 
                              };
                            })
                          ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((item, idx) => (
                            <tr key={item.id + idx} className="group hover:bg-white/5 active:bg-white/10 transition-colors">
                              <td className="py-6 px-2">
                                <div className="flex flex-col">
                                  <span className="text-sm font-black text-white uppercase italic tracking-tight">{item.display_name}</span>
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    {item.display_type === 'LICENSE' ? (
                                      <span className="text-[#31A8FF]">💎 PRODUTO DIGITAL</span>
                                    ) : item.display_type === 'SERVICE' ? (
                                      <span className="text-[#8B31FF]">🛠️ SERVIÇO TÉCNICO</span>
                                    ) : (
                                      item.display_plan || 'PERSONALIZADO'
                                    )}
                                  </span>
                                </div>
                              </td>
                              <td className="py-6 px-2 hidden sm:table-cell">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                  {new Date(item.created_at).toLocaleDateString('pt-BR')}
                                </span>
                              </td>
                              <td className="py-6 px-2">
                                <span className="text-xs font-black text-emerald-400">
                                  R$ {(item.amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                              </td>
                              <td className="py-6 px-2">
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border w-fit
                                  ${(['completed', 'approved', 'paid', 'active'].includes(item.status?.toLowerCase())) ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                    (['cancelled', 'rejected', 'declined', 'canceled', 'refunded'].includes(item.status?.toLowerCase())) ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                    'bg-amber-500/10 border-amber-500/20 text-amber-400'}
                                `}>
                                  <div className={`w-1 h-1 rounded-full ${(['completed', 'approved', 'paid', 'active'].includes(item.status?.toLowerCase())) ? 'bg-emerald-600' : (['cancelled', 'rejected', 'declined', 'canceled', 'refunded'].includes(item.status?.toLowerCase())) ? 'bg-red-600' : 'bg-amber-600 animate-pulse'}`}></div>
                                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                                    {(['completed', 'approved', 'paid', 'active', 'succeeded', 'ativo'].includes(String(item.status).trim().toLowerCase())) ? 'APROVADO' : 
                                     (['cancelled', 'rejected', 'declined', 'canceled', 'refunded', 'cancelado'].includes(String(item.status).trim().toLowerCase())) ? 'CANCELADO' : 
                                     'PENDENTE'}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-20 text-center">
                              <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Nenhum pedido ou pagamento encontrado.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'pc' && (
              <motion.div 
                key="pc"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="h-full"
              >
                <MyComputerPage userId={user?.id || ''} />
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div 
                key="security"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="h-full"
              >
                <SecurityPage />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </div>
      )}

      {/* --- MODAL DE CANCELAMENTO PROFISSIONAL --- */}
      <AnimatePresence>
        {isCancelModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCancelModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-[#12121A] rounded-[2.5rem] p-10 shadow-2xl border border-white/10 overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-500/5 blur-[80px] rounded-full"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center text-red-500 mb-8 border border-red-100">
                  <FiAlertTriangle className="w-10 h-10" />
                </div>
                
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">
                  Cancelar Assinatura?
                </h2>
                
                <p className="text-gray-400 font-medium text-sm leading-relaxed mb-10">
                  Ao confirmar, sua renovação automática será interrompida. Você continuará com acesso PRO até o fim do seu ciclo atual de faturamento.
                </p>
                
                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={handleConfirmCancel}
                    disabled={isCancelling}
                    className="w-full py-5 bg-white/5 border border-white/10 text-white font-black uppercase italic tracking-widest rounded-2xl hover:bg-white/10 transition-all shadow-xl disabled:opacity-50"
                  >
                    {isCancelling ? 'Processando...' : 'Confirmar Cancelamento'}
                  </button>
                  <button
                    onClick={() => setIsCancelModalOpen(false)}
                    className="w-full py-4 text-gray-500 font-bold uppercase text-[10px] tracking-widest hover:text-white transition-colors"
                  >
                    Manter minha assinatura
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AuthGuard>
  );
}

