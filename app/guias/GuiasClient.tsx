'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiBookOpen, FiClock, FiMonitor, FiCpu, FiShield, FiWifi, FiArrowRight } from 'react-icons/fi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TechFloatingElements from '@/components/TechFloatingElements';
import AnimatedSection from '@/components/AnimatedSection';

const categories = [
    { id: 'windows', name: 'Windows & Sistema', icon: <FiMonitor />, color: 'from-blue-500 to-cyan-500' },
    { id: 'hardware', name: 'Hardware & Montagem', icon: <FiCpu />, color: 'from-purple-500 to-pink-500' },
    { id: 'security', name: 'Segurança & Vírus', icon: <FiShield />, color: 'from-red-500 to-orange-500' },
    { id: 'internet', name: 'Rede & Internet', icon: <FiWifi />, color: 'from-green-500 to-emerald-500' },
];

const guides = [
    {
        title: "Como formatar o Windows 11 Corretamente",
        category: "Windows & Sistema",
        readTime: "15 min",
        slug: "/guias/formatacao-windows",
        description: "Passo a passo completo para uma instalação limpa e segura do sistema operacional.",
        highlight: true
    },
    {
        title: "Guia Definitivo de Otimização para Jogos",
        category: "Windows & Sistema",
        readTime: "12 min",
        slug: "/guias/otimizacao-jogos-pc",
        description: "Aprenda a extrair o máximo de FPS do seu hardware com configurações avançadas.",
        highlight: true
    },
    {
        title: "Como Remover Vírus e Malwares",
        category: "Segurança & Vírus",
        readTime: "10 min",
        slug: "/guias/remocao-virus-malware",
        description: "Ferramentas e métodos para limpar seu PC de ameaças digitais.",
        highlight: false
    },
    {
        title: "Diagnóstico de Hardware: Teste seus Componentes",
        category: "Hardware & Montagem",
        readTime: "20 min",
        slug: "/guias/diagnostico-hardware",
        description: "Saiba como identificar peças com defeito antes que elas queimem.",
        highlight: false
    },
    {
        title: "Configurando sua Rede para Menor Ping",
        category: "Rede & Internet",
        readTime: "8 min",
        slug: "/guias/troubleshooting-internet",
        description: "Dicas de DNS e configurações de adaptador para gamers.",
        highlight: false
    },
    {
        title: "Backup Seguro: Não perca seus arquivos",
        category: "Segurança & Vírus",
        readTime: "10 min",
        slug: "/guias/backup-dados",
        description: "Estratégias 3-2-1 para manter seus dados sempre a salvo.",
        highlight: false
    }
];


export default function GuiasClient() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-[#0A0A0F] text-white overflow-x-hidden selection:bg-purple-500/30 selection:text-white pb-20">

                {/* Fullscreen Hero */}
                <div className="relative pt-32 pb-20 px-4 min-h-[60vh] flex flex-col justify-center overflow-hidden">

                    {/* Background Effects */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                        <TechFloatingElements />
                    </div>

                    <div className="max-w-7xl mx-auto w-full relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md rounded-full px-5 py-2 mb-8 border border-white/10 hover:border-purple-500/50 transition-colors">
                                <FiBookOpen className="text-purple-400" />
                                <span className="text-gray-300 text-sm font-medium">Knowledge Base Voltris</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight">
                                Domine seu <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] animate-gradient-x">
                                    Hardware & Software
                                </span>
                            </h1>

                            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
                                Guias técnicos detalhados, escritos por especialistas, para você resolver problemas e otimizar sua máquina como um profissional.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Categoria Cards */}
                <AnimatedSection>
                    <div className="max-w-7xl mx-auto px-4 mb-20">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {categories.map((cat, idx) => (
                                <motion.div
                                    key={cat.id}
                                    whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.08)' }}
                                    className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-6 cursor-pointer group transition-all"
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                        {cat.icon}
                                    </div>
                                    <h3 className="font-bold text-lg text-white">{cat.name}</h3>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </AnimatedSection>

                {/* Featured Guides Grid */}
                <div className="max-w-7xl mx-auto px-4 z-10 relative">
                    <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
                        <span className="w-2 h-8 bg-gradient-to-b from-[#FF4B6B] to-[#8B31FF] rounded-full"></span>
                        Últimos Tutoriais
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {guides.map((guide, index) => (
                            <AnimatedSection key={index} delay={index * 0.1}>
                                <Link href={guide.slug} className="block h-full">
                                    <motion.div
                                        whileHover={{ y: -8 }}
                                        className={`h-full bg-gradient-to-br from-[#15151A] to-[#1E1E22] rounded-3xl border border-white/5 overflow-hidden group hover:border-purple-500/30 transition-all duration-300 relative flex flex-col`}
                                    >
                                        {guide.highlight && (
                                            <div className="absolute top-0 right-0 bg-gradient-to-bl from-purple-600 to-transparent w-16 h-16 opacity-50"></div>
                                        )}

                                        <div className="p-8 flex flex-col h-full relative z-10">
                                            <div className="flex items-center justify-between mb-6">
                                                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/5`}>
                                                    {guide.category}
                                                </span>
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <FiClock /> {guide.readTime}
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-purple-400 transition-colors">
                                                {guide.title}
                                            </h3>

                                            <p className="text-gray-400 mb-8 text-sm leading-relaxed flex-grow">
                                                {guide.description}
                                            </p>

                                            <div className="flex items-center text-sm font-bold text-white group-hover:text-purple-400 gap-2 mt-auto">
                                                Ler Artigo Completo
                                                <FiArrowRight className="transform group-hover:translate-x-2 transition-transform" />
                                            </div>
                                        </div>

                                        {/* Hover Gradient Line */}
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                    </motion.div>
                                </Link>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>

            </div>
            <Footer />
        </>
    );
}
