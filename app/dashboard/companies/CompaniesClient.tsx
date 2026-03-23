'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  FiMonitor, FiAlertTriangle, FiCpu, FiTrendingUp, 
  FiZap, FiShield, FiActivity, FiArrowRight, FiPlus,
  FiTerminal, FiBarChart2, FiPieChart, FiGrid
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useDashboard } from '@/app/context/DashboardContext';

export default function CompaniesClient() {
    const { transparencyMode } = useDashboard();
    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState<any>(null);
    const [stats, setStats] = useState({ devices: 0, alerts: 0, avgHealth: 100 });
    const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const [buyQuantity, setBuyQuantity] = useState(5);
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        async function loadData() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: link } = await supabase
                    .from('company_users')
                    .select('*, companies(*)')
                    .eq('user_id', user.id)
                    .single();

                if (link && link.companies) {
                    setCompany(link.companies);

                    const { count: devCount } = await supabase
                        .from('devices')
                        .select('*', { count: 'exact', head: true })
                        .eq('company_id', link.companies.id);

                    const { count: alertCount } = await supabase
                        .from('device_alerts')
                        .select('*', { count: 'exact', head: true })
                        .eq('company_id', link.companies.id)
                        .eq('is_resolved', false);

                    setStats({
                        devices: devCount || 0,
                        alerts: alertCount || 0,
                        avgHealth: 98, 
                    });

                    const { data: alerts } = await supabase
                        .from('device_alerts')
                        .select('*, devices(hostname)')
                        .eq('company_id', link.companies.id)
                        .eq('is_resolved', false)
                        .order('created_at', { ascending: false })
                        .limit(5);

                    setRecentAlerts(alerts || []);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [supabase]);

    const handleCreateCompany = async () => {
        const name = window.prompt("Qual o nome da sua empresa/organização?");
        if (!name) return;

        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error("Você precisa estar logado.");
                return;
            }

            const { error } = await supabase.rpc('create_new_organization', {
                org_name: name
            });

            if (error) throw error;

            toast.success("Organização criada com sucesso!", {
                icon: '🏢',
                style: { background: 'rgba(10, 10, 15, 0.9)', color: '#fff', border: '1px solid rgba(49, 168, 255, 0.2)' }
            });
            window.location.reload();

        } catch (err: any) {
            toast.error("Erro ao criar organização: " + err.message);
            setLoading(false);
        }
    };

    const handleBuyLicenses = async () => {
        if (!company) return;
        try {
            const toastId = toast.loading("Processando Link de Pagamento...");
            await new Promise(r => setTimeout(r, 1500));

            const newMax = (company.max_devices || 0) + buyQuantity;

            const { error } = await supabase
                .from('companies')
                .update({ max_devices: newMax, plan_type: 'pro' })
                .eq('id', company.id);

            if (error) throw error;

            toast.dismiss(toastId);
            toast.success(`${buyQuantity} Slots Neurais Adicionados!`, {
                icon: '🔋',
                style: { background: 'rgba(10, 10, 15, 0.9)', color: '#fff', border: '1px solid rgba(49, 168, 255, 0.2)' }
            });
            setIsBuyModalOpen(false);
            window.location.reload();

        } catch (err: any) {
            toast.error("Falha no Link: " + err.message);
        }
    };

    const handleOptimizeAll = async () => {
        if (!company) return;
        if (!confirm("Isso enviará uma sequência de OTIMIZAÇÃO para TODOS os nós ativos. Continuar?")) return;

        try {
            const toastId = toast.loading("Transmitindo Comando Tático...");
            const { data: devices } = await supabase
                .from('devices')
                .select('id')
                .eq('company_id', company.id);

            if (!devices?.length) {
                toast.error("Nenhum nó ativo encontrado neste link.");
                return;
            }

            const { data: { user } } = await supabase.auth.getUser();
            const commands = devices.map(d => ({
                device_id: d.id,
                company_id: company.id,
                command_type: 'OPTIMIZE_RAM',
                status: 'pending',
                create_user_id: user?.id
            }));

            const { error } = await supabase.from('remote_commands').insert(commands);
            if (error) throw error;

            toast.dismiss(toastId);
            toast.success(`Transmissão em Massa Enviada: ${devices.length} Nós Sincronizados.`, {
                icon: '📡',
                style: { background: 'rgba(10, 10, 15, 0.9)', color: '#fff', border: '1px solid rgba(49, 168, 255, 0.2)' }
            });

        } catch (err: any) {
            toast.error("Falha na Transmissão: " + err.message);
        }
    };

    if (loading) {
        return (
          <div className="flex flex-col items-center justify-center py-40 gap-6 opacity-30">
            <div className="w-16 h-16 border-t-4 border-r-4 border-[#31A8FF] rounded-full animate-spin"></div>
            <p className="font-black uppercase tracking-[0.3em] text-[10px]">Sincronizando Telemetria da Frota...</p>
          </div>
        );
    }

    if (!company) {
        return (
            <div className="flex flex-col items-center justify-center py-40 text-center gap-10">
                <div className={`p-10 rounded-[3rem] border border-white/5 flex flex-col items-center gap-8 ${transparencyMode ? 'voltris-glass' : 'bg-[#0A0A10]'}`}>
                    <div className="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center text-white/10 shrink-0">
                        <FiMonitor className="w-12 h-12" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Frota <span className="text-[#31A8FF]">Desconectada</span></h2>
                        <p className="text-white/20 font-bold text-xs uppercase tracking-[0.2em] max-w-md mx-auto">
                            Sua conta não está associada a nenhuma organização verificada. Estabeleça um link para iniciar o gerenciamento remoto.
                        </p>
                    </div>
                    <button
                        onClick={handleCreateCompany}
                        className="px-10 py-5 bg-[#31A8FF] text-black font-black uppercase italic tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-3xl text-sm"
                    >
                        Estabelecer Nova Organização
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10 relative w-full max-w-full overflow-hidden">
            
            {/* Fleet Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                <div className="space-y-2">
                   <div className="flex items-center gap-3">
                     <div className="w-2 h-8 bg-gradient-to-b from-[#31A8FF] to-[#8B31FF] rounded-full"></div>
                     <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">{company.name}</h2>
                   </div>
                   <div className="flex flex-wrap items-center gap-4 pl-5">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#31A8FF]/10 border border-[#31A8FF]/20">
                         <span className="text-[9px] font-black text-[#31A8FF] uppercase tracking-[0.2em]">PROTOCOLO {company.plan_type.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Capacidade da Frota:</span>
                         <span className="text-[10px] font-black text-[#00FF88] uppercase tracking-[0.2em]">{stats.devices} / {company.max_devices} SLOTS ATIVOS</span>
                      </div>
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <Link href="/dashboard/companies/devices" className="px-8 py-4 bg-white/5 border border-white/5 text-white font-black uppercase italic tracking-widest rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-xs shadow-2xl">
                        <FiMonitor className="w-4 h-4" /> Gerenciar Nós da Frota
                    </Link>
                    <button
                        onClick={() => setIsBuyModalOpen(true)}
                        className="px-8 py-4 bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] text-white font-black uppercase italic tracking-widest rounded-2xl hover:scale-105 transition-all shadow-3xl text-xs flex items-center justify-center gap-3"
                    >
                        <FiPlus className="w-4 h-4" /> Expandir Capacidade
                    </button>
                </div>
            </div>

            {/* Neural Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    title="Nós Ativos"
                    value={stats.devices.toString()}
                    icon={FiMonitor}
                    color="#31A8FF"
                    subtext={`${company.max_devices - stats.devices} Slots Disponíveis`}
                    transparencyMode={transparencyMode}
                />
                <StatCard
                    title="Alertas do Sistema"
                    value={stats.alerts.toString()}
                    icon={FiAlertTriangle}
                    color="#FF4B6B"
                    subtext="Atenção Crítica Necessária"
                    alert={stats.alerts > 0}
                    transparencyMode={transparencyMode}
                />
                <StatCard
                    title="Coesão da Frota"
                    value={`${stats.avgHealth}%`}
                    icon={FiTrendingUp}
                    color="#00FF88"
                    subtext="Estabilidade Global"
                    transparencyMode={transparencyMode}
                />
                <StatCard
                    title="Carga Média"
                    value="12%"
                    icon={FiCpu}
                    color="#8B31FF"
                    subtext="Frequência Estável"
                    transparencyMode={transparencyMode}
                />
            </div>

            {/* Tactical Grid Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Visual Alert Stream */}
                <div className={`lg:col-span-2 p-10 rounded-[3.5rem] border transition-all duration-500 overflow-hidden relative ${transparencyMode ? 'voltris-glass' : 'bg-[#12121A] border-white/5 shadow-2xl'}`}>
                    <div className="flex items-center justify-between mb-10">
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-[#FF4B6B]/10 text-[#FF4B6B] rounded-2xl border border-[#FF4B6B]/20 shadow-lg">
                             <FiAlertTriangle className="w-6 h-6" />
                          </div>
                          <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Disrupções <span className="text-[#FF4B6B]">Neurais</span></h3>
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest font-mono">Fluxo em Tempo Real</span>
                          <div className="w-2 h-2 rounded-full bg-[#FF4B6B] animate-pulse"></div>
                       </div>
                    </div>

                    {recentAlerts.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center text-center gap-6 opacity-30">
                            <FiTrendingUp className="w-16 h-16" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">Nenhuma Disrupção Detectada na Nuvem</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {recentAlerts.map(alert => (
                                <AlertItem
                                    key={alert.id}
                                    device={alert.devices?.hostname || "NÓ DESCONHECIDO"}
                                    msg={alert.message}
                                    time={new Date(alert.created_at).toLocaleTimeString()}
                                    level={alert.level.toLowerCase()}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Tactical Action Grid */}
                <div className={`p-10 rounded-[3.5rem] border transition-all duration-500 overflow-hidden relative ${transparencyMode ? 'voltris-glass' : 'bg-[#12121A] border-white/5 shadow-2xl'}`}>
                    <div className="flex items-center gap-4 mb-10">
                       <div className="p-3 bg-[#8B31FF]/10 text-[#8B31FF] rounded-2xl border border-[#8B31FF]/20 shadow-lg">
                          <FiZap className="w-6 h-6" />
                       </div>
                       <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Diretrizes <span className="text-[#8B31FF]">Remotas</span></h3>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleOptimizeAll}
                            className="w-full text-left p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-[#31A8FF]/40 transition-all flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-[#31A8FF]/10 border border-[#31A8FF]/20 flex items-center justify-center text-[#31A8FF] group-hover:scale-110 transition-transform">
                                  <FiZap className="w-6 h-6" />
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-[11px] font-black text-white uppercase tracking-wider italic">Otimização em Massa</span>
                                  <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest font-mono">Pulso para todos os nós</span>
                               </div>
                            </div>
                            <FiArrowRight className="w-5 h-5 text-white/10 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                        </button>

                        <button className="w-full text-left p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-[#00FF88]/40 transition-all flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-[#00FF88]/10 border border-[#00FF88]/20 flex items-center justify-center text-[#00FF88] group-hover:scale-110 transition-transform">
                                  <FiBarChart2 className="w-6 h-6" />
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-[11px] font-black text-white uppercase tracking-wider italic">Relatório de Inteligência</span>
                                  <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest font-mono">Dados mensais da frota</span>
                               </div>
                            </div>
                            <FiArrowRight className="w-5 h-5 text-white/10 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                        </button>

                        <Link href="/dashboard/companies/devices" className="w-full text-left p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-[#FF4B6B]/40 transition-all flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-[#FF4B6B]/10 border border-[#FF4B6B]/20 flex items-center justify-center text-[#FF4B6B] group-hover:scale-110 transition-transform">
                                  <FiShield className="w-6 h-6" />
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-[11px] font-black text-white uppercase tracking-wider italic">Bloqueio de Segurança</span>
                                  <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest font-mono">Gerenciar acesso dos nós</span>
                               </div>
                            </div>
                            <FiArrowRight className="w-5 h-5 text-white/10 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Neural Slot Expansion Modal */}
            <AnimatePresence>
                {isBuyModalOpen && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setIsBuyModalOpen(false)} />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className={`bg-[#0A0A10] border border-white/10 rounded-[4rem] p-12 max-w-xl w-full shadow-3xl relative overflow-hidden ${transparencyMode ? 'voltris-glass' : 'bg-[#0A0A10]'}`}
                        >
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#8B31FF] via-[#31A8FF] to-[#FF4B6B]"></div>
                            
                            <div className="flex items-center gap-8 mb-12">
                               <div className="w-20 h-20 rounded-[2rem] bg-[#8B31FF]/10 border border-[#8B31FF]/20 flex items-center justify-center text-[#8B31FF] shadow-lg shadow-[#8B31FF]/10">
                                 <FiPieChart className="w-10 h-10" />
                               </div>
                               <div className="space-y-1">
                                 <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Expandir <span className="text-[#8B31FF] not-italic">Frota</span></h2>
                                 <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">Injetar slots de nós neurais adicionais</p>
                               </div>
                            </div>

                            <div className="mb-12 space-y-4">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] font-mono pl-2">Selecionar Tamanho do Cluster</label>
                                <div className="grid grid-cols-4 gap-4">
                                    {[5, 10, 50, 100].map(qty => (
                                        <button
                                            key={qty}
                                            onClick={() => setBuyQuantity(qty)}
                                            className={`relative overflow-hidden py-4 rounded-3xl border font-black uppercase tracking-widest text-[10px] transition-all duration-500 hover:scale-105 active:scale-95
                                              ${buyQuantity === qty 
                                                ? 'bg-[#8B31FF] border-[#8B31FF] text-white shadow-lg shadow-[#8B31FF]/30' 
                                                : 'bg-white/5 border-white/10 text-white/30 hover:border-white/20'}`}
                                        >
                                            <span className="relative z-10">+{qty}</span>
                                            {buyQuantity === qty && (
                                              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-black/40 border border-white/5 p-8 rounded-[2.5rem] mb-12 relative group overflow-hidden">
                                <div className="space-y-1 relative z-10">
                                  <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] font-mono">Alocação Total</span>
                                  <div className="flex items-baseline gap-2">
                                     <span className="text-3xl font-black text-white italic tracking-tighter uppercase whitespace-nowrap">R$ {(buyQuantity * 29.90).toFixed(2)}</span>
                                     <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">/ Mês</span>
                                  </div>
                               </div>
                                 <div className="text-right relative z-10">
                                    <div className="text-[10px] font-black text-[#8B31FF] uppercase tracking-widest font-mono">Protocolo Pro</div>
                                    <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest whitespace-nowrap">Suporte Prioritário 24/7</div>
                                 </div>
                               <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-[#8B31FF]/5 blur-3xl group-hover:bg-[#8B31FF]/10 transition-all rounded-full"></div>
                            </div>

                            <div className="flex gap-6">
                                <button
                                    onClick={() => setIsBuyModalOpen(false)}
                                    className="flex-1 py-5 rounded-3xl bg-white/5 text-white/40 font-black uppercase italic tracking-widest text-[10px] hover:bg-white/10 transition-all"
                                >
                                    Abortar
                                </button>
                                <button
                                    onClick={handleBuyLicenses}
                                    className="flex-2 py-5 px-10 rounded-3xl bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] text-white font-black uppercase italic tracking-widest text-[10px] hover:scale-[1.05] transition-all shadow-3xl shadow-[#8B31FF]/20"
                                >
                                    Executar Uplink
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, subtext, alert = false, transparencyMode }: any) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`border rounded-[3rem] p-8 relative overflow-hidden transition-all duration-500
              ${alert ? 'border-[#FF4B6B]/40 shadow-lg shadow-[#FF4B6B]/10' : 'border-white/5 shadow-2xl'} 
              ${transparencyMode ? 'voltris-glass' : 'bg-[#12121A]'}
            `}
        >
            <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-white shadow-lg transition-transform group-hover:scale-110">
                        <Icon className="w-6 h-6" style={{ color }} />
                    </div>
                    {alert && (
                      <div className="flex items-center gap-2">
                         <span className="text-[8px] font-black text-[#FF4B6B] uppercase tracking-widest">Ação Necessária</span>
                         <span className="w-3 h-3 rounded-full bg-[#FF4B6B] animate-pulse" />
                      </div>
                    )}
                </div>
                <div className="space-y-1">
                   <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">{value}</h3>
                   <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] font-mono">{title}</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }}></div>
                    <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.2em] font-mono truncate">{subtext}</span>
                </div>
            </div>
            {/* Ambient Background Glow */}
            <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-[60px] opacity-[0.05]" style={{ background: color }}></div>
        </motion.div>
    )
}

function AlertItem({ device, msg, time, level = 'warning' }: any) {
    const isCritical = level === 'critical';
    const color = isCritical ? 'text-[#FF4B6B]' : 'text-amber-400';
    const bg = isCritical ? 'bg-[#FF4B6B]/10 border-[#FF4B6B]/20' : 'bg-amber-400/10 border-amber-400/20';

    return (
        <motion.div 
           initial={{ opacity: 0, x: -10 }} 
           animate={{ opacity: 1, x: 0 }}
           className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all group"
        >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all group-hover:scale-110 ${bg} ${color}`}>
                <FiAlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
                <h4 className="text-sm font-black text-white uppercase italic tracking-tighter truncate group-hover:text-[#FF4B6B] transition-colors">{msg}</h4>
                <div className="flex items-center gap-2">
                   <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Nó de Origem:</span>
                   <span className="text-[10px] font-black text-[#31A8FF] uppercase font-mono tracking-widest">{device}</span>
                </div>
            </div>
            <div className="flex flex-col items-end shrink-0 gap-1">
               <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.3em] font-mono italic">{time}</span>
               <div className={`p-1 rounded-full ${isCritical ? 'bg-[#FF4B6B]' : 'bg-amber-400'} opacity-20`}></div>
            </div>
        </motion.div>
    )
}
