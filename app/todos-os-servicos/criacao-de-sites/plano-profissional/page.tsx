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
  NewspaperIcon,
  ShieldCheckIcon,
  ChatBubbleBottomCenterTextIcon,
  ShareIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';


export default function PlanoProfissionalPage() {
  const supabase = createClient();
  const features = [
    {
      title: 'Design Premium',
      description: 'Layout exclusivo e profissional',
      icon: <DevicePhoneMobileIcon className="w-6 h-6" />
    },
    {
      title: 'Até 10 Páginas',
      description: 'Conteúdo completo e organizado',
      icon: <DocumentTextIcon className="w-6 h-6" />
    },
    {
      title: 'SEO Avançado',
      description: 'Melhor posicionamento no Google',
      icon: <CursorArrowRaysIcon className="w-6 h-6" />
    },
    {
      title: 'Integração Social',
      description: 'Conecte suas redes sociais',
      icon: <ShareIcon className="w-6 h-6" />
    }
  ];

  const process = [
    {
      title: 'Análise de Mercado',
      description: 'Estudo do seu setor e concorrência'
    },
    {
      title: 'Planejamento Estratégico',
      description: 'Definição de objetivos e estratégias'
    },
    {
      title: 'Design Premium',
      description: 'Criação de layout exclusivo'
    },
    {
      title: 'Desenvolvimento',
      description: 'Programação avançada e otimizada'
    },
    {
      title: 'Otimização e Testes',
      description: 'Ajustes de performance e SEO'
    },
    {
      title: 'Treinamento',
      description: 'Capacitação para gestão do site'
    }
  ];

  const includes = [
    'Design responsivo premium',
    'Até 10 páginas personalizadas',
    'SEO avançado com análise de palavras-chave',
    'Hospedagem premium por 1 ano',
    'Certificado SSL de segurança',
    '6 meses de suporte técnico',
    'Integração com redes sociais',
    'Painel administrativo intuitivo',
    'Treinamento para gestão do site',
    'Relatórios mensais de desempenho',
    'Backup automático diário'
  ];

  const handleContratarAgora = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const orderData = {
      service_name: 'Plano Profissional - Criação de Site',
      service_description: 'Site profissional com até 10 páginas, SEO avançado e recursos exclusivos',
      final_price: 1997,
      plan_type: 'profissional',
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
          <div className="absolute inset-0 bg-gradient-to-r from-[#8B31FF]/10 via-[#31A8FF]/10 to-[#FF4B6B]/10"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
                Plano Profissional
              </h1>
              <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
                A solução completa para empresas que buscam uma presença digital profissional e resultados
              </p>
              <div className="mt-8">
                <span className="text-4xl font-bold text-white">R$ 1.997</span>
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
                  className="bg-[#1D1919]/50 p-6 rounded-xl backdrop-blur-sm border border-[#8B31FF]/20"
                >
                  <div className="bg-gradient-to-br from-[#8B31FF]/20 to-[#31A8FF]/20 p-3 rounded-lg inline-block mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Process Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-[#8B31FF] via-[#31A8FF] to-[#FF4B6B] text-transparent bg-clip-text">
                Processo de Desenvolvimento
              </h2>
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#8B31FF] to-[#31A8FF] rounded-full"></div>
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
                      <div className="flex-1 p-6 bg-[#1D1919]/50 rounded-xl backdrop-blur-sm border border-[#8B31FF]/20">
                        <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                        <p className="text-gray-400">{step.description}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] flex items-center justify-center text-white font-bold">
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
              <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-[#8B31FF] via-[#31A8FF] to-[#FF4B6B] text-transparent bg-clip-text">
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
                    <CheckCircleIcon className="w-6 h-6 text-[#8B31FF]" />
                    <span className="text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-6 text-white">
                Impulsione Seu Negócio
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Tenha um site profissional completo e destaque-se da concorrência
              </p>
              <Link
                href="#"
                onClick={e => { e.preventDefault(); handleContratarAgora(); }}
                className="inline-block bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] text-white py-4 px-8 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105"
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
