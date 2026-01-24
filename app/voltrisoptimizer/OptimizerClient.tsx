"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
    Cpu, Gauge, Wifi, Settings,
    MousePointer2, Layers, CheckCircle2, XCircle,
    ChevronDown, Download, BarChart3, Radio, Briefcase, Minus, Laptop, Video, Zap, Activity, ShieldCheck, Database, Brain
} from 'lucide-react';

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
            icon: <ShieldCheck className="w-8 h-8" />,
            title: 'Segurança & Privacidade',
            desc: 'Fortalecimento de políticas de segurança e desativação de rastreadores invasivos do sistema.',
            gradient: 'from-[#FFD700] to-[#FFAA00]'
        },
        {
            icon: <Settings className="w-8 h-8" />,
            title: 'Perfis Adaptativos',
            desc: 'Otimizações que se adaptam automaticamente ao hardware detectado (Intel/AMD/NVIDIA).',
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
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse"></div>
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
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Processos em 2º Plano</div>
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
                                        {[1, 2, 3].map(i => <div key={i} className="w-[2px] h-2 bg-emerald-500/50 rounded-full animate-pulse" style={{ animationDelay: i * 0.1 + 's' }}></div>)}
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
                                    VOLTRIS <br />
                                </span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B]">
                                    OPTIMIZER
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-light mb-12 leading-relaxed tracking-wide">
                                <span className="text-white font-medium">Performance Engineering</span> para quem exige o máximo.
                                <br className="hidden md:block" />
                                Otimização inteligente para Gamers, Empresas e High-End Workstations.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5 justify-center w-full max-w-lg mx-auto">
                                <Link
                                    href="/otimizacao"
                                    className="group relative w-full px-6 py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] flex items-center justify-center gap-2"
                                >
                                    <Download className="w-4 h-4 group-hover:translate-y-[2px] transition-transform duration-300" />
                                    DOWNLOAD
                                </Link>

                                <Link
                                    href="/voltrisoptimizer/como-funciona"
                                    className="w-full px-6 py-3 bg-white/[0.03] text-white font-medium text-base rounded-lg border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all flex items-center justify-center backdrop-blur-md"
                                >
                                    Como Funciona
                                </Link>
                            </div>
                        </motion.div>
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
                            <Link href="/tecnologia" className="text-[#31A8FF] font-bold hover:text-white transition-colors flex items-center gap-2">
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
                                <p className="text-slate-400">Comparação técnica com "otimizadores" comuns de mercado.</p>
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
                            question="É seguro? Corre risco de formatar?"
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

                        <Link
                            href="/otimizacao"
                            className="inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-black text-xl rounded-2xl hover:scale-105 hover:shadow-[0_0_80px_rgba(139,49,255,0.4)] transition-all duration-300"
                        >
                            <Download className="w-6 h-6" />
                            COMEÇAR AGORA
                        </Link>
                        <div className="mt-6">
                            <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Compatível com Windows 10 & 11</span>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    );
}
