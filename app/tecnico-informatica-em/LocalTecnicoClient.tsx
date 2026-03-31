"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    RocketLaunchIcon,
    BoltIcon,
    MapPinIcon,
    CheckBadgeIcon,
    ChatBubbleLeftRightIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import { Gamepad2, Wrench, Shield, Cpu } from 'lucide-react';
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
    const idx = (locationName.length + (stateAbbr ? stateAbbr.length : 0)) % 3;

    const heroTitles = [
        <h1 key="0" className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter leading-[1.1] px-2">
            Técnico de <span className="inline-block py-1 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text italic">Informática em {locationName}</span>
        </h1>,
        <h1 key="1" className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter leading-[1.1] px-2">
            Suporte de <span className="inline-block py-1 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text italic">TI Remoto em {locationName}</span>
        </h1>,
        <h1 key="2" className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter leading-[1.1] px-2">
            Assistência <span className="inline-block py-1 bg-gradient-to-r from-[#8B31FF] via-[#31A8FF] to-[#FF4B6B] text-transparent bg-clip-text italic">Premium em {locationName}</span>
        </h1>
    ];

    const heroDescriptions = [
        <p key="0" className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
            Manutenção de computadores, otimização de PC Gamer e suporte técnico remoto de elite. O melhor serviço de tecnologia de <strong>{locationName}</strong> disponível 24h por dia.
        </p>,
        <p key="1" className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
            A mais alta performance para o seu computador em <strong>{locationName}</strong>. Atendimento remoto e expresso para formatação, remoção de vírus e ganho de FPS.
        </p>,
        <p key="2" className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
            Especialistas em diagnóstico de hardware e software operando diretamente em <strong>{locationName}</strong> através da nossa infraestrutura remota 100% segura.
        </p>
    ];

    const localH2 = [
        <h2 key="0" className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            O Suporte que <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] to-[#8B31FF]">{locationName}</span> Confia
        </h2>,
        <h2 key="1" className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Atendimento Exclusivo para <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B31FF] to-[#FF4B6B]">{locationName}</span>
        </h2>,
        <h2 key="2" className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Tecnologia de Ponta em <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF94] to-[#31A8FF]">{locationName}</span>
        </h2>
    ];

    return (
        <>
            <Header />
            <main className="bg-[#050510] min-h-screen relative overflow-x-hidden font-sans selection:bg-[#31A8FF]/30">

                {/* Background Effects (Matching FAQ/Dúvidas) */}
                <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-50"></div>
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#31A8FF]/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none z-0"></div>
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#8B31FF]/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none z-0"></div>

                {/* Hero Section - Full Screen (100dvh) */}
                <section className="min-h-[100dvh] flex flex-col items-center justify-center relative z-10">
                    <TechFloatingElements />

                    <div className="container mx-auto px-4 text-center flex-grow flex flex-col items-center justify-center">
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

                            {heroTitles[idx]}
                            {heroDescriptions[idx]}

                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Link
                                    href="/servicos"
                                    className="px-10 py-5 rounded-2xl bg-white text-black font-extrabold text-xl hover:bg-slate-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3"
                                >
                                    <BoltIcon className="w-6 h-6" /> Resolver Agora
                                </Link>
                                <a
                                    href={`https://wa.me/5511996716235?text=Olá! Estou em ${locationName} e preciso de um técnico de informática.`}
                                    target="_blank"
                                    className="px-10 py-5 rounded-2xl bg-[#00FF94] text-black font-extrabold text-xl hover:bg-[#00E685] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,255,148,0.3)]"
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
                            {localH2[idx]}
                            <p className="text-slate-400 text-lg leading-relaxed font-light">
                                Atendemos todas as regiões de <strong>{locationName}</strong>, incluindo {regionalContext.neighborhoods.slice(0, 4).join(', ')} e arredores.
                                Entendemos a urgência de quem trabalha ou joga na {stateAbbr === 'SP' ? 'maior metrópole do país' : 'sua região'}.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[
                                    { title: "Segurança de Dados", desc: "Protocolos rígidos de privacidade local." },
                                    { title: "Foco em Performance", desc: "PCs até 40% mais rápidos garantidos." },
                                    { title: "Sem Deslocamento", desc: "Suporte remoto imediato e seguro." },
                                    { title: "Aprovação Máxima", desc: "A maior nota técnica da região em " + stateAbbr + "." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#31A8FF]/30 transition-all">
                                        <CheckBadgeIcon className="w-6 h-6 text-[#00FF94] shrink-0" />
                                        <div>
                                            <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                                            <p className="text-slate-500 text-xs">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#31A8FF]/20 to-[#FF4B6B]/20 blur-[100px] opacity-30 animate-pulse"></div>
                            <div className="relative p-10 rounded-[40px] border border-white/10 bg-[#0D0D15]/80 backdrop-blur-2xl overflow-hidden group">
                                {/* Static Simulation UI */}
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="text-xs text-slate-500 font-mono ml-2">diagnosing_{locationName.toLowerCase()}.sh</span>
                                </div>
                                <div className="space-y-4 font-mono text-sm text-slate-400">
                                    <div className="flex items-center gap-2 transition-colors duration-300 group-hover:text-white"><span className="text-[#31A8FF]">&gt;</span> <span>Scanning local nodes in {locationName}...</span></div>
                                    <div className="flex items-center gap-2 transition-colors duration-300 group-hover:text-white"><span className="text-[#31A8FF]">&gt;</span> <span>State: {stateAbbr} verified via Cloudflare.</span></div>
                                    <div className="flex items-center gap-2 text-red-400"><span className="text-red-400">!</span> <span>System Latency: CRITICAL</span></div>
                                    <div className="flex items-center gap-2 text-green-400"><span className="text-green-400">&gt;</span> <span>VOLTRIS Protocol: READY</span></div>
                                </div>
                                <div className="mt-8 h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '100%' }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="h-full bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B]"
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
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Serviços Disponíveis em {locationName}</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto font-light">Especialistas certificados atendendo todas as necessidades tecnológicas da sua região.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Manutenção & Reparo",
                                    icon: <Wrench className="w-8 h-8" />,
                                    desc: "Resolução de erros críticos do Windows, travamentos e problemas de software em " + locationName + ".",
                                    color: "from-blue-500 to-cyan-500"
                                },
                                {
                                    title: "Otimização Gamer",
                                    icon: <Gamepad2 className="w-8 h-8" />,
                                    desc: "Engenharia de performance para extrair cada FPS extra do seu PC, reduzindo o input lag em jogos competitivos.",
                                    color: "from-purple-500 to-pink-500"
                                },
                                {
                                    title: "Redes & Wi-Fi",
                                    icon: <Cpu className="w-8 h-8" />,
                                    desc: "Configuração profissional de roteadores e análise de sinal para garantir velocidade máxima.",
                                    color: "from-orange-500 to-red-500"
                                }
                            ].map((svc, i) => (
                                <div key={i} className="group relative p-8 rounded-[32px] bg-[#121218] border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col h-full overflow-hidden">
                                    <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${svc.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`}></div>
                                    <div className="mb-6 p-4 rounded-2xl bg-white/5 text-white inline-block w-fit group-hover:bg-white group-hover:text-black transition-all">
                                        {svc.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4 transition-colors group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400">{svc.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed font-light flex-grow">{svc.desc}</p>
                                    <Link href="/servicos" className="mt-8 py-3 rounded-xl border border-white/10 text-white font-bold text-center hover:bg-white hover:text-black transition-all">Saber Mais</Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Localized Footer Branding */}
                <section className="py-24 px-4 bg-[#05050A] border-t border-white/5 relative z-10">
                    <div className="max-w-5xl mx-auto">
                        <div className="p-12 rounded-[48px] bg-gradient-to-b from-[#121218] to-[#0A0A0F] border border-white/5 text-center">
                            <h3 className="text-2xl font-bold text-white mb-8">Bairros Atendidos em {locationName}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {regionalContext.neighborhoods.map((nh, i) => (
                                    <div key={i} className="text-slate-400 text-sm py-2 px-3 rounded-lg bg-white/[0.02] border border-white/5">
                                        {nh}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-12 pt-8 border-t border-white/5">
                                <Link href="/contato" className="text-[#31A8FF] font-bold hover:underline">Solicitar atendimento em outra região →</Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA (Bento Style) */}
                <section className="py-24 px-4 relative z-10">
                    <div className="container mx-auto max-w-6xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative rounded-[4rem] overflow-hidden p-8 md:p-20 text-center bg-gradient-to-r from-[#1a1a2e] to-[#0F111A] border border-white/10 group"
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-r from-[#31A8FF]/10 via-[#8B31FF]/10 to-[#FF4B6B]/10 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                            <div className="relative z-10">
                                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
                                    Atendimento Imediato <br className="hidden md:block" />
                                    <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">Sem Sair de Casa</span>
                                </h2>
                                <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                                    Não perca tempo levando seu PC para conserto. Resolvemos tudo via acesso remoto seguro. O melhor suporte técnico em <strong>{locationName}</strong> está a um clique.
                                </p>
                                <Link
                                    href="/contato"
                                    className="bg-white text-black px-12 py-5 rounded-2xl font-bold text-xl hover:bg-slate-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] inline-block"
                                >
                                    Agendar Atendimento
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
