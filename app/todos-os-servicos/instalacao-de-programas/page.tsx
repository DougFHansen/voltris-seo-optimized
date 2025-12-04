"use client";

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { RocketLaunchIcon, ShieldCheckIcon, PaintBrushIcon, CheckCircleIcon, QuestionMarkCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';
import { createClient } from '@/utils/supabase/client';
import AdSenseBanner from '../../components/AdSenseBanner';

const supabase = createClient();

const programasComuns = [
  'Google Chrome',
  'Mozilla Firefox',
  'WinRAR',
  'VLC Media Player',
  'Zoom',
  'Skype',
  'Spotify',
  'WhatsApp Desktop',
  'Microsoft Teams',
  'PDF Reader',
  'Java',
  'Adobe Acrobat Reader',
  'TeamViewer',
  'AnyDesk',
  'Outlook',
  'Telegram',
  'Discord',
  'Entre outros Programas',	
];

const benefits = [
  {
    title: 'Instalação Profissional',
    description: 'Equipe especializada, instalação remota rápida e segura.',
    icon: <RocketLaunchIcon className="w-12 h-12 text-[#FF4B6B]" />
  },
  {
    title: 'Segurança Garantida',
    description: 'Sem riscos, sem vírus, sem dor de cabeça.',
    icon: <ShieldCheckIcon className="w-12 h-12 text-[#8B31FF]" />
  },
  {
    title: 'Personalização',
    description: 'Configuração sob medida para o seu uso.',
    icon: <PaintBrushIcon className="w-12 h-12 text-[#31A8FF]" />
  }
];

const faqs = [
  {
    question: 'Como funciona a instalação de programas?',
    answer: 'Você escolhe o(s) programa(s) desejado(s) e um técnico realiza toda a instalação remotamente, com total segurança e acompanhamento em tempo real.'
  },
  {
    question: 'Quais programas posso instalar?',
    answer: 'Você pode instalar programas comuns como Chrome, WhatsApp, Zoom, antivírus, utilitários e muito mais.'
  },
  {
    question: 'Preciso pagar por cada programa?',
    answer: 'O valor é fixo para cada instalação, independente do programa escolhido. Consulte condições especiais para pacotes.'
  },
  {
    question: 'É seguro instalar programas remotamente?',
    answer: 'Sim! Todo o processo é feito por profissionais, com ferramentas seguras e garantia de funcionamento.'
  },
  {
    question: 'Em quanto tempo posso usar o programa?',
    answer: 'Na maioria dos casos, em menos de 1 hora após o início do atendimento você já estará usando o programa.'
  }
];

export default function InstalacaoDeProgramasPage() {
  const [openComuns, setOpenComuns] = useState<boolean>(false);
  const router = useRouter();

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
      <Head>
        <title>Instalação de Programas Comuns | Instale Software Remotamente</title>
        <meta name="description" content="Instalação de programas comuns, instalação remota de software, segurança, agilidade e suporte especializado. Instale Google Chrome, WhatsApp, Zoom, programas comuns e muito mais!" />
        <meta name="keywords" content="instalação de programas, instalar programas remotamente, instalação profissional de software, instalar Google Chrome, instalar WhatsApp, instalar Zoom, instalar programas comuns, suporte remoto, instalação segura" />
        <meta property="og:title" content="Instalação de Programas Comuns" />
        <meta property="og:description" content="Instale programas comuns com segurança, agilidade e suporte remoto especializado. Atendimento imediato!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.seusite.com/instalacao-de-programas" />
      </Head>
      <Header />
      <main className="bg-gradient-to-br from-[#18141c] via-[#1d1923] to-[#191a23] min-h-screen">
        <section className="pt-32 pb-12 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B6B]/10 via-[#8B31FF]/10 to-[#31A8FF]/10 pointer-events-none"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text drop-shadow-lg">
                Instalação de Programas Comuns
              </h1>
              <h2 className="text-xl md:text-2xl text-gray-200 font-semibold mb-2 mt-2">
                Instale programas comuns remotamente, com segurança e agilidade.
              </h2>
              <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-4">
                Instalação de programas como Google Chrome, WhatsApp, Zoom, antivírus, utilitários e muito mais. Atendimento remoto imediato!
              </p>
              <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-[#FF4B6B] to-[#31A8FF] text-white font-semibold shadow-lg animate-pulse mt-2">
                Atendimento imediato após a compra!
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-8 px-4 bg-[#1D1919]">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-gradient-to-br from-[#232027] to-[#1D1919] border border-[#8B31FF]/20 shadow-xl text-center flex flex-col items-center group"
              >
                <div className="mb-4 transform group-hover:scale-125 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 drop-shadow">{benefit.title}</h3>
                <p className="text-gray-400 text-base">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-12 px-4 bg-[#171313]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
              Escolha o Programa para Instalar
            </h2>

            {/* Programas Comuns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mb-6 rounded-2xl border-2 border-[#31A8FF] bg-[#1D1919] shadow-2xl overflow-hidden"
            >
              <button
                className="w-full flex justify-between items-center px-8 py-6 text-lg font-bold text-[#31A8FF] focus:outline-none hover:bg-[#232027]/80 transition-all duration-300 group"
                onClick={() => setOpenComuns(!openComuns)}
                aria-expanded={openComuns}
              >
                <span className="flex items-center gap-3">
                  <SparklesIcon className="w-6 h-6 text-[#FF4B6B]" />
                  Programas Comuns
                </span>
                <span className={`ml-4 transition-transform duration-300 ${openComuns ? 'rotate-90' : ''}`}>▶</span>
              </button>
              <AnimatePresence initial={false}>
                {openComuns && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-8 pb-8 bg-[#232027]"
                  >
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                      {programasComuns.map((nome) => (
                        <li key={nome} className="flex items-center gap-2 text-gray-200 text-base">
                          <CheckCircleIcon className="w-4 h-4 text-[#31A8FF]" /> {nome}
                        </li>
                      ))}
                    </ul>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleContratarAgora}
                      className="w-full py-4 px-6 rounded-xl font-bold text-lg bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white shadow-xl hover:shadow-[0_0_40px_rgba(49,168,255,0.4)] transition-all duration-300 animate-bounce-slow"
                    >
                      Instalar Programas Comuns
                      <span className="ml-2 text-base font-normal">(R$ 29,90)</span>
                    </motion.button>
                    <div className="text-xs text-gray-400 mt-2 text-center">Ideal para quem precisa dos programas mais usados no dia a dia!</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-10 px-4 bg-[#1D1919] border-t border-[#8B31FF]/10">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
              Dúvidas Frequentes
            </h3>
            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <div key={faq.question} className="p-6 rounded-xl bg-gradient-to-br from-[#171313] to-[#1D1919] border border-[#8B31FF]/10 hover:border-[#FF4B6B]/30 transition-all duration-300">
                  <h4 className="text-xl font-semibold text-white mb-2">{faq.question}</h4>
                  <p className="text-gray-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-[#FF4B6B]/10 via-[#8B31FF]/10 to-[#31A8FF]/10">
          <div className="max-w-4xl mx-auto text-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Precisa de Ajuda com a Instalação de um Programa?</h2>
              <p className="text-gray-300 text-lg mb-8">Fale com nossos especialistas para saber qual programa é o mais ideal para você!</p>
              <button className="bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-white py-4 px-8 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105">
                Começar Agora
              </button>
            </div>
          </div>
        </section>
      </main>
      <AdSenseBanner />
      <Footer />
    </>
  );
} 