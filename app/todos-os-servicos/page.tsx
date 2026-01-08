"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  RocketLaunchIcon,
  ChartBarIcon,
  CloudArrowUpIcon,
  BoltIcon,
  ClockIcon,
  ShieldCheckIcon,
  ServerIcon,
  ComputerDesktopIcon,
  PrinterIcon,
  PlayIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

const services = [
  {
    id: "criacao-site",
    title: "Criação de Site",
    description: "Desenvolvimento de sites profissionais e responsivos para sua empresa ou projeto pessoal.",
    icon: <ComputerDesktopIcon className="w-8 h-8" />,
    price: "A partir de R$ 997,90",
    features: [
      "Design moderno e responsivo",
      "Otimização para SEO",
      "Integração com redes sociais",
      "Formulário de contato",
      "Painel administrativo",
      "Suporte por 3 meses"
    ],
    redirect: "/todos-os-servicos/criacao-de-sites",
    buttonText: "Criar Meu Site e Ver Planos"
  },
  {
    id: "suporte-windows",
    title: "Suporte ao Windows",
    description: "Suporte remoto completo para seu sistema Windows, incluindo instalação, atualização e otimização.",
    icon: <ServerIcon className="w-8 h-8" />,
    price: "A partir de R$ 349,90",
    features: [
      "Instalação e configuração remota do Windows",
      "Atualização do sistema",
      "Otimização de desempenho",
      "Remoção de vírus e malwares",
      "Backup de dados",
      "Recuperação de arquivos"
    ],
    redirect: "/todos-os-servicos/suporte-ao-windows",
    buttonText: "Ver Planos"
  },
  {
    id: "correcao-windows",
    title: "Correção de Erros no Windows",
    description: "Solução remota de problemas e erros no seu sistema Windows.",
    icon: <ShieldCheckIcon className="w-8 h-8" />,
    price: "R$ 49,90",
    features: [
      "Correção de erros do sistema",
      "Reparo de arquivos corrompidos",
      "Solução de problemas de inicialização",
      "Recuperação de sistema",
      "Diagnóstico completo",
      "Relatório detalhado"
    ],
    redirect: "/servicos?abrir=correcao_windows"
  },
  {
    id: "formatacao",
    title: "Formatação",
    description: "Formatação remota completa do seu computador com instalação de programas essenciais.",
    icon: <BoltIcon className="w-8 h-8" />,
    price: "A partir de R$ 99,90",
    features: [
      "Formatação Básica - Windows + Drivers essenciais",
      "Formatação Média - Windows + Drivers + Programas básicos",
      "Formatação Avançada - Windows + Drivers + Pacote Office + Programas",
      "Formatação Corporativa - Inclui configuração completa para empresas"
    ],
    redirect: "/formatacao",
    buttonText: "Formatar PC"
  },
  {
    id: "otimizacao",
    title: "Otimização de PC",
    description: "Otimização remota completa do seu computador para melhor desempenho.",
    icon: <ChartBarIcon className="w-8 h-8" />,
    price: "A partir de R$ 79,90",
    features: [
      "Otimização Básica - Limpeza e ajustes simples",
      "Otimização Média - Limpeza + otimização de performance",
      "Otimização Avançada - Limpeza completa + performance máxima",
      "Recursos Inclusos - Remoção de arquivos temporários e otimização do sistema"
    ],
    redirect: "/otimizacao-pc",
    buttonText: "Otimizar PC"
  },
  {
    id: "recuperacao",
    title: "Recuperação De Dados",
    description: "Recuperação remota de dados e arquivos importantes do seu computador.",
    icon: <CloudArrowUpIcon className="w-8 h-8" />,
    price: "R$ 99,90",
    features: [
      "Recuperação de Arquivos - Recuperação de arquivos deletados",
      "Recuperação de HDs - Recuperação de HDs com bad sectors",
      "Recuperação de Mídias - Recuperação de pendrives e cartões de memória"
    ],
    redirect: "/servicos?abrir=recuperacao"
  },
  {
    id: "instalacao-programas",
    title: "Instalação de Programas",
    description: "Instalação e configuração remota de programas essenciais para seu computador.",
    icon: <RocketLaunchIcon className="w-8 h-8" />,
    price: " A partir de R$ 29,90",
    features: [
      "Programas Básicos - Instalação de programas essenciais",
      "Pacote Office - Instalação do pacote Office completo",
      "Programas Específicos - Instalação de programas específicos",
      "Configuração - Configuração e personalização de software"
    ],
    redirect: "/todos-os-servicos/instalacao-de-programas",
    buttonText: "Ver programas"
  },
  {
    id: "impressora",
    title: "Instalação de Impressora",
    description: "Instalação remota de drivers e configuração de impressoras no seu computador.",
    icon: <PrinterIcon className="w-8 h-8" />,
    price: "R$ 49,90",
    features: [
      "Instalação de Drivers - Instalação dos drivers corretos para sua impressora",
      "Configuração Básica - Configuração inicial da impressora no Windows",
      "Teste de Impressão - Verificação remota da conexão e impressão",
      "Suporte Técnico - Ajuda com problemas de conexão e configuração"
    ],
    redirect: "/servicos?abrir=instalacao_impressora"
  },
  {
    id: "remocao-virus",
    title: "Remoção de Vírus",
    description: "Remoção remota de vírus e proteção do seu computador.",
    icon: <ShieldCheckIcon className="w-8 h-8" />,
    price: "R$ 39,90",
    features: [
      "Remoção de Vírus - Remoção de vírus e malware",
      "Limpeza - Limpeza de arquivos infectados",
      "Antivírus - Instalação de antivírus",
      "Proteção - Configuração de proteção"
    ],
    redirect: "/servicos?abrir=remocao_virus"
  },
  {
    id: "correcao-jogos",
    title: "Corrigir Erros Em Jogos",
    description: "Correção remota de erros em jogos populares como GTA, CS2, Cyberpunk, Valorant e outros.",
    icon: <PlayIcon className="w-8 h-8" />,
    price: "A partir de R$ 49,90",
    features: [
      "Correção GTA V/GTA 6 - Erros de inicialização e crashes",
      "Correção CS2 - Problemas de VAC e conectividade",
      "Correção Cyberpunk - Bugs e problemas de performance",
      "Correção Valorant - Problemas de Vanguard e rede",
      "Correção League of Legends - Erros de cliente e login",
      "Outros jogos - Suporte para diversos títulos"
    ],
    redirect: "/erros-jogos",
    buttonText: "Corrigir erros no meu jogo"
  },
  {
    id: "instalacao-office",
    title: "Instalar Office 365",
    description: "Instalação remota de Microsoft Office 365.",
    icon: <DocumentTextIcon className="w-8 h-8" />,
    price: "A partir de R$ 39,90",
    features: [
      "Office 365 - Instalação completa com assinatura",
      "Office 2021 - Versão standalone completa",
      "Office 2019 - Versão standalone completa",
      "Office 2016 - Versão standalone completa",
      "Configuração - Configuração de contas e sincronização",
      "Suporte - Suporte técnico especializado"
    ],
    redirect: "/todos-os-servicos/instalacao-do-office",
    buttonText: "Instalar Office"
  }
];

// Mapeamento dos ids dos serviços para os ids das categorias de acordeão em /servicos
const serviceToCategoryMap: Record<string, string> = {
  formatacao: 'formatacao',
  otimizacao: 'otimizacao',
  impressora: 'instalacao_impressora',
  'remocao-virus': 'remocao_virus',
  recuperacao: 'recuperacao',
  'correcao-windows': 'correcao_windows',
  'correcao-jogos': 'correcao_jogos',
};

export default function Servicos() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<string | null>(null);

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
      question: 'Como funciona o atendimento remoto?',
      answer: 'Utilizamos ferramentas seguras de acesso remoto para diagnosticar e resolver problemas em seu computador sem necessidade de deslocamento.'
    },
    {
      question: 'Qual o tempo médio de atendimento?',
      answer: 'O tempo de atendimento varia conforme o serviço, mas geralmente iniciamos em até 1 hora após o contato.'
    },
    {
      question: 'Os serviços são garantidos?',
      answer: 'Sim! Todos os nossos serviços possuem garantia e suporte pós-atendimento.'
    }
  ];

  const handleContratarAgora = async (servico: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    const orderData = {
      service_name: servico.name,
      service_description: servico.description,
      final_price: servico.price,
      plan_type: servico.plan_type,
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
                Nossos Serviços
              </h1>
              <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
                Soluções completas em suporte técnico para sua empresa ou computador pessoal
              </p>
            </motion.div>
              <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-[#FF4B6B] to-[#31A8FF] text-white font-semibold shadow-lg animate-pulse mt-2">
                Atendimento imediato após a compra de algum dos serviços ou com agendamento!
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

        {/* Services Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
              Serviços Disponíveis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div 
                  key={service.id} 
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
                          selectedService === service.id
                            ? 'bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-white'
                            : 'bg-[#2a2a2e] text-gray-400 group-hover:bg-gradient-to-r group-hover:from-[#FF4B6B] group-hover:to-[#8B31FF] group-hover:text-white'
                        } transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3`}>
                          {service.icon}
                        </div>
                      </div>

                      {/* Título com efeito de gradiente animado */}
                      <h3 className="text-2xl font-bold text-white mb-3 mt-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#FF4B6B] group-hover:to-[#8B31FF] transition-all duration-500 relative">
                        {service.title}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] group-hover:w-full transition-all duration-500"></span>
                      </h3>

                      {/* Preço com efeito de destaque */}
                      <div className="flex items-baseline justify-center mb-4">
                        <span className="text-3xl font-bold bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-transparent bg-clip-text relative">
                          {service.price}
                          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] opacity-50"></span>
                        </span>
                      </div>

                      {/* Descrição com efeito de fade */}
                      <p className="text-gray-400 text-sm mb-6 group-hover:text-gray-300 transition-colors duration-300 relative">
                        {service.description}
                        <span className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#1D1919]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                      </p>
                    </div>

                    {/* Lista de recursos com animação */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#FF4B6B] group-hover:to-[#8B31FF] transition-all duration-500">
                        Recursos Inclusos:
                      </h4>
                      <ul className="space-y-3">
                        {service.features.map((feature, index) => (
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
                    onClick={() => {
                      if (service.redirect) {
                        router.push(service.redirect);
                      } else if (!service.buttonText) {
                        const categoryId = serviceToCategoryMap[service.id];
                        if (categoryId) {
                          router.push(`/servicos?abrir=${categoryId}`);
                        } else {
                          router.push('/servicos');
                        }
                      } else {
                        handleContratarAgora(service);
                      }
                    }}
                    className="relative mt-8 w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-xl overflow-hidden transition-all duration-500 group-hover:scale-[1.02]"
                    style={{ marginTop: 'auto' }}
                  >
                    {/* Efeito de brilho no botão */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Efeito de brilho no hover */}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                    
                    <span className="relative flex items-center gap-2">
                      {service.buttonText || "Contratar Serviço"}
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

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-[#FF4B6B]/10 via-[#8B31FF]/10 to-[#31A8FF]/10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Precisa de Ajuda com seu Computador?
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Fale com nossos especialistas e descubra a solução ideal para você
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
