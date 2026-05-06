"use client";
import React from "react";
import Header from "@/components/Header";
import Link from "next/link";
import { useState, useEffect } from 'react';
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
import dynamic from 'next/dynamic';

const OptimizerMockup = dynamic(() => import('@/components/OptimizerMockup'), {
    loading: () => <div className="w-full h-[400px] bg-white/5 animate-pulse rounded-2xl" />,
    ssr: false
});

const FaWhatsapp = dynamic(() => import('react-icons/fa').then(mod => mod.FaWhatsapp), {
    ssr: false
});

const Footer = dynamic(() => import('@/components/Footer'), { ssr: true }); // SSR ATIVADO PARA PERFORMANCE


import { motion } from 'framer-motion';
import JsonLd from "@/components/JsonLd";
import ParticleBackground from "@/components/ParticleBackground";

const services = [
    {
        icon: <Zap className="w-8 h-8" />,
        title: "Voltris Optimizer",
        desc: "Aumente FPS, reduza input lag e otimize o Windows com apenas 1 clique usando nosso software de alta performance.",
        price: "Licença a partir de R$ 49,90",
        link: "/voltrisoptimizer",
        highlight: true
    },
    {
        icon: <Activity className="w-8 h-8" />,
        title: "Otimização Avançada Gamer",
        desc: "Acesso remoto por especialista para overclock de RAM, CPU e tunning profundo de kernel voltado para eSports.",
        price: "A partir de R$ 149,90",
        link: "/otimizacao-pc",
        highlight: true
    },
    {
        icon: <FiAlertTriangle className="w-8 h-8" />,
        title: "Correção de Erros no Windows",
        desc: "Resolvemos erros de sistema, telas azuis, falhas de inicialização e problemas de desempenho no Windows remotamente.",
        price: "A partir de R$ 49,90",
        link: "/suporte-ao-windows",
        highlight: false
    },
    {
        icon: <FiShield className="w-8 h-8" />,
        title: "Suporte Técnico Expresso",
        desc: "Remoção de vírus, malwares e formatação remota completa com backup seguro para PCs e Notebooks.",
        price: "A partir de R$ 99,90",
        link: "/formatacao",
        highlight: false
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
            const code = params.get('code');
            const error = params.get('error');
            const errorDescription = params.get('error_description');

            // Fallback: Supabase às vezes redireciona o ?code= para a home
            // quando a Redirect URL não está na whitelist ou há race condition.
            // Capturamos aqui e mandamos para o callback correto.
            if (code) {
                const savedRedirect = sessionStorage.getItem('oauth_redirect_after_login');
                sessionStorage.removeItem('oauth_redirect_after_login');
                const nextParam = savedRedirect ? `&next=${encodeURIComponent(savedRedirect)}` : '';
                window.location.replace(`/auth/callback?code=${encodeURIComponent(code)}${nextParam}`);
                return;
            }

            if (error) {
                alert(`Erro de autenticação: ${error}\n${errorDescription || ''}`);
            }
        }
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
            <JsonLd
                type="SoftwareApplication"
                data={{
                    name: "Voltris Optimizer",
                    operatingSystem: "Windows 10, Windows 11",
                    applicationCategory: "UtilitiesApplication",
                    description: "Software avançado de otimização de PC para gamers e profissionais. Aumenta FPS, reduz latência de kernel e melhora o desempenho do sistema Windows.",
                    offers: {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "BRL"
                    },
                    aggregateRating: {
                        "@type": "AggregateRating",
                        "ratingValue": "4.9",
                        "reviewCount": "1250"
                    }
                }}
            />
            <JsonLd
                type="FAQPage"
                data={{
                    mainEntity: [
                        {
                            "@type": "Question",
                            "name": "Como aumentar o FPS em jogos no Windows?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Para aumentar o FPS, você pode usar o Voltris Optimizer para desabilitar serviços inúteis do Windows, otimizar o plano de energia, limpar arquivos temporários e ajustar a latência do sistema para o hardware específico."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "A VOLTRIS faz formatação de PC remota?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Sim, realizamos formatação de computador e notebook de forma remota e segura, com backup de dados e instalação de drivers otimizados para máxima performance."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Como o Voltris Optimizer melhora o desempenho do trabalho?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "O software remove processos em segundo plano que consomem CPU e RAM, garantindo que suas ferramentas de trabalho (Office, Adobe, Navegadores) tenham prioridade máxima de hardware."
                            }
                        }
                    ]
                }}
            />
            <main className="relative">
                <section
                    className="
                    relative
                    w-full
                    min-h-screen
                    bg-[#020205]
                    overflow-hidden
                    flex
                    flex-col
                    items-center
                    justify-center
                    px-4
                    sm:px-6
                    lg:px-12
                    xl:px-24
                    pt-32
                    pb-6
                    lg:pt-24
                    lg:pb-12
                "
                    aria-label="Software de otimização de PC para Windows - Voltris Optimizer"
                >
                    {/* Noise Texture Layer */}
                    <div className="absolute inset-0 noise-bg z-[1]" />

                    {/* Background Radial Glows - Enterprise Level */}
                    <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] rounded-full bg-[#31A8FF]/10 blur-[180px] pointer-events-none z-0" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] rounded-full bg-[#8B31FF]/10 blur-[180px] pointer-events-none z-0" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] rounded-full bg-[#FF4B6B]/5 blur-[200px] pointer-events-none z-0" />

                    {/* Particle Background (Hero Only) */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
                        <ParticleBackground />
                    </div>

                    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-4 lg:gap-12 h-full relative z-[10]">

                        {/* Left Content - Typography & CTA */}
                        <div className="flex flex-col flex-1 items-center lg:items-start text-center lg:text-left gap-8 lg:gap-10 z-20">

                            {/* Text Content */}
                            <div className="flex flex-col items-center lg:items-start gap-4 lg:gap-6 w-full">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-2"
                                >
                                    <span className="flex h-2 w-2 rounded-full bg-[#00FF88] shadow-[0_0_12px_rgba(0,255,136,0.8)] animate-pulse"></span>
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-white/70">Voltris Engine v4.0 • IA Inteligente Ativa</span>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-7xl font-black text-white leading-[1.1] tracking-tight font-sans lg:mt-4"
                                >
                                    <span className="text-gradient-premium">Otimização de Windows com IA</span> <br className="hidden lg:block" />
                                    <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(139,49,255,0.3)]">Máximo Desempenho</span>
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-sm sm:text-base lg:text-lg text-slate-400 max-w-xl leading-relaxed font-medium"
                                >
                                    Aumente FPS, reduza travamentos e extraia o máximo desempenho do seu computador com <strong className="text-white">otimização avançada</strong> e ajustes a nível de sistema.
                                </motion.p>
                            </div>

                            {/* Buttons */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto z-30"
                            >
                                <a
                                    href="/todos-os-servicos"
                                    className="group relative inline-flex items-center justify-center px-8 py-4 font-black text-white transition-all duration-300 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 hover:bg-white/10 overflow-hidden glow-border"
                                >
                                    <span className="relative z-10 flex items-center gap-2 uppercase tracking-widest text-xs">
                                        Explorar Serviços
                                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </a>
                                <a
                                    href="https://wa.me/5511996716235"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center px-8 py-4 font-black text-slate-900 transition-all duration-300 bg-white rounded-2xl hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] uppercase tracking-widest text-xs"
                                >
                                    <FaWhatsapp className="mr-2 text-lg" />
                                    Falar com Especialista
                                </a>
                            </motion.div>
                        </div>

                        {/* Right Content - Visual Component */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="order-2 lg:order-none flex-1 w-full max-w-[650px] lg:max-w-full relative flex items-center justify-center perspective animate-float"
                        >
                            {/* Background Glow behind the card */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#31A8FF]/30 to-[#FF4B6B]/30 blur-[120px] rounded-full transform scale-75 animate-pulse"></div>

                            {/* Main Glass Panel */}
                            <div className="relative z-10 w-full transform -rotate-2 hover:rotate-0 transition-transform duration-700">
                                <OptimizerMockup />
                            </div>
                        </motion.div>
                    </div>
                </section>
                <AnimatedSection direction="up" delay={0.2}>
                    <section id="about" className="relative py-20 lg:py-32 bg-white overflow-hidden">
                        {/* Background Ambience */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/50 to-purple-100/50 blur-[120px] rounded-full pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-100/50 to-blue-100/50 blur-[120px] rounded-full pointer-events-none"></div>

                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                                {/* Left Column: Semantic SEO Content */}
                                <div className="flex flex-col gap-8 text-center lg:text-left">
                                    <div>
                                        <h2 className="text-sm font-bold tracking-[0.2em] text-blue-600 mb-4 uppercase">
                                            Quem Somos
                                        </h2>
                                        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-6">
                                            Redefinindo o Padrão de <br className="hidden lg:block" />
                                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                                                Engenharia & Performance
                                            </span>
                                        </h3>
                                        <p className="text-lg text-gray-500 leading-relaxed">
                                            A <strong className="text-gray-700">Voltris</strong> não é apenas uma assistência técnica convencional. Somos um laboratório de tecnologia especializado em extrair o <strong className="text-gray-700">máximo potencial do seu hardware</strong> através de otimizações a nível de kernel, limpeza profunda e segurança corporativa.
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex flex-col sm:flex-row gap-5 items-center lg:items-start text-center sm:text-left p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-200">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shrink-0 border border-blue-200">
                                                <Cpu className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-gray-900 font-semibold text-lg mb-1">Otimização de Hardware (Overclock & Tweak)</h4>
                                                <p className="text-gray-500 text-sm leading-relaxed">
                                                    Ajustes finos em voltagem e frequências para garantir FPS estável e menor latência em jogos competitivos.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-5 items-center lg:items-start text-center sm:text-left p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-pink-300 hover:shadow-md transition-all duration-200">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center shrink-0 border border-pink-200">
                                                <Wrench className="w-6 h-6 text-pink-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-gray-900 font-semibold text-lg mb-1">Suporte Técnico Remoto</h4>
                                                <p className="text-gray-500 text-sm leading-relaxed">
                                                    Resolução de problemas complexos de software, drivers e sistema operacional sem que você precise sair de casa.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
                                        <a href="/sobre" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                                            Conheça Nossa História
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </a>
                                    </div>
                                </div>

                                {/* Right Column: Modern Tech Visual (Terminal Representation) */}
                                <div className="relative w-full max-w-[500px] mx-auto perspective-1000">
                                    {/* Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/50 to-purple-200/50 blur-[80px] opacity-50 rounded-full animate-pulse-slow"></div>

                                    {/* Glass Card Container */}
                                    <motion.div
                                        className="relative w-full aspect-[4/5] sm:aspect-square bg-gradient-to-br from-gray-50 to-gray-100 backdrop-blur-xl rounded-3xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col"
                                        initial={{ rotateY: -5, opacity: 0 }}
                                        whileInView={{ rotateY: 0, opacity: 1 }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        viewport={{ once: true }}
                                    >
                                        {/* Terminal Header */}
                                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                                            <div className="flex gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            </div>
                                            <div className="text-xs text-gray-500 font-mono">root@voltris-core:~</div>
                                        </div>

                                        {/* Terminal Content */}
                                        <div className="p-6 font-mono text-xs sm:text-sm text-gray-600 space-y-4 flex-1 overflow-hidden relative">

                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                <span className="text-purple-600">➜</span> <span className="text-blue-600">initialize</span> --mode=performance_boost
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                transition={{ delay: 1 }}
                                                className="space-y-1 pl-4 border-l-2 border-[#31A8FF]/20"
                                            >
                                                <div className="text-blue-600">[INFO] Loading core modules...</div>
                                                <div>Analyzed Processes: <span className="text-green-600">12,405</span></div>
                                                <div>Optimized Services: <span className="text-green-600">58</span></div>
                                                <div>Network Latency: <span className="text-red-500 line-through mr-2">45ms</span> <span className="text-green-600">12ms</span></div>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 2 }}
                                            >
                                                <span className="text-purple-600">➜</span> <span className="text-pink-600">security_check</span> --deep-scan
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                transition={{ delay: 2.5 }}
                                                className="bg-gray-100 p-3 rounded-lg border border-gray-200"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-gray-700">Threat Detection</span>
                                                    <span className="text-green-600">Active</span>
                                                </div>
                                                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-green-500 w-full animate-progress-indeterminate"></div>
                                                </div>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                transition={{ delay: 3.5 }}
                                                className="pt-4 text-green-600 font-semibold"
                                            >
                                                SUCCESS: System is now running at 100% efficiency.
                                                <span className="inline-block w-2 h-4 bg-green-500 ml-1 animate-pulse align-middle"></span>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </div>

                            </div>
                        </div>
                    </section>
                </AnimatedSection>

                <AnimatedSection direction="up" delay={0.2}>
                    <section className="py-16 px-6 overflow-x-hidden bg-gray-50 relative">
                        <div className="max-w-7xl mx-auto relative z-10">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 md:gap-8">
                                <div className="text-center">
                                    <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-transparent bg-clip-text mb-1 xs:mb-2">
                                        100.000+
                                    </div>
                                    <div className="text-xs xs:text-sm sm:text-base text-gray-500">
                                        Clientes Atendidos
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 text-transparent bg-clip-text mb-1 xs:mb-2">
                                        8.9
                                    </div>
                                    <div className="text-xs xs:text-sm sm:text-base text-gray-500">
                                        Avaliação Média
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-pink-600 to-purple-600 text-transparent bg-clip-text mb-1 xs:mb-2">
                                        Imediato
                                    </div>
                                    <div className="text-xs xs:text-sm sm:text-base text-gray-500">
                                        Tempo de Resposta
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-blue-600 to-purple-600 text-transparent bg-clip-text mb-1 xs:mb-2">
                                        100%
                                    </div>
                                    <div className="text-xs xs:text-sm sm:text-base text-gray-500">
                                        Atendimento Online
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </AnimatedSection>

                <AnimatedSection direction="up" delay={0.3}>
                    <section id="services" className="relative py-20 lg:py-32 bg-gray-100 overflow-hidden">
                        {/* Background Glows */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-100/50 to-transparent blur-[100px] pointer-events-none"></div>

                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                            {/* Header */}
                            <div className="text-center mb-20 max-w-3xl mx-auto">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 mb-6">
                                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                                    <span className="text-xs font-bold text-blue-600 tracking-widest uppercase">Soluções Profissionais</span>
                                </div>
                                <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                                    Suporte Técnico Remoto em Informática, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Otimização de PC e Serviços Windows</span>
                                </h2>

                                <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                                    Atendimento online rápido para formatação, correção de erros, remoção de vírus, otimização de desempenho e desenvolvimento de sites profissionais.
                                </p>
                            </div>

                            {/* Grid - Refocado */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
                                {services.map((service, idx) => (
                                    <div key={idx} className={`group relative bg-white border ${service.highlight ? 'border-blue-300 shadow-[0_0_40px_rgba(59,130,246,0.15)]' : 'border-gray-200'} hover:border-blue-400 rounded-2xl p-1 overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}>
                                        <div className="relative h-full bg-white rounded-[16px] p-8 flex flex-col items-start overflow-hidden">
                                            {/* Glow Effect para destaques */}
                                            {service.highlight && (
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-purple-100/50 blur-[50px] rounded-full pointer-events-none"></div>
                                            )}

                                            {/* Icon Container with Glass Effect */}
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 flex items-center justify-center mb-6 group-hover:from-blue-100 group-hover:to-purple-100 group-hover:border-blue-300 transition-all duration-200 shadow-sm relative z-10">
                                                <div className="transform transition-transform duration-200 group-hover:scale-110 text-blue-600">
                                                    {service.icon}
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors relative z-10">{service.title}</h3>
                                            <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow relative z-10">
                                                {service.desc}
                                            </p>

                                            <div className="w-full pt-6 border-t border-gray-200 flex items-center justify-between relative z-10">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">A partir de</span>
                                                    <span className="text-gray-900 font-bold text-lg tracking-tight">{service.price.replace('A partir de ', '')}</span>
                                                </div>

                                                <Link href={service.link} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${service.highlight ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700' : 'bg-gray-100 border border-gray-200 text-gray-600 group-hover:bg-gray-200 group-hover:border-gray-300'}`} aria-label={`Ver mais sobre ${service.title}`}>
                                                    <ChevronRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </AnimatedSection>

                <section id="optimizer" className="relative py-20 lg:py-32 bg-white overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/50 to-purple-100/50 blur-[150px] rounded-full pointer-events-none animate-pulse-slow"></div>
                    <div className="absolute bottom-1/4 -left-20 w-[600px] h-[600px] bg-gradient-to-br from-purple-100/50 to-blue-100/50 blur-[150px] rounded-full pointer-events-none animate-pulse-slow"></div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                        {/* Header */}
                        <div className="text-center mb-16 max-w-4xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 backdrop-blur-md mb-4">
                                <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                                <span className="text-xs font-bold text-blue-600 tracking-widest uppercase">Primeiro Software Brasileiro com Controle Remoto</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">VOLTRIS</span> <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-transparent bg-clip-text">OPTIMIZER</span>
                            </h2>
                            <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed mb-4">
                                Software de otimização de PC com controle remoto via web.
                                Aumente FPS em jogos, otimize para streaming e acelere computadores corporativos.
                            </p>
                            <p className="text-base text-gray-500 leading-relaxed">
                                Tecnologia inovadora brasileira para gamers, streamers, empresas e usuários domésticos.
                                Execute otimizações remotamente de qualquer lugar do mundo através do painel web.
                            </p>
                        </div>

                        {/* Bento Grid Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Feature 1 - Gamers */}
                            <div className="group relative bg-white border border-gray-200 rounded-2xl p-8 hover:border-pink-300 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md">
                                <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-6 text-pink-600 group-hover:scale-110 transition-transform duration-200 border border-pink-200">
                                        <Rocket className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Para Gamers e Streamers</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                        Aumente FPS, reduza input lag e elimine travamentos em jogos competitivos. Otimização específica para Valorant, CS2, League of Legends e streaming com OBS.
                                    </p>
                                    <ul className="space-y-2 text-xs text-gray-500">
                                        <li className="flex items-center gap-2">
                                            <Check className="w-3 h-3 text-pink-600" />
                                            Redução de lag no Windows
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="w-3 h-3 text-pink-600" />
                                            Melhor desempenho para OBS
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="w-3 h-3 text-pink-600" />
                                            Frames estáveis (1% Lows)
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Feature 2 - Empresas */}
                            <div className="group relative bg-white border border-gray-200 rounded-2xl p-8 hover:border-purple-300 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform duration-200 border border-purple-200">
                                        <Cpu className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Para Empresas</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                        Gestão remota de performance via nuvem. Otimize toda frota de computadores corporativos de qualquer lugar através do painel web.
                                    </p>
                                    <ul className="space-y-2 text-xs text-gray-500">
                                        <li className="flex items-center gap-2">
                                            <Check className="w-3 h-3 text-purple-600" />
                                            Controle remoto via web
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="w-3 h-3 text-purple-600" />
                                            Redução de custos com TI
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="w-3 h-3 text-purple-600" />
                                            Produtividade aumentada
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Feature 3 - Usuários Comuns */}
                            <div className="group relative bg-white border border-gray-200 rounded-2xl p-8 hover:border-blue-300 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-200 border border-blue-200">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Para Uso Doméstico</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                        PC lento? Solução definitiva. Programa para deixar PC mais rápido, limpar RAM automaticamente e melhorar desempenho do Windows 10 e 11.
                                    </p>
                                    <ul className="space-y-2 text-xs text-gray-500">
                                        <li className="flex items-center gap-2">
                                            <Check className="w-3 h-3 text-blue-600" />
                                            Otimização automática
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="w-3 h-3 text-blue-600" />
                                            Sistema responsivo
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="w-3 h-3 text-blue-600" />
                                            Revitalização de PCs antigos
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section: Features List & Metric Highlight */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* List */}
                            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-8 flex flex-col justify-center shadow-sm hover:shadow-md transition-all duration-200">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                                    <Zap className="w-6 h-6 text-yellow-500" />
                                    Funcionalidades Remotas via Painel Web
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 text-gray-600 p-3 rounded-lg hover:bg-gray-50 hover:border-gray-300 border border-transparent transition-all">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-green-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Otimização Automática Completa</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 p-3 rounded-lg hover:bg-gray-50 hover:border-gray-300 border border-transparent transition-all">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-green-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Otimização de RAM em Tempo Real</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 p-3 rounded-lg hover:bg-gray-50 hover:border-gray-300 border border-transparent transition-all">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-green-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Limpeza Profunda de Sistema</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 p-3 rounded-lg hover:bg-gray-50 hover:border-gray-300 border border-transparent transition-all">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-green-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Otimização de Rede TCP-IP</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 p-3 rounded-lg hover:bg-gray-50 hover:border-gray-300 border border-transparent transition-all">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-green-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Modo Gamer Inteligente com IA</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 p-3 rounded-lg hover:bg-gray-50 hover:border-gray-300 border border-transparent transition-all">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-green-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Criação de Ponto de Restauração</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 p-3 rounded-lg hover:bg-gray-50 hover:border-gray-300 border border-transparent transition-all">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-green-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Configuração de Plano de Energia</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 p-3 rounded-lg hover:bg-gray-50 hover:border-gray-300 border border-transparent transition-all">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-green-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Análise Completa do Sistema</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 p-3 rounded-lg hover:bg-gray-50 hover:border-gray-300 border border-transparent transition-all">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-green-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Reparo Automático do Windows</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 p-3 rounded-lg hover:bg-gray-50 hover:border-gray-300 border border-transparent transition-all">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-green-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Controle Remoto Reiniciar-Desligar</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 p-3 rounded-lg hover:bg-gray-50 hover:border-gray-300 border border-transparent transition-all">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-green-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Perfis para Jogos Competitivos</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 p-3 rounded-lg hover:bg-gray-50 hover:border-gray-300 border border-transparent transition-all">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-green-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Monitoramento em Tempo Real</span>
                                    </div>
                                </div>
                            </div>

                            {/* Metric Card */}
                            <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-[1px] group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200">
                                <div className="absolute inset-0 bg-white/20 blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="bg-white h-full rounded-[15px] p-8 flex flex-col items-center justify-center text-center relative z-10">
                                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">Ganho Médio</div>
                                    <div className="text-7xl font-black text-gray-900 mb-2 tracking-tighter group-hover:scale-110 transition-transform duration-200">
                                        +40%
                                    </div>
                                    <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-blue-600">
                                        PERFORMANCE
                                    </div>

                                    <div className="w-full mt-8">
                                        <Link href="/voltrisoptimizer" className="block w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-lg text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                                            CONHECER VOLTRIS OPTIMIZER
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SEO Content Block */}
                        <div className="mt-12 bg-white border border-gray-200 rounded-2xl p-8 max-w-5xl mx-auto shadow-sm hover:shadow-md transition-all duration-200">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                                O Primeiro Software Brasileiro de Otimização com Controle Remoto
                            </h3>
                            <p className="text-gray-500 leading-relaxed text-center mb-6">
                                O <strong className="text-gray-700">VOLTRIS OPTIMIZER</strong> é uma tecnologia inovadora desenvolvida no Brasil, sendo o primeiro software nacional com capacidade de <strong className="text-gray-700">controle remoto de otimização via web</strong>. Nossa plataforma permite que você execute funções de otimização, limpeza de RAM e processamento avançado de qualquer lugar do mundo através do painel online.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">Web</div>
                                    <div className="text-sm text-gray-500">Tecnologia em Nuvem</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                                    <div className="text-3xl font-bold text-purple-600 mb-2">Remoto</div>
                                    <div className="text-sm text-gray-500">Controle via Web</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                                    <div className="text-3xl font-bold text-pink-600 mb-2">Brasil</div>
                                    <div className="text-sm text-gray-500">Inovação Nacional</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                <AnimatedSection direction="up" delay={0.2}>
                    <section className="relative py-20 lg:py-32 bg-gray-50 overflow-hidden">
                        {/* Background Elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-100/50 to-purple-100/50 blur-[120px] rounded-full pointer-events-none"></div>

                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                            {/* Header */}
                            <div className="text-center mb-16 max-w-3xl mx-auto">
                                <h2 className="text-sm font-semibold tracking-[0.2em] text-blue-600 mb-4 uppercase">Depoimentos</h2>
                                <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                                    O que dizem sobre a <br />
                                    <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-transparent bg-clip-text">Experiência Voltris</span>
                                </h3>
                            </div>

                            {/* Grid: 1 col → 2 cols (sm/640px) → 3 cols (lg/1024px) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
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
                                    <div key={i} className="group relative bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 lg:p-8 hover:border-blue-300 transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col">
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent group-hover:via-blue-200 transition-all"></div>

                                        {/* Quote Icon */}
                                        <div className="absolute top-5 right-6 text-gray-200 text-5xl font-serif leading-none select-none">&quot;</div>

                                        {/* Stars */}
                                        <div className="flex items-center gap-1 mb-5 text-yellow-400">
                                            {[...Array(5)].map((_, s) => (
                                                <svg key={s} className="w-4 h-4 fill-current shrink-0" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                            ))}
                                        </div>

                                        {/* Review text – ocupa o espaço restante para alinhar o footer */}
                                        <p className="text-gray-600 leading-relaxed mb-6 relative z-10 flex-1 text-sm sm:text-base">
                                            &ldquo;{review.text}&rdquo;
                                        </p>

                                        {/* Author */}
                                        <div className="flex items-center gap-3 mt-auto">
                                            {/* Avatar */}
                                            <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${review.color} flex items-center justify-center text-white font-bold text-base shadow-md relative shrink-0 border-2 border-white/20`}>
                                                {review.initial}
                                                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white">
                                                    <Check className="w-2.5 h-2.5 text-white" />
                                                </div>
                                            </div>
                                            {/* Info */}
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    <span className="font-semibold text-gray-900 text-sm leading-tight">{review.name}</span>
                                                    <span className="text-[10px] text-green-600 font-semibold border border-green-200 bg-green-50 rounded-full px-2 py-0.5 whitespace-nowrap">Compra Verificada</span>
                                                </div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mt-0.5">{review.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </AnimatedSection>

            </main>
            <Footer />
        </>
    );
}
