"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    RocketLaunchIcon,
    ChartBarIcon,
    CloudArrowUpIcon,
    BoltIcon,
    ClockIcon,
    ShieldCheckIcon,
    ComputerDesktopIcon,
    PrinterIcon,
    WrenchScrewdriverIcon,
    CpuChipIcon
} from '@heroicons/react/24/outline';
import TechFloatingElements from '@/components/TechFloatingElements';

const services = [
    {
        id: "formatacao",
        title: "Formatação de Computador",
        description: "Reinstalação limpa do Windows com backup e drivers.",
        icon: <BoltIcon className="w-8 h-8" />,
        price: "A partir de R$ 99,90",
        redirect: "/formatacao",
        buttonText: "Formatar PC"
    },
    {
        id: "otimizacao",
        title: "Otimização de PC",
        description: "Performance máxima sem necessidade de formatação.",
        icon: <ChartBarIcon className="w-8 h-8" />,
        price: "A partir de R$ 79,90",
        redirect: "/otimizacao-pc",
        buttonText: "Otimizar PC"
    },
    {
        id: "remocao-virus",
        title: "Remoção de Vírus",
        description: "Limpeza profunda e blindagem contra ameaças.",
        icon: <ShieldCheckIcon className="w-8 h-8" />,
        price: "R$ 39,90",
        redirect: "/servicos?abrir=remocao_virus",
        buttonText: "Remover Vírus"
    },
    {
        id: "instalacao-programas",
        title: "Instalação de Softwares",
        description: "Configuração de Office, Adobe, Jogos e mais.",
        icon: <RocketLaunchIcon className="w-8 h-8" />,
        price: "A partir de R$ 29,90",
        redirect: "/todos-os-servicos/instalacao-de-programas",
        buttonText: "Ver Softwares"
    },
    {
        id: "recuperacao",
        title: "Recuperação De Dados",
        description: "Resgate de arquivos perdidos ou deletados.",
        icon: <CloudArrowUpIcon className="w-8 h-8" />,
        price: "R$ 99,90",
        redirect: "/servicos?abrir=recuperacao",
        buttonText: "Recuperar Dados"
    },
    {
        id: "impressora",
        title: "Suporte Impressoras",
        description: "Instalação de drivers e configuração em rede.",
        icon: <PrinterIcon className="w-8 h-8" />,
        price: "R$ 49,90",
        redirect: "/servicos?abrir=instalacao_impressora",
        buttonText: "Instalar Agora"
    }
];

interface TecnicoClientProps {
    title?: string;
    description?: string;
    badge?: string;
}

export default function TecnicoInformaticaClient({
    title = "Técnico de Informática",
    description = "Suporte técnico remoto de elite. Resolvemos qualquer problema no seu Windows, sem que você precise sair de casa.",
    badge = "Atendimento Remoto 24/7"
}: TecnicoClientProps) {
    return (
        <>
            <Header />
            <main className="bg-[#050510] min-h-screen relative overflow-x-hidden font-sans selection:bg-[#31A8FF]/30">

                {/* Background Effects (Global) */}
                <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-0"></div>
                <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-[#31A8FF]/5 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow max-w-full pointer-events-none z-0"></div>
                <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-[#8B31FF]/5 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow max-w-full pointer-events-none z-0"></div>

                {/* Hero Section */}
                <section className="min-h-[100dvh] flex flex-col items-center justify-center relative z-10 w-full px-4">
                    <TechFloatingElements />

                    <div className="container mx-auto text-center flex-grow flex flex-col items-center justify-center w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-full max-w-5xl"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:border-[#31A8FF]/30 transition-all cursor-default">
                                <span className="flex h-2 w-2 rounded-full bg-[#00FF94] shadow-[0_0_8px_#00FF94] animate-pulse"></span>
                                <span className="text-xs sm:text-sm font-medium text-white tracking-wide">{badge}</span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
                                {title.split(' ').map((word, i) => (
                                    word.toLowerCase() === 'informática' || word.toLowerCase() === 'voltris' ? (
                                        <span key={i} className="bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text animate-gradient-x"> {word} </span>
                                    ) : <span key={i}> {word}</span>
                                ))}
                            </h1>

                            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                                {description}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
                                >
                                    <WrenchScrewdriverIcon className="w-5 h-5" /> Ver Serviços
                                </button>
                                <Link
                                    href="/contato"
                                    className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                >
                                    <ClockIcon className="w-5 h-5" /> Suporte Imediato
                                </Link>
                            </div>
                        </motion.div>
                    </div>


                </section>

                {/* Support Grid Section */}
                <section id="servicos" className="py-24 px-4 bg-[#0A0A0F]/50 relative z-10 w-full border-t border-white/5">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Soluções Especializadas</h2>
                            <p className="text-slate-400">Atendimento 100% online com técnicos certificados.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ y: -8 }}
                                    className="bg-[#121218] p-8 rounded-[32px] border border-white/5 hover:border-[#31A8FF]/30 transition-all group relative overflow-hidden flex flex-col"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#31A8FF]/5 rounded-full blur-[60px] -mr-16 -mt-16 group-hover:bg-[#31A8FF]/10 transition-colors"></div>

                                    <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300 w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white">
                                        {service.icon}
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-6">{service.description}</p>

                                    <div className="mt-auto pt-4 flex flex-col gap-4">
                                        <div className="text-[#31A8FF] font-bold text-lg">{service.price}</div>
                                        <Link
                                            href={service.redirect}
                                            className="w-full py-4 rounded-xl text-center font-bold bg-white/5 text-white border border-white/10 hover:bg-white hover:text-black hover:border-white transition-all"
                                        >
                                            {service.buttonText}
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features / Why Remote? Section */}
                <section className="py-24 px-4 relative z-10 w-full overflow-hidden">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">Por que escolher o suporte <span className="text-[#31A8FF]">remoto</span>?</h2>
                            <div className="space-y-6">
                                {[
                                    { title: "Segurança Total", desc: "Você acompanha todo o conserto na sua frente em tempo real." },
                                    { title: "Rapidez Imediata", desc: "Sem espera de técnicos se deslocando ou filas em lojas." },
                                    { title: "Custo Menor", desc: "Preços reduzidos pois não há custos de combustível e logística." },
                                    { title: "Garantia VOLTRIS", desc: "Suporte pós-atendimento incluso em todos os pacotes." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00FF94] flex items-center justify-center mt-1">
                                            <ShieldCheckIcon className="w-4 h-4 text-[#050510]" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold mb-1">{item.title}</h4>
                                            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-br from-[#31A8FF]/20 to-[#8B31FF]/20 rounded-[40px] blur-2xl animate-pulse"></div>
                            <div className="relative bg-[#121218] rounded-[40px] border border-white/10 p-10 shadow-2xl overflow-hidden group">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-[#31A8FF]/20 flex items-center justify-center text-[#31A8FF]">
                                        <CpuChipIcon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Diagnóstico em Tempo Real</h3>
                                </div>
                                <div className="space-y-4 font-mono text-sm text-slate-500">
                                    <div className="flex items-center gap-2"><span className="text-[#00FF94]">&gt;</span> <span>Initializing secure connection...</span></div>
                                    <div className="flex items-center gap-2"><span className="text-[#00FF94]">&gt;</span> <span>Scanning system registers...</span></div>
                                    <div className="flex items-center gap-2"><span className="text-[#31A8FF]">&gt;</span> <span>Drivers: 12 outdated items found.</span></div>
                                    <div className="flex items-center gap-2"><span className="text-[#FF4B6B]">&gt;</span> <span>Error 0x800 identified. Patching...</span></div>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '100%' }}
                                        transition={{ duration: 3 }}
                                        className="h-[2px] bg-[#31A8FF] rounded-full mt-4"
                                    ></motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Common Problems Section - SEO Semantic Block */}
                <section className="py-24 px-4 bg-[#0A0A0F] relative z-10 border-t border-white/5">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Expertise Técnica Comprovada</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">Nossos especialistas lidam diariamente com os casos mais complexos de infraestrutura e software.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    title: "Lentidão Extrema",
                                    desc: "Seu PC demora para ligar ou trava ao abrir programas básicos? Otimizamos o kernel do Windows para performance máxima."
                                },
                                {
                                    title: "Tela Azul (BSOD)",
                                    desc: "Erros críticos de sistema (PAGE_FAULT, IRQL_NOT_LESS) diagnosticados via análise de dump de memória."
                                },
                                {
                                    title: "Vírus e Spyware",
                                    desc: "Remoção cirúrgica de malwares que roubam dados ou mineram criptomoedas em segundo plano."
                                },
                                {
                                    title: "Rede e Wi-Fi",
                                    desc: "Problemas de conexão, ping alto em jogos ou roteadores desconfigurados resolvidos remotamente."
                                }
                            ].map((prob, i) => (
                                <div key={i} className="bg-[#121218] p-8 rounded-2xl border border-white/5 hover:border-[#31A8FF]/20 transition-all">
                                    <div className="w-2 h-2 rounded-full bg-[#31A8FF] mb-4"></div>
                                    <h3 className="text-xl font-bold text-white mb-3">{prob.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {prob.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-4 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto relative px-6 py-20 rounded-[48px] border border-white/5 bg-gradient-to-b from-[#121218] to-[#0A0A0F]">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Resolva seu Problema Agora</h2>
                        <p className="text-slate-400 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">Não deixe para depois. Pequenos problemas podem se tornar falhas críticas. Fale com um técnico certificado agora mesmo.</p>
                        <Link
                            href="/contato"
                            className="px-12 py-6 rounded-2xl bg-white text-black font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.15)] inline-block"
                        >
                            Falar com Técnico
                        </Link>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
