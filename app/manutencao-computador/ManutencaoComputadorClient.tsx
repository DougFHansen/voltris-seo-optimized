'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, BoltIcon, WrenchScrewdriverIcon, CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function ManutencaoComputadorClient() {

    const benefits = [
        {
            title: 'Confiabilidade',
            desc: 'Computadores mantidos regularmente têm 80% menos chances de falhas repentinas.',
            icon: <ShieldCheckIcon className="w-6 h-6" />,
            color: '#31A8FF'
        },
        {
            title: 'Prevenção',
            desc: 'Identificamos e resolvemos problemas antes que causem danos maiores ao sistema.',
            icon: <ShieldCheckIcon className="w-6 h-6" />,
            color: '#8B31FF'
        },
        {
            title: 'Performance',
            desc: 'Limpeza interna e substituição de peças desgastadas mantêm o desempenho ideal.',
            icon: <BoltIcon className="w-6 h-6" />,
            color: '#FF4B6B'
        },
        {
            title: 'Diagnóstico Preciso',
            desc: 'Utilizamos ferramentas avançadas para identificar problemas específicos no hardware.',
            icon: <WrenchScrewdriverIcon className="w-6 h-6" />,
            color: '#31A8FF'
        },
        {
            title: 'Manutenção Preventiva',
            desc: 'Programamos revisões regulares para manter seu equipamento em perfeito estado.',
            icon: <ShieldCheckIcon className="w-6 h-6" />,
            color: '#8B31FF'
        },
        {
            title: 'Garantia de Qualidade',
            desc: 'Todas as nossas manutenções incluem garantia de peças e mão de obra qualificada.',
            icon: <CheckCircleIcon className="w-6 h-6" />,
            color: '#FF4B6B'
        },
    ];

    const processSteps = [
        { step: '01', title: 'Avaliação Inicial', desc: 'Diagnóstico completo do hardware, verificando temperatura, ruídos e sintomas específicos.', color: '#31A8FF' },
        { step: '02', title: 'Limpeza Interna', desc: 'Remoção completa de poeira, substituição de pasta térmica e limpeza de componentes.', color: '#8B31FF' },
        { step: '03', title: 'Troca de Peças', desc: 'Substituição de peças desgastadas ou com defeito com componentes de qualidade.', color: '#FF4B6B' },
        { step: '04', title: 'Testes e Validação', desc: 'Verificação de estabilidade, temperatura e desempenho após a manutenção.', color: '#31A8FF' },
    ];

    const specializedServices = [
        'Troca de Cooler (CPU e GPU)',
        'Substituição de Fonte de Alimentação',
        'Troca de Pasta Térmica',
        'Limpeza de Ventoinhas e Dissipadores',
        'Verificação de Placa-Mãe e Componentes',
        'Teste de Capacidade de Armazenamento',
    ];

    return (
        <>
            <Header />
            <main className="min-h-screen bg-[#050510] font-sans selection:bg-[#31A8FF]/30 relative">

                {/* Background Effects */}
                <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-0" />
                <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-[#31A8FF]/10 blur-[150px] rounded-full pointer-events-none z-0" />
                <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-[#8B31FF]/10 blur-[150px] rounded-full pointer-events-none z-0" />

                {/* Hero Section */}
                <section className="min-h-[100dvh] flex flex-col items-center justify-center relative z-10 px-4 text-center">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#31A8FF]/10 border border-[#31A8FF]/20 backdrop-blur-md mb-8"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-[#00FF94] shadow-[0_0_8px_#00FF94] animate-pulse" />
                            <span className="text-xs font-bold text-white/90 tracking-widest uppercase">Manutenção Profissional Certificada</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-5xl md:text-7xl font-extrabold mb-8 text-white tracking-tight leading-tight"
                        >
                            Manutenção de Computador
                            <br className="hidden md:block" />
                            <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">
                                Para Máxima Confiabilidade
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-12 font-light"
                        >
                            Técnicas avançadas de manutenção preventiva e corretiva para manter seu computador funcionando
                            como novo. Diagnóstico preciso, peças originais e garantia de qualidade.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link
                                href="/assistencia-tecnica"
                                className="group inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-slate-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105"
                            >
                                Agendar Manutenção
                                <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <a
                                href="https://wa.me/5511996716235?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20a%20manuten%C3%A7%C3%A3o%20de%20computador"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white/5 border border-white/10 text-white font-bold text-lg rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md"
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25D366]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                Falar com Especialista
                            </a>
                        </motion.div>

                        {/* Scroll Indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
                        >
                            <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
                            <div className="w-[1px] h-12 bg-gradient-to-b from-[#31A8FF] to-transparent" />
                        </motion.div>
                    </div>
                </section>

                {/* Benefits Grid */}
                <section className="py-24 px-4 relative z-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-sm font-bold tracking-[0.2em] text-[#8B31FF] mb-4 uppercase">Vantagens</h2>
                            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">Benefícios da Manutenção Profissional</h3>
                            <p className="text-slate-400 max-w-2xl mx-auto">Nossa abordagem técnica e profunda garante resultados reais e duradouros</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={benefit.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group p-8 rounded-3xl bg-[#0A0A0F]/50 backdrop-blur-md border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-2"
                                >
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                                        style={{ backgroundColor: `${benefit.color}15`, color: benefit.color }}
                                    >
                                        {benefit.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed font-light">{benefit.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Process + Services */}
                <section className="py-24 px-4 relative z-10 bg-[#0A0A0F]/30 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                            {/* Process */}
                            <div>
                                <h2 className="text-sm font-bold tracking-[0.2em] text-[#31A8FF] mb-4 uppercase">Metodologia</h2>
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-8">Nosso Processo de Manutenção</h3>
                                <div className="space-y-6">
                                    {processSteps.map((step, index) => (
                                        <motion.div
                                            key={step.step}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex gap-5 p-6 bg-[#0A0A0F]/50 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                                        >
                                            <div
                                                className="text-3xl font-black font-mono shrink-0 leading-none"
                                                style={{ color: step.color, opacity: 0.5 }}
                                            >
                                                {step.step}
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold mb-2">{step.title}</h4>
                                                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Specialized Services */}
                            <div>
                                <h2 className="text-sm font-bold tracking-[0.2em] text-[#FF4B6B] mb-4 uppercase">Especialidades</h2>
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-8">Serviços Especializados</h3>
                                <div className="space-y-4">
                                    {specializedServices.map((service, i) => (
                                        <motion.div
                                            key={service}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.08 }}
                                            className="flex items-center gap-4 p-4 bg-[#0A0A0F]/50 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                                        >
                                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ['#31A8FF', '#8B31FF', '#FF4B6B'][i % 3] }} />
                                            <span className="text-slate-300 font-medium">{service}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-4 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative rounded-[3rem] overflow-hidden p-12 text-center bg-gradient-to-b from-[#1a1a2e] to-[#0A0A0F] border border-white/10"
                        >
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                    Pronto para{' '}
                                    <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">
                                        Manter seu Computador?
                                    </span>
                                </h2>
                                <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                                    Nossa equipe de técnicos certificados está pronta para aplicar técnicas avançadas de manutenção no seu equipamento.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href="/assistencia-tecnica"
                                        className="px-10 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all hover:scale-105"
                                    >
                                        Contratar Manutenção Profissional
                                    </Link>
                                    <a
                                        href="https://wa.me/5511996716235?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20a%20manuten%C3%A7%C3%A3o%20de%20computador"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-10 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20bd5a] transition-all hover:scale-105"
                                    >
                                        Falar no WhatsApp
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
