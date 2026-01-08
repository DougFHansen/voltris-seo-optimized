'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


export default function GamersPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#171313] pt-20">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/gamers-bg.jpg"
              alt="Gaming Setup"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#171313] via-transparent to-[#171313]" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
                VOLTRIS para Gamers
              </h1>
              <p className="text-xl md:text-2xl text-[#e2e8f0] mb-8 max-w-3xl mx-auto">
                Maximize seu potencial gaming com soluções profissionais de otimização
              </p>
              <Link
                href="/optimizer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-semibold rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,49,255,0.5)] hover:scale-105"
              >
                Conheça o VOLTRIS OPTIMIZER
                <i className="fas fa-chevron-right"></i>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
              Por que escolher a VOLTRIS?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "fas fa-tachometer-alt",
                  title: "Performance Máxima",
                  description: "Otimização profissional para extrair o máximo de FPS do seu hardware"
                },
                {
                  icon: "fas fa-network-wired",
                  title: "Redução de Latência",
                  description: "Configurações avançadas de rede para minimizar ping e lag"
                },
                {
                  icon: "fas fa-shield-alt",
                  title: "Estabilidade Total",
                  description: "Elimine stutters e microfreezes para uma experiência suave"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-8 rounded-2xl hover:shadow-[0_0_30px_rgba(139,49,255,0.15)] transition-all duration-300"
                >
                  <i className={`${feature.icon} text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] to-[#31A8FF] mb-4 block`}></i>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-[#e2e8f0]">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 relative bg-[#1c1c1e]">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
              Nossos Serviços para Gamers
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Otimização de Games",
                  description: "Configurações personalizadas para cada jogo, garantindo máxima performance",
                  items: ["Configuração de drivers", "Ajustes de prioridade", "Otimização de memória"]
                },
                {
                  title: "Setup Completo",
                  description: "Preparação completa do seu PC para gaming profissional",
                  items: ["Overclock seguro", "Configuração de periféricos", "Perfis otimizados"]
                },
                {
                  title: "Streaming",
                  description: "Configuração profissional para streamers",
                  items: ["Setup do OBS/Streamlabs", "Otimização de encoder", "Configurações de áudio"]
                },
                {
                  title: "Suporte Premium",
                  description: "Assistência especializada 24/7",
                  items: ["Atendimento prioritário", "Monitoramento remoto", "Updates regulares"]
                }
              ].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-8 rounded-2xl border border-[#FF4B6B]/10 hover:border-[#8B31FF]/30 transition-all duration-300"
                >
                  <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-[#e2e8f0] mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-[#e2e8f0]">
                        <i className="fas fa-check text-[#FF4B6B] mr-2"></i>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-[#FF4B6B]/10 via-[#8B31FF]/10 to-[#31A8FF]/10 rounded-3xl p-12 text-center relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
                  Pronto para elevar seu game?
                </h2>
                <p className="text-xl text-[#e2e8f0] mb-8 max-w-2xl mx-auto">
                  Junte-se aos milhares de gamers que já transformaram sua experiência com a VOLTRIS
                </p>
                <Link
                  href="https://wa.me/5511996716235?text=Olá%20VOLTRIS%2C%20preciso%20de%20atendimento%20para%20otimização%20gaming!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-semibold rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,49,255,0.5)] hover:scale-105"
                >
                  Falar com Especialista
                  <i className="fab fa-whatsapp"></i>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
} 
