"use client";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckIcon, RocketLaunchIcon, DevicePhoneMobileIcon, MagnifyingGlassIcon, ChatBubbleLeftRightIcon, CreditCardIcon } from "@heroicons/react/24/outline";

export default function CriacaoSitesClient() {
    return (
        <>
            <Header />
            <main className="bg-[#171313] min-h-screen pt-24 pb-12">
                {/* Hero Section */}
                <section className="relative py-20 px-4 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B6B]/10 via-[#8B31FF]/10 to-[#31A8FF]/10 z-0" />
                    <div className="max-w-7xl mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-block p-4 rounded-full bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] border border-[#8B31FF]/30 mb-8 shadow-[0_0_30px_rgba(139,49,255,0.2)]"
                        >
                            <RocketLaunchIcon className="w-16 h-16 text-[#8B31FF]" />
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text"
                        >
                            Criação de Sites Profissionais
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed mb-8"
                        >
                            Transforme sua presença digital com sites modernos, rápidos e otimizados para converter visitantes em clientes.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link href="https://wa.me/5511996716235?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20para%20cria%C3%A7%C3%A3o%20de%20site." target="_blank" className="px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2">
                                <ChatBubbleLeftRightIcon className="w-6 h-6" />
                                Orçamento via WhatsApp
                            </Link>
                            <Link href="#planos" className="px-8 py-4 bg-[#1E1E22] border border-white/10 hover:border-[#8B31FF] text-white font-bold rounded-xl transition-all duration-300">
                                Ver Planos Disponíveis
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* Recursos */}
                <section className="py-16 px-4 bg-[#1D1919]">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-white text-center mb-16">Tudo o que seu site precisa para ter sucesso</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Design Responsivo",
                                    description: "Seu site ficará perfeito em computadores, tablets e celulares, adaptando-se a qualquer tamanho de tela.",
                                    icon: <DevicePhoneMobileIcon className="w-8 h-8 text-[#31A8FF]" />,
                                    color: "from-[#31A8FF]/20 to-[#31A8FF]/5"
                                },
                                {
                                    title: "Otimizado para SEO",
                                    description: "Estrutura otimizada para aparecer nas primeiras posições do Google e atrair mais tráfego orgânico.",
                                    icon: <MagnifyingGlassIcon className="w-8 h-8 text-[#8B31FF]" />,
                                    color: "from-[#8B31FF]/20 to-[#8B31FF]/5"
                                },
                                {
                                    title: "Alta Performance",
                                    description: "Carregamento ultra-rápido para garantir a melhor experiência do usuário e melhor rankeamento.",
                                    icon: <RocketLaunchIcon className="w-8 h-8 text-[#FF4B6B]" />,
                                    color: "from-[#FF4B6B]/20 to-[#FF4B6B]/5"
                                },
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`bg-gradient-to-br ${feature.color} p-8 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300`}
                                >
                                    <div className="bg-[#171313] w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Planos */}
                <section id="planos" className="py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-white text-center mb-6">Escolha o plano ideal para você</h2>
                        <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">Desenvolvemos desde sites institucionais simples até lojas virtuais completas.</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Plano Essencial */}
                            <div className="bg-[#1E1E22] rounded-3xl p-8 border border-white/5 flex flex-col hover:border-[#31A8FF]/50 transition-all duration-300">
                                <h3 className="text-xl font-bold text-[#31A8FF] mb-2">Essencial</h3>
                                <p className="text-gray-400 text-sm mb-6">Ideal para profissionais liberais e pequenas empresas.</p>
                                <div className="text-4xl font-bold text-white mb-6">R$ 997,90</div>

                                <ul className="space-y-4 mb-8 flex-grow">
                                    <li className="flex items-start text-gray-300 text-sm gap-3">
                                        <CheckIcon className="w-5 h-5 text-[#31A8FF] flex-shrink-0" />
                                        Site One Page (Página Única)
                                    </li>
                                    <li className="flex items-start text-gray-300 text-sm gap-3">
                                        <CheckIcon className="w-5 h-5 text-[#31A8FF] flex-shrink-0" />
                                        Design Responsivo (Mobile)
                                    </li>
                                    <li className="flex items-start text-gray-300 text-sm gap-3">
                                        <CheckIcon className="w-5 h-5 text-[#31A8FF] flex-shrink-0" />
                                        Botão WhatsApp Integrado
                                    </li>
                                    <li className="flex items-start text-gray-300 text-sm gap-3">
                                        <CheckIcon className="w-5 h-5 text-[#31A8FF] flex-shrink-0" />
                                        Formulário de Contato
                                    </li>
                                    <li className="flex items-start text-gray-300 text-sm gap-3">
                                        <CheckIcon className="w-5 h-5 text-[#31A8FF] flex-shrink-0" />
                                        Hospedagem Grátis (1 ano)
                                    </li>
                                </ul>

                                <Link href="https://wa.me/5511996716235?text=Ol%C3%A1!%20Tenho%20interesse%20no%20Plano%20Essencial%20de%20Cria%C3%A7%C3%A3o%20de%20Sites." target="_blank" className="w-full py-4 rounded-xl border border-[#31A8FF] text-[#31A8FF] font-bold text-center hover:bg-[#31A8FF] hover:text-white transition-all duration-300">
                                    Contratar Agora
                                </Link>
                            </div>

                            {/* Plano Profissional */}
                            <div className="bg-[#1E1E22] rounded-3xl p-8 border border-[#8B31FF] flex flex-col relative shadow-[0_0_30px_rgba(139,49,255,0.15)] transform scale-105 z-10">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#8B31FF] text-white px-4 py-1 rounded-full text-sm font-bold">MAIS VENDIDO</div>
                                <h3 className="text-xl font-bold text-[#8B31FF] mb-2">Profissional</h3>
                                <p className="text-gray-400 text-sm mb-6">Para empresas que precisam de mais páginas e recursos.</p>
                                <div className="text-4xl font-bold text-white mb-6">R$ 1.997,90</div>

                                <ul className="space-y-4 mb-8 flex-grow">
                                    <li className="flex items-start text-gray-300 text-sm gap-3">
                                        <CheckIcon className="w-5 h-5 text-[#8B31FF] flex-shrink-0" />
                                        Até 5 Páginas (Home, Sobre, Serviços...)
                                    </li>
                                    <li className="flex items-start text-gray-300 text-sm gap-3">
                                        <CheckIcon className="w-5 h-5 text-[#8B31FF] flex-shrink-0" />
                                        Design Exclusivo e Premium
                                    </li>
                                    <li className="flex items-start text-gray-300 text-sm gap-3">
                                        <CheckIcon className="w-5 h-5 text-[#8B31FF] flex-shrink-0" />
                                        Otimização SEO Avançada
                                    </li>
                                    <li className="flex items-start text-gray-300 text-sm gap-3">
                                        <CheckIcon className="w-5 h-5 text-[#8B31FF] flex-shrink-0" />
                                        Integração com Google Maps
                                    </li>
                                    <li className="flex items-start text-gray-300 text-sm gap-3">
                                        <CheckIcon className="w-5 h-5 text-[#8B31FF] flex-shrink-0" />
                                        Painel Administrativo
                                    </li>
                                    <li className="flex items-start text-gray-300 text-sm gap-3">
                                        <CheckIcon className="w-5 h-5 text-[#8B31FF] flex-shrink-0" />
                                        Hospedagem/Domínio Grátis (1 ano)
                                    </li>
                                </ul>

                                <Link href="https://wa.me/5511996716235?text=Ol%C3%A1!%20Tenho%20interesse%20no%20Plano%20Profissional%20de%20Cria%C3%A7%C3%A3o%20de%20Sites." target="_blank" className="w-full py-4 rounded-xl bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] text-white font-bold text-center hover:shadow-lg transition-all duration-300">
                                    Contratar Agora
                                </Link>
                            </div>

                            {/* Plano Loja Virtual */}
                            <div className="bg-[#1E1E22] rounded-3xl p-8 border border-white/5 flex flex-col hover:border-[#FF4B6B]/50 transition-all duration-300">
                                <h3 className="text-xl font-bold text-[#FF4B6B] mb-2">E-commerce</h3>
                                <p className="text-gray-400 text-sm mb-6">Para quem quer vender produtos online com segurança.</p>
                                <div className="text-4xl font-bold text-white mb-6">Sob Consulta</div>

                                <ul className="space-y-4 mb-8 flex-grow">
                                    <li className="flex items-start text-gray-300 text-sm gap-3">
                                        <CheckIcon className="w-5 h-5 text-[#FF4B6B] flex-shrink-0" />
                                        Loja Virtual Completa
                                    </li>
                                    <li className="flex items-start text-gray-300 text-sm gap-3">
                                        <CheckIcon className="w-5 h-5 text-[#FF4B6B] flex-shrink-0" />
                                        Gestão de Estoque e Pedidos
                                    </li>
                                    <li className="flex items-start text-gray-300 text-sm gap-3">
                                        <CheckIcon className="w-5 h-5 text-[#FF4B6B] flex-shrink-0" />
                                        Integração com Pagamentos
                                    </li>
                                    <li className="flex items-start text-gray-300 text-sm gap-3">
                                        <CheckIcon className="w-5 h-5 text-[#FF4B6B] flex-shrink-0" />
                                        Cálculo de Frete Automático
                                    </li>
                                    <li className="flex items-start text-gray-300 text-sm gap-3">
                                        <CheckIcon className="w-5 h-5 text-[#FF4B6B] flex-shrink-0" />
                                        Área do Cliente
                                    </li>
                                </ul>

                                <Link href="https://wa.me/5511996716235?text=Ol%C3%A1!%20Tenho%20interesse%20em%20criar%20uma%20Loja%20Virtual." target="_blank" className="w-full py-4 rounded-xl border border-[#FF4B6B] text-[#FF4B6B] font-bold text-center hover:bg-[#FF4B6B] hover:text-white transition-all duration-300">
                                    Falar com Consultor
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
