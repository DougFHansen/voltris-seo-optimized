"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { Users, Target, Lightbulb, Shield, Code2, MonitorCheck, BookOpen, Clock, Globe2, Award, ChevronRight, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      <Header />

      <main className="bg-[#050510] min-h-screen relative overflow-x-hidden font-sans selection:bg-[#31A8FF]/30">
        {/* Global Ambient Effects */}
        <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-50"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#31A8FF]/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#8B31FF]/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>

        {/* Hero Section */}
        <section className="min-h-[100dvh] flex flex-col items-center justify-center relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex flex-col items-center justify-center">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-sm font-bold tracking-[0.2em] text-[#31A8FF] mb-6 uppercase">
                Nossa Essência
              </h2>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-8 leading-[1.1]">
                Mais que Suporte Técnico. <br />
                <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">
                  Engenharia de Performance.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto font-light">
                Somos um laboratório de tecnologia focado em extrair o máximo potencial do seu hardware e garantir estabilidade absoluta para o seu dia a dia.
              </p>
            </motion.div>
          </div>


          {/* Scroll Down Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer text-slate-500 hover:text-white transition-colors"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[#31A8FF] to-transparent"></div>
          </motion.div>
        </section>

        {/* Mission / Vision / Values - Glass Cards */}
        <section className="py-10 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                {
                  icon: <Target className="w-8 h-8 text-[#FF4B6B]" />,
                  title: "Nossa Missão",
                  desc: "Democratizar o acesso à engenharia de software de alta performance, transformando computadores domésticos e corporativos em máquinas de produtividade máxima."
                },
                {
                  icon: <Lightbulb className="w-8 h-8 text-[#8B31FF]" />,
                  title: "Nossa Visão",
                  desc: "Ser a referência nacional em otimização de sistemas e suporte especializado, reconhecida não apenas por consertar, mas por evoluir a tecnologia de nossos clientes."
                },
                {
                  icon: <Users className="w-8 h-8 text-[#31A8FF]" />,
                  title: "Nossos Valores",
                  desc: "Transparência radical, obsessão por performance, segurança sem concessões e atendimento humanizado que entende a pessoa por trás da tela."
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="group p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#31A8FF]/5 via-transparent to-[#FF4B6B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  <div className="w-16 h-16 rounded-2xl bg-[#0A0A0F] border border-white/10 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500 relative z-10">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm relative z-10">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Our Story - Timeline Style */}
        <section className="py-24 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                  De uma garagem para <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] to-[#8B31FF]">todo o Brasil.</span>
                </h2>
                <div className="space-y-6 text-slate-400 text-lg leading-relaxed font-light">
                  <p>
                    A história da <strong className="text-white font-semibold">Voltris</strong> começou em 2025, não como uma empresa, mas como um desafio. Douglas Felipe Moraes Gonçalves, nosso fundador, percebeu que a maioria das "assistências técnicas" se limitava a formatar computadores sem entender a raiz dos problemas de performance.
                  </p>
                  <p>
                    O que começou com suporte para amigos cresceu exponencialmente. A metodologia proprietária de otimização da Voltris — que vai além do hardware e ajusta o sistema operacional a nível de kernel — rapidamente ganhou fama entre gamers e profissionais que precisavam de estabilidade absoluta.
                  </p>
                  <p>
                    Oficializada em 2025, hoje somos uma referência em <strong>Suporte Técnico Remoto</strong> de elite, atendendo mais de 5.000 clientes com uma taxa de satisfação de 98%. Não somos apenas técnicos; somos engenheiros de performance dedicados a fazer sua máquina voar.
                  </p>
                </div>
              </motion.div>

              <div className="relative">
                {/* Decorative Tech Elements */}
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#31A8FF] opacity-10 blur-[80px] rounded-full"></div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                  {/* Decorative background glow for the grid */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#31A8FF]/5 blur-[100px] rounded-full pointer-events-none"></div>

                  <div className="space-y-6">
                    {/* Card 1: 2025 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="group relative h-56 rounded-[2rem] bg-[#0F111A] border border-white/5 p-8 flex flex-col justify-end overflow-hidden hover:border-[#FF4B6B]/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,75,107,0.15)]"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4B6B]/10 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#FF4B6B]/20 transition-all duration-500"></div>
                      <div className="absolute top-6 right-6 p-3 rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                        <Clock className="w-6 h-6 text-[#FF4B6B]" />
                      </div>

                      <span className="text-5xl font-bold bg-gradient-to-r from-[#FF4B6B] to-[#FF8F6B] text-transparent bg-clip-text relative z-10">
                        2025
                      </span>
                      <span className="text-slate-400 text-sm font-medium mt-3 relative z-10 leading-relaxed">
                        O início de uma nova era na metodologia de otimização de hardware.
                      </span>
                    </motion.div>

                    {/* Card 2: 5k+ (Highlighted) */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="group relative h-72 rounded-[2rem] bg-gradient-to-br from-[#1a1a2e] to-[#0F111A] border border-white/10 p-8 flex flex-col justify-end overflow-hidden hover:border-[#31A8FF]/50 transition-all duration-500 hover:shadow-[0_0_50px_rgba(49,168,255,0.2)]"
                    >
                      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-[#31A8FF]/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <div className="absolute top-6 right-6 p-3 rounded-xl bg-[#31A8FF]/10 border border-[#31A8FF]/20 group-hover:bg-[#31A8FF] group-hover:text-black transition-all duration-500">
                        <Users className="w-6 h-6 text-[#31A8FF] group-hover:text-black" />
                      </div>

                      <span className="text-6xl font-bold text-white tracking-tight relative z-10 group-hover:scale-105 transition-transform duration-500 origin-bottom-left">
                        5k+
                      </span>
                      <span className="text-[#31A8FF] text-sm font-bold uppercase tracking-wider mt-2 mb-1 relative z-10">
                        Clientes Ativos
                      </span>
                      <span className="text-slate-400 text-sm relative z-10 leading-relaxed">
                        Gamers e profissionais que confiam na nossa tecnologia diariamente.
                      </span>
                    </motion.div>
                  </div>

                  <div className="space-y-6 sm:pt-12">
                    {/* Card 3: 98% */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="group relative h-72 rounded-[2rem] bg-[#0F111A] border border-white/5 p-8 flex flex-col justify-end overflow-hidden hover:border-[#8B31FF]/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(139,49,255,0.15)]"
                    >
                      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#8B31FF]/10 blur-[60px] rounded-full translate-y-1/2 -translate-x-1/2 group-hover:bg-[#8B31FF]/20 transition-all duration-500"></div>

                      <div className="absolute top-6 right-6 p-3 rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                        <Award className="w-6 h-6 text-[#8B31FF]" />
                      </div>

                      <div className="relative z-10 mb-2">
                        <div className="flex items-end gap-2">
                          <span className="text-6xl font-bold text-white">98</span>
                          <span className="text-4xl font-bold text-[#8B31FF] mb-2">%</span>
                        </div>
                      </div>
                      <span className="text-slate-400 text-sm font-medium relative z-10 leading-relaxed">
                        De taxa de satisfação (NPS). Qualidade que não se discute, se comprova.
                      </span>
                    </motion.div>

                    {/* Card 4: 24/7 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="group relative h-56 rounded-[2rem] bg-[#0F111A] border border-white/5 p-8 flex flex-col justify-end overflow-hidden hover:border-[#31A8FF]/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(49,168,255,0.15)]"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <div className="absolute top-6 right-6 p-3 rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                        <Activity className="w-6 h-6 text-[#31A8FF]" />
                      </div>

                      <span className="text-5xl font-bold text-white relative z-10 group-hover:text-[#31A8FF] transition-colors duration-300">
                        24/7
                      </span>
                      <span className="text-slate-400 text-sm font-medium mt-3 relative z-10 leading-relaxed">
                        Monitoramento ininterrupto e suporte sempre que você precisar.
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Methodology - Tech Focus */}
        <section className="py-20 bg-[#0A0A0F] border-y border-white/5 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Metodologia <span className="text-[#31A8FF]">Voltris</span></h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Nosso processo é científico. Não "achamos" o problema; nós o isolamos, analisamos e resolvemos com precisão cirúrgica.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: MonitorCheck, title: "Diagnóstico Profundo", desc: "Análise de logs do sistema e telemetria para identificar gargalos invisíveis." },
                { icon: Code2, title: "Otimização Kernel", desc: "Ajustes em registros e serviços do Windows que ferramentas comuns não alcançam." },
                { icon: Shield, title: "Estabilidade Total", desc: "Configurações avançadas para eliminar travamentos e garantir a máxima confiabilidade do sistema." },
                { icon: Globe2, title: "Monitoramento Ativo", desc: "Acompanhamento pós-serviço para garantir estabilidade a longo prazo." }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group">
                  <div className="w-20 h-20 rounded-full bg-[#1A1D26] border border-white/5 flex items-center justify-center mb-6 group-hover:bg-[#31A8FF] group-hover:text-black transition-all duration-300 shadow-xl">
                    <item.icon className="w-8 h-8 text-[#31A8FF] group-hover:text-black transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founder Quote */}
        <section className="py-24 relative z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#1A1D26] to-[#0F111A] rounded-[40px] p-8 md:p-16 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B31FF]/10 blur-[100px] rounded-full"></div>

              <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-[#31A8FF] to-[#8B31FF] p-[2px] shadow-2xl shrink-0">
                  <div className="w-full h-full rounded-full bg-[#0F111A] flex items-center justify-center overflow-hidden relative">
                    <Image
                      src="/ceo.jpg"
                      alt="Douglas Felipe Moraes Gonçalves"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <BookOpen className="w-10 h-10 text-[#31A8FF] mb-6 mx-auto md:mx-0 opacity-50" />
                  <h3 className="text-2xl md:text-3xl font-light text-white italic leading-relaxed mb-8">
                    "A tecnologia deve ser libertadora, não uma dor de cabeça. Na Voltris, não consertamos apenas computadores; nós devolvemos tempo e tranquilidade para as pessoas."
                  </h3>
                  <div>
                    <p className="text-[#31A8FF] font-bold text-lg tracking-wide uppercase">Douglas Felipe Moraes Gonçalves</p>
                    <p className="text-slate-500 text-sm">CEO & Fundador</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
} 