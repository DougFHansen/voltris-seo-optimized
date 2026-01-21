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
import { FiShield } from 'react-icons/fi';

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
            <main className="bg-[#171313] min-h-screen pt-24 pb-12">
                {/* Banner Principal */}
                <section className="relative py-20 px-4 overflow-hidden mb-16">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B6B]/10 via-[#8B31FF]/10 to-[#31A8FF]/10 z-0" />
                    <div className="max-w-7xl mx-auto text-center relative z-10">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text"
                        >
                            Nossos Serviços
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed"
                        >
                            Soluções profissionais em tecnologia com atendimento remoto especializado.
                            <br />
                            Rápido, seguro e sem sair de casa.
                        </motion.p>
                    </div>
                </section>

                {/* Lista de Serviços */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-[#1E1E22] rounded-2xl p-8 border border-white/5 hover:border-[#8B31FF]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,49,255,0.15)] flex flex-col"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-2xl" />

                                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                    {renderIcon(service.iconType)}
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-4 text-center group-hover:text-[#31A8FF] transition-colors">{service.title}</h3>

                                <p className="text-gray-400 text-center mb-6 flex-grow leading-relaxed">
                                    {service.description}
                                </p>

                                <div className="space-y-3 mb-8">
                                    {service.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center text-gray-300 text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#8B31FF] mr-3" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto">
                                    <div className="text-center mb-6">
                                        <span className="text-3xl font-bold text-white">{service.price}</span>
                                    </div>

                                    <button
                                        onClick={() => handleHireService(service.id, service.redirect === `/servicos?abrir=${service.id}` ? undefined : service.redirect)}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(139,49,255,0.4)] transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        {service.buttonText}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Seção de Benefícios */}
                <section className="mt-24 max-w-7xl mx-auto px-4">
                    <div className="bg-[#1E1E22] rounded-3xl p-8 md:p-12 border border-white/5">
                        <h2 className="text-3xl font-bold text-white mb-12 text-center">Por que escolher a VOLTRIS?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-[#31A8FF]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ShieldCheck className="w-8 h-8 text-[#31A8FF]" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">Segurança Total</h3>
                                <p className="text-gray-400">Garantia de proteção dos seus dados e conexão segura durante todo o atendimento remoto.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-[#8B31FF]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <GaugeCircle className="w-8 h-8 text-[#8B31FF]" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">Rapidez</h3>
                                <p className="text-gray-400">Atendimento imediato e solução ágil para que você não perca tempo com problemas técnicos.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-[#FF4B6B]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Laptop2 className="w-8 h-8 text-[#FF4B6B]" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">Especialistas</h3>
                                <p className="text-gray-400">Equipe técnica altamente qualificada e certificada para resolver qualquer problema.</p>
                            </div>
                        </div>
                    </div>
                </section>

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

            </main>
            <Footer />
        </>
    );
}
