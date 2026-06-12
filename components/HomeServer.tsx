import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeClient from "@/components/HomeClient";
import OptimizerMockupWrapper from "@/components/OptimizerMockupWrapper";
import Link from "next/link";
import {
    FiAlertTriangle,
    FiShield,
} from 'react-icons/fi';
import { MonitorSmartphone, Laptop2, ShieldCheck, HardDrive, GaugeCircle, Database, Package, Printer, Cpu, Zap, Activity, ChevronRight, BarChart3, Lock, Wrench, Rocket, Check, Briefcase, Download } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import AboutSection from "./sections/AboutSection";
import ServicesSection from "./sections/ServicesSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import FAQSection from "@/components/FAQSection";

const services = [
    {
        icon: <Zap className="w-8 h-8" />,
        title: "Voltris Optimizer",
        desc: "Aumente FPS, reduza input lag e otimize o Windows com apenas 1 clique usando nosso software de alta performance.",
        price: "Licença a partir de R$ 49,90",
        link: "/voltrisoptimizer",
        highlight: true
    },
    {
        icon: <Activity className="w-8 h-8" />,
        title: "Otimização Avançada Gamer",
        desc: "Acesso remoto por especialista para overclock de RAM, CPU e tunning profundo de kernel voltado para eSports.",
        price: "A partir de R$ 197,00",
        link: "/otimizacao-pc",
        highlight: true
    },
    {
        icon: <FiAlertTriangle className="w-8 h-8" />,
        title: "Correção de Erros no Windows",
        desc: "Resolvemos erros de sistema, telas azuis, falhas de inicialização e problemas de desempenho no Windows remotamente.",
        price: "A partir de R$ 97,00",
        link: "/todos-os-servicos/suporte-ao-windows",
        highlight: false
    },
    {
        icon: <FiShield className="w-8 h-8" />,
        title: "Suporte Técnico Expresso",
        desc: "Remoção de vírus, malwares e formatação remota completa com backup seguro para PCs e Notebooks.",
        price: "A partir de R$ 147,00",
        link: "/formatacao",
        highlight: false
    }
];

export default function HomeServer() {
    return (
        <>
            <Header />
            
            {/* JSON-LD Schema Markup (Server-side para SEO) */}
            <JsonLd
                type="SoftwareApplication"
                data={{
                    name: "Voltris Optimizer",
                    operatingSystem: "Windows 10, Windows 11",
                    applicationCategory: "UtilitiesApplication",
                    description: "Software avançado de otimização de PC para gamers e profissionais. Aumenta FPS, reduz latência de kernel e melhora o desempenho do sistema Windows.",
                    offers: {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "BRL"
                    },
                    aggregateRating: {
                        "@type": "AggregateRating",
                        "ratingValue": "4.9",
                        "reviewCount": "1250"
                    }
                }}
            />
            <JsonLd
                type="Service"
                data={{
                    name: "Suporte Técnico Remoto e Formatação",
                    description: "Serviços especializados de TI, formatação de Windows, otimização de computadores e remoção de vírus com atendimento imediato via acesso remoto.",
                    provider: {
                        "@type": "Organization",
                        "name": "VOLTRIS",
                        "url": "https://www.voltris.com.br"
                    },
                    serviceType: "Suporte Técnico de Informática",
                    areaServed: { "@type": "Country", "name": "Brasil" },
                    offers: {
                        "@type": "Offer",
                        "price": "100.00",
                        "priceCurrency": "BRL"
                    }
                }}
            />
            <JsonLd
                type="FAQPage"
                data={{
                    mainEntity: [
                        {
                            "@type": "Question",
                            "name": "Como aumentar o FPS em jogos no Windows?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Para aumentar o FPS, você pode usar o Voltris Optimizer para desabilitar serviços inúteis do Windows, otimizar o plano de energia, limpar arquivos temporários e ajustar a latência do sistema para o hardware específico."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "A VOLTRIS faz formatação de PC remota?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Sim, realizamos formatação de computador e notebook de forma remota e segura, com backup de dados e instalação de drivers otimizados para máxima performance."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Como o Voltris Optimizer melhora o desempenho do trabalho?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "O software remove processos em segundo plano que consomem CPU e RAM, garantindo que suas ferramentas de trabalho (Office, Adobe, Navegadores) tenham prioridade máxima de hardware."
                            }
                        }
                    ]
                }}
            />
            
            <main className="relative">
                {/* --- HERO SECTION (SERVER-SIDE) --- */}
                <section
                    className="
                    relative
                    w-full
                    min-h-screen
                    bg-[#020205]
                    overflow-hidden
                    flex
                    flex-col
                    items-center
                    justify-center
                    px-4
                    sm:px-6
                    lg:px-12
                    xl:px-24
                    pt-24
                    pb-8
                    lg:pt-24
                    lg:pb-12
                "
                    aria-label="Software de otimização de PC para Windows - Voltris Optimizer"
                >
                    {/* Noise Texture Layer */}
                    <div className="absolute inset-0 noise-bg z-[1]" />

                    {/* Background Radial Glows - Enterprise Level */}
                    <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] rounded-full bg-[#31A8FF]/10 blur-[180px] pointer-events-none z-0" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] rounded-full bg-[#8B31FF]/10 blur-[180px] pointer-events-none z-0" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] rounded-full bg-[#FF4B6B]/5 blur-[200px] pointer-events-none z-0" />

                    {/* Placeholder para Particle Background (será client-side via createPortal) */}
                    <div id="particle-background-placeholder" className="absolute inset-0 overflow-hidden pointer-events-none z-[2]"></div>

                    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-center justify-between gap-4 sm:gap-6 lg:gap-12 h-full relative z-[10]">

                        {/* Layout Wrapper */}
                        <div className="contents lg:flex lg:flex-col lg:flex-1 lg:items-start lg:gap-10 z-20">

                            {/* Text Content Block */}
                            <div className="flex flex-col items-center lg:items-start gap-3 lg:gap-6 w-full order-1">
                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-2">
                                    <span className="flex h-2 w-2 rounded-full bg-[#00FF88] shadow-[0_0_12px_rgba(0,255,136,0.8)] animate-pulse"></span>
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-white/70">Software Inteligente & Especialistas Reais</span>
                                </div>

                                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight font-sans lg:mt-4">
                                    <span className="text-gradient-premium">Seu PC Mais Rápido.</span> <br className="hidden lg:block" />
                                    <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(139,49,255,0.3)]">Sem Complicações.</span>
                                </h1>

                                <p className="text-sm sm:text-base lg:text-lg text-slate-400 max-w-xl leading-relaxed font-medium px-2 sm:px-0">
                                    Aumente o FPS em jogos e acabe com a lentidão. Otimize sozinho usando nosso software <strong className="text-white">Voltris Optimizer</strong> ou deixe que nossos <strong className="text-white">Especialistas</strong> façam tudo por você de forma remota.
                                </p>
                            </div>

                            {/* Buttons Block */}
                            <div className="flex flex-col sm:flex-row gap-4 lg:gap-5 w-full sm:w-auto z-30 order-3">
                                <a
                                    href="/voltrisoptimizer"
                                    className="group relative inline-flex items-center justify-center px-8 py-4 font-black text-white transition-all duration-300 bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] rounded-2xl hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(49,168,255,0.4)] overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-2 uppercase tracking-widest text-xs">
                                        Baixar Optimizer
                                        <Download className="w-4 h-4 transition-transform group-hover:translate-y-1" />
                                    </span>
                                </a>
                                <a
                                    href="https://wa.me/5511996716235?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20remotos%20de%20suporte%20e%20otimiza%C3%A7%C3%A3o"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center px-8 py-4 font-black text-white transition-all duration-300 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 uppercase tracking-widest text-xs"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="mr-2">
                                        <path d="M17.472 14.387c-.3-.1-1.7-.8-1.9-1.4-.3-.5-.1-.8.2-1.1.3-.3.6-.7.9-1.1.3-.4.4-.5.6-.5.2 0 .4-.1.5-.4.1-.3 0-.8-.4-1.5-.5-.8-1.4-2.1-2.6-2.1-1.3 0-2.1.8-2.9 1.6-.8.8-1.3 1.3-2.5 1.3-.8 0-1.4-.4-1.9-.9-.5-.5-.7-.7-1.2-1.1 0 0-.4-.3-.6-.8-.2-.5-.6-1.5-.6-2.9 0-1.4.9-2.7 2.1-3.7 1.1-1 2.5-1.6 4.1-1.6 1.7 0 3.1.6 4.2 1.6 1 .9 1.6 2.1 1.6 3.5 0 1.4-.6 2.6-1.6 3.4zm-6.5-3.2c.2 1.1.8 2 1.6 2.6.9.6 2.1.9 3.2.9 1.1 0 2.3-.3 3.2-.9.8-.6 1.4-1.5 1.6-2.6.2-1.1-.1-2.3-.7-3.2-.6-.8-1.5-1.4-2.6-1.6-1.1-.2-2.3.1-3.2.7-.8.6-1.4 1.5-1.6 2.6z" />
                                    </svg>
                                    Falar com Especialista
                                </a>
                            </div>
                        </div>

                        {/* OptimizerMockup renderizado diretamente (Client Component via wrapper) */}
                        <div className="order-2 lg:order-none flex-1 w-full max-w-[320px] xs:max-w-[400px] sm:max-w-[500px] lg:max-w-full relative flex items-center justify-center perspective animate-float mt-2 lg:mt-0">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#31A8FF]/30 to-[#FF4B6B]/30 blur-[120px] rounded-full transform scale-75 animate-pulse"></div>
                            <div className="relative z-10 w-full transform -rotate-2 hover:rotate-0 transition-transform duration-700">
                                <OptimizerMockupWrapper />
                            </div>
                        </div>
                    </div>
                </section>

                <AboutSection />
                
                {/* --- CHOOSE YOUR PATH (SOFTWARE VS SERVICE) --- */}
                <section className="py-24 px-4 bg-[#050508] relative overflow-hidden border-y border-white/5">
                    <div className="max-w-5xl mx-auto relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Escolha a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Sua Solução</span></h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">Você prefere que o software faça tudo automaticamente ou deseja a intervenção e análise de um especialista humano?</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Software Option */}
                            <div className="group relative p-10 rounded-[2.5rem] bg-[#0A0A0F] border border-blue-500/20 hover:border-blue-500/50 transition-all overflow-hidden flex flex-col items-center text-center">
                                <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />
                                <div className="mb-6 p-4 rounded-full bg-blue-500/10 text-blue-400">
                                    <Rocket className="w-10 h-10" />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-4">Voltris Optimizer</h3>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-bold text-white mb-6">
                                    FAÇA VOCÊ MESMO
                                </div>
                                <p className="text-slate-400 mb-8 leading-relaxed">Software inteligente para otimização automática. Você instala, clica e o sistema acelera seu Windows e seus jogos sem precisar entender de TI.</p>
                                <ul className="space-y-3 mb-10 w-full text-left text-sm text-slate-300">
                                    <li className="flex items-center gap-2"><Check className="text-blue-500 w-4 h-4" /> Licença a partir de R$ 49,90</li>
                                    <li className="flex items-center gap-2"><Check className="text-blue-500 w-4 h-4" /> 1-Clique para otimizar</li>
                                    <li className="flex items-center gap-2"><Check className="text-blue-500 w-4 h-4" /> Aumento extremo de FPS</li>
                                </ul>
                                <Link href="/voltrisoptimizer" className="mt-auto w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all text-center tracking-wide uppercase text-sm">
                                    Conhecer o Software
                                </Link>
                            </div>

                            {/* Service Option */}
                            <div className="group relative p-10 rounded-[2.5rem] bg-[#0A0A0F] border border-emerald-500/20 hover:border-emerald-500/50 transition-all overflow-hidden flex flex-col items-center text-center">
                                <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/5 to-transparent pointer-events-none" />
                                <div className="mb-6 p-4 rounded-full bg-emerald-500/10 text-emerald-400">
                                    <Briefcase className="w-10 h-10" />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-4">Suporte & Formatação</h3>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-bold text-white mb-6">
                                    DEIXE COM A GENTE
                                </div>
                                <p className="text-slate-400 mb-8 leading-relaxed">Agende um atendimento. Nossos técnicos assumem o controle remotamente, formatam, tiram vírus e otimizam seu computador do zero com garantia.</p>
                                <ul className="space-y-3 mb-10 w-full text-left text-sm text-slate-300">
                                    <li className="flex items-center gap-2"><Check className="text-emerald-500 w-4 h-4" /> Atendimento humano premium</li>
                                    <li className="flex items-center gap-2"><Check className="text-emerald-500 w-4 h-4" /> Formatação e Otimização Profunda</li>
                                    <li className="flex items-center gap-2"><Check className="text-emerald-500 w-4 h-4" /> Você não faz absolutamente nada</li>
                                </ul>
                                <Link href="/todos-os-servicos" className="mt-auto w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all text-center tracking-wide uppercase text-sm">
                                    Ver Nossos Serviços
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <ServicesSection />

                {/* --- OPTIMIZER SECTION (SERVER-SIDE) --- */}
                <section id="optimizer" className="relative py-20 lg:py-32 bg-white overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/50 to-purple-100/50 blur-[150px] rounded-full pointer-events-none animate-pulse-slow"></div>
                    <div className="absolute bottom-1/4 -left-20 w-[600px] h-[600px] bg-gradient-to-br from-purple-100/50 to-blue-100/50 blur-[150px] rounded-full pointer-events-none animate-pulse-slow"></div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                        {/* Header */}
                        <div className="text-center mb-16 max-w-4xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 backdrop-blur-md mb-4">
                                <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                                <span className="text-xs font-bold text-blue-700 tracking-widest uppercase">Primeiro Software Brasileiro com Controle Remoto</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">VOLTRIS</span> <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-transparent bg-clip-text">OPTIMIZER</span>
                            </h2>
                            <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed mb-4">
                                Software de otimização de PC com controle remoto via web.
                                Aumente FPS em jogos, otimize para streaming e acelere computadores corporativos.
                            </p>
                            <p className="text-base text-gray-500 leading-relaxed">
                                Tecnologia inovadora brasileira para gamers, streamers, empresas e usuários domésticos.
                                Execute otimizações remotamente de qualquer lugar do mundo através do painel web.
                            </p>
                        </div>

                        {/* Bento Grid Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Feature 1 - Gamers */}
                            <div className="group relative bg-white border border-gray-200 rounded-2xl p-8 hover:border-pink-300 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md">
                                <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-6 text-pink-600 group-hover:scale-110 transition-transform duration-200 border border-pink-200">
                                        <Rocket className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Para Gamers e Streamers</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                        Aumente FPS, reduza input lag e elimine travamentos em jogos competitivos. Otimização específica para Valorant, CS2, League of Legends e streaming com OBS.
                                    </p>
                                    <ul className="space-y-2 text-xs text-gray-500">
                                        <li className="flex items-center gap-2">
                                            <Check className="w-3 h-3 text-pink-600" />
                                            Redução de lag no Windows
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="w-3 h-3 text-pink-600" />
                                            Melhor desempenho para OBS
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="w-3 h-3 text-pink-600" />
                                            Frames estáveis (1% Lows)
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Feature 2 - Empresas */}
                            <div className="group relative bg-white border border-gray-200 rounded-2xl p-8 hover:border-blue-300 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-200 border border-blue-200">
                                        <Laptop2 className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Para Empresas e Escritórios</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                        Otimize computadores corporativos para Office, Adobe e ferramentas de produtividade. Reduza tempo de boot e melhore a resposta do sistema.
                                    </p>
                                    <ul className="space-y-2 text-xs text-gray-500">
                                        <li className="flex items-center gap-2">
                                            <Check className="w-3 h-3 text-blue-600" />
                                            Boot mais rápido
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="w-3 h-3 text-blue-600" />
                                            Prioridade para Office
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="w-3 h-3 text-blue-600" />
                                            Economia de energia
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Feature 3 - Doméstico */}
                            <div className="group relative bg-white border border-gray-200 rounded-2xl p-8 hover:border-purple-300 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform duration-200 border border-purple-200">
                                        <MonitorSmartphone className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Para Uso Doméstico</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                        Limpeza de arquivos temporários, desfragmentação inteligente e otimização de espaço em disco para PCs familiares.
                                    </p>
                                    <ul className="space-y-2 text-xs text-gray-500">
                                        <li className="flex items-center gap-2">
                                            <Check className="w-3 h-3 text-purple-600" />
                                            Limpeza automática
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="w-3 h-3 text-purple-600" />
                                            Mais espaço em disco
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="w-3 h-3 text-purple-600" />
                                            Sistema mais fluido
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="text-center mt-12">
                            <a
                                href="/voltrisoptimizer"
                                className="inline-flex items-center justify-center px-10 py-5 font-black text-white transition-all duration-300 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl hover:scale-105 hover:shadow-lg uppercase tracking-widest text-sm"
                            >
                                Baixar Voltris Optimizer
                            </a>
                        </div>
                    </div>
                </section>

                <TestimonialsSection />
                <FAQSection />
            </main>

            {/* HomeClient para gerenciar elementos interativos via createPortal */}
            <HomeClient />

            <Footer />
        </>
    );
}
