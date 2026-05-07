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
const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"), {
    ssr: false
});

const AboutSection = dynamic(() => import("./sections/AboutSection"), { ssr: false });
const ServicesSection = dynamic(() => import("./sections/ServicesSection"), { ssr: false });
const TestimonialsSection = dynamic(() => import("./sections/TestimonialsSection"), { ssr: false });
const FAQSection = dynamic(() => import("./sections/FAQSection"), { ssr: false });
const ContactSection = dynamic(() => import("./sections/ContactSection"), { ssr: false });

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
    const [isMobile, setIsMobile] = useState(false);
    const [showParticles, setShowParticles] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowParticles(true), 3500); 
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const checkMobile = () => {
            if (typeof window !== 'undefined') {
                setIsMobile(window.innerWidth < 768);
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile, { passive: true });
        return () => window.removeEventListener('resize', checkMobile);
    }, []);



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
                    pt-24
                    pb-8
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
                        {showParticles && <ParticleBackground />}
                    </div>

                    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-center justify-between gap-4 sm:gap-6 lg:gap-12 h-full relative z-[10]">

                        {/* Layout Wrapper: Uses 'contents' on mobile to allow reordering of its children via flexbox order */}
                        <div className="contents lg:flex lg:flex-col lg:flex-1 lg:items-start lg:gap-10 z-20">

                            {/* Text Content Block */}
                            <div className="flex flex-col items-center lg:items-start gap-3 lg:gap-6 w-full order-1">
                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-2">
                                    <span className="flex h-2 w-2 rounded-full bg-[#00FF88] shadow-[0_0_12px_rgba(0,255,136,0.8)] animate-pulse"></span>
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-white/70">Voltris Engine v4.0 • IA Inteligente Ativa</span>
                                </div>

                                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-7xl font-black text-white leading-[1.1] tracking-tight font-sans lg:mt-4">
                                    <span className="text-gradient-premium">Otimização de Windows com IA</span> <br className="hidden lg:block" />
                                    <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(139,49,255,0.3)]">Máximo Desempenho</span>
                                </h1>

                                <p className="text-sm sm:text-base lg:text-lg text-slate-400 max-w-xl leading-relaxed font-medium px-2 sm:px-0">
                                    Aumente FPS, reduza travamentos e extraia o máximo desempenho do seu computador com <strong className="text-white">otimização avançada</strong> e ajustes a nível de sistema.
                                </p>
                            </div>

                            {/* Buttons Block - Positioned below mockup on mobile via order-3 */}
                            <div className="flex flex-col sm:flex-row gap-4 lg:gap-5 w-full sm:w-auto z-30 order-3">
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
                            </div>
                        </div>

                        {/* Right Content - Mockup Block - order-2 on mobile */}
                        <div className="order-2 lg:order-none flex-1 w-full max-w-[320px] xs:max-w-[400px] sm:max-w-[500px] lg:max-w-full relative flex items-center justify-center perspective animate-float mt-2 lg:mt-0">
                            {/* Background Glow behind the card */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#31A8FF]/30 to-[#FF4B6B]/30 blur-[120px] rounded-full transform scale-75 animate-pulse"></div>

                            {/* Main Glass Panel */}
                            <div className="relative z-10 w-full transform -rotate-2 hover:rotate-0 transition-transform duration-700">
                                <OptimizerMockup />
                            </div>
                        </div>
                    </div>
                </section>
                <AboutSection />

                <ServicesSection />

                <section id="optimizer" className="relative py-20 lg:py-32 bg-white overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/50 to-purple-100/50 blur-[150px] rounded-full pointer-events-none animate-pulse-slow"></div>
                    <div className="absolute bottom-1/4 -left-20 w-[600px] h-[600px] bg-gradient-to-br from-purple-100/50 to-blue-100/50 blur-[150px] rounded-full pointer-events-none animate-pulse-slow"></div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                        {/* Header */}
                        <div className="text-center mb-16 max-w-4xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 backdrop-blur-md mb-4">
                                <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                                <span className="text-xs font-bold text-blue-700 tracking-widest uppercase">Primeiro Software Brasileiro com Controle Remoto</span>
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

                <TestimonialsSection />

            </main>
            <Footer />
        </>
    );
}
