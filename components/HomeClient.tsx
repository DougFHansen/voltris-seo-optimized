"use client";
import React from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect, useCallback } from 'react';
import {
    FiMonitor,
    FiSettings,
    FiClock,
    FiBarChart2,
    FiShield,
    FiHelpCircle,
    FiAlertTriangle,
    FiCpu,
    FiDatabase,
    FiDownload,
    FiPrinter,
} from 'react-icons/fi';
import { MonitorSmartphone, Laptop2, ShieldCheck, HardDrive, GaugeCircle, Database, Package, Printer, Cpu, Zap, Activity, ChevronRight, BarChart3, Lock, Wrench, Rocket, Check } from "lucide-react";
import AnimatedSection from '@/components/AnimatedSection';
import OptimizerMockup from '@/components/OptimizerMockup';
import { FaWhatsapp } from 'react-icons/fa';
import { ShieldCheckIcon, CloudArrowUpIcon, CogIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { loadFull } from 'tsparticles';

import { motion } from 'framer-motion';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const services = [
    {
        icon: <FiMonitor className="w-8 h-8" />,
        title: "Criação de Sites Profissionais",
        desc: "Desenvolvimento de sites rápidos, responsivos e otimizados para Google, ideais para empresas e projetos digitais.",
        price: "A partir de R$ 997,90",
        link: "/todos-os-servicos/criacao-sites",
        highlight: true
    },
    {
        icon: <FiHelpCircle className="w-8 h-8" />,
        title: "Suporte Técnico Windows Remoto",
        desc: "Suporte remoto completo para Windows: instalação, atualização, correção de erros e otimização de sistema.",
        price: "A partir de R$ 349,90",
        link: "/suporte-ao-windows"
    },
    {
        icon: <FiAlertTriangle className="w-8 h-8" />,
        title: "Correção de Erros no Windows",
        desc: "Resolvemos erros de sistema, telas azuis, falhas de inicialização e problemas de desempenho no Windows.",
        price: "A partir de R$ 49,90",
        link: "/servicos?abrir=correcao-erro"
    },
    {
        icon: <FiCpu className="w-8 h-8" />,
        title: "Formatação de PC e Notebook",
        desc: "Formatação remota completa com backup seguro, instalação limpa do Windows e programas essenciais.",
        price: "A partir de R$ 99,90",
        link: "/formatacao"
    },
    {
        icon: <FiCpu className="w-8 h-8" />,
        title: "Otimização de PC Lento",
        desc: "Otimização remota para acelerar computadores lentos, melhorar desempenho e reduzir travamentos.",
        price: "A partir de R$ 79,90",
        link: "/otimizacao-pc"
    },
    {
        icon: <FiDatabase className="w-8 h-8" />,
        title: "Recuperação de Dados",
        desc: "Recuperação remota de arquivos apagados, dados corrompidos e documentos importantes.",
        price: "A partir de R$ 99,90",
        link: "/servicos?abrir=recuperacao"
    },
    {
        icon: <FiDownload className="w-8 h-8" />,
        title: "Instalação de Programas",
        desc: "Instalação e configuração remota de programas essenciais para trabalho, estudo e uso pessoal.",
        price: "A partir de R$ 29,90",
        link: "/todos-os-servicos/instalacao-de-programas"
    },
    {
        icon: <FiPrinter className="w-8 h-8" />,
        title: "Instalação de Impressora",
        desc: "Configuração remota de impressoras, drivers e dispositivos conectados ao computador.",
        price: "A partir de R$ 49,90",
        link: "/servicos?abrir=instalacao_impressora"
    },
    {
        icon: <FiShield className="w-8 h-8" />,
        title: "Remoção de Vírus e Malware",
        desc: "Remoção completa de vírus, malwares e ameaças com reforço de segurança do sistema.",
        price: "A partir de R$ 39,90",
        link: "/servicos?abrir=remocao_virus"
    }
];

declare global {
    interface Window {
        adsbygoogle: unknown[];
    }
}

export default function HomeClient() {
    const [showMoreText, setShowMoreText] = useState(false);
    const [minimized, setMinimized] = useState(false);



    useEffect(() => {
        const handleAnchorScroll = () => {
            const hash = window.location.hash;
            if (hash) {
                const element = document.querySelector(hash);
                if (element) {
                    const headerHeight = 80;
                    const elementPosition = (element as HTMLElement).offsetTop - headerHeight;
                    window.scrollTo({
                        top: elementPosition,
                        behavior: 'smooth'
                    });
                }
            }
        };

        handleAnchorScroll();

        window.addEventListener('hashchange', handleAnchorScroll);
        return () => {
            window.removeEventListener('hashchange', handleAnchorScroll);
        };
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const error = params.get('error');
            const errorDescription = params.get('error_description');
            if (error) {
                alert(`Erro de autenticação: ${error}\n${errorDescription || ''}`);
            }
        }
    }, []);

    useEffect(() => {
        try {
            if (window) (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) { }
    }, []);

    const particlesInit = useCallback(async (engine: any) => {
        await loadFull(engine);
    }, []);

    if (minimized) {
        return (
            <div className="whatsapp-float-container" style={{ bottom: 24, right: 24 }}>
                <button
                    className="whatsapp-float-btn"
                    style={{
                        background: '#25D366',
                        borderRadius: '50%',
                        width: 44,
                        height: 44,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 16px #25d36655',
                        transition: 'transform 0.2s',
                        cursor: 'pointer',
                        border: 'none',
                        zIndex: 9999,
                    }}
                    aria-label="Abrir balão do WhatsApp"
                    onClick={() => setMinimized(false)}
                >
                    <FaWhatsapp size={24} color="#fff" />
                </button>
            </div>
        );
    }

    return (
        <>
            <Header />
            {/* Global Ambient Background Effects (Noise Overlay on Top) */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-50"></div>

            {/* Background Gradients (Fixed Behind) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#8B31FF]/10 blur-[120px] mix-blend-screen animate-pulse-slow" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#31A8FF]/10 blur-[100px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            <section
                className="
                    relative
                    w-full
                    min-h-[100dvh]
                    flex
                    flex-col
                    items-center
                    justify-center
                    px-4
                    sm:px-6
                    lg:px-12
                    xl:px-24
                    bg-[#050510]
                    overflow-x-hidden
                    pt-20
                    pb-6
                    lg:pt-24
                    lg:pb-12
                "
                aria-label="Software de otimização de PC para Windows - Voltris Optimizer"
            >

                <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-4 lg:gap-8 h-full relative z-10">

                    {/* Left Content - Typography & CTA */}
                    {/* Using display: contents on mobile to allow reordering of children relative to the visual component */}
                    <div className="contents lg:flex lg:flex-1 lg:flex-col lg:items-start lg:text-left lg:gap-4 lg:z-20">

                        {/* Text Content - Order 1 */}
                        <div className="order-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-2 lg:gap-4 z-20 w-full lg:pb-28">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-2 animate-fade-in-up mt-4 lg:mt-0">
                                <span className="flex h-2 w-2 rounded-full bg-[#00FF94] shadow-[0_0_8px_#00FF94]"></span>
                                <span className="text-xs sm:text-sm font-medium text-white/80 tracking-wide">Novos Planos Empresariais Disponíveis</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight font-sans lg:mt-12">
                                <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">Software de Otimização de PC</span> <br className="hidden lg:block" />
                                <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl text-white/95">para Máxima Performance no Windows</span>
                            </h1>

                            <p className="text-sm sm:text-base lg:text-lg text-white/60 max-w-xl leading-relaxed font-light">
                                Otimize computadores para jogos, trabalho e uso profissional. Mais desempenho, estabilidade e produtividade com o <strong className="text-white">Voltris Optimizer</strong>.
                            </p>
                        </div>

                        {/* Buttons - Order 3 (Moved below visual on mobile) - Fixed to bottom left on desktop */}
                        <div className="order-3 lg:order-none flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2 lg:absolute lg:bottom-0 lg:left-0 lg:z-30">
                            <a
                                href="/todos-os-servicos"
                                className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-white/10 border border-white/10 rounded-lg hover:bg-white hover:text-black hover:border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 backdrop-blur-sm overflow-hidden"
                            >
                                <span className="mr-2">Ver Planos e Preços</span>
                                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </a>
                            <a
                                href="https://wa.me/5511996716235?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20a%20otimiza%C3%A7%C3%A3o%20da%20VOLTRIS"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-8 py-4 font-semibold text-[#050510] transition-all duration-200 bg-[#00FF94] rounded-lg hover:bg-[#00CC76] hover:shadow-[0_0_20px_rgba(0,255,148,0.4)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00FF94]"
                            >
                                <FaWhatsapp className="mr-2 text-lg" />
                                Falar com Especialista
                            </a>
                        </div>
                    </div>

                    {/* Right Content - Visual Component (Dashboard Simulation) - Order 2 on Mobile */}
                    <div className="order-2 lg:order-none flex-1 w-full max-w-[600px] lg:max-w-full relative flex items-center justify-center perspective">

                        {/* Background Glow behind the card */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#31A8FF]/20 to-[#8B31FF]/20 blur-[60px] rounded-full transform scale-75 animate-pulse-slow"></div>

                        {/* Main Glass Panel */}
                        <OptimizerMockup />



                    </div>
                </div>
            </section>
            <AnimatedSection direction="up" delay={0.2}>
                <section id="about" className="relative py-20 lg:py-32 bg-[#050510] overflow-hidden">
                    {/* Background Ambience */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#31A8FF]/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#8B31FF]/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                            {/* Left Column: Semantic SEO Content */}
                            <div className="flex flex-col gap-8 text-center lg:text-left">
                                <div>
                                    <h2 className="text-sm font-bold tracking-[0.2em] text-[#31A8FF] mb-4 uppercase">
                                        Quem Somos
                                    </h2>
                                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                                        Redefinindo o Padrão de <br className="hidden lg:block" />
                                        <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">
                                            Engenharia & Performance
                                        </span>
                                    </h3>
                                    <p className="text-lg text-slate-400 leading-relaxed font-light">
                                        A <strong>Voltris</strong> não é apenas uma assistência técnica convencional. Somos um laboratório de tecnologia especializado em extrair o <strong>máximo potencial do seu hardware</strong> através de otimizações a nível de kernel, limpeza profunda e segurança corporativa.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row gap-5 items-center lg:items-start text-center sm:text-left p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#31A8FF]/30 transition-colors duration-300">
                                        <div className="w-12 h-12 rounded-xl bg-[#31A8FF]/10 flex items-center justify-center shrink-0 border border-[#31A8FF]/20 shadow-[0_0_15px_rgba(49,168,255,0.1)]">
                                            <Cpu className="w-6 h-6 text-[#31A8FF]" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg mb-1">Otimização de Hardware (Overclock & Tweak)</h4>
                                            <p className="text-slate-500 text-sm leading-relaxed">
                                                Ajustes finos em voltagem e frequências para garantir FPS estável e menor latência em jogos competitivos.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-5 items-center lg:items-start text-center sm:text-left p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#FF4B6B]/30 transition-colors duration-300">
                                        <div className="w-12 h-12 rounded-xl bg-[#FF4B6B]/10 flex items-center justify-center shrink-0 border border-[#FF4B6B]/20 shadow-[0_0_15px_rgba(255,75,107,0.1)]">
                                            <Wrench className="w-6 h-6 text-[#FF4B6B]" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg mb-1">Suporte Técnico Remoto</h4>
                                            <p className="text-slate-500 text-sm leading-relaxed">
                                                Resolução de problemas complexos de software, drivers e sistema operacional sem que você precise sair de casa.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
                                    <a href="/sobre" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-slate-200 transition-all duration-300">
                                        Conheça Nossa História
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </a>
                                </div>
                            </div>

                            {/* Right Column: Modern Tech Visual (Terminal Representation) */}
                            <div className="relative w-full max-w-[500px] mx-auto perspective-1000">
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#31A8FF] to-[#8B31FF] blur-[80px] opacity-20 rounded-full animate-pulse-slow"></div>

                                {/* Glass Card Container */}
                                <motion.div
                                    className="relative w-full aspect-[4/5] sm:aspect-square bg-[#0A0A0F]/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
                                    initial={{ rotateY: -5, opacity: 0 }}
                                    whileInView={{ rotateY: 0, opacity: 1 }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    viewport={{ once: true }}
                                >
                                    {/* Terminal Header */}
                                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
                                            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div>
                                            <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
                                        </div>
                                        <div className="text-xs text-white/30 font-mono">root@voltris-core:~</div>
                                    </div>

                                    {/* Terminal Content */}
                                    <div className="p-6 font-mono text-xs sm:text-sm text-slate-300 space-y-4 flex-1 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <span className="text-[#8B31FF]">➜</span> <span className="text-[#31A8FF]">initialize</span> --mode=performance_boost
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ delay: 1 }}
                                            className="space-y-1 pl-4 border-l-2 border-[#31A8FF]/20"
                                        >
                                            <div className="text-[#31A8FF]">[INFO] Loading core modules...</div>
                                            <div>Analyzed Processes: <span className="text-green-400">12,405</span></div>
                                            <div>Optimized Services: <span className="text-green-400">58</span></div>
                                            <div>Network Latency: <span className="text-red-400 line-through mr-2">45ms</span> <span className="text-green-400">12ms</span></div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 2 }}
                                        >
                                            <span className="text-[#8B31FF]">➜</span> <span className="text-[#FF4B6B]">security_check</span> --deep-scan
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ delay: 2.5 }}
                                            className="bg-white/5 p-3 rounded-lg border border-white/5"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span>Threat Detection</span>
                                                <span className="text-green-400">Active</span>
                                            </div>
                                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#00FF94] w-full animate-progress-indeterminate"></div>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ delay: 3.5 }}
                                            className="pt-4 text-green-400 font-bold"
                                        >
                                            SUCCESS: System is now running at 100% efficiency.
                                            <span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse align-middle"></span>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>

                        </div>
                    </div>
                </section>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.2}>
                <section className="py-6 xs:py-8 sm:py-12 px-2 xs:px-4 sm:px-6 md:px-8 overflow-x-hidden bg-[#050510] relative">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
                    <div className="max-w-6xl mx-auto relative z-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 md:gap-8">
                            <div className="text-center">
                                <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text mb-1 xs:mb-2">
                                    100.000+
                                </div>
                                <div className="text-xs xs:text-sm sm:text-base text-[#e2e8f0]">
                                    Clientes Atendidos
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#8B31FF] via-[#31A8FF] to-[#FF4B6B] text-transparent bg-clip-text mb-1 xs:mb-2">
                                    8.9
                                </div>
                                <div className="text-xs xs:text-sm sm:text-base text-[#e2e8f0]">
                                    Avaliação Média
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#31A8FF] via-[#FF4B6B] to-[#8B31FF] text-transparent bg-clip-text mb-1 xs:mb-2">
                                    Imediato
                                </div>
                                <div className="text-xs xs:text-sm sm:text-base text-[#e2e8f0]">
                                    Tempo de Resposta
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF4B6B] via-[#31A8FF] to-[#8B31FF] text-transparent bg-clip-text mb-1 xs:mb-2">
                                    100%
                                </div>
                                <div className="text-xs xs:text-sm sm:text-base text-[#e2e8f0]">
                                    Atendimento Online
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.3}>
                <section id="services" className="relative py-24 lg:py-32 bg-[#050510] overflow-hidden">
                    {/* Background Glows */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[#31A8FF]/5 to-transparent blur-[100px] pointer-events-none"></div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                        {/* Header */}
                        <div className="text-center mb-20 max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#31A8FF]/10 border border-[#31A8FF]/20 mb-6">
                                <span className="w-2 h-2 rounded-full bg-[#31A8FF] animate-pulse"></span>
                                <span className="text-xs font-bold text-[#31A8FF] tracking-widest uppercase">Soluções Profissionais</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                                Suporte Técnico Remoto em Informática, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B]">Otimização de PC e Serviços Windows</span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                                Atendimento online rápido para formatação, correção de erros, remoção de vírus, otimização de desempenho e desenvolvimento de sites profissionais.
                            </p>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {services.map((service, idx) => (
                                <div key={idx} className={`group relative bg-[#0A0A0F] border ${service.highlight ? 'border-[#31A8FF]' : 'border-white/5'} hover:border-[#31A8FF]/30 rounded-3xl p-1 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}>
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                    <div className="relative h-full bg-[#0E0E12] rounded-[20px] p-8 flex flex-col items-start overflow-hidden">
                                        {/* Icon Container with Glass Effect */}
                                        <div className="w-16 h-16 rounded-2xl bg-[#1A1A22]/50 backdrop-blur-sm border border-white/5 flex items-center justify-center mb-8 group-hover:bg-[#31A8FF]/10 group-hover:border-[#31A8FF]/20 transition-all duration-300 shadow-lg">
                                            <div className="transform transition-transform duration-300 group-hover:scale-110 text-[#31A8FF]">
                                                {service.icon}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#31A8FF] transition-colors">{service.title}</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                            {service.desc}
                                        </p>

                                        <div className="mt-auto w-full pt-6 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">A partir de</span>
                                                <span className="text-white font-bold text-lg tracking-tight">{service.price.replace('A partir de ', '')}</span>
                                            </div>

                                            <Link href={service.link} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-[#31A8FF] group-hover:border-[#31A8FF] transition-all duration-300 shadow-md">
                                                <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            <section id="optimizer" className="relative py-20 lg:py-32 bg-[#050510] overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
                <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-[#31A8FF]/10 blur-[150px] rounded-full pointer-events-none animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 -left-20 w-[600px] h-[600px] bg-[#8B31FF]/10 blur-[150px] rounded-full pointer-events-none animate-pulse-slow"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                    {/* Header */}
                    <div className="text-center mb-16 max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
                            <span className="flex h-2 w-2 rounded-full bg-[#00FF94] shadow-[0_0_8px_#00FF94]"></span>
                            <span className="text-xs font-bold text-white tracking-widest uppercase">Tecnologia Exclusiva</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white tracking-tight">
                            VOLTRIS <span className="bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">OPTIMIZER</span>
                        </h2>
                        <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed">
                            Revolucione sua experiência gaming com nossa tecnologia de otimização a nível de kernel.
                            Estabilidade forçada, latência anulada e FPS desbloqueado.
                        </p>
                    </div>

                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Feature 1 */}
                        <div className="group relative bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:border-[#FF4B6B]/30 transition-all duration-500 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FF4B6B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-[#FF4B6B]/10 flex items-center justify-center mb-6 text-[#FF4B6B] group-hover:scale-110 transition-transform duration-300">
                                    <Rocket className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Boost de Performance</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Algoritmos que redirecionam recursos de CPU/GPU para o jogo em primeiro plano, garantindo picos de FPS estáveis.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="group relative bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:border-[#8B31FF]/30 transition-all duration-500 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#8B31FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-[#8B31FF]/10 flex items-center justify-center mb-6 text-[#8B31FF] group-hover:scale-110 transition-transform duration-300">
                                    <Cpu className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Otimização Inteligente</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    IA adaptativa que aprende seu padrão de uso e encerra processos inúteis sem comprometer o sistema.
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="group relative bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:border-[#31A8FF]/30 transition-all duration-500 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#31A8FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-[#31A8FF]/10 flex items-center justify-center mb-6 text-[#31A8FF] group-hover:scale-110 transition-transform duration-300">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Estabilidade Garantida</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Adeus Stutters. Nossa rede de otimização nivela o frametime para uma jogabilidade manteiga.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section: Features List & Metric Highlight */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* List */}
                        <div className="lg:col-span-2 bg-[#0A0A0F]/50 backdrop-blur-md border border-white/5 rounded-3xl p-8 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Zap className="w-6 h-6 text-[#EAB308]" />
                                Recursos Premium
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "Otimização de RAM em Tempo Real", "Priorização de Processos (High Priority)", "Redução de Ping (TcpNoDelay)",
                                    "Perfis de Jogos (Valorant, CS2, CoD)", "Monitoramento de Temp/Uso", "Updates Automáticos (Cloud)"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-slate-300 p-3 rounded-lg hover:bg-white/5 transition-colors">
                                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-green-500" />
                                        </div>
                                        <span className="text-sm font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Metric Card */}
                        <div className="relative bg-gradient-to-br from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] rounded-3xl p-[1px] group overflow-hidden">
                            <div className="absolute inset-0 bg-white/20 blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="bg-[#0A0A0F] h-full rounded-[23px] p-8 flex flex-col items-center justify-center text-center relative z-10">
                                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Ganho Médio</div>
                                <div className="text-7xl font-black text-white mb-2 tracking-tighter group-hover:scale-110 transition-transform duration-500">
                                    +40%
                                </div>
                                <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] to-[#31A8FF]">
                                    FPS INSTANTÂNEO
                                </div>

                                <div className="w-full mt-8">
                                    <Link href="/voltrisoptimizer" className="block w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:scale-[1.02] transition-transform active:scale-[0.98]">
                                        EXPERIMENTAR AGORA
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <AnimatedSection direction="up" delay={0.2}>
                <section className="relative py-20 lg:py-32 bg-[#050510] overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#31A8FF]/5 blur-[120px] rounded-full pointer-events-none"></div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        {/* Header */}
                        <div className="text-center mb-16 max-w-3xl mx-auto">
                            <h2 className="text-sm font-bold tracking-[0.2em] text-[#31A8FF] mb-4 uppercase">Depoimentos</h2>
                            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                                O que dizem sobre a <br />
                                <span className="bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">Experiência Voltris</span>
                            </h3>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                            {[
                                {
                                    name: "Carlos Silva",
                                    role: "Gamer Competitivo",
                                    location: "São Paulo, SP",
                                    text: "Meu FPS no Valorant literalmente dobrou. Eu não acreditava que otimização de software faria tanta diferença, mas a Voltris provou o contrário. Atendimento impecável!",
                                    initial: "C",
                                    color: "from-[#FF4B6B] to-[#FF8F6B]"
                                },
                                {
                                    name: "Ana Costa",
                                    role: "Designer Gráfico",
                                    location: "Rio de Janeiro, RJ",
                                    text: "Precisava do meu PC voando para renderizar projetos 3D. A limpeza e otimização deixaram a máquina como nova. O suporte remoto foi super seguro e transparente.",
                                    initial: "A",
                                    color: "from-[#8B31FF] to-[#B96BFF]"
                                },
                                {
                                    name: "Pedro Santos",
                                    role: "Streamer",
                                    location: "Curitiba, PR",
                                    text: "Sem mais telas azuis ou travamentos durante a live. A estabilidade que ganhei com a otimização premium é absurda. Recomendo para todo criador de conteúdo.",
                                    initial: "P",
                                    color: "from-[#31A8FF] to-[#6BA8FF]"
                                }
                            ].map((review, i) => (
                                <div key={i} className="group relative bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-white/20 transition-all"></div>

                                    {/* Quote Icon */}
                                    <div className="absolute top-6 right-8 text-white/5 text-6xl font-serif leading-none select-none">"</div>

                                    {/* Stars */}
                                    <div className="flex items-center gap-1 mb-6 text-yellow-400">
                                        {[...Array(5)].map((_, s) => (
                                            <svg key={s} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        ))}
                                    </div>

                                    <p className="text-slate-300 leading-relaxed mb-8 relative z-10">
                                        "{review.text}"
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${review.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                                            {review.initial}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-sm">{review.name}</div>
                                            <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">{review.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            <Footer />
        </>
    );
}
