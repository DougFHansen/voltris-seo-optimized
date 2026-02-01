"use client";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckIcon, RocketLaunchIcon, DevicePhoneMobileIcon, MagnifyingGlassIcon, ChatBubbleLeftRightIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function CriacaoSitesClient() {
    return (
        <>
            <Header />
            <main className="bg-[#050510] min-h-screen relative overflow-x-hidden font-sans selection:bg-[#31A8FF]/30">
                {/* Background Effects */}
                <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-0"></div>
                <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#31A8FF]/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none z-0"></div>
                <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-[#8B31FF]/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none z-0"></div>

                {/* Hero Section */}
                <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 pt-20 z-10">
                    <div className="max-w-5xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 hover:bg-white/10 transition-colors cursor-default"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-[#00FF94] shadow-[0_0_8px_#00FF94] animate-pulse"></span>
                            <span className="text-xs font-bold text-white/90 tracking-widest uppercase">Tecnologia Web Moderna</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-5xl md:text-7xl font-extrabold mb-8 text-white tracking-tight leading-tight"
                        >
                            Criação de Sites <br className="hidden md:block" />
                            <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text animate-gradient-x">
                                Profissionais
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 font-light"
                        >
                            Transforme sua presença digital com interfaces imersivas, carregamento instantâneo e otimização total para conversão.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link
                                href="#planos"
                                className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-slate-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:-translate-y-1"
                            >
                                Ver Planos
                                <ChevronRightIcon className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href="https://wa.me/5511996716235?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20para%20cria%C3%A7%C3%A3o%20de%20site."
                                target="_blank"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white/5 border border-white/10 text-white font-bold text-lg rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md"
                            >
                                <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2 text-[#00FF94]" />
                                Consultar pelo WhatsApp
                            </Link>
                        </motion.div>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
                    >
                        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
                        <div className="w-[1px] h-12 bg-gradient-to-b from-[#31A8FF] to-transparent"></div>
                    </motion.div>
                </section>

                {/* Features Section */}
                <section className="relative py-24 px-4 z-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-sm font-bold tracking-[0.2em] text-[#31A8FF] mb-4 uppercase">Diferenciais</h2>
                            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">Excellence by Design</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    title: "Responsividade Fluida",
                                    description: "Experiência perfeita em qualquer dispositivo. Seu site se adapta como água a celulares, tablets e desktops.",
                                    icon: <DevicePhoneMobileIcon className="w-6 h-6" />,
                                    highlight: "text-[#31A8FF]",
                                    border: "group-hover:border-[#31A8FF]/30",
                                    bg: "bg-[#31A8FF]/10",
                                    delay: 0
                                },
                                {
                                    title: "SEO Avançado",
                                    description: "Estrutura semântica e técnica otimizada para os motores de busca. Seja encontrado por quem procura por você.",
                                    icon: <MagnifyingGlassIcon className="w-6 h-6" />,
                                    highlight: "text-[#8B31FF]",
                                    border: "group-hover:border-[#8B31FF]/30",
                                    bg: "bg-[#8B31FF]/10",
                                    delay: 0.1
                                },
                                {
                                    title: "Ultra Performance",
                                    description: "Core Web Vitals otimizados. Carregamento instantâneo para reter visitantes e melhorar sua pontuação.",
                                    icon: <RocketLaunchIcon className="w-6 h-6" />,
                                    highlight: "text-[#FF4B6B]",
                                    border: "group-hover:border-[#FF4B6B]/30",
                                    bg: "bg-[#FF4B6B]/10",
                                    delay: 0.2
                                },
                            ].map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: feature.delay }}
                                    className={`group p-8 rounded-3xl bg-[#0A0A0F]/50 backdrop-blur-md border border-white/5 ${feature.border} transition-all duration-500 hover:-translate-y-2`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 border border-white/5`}>
                                        <div className={`${feature.highlight}`}>{feature.icon}</div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                                    <p className="text-slate-400 leading-relaxed text-sm font-light">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Planos Section */}
                <section id="planos" className="relative py-24 px-4 z-10 bg-[#0A0A0F]/30 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-sm font-bold tracking-[0.2em] text-[#8B31FF] mb-4 uppercase">Investimento</h2>
                            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">Escolha o Nível Ideal</h3>
                            <p className="text-slate-400">Do essencial ao corporativo, temos a solução para o seu momento.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                            {/* Plano Essencial */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="group relative bg-[#050510] border border-white/5 rounded-[2rem] p-8 hover:border-white/10 transition-all duration-300"
                            >
                                <h3 className="text-lg font-bold text-white mb-2">Essencial</h3>
                                <div className="text-3xl font-bold text-[#31A8FF] mb-4">R$ 997,90</div>
                                <p className="text-slate-500 text-sm mb-8">O ponto de partida perfeito para profissionais liberais e autônomos.</p>

                                <ul className="space-y-4 mb-8">
                                    {[
                                        "One Page (Página Única)",
                                        "Design Responsivo Premium",
                                        "Botões de Ação (CTA)",
                                        "Hospedagem Grátis (1 ano)",
                                        "Certificado SSL Incluso"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                                            <CheckIcon className="w-4 h-4 text-[#31A8FF]" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="/todos-os-servicos/criacao-sites/plano-basico"
                                    className="block w-full py-4 text-center rounded-xl border border-white/10 text-white font-bold hover:bg-white hover:text-black transition-all duration-300"
                                >
                                    Ver Detalhes
                                </Link>
                            </motion.div>

                            {/* Plano Profissional (Destaque) */}
                            <motion.div
                                initial={{ opacity: 0, y: 0 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="group relative bg-[#0A0A0F] border border-[#8B31FF]/50 rounded-[2rem] p-8 shadow-[0_0_50px_rgba(139,49,255,0.1)] transform md:-translate-y-8"
                            >
                                <div className="absolute top-0 right-0 bg-[#8B31FF] text-white text-xs font-bold px-4 py-2 rounded-bl-2xl rounded-tr-2xl">POPULAR</div>
                                <h3 className="text-lg font-bold text-white mb-2">Profissional</h3>
                                <div className="text-3xl font-bold text-[#8B31FF] mb-4">R$ 1.997,90</div>
                                <p className="text-slate-500 text-sm mb-8">Estrutura completa para empresas que buscam autoridade digital.</p>

                                <ul className="space-y-4 mb-8">
                                    {[
                                        "Até 5 Páginas Exclusivas",
                                        "Otimização SEO Avançada",
                                        "Blog / Notícias Integrado",
                                        "Painel Administrativo",
                                        "Hospedagem & Domínio Grátis",
                                        "Google Analytics Setup"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-white text-sm font-medium">
                                            <CheckIcon className="w-4 h-4 text-[#8B31FF]" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="/todos-os-servicos/criacao-sites/plano-profissional"
                                    className="block w-full py-4 text-center rounded-xl bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] text-white font-bold hover:shadow-[0_0_20px_rgba(139,49,255,0.4)] transition-all duration-300"
                                >
                                    Selecionar Plano
                                </Link>
                            </motion.div>

                            {/* Plano E-commerce */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="group relative bg-[#050510] border border-white/5 rounded-[2rem] p-8 hover:border-white/10 transition-all duration-300"
                            >
                                <h3 className="text-lg font-bold text-white mb-2">E-commerce</h3>
                                <div className="text-3xl font-bold text-[#FF4B6B] mb-4">Sob Consulta</div>
                                <p className="text-slate-500 text-sm mb-8">Venda online com segurança, gestão de estoque e pagamentos.</p>

                                <ul className="space-y-4 mb-8">
                                    {[
                                        "Loja Virtual Completa",
                                        "Gestão de Pedidos/Estoque",
                                        "Cálculo de Frete (Correios)",
                                        "Gateway de Pagamentos",
                                        "Área do Cliente",
                                        "Painel de Vendas"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                                            <CheckIcon className="w-4 h-4 text-[#FF4B6B]" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="/todos-os-servicos/criacao-sites/plano-empresarial"
                                    className="block w-full py-4 text-center rounded-xl border border-white/10 text-white font-bold hover:bg-white hover:text-black transition-all duration-300"
                                >
                                    Solicitar Proposta
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
