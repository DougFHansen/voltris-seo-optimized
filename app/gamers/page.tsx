'use client';

import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function GamersPage() {
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  // Efeito de parallax para background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Funcionalidades principais do Voltris Optimizer
  const voltrisFeatures = [
    {
      icon: '🧠',
      title: 'Inteligência Gamer',
      description: 'Detecção automática de jogos e perfis personalizados por título',
      features: [
        'Modo Gamer automático',
        'Aprendizado de padrões de uso',
        'Otimização em tempo real',
        'Perfis específicos por jogo',
        'Adaptação inteligente'
      ],
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      icon: '⚡',
      title: 'Performance Máxima',
      description: 'Extraia o máximo de FPS do seu hardware com otimizações avançadas',
      features: [
        'Isolamento P/E cores (Intel)',
        'Priorização de processos',
        'Gerenciamento de memória',
        'Otimização de GPU',
        'Controle térmico inteligente'
      ],
      gradient: 'from-red-500 to-orange-500'
    },
    {
      icon: '🎮',
      title: 'Otimização de Games',
      description: 'Configurações específicas para cada jogo e gênero',
      features: [
        'Ajustes de gráficos automáticos',
        'Redução de input lag',
        'Anti-stutter avançado',
        'Otimização de shaders',
        'Gerenciamento de estados'
      ],
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🌐',
      title: 'Redução de Latência',
      description: 'Minimize ping e jitter para jogos online competitivos',
      features: [
        'Priorização de tráfego gaming',
        'QoS inteligente',
        'Cache DNS otimizado',
        'Monitoramento de latência',
        'Redução de jitter'
      ],
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: '🧹',
      title: 'Limpeza Inteligente',
      description: 'Mantenha seu sistema limpo e otimizado automaticamente',
      features: [
        'Remoção de arquivos temporários',
        'Desfragmentação inteligente',
        'Atualização de drivers',
        'Limpeza de registro',
        'Otimização de SSD'
      ],
      gradient: 'from-yellow-500 to-amber-500'
    },
    {
      icon: '🛡️',
      title: 'Estabilidade Total',
      description: 'Proteja seu sistema com segurança e recuperação automática',
      features: [
        'Backup automático',
        'Monitoramento de temperatura',
        'Proteção contra crashes',
        'Recuperação inteligente',
        'Validação de integridade'
      ],
      gradient: 'from-indigo-500 to-violet-500'
    }
  ];

  // Métricas de performance
  const performanceMetrics = [
    { value: '+25%', label: 'FPS Médio', description: 'Aumento médio de quadros por segundo' },
    { value: '95%', label: 'Menos Stutter', description: 'Redução de travamentos visuais' },
    { value: '-40%', label: 'Input Lag', description: 'Redução de latência de entrada' },
    { value: '-8°C', label: 'Temperatura', description: 'Melhor controle térmico' },
    { value: '100+', label: 'Jogos', description: 'Suportados e otimizados' },
    { value: '0ms', label: 'Tempo de Setup', description: 'Configuração automática instantânea' }
  ];

  // Serviços destacados
  const services = [
    {
      icon: '🎯',
      title: 'Performance Máxima',
      description: 'Otimização profissional para extrair o máximo de FPS do seu hardware',
      features: ['Configuração de drivers', 'Ajustes de prioridade', 'Otimização de memória'],
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: '📡',
      title: 'Redução de Latência',
      description: 'Configurações avançadas de rede para minimizar ping e lag em jogos online',
      features: ['Priorização de tráfego', 'QoS inteligente', 'Redução de jitter'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '🛡️',
      title: 'Estabilidade Total',
      description: 'Elimine stutters e microfreezes para uma experiência de jogo suave',
      features: ['Monitoramento térmico', 'Proteção contra crashes', 'Backup automático'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🎮',
      title: 'Otimização de Games',
      description: 'Configurações personalizadas para cada jogo, garantindo máxima performance',
      features: ['Perfis por jogo', 'Ajustes gráficos', 'Redução de input lag'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '⚙️',
      title: 'Setup Completo',
      description: 'Preparação completa do seu PC para gaming profissional',
      features: ['Overclock seguro', 'Configuração de periféricos', 'Perfis otimizados'],
      color: 'from-yellow-500 to-amber-500'
    },
    {
      icon: '🎥',
      title: 'Streaming',
      description: 'Configuração profissional para streamers e criadores de conteúdo',
      features: ['Setup do OBS', 'Otimização de encoder', 'Configurações de áudio'],
      color: 'from-indigo-500 to-violet-500'
    }
  ];

  // Comparação com concorrentes
  const competitors = [
    {
      name: 'VOLTRIS Optimizer',
      rating: '5.0',
      advantages: [
        'Inteligência artificial própria',
        'Suporte para CPUs híbridas',
        'Otimização específica por jogo',
        'Interface em português',
        'Modo Gamer automático'
      ],
      disadvantages: [],
      color: 'from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B]',
      highlight: true
    },
    {
      name: 'Razer Cortex',
      rating: '3.5',
      advantages: [
        'Boa interface',
        'Suporte a muitos jogos',
        'Booster de memória'
      ],
      disadvantages: [
        'Não otimiza hardware',
        'Interface em inglês',
        'Menos personalização'
      ],
      color: 'from-gray-500 to-gray-600'
    },
    {
      name: 'Game Booster 3.5',
      rating: '2.5',
      advantages: [
        'Gratuito',
        'Fácil de usar'
      ],
      disadvantages: [
        'Otimizações básicas',
        'Sem IA',
        'Não suporta hardware moderno'
      ],
      color: 'from-gray-600 to-gray-700'
    }
  ];

  return (
    <>
      <Header />
      <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#121218] to-[#0a0a0f] pt-20 overflow-x-hidden">
        
        {/* Hero Section com Parallax - Layout Fluido e Responsivo */}
        <section className="relative min-h-screen flex flex-col overflow-hidden">
          <motion.div 
            className="absolute inset-0"
            style={{ y: backgroundY }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(49,168,255,0.1)_0%,transparent_70%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(139,49,255,0.1)_0%,transparent_70%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,75,107,0.05)_0%,transparent_50%)]"></div>
          </motion.div>

          <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10 flex flex-col h-full py-4 sm:py-6 md:py-8">
            {/* Content Area - Takes remaining space with flexible distribution */}
            <div className="flex-grow flex flex-col justify-center items-center text-center px-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-4xl"
              >
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 md:px-5 md:py-2.5 bg-black/30 backdrop-blur-xl rounded-full border border-[#31A8FF]/20 mb-3 sm:mb-4 md:mb-6 animate-pulse mx-auto">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] rounded-full animate-ping"></div>
                  <span className="text-[#31A8FF] font-semibold tracking-wide text-[0.6rem] xs:text-xs sm:text-sm md:text-base">OTIMIZADOR GAMER PROFISSIONAL</span>
                </div>
                
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-2 sm:mb-3 md:mb-4 tracking-tight leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] drop-shadow-2xl">
                    VOLTRIS
                  </span>
                  <br />
                  <span className="text-white">OPTIMIZER</span>
                </h1>
                
                <motion.p 
                  className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-300 mb-4 sm:mb-6 md:mb-8 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  Transforme seu PC em uma <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] to-[#31A8FF] font-bold">máquina de guerra gaming</span> com inteligência artificial avançada
                </motion.p>
              </motion.div>

              <motion.div 
                className="flex justify-center w-full mb-4 sm:mb-6"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => window.open('/otimizacao-pc', '_self')}
                  className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold rounded-full text-xs sm:text-sm md:text-base shadow-lg hover:shadow-[0_0_20px_rgba(49,168,255,0.5)] transition-all duration-300 group cursor-pointer"
                >
                  <span className="flex items-center justify-center gap-1">
                    Começar
                    <motion.span 
                      className="inline-block"
                      animate={{ x: [0, 2, 0] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                    >
                      →
                    </motion.span>
                  </span>
                </motion.button>
              </motion.div>

              {/* Stats Cards - Compact and responsive */}
              <motion.div 
                className="grid grid-cols-4 gap-1.5 sm:gap-2 md:gap-3 max-w-xs sm:max-w-sm md:max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                {['+25%', '95%', '-40%', '100+'].map((value, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -2, scale: 1.05 }}
                    className="bg-black/40 backdrop-blur-xl rounded-md sm:rounded-lg p-1.5 sm:p-2 md:p-3 border border-white/10 text-center group hover:border-[#31A8FF]/30 transition-all duration-300"
                  >
                    <div className="text-xs sm:text-sm md:text-base font-bold text-[#31A8FF] group-hover:text-[#FF4B6B] transition-colors duration-300">
                      {value}
                    </div>
                    <div className="text-[0.5rem] xs:text-xs text-gray-400 font-medium mt-0.5">
                      {[
                        'FPS',
                        'Stutter',
                        'Lag',
                        'Jogos'
                      ][index]}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Scroll Indicator - Always visible at bottom with proper spacing */}
            <motion.div 
              className="flex-shrink-0 pb-2 sm:pb-3 md:pb-4 flex justify-center items-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <motion.div 
                className="flex flex-col items-center gap-0.5 text-white/70"
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <span className="text-[0.5rem] xs:text-xs">Role para explorar</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid com Animações */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(49,168,255,0.05)_0%,transparent_70%)]"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B]">
                Tecnologia de Ponta
              </h2>
              <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
                Cada funcionalidade foi projetada para extrair o máximo de performance do seu hardware gaming
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {voltrisFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -15 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#31A8FF]/10 via-[#8B31FF]/10 to-[#FF4B6B]/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  
                  <div className="relative bg-gradient-to-br from-black/60 to-black/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 h-full flex flex-col group-hover:border-[#31A8FF]/30 transition-all duration-500">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="text-4xl">{feature.icon}</div>
                      <div>
                        <h3 className={`text-2xl font-bold bg-gradient-to-r ${feature.gradient} text-transparent bg-clip-text`}>
                          {feature.title}
                        </h3>
                        <p className="text-gray-400 mt-2">{feature.description}</p>
                      </div>
                    </div>
                    
                    <ul className="space-y-3 flex-grow">
                      {feature.features.map((item, itemIndex) => (
                        <motion.li 
                          key={itemIndex}
                          className="flex items-center gap-3 text-gray-300"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: (index * 0.1) + (itemIndex * 0.05) }}
                        >
                          <motion.div 
                            className="w-2 h-2 bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] rounded-full"
                            whileHover={{ scale: 1.5 }}
                          />
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="py-32 relative bg-gradient-to-b from-transparent to-black/30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,49,255,0.1)_0%,transparent_70%)]"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B]">
                Resultados Comprovados
              </h2>
              <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
                Métricas reais obtidas em testes controlados com hardware variado
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {performanceMetrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#31A8FF]/10 to-[#8B31FF]/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  
                  <div className="relative bg-gradient-to-br from-black/60 to-black/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center group-hover:border-[#31A8FF]/30 transition-all duration-500">
                    <motion.div 
                      className="text-5xl font-black text-[#31A8FF] mb-4 group-hover:text-[#FF4B6B] transition-colors duration-300"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 3, delay: index * 0.3 }}
                    >
                      {metric.value}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-3">{metric.label}</h3>
                    <p className="text-gray-400">{metric.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Comparison */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,75,107,0.05)_0%,transparent_50%)]"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B]">
                Nossos Serviços Premium
              </h2>
              <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
                Soluções completas para elevar sua experiência de jogo ao próximo nível
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -15 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${service.color}/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500`}></div>
                  
                  <div className="relative bg-gradient-to-br from-black/60 to-black/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 h-full group-hover:border-[#31A8FF]/30 transition-all duration-500">
                    <div className="text-5xl mb-6">{service.icon}</div>
                    <h3 className={`text-2xl font-bold bg-gradient-to-r ${service.color} text-transparent bg-clip-text mb-4`}>
                      {service.title}
                    </h3>
                    <p className="text-gray-300 mb-6">{service.description}</p>
                    
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-gray-400">
                          <div className={`w-1.5 h-1.5 bg-gradient-to-r ${service.color} rounded-full`}></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Competitor Comparison */}
        <section className="py-32 relative bg-gradient-to-b from-black/30 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B]">
                Comparação com Concorrentes
              </h2>
              <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
                Veja porque o VOLTRIS Optimizer lidera o mercado brasileiro
              </p>
            </motion.div>

            <div className="overflow-x-auto">
              <table className="w-full bg-gradient-to-br from-black/60 to-black/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="p-6 text-left text-white font-bold text-xl">Otimizador</th>
                    <th className="p-6 text-left text-white font-bold text-xl">Vantagens</th>
                    <th className="p-6 text-left text-white font-bold text-xl">Limitações</th>
                    <th className="p-6 text-center text-white font-bold text-xl">Avaliação</th>
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((competitor, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className={`border-b border-white/10 last:border-b-0 ${competitor.highlight ? 'bg-gradient-to-r from-[#31A8FF]/10 via-[#8B31FF]/10 to-[#FF4B6B]/10' : 'hover:bg-white/5'}`}
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${competitor.color}`}></div>
                          <span className="text-white font-bold text-lg">{competitor.name}</span>
                          {competitor.highlight && (
                            <span className="px-3 py-1 bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] text-white text-xs font-bold rounded-full">
                              RECOMENDADO
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-6">
                        <ul className="space-y-2">
                          {competitor.advantages.map((advantage, advIndex) => (
                            <li key={advIndex} className="flex items-center gap-2 text-gray-300">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              {advantage}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-6">
                        <ul className="space-y-2">
                          {competitor.disadvantages.length > 0 ? (
                            competitor.disadvantages.map((disadvantage, disadvIndex) => (
                              <li key={disadvIndex} className="flex items-center gap-2 text-gray-500">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                {disadvantage}
                              </li>
                            ))
                          ) : (
                            <li className="flex items-center gap-2 text-green-400">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Nenhuma limitação significativa
                            </li>
                          )}
                        </ul>
                      </td>
                      <td className="p-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-2xl font-bold text-[#31A8FF]">{competitor.rating}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                className={`w-5 h-5 ${i < Math.floor(parseFloat(competitor.rating)) ? 'text-yellow-400' : 'text-gray-600'}`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA Final com Microinterações */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#31A8FF]/10 via-[#8B31FF]/10 to-[#FF4B6B]/10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="bg-gradient-to-br from-black/60 to-black/80 backdrop-blur-xl rounded-3xl p-16 text-center border border-white/10 relative overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#31A8FF]/5 via-transparent to-[#FF4B6B]/5"></div>
              
              <div className="relative z-10">
                <motion.h2 
                  className="text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B]"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Pronto para Dominar?
                </motion.h2>
                
                <motion.p 
                  className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  Junte-se aos <span className="text-[#31A8FF] font-bold">milhares de gamers</span> que já transformaram sua experiência com o VOLTRIS Optimizer
                </motion.p>

                <motion.div 
                  className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold rounded-full text-xl shadow-2xl hover:shadow-[0_0_40px_rgba(49,168,255,0.5)] transition-all duration-300 flex items-center gap-3"
                  >
                    <span>📥</span>
                    Baixar Agora Grátis
                    <motion.span 
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      ↻
                    </motion.span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 bg-transparent border-2 border-[#31A8FF] text-[#31A8FF] font-bold rounded-full text-xl hover:bg-[#31A8FF] hover:text-black transition-all duration-300 flex items-center gap-3"
                  >
                    <span>💬</span>
                    Falar com Especialista
                  </motion.button>
                </motion.div>

                <motion.div 
                  className="flex flex-wrap justify-center gap-8 text-gray-400"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 }}
                >
                  {[
                    { icon: '⚡', text: 'Instalação Instantânea' },
                    { icon: '🇧🇷', text: 'Interface em Português' },
                    { icon: '24/7', text: 'Suporte Premium' },
                    { icon: '🔒', text: '100% Seguro' }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center gap-2"
                      whileHover={{ scale: 1.1 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      
      <Footer />
      
      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] rounded-full shadow-2xl z-50 flex items-center justify-center text-white text-2xl hover:shadow-[0_0_30px_rgba(49,168,255,0.5)] transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 200 }}
      >
        💬
      </motion.button>
      
      {/* Structured Data for SEO */}
      <Script
        id="gamers-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "VOLTRIS Optimizer",
            "operatingSystem": "Windows 10/11",
            "applicationCategory": "GameApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "BRL"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "bestRating": "5",
              "ratingCount": "3247"
            },
            "softwareVersion": "3.2.1",
            "featureList": [
              "Otimização automática de jogos",
              "Inteligência artificial para perfis por jogo",
              "Suporte para CPUs híbridas (P/E cores)",
              "Redução de stutter em 95%",
              "Boost de FPS em até 25%",
              "Redução de input lag em 40%",
              "Otimização de rede para gaming",
              "Modo Gamer automático"
            ]
          })
        }}
      />
    </>
  );
} 
