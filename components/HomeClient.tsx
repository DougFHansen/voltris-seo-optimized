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
} from 'react-icons/fi';
import { MonitorSmartphone, Laptop2, ShieldCheck, HardDrive, GaugeCircle, Database, Package, Printer } from "lucide-react";
import AnimatedSection from '@/components/AnimatedSection';
import { FaWhatsapp } from 'react-icons/fa';
import { ShieldCheckIcon, CloudArrowUpIcon, CogIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { loadFull } from 'tsparticles';

import { motion } from 'framer-motion';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const services = [
    {
        id: "criacao-site",
        title: "Criação de Site",
        description: "Desenvolvimento de sites profissionais e responsivos para sua empresa ou projeto pessoal.",
        iconType: "MonitorSmartphone",
        price: "A partir de R$ 997,90",
        buttonText: "Criar Meu Site",
        redirect: "/todos-os-servicos/criacao-de-sites"
    },
    {
        id: "suporte-windows",
        title: "Suporte ao Windows",
        description: "Suporte remoto completo para seu sistema Windows, incluindo instalação, atualização e otimização.",
        iconType: "Laptop2",
        price: "A partir de R$ 349,90",
        buttonText: "Ver Planos",
        redirect: "/todos-os-servicos/suporte-windows"
    },
    {
        id: "correcao_windows",
        title: "Correção de Erros no Windows",
        description: "Solução remota de problemas e erros no seu sistema Windows.",
        iconType: "ShieldCheck",
        price: "R$ 49,90",
        buttonText: "Contratar Serviço",
        redirect: "/servicos?service=correcao-windows"
    },
    {
        id: "formatacao",
        title: "Formatação",
        description: "Formatação remota completa do seu computador com instalação de programas essenciais.",
        iconType: "HardDrive",
        price: "A partir de R$ 99,90",
        buttonText: "Contratar Serviço",
        redirect: "/servicos?service=formatacao"
    },
    {
        id: "otimizacao",
        title: "Otimização de PC",
        description: "Otimização remota completa do seu computador para melhor desempenho.",
        iconType: "GaugeCircle",
        price: "A partir de R$ 79,90",
        buttonText: "Contratar Serviço",
        redirect: "/serviços?service=otimizacao"
    },
    {
        id: "recuperacao",
        title: "Recuperação De Dados",
        description: "Recuperação remota de dados e arquivos importantes do seu computador.",
        iconType: "Database",
        price: "R$ 99,90",
        buttonText: "Contratar Serviço",
        redirect: "/servicos?service=recuperacao"
    },
    {
        id: "instalacao-programas",
        title: "Instalação de Programas",
        description: "Instalação e configuração remota de programas essenciais para seu computador.",
        iconType: "Package",
        price: "A partir de R$ 29,90",
        buttonText: "Ver programas",
        redirect: "/todos-os-servicos/instalacao-de-programas"
    },
    {
        id: "instalacao_impressora",
        title: "Instalação de Impressora",
        description: "Instalação remota de drivers e configuração de impressoras no seu computador.",
        iconType: "Printer",
        price: "R$ 49,90",
        buttonText: "Contratar Serviço",
        redirect: "/servicos?service=impressora"
    },
    {
        id: "remocao_virus",
        title: "Remoção de Vírus",
        description: "Remoção remota de vírus e proteção do seu computador.",
        iconType: "FiShield",
        price: "R$ 39,90",
        buttonText: "Contratar Serviço",
        redirect: "/servicos?service=remocao-virus"
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

    const renderIcon = (iconType: string) => {
        const iconProps = {
            size: 56,
            className: "mx-auto drop-shadow-sm"
        };

        switch (iconType) {
            case "MonitorSmartphone":
                return <MonitorSmartphone {...iconProps} className={`${iconProps.className} text-[#31A8FF]`} />;
            case "Laptop2":
                return <Laptop2 {...iconProps} className={`${iconProps.className} text-[#8B31FF]`} />;
            case "ShieldCheck":
                return <ShieldCheck {...iconProps} className={`${iconProps.className} text-[#31A8FF]`} />;
            case "HardDrive":
                return <HardDrive {...iconProps} className={`${iconProps.className} text-[#FF4B6B]`} />;
            case "GaugeCircle":
                return <GaugeCircle {...iconProps} className={`${iconProps.className} text-[#8B31FF]`} />;
            case "Database":
                return <Database {...iconProps} className={`${iconProps.className} text-[#31A8FF]`} />;
            case "Package":
                return <Package {...iconProps} className={`${iconProps.className} text-[#8B31FF]`} />;
            case "Printer":
                return <Printer {...iconProps} className={`${iconProps.className} text-[#31A8FF]`} />;
            case "FiShield":
                return <FiShield {...iconProps} className={`${iconProps.className} text-[#8B31FF] group-hover:text-[#31A8FF] group-hover:scale-110 group-hover:drop-shadow-lg transition-all duration-300`} />;
            default:
                return <MonitorSmartphone {...iconProps} className={`${iconProps.className} text-[#31A8FF]`} />;
        }
    };

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
            <section
                className="
          relative
          w-full
          min-h-[100dvh]
          flex
          flex-col
          lg:flex-row
          items-center
          justify-center
          px-4
          sm:px-6
          md:px-12
          lg:px-16
          xl:px-24
          bg-[#1E1E22]
          overflow-hidden
        "
                aria-label="Banner principal de Suporte Técnico Remoto VOLTRIS"
                style={{ paddingTop: 'var(--header-height)' }}
            >
                <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 h-full py-8 lg:py-0">
                    <div className="flex flex-1 order-1 items-center justify-center relative w-full h-[280px] xs:h-[320px] sm:h-[400px] lg:h-[600px]">
                        <div className="flex flex-col gap-4 sm:gap-6 md:gap-10 items-center justify-center w-full z-10 scale-[0.6] xs:scale-[0.7] sm:scale-90 lg:scale-100 transition-transform duration-300">
                            <div className="flex flex-row gap-4 sm:gap-8 md:gap-10 w-full justify-center animate-horizontal-move-left">
                                <motion.div
                                    className="bg-gradient-to-br from-[#00A6FF] via-[#8B31FF] to-[#31A8FF] p-3 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl flex items-center justify-center"
                                    animate={{ rotate: [0, 10, -10, 0], y: [0, -10, 0, 10, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <ComputerDesktopIcon className="w-8 h-8 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white drop-shadow-[0_0_16px_#00A6FF99]" aria-label="Ícone computador 3D" />
                                </motion.div>
                                <motion.div
                                    className="bg-gradient-to-br from-[#8B31FF] via-[#31A8FF] to-[#00A6FF] p-3 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl flex items-center justify-center"
                                    animate={{ scale: [1, 1.12, 1, 0.95, 1], rotate: [0, 8, -8, 0] }}
                                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                                >
                                    <ShieldCheckIcon className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white drop-shadow-[0_0_12px_#8B31FF99]" aria-label="Ícone escudo de segurança 3D" />
                                </motion.div>
                            </div>
                            <div className="flex flex-row gap-4 sm:gap-8 md:gap-10 w-full justify-center animate-horizontal-move-right">
                                <motion.div
                                    className="bg-gradient-to-br from-[#31A8FF] via-[#00A6FF] to-[#8B31FF] p-3 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl flex items-center justify-center"
                                    animate={{ y: [0, 12, -12, 0], scale: [1, 1.08, 1, 0.92, 1] }}
                                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                                >
                                    <CloudArrowUpIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white drop-shadow-[0_0_10px_#31A8FF99]" aria-label="Ícone nuvem 3D" />
                                </motion.div>
                                <motion.div
                                    className="bg-gradient-to-br from-[#00A6FF] via-[#31A8FF] to-[#8B31FF] p-3 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl flex items-center justify-center"
                                    animate={{ rotate: [0, -12, 12, 0], y: [0, 8, 0, -8, 0] }}
                                    transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                                >
                                    <CogIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white drop-shadow-[0_0_10px_#31A8FF99]" aria-label="Ícone engrenagem 3D" />
                                </motion.div>
                            </div>
                        </div>
                        <div className="absolute -z-10 w-40 h-40 sm:w-56 sm:h-56 md:w-[380px] md:h-[380px] rounded-full bg-gradient-to-br from-[#00A6FF]/30 via-[#8B31FF]/20 to-[#31A8FF]/10 blur-2xl sm:blur-3xl opacity-60 sm:opacity-70 animate-pulse-slow" />
                    </div>

                    <div className="flex-1 flex flex-col order-2 items-center lg:items-start justify-center text-center lg:text-left gap-4 sm:gap-6 z-20">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-2 drop-shadow-lg font-sans max-w-2xl mx-auto lg:mx-0 break-words">
                            Suporte Técnico{' '}
                            <br className="hidden sm:block" />
                            Remoto Premium{' '}
                            <motion.span
                                className="block sm:inline-block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text drop-shadow-md sm:drop-shadow-lg select-none mt-2 sm:mt-0"
                                style={{ letterSpacing: '0.04em' }}
                                initial={{ y: 0 }}
                                animate={{ y: [0, -6, 0, 6, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                VOLTRIS
                            </motion.span>
                        </h1>
                        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-white/80 mb-2 font-sans max-w-xl mx-auto lg:mx-0">
                            Formatação Avançada • Otimização • Segurança
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-lg sm:max-w-xl md:max-w-2xl mx-auto lg:mx-0 mb-4 leading-relaxed px-4 sm:px-0">
                            Atendimento rápido, seguro e online. Especialistas em manutenção, proteção, performance e soluções digitais.
                        </p>

                        <div className="flex flex-wrap gap-4 w-full justify-center lg:justify-start px-2 sm:px-0">
                            <a
                                href="/todos-os-servicos"
                                className="flex-1 sm:flex-none min-w-[200px] px-6 py-3.5 rounded-full bg-gradient-to-r from-[#8B31FF] via-[#31A8FF] to-[#00A6FF] text-white font-bold text-base sm:text-lg shadow-lg transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_24px_#8B31FF99] text-center whitespace-nowrap"
                            >
                                Ver Planos e Preços
                            </a>
                            <a
                                href="https://wa.me/5511996716235?text=Ol%C3%A1!%20Gostaria%20de%20falar%20com%20um%20especialista%20da%20VOLTRIS"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 sm:flex-none min-w-[200px] px-6 py-3.5 rounded-full border-2 border-[#00A6FF] bg-white/5 flex items-center justify-center gap-2 group transition-all duration-300 hover:bg-white hover:border-[#8B31FF] whitespace-nowrap"
                            >
                                <i className="fab fa-whatsapp text-[#25D366] text-xl"></i>
                                <span className="font-extrabold bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text text-base sm:text-lg group-hover:bg-none group-hover:text-[#8B31FF] transition-colors duration-300">
                                    Falar no WhatsApp
                                </span>
                            </a>
                        </div>

                        <ul className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6 justify-center lg:justify-start w-full px-2">
                            <li className="flex items-center gap-1.5 text-white/90 text-xs sm:text-sm bg-white/5 px-3 py-1 rounded-full"><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8B31FF] shadow-[0_0_6px_#8B31FF]"></span>Suporte Online</li>
                            <li className="flex items-center gap-1.5 text-white/90 text-xs sm:text-sm bg-white/5 px-3 py-1 rounded-full"><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00A6FF] shadow-[0_0_6px_#00A6FF]"></span>Manutenção</li>
                            <li className="flex items-center gap-1.5 text-white/90 text-xs sm:text-sm bg-white/5 px-3 py-1 rounded-full"><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF00A0] shadow-[0_0_6px_#FF00A0]"></span>Otimização</li>
                        </ul>
                    </div>
                </div>
            </section>

            <AnimatedSection direction="up" delay={0.2}>
                <section className="py-6 xs:py-8 sm:py-12 px-2 xs:px-4 sm:px-6 md:px-8 flex flex-col items-center" id="about">
                    <div className="w-full flex justify-center mb-6 xs:mb-8 sm:mb-16">
                        <div className="text-center">
                            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] mb-3 xs:mb-4 sm:mb-6 relative inline-block">
                                SOBRE NÓS
                                <div className="absolute -bottom-1 xs:-bottom-2 sm:-bottom-4 left-1/2 transform -translate-x-1/2 w-12 xs:w-16 sm:w-24 h-1 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B]"></div>
                            </h2>
                            <p className="text-sm xs:text-base sm:text-lg md:text-xl text-[#e2e8f0] max-w-3xl mx-auto mt-3 xs:mt-4 sm:mt-8">
                                Conheça nossa história e compromisso com a excelência em suporte técnico
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center bg-gradient-to-br from-[#1c1c1e]/60 to-[#2a2a2e]/60 border border-[#FF4B6B]/10 gap-3 xs:gap-4 sm:gap-6 md:gap-8 p-3 xs:p-4 sm:p-6 md:p-8 rounded-lg max-w-7xl mx-auto w-full relative overflow-hidden">
                        <div className="absolute top-0 left-1/4 w-48 xs:w-72 h-48 xs:h-72 bg-[#FF4B6B] opacity-20 rounded-full filter blur-[100px] pointer-events-none z-0"></div>
                        <div className="absolute bottom-0 right-1/4 w-48 xs:w-72 h-48 xs:h-72 bg-[#8B31FF] opacity-20 rounded-full filter blur-[100px] pointer-events-none z-0"></div>
                        <div className="absolute bottom-0 left-1/3 w-48 xs:w-72 h-48 xs:h-72 bg-[#31A8FF] opacity-20 rounded-full filter blur-[100px] pointer-events-none z-0"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none z-0"></div>

                        <div className="relative z-10 w-full md:flex-1 flex justify-center perspective hidden md:flex order-2 md:order-1">
                            <div className="relative w-full max-w-[500px] group transition-transform duration-700 ease-out hover:rotate-y-8 preserve-3d">
                                <div className="relative overflow-hidden rounded-[10px] shadow-2xl w-full h-full">
                                    <Image
                                        src="/about-img.webp"
                                        alt="About Us"
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out"
                                        width={500}
                                        height={750}
                                        priority
                                        fetchPriority="high"
                                        sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 500px"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-in-out"></div>
                                        <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent transform translate-x-full group-hover:-translate-x-full transition-transform duration-1500 ease-in-out"></div>
                                    </div>
                                    <div className="absolute inset-0 rounded-[10px] shadow-[inset_0_0_30px_rgba(0,0,0,0.7)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                    <div className="absolute inset-0 p-4">
                                        <div className="absolute top-0 left-0 w-16 h-16">
                                            <div className="w-full h-full border-l-2 border-t-2 border-white/40 transform scale-0 group-hover:scale-100 transition-transform duration-500 origin-top-left"></div>
                                        </div>
                                        <div className="absolute top-0 right-0 w-16 h-16">
                                            <div className="w-full h-full border-r-2 border-t-2 border-white/40 transform scale-0 group-hover:scale-100 transition-transform duration-500 origin-top-right"></div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-16 h-16">
                                            <div className="w-full h-full border-l-2 border-b-2 border-white/40 transform scale-0 group-hover:scale-100 transition-transform duration-500 origin-bottom-left"></div>
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-16 h-16">
                                            <div className="w-full h-full border-r-2 border-b-2 border-white/40 transform scale-0 group-hover:scale-100 transition-transform duration-500 origin-bottom-right"></div>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[10px]"></div>
                                </div>
                                <div className="absolute -bottom-10 inset-x-0 h-20 bg-black/20 blur-xl rounded-full transform scale-90 translate-z-50 transition-all duration-700 group-hover:translate-z-70 opacity-50"></div>
                            </div>
                        </div>

                        <div className="relative z-10 w-full md:flex-1 p-4 sm:p-6 md:p-8 flex flex-col items-center md:items-start justify-center order-1 md:order-2">
                            <div className="w-full text-center mb-6 sm:mb-8">
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] mb-4 sm:mb-6 whitespace-nowrap">
                                    NOSSO DIFERENCIAL
                                </h3>
                            </div>

                            <div className="md:hidden w-full mb-6 sm:mb-8 flex items-center justify-center">
                                <div className="relative w-[90vw] max-w-[1000px] group transition-transform duration-700 ease-out hover:rotate-y-8 preserve-3d">
                                    <div className="relative overflow-hidden rounded-[10px] shadow-2xl w-full h-full">
                                        <Image
                                            src="/about-img.webp"
                                            alt="About Us"
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out"
                                            width={500}
                                            height={750}
                                            priority
                                            fetchPriority="high"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-in-out"></div>
                                            <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent transform translate-x-full group-hover:-translate-x-full transition-transform duration-1500 ease-in-out"></div>
                                        </div>
                                        <div className="absolute inset-0 rounded-[10px] shadow-[inset_0_0_30px_rgba(0,0,0,0.7)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                        <div className="absolute inset-0 p-4">
                                            <div className="absolute top-0 left-0 w-16 h-16">
                                                <div className="w-full h-full border-l-2 border-t-2 border-white/40 transform scale-0 group-hover:scale-100 transition-transform duration-500 origin-top-left"></div>
                                            </div>
                                            <div className="absolute top-0 right-0 w-16 h-16">
                                                <div className="w-full h-full border-r-2 border-t-2 border-white/40 transform scale-0 group-hover:scale-100 transition-transform duration-500 origin-top-right"></div>
                                            </div>
                                            <div className="absolute bottom-0 left-0 w-16 h-16">
                                                <div className="w-full h-full border-l-2 border-b-2 border-white/40 transform scale-0 group-hover:scale-100 transition-transform duration-500 origin-bottom-left"></div>
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-16 h-16">
                                                <div className="w-full h-full border-r-2 border-b-2 border-white/40 transform scale-0 group-hover:scale-100 transition-transform duration-500 origin-bottom-right"></div>
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[10px]"></div>
                                    </div>
                                    <div className="absolute -bottom-10 inset-x-0 h-20 bg-black/20 blur-xl rounded-full transform scale-90 translate-z-50 transition-all duration-700 group-hover:translate-z-70 opacity-50"></div>
                                </div>
                            </div>

                            <div className="hidden md:block">
                                <p className="text-sm xs:text-base sm:text-lg md:text-xl text-[#F8FAFC] py-2 sm:py-3 leading-[1.6]">
                                    Somos especialistas em suporte técnico remoto e técnico de informática online, oferecendo soluções rápidas e eficientes para todo o Brasil. Nossa equipe altamente qualificada está preparada para resolver problemas de formatação, otimização, manutenção de computador e correção de erros Windows sem que você precise sair de casa.
                                </p>
                                <p className="text-sm xs:text-base sm:text-lg md:text-xl text-[#F8FAFC] py-2 sm:py-3 leading-[1.6]">
                                    Com atendimento personalizado e tecnologia de ponta, garantimos a segurança dos seus dados e a qualidade do serviço. Seja para formatação completa, remoção de vírus, instalação de programas, suporte ao Windows, otimização de PC ou criação de sites profissionais, estamos prontos para atender suas necessidades com agilidade e profissionalismo.
                                </p>
                            </div>
                            <div className="md:hidden">
                                <p className="text-sm xs:text-base sm:text-lg text-[#F8FAFC] py-2 sm:py-3 leading-[1.6]">
                                    Somos especialistas em suporte técnico remoto e técnico de informática online, oferecendo soluções rápidas e eficientes para todo o Brasil.
                                </p>
                                {showMoreText && (
                                    <p className="text-sm xs:text-base sm:text-lg text-[#F8FAFC] py-2 sm:py-3 leading-[1.6]">
                                        Com atendimento personalizado e tecnologia de ponta, garantimos a segurança dos seus dados e a qualidade do serviço. Seja para formatação completa, remoção de vírus, instalação de programas, suporte ao Windows, otimização de PC ou criação de sites profissionais, estamos prontos para atender suas necessidades com agilidade e profissionalismo.
                                    </p>
                                )}
                                <div className="w-full flex justify-center mt-3 xs:mt-4">
                                    <button
                                        onClick={() => setShowMoreText(!showMoreText)}
                                        className="text-xs xs:text-sm sm:text-base text-[#31A8FF] hover:text-[#31A8FF]/80 transition-colors duration-300 min-h-[44px] px-2"
                                    >
                                        {showMoreText ? 'Mostrar Menos' : 'Leia Mais'}
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 xs:mt-6 sm:mt-8 w-full flex flex-col items-center gap-4 xs:gap-6 sm:gap-8">
                                <a href="/about" className="group relative inline-flex items-center justify-center px-4 xs:px-6 sm:px-8 py-2 sm:py-3 font-bold text-white transition-all duration-300 ease-in-out hidden md:inline-flex min-h-[44px]">
                                    <span className="absolute inset-0 w-full h-full bg-white rounded-lg"></span>
                                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] rounded-lg transition-transform duration-300 group-hover:scale-105"></span>
                                    <span className="relative flex items-center gap-1 xs:gap-2 text-xs xs:text-sm sm:text-base">
                                        SAIBA MAIS
                                        <svg className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                        </svg>
                                    </span>
                                </a>
                                <div className="flex items-center justify-center gap-2 xs:gap-4 sm:gap-8">
                                    <FiMonitor size={16} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-[#FF4B6B] hover:scale-110 transition-transform duration-300" />
                                    <FiSettings size={16} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-[#8B31FF] hover:scale-110 transition-transform duration-300" />
                                    <FiClock size={16} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-[#31A8FF] hover:scale-110 transition-transform duration-300" />
                                    <FiBarChart2 size={16} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-[#FF4B6B] hover:scale-110 transition-transform duration-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.2}>
                <section className="py-6 xs:py-8 sm:py-12 px-2 xs:px-4 sm:px-6 md:px-8 overflow-x-hidden bg-gradient-to-br from-[#1c1c1e]/40 to-[#2a2a2e]/40">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 md:gap-8">
                            <div className="text-center">
                                <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text mb-1 xs:mb-2">
                                    5000+
                                </div>
                                <div className="text-xs xs:text-sm sm:text-base text-[#e2e8f0]">
                                    Clientes Atendidos
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#8B31FF] via-[#31A8FF] to-[#FF4B6B] text-transparent bg-clip-text mb-1 xs:mb-2">
                                    7.9
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
                <section className="py-6 xs:py-8 sm:py-12 md:py-16 px-2 xs:px-4 sm:px-6 md:px-8 overflow-x-hidden" id="services">
                    <div className="max-w-6xl mx-auto">
                        <div className="w-full flex justify-center mb-6 xs:mb-8 sm:mb-16">
                            <div className="text-center">
                                <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] mb-3 xs:mb-4 sm:mb-6 relative inline-block">
                                    SERVIÇOS DE SUPORTE TÉCNICO REMOTO
                                    <div className="absolute -bottom-1 xs:-bottom-2 sm:-bottom-4 left-1/2 transform -translate-x-1/2 w-12 xs:w-16 sm:w-24 h-1 bg-gradient-to-r from-[#FF4B6B] to-[#31A8FF]"></div>
                                </h2>
                                <p className="text-sm xs:text-base sm:text-lg md:text-xl text-[#e2e8f0] max-w-3xl mx-auto mt-3 xs:mt-4 sm:mt-8">
                                    Conheça todos os serviços remotos que oferecemos: formatação, otimização, remoção de vírus, instalação de programas, suporte Windows e criação de sites profissionais.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                            {services.map((service) => {
                                let buttonHref = service.redirect;
                                if (service.buttonText === "Contratar Serviço") {
                                    buttonHref = `/servicos?abrir=${service.id}`;
                                }
                                return (
                                    <div
                                        key={service.id}
                                        className="group relative bg-gradient-to-br from-[#1c1c1e]/60 to-[#2a2a2e]/60 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl border border-[#FF4B6B]/10 flex flex-col justify-between h-full transition-all duration-500 hover:border-[#FF4B6B]/30 hover:shadow-[0_0_30px_rgba(139,49,255,0.1)] overflow-hidden"
                                    >
                                        <div className="relative z-10 flex flex-col items-center justify-center mb-4 sm:mb-6">
                                            <div className="mb-3 sm:mb-4">
                                                <span className="inline-block transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-lg">
                                                    {renderIcon(service.iconType)}
                                                </span>
                                            </div>
                                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center">{service.title}</h3>
                                            <div className="flex items-baseline justify-center mb-2">
                                                <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
                                                    {service.price}
                                                </span>
                                            </div>
                                            <p className="text-sm sm:text-base text-gray-400 text-center mb-4">{service.description}</p>
                                        </div>
                                        <Link
                                            href={buttonHref}
                                            className="inline-flex items-center px-4 sm:px-6 py-2 rounded-lg bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-semibold hover:shadow-[0_0_20px_rgba(139,49,255,0.3)] transition-all duration-300 ease-out hover:scale-105 w-full justify-center gap-2 mt-auto relative overflow-hidden"
                                        >
                                            <span className="relative z-10 flex items-center gap-2 text-sm sm:text-base">
                                                {service.buttonText}
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </span>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            <section id="optimizer" className="py-6 xs:py-8 sm:py-12 relative overflow-hidden bg-[#171313] px-2 xs:px-4 sm:px-6 md:px-8">
                <div className="absolute top-0 left-1/4 w-32 xs:w-48 sm:w-72 md:w-96 h-32 xs:h-48 sm:h-72 md:h-96 bg-[#FF4B6B] opacity-10 rounded-full filter blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-32 xs:w-48 sm:w-72 md:w-96 h-32 xs:h-48 sm:h-72 md:h-96 bg-[#8B31FF] opacity-10 rounded-full filter blur-[100px]" />

                <div className="container mx-auto px-2 xs:px-4 sm:px-6 md:px-8 relative">
                    <div className="text-center mb-6 xs:mb-8 sm:mb-16">
                        <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold mb-3 xs:mb-4 sm:mb-6 relative inline-block">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
                                VOLTRIS OPTIMIZER
                            </span>
                            <div className="absolute -bottom-1 xs:-bottom-2 sm:-bottom-4 left-1/2 transform -translate-x-1/2 w-12 xs:w-16 sm:w-24 h-1 bg-gradient-to-r from-[#FF4B6B] to-[#31A8FF]"></div>
                        </h2>
                        <p className="text-sm xs:text-base sm:text-lg md:text-xl text-[#e2e8f0] max-w-3xl mx-auto mt-3 xs:mt-4 sm:mt-8">
                            Revolucione sua experiência gaming com nossa tecnologia exclusiva de otimização
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-6 sm:gap-8 md:gap-12 items-center">
                        <div className="space-y-3 xs:space-y-4 sm:space-y-6 md:space-y-8">
                            <div className="bg-gradient-to-br from-[#1c1c1e]/60 to-[#2a2a2e]/60 p-3 xs:p-4 sm:p-6 rounded-xl border border-[#FF4B6B]/10 hover:border-[#8B31FF]/30 transition-all duration-300 relative overflow-hidden">
                                <div className="relative z-10 flex items-start gap-2 xs:gap-3 sm:gap-4">
                                    <div className="bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] rounded-lg p-1 xs:p-2 sm:p-3">
                                        <i className="fas fa-rocket text-white text-lg xs:text-xl sm:text-2xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-base xs:text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">Boost de Performance</h3>
                                        <p className="text-xs xs:text-sm sm:text-base text-[#e2e8f0]">Aumento significativo de FPS e redução de latência com otimizações exclusivas</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-[#1c1c1e]/60 to-[#2a2a2e]/60 p-3 xs:p-4 sm:p-6 rounded-xl border border-[#FF4B6B]/10 hover:border-[#8B31FF]/30 transition-all duration-300 relative overflow-hidden">
                                <div className="relative z-10 flex items-start gap-2 xs:gap-3 sm:gap-4">
                                    <div className="bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] rounded-lg p-1 xs:p-2 sm:p-3">
                                        <i className="fas fa-microchip text-white text-lg xs:text-xl sm:text-2xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-base xs:text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">Otimização Inteligente</h3>
                                        <p className="text-xs xs:text-sm sm:text-base text-[#e2e8f0]">Sistema adaptativo que ajusta configurações em tempo real para máxima performance</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-[#1c1c1e]/60 to-[#2a2a2e]/60 p-3 xs:p-4 sm:p-6 rounded-xl border border-[#FF4B6B]/10 hover:border-[#8B31FF]/30 transition-all duration-300 relative overflow-hidden">
                                <div className="relative z-10 flex items-start gap-2 xs:gap-3 sm:gap-4">
                                    <div className="bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] rounded-lg p-1 xs:p-2 sm:p-3">
                                        <i className="fas fa-shield-alt text-white text-lg xs:text-xl sm:text-2xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-base xs:text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">Estabilidade Garantida</h3>
                                        <p className="text-xs xs:text-sm sm:text-base text-[#e2e8f0]">Elimine travamentos, stutters e outros problemas que atrapalham sua gameplay</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-3 xs:p-4 sm:p-6 md:p-8 rounded-2xl border border-[#FF4B6B]/10">
                                <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-white mb-3 xs:mb-4 sm:mb-6">Recursos Exclusivos</h3>
                                <ul className="space-y-2 xs:space-y-3 sm:space-y-4">
                                    {[
                                        "Otimização automática de memória RAM",
                                        "Priorização inteligente de processos",
                                        "Redução de latência de rede",
                                        "Perfis otimizados por jogo",
                                        "Monitoramento em tempo real",
                                        "Atualizações automáticas"
                                    ].map((feature, index) => (
                                        <li key={index} className="flex items-center text-xs xs:text-sm sm:text-base text-[#e2e8f0]">
                                            <i className="fas fa-check text-[#FF4B6B] mr-1 xs:mr-2 sm:mr-3"></i>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-6 sm:mt-8">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm sm:text-base text-white font-medium">Ganho médio de FPS</span>
                                        <span className="text-sm sm:text-base text-[#FF4B6B] font-bold">+40%</span>
                                    </div>
                                    <div className="w-full bg-[#2a2a2e] rounded-full h-2">
                                        <div className="bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] h-2 rounded-full" style={{ width: '75%' }}></div>
                                    </div>
                                </div>

                                <Link
                                    href="/gamers"
                                    className="mt-4 xs:mt-6 sm:mt-8 w-full inline-flex items-center justify-center gap-1 xs:gap-2 px-3 xs:px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,49,255,0.5)] hover:scale-[1.02] text-xs xs:text-sm sm:text-base min-h-[44px]"
                                >
                                    Saiba Mais
                                    <i className="fas fa-arrow-right"></i>
                                </Link>
                            </div>

                            <div className="absolute -top-2 xs:-top-4 -right-2 xs:-right-4 w-16 xs:w-24 h-16 xs:h-24 bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] rounded-full opacity-20 blur-2xl"></div>
                            <div className="absolute -bottom-2 xs:-bottom-4 -left-2 xs:-left-4 w-20 xs:w-32 h-20 xs:h-32 bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] rounded-full opacity-20 blur-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            <AnimatedSection direction="up" delay={0.2}>
                <section className="py-6 xs:py-8 sm:py-12 px-2 xs:px-4 sm:px-6 md:px-8 overflow-x-hidden">
                    <div className="max-w-6xl mx-auto">
                        <div className="w-full flex justify-center mb-6 xs:mb-8 sm:mb-16">
                            <div className="text-center">
                                <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] mb-3 xs:mb-4 sm:mb-6 relative inline-block">
                                    O QUE NOSSOS CLIENTES DIZEM
                                    <div className="absolute -bottom-1 xs:-bottom-2 sm:-bottom-4 left-1/2 transform -translate-x-1/2 w-12 xs:w-16 sm:w-24 h-1 bg-gradient-to-r from-[#FF4B6B] to-[#31A8FF]"></div>
                                </h2>
                                <p className="text-sm xs:text-base sm:text-lg md:text-xl text-[#e2e8f0] max-w-3xl mx-auto mt-3 xs:mt-4 sm:mt-8">
                                    Depoimentos reais de clientes satisfeitos com nossos serviços de suporte técnico remoto
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 md:gap-8">
                            <div className="bg-gradient-to-br from-[#1c1c1e]/60 to-[#2a2a2e]/60 p-4 sm:p-6 rounded-xl border border-[#FF4B6B]/10">
                                <div className="flex items-center mb-3">
                                    <div className="text-[#FF4B6B] text-lg sm:text-xl">★★★★★</div>
                                </div>
                                <p className="text-sm sm:text-base text-[#e2e8f0] mb-3">
                                    "Excelente serviço de formatação remota! Meu computador estava muito lento e agora está funcionando perfeitamente. Recomendo muito!"
                                </p>
                                <div className="text-sm text-[#8B31FF] font-semibold">- Carlos Silva, São Paulo</div>
                            </div>
                            <div className="bg-gradient-to-br from-[#1c1c1e]/60 to-[#2a2a2e]/60 p-4 sm:p-6 rounded-xl border border-[#8B31FF]/10">
                                <div className="flex items-center mb-3">
                                    <div className="text-[#8B31FF] text-lg sm:text-xl">★★★★★</div>
                                </div>
                                <p className="text-sm sm:text-base text-[#e2e8f0] mb-3">
                                    "Remoção de vírus rápida e eficiente. O técnico foi muito profissional e resolveu o problema em poucos minutos."
                                </p>
                                <div className="text-sm text-[#31A8FF] font-semibold">- Ana Costa, Rio de Janeiro</div>
                            </div>
                            <div className="bg-gradient-to-br from-[#1c1c1e]/60 to-[#2a2a2e]/60 p-4 sm:p-6 rounded-xl border border-[#31A8FF]/10">
                                <div className="flex items-center mb-3">
                                    <div className="text-[#31A8FF] text-lg sm:text-xl">★★★★★</div>
                                </div>
                                <p className="text-sm sm:text-base text-[#e2e8f0] mb-3">
                                    "Site criado com excelente qualidade e design moderno. Superou todas as minhas expectativas!"
                                </p>
                                <div className="text-sm text-[#FF4B6B] font-semibold">- Pedro Santos, Belo Horizonte</div>
                            </div>
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            <Footer />
        </>
    );
}
