"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gamepad2, AlertTriangle, CheckCircle, Clock, Users, Shield, Zap, Terminal, Cpu } from 'lucide-react';
import TechFloatingElements from '@/components/TechFloatingElements';
import JsonLd from '@/components/JsonLd';

export default function ErrosJogosClient() {
    return (
        <>
            <Header />
            <JsonLd
                type="FAQPage"
                data={{
                    mainEntity: [
                        {
                            "@type": "Question",
                            "name": "Como corrigir erros do Vanguard no Valorant?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Corrigimos erros do Vanguard ajustando as configurações de Secure Boot e TPM 2.0 no registro do Windows de forma remota."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "O que fazer se o GTA V fechar sozinho?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Resolvemos crashes do GTA e FiveM limpando caches de scripts corrompidos e ajustando DLLs do sistema para evitar conflitos."
                            }
                        }
                    ]
                }}
            />
            <main className="bg-[#020205] min-h-screen relative overflow-x-hidden font-sans selection:bg-[#FF4B6B]/30">

                {/* Background Effects (Global) - Gamer Optimized */}
                <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 brightness-50 contrast-150 mix-blend-overlay pointer-events-none z-0"></div>
                <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-[#FF4B6B]/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow pointer-events-none z-0"></div>
                <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-[#31A8FF]/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow pointer-events-none z-0"></div>

                {/* Hero Section */}
                <section className="min-h-[100dvh] flex flex-col items-center justify-center relative z-10 w-full px-4 text-center">
                    <TechFloatingElements />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="w-full max-w-5xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF4B6B]/10 border border-[#FF4B6B]/20 backdrop-blur-md mb-8">
                            <span className="flex h-2 w-2 rounded-full bg-[#FF4B6B] shadow-[0_0_12px_#FF4B6B] animate-pulse"></span>
                            <span className="text-xs sm:text-sm font-bold text-[#FF4B6B] uppercase tracking-tighter tracking-widest">Support Protocol Active</span>
                        </div>

                        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white mb-8 leading-none tracking-tighter uppercase italic">
                            Fix Your <span className="bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">Games</span>
                        </h1>

                        <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
                            Crashes, DLLs corrompidas, FPS baixo ou erros de conexão? Nossa equipe técnica gamer resolve o seu problema <strong>em minutos</strong> via acesso remoto.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/servicos?abrir=correcao_windows"
                                className="px-10 py-5 rounded-xl bg-[#FF4B6B] text-white font-black text-xl hover:bg-[#E03A56] transition-all shadow-[0_0_30px_rgba(255,75,107,0.4)] flex items-center justify-center gap-3 uppercase italic"
                            >
                                <Gamepad2 className="w-6 h-6" /> Corrigir Agora
                            </Link>
                            <button
                                onClick={() => document.getElementById('jogos')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-10 py-5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-xl"
                            >
                                <Cpu className="w-5 h-5" /> Ver Jogos Suportados
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
                    >
                        <div className="w-[2px] h-16 bg-gradient-to-b from-[#FF4B6B] via-[#8B31FF] to-transparent"></div>
                    </motion.div>
                </section>

                {/* Support Banner (Rotating Games) */}
                <section id="jogos" className="py-24 bg-[#05050A] border-y border-white/5 relative z-10 overflow-hidden">
                    <div className="container mx-auto px-4 mb-16 text-center">
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-4">Elite Support Systems</h2>
                        <p className="text-slate-500 font-medium">Corrigimos erros críticos nos títulos mais competitivos e exigentes do mercado.</p>
                    </div>

                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                        {[
                            { title: "GTA V & GTA 6", tags: ["Crashing", "Social Club", "FiveM"], desc: "Soluções completas para crashes inesperados, erros de ativação e instabilidades no FiveM.", color: "#FF4B6B" },
                            { title: "Counter-Strike 2", tags: ["VAC Link", "Stuttering", "Lag"], desc: "Otimização de rede, correção de erros de verificação do jogo e eliminação de stuttering pós-update.", color: "#31A8FF" },
                            { title: "Cyberpunk 2077", tags: ["RedEngine", "Rendering", "Save Fix"], desc: "Correção de erros de renderização, problemas de carregamento e crashes de scripts.", color: "#8B31FF" },
                            { title: "Valorant & LoL", tags: ["Vanguard", "Auth Error", "Ping"], desc: "Erros de anticheat (Vanguard), falhas de login e otimização de rota para menor latência.", color: "#00FF94" },
                            { title: "Call of Duty / MW", tags: ["Dev Errors", "DirectX", "Scan"], desc: "Resolução de 'Dev Errors' recorrentes, falhas de DirectX e erros de banco de dados corrompido.", color: "#FFA500" },
                            { title: "Fortnite", tags: ["Easy Anticheat", "FPS Drop", "EGS"], desc: "Correção de falhas no Easy Anticheat e otimização extrema para competitivos.", color: "#FF00FF" }
                        ].map((game, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                key={i}
                                className="p-8 rounded-[32px] bg-[#0A0A12] border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-10 rounded-full blur-[60px]" style={{ backgroundColor: game.color }}></div>

                                <h3 className="text-2xl font-black text-white mb-4 italic uppercase tracking-tighter">{game.title}</h3>
                                <p className="text-slate-400 text-sm mb-6 leading-relaxed font-sans">{game.desc}</p>

                                <div className="flex flex-wrap gap-2">
                                    {game.tags.map((tag, j) => (
                                        <span key={j} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-slate-300 uppercase tracking-widest">{tag}</span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Performance Grid */}
                <section className="py-24 px-4 relative z-10 w-full">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <div className="inline-block px-4 py-1 rounded-full bg-[#00FF94]/10 border border-[#00FF94]/20 text-[#00FF94] text-xs font-bold uppercase tracking-widest">Advanced Diagnostics</div>
                                <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-tight">Chega de <span className="text-[#FF4B6B]">Erros</span> no Meio da Sua Gameplay.</h2>
                                <p className="text-slate-400 text-lg leading-relaxed font-medium">Nós não apenas corrigimos o erro superficial. Analisamos seu hardware, drivers e registro para garantir estabilidade total.</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        { icon: <Shield className="w-5 h-5" />, title: "Garantia 30 Dias", desc: "Se o erro voltar, nós tratamos sem custo extra." },
                                        { icon: <Terminal className="w-5 h-5" />, title: "Deep Clean", desc: "Eliminamos sobras de DLLs e conflitos de drivers." },
                                        { icon: <Zap className="w-5 h-5" />, title: "Protocolo Fast", desc: "Atendimento imediato via acesso remoto seguro." },
                                        { icon: <Users className="w-5 h-5" />, title: "Técnicos Gamers", desc: "Sua máquina nas mãos de quem realmente joga." }
                                    ].map((feat, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                            <div className="text-[#FF4B6B]">{feat.icon}</div>
                                            <div>
                                                <div className="text-white font-bold text-sm uppercase italic tracking-tighter mb-1">{feat.title}</div>
                                                <div className="text-slate-500 text-xs font-sans">{feat.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute -inset-10 bg-[#FF4B6B]/5 rounded-full blur-[100px] pointer-events-none"></div>
                                <div className="relative rounded-[40px] border border-white/5 bg-[#0D0D15] p-10 overflow-hidden group">
                                    <div className="flex items-center gap-3 mb-8">
                                        <AlertTriangle className="w-8 h-8 text-[#FF4B6B] animate-pulse" />
                                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Erro: Código 0x00045...</h3>
                                    </div>
                                    <div className="space-y-4 mb-20">
                                        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: '85%' }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="h-full bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF]"
                                            ></motion.div>
                                        </div>
                                        <div className="flex justify-between text-[10px] text-[#FF4B6B] font-bold uppercase tracking-widest italic">
                                            <span>Analyzing Registers...</span>
                                            <span>85% Completed</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-400 text-sm italic font-medium leading-relaxed">
                                        "Sempre que eu tentava abrir o jogo ele crashava na tela de carregamento. O pessoal da VOLTRIS resolveu em menos de 10 minutos."
                                    </p>
                                    <div className="mt-4 text-white font-black italic uppercase tracking-tighter text-sm">— Lucas G., Player de CS2</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-24 px-4 max-w-4xl mx-auto relative z-10">
                    <h2 className="text-3xl font-black text-white text-center uppercase italic tracking-tighter mb-16">Intelligence Center</h2>
                    <div className="space-y-4">
                        {[
                            { q: "O acesso remoto é seguro?", a: "Sim, utilizamos ferramentas de padrão industrial (AnyDesk/TeamViewer) onde você acompanha todo o processo em tempo real e pode encerrar a conexão a qualquer momento." },
                            { q: "E se o erro não tiver solução?", a: "Temos uma taxa de sucesso de 98%. Caso seu problema seja puramente de hardware defeituoso e não possa ser resolvido via software, devolveremos integralmente seu pagamento." },
                            { q: "Qual o tempo médio de reparo?", a: "A maioria dos erros de inicialização e DLL são resolvidos em cerca de 15 a 30 minutos." }
                        ].map((faq, index) => (
                            <div
                                key={index}
                                className="p-6 rounded-2xl bg-[#0A0A12] border border-white/5 hover:border-[#FF4B6B]/20 transition-all group"
                            >
                                <h3 className="text-lg font-bold text-white mb-2 uppercase italic tracking-tighter group-hover:text-[#FF4B6B] transition-colors">{faq.q}</h3>
                                <p className="text-slate-500 text-sm font-sans">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-4 text-center relative z-10">
                    <div className="max-w-4xl mx-auto py-20 px-10 rounded-[48px] bg-gradient-to-br from-[#FF4B6B] to-[#8B31FF] relative overflow-hidden shadow-[0_0_100px_rgba(255,75,107,0.2)]">
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-3xl"></div>
                        <div className="relative z-20">
                            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-8 leading-tight">
                                Volte ao Jogo <br /> <span className="text-black/50">Imediatamente</span>
                            </h2>
                            <Link
                                href="/servicos?abrir=correcao_windows"
                                className="inline-flex px-12 py-6 rounded-2xl bg-white text-black font-black text-2xl hover:scale-105 transition-transform uppercase italic shadow-2xl"
                            >
                                Repair System Now
                            </Link>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
