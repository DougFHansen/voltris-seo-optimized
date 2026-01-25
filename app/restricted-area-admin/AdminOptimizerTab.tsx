'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';
import {
    FiMonitor, FiActivity, FiServer, FiAlertTriangle,
    FiCpu, FiDatabase, FiSmartphone, FiClock, FiZap
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function AdminOptimizerTab() {
    const [installations, setInstallations] = useState<any[]>([]);
    const [stats, setStats] = useState({
        total: 0,
        active24h: 0,
        optimized: 0,
        crashes: 0
    });
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchData();

        // Realtime subscription
        const channel = supabase
            .channel('public:installations')
            .on('postgres_changes' as any, { event: '*', table: 'installations' }, () => {
                fetchData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchData = async () => {
        try {
            const { data: installs, error } = await supabase
                .from('installations')
                .select('*, profiles:user_id(email)')
                .order('last_heartbeat', { ascending: false });

            if (error) throw error;

            setInstallations(installs || []);

            // Calculate Stats
            const now = new Date();
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

            setStats({
                total: installs?.length || 0,
                active24h: installs?.filter(i => new Date(i.last_heartbeat) > oneDayAgo).length || 0,
                optimized: installs?.filter(i => i.is_optimized).length || 0,
                crashes: 0 // Mocked for now, need crashes table
            });
        } catch (err: any) {
            console.error(err);
            toast.error('Erro ao carregar telemetria');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-[#8B31FF] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[#121218] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <FiMonitor size={48} />
                    </div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Instalações</p>
                    <h3 className="text-3xl font-black text-white">{stats.total}</h3>
                </div>

                <div className="bg-[#121218] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-emerald-500">
                        <FiActivity size={48} />
                    </div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Ativos (24h)</p>
                    <h3 className="text-3xl font-black text-emerald-400">{stats.active24h}</h3>
                </div>

                <div className="bg-[#121218] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-[#31A8FF]">
                        <FiZap size={48} />
                    </div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">PCs Otimizados</p>
                    <h3 className="text-3xl font-black text-[#31A8FF]">{stats.optimized}</h3>
                </div>

                <div className="bg-[#121218] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-red-500">
                        <FiAlertTriangle size={48} />
                    </div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Crashes / Erros</p>
                    <h3 className="text-3xl font-black text-red-500">{stats.crashes}</h3>
                </div>
            </div>

            {/* Installations Table */}
            <div className="bg-[#121218] border border-white/5 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FiServer className="text-[#8B31FF]" /> Monitoramento em Tempo Real
                    </h2>
                    <span className="text-xs text-emerald-400 animate-pulse font-mono tracking-tighter">● LIVE STREAMING</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-black/20 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-white/5">
                                <th className="px-6 py-4">ID / Usuário</th>
                                <th className="px-6 py-4">Hardware</th>
                                <th className="px-6 py-4">Licença</th>
                                <th className="px-6 py-4">Status App</th>
                                <th className="px-6 py-4">Último Sinal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {installations.map((inst) => (
                                <motion.tr
                                    layout
                                    key={inst.id}
                                    className="hover:bg-white/[0.02] transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-white font-mono text-xs opacity-50 group-hover:opacity-100 transition-opacity">#{inst.id.substring(0, 8)}</span>
                                            <span className="text-slate-400 text-sm truncate max-w-[150px]">
                                                {inst.profiles?.email || 'Visitante (Sem Login)'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-xs text-white">
                                                <FiCpu className="shrink-0 text-[#31A8FF]" /> {inst.cpu_name || 'N/A'}
                                            </div>
                                            <div className="flex items-center gap-4 text-[10px] text-slate-500">
                                                <span className="flex items-center gap-1 font-mono">{inst.ram_gb_total}GB • {inst.disk_main_type}</span>
                                                <span className="text-[10px] text-[#8B31FF]">v{inst.app_version}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className={`inline-flex items-center gap-2 px-2 py-0.5 rounded text-[10px] font-bold w-fit ${inst.license_status === 'active'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : inst.license_status === 'trial'
                                                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                        : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                }`}>
                                                {inst.license_status?.toUpperCase() || 'DESCONHECIDO'}
                                            </div>
                                            {inst.license_expires_at && (
                                                <span className="text-[9px] text-slate-500">Expira: {new Date(inst.license_expires_at).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold ${inst.is_optimized
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${inst.is_optimized ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
                                            {inst.is_optimized ? 'OTIMIZADO' : 'PADRÃO'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        <div className="flex flex-col">
                                            <span className="text-white">{new Date(inst.last_heartbeat).toLocaleTimeString()}</span>
                                            <span className="text-slate-500 text-[10px]">{new Date(inst.last_heartbeat).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>

                    {installations.length === 0 && (
                        <div className="p-20 text-center opacity-30">
                            <FiMonitor size={48} className="mx-auto mb-4" />
                            <p>Nenhuma instalação detectada ainda.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
