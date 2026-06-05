"use client";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    FiMonitor, FiShield, FiGlobe, FiCpu, FiHardDrive,
    FiDatabase, FiPackage, FiPrinter, FiLayout, FiActivity,
    FiCheck, FiZap, FiUserCheck, FiClock, FiStar, FiArrowRight, FiMail
} from 'react-icons/fi';
import AnimatedSection from '@/components/AnimatedSection';
import TechFloatingElements from '@/components/TechFloatingElements';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const services = [
    {
        id: "criacao-site",
        title: "Criação de Sites Profissionais e Otimizados para SEO",
        description: "Desenvolvemos sites modernos, rápidos e responsivos, com foco em performance, SEO e conversão. Ideal para empresas que desejam presença digital profissional, carregamento rápido e melhor posicionamento no Google.",
        icon: FiLayout,
        color: "from-blue-500 to-cyan-500",
        price: "A partir de R$ 997,90",
        buttonText: "Orçar Projeto",
        redirect: "/todos-os-servicos/criacao-sites",
        highlight: true
    },
    {
        id: "suporte-windows",
        title: "Suporte Técnico Windows Remoto",
        description: "Diagnóstico completo, correção de erros, remoção de lentidão e falhas no Windows. Atendimento remoto para resolver problemas de sistema de forma rápida e segura.",
        icon: FiMonitor,
        color: "from-indigo-500 to-purple-500",
        price: "A partir de R$ 349,90",
        buttonText: "Ver Planos",
        redirect: "/todos-os-servicos/suporte-ao-windows",
        highlight: true
    },
    {
        id: "otimizacao",
        title: "Otimização de PC Gamer Remota",
        description: "Serviço especializado em otimização de computadores gamer, aumentando FPS, reduzindo input lag e melhorando o desempenho geral do sistema para jogos.",
        icon: FiCpu,
        color: "from-purple-500 to-pink-500",
        price: "A partir de R$ 79,90",
        buttonText: "Otimizar Agora",
        redirect: "/otimizacao-pc"
    },
    {
        id: "formatacao",
        title: "Formatação de PC Remota e Instalação do Windows",
        description: "Formatação limpa do computador com backup seguro, instalação do Windows, drivers atualizados e configurações ideais para desempenho e estabilidade.",
        icon: FiHardDrive,
        color: "from-emerald-500 to-teal-500",
        price: "A partir de R$ 99,90",
        buttonText: "Agendar",
        redirect: "/servicos?service=formatacao"
    },
    {
        id: "recuperacao",
        title: "Recuperação de Dados Profissional",
        description: "Recuperação de arquivos perdidos, deletados ou corrompidos utilizando técnicas avançadas de análise e restauração de dados.",
        icon: FiDatabase,
        color: "from-orange-500 to-red-500",
        price: "Sob Consulta",
        buttonText: "Análise",
        redirect: "/servicos?service=recuperacao"
    },
    {
        id: "remocao_virus",
        title: "Segurança Digital, Antivírus e Remoção de Malware",
        description: "Varredura profunda para remoção de vírus, malwares, spywares e rootkits, garantindo segurança e proteção total do computador.",
        icon: FiShield,
        color: "from-red-500 to-rose-500",
        price: "R$ 39,90",
        buttonText: "Limpar PC",
        redirect: "/servicos?service=remocao-virus"
    },
    {
        id: "instalacao-programas",
        title: "Instalação de Programas e Softwares Essenciais",
        description: "Instalação correta de programas essenciais, ferramentas profissionais e softwares necessários para o uso diário do computador.",
        icon: FiPackage,
        color: "from-cyan-500 to-blue-500",
        price: "A partir de R$ 29,90",
        buttonText: "Ver Packs",
        redirect: "/todos-os-servicos/instalacao-de-programas"
    },
    {
        id: "instalacao_impressora",
        title: "Configuração de Impressoras e Periféricos",
        description: "Configuração remota de impressoras, scanners e dispositivos conectados, garantindo funcionamento correto e sem erros.",
        icon: FiPrinter,
        color: "from-gray-500 to-slate-500",
        price: "R$ 49,90",
        buttonText: "Configurar",
        redirect: "/servicos?service=impressora"
    },
    {
        id: "correcao_windows",
        title: "Correção de Erros e Problemas no Computador",
        description: "Resolução rápida de erros do sistema, telas azuis, falhas de programas e problemas pontuais do dia a dia.",
        icon: FiActivity,
        color: "from-amber-500 to-orange-500",
        price: "R$ 49,90",
        buttonText: "Resolver",
        redirect: "/servicos?service=correcao-windows"
    },
    {
        id: "tecnico_local",
        title: "Técnico Especializado em Informática e TI Remota",
        description: "Atendimento avançado para hardware, infraestrutura, redes e soluções técnicas complexas, com suporte remoto especializado.",
        icon: FiUserCheck,
        color: "from-indigo-600 to-blue-600",
        price: "Sob Consulta",
        buttonText: "Ver Detalhes",
        redirect: "/tecnico-informatica"
    }
];

export default function ServicosClient() {
    const router = useRouter();

    const handleHireService = async (serviceId: string, redirectUrl?: string) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (redirectUrl) {
            router.push(redirectUrl);
            return;
        }
        if (!session) {
            router.push(`/login?redirect=/servicos?abrir=${serviceId}`);
        } else {
            router.push(`/servicos?abrir=${serviceId}`);
        }
    };

    return (
        <>
            <Header />
            <main className="bg-gray-50 min-h-screen relative overflow-x-hidden font-sans selection:bg-blue-100">

                {/* Background Effects (Global) */}
                <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-[120px] max-w-full pointer-events-none z-0"></div>
                <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-purple-100/30 rounded-full blur-[120px] max-w-full pointer-events-none z-0"></div>

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
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-200 shadow-sm mb-8 hover:border-blue-300 transition-all cursor-default">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse"></span>
                                <span className="text-xs sm:text-sm font-medium text-gray-700 tracking-wide">Tecnologia de Ponta</span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-[1.1] tracking-tight">
                                Serviços de Suporte<br className="hidden md:block" />
                                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text animate-gradient-x">
                                    Técnico Remoto em Informática e TI
                                </span>
                            </h1>

                            <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-6 tracking-wide">
                                Formatação de PC, Otimização de Computador, Suporte Windows e Soluções Digitais Profissionais
                            </h2>

                            <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto mb-12 leading-relaxed">
                                Oferecemos serviços profissionais de suporte técnico remoto para informática e TI, atendendo clientes que precisam resolver problemas no computador de forma rápida, segura e online. Atuamos com formatação de PC, otimização de desempenho, correção de erros, segurança digital, instalação de programas e soluções avançadas de tecnologia, tudo com atendimento especializado e remoto.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => document.getElementById('servicos-lista')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="px-8 py-4 rounded-xl bg-white text-gray-900 border border-gray-200 font-bold hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-2"
                                >
                                    <FiMonitor className="w-5 h-5" /> Explorar Serviços
                                </button>
                                <a
                                    href="/contato"
                                    className="px-8 py-4 rounded-xl bg-white border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <FiMail className="w-5 h-5" /> Falar com Especialista
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Catálogo com Cards Modernos */}
                <section id="servicos-lista" className="py-24 px-4 bg-gray-100 relative z-10 w-full">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service, index) => (
                                <AnimatedSection key={service.id} delay={index * 0.05}>
                                    <motion.div
                                        whileHover={{ y: -8, scale: 1.01 }}
                                        className="group relative h-full bg-white rounded-2xl p-1 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-lg border border-gray-200"
                                    >
                                        {/* Borda Gradiente no Hover */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}></div>
                                        <div className="absolute inset-0 bg-white m-[1px] rounded-[15px] z-0"></div>

                                        {/* Conteúdo do Card */}
                                        <div className="relative z-10 p-7 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} p-[1px] shadow-sm`}>
                                                    <div className="w-full h-full bg-white rounded-[15px] flex items-center justify-center">
                                                        <service.icon className="w-6 h-6 text-gray-700" />
                                                    </div>
                                                </div>
                                                {service.highlight && (
                                                    <span className="bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                        Popular
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-all">{service.title}</h3>
                                            <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-grow">
                                                {service.description}
                                            </p>

                                            <div className="border-t border-gray-200 pt-6 mt-auto">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-gray-900 font-semibold">{service.price}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleHireService(service.id, service.redirect.startsWith('/servicos?abrir=') ? undefined : service.redirect)}
                                                    className="w-full py-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-900 font-medium text-sm transition-all flex items-center justify-center gap-2"
                                                >
                                                    {service.buttonText}
                                                    <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Trust Section - Estilo "Bento Grid" ou Cards Horizontais */}
                <section className="py-24 px-4 border-t border-gray-200 bg-white relative overflow-hidden w-full">
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Por que escolher nosso suporte técnico remoto?</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Card 1 */}
                            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-blue-300 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 blur-[60px] -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-50"></div>
                                <FiShield className="w-10 h-10 text-blue-600 mb-6" />
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Garantia Blindada</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Se não resolvermos o problema, você não paga. Atendimento transparente, seguro e sem letras miúdas.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-purple-300 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 blur-[60px] -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-50"></div>
                                <FiZap className="w-10 h-10 text-purple-600 mb-6" />
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Velocidade Extrema</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Atendimento iniciado em minutos, com suporte técnico remoto ágil para resolver problemas rapidamente.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-pink-300 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 blur-[60px] -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-50"></div>
                                <FiUserCheck className="w-10 h-10 text-pink-600 mb-6" />
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Especialistas Reais</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Nada de robôs. Você fala diretamente com técnicos certificados e especialistas em informática e tecnologia.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
