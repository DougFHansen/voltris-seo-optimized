"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MonitorSmartphone, Globe, Target, Code, CheckCircle, Rocket, Layers, Layout } from 'lucide-react';
import TechFloatingElements from '@/components/TechFloatingElements';

const plans = [
    {
        name: "Plano Básico",
        price: "R$ 997,90",
        description: "Site institucional simples e responsivo",
        features: [
            "Design responsivo",
            "Até 5 páginas",
            "Formulário de contato",
            "Otimização SEO básica",
            "Suporte por 30 dias",
            "Hospedagem inclusa"
        ],
        icon: <Layout className="w-8 h-8 text-[#31A8FF]" />
    },
    {
        name: "Plano Profissional",
        price: "R$ 1.997,90",
        description: "Site profissional com recursos avançados",
        features: [
            "Design personalizado",
            "Até 10 páginas",
            "Blog integrado",
            "Otimização SEO completa",
            "Analytics integrado",
            "Suporte por 90 dias",
            "Hospedagem inclusa"
        ],
        icon: <Layers className="w-8 h-8 text-[#8B31FF]" />
    },
    {
        name: "Plano Empresarial",
        price: "R$ 2.997,90",
        description: "Site completo com e-commerce",
        features: [
            "Design exclusivo",
            "Páginas ilimitadas",
            "E-commerce integrado",
            "SEO avançado",
            "Marketing digital",
            "Suporte por 1 ano",
            "Hospedagem premium"
        ],
        icon: <Rocket className="w-8 h-8 text-[#00FF94]" />
    }
];

const technologies = [
    "React.js",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "WordPress",
    "SEO Otimizado",
    "Mobile First",
    "Performance"
];

const benefits = [
    "Design moderno e responsivo",
    "Otimização para SEO",
    "Carregamento rápido",
    "Suporte técnico completo",
    "Hospedagem inclusa",
    "Domínio personalizado"
];

export default function CriarSiteClient() {
    return (
        <>
            <Header />
            <main className="bg-[#050510] min-h-screen relative overflow-x-hidden font-sans selection:bg-[#31A8FF]/30">

                {/* Background Effects (Global) */}
                <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-0"></div>
                <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-[#31A8FF]/5 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow max-w-full pointer-events-none z-0"></div>
                <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-[#8B31FF]/5 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow max-w-full pointer-events-none z-0"></div>

                {/* Hero Section */}
                <section className="min-h-[100dvh] flex flex-col items-center justify-center relative z-10 w-full">
                    <TechFloatingElements />

                    <div className="container mx-auto px-4 text-center flex-grow flex flex-col items-center justify-center w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-full max-w-5xl"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:border-[#31A8FF]/30 transition-all cursor-default text-white">
                                <span className="flex h-2 w-2 rounded-full bg-[#31A8FF] shadow-[0_0_8px_#31A8FF] animate-pulse"></span>
                                <span className="text-xs sm:text-sm font-medium tracking-wide font-sans">Desenvolvimento Exclusivo</span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight font-sans">
                                Criar seu <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text animate-gradient-x">Site Profissional</span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                                Nós transformamos sua presença digital com sites de alta performance, design premium e SEO nativo. O seu negócio merece o melhor.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/todos-os-servicos/criacao-sites"
                                    className="px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 font-sans"
                                >
                                    <Globe className="w-5 h-5" /> Iniciar Agora
                                </Link>
                                <button
                                    onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 font-sans"
                                >
                                    <MonitorSmartphone className="w-5 h-5" /> Ver Planos
                                </button>
                            </div>
                        </motion.div>
                    </div>


                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer text-slate-500 hover:text-white transition-colors"
                        onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <span className="text-xs uppercase tracking-widest font-sans">Scroll</span>
                        <div className="w-[1px] h-12 bg-gradient-to-b from-[#31A8FF] to-transparent"></div>
                    </motion.div>
                </section>

                {/* Stats Section */}
                <section id="stats" className="py-24 px-4 bg-[#0A0A0F] relative z-10 w-full border-t border-white/5">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { val: "100+", label: "Sites Criados" },
                                { val: "100%", label: "Responsivos" },
                                { val: "Top 1", label: "Rank SEO" },
                                { val: "24/7", label: "Suporte" }
                            ].map((stat, i) => (
                                <div key={i} className="text-center group p-6 rounded-2xl hover:bg-white/5 transition-all">
                                    <div className="text-4xl font-bold bg-gradient-to-br from-[#31A8FF] to-[#8B31FF] text-transparent bg-clip-text mb-2 group-hover:scale-110 transition-transform font-sans">{stat.val}</div>
                                    <div className="text-slate-500 font-medium uppercase tracking-wider text-sm font-sans">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Plans Section */}
                <section id="planos" className="py-24 px-4 relative z-10 w-full">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-sans">Planos & Investimento</h2>
                            <p className="text-slate-400 font-sans">Escolha a solução que melhor se adapta ao seu momento.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {plans.map((plan, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ y: -8 }}
                                    className={`group relative bg-[#121218] backdrop-blur-sm p-1 rounded-[32px] border ${index === 1 ? 'border-[#31A8FF]/50' : 'border-white/5'} flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:shadow-[#31A8FF]/10`}
                                >
                                    {index === 1 && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#31A8FF] text-white px-4 py-1 rounded-full text-xs font-bold z-20 font-sans">
                                            MAIS POPULAR
                                        </div>
                                    )}
                                    <div className="relative h-full bg-[#121218] rounded-[28px] p-8 flex flex-col">

                                        <div className="flex items-center justify-between mb-8">
                                            <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-[#31A8FF]/10 transition-colors">
                                                {plan.icon}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-slate-500 text-xs font-medium font-sans">A partir de</div>
                                                <div className="text-xl font-bold text-white font-sans">{plan.price}</div>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-bold text-white mb-2 font-sans">{plan.name}</h3>
                                        <p className="text-slate-400 text-sm mb-8 font-sans">{plan.description}</p>

                                        <div className="h-[2px] w-full bg-white/5 mb-8"></div>

                                        <ul className="space-y-4 mb-10 flex-grow">
                                            {plan.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-center gap-3">
                                                    <CheckCircle className="w-4 h-4 text-[#00FF94] flex-shrink-0" />
                                                    <span className="text-slate-300 text-sm font-sans">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <Link
                                            href="/todos-os-servicos/criacao-sites"
                                            className={`w-full py-4 rounded-xl text-center font-bold transition-all font-sans ${index === 1
                                                ? 'bg-[#31A8FF] text-white hover:bg-[#2B8FD9] shadow-[0_0_20px_rgba(49,168,255,0.3)]'
                                                : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                                                }`}
                                        >
                                            Contratar {plan.name}
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Technologies Section */}
                <section className="py-24 px-4 bg-[#0A0A0F] relative z-10 border-t border-white/5">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-white mb-4 font-sans">Stack Tecnológica</h2>
                            <p className="text-slate-400 font-sans">Desenvolvemos com o que há de mais moderno no mercado.</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {technologies.map((tech, index) => (
                                <div key={index} className="bg-[#121218] border border-white/5 rounded-2xl p-6 text-center hover:border-[#31A8FF]/30 transition-all group">
                                    <h3 className="text-white font-medium group-hover:text-[#31A8FF] transition-colors font-sans">{tech}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-4 relative z-10 text-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#31A8FF]/5 to-transparent pointer-events-none"></div>
                    <div className="max-w-4xl mx-auto relative px-6 py-16 rounded-[40px] border border-white/5 bg-[#0D0D15]/80 backdrop-blur-xl">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 font-sans">
                            Vamos construir algo incrível juntos?
                        </h2>
                        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto font-sans">
                            Sua empresa pronta para o próximo nível. Comece hoje a sua transformação digital com a VOLTRIS.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/contato"
                                className="px-10 py-5 rounded-2xl bg-[#31A8FF] text-white font-bold text-lg hover:bg-[#2B8FD9] transition-all shadow-[0_0_40px_rgba(49,168,255,0.2)] font-sans"
                            >
                                Falar com Especialista
                            </Link>
                            <Link
                                href="/todos-os-servicos/criacao-sites"
                                className="px-10 py-5 rounded-2xl bg-white/5 text-white border border-white/10 font-bold text-lg hover:bg-white/10 transition-all font-sans"
                            >
                                Ver Orçamento
                            </Link>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </>
    );
}
