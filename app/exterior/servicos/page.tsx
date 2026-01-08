"use client";
import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from 'react';
import { FiGlobe, FiUsers, FiClock, FiShield, FiDatabase, FiMonitor, FiCloud, FiBarChart2, FiPhone, FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';

const internationalServices = [
  {
    id: "suporte-tecnico",
    title: "Suporte Técnico Remoto Global",
    description: "Atendimento especializado em português para resolver problemas técnicos de computadores, notebooks, celulares e outros dispositivos, independentemente do país onde você estiver.",
    icon: <FiGlobe className="text-5xl text-purple-400" />,
    features: [
      "Atendimento 24/7 com horários flexíveis",
      "Suporte em português por profissionais brasileiros",
      "Resolução remota de problemas em qualquer dispositivo",
      "Suporte para Windows, macOS, Linux, iOS e Android",
      "Diagnóstico e correção de erros do sistema",
      "Otimização de performance e velocidade"
    ],
    price: "A partir de €29,90 / $32,90",
    currency: "EUR/USD"
  },
  {
    id: "criacao-sites",
    title: "Criação de Sites Multilíngues",
    description: "Desenvolvimento de websites profissionais com suporte a múltiplos idiomas, otimizados para mercados internacionais e integração com sistemas de pagamento globais.",
    icon: <FiMonitor className="text-5xl text-blue-400" />,
    features: [
      "Sites responsivos para todos os dispositivos",
      "Suporte a múltiplos idiomas (português, inglês, espanhol)",
      "Integração com gateways de pagamento internacionais",
      "Otimização para motores de busca globais",
      "Hospedagem em servidores internacionais",
      "Manutenção e atualizações contínuas"
    ],
    price: "A partir de €297,90 / $327,90",
    currency: "EUR/USD"
  },
  {
    id: "migracao-dados",
    title: "Migração de Dados Internacional",
    description: "Transferência segura de seus dados entre países, sincronização em nuvem e backup automatizado com redundância global para garantir acesso contínuo às suas informações.",
    icon: <FiDatabase className="text-5xl text-green-400" />,
    features: [
      "Transferência segura de grandes volumes de dados",
      "Sincronização automática em tempo real",
      "Backup com redundância em múltiplos data centers",
      "Recuperação de dados em caso de perda",
      "Compatibilidade com serviços em nuvem internacionais",
      "Criptografia de ponta a ponta"
    ],
    price: "€89,90 / $99,90",
    currency: "EUR/USD"
  },
  {
    id: "configuracao-redes",
    title: "Configuração de Redes Globais",
    description: "Otimização de conexões internacionais, configuração de VPN, segurança de redes e conectividade com serviços brasileiros acessados do exterior.",
    icon: <FiCloud className="text-5xl text-yellow-400" />,
    features: [
      "Configuração de VPN para acesso seguro",
      "Otimização de velocidade de internet internacional",
      "Segurança avançada de redes domésticas",
      "Conectividade com serviços brasileiros do exterior",
      "Configuração de roteadores e equipamentos de rede",
      "Monitoramento e manutenção de conectividade"
    ],
    price: "€69,90 / $76,90",
    currency: "EUR/USD"
  },
  {
    id: "suporte-nuvem",
    title: "Suporte a Serviços em Nuvem",
    description: "Assistência especializada com Google Workspace, Microsoft 365, AWS, Azure e outros serviços em nuvem utilizados por brasileiros no exterior para trabalho e negócios.",
    icon: <FiCloud className="text-5xl text-indigo-400" />,
    features: [
      "Configuração de Google Workspace e Microsoft 365",
      "Gerenciamento de contas e permissões",
      "Migração de dados para ambientes em nuvem",
      "Treinamento em ferramentas colaborativas",
      "Suporte a AWS, Azure e outras plataformas",
      "Backup e recuperação em ambientes cloud"
    ],
    price: "€49,90 / $54,90",
    currency: "EUR/USD"
  },
  {
    id: "consultoria",
    title: "Consultoria de TI Internacional",
    description: "Planejamento estratégico de tecnologia para brasileiros que trabalham remotamente ou possuem negócios internacionais, com soluções adaptadas ao ambiente global.",
    icon: <FiBarChart2 className="text-5xl text-red-400" />,
    features: [
      "Planejamento de infraestrutura tecnológica",
      "Análise de soluções para trabalho remoto",
      "Consultoria para negócios internacionais",
      "Seleção de ferramentas e plataformas adequadas",
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
    <div className="min-h-screen bg-gradient-to-br from-[#171313] via-[#171313] to-[#171313]">
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
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 hover:shadow-lg"
                        >
                          Saiba Mais
                        </Link>
                        
                        <Link 
                          href="/exterior/contato"
                          className="border border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white font-medium py-2 px-6 rounded-lg transition-all duration-300"
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