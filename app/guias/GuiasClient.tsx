'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSenseBanner from '@/components/AdSenseBanner';
import { motion } from 'framer-motion';
import {
  Monitor,
  Shield,
  Cpu,
  Wifi,
  Clock,
  ArrowRight,
  Search,
  BookOpen,
  Zap,
  LayoutGrid,
  Headphones
} from 'lucide-react';

interface GuideCategory {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  guides: Guide[];
}

interface Guide {
  slug: string;
  title: string;
  description: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  time: string;
  isNew?: boolean;
}

export default function GuiasClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const guideCategories: GuideCategory[] = [
    {
      id: 'windows',
      title: 'Windows & Sistema',
      description: 'Otimização, manutenção e domínio do sistema operacional',
      icon: Monitor,
      color: '#31A8FF',
      guides: [
        {
          slug: 'formatacao-windows',
          title: 'Como Formatar Windows (Passo a Passo 2026)',
          description: 'Guia definitivo para formatar e instalar Windows 10/11 limpo.',
          difficulty: 'Intermediário',
          time: '60 min',
          isNew: true
        },
        {
          slug: 'instalacao-windows-11',
          title: 'Instalação do Windows 11',
          description: 'Como instalar o sistema mais recente da Microsoft corretamente.',
          difficulty: 'Intermediário',
          time: '45 min'
        },
        {
          slug: 'otimizacao-performance',
          title: 'Otimização de Performance Extrema',
          description: 'Técnicas avançadas para acelerar seu sistema.',
          difficulty: 'Avançado',
          time: '40 min'
        },
        {
          slug: 'otimizacao-registro',
          title: 'Otimização do Registro do Windows',
          description: 'Limpando e ajustando o registro para ganhos de velocidade.',
          difficulty: 'Avançado',
          time: '20 min'
        },
        {
          slug: 'limpeza-computador',
          title: 'Limpeza de Disco Profunda',
          description: 'Libere espaço removendo arquivos temporários e inúteis.',
          difficulty: 'Iniciante',
          time: '15 min'
        },
        {
          slug: 'manutencao-preventiva',
          title: 'Guia de Manutenção Preventiva',
          description: 'Rotinas para manter seu PC saudável por mais tempo.',
          difficulty: 'Iniciante',
          time: '25 min'
        },
        {
          slug: 'recuperacao-sistema',
          title: 'Pontos de Restauração e Recuperação',
          description: 'Como salvar seu sistema antes que problemas ocorram.',
          difficulty: 'Iniciante',
          time: '10 min'
        },
        {
          slug: 'resolver-erros-windows',
          title: 'Troubleshooting: Erros Comuns do Windows',
          description: 'Soluções para telas azuis e travamentos frequentes.',
          difficulty: 'Intermediário',
          time: '30 min'
        },
        {
          slug: 'privacidade-windows-telemetria',
          title: 'Privacidade e Anti-Telemetria',
          description: 'Desative a coleta de dados da Microsoft no seu PC.',
          difficulty: 'Avançado',
          time: '20 min'
        },
        {
          slug: 'gestao-servicos',
          title: 'Gestão de Serviços do Windows',
          description: 'Desabilite serviços desnecessários para ganhar RAM.',
          difficulty: 'Avançado',
          time: '15 min'
        },
        {
          slug: 'instalacao-drivers',
          title: 'Instalação Correta de Drivers',
          description: 'Garanta compatibilidade e desempenho de hardware.',
          difficulty: 'Iniciante',
          time: '15 min'
        },
        {
          slug: 'monitoramento-sistema',
          title: 'Monitoramento de Recursos',
          description: 'Como usar o Gerenciador de Tarefas e Resource Monitor.',
          difficulty: 'Intermediário',
          time: '15 min'
        }
      ]
    },
    {
      id: 'software',
      title: 'Software & Produtividade',
      description: 'Navegadores, automação e ferramentas essenciais',
      icon: LayoutGrid,
      color: '#FFB800',
      guides: [
        {
          slug: 'programas-essenciais-windows',
          title: 'Softwares Essenciais Pós-Formatação',
          description: 'Lista de programas indispensáveis para instalar.',
          difficulty: 'Iniciante',
          time: '10 min'
        },
        {
          slug: 'limpeza-navegadores',
          title: 'Otimização de Navegadores',
          description: 'Chrome/Edge lento? Limpe cache e extensões.',
          difficulty: 'Iniciante',
          time: '10 min'
        },
        {
          slug: 'extensoes-produtividade-chrome',
          title: 'Extensões de Produtividade',
          description: 'Melhores addons para seu navegador.',
          difficulty: 'Iniciante',
          time: '10 min'
        },
        {
          slug: 'atalhos-produtividade-windows',
          title: 'Atalhos de Teclado Definitivos',
          description: 'Domine o Windows apenas com o teclado.',
          difficulty: 'Iniciante',
          time: '10 min'
        },
        {
          slug: 'automacao-tarefas',
          title: 'Automação de Tarefas no Windows',
          description: 'Use o Agendador de Tarefas para produtividade.',
          difficulty: 'Intermediário',
          time: '20 min'
        },
        {
          slug: 'gestao-pacotes',
          title: 'Gestão de Pacotes com Winget',
          description: 'Instale programas via linha de comando como um pro.',
          difficulty: 'Avançado',
          time: '15 min'
        },
        {
          slug: 'virtualizacao-vmware',
          title: 'Virtualização com VMware/VirtualBox',
          description: 'Rode outros sistemas operacionais dentro do Windows.',
          difficulty: 'Avançado',
          time: '30 min'
        },
        {
          slug: 'criar-pendrive-bootavel',
          title: 'Criar Pendrive Bootável',
          description: 'Como preparar mídias de instalação do Windows/Linux.',
          difficulty: 'Iniciante',
          time: '15 min'
        }
      ]
    },
    {
      id: 'seguranca',
      title: 'Segurança Digital',
      description: 'Proteção contra vírus, malware e invasões',
      icon: Shield,
      color: '#FF4B6B',
      guides: [
        {
          slug: 'remocao-virus-malware',
          title: 'Remoção de Vírus e Malware',
          description: 'Limpeza completa de ameaças do sistema.',
          difficulty: 'Intermediário',
          time: '45 min'
        },
        {
          slug: 'seguranca-digital',
          title: 'Guia de Segurança Digital 2026',
          description: 'Práticas essenciais para navegação segura.',
          difficulty: 'Iniciante',
          time: '20 min'
        },
        {
          slug: 'protecao-ransomware',
          title: 'Defesa contra Ransomware',
          description: 'Como evitar o sequestro de seus dados.',
          difficulty: 'Avançado',
          time: '25 min'
        },
        {
          slug: 'firewall-configuracao',
          title: 'Configuração de Firewall Avançada',
          description: 'Proteja sua rede contra acessos não autorizados.',
          difficulty: 'Avançado',
          time: '30 min'
        },
        {
          slug: 'vpn-configuracao',
          title: 'Configuração e Uso de VPN',
          description: 'Navegue de forma anônima e segura.',
          difficulty: 'Intermediário',
          time: '20 min'
        },
        {
          slug: 'autenticacao-dois-fatores',
          title: 'Autenticação de Dois Fatores (2FA)',
          description: 'Blindando suas contas online.',
          difficulty: 'Iniciante',
          time: '10 min'
        },
        {
          slug: 'criptografia-dados',
          title: 'Criptografia de Dados Pessoais',
          description: 'Como proteger arquivos sensíveis com BitLocker/Veracrypt.',
          difficulty: 'Avançado',
          time: '25 min'
        },
        {
          slug: 'identificacao-phishing',
          title: 'Identificando Phishing e Golpes',
          description: 'Aprenda a reconhecer emails e sites falsos.',
          difficulty: 'Iniciante',
          time: '15 min'
        },
        {
          slug: 'recuperacao-dados',
          title: 'Recuperação de Dados Perdidos',
          description: 'Tentando salvar arquivos deletados acidentalmente.',
          difficulty: 'Intermediário',
          time: '40 min'
        },
        {
          slug: 'backup-dados',
          title: 'Estratégias de Backup 3-2-1',
          description: 'Nunca mais perca arquivos importantes.',
          difficulty: 'Iniciante',
          time: '20 min'
        }
      ]
    },
    {
      id: 'hardware',
      title: 'Hardware & Componentes',
      description: 'Montagem, upgrades e diagnósticos',
      icon: Cpu,
      color: '#8B31FF',
      guides: [
        {
          slug: 'guia-montagem-pc',
          title: 'Guia de Montagem de PC',
          description: 'Passo a passo para montar sua máquina dos sonhos.',
          difficulty: 'Avançado',
          time: '120 min',
          isNew: true
        },
        {
          slug: 'upgrade-memoria-ram',
          title: 'Upgrade de Memória RAM',
          description: 'Escolhendo e instalando novos pentes de memória.',
          difficulty: 'Iniciante',
          time: '15 min'
        },
        {
          slug: 'substituicao-ssd',
          title: 'Instalação/Troca de SSD',
          description: 'Acelerando o PC com armazenamento rápido.',
          difficulty: 'Intermediário',
          time: '25 min'
        },
        {
          slug: 'ssd-vs-hdd-guia',
          title: 'SSD vs HDD: Qual escolher?',
          description: 'Entenda as diferenças e casos de uso.',
          difficulty: 'Iniciante',
          time: '10 min'
        },
        {
          slug: 'diagnostico-hardware',
          title: 'Diagnóstico de Hardware Defeituoso',
          description: 'Identifique se o problema é peça ou software.',
          difficulty: 'Avançado',
          time: '35 min'
        },
        {
          slug: 'otimizacao-jogos-pc',
          title: 'Otimização de Hardware para Jogos',
          description: 'Extraindo o máximo de FPS da sua GPU/CPU.',
          difficulty: 'Intermediário',
          time: '30 min'
        },
        {
          slug: 'overclock-processador',
          title: 'Introdução ao Overclock',
          description: 'Conceitos básicos para aumentar clock seguro.',
          difficulty: 'Avançado',
          time: '45 min'
        },
        {
          slug: 'atualizacao-drivers-video',
          title: 'Drivers de Vídeo (Clean Install)',
          description: 'Atualizando GPUs NVIDIA/AMD com DDU.',
          difficulty: 'Intermediário',
          time: '20 min'
        },
        {
          slug: 'saude-bateria-notebook',
          title: 'Saúde da Bateria de Notebook',
          description: 'Calibração e dicas para durar mais.',
          difficulty: 'Iniciante',
          time: '15 min'
        }
      ]
    },
    {
      id: 'perifericos',
      title: 'Periféricos & Áudio',
      description: 'Monitores, teclados, som e acessórios',
      icon: Headphones,
      color: '#E11D48',
      guides: [
        {
          slug: 'guia-compra-monitores',
          title: 'Guia de Compra de Monitores',
          description: 'Hz, Painel IPS/VA/TN, Resolução explicados.',
          difficulty: 'Iniciante',
          time: '15 min'
        },
        {
          slug: 'teclados-mecanicos-guia',
          title: 'Tudo sobre Teclados Mecânicos',
          description: 'Switches, formatos e customização.',
          difficulty: 'Iniciante',
          time: '15 min'
        },
        {
          slug: 'solucao-problemas-audio',
          title: 'Solução de Problemas de Áudio',
          description: 'Microfone ou som não funcionam? Resolva aqui.',
          difficulty: 'Intermediário',
          time: '20 min'
        },
        {
          slug: 'solucao-problemas-bluetooth',
          title: 'Correção de Falhas Bluetooth',
          description: 'Pareando dispositivos teimosos.',
          difficulty: 'Iniciante',
          time: '10 min'
        }
      ]
    },
    {
      id: 'rede',
      title: 'Rede & Internet',
      description: 'Wi-Fi, cabos e conectividade',
      icon: Wifi,
      color: '#31FF8B',
      guides: [
        {
          slug: 'configuracao-roteador-wifi',
          title: 'Configuração de Roteador Wi-Fi',
          description: 'Otimizando canais e segurança da rede.',
          difficulty: 'Iniciante',
          time: '25 min'
        },
        {
          slug: 'seguranca-wifi-avancada',
          title: 'Segurança Wi-Fi Avançada',
          description: 'Evitando invasores na sua rede doméstica.',
          difficulty: 'Intermediário',
          time: '20 min'
        },
        {
          slug: 'rede-domestica',
          title: 'Montagem de Rede Doméstica',
          description: 'Interligando PCs para compartilhar arquivos.',
          difficulty: 'Intermediário',
          time: '30 min'
        },
        {
          slug: 'rede-corporativa',
          title: 'Noções de Rede Corporativa',
          description: 'Domínios, AD e gestão básica.',
          difficulty: 'Avançado',
          time: '40 min'
        },
        {
          slug: 'troubleshooting-internet',
          title: 'Diagnóstico de Internet Lenta',
          description: 'Descubra se a culpa é do provedor ou do PC.',
          difficulty: 'Intermediário',
          time: '20 min'
        },
        {
          slug: 'teste-velocidade-internet',
          title: 'Teste de Velocidade Real',
          description: 'Como medir ping, jitter e banda corretamente.',
          difficulty: 'Iniciante',
          time: '10 min'
        },
        {
          slug: 'compartilhamento-impressoras',
          title: 'Compartilhamento de Impressoras',
          description: 'Imprimindo de qualquer PC da rede.',
          difficulty: 'Iniciante',
          time: '15 min'
        }
      ]
    }
  ];

  const filteredGuides = guideCategories
    .filter(category => selectedCategory === 'all' || category.id === selectedCategory)
    .map(category => ({
      ...category,
      guides: category.guides.filter(guide =>
        guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(category => category.guides.length > 0);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Iniciante': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Intermediário': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Avançado': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#050510] font-sans selection:bg-[#31A8FF]/30">

        {/* --- HERO SECTION (FULL SCREEN) --- */}
        <section className="min-h-[100dvh] flex flex-col items-center justify-center relative px-4 overflow-hidden border-b border-white/5">
          <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-50"></div>
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#31A8FF]/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#8B31FF]/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>

          <div className="relative max-w-5xl mx-auto text-center z-10 flex-grow flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 text-xs font-medium text-slate-400"
            >
              <BookOpen className="w-3 h-3 text-[#31A8FF]" />
              <span>Base de Conhecimento</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-8xl font-black text-white mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/50"
            >
              Guias e Tutoriais <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">Técnicos</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
            >
              Aprenda a formatar, otimizar, remover vírus e resolver problemas no seu PC com nossos guias detalhados escritos por especialistas.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-2xl mx-auto"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                <div className="relative bg-[#0A0A0F] rounded-2xl">
                  <input
                    type="text"
                    placeholder="O que você quer aprender hoje?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-5 bg-transparent border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-[#31A8FF]/50 text-lg transition-all"
                  />
                  <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-500 group-hover:text-[#31A8FF] transition-colors" />
                </div>
              </div>
            </motion.div>
          </div>


          {/* Scroll Down Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer text-slate-500 hover:text-white transition-colors"
            onClick={() => {
              const nextSection = document.getElementById('content-section');
              if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.scrollTo({
                  top: window.innerHeight,
                  behavior: 'smooth'
                });
              }
            }}
          >
            <span className="text-xs uppercase tracking-widest font-medium">SCROLL</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[#31A8FF] to-transparent"></div>
          </motion.div>
        </section>

        {/* --- CONTENT SECTION --- */}
        <section id="content-section" className="py-24 px-4 bg-[#050510] relative z-10">
          <div className="max-w-7xl mx-auto">

            {/* Category Filter Cards */}
            <div className="flex flex-wrap justify-center gap-3 mb-24">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${selectedCategory === 'all'
                  ? 'bg-white text-black border-white hover:bg-slate-200'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:border-white/10 hover:text-white'
                  }`}
              >
                Todos
              </button>
              {guideCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 border ${selectedCategory === category.id
                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                    : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:border-white/10 hover:text-white'
                    }`}
                >
                  <category.icon className={`w-4 h-4 ${selectedCategory === category.id ? 'text-black' : ''}`} />
                  {category.title}
                </button>
              ))}
            </div>

            {filteredGuides.length === 0 ? (
              <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/5">
                <Search className="w-16 h-16 text-slate-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">Nenhum guia encontrado</h3>
                <p className="text-slate-400 mb-8 max-w-sm mx-auto">Não encontramos guias compatíveis com sua busca. Tente palavras-chaves diferentes.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="px-8 py-3 bg-[#31A8FF] text-white font-bold rounded-xl hover:bg-[#2b93df] transition-all hover:shadow-[0_0_30px_rgba(49,168,255,0.3)]"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <div className="space-y-24">
                {filteredGuides.map((category, categoryIndex) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
                      <div className={`p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/5`}>
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{category.title}</h2>
                        <p className="text-slate-500 text-sm mt-1">{category.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.guides.map((guide, guideIndex) => (
                        <motion.div
                          key={guide.slug}
                          whileHover={{ y: -5 }}
                          className="group relative h-full"
                        >
                          <Link href={`/guias/${guide.slug}`} className="block h-full relative z-20 focus:outline-none">
                            <div className="h-full bg-[#0A0A0F] hover:bg-[#0F0F16] rounded-2xl border border-white/5 hover:border-[#31A8FF]/30 p-8 transition-all duration-300 relative overflow-hidden flex flex-col">

                              {/* Subtle Glow Effect on Hover */}
                              <div className="absolute top-0 right-0 w-32 h-32 bg-[#31A8FF]/5 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                              <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getDifficultyColor(guide.difficulty)}`}>
                                  {guide.difficulty}
                                </div>
                                {guide.isNew && (
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#FF4B6B] animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4B6B]"></span>
                                    NOVO
                                  </span>
                                )}
                              </div>

                              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#31A8FF] transition-colors leading-tight relative z-10">
                                {guide.title}
                              </h3>

                              <p className="text-slate-400 text-sm mb-8 leading-relaxed line-clamp-2 flex-grow relative z-10">
                                {guide.description}
                              </p>

                              <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto relative z-10">
                                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                                  <Clock className="w-4 h-4" />
                                  {guide.time}
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#31A8FF] group-hover:text-white transition-all text-slate-500">
                                  <ArrowRight className="w-4 h-4" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* --- CTA SECTION (ENTERPRISE) --- */}
        <section className="py-32 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050510] to-[#0A0A0F]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#31A8FF]/5 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Precisa de Ajuda Profissional?</h2>
            <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Alguns problemas exigem um olhar clínico. Nossa equipe especializada pode resolver remotamente ou presencialmente para você.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link
                href="/todos-os-servicos"
                className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:scale-105"
              >
                Ver Serviços Especializados
              </Link>
              <Link
                href="https://wa.me/5511996716235?text=Olá!%20Li%20os%20guias%20mas%20preciso%20de%20ajuda%20especializada."
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/5 text-white border border-white/10 font-bold rounded-xl hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
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