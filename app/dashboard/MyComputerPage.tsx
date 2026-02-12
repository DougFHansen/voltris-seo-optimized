'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiMonitor, FiCpu, FiZap, FiActivity, FiClock, FiShield, FiX, FiDownload, 
    FiPower, FiTarget, FiSettings 
} from 'react-icons/fi';
import ConfirmModal from '../components/ConfirmModal';

export default function MyComputerPage({ userId }: { userId: string }) {
    const [installations, setInstallations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [unlinkModalOpen, setUnlinkModalOpen] = useState(false);
    const [selectedInstallation, setSelectedInstallation] = useState<any>(null);
    
    // Modais de confirmação
    const [preparePcModalOpen, setPreparePcModalOpen] = useState(false);
    const [restartModalOpen, setRestartModalOpen] = useState(false);
    const [shutdownModalOpen, setShutdownModalOpen] = useState(false);
    const [currentInstallationId, setCurrentInstallationId] = useState<string>('');
    
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

    const sendCommand = async (installationId: string, commandType: string, loadingMsg: string, successMsg: string) => {
        const toastId = toast.loading(loadingMsg);
        try {
            await fetch('/api/v1/commands/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    installation_id: installationId,
                    command_type: commandType
                })
            });
            toast.success(successMsg, { id: toastId });
        } catch {
            toast.error('Falha no envio', { id: toastId });
        }
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

                    <div className="pt-12 border-t border-white/10">
                        <p className="text-xs text-slate-500 mb-6 uppercase tracking-widest font-bold">Não tem o programa?</p>
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs text-slate-500 font-medium">Versão Atual:</span>
                                <span className="px-2.5 py-1 bg-gradient-to-r from-[#31A8FF]/10 to-[#8B31FF]/10 border border-[#31A8FF]/20 rounded-md text-xs font-bold text-[#31A8FF]">
                                    v1.0.0.2
                                </span>
                            </div>
                            <a
                                href="https://github.com/DougFHansen/voltris-releases/releases/download/v1.2/VoltrisOptimizerInstaller.exe"
                                className="group relative px-8 py-4 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] flex items-center justify-center gap-3"
                            >
                                <FiDownload className="w-5 h-5 group-hover:translate-y-[2px] transition-transform duration-300" />
                                DOWNLOAD x64
                            </a>
                            <a
                                href="https://github.com/DougFHansen/voltris-releases/releases/download/v1.2/VoltrisOptimizerInstallerX86.exe"
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
                    {installations.map((inst) => (
                        <motion.div
                            key={inst.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            className="bg-[#121218]/60 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:border-[#31A8FF]/30 transition-all group overflow-hidden relative"
                        >
                            <div className={`absolute -right-12 -top-12 w-32 h-32 rounded-full blur-3xl transition-opacity ${inst.is_optimized ? 'bg-emerald-500/20' : 'bg-blue-500/20'}`}></div>

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
                                        <FiZap className="text-[#8B31FF] w-5 h-5" />
                                        <span className="text-sm truncate">{inst.gpu_name || 'GPU não detectada'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-300">
                                        <FiShield className="text-emerald-400 w-5 h-5" />
                                        <span className="text-sm">{inst.ram_gb_total}GB RAM • {inst.disk_type || 'HDD'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <FiActivity className="w-4 h-4" />
                                        <span className="text-xs">v{inst.app_version}</span>
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

                                {/* Remote Control Panel */}
                                <div className="space-y-4 pt-6 border-t border-white/10">
                                    {/* Otimização Inteligente */}
                                    <div>
                                        <h3 className="text-xs uppercase font-bold text-slate-500 mb-3 flex items-center gap-2">
                                            <FiTarget className="w-3 h-3" />
                                            Otimização Inteligente
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => sendCommand(inst.id, 'AUTO_OPTIMIZE_PERFORMANCE', '🚀 Iniciando otimização automática...', 'Otimização automática iniciada!')}
                                                className="px-3 py-2.5 bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] text-white text-xs font-bold rounded-lg hover:scale-105 transition-transform shadow-lg"
                                            >
                                                🚀 Auto Otimizar
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setCurrentInstallationId(inst.id);
                                                    setPreparePcModalOpen(true);
                                                }}
                                                className="px-3 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-lg hover:scale-105 transition-transform shadow-lg"
                                            >
                                                🎯 Prepare PC
                                            </button>
                                        </div>
                                    </div>

                                    {/* Modo Gamer */}
                                    <div>
                                        <h3 className="text-xs uppercase font-bold text-slate-500 mb-3 flex items-center gap-2">
                                            <FiZap className="w-3 h-3" />
                                            Modo Gamer
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => sendCommand(inst.id, 'ENABLE_GAMER_MODE', '🎮 Ativando modo gamer...', 'Modo Gamer ativado!')}
                                                className="px-3 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-lg hover:scale-105 transition-transform shadow-lg"
                                            >
                                                🎮 Ativar
                                            </button>
                                            <button
                                                onClick={() => sendCommand(inst.id, 'DISABLE_GAMER_MODE', '🎮 Desativando modo gamer...', 'Modo Gamer desativado!')}
                                                className="px-3 py-2.5 bg-[#0A0A0F] border border-purple-500/30 text-purple-400 text-xs font-bold rounded-lg hover:bg-purple-500/10 transition-colors"
                                            >
                                                🎮 Desativar
                                            </button>
                                        </div>
                                    </div>

                                    {/* Ações Rápidas */}
                                    <div>
                                        <h3 className="text-xs uppercase font-bold text-slate-500 mb-3 flex items-center gap-2">
                                            <FiZap className="w-3 h-3" />
                                            Ações Rápidas
                                        </h3>
                                        <div className="grid grid-cols-3 gap-2">
                                            <button
                                                onClick={() => sendCommand(inst.id, 'OPTIMIZE_RAM', '⚡ Enviando comando...', 'Comando enviado!')}
                                                className="px-3 py-2.5 bg-white text-black text-xs font-bold rounded-lg hover:scale-105 transition-transform shadow-lg"
                                            >
                                                ⚡ RAM
                                            </button>
                                            <button
                                                onClick={() => sendCommand(inst.id, 'CLEAN_SYSTEM', '🧹 Solicitando limpeza...', 'Limpeza agendada!')}
                                                className="px-3 py-2.5 bg-[#121218] border border-white/10 text-white text-xs font-bold rounded-lg hover:bg-white/10 transition-colors"
                                            >
                                                🧹 Limpar
                                            </button>
                                            <button
                                                onClick={() => sendCommand(inst.id, 'OPTIMIZE_NETWORK', '🌐 Otimizando rede...', 'Otimização de rede iniciada!')}
                                                className="px-3 py-2.5 bg-[#0A0A0F] border border-teal-500/30 text-teal-400 text-xs font-bold rounded-lg hover:bg-teal-500/10 transition-colors"
                                            >
                                                🌐 Rede
                                            </button>
                                        </div>
                                    </div>

                                    {/* Ferramentas do Sistema */}
                                    <div>
                                        <h3 className="text-xs uppercase font-bold text-slate-500 mb-3 flex items-center gap-2">
                                            <FiSettings className="w-3 h-3" />
                                            Ferramentas do Sistema
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => sendCommand(inst.id, 'CREATE_RESTORE_POINT', '💾 Criando ponto de restauração...', 'Comando enviado!')}
                                                className="px-3 py-2.5 bg-[#0A0A0F] border border-white/5 text-white text-xs font-bold rounded-lg hover:bg-white/5 transition-colors"
                                            >
                                                💾 Restauração
                                            </button>
                                            <button
                                                onClick={() => sendCommand(inst.id, 'REPAIR_SYSTEM', '🔧 Iniciando reparo...', 'Reparo iniciado!')}
                                                className="px-3 py-2.5 bg-[#0A0A0F] border border-white/5 text-white text-xs font-bold rounded-lg hover:bg-white/5 transition-colors"
                                            >
                                                🔧 Reparo
                                            </button>
                                            <button
                                                onClick={() => sendCommand(inst.id, 'ANALYZE_SYSTEM', '📊 Analisando sistema...', 'Análise iniciada!')}
                                                className="px-3 py-2.5 bg-[#0A0A0F] border border-white/5 text-white text-xs font-bold rounded-lg hover:bg-white/5 transition-colors"
                                            >
                                                📊 Analisar
                                            </button>
                                            <button
                                                onClick={() => sendCommand(inst.id, 'DEEP_CLEAN', '🧹 Executando limpeza profunda...', 'Limpeza profunda iniciada!')}
                                                className="px-3 py-2.5 bg-[#0A0A0F] border border-white/5 text-white text-xs font-bold rounded-lg hover:bg-white/5 transition-colors"
                                            >
                                                🧹 Limpeza Ultra
                                            </button>
                                        </div>
                                    </div>

                                    {/* Controle de Energia */}
                                    <div>
                                        <h3 className="text-xs uppercase font-bold text-slate-500 mb-3 flex items-center gap-2">
                                            <FiPower className="w-3 h-3" />
                                            Controle de Energia
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => {
                                                    setCurrentInstallationId(inst.id);
                                                    setRestartModalOpen(true);
                                                }}
                                                className="px-3 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold rounded-lg hover:scale-105 transition-transform shadow-lg"
                                            >
                                                🔄 Reiniciar
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setCurrentInstallationId(inst.id);
                                                    setShutdownModalOpen(true);
                                                }}
                                                className="px-3 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-lg hover:scale-105 transition-transform shadow-lg"
                                            >
                                                🔴 Desligar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Modal Prepare PC */}
            <ConfirmModal
                isOpen={preparePcModalOpen}
                onClose={() => setPreparePcModalOpen(false)}
                onConfirm={async () => {
                    await sendCommand(currentInstallationId, 'PREPARE_PC', '🎯 Iniciando otimização completa...', 'Otimização completa iniciada!');
                }}
                title="Otimização Completa (Prepare PC)"
                message="Esta operação irá otimizar completamente seu sistema"
                details={[
                    'Criar ponto de restauração',
                    'Otimizar RAM e Serviços',
                    'Configurar plano de energia',
                    'Limpar sistema',
                    'Otimizar rede'
                ]}
                confirmText="Iniciar Otimização"
                cancelText="Cancelar"
                confirmColor="green"
                icon={<FiTarget className="w-6 h-6 text-emerald-400" />}
            />

            {/* Modal Restart */}
            <ConfirmModal
                isOpen={restartModalOpen}
                onClose={() => setRestartModalOpen(false)}
                onConfirm={async () => {
                    await sendCommand(currentInstallationId, 'RESTART', '🔄 Enviando comando...', 'Reinicialização agendada!');
                }}
                title="Reiniciar Computador"
                message="O sistema será reiniciado em 10 segundos"
                details={[
                    'Salve todos os arquivos abertos',
                    'Feche aplicativos importantes',
                    'O computador reiniciará automaticamente'
                ]}
                confirmText="Reiniciar Agora"
                cancelText="Cancelar"
                confirmColor="orange"
                icon={<FiPower className="w-6 h-6 text-orange-400" />}
            />

            {/* Modal Shutdown */}
            <ConfirmModal
                isOpen={shutdownModalOpen}
                onClose={() => setShutdownModalOpen(false)}
                onConfirm={async () => {
                    await sendCommand(currentInstallationId, 'SHUTDOWN', '🔴 Enviando comando...', 'Desligamento agendado!');
                }}
                title="Desligar Computador"
                message="O sistema será desligado em 10 segundos"
                details={[
                    'Salve todos os arquivos abertos',
                    'Feche aplicativos importantes',
                    'O computador desligará automaticamente'
                ]}
                confirmText="Desligar Agora"
                cancelText="Cancelar"
                confirmColor="red"
                icon={<FiPower className="w-6 h-6 text-red-400" />}
            />

            {/* Modal de Confirmação de Unlink */}
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
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setUnlinkModalOpen(false)}
                                    className="flex-1 px-4 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleConfirmUnlink}
                                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-bold"
                                >
                                    Desvincular
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
