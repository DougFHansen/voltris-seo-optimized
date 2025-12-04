'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSenseBanner from '../components/AdSenseBanner';

export default function OptimizerPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#171313] pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-[#171313] via-transparent to-[#171313]" />
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF4B6B] rounded-full filter blur-[100px] animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8B31FF] rounded-full filter blur-[100px] animate-pulse" />
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
                VOLTRIS OPTIMIZER
              </h1>
              <p className="text-xl md:text-2xl text-[#e2e8f0] mb-8">
                A solução definitiva para maximizar sua experiência gaming
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href="https://wa.me/5511996716235?text=Olá%20VOLTRIS%2C%20gostaria%20de%20saber%20mais%20sobre%20o%20VOLTRIS%20OPTIMIZER!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-semibold rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,49,255,0.5)] hover:scale-105"
                >
                  Falar com Especialista
                  <i className="fab fa-whatsapp"></i>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Como Funciona Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
              Como Funciona
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Análise do Sistema",
                  description: "O VOLTRIS OPTIMIZER faz uma análise completa do seu hardware e software, identificando gargalos e oportunidades de otimização."
                },
                {
                  step: "02",
                  title: "Otimização Inteligente",
                  description: "Aplicamos ajustes personalizados baseados na análise, incluindo configurações de CPU, GPU, memória e rede."
                },
                {
                  step: "03",
                  title: "Monitoramento Contínuo",
                  description: "O sistema continua monitorando e ajustando as configurações em tempo real para manter o desempenho ideal."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative"
                >
                  <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-8 rounded-2xl border border-[#FF4B6B]/10 hover:border-[#8B31FF]/30 transition-all duration-300">
                    <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] opacity-50">
                      {item.step}
                    </span>
                    <h3 className="text-2xl font-bold text-white mt-4 mb-4">{item.title}</h3>
                    <p className="text-[#e2e8f0]">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tecnologia Section */}
        <section className="py-20 relative bg-[#1c1c1e]">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
              Nossa Tecnologia
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-xl"
                >
                  <h3 className="text-2xl font-bold text-white mb-4">Otimização de Hardware</h3>
                  <ul className="space-y-4">
                    {[
                      "Ajuste dinâmico de frequência de CPU e GPU",
                      "Gerenciamento avançado de memória RAM",
                      "Otimização de cache e armazenamento",
                      "Perfis personalizados por hardware"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center text-[#e2e8f0]">
                        <i className="fas fa-check text-[#FF4B6B] mr-3"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-xl"
                >
                  <h3 className="text-2xl font-bold text-white mb-4">Otimização de Software</h3>
                  <ul className="space-y-4">
                    {[
                      "Priorização inteligente de processos",
                      "Otimização de drivers e serviços",
                      "Limpeza e manutenção automática",
                      "Configurações otimizadas por jogo"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center text-[#e2e8f0]">
                        <i className="fas fa-check text-[#FF4B6B] mr-3"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-xl"
                >
                  <h3 className="text-2xl font-bold text-white mb-4">Otimização de Rede</h3>
                  <ul className="space-y-4">
                    {[
                      "Redução de latência e ping",
                      "Priorização de tráfego de jogos",
                      "Otimização de rotas de rede",
                      "Proteção contra DDoS"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center text-[#e2e8f0]">
                        <i className="fas fa-check text-[#FF4B6B] mr-3"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-xl"
                >
                  <h3 className="text-2xl font-bold text-white mb-4">Monitoramento e Suporte</h3>
                  <ul className="space-y-4">
                    {[
                      "Dashboard em tempo real",
                      "Alertas e notificações",
                      "Suporte técnico especializado",
                      "Atualizações automáticas"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center text-[#e2e8f0]">
                        <i className="fas fa-check text-[#FF4B6B] mr-3"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Resultados Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
              Resultados Comprovados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  metric: "40%",
                  title: "Aumento de FPS",
                  description: "Média de aumento em jogos populares"
                },
                {
                  metric: "65%",
                  title: "Redução de Latência",
                  description: "Diminuição média no tempo de resposta"
                },
                {
                  metric: "90%",
                  title: "Menos Stuttering",
                  description: "Redução em travamentos e engasgos"
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-8 rounded-2xl text-center"
                >
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] to-[#31A8FF] mb-4">
                    {stat.metric}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{stat.title}</h3>
                  <p className="text-[#e2e8f0]">{stat.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-[#FF4B6B]/10 via-[#8B31FF]/10 to-[#31A8FF]/10 rounded-3xl p-12 text-center">
              <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
                Pronto para Revolucionar sua Experiência Gaming?
              </h2>
              <p className="text-xl text-[#e2e8f0] mb-8 max-w-2xl mx-auto">
                Junte-se aos milhares de gamers que já transformaram seu setup com o VOLTRIS OPTIMIZER
              </p>
              <Link
                href="https://wa.me/5511996716235?text=Olá%20VOLTRIS%2C%20gostaria%20de%20conhecer%20mais%20sobre%20o%20VOLTRIS%20OPTIMIZER!"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-semibold rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,49,255,0.5)] hover:scale-105"
              >
                Começar Agora
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </section>
      </div>
      <AdSenseBanner />
      <Footer />
    </>
  );
} 