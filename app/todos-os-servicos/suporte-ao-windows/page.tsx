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
  ClockIcon,
  ShieldCheckIcon,
  ServerIcon,
  ComputerDesktopIcon
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
      description: 'Suporte técnico com resposta rápida',
      icon: <RocketLaunchIcon className="w-12 h-12 text-[#FF4B6B]" />
    },
    {
      title: 'Monitoramento 24/7',
      description: 'Acompanhamento constante do seu sistema',
      icon: <ChartBarIcon className="w-12 h-12 text-[#8B31FF]" />
    },
    {
      title: 'Backup Automático',
      description: 'Seus dados sempre protegidos',
      icon: <CloudArrowUpIcon className="w-12 h-12 text-[#31A8FF]" />
    },
    {
      title: 'Otimização Regular',
      description: 'Manutenção preventiva mensal',
      icon: <BoltIcon className="w-12 h-12 text-[#FF4B6B]" />
    }
  ];

  const plans = [
    {
      id: 'basico',
      name: 'Básico',
      price: 'R$349,90',
      period: '/mês',
      icon: <ComputerDesktopIcon className="w-12 h-12 mb-4" />,
      description: 'Ideal para usuários domésticos e computadores pessoais',
      features: [
        'Suporte remoto em horário comercial (9h às 18h)',
        'Otimização mensal completa do sistema',
        'Remoção de vírus e malware',
        'Backup básico de arquivos importantes',
        'Atendimento em até 24h',
        'Verificação de drivers e atualizações',
        'Limpeza e organização do sistema',
        'Diagnóstico de problemas de performance',
        'Suporte para até 3 computadores'
      ],
      highlights: [
        'Economia de tempo com suporte especializado',
        'Maior durabilidade do seu equipamento',
        'Proteção contra ameaças digitais'
      ]
    },
    {
      id: 'profissional',
      name: 'Business',
      price: 'R$549,90',
      period: '/mês',
      icon: <ServerIcon className="w-12 h-12 mb-4" />,
      description: 'Perfeito para profissionais liberais e pequenas empresas',
      features: [
        'Suporte remoto prioritário (8h às 20h)',
        'Otimização quinzenal do sistema',
        'Proteção avançada contra malware',
        'Backup em nuvem com 100GB',
        'Atendimento em até 4h',
        'Monitoramento proativo de performance',
        'Relatórios mensais detalhados',
        'Consultoria de software empresarial',
        'Configuração de rede e compartilhamento',
	'Suporte para até 6 computadores'
      ],
      highlights: [
        'Aumento de produtividade',
        'Redução de custos com TI',
        'Proteção de dados empresariais'
      ]
    },
    {
      id: 'empresarial',
      name: 'Enterprise',
      price: 'R$1.259,90',
      period: '/mês',
      icon: <ShieldCheckIcon className="w-12 h-12 mb-4" />,
      description: 'Solução completa para empresas e equipes maiores',
      features: [
        'Suporte remoto e presencial 24/7',
        'Otimização semanal do sistema',
        'Proteção em tempo real avançada',
        'Backup em nuvem ilimitado',
        'Atendimento em até 1h',
        'Monitoramento 24/7 de todos os sistemas',
        'Relatórios semanais personalizados',
        'Consultoria especializada de TI',
        'Suporte para rede corporativa completa',
        'Gestão de servidores e infraestrutura',
        'Treinamento para equipe',
        'Plano de contingência personalizado',
        'Suporte ilimitado de computadores'
      ],
      highlights: [
        'Máxima segurança e disponibilidade',
        'Suporte empresarial completo',
        'Escalabilidade garantida'
      ]
    }
  ];

  const faqs = [
    {
      question: 'Como funciona o suporte remoto?',
      answer: 'Utilizamos ferramentas seguras de acesso remoto para diagnosticar e resolver problemas em seu computador sem necessidade de deslocamento.'
    },
    {
      question: 'Qual o horário de atendimento?',
      answer: 'O horário de atendimento varia conforme o plano escolhido, podendo ser em horário comercial ou 24/7 para planos empresariais.'
    },
    {
      question: 'O backup é realmente seguro?',
      answer: 'Sim! Utilizamos sistemas de backup criptografados e armazenamento em nuvem com os mais altos padrões de segurança do mercado.'
    }
  ];

  return (
    <>
      <Header />
      <main className="bg-[#171313] min-h-screen">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B6B]/10 via-[#8B31FF]/10 to-[#31A8FF]/10"></div>
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
                Suporte Windows Profissional
              </h1>
              <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
                Mantenha seu sistema sempre atualizado e funcionando com máxima performance
              </p>
              <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-[#FF4B6B] to-[#31A8FF] text-white font-semibold shadow-lg animate-pulse mt-2">
                Atendimento imediato após a compra!
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4 bg-[#1D1919]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-6 rounded-xl bg-gradient-to-br from-[#232027] to-[#1D1919] border border-[#8B31FF]/20 shadow-xl group transition-all duration-300"
                >
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
              Planos de Suporte Mensal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`p-6 rounded-xl border ${
                    selectedPlan === plan.id
                      ? 'border-[#FF4B6B] bg-gradient-to-b from-[#FF4B6B]/10 to-transparent'
                      : 'border-[#8B31FF]/10 bg-[#1D1919]'
                  } hover:border-[#FF4B6B] transition-all duration-300 cursor-pointer h-full flex flex-col`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <div className="flex-grow">
                    <div className="text-center">
                      <div className={`inline-block p-3 rounded-full ${
                        selectedPlan === plan.id
                          ? 'bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-white'
                          : 'bg-[#2a2a2e] text-gray-400'
                      } transition-all duration-300`}>
                        {plan.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <div className="flex items-baseline justify-center mb-3">
                        <span className="text-3xl font-bold text-[#FF4B6B]">{plan.price}</span>
                        <span className="text-gray-400 ml-1">{plan.period}</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white mb-3">Recursos Inclusos:</h4>
                      <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-gray-300">
                            <span className="text-[#FF4B6B] mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Benefícios:</h4>
                    <ul className="space-y-2">
                      {plan.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center text-gray-300">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] mr-2"></div>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={e => { e.stopPropagation(); handleContratarAgora(plan); }}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                      selectedPlan === plan.id
                        ? 'bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-white'
                        : 'bg-[#2a2a2e] text-white hover:bg-[#FF4B6B] hover:text-white'
                    }`}
                  >
                    Assinar Plano
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-[#1D1919]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
              Perguntas Frequentes
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-6 rounded-xl bg-gradient-to-br from-[#171313] to-[#1D1919] border border-[#8B31FF]/10 hover:border-[#FF4B6B]/30 transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-[#FF4B6B]/10 via-[#8B31FF]/10 to-[#31A8FF]/10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Precisa de Ajuda com seu Windows?
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Fale com nossos especialistas e descubra o plano ideal para você
              </p>
              <button className="bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-white py-4 px-8 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105">
                Começar Agora
              </button>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
} 
