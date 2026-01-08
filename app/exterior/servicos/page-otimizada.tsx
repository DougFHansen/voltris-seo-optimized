import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiGlobe, FiUsers, FiClock, FiShield, FiDatabase, FiMonitor, FiCloud, FiBarChart2, FiPhone, FiMail, FiTrendingUp, FiPackage, FiCheckCircle, FiAward, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';

// SEO Metadata otimizado
export const metadata: Metadata = {
  title: "Serviços de TI Premium para Brasileiros no Exterior | VOLTRIS",
  description: "Empresa brasileira de tecnologia especializada em suporte técnico remoto para expatriados. Formatação de PC, otimização de sistemas, segurança digital e consultoria de TI internacional com atendimento em português.",
  keywords: [
    "formatação de pc remota",
    "otimização de pc para expatriados",
    "empresa de ti online brasil",
    "suporte técnico remoto internacional",
    "manutenção de computador à distância",
    "formatação remota para brasileiros no exterior",
    "otimização de windows para expatriados",
    "suporte técnico para brasileiros no exterior",
    "empresa de tecnologia brasileira internacional",
    "técnico de informática online para expatriados",
    "serviços de ti para brasileiros fora do brasil",
    "suporte remoto especializado",
    "configuração de sistema para trabalho remoto",
    "otimização de pc para games internacionais"
  ],
  authors: [{ name: "VOLTRIS" }],
  creator: "VOLTRIS",
  publisher: "VOLTRIS",
  metadataBase: new URL('https://voltris.com.br/exterior'),
  alternates: {
    canonical: '/exterior/servicos',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://voltris.com.br/exterior/servicos',
    siteName: 'VOLTRIS Exterior',
    title: 'Serviços de TI Premium para Brasileiros no Exterior',
    description: 'Soluções tecnológicas especializadas para expatriados brasileiros. Formatação remota, otimização de PC, segurança digital e suporte técnico 24/7 em português.',
    images: [
      {
        url: '/images/servicos-exterior-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Serviços de TI Premium para Brasileiros no Exterior - VOLTRIS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Serviços de TI Premium para Brasileiros no Exterior',
    description: 'Empresa brasileira especializada em suporte técnico remoto para expatriados. Atendimento em português com qualidade internacional.',
    images: ['/images/servicos-exterior-twitter.jpg'],
    creator: '@voltris',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Serviços otimizados com conteúdo rico e semântico
const optimizedServices = [
  {
    id: "formatacao",
    title: "Formatação Remota Internacional",
    description: "Formatação completa do seu computador com instalação de programas essenciais, drivers e configurações otimizadas para uso no exterior. Processo 100% remoto com backup prévio de todos os seus dados importantes.",
    icon: <FiDatabase className="text-5xl text-purple-400" />,
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
    price: "€99,90 / $109,90",
    currency: "EUR/USD",
    estimatedTime: "2-4 horas"
  },
  {
    id: "otimizacao-pc",
    title: "Otimização de PC para Performance",
    description: "Otimização completa do seu computador para máxima performance, especialmente útil para gamers e profissionais que exigem alta performance. Análise detalhada e ajustes precisos para melhorar significativamente a velocidade do sistema.",
    icon: <FiTrendingUp className="text-5xl text-blue-400" />,
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
    price: "€79,90 / $87,90",
    currency: "EUR/USD",
    estimatedTime: "1-2 horas"
  },
  {
    id: "suporte-tecnico",
    title: "Suporte Técnico Online Especializado",
    description: "Atendimento técnico especializado em português para brasileiros em qualquer país. Suporte 24/7 com horários flexíveis conforme seu fuso horário. Diagnóstico remoto preciso e soluções eficazes para todos os problemas de tecnologia.",
    icon: <FiUsers className="text-5xl text-green-400" />,
    features: [
      "Diagnóstico remoto completo",
      "Solução de problemas técnicos",
      "Suporte para Windows, Mac e Linux",
      "Configuração de softwares",
      "Orientação personalizada",
      "Atendimento em português"
    ],
    benefits: [
      "Atendimento especializado em português",
      "Horários flexíveis conforme seu fuso",
      "Soluções rápidas e eficazes",
      "Suporte 24 horas por dia",
      "Profissionais certificados",
      "Preços competitivos internacionais"
    ],
    price: "€29,90 / $32,90",
    currency: "EUR/USD",
    estimatedTime: "30-60 minutos"
  },
  {
    id: "configuracao-sistema",
    title: "Configuração de Sistema para Trabalho e Games",
    description: "Configuração especializada do seu sistema operacional para máxima performance em trabalho remoto e jogos. Ajustes precisos para otimizar recursos, melhorar a estabilidade e aumentar a produtividade tanto para trabalho quanto para entretenimento.",
    icon: <FiMonitor className="text-5xl text-yellow-400" />,
    features: [
      "Configuração para trabalho remoto",
      "Otimização para jogos online",
      "Ajuste de performance do sistema",
      "Configuração de múltiplos monitores",
      "Otimização de recursos de hardware",
      "Personalização de perfis de uso"
    ],
    benefits: [
      "Máximo desempenho em multitarefas",
      "Experiência de jogo otimizada",
      "Estabilidade do sistema melhorada",
      "Consumo de energia reduzido",
      "Tempos de inicialização mais rápidos",
      "Interface personalizada para suas necessidades"
    ],
    price: "€59,90 / $65,90",
    currency: "EUR/USD",
    estimatedTime: "1-2 horas"
  }
];

export default function InternationalServicesOptimized() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171313] via-[#171313] to-[#171313] header-spacing">
      <Header />
      
      {/* Hero Section otimizada para SEO */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-purple-900/30 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-purple-500/30">
            <FiGlobe className="text-purple-400 text-xl" />
            <span className="text-purple-300 font-medium">Serviços Internacionais</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Serviços de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">TI Premium</span> para Brasileiros no Exterior
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            A VOLTRIS é uma empresa brasileira de tecnologia especializada em oferecer soluções de suporte técnico remoto de alta qualidade para expatriados. 
            Com atendimento exclusivo em português, resolvemos problemas de formatação de PC, otimização de sistemas, segurança digital e muito mais, 
            adaptando nossos serviços às necessidades específicas de brasileiros que vivem e trabalham fora do Brasil.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <FiAward className="text-purple-400 text-3xl mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Qualidade Internacional</h3>
              <p className="text-gray-400 text-sm">Padrões empresariais globais combinados com atendimento personalizado em português</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <FiLock className="text-green-400 text-3xl mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Segurança Garantida</h3>
              <p className="text-gray-400 text-sm">Conexões criptografadas e políticas rigorosas de privacidade de dados</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <FiClock className="text-blue-400 text-3xl mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Suporte 24/7</h3>
              <p className="text-gray-400 text-sm">Atendimento contínuo com horários adaptados ao seu fuso horário local</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Serviços Oferecidos (H2) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Nossos Serviços Especializados
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {optimizedServices.map((service, index) => (
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
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                          <FiCheckCircle className="text-green-400" />
                          O que inclui:
                        </h4>
                        <ul className="space-y-2">
                          {service.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-300">
                              <span className="text-purple-400 mt-1">•</span>
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                          <FiAward className="text-yellow-400" />
                          Benefícios:
                        </h4>
                        <ul className="space-y-2">
                          {service.benefits.slice(0, 3).map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-300">
                              <span className="text-green-400 mt-1">✓</span>
                              <span className="text-sm">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-700">
                      <div>
                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                          {service.price}
                        </span>
                        <p className="text-sm text-gray-400">{service.currency}</p>
                        <p className="text-xs text-gray-500 mt-1">Tempo estimado: {service.estimatedTime}</p>
                      </div>
                      
                      <div className="flex gap-3">
                        <Link 
                          href={`/exterior/servicos/${service.id}`}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 hover:shadow-lg text-sm"
                        >
                          Saiba Mais
                        </Link>
                        
                        <Link 
                          href="/exterior/contato"
                          className="border border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 text-sm"
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

      {/* Prova de Confiança (H2) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Por que uma Empresa Brasileira pode Atender Internacionalmente?
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                  <FiUsers className="text-purple-400" />
                  Profissionais Certificados
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Nossa equipe é composta por técnicos de informática certificados internacionalmente, 
                  com experiência em ambientes multiculturais e conhecimento profundo das particularidades 
                  tecnológicas que brasileiros enfrentam no exterior.
                </p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                  <FiGlobe className="text-blue-400" />
                  Infraestrutura Global
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Utilizamos ferramentas e plataformas de acesso remoto de padrão internacional, 
                  com servidores distribuídos globalmente para garantir conexões estáveis e seguras 
                  independente da localização do cliente.
                </p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                  <FiShield className="text-green-400" />
                  Segurança e Privacidade
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Mantemos rigorosos padrões de segurança digital, com criptografia de ponta a ponta 
                  em todas as conexões e políticas claras de privacidade de dados, garantindo que 
                  suas informações permaneçam protegidas durante todo o processo.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Nossa Diferença Competitiva
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-semibold">Atendimento Exclusivo em Português</h4>
                    <p className="text-gray-400 text-sm">Comunicamos de forma clara e natural, evitando barreiras linguísticas</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-semibold">Entendimento Cultural</h4>
                    <p className="text-gray-400 text-sm">Compreendemos as necessidades específicas de brasileiros expatriados</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-semibold">Preços Competitivos</h4>
                    <p className="text-gray-400 text-sm">Custo-benefício superior comparado a empresas locais do exterior</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-semibold">Flexibilidade Horária</h4>
                    <p className="text-gray-400 text-sm">Adaptamos nosso atendimento ao seu fuso horário local</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SEO (H2) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-3">
                Vale a pena formatar o PC remotamente?
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Sim, a formatação remota oferece diversos benefícios: você economiza tempo e dinheiro ao evitar deslocamentos, 
                recebe atendimento especializado em português, tem backup garantido dos seus dados importantes e 
                o processo é realizado por profissionais experientes que entendem as particularidades do ambiente tecnológico 
                brasileiro no exterior. Além disso, a configuração pós-formatação é otimizada especificamente para o país 
                onde você reside.
              </p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-3">
                Como funciona a otimização de PC à distância?
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Utilizamos ferramentas de acesso remoto seguras e criptografadas para conectar ao seu computador. 
                Realizamos uma análise completa do sistema, identificamos processos desnecessários, limpamos arquivos 
                temporários, otimizamos o registro do Windows, ajustamos configurações de performance e configuramos 
                recursos do sistema para maximizar a eficiência. Todo o processo é monitorado em tempo real com sua 
                autorização e aprovação.
              </p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-3">
                Posso confiar em uma empresa de TI online?
              </h3>
              <p className="text-gray-400 leading-relaxed">
                A confiança em serviços de TI online depende da credibilidade da empresa. A VOLTRIS possui anos de 
                experiência no mercado brasileiro, equipe certificada internacionalmente, utiliza ferramentas de acesso 
                remoto de padrão empresarial com criptografia de ponta a ponta, e mantém política transparente de 
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Profissional */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para uma Experiência Tecnológica Premium?
          </h2>
          <p className="text-gray-300 text-xl mb-8 leading-relaxed">
            Nossa equipe especializada está preparada para oferecer soluções tecnológicas de alta qualidade, 
            adaptadas especificamente para as necessidades de brasileiros que vivem e trabalham fora do Brasil. 
            Com atendimento exclusivo em português e padrões internacionais de excelência, transformamos seus 
            desafios tecnológicos em soluções eficientes e confiáveis.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link 
              href="/exterior/contato" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 text-lg"
            >
              <FiPhone className="text-xl" />
              Entrar em Contato
            </Link>
            
            <Link 
              href="/exterior/orcamento" 
              className="border-2 border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center gap-3 text-lg"
            >
              <FiBarChart2 className="text-xl" />
              Solicitar Orçamento Personalizado
            </Link>
          </div>
          
          <div className="text-gray-400">
            <p className="flex items-center justify-center gap-2">
              <FiMail className="text-purple-400" />
              contato@voltris.com.br
            </p>
            <p className="mt-2">
              Atendimento especializado em português para brasileiros no exterior • Suporte técnico 24/7
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}