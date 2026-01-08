'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { 
  DevicePhoneMobileIcon, 
  DocumentTextIcon,
  ClockIcon,
  CursorArrowRaysIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  ServerIcon,
  UserGroupIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';


export default function PlanoEmpresarialPage() {
  const supabase = createClient();
  const features = [
    {
      title: 'Design Exclusivo',
      description: 'Layout totalmente personalizado',
      icon: <DevicePhoneMobileIcon className="w-6 h-6" />
    },
    {
      title: 'Páginas Ilimitadas',
      description: 'Conteúdo sem restrições',
      icon: <DocumentTextIcon className="w-6 h-6" />
    },
    {
      title: 'E-commerce',
      description: 'Loja virtual integrada',
      icon: <ShoppingCartIcon className="w-6 h-6" />
    },
    {
      title: 'Analytics Avançado',
      description: 'Métricas e relatórios completos',
      icon: <ChartBarIcon className="w-6 h-6" />
    }
  ];

  const process = [
    {
      title: 'Consultoria Estratégica',
      description: 'Análise profunda do seu negócio'
    },
    {
      title: 'Planejamento Completo',
      description: 'Definição de objetivos e KPIs'
    },
    {
      title: 'Design Exclusivo',
      description: 'Criação de identidade única'
    },
    {
      title: 'Desenvolvimento Premium',
      description: 'Programação personalizada'
    },
    {
      title: 'Otimização Avançada',
      description: 'Performance e SEO profissional'
    },
    {
      title: 'Treinamento Completo',
      description: 'Capacitação da sua equipe'
    },
    {
      title: 'Acompanhamento',
      description: 'Suporte prioritário 12 meses'
    }
  ];

  const includes = [
    'Design exclusivo e personalizado',
    'Páginas ilimitadas',
    'E-commerce completo (se necessário)',
    'SEO profissional e otimização avançada',
    'Hospedagem premium dedicada',
    'Certificado SSL premium',
    'Suporte prioritário 12 meses',
    'Painel administrativo personalizado',
    'Treinamento completo da equipe',
    'Integrações personalizadas',
    'Relatórios semanais de performance',
    'Backup em tempo real',
    'CDN para melhor performance',
    'Monitoramento 24/7',
    'Consultoria estratégica mensal'
  ];

  const handleContratarAgora = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const orderData = {
      service_name: 'Plano Empresarial - Criação de Site',
      service_description: 'Site corporativo com e-commerce, painel administrativo e suporte premium',
      final_price: 3997,
      plan_type: 'empresarial',
    };
    if (!session) {
      sessionStorage.setItem('pendingOrderData', JSON.stringify(orderData));
      window.location.href = `/login?redirect=/dashboard&pendingOrder=true`;
      return;
    }
    // Cria pedido via API
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    window.location.href = '/dashboard';
  };

  return (
    <>
      <Header />
      <main className="bg-[#171313] min-h-screen pt-32">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 py-16">
          <div className="absolute inset-0 bg-gradient-to-r from-[#31A8FF]/10 via-[#FF4B6B]/10 to-[#8B31FF]/10"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#31A8FF] to-[#FF4B6B] text-transparent bg-clip-text">
                Plano Empresarial
              </h1>
              <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
                A solução definitiva para empresas que exigem o máximo em qualidade e personalização
              </p>
              <div className="mt-8">
                <span className="text-4xl font-bold text-white">R$ 3.997</span>
                <span className="text-gray-400 ml-2">pagamento único</span>
              </div>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-[#1D1919]/50 p-6 rounded-xl backdrop-blur-sm border border-[#31A8FF]/20"
                >
                  <div className="bg-gradient-to-br from-[#31A8FF]/20 to-[#FF4B6B]/20 p-3 rounded-lg inline-block mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Process Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-[#31A8FF] via-[#FF4B6B] to-[#8B31FF] text-transparent bg-clip-text">
                Processo de Desenvolvimento Premium
              </h2>
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#31A8FF] to-[#FF4B6B] rounded-full"></div>
                <div className="space-y-12">
                  {process.map((step, index) => (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className={`flex items-center gap-8 ${
                        index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                      }`}
                    >
                      <div className="flex-1 p-6 bg-[#1D1919]/50 rounded-xl backdrop-blur-sm border border-[#31A8FF]/20">
                        <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                        <p className="text-gray-400">{step.description}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#31A8FF] to-[#FF4B6B] flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* What's Included Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-[#31A8FF] via-[#FF4B6B] to-[#8B31FF] text-transparent bg-clip-text">
                O Que Está Incluído
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {includes.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-[#1D1919]/50 rounded-lg backdrop-blur-sm"
                  >
                    <CheckCircleIcon className="w-6 h-6 text-[#31A8FF]" />
                    <span className="text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-6 text-white">
                Eleve Seu Negócio ao Próximo Nível
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Tenha um site empresarial completo com todas as funcionalidades que sua empresa precisa
              </p>
              <Link
                href="#"
                onClick={e => { e.preventDefault(); handleContratarAgora(); }}
                className="inline-block bg-gradient-to-r from-[#31A8FF] to-[#FF4B6B] text-white py-4 px-8 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105"
              >
                Contratar Agora
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
} 
