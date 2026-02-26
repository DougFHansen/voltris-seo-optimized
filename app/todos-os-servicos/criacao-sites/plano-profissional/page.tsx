'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  DevicePhoneMobileIcon,
  DocumentTextIcon,
  CursorArrowRaysIcon,
  ShareIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';

export default function PlanoProfissionalPage() {
  const supabase = createClient();
  const features = [
    {
      title: 'Design Premium',
      description: 'Layout exclusivo e profissional, desenhado para transmitir autoridade.',
      icon: <DevicePhoneMobileIcon className="w-6 h-6" />,
      color: "text-[#8B31FF]",
      bg: "bg-[#8B31FF]/10"
    },
    {
      title: 'Até 10 Páginas',
      description: 'Conteúdo completo e organizado (Home, Serviços, Blog, Cases, Contato, etc).',
      icon: <DocumentTextIcon className="w-6 h-6" />,
      color: "text-[#31A8FF]",
      bg: "bg-[#31A8FF]/10"
    },
    {
      title: 'SEO Avançado',
      description: 'Estratégia completa de palavras-chave para melhor posicionamento no Google.',
      icon: <CursorArrowRaysIcon className="w-6 h-6" />,
      color: "text-[#FF4B6B]",
      bg: "bg-[#FF4B6B]/10"
    },
    {
      title: 'Integração Social',
      description: 'Conecte suas redes sociais e automatize o fluxo de comunicação.',
      icon: <ShareIcon className="w-6 h-6" />,
      color: "text-[#00FF94]",
      bg: "bg-[#00FF94]/10"
    }
  ];

  const process = [
    {
      title: 'Análise de Mercado',
      description: 'Estudo aprofundado do seu setor e análise de benchmarking da concorrência.'
    },
    {
      title: 'Planejamento Estratégico',
      description: 'Definição de arquitetura da informação e funis de conversão.'
    },
    {
      title: 'Design Premium',
      description: 'Criação de layout exclusivo com foco em User Experience (UX) e conversão.'
    },
    {
      title: 'Desenvolvimento Full-Stack',
      description: 'Programação avançada e otimizada para performance extrema (Core Web Vitals).'
    },
    {
      title: 'Otimização e Testes',
      description: 'Ajustes finos de performance, SEO técnico e compatibilidade cross-browser.'
    },
    {
      title: 'Treinamento & Entrega',
      description: 'Capacitação completa para sua equipe gerenciar o conteúdo do site.'
    }
  ];

  const includes = [
    'Design responsivo premium',
    'Até 10 páginas personalizadas',
    'SEO avançado com análise de palavras-chave',
    'Hospedagem premium por 1 ano',
    'Certificado SSL de segurança',
    '6 meses de suporte técnico',
    'Integração com redes sociais',
    'Painel administrativo intuitivo',
    'Treinamento para gestão do site',
    'Relatórios mensais de desempenho',
    'Backup automático diário'
  ];

  const handleContratarAgora = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const orderData = {
      service_name: 'Plano Profissional - Criação de Site',
      service_description: 'Site profissional com até 10 páginas, SEO avançado e recursos exclusivos',
      final_price: 1997,
      plan_type: 'profissional',
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
      <main className="bg-[#050510] min-h-screen relative overflow-x-hidden font-sans selection:bg-[#8B31FF]/30">

        {/* Background Effects */}
        <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-0"></div>
        <div className="fixed top-0 right-1/4 w-[500px] h-[500px] bg-[#8B31FF]/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none z-0"></div>
        <div className="fixed bottom-0 left-1/4 w-[500px] h-[500px] bg-[#31A8FF]/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none z-0"></div>

        {/* Hero Section */}
        <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 pt-20 z-10 block">
          <div className="max-w-6xl mx-auto text-center">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#8B31FF] animate-pulse"></span>
              <span className="text-xs font-bold text-[#8B31FF] tracking-widest uppercase">Mais Vendido</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-extrabold mb-8 text-white tracking-tight leading-tight"
            >
              Plano <span className="bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">Profissional</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-10"
            >
              A escolha definitiva para empresas que buscam liderança de mercado, autoridade digital e resultados escaláveis.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-12 inline-block relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative bg-[#0A0A0F]/80 backdrop-blur-xl border border-[#8B31FF]/30 p-8 rounded-3xl shadow-2xl">
                <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">Investimento Único</div>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-white">R$ 1.997</span>
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
              <div className="w-[1px] h-12 bg-gradient-to-b from-[#8B31FF] to-transparent"></div>
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
                  className="bg-[#0A0A0F]/50 p-8 rounded-3xl backdrop-blur-md border border-white/5 hover:border-[#8B31FF]/30 transition-all hover:-translate-y-1"
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
              <h2 className="text-sm font-bold tracking-[0.2em] text-[#31A8FF] mb-4 uppercase">Estratégia</h2>
              <h3 className="text-3xl md:text-5xl font-bold text-white">Processo de Desenvolvimento</h3>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-[#8B31FF] via-[#31A8FF] to-[#8B31FF]/10"></div>

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
                    <div className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-[#050510] border-2 border-[#31A8FF] mt-[26px] md:mt-0 z-10 shadow-[0_0_10px_#31A8FF]"></div>

                    {/* Content Box */}
                    <div className="ml-12 md:ml-0 flex-1 w-full md:w-auto p-8 bg-[#0A0A0F]/80 rounded-3xl backdrop-blur-md border border-white/5 hover:border-[#8B31FF]/20 transition-colors">
                      <div className="text-[#8B31FF] font-mono text-sm mb-2">0{index + 1}</div>
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

            <h2 className="text-3xl font-bold text-white mb-12">Recursos Inclusos</h2>

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
                  <div className="w-8 h-8 rounded-full bg-[#8B31FF]/10 flex items-center justify-center shrink-0">
                    <CheckCircleIcon className="w-5 h-5 text-[#8B31FF]" />
                  </div>
                  <span className="text-slate-300 font-medium">{item}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-[#8B31FF]/10 via-[#31A8FF]/10 to-[#FF4B6B]/10 rounded-[3rem] p-12 border border-white/10 relative overflow-hidden"
            >
              <div className="relative z-10">
                <h2 className="text-4xl font-bold text-white mb-6">Impulsione Seu Negócio</h2>
                <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                  A solução mais completa para quem não aceita menos que a excelência.
                </p>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const message = 'Olá, gostaria de contratar o Plano Profissional de Criação de Site';
                    window.open(`https://wa.me/5511996716235?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                  className="inline-flex items-center justify-center px-12 py-5 bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] text-white font-bold text-lg rounded-xl hover:shadow-[0_0_30px_rgba(139,49,255,0.4)] transition-all duration-300 hover:scale-105"
                >
                  Contratar Plano Profissional
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
