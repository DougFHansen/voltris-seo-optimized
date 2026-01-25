"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ChartBarIcon,
  ClockIcon,
  ShieldCheckIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  StarIcon,
  CogIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';
import TechFloatingElements from '@/components/TechFloatingElements';

const supabase = createClient();

const otimizacaoPlans = [
  {
    id: "otimizacao-basica",
    title: "Otimização Básica",
    description: "Limpeza e ajustes simples para melhorar performance.",
    icon: <CogIcon className="w-8 h-8" />,
    price: "R$ 79,90",
    features: [
      "Limpeza de arquivos temporários",
      "Remoção de cache do sistema",
      "Desinstalação de programas desnecessários",
      "Otimização de inicialização",
      "Verificação de disco",
      "Suporte técnico por 30 dias"
    ],
    plan_type: "Otimização Básica"
  },
  {
    id: "otimizacao-media",
    title: "Otimização Média",
    description: "Limpeza completa + otimização de performance.",
    icon: <ChartBarIcon className="w-8 h-8" />,
    price: "R$ 119,90",
    features: [
      "Tudo da Otimização Básica",
      "Otimização de memória RAM",
      "Configuração de serviços do Windows",
      "Otimização de disco rígido",
      "Remoção de malware",
      "Suporte técnico por 60 dias"
    ],
    plan_type: "Otimização Média"
  },
  {
    id: "otimizacao-avancada",
    title: "Otimização Avançada",
    description: "Limpeza completa + performance máxima.",
    icon: <StarIcon className="w-8 h-8" />,
    price: "R$ 159,90",
    features: [
      "Tudo da Otimização Média",
      "Otimização de registro do Windows",
      "Configuração de drivers",
      "Otimização de rede",
      "Instalação de programas de otimização",
      "Suporte técnico por 90 dias"
    ],
    plan_type: "Otimização Avançada"
  },
  {
    id: "otimizacao-premium",
    title: "Otimização Premium",
    description: "Otimização completa com monitoramento contínuo.",
    icon: <BoltIcon className="w-8 h-8" />,
    price: "R$ 199,90",
    features: [
      "Tudo da Otimização Avançada",
      "Monitoramento de performance",
      "Otimização automática",
      "Relatórios de performance",
      "Manutenção preventiva",
      "Suporte técnico por 180 dias"
    ],
    plan_type: "Otimização Premium"
  }
];

export default function OtimizacaoPcPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const benefits = [
    {
      title: 'Suporte Remoto 24/7',
      description: 'Atendimento técnico especializado a qualquer momento',
      icon: <ClockIcon className="w-12 h-12 text-[#FF4B6B]" />
    },
    {
      title: 'Segurança Garantida',
      description: 'Proteção completa para seus dados e sistemas',
      icon: <ShieldCheckIcon className="w-12 h-12 text-[#8B31FF]" />
    },
    {
      title: 'Performance Máxima',
      description: 'Otimização completa do seu sistema',
      icon: <ChartBarIcon className="w-12 h-12 text-[#31A8FF]" />
    },
    {
      title: 'Backup Automático',
      description: 'Seus dados sempre protegidos',
      icon: <CloudArrowUpIcon className="w-12 h-12 text-[#FF4B6B]" />
    }
  ];

  const faqs = [
    {
      question: 'Como funciona a otimização remota?',
      answer: 'Utilizamos ferramentas seguras de acesso remoto para otimizar seu computador sem necessidade de deslocamento, melhorando significativamente a performance.'
    },
    {
      question: 'A otimização pode danificar meu computador?',
      answer: 'Não! Nossa otimização é segura e não danifica seu sistema. Fazemos backup de configurações importantes antes de qualquer alteração.'
    },
    {
      question: 'Qual a melhoria esperada na performance?',
      answer: 'Geralmente observamos melhoria de 30% a 50% na velocidade de inicialização e 20% a 40% na performance geral do sistema.'
    },
    {
      question: 'A otimização remove meus arquivos?',
      answer: 'Não! Apenas removemos arquivos temporários e desnecessários. Todos os seus arquivos pessoais permanecem intactos.'
    }
  ];

  const handleContratarAgora = async (plan: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    const orderData = {
      service_name: plan.title,
      service_description: plan.description,
      final_price: plan.price,
      plan_type: plan.plan_type,
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

        {/* Background Effects (Global) */}
        <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-0"></div>
        <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-[#31A8FF]/5 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow max-w-full pointer-events-none z-0"></div>
        <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-[#8B31FF]/5 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow max-w-full pointer-events-none z-0"></div>

        {/* Hero Section */}
        <section className="min-h-[100dvh] flex flex-col items-center justify-center relative z-10 w-full">
          <TechFloatingElements />

          <div className="container mx-auto px-4 text-center flex-grow flex flex-col items-center justify-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-5xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:border-[#31A8FF]/30 transition-all cursor-default">
                <span className="flex h-2 w-2 rounded-full bg-[#00FF94] shadow-[0_0_8px_#00FF94] animate-pulse"></span>
                <span className="text-xs sm:text-sm font-medium text-white tracking-wide">Performance Máxima</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
                Otimização de <span className="bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text animate-gradient-x">PC & Notebook</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                Transforme a velocidade do seu computador com nossa otimização avançada via acesso remoto. <strong>Sem formatação</strong>, 100% seguro.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
                >
                  <BoltIcon className="w-5 h-5" /> Ver Planos
                </button>
                <a
                  href="/contato"
                  className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <ClockIcon className="w-5 h-5" /> Falar com Especialista
                </a>
              </div>
            </motion.div>
          </div>


          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer text-slate-500 hover:text-white transition-colors"
            onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[#31A8FF] to-transparent"></div>
          </motion.div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 px-4 bg-[#0A0A0F] relative z-10 w-full border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  className="bg-[#121218] p-8 rounded-3xl border border-white/5 hover:border-[#31A8FF]/30 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#31A8FF]/10 rounded-full blur-[60px] -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-50"></div>
                  <div className="mb-6 transform group-hover:scale-105 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section id="planos" className="py-24 px-4 relative z-10 w-full">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Escolha seu Pacote</h2>
              <p className="text-slate-400">Opções para todos os níveis de exigência.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {otimizacaoPlans.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ y: -8 }}
                  className="group relative bg-[#121218] backdrop-blur-sm p-1 rounded-3xl border border-white/5 flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:shadow-[#31A8FF]/10"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-[#31A8FF] to-[#8B31FF] opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}></div>
                  <div className="relative h-full bg-[#121218] rounded-[22px] p-8 flex flex-col">

                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {plan.icon}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{plan.title}</h3>
                    <div className="text-2xl font-bold text-[#31A8FF] mb-6">{plan.price}</div>

                    <p className="text-slate-400 text-sm mb-8 flex-grow">
                      {plan.description}
                    </p>

                    <button
                      onClick={() => handleContratarAgora(plan)}
                      className="w-full py-3 rounded-xl bg-white/5 hover:bg-white text-white hover:text-black font-semibold transition-all border border-white/10 hover:border-white"
                    >
                      Contratar
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Optimization? Detailed Info */}
        <section className="py-24 px-4 bg-[#0A0A0F] border-t border-white/5 relative z-10 w-full">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Por que Otimizar?</h2>
                <div className="space-y-6 text-slate-400">
                  <p>
                    Com o tempo, todo computador acumula arquivos inúteis, registros corrompidos e processos em segundo plano que drenam recursos. Isso resulta em lentidão, travamentos e demora para ligar.
                  </p>
                  <p>
                    Nossa otimização age cirurgicamente nesses problemas. Removemos o "lixo digital", ajustamos configurações ocultas do Windows e priorizamos o que realmente importa. O resultado é uma máquina que respira, responde instantaneamente e oferece uma experiência fluida.
                  </p>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-center gap-2"><CheckCircleIcon className="w-5 h-5 text-[#00FF94]" /> <span>Boot mais rápido</span></li>
                    <li className="flex items-center gap-2"><CheckCircleIcon className="w-5 h-5 text-[#00FF94]" /> <span>Jogos com mais FPS</span></li>
                    <li className="flex items-center gap-2"><CheckCircleIcon className="w-5 h-5 text-[#00FF94]" /> <span>Navegação ágil</span></li>
                  </ul>
                </div>
              </div>
              <div className="bg-[#121218] p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#31A8FF]/5 to-transparent"></div>
                <h3 className="text-xl font-bold text-white mb-6 relative z-10">O que limpamos:</h3>
                <div className="grid grid-cols-1 gap-4 relative z-10">
                  {[
                    { title: "Arquivos Temporários", desc: "Gigabytes de espaço recuperado" },
                    { title: "Registro do Windows", desc: "Correção de erros e estabilidade" },
                    { title: "Bloatware", desc: "Remoção de apps pré-instalados inúteis" },
                    { title: "Telemetria", desc: "Mais privacidade e menos uso de CPU" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                      <ShieldCheckIcon className="w-5 h-5 text-[#8B31FF] mt-1" />
                      <div>
                        <div className="text-white font-medium">{item.title}</div>
                        <div className="text-xs text-slate-500">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-4 max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold text-white text-center mb-16">Dúvidas Comuns</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-[#121218] border border-white/5 hover:border-white/10 transition-all"
              >
                <h3 className="text-lg font-bold text-white mb-2">{faq.question}</h3>
                <p className="text-slate-400 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 border-t border-white/5 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Acelere seu PC Agora</h2>
            <button
              onClick={() => handleContratarAgora(otimizacaoPlans[0])}
              className="px-10 py-5 rounded-2xl bg-white text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            >
              Começar Otimização
            </button>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
