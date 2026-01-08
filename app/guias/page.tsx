'use client';

import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSenseBanner from '../components/AdSenseBanner';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BookOpenIcon,
  ComputerDesktopIcon,
  ShieldCheckIcon,
  BoltIcon,
  CloudArrowUpIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const guides = [
  {
    id: 'formatacao-windows',
    title: 'Guia Completo de Formatação do Windows',
    description: 'Aprenda passo a passo como formatar seu computador Windows de forma segura, incluindo backup de dados, instalação limpa e configuração inicial.',
    icon: <ComputerDesktopIcon className="w-8 h-8" />,
    category: 'Formatação',
    readTime: '15 min',
    difficulty: 'Avançado',
    href: '/guias/formatacao-windows'
  },
  {
    id: 'otimizacao-performance',
    title: 'Como Otimizar a Performance do Seu PC',
    description: 'Dicas profissionais para acelerar seu computador, liberar espaço em disco, otimizar a inicialização e melhorar o desempenho geral do sistema.',
    icon: <BoltIcon className="w-8 h-8" />,
    category: 'Otimização',
    readTime: '12 min',
    difficulty: 'Intermediário',
    href: '/guias/otimizacao-performance'
  },
  {
    id: 'seguranca-digital',
    title: 'Guia de Segurança Digital Essencial',
    description: 'Proteja seu computador contra vírus, malware e ataques cibernéticos. Aprenda sobre antivírus, firewall, senhas seguras e boas práticas de segurança.',
    icon: <ShieldCheckIcon className="w-8 h-8" />,
    category: 'Segurança',
    readTime: '18 min',
    difficulty: 'Básico',
    href: '/guias/seguranca-digital'
  },
  {
    id: 'backup-dados',
    title: 'Como Fazer Backup dos Seus Dados',
    description: 'Aprenda métodos eficazes para fazer backup completo dos seus arquivos importantes, incluindo backup em nuvem, HD externo e métodos automatizados.',
    icon: <CloudArrowUpIcon className="w-8 h-8" />,
    category: 'Backup',
    readTime: '10 min',
    difficulty: 'Básico',
    href: '/guias/backup-dados'
  },
  {
    id: 'manutencao-preventiva',
    title: 'Manutenção Preventiva de Computadores',
    description: 'Rotinas de manutenção que você pode fazer regularmente para manter seu computador funcionando perfeitamente e evitar problemas futuros.',
    icon: <WrenchScrewdriverIcon className="w-8 h-8" />,
    category: 'Manutenção',
    readTime: '14 min',
    difficulty: 'Intermediário',
    href: '/guias/manutencao-preventiva'
  },
  {
    id: 'resolver-erros-windows',
    title: 'Como Resolver Erros Comuns do Windows',
    description: 'Guia completo para diagnosticar e resolver os erros mais frequentes no Windows, incluindo tela azul, travamentos e mensagens de erro.',
    icon: <QuestionMarkCircleIcon className="w-8 h-8" />,
    category: 'Troubleshooting',
    readTime: '20 min',
    difficulty: 'Intermediário',
    href: '/guias/resolver-erros-windows'
  },
  {
    id: 'instalacao-drivers',
    title: 'Instalação e Atualização de Drivers',
    description: 'Aprenda como instalar, atualizar e gerenciar drivers do seu computador para garantir que todos os dispositivos funcionem corretamente.',
    icon: <DocumentTextIcon className="w-8 h-8" />,
    category: 'Drivers',
    readTime: '8 min',
    difficulty: 'Básico',
    href: '/guias/instalacao-drivers'
  },
  {
    id: 'limpeza-computador',
    title: 'Limpeza Completa do Computador',
    description: 'Técnicas profissionais para limpar arquivos temporários, cache, programas desnecessários e otimizar o espaço em disco do seu computador.',
    icon: <BookOpenIcon className="w-8 h-8" />,
    category: 'Limpeza',
    readTime: '11 min',
    difficulty: 'Básico',
    href: '/guias/limpeza-computador'
  },
  // Novos guias de segurança
  {
    id: 'firewall-configuracao',
    title: 'Configuração Profissional de Firewall',
    description: 'Aprenda a configurar firewall do Windows para proteger seu computador contra ameaças cibernéticas e acessos não autorizados.',
    icon: <ShieldCheckIcon className="w-8 h-8" />,
    category: 'Segurança',
    readTime: '25 min',
    difficulty: 'Intermediário',
    href: '/guias/firewall-configuracao'
  },
  {
    id: 'vpn-configuracao',
    title: 'Configuração Completa de VPN',
    description: 'Proteja sua privacidade online e acesse conteúdo restrito com configuração profissional de VPN para Windows.',
    icon: <ComputerDesktopIcon className="w-8 h-8" />,
    category: 'Segurança',
    readTime: '30 min',
    difficulty: 'Intermediário',
    href: '/guias/vpn-configuracao'
  },
  {
    id: 'criptografia-dados',
    title: 'Criptografia de Dados Pessoais',
    description: 'Aprenda a criptografar seus dados sensíveis para proteção máxima contra vazamentos e acessos não autorizados.',
    icon: <ShieldCheckIcon className="w-8 h-8" />,
    category: 'Segurança',
    readTime: '35 min',
    difficulty: 'Avançado',
    href: '/guias/criptografia-dados'
  },
  {
    id: 'protecao-ransomware',
    title: 'Proteção contra Ransomware',
    description: 'Estratégias completas para proteger seu sistema contra ransomware, incluindo prevenção, detecção e recuperação.',
    icon: <ShieldCheckIcon className="w-8 h-8" />,
    category: 'Segurança',
    readTime: '40 min',
    difficulty: 'Avançado',
    href: '/guias/protecao-ransomware'
  },
  {
    id: 'autenticacao-dois-fatores',
    title: 'Autenticação de Dois Fatores (2FA)',
    description: 'Implemente autenticação de dois fatores em todas as suas contas para segurança máxima e proteção contra roubo de senhas.',
    icon: <ShieldCheckIcon className="w-8 h-8" />,
    category: 'Segurança',
    readTime: '20 min',
    difficulty: 'Intermediário',
    href: '/guias/autenticacao-dois-fatores'
  },
  // Novos guias de hardware
  {
    id: 'upgrade-memoria-ram',
    title: 'Upgrade de Memória RAM',
    description: 'Aprenda a identificar, comprar e instalar memória RAM compatível com seu computador para maximizar performance.',
    icon: <BoltIcon className="w-8 h-8" />,
    category: 'Hardware',
    readTime: '25 min',
    difficulty: 'Intermediário',
    href: '/guias/upgrade-memoria-ram'
  },
  {
    id: 'substituicao-ssd',
    title: 'Substituição de SSD/HDD',
    description: 'Troque seu disco rígido por SSD para velocidade máxima. Transferência de sistema, clonagem e otimização.',
    icon: <ComputerDesktopIcon className="w-8 h-8" />,
    category: 'Hardware',
    readTime: '45 min',
    difficulty: 'Avançado',
    href: '/guias/substituicao-ssd'
  },
  {
    id: 'overclock-processador',
    title: 'Overclock Seguro de Processador',
    description: 'Extraia mais performance do seu CPU com overclock profissional. Monitoramento de temperatura e estabilidade.',
    icon: <BoltIcon className="w-8 h-8" />,
    category: 'Hardware',
    readTime: '50 min',
    difficulty: 'Avançado',
    href: '/guias/overclock-processador'
  },
  {
    id: 'diagnostico-hardware',
    title: 'Diagnóstico de Falhas de Hardware',
    description: 'Identifique problemas de componentes físicos com ferramentas especializadas. Testes de memória, disco e placa-mãe.',
    icon: <WrenchScrewdriverIcon className="w-8 h-8" />,
    category: 'Hardware',
    readTime: '35 min',
    difficulty: 'Avançado',
    href: '/guias/diagnostico-hardware'
  },
  // Novos guias de software
  {
    id: 'virtualizacao-vmware',
    title: 'Virtualização com VMware/VirtualBox',
    description: 'Crie máquinas virtuais para testes, desenvolvimento e isolamento de sistemas. Configuração profissional.',
    icon: <ComputerDesktopIcon className="w-8 h-8" />,
    category: 'Software',
    readTime: '40 min',
    difficulty: 'Intermediário',
    href: '/guias/virtualizacao-vmware'
  },
  {
    id: 'automacao-tarefas',
    title: 'Automação de Tarefas com Scripts',
    description: 'Automatize tarefas repetitivas do Windows com PowerShell, Batch e ferramentas de agendamento.',
    icon: <BoltIcon className="w-8 h-8" />,
    category: 'Software',
    readTime: '30 min',
    difficulty: 'Intermediário',
    href: '/guias/automacao-tarefas'
  },
  {
    id: 'gestao-pacotes',
    title: 'Gestão de Pacotes e Dependências',
    description: 'Gerencie bibliotecas, frameworks e dependências de software com npm, pip, chocolatey e outras ferramentas.',
    icon: <DocumentTextIcon className="w-8 h-8" />,
    category: 'Software',
    readTime: '25 min',
    difficulty: 'Intermediário',
    href: '/guias/gestao-pacotes'
  },
  // Novos guias de redes
  {
    id: 'rede-domestica',
    title: 'Configuração de Rede Doméstica',
    description: 'Configure roteadores, extensores Wi-Fi, VLANs e segurança de rede residencial. Otimização de cobertura.',
    icon: <ComputerDesktopIcon className="w-8 h-8" />,
    category: 'Redes',
    readTime: '35 min',
    difficulty: 'Intermediário',
    href: '/guias/rede-domestica'
  },
  {
    id: 'troubleshooting-internet',
    title: 'Diagnóstico de Problemas de Internet',
    description: 'Diagnostique e resolva problemas de conexão, velocidade lenta e instabilidade de internet com ferramentas profissionais.',
    icon: <ComputerDesktopIcon className="w-8 h-8" />,
    category: 'Redes',
    readTime: '28 min',
    difficulty: 'Intermediário',
    href: '/guias/troubleshooting-internet'
  },
  {
    id: 'compartilhamento-impressoras',
    title: 'Compartilhamento de Impressoras',
    description: 'Configure impressoras em rede, compartilhe dispositivos entre múltiplos computadores e gerencie filas de impressão.',
    icon: <DocumentTextIcon className="w-8 h-8" />,
    category: 'Redes',
    readTime: '22 min',
    difficulty: 'Básico',
    href: '/guias/compartilhamento-impressoras'
  },
  // Novos guias de manutenção avançada
  {
    id: 'recuperacao-sistema',
    title: 'Recuperação do Sistema Windows',
    description: 'Recupere seu sistema Windows após falhas, corrupção ou problemas graves com métodos profissionais.',
    icon: <WrenchScrewdriverIcon className="w-8 h-8" />,
    category: 'Manutenção',
    readTime: '45 min',
    difficulty: 'Avançado',
    href: '/guias/recuperacao-sistema'
  },
  {
    id: 'otimizacao-registro',
    title: 'Otimização do Registro do Windows',
    description: 'Limpe e otimize o registro do Windows para melhor performance. Técnicas seguras de manutenção preventiva.',
    icon: <WrenchScrewdriverIcon className="w-8 h-8" />,
    category: 'Manutenção',
    readTime: '30 min',
    difficulty: 'Intermediário',
    href: '/guias/otimizacao-registro'
  },
  {
    id: 'gestao-servicos',
    title: 'Gestão de Serviços do Sistema',
    description: 'Configure, otimize e monitore serviços do Windows para melhor performance e segurança do sistema.',
    icon: <WrenchScrewdriverIcon className="w-8 h-8" />,
    category: 'Manutenção',
    readTime: '28 min',
    difficulty: 'Intermediário',
    href: '/guias/gestao-servicos'
  }
];

const categories = [
  'Todos',
  'Formatação',
  'Otimização',
  'Segurança',
  'Backup',
  'Manutenção',
  'Troubleshooting',
  'Drivers',
  'Limpeza',
  'Hardware',
  'Software',
  'Redes'
];

export default function GuiasPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('Todos');

  const filteredGuides = selectedCategory === 'Todos' 
    ? guides 
    : guides.filter(guide => guide.category === selectedCategory);

  return (
    <>
      <Header />
      <main className="bg-[#171313] min-h-screen pt-24">
        {/* Hero Section */}
        <section className="pt-16 pb-12 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B6B]/10 via-[#8B31FF]/10 to-[#31A8FF]/10"></div>
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block mb-6">
                <BookOpenIcon className="w-16 h-16 mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
                Guias e Tutoriais
              </h1>
              <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-4">
                Aprenda técnicas profissionais de suporte técnico, otimização e manutenção de computadores com nossos guias completos e detalhados.
              </p>
              <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
                Nossos guias foram criados por especialistas em tecnologia e incluem instruções passo a passo, dicas profissionais e soluções práticas para os problemas mais comuns que você enfrenta no dia a dia com seu computador.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 px-4 bg-[#1D1919]">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white shadow-lg'
                      : 'bg-[#2a2a2e] text-gray-300 hover:bg-[#3a3a3e]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Guides Grid */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGuides.map((guide, index) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={guide.href}>
                    <div className="group bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-2xl border border-[#8B31FF]/10 hover:border-[#FF4B6B]/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(139,49,255,0.1)] h-full flex flex-col cursor-pointer">


                      {/* Category and Meta */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#FF4B6B]/30 to-[#8B31FF]/30 text-white">
                          {guide.category}
                        </span>
                        <span className="text-gray-400 text-sm">{guide.readTime}</span>
                        <span className="text-gray-500 text-sm">•</span>
                        <span className="text-gray-400 text-sm">{guide.difficulty}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#FF4B6B] group-hover:to-[#31A8FF] transition-all duration-300">
                        {guide.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-grow">
                        {guide.description}
                      </p>

                      {/* Read More */}
                      <div className="flex items-center text-[#31A8FF] font-semibold text-sm group-hover:text-[#8B31FF] transition-colors duration-300">
                        Ler Guia Completo
                        <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Information Section */}
        <section className="py-16 px-4 bg-[#1D1919]">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#171313] to-[#1D1919] p-8 rounded-2xl border border-[#8B31FF]/20">
              <h2 className="text-3xl font-bold text-white mb-6 text-center bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
                Sobre Nossos Guias
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  Nossos guias foram criados por nossa equipe de especialistas em suporte técnico com anos de experiência em resolução de problemas de computadores. Cada guia foi desenvolvido com base em situações reais que encontramos no dia a dia do atendimento aos nossos clientes.
                </p>
                <p>
                  Todos os guias incluem instruções passo a passo detalhadas, screenshots quando necessário, explicações técnicas de fácil compreensão, e dicas profissionais que vão além do básico. Procuramos sempre explicar não apenas o "como fazer", mas também o "por que fazer", para que você realmente entenda o que está acontecendo.
                </p>
                <p>
                  Nossos guias são atualizados regularmente para refletir as mudanças nas versões mais recentes do Windows e nas melhores práticas da indústria. Se você encontrar algum passo que não funciona ou tem dúvidas, não hesite em entrar em contato conosco para obter suporte adicional.
                </p>
                <p>
                  Lembre-se: se você se sentir inseguro em realizar algum procedimento técnico, especialmente aqueles que envolvem formatação ou modificações no sistema, sempre recomendamos procurar assistência profissional. Nossa equipe está disponível para ajudar com qualquer um desses procedimentos de forma remota, segura e eficiente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-[#FF4B6B]/10 via-[#8B31FF]/10 to-[#31A8FF]/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Precisa de Ajuda Profissional?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Se preferir que nossos técnicos façam o serviço por você, estamos disponíveis para atendimento remoto imediato e seguro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/todos-os-servicos"
                className="px-8 py-4 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(139,49,255,0.5)] transition-all duration-300 hover:scale-105"
              >
                Ver Nossos Serviços
              </Link>
              <Link 
                href="https://wa.me/5511996716235?text=Olá!%20Gostaria%20de%20falar%20com%20um%20especialista%20sobre%20suporte%20técnico."
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border-2 border-[#31A8FF] text-[#31A8FF] font-bold rounded-xl hover:bg-[#31A8FF] hover:text-white transition-all duration-300"
              >
                Falar com Especialista
              </Link>
            </div>
          </div>
        </section>
      </main>
      <AdSenseBanner />
      <Footer />
    </>
  );
}

