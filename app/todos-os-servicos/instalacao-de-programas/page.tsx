"use client";

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { RocketLaunchIcon, ShieldCheckIcon, PaintBrushIcon, CheckCircleIcon, SparklesIcon, PuzzlePieceIcon, BoltIcon, CloudArrowDownIcon, CommandLineIcon } from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

const programasComuns = [
  'Adobe Acrobat Pro 2023',
  'Adobe After Effects 2023',
  'Adobe Animate 2024',
  'Adobe Audition 2023',
  'Adobe Illustrator 2024',
  'Adobe Illustrator 2025',
  'Adobe InDesign 2023',
  'Adobe Lightroom 2023',
  'Adobe Media Encoder 2024',
  'Adobe Photoshop 2024',
  'Adobe Photoshop 2025',
  'Adobe Premiere Pro 2024',
  'Autodesk AutoCAD 2023',
  'CorelDRAW Graphics Suite 2024',
  'Maxon Cinema 4D',
  'Microsoft Office (Pacote Completo)',
  'SketchUp Pro 2023',
];

export default function InstalacaoDeProgramasPage() {
  const [openComuns, setOpenComuns] = useState<boolean>(false);
  const router = useRouter();

  const benefits = [
    {
      title: 'Instalação Ágil',
      description: 'Processo realizado em tempo recorde por especialistas via acesso remoto.',
      icon: <RocketLaunchIcon className="w-8 h-8 text-[#FF4B6B]" />,
      bg: "bg-[#FF4B6B]/10"
    },
    {
      title: 'Zero Bloatware',
      description: 'Instalamos apenas o software original, sem barras de ferramentas ou adwares.',
      icon: <ShieldCheckIcon className="w-8 h-8 text-[#8B31FF]" />,
      bg: "bg-[#8B31FF]/10"
    },
    {
      title: 'Configuração',
      description: 'Ajuste fino das configurações para performance máxima no seu hardware.',
      icon: <PaintBrushIcon className="w-8 h-8 text-[#31A8FF]" />,
      bg: "bg-[#31A8FF]/10"
    },
    {
      title: 'Versão Estável',
      description: 'Garantimos a instalação da versão mais estável e segura disponível.',
      icon: <CloudArrowDownIcon className="w-8 h-8 text-[#00FF94]" />,
      bg: "bg-[#00FF94]/10"
    }
  ];

  const faqs = [
    {
      question: 'Como funciona a instalação remota?',
      answer: 'Utilizamos softwares seguros como AnyDesk ou TeamViewer. Você acompanha todo o processo na sua tela enquanto nosso técnico realiza a instalação e configuração.'
    },
    {
      question: 'O valor é por programa?',
      answer: 'Temos pacotes para instalação única ou múltiplos programas. O plano básico cobre a instalação de um pacote de softwares essenciais (Navegadores, Leitores de PDF, Comunicadores, etc).'
    },
    {
      question: 'Vocês instalam software pirata?',
      answer: 'Não. Trabalhamos exclusivamente com softwares originais, freeware (gratuitos) ou open-source. Para softwares pagos, o cliente deve possuir a licença.'
    },
    {
      question: 'Qual o tempo médio de atendimento?',
      answer: 'A maioria das instalações é concluída em menos de 30 minutos após o início do acesso remoto.'
    }
  ];

  const handleContratarAgora = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const orderData = {
      service_name: 'Instalação de Programas',
      service_description: 'Instalação e configuração de programas no Windows.',
      final_price: 49,
      plan_type: undefined,
    };
    sessionStorage.setItem('pendingOrderData', JSON.stringify(orderData));
    if (!session) {
      window.location.href = `/login?redirect=/dashboard?pendingOrder=true`;
      return;
    }
    window.location.href = '/dashboard?pendingOrder=true';
  };

  return (
    <>
      <Header />
      <main className="bg-[#050510] min-h-screen relative overflow-x-hidden font-sans selection:bg-[#FF4B6B]/30">

        {/* Background Effects */}
        <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-0"></div>
        <div className="fixed top-0 left-1/2 w-[500px] h-[500px] bg-[#31A8FF]/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none z-0"></div>
        <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-[#8B31FF]/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none z-0"></div>

        {/* Hero Section */}
        <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 pt-20 z-10 block">

          <div className="max-w-6xl mx-auto text-center">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#00FF94] animate-pulse"></span>
              <span className="text-xs font-bold text-[#00FF94] tracking-widest uppercase">Software Center</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-extrabold mb-8 text-white tracking-tight leading-tight"
            >
              Instalação de <span className="bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">Softwares</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-10"
            >
              De navegadores a suítes de edição profissional. Instalamos, configuramos e otimizamos qualquer software que você precisar.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-32 inline-block relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <button
                onClick={() => document.getElementById('lista-softwares')?.scrollIntoView({ behavior: 'smooth' })}
                className="relative px-8 py-4 bg-[#0A0A0F] border border-white/20 hover:border-white/40 text-white font-bold rounded-xl transition-all hover:scale-105"
              >
                Ver Lista de Softwares
              </button>
            </motion.div>


            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
            >
              <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
              <div className="w-[1px] h-12 bg-gradient-to-b from-[#31A8FF] to-transparent"></div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#0A0A0F]/50 p-8 rounded-3xl backdrop-blur-md border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-2xl ${benefit.bg} flex items-center justify-center mb-6`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-light">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Softwares List Section */}
        <section id="lista-softwares" className="py-24 px-4 relative z-10 bg-[#0A0A0F]/30 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold tracking-[0.2em] text-[#31A8FF] mb-4 uppercase">Catálogo</h2>
              <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">Programas Essenciais</h3>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#0A0A0F] rounded-[2rem] border border-white/10 overflow-hidden"
            >
              <button
                className="w-full flex justify-between items-center px-8 py-6 text-lg font-bold text-white hover:bg-white/5 transition-all duration-300 group"
                onClick={() => setOpenComuns(!openComuns)}
                aria-expanded={openComuns}
              >
                <span className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#31A8FF]/10 flex items-center justify-center">
                    <PuzzlePieceIcon className="w-5 h-5 text-[#31A8FF]" />
                  </div>
                  Expanda para ver a lista completa
                </span>
                <span className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-transform duration-300 ${openComuns ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </button>

              <AnimatePresence>
                {openComuns && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-white/5"
                  >
                    <div className="px-8 py-8 bg-[#0A0A0F]">
                      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 mb-10">
                        {programasComuns.map((nome) => (
                          <li key={nome} className="flex items-center gap-3 text-slate-300 text-sm p-3 rounded-xl hover:bg-white/5 transition-colors cursor-default">
                            <CheckCircleIcon className="w-5 h-5 text-[#00FF94] shrink-0" />
                            {nome}
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-r from-[#31A8FF]/10 to-[#8B31FF]/10 border border-white/5">
                        <div>
                          <span className="block text-2xl font-bold text-white mb-1">Valor: A combinar</span>
                          <span className="text-sm text-slate-400">Taxa única de serviço</span>
                        </div>
                        <button
                          onClick={handleContratarAgora}
                          className="px-8 py-3 bg-[#31A8FF] text-white font-bold rounded-xl hover:bg-[#31A8FF]/90 transition-all shadow-lg shadow-[#31A8FF]/20"
                        >
                          Contratar Instalação
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Preview quando fechado (opcional) ou sempre visível se preferir a lista sempre aberta */}
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16 text-white">
              Dúvidas Frequentes
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-[#1D1919]/50 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <h3 className="text-lg font-bold text-white mb-2">{faq.question}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-[3rem] overflow-hidden p-12 text-center bg-gradient-to-b from-[#1a1a2e] to-[#0A0A0F] border border-white/10">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Precisa de um software específico?</h2>
                <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                  Entre em contato. Nossa equipe técnica instala qualquer software compatível com Windows.
                </p>
                <button className="px-10 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all hover:scale-105">
                  Falar no WhatsApp
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
} 
