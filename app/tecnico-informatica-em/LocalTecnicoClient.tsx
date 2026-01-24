"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    RocketLaunchIcon,
    ChartBarIcon,
    BoltIcon,
    ShieldCheckIcon,
    ComputerDesktopIcon,
    CpuChipIcon,
    MapPinIcon,
    CheckBadgeIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { Gamepad2, Wrench, Shield, Zap } from 'lucide-react';
import TechFloatingElements from '@/components/TechFloatingElements';

interface LocalTecnicoClientProps {
    locationName: string;
    stateAbbr: string;
    regionalContext: {
        neighborhoods: string[];
        cities?: string[];
        localFact?: string;
    };
}

export default function LocalTecnicoClient({ locationName, stateAbbr, regionalContext }: LocalTecnicoClientProps) {
    return (
        <>
            <Header />
            <main className="bg-[#020205] min-h-screen relative overflow-x-hidden font-sans selection:bg-[#31A8FF]/30">

                {/* Background Effects (Premium Dark) */}
                <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-0"></div>
                <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-[#31A8FF]/5 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow max-w-full pointer-events-none z-0"></div>
                <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-[#FF4B6B]/5 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow max-w-full pointer-events-none z-0"></div>

                {/* Hero Section */}
                <section className="min-h-[90dvh] flex flex-col items-center justify-center relative z-10 w-full px-4">
                    <TechFloatingElements />

                    <div className="container mx-auto text-center flex-grow flex flex-col items-center justify-center w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="w-full max-w-5xl"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                                <MapPinIcon className="w-4 h-4 text-[#31A8FF]" />
                                <span className="text-xs sm:text-sm font-bold text-white tracking-widest uppercase">Atendimento Premium em {locationName} - {stateAbbr}</span>
                            </div>

                            <h1 className="text-5xl sm:text-7xl font-black text-white mb-8 leading-[1.05] tracking-tighter">
                                Técnico de <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text italic">Informática em {locationName}</span>
                            </h1>

                            <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                                Manutenção de computadores, otimização de PC Gamer e suporte técnico remoto de elite. O melhor serviço de tecnologia de <strong>{locationName}</strong> disponível 24h por dia.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/servicos"
                                    className="px-10 py-5 rounded-2xl bg-white text-black font-black text-xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3 uppercase italic"
                                >
                                    <BoltIcon className="w-6 h-6" /> Resolver Agora
                                </Link>
                                <a
                                    href={`https://wa.me/5511996716235?text=Olá! Estou em ${locationName} e preciso de um técnico de informática.`}
                                    target="_blank"
                                    className="px-10 py-5 rounded-2xl bg-[#00FF94] text-black font-black text-xl hover:bg-[#00E685] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,255,148,0.3)] uppercase italic"
                                >
                                    <ChatBubbleLeftRightIcon className="w-6 h-6" /> WhatsApp Direto
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Local Relevance Section */}
                <section className="py-24 px-4 bg-[#0A0A0F]/80 backdrop-blur-xl border-y border-white/5 relative z-10">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                                O Suporte que <span className="text-[#31A8FF]">{locationName}</span> Confia
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Atendemos todas as regiões de <strong>{locationName}</strong>, incluindo {regionalContext.neighborhoods.slice(0, 4).join(', ')} e arredores.
                                Entendemos a urgência de quem trabalha ou joga na {stateAbbr === 'SP' ? 'maior metrópole do país' : 'sua região'}.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[
                                    { title: "Segurança de Dados", desc: "Protocolos rígidos de privacidade local." },
                                    { title: "Foco em Performance", desc: "PCs até 40% mais rápidos garantidos." },
                                    { title: "Sem Deslocamento", desc: "Suporte remoto imediato e seguro." },
                                    { title: "Nota 4.9/5 em " + stateAbbr, desc: "A maior aprovação técnica da região." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-[#31A8FF]/30 transition-all">
                                        <CheckBadgeIcon className="w-6 h-6 text-[#00FF94] shrink-0" />
                                        <div>
                                            <h4 className="text-white font-bold text-sm uppercase italic tracking-tighter mb-1">{item.title}</h4>
                                            <p className="text-slate-500 text-xs font-sans">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#31A8FF]/20 to-[#FF4B6B]/20 blur-[100px] opacity-30 animate-pulse"></div>
                            <div className="relative p-10 rounded-[40px] border border-white/10 bg-[#0D0D15]/80 backdrop-blur-2xl">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-6 flex items-center gap-3">
                                    <CpuChipIcon className="w-8 h-8 text-[#FF4B6B]" />
                                    Diagnóstico em {locationName}
                                </h3>
                                <div className="space-y-4 mb-4 font-mono text-sm text-slate-400">
                                    <div className="flex items-center gap-2"><span className="text-[#31A8FF]">&gt;</span> <span>Scanning local nodes...</span></div>
                                    <div className="flex items-center gap-2"><span className="text-[#31A8FF]">&gt;</span> <span>Region: {locationName} verified.</span></div>
                                    <div className="flex items-center gap-2"><span className="text-[#FF4B6B]">&gt;</span> <span>High Latency detected in sector.</span></div>
                                    <div className="flex items-center gap-2"><span className="text-[#00FF94]">&gt;</span> <span>Optimization protocol READY.</span></div>
                                </div>
                                <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '100%' }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="h-full bg-gradient-to-r from-[#31A8FF] to-[#FF4B6B]"
                                    ></motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Showcase */}
                <section className="py-24 px-4 relative z-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-4">Soluções Técnicas Especializadas</h2>
                            <p className="text-slate-400">Desenvolvido por quem entende de performance absoluta no Windows.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Manutenção & Reparo",
                                    icon: <Wrench className="w-8 h-8" />,
                                    desc: "Correção de erros do sistema, problemas de hardware e crashes inesperados em " + locationName + ".",
                                    color: "#31A8FF"
                                },
                                {
                                    title: "Otimização Gamer",
                                    icon: <Gamepad2 className="w-8 h-8" />,
                                    desc: "Aumente seu FPS e reduza o lag. Solução completa para entusiastas e pro-players locais.",
                                    color: "#FF4B6B"
                                },
                                {
                                    title: "Segurança & Redes",
                                    icon: <Shield className="w-8 h-8" />,
                                    desc: "Proteção avançada contra malwares e configuração de rede Wi-Fi/Fibra de alta velocidade.",
                                    color: "#8B31FF"
                                }
                            ].map((svc, i) => (
                                <div key={i} className="group relative p-8 rounded-[32px] bg-[#0A0A12] border border-white/5 hover:border-white/20 transition-all flex flex-col h-full overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-10 rounded-full blur-[60px]" style={{ backgroundColor: svc.color }}></div>
                                    <div className="mb-6 p-4 rounded-2xl bg-white/5 text-white inline-block w-fit" style={{ color: svc.color }}>
                                        {svc.icon}
                                    </div>
                                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-3">{svc.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed font-sans flex-grow">{svc.desc}</p>
                                    <Link href="/servicos" className="mt-8 py-3 rounded-xl border border-white/10 text-white font-bold text-center hover:bg-white hover:text-black transition-all">Ver Detalhes</Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* State/Regional List */}
                <section className="py-24 px-4 bg-[#05050A] border-t border-white/5 relative z-10">
                    <div className="max-w-5xl mx-auto">
                        <div className="p-12 rounded-[40px] bg-[#0E0E15] border border-white/5">
                            <h3 className="text-2xl font-black text-white uppercase italic mb-8 text-center">Bairros e Regiões de Atendimento - {locationName}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {regionalContext.neighborhoods.map((nh, i) => (
                                    <div key={i} className="text-slate-500 text-sm py-2 border-b border-white/5 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#31A8FF]/50"></span>
                                        {nh}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24 px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto py-20 px-10 rounded-[48px] bg-gradient-to-br from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] relative overflow-hidden shadow-[0_0_100px_rgba(49,168,255,0.2)]"
                    >
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-3xl"></div>
                        <div className="relative z-20">
                            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-8 leading-tight">
                                Seu PC Novo <br /> de Novo em {locationName}
                            </h2>
                            <p className="text-white/80 text-lg mb-12 max-w-2xl mx-auto font-medium">
                                Pare de sofrer com lentidão e erros. Fale com um técnico de informática especializado agora mesmo. Atendimento online seguro para todo o estado.
                            </p>
                            <Link
                                href="/contato"
                                className="inline-flex px-12 py-6 rounded-2xl bg-white text-black font-black text-2xl hover:scale-105 transition-transform uppercase italic shadow-2xl"
                            >
                                Solicitar Orçamento
                            </Link>
                        </div>
                    </motion.div>
                </section>

            </main>
            <Footer />
        </>
    );
}
