"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MonitorSmartphone, Globe, Target, Code, CheckCircle, Rocket, Layers, Layout, Zap, Search, Shield, ArrowRight, MousePointer2 } from 'lucide-react';
import TechFloatingElements from '@/components/TechFloatingElements';
import JsonLd from '@/components/JsonLd';

const plans = [
    {
        name: "Landing Page S",
        price: "R$ 997,90",
        description: "Foco total em conversão e velocidade.",
        features: [
            "Página de alta conversão",
            "SEO 10/10 nativo",
            "Site Mobile First",
            "Integração WhatsApp",
            "Google Analytics 4",
            "SSL & Hospedagem Grátis"
        ],
        icon: <Target className="w-8 h-8 text-[#31A8FF]" />
    },
    {
        name: "Portal Business",
        price: "R$ 1.997,90",
        description: "A solução completa para empresas.",
        features: [
            "Até 10 páginas premium",
            "Blog Otimizado para IA",
            "Gerenciamento de Conteúdo",
            "Indexação Prioritária Google",
            "Suporte Técnico VIP",
            "Layout Exclusivo Voltris"
        ],
        icon: <Layers className="w-8 h-8 text-[#8B31FF]" />
    },
    {
        name: "E-commerce X",
        price: "R$ 2.997,90",
        description: "Vendas sem limites e sem taxas.",
        features: [
            "Loja Virtual Turbinada",
            "Checkout sem distrações",
            "Gestão de estoque/pedidos",
            "Métodos de pagamento integrados",
            "Segurança Nível Bancário",
            "Otimização Core Web Vitals"
        ],
        icon: <Rocket className="w-8 h-8 text-[#FF4B6B]" />
    }
];

export default function CriarSiteClient() {
    return (
        <>
            <Header />
            <JsonLd
                type="FAQPage"
                data={{
                    mainEntity: [
                        {
                            "@type": "Question",
                            "name": "Por que sites da Voltris são melhores que Wix ou WordPress?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Diferente de construtores genéricos, usamos Next.js e renderização estática. Isso torna o site 10x mais rápido e amigável aos algoritmos do Google, resultando em melhores posições de busca."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Meu site será encontrado no Google?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Sim. Todos os nossos sites incluem SEO 10/10 nativo, estrutura semântica perfeita e microdados que ajudam buscadores e IAs a entenderem seu negócio."
                            }
                        }
                    ]
                }}
            />
            <main className="bg-gradient-to-b from-gray-50 via-white to-gray-100 min-h-screen relative overflow-x-hidden font-sans selection:bg-[#31A8FF]/30 text-gray-900">

                {/* Efeitos de Fundo - Branding Voltris Premium */}
                <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E')] opacity-10 brightness-100 contrast-100 mix-blend-overlay pointer-events-none z-0"></div>
                <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full blur-[120px] pointer-events-none z-0"></div>
                <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-100/50 to-blue-100/50 rounded-full blur-[100px] pointer-events-none z-0"></div>

                {/* Hero Section */}
                <section className="min-h-[100dvh] flex flex-col items-center justify-center relative z-10 w-full px-4 text-center pb-20 pt-32">
                    <TechFloatingElements />

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full max-w-6xl"
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-200 backdrop-blur-md mb-10">
                            <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse"></span>
                            <span className="text-xs font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text uppercase tracking-[0.3em]">Criação de Sites de Alta Performance</span>
                        </div>

                        <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black text-gray-900 mb-8 leading-[0.9] tracking-tighter uppercase italic">
                            ESQUEÇA O <br />
                            <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text px-2">BÁSICO.</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-14 leading-relaxed font-light">
                            Desenvolvimento Next.js ultra-rápido projetado para superar a lentidão do WordPress e a limitação do Wix. Seu site com SEO 10/10 nativo.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Link
                                href="/contato"
                                className="group relative px-12 py-6 rounded-2xl bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] text-white font-black text-2xl hover:scale-105 transition-all duration-300 shadow-lg shadow-[#31A8FF]/20 flex items-center gap-4 uppercase italic overflow-hidden"
                            >
                                <Zap className="w-7 h-7 fill-white" /> Criar Meu Site Agora
                            </Link>
                            <button
                                onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-10 py-6 rounded-2xl bg-white border border-gray-200 text-gray-900 font-bold text-xl hover:bg-gray-50 transition-all flex items-center gap-3 shadow-md hover:shadow-lg"
                            >
                                <MonitorSmartphone className="w-6 h-6 text-[#31A8FF]" /> Ver Projetos
                            </button>
                        </div>
                    </motion.div>
                </section>

                {/* Comparativo Estratégico (SEO & Autoridade) */}
                <section className="py-32 bg-white/80 backdrop-blur-md border-y border-gray-200 relative z-10 w-full">
                    <div className="container mx-auto px-4 mb-20">
                        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase italic tracking-tighter mb-6">Voltris vs Genéricos</h2>
                            <div className="w-24 h-1.5 bg-gradient-to-r from-[#31A8FF] to-[#FF4B6B] rounded-full mb-8"></div>
                            <p className="text-gray-600 text-lg">Por que grandes empresas abandonam Wix e WordPress pela nossa tecnologia?</p>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 font-sans">
                        {[
                            {
                                title: "Performance Imbatível",
                                desc: "Sites que carregam em menos de 1 segundo. Esqueça loadings demorados que fazem você perder clientes.",
                                icon: <Zap className="w-6 h-6 text-[#FF4B6B]" />,
                                tag: "VS WIX"
                            },
                            {
                                title: "SEO 10/10 Nativo",
                                desc: "Estrutura limpa e semântica projetada para rankear sem depender de plugins pesados.",
                                icon: <Search className="w-6 h-6 text-[#31A8FF]" />,
                                tag: "VS WORDPRESS"
                            },
                            {
                                title: "Segurança Absoluta",
                                desc: "Sem bancos de dados expostos ou plugins vulneráveis. Sua presença online blindada contra ataques.",
                                icon: <Shield className="w-6 h-6 text-[#00FF94]" />,
                                tag: "VS TODOS"
                            }
                        ].map((item, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                key={i}
                                className="group p-8 rounded-[40px] bg-white border border-gray-200 hover:border-[#31A8FF]/30 shadow-md hover:shadow-xl transition-all duration-500"
                            >
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-6">{item.tag}</div>
                                <div className="mb-6">{item.icon}</div>
                                <h3 className="text-2xl font-black text-gray-900 mb-4 italic uppercase tracking-tighter">{item.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed font-medium">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Planos & Pricing Modernizado */}
                <section id="planos" className="py-32 px-4 relative z-10 w-full overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-[#31A8FF]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto text-center mb-20">
                        <h2 className="text-5xl md:text-7xl font-black text-gray-900 uppercase italic tracking-tighter leading-none mb-6">Investimento Justo.</h2>
                        <p className="text-gray-600 text-xl font-light">Tecnologia de ponta por um preço que cabe no seu projeto.</p>
                    </div>

                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                        {plans.map((plan, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                key={i}
                                className={`group p-[1px] rounded-[48px] bg-gradient-to-b ${i === 1 ? 'from-[#31A8FF] to-[#8B31FF]' : 'from-white/10 to-transparent'}`}
                            >
                                <div className="bg-white rounded-[47px] p-10 h-full flex flex-col shadow-md border border-gray-200">
                                    <div className="mb-8">{plan.icon}</div>
                                    <h3 className="text-3xl font-black text-gray-900 mb-2 italic uppercase tracking-tighter">{plan.name}</h3>
                                    <p className="text-gray-600 text-sm mb-6 font-medium">{plan.description}</p>

                                    <div className="mb-8">
                                        <span className="text-4xl font-black text-gray-900 italic tracking-tighter">{plan.price}</span>
                                    </div>

                                    <div className="w-full h-px bg-gray-200 mb-8"></div>

                                    <ul className="space-y-4 mb-12 flex-grow">
                                        {plan.features.map((feat, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                                                <CheckCircle className="w-4 h-4 text-[#31A8FF]" /> {feat}
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        href="/contato"
                                        className={`w-full py-5 rounded-2xl text-center font-black uppercase italic transition-all ${i === 1 ? 'bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] text-white shadow-lg shadow-[#31A8FF]/20' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                                    >
                                        Selecionar
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Seção Conversão (Marketing Digital) */}
                <section className="py-32 px-4 bg-gray-50 relative z-10 w-full overflow-hidden">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative group p-4">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] rounded-[48px] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
                            <div className="relative rounded-[48px] bg-white border border-gray-200 p-12 overflow-hidden shadow-2xl">
                                <div className="flex items-center gap-3 mb-8">
                                    <Rocket className="w-8 h-8 text-[#FF4B6B] animate-bounce" />
                                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Site Pronto p/ Vender</h3>
                                </div>
                                <div className="space-y-6 text-gray-600 text-lg leading-relaxed font-light">
                                    <p>Integramos seu site com as maiores ferramentas de marketing do mundo: Meta Pixel, Google Tags, APIs de CRM e muito mais.</p>
                                    <p>Seu site não será apenas bonito, ele será uma máquina de capturar leads 24 horas por dia, 7 dias por semana.</p>
                                </div>
                                <div className="mt-10 flex flex-wrap gap-4">
                                    {["Meta Pixel", "GA4", "Hotjar", "Hubspot"].map((t, idx) => (
                                        <span key={idx} className="px-4 py-2 rounded-xl bg-gray-100 border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-600">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10 text-left">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 border border-green-200 text-green-700 text-xs font-black uppercase tracking-widest">Tecnologia Voltris</span>
                            <h2 className="text-5xl md:text-7xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                                SEU SITE <br /> <span className="text-[#31A8FF]">TURBINADO.</span>
                            </h2>
                            <p className="text-gray-600 text-xl leading-relaxed font-light">
                                Utilizamos a mesma stack tecnológica de gigantes como TikTok, Twitch e Netflix para garantir que seu site suporte qualquer volume de tráfego.
                            </p>
                            <Link href="/contato" className="inline-flex items-center gap-3 text-gray-900 font-black uppercase italic tracking-widest group border-b border-[#31A8FF] pb-2">
                                Solicitar Orçamento Grátis <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA Final Profissional */}
                <section className="py-24 px-4 text-center relative z-10">
                    <div className="max-w-5xl mx-auto py-16 px-6 md:px-12 rounded-[48px] bg-white border border-gray-200 relative overflow-hidden shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FF4B6B]/10 via-[#8B31FF]/10 to-[#31A8FF]/10 opacity-50"></div>
                        <div className="relative z-20">
                            <h2 className="text-4xl md:text-6xl font-black text-gray-900 italic uppercase tracking-tighter mb-8 leading-[1.1] px-2">
                                PRONTO PARA <br />
                                <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text px-2">
                                    DOMINAR O MERCADO?
                                </span>
                            </h2>
                            <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                                Transforme sua ideia em um site profissional em tempo recorde.
                            </p>
                            <Link
                                href="/contato"
                                className="inline-flex px-10 py-5 rounded-xl bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] text-white font-black text-xl hover:scale-105 transition-all duration-300 uppercase italic shadow-[0_15px_40px_rgba(49,168,255,0.25)] items-center"
                            >
                                <MousePointer2 className="w-6 h-6 mr-3" /> Falar com Especialista
                            </Link>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
