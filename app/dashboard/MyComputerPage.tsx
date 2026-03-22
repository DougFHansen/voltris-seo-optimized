'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiMonitor, FiCpu, FiZap, FiShield, FiX, FiDownload,
    FiPower, FiTarget, FiSettings
} from 'react-icons/fi';
import ConfirmModal from '../components/ConfirmModal';
import LicenseExpiredModal from '../components/LicenseExpiredModal';

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

    // Modal de licença expirada
    const [licenseModalOpen, setLicenseModalOpen] = useState(false);
    const [licenseInfo, setLicenseInfo] = useState<any>(null);

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
        // Validar licença antes de enviar comando
        const licenseValid = await validateLicense(installationId);
        if (!licenseValid) {
            return; // Modal de licença já foi aberto
        }

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

    const validateLicense = async (installationId: string): Promise<boolean> => {
        try {
            const response = await fetch(`/api/v1/license/validate?installation_id=${installationId}`);
            const data = await response.json();

            if (data.valid) {
                return true;
            }

            // Licença inválida - mostrar modal
            setLicenseInfo(data);
            setLicenseModalOpen(true);
            return false;
        } catch (error) {
            console.error('Erro ao validar licença:', error);
            toast.error('Erro ao validar licença');
            return false;
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
            <div className="h-full w-full flex items-center justify-center p-4">
                <div className="w-full max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-6"
                    >
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                            <FiMonitor className="text-[#31A8FF] w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" />
                            <span>Meu Computador</span>
                        </h1>
                        <p className="text-slate-400 text-xs sm:text-sm">Gerencie seu dispositivo Voltris Optimizer</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full bg-[#121218]/60 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-6 text-center"
                    >
                        <div className="p-3 bg-[#31A8FF]/10 rounded-xl border border-[#31A8FF]/20 text-[#31A8FF] mb-4 w-fit mx-auto">
                            <FiZap className="w-8 h-8" />
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-white mb-2">Vincule seu computador</h3>
                        <p className="text-slate-400 text-xs sm:text-sm mb-4 max-w-xl mx-auto">
                            Acesse informações em tempo real da sua máquina, status de otimização e gerencie sua licença diretamente do dashboard.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            <div className="bg-[#0A0A0F] border border-white/5 p-3 rounded-lg text-left">
                                <div className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center text-white font-bold text-xs mb-2">1</div>
                                <p className="text-xs text-slate-300">Abra o <span className="text-white font-bold">Voltris Optimizer</span> no seu PC</p>
                            </div>
                            <div className="bg-[#0A0A0F] border border-white/5 p-3 rounded-lg text-left">
                                <div className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center text-white font-bold text-xs mb-2">2</div>
                                <p className="text-xs text-slate-300">Clique em <span className="text-white font-bold">Vincular Conta</span> no topo do app</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <p className="text-xs text-slate-500 mb-3 uppercase tracking-widest font-bold">Não tem o programa?</p>
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                                    <span className="text-xs text-slate-500 font-medium">Versão Atual:</span>
                                    <span className="px-2 py-1 bg-gradient-to-r from-[#31A8FF]/10 to-[#8B31FF]/10 border border-[#31A8FF]/20 rounded-md text-xs font-bold text-[#31A8FF]">
                                        v1.0.1.0
                                    </span>
                                </div>
                                <a
                                    href="https://github.com/DougFHansen/voltris-releases/releases/download/v2.0/VoltrisOptimizerInstaller.exe"
                                    className="w-full sm:w-auto group relative px-5 py-2.5 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-xs rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] flex items-center justify-center gap-2"
                                >
                                    <FiDownload className="w-3.5 h-3.5 group-hover:translate-y-[2px] transition-transform duration-300 flex-shrink-0" />
                                    <span className="whitespace-nowrap">DOWNLOAD x64</span>
                                </a>
                                <a
                                    href="https://github.com/DougFHansen/voltris-releases/releases/download/v2.0/VoltrisOptimizerInstallerX86.exe"
                                    className="text-xs text-slate-500 hover:text-[#31A8FF] transition-colors font-medium opacity-80 hover:opacity-100"
                                >
                                    Para sistemas Windows x86
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="h-full w-full flex flex-col overflow-hidden">
                {/* Header - Professional */}
                <div className="flex-shrink-0 text-center py-4 border-b border-white/10 bg-[#0A0A0F]/50">
                    <h1 className="text-lg sm:text-xl font-bold text-white flex items-center justify-center gap-2.5">
                        <FiMonitor className="text-[#31A8FF] w-5 h-5 sm:w-6 sm:h-6" />
                        <span>Meu Computador</span>
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Gerencie seus dispositivos remotamente</p>
                </div>

                {/* Content - Responsive with modern scroll */}
                <div className="flex-1 min-h-0 p-4 overflow-y-auto custom-scrollbar-modern">
                    <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 pb-6">
                        {installations.map((inst) => (
                            <motion.div
                                key={inst.id}
                                className="bg-[#121218]/60 backdrop-blur-md border border-white/10 p-3 rounded-xl hover:border-[#31A8FF]/30 transition-all overflow-visible relative w-full max-w-2xl mx-auto h-fit"
                            >
                                <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl ${inst.is_optimized ? 'bg-emerald-500/20' : 'bg-blue-500/20'}`}></div>

                                <div className="relative z-10">
                                    {/* Header - Centered */}
                                    <div className="flex justify-center items-center mb-2 gap-2 flex-shrink-0 relative">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${new Date().getTime() - new Date(inst.last_heartbeat).getTime() < 300000 ? 'bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50' : 'bg-slate-500'}`}></div>
                                            <span className="text-white font-bold text-sm truncate">{inst.os_name}</span>
                                        </div>
                                        <button onClick={() => handleUnlinkClick(inst)} className="absolute right-0 p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors flex-shrink-0" title="Desvincular">
                                            <FiX className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {/* Hardware - Centered & Responsive */}
                                    <div className="space-y-1 mb-2 flex-shrink-0 text-[10px] sm:text-[11px]">
                                        <div className="flex items-center justify-center gap-2 text-slate-300 overflow-hidden px-2">
                                            <FiCpu className="text-[#31A8FF] w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                            <span className="truncate text-center">{inst.cpu_name}</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-2 text-slate-300 overflow-hidden px-2">
                                            <FiZap className="text-[#8B31FF] w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                            <span className="truncate text-center">{inst.gpu_name || 'GPU não detectada'}</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-2 text-slate-300">
                                            <FiShield className="text-emerald-400 w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                            <span>{inst.ram_gb_total}GB • {inst.disk_type || 'HDD'}</span>
                                        </div>
                                    </div>

                                    {/* Status - Centered & Responsive */}
                                    <div className="flex flex-wrap justify-center gap-1.5 mb-2 flex-shrink-0">
                                        <div className={`px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold whitespace-nowrap ${inst.is_optimized ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                                            {inst.is_optimized ? '✓ OTIMIZADO' : 'PADRÃO'}
                                        </div>
                                        <div className={`px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold whitespace-nowrap ${inst.license_status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                                            {inst.license_status?.toUpperCase() || 'TRIAL'}
                                        </div>
                                    </div>

                                    {/* Controls - Responsive Categorized Layout */}
                                    <div className="space-y-2 py-2.5 border-t border-white/10">
                                        {/* OTIMIZAÇÃO E CORREÇÃO */}
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#31A8FF]/30 to-transparent"></div>
                                                <span className="text-[8px] sm:text-[9px] font-bold text-[#31A8FF] uppercase tracking-wider whitespace-nowrap px-1">Otimização e Correção</span>
                                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#31A8FF]/30 to-transparent"></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-1.5">
                                                <button
                                                    onClick={() => sendCommand(inst.id, 'AUTO_OPTIMIZE_PERFORMANCE', '🚀 Otimizando...', 'Otimização concluída!')}
                                                    className="group relative px-2 py-1.5 bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] text-white rounded-lg hover:shadow-lg hover:shadow-[#31A8FF]/20 transition-all duration-200 overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                                                    <div className="relative flex items-center justify-center gap-1.5">
                                                        <FiZap className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                                        <span className="text-[9px] sm:text-[10px] font-bold truncate">Otimizar</span>
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={() => { setCurrentInstallationId(inst.id); setPreparePcModalOpen(true); }}
                                                    className="group relative px-2 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200 overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                                                    <div className="relative flex items-center justify-center gap-1.5">
                                                        <FiTarget className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                                        <span className="text-[9px] sm:text-[10px] font-bold truncate">Prepare PC</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        {/* MODO GAMER */}
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
                                                <span className="text-[8px] sm:text-[9px] font-bold text-purple-400 uppercase tracking-wider whitespace-nowrap px-1">Modo Gamer</span>
                                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-1.5">
                                                <button
                                                    onClick={() => sendCommand(inst.id, 'ENABLE_GAMER_MODE', '🎮 Ativando...', 'Modo Gamer ativado!')}
                                                    className="group relative px-2 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200 overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                                                    <div className="relative flex items-center justify-center gap-1.5">
                                                        <FiSettings className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                                        <span className="text-[9px] sm:text-[10px] font-bold truncate">Ativar</span>
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={() => sendCommand(inst.id, 'DISABLE_GAMER_MODE', '🎮 Desativando...', 'Modo Gamer desativado!')}
                                                    className="group relative px-2 py-1.5 bg-[#0A0A0F] border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/10 transition-all duration-200"
                                                >
                                                    <div className="relative flex items-center justify-center gap-1.5">
                                                        <FiSettings className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                                        <span className="text-[9px] sm:text-[10px] font-bold truncate">Desativar</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        {/* FERRAMENTAS DO SISTEMA */}
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
                                                <span className="text-[8px] sm:text-[9px] font-bold text-emerald-400 uppercase tracking-wider whitespace-nowrap px-1">Ferramentas</span>
                                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-1.5">
                                                <button
                                                    onClick={() => sendCommand(inst.id, 'OPTIMIZE_RAM', '⚡ Limpando RAM...', 'RAM otimizada!')}
                                                    className="group relative px-1.5 py-1.5 bg-white text-black rounded-lg hover:shadow-lg hover:shadow-white/20 transition-all duration-200 overflow-hidden"
                                                    title="Otimizar RAM"
                                                >
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                                                    <div className="relative flex flex-col items-center justify-center gap-0.5">
                                                        <FiZap className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                                        <span className="text-[8px] sm:text-[9px] font-bold">RAM</span>
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={() => sendCommand(inst.id, 'CLEAN_SYSTEM', '🧹 Limpando...', 'Sistema limpo!')}
                                                    className="group relative px-1.5 py-1.5 bg-[#121218] border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all duration-200"
                                                    title="Limpar Sistema"
                                                >
                                                    <div className="relative flex flex-col items-center justify-center gap-0.5">
                                                        <FiShield className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                                        <span className="text-[8px] sm:text-[9px] font-bold">Limpar</span>
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={() => sendCommand(inst.id, 'OPTIMIZE_NETWORK', '🌐 Otimizando...', 'Rede otimizada!')}
                                                    className="group relative px-1.5 py-1.5 bg-[#0A0A0F] border border-teal-500/30 text-teal-400 rounded-lg hover:bg-teal-500/10 transition-all duration-200"
                                                    title="Otimizar Rede"
                                                >
                                                    <div className="relative flex flex-col items-center justify-center gap-0.5">
                                                        <FiMonitor className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                                        <span className="text-[8px] sm:text-[9px] font-bold">Rede</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        {/* ENERGIA */}
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
                                                <span className="text-[8px] sm:text-[9px] font-bold text-orange-400 uppercase tracking-wider whitespace-nowrap px-1">Energia</span>
                                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-1.5">
                                                <button
                                                    onClick={() => { setCurrentInstallationId(inst.id); setRestartModalOpen(true); }}
                                                    className="group relative px-2 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-200 overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                                                    <div className="relative flex items-center justify-center gap-1.5">
                                                        <FiPower className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                                        <span className="text-[9px] sm:text-[10px] font-bold truncate">Reiniciar</span>
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={() => { setCurrentInstallationId(inst.id); setShutdownModalOpen(true); }}
                                                    className="group relative px-2 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/20 transition-all duration-200 overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                                                    <div className="relative flex items-center justify-center gap-1.5">
                                                        <FiPower className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                                        <span className="text-[9px] sm:text-[10px] font-bold truncate">Desligar</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
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

            {/* Modal de Licença Expirada */}
            <LicenseExpiredModal
                isOpen={licenseModalOpen}
                onClose={() => setLicenseModalOpen(false)}
                trialDaysRemaining={licenseInfo?.trial_days_remaining || 0}
                reason={licenseInfo?.reason || 'trial_expired'}
            />
        </>
    );
}
