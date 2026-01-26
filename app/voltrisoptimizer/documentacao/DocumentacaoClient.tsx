"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Cpu, ShieldCheck, Zap, Database, Network,
    Terminal, Lock, FileCode2, Search, ArrowLeft
} from 'lucide-react';

export default function DocumentacaoClient() {
    return (
        <>
            <Header />
            <main className="bg-[#050510] min-h-screen relative font-sans selection:bg-[#31A8FF]/30 overflow-hidden text-slate-300">

                {/* Global Ambient Background Effects */}
                <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-50"></div>

                {/* Deep Space Gradients - Adjusted for readability */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-[#31A8FF]/5 blur-[120px] rounded-full mix-blend-screen"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-[#8B31FF]/5 blur-[120px] rounded-full mix-blend-screen"></div>
                </div>

                {/* --- HERO SECTION --- */}
                <section className="pt-32 pb-20 relative z-10">
                    <div className="container mx-auto px-4">
                        <Link href="/voltrisoptimizer" className="inline-flex items-center gap-2 text-sm text-[#31A8FF] hover:text-white transition-colors mb-8 group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Voltar para Voltris Optimizer
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl"
                        >
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-white leading-tight">
                                Documentação <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] to-[#8B31FF]">Técnica</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed max-w-2xl border-l-4 border-[#31A8FF] pl-6">
                                Uma visão aprofundada da engenharia, arquitetura e protocolos de segurança que impulsionam o Voltris Optimizer.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* --- PIPELINE VISUALIZATION --- */}
                <section className="py-12 border-y border-white/5 bg-[#08080C] relative z-10">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 text-center md:text-left">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white mb-2">Workflow de Otimização</h3>
                                <p className="text-sm text-slate-500">Pipeline de execução do software no sistema do usuário.</p>
                            </div>

                            <div className="flex flex-col md:flex-row items-center gap-4 text-xs font-mono font-medium text-slate-400">
                                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2">
                                    <Search className="w-4 h-4 text-[#31A8FF]" />
                                    Análise de Hardw.
                                </div>
                                <div className="h-8 w-[1px] bg-white/10 md:h-[1px] md:w-8"></div>
                                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-[#FF4B6B]" />
                                    Backup / Restore
                                </div>
                                <div className="h-8 w-[1px] bg-white/10 md:h-[1px] md:w-8"></div>
                                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-[#8B31FF]" />
                                    Execução de Scripts
                                </div>
                                <div className="h-8 w-[1px] bg-white/10 md:h-[1px] md:w-8"></div>
                                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                    <Zap className="w-4 h-4" />
                                    Validação
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- CORE MODULES --- */}
                <section className="py-24 relative z-10">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <h2 className="text-3xl font-bold text-white mb-16 tracking-tight flex items-center gap-3">
                            <FileCode2 className="w-8 h-8 text-[#31A8FF]" />
                            Módulos de Engenharia
                        </h2>

                        <div className="space-y-24">

                            {/* MODULE 1: CPU & PROCESSES */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                                <div className="order-2 lg:order-1">
                                    <div className="p-8 rounded-3xl bg-[#0A0A0E] border border-white/5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-30">
                                            <Cpu className="w-24 h-24 text-[#31A8FF]" />
                                        </div>
                                        <h3 className="text-xl font-mono text-[#31A8FF] mb-4">01. CPU_OPTIMIZER</h3>
                                        <ul className="space-y-4">
                                            <li className="flex gap-4">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#31A8FF] mt-2 shrink-0"></span>
                                                <div>
                                                    <strong className="text-white block mb-1">Gerenciamento de Afinidade</strong>
                                                    <p className="text-sm leading-relaxed">O software analisa o CCX (Core Complex) do processador (especialmente em Ryzen) e ajusta a afinidade de threads para garantir que jogos e aplicações pesadas rodem nos núcleos mais performáticos, evitando latência entre núcleos.</p>
                                                </div>
                                            </li>
                                            <li className="flex gap-4">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#31A8FF] mt-2 shrink-0"></span>
                                                <div>
                                                    <strong className="text-white block mb-1">Process Priority Class</strong>
                                                    <p className="text-sm leading-relaxed">Ajuste dinâmico da classe de prioridade do Windows (High/Realtime) para o executável em foco, prevenindo que processos de fundo (como Windows Update) roubem ciclos de CPU.</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="order-1 lg:order-2 lg:pt-8">
                                    <h3 className="text-2xl font-bold text-white mb-4">Processamento & Threads</h3>
                                    <p className="text-lg text-slate-400 mb-6">
                                        O agendador padrão do Windows é generalista. O Voltris especializa o agendamento para focar em latência ultrabaixa.
                                    </p>
                                    <div className="bg-[#111116] p-4 rounded-lg border border-white/5 font-mono text-xs text-slate-400 overflow-x-auto">
                                        <p className="text-emerald-400 mb-2"># Exemplo de lógica de pseudocódigo:</p>
                                        <p>if (Process.Category == "Game") {'{'}</p>
                                        <p className="pl-4">Process.Priority = "High";</p>
                                        <p className="pl-4">PowerPlan.Set("UltimatePerformance");</p>
                                        <p className="pl-4">DisableSleepStates(C-States);</p>
                                        <p>{'}'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* MODULE 2: NETWORK */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                                <div className="lg:pt-8">
                                    <h3 className="text-2xl font-bold text-white mb-4">Stack de Rede (TCP/IP)</h3>
                                    <p className="text-lg text-slate-400 mb-6">
                                        Reduzimos o bufferbloat e melhoramos o envio de pacotes pequenos (comuns em jogos e chamadas VoIP).
                                    </p>
                                    <div className="flex gap-3 flex-wrap">
                                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono">CTCP (Congestion Provider)</span>
                                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono">Disable Nagle's Algorithm</span>
                                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono">MTU Discovery</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="p-8 rounded-3xl bg-[#0A0A0E] border border-white/5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-30">
                                            <Network className="w-24 h-24 text-[#8B31FF]" />
                                        </div>
                                        <h3 className="text-xl font-mono text-[#8B31FF] mb-4">02. NET_STACK</h3>
                                        <ul className="space-y-4">
                                            <li className="flex gap-4">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#8B31FF] mt-2 shrink-0"></span>
                                                <div>
                                                    <strong className="text-white block mb-1">Desativação de Throttling</strong>
                                                    <p className="text-sm leading-relaxed">Removemos as restrições de economia de energia da placa de rede, impedindo que o adaptador entre em modo de suspensão durante micro-pausas no tráfego.</p>
                                                </div>
                                            </li>
                                            <li className="flex gap-4">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#8B31FF] mt-2 shrink-0"></span>
                                                <div>
                                                    <strong className="text-white block mb-1">Otimização de DNS</strong>
                                                    <p className="text-sm leading-relaxed">Limpeza e ajuste do cache do DNS Resolver para evitar falhas de resolução e acelerar o início de conexões.</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* MODULE 3: DEBLOAT & SERVICES */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                                <div className="order-2 lg:order-1">
                                    <div className="p-8 rounded-3xl bg-[#0A0A0E] border border-white/5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-30">
                                            <Database className="w-24 h-24 text-[#FF4B6B]" />
                                        </div>
                                        <h3 className="text-xl font-mono text-[#FF4B6B] mb-4">03. SYS_DEBLOAT</h3>
                                        <ul className="space-y-4">
                                            <li className="flex gap-4">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4B6B] mt-2 shrink-0"></span>
                                                <div>
                                                    <strong className="text-white block mb-1">Telemetria & Tracking</strong>
                                                    <p className="text-sm leading-relaxed">Bloqueio via Hosts e Firewall de domínios de telemetria conhecidos da Microsoft e terceiros, reduzindo uso de banda e CPU em background.</p>
                                                </div>
                                            </li>
                                            <li className="flex gap-4">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4B6B] mt-2 shrink-0"></span>
                                                <div>
                                                    <strong className="text-white block mb-1">Serviços "Inúteis"</strong>
                                                    <p className="text-sm leading-relaxed">Desativação segura de serviços como Fax, Telephony, Retail Demo, Xbox (opcional), liberando memória RAM.</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="order-1 lg:order-2 lg:pt-8">
                                    <h3 className="text-2xl font-bold text-white mb-4">Limpeza Profunda do Sistema</h3>
                                    <p className="text-lg text-slate-400 mb-6">
                                        O Windows moderno vem com centenas de processos desnecessários para um usuário profissional ou gamer.
                                    </p>
                                    <div className="bg-[#111116] p-4 rounded-lg border border-white/5 font-mono text-xs text-slate-400">
                                        <p className="text-slate-500">// Exemplo de serviços desabilitados</p>
                                        <p>DiagTrack (Connected User Experiences and Telemetry)</p>
                                        <p>dmwappushservice (WAP Push Message Routing Service)</p>
                                        <p>WSearch (Windows Search) *Opcional</p>
                                        <p>SysMain (Superfetch) *Dependendo do tipo de SSD</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SAFETY SECTION --- */}
                <section className="py-24 bg-gradient-to-b from-[#08080C] to-[#050510] relative z-10 border-t border-white/5">
                    <div className="container mx-auto px-4 text-center max-w-3xl">
                        <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-full mb-8">
                            <ShieldCheck className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-6">Segurança em Primeiro Lugar</h2>
                        <p className="text-slate-400 text-lg mb-12">
                            Entendemos que modificar o sistema operacional exige responsabilidade. Por isso, o Voltris opera com uma política estrita de "Non-Destructive Tweaking".
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            <div className="p-6 bg-[#0A0A0E] rounded-xl border border-white/5">
                                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    Ponto de Restauração
                                </h4>
                                <p className="text-sm text-slate-500">Antes de aplicar qualquer alteração, o software força a criação de um Ponto de Restauração do Windows. Se algo der errado, você volta no tempo com 1 clique.</p>
                            </div>
                            <div className="p-6 bg-[#0A0A0E] rounded-xl border border-white/5">
                                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#31A8FF]"></div>
                                    Transparência de Código
                                </h4>
                                <p className="text-sm text-slate-500">Utilizamos scripts auditáveis e baseados em ferramentas consagradas da comunidade open-source, garantindo que não há "caixas pretas" no processo.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 relative z-10">
                    <div className="container mx-auto px-4 text-center">
                        <Link
                            href="/voltrisoptimizer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-medium transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Voltar para a Página do Produto
                        </Link>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    );
}
