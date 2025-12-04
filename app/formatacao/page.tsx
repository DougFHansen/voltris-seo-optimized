"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  BoltIcon,
  ClockIcon,
  ShieldCheckIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  StarIcon,
  ComputerDesktopIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';
import AdSenseBanner from '../components/AdSenseBanner';
const supabase = createClient();

const formatacaoPlans = [
  {
    id: "formatacao-basica",
    title: "Básica",
    description: "Backup, formatação, instalação de drivers e atualizações.",
    icon: <ComputerDesktopIcon className="w-8 h-8" />,
    price: "R$99,90",
    features: [],
    plan_type: "Básica"
  },
  {
    id: "formatacao-media",
    title: "Média",
    description: "Inclui \"Básica\" + antivírus e otimização básica.",
    icon: <BoltIcon className="w-8 h-8" />,
    price: "R$149,90",
    features: [],
    plan_type: "Média"
  },
  {
    id: "formatacao-avancada",
    title: "Avançada",
    description: "Inclui \"Média\" + otimização média de desempenho.",
    icon: <StarIcon className="w-8 h-8" />,
    price: "R$199,90",
    features: [],
    plan_type: "Avançada"
  },
  {
    id: "formatacao-corporativa",
    title: "Corporativa",
    description: "Inclui \"Avançada\" + Pacote Office (permanente*) e otimização avançada.",
    icon: <UsersIcon className="w-8 h-8" />,
    price: "R$349,90",
    features: [],
    plan_type: "Corporativa"
  },
  {
    id: "formatacao-gamer",
    title: "Gamer",
    description: "Inclui \"Avançada\" + Pacote Office (opcional) e otimização extrema para jogos (FPS, input lag, etc.).",
    icon: <BoltIcon className="w-8 h-8" />,
    price: "R$449,90",
    features: [],
    plan_type: "Gamer"
  }
];

export default function FormatacaoPage() {
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
      icon: <BoltIcon className="w-12 h-12 text-[#31A8FF]" />
    },
    {
      title: 'Backup Automático',
      description: 'Seus dados sempre protegidos',
      icon: <CloudArrowUpIcon className="w-12 h-12 text-[#FF4B6B]" />
    }
  ];

  const faqs = [
    {
      question: 'Como funciona a formatação remota?',
      answer: 'Utilizamos ferramentas seguras de acesso remoto para formatar seu computador sem necessidade de deslocamento, garantindo total segurança dos seus dados.'
    },
    {
      question: 'Meus dados serão perdidos na formatação?',
      answer: 'Não! Fazemos backup completo de todos os seus dados importantes antes da formatação, garantindo que nada seja perdido.'
    },
    {
      question: 'Qual o tempo médio para formatação?',
      answer: 'O tempo varia conforme o plano escolhido, mas geralmente entre 2 a 4 horas para formatação completa com instalação de programas.'
    },
    {
      question: 'A formatação resolve problemas de vírus?',
      answer: 'Sim! A formatação remove completamente todos os vírus e malwares, deixando seu computador 100% limpo e seguro.'
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
                Formatação Remota
              </h1>
              <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-4">
                Formatação remota completa do seu computador com instalação de programas essenciais. 
                Seu PC funcionando como novo!
              </p>
              <p className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto">
                A formatação de computador é um processo completo que envolve a reinstalação limpa do sistema operacional Windows, garantindo que seu computador volte a funcionar com a performance original. Realizamos este serviço de forma 100% remota, utilizando tecnologia de acesso seguro e protegido. Durante o processo, fazemos backup completo de todos os seus dados importantes, instalamos todos os drivers necessários, configuramos o sistema para máxima performance e instalamos os programas essenciais que você precisa para trabalhar ou usar o computador no dia a dia.
              </p>
            </motion.div>
            <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-[#FF4B6B] to-[#31A8FF] text-white font-semibold shadow-lg animate-pulse mt-2">
              Backup completo dos seus dados antes da formatação!
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
              Planos de Formatação
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {formatacaoPlans.map((plan) => (
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
                      <h4 className="text-lg font-semibold text-white mb-4 text-center group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#FF4B6B] group-hover:to-[#8B31FF] transition-all duration-500">
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
                    onClick={() => router.push('/servicos?abrir=formatacao')}
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
              O Que Está Incluído em Nossa Formatação?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-[#171313] to-[#1D1919] p-6 rounded-xl border border-[#8B31FF]/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <i className="fas fa-shield-alt text-[#FF4B6B] mr-3"></i>
                  Backup Completo de Dados
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Antes de iniciar qualquer formatação, realizamos um backup completo e seguro de todos os seus arquivos importantes. Utilizamos armazenamento em nuvem criptografado para garantir que seus dados estejam protegidos. Fazemos backup de documentos, imagens, vídeos, favoritos do navegador, senhas salvas (com sua autorização) e configurações importantes. Este backup permanece disponível por 30 dias após a formatação, permitindo que você recupere qualquer arquivo se necessário.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#171313] to-[#1D1919] p-6 rounded-xl border border-[#31A8FF]/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <i className="fas fa-download text-[#8B31FF] mr-3"></i>
                  Instalação de Drivers
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Após a formatação, instalamos automaticamente todos os drivers necessários para seu computador funcionar perfeitamente. Isso inclui drivers de áudio, vídeo, rede, Wi-Fi, Bluetooth, impressora, scanner e todos os dispositivos conectados. Utilizamos ferramentas avançadas de detecção automática de hardware e sempre instalamos as versões mais recentes e compatíveis dos drivers, garantindo máxima estabilidade e performance.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#171313] to-[#1D1919] p-6 rounded-xl border border-[#FF4B6B]/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <i className="fas fa-sync-alt text-[#31A8FF] mr-3"></i>
                  Atualização Completa do Sistema
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Instalamos todas as atualizações importantes do Windows disponíveis, garantindo que seu sistema esteja protegido contra vulnerabilidades de segurança e funcionando com as últimas correções e melhorias. O processo de atualização pode levar algum tempo dependendo da quantidade de atualizações pendentes, mas é essencial para manter seu computador seguro e estável.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#171313] to-[#1D1919] p-6 rounded-xl border border-[#8B31FF]/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <i className="fas fa-cog text-[#FF4B6B] mr-3"></i>
                  Otimização e Configuração
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Realizamos uma série de otimizações e configurações para garantir que seu computador tenha a melhor performance possível. Isso inclui desativação de programas desnecessários na inicialização, otimização do registro do Windows, configuração de planos de energia para máximo desempenho, e ajustes nas configurações do sistema para melhor responsividade e velocidade.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#171313] to-[#1D1919] p-8 rounded-2xl border border-[#8B31FF]/20">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Por Que Formatar o Computador?</h3>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  Ao longo do tempo, o uso normal do computador pode causar acúmulo de arquivos temporários, programas desnecessários, fragmentação de disco, e até mesmo vírus ou malware que podem ser difíceis de remover completamente. Esses fatores podem fazer com que seu computador fique lento, apresente erros, trave com frequência ou tenha problemas de estabilidade.
                </p>
                <p>
                  A formatação é a solução mais eficaz para resolver esses problemas. Ela remove completamente todos os arquivos e programas antigos, dando ao seu computador um "novo começo". É como reformatar um disco rígido e reconstruir tudo do zero, garantindo que você tenha um sistema limpo, rápido e livre de problemas. Após a formatação, seu computador volta a ter a velocidade e estabilidade que tinha quando era novo.
                </p>
                <p>
                  Além disso, a formatação é recomendada quando você vai vender ou doar seu computador, pois garante que todas as informações pessoais sejam completamente removidas. Também é uma boa prática realizar uma formatação preventiva a cada 1-2 anos para manter o computador funcionando perfeitamente.
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
                Precisa Formatar seu Computador?
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Fale com nossos especialistas e descubra o plano ideal para você
              </p>
              <button 
                onClick={() => handleContratarAgora(formatacaoPlans[0])}
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