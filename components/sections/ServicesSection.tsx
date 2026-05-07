"use client";
import React from 'react';
import Link from 'next/link';
import { ChevronRight, Zap, Activity } from 'lucide-react';
import { FiAlertTriangle, FiShield } from 'react-icons/fi';
import AnimatedSection from '@/components/AnimatedSection';

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
        price: "A partir de R$ 149,90",
        link: "/otimizacao-pc",
        highlight: true
    },
    {
        icon: <FiAlertTriangle className="w-8 h-8" />,
        title: "Correção de Erros no Windows",
        desc: "Resolvemos erros de sistema, telas azuis, falhas de inicialização e problemas de desempenho no Windows remotamente.",
        price: "A partir de R$ 49,90",
        link: "/suporte-ao-windows",
        highlight: false
    },
    {
        icon: <FiShield className="w-8 h-8" />,
        title: "Suporte Técnico Expresso",
        desc: "Remoção de vírus, malwares e formatação remota completa com backup seguro para PCs e Notebooks.",
        price: "A partir de R$ 99,90",
        link: "/formatacao",
        highlight: false
    }
];

const ServicesSection = () => {
    return (
        <>
            <AnimatedSection direction="up" delay={0.2}>
                <section className="py-16 px-6 overflow-x-hidden bg-gray-50 relative">
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 md:gap-8">
                            <div className="text-center">
                                <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-transparent bg-clip-text mb-1 xs:mb-2">100.000+</div>
                                <div className="text-xs xs:text-sm sm:text-base text-gray-500">Clientes Atendidos</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 text-transparent bg-clip-text mb-1 xs:mb-2">8.9</div>
                                <div className="text-xs xs:text-sm sm:text-base text-gray-500">Avaliação Média</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-pink-600 to-purple-600 text-transparent bg-clip-text mb-1 xs:mb-2">Imediato</div>
                                <div className="text-xs xs:text-sm sm:text-base text-gray-500">Tempo de Resposta</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-blue-600 to-purple-600 text-transparent bg-clip-text mb-1 xs:mb-2">100%</div>
                                <div className="text-xs xs:text-sm sm:text-base text-gray-500">Atendimento Online</div>
                            </div>
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.3}>
                <section id="services" className="relative py-20 lg:py-32 bg-gray-100 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-100/50 to-transparent blur-[100px] pointer-events-none"></div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-20 max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 mb-6">
                                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                                <span className="text-xs font-bold text-blue-700 tracking-widest uppercase">Soluções Profissionais</span>
                            </div>
                            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                                Suporte Técnico Remoto em Informática, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Otimização de PC e Serviços Windows</span>
                            </h2>
                            <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                                Atendimento online rápido para formatação, correção de erros, remoção de vírus, otimização de desempenho e desenvolvimento de sites profissionais.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
                            {services.map((service, idx) => (
                                <div key={idx} className={`group relative bg-white border ${service.highlight ? 'border-blue-300 shadow-[0_0_40px_rgba(59,130,246,0.15)]' : 'border-gray-200'} hover:border-blue-400 rounded-2xl p-1 overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}>
                                    <div className="relative h-full bg-white rounded-[16px] p-8 flex flex-col items-start overflow-hidden">
                                        {service.highlight && (
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-purple-100/50 blur-[50px] rounded-full pointer-events-none"></div>
                                        )}
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 flex items-center justify-center mb-6 group-hover:from-blue-100 group-hover:to-purple-100 group-hover:border-blue-300 transition-all duration-200 shadow-sm relative z-10">
                                            <div className="transform transition-transform duration-200 group-hover:scale-110 text-blue-600">
                                                {service.icon}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors relative z-10">{service.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow relative z-10">{service.desc}</p>
                                        <div className="w-full pt-6 border-t border-gray-200 flex items-center justify-between relative z-10">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">A partir de</span>
                                                <span className="text-gray-900 font-bold text-lg tracking-tight">{service.price.replace('A partir de ', '')}</span>
                                            </div>
                                            <Link href={service.link} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${service.highlight ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700' : 'bg-gray-100 border border-gray-200 text-gray-600 group-hover:bg-gray-200 group-hover:border-gray-300'}`} aria-label={`Ver mais sobre ${service.title}`}>
                                                <ChevronRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </AnimatedSection>
        </>
    );
};

export default ServicesSection;
