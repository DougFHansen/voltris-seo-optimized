'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import {
  FiPackage, FiClock, FiCheckCircle, FiRefreshCw, FiPlus,
  FiActivity, FiAlertTriangle, FiSearch, FiCopy, FiExternalLink, FiCpu, FiShield,
  FiMonitor
} from 'react-icons/fi';

import type { Order } from '@/types/order';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/app/hooks/useAuth';
import AuthGuard from '@/components/AuthGuard';
import MyComputerPage from './MyComputerPage';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useDashboard } from '@/app/context/DashboardContext';


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
        ${transparencyMode ? 'voltris-glass' : 'bg-[#12121A] border-white/5 shadow-2xl'}
        hover:border-white/20 hover:-translate-y-2
      `}
    >
      <div className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${colors[color]} opacity-5 blur-[60px] group-hover:opacity-15 transition-all duration-700`}></div>
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <div className={`p-3 sm:p-4 rounded-2xl bg-gradient-to-br ${colors[color]} shadow-lg flex items-center justify-center text-white relative`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            <div className={`absolute inset-0 rounded-2xl blur-lg opacity-40 bg-gradient-to-br ${colors[color]}`}></div>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">Status</span>
             <div className="flex items-center gap-1.5">
               <div className={`w-1.5 h-1.5 rounded-full animate-pulse bg-gradient-to-r ${colors[color]}`}></div>
               <span className="text-[9px] sm:text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none">ATIVO</span>
             </div>
          </div>
        </div>

        <div>
           <p className="text-white/40 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tighter">{value}</h3>
          </div>
        </div>

        {/* Decorative Progress Line */}
        <div className="mt-6 sm:mt-8 relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
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
          <p className="text-white/40 font-black uppercase tracking-[0.3em] text-xs animate-pulse">Iniciando Terminal...</p>
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
  const [licenses, setLicenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  const fetchData = useCallback(async (showLoading = true) => {
    if (!user) return;
    try {
      if (showLoading) setIsLoading(true);

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
  }, [user?.id, user?.email, supabase]); // Depende apenas do ID e email, não do objeto user inteiro

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

  useEffect(() => {
    const success = searchParams.get('checkout_success');
    if (success !== 'true' || loading) return;

    toast.success('Pedido confirmado! Processando sua licença...', {
      duration: 6000,
      position: 'top-center',
      icon: '💎',
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
    totalOrders: orders.length,
    activeLicenses: licenses.filter(l => l.is_active).length,
    computers: licenses.reduce((acc, curr) => acc + (curr.devices_in_use || 0), 0)
  };

  return (
    <AuthGuard>
      {isLoading ? (
        <div className="h-full w-full flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 border-r-4 border-[#31A8FF] rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-20 h-20 border-t-4 border-[#8B31FF] rounded-full animate-spin-slow"></div>
            </div>
            <p className="text-white/30 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Sincronizando com Supabase Cloud...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8 w-full max-w-full h-full">

        {/* Dashboard Header - Premium UI */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 min-w-0">
          <div className="space-y-1 sm:space-y-2 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase italic truncate">Centro de <span className="text-[#31A8FF] not-italic">Controle</span></h1>
              <div className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#31A8FF]/10 border border-[#31A8FF]/20 text-[#31A8FF] text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(49,168,255,0.15)]">Pro v2.0</div>
            </div>
            <p className="text-white/40 font-bold text-[10px] sm:text-sm tracking-wide uppercase truncate">Operação tática disponível para <span className="text-[#8B31FF] truncate">{profile?.full_name?.toUpperCase() || 'USUÁRIO'}</span></p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setIsRefreshing(true); fetchData(false).finally(() => setIsRefreshing(false)); }}
              className={`p-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all ${isRefreshing ? 'opacity-50' : ''}`}
            >
              <FiRefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </motion.button>
            <Link href="/servicos">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(49,168,255,0.3)" }}
                whileTap={{ scale: 0.95 }}

                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-black uppercase italic tracking-[0.15em] rounded-2xl shadow-2xl text-xs"
              >
                <FiPlus className="w-4 h-4" />
                <span>Nova Aquisição</span>
              </motion.button>
            </Link>
          </div>
        </header>

        {/* Custom Modern Tabs - Enhanced Mobile Responsivity */}
        <div className="w-full relative group min-w-0 overflow-hidden">
          <div className="w-full overflow-x-auto scrollbar-hide scroll-smooth flex justify-start sm:justify-start">
            <div className={`p-1 sm:p-1.5 rounded-full sm:rounded-[2rem] w-max flex flex-nowrap gap-1 ${transparencyMode ? 'bg-white/5 backdrop-blur-3xl' : 'bg-[#12121A]'} border border-white/5`}>
              {[
                { id: 'overview', label: 'Visão Geral', icon: FiActivity },
                { id: 'licenses', label: 'Licenças', icon: FiCheckCircle },
                { id: 'pc', label: 'Meu Computador', icon: FiMonitor }
              ].map((tab) => (
                <Link key={tab.id} href={`/dashboard?tab=${tab.id}`} className="shrink-0">
                  <div className={`
                    flex items-center gap-1.5 sm:gap-2 px-4 sm:px-8 py-2 sm:py-3.5 rounded-full sm:rounded-2xl text-[9px] sm:text-[11px] font-black uppercase tracking-[0.1em] sm:tracking-[0.15em] transition-all whitespace-nowrap
                    ${activeTab === tab.id 
                      ? 'bg-white text-black shadow-xl' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'}
                  `}>
                    <tab.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeTab === tab.id ? 'text-black' : 'text-white/20'}`} />
                    {tab.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          {/* Fade effect to indicate more content */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#050510] to-transparent pointer-events-none sm:hidden"></div>
        </div>

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
                <StatCard title="Instâncias Vinculadas" value={stats.computers} icon={FiMonitor} color="green" delay={0.3} />
                   {/* Tactical Billboard */}
                <div className={`md:col-span-2 lg:col-span-3 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-white/5 relative overflow-hidden group ${transparencyMode ? 'voltris-glass' : 'bg-[#12121A]'}`}>
                   <div className="absolute inset-0 bg-gradient-to-r from-[#31A8FF]/10 via-transparent to-[#8B31FF]/10 opacity-30"></div>
                   <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10 text-center lg:text-left">
                     <div className="space-y-4">
                        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl w-fit mx-auto lg:mx-0">
                          <FiActivity className="w-8 h-8 text-[#31A8FF]" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white italic uppercase tracking-tighter">Sua infraestrutura está <span className="text-[#00FF88] not-italic">Segura</span></h2>
                        <p className="text-white/40 font-bold text-xs sm:text-sm max-w-xl">Todos os seus serviços estão sendo monitorados pela nossa rede neural. Use as abas de Licenças ou Computador para gerenciar individualmente seus produtos.</p>
                     </div>
                     <Link href="/voltrisoptimizer" className="w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 bg-white text-black font-black uppercase italic text-[10px] sm:text-xs rounded-2xl hover:scale-105 transition-all shadow-2xl">
                        Acessar Documentação Voltris
                     </Link>
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
                {/* Urgent Warning if needed */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-5 sm:p-6 rounded-[2rem] bg-amber-400/10 border border-amber-400/30 backdrop-blur-xl">
                   <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                      <FiAlertTriangle className="w-6 h-6 sm:w-7 sm:h-7" />
                   </div>
                   <div className="flex-1 text-center sm:text-left">
                      <h4 className="font-black text-white uppercase italic tracking-wider text-sm sm:text-base">Sincronização de Pagamento</h4>
                      <p className="text-amber-200/60 text-[9px] sm:text-xs font-bold uppercase tracking-widest mt-1">Se o seu pedido não apareceu imediatamente, clique no botão de sincronização.</p>
                   </div>
                   <button onClick={() => fetchData(true)} className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-amber-400 text-black font-black uppercase italic text-[10px] sm:text-xs rounded-xl shadow-xl hover:scale-105 transition-all">
                      Sync Agora
                   </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {licenses.length > 0 ? (
                    licenses.map((lic, i) => (
                      <motion.div 
                        key={lic.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`group relative p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border transition-all duration-500 overflow-hidden ${transparencyMode ? 'voltris-glass' : 'bg-[#12121A] border-white/5'} hover:border-[#31A8FF]/40`}
                      >
                        {/* Interactive Background Elements */}
                        <div className={`absolute -right-20 -bottom-20 w-80 h-80 ${lic.is_active ? 'bg-[#31A8FF]/10' : 'bg-red-500/10'} blur-[100px] rounded-full group-hover:scale-110 transition-transform duration-700`}></div>
                        
                        <div className="relative z-10 flex flex-col gap-8">
                          {/* Card Top */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white relative ${lic.is_active ? 'bg-gradient-to-br from-[#31A8FF] to-[#1070FF]' : 'bg-white/5 border border-white/10'}`}>
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
                               <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Validade</span>
                               <span className="text-sm font-black text-white italic">{new Date(lic.expires_at).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>

                          {/* Key Section - Dark Box */}
                          <div className="bg-black/40 rounded-[2rem] p-6 border border-white/5 group-hover:border-[#31A8FF]/20 transition-all">
                             <span className="text-[9px] font-black text-[#31A8FF] uppercase tracking-[0.3em] mb-4 block">Chave de Ativação</span>
                             <div className="flex items-center justify-between gap-4">
                                <code className="flex-1 font-mono text-base font-black text-white tracking-widest truncate select-all">{lic.license_key}</code>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => { navigator.clipboard.writeText(lic.license_key); toast.success('Key copiada!'); }}
                                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all border border-white/10"
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
                          <div className="flex items-center justify-between border-t border-white/5 pt-6">
                             <div className="flex items-center gap-8">
                                <div className="flex flex-col">
                                   <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Dispositivos</span>
                                   <span className="text-sm font-black text-white">{lic.devices_in_use}/{lic.max_devices}</span>
                                </div>
                                <div className="flex flex-col">
                                   <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Hardware ID</span>
                                   <span className="text-[10px] font-black text-[#31A8FF] uppercase tracking-widest">Vinculado</span>
                                </div>
                             </div>
                              <Link href="/voltrisoptimizer" className="text-[10px] font-black text-[#8B31FF] uppercase tracking-[0.2em] flex items-center gap-2 hover:translate-x-1 transition-transform">
                                 Baixar App <FiPlus className="w-3 h-3" />
                              </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className={`col-span-1 xl:col-span-2 p-20 rounded-[4rem] text-center border border-white/5 flex flex-col items-center gap-8 ${transparencyMode ? 'voltris-glass' : 'bg-[#0A0A0F]'}`}>
                       <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
                          <FiShield className="w-12 h-12" />
                       </div>
                       <div className="space-y-4">
                         <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Armazém de Licenças Vazio</h3>
                         <p className="text-white/30 font-bold max-w-lg mx-auto uppercase tracking-wide text-xs">Você ainda não possui licenças operacionais vinculadas a esta conta. Adquira uma agora para desbloquear o Optimizer.</p>
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
          </AnimatePresence>
        </div>
        </div>
      )}
    </AuthGuard>
  );
}
