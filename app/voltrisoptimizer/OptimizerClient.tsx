"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SoftwareApplicationSchema from '@/components/SEOStructuredData';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
    Cpu, Gauge, Wifi, Settings,
    MousePointer2, Layers, CheckCircle2, XCircle,
    ChevronDown, Download, BarChart3, Radio, Briefcase, Minus, Laptop, Video, Zap, Activity, ShieldCheck, Database, Brain, Lock, Check, Wrench
} from 'lucide-react';
import { notifyDownload } from '@/utils/notifications';

// --- COMPONENTS ---

const FAQItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => {
    return (
        <motion.div
            className={`group rounded-xl border transition-all duration-500 overflow-hidden relative ${isOpen
                ? 'bg-gradient-to-r from-[#1a1a2e] to-[#0F111A] border-[#31A8FF]/30 shadow-[0_0_40px_rgba(49,168,255,0.05)]'
                : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                }`}
        >
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8B31FF] to-[#FF4B6B] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
            <button
                onClick={onClick}
                className="w-full p-6 flex items-center justify-between text-left focus:outline-none relative z-10"
            >
                <span className={`text-lg font-medium tracking-tight transition-colors duration-300 ${isOpen ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                    {question}
                </span>
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ml-4 shrink-0 ${isOpen ? 'border-[#8B31FF] bg-[#8B31FF]/10 rotate-180' : 'border-white/10 bg-transparent group-hover:border-white/30'
                    }`}>
                    <ChevronDown className={`w-4 h-4 transition-colors duration-300 ${isOpen ? 'text-[#8B31FF]' : 'text-slate-500'}`} />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-6 pb-6 text-slate-400 leading-relaxed border-t border-white/5 pt-4 mx-6">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --- MAIN PAGE COMPONENT ---

export default function OptimizerClient() {
    const { scrollY } = useScroll();
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
    const [cpuLoad, setCpuLoad] = useState(12);
    const [latencyLoad, setLatencyLoad] = useState(15);
    const [graphData, setGraphData] = useState([30, 45, 40, 60, 55, 75, 70, 90, 85]);

    // Live Data Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            // Random CPU Load between 5% and 15% (Optimized)
            setCpuLoad(Math.floor(Math.random() * (15 - 5 + 1) + 5));
            // Random Latency Bar Width between 10% and 20%
            setLatencyLoad(Math.floor(Math.random() * (20 - 10 + 1) + 10));
            // Dynamic Graph Data
            setGraphData(prev => {
                const newData = [...prev.slice(1)];
                const lastValue = prev[prev.length - 1];
                const nextValue = Math.min(100, Math.max(40, lastValue + Math.floor(Math.random() * 40 - 20)));
                newData.push(nextValue);
                return newData;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // Parallax transforms
    const yLeft = useTransform(scrollY, [0, 500], [0, -100]);
    const yRight = useTransform(scrollY, [0, 500], [0, -150]);

    // --- DATA: SEGMENTS ---
    const segments = [
        {
            id: 'gamers',
            title: 'Gamers & Competitivos',
            icon: <MousePointer2 className="w-6 h-6 text-[#00FF94]" />,
            desc: 'Para quem busca performance extrema. Elimine input lag, otimize o frame-time e garanta a máxima prioridade de hardware para seus jogos.',
            features: ['Redução de Input Lag', 'Frames Estáveis (1% Lows)', 'Foco em Jogos Competitivos'],
            color: 'border-[#00FF94]/30'
        },
        {
            id: 'enterprise',
            title: 'Empresas & Startups',
            icon: <Briefcase className="w-6 h-6 text-[#31A8FF]" />,
            desc: 'Aumente a eficiência operacional. Otimização de frota de PCs para reduzir chamados de TI, acelerar inicialização e fluxos de trabalho.',
            features: ['Produtividade Aumentada', 'Boot Rápido', 'Estabilidade em Softwares Corporativos'],
            color: 'border-[#31A8FF]/30'
        },
        {
            id: 'common',
            title: 'Uso Diário & Home Office',
            icon: <Laptop className="w-6 h-6 text-[#FF4B6B]" />,
            desc: 'Recupere a velocidade do pc. Ideal para navegar na web, assistir streaming e multitarefas sem os travamentos de um sistema sobrecarregado.',
            features: ['Sistema Responsivo', 'Navegação Fluida', 'Revitalização de PCs Antigos'],
            color: 'border-[#FF4B6B]/30'
        }
    ];

    // --- DATA: TECHNICAL FEATURES ---
    const features = [
        {
            icon: <Cpu className="w-8 h-8" />,
            title: 'Gerenciamento de Threads',
            desc: 'Algoritmo proprietário que ajusta a afinidade de CPU para garantir que processos críticos tenham prioridade absoluta.',
            gradient: 'from-[#FF4B6B] to-[#FF8F4B]'
        },
        {
            icon: <Layers className="w-8 h-8" />,
            title: 'Deep Debloat',
            desc: 'Remoção cirúrgica de bloatwares e telemetria do Windows que consomem recursos silenciosamente.',
            gradient: 'from-[#8B31FF] to-[#B070FF]'
        },
        {
            icon: <Wifi className="w-8 h-8" />,
            title: 'Otimização TCP/IP',
            desc: 'Ajuste fino da pilha de rede do Windows para reduzir latência, jitter e bufferbloat em conexões.',
            gradient: 'from-[#31A8FF] to-[#5FC2FF]'
        },
        {
            icon: <Database className="w-8 h-8" />,
            title: 'Otimização de I/O',
            desc: 'Priorização de entrada e saída de dados no disco e memória para carregamentos instantâneos.',
            gradient: 'from-[#00E5FF] to-[#00FFCA]'
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: 'Motor SafeTimer™',
            desc: 'Redução real de 5-15ms de input lag através do ajuste de Timer Resolution (Multimedia API), similar ao NVIDIA Reflex.',
            gradient: 'from-[#FFEE00] to-[#FFB300]'
        },
        {
            icon: <Wrench className="w-8 h-8" />,
            title: 'Reparo com 1 Clique',
            desc: 'Fix instantâneo para erros de DirectX, Runtime e DLLs corrompidas via SFC/DISM automatizado.',
            gradient: 'from-[#00FF94] to-[#00CC76]'
        },
        {
            icon: <Settings className="w-8 h-8" />,
            title: 'LYRA Intelligence',
            desc: 'Heurística proprietária que aprende seus horários de pico e apps mais usados para antecipar otimizações.',
            gradient: 'from-[#FF0055] to-[#FF5588]'
        }
    ];

    const stats = [
        { value: '+40%', label: 'Performance', sub: 'Ganho médio' },
        { value: '-35%', label: 'Latência', sub: 'Redução de atraso' },
        { value: '100%', label: 'Segurança', sub: 'Zero coleta de dados' },
        { value: '24/7', label: 'Estabilidade', sub: 'Uso contínuo' },
    ];

    return (
        <>
            <Header />
            <main className="bg-[#050510] min-h-screen relative font-sans selection:bg-[#31A8FF]/30 overflow-hidden">

                {/* Global Ambient Background Effects */}
                <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-50"></div>

                {/* Deep Space Gradients */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-[#31A8FF]/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-[#8B31FF]/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* --- HERO SECTION --- */}
                <section className="min-h-[100dvh] flex flex-col items-center justify-center relative z-10 perspective-1000 pt-32 md:pt-20">

                    {/* Floating Tech Elements (Monitor Simulation) */}
                    <div className="absolute inset-0 pointer-events-none hidden lg:block overflow-hidden">

                        {/* Left Card - System Health (Enterprise SaaS Style) */}
                        <motion.div
                            style={{ y: yLeft }}
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                            className="absolute top-1/2 -translate-y-1/2 left-[2%] xl:left-[2%] w-[280px] bg-[#0A0A0E] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden"
                        >
                            {/* Card Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-white/[0.01]">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                                    <span className="text-xs font-semibold text-white tracking-wide">Saúde do Sistema</span>
                                </div>
                                <span className="text-[10px] font-medium text-emerald-500 px-2 py-0.5 bg-emerald-500/10 rounded-full">Otimizado</span>
                            </div>

                            {/* Card Content */}
                            <div className="p-5 space-y-5">
                                {/* CPU Load Row */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className="text-slate-400 font-medium">Uso de CPU</span>
                                        <span className="text-white font-mono">{cpuLoad}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-white/80 rounded-full"
                                            animate={{ width: `${cpuLoad}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>

                                {/* Latency Row */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className="text-slate-400 font-medium">Latência do Sistema</span>
                                        <span className="text-emerald-400 font-mono">{(latencyLoad / 10).toFixed(2)}ms</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-emerald-500 rounded-full"
                                            animate={{ width: `${latencyLoad}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-white/[0.06]"></div>

                                {/* Meta Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Processos em 2Âº Plano</div>
                                        <div className="text-xs text-white font-mono">Otimizando...</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Perfil</div>
                                        <div className="text-xs text-[#31A8FF] font-medium">Alta Perf.</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Card - Performance Engine (Enterprise SaaS Style) */}
                        <motion.div
                            style={{ y: yRight }}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                            className="absolute top-1/2 -translate-y-1/2 right-[2%] xl:right-[2%] w-[280px] bg-[#0A0A0E] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden"
                        >
                            {/* Card Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-white/[0.01]">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#31A8FF]"></div>
                                    <span className="text-xs font-semibold text-white tracking-wide">Motor de Performance</span>
                                </div>
                                <Activity className="w-3 h-3 text-slate-500" />
                            </div>

                            <div className="p-5 space-y-5">
                                {/* Subtitle */}
                                <div className="flex items-center justify-between pb-2">
                                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Otimização em Tempo Real</span>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3].map(i => <div key={i} className="w-[2px] h-2 bg-emerald-500/50 rounded-full" style={{ animationDelay: i * 0.1 + 's' }}></div>)}
                                    </div>
                                </div>

                                {/* Metrics Stack - Clean List */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-2 rounded-lg bg-white/[0.03] border border-white/[0.02]">
                                        <span className="text-[11px] text-slate-400">Carga Ativa</span>
                                        <span className="text-xs font-mono text-white">Jogos / Render</span>
                                    </div>

                                    <div className="flex justify-between items-center p-2 rounded-lg bg-white/[0.03] border border-white/[0.02]">
                                        <span className="text-[11px] text-slate-400">Alocação de Rec.</span>
                                        <span className="text-xs font-mono text-[#31A8FF]">CPU Prioridade Alta</span>
                                    </div>

                                    <div className="flex justify-between items-center p-2 rounded-lg bg-white/[0.03] border border-white/[0.02]">
                                        <span className="text-[11px] text-slate-400">Índice de Estabilidade</span>
                                        <span className="text-xs font-mono text-emerald-400">99.9%</span>
                                    </div>
                                </div>

                                {/* Footer Mode */}
                                <div className="pt-2 border-t border-white/[0.06] flex justify-between items-center">
                                    <span className="text-[10px] text-slate-500">Modo de Otimização</span>
                                    <span className="text-[10px] font-bold text-white px-2 py-0.5 border border-white/10 rounded">LATÊNCIA MÍNIMA</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Central Copy */}
                    <div className="container mx-auto px-4 flex-grow flex flex-col items-center justify-center text-center relative z-20">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-5xl mx-auto"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
                            >
                                <Brain className="w-3 h-3 text-[#31A8FF] mr-1" />
                                <span className="text-[10px] sm:text-xs font-bold text-white/70 tracking-widest uppercase">Performance Inteligente com I.A.</span>
                            </motion.div>

                            <h1 className="text-5xl md:text-7xl lg:text-9xl font-extrabold tracking-tight mb-8 leading-[0.9] select-none text-center drop-shadow-lg">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B]" style={{ letterSpacing: '0.04em' }}>
                                    PARE DE PERDER <br />
                                </span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B]">
                                    FRAMES AGORA.
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-light mb-12 leading-relaxed tracking-wide">
                                Desbloqueie o poder real do seu hardware. 
                                <span className="text-white font-medium"> Engenharia de Kernel </span> para quem não aceita o atraso do Windows.
                            </p>

                            <div className="flex flex-col items-center gap-3 w-full max-w-lg mx-auto">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500 font-medium">Versão Atual:</span>
                                    <span className="px-2.5 py-1 bg-gradient-to-r from-[#31A8FF]/10 to-[#8B31FF]/10 border border-[#31A8FF]/20 rounded-md text-xs font-bold text-[#31A8FF]">
                                        v1.0.1.0
                                    </span>
                                </div>

                                <div className="flex flex-col sm:flex-row items-start gap-5 justify-center w-full">
                                    <div className="flex flex-col w-full gap-2">
                                        <a
                                            href="https://github.com/DougFHansen/voltris-releases/releases/download/v2.0/VoltrisOptimizerInstaller.exe"
                                            onClick={() => notifyDownload('Voltris Optimizer Installer (x64)')}
                                            className="group relative w-full px-6 py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] flex items-center justify-center gap-2"
                                        >
                                            <Download className="w-4 h-4 group-hover:translate-y-[2px] transition-transform duration-300" />
                                            BAIXAR SOFTWARE
                                        </a>
                                        <a
                                            href="https://github.com/DougFHansen/voltris-releases/releases/download/v2.0/VoltrisOptimizerInstallerX86.exe"
                                            onClick={() => notifyDownload('Voltris Optimizer Installer (x86)')}
                                            className="text-xs text-slate-500 hover:text-[#31A8FF] transition-colors text-center font-medium opacity-80 hover:opacity-100"
                                        >
                                            Para sistemas Windows x86
                                        </a>
                                    </div>

                                    <Link
                                        href="/voltrisoptimizer/como-funciona"
                                        className="w-full px-6 py-3 bg-white/[0.03] text-white font-medium text-base rounded-lg border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all flex items-center justify-center backdrop-blur-md"
                                    >
                                        Como Funciona
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* --- TRUST BAR --- */}
                <section className="py-12 border-y border-white/5 bg-white/[0.02] relative z-10">
                    <div className="container mx-auto px-4 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            <span className="text-xs font-bold text-white uppercase tracking-widest">Scanned by VirusTotal</span>
                        </div>
                        <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all">
                            <CheckCircle2 className="w-5 h-5 text-[#31A8FF]" />
                            <span className="text-xs font-bold text-white uppercase tracking-widest">Zero Spyware / Junkware</span>
                        </div>
                        <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all">
                            <Cpu className="w-5 h-5 text-[#8B31FF]" />
                            <span className="text-xs font-bold text-white uppercase tracking-widest">100% C# Native Code</span>
                        </div>
                        <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all">
                            <Lock className="w-5 h-5 text-[#FF4B6B]" />
                            <span className="text-xs font-bold text-white uppercase tracking-widest">Microsoft Certified Safety</span>
                        </div>
                    </div>
                </section>

                {/* --- COMPLETE FUNCTIONALITY SHOWCASE --- */}
                <section className="py-32 relative z-10 bg-gradient-to-b from-[#050510] to-[#08080C]">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">Funcionalidades Completas do Voltris Optimizer</h2>
                            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
                                Conheça todas as 25 ferramentas profissionais que transformam seu PC em uma máquina de alta performance
                            </p>
                        </div>

                        {/* PRINCIPAL Section */}
                        <div className="mb-24">
                            <div className="text-center mb-12">
                                <h3 className="text-2xl md:text-3xl font-bold text-[#31A8FF] mb-4">🎯 SEÇÃO PRINCIPAL</h3>
                                <p className="text-slate-400">Ferramentas essenciais para otimização do dia a dia</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Dashboard */}
                                <motion.div
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="p-6 rounded-2xl bg-[#0A0A0F] border border-white/5 hover:border-[#31A8FF]/30 transition-all relative overflow-hidden"
                                >
                                    <div className="w-12 h-12 bg-[#31A8FF]/10 rounded-xl flex items-center justify-center mb-4">
                                        <Gauge className="w-6 h-6 text-[#31A8FF]" />
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2">Dashboard</h4>
                                    <p className="text-slate-400 text-sm mb-4">Monitoramento em tempo real</p>
                                    <ul className="text-xs text-slate-500 space-y-2">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3 text-[#31A8FF]" />
                                            CPU, RAM, Disco, Temp
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3 text-[#31A8FF]" />
                                            Health Score 0-100
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3 text-[#31A8FF]" />
                                            Ações rápidas
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3 text-[#31A8FF]" />
                                            Status do sistema
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3 text-[#31A8FF]" />
                                            Métricas em tempo real
                                        </li>
                                    </ul>
                                </motion.div>

                                {/* Performance */}
                                <motion.div
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="p-6 rounded-2xl bg-[#0A0A0F] border border-white/5 hover:border-[#00FF94]/30 transition-all relative overflow-hidden"
                                >
                                    <div className="w-12 h-12 bg-[#00FF94]/10 rounded-xl flex items-center justify-center mb-4">
                                        <Cpu className="w-6 h-6 text-[#00FF94]" />
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2">Desempenho</h4>
                                    <p className="text-slate-400 text-sm mb-4">Otimização inteligente</p>
                                    <ul className="text-xs text-slate-500 space-y-2">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3 text-[#00FF94]" />
                                            Perfil automático
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3 text-[#00FF94]" />
                                            Detecção Intel/AMD
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3 text-[#00FF94]" />
                                            RAM DDR3/4/5
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3 text-[#00FF94]" />
                                            SSD/HDD/NVMe
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3 text-[#00FF94]" />
                                            Overclock seguro
                                        </li>
                                    </ul>
                                </motion.div>

                                {/* Limpeza */}
                                <motion.div
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="p-6 rounded-2xl bg-[#0A0A0F] border border-white/5 hover:border-[#8B31FF]/30 transition-all relative overflow-hidden"
                                >
                                    <div className="w-12 h-12 bg-[#8B31FF]/10 rounded-xl flex items-center justify-center mb-4">
                                        <Database className="w-6 h-6 text-[#8B31FF]" />
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2">Limpeza</h4>
                                    <p className="text-slate-400 text-sm mb-4">Sistema ultra seguro</p>
                                    <ul className="text-xs text-slate-500 space-y-2">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3 text-[#8B31FF]" />
                                            Análise primeiro
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3 text-[#8B31FF]" />
                                            Arquivos temporários
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3 text-[#8B31FF]" />
                                            Cache navegadores
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3 text-[#8B31FF]" />
                                            Downloads antigos
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3 text-[#8B31FF]" />
                                            Console de logs
                                        </li>
                                    </ul>
                                </motion.div>

                                {/* Rede */}
                                <motion.div
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="p-6 rounded-2xl bg-[#0A0A0F] border border-white/5 hover:border-[#00E5FF]/30 transition-all relative overflow-hidden"
                                >
                                    <div className="w-12 h-12 bg-[#00E5FF]/10 rounded-xl flex items-center justify-center mb-4">
                                        <Wifi className="w-6 h-6 text-[#00E5FF]" />
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2">Rede</h4>
                                    <p className="text-slate-400 text-sm mb-4">Otimização completa</p>
                                    <ul className="text-xs text-slate-500 space-y-2">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3 text-[#00E5FF]" />
                                            DNS otimizados
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3 text-[#00E5FF]" />
                                            Google/Cloudflare DNS
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3 text-[#00E5FF]" />
                                            Flush DNS cache
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3 text-[#00E5FF]" />
                                            Reset Winsock
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3 text-[#00E5FF]" />
                                            TCP/IP stack
                                        </li>
                                    </ul>
                                </motion.div>
                            </div>
                        </div>

                        {/* MÓDULOS Section */}
                        <div className="mb-24">
                            <div className="text-center mb-12">
                                <h3 className="text-2xl md:text-3xl font-bold text-[#8B31FF] mb-4">⚡ SEÇÃO MÓDULOS</h3>
                                <p className="text-slate-400">Ferramentas especializadas para máximo desempenho</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Gamer */}
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="p-8 rounded-2xl bg-[#0A0A0F] border border-white/5 hover:border-[#FF4B6B]/30 transition-all relative overflow-hidden"
                                >
                                    <div className="flex items-center mb-6">
                                        <div className="w-16 h-16 bg-[#FF4B6B]/10 rounded-xl flex items-center justify-center mr-6">
                                            <MousePointer2 className="w-8 h-8 text-[#FF4B6B]" />
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-bold text-white mb-2">Modo Gamer</h4>
                                            <p className="text-slate-400">Performance extrema para jogos</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h5 className="font-semibold text-[#FF4B6B] mb-3">Detecção Automática:</h5>
                                            <ul className="text-sm text-slate-400 space-y-2">
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#FF4B6B]" />
                                                    Steam (200+ jogos)
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#FF4B6B]" />
                                                    Epic Games Store
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#FF4B6B]" />
                                                    Battle.net
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#FF4B6B]" />
                                                    Ubisoft Connect
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#FF4B6B]" />
                                                    Jogos independentes
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-[#FF4B6B] mb-3">Otimizações:</h5>
                                            <ul className="text-sm text-slate-400 space-y-2">
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#FF4B6B]" />
                                                    +40% FPS médio
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#FF4B6B]" />
                                                    -60% latência
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#FF4B6B]" />
                                                    0ms input lag
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#FF4B6B]" />
                                                    Prioridade CPU máxima
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#FF4B6B]" />
                                                    RAM dedicada
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Voltris Shield */}
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="p-8 rounded-2xl bg-[#0A0A0F] border border-white/5 hover:border-[#FF0055]/30 transition-all relative overflow-hidden"
                                >
                                    <div className="flex items-center mb-6">
                                        <div className="w-16 h-16 bg-[#FF0055]/10 rounded-xl flex items-center justify-center mr-6">
                                            <ShieldCheck className="w-8 h-8 text-[#FF0055]" />
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-bold text-white mb-2">Voltris Shield</h4>
                                            <p className="text-slate-400">Proteção avançada total</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h5 className="font-semibold text-[#FF0055] mb-3">Scans Disponíveis:</h5>
                                            <ul className="text-sm text-slate-400 space-y-2">
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#FF0055]" />
                                                    Scan Rápido
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#FF0055]" />
                                                    Scan Completo
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#FF0055]" />
                                                    Scan Adware
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#FF0055]" />
                                                    Scan Customizado
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#FF0055]" />
                                                    Proteção 24/7
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-[#FF0055] mb-3">Proteção Contra:</h5>
                                            <ul className="text-sm text-slate-400 space-y-2">
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#FF0055]" />
                                                    Malware/Ransomware
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#FF0055]" />
                                                    Spyware/Adware
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#FF0055]" />
                                                    Toolbars/Hijackers
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#FF0055]" />
                                                    PUPs
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#FF0055]" />
                                                    100% detecção
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* STREAMING Section */}
                        <div className="mb-24">
                            <div className="text-center mb-12">
                                <h3 className="text-2xl md:text-3xl font-bold text-[#FF4B6B] mb-4">🎥 SEÇÃO STREAMING</h3>
                                <p className="text-slate-400">Ferramentas para criadores de conteúdo</p>
                            </div>
                            
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="p-8 rounded-2xl bg-[#0A0A0F] border border-white/5 hover:border-[#FF4B6B]/30 transition-all relative overflow-hidden max-w-4xl mx-auto"
                            >
                                <div className="flex items-center mb-6">
                                    <div className="w-16 h-16 bg-[#FF4B6B]/10 rounded-xl flex items-center justify-center mr-6">
                                        <Video className="w-8 h-8 text-[#FF4B6B]" />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-bold text-white mb-2">Stream Hub</h4>
                                        <p className="text-slate-400">Central para streamers e criadores de conteúdo</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <h5 className="font-semibold text-[#FF4B6B] mb-3">Otimização:</h5>
                                        <ul className="text-sm text-slate-400 space-y-2">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-[#FF4B6B]" />
                                                OBS/Streamlabs
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-[#FF4B6B]" />
                                                Prioridade streaming
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-[#FF4B6B]" />
                                                Redução de lag
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-[#FF4B6B] mb-3">Performance:</h5>
                                        <ul className="text-sm text-slate-400 space-y-2">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-[#FF4B6B]" />
                                                CPU dedicada
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-[#FF4B6B]" />
                                                RAM otimizada
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-[#FF4B6B]" />
                                                Rede estável
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-[#FF4B6B] mb-3">Qualidade:</h5>
                                        <ul className="text-sm text-slate-400 space-y-2">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-[#FF4B6B]" />
                                                1080p/60fps
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-[#FF4B6B]" />
                                                4K/30fps
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-[#FF4B6B]" />
                                                Sem drops
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* FERRAMENTAS Section */}
                        <div className="mb-24">
                            <div className="text-center mb-12">
                                <h3 className="text-2xl md:text-3xl font-bold text-[#FFEE00] mb-4">🛠️ SEÇÃO FERRAMENTAS</h3>
                                <p className="text-slate-400">6 ferramentas essenciais de personalização e configuração</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    { name: 'Personalizar', icon: <Settings />, color: '#FFEE00', desc: 'Customização visual completa', features: ['Temas Dark/Light', 'Transparência', 'Centralização taskbar', 'Cores personalizadas'] },
                                    { name: 'Tela', icon: <Video />, color: '#31A8FF', desc: 'Configurações avançadas', features: ['Resolução ideal', 'Taxa de refresh', 'Múltiplos monitores', 'HDR calibration'] },
                                    { name: 'Energia', icon: <Zap />, color: '#00FF94', desc: 'Planos inteligentes', features: ['Performance vs economia', 'Otimização bateria', 'Perfis adaptativos', 'Modo turbo'] },
                                    { name: 'Segurança', icon: <Lock />, color: '#FF0055', desc: 'Configurações avançadas', features: ['Firewall avançado', 'Controle UAC', 'Permissões apps', 'Proteção em camadas'] },
                                    { name: 'Privacidade', icon: <ShieldCheck />, color: '#8B31FF', desc: 'Controle total de dados', features: ['Telemetria Windows', 'Coleta de dados', 'Privacidade apps', 'Anti-tracking'] },
                                    { name: 'Debloat', icon: <Minus />, color: '#FF4B6B', desc: 'Remoção de bloatware', features: ['Apps pré-instalados', 'Componentes desnecessários', 'Otimização sistema', 'Windows lite'] }
                                ].map((tool, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        className="p-6 rounded-2xl bg-[#0A0A0F] border border-white/5 hover:border-opacity-30 transition-all relative overflow-hidden"
                                        style={{ borderColor: `${tool.color}30` }}
                                    >
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${tool.color}10` }}>
                                            <div className="w-6 h-6" style={{ color: tool.color }}>{tool.icon}</div>
                                        </div>
                                        <h4 className="text-lg font-bold text-white mb-2">{tool.name}</h4>
                                        <p className="text-slate-400 text-sm mb-4">{tool.desc}</p>
                                        <ul className="text-xs text-slate-500 space-y-2">
                                            {tool.features.map((feature, fIdx) => (
                                                <li key={fIdx} className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-3 h-3" style={{ color: tool.color }} />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* MONITORAMENTO Section */}
                        <div className="mb-24">
                            <div className="text-center mb-12">
                                <h3 className="text-2xl md:text-3xl font-bold text-[#00E5FF] mb-4">📊 SEÇÃO MONITORAMENTO</h3>
                                <p className="text-slate-400">4 ferramentas para análise e diagnóstico completo</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { name: 'Dispositivo', icon: <Laptop />, color: '#00E5FF', desc: 'Informações detalhadas', features: ['Hardware completo', 'Drivers atualizados', 'Versões sistema', 'Especificações'] },
                                    { name: 'Benchmark', icon: <BarChart3 />, color: '#FFB300', desc: 'Testes de performance', features: ['CPU, GPU, RAM', 'Comparações', 'Histórico', 'Scores globais'] },
                                    { name: 'Diagnóstico', icon: <Activity />, color: '#31A8FF', desc: 'Verificação completa', features: ['Saúde do sistema', 'Erros críticos', 'Componentes', 'Relatórios'] },
                                    { name: 'Histórico', icon: <Brain />, color: '#8B31FF', desc: 'Timeline completa', features: ['Otimizações', 'Alterações', 'Atividades', 'Logs detalhados'] }
                                ].map((tool, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        className="p-6 rounded-2xl bg-[#0A0A0F] border border-white/5 hover:border-opacity-30 transition-all relative overflow-hidden"
                                        style={{ borderColor: `${tool.color}30` }}
                                    >
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${tool.color}10` }}>
                                            <div className="w-6 h-6" style={{ color: tool.color }}>{tool.icon}</div>
                                        </div>
                                        <h4 className="text-lg font-bold text-white mb-2">{tool.name}</h4>
                                        <p className="text-slate-400 text-sm mb-4">{tool.desc}</p>
                                        <ul className="text-xs text-slate-500 space-y-2">
                                            {tool.features.map((feature, fIdx) => (
                                                <li key={fIdx} className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-3 h-3" style={{ color: tool.color }} />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* SERVIÇOS Section */}
                        <div className="mb-24">
                            <div className="text-center mb-12">
                                <h3 className="text-2xl md:text-3xl font-bold text-[#FF8F4B] mb-4">⚙️ SEÇÃO SERVIÇOS</h3>
                                <p className="text-slate-400">3 ferramentas para automação e controle avançado</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { name: 'Agendador', icon: <Activity />, color: '#FF8F4B', desc: 'Manutenção automática', features: ['Agendamentos', 'Tarefas recorrentes', 'Manutenção programada', 'Automação completa'] },
                                    { name: 'Logs', icon: <Database />, color: '#6B7280', desc: 'Eventos detalhados', features: ['Eventos sistema', 'Erros e avisos', 'Logs em tempo real', 'Exportação'] },
                                    { name: 'Serviços Pro', icon: <Settings />, color: '#FFEE00', desc: 'Recursos avançados', features: ['Funções avançadas', 'Configurações pro', 'Otimizações expert', 'Suporte prioritário'] }
                                ].map((tool, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        className="p-6 rounded-2xl bg-[#0A0A0F] border border-white/5 hover:border-opacity-30 transition-all relative overflow-hidden"
                                        style={{ borderColor: `${tool.color}30` }}
                                    >
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${tool.color}10` }}>
                                            <div className="w-6 h-6" style={{ color: tool.color }}>{tool.icon}</div>
                                        </div>
                                        <h4 className="text-lg font-bold text-white mb-2">{tool.name}</h4>
                                        <p className="text-slate-400 text-sm mb-4">{tool.desc}</p>
                                        <ul className="text-xs text-slate-500 space-y-2">
                                            {tool.features.map((feature, fIdx) => (
                                                <li key={fIdx} className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-3 h-3" style={{ color: tool.color }} />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* SISTEMA Section */}
                        <div>
                            <div className="text-center mb-12">
                                <h3 className="text-2xl md:text-3xl font-bold text-[#6B7280] mb-4">🔧 SEÇÃO SISTEMA</h3>
                                <p className="text-slate-400">3 ferramentas essenciais para manutenção do Windows</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { name: 'Reparo', icon: <Wrench />, color: '#31A8FF', desc: 'Correção automática', features: ['Erros Windows', 'Correção automática', 'Reparo profundo', 'Sistema estável'] },
                                    { name: 'Sistema', icon: <Settings />, color: '#6B7280', desc: 'Configurações avançadas', features: ['Componentes Windows', 'Configurações ocultas', 'Otimizações sistema', 'Controle total'] },
                                    { name: 'Drivers', icon: <Cpu />, color: '#00FF94', desc: 'Gerenciamento completo', features: ['Atualização automática', 'Compatibilidade', 'Backup drivers', 'Versões otimizadas'] }
                                ].map((tool, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        className="p-6 rounded-2xl bg-[#0A0A0F] border border-white/5 hover:border-opacity-30 transition-all relative overflow-hidden"
                                        style={{ borderColor: `${tool.color}30` }}
                                    >
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${tool.color}10` }}>
                                            <div className="w-6 h-6" style={{ color: tool.color }}>{tool.icon}</div>
                                        </div>
                                        <h4 className="text-lg font-bold text-white mb-2">{tool.name}</h4>
                                        <p className="text-slate-400 text-sm mb-4">{tool.desc}</p>
                                        <ul className="text-xs text-slate-500 space-y-2">
                                            {tool.features.map((feature, fIdx) => (
                                                <li key={fIdx} className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-3 h-3" style={{ color: tool.color }} />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SEGMENTS SECTION --- */}
                <section className="py-32 relative z-10 bg-[#050510]">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">Uma Plataforma. Múltiplos Perfis.</h2>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                                O Voltris Optimizer identifica seu perfil e adapta as otimizações de Kernel para entregar o que você precisa.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {segments.map((seg, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -10 }}
                                    className={`p-10 rounded-[2rem] bg-[#0A0A0F] border ${seg.color} border-opacity-20 hover:border-opacity-100 transition-all duration-300 relative group overflow-hidden flex flex-col`}
                                >
                                    {/* Abstract BG Icon */}
                                    <div className="absolute top-[-20px] right-[-20px] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity scale-[3]">
                                        {seg.icon}
                                    </div>

                                    <div className="mb-8 p-4 bg-white/5 rounded-2xl w-fit border border-white/5 backdrop-blur-sm group-hover:scale-110 transition-transform">{seg.icon}</div>
                                    <h3 className="text-2xl font-bold text-white mb-4 leading-tight">{seg.title}</h3>
                                    <p className="text-slate-400 mb-8 text-sm leading-relaxed flex-grow">{seg.desc}</p>

                                    <div className="pt-8 border-t border-white/5">
                                        <ul className="space-y-3">
                                            {seg.features.map((feat, fIdx) => (
                                                <li key={fIdx} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                                                    <CheckCircle2 className="w-4 h-4 text-[#31A8FF] shrink-0" />
                                                    {feat}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- STATS BAR --- */}
                <section className="py-16 relative z-10 border-y border-white/5 bg-[#08080C]">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-6xl mx-auto text-center">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="group">
                                    <h3 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight group-hover:text-[#31A8FF] transition-colors">{stat.value}</h3>
                                    <p className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className="text-[10px] md:text-xs text-slate-600 font-medium">{stat.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- DEEP TECH FEATURES --- */}
                <section className="py-32 relative z-10">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-end justify-between mb-20 max-w-7xl mx-auto gap-8">
                            <div className="max-w-2xl">
                                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">Engenharia Sob o Capô</h2>
                                <p className="text-slate-400 text-lg leading-relaxed">
                                    Segurança e Performance não são opostos. O Voltris atua em camadas profundas do Windows (Registry, Services, Kernel) para desbloquear hardware adormecido de forma segura.
                                </p>
                            </div>
                            <Link href="/voltrisoptimizer/documentacao" className="text-[#31A8FF] font-bold hover:text-white transition-colors flex items-center gap-2">
                                Documentação Técnica <ChevronDown className="-rotate-90 w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                            {features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className="group p-8 rounded-[2rem] bg-[#0A0A0F] border border-white/5 hover:border-[#31A8FF]/30 transition-all relative overflow-hidden"
                                >
                                    <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${feature.gradient} opacity-[0.03] blur-[50px] rounded-full group-hover:opacity-[0.1] transition-opacity`}></div>
                                    <div className={`w-14 h-14 rounded-2xl bg-[#141419] border border-white/5 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform relative z-10 shadow-lg`}>
                                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity`}></div>
                                        <div className="relative z-10">{feature.icon}</div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 relative z-10">{feature.title}</h3>
                                    <p className="text-slate-400 relative z-10 text-sm leading-relaxed">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- COMPARISON TABLE (E-E-A-T) --- */}
                <section className="py-24 relative z-10 bg-[#08080C]">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto bg-[#0A0A0E] rounded-[3rem] border border-white/5 p-8 md:p-12 overflow-hidden relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-[#31A8FF] to-transparent opacity-50"></div>

                            <div className="text-center mb-16">
                                <h2 className="text-3xl font-bold text-white mb-4">Por que a Elite Escolhe Voltris?</h2>
                                <h3 className="text-xl font-medium text-slate-400 mb-2">Comparação técnica com "otimizadores" comuns de mercado</h3>
                            </div>

                            <div className="space-y-1">
                                {[
                                    { feat: 'Engenharia de Performance Real (Não só "Limpeza")', us: true, others: false },
                                    { feat: 'Otimização para Softwares Corporativos & ERPs', us: true, others: false },
                                    { feat: 'Zero Coleta de Dados/Spyware (Privacidade)', us: true, others: false },
                                    { feat: 'Backup Automático (Ponto de Restauração)', us: true, others: true },
                                    { feat: 'Suporte Humano Dedicado', us: true, others: false },
                                    { feat: 'Ajustes Seguros de Kernel (Registry)', us: true, others: false },
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors rounded-xl">
                                        <span className="font-medium text-slate-300 text-sm md:text-base">{row.feat}</span>
                                        <div className="flex items-center gap-12 md:gap-24 pr-4">
                                            <div className="flex flex-col items-center opacity-40 grayscale group-hover:grayscale-0 transition-all">
                                                <span className="text-[10px] uppercase tracking-wider mb-2 md:hidden font-semibold">Outros</span>
                                                {row.others ? <CheckCircle2 className="w-5 h-5 text-slate-400" /> : <Minus className="w-5 h-5 text-slate-600" />}
                                            </div>
                                            <div className="flex flex-col items-center relative">
                                                <span className="text-[10px] text-[#31A8FF] uppercase tracking-wider mb-2 md:hidden font-bold">Voltris</span>
                                                {row.us ? (
                                                    <div className="relative">
                                                        <div className="absolute inset-0 bg-[#31A8FF] blur-md opacity-40"></div>
                                                        <CheckCircle2 className="w-6 h-6 text-[#31A8FF] relative z-10" />
                                                    </div>
                                                ) : <XCircle className="w-6 h-6 text-red-500" />}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SEO SECTION: PARA GAMERS E STREAMERS --- */}
                <section className="py-32 relative z-10 bg-[#050510]">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                                    Otimização de PC para <span className="bg-gradient-to-r from-[#00FF94] to-[#31A8FF] text-transparent bg-clip-text">Gamers e Streamers</span>
                                </h2>
                                <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
                                    O primeiro software brasileiro SaaS com controle remoto de otimização. Aumente FPS, reduza lag e elimine travamentos em jogos competitivos como Valorant, CS2, League of Legends e Fortnite.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                <div className="bg-[#0A0A0F] border border-white/5 rounded-2xl p-8 hover:border-[#00FF94]/30 transition-all">
                                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                        <Video className="w-6 h-6 text-[#00FF94]" />
                                        Para Streamers Profissionais
                                    </h3>
                                    <p className="text-slate-400 mb-6 leading-relaxed">
                                        Transmita em alta qualidade sem comprometer o desempenho do jogo. Nossa tecnologia otimiza OBS, Streamlabs e XSplit para lives sem drops de frames.
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            'Redução de lag durante transmissões ao vivo',
                                            'Otimização específica para OBS Studio',
                                            'Melhor desempenho em streaming simultâneo',
                                            'Priorização de processos de captura'
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                                <CheckCircle2 className="w-5 h-5 text-[#00FF94] shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-[#0A0A0F] border border-white/5 rounded-2xl p-8 hover:border-[#FF4B6B]/30 transition-all">
                                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                        <MousePointer2 className="w-6 h-6 text-[#FF4B6B]" />
                                        Para Gamers Competitivos
                                    </h3>
                                    <p className="text-slate-400 mb-6 leading-relaxed">
                                        Maximize seu potencial competitivo com otimizações que reduzem input lag e garantem frames estáveis nos momentos críticos.
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            'Aumento de FPS em jogos competitivos',
                                            'Redução de input lag e latência de rede',
                                            'Estabilidade de frame time (1% lows)',
                                            'Otimização para jogos online e eSports'
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                                <CheckCircle2 className="w-5 h-5 text-[#FF4B6B] shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-[#0A0A0F] to-[#0E0E14] border border-white/5 rounded-2xl p-8">
                                <h3 className="text-xl font-bold text-white mb-4">Eliminação de Stuttering (Gargalos)</h3>
                                <p className="text-slate-400 leading-relaxed mb-4">
                                    O VOLTRIS OPTIMIZER é o único com <strong className="text-white">Limpeza de Shader Cache (NVIDIA/AMD)</strong>. Isso elimina aquelas travadinhas chatas (stuttering) que acontecem quando o jogo precisa compilar shaders em tempo real.
                                </p>
                                <p className="text-slate-400 leading-relaxed">
                                    Ao ajustar a <strong className="text-white">Timer Resolution (timeBeginPeriod)</strong>, conseguimos uma redução de latência comparável a ferramentas profissionais como ISLC, garantindo que cada clique seja registrado no milissegundo exato.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SHIELD SECTION --- */}
                <section className="py-32 relative z-10 bg-[#08080C] border-y border-white/5">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
                            <div className="w-full lg:w-1/2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                    <span className="text-xs font-bold text-emerald-500 tracking-widest uppercase">Proteção Ativa</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Voltris Shield™</h2>
                                <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                                    Não é apenas performance, é segurança. O Voltris Shield monitora seu sistema contra softwares intrusivos que tentam roubar recursos.
                                </p>
                                <div className="space-y-4">
                                    {[
                                        { title: 'Monitor de Inicialização', desc: 'Detecta e bloqueia bloatwares que tentam se auto-iniciar silenciosamente.' },
                                        { title: 'Anti-Adware Engine', desc: 'Identifica e remove barras de ferramentas e softwares de publicidade.' },
                                        { title: 'Proteção de Processos Críticos', desc: 'Garante que processos vitais do Windows não sejam suspensos ou corrompidos.' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                                            <div>
                                                <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                                                <p className="text-xs text-slate-500">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 relative">
                                <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full"></div>
                                <div className="relative p-1 bg-gradient-to-br from-white/10 to-transparent rounded-[2.5rem]">
                                    <div className="bg-[#050510] rounded-[2.4rem] p-8 border border-white/5">
                                        <div className="flex items-center justify-between mb-8">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Atividade do Shield</span>
                                            <div className="flex gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30"></div>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} whileInView={{ width: "95%" }} className="h-full bg-emerald-500" />
                                            </div>
                                            <div className="flex justify-between items-center bg-white/[0.02] p-4 rounded-xl border border-white/5">
                                                <span className="text-xs text-slate-400">Status da Varredura</span>
                                                <span className="text-xs font-bold text-emerald-500">PROTEGIDO</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 text-center">
                                                    <div className="text-xl font-bold text-white mb-1">0</div>
                                                    <div className="text-[10px] text-slate-500 uppercase">Ameaças Ativas</div>
                                                </div>
                                                <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 text-center">
                                                    <div className="text-xl font-bold text-emerald-500 mb-1">342</div>
                                                    <div className="text-[10px] text-slate-500 uppercase">Processos Limpos</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SEO SECTION: PARA EMPRESAS --- */}
                <section className="py-32 relative z-10 bg-[#08080C]">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#31A8FF]/10 border border-[#31A8FF]/20 mb-6">
                                        <Briefcase className="w-3 h-3 text-[#31A8FF]" />
                                        <span className="text-xs font-bold text-[#31A8FF] tracking-widest uppercase">Tecnologia Exclusiva de Gestão Remota</span>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                                        Controle Total de 1 ou 1000 <span className="bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] text-transparent bg-clip-text">Computadores via Nuvem</span>
                                    </h2>
                                    <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                                        O Voltris Optimizer é o único software no mercado brasileiro que permite otimizar, gerenciar e monitorar toda a frota de PCs da sua empresa sem precisar de acesso físico.
                                    </p>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-[#31A8FF]/20 transition-all">
                                            <div className="w-10 h-10 rounded-lg bg-[#31A8FF]/10 flex items-center justify-center shrink-0">
                                                <BarChart3 className="w-5 h-5 text-[#31A8FF]" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold mb-1">Gestão de Performance via Nuvem</h4>
                                                <p className="text-sm text-slate-400">Monitore e otimize máquinas corporativas remotamente através do dashboard web</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-[#8B31FF]/20 transition-all">
                                            <div className="w-10 h-10 rounded-lg bg-[#8B31FF]/10 flex items-center justify-center shrink-0">
                                                <Lock className="w-5 h-5 text-[#8B31FF]" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold mb-1">Software SaaS de Otimização Empresarial</h4>
                                                <p className="text-sm text-slate-400">Tecnologia inovadora no Brasil: controle total via web sem necessidade de acesso físico</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-[#FF4B6B]/20 transition-all">
                                            <div className="w-10 h-10 rounded-lg bg-[#FF4B6B]/10 flex items-center justify-center shrink-0">
                                                <Activity className="w-5 h-5 text-[#FF4B6B]" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold mb-1">Controle de Desempenho de Máquinas Corporativas</h4>
                                                <p className="text-sm text-slate-400">Reduza chamados de TI e aumente produtividade com otimização preventiva</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#31A8FF]/20 to-[#8B31FF]/20 blur-[80px] rounded-full"></div>
                                    <div className="relative bg-[#0A0A0F] border border-white/5 rounded-3xl p-8">
                                        <h3 className="text-2xl font-bold text-white mb-6">Benefícios Corporativos</h3>
                                        <div className="space-y-6">
                                            {[
                                                { title: 'Redução de Custos com TI', desc: 'Menos chamados técnicos e maior vida útil do hardware' },
                                                { title: 'Produtividade Aumentada', desc: 'Colaboradores com máquinas rápidas e responsivas' },
                                                { title: 'Gestão Centralizada', desc: 'Controle toda frota de PCs através de um único painel' },
                                                { title: 'Tecnologia Brasileira', desc: 'Primeiro software SaaS nacional com controle remoto de otimização' }
                                            ].map((benefit, i) => (
                                                <div key={i} className="flex items-start gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-[#31A8FF]/20 flex items-center justify-center shrink-0 mt-1">
                                                        <CheckCircle2 className="w-4 h-4 text-[#31A8FF]" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-bold text-sm mb-1">{benefit.title}</h4>
                                                        <p className="text-xs text-slate-400">{benefit.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SEO SECTION: PARA USUÁRIOS COMUNS --- */}
                <section className="py-32 relative z-10 bg-[#050510]">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-16">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4B6B]/10 border border-[#FF4B6B]/20 mb-6">
                                    <Radio className="w-3 h-3 text-[#FF4B6B]" />
                                    <span className="text-xs font-bold text-[#FF4B6B] tracking-widest uppercase">Controle Remoto via Web</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                                    PC Lento? <span className="bg-gradient-to-r from-[#FF4B6B] to-[#FF8F6B] text-transparent bg-clip-text">Solução Definitiva</span>
                                </h2>
                                <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed mb-4">
                                    Programa para deixar PC mais rápido e otimizar computador automaticamente. Ideal para uso doméstico, home office e navegação diária.
                                </p>
                                <p className="text-base text-slate-500 max-w-2xl mx-auto">
                                    Execute todas as otimizações remotamente de qualquer lugar do mundo através do painel web.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {[
                                    {
                                        IconComponent: Zap,
                                        title: 'Otimização Automática',
                                        desc: 'Auto otimização completa do sistema com um clique. Acelera inicialização, navegação e abertura de programas.',
                                        iconClass: 'text-[#FF4B6B]',
                                        bgGlow: 'bg-[#FF4B6B]/20'
                                    },
                                    {
                                        IconComponent: Database,
                                        title: 'Otimização de RAM',
                                        desc: 'Liberação inteligente de memória RAM que mantém seu computador responsivo mesmo com múltiplos programas abertos.',
                                        iconClass: 'text-[#8B31FF]',
                                        bgGlow: 'bg-[#8B31FF]/20'
                                    },
                                    {
                                        IconComponent: Activity,
                                        title: 'Limpeza de Sistema',
                                        desc: 'Remove arquivos temporários, cache e lixo do sistema para liberar espaço e melhorar desempenho.',
                                        iconClass: 'text-[#31A8FF]',
                                        bgGlow: 'bg-[#31A8FF]/20'
                                    },
                                    {
                                        IconComponent: Wifi,
                                        title: 'Otimização de Rede',
                                        desc: 'Ajustes TCP/IP para reduzir latência, ping e melhorar velocidade de conexão em jogos online.',
                                        iconClass: 'text-[#00E5FF]',
                                        bgGlow: 'bg-[#00E5FF]/20'
                                    },
                                    {
                                        IconComponent: Brain,
                                        title: 'Modo Gamer Inteligente',
                                        desc: 'IA adaptativa que prioriza recursos para jogos, desativa processos desnecessários e maximiza FPS automaticamente.',
                                        iconClass: 'text-[#FFD700]',
                                        bgGlow: 'bg-[#FFD700]/20'
                                    },
                                    {
                                        IconComponent: ShieldCheck,
                                        title: 'Ponto de Restauração',
                                        desc: 'Cria backup automático do sistema antes de otimizações para garantir segurança total.',
                                        iconClass: 'text-[#00FF94]',
                                        bgGlow: 'bg-[#00FF94]/20'
                                    },
                                    {
                                        IconComponent: Gauge,
                                        title: 'Plano de Energia',
                                        desc: 'Configura perfil de alto desempenho para extrair máxima potência do hardware.',
                                        iconClass: 'text-[#FF6B9D]',
                                        bgGlow: 'bg-[#FF6B9D]/20'
                                    },
                                    {
                                        IconComponent: Cpu,
                                        title: 'Análise de Sistema',
                                        desc: 'Diagnóstico completo do PC identificando gargalos e problemas de performance.',
                                        iconClass: 'text-[#9B59B6]',
                                        bgGlow: 'bg-[#9B59B6]/20'
                                    },
                                    {
                                        IconComponent: Layers,
                                        title: 'Reparo do Sistema',
                                        desc: 'Corrige erros do Windows, arquivos corrompidos e problemas de estabilidade.',
                                        iconClass: 'text-[#3498DB]',
                                        bgGlow: 'bg-[#3498DB]/20'
                                    }
                                ].map((item, i) => {
                                    const Icon = item.IconComponent;
                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            viewport={{ once: true }}
                                            whileHover={{ y: -8, scale: 1.02 }}
                                            className="relative bg-[#0A0A0F] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300 group overflow-hidden"
                                        >
                                            {/* Glow Effect on Hover */}
                                            <div className={`absolute -inset-1 ${item.bgGlow} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>

                                            {/* Content */}
                                            <div className="relative z-10">
                                                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                                                    <Icon className={`w-7 h-7 ${item.iconClass} group-hover:scale-110 transition-transform duration-300`} />
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all duration-300">{item.title}</h3>
                                                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-300">{item.desc}</p>
                                            </div>

                                            {/* Remote Badge */}
                                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-md border border-white/20">
                                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Remoto</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <div className="bg-gradient-to-r from-[#0A0A0F] to-[#0E0E14] border border-white/5 rounded-2xl p-8 lg:p-12">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                    <div>
                                        <h3 className="text-3xl font-bold text-white mb-4">Programa para Melhorar Desempenho do Windows</h3>
                                        <p className="text-slate-400 leading-relaxed mb-6">
                                            O VOLTRIS OPTIMIZER é a solução completa para quem busca <strong className="text-white">otimizar computador automaticamente</strong> sem complicação. Nossa tecnologia identifica e resolve problemas de lentidão, travamentos e alto consumo de recursos.
                                        </p>
                                        <p className="text-slate-400 leading-relaxed">
                                            Diferente de outros programas, não apenas limpamos arquivos temporários - nós reconfiguramos o Windows para extrair máxima performance do seu hardware, seja ele novo ou antigo.
                                        </p>
                                    </div>
                                    <div className="bg-[#0A0A0F] border border-white/5 rounded-xl p-6">
                                        <h4 className="text-lg font-bold text-white mb-4">Problemas que Resolvemos:</h4>
                                        <ul className="space-y-3">
                                            {[
                                                'PC lento para iniciar',
                                                'Travamentos constantes',
                                                'Alto uso de memória RAM',
                                                'Programas demorando para abrir',
                                                'Navegador lento e travando',
                                                'Sistema operacional pesado'
                                            ].map((problem, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                                        <Check className="w-3 h-3 text-green-500" />
                                                    </div>
                                                    {problem}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SEO SECTION: TECNOLOGIA E INOVAÃ‡ÃƒO --- */}
                <section className="py-32 relative z-10 bg-[#08080C]">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto text-center">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                                Inovação <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">Engarrafada no Brasil</span>
                            </h2>
                            <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                                Orgulhosamente desenvolvido no Brasil. Fomos os primeiros a integrar <strong className="text-white">Gerenciamento de Kernel</strong> com a conveniência do <strong className="text-white">SaaS Moderno</strong>.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { icon: <Radio className="w-6 h-6" />, title: 'Controle Remoto via Web', desc: 'Execute otimizações de qualquer lugar do mundo através do painel online' },
                                    { icon: <Brain className="w-6 h-6" />, title: 'Tecnologia SaaS', desc: 'Plataforma baseada em nuvem com atualizações automáticas e inteligência artificial' },
                                    { icon: <ShieldCheck className="w-6 h-6" />, title: 'Solução Profissional', desc: 'Desenvolvida com padrões enterprise para uso doméstico e corporativo' },
                                    { icon: <Zap className="w-6 h-6" />, title: 'Inovação Nacional', desc: 'Primeira tecnologia brasileira de otimização remota do mercado' }
                                ].map((feature, i) => (
                                    <div key={i} className="bg-[#0A0A0F] border border-white/5 rounded-2xl p-6 hover:border-[#31A8FF]/30 transition-all group">
                                        <div className="w-12 h-12 rounded-xl bg-[#31A8FF]/10 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                                            <div className="text-[#31A8FF]">{feature.icon}</div>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- TESTIMONIALS (SOCIAL PROOF) --- */}
                <section className="py-24 relative z-10 border-t border-white/5 bg-[#050510]">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-white mb-4">Elite Users. Real Results.</h2>
                            <p className="text-slate-400">Junte-se a milhares de jogadores e empresas que já desbloquearam seu hardware.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { name: "Carlos Silva", role: "Gamer Competitivo", text: "Meu FPS no Valorant dobrou. A estabilidade de frame-time é o que mais impressiona.", color: "bg-[#FF4B6B]" },
                                { name: "Ana Costa", role: "UX Designer", text: "Meu workflow no Adobe ficou muito mais fluido. O PC não engasga mais em renderizações pesadas.", color: "bg-[#8B31FF]" },
                                { name: "Pedro Santos", role: "DevOps Engineer", text: "O controle remoto via web é genial para gerenciar as máquinas da minha equipe.", color: "bg-[#31A8FF]" }
                            ].map((t, i) => (
                                <div key={i} className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all group">
                                    <div className="flex items-center gap-1 mb-4 text-yellow-500">
                                        {[1, 2, 3, 4, 5].map(s => <Check key={s} className="w-3 h-3 fill-current" />)}
                                    </div>
                                    <p className="text-slate-300 italic mb-6">"{t.text}"</p>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-bold text-white`}>{t.name[0]}</div>
                                        <div>
                                            <div className="text-sm font-bold text-white">{t.name}</div>
                                            <div className="text-[10px] text-slate-500 uppercase tracking-widest">{t.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- FAQ SECTION --- */}
                <section className="py-24 relative z-10 max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-white text-center mb-12 tracking-tight">Perguntas Frequentes</h2>
                    <div className="space-y-4">
                        <FAQItem
                            onClick={() => setOpenFaqIndex(openFaqIndex === 0 ? null : 0)}
                            isOpen={openFaqIndex === 0}
                            question="O Voltris Optimizer serve para PC de escritório?"
                            answer="Sim. Empresas utilizam o Voltris para revitalizar parques de máquinas, evitando a compra prematura de hardware novo. Ele acelera o boot, abertura de planilhas e navegação."
                        />
                        <FAQItem
                            onClick={() => setOpenFaqIndex(openFaqIndex === 1 ? null : 1)}
                            isOpen={openFaqIndex === 1}
                            question="Ã‰ seguro? Corre risco de formatar?"
                            answer="Totalmente seguro. Nossas otimizações são reversíveis e criamos pontos de restauração automáticos. Não formatamos a máquina, apenas ajustamos o sistema para eficiência máxima."
                        />
                        <FAQItem
                            onClick={() => setOpenFaqIndex(openFaqIndex === 2 ? null : 2)}
                            isOpen={openFaqIndex === 2}
                            question="Funciona em PC fraco (Low End)?"
                            answer="Sim! PCs com hardware limitado são os que mais se beneficiam. Ao desativar serviços inúteis do Windows, liberamos RAM e CPU para o que realmente importa."
                        />
                        <FAQItem
                            onClick={() => setOpenFaqIndex(openFaqIndex === 3 ? null : 3)}
                            isOpen={openFaqIndex === 3}
                            question="Qual a diferença para o CCleaner?"
                            answer="O CCleaner limpa arquivos temporários. O Voltris reconfigura a engenharia do Windows (Serviços, Threads, Rede, Energia) para performance. São categorias diferentes de software."
                        />
                        <FAQItem
                            onClick={() => setOpenFaqIndex(openFaqIndex === 4 ? null : 4)}
                            isOpen={openFaqIndex === 4}
                            question="Como funciona o controle remoto via web?"
                            answer="Após instalar o software, você pode acessar o painel web de qualquer lugar e executar otimizações remotamente. Ã‰ a primeira tecnologia SaaS brasileira com esse recurso, ideal para empresas e usuários que gerenciam múltiplos computadores."
                        />
                        <FAQItem
                            onClick={() => setOpenFaqIndex(openFaqIndex === 5 ? null : 5)}
                            isOpen={openFaqIndex === 5}
                            question="Funciona para aumentar FPS em jogos?"
                            answer="Sim! O Voltris Optimizer é amplamente utilizado por gamers e streamers para aumentar FPS, reduzir input lag e eliminar travamentos em jogos competitivos como Valorant, CS2, League of Legends e Fortnite. Nossa tecnologia otimiza o sistema especificamente para gaming."
                        />
                    </div>
                </section>

                {/* --- FINAL CTA --- */}
                <section className="py-40 px-4 text-center relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-[#FF4B6B]/5 via-[#8B31FF]/10 to-[#31A8FF]/5 blur-[120px] rounded-[100%] -z-10 pointer-events-none"></div>

                    <div className="max-w-4xl mx-auto relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                            SEU POTENCIAL. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] drop-shadow-lg">DESBLOQUEADO.</span>
                        </h2>
                        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-light">
                            Performance profissional ao alcance de um clique.<br />
                            A escolha padrão para quem valoriza tempo e eficiência.
                        </p>

                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs text-slate-500 font-medium">Versão Atual:</span>
                                <span className="px-2.5 py-1 bg-gradient-to-r from-[#31A8FF]/10 to-[#8B31FF]/10 border border-[#31A8FF]/20 rounded-md text-xs font-bold text-[#31A8FF]">
                                    v1.8
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-2 w-full max-w-sm">
                                <a
                                    href="https://github.com/DougFHansen/voltris-releases/releases/download/v2.0/VoltrisOptimizerInstaller.exe"
                                    onClick={() => notifyDownload('Voltris Optimizer Installer (x64) - Bottom CTA')}
                                    className="inline-flex items-center gap-4 w-full justify-center px-12 py-6 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-black text-xl rounded-2xl hover:scale-105 hover:shadow-[0_0_80px_rgba(139,49,255,0.4)] transition-all duration-300"
                                >
                                    <Download className="w-6 h-6" />
                                    BAIXAR SOFTWARE
                                </a>
                                <a
                                    href="https://github.com/DougFHansen/voltris-releases/releases/download/v2.0/VoltrisOptimizerInstallerX86.exe"
                                    onClick={() => notifyDownload('Voltris Optimizer Installer (x86) - Bottom CTA')}
                                    className="text-sm text-slate-500 hover:text-[#31A8FF] transition-colors font-medium border-b border-transparent hover:border-[#31A8FF]"
                                >
                                    Para sistemas Windows x86
                                </a>
                            </div>
                        </div>
                        <div className="mt-6">
                            <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Compatível com Windows 10 & 11</span>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>

            <SoftwareApplicationSchema
                name="VOLTRIS OPTIMIZER"
                description="VOLTRIS OPTIMIZER: Software brasileiro de otimização de PC. Aumente até 25% de FPS, elimine stutter e lag, otimização automática para 100+ jogos, redução de input lag em até 40%. Solução SaaS com controle remoto para gamers, empresas e uso doméstico. Setup instantâneo, tecnologia nacional inovadora."
                url="https://voltris.com.br/voltrisoptimizer"
                applicationCategory="GameApplication"
                operatingSystem="Windows"
                offers={{
                    price: "0",
                    priceCurrency: "BRL",
                    availability: "https://schema.org/InStock"
                }}
                features={[
                    "Aumento de FPS em jogos",
                    "Eliminação de stutter e lag",
                    "Otimização automática para 100+ jogos",
                    "Redução de input lag",
                    "Controle remoto via web",
                    "Otimização para streamers",
                    "Otimização para empresas"
                ]}
                softwareVersion="1.8"
                datePublished="2024-01-01"
            />
        </>
    );
}
