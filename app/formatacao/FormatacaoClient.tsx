"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    BoltIcon,
    ClockIcon,
    ShieldCheckIcon,
    CloudArrowUpIcon,
    CheckCircleIcon,
    StarIcon,
    ComputerDesktopIcon,
    UsersIcon
} from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';
import TechFloatingElements from '@/components/TechFloatingElements';

const formatacaoPlans = [
    {
        id: "formatacao-basica",
        title: "Básica",
        description: "Backup, formatação, instalação de drivers e atualizações.",
        icon: <ComputerDesktopIcon className="w-8 h-8" />,
        price: "R$99,90",
        features: [],
        plan_type: "Básica"
    },
    {
        id: "formatacao-media",
        title: "Média",
        description: "Inclui \"Básica\" + antivírus e otimização básica.",
        icon: <BoltIcon className="w-8 h-8" />,
        price: "R$149,90",
        features: [],
        plan_type: "Média"
    },
    {
        id: "formatacao-avancada",
        title: "Avançada",
        description: "Inclui \"Média\" + otimização média de desempenho.",
        icon: <StarIcon className="w-8 h-8" />,
        price: "R$199,90",
        features: [],
        plan_type: "Avançada"
    },
    {
        id: "formatacao-corporativa",
        title: "Corporativa",
        description: "Inclui \"Avançada\" + Pacote Office (permanente*) e otimização avançada.",
        icon: <UsersIcon className="w-8 h-8" />,
        price: "R$349,90",
        features: [],
        plan_type: "Corporativa"
    },
    {
        id: "formatacao-gamer",
        title: "Gamer",
        description: "Inclui \"Avançada\" + Pacote Office (opcional) e otimização extrema para jogos (FPS, input lag, etc.).",
        icon: <BoltIcon className="w-8 h-8" />,
        price: "R$449,90",
        features: [],
        plan_type: "Gamer"
    }
];

export default function FormatacaoClient() {
    const router = useRouter();
    const supabase = createClient();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    const benefits = [
        {
            title: 'Suporte Remoto 24/7',
            description: 'Atendimento técnico especializado a qualquer momento',
            icon: <ClockIcon className="w-12 h-12 text-[#FF4B6B]" />
        },
        {
            title: 'Segurança Garantida',
            description: 'Proteção completa para seus dados e sistemas',
            icon: <ShieldCheckIcon className="w-12 h-12 text-[#8B31FF]" />
        },
        {
            title: 'Performance Máxima',
            description: 'Otimização completa do seu sistema',
            icon: <BoltIcon className="w-12 h-12 text-[#31A8FF]" />
        },
        {
            title: 'Backup Automático',
            description: 'Seus dados sempre protegidos',
            icon: <CloudArrowUpIcon className="w-12 h-12 text-[#FF4B6B]" />
        }
    ];

    const faqs = [
        {
            question: 'Como funciona a formatação remota?',
            answer: 'Utilizamos ferramentas seguras de acesso remoto para formatar seu computador sem necessidade de deslocamento, garantindo total segurança dos seus dados.'
        },
        {
            question: 'Meus dados serão perdidos na formatação?',
            answer: 'Não! Fazemos backup completo de todos os seus dados importantes antes da formatação, garantindo que nada seja perdido.'
        },
        {
            question: 'Qual o tempo médio para formatação?',
            answer: 'O tempo varia conforme o plano escolhido, mas geralmente entre 2 a 4 horas para formatação completa com instalação de programas.'
        },
        {
            question: 'A formatação resolve problemas de vírus?',
            answer: 'Sim! A formatação remove completamente todos os vírus e malwares, deixando seu computador 100% limpo e seguro.'
        }
    ];

    const handleContratarAgora = async (plan: any) => {
        const { data: { session } } = await supabase.auth.getSession();
        const orderData = {
            service_name: plan.title,
            service_description: plan.description,
            final_price: plan.price,
            plan_type: plan.plan_type,
        };
        if (!session) {
            sessionStorage.setItem('pendingOrderData', JSON.stringify(orderData));
            window.location.href = `/login?redirect=/dashboard&pendingOrder=true`;
            return;
        }
        // Cria pedido via API
        await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });
        window.location.href = '/dashboard';
    };

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
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:border-[#31A8FF]/30 transition-all cursor-default">
                                <span className="flex h-2 w-2 rounded-full bg-[#00FF94] shadow-[0_0_8px_#00FF94] animate-pulse"></span>
                                <span className="text-xs sm:text-sm font-medium text-white tracking-wide">Serviço Premium</span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
                                Formatação <span className="bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text animate-gradient-x">Profissional</span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                                Restaure a performance original do seu computador com nossa formatação segura e <strong>100% remota</strong>. Backup completo incluído.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
                                >
                                    <ComputerDesktopIcon className="w-5 h-5" /> Ver Planos
                                </button>
                                <a
                                    href="/contato"
                                    className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                >
                                    <UsersIcon className="w-5 h-5" /> Falar com Técnico
                                </a>
                            </div>
                        </motion.div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer text-slate-500 hover:text-white transition-colors"
                        onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <span className="text-xs uppercase tracking-widest">Scroll</span>
                        <div className="w-[1px] h-12 bg-gradient-to-b from-[#31A8FF] to-transparent"></div>
                    </motion.div>
                </section>

                {/* Benefits Section */}
                <section className="py-24 px-4 bg-[#0A0A0F] relative z-10 w-full border-t border-white/5">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={benefit.title}
                                    className="bg-[#121218] p-8 rounded-3xl border border-white/5 hover:border-[#31A8FF]/30 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#31A8FF]/10 rounded-full blur-[60px] -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-50"></div>
                                    <div className="mb-6 transform group-hover:scale-105 transition-transform duration-300">
                                        {benefit.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Plans Section */}
                <section id="planos" className="py-24 px-4 relative z-10 w-full">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Escolha seu Plano</h2>
                            <p className="text-slate-400">Soluções flexíveis para todas as necessidades.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {formatacaoPlans.map((plan) => (
                                <motion.div
                                    key={plan.id}
                                    whileHover={{ y: -8 }}
                                    className="group relative bg-[#121218] backdrop-blur-sm p-1 rounded-3xl border border-white/5 flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:shadow-[#31A8FF]/10"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br from-[#31A8FF] to-[#8B31FF] opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}></div>
                                    <div className="relative h-full bg-[#121218] rounded-[22px] p-8 flex flex-col">

                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                            {plan.icon}
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2">{plan.title}</h3>
                                        <div className="text-2xl font-bold text-[#31A8FF] mb-6">{plan.price}</div>

                                        <p className="text-slate-400 text-sm mb-8 flex-grow">
                                            {plan.description}
                                        </p>

                                        <button
                                            onClick={() => router.push(`/servicos?abrir=formatacao`)}
                                            className="w-full py-3 rounded-xl bg-white/5 hover:bg-white text-white hover:text-black font-semibold transition-all border border-white/10 hover:border-white"
                                        >
                                            Contratar Agora
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Detailed Info (Using modern grid) */}
                <section className="py-24 px-4 bg-[#0A0A0F] border-t border-white/5 relative z-10 w-full">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-[#121218] p-8 rounded-3xl border border-white/5 hover:border-[#8B31FF]/30 transition-all">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                    <CloudArrowUpIcon className="w-6 h-6 text-[#8B31FF]" />
                                    Backup Completo
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Segurança em primeiro lugar. Antes de qualquer procedimento, realizamos o backup dos seus arquivos em nuvem criptografada ou disco local seguro.
                                </p>
                            </div>
                            <div className="bg-[#121218] p-8 rounded-3xl border border-white/5 hover:border-[#31A8FF]/30 transition-all">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                    <BoltIcon className="w-6 h-6 text-[#31A8FF]" />
                                    Drivers & Otimização
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Instalação dos drivers mais recentes e configuração fina do Windows para extrair o máximo de desempenho do seu hardware.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-24 px-4 max-w-4xl mx-auto relative z-10">
                    <h2 className="text-3xl font-bold text-white text-center mb-16">Dúvidas Frequentes</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="p-6 rounded-2xl bg-[#121218] border border-white/5 hover:border-white/10 transition-all"
                            >
                                <h3 className="text-lg font-bold text-white mb-2">{faq.question}</h3>
                                <p className="text-slate-400 text-sm">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 px-4 border-t border-white/5 relative z-10 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Seu PC Como Novo Hoje Mesmo</h2>
                        <button
                            onClick={() => handleContratarAgora(formatacaoPlans[0])}
                            className="px-10 py-5 rounded-2xl bg-white text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                        >
                            Agendar Formatação
                        </button>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
