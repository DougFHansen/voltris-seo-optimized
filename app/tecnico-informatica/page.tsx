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


const services = [
  {
    id: "formatacao",
    title: "Formatação de Computador",
    description: "Formatação completa e instalação de programas essenciais.",
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
    redirect: "/servicos?abrir=remocao_virus",
    buttonText: "Remover Vírus"
  },
  {
    id: "instalacao-programas",
    title: "Instalação de Programas",
    description: "Instalação e configuração remota de programas essenciais para seu computador.",
    icon: <RocketLaunchIcon className="w-8 h-8" />,
    price: "A partir de R$ 29,90",
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
    redirect: "/servicos?abrir=recuperacao",
    buttonText: "Recuperar Dados"
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
    redirect: "/servicos?abrir=instalacao_impressora",
    buttonText: "Instalar Impressora"
  }
];

export default function TecnicoInformaticaPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Técnico de <span className="text-[#31A8FF]">Informática</span> VOLTRIS
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Suporte técnico remoto especializado em informática. Resolva problemas de computador, formatação, otimização e manutenção de sistemas Windows com segurança e eficiência.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-8 shadow-md flex flex-col justify-between hover:shadow-xl transition-all duration-300 border border-gray-200"
              >
                <div className="flex items-center mb-4">
                  {service.icon}
                  <h3 className="text-xl font-semibold text-gray-900 ml-3">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="text-[#31A8FF] font-semibold mb-2">{service.price}</div>
                <ul className="mb-4 list-disc list-inside text-gray-500 text-sm">
                  {service.features && service.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                <Link
                  href={service.redirect}
                  className="inline-block mt-auto px-6 py-2 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-semibold rounded-lg shadow hover:scale-105 transition-transform duration-300"
                >
                  {service.buttonText}
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
        
      </main>
      <Footer />
    </>
  );
} 
