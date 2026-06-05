"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Wrench, ChevronRight } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const AboutSection = () => {
    return (
        <AnimatedSection direction="up" delay={0.2}>
            <section id="about" className="relative py-20 lg:py-32 bg-white overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/50 to-purple-100/50 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-100/50 to-blue-100/50 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="flex flex-col gap-8 text-center lg:text-left">
                            <div>
                                <h2 className="text-sm font-bold tracking-[0.2em] text-blue-600 mb-4 uppercase">
                                    Quem Somos
                                </h2>
                                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-6">
                                    Redefinindo o Padrão de <br className="hidden lg:block" />
                                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                                        Engenharia & Performance
                                    </span>
                                </h3>
                                <p className="text-lg text-gray-500 leading-relaxed">
                                    A <strong className="text-gray-700">Voltris</strong> não é apenas uma assistência técnica convencional. Somos um laboratório de tecnologia especializado em extrair o <strong className="text-gray-700">máximo potencial do seu hardware</strong> através de otimizações a nível de kernel, limpeza profunda e segurança corporativa.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row gap-5 items-center lg:items-start text-center sm:text-left p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-200">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shrink-0 border border-blue-200">
                                        <Cpu className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-gray-900 font-semibold text-lg mb-1">Otimização de Hardware (Overclock & Tweak)</h4>
                                        <p className="text-gray-500 text-sm leading-relaxed">
                                            Ajustes finos em voltagem e frequências para garantir FPS estável e menor latência em jogos competitivos.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-5 items-center lg:items-start text-center sm:text-left p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-pink-300 hover:shadow-md transition-all duration-200">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center shrink-0 border border-pink-200">
                                        <Wrench className="w-6 h-6 text-pink-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-gray-900 font-semibold text-lg mb-1">Suporte Técnico Remoto</h4>
                                        <p className="text-gray-500 text-sm leading-relaxed">
                                            Resolução de problemas complexos de software, drivers e sistema operacional sem que você precise sair de casa.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
                                <a href="/sobre" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                                    Conheça Nossa História
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </a>
                            </div>
                        </div>

                        <div className="relative w-full max-w-[500px] mx-auto perspective-1000">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/50 to-purple-200/50 blur-[80px] opacity-50 rounded-full animate-pulse-slow"></div>
                            <motion.div
                                className="relative w-full aspect-[4/5] sm:aspect-square bg-gradient-to-br from-gray-50 to-gray-100 backdrop-blur-xl rounded-3xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col"
                                initial={{ rotateY: -5, opacity: 0 }}
                                whileInView={{ rotateY: 0, opacity: 1 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="text-xs text-gray-500 font-mono">root@voltris-core:~</div>
                                </div>
                                <div className="p-6 font-mono text-xs sm:text-sm text-gray-600 space-y-4 flex-1 overflow-hidden relative">
                                    <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}><span className="text-purple-600">➜</span> <span className="text-blue-600">initialize</span> --mode=performance_boost</motion.div>
                                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1 }} className="space-y-1 pl-4 border-l-2 border-[#31A8FF]/20">
                                        <div className="text-blue-600">[INFO] Loading core modules...</div>
                                        <div>Analyzed Processes: <span className="text-green-600">12,405</span></div>
                                        <div>Optimized Services: <span className="text-green-600">58</span></div>
                                        <div>Network Latency: <span className="text-red-500 line-through mr-2">45ms</span> <span className="text-green-600">12ms</span></div>
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 2 }}><span className="text-purple-600">➜</span> <span className="text-pink-600">security_check</span> --deep-scan</motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </AnimatedSection>
    );
};

export default AboutSection;
