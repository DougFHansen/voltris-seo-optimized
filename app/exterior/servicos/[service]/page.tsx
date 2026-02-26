"use client";
import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiArrowLeft, FiClock, FiUsers, FiShield, FiBarChart2, FiPhone, FiMail, FiCheckCircle, FiDatabase, FiTrendingUp, FiMonitor, FiPackage, FiGlobe, FiCloud } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Dados dos serviços internacionais
const serviceData = {
  "formatacao": {
    title: "Formatação Remota Internacional",
    description: "Formatação completa do seu computador com instalação de programas essenciais, drivers e configurações otimizadas para uso no exterior.",
    icon: <FiDatabase className="text-6xl text-purple-400" />,
    features: [
      "Formatação Básica - Sistema + Drivers essenciais",
      "Formatação Média - Sistema + Drivers + Programas básicos",
      "Formatação Avançada - Sistema completo + Office + Software especializado",
      "Configuração para trabalho remoto internacional",
      "Instalação de softwares regionais",
      "Backup prévio dos seus dados"
    ],
    benefits: [
      "Computador como novo em qualquer país",
      "Configuração otimizada para seu país de residência",
      "Softwares regionais instalados automaticamente",
      "Drivers atualizados para hardware local",
      "Suporte pós-formatação incluso",
      "Processo 100% remoto e seguro"
    ],
    process: [
      "Agendamento da formatação",
      "Backup dos seus dados importantes",
      "Formatação remota completa",
      "Instalação do sistema operacional",
      "Configuração de drivers e softwares",
      "Testes finais e entrega"
    ],
    price: "€99,90 / $109,90",
    currency: "EUR/USD",
    estimatedTime: "2-4 horas"
  },
  "otimizacao-pc": {
    title: "Otimização de PC para Performance",
    description: "Otimização completa do seu computador para máxima performance, especialmente útil para gamers e profissionais que exigem alta performance.",
    icon: <FiTrendingUp className="text-6xl text-blue-400" />,
    features: [
      "Otimização Básica - Limpeza e ajustes simples",
      "Otimização Média - Limpeza + otimização de performance",
      "Otimização Avançada - Limpeza completa + performance máxima",
      "Otimização para jogos e streaming",
      "Configuração de recursos do sistema",
      "Relatório detalhado de melhorias"
    ],
    benefits: [
      "Aumento de 30-50% no desempenho",
      "Computador mais rápido e responsivo",
      "Menos travamentos e erros",
      "Melhor experiência em jogos",
      "Consumo reduzido de recursos",
      "Vida útil estendida do hardware"
    ],
    process: [
      "Análise completa do sistema",
      "Limpeza de arquivos temporários",
      "Otimização de serviços do Windows",
      "Configuração de desempenho",
      "Testes de performance",
      "Relatório de melhorias"
    ],
    price: "€79,90 / $87,90",
    currency: "EUR/USD",
    estimatedTime: "1-2 horas"
  },
  "correcao-erros": {
    title: "Correção de Erros no Windows/Mac",
    description: "Solução rápida de problemas e erros no sistema operacional, crashes, inicialização e outros problemas técnicos.",
    icon: <FiShield className="text-6xl text-green-400" />,
    features: [
      "Correção de erros do sistema",
      "Reparo de arquivos corrompidos",
      "Solução de problemas de inicialização",
      "Recuperação de sistema",
      "Diagnóstico completo remoto",
      "Garantia de resolução"
    ],
    benefits: [
      "Sistema operacional estável",
      "Eliminação de crashes e travamentos",
      "Inicialização mais rápida",
      "Recuperação de funcionalidades perdidas",
      "Prevenção de problemas futuros",
      "Suporte especializado em português"
    ],
    process: [
      "Diagnóstico remoto do problema",
      "Identificação da causa raiz",
      "Aplicação das correções necessárias",
      "Testes de funcionamento",
      "Verificação de estabilidade",
      "Relatório de solução"
    ],
    price: "€49,90 / $54,90",
    currency: "EUR/USD",
    estimatedTime: "30-60 minutos"
  },
  "remocao-virus": {
    title: "Remoção de Vírus e Malware",
    description: "Remoção completa de vírus, malware, spyware e outros programas maliciosos que comprometem a segurança do seu dispositivo.",
    icon: <FiShield className="text-6xl text-red-400" />,
    features: [
      "Varredura completa do sistema",
      "Remoção de vírus e malware",
      "Limpeza de arquivos infectados",
      "Instalação de antivírus premium",
      "Configuração de proteção contínua",
      "Relatório de ameaças eliminadas"
    ],
    benefits: [
      "Computador 100% livre de ameaças",
      "Proteção contra futuros ataques",
      "Restauração de arquivos criptografados",
      "Melhoria no desempenho do sistema",
      "Segurança reforçada para navegação",
      "Tranquilidade no uso diário"
    ],
    process: [
      "Varredura completa do sistema",
      "Isolamento de ameaças detectadas",
      "Remoção de vírus e malware",
      "Limpeza de arquivos infectados",
      "Instalação de proteção premium",
      "Testes de segurança finais"
    ],
    price: "€39,90 / $43,90",
    currency: "EUR/USD",
    estimatedTime: "1-2 horas"
  },
  "erros-jogos": {
    title: "Correção de Erros em Jogos",
    description: "Especialistas em resolver problemas em jogos populares como GTA, CS2, Cyberpunk, Valorant, League of Legends e outros títulos internacionais.",
    icon: <FiMonitor className="text-6xl text-yellow-400" />,
    features: [
      "Correção GTA V/6 - Erros de inicialização e crashes",
      "Correção CS2 - Problemas de VAC e conectividade",
      "Correção Cyberpunk - Bugs e problemas de performance",
      "Correção Valorant - Problemas de Vanguard e rede",
      "Correção League of Legends - Erros de cliente",
      "Suporte para outros jogos populares"
    ],
    benefits: [
      "Jogos funcionando 100%",
      "Melhor performance e FPS",
      "Resolução de problemas online",
      "Compatibilidade com sistemas regionais",
      "Suporte especializado em games",
      "Tempo de jogo maximizado"
    ],
    process: [
      "Diagnóstico do problema específico",
      "Identificação de conflitos",
      "Aplicação de correções técnicas",
      "Testes de funcionamento do jogo",
      "Otimização de configurações",
      "Verificação multiplayer"
    ],
    price: "€49,90 / $54,90",
    currency: "EUR/USD",
    estimatedTime: "30-60 minutos"
  },
  "instalacao-programas": {
    title: "Instalação de Programas e Softwares",
    description: "Instalação e configuração remota de programas essenciais, softwares especializados e ferramentas de produtividade para uso internacional.",
    icon: <FiPackage className="text-6xl text-indigo-400" />,
    features: [
      "Programas Básicos - Instalação de softwares essenciais",
      "Pacote Office - Instalação do Microsoft Office completo",
      "Programas Específicos - Softwares especializados por área",
      "Configuração regional - Ajustes para país de residência",
      "Licenciamento - Ajuda com ativação de softwares",
      "Treinamento básico de uso"
    ],
    benefits: [
      "Todos os programas instalados e configurados",
      "Software otimizado para seu país",
      "Licenças ativadas corretamente",
      "Configurações personalizadas",
      "Treinamento inicial incluso",
      "Suporte pós-instalação"
    ],
    process: [
      "Levantamento de necessidades",
      "Download dos softwares necessários",
      "Instalação e configuração",
      "Ativação de licenças",
      "Testes de funcionamento",
      "Treinamento básico"
    ],
    price: "€29,90 / $32,90",
    currency: "EUR/USD",
    estimatedTime: "30-60 minutos"
  },
  "recuperacao-dados": {
    title: "Recuperação de Dados Perdidos",
    description: "Recuperação especializada de arquivos, documentos, fotos e dados importantes perdidos devido a formatação, danos em HDs ou exclusão acidental.",
    icon: <FiDatabase className="text-6xl text-orange-400" />,
    features: [
      "Recuperação de Arquivos - Arquivos deletados acidentalmente",
      "Recuperação de HDs - HDs com bad sectors ou danos físicos",
      "Recuperação de Mídias - Pendrives e cartões de memória",
      "Recuperação de Sistemas - Sistemas operacionais danificados",
      "Análise gratuita inicial",
      "Taxa de sucesso de 95%+"
    ],
    benefits: [
      "Recuperação de dados críticos",
      "Análise gratuita antes do serviço",
      "Taxa de sucesso superior a 95%",
      "Processo 100% seguro",
      "Confidencialidade garantida",
      "Suporte durante todo processo"
    ],
    process: [
      "Análise inicial gratuita",
      "Diagnóstico da mídia danificada",
      "Processo de recuperação especializado",
      "Verificação dos dados recuperados",
      "Entrega dos arquivos recuperados",
      "Relatório detalhado"
    ],
    price: "€99,90 / $109,90",
    currency: "EUR/USD",
    estimatedTime: "2-24 horas"
  },
  "configuracao-redes": {
    title: "Configuração de Redes e Internet",
    description: "Otimização de conexões de internet, configuração de redes Wi-Fi, segurança de roteadores e conectividade com serviços brasileiros do exterior.",
    icon: <FiGlobe className="text-6xl text-teal-400" />,
    features: [
      "Configuração de roteadores e Wi-Fi",
      "Otimização de velocidade de internet",
      "Segurança avançada de redes",
      "Configuração de VPN para acesso seguro",
      "Conectividade com serviços brasileiros",
      "Monitoramento de performance"
    ],
    benefits: [
      "Internet mais rápida e estável",
      "Rede Wi-Fi segura e protegida",
      "Acesso seguro a serviços brasileiros",
      "Melhor cobertura e alcance",
      "Proteção contra invasões",
      "Suporte contínuo à rede"
    ],
    process: [
      "Análise da infraestrutura atual",
      "Configuração de equipamentos",
      "Otimização de parâmetros",
      "Implementação de segurança",
      "Testes de conectividade",
      "Configuração de monitoramento"
    ],
    price: "€69,90 / $76,90",
    currency: "EUR/USD",
    estimatedTime: "1-2 horas"
  },
  "suporte-nuvem": {
    title: "Suporte a Serviços em Nuvem",
    description: "Assistência especializada com Google Workspace, Microsoft 365, Dropbox, iCloud e outros serviços em nuvem utilizados internacionalmente.",
    icon: <FiCloud className="text-6xl text-cyan-400" />,
    features: [
      "Configuração Google Workspace/Microsoft 365",
      "Gerenciamento de contas e permissões",
      "Migração de dados para ambientes cloud",
      "Backup automatizado em nuvem",
      "Treinamento em ferramentas colaborativas",
      "Suporte a múltiplas plataformas"
    ],
    benefits: [
      "Acesso aos seus dados de qualquer lugar",
      "Colaboração facilitada com equipes",
      "Backup automático e seguro",
      "Integração com outros serviços",
      "Economia em armazenamento local",
      "Suporte especializado 24/7"
    ],
    process: [
      "Avaliação das necessidades",
      "Escolha da plataforma ideal",
      "Configuração das contas",
      "Migração de dados existentes",
      "Treinamento da equipe",
      "Implementação de backup"
    ],
    price: "€49,90 / $54,90",
    currency: "EUR/USD",
    estimatedTime: "1-3 horas"
  },
  "consultoria": {
    title: "Consultoria de TI Internacional",
    description: "Planejamento estratégico de tecnologia para brasileiros que trabalham remotamente ou possuem negócios internacionais.",
    icon: <FiBarChart2 className="text-6xl text-pink-400" />,
    features: [
      "Planejamento de infraestrutura tecnológica",
      "Análise de soluções para trabalho remoto",
      "Consultoria para negócios internacionais",
      "Seleção de ferramentas e plataformas",
      "Treinamento personalizado para equipes",
      "Suporte estratégico contínuo"
    ],
    benefits: [
      "Infraestrutura tecnológica otimizada",
      "Soluções adaptadas ao seu negócio",
      "Redução de custos operacionais",
      "Aumento da produtividade",
      "Suporte especializado em português",
      "Planejamento de crescimento"
    ],
    process: [
      "Análise das necessidades atuais",
      "Diagnóstico da infraestrutura",
      "Elaboração de plano estratégico",
      "Implementação das soluções",
      "Treinamento da equipe",
      "Acompanhamento contínuo"
    ],
    price: "€149,90 / $164,90",
    currency: "EUR/USD",
    estimatedTime: "2-4 horas"
  }
};

export default async function ServiceDetailPage({ params }: { params: Promise<{ service: string }> }) {
  const { service } = await params;
  const serviceId = service;

  const serviceObj = serviceData[serviceId as keyof typeof serviceData];

  if (!serviceObj) {
    return (
      <div className="min-h-screen bg-[#050510] relative overflow-x-hidden pt-16 md:pt-20">
        {/* Global Ambient Background Effects (Noise Overlay on Top) */}
        <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-50"></div>

        {/* Background Gradients (Fixed Behind) */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#8B31FF]/30 blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#31A8FF]/30 blur-[100px] mix-blend-screen" />
        </div>
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Serviço não encontrado</h1>
          <Link
            href="/exterior/servicos"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300"
          >
            <FiArrowLeft />
            Voltar aos Serviços
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-x-hidden pt-16 md:pt-20">
      {/* Global Ambient Background Effects (Noise Overlay on Top) */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-50"></div>

      {/* Background Gradients (Fixed Behind) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#8B31FF]/30 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#31A8FF]/30 blur-[100px] mix-blend-screen" />
      </div>
      <Header />

      {/* Breadcrumb */}
      <section className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-gray-400 text-sm">
            <Link href="/exterior" className="hover:text-purple-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/exterior/servicos" className="hover:text-purple-400 transition-colors">
              Serviços
            </Link>
            <span>/</span>
            <span className="text-white">{serviceObj.title}</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4 mb-6">
                {serviceObj.icon}
                <div>
                  <h1 className="text-4xl font-bold text-white">
                    {serviceObj.title}
                  </h1>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-green-400">
                      <FiCheckCircle className="text-lg" />
                      <span className="text-sm">Disponível</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-400">
                      <FiClock className="text-lg" />
                      <span className="text-sm">{serviceObj.estimatedTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {serviceObj.description}
              </p>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4">Investimento</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    {serviceObj.price}
                  </span>
                  <span className="text-gray-400">{serviceObj.currency}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FiUsers className="text-purple-400" />
                Benefícios do Serviço
              </h3>

              <ul className="space-y-3">
                {serviceObj.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                O que está incluso
              </h2>

              <ul className="space-y-4">
                {serviceObj.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Nosso Processo
              </h2>

              <div className="space-y-6">
                {serviceObj.process.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-gray-300 pt-1">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Pronto para resolver seu problema?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Nossa equipe especializada está pronta para atender você com qualidade internacional
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              href="/exterior/contato"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 text-lg"
            >
              <FiPhone className="text-xl" />
              Solicitar Serviço
            </Link>

            <Link
              href="/exterior/servicos"
              className="border-2 border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center gap-3 text-lg"
            >
              <FiArrowLeft className="text-xl" />
              Ver Outros Serviços
            </Link>
          </div>

          <div className="text-gray-400">
            <p className="flex items-center justify-center gap-2">
              <FiMail className="text-purple-400" />
              contato@voltris.com.br
            </p>
            <p className="mt-2">
              Atendimento especializado em português para brasileiros no exterior
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}