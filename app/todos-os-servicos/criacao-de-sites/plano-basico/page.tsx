'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  DevicePhoneMobileIcon,
  DocumentTextIcon,
  ClockIcon,
  CursorArrowRaysIcon,
  CheckCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export default function PlanoBasicoPage() {
  const features = [
    {
      title: 'Site Responsivo',
      description: 'Design fluido que se adapta perfeitamente a todos os dispositivos e tamanhos de tela.',
      icon: <DevicePhoneMobileIcon className="w-6 h-6" />,
      color: "text-[#31A8FF]",
      bg: "bg-[#31A8FF]/10"
    },
    {
      title: 'Até 5 Páginas',
      description: 'Estrutura completa (Home, Sobre, Serviços, Contato) para apresentar seu negócio.',
      icon: <DocumentTextIcon className="w-6 h-6" />,
      color: "text-[#8B31FF]",
      bg: "bg-[#8B31FF]/10"
    },
    {
      title: 'Entrega em 15 Dias',
      description: 'Processo ágil e metodologia Sprint para colocar seu site no ar rapidamente.',
      icon: <ClockIcon className="w-6 h-6" />,
      color: "text-[#FF4B6B]",
      bg: "bg-[#FF4B6B]/10"
    },
    {
      title: 'Otimização SEO',
      description: 'Configuração técnica inicial para garantir visibilidade nos motores de busca.',
      icon: <CursorArrowRaysIcon className="w-6 h-6" />,
      color: "text-[#00FF94]",
      bg: "bg-[#00FF94]/10"
    }
  ];

  const process = [
    {
      title: 'Briefing & Imersão',
      description: 'Entendemos profundamente suas necessidades, público-alvo e objetivos de negócio.'
    },
    {
      title: 'Design UI/UX',
      description: 'Criamos interfaces modernas e intuitivas, refinando o layout com seu feedback.'
    },
    {
      title: 'Desenvolvimento',
      description: 'Codificação clean code utilizando as tecnologias mais modernas do mercado (Next.js).'
    },
    {
      title: 'Quality Assurance',
      description: 'Bateria rigorosa de testes de performance, responsividade e compatibilidade.'
    },
    {
      title: 'Deploy & Lançamento',
      description: 'Configuração de domínio, hospedagem e publicação oficial do seu novo site.'
    }
  ];

  const includes = [
    'Design responsivo moderno',
    'Até 5 páginas personalizadas',
    'Formulário de contato inteligente',
    'Otimização SEO técnica (On-page)',
    'Hospedagem Premium (1 ano Grátis)',
    '3 meses de suporte prioritário',
    'Setup Google Analytics 4',
    'Certificado SSL (Site Seguro)'
  ];

  const handleContratarAgora = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const orderData = {
      service_name: 'Plano Básico - Criação de Site',
      service_description: 'Site profissional com até 5 páginas, design responsivo e suporte técnico',
      final_price: 997,
      plan_type: 'basico',
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

        {/* Background Effects */}
        <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-0"></div>
        <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-[#31A8FF]/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none z-0"></div>
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-[#8B31FF]/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none z-0"></div>

        {/* Hero Section */}
        <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 pt-20 z-10">
          <div className="max-w-6xl mx-auto text-center">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#31A8FF] animate-pulse"></span>
              <span className="text-xs font-bold text-[#31A8FF] tracking-widest uppercase">Plano Ideal para Iniciar</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-extrabold mb-8 text-white tracking-tight leading-tight"
            >
              Plano <span className="bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] text-transparent bg-clip-text">Essencial</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-10"
            >
              A solução perfeita para estabelecer sua presença digital com um site profissional, rápido e moderno.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-12 inline-block relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
                <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">Investimento Único</div>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-white">R$ 997</span>
                  <span className="text-xl text-slate-500">,90</span>
                </div>
              </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
            >
              <div className="w-[1px] h-12 bg-gradient-to-b from-[#31A8FF] to-transparent"></div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#0A0A0F]/50 p-8 rounded-3xl backdrop-blur-md border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                    <div className={feature.color}>{feature.icon}</div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-light">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-24 px-4 relative z-10 bg-[#0A0A0F]/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-sm font-bold tracking-[0.2em] text-[#8B31FF] mb-4 uppercase">Metodologia</h2>
              <h3 className="text-3xl md:text-5xl font-bold text-white">Como Funciona o Processo</h3>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-[#31A8FF] via-[#8B31FF] to-[#31A8FF]/10"></div>

              <div className="space-y-16">
                {process.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`flex flex-col md:flex-row gap-8 items-start md:items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                      }`}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-[#050510] border-2 border-[#8B31FF] mt-[26px] md:mt-0 z-10"></div>

                    {/* Content Box */}
                    <div className="ml-12 md:ml-0 flex-1 w-full md:w-auto p-8 bg-[#0A0A0F]/80 rounded-3xl backdrop-blur-md border border-white/5 hover:border-white/10 transition-colors">
                      <div className="text-[#31A8FF] font-mono text-sm mb-2">0{index + 1}</div>
                      <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                    </div>

                    {/* Spacer for Alternate Layout */}
                    <div className="hidden md:block flex-1"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Included & CTA */}
        <section className="py-24 px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">

            <h2 className="text-3xl font-bold text-white mb-12">O Pacote Completo</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16 text-left">
              {includes.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-5 bg-[#0A0A0F]/50 rounded-2xl border border-white/5 hover:bg-white/[0.02]"
                >
                  <div className="w-8 h-8 rounded-full bg-[#00FF94]/10 flex items-center justify-center shrink-0">
                    <CheckCircleIcon className="w-5 h-5 text-[#00FF94]" />
                  </div>
                  <span className="text-slate-300 font-medium">{item}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-[#31A8FF]/10 via-[#8B31FF]/10 to-[#FF4B6B]/10 rounded-[3rem] p-12 border border-white/10 relative overflow-hidden"
            >
              <div className="relative z-10">
                <h2 className="text-4xl font-bold text-white mb-6">Pronto para transformar sua ideia?</h2>
                <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                  Garanta sua vaga hoje e tenha seu projeto em mãos em tempo recorde.
                </p>
                <Link
                  href="#"
                  onClick={e => { e.preventDefault(); handleContratarAgora(); }}
                  className="inline-flex items-center justify-center px-12 py-5 bg-white text-black font-bold text-lg rounded-xl hover:bg-slate-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105"
                >
                  Contratar Plano Essencial
                </Link>
              </div>
            </motion.div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
} 
