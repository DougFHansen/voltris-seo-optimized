"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from 'react';


import { 
  FiMonitor, 
  FiSettings, 
  FiClock, 
  FiBarChart2, 
  FiDatabase, 
  FiPrinter, 
  FiShield, 
  FiGlobe, 
  FiTrendingUp,
  FiUsers,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCloud
} from 'react-icons/fi';
import { MonitorSmartphone, Laptop2, ShieldCheck, HardDrive, GaugeCircle, Database, Package, Printer, Globe, Clock } from "lucide-react";
import AnimatedSection from '@/components/AnimatedSection';
import TechFloatingElements from '@/components/TechFloatingElements';
import { FaWhatsapp, FaGlobeAmericas } from 'react-icons/fa';
import { motion } from 'framer-motion';

// International services with same structure but Brazil-expat focused content
const internationalServices = [
  {
    id: "suporte-remoto-global",
    title: "Suporte Técnico Remoto Global",
    description: "Atendimento especializado em português para brasileiros em qualquer país. Suporte 24/7 com horários flexíveis conforme seu fuso horário.",
    iconType: "Globe",
    price: "A partir de €29,90 / $32,90",
    buttonText: "Solicitar Atendimento",
    redirect: "/exterior/servicos/suporte-tecnico"
  },
  {
    id: "criacao-site-internacional",
    title: "Criação de Sites Multilíngues",
    description: "Sites profissionais com suporte a múltiplos idiomas, otimizados para mercados internacionais e integração com sistemas de pagamento globais.",
    iconType: "MonitorSmartphone",
    price: "A partir de €297,90 / $327,90",
    buttonText: "Criar Meu Site Global",
    redirect: "/exterior/servicos/criacao-sites"
  },
  {
    id: "migracao-dados",
    title: "Migração de Dados Internacional",
    description: "Transferência segura de seus dados entre países, sincronização em nuvem e backup automatizado com redundância global.",
    iconType: "Database",
    price: "€89,90 / $99,90",
    buttonText: "Migrar Dados",
    redirect: "/exterior/servicos/migracao-dados"
  },
  {
    id: "configuracao-redes",
    title: "Configuração de Redes Globais",
    description: "Otimização de conexões internacionais, configuração de VPN, segurança de redes e conectividade com serviços brasileiros do exterior.",
    iconType: "FiGlobe",
    price: "€69,90 / $76,90",
    buttonText: "Configurar Rede",
    redirect: "/exterior/servicos/configuracao-redes"
  },
  {
    id: "suporte-nuvem",
    title: "Suporte a Serviços em Nuvem",
    description: "Assistência com Google Workspace, Microsoft 365, AWS, Azure e outros serviços em nuvem utilizados por brasileiros no exterior.",
    iconType: "FiCloud",
    price: "€49,90 / $54,90",
    buttonText: "Suporte em Nuvem",
    redirect: "/exterior/servicos/suporte-nuvem"
  },
  {
    id: "consultoria-ti",
    title: "Consultoria de TI Internacional",
    description: "Planejamento estratégico de tecnologia para brasileiros que trabalham remotamente ou possuem negócios internacionais.",
    iconType: "FiBarChart2",
    price: "€149,90 / $164,90",
    buttonText: "Consultar Especialista",
    redirect: "/exterior/servicos/consultoria"
  }
];

export default function ExteriorHomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Function to render icons based on type
  const renderIcon = (iconType: string) => {
    const iconProps = {
      size: 56,
      className: "mx-auto drop-shadow-sm"
    };

    switch (iconType) {
      case "MonitorSmartphone":
        return <MonitorSmartphone {...iconProps} className={`${iconProps.className} text-[#31A8FF]`} />;
      case "Laptop2":
        return <Laptop2 {...iconProps} className={`${iconProps.className} text-[#8B31FF]`} />;
      case "ShieldCheck":
        return <ShieldCheck {...iconProps} className={`${iconProps.className} text-[#31A8FF]`} />;
      case "HardDrive":
        return <HardDrive {...iconProps} className={`${iconProps.className} text-[#FF4B6B]`} />;
      case "GaugeCircle":
        return <GaugeCircle {...iconProps} className={`${iconProps.className} text-[#8B31FF]`} />;
      case "Database":
        return <Database {...iconProps} className={`${iconProps.className} text-[#31A8FF]`} />;
      case "Package":
        return <Package {...iconProps} className={`${iconProps.className} text-[#8B31FF]`} />;
      case "Printer":
        return <Printer {...iconProps} className={`${iconProps.className} text-[#31A8FF]`} />;
      case "Globe":
        return <Globe {...iconProps} className={`${iconProps.className} text-[#31A8FF]`} />;
      case "FiGlobe":
        return <FiGlobe {...iconProps} className={`${iconProps.className} text-[#8B31FF]`} />;
      case "FiCloud":
        return <FiCloud {...iconProps} className={`${iconProps.className} text-[#31A8FF]`} />;
      case "FiBarChart2":
        return <FiBarChart2 {...iconProps} className={`${iconProps.className} text-[#8B31FF]`} />;
      default:
        return <Globe {...iconProps} className={`${iconProps.className} text-[#31A8FF]`} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header - Using existing component */}
      <Header />
      
      {/* Hero Section */}
      <AnimatedSection>
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <TechFloatingElements />
          
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-3 bg-purple-900/30 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-purple-500/30">
                <FaGlobeAmericas className="text-purple-400 text-xl" />
                <span className="text-purple-300 font-medium">Para Brasileiros no Exterior</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Suporte Técnico em <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Português</span>
                <br />para Brasileiros no Mundo
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                Atendimento especializado para brasileiros que moram fora do Brasil. 
                Suporte remoto em português, com horários flexíveis e compreensão total 
                das suas necessidades tecnológicas internacionais.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/exterior/contato" 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
                >
                  <FiPhone className="text-lg" />
                  Fale Conosco Agora
                </Link>
                
                <Link 
                  href="/exterior/servicos" 
                  className="border-2 border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center gap-3"
                >
                  <FiSettings className="text-lg" />
                  Ver Todos Serviços
                </Link>
              </div>
            </motion.div>
            
            {/* Trust indicators */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <FiUsers className="text-3xl text-purple-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">+1.000</h3>
                <p className="text-gray-400 text-sm">Brasileiros Atendidos</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <FiGlobe className="text-3xl text-blue-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">30+ Países</h3>
                <p className="text-gray-400 text-sm">Presença Global</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <FiClock className="text-3xl text-green-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">24/7</h3>
                <p className="text-gray-400 text-sm">Suporte Contínuo</p>
              </div>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* Services Section */}
      <AnimatedSection>
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Nossos Serviços <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Internacionais</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Soluções tecnológicas adaptadas para as necessidades específicas de brasileiros que vivem e trabalham fora do Brasil
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {internationalServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:-translate-y-2"
                >
                  <div className="mb-6">
                    {renderIcon(service.iconType)}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                      {service.price}
                    </span>
                    <Link 
                      href={service.redirect}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 hover:shadow-lg"
                    >
                      {service.buttonText}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                href="/exterior/todos-servicos" 
                className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-8 rounded-xl border border-gray-600 transition-all duration-300"
              >
                <FiSettings className="text-lg" />
                Ver Todos os Serviços Internacionais
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Why Choose Us Section */}
      <AnimatedSection>
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Por Que Escolher Nosso <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Atendimento Internacional</span>
              </h2>
              <p className="text-gray-400 max-w-3xl mx-auto">
                Entendemos as particularidades de quem vive fora do Brasil e oferecemos soluções realmente adaptadas
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <FiUsers className="text-4xl text-purple-400" />,
                  title: "Equipe Bilíngue",
                  description: "Profissionais fluentes em português e experientes com desafios tecnológicos internacionais"
                },
                {
                  icon: <FiGlobe className="text-4xl text-blue-400" />,
                  title: "Horários Flexíveis",
                  description: "Atendimento adaptado aos seus fusos horários, com disponibilidade 24/7 quando necessário"
                },
                {
                  icon: <FiShield className="text-4xl text-green-400" />,
                  title: "Segurança Global",
                  description: "Proteção de dados conforme legislações internacionais e padrões brasileiros de segurança"
                },
                {
                  icon: <FiClock className="text-4xl text-yellow-400" />,
                  title: "Resposta Imediata",
                  description: "Tempo médio de resposta de 15 minutos para solicitações urgentes"
                },
                {
                  icon: <FiDatabase className="text-4xl text-red-400" />,
                  title: "Backup Internacional",
                  description: "Armazenamento seguro em múltiplas regiões globais com redundância garantida"
                },
                {
                  icon: <FiTrendingUp className="text-4xl text-indigo-400" />,
                  title: "Suporte Contínuo",
                  description: "Acompanhamento pós-serviço e suporte proativo para evitar problemas futuros"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection>
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto para Resolver Seus Problemas Tecnológicos?
            </h2>
            <p className="text-gray-300 text-xl mb-8 max-w-2xl mx-auto">
              Nossa equipe especializada está pronta para ajudar você, onde quer que esteja no mundo
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/exterior/contato" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 text-lg"
              >
                <FiPhone className="text-xl" />
                Iniciar Atendimento
              </Link>
              
              <Link 
                href="/exterior/orcamento" 
                className="border-2 border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center gap-3 text-lg"
              >
                <FiBarChart2 className="text-xl" />
                Solicitar Orçamento
              </Link>
            </div>
            
            <div className="mt-8 text-gray-400">
              <p className="flex items-center justify-center gap-2">
                <FiMail className="text-purple-400" />
                contato@voltris.com.br
              </p>
              <p className="mt-2 flex items-center justify-center gap-2">
                <FiPhone className="text-blue-400" />
                +55 11 99671-6235 (WhatsApp disponível)
              </p>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Footer - Using existing component */}
      <Footer />
    </div>
  );
}