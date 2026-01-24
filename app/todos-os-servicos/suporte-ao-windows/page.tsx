'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
const supabase = createClient();
import {
  RocketLaunchIcon,
  ChartBarIcon,
  CloudArrowUpIcon,
  BoltIcon,
  ServerIcon,
  ComputerDesktopIcon,
  ShieldCheckIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

export default function SuporteWindowsPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleContratarAgora = async (plan: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    let priceNumber = plan.price;
    if (typeof priceNumber === 'string') {
      priceNumber = Number(priceNumber.replace(/[^\d,\.]/g, '').replace(',', '.'));
    }
    if (!priceNumber || isNaN(priceNumber)) priceNumber = 0;
    const orderData = {
      planName: plan.name,
      planPrice: priceNumber,
      planFeatures: plan.features || [],
      planDescription: plan.description || '',
      plan_type: plan.id, // Corrigido para plan_type
      service_name: `Suporte Windows: ${plan.name}`,
      service_description: plan.features ? plan.features.join(' | ') : plan.description,
      final_price: priceNumber,
      total: priceNumber,
      items: [
        {
          service_name: `Suporte Windows: ${plan.name}`,
          service_description: plan.features ? plan.features.join(' | ') : plan.description,
          price: priceNumber
        }
      ]
    };
    sessionStorage.setItem('pendingOrderData', JSON.stringify(orderData));
    if (!session) {
      window.location.href = `/login?redirect=/dashboard&pendingOrder=true`;
      return;
    }
    window.location.href = '/dashboard?pendingOrder=true';
  };

  const benefits = [
    {
      title: 'Atendimento Prioritário',
      description: 'Suporte técnico com resposta rápida e SLA definido.',
      icon: <RocketLaunchIcon className="w-8 h-8 text-[#FF4B6B]" />,
      bg: 'bg-[#FF4B6B]/10',
      border: 'hover:border-[#FF4B6B]/30'
    },
    {
      title: 'Monitoramento 24/7',
      description: 'Vigilância constante da saúde e segurança do sistema.',
      icon: <ChartBarIcon className="w-8 h-8 text-[#8B31FF]" />,
      bg: 'bg-[#8B31FF]/10',
      border: 'hover:border-[#8B31FF]/30'
    },
    {
      title: 'Backup Automático',
      description: 'Seus dados críticos protegidos e criptografados na nuvem.',
      icon: <CloudArrowUpIcon className="w-8 h-8 text-[#31A8FF]" />,
      bg: 'bg-[#31A8FF]/10',
      border: 'hover:border-[#31A8FF]/30'
    },
    {
      title: 'Otimização Regular',
      description: 'Manutenção preventiva mensal para performance máxima.',
      icon: <BoltIcon className="w-8 h-8 text-[#00FF94]" />,
      bg: 'bg-[#00FF94]/10',
      border: 'hover:border-[#00FF94]/30'
    }
  ];

  const plans = [
    {
      id: 'basico',
      name: 'Start',
      price: 'R$349,90',
      period: '/mês',
      icon: <ComputerDesktopIcon className="w-10 h-10 mb-6 text-[#31A8FF]" />,
      description: 'Ideal para usuários domésticos e computadores pessoais',
      features: [
        'Suporte remoto (9h às 18h)',
        'Otimização mensal completa',
        'Remoção de vírus e malware',
        'Backup básico de arquivos',
        'Atendimento em até 24h',
        'Suporte para até 3 PCs'
      ],
      highlights: [
        'Economia de tempo',
        'Maior durabilidade do PC'
      ],
      color: 'border-[#31A8FF]',
      btnColor: 'bg-[#31A8FF] hover:bg-[#31A8FF]/90'
    },
    {
      id: 'profissional',
      name: 'Business',
      price: 'R$549,90',
      period: '/mês',
      icon: <ServerIcon className="w-10 h-10 mb-6 text-[#8B31FF]" />,
      description: 'Perfeito para profissionais liberais e pequenas empresas',
      features: [
        'Suporte prioritário (8h às 20h)',
        'Otimização quinzenal',
        'Proteção avançada malware',
        'Backup Cloud 100GB',
        'Atendimento em até 4h',
        'Suporte para até 6 PCs',
        'Relatórios mensais',
        'Consultoria de software'
      ],
      highlights: [
        'Aumento de produtividade',
        'Redução de custos TI',
        'Dados seguros'
      ],
      popular: true,
      color: 'border-[#8B31FF]',
      btnColor: 'bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] hover:shadow-lg hover:shadow-[#8B31FF]/25'
    },
    {
      id: 'empresarial',
      name: 'Enterprise',
      price: 'R$1.259,90',
      period: '/mês',
      icon: <ShieldCheckIcon className="w-10 h-10 mb-6 text-[#FF4B6B]" />,
      description: 'Solução completa para empresas e equipes maiores',
      features: [
        'Suporte remoto e presencial 24/7',
        'Otimização semanal',
        'Proteção Real-time',
        'Backup Cloud Ilimitado',
        'Atendimento em até 1h',
        'PCs Ilimitados (Sob consulta)',
        'Gestão de servidores',
        'Treinamento de equipe'
      ],
      highlights: [
        'Máxima segurança',
        'Disponibilidade total',
        'Escalabilidade'
      ],
      color: 'border-[#FF4B6B]',
      btnColor: 'bg-[#FF4B6B] hover:bg-[#FF4B6B]/90'
    }
  ];

  const faqs = [
    {
      question: 'Como funciona o suporte remoto?',
      answer: 'Utilizamos ferramentas seguras de nível empresarial (AnyDesk/TeamViewer) com criptografia ponta a ponta. Você acompanha tudo em tempo real.'
    },
    {
      question: 'Qual o horário de atendimento?',
      answer: 'Varia conforme o plano. O plano Start atende em horário comercial, o Business estendido e o Enterprise oferece cobertura 24/7 para emergências.'
    },
    {
      question: 'O backup é realmente seguro?',
      answer: 'Absolutamente. Utilizamos servidores criptografados e redundantes. Seus dados são a nossa prioridade máxima.'
    }
  ];

  return (
    <>
      <Header />
      <main className="bg-[#050510] min-h-screen relative overflow-x-hidden font-sans selection:bg-[#31A8FF]/30">

        {/* Background Effects */}
        <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-0"></div>
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#31A8FF]/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none z-0"></div>
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-[#8B31FF]/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none z-0"></div>

        {/* Hero Section */}
        <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 pt-20 z-10 block">

          <div className="max-w-6xl mx-auto text-center">

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-[#00FF94] animate-pulse"></span>
              <span className="text-xs font-bold text-white tracking-widest uppercase">Suporte Técnico Especializado</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-extrabold mb-8 text-white tracking-tight leading-tight"
            >
              Suporte Windows <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text animate-gradient-x">
                Profissional
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-12"
            >
              Mantenha seu ecossistema digital seguro, atualizado e operando em máxima performance com nossa equipe certificada.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-32"
            >
              <button
                onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105"
              >
                Ver Planos
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
                  className={`group p-8 rounded-3xl bg-[#0A0A0F]/50 backdrop-blur-md border border-white/5 ${benefit.border} transition-all duration-300 hover:-translate-y-2`}
                >
                  <div className={`w-14 h-14 rounded-2xl ${benefit.bg} flex items-center justify-center mb-6`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-light">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section id="planos" className="py-24 px-4 relative z-10 bg-[#0A0A0F]/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-sm font-bold tracking-[0.2em] text-[#8B31FF] mb-4 uppercase">Investimento</h2>
              <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">Planos de Suporte Mensal</h3>
              <p className="text-slate-400 max-w-2xl mx-auto">Escolha o nível de proteção e suporte ideal para você ou sua empresa.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`group relative p-8 rounded-[2.5rem] bg-[#0A0A0F] border ${plan.color}/30 hover:${plan.color} transition-all duration-300 h-full flex flex-col ${plan.popular ? 'shadow-[0_0_50px_rgba(139,49,255,0.15)] transform md:-translate-y-8 z-10' : 'border-white/5 hover:border-white/20'}`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 left-0 flex justify-center -mt-4">
                      <span className="bg-[#8B31FF] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">Recomendado</span>
                    </div>
                  )}

                  <div className="mb-8">
                    {plan.icon}
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-slate-400 text-sm h-10">{plan.description}</p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">{plan.price.split(',')[0]}</span>
                      <span className="text-xl text-slate-500">,{plan.price.split(',')[1]}</span>
                      <span className="text-sm text-slate-500 ml-1">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                        <CheckIcon className="w-5 h-5 text-[#00FF94] shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleContratarAgora(plan)}
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 ${plan.btnColor}`}
                  >
                    Assinar Agora
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
              Dúvidas Frequentes
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-[#1D1919]/50 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
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
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ainda tem dúvidas?</h2>
                <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                  Nossa equipe de especialistas está pronta para analisar seu caso e indicar a melhor solução.
                </p>
                <button className="px-10 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all hover:scale-105">
                  Falar com Consultor
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
