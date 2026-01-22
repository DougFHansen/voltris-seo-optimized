'use client';

import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import TechFloatingElements from '@/components/TechFloatingElements';
import { FiCpu, FiHardDrive, FiActivity, FiZap, FiShield, FiWifi, FiSettings, FiMonitor, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function GamersClient() {
    const [activeSection, setActiveSection] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const { scrollYProgress } = useScroll();
    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Efeito de parallax para background e navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Features principais com foco em SEO e Conversão
    const features = [
        {
            icon: <FiCpu className="w-8 h-8" />,
            title: 'Otimização de Processador (CPU)',
            description: 'Gerenciamento inteligente de núcleos e threads. Prioriza jogos em tempo real, evitando gargalos e drops de FPS durante tiroteios intensos.',
            gradient: 'from-[#FF4B6B] to-[#FF8F4B]'
        },
        {
            icon: <FiZap className="w-8 h-8" />,
            title: 'Aumento de FPS e Estabilidade',
            description: 'Libere todo o potencial da sua GPU. Algoritmos que ajustam a fila de renderização para extrair máximos quadros por segundo.',
            gradient: 'from-[#8B31FF] to-[#B070FF]'
        },
        {
            icon: <FiActivity className="w-8 h-8" />,
            title: 'Redução de Input Lag',
            description: 'Diminua a latência entre o clique e a ação. Otimizações de timer resolution e interrupções de sistema para resposta instantânea.',
            gradient: 'from-[#31A8FF] to-[#5FC2FF]'
        },
        {
            icon: <FiHardDrive className="w-8 h-8" />,
            title: 'Limpeza de Disco Inteligente',
            description: 'Muito além de deletar arquivos temporários. Desfragmentação otimizada para SSDs e remoção de bloatware que consome recursos.',
            gradient: 'from-[#00E5FF] to-[#00FFCA]'
        },
        {
            icon: <FiWifi className="w-8 h-8" />,
            title: 'Otimizador de Rede e Ping',
            description: 'Estabilize sua conexão. Ajustes de TCP/IP e DNS para reduzir jitter, packet loss e manter o ping baixo em jogos competitivos.',
            gradient: 'from-[#FFD700] to-[#FFAA00]'
        },
        {
            icon: <FiSettings className="w-8 h-8" />,
            title: 'Tweaks de Windows Avançados',
            description: 'Desativa serviços inúteis do Windows que rodam em segundo plano, liberando memória RAM e CPU exclusivamente para seus jogos.',
            gradient: 'from-[#FF0055] to-[#FF5588]'
        }
    ];

    // Comparativo SEO - "Alternativa a otimizadores tradicionais"
    const comparisonData = [
        { text: 'Otimização Real de Kernel', us: true, others: false },
        { text: 'Sem Propagandas ou Bloatware', us: true, others: false },
        { text: 'Ajuste Automático por Hardware', us: true, others: false },
        { text: 'Limpeza Segura de Registro', us: true, others: false },
        { text: 'Suporte Técnico Especializado', us: true, others: false },
        { text: 'Foco em Gamers Competitivos', us: true, others: false },
    ];

    // Métricas de performance (Social Proof)
    const performanceMetrics = [
        { value: '+30%', label: 'FPS Médio', description: 'Ganho performance bruta' },
        { value: '-45%', label: 'Input Lag', description: 'Resposta mais rápida' },
        { value: '0%', label: 'Bloatware', description: 'Sistema limpo e leve' },
        { value: '24/7', label: 'Estabilidade', description: 'Sem crashes ou telas azuis' },
    ];

    return (
        <>
            <Header />
            <div className="min-h-screen bg-[#0A0A0F] text-white overflow-x-hidden selection:bg-purple-500/30 selection:text-white">

                {/* SEO - Structured Data */}
                <Script
                    id="software-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "SoftwareApplication",
                            "name": "VOLTRIS PC Optimizer Gamer",
                            "applicationCategory": "UtilitiesApplication",
                            "operatingSystem": "Windows 10, Windows 11",
                            "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": "BRL"
                            },
                            "description": "O melhor programa para otimizar PC e notebook gamer. Aumente FPS, reduza input lag e limpe o Windows com segurança.",
                            "aggregateRating": {
                                "@type": "AggregateRating",
                                "ratingValue": "4.9",
                                "ratingCount": "1250"
                            }
                        })
                    }}
                />

                {/* Hero Section Fullscreen Moderno */}
                <AnimatedSection>
                    <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">

                        {/* Advanced Cyberpunk Background */}
                        <div className="absolute inset-0 z-0 bg-[#0A0A0F]">
                            {/* Grid Overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]"></div>

                            {/* Floating Orbs */}
                            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
                            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

                            {/* Tech Particles */}
                            <TechFloatingElements />
                        </div>

                        <div className="max-w-7xl mx-auto text-center relative z-10 w-full px-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                style={{
                                    x: mousePosition.x,
                                    y: mousePosition.y
                                }}
                                className="mb-8 flex flex-col items-center"
                            >
                                <motion.div
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md rounded-full px-5 py-2 mb-8 border border-white/10 hover:border-purple-500/50 transition-colors group cursor-default shadow-[0_0_20px_rgba(139,49,255,0.2)]"
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors tracking-wide">
                                        V 3.0 • DISPONÍVEL AGORA
                                    </span>
                                </motion.div>

                                <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white mb-6 leading-none tracking-tighter">
                                    <span className="block mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] animate-gradient-x drop-shadow-[0_0_30px_rgba(139,49,255,0.3)]">
                                        VOLTRIS OPTIMIZER
                                    </span>
                                    <span className="text-4xl sm:text-5xl md:text-6xl text-white/90 font-bold tracking-tight">
                                        ENTERPRISE EDITION
                                    </span>
                                </h1>

                                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light mt-4">
                                    A ferramenta definitiva. Aumente seu FPS, reduza lags e elimine stutters com a tecnologia proprietária de otimização de kernel.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full max-w-lg mx-auto">
                                    <Link
                                        href="/otimizacao-pc"
                                        className="w-full sm:w-auto flex-1 group relative px-8 py-5 bg-white text-black font-black text-xl rounded-xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(49,168,255,0.4)]"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] opacity-100 group-hover:opacity-90 transition-opacity"></div>
                                        <span className="relative z-10 flex items-center justify-center gap-3 text-white uppercase tracking-wider">
                                            <FiZap className="w-6 h-6 fill-white" />
                                            Download
                                        </span>
                                    </Link>

                                    <Link
                                        href="/servicos"
                                        className="w-full sm:w-auto flex-1 px-8 py-5 bg-black/40 text-white font-bold text-lg rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-2 backdrop-blur-md uppercase tracking-wide"
                                    >
                                        Ver Recursos
                                    </Link>
                                </div>
                            </motion.div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 border-t border-white/5 pt-8">
                                {[
                                    { label: 'Segurança Total', sub: 'Sem risco ao hardware' },
                                    { label: 'Garantia de 7 Dias', sub: 'Satisfação ou reembolso' },
                                    { label: 'Suporte BR', sub: 'Atendimento via WhatsApp' },
                                    { label: 'Download Seguro', sub: 'Livre de vírus/malware' },
                                ].map((item, i) => (
                                    <div key={i} className="text-center">
                                        <div className="text-white font-bold text-lg">{item.label}</div>
                                        <div className="text-gray-500 text-sm">{item.sub}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </AnimatedSection>

                {/* Problema vs Solução (SEO Content) */}
                <AnimatedSection>
                    <section className="py-24 px-4 bg-[#0F0F16]">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid md:grid-cols-2 gap-16 items-center">
                                <div>
                                    <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                                        Por que seu PC <span className="text-red-500">perde desempenho</span> com o tempo?
                                    </h2>
                                    <div className="space-y-6 text-gray-400 text-lg">
                                        <p>
                                            Otimizadores tradicionais (limpadores gratuitos) apenas apagam cookies e cache, dando uma falsa sensação de velocidade. Enquanto isso, seu Windows acumula:
                                        </p>
                                        <ul className="space-y-3">
                                            <li className="flex items-center gap-3"><FiXCircle className="text-red-500 flex-shrink-0" /> Processos "fantasmas" consumindo memória RAM</li>
                                            <li className="flex items-center gap-3"><FiXCircle className="text-red-500 flex-shrink-0" /> Serviços de telemetria espionando e usando rede</li>
                                            <li className="flex items-center gap-3"><FiXCircle className="text-red-500 flex-shrink-0" /> Drivers genéricos que limitam sua GPU</li>
                                            <li className="flex items-center gap-3"><FiXCircle className="text-red-500 flex-shrink-0" /> Configurações de energia que "capam" o processador</li>
                                        </ul>
                                        <p className="font-medium text-white pt-4">
                                            Você precisa de mais do que uma limpeza básica. Você precisa de uma reestruturação de sistema.
                                        </p>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
                                    <div className="relative bg-[#1a1a20] border border-white/10 rounded-3xl p-8 shadow-2xl">
                                        <h3 className="text-2xl font-bold text-white mb-6">A Diferença VOLTRIS</h3>
                                        <div className="space-y-4">
                                            {comparisonData.map((item, i) => (
                                                <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                                    <span className="text-gray-300 font-medium">{item.text}</span>
                                                    <div className="flex items-center gap-8">
                                                        <div className="flex flex-col items-center gap-1">
                                                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Genéricos</span>
                                                            {item.others ? <FiCheckCircle className="text-green-500" /> : <FiXCircle className="text-red-500/50" />}
                                                        </div>
                                                        <div className="flex flex-col items-center gap-1">
                                                            <span className="text-[10px] text-[#8B31FF] uppercase tracking-wider font-bold">Voltris</span>
                                                            {item.us ? <FiCheckCircle className="text-[#8B31FF] w-6 h-6" /> : <FiXCircle className="text-red-500" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </AnimatedSection>

                {/* Features Grid - Keywords Focus */}
                <AnimatedSection>
                    <section className="py-24 px-4 relative overflow-hidden">
                        <div className="max-w-7xl mx-auto relative z-10">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-5xl font-bold mb-6">Funcionalidades de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Nível Enterprise</span></h2>
                                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                                    O conjunto de ferramentas mais completo do mercado para diagnosticar, reparar e acelerar computadores e notebooks.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {features.map((feature, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ y: -5 }}
                                        className="bg-[#15151A] p-8 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all group"
                                    >
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                        <p className="text-gray-400 leading-relaxed text-sm">
                                            {feature.description}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                </AnimatedSection>

                {/* Stats Section */}
                <AnimatedSection>
                    <section className="py-20 px-4">
                        <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#1A1A22] to-[#15151A] rounded-[2.5rem] p-12 overflow-hidden relative border border-white/5">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"></div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                                {performanceMetrics.map((stat, i) => (
                                    <div key={i} className="text-center">
                                        <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 mb-2">
                                            {stat.value}
                                        </div>
                                        <div className="text-white font-bold mb-1">{stat.label}</div>
                                        <div className="text-gray-500 text-sm">{stat.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </AnimatedSection>

                {/* FAQ SEO */}
                <AnimatedSection>
                    <section className="py-20 px-4 max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes sobre Otimização de PC</h2>
                        <div className="space-y-4">
                            <details className="group bg-[#15151A] p-6 rounded-2xl border border-white/5 open:border-purple-500/30 transition-all cursor-pointer">
                                <summary className="flex justify-between items-center font-bold text-lg list-none">
                                    O software de otimização é seguro?
                                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="mt-4 text-gray-400">
                                    Sim. Diferente de otimizadores agressivos, o Voltris cria um ponto de restauração automático antes de qualquer alteração. Além disso, nossas modificações são validadas para não prejudicar a vida útil do hardware (CPU/GPU).
                                </p>
                            </details>
                            <details className="group bg-[#15151A] p-6 rounded-2xl border border-white/5 open:border-purple-500/30 transition-all cursor-pointer">
                                <summary className="flex justify-between items-center font-bold text-lg list-none">
                                    Funciona em Notebooks e Laptops?
                                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="mt-4 text-gray-400">
                                    Perfeitamente. Inclusive, notebooks costumam ter ganhos maiores devido ao gerenciamento térmico deficiente de fábrica. Nosso otimizador ajusta as curvas de fan e voltagem (se suportado) para evitar thermal throttling.
                                </p>
                            </details>
                            <details className="group bg-[#15151A] p-6 rounded-2xl border border-white/5 open:border-purple-500/30 transition-all cursor-pointer">
                                <summary className="flex justify-between items-center font-bold text-lg list-none">
                                    Qual a diferença entre Formatação e Otimização?
                                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="mt-4 text-gray-400">
                                    Formatar apaga tudo e reinstala o Windows (o que resolve erros graves). A Otimização Voltris ajusta o Windows já instalado para extrair máxima performance, sem você perder seus arquivos de jogos e configurações pessoais.
                                </p>
                            </details>
                        </div>
                    </section>
                </AnimatedSection>

                {/* CTA Final */}
                <section className="py-32 px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-black mb-8">
                            Transforme seu PC em uma <br />
                            <span className="text-purple-500">Máquina Competitiva</span>
                        </h2>
                        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                            Junte-se à elite. Pare de sofrer com FPS baixo e comece a jogar com todo o potencial do seu equipamento hoje mesmo.
                        </p>

                        <Link
                            href="/servicos?service=otimizacao"
                            className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black font-black text-xl rounded-full hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all"
                        >
                            <FiZap className="w-6 h-6" />
                            QUERO OTIMIZAR MEU PC AGORA
                        </Link>
                        <p className="mt-6 text-sm text-gray-500">
                            Compatível com Windows 10 e 11 • Processo 100% Assistido
                        </p>
                    </div>
                </section>

            </div>
            <Footer />
        </>
    );
}
