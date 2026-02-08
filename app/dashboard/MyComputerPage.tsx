'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMonitor, FiCpu, FiZap, FiActivity, FiClock, FiShield, FiX, FiDownload } from 'react-icons/fi';

export default function MyComputerPage({ userId }: { userId: string }) {
    const [installations, setInstallations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [unlinkModalOpen, setUnlinkModalOpen] = useState(false);
    const [selectedInstallation, setSelectedInstallation] = useState<any>(null);
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
            console.error('[MyComputerPage] Erro:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUnlinkClick = (installation: any) => {
        setSelectedInstallation(installation);
        setUnlinkModalOpen(true);
    };

    const handleConfirmUnlink = async () => {
        if (!selectedInstallation) return;
        setUnlinkModalOpen(false);
        const loadingId = toast.loading('Processando...');
        try {
            await fetch('/api/v1/install/unlink', {
                method: 'POST',
                body: JSON.stringify({ installation_id: selectedInstallation.id })
            });
            toast.success('Dispositivo removido.', { id: loadingId, icon: '🗑️' });
            fetchData();
        } catch {
            toast.error('Falha ao desvincular.', { id: loadingId });
        }
        setSelectedInstallation(null);
    };

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#31A8FF] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (installations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto px-4">
                {/* Header Centralizado */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                        <FiMonitor className="text-[#31A8FF]" />
                        Meu Computador
                    </h1>
                    <p className="text-slate-400 text-lg">Gerencie seu dispositivo Voltris Optimizer</p>
                </motion.div>

                {/* Empty State Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full bg-[#121218]/60 backdrop-blur-md border border-white/10 rounded-3xl p-12 text-center"
                >
                    <div className="p-6 bg-[#31A8FF]/10 rounded-2xl border border-[#31A8FF]/20 text-[#31A8FF] mb-8 w-fit mx-auto">
                        <FiZap className="w-12 h-12" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-4">Vincule seu computador</h3>
                    <p className="text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Acesse informações em tempo real da sua máquina, status de otimização e gerencie sua licença diretamente do dashboard.
                    </p>

                    {/* Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="bg-[#0A0A0F] border border-white/5 p-6 rounded-2xl text-left">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white font-bold text-lg mb-4">1</div>
                            <p className="text-sm text-slate-300">Abra o <span className="text-white font-bold">Voltris Optimizer</span> no seu PC</p>
                        </div>
                        <div className="bg-[#0A0A0F] border border-white/5 p-6 rounded-2xl text-left">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white font-bold text-lg mb-4">2</div>
                            <p className="text-sm text-slate-300">Clique em <span className="text-white font-bold">Vincular Conta</span> no topo do app</p>
                        </div>
                    </div>

                    {/* Download Section - Estilo Voltris Optimizer */}
                    <div className="pt-12 border-t border-white/10">
                        <p className="text-xs text-slate-500 mb-6 uppercase tracking-widest font-bold">Não tem o programa?</p>
                        <div className="flex flex-col items-center gap-3">
                            <a
                                href="https://github.com/DougFHansen/voltris-releases/releases/download/v1.1/VoltrisOptimizerInstaller.exe"
                                className="group relative px-8 py-4 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] flex items-center justify-center gap-3"
                            >
                                <FiDownload className="w-5 h-5 group-hover:translate-y-[2px] transition-transform duration-300" />
                                DOWNLOAD x64
                            </a>
                            <a
                                href="https://github.com/DougFHansen/voltris-releases/releases/download/v1.1/VoltrisOptimizerInstallerX86.exe"
                                className="text-sm text-slate-500 hover:text-[#31A8FF] transition-colors font-medium opacity-80 hover:opacity-100"
                            >
                                Download Versão x86 (32 bits)
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-8">
                {/* Header Centralizado */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                        <FiMonitor className="text-[#31A8FF]" />
                        Meu Computador
                    </h1>
                    <p className="text-slate-400 text-lg">Sincronizado via Telemetria</p>
                </motion.div>

                {/* Computers Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {installations.map((inst) => (
                        <motion.div
                            key={inst.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            className="bg-[#121218]/60 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:border-[#31A8FF]/30 transition-all group overflow-hidden relative"
                        >
                            {/* Background Glow */}
                            <div className={`absolute -right-12 -top-12 w-32 h-32 rounded-full blur-3xl transition-opacity ${inst.is_optimized ? 'bg-emerald-500/20' : 'bg-blue-500/20'
                                }`}></div>

                            <div className="relative z-10">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${new Date().getTime() - new Date(inst.last_heartbeat).getTime() < 300000
                                            ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                                            : 'bg-slate-500'
                                            }`}></div>
                                        <span className="text-white font-bold text-xl">{inst.os_name}</span>
                                    </div>
                                    <button
                                        onClick={() => handleUnlinkClick(inst)}
                                        className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                                        title="Desvincular"
                                    >
                                        <FiX className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Hardware Info */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-slate-300">
                                        <FiCpu className="text-[#31A8FF] w-5 h-5" />
                                        <span className="text-sm truncate">{inst.cpu_name}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-300">
                                        <FiShield className="text-[#8B31FF] w-5 h-5" />
                                        <span className="text-sm">v{inst.app_version} • {inst.ram_gb_total}GB RAM</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <FiClock className="w-4 h-4" />
                                        <span className="text-xs">{new Date(inst.last_heartbeat).toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Status Badges */}
                                <div className="flex flex-wrap gap-3 mb-6">
                                    <div className={`px-4 py-2 rounded-xl text-xs font-bold ${inst.is_optimized
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                                        }`}>
                                        {inst.is_optimized ? '✓ OTIMIZADO' : 'SISTEMA PADRÃO'}
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl text-xs font-bold ${inst.license_status === 'active'
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                                        }`}>
                                        LICENÇA: {inst.license_status?.toUpperCase() || 'TRIAL'}
                                    </div>
                                </div>

                                {/* Performance Bar */}
                                <div className="mb-6">
                                    <div className="text-xs uppercase text-slate-500 font-bold mb-2">Performance</div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: inst.is_optimized ? '100%' : '60%' }}
                                            className={`h-full bg-gradient-to-r ${inst.is_optimized ? 'from-emerald-500 to-emerald-400' : 'from-blue-500 to-blue-400'}`}
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-6 border-t border-white/10">
                                    <button
                                        onClick={async () => {
                                            const toastId = toast.loading('⚡ Enviando comando...');
                                            try {
                                                await fetch('/api/v1/commands/create', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        installation_id: inst.id,
                                                        command_type: 'OPTIMIZE_RAM'
                                                    })
                                                });
                                                toast.success('Comando enviado!', { id: toastId, icon: '🚀' });
                                            } catch {
                                                toast.error('Falha no envio', { id: toastId });
                                            }
                                        }}
                                        className="flex-1 px-4 py-3 bg-white text-black text-sm font-bold rounded-xl hover:scale-105 transition-transform shadow-lg"
                                    >
                                        ⚡ Otimizar RAM
                                    </button>
                                    <button
                                        onClick={async () => {
                                            const toastId = toast.loading('🧹 Solicitando limpeza...');
                                            try {
                                                await fetch('/api/v1/commands/create', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        installation_id: inst.id,
                                                        command_type: 'CLEAN_SYSTEM'
                                                    })
                                                });
                                                toast.success('Limpeza agendada!', { id: toastId, icon: '✨' });
                                            } catch {
                                                toast.error('Falha no envio', { id: toastId });
                                            }
                                        }}
                                        className="flex-1 px-4 py-3 bg-[#121218] border border-white/10 text-white text-sm font-bold rounded-xl hover:bg-white/10 transition-colors"
                                    >
                                        🧹 Limpar Cache
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Modal de Confirmação */}
            <AnimatePresence>
                {unlinkModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setUnlinkModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#121218] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 text-2xl">
                                    ⚠️
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-white mb-2">Desvincular Computador?</h2>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        Você perderá o acesso remoto e a telemetria deste dispositivo.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setUnlinkModalOpen(false)}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setUnlinkModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleConfirmUnlink}
                                    className="px-6 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-all shadow-lg shadow-red-500/20"
                                >
                                    Sim, Desvincular
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
