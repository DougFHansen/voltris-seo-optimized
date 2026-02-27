"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gamepad2, AlertTriangle, CheckCircle, Clock, Users, Shield, Zap, Terminal, Cpu, Bug, Lightbulb, Search, ArrowRight } from 'lucide-react';
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
                            "name": "Como corrigir o erro VAN9003 no Valorant?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "O erro VAN9003 geralmente está relacionado ao Secure Boot e TPM 2.0 no Windows 11. Nossa equipe realiza a configuração remota da sua BIOS e ajustes no sistema para habilitar essas funções sem risco à sua máquina."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "O GTA V ou FiveM fecha sozinho (crash) sem erro, como resolver?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Resolvemos crashes limpando logs corrompidos, ajustando o heap de memória do Windows e verificando integridade de DLLs essenciais como d3d11.dll e scripts do DirectX."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Como tirar o erro 'VAC não pôde verificar sua sessão' no CS2?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Esse erro ocorre por conflitos de assinaturas de drivers ou arquivos temporários da Steam. Realizamos uma limpeza profunda nos manifestos do jogo e re-sinalizamos os serviços da Steam para correção imediata."
                            }
                        }
                    ]
                }}
            />
            <main className="bg-[#020205] min-h-screen relative overflow-x-hidden font-sans selection:bg-[#FF4B6B]/30">

                {/* Efeitos de Fundo - Estética High-End Gamer */}
                <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150 mix-blend-overlay pointer-events-none z-0"></div>
                <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-[#FF4B6B]/5 rounded-full blur-[150px] mix-blend-screen animate-pulse pointer-events-none z-0"></div>
                <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-[#31A8FF]/5 rounded-full blur-[150px] mix-blend-screen animate-pulse pointer-events-none z-0"></div>

                {/* Hero Section */}
                <section className="min-h-[100dvh] flex flex-col items-center justify-center relative z-10 w-full px-4 text-center">
                    <TechFloatingElements />

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full max-w-6xl"
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FF4B6B]/10 border border-[#FF4B6B]/20 backdrop-blur-xl mb-10">
                            <span className="flex h-2 w-2 rounded-full bg-[#FF4B6B] shadow-[0_0_15px_#FF4B6B] animate-pulse"></span>
                            <span className="text-xs font-black text-white uppercase tracking-[0.3em]">Protocolo de Reparo Ativo</span>
                        </div>

                        <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black text-white mb-8 leading-[0.9] tracking-tighter uppercase italic">
                            CORRIJA SEUS <br />
                            <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">JOGOS AGORA</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-14 leading-relaxed font-light">
                            Crashes constantes, erros de DLL, bugs de Anti-Cheat ou FPS baixo? Atendimento especializado para resolver problemas reais nos maiores jogos do mundo.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Link
                                href="/servicos?abrir=correcao_windows"
                                className="group relative px-12 py-6 rounded-2xl bg-white text-black font-black text-2xl hover:scale-105 transition-all duration-300 shadow-[0_20px_50px_rgba(255,255,255,0.15)] flex items-center gap-4 uppercase italic overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                <Zap className="w-7 h-7 fill-black" /> Resolver Agora
                            </Link>
                            <button
                                onClick={() => document.getElementById('base-conhecimento')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-10 py-6 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xl hover:bg-white/10 transition-all flex items-center gap-3 backdrop-blur-xl hover:border-white/20"
                            >
                                <Search className="w-6 h-6 text-[#31A8FF]" /> Base de Erros
                            </button>
                        </div>
                    </motion.div>
                </section>

                {/* Seção de Erros Reais (Inteligente & SEO-Driven) */}
                <section id="base-conhecimento" className="py-32 bg-[#05050A]/80 backdrop-blur-md border-y border-white/5 relative z-10">
                    <div className="container mx-auto px-4 mb-20">
                        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-6">Diagnóstico Especializado</h2>
                            <div className="w-24 h-1.5 bg-gradient-to-r from-[#31A8FF] to-[#FF4B6B] rounded-full mb-8"></div>
                            <p className="text-slate-400 text-lg">Nossa equipe resolve erros críticos nos títulos mais jogados. Confira os problemas que eliminamos diariamente:</p>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                        {[
                            {
                                title: "VALORANT",
                                errors: ["VAN 9003 (Secure Boot/TPM)", "VAL 51 (Connection)", "VAN 81 (Vanguard Outdated)"],
                                desc: "Configuração completa de BIOS e Sistema para o Vanguard rodar sem interrupções.",
                                color: "#FF4B6B",
                                icon: "🎮"
                            },
                            {
                                title: "GTA V & FIVEM",
                                errors: ["Erro 'Social Club' invátido", "Crash sem erro no Desktop", "Failed to handshake with server"],
                                desc: "Limpeza de scripts corrompidos, cache do FiveM e otimização de DLLs do Windows.",
                                color: "#FFA500",
                                icon: "🚗"
                            },
                            {
                                title: "COUNTER-STRIKE 2",
                                errors: ["VAC não pôde verificar sessão", "Stuttering excessivo", "DirectX Shader Cache Fix"],
                                desc: "Correção de integridade da Steam e otimização de frames para o cenário competitivo.",
                                color: "#31A8FF",
                                icon: "🔫"
                            },
                            {
                                title: "ROBLOX & MINECRAFT",
                                errors: ["Erro 268 (Client Behavior)", "Erro 279 (ID=17)", "GLFW Error 65542 (OpenGL)"],
                                desc: "Resolução de conflitos de rede em Roblox e instabilidade de drivers Java/GPU em Minecraft.",
                                color: "#00FF94",
                                icon: "🧱"
                            },
                            {
                                title: "FORTNITE",
                                errors: ["Easy Anti-Cheat (EAC) Error", "DirectX Feature Level 10.0", "Stuck on loading screen"],
                                desc: "Reparo profundo no motor Unreal e serviços de anti-cheat para acesso imediato.",
                                color: "#8B31FF",
                                icon: "⚔️"
                            },
                            {
                                title: "OUTROS ERROS",
                                errors: ["0xc000007b (DLL Error)", "D3DCompiler_43.dll missing", "vcruntime140.dll fix"],
                                desc: "Instalação e reparo de todas as bibliotecas de sistema necessárias para rodar qualquer jogo.",
                                color: "#FFFFFF",
                                icon: "🛠️"
                            }
                        ].map((game, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                key={i}
                                className="group p-8 rounded-[40px] bg-[#0A0A15] border border-white/5 hover:border-[#31A8FF]/30 transition-all duration-500 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 text-4xl opacity-20 group-hover:scale-125 transition-transform duration-500">{game.icon}</div>
                                <h3 className="text-2xl font-black text-white mb-4 italic uppercase tracking-tighter" style={{ color: game.color }}>{game.title}</h3>
                                <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">{game.desc}</p>

                                <div className="space-y-3">
                                    {game.errors.map((err, j) => (
                                        <div key={j} className="flex items-center gap-3 text-xs font-bold text-slate-300 uppercase tracking-widest bg-white/5 p-3 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
                                            <Bug className="w-3.5 h-3.5 text-[#FF4B6B]" /> {err}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Repair System Modernizado (Visual Impact) */}
                <section className="py-32 px-4 relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-[#31A8FF]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div className="space-y-10 relative z-10 text-left">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-[#00FF94]/10 border border-[#00FF94]/30 text-[#00FF94] text-xs font-black uppercase tracking-widest">Tecnologia Voltris</span>
                                <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
                                    SISTEMA DE <br /> <span className="text-[#31A8FF]">REPARO</span> ATIVO.
                                </h2>
                                <p className="text-slate-400 text-xl leading-relaxed font-light lg:pr-10">
                                    Não usamos soluções genéricas. Aplicamos um protocolo de limpeza e reparo de baixo nível que atinge o <span className="text-white font-bold">núcleo do problema</span>, garantindo que o erro nunca mais interrompa sua partida.
                                </p>

                                <ul className="space-y-6">
                                    {[
                                        { t: "Deep Registry Scan", d: "Varredura profunda por chaves de registro corrompidas que travam o jogo." },
                                        { t: "DLL Smart Injection", d: "Substituição segura de bibliotecas ausentes ou infectadas por originais." },
                                        { t: "C-State & Latency Fix", d: "Ajuste na comunicação Hardware/Software para resposta imediata do input." }
                                    ].map((item, id) => (
                                        <li key={id} className="flex gap-5 items-start">
                                            <div className="mt-1 w-6 h-6 rounded-full bg-[#31A8FF]/20 flex items-center justify-center shrink-0">
                                                <CheckCircle className="w-4 h-4 text-[#31A8FF]" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-black text-lg uppercase italic tracking-tighter">{item.t}</h4>
                                                <p className="text-slate-500 text-sm">{item.d}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] rounded-[48px] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
                                <div className="relative rounded-[48px] bg-[#0D0D15] border border-white/10 p-12 overflow-hidden shadow-2xl">
                                    <div className="flex items-center justify-between mb-12">
                                        <div className="flex items-center gap-4">
                                            <div className="w-4 h-4 rounded-full bg-[#FF4B6B] animate-pulse"></div>
                                            <h3 className="text-xl font-bold text-white uppercase tracking-widest italic">Reparando Sistema Gamer...</h3>
                                        </div>
                                        <Terminal className="w-6 h-6 text-slate-500" />
                                    </div>

                                    <div className="space-y-8 mb-12">
                                        {[
                                            { label: "Verificando DirectX 12 Core", p: "100%", c: "bg-[#31A8FF]" },
                                            { label: "Otimizando Registros Vanguard", p: "85%", c: "bg-[#8B31FF]" },
                                            { label: "Limpando Cache Shader NVIDIA/AMD", p: "45%", c: "bg-[#FF4B6B]" }
                                        ].map((bar, idx) => (
                                            <div key={idx} className="space-y-3">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                                    <span>{bar.label}</span>
                                                    <span className="text-white">{bar.p}</span>
                                                </div>
                                                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: bar.p }}
                                                        transition={{ duration: 1.5, delay: idx * 0.2 }}
                                                        className={`h-full ${bar.c}`}
                                                    ></motion.div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 relative group/card">
                                        <Lightbulb className="absolute top-4 right-4 w-5 h-5 text-[#FFA500] opacity-30" />
                                        <p className="text-slate-400 text-sm leading-relaxed italic mb-4">
                                            "Incrível! O VAN9003 do Valorant não deixava eu abrir o jogo de jeito nenhum. A Voltris resolveu configurando a minha BIOS remotamente. Recomendo demais!"
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">RH</div>
                                            <span className="text-white text-xs font-black uppercase italic tracking-tighter">Rafael H. — Gamer</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ em Português */}
                <section className="py-32 px-4 max-w-4xl mx-auto relative z-10">
                    <div className="text-center mb-20 space-y-4">
                        <span className="text-[#31A8FF] text-xs font-black uppercase tracking-[0.4em]">Help Center</span>
                        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Dúvidas Frequentes</h2>
                    </div>
                    <div className="grid gap-4">
                        {[
                            { q: "O suporte remoto é realmente seguro?", a: "Absolutamente. Utilizamos softwares criptografados como AnyDesk ou TeamViewer. Você acompanha cada clique que o técnico faz e pode encerrar a conexão a qualquer segundo simplesmente fechando o programa." },
                            { q: "Quais jogos vocês dão suporte?", a: "Todos! De títulos leves como Minecraft e Roblox até os mais exigentes como Cyberpunk 2077, COD, Battlefield e simuladores complexos." },
                            { q: "E se o problema for no meu hardware físico?", a: "Nosso foco é software. Se durante o diagnóstico detectarmos que uma peça sua está com defeito físico (ex: placa de vídeo morrendo), nós te orientamos sobre o que comprar e devolvemos seu pagamento do reparo de software." },
                            { q: "Demora muito para me atender?", a: "Nosso sistema de agendamento prioritário garante que você seja atendido pela próxima vaga disponível, geralmente em menos de 1 hora." }
                        ].map((faq, index) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                key={index}
                                className="p-8 rounded-3xl bg-[#0A0A12] border border-white/5 hover:border-[#31A8FF]/20 transition-all group cursor-default"
                            >
                                <h3 className="text-xl font-bold text-white mb-3 uppercase italic tracking-tighter group-hover:text-[#31A8FF] transition-colors">{faq.q}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Tutoriais e Guias de Erros (SEO Internal Linking) */}
                <section className="py-24 px-4 bg-[#05050A] relative z-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                            <div className="text-left">
                                <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">Tutoriais <span className="text-[#31A8FF]">Gamer</span></h2>
                                <p className="text-slate-500 mt-2">Dicas rápidas e manuais para os erros mais populares.</p>
                            </div>
                            <Link href="/guias" className="text-sm font-bold text-white/50 hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest border-b border-white/10 pb-1">
                                Ver todos os guias <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { t: "Como corrigir VAN9003 no Valorant", l: "/guias/valorant-van-9003-secure-boot-tpm-fix", c: "VALORANT" },
                                { t: "GTA V parou de funcionar (D3D Init)", l: "/guias/gta-v-err-gfx-d3d-init-crash", c: "GTA V" },
                                { t: "CS2: VAC unable to verify session", l: "/guias/cs2-otimizacao-fps-competitivo", c: "CS2" },
                                { t: "Erro Roblox: Conexão Perdida", l: "/guias/roblox-fix-erro-conexao", c: "ROBLOX" },
                                { t: "Minecraft: Erro de OpenGL Fix", l: "/guias/minecraft-lag-fix-optifine-fabric", c: "MINECRAFT" },
                                { t: "Fortnite: Texturas não carregam", l: "/guias/fortnite-texturas-nao-carregam-streaming", c: "FORTNITE" },
                                { t: "Fivm Erro: Crash ao iniciar", l: "/guias/gta-v-err-gfx-d3d-init-crash", c: "FIVEM" },
                                { t: "VCRUNTIME140.dll não encontrado", l: "/guias/vcruntime140-dll-nao-encontrado", c: "SISTEMA" }
                            ].map((guide, idx) => (
                                <Link
                                    key={idx}
                                    href={guide.l}
                                    className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/20 transition-all group"
                                >
                                    <span className="text-[9px] font-black text-[#8B31FF] uppercase tracking-widest mb-2 block">{guide.c}</span>
                                    <h4 className="text-white font-bold group-hover:text-[#31A8FF] transition-colors leading-snug">{guide.t}</h4>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Final */}
                <section className="py-32 px-4 text-center relative z-10">
                    <div className="max-w-5xl mx-auto py-24 px-10 rounded-[64px] bg-[#0A0A1A] border border-white/5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FF4B6B]/10 via-[#8B31FF]/10 to-[#31A8FF]/10 opacity-50"></div>
                        <div className="relative z-20">
                            <h2 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter mb-10 leading-none">
                                ESTÁ ESPERANDO <br /> <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">O PRÓXIMO CRASH?</span>
                            </h2>
                            <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto font-light">Garanta sua jogatina hoje. Atendimento imediato 24h via acesso remoto.</p>
                            <Link
                                href="/servicos?abrir=correcao_windows"
                                className="inline-flex px-14 py-7 rounded-2xl bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] text-white font-black text-2xl hover:scale-105 transition-all duration-300 uppercase italic shadow-[0_20px_60px_rgba(49,168,255,0.3)]"
                            >
                                <Zap className="w-8 h-8 fill-white mr-3" /> Reparar Meu Jogo Agora
                            </Link>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
