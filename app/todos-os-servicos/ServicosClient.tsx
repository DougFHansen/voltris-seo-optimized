"use client";
import React from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    MonitorSmartphone,
    Laptop2,
    ShieldCheck,
    HardDrive,
    GaugeCircle,
    Database,
    Package,
    Printer
} from "lucide-react";
import {
    FiShield, FiCheck, FiMonitor, FiSettings, FiClock, FiBarChart2,
    FiGlobe, FiTrendingUp, FiUsers, FiPhone, FiMail, FiMapPin,
    FiCreditCard, FiCloud, FiCheckCircle
} from 'react-icons/fi';
import AnimatedSection from '@/components/AnimatedSection';
import TechFloatingElements from '@/components/TechFloatingElements';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const services = [
    {
        id: "criacao-site",
        title: "Criação de Site",
        description: "Desenvolvimento de sites profissionais e responsivos para sua empresa ou projeto pessoal.",
        iconType: "MonitorSmartphone",
        price: "A partir de R$ 997,90",
        buttonText: "Criar Meu Site",
        features: ["Design Responsivo", "SEO Otimizado", "Integração Social"],
        redirect: "/todos-os-servicos/criacao-de-sites"
    },
    {
        id: "suporte-windows",
        title: "Suporte ao Windows",
        description: "Suporte remoto completo para seu sistema Windows, incluindo instalação, atualização e otimização.",
        iconType: "Laptop2",
        price: "A partir de R$ 349,90",
        buttonText: "Ver Planos",
        features: ["Instalação", "Atualização", "Correção de Erros"],
        redirect: "/todos-os-servicos/suporte-windows"
    },
    {
        id: "correcao_windows",
        title: "Correção de Erros no Windows",
        description: "Solução remota de problemas e erros no seu sistema Windows.",
        iconType: "ShieldCheck",
        price: "R$ 49,90",
        buttonText: "Contratar Serviço",
        features: ["Diagnóstico Rápido", "Correção Remota", "Garantia de Solução"],
        redirect: "/servicos?service=correcao-windows"
    },
    {
        id: "formatacao",
        title: "Formatação",
        description: "Formatação remota completa do seu computador com instalação de programas essenciais.",
        iconType: "HardDrive",
        price: "A partir de R$ 99,90",
        buttonText: "Contratar Serviço",
        features: ["Backup de Arquivos", "Instalação de Drivers", "Programas Essenciais"],
        redirect: "/servicos?service=formatacao"
    },
    {
        id: "otimizacao",
        title: "Otimização de PC",
        description: "Otimização remota completa do seu computador para melhor desempenho.",
        iconType: "GaugeCircle",
        price: "A partir de R$ 79,90",
        buttonText: "Contratar Serviço",
        features: ["Limpeza de Sistema", "Otimização de Registro", "Aceleração de Boot"],
        redirect: "/servicos?service=otimizacao"
    },
    {
        id: "recuperacao",
        title: "Recuperação De Dados",
        description: "Recuperação remota de dados e arquivos importantes do seu computador.",
        iconType: "Database",
        price: "R$ 99,90",
        buttonText: "Contratar Serviço",
        features: ["Arquivos Deletados", "Partições Perdidas", "HDs Formatados"],
        redirect: "/servicos?service=recuperacao"
    },
    {
        id: "instalacao-programas",
        title: "Instalação de Programas",
        description: "Instalação e configuração remota de programas essenciais para seu computador.",
        iconType: "Package",
        price: "A partir de R$ 29,90",
        buttonText: "Ver programas",
        features: ["Office", "Antivírus", "Editores"],
        redirect: "/todos-os-servicos/instalacao-de-programas"
    },
    {
        id: "instalacao_impressora",
        title: "Instalação de Impressora",
        description: "Instalação remota de drivers e configuração de impressoras no seu computador.",
        iconType: "Printer",
        price: "R$ 49,90",
        buttonText: "Contratar Serviço",
        features: ["Instalação de Drivers", "Configuração de Rede", "Teste de Impressão"],
        redirect: "/servicos?service=impressora"
    },
    {
        id: "remocao_virus",
        title: "Remoção de Vírus",
        description: "Remoção remota de vírus e proteção do seu computador.",
        iconType: "FiShield",
        price: "R$ 39,90",
        buttonText: "Contratar Serviço",
        features: ["Escaneamento Completo", "Remoção de Malware", "Instalação de Antivírus"],
        redirect: "/servicos?service=remocao-virus"
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
            // Salvar a intenção de compra no localStorage ou url params se necessário
            router.push(`/login?redirect=/servicos?abrir=${serviceId}`);
        } else {
            router.push(`/servicos?abrir=${serviceId}`);
        }
    };

    const renderIcon = (iconType: string) => {
        const iconProps = {
            size: 48,
            className: "mx-auto mb-4"
        };

        switch (iconType) {
            case "MonitorSmartphone":
                return <MonitorSmartphone {...iconProps} className={`${iconProps.className} text-[#31A8FF]`} />;
            case "Laptop2":
                return <Laptop2 {...iconProps} className={`${iconProps.className} text-[#8B31FF]`} />;
            case "ShieldCheck":
                return <ShieldCheck {...iconProps} className={`${iconProps.className} text-[#FF4B6B]`} />;
            case "HardDrive":
                return <HardDrive {...iconProps} className={`${iconProps.className} text-[#31A8FF]`} />;
            case "GaugeCircle":
                return <GaugeCircle {...iconProps} className={`${iconProps.className} text-[#8B31FF]`} />;
            case "Database":
                return <Database {...iconProps} className={`${iconProps.className} text-[#FF4B6B]`} />;
            case "Package":
                return <Package {...iconProps} className={`${iconProps.className} text-[#31A8FF]`} />;
            case "Printer":
                return <Printer {...iconProps} className={`${iconProps.className} text-[#8B31FF]`} />;
            case "FiShield":
                return <FiShield size={48} className={`${iconProps.className} text-[#FF4B6B]`} />;
            default:
                return <MonitorSmartphone {...iconProps} className={`${iconProps.className} text-[#31A8FF]`} />;
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#121218] to-[#0A0A0F] overflow-x-hidden">
                {/* Hero Section */}
                <AnimatedSection>
                    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                        <TechFloatingElements />

                        <div className="max-w-7xl mx-auto text-center relative z-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="mb-12"
                            >
                                <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md rounded-full px-4 py-2 mb-8 border border-white/10 hover:border-purple-500/50 transition-colors">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    <span className="text-gray-300 text-sm font-medium">Serviços Profissionais</span>
                                </div>

                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">
                                    Soluções de TI <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 animate-gradient-x">
                                        Para Você e Sua Empresa
                                    </span>
                                </h1>

                                <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                                    Explore nosso catálogo completo de serviços de tecnologia.
                                    Do suporte básico à infraestrutura corporativa complexa.
                                </p>
                            </motion.div>
                        </div>
                    </section>
                </AnimatedSection>

                {/* Lista de Serviços */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <AnimatedSection key={service.id} delay={index * 0.1}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="group relative bg-[#1E1E22]/50 backdrop-blur-sm rounded-3xl p-8 border border-white/5 hover:border-purple-500/30 transition-all duration-300 flex flex-col h-full overflow-hidden"
                                >
                                    {/* Gradient Border on Hover */}
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ padding: '1px' }}>
                                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 animate-gradient-xy opacity-20"></div>
                                    </div>

                                    <div className="mb-8 relative">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-gray-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                            {renderIcon(service.iconType)}
                                        </div>

                                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-colors">
                                            {service.title}
                                        </h3>

                                        <p className="text-gray-400 leading-relaxed mb-6">
                                            {service.description}
                                        </p>
                                    </div>

                                    <div className="space-y-3 mb-8 flex-grow">
                                        {service.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center text-gray-300 text-sm group-hover:text-white transition-colors">
                                                <FiCheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-gray-700/50">
                                        <div className="flex items-end gap-2 mb-6">
                                            <span className="text-sm text-gray-400 mb-1">A partir de</span>
                                            <span className="text-2xl font-bold text-white">{service.price.replace('A partir de ', '')}</span>
                                        </div>

                                        <button
                                            onClick={() => handleHireService(service.id, service.redirect === `/servicos?abrir=${service.id}` ? undefined : service.redirect)}
                                            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 hover:from-purple-500 hover:to-blue-500 transition-all duration-300 transform group-hover:scale-[1.02]"
                                        >
                                            {service.buttonText}
                                        </button>
                                    </div>
                                </motion.div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>

                {/* Seção de Benefícios */}
                <AnimatedSection>
                    <section className="mt-8 max-w-7xl mx-auto px-4 mb-24">
                        <div className="bg-[#1E1E22]/30 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"></div>

                            <div className="text-center mb-16">
                                <h2 className="text-3xl font-bold text-white mb-4">Por que escolher a VOLTRIS?</h2>
                                <p className="text-gray-400">Excelência técnica e compromisso com sua satisfação</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                                <div className="text-center group">
                                    <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-gray-700 group-hover:border-blue-500/50">
                                        <ShieldCheck className="w-10 h-10 text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">Segurança Total</h3>
                                    <p className="text-gray-400 leading-relaxed">Garantia de proteção dos seus dados e conexão segura durante todo o atendimento remoto.</p>
                                </div>
                                <div className="text-center group">
                                    <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-gray-700 group-hover:border-purple-500/50">
                                        <GaugeCircle className="w-10 h-10 text-purple-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">Rapidez</h3>
                                    <p className="text-gray-400 leading-relaxed">Atendimento imediato e solução ágil para que você não perca tempo com problemas técnicos.</p>
                                </div>
                                <div className="text-center group">
                                    <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-gray-700 group-hover:border-green-500/50">
                                        <Laptop2 className="w-10 h-10 text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">Especialistas</h3>
                                    <p className="text-gray-400 leading-relaxed">Equipe técnica altamente qualificada e certificada para resolver qualquer problema.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </AnimatedSection>

                {/* FAQ Section (Simplificado) */}
                <section className="mt-24 max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-white mb-12 text-center">Perguntas Frequentes</h2>
                    <div className="space-y-4">
                        <details className="group bg-[#1E1E22] p-6 rounded-xl border border-white/5 cursor-pointer open:border-[#8B31FF]/30 transition-all">
                            <summary className="flex items-center justify-between font-bold text-white text-lg list-none">
                                O atendimento é realmente seguro?
                                <span className="transform group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="mt-4 text-gray-400 leading-relaxed">
                                Sim! Utilizamos softwares de acesso remoto líderes de mercado com criptografia de ponta a ponta. Você acompanha tudo o que é feito na sua tela em tempo real e pode interromper o acesso a qualquer momento.
                            </p>
                        </details>
                        <details className="group bg-[#1E1E22] p-6 rounded-xl border border-white/5 cursor-pointer open:border-[#8B31FF]/30 transition-all">
                            <summary className="flex items-center justify-between font-bold text-white text-lg list-none">
                                E se o problema não for resolvido?
                                <span className="transform group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="mt-4 text-gray-400 leading-relaxed">
                                Nossa política é clara: se não resolvermos, você não paga (exceto taxa de diagnóstico quando aplicável). Mas temos uma taxa de sucesso de 99% em nossos atendimentos.
                            </p>
                        </details>
                        <details className="group bg-[#1E1E22] p-6 rounded-xl border border-white/5 cursor-pointer open:border-[#8B31FF]/30 transition-all">
                            <summary className="flex items-center justify-between font-bold text-white text-lg list-none">
                                Quais formas de pagamento aceitas?
                                <span className="transform group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="mt-4 text-gray-400 leading-relaxed">
                                Aceitamos PIX (com desconto), Cartão de Crédito em até 12x e Boleto Bancário. O pagamento é processado de forma segura através da nossa plataforma.
                            </p>
                        </details>
                    </div>
                </section>

                {/* FAQ Section */}
                <AnimatedSection>
                    <section className="max-w-4xl mx-auto px-4 pb-20">
                        <h2 className="text-3xl font-bold text-white mb-12 text-center">Perguntas Frequentes</h2>
                        <div className="space-y-4">
                            <details className="group bg-[#1E1E22]/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 cursor-pointer open:border-purple-500/30 transition-all duration-300 hover:bg-[#1E1E22]">
                                <summary className="flex items-center justify-between font-bold text-white text-lg list-none">
                                    O atendimento é realmente seguro?
                                    <span className="transform group-open:rotate-180 transition-transform bg-white/10 rounded-full p-1"><FiCheckCircle className="w-4 h-4" /></span>
                                </summary>
                                <div className="mt-4 text-gray-400 leading-relaxed pl-4 border-l-2 border-purple-500/30">
                                    Sim! Utilizamos softwares de acesso remoto líderes de mercado com criptografia de ponta a ponta. Você acompanha tudo o que é feito na sua tela em tempo real e pode interromper o acesso a qualquer momento.
                                </div>
                            </details>
                            <details className="group bg-[#1E1E22]/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 cursor-pointer open:border-purple-500/30 transition-all duration-300 hover:bg-[#1E1E22]">
                                <summary className="flex items-center justify-between font-bold text-white text-lg list-none">
                                    E se o problema não for resolvido?
                                    <span className="transform group-open:rotate-180 transition-transform bg-white/10 rounded-full p-1"><FiCheckCircle className="w-4 h-4" /></span>
                                </summary>
                                <div className="mt-4 text-gray-400 leading-relaxed pl-4 border-l-2 border-purple-500/30">
                                    Nossa política é clara: se não resolvermos, você não paga (exceto taxa de diagnóstico quando aplicável). Mas temos uma taxa de sucesso de 99% em nossos atendimentos.
                                </div>
                            </details>
                            <details className="group bg-[#1E1E22]/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 cursor-pointer open:border-purple-500/30 transition-all duration-300 hover:bg-[#1E1E22]">
                                <summary className="flex items-center justify-between font-bold text-white text-lg list-none">
                                    Quais formas de pagamento aceitas?
                                    <span className="transform group-open:rotate-180 transition-transform bg-white/10 rounded-full p-1"><FiCheckCircle className="w-4 h-4" /></span>
                                </summary>
                                <div className="mt-4 text-gray-400 leading-relaxed pl-4 border-l-2 border-purple-500/30">
                                    Aceitamos PIX (com desconto), Cartão de Crédito em até 12x e Boleto Bancário. O pagamento é processado de forma segura através da nossa plataforma.
                                </div>
                            </details>
                        </div>
                    </section>
                </AnimatedSection>

            </div>
            <Footer />
        </>
    );
}
