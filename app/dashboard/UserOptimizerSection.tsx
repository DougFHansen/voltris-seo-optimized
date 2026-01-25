'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMonitor, FiCpu, FiZap, FiActivity, FiClock, FiShield } from 'react-icons/fi';

export default function UserOptimizerSection({ userId }: { userId: string }) {
    const [installations, setInstallations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        if (userId) {
            fetchData();

            const channel = supabase
                .channel(`user-installs-${userId}`)
                .on('postgres_changes' as any, {
                    event: '*',
                    table: 'installations',
                    filter: `user_id=eq.${userId}`
                }, () => {
                    fetchData();
                })
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [userId]);

    const fetchData = async () => {
        try {
            const { data, error } = await supabase
                .from('installations')
                .select('*')
                .eq('user_id', userId)
                .order('last_heartbeat', { ascending: false });

            if (error) throw error;
            setInstallations(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return null;

    if (installations.length === 0) {
        return (
            <div className="space-y-4 pt-6 mt-6 border-t border-white/5">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FiMonitor className="text-[#31A8FF]" /> Meu Computador
                    </h2>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 bg-[#1A1A22] border border-white/5 rounded-3xl flex flex-col items-center text-center max-w-2xl mx-auto"
                >
                    <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400 mb-6">
                        <FiZap className="w-8 h-8" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">Vincule seu computador</h3>
                    <p className="text-slate-400 mb-8 max-w-md">
                        Acesse as informações em tempo real da sua máquina, status de otimização e gerencie sua licença diretamente do site.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        <div className="bg-[#121218] border border-white/5 p-4 rounded-2xl flex items-center gap-4 text-left">
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white shrink-0 font-bold">1</div>
                            <p className="text-xs text-slate-300">Abra o <span className="text-white font-bold">Voltris Optimizer</span> no seu PC</p>
                        </div>
                        <div className="bg-[#121218] border border-white/5 p-4 rounded-2xl flex items-center gap-4 text-left">
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white shrink-0 font-bold">2</div>
                            <p className="text-xs text-slate-300">Clique em <span className="text-white font-bold">Vincular Conta</span> no topo do app</p>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 w-full flex flex-col items-center">
                        <p className="text-xs text-slate-500 mb-4 uppercase tracking-widest font-black">Não tem o programa?</p>
                        <a
                            href="https://github.com/DougFHansen/voltris-seo-optimized/releases/latest"
                            target="_blank"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-black rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                        >
                            Baixar Voltris Optimizer
                        </a>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-4 pt-6 mt-6 border-t border-white/5">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FiMonitor className="text-[#31A8FF]" /> Meus Computadores (Voltris)
                </h2>
                <span className="text-xs text-slate-500 font-medium">Sincronizado via Telemetria</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {installations.map((inst) => (
                    <motion.div
                        key={inst.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#1A1A22] border border-white/5 p-5 rounded-2xl hover:border-white/10 transition-all group overflow-hidden relative"
                    >
                        {/* Background Glow */}
                        <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-3xl transition-opacity ${inst.is_optimized ? 'bg-emerald-500/10' : 'bg-blue-500/10'
                            }`}></div>

                        <div className="flex justify-between items-start relative z-10">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${new Date().getTime() - new Date(inst.last_heartbeat).getTime() < 300000
                                        ? 'bg-emerald-400 animate-pulse'
                                        : 'bg-slate-500'
                                        }`}></div>
                                    <span className="text-white font-bold text-sm tracking-tight">{inst.os_name}</span>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <FiCpu className="text-[#31A8FF]" />
                                        <span className="truncate max-w-[180px]">{inst.cpu_name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <FiShield className="text-[#8B31FF]" />
                                        <span>v{inst.app_version} • {inst.ram_gb_total}GB RAM</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 text-right">
                                <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest ${inst.is_optimized
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                    }`}>
                                    {inst.is_optimized ? 'OTIMIZADO' : 'SISTEMA PADRÃO'}
                                </div>

                                <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${inst.license_status === 'active'
                                    ? 'text-emerald-400 bg-emerald-400/5'
                                    : 'text-blue-400 bg-blue-400/5'
                                    }`}>
                                    LICENÇA: {inst.license_status?.toUpperCase() || 'TRIAL'}
                                    {inst.license_status === 'trial' && inst.license_expires_at && (
                                        <span className="ml-2 opacity-60">Expira em: {new Date(inst.license_expires_at).toLocaleDateString()}</span>
                                    )}
                                </div>

                                <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                                    {new Date(inst.last_heartbeat).toLocaleTimeString()} <FiClock />
                                </div>
                            </div>
                        </div>

                        {/* Action Overlay */}
                        <div className="mt-4 pt-4 border-t border-white/5 flex gap-4">
                            <div className="flex-1">
                                <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Status de Performance</div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: inst.is_optimized ? '100%' : '60%' }}
                                        className={`h-full bg-gradient-to-r ${inst.is_optimized ? 'from-emerald-500 to-emerald-400' : 'from-blue-500 to-blue-400'}`}
                                    />
                                </div>
                            </div>
                            <button className="px-3 py-1 bg-white text-black text-[10px] font-bold rounded-lg hover:scale-105 transition-transform shrink-0">
                                Gerenciar
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
