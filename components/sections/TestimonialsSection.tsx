"use client";
import React from 'react';
import AnimatedSection from '@/components/AnimatedSection';

const testimonials = [
    {
        name: "Carlos Silva",
        role: "Gamer Competitivo",
        location: "São Paulo, SP",
        text: "Meu FPS no Valorant literalmente dobrou. Eu não acreditava que otimização de software faria tanta diferença, mas a Voltris provou o contrário. Atendimento impecável!",
        initial: "C",
        color: "from-[#FF4B6B] to-[#FF8F6B]"
    },
    {
        name: "Ana Costa",
        role: "Designer Gráfico",
        location: "Rio de Janeiro, RJ",
        text: "Precisava do meu PC voando para renderizar projetos 3D. A limpeza e otimização deixaram a máquina como nova. O suporte remoto foi super seguro e transparente.",
        initial: "A",
        color: "from-[#8B31FF] to-[#31A8FF]"
    },
    {
        name: "Ricardo Oliveira",
        role: "Desenvolvedor",
        location: "Curitiba, PR",
        text: "Contratei a criação do site para minha empresa e o resultado superou todas as expectativas. Site rápido, moderno e focado em conversão. Recomendo demais!",
        initial: "R",
        color: "from-[#00FF88] to-[#00A3FF]"
    }
];

const TestimonialsSection = () => {
    return (
        <AnimatedSection direction="up" delay={0.2}>
            <section className="relative py-20 lg:py-32 bg-gray-50 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-100/50 to-purple-100/50 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-sm font-semibold tracking-[0.2em] text-blue-600 mb-4 uppercase">Depoimentos</h2>
                        <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                            O que dizem sobre a <br />
                            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-transparent bg-clip-text">Experiência Voltris</span>
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
                        {testimonials.map((t, i) => (
                            <div key={i} className="group bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 relative overflow-hidden">
                                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${t.color} opacity-[0.03] blur-2xl group-hover:opacity-[0.08] transition-opacity`}></div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-500/10`}>
                                        {t.initial}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{t.name}</h4>
                                        <p className="text-xs text-gray-500 font-medium">{t.role} • {t.location}</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <span className="absolute -top-4 -left-2 text-6xl text-gray-100 font-serif leading-none select-none">“</span>
                                    <p className="text-gray-600 leading-relaxed relative z-10 italic">
                                        {t.text}
                                    </p>
                                </div>
                                <div className="mt-6 flex gap-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <svg key={s} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </AnimatedSection>
    );
};

export default TestimonialsSection;
