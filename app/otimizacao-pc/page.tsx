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
import AdSenseBanner from '../components/AdSenseBanner';
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
      <main className="pt-16 sm:pt-20 bg-[#171313] min-h-screen">
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
                Otimização de PC
              </h1>
              <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-4">
                Otimização remota completa do seu computador para máxima performance, 
                velocidade e aceleração. Seu PC funcionando como novo!
              </p>
              <p className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto">
                A otimização de PC é um processo técnico avançado que melhora significativamente a performance do seu computador sem a necessidade de formatar o sistema. Utilizamos técnicas especializadas de limpeza, desfragmentação, ajuste de configurações e otimização de processos para acelerar seu computador e eliminar problemas de lentidão. Este serviço é ideal para computadores que estão funcionando, mas que estão mais lentos do que deveriam, ou que apresentam travamentos ocasionais. Realizamos todo o processo remotamente, de forma segura e monitorada.
              </p>
            </motion.div>
            <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-[#FF4B6B] to-[#31A8FF] text-white font-semibold shadow-lg animate-pulse mt-2">
              Melhoria de até 50% na performance do seu PC!
            </div>
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
              Planos de Otimização
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {otimizacaoPlans.map((plan) => (
                <div 
                  key={plan.id} 
                  className="group relative bg-[#1D1919]/80 backdrop-blur-sm p-8 rounded-2xl border border-[#8B31FF]/10 flex flex-col justify-between h-full transition-all duration-500 hover:border-[#FF4B6B]/30 hover:shadow-[0_0_30px_rgba(139,49,255,0.1)] overflow-hidden"
                >
                  {/* Efeito de brilho no hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF4B6B]/5 via-[#8B31FF]/5 to-[#31A8FF]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Efeito de partículas */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#FF4B6B]/10 to-transparent rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#8B31FF]/10 to-transparent rounded-full blur-2xl transform translate-x-1/2 translate-y-1/2"></div>
                  </div>

                  <div className="relative">
                    <div className="text-center">
                      {/* Container do ícone com efeito de brilho */}
                      <div className="relative inline-block">
                        <div className={`absolute inset-0 bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                        <div className={`relative inline-block p-4 rounded-2xl ${
                          selectedPlan === plan.id
                            ? 'bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-white'
                            : 'bg-[#2a2a2e] text-gray-400 group-hover:bg-gradient-to-r group-hover:from-[#FF4B6B] group-hover:to-[#8B31FF] group-hover:text-white'
                        } transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3`}>
                          {plan.icon}
                        </div>
                      </div>

                      {/* Título com efeito de gradiente animado */}
                      <h3 className="text-2xl font-bold text-white mb-3 mt-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#FF4B6B] group-hover:to-[#8B31FF] transition-all duration-500 relative">
                        {plan.title}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] group-hover:w-full transition-all duration-500"></span>
                      </h3>

                      {/* Preço com efeito de destaque */}
                      <div className="flex items-baseline justify-center mb-4">
                        <span className="text-3xl font-bold bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-transparent bg-clip-text relative">
                          {plan.price}
                          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] opacity-50"></span>
                        </span>
                      </div>

                      {/* Descrição com efeito de fade */}
                      <p className="text-gray-400 text-sm mb-6 group-hover:text-gray-300 transition-colors duration-300 relative">
                        {plan.description}
                        <span className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#1D1919]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                      </p>
                    </div>

                    {/* Lista de recursos com animação */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#FF4B6B] group-hover:to-[#8B31FF] transition-all duration-500">
                        Incluso:
                      </h4>
                      <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <li 
                            key={index} 
                            className="flex items-start text-gray-300 group-hover:text-gray-200 transition-colors duration-300 transform hover:translate-x-1 transition-transform"
                          >
                            <span className="text-[#FF4B6B] mr-2 group-hover:scale-110 transition-transform duration-300">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Botão com efeito de gradiente animado */}
                  <button
                    onClick={() => handleContratarAgora(plan)}
                    className="relative mt-8 w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-xl overflow-hidden transition-all duration-500 group-hover:scale-[1.02]"
                    style={{ marginTop: 'auto' }}
                  >
                    {/* Efeito de brilho no botão */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Efeito de brilho no hover */}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                    
                    <span className="relative flex items-center gap-2">
                      Contratar Plano
                      <svg 
                        className="w-5 h-5 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
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

        {/* Detailed Information Section */}
        <section className="py-16 px-4 bg-[#1D1919]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
              Como Funciona a Otimização de PC?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-[#171313] to-[#1D1919] p-6 rounded-xl border border-[#8B31FF]/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <i className="fas fa-broom text-[#FF4B6B] mr-3"></i>
                  Limpeza Profunda do Sistema
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Removemos arquivos temporários, cache do sistema, arquivos de log antigos, e outros arquivos desnecessários que ocupam espaço em disco e podem causar lentidão. Fazemos uma varredura completa em todos os locais onde o Windows armazena arquivos temporários, incluindo pastas do sistema, cache de navegadores, e arquivos de programas desinstalados que ficaram para trás. Esta limpeza pode liberar gigabytes de espaço em disco e melhorar significativamente a velocidade do sistema.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#171313] to-[#1D1919] p-6 rounded-xl border border-[#31A8FF]/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <i className="fas fa-tasks text-[#8B31FF] mr-3"></i>
                  Otimização de Processos
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Analisamos e otimizamos todos os processos que executam no seu computador, desativando programas desnecessários que iniciam automaticamente com o Windows e consomem recursos valiosos de memória RAM e processador. Configuramos os serviços do Windows para iniciar apenas quando necessário, otimizamos o uso de memória virtual, e ajustamos a prioridade de processos para garantir que aplicativos importantes tenham preferência sobre programas em segundo plano.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#171313] to-[#1D1919] p-6 rounded-xl border border-[#FF4B6B]/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <i className="fas fa-database text-[#31A8FF] mr-3"></i>
                  Otimização de Registro
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Corrigimos entradas inválidas, órfãs e duplicadas no registro do Windows, que podem causar lentidão, erros e travamentos. O registro do Windows é uma base de dados crítica que armazena configurações do sistema e programas. Com o tempo, ele pode acumular entradas inválidas de programas desinstalados ou atualizados, o que pode degradar a performance. Nossa otimização remove essas entradas problemáticas e compacta o registro para melhor eficiência.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#171313] to-[#1D1919] p-6 rounded-xl border border-[#8B31FF]/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <i className="fas fa-rocket text-[#FF4B6B] mr-3"></i>
                  Aceleração de Inicialização
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Reduzimos significativamente o tempo que seu computador leva para ligar e ficar pronto para uso. Fazemos isso otimizando programas que iniciam automaticamente, desativando serviços desnecessários, ajustando configurações de inicialização do Windows, e otimizando o processo de boot. O resultado é um computador que liga muito mais rápido e está pronto para uso em questão de segundos, não minutos.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#171313] to-[#1D1919] p-8 rounded-2xl border border-[#8B31FF]/20">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Benefícios da Otimização de PC</h3>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  A otimização de PC oferece diversos benefícios significativos. O mais imediato é a melhoria na velocidade geral do sistema - programas abrem mais rápido, arquivos carregam com mais velocidade, e o sistema operacional responde de forma mais rápida aos seus comandos. Para usuários que trabalham com muitos programas abertos simultaneamente, a otimização de memória RAM resulta em menos travamentos e maior estabilidade.
                </p>
                <p>
                  Além da velocidade, a otimização também melhora a estabilidade do sistema, reduzindo erros, travamentos e telas azuis. Isso acontece porque corrigimos problemas no registro do Windows, removemos programas conflitantes, e otimizamos serviços do sistema. Seu computador também passa a consumir menos recursos, resultando em menor uso de processador e memória, o que pode prolongar a vida útil do hardware.
                </p>
                <p>
                  Outro benefício importante é a liberação de espaço em disco. Muitos usuários acumulam gigabytes de arquivos temporários, cache, e dados de programas desinstalados sem saber. Nossa limpeza profunda remove tudo isso, deixando mais espaço disponível para seus arquivos importantes e melhorando o desempenho do disco rígido.
                </p>
                <p>
                  A otimização também pode melhorar a conectividade de rede, corrigindo problemas de latência e otimizando configurações de TCP/IP. Para quem usa o computador para jogos, trabalho ou navegação intensa na internet, essa melhoria na rede pode fazer uma grande diferença na experiência do usuário.
                </p>
              </div>
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
                Precisa Otimizar seu Computador?
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Fale com nossos especialistas e descubra o plano ideal para você
              </p>
              <button 
                onClick={() => handleContratarAgora(otimizacaoPlans[0])}
                className="bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-white py-4 px-8 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105"
              >
                Começar Agora
              </button>
            </motion.div>
          </div>
        </section>
      </main>
      <AdSenseBanner />
      <Footer />
    </>
  );
} 