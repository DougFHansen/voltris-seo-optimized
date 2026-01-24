"use client";

import React, { useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Cpu, Layers, Zap, Search, Activity, Lock,
    CheckCircle2, ArrowRight, Brain, Server, Video,
    MousePointer2, Briefcase, Download, ShieldCheck, Laptop
} from 'lucide-react';

const StepCard = ({ number, title, desc, icon, delay }: { number: string, title: string, desc: string, icon: any, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay, duration: 0.8 }}
        className="relative group"
    >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#31A8FF]/5 to-[#8B31FF]/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative p-8 rounded-3xl bg-[#0F111A] border border-white/5 hover:border-[#31A8FF]/30 transition-all duration-300 h-full flex flex-col">
            <div className="text-6xl font-black text-white/5 absolute top-4 right-6 select-none">{number}</div>
            <div className="w-14 h-14 rounded-2xl bg-[#0A0A0F] border border-white/10 flex items-center justify-center text-[#31A8FF] mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed flex-grow">{desc}</p>
        </div>
    </motion.div>
);

const UserSegment = ({ title, icon, color, features, desc }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        className={`p-8 rounded-3xl bg-[#0A0A0F] border border-white/5 hover:border-${color} transition-all duration-300 relative overflow-hidden`}
    >
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${color} opacity-[0.05] blur-[50px] rounded-full`}></div>
        <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className={`p-3 rounded-xl bg-white/5 text-${color}`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed relative z-10">{desc}</p>
        <ul className="space-y-3 relative z-10">
            {features.map((feat: string, i: number) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle2 className={`w-4 h-4 text-${color}`} />
                    {feat}
                </li>
            ))}
        </ul>
    </motion.div>
);

export default function HowItWorksClient() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: sectionRef });

    // Scale effect for diagrams
    const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

    return (
        <>
            <Header />
            <main className="bg-[#050510] min-h-screen relative font-sans selection:bg-[#31A8FF]/30 overflow-hidden">

                {/* Global Noise & Ambient */}
                <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-50"></div>
                <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-[#31A8FF]/5 blur-[150px] rounded-full pointer-events-none"></div>

                {/* --- HEADER FULLSCREEN --- */}
                <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 pt-32 pb-20 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 z-0 opacity-30"
                    >
                        {/* Abstract Circuit Lines */}
                        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                    </motion.div>

                    <div className="relative z-10 max-w-5xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
                        >
                            <Layers className="w-4 h-4 text-[#8B31FF]" />
                            <span className="text-xs font-bold text-white/80 tracking-widest uppercase">Arquitetura de Software</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]"
                        >
                            A Ciência por trás da <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B]">
                                Performance Extrema
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed mb-12"
                        >
                            O Voltris Optimizer não faz "mágica". Ele aplica engenharia de kernel, gerenciamento de threads e otimizações de I/O que o Windows não faz por padrão.
                        </motion.p>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    >
                        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Discover Logic</span>
                        <div className="w-[1px] h-16 bg-gradient-to-b from-slate-500 to-transparent"></div>
                    </motion.div>
                </section>

                {/* --- 3-STEP PROCESS --- */}
                <section className="py-32 relative z-10 bg-[#08080C] border-t border-white/5">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-24">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Workflow de Otimização</h2>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                                Diferente de scripts simples, o Voltris opera em um ciclo contínuo de diagnóstico e ajuste.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto relative">
                            {/* Connecting Line (Desktop) */}
                            <div className="hidden md:block absolute top-[28%] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-[#31A8FF]/20 via-[#8B31FF]/20 to-[#FF4B6B]/20 -z-10"></div>

                            <StepCard
                                number="01"
                                title="Diagnóstico Profundo"
                                desc="Nossa IA analisa seu hardware (CPU, GPU, RAM) e identifica gargalos, drivers desatualizados e serviços do Windows que estão consumindo recursos desnecessariamente."
                                icon={<Search className="w-6 h-6" />}
                                delay={0.2}
                            />
                            <StepCard
                                number="02"
                                title="Kernel Tuning"
                                desc="Aplicamos ajustes finos no Registro e Agendador do Windows. Realocamos prioridades de CPU para garantir que seu jogo ou software de trabalho tenha acesso exclusivo aos recursos."
                                icon={<Settings className="w-6 h-6" />}
                                delay={0.4}
                            />
                            <StepCard
                                number="03"
                                title="Monitoramento Ativo"
                                desc="O sistema continua rodando em background com consumo minimalista, garantindo que novos processos não degradem a performance conquistada."
                                icon={<Activity className="w-6 h-6" />}
                                delay={0.6}
                            />
                        </div>
                    </div>
                </section>

                {/* --- FOR WHOM (SEGMENTS DEEP DIVE) --- */}
                <section className="py-32 relative z-10">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center justify-between mb-16 max-w-7xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Soluções Adaptativas</h2>
                            <p className="text-slate-400 text-lg md:text-right max-w-md mt-4 md:mt-0">
                                O Voltris muda seu comportamento baseado no que você faz.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                            <UserSegment
                                title="Gamers"
                                icon={<MousePointer2 className="w-6 h-6" />}
                                color="[#00FF94]" // Pass color code for Tailwind mostly handled in component logic or static classes below for clearer code
                                desc="Foco total em latência e estabilidade de quadros."
                                features={['Redução de Input Lag', 'Estabilidade 1% Low FPS', 'Network Optimization']}
                            />
                            <UserSegment
                                title="Streamers"
                                icon={<Video className="w-6 h-6" />}
                                color="[#8B31FF]"
                                desc="Equilíbrio perfeito entre jogo e encode de vídeo."
                                features={['Prioridade para OBS/Twitch', 'Sem drop de frames', 'Audio Latency Fix']}
                            />
                            <UserSegment
                                title="Empresas"
                                icon={<Briefcase className="w-6 h-6" />}
                                color="[#31A8FF]"
                                desc="Produtividade e multitarefa sem engasgos."
                                features={['Boot Instantâneo', 'Chrome/Edge Otimizado', 'Excel/PowerBI Fluido']}
                            />
                            <UserSegment
                                title="Usuários"
                                icon={<Laptop className="w-6 h-6" />}
                                color="[#FF4B6B]"
                                desc="Revitalize PCs antigos ou domésticos."
                                features={['Economia de Energia', 'Sistema Limpo', 'Multimídia 4K Fluida']}
                            />
                        </div>
                    </div>
                </section>

                {/* --- TECHNICAL BREAKDOWN (SEO HEAVY) --- */}
                <section className="py-32 relative z-10 bg-[#0A0A0E] overflow-hidden" ref={sectionRef}>
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#31A8FF]/5 blur-[120px] rounded-full pointer-events-none"></div>

                    <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16 max-w-7xl">
                        <div className="flex-1 space-y-12">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Otimização de Nível Kernel</h2>
                                <p className="text-slate-400 text-lg leading-relaxed">
                                    O Windows padrão vem configurado para "compatibilidade", não performance. O Voltris altera parâmetros profundos que a Microsoft esconde.
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 rounded-xl bg-[#31A8FF]/10 flex items-center justify-center shrink-0">
                                        <Cpu className="w-6 h-6 text-[#31A8FF]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Thread Scheduling</h3>
                                        <p className="text-slate-400 text-sm">Realocamos threads de sistema para núcleos secundários, deixando os núcleos primários da CPU livres para suas aplicações pesadas.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 rounded-xl bg-[#8B31FF]/10 flex items-center justify-center shrink-0">
                                        <Brain className="w-6 h-6 text-[#8B31FF]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Memory Management</h3>
                                        <p className="text-slate-400 text-sm">Limpeza agressiva de Standby List e otimização de cache L3 para evitar micro-stutters durante gameplay ou renderização.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 rounded-xl bg-[#00FF94]/10 flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-6 h-6 text-[#00FF94]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Segurança Preservada</h3>
                                        <p className="text-slate-400 text-sm">Diferente de scripts duvidosos, não removemos componentes vitais de segurança (como Defender ou Windows Update), apenas os configuramos para não atrapalhar.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Visual Element */}
                        <div className="flex-1 w-full max-w-lg lg:max-w-full">
                            <motion.div
                                style={{ scale }}
                                className="relative bg-gradient-to-br from-[#141419] to-[#0A0A0F] rounded-3xl border border-white/10 p-8 shadow-2xl"
                            >
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="text-xs text-slate-500 font-mono">system_core_v3.log</div>
                                </div>
                                <div className="space-y-4 font-mono text-xs md:text-sm">
                                    <div className="flex justify-between items-center text-slate-500">
                                        <span>&gt; Analyzing Process...</span>
                                        <span>[DONE]</span>
                                    </div>
                                    <div className="flex justify-between items-center text-white">
                                        <span>&gt; Optimizing DPC Latency</span>
                                        <span className="text-[#00FF94]">-45%</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "85%" }}
                                            transition={{ duration: 1.5 }}
                                            className="h-full bg-gradient-to-r from-[#31A8FF] to-[#00FF94]"
                                        ></motion.div>
                                    </div>
                                    <div className="flex justify-between items-center text-white pt-2">
                                        <span>&gt; Unparking CPU Cores</span>
                                        <span className="text-[#31A8FF]">ALL ACTIVE</span>
                                    </div>
                                    <div className="flex justify-between items-center text-white">
                                        <span>&gt; Network Jitter Clean</span>
                                        <span className="text-[#8B31FF]">OPTIMIZED</span>
                                    </div>
                                    <div className="pt-6 text-slate-400 border-t border-white/5 mt-4">
                                        System Status: <span className="text-white font-bold">PEAK PERFORMANCE</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* --- CTA FINAL --- */}
                <section className="py-32 px-4 text-center relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-[#FF4B6B]/10 via-[#8B31FF]/10 to-[#31A8FF]/10 blur-[100px] rounded-[100%] -z-10 pointer-events-none"></div>

                    <div className="max-w-4xl mx-auto relative z-10">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                            Pronto para sentir a diferença?
                        </h2>
                        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-light">
                            Não acredite apenas em gráficos. Teste o Voltris Optimizer no seu sistema e veja os números subirem.
                        </p>

                        <Link
                            href="/otimizacao"
                            className="inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-lg rounded-2xl hover:scale-105 hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] transition-all duration-300"
                        >
                            <Download className="w-6 h-6" />
                            DOWNLOAD VOLTRIS OPTIMIZER
                        </Link>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    );
}

// Utility component used inside HowItWorksClient but defined here for brevity
function Settings(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    )
}
