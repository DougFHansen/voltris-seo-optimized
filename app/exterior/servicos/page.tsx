"use client";
import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from 'react';
import { FiGlobe, FiUsers, FiClock, FiShield, FiDatabase, FiMonitor, FiCloud, FiBarChart2, FiPhone, FiMail, FiTrendingUp, FiPackage } from 'react-icons/fi';
import { motion } from 'framer-motion';

const internationalServices = [
  {
    id: "formatacao",
    title: "Formatação Remota Internacional",
    description: "Formatação completa do seu computador com instalação de programas essenciais, drivers e configurações otimizadas para uso no exterior.",
    icon: <FiDatabase className="text-5xl text-purple-400" />,
    features: [
      "Formatação Básica - Sistema + Drivers essenciais",
      "Formatação Média - Sistema + Drivers + Programas básicos",
      "Formatação Avançada - Sistema completo + Office + Software especializado",
      "Configuração para trabalho remoto internacional",
      "Instalação de softwares regionais",
      "Backup prévio dos seus dados"
    ],
    price: "€99,90 / $109,90",
    currency: "EUR/USD"
  },
  {
    id: "otimizacao-pc",
    title: "Otimização de PC para Performance",
    description: "Otimização completa do seu computador para máxima performance, especialmente útil para gamers e profissionais que exigem alta performance.",
    icon: <FiTrendingUp className="text-5xl text-blue-400" />,
    features: [
      "Otimização Básica - Limpeza e ajustes simples",
      "Otimização Média - Limpeza + otimização de performance",
      "Otimização Avançada - Limpeza completa + performance máxima",
      "Otimização para jogos e streaming",
      "Configuração de recursos do sistema",
      "Relatório detalhado de melhorias"
    ],
    price: "€79,90 / $87,90",
    currency: "EUR/USD"
  },
  {
    id: "correcao-erros",
    title: "Correção de Erros no Windows/Mac",
    description: "Solução rápida de problemas e erros no sistema operacional, crashes, inicialização e outros problemas técnicos.",
    icon: <FiShield className="text-5xl text-green-400" />,
    features: [
      "Correção de erros do sistema",
      "Reparo de arquivos corrompidos",
      "Solução de problemas de inicialização",
      "Recuperação de sistema",
      "Diagnóstico completo remoto",
      "Garantia de resolução"
    ],
    price: "€49,90 / $54,90",
    currency: "EUR/USD"
  },
  {
    id: "remocao-virus",
    title: "Remoção de Vírus e Malware",
    description: "Remoção completa de vírus, malware, spyware e outros programas maliciosos que comprometem a segurança do seu dispositivo.",
    icon: <FiShield className="text-5xl text-red-400" />,
    features: [
      "Varredura completa do sistema",
      "Remoção de vírus e malware",
      "Limpeza de arquivos infectados",
      "Instalação de antivírus premium",
      "Configuração de proteção contínua",
      "Relatório de ameaças eliminadas"
    ],
    price: "€39,90 / $43,90",
    currency: "EUR/USD"
  },
  {
    id: "erros-jogos",
    title: "Correção de Erros em Jogos",
    description: "Especialistas em resolver problemas em jogos populares como GTA, CS2, Cyberpunk, Valorant, League of Legends e outros títulos internacionais.",
    icon: <FiMonitor className="text-5xl text-yellow-400" />,
    features: [
      "Correção GTA V/6 - Erros de inicialização e crashes",
      "Correção CS2 - Problemas de VAC e conectividade",
      "Correção Cyberpunk - Bugs e problemas de performance",
      "Correção Valorant - Problemas de Vanguard e rede",
      "Correção League of Legends - Erros de cliente",
      "Suporte para outros jogos populares"
    ],
    price: "€49,90 / $54,90",
    currency: "EUR/USD"
  },
  {
    id: "instalacao-programas",
    title: "Instalação de Programas e Softwares",
    description: "Instalação e configuração remota de programas essenciais, softwares especializados e ferramentas de produtividade para uso internacional.",
    icon: <FiPackage className="text-5xl text-indigo-400" />,
    features: [
      "Programas Básicos - Instalação de softwares essenciais",
      "Pacote Office - Instalação do Microsoft Office completo",
      "Programas Específicos - Softwares especializados por área",
      "Configuração regional - Ajustes para país de residência",
      "Licenciamento - Ajuda com ativação de softwares",
      "Treinamento básico de uso"
    ],
    price: "€29,90 / $32,90",
    currency: "EUR/USD"
  },
  {
    id: "recuperacao-dados",
    title: "Recuperação de Dados Perdidos",
    description: "Recuperação especializada de arquivos, documentos, fotos e dados importantes perdidos devido a formatação, danos em HDs ou exclusão acidental.",
    icon: <FiDatabase className="text-5xl text-orange-400" />,
    features: [
      "Recuperação de Arquivos - Arquivos deletados acidentalmente",
      "Recuperação de HDs - HDs com bad sectors ou danos físicos",
      "Recuperação de Mídias - Pendrives e cartões de memória",
      "Recuperação de Sistemas - Sistemas operacionais danificados",
      "Análise gratuita inicial",
      "Taxa de sucesso de 95%+"
    ],
    price: "€99,90 / $109,90",
    currency: "EUR/USD"
  },
  {
    id: "configuracao-redes",
    title: "Configuração de Redes e Internet",
    description: "Otimização de conexões de internet, configuração de redes Wi-Fi, segurança de roteadores e conectividade com serviços brasileiros do exterior.",
    icon: <FiGlobe className="text-5xl text-teal-400" />,
    features: [
      "Configuração de roteadores e Wi-Fi",
      "Otimização de velocidade de internet",
      "Segurança avançada de redes",
      "Configuração de VPN para acesso seguro",
      "Conectividade com serviços brasileiros",
      "Monitoramento de performance"
    ],
    price: "€69,90 / $76,90",
    currency: "EUR/USD"
  },
  {
    id: "suporte-nuvem",
    title: "Suporte a Serviços em Nuvem",
    description: "Assistência especializada com Google Workspace, Microsoft 365, Dropbox, iCloud e outros serviços em nuvem utilizados internacionalmente.",
    icon: <FiCloud className="text-5xl text-cyan-400" />,
    features: [
      "Configuração Google Workspace/Microsoft 365",
      "Gerenciamento de contas e permissões",
      "Migração de dados para ambientes cloud",
      "Backup automatizado em nuvem",
      "Treinamento em ferramentas colaborativas",
      "Suporte a múltiplas plataformas"
    ],
    price: "€49,90 / $54,90",
    currency: "EUR/USD"
  },
  {
    id: "consultoria",
    title: "Consultoria de TI Internacional",
    description: "Planejamento estratégico de tecnologia para brasileiros que trabalham remotamente ou possuem negócios internacionais.",
    icon: <FiBarChart2 className="text-5xl text-pink-400" />,
    features: [
      "Planejamento de infraestrutura tecnológica",
      "Análise de soluções para trabalho remoto",
      "Consultoria para negócios internacionais",
      "Seleção de ferramentas e plataformas",
      "Treinamento personalizado para equipes",
      "Suporte estratégico contínuo"
    ],
    price: "€149,90 / $164,90",
    currency: "EUR/USD"
  }
];

export default function InternationalServices() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171313] via-[#171313] to-[#171313] header-spacing">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-purple-900/30 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-purple-500/30">
            <FiGlobe className="text-purple-400 text-xl" />
            <span className="text-purple-300 font-medium">Serviços Internacionais</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Nossos Serviços para <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Brasileiros no Exterior</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Soluções tecnológicas especializadas adaptadas para as necessidades únicas 
            de brasileiros que vivem e trabalham fora do Brasil
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {internationalServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:-translate-y-2"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    {service.icon}
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white mb-3">O que inclui:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-300">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                          {service.price}
                        </span>
                        <p className="text-sm text-gray-400">{service.currency}</p>
                      </div>
                      
                      <div className="flex gap-3">
                        <Link 
                          href={`/exterior/servicos/${service.id}`}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-1.5 px-4 rounded-lg transition-all duration-300 hover:shadow-lg text-sm"
                        >
                          Saiba Mais
                        </Link>
                        
                        <Link 
                          href="/exterior/contato"
                          className="border border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white font-medium py-1.5 px-4 rounded-lg transition-all duration-300 text-sm"
                        >
                          Contratar
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para Transformar Sua Experiência Tecnológica?
          </h2>
          <p className="text-gray-300 text-xl mb-8">
            Nossa equipe especializada está pronta para atender você, onde quer que esteja no mundo
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link 
              href="/exterior/contato" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 text-lg"
            >
              <FiPhone className="text-xl" />
              Fale Conosco Agora
            </Link>
            
            <Link 
              href="/exterior/orcamento" 
              className="border-2 border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center gap-3 text-lg"
            >
              <FiBarChart2 className="text-xl" />
              Solicitar Orçamento
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