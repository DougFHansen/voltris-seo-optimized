'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  DevicePhoneMobileIcon, 
  MagnifyingGlassIcon, 
  WrenchScrewdriverIcon, 
  BoltIcon,
  CodeBracketIcon,
  PaintBrushIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  CloudIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Head from 'next/head';
import { CheckCircle } from 'lucide-react';
import AdSenseBanner from '../../components/AdSenseBanner';

export default function CriacaoSitesPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const supabase = createClient();

  const handleContratarAgora = async (servico: any) => {
    console.log('=== INÍCIO handleContratarAgora ===');
    console.log('Serviço completo:', servico);
    const { data: { session } } = await supabase.auth.getSession();
    let valor = servico.price;
    console.log('Preço original:', valor);
    if (typeof valor === 'string') {
      // Remove R$, espaços e converte vírgula para ponto
      const valorLimpo = valor.replace(/R\$\s*/g, '').replace(/\./g, '').replace(',', '.');
      console.log('Valor limpo:', valorLimpo);
      valor = Number(valorLimpo);
      console.log('Valor convertido:', valor);
    }
    if (!valor || isNaN(valor)) {
      console.log('Valor inválido, usando 1');
      valor = 1;
    }
    console.log('Valor final:', valor);
    const planTypeMap: Record<string, string> = {
      'Básico': 'basico',
      'Profissional': 'profissional',
      'Empresarial': 'empresarial'
    };
    const orderData = {
      planName: servico.name,
      planPrice: valor,
      planFeatures: servico.features || [],
      planDescription: servico.description || '',
      plan_type: planTypeMap[servico.name] || 'basico', // Corrigido para plan_type
      service_name: `Criação de Site: ${servico.name}`,
      service_description: servico.features ? servico.features.join(' | ') : '',
      final_price: valor,
      total: valor,
      items: [
        {
          service_name: `Criação de Site: ${servico.name}`,
          service_description: servico.features ? servico.features.join(' | ') : '',
          price: valor
        }
      ]
    };
    console.log('OrderData final:', orderData);
    sessionStorage.setItem('pendingOrderData', JSON.stringify(orderData));
    if (!session) {
      window.location.href = `/login?redirect=/dashboard&pendingOrder=true`;
      return;
    }
    window.location.href = '/dashboard?pendingOrder=true';
  };

  const benefits = [
    {
      title: 'Desenvolvimento Profissional',
      description: 'Código limpo e otimizado',
      icon: <CodeBracketIcon className="w-12 h-12 text-[#FF4B6B]" />
    },
    {
      title: 'Design Exclusivo',
      description: 'Visual único e personalizado',
      icon: <PaintBrushIcon className="w-12 h-12 text-[#8B31FF]" />
    },
    {
      title: 'Segurança Garantida',
      description: 'Proteção contra ameaças',
      icon: <ShieldCheckIcon className="w-12 h-12 text-[#31A8FF]" />
    },
    {
      title: 'Rápida Entrega',
      description: 'Prazos ágeis e definidos',
      icon: <RocketLaunchIcon className="w-12 h-12 text-[#FF4B6B]" />
    }
  ];

  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 'R$ 997,00',
      features: [
        'Site de até 5 páginas',
        'Design responsivo',
        'Formulário de contato',
        'Otimização básica SEO',
        'Hospedagem por 1 ano',
        '3 meses de suporte'
      ]
    },
    {
      id: 'professional',
      name: 'Profissional',
      price: 'R$ 1.997,00',
      features: [
        'Site de até 10 páginas',
        'Design responsivo premium',
        'Otimização SEO avançada',
        'Hospedagem por 1 ano',
        'Certificado SSL',
        '6 meses de suporte',
        'Integração com redes sociais'
      ]
    },
    {
      id: 'enterprise',
      name: 'Empresarial',
      price: 'R$ 3.997,00',
      features: [
        'Site personalizado',
        'Páginas ilimitadas',
        'Design exclusivo',
        'E-commerce (se necessário)',
        'SEO profissional',
        'Hospedagem premium',
        'Certificado SSL',
        'Suporte prioritário 12 meses',
        'Painel administrativo',
        'Treinamento da equipe'
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>Criação de Sites Profissionais VOLTRIS - Design Responsivo e SEO Otimizado</title>
        <meta name="description" content="Criação de sites profissionais com design responsivo, otimização SEO e hospedagem incluída. Planos básico, profissional e empresarial. Transforme sua presença digital!" />
        <meta name="keywords" content="criação de sites, desenvolvimento web, design responsivo, SEO, hospedagem, sites profissionais, desenvolvimento de sites, web design" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Criação de Sites Profissionais VOLTRIS - Design Responsivo e SEO Otimizado" />
        <meta property="og:description" content="Criação de sites profissionais com design responsivo, otimização SEO e hospedagem incluída. Planos básico, profissional e empresarial." />
        <meta property="og:url" content="https://voltris.com.br/todos-os-servicos/criacao-sites" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://voltris.com.br/formatacao.png" />
        <meta property="og:image:alt" content="Criação de Sites Profissionais VOLTRIS" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Criação de Sites Profissionais VOLTRIS - Design Responsivo e SEO Otimizado" />
        <meta name="twitter:description" content="Criação de sites profissionais com design responsivo, otimização SEO e hospedagem incluída. Planos básico, profissional e empresarial." />
        <meta name="twitter:image" content="https://voltris.com.br/formatacao.png" />
        
        {/* Canonical */}
        <link rel="canonical" href="https://voltris.com.br/todos-os-servicos/criacao-sites" />
        
        {/* Schema.org structured data for web development service */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "Criação de Sites Profissionais",
              "description": "Criação de sites profissionais com design responsivo, otimização SEO e hospedagem incluída",
              "provider": {
                "@type": "Organization",
                "name": "VOLTRIS",
                "url": "https://voltris.com.br"
              },
              "serviceType": "Desenvolvimento Web",
              "areaServed": {
                "@type": "Country",
                "name": "Brasil"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Planos de Criação de Sites",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "name": "Plano Básico",
                    "price": "997.00",
                    "priceCurrency": "BRL",
                    "description": "Site de até 5 páginas com design responsivo e otimização básica SEO"
                  },
                  {
                    "@type": "Offer",
                    "name": "Plano Profissional",
                    "price": "1997.00",
                    "priceCurrency": "BRL",
                    "description": "Site de até 10 páginas com design premium e otimização SEO avançada"
                  },
                  {
                    "@type": "Offer",
                    "name": "Plano Empresarial",
                    "price": "3997.00",
                    "priceCurrency": "BRL",
                    "description": "Site personalizado com páginas ilimitadas e e-commerce"
                  }
                ]
              }
            })
          }}
        />
      </Head>
      
      <Header />
      <main className="bg-[#171313] min-h-screen">
        {/* Hero Section with Animation */}
        <section className="pt-32 pb-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B6B]/10 via-[#8B31FF]/10 to-[#31A8FF]/10"></div>
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
                Criação de Sites Profissionais
              </h1>
              <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
                Transforme sua presença digital com um site moderno, responsivo e otimizado para resultados
              </p>
            </motion.div>
            
            {/* Animated Benefits Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-4 bg-[#1D1919]/50 rounded-xl backdrop-blur-sm border border-[#8B31FF]/20 group"
                >
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <h3 className="text-white font-semibold">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
              Escolha o Plano Ideal para Seu Negócio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  id={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`p-6 rounded-xl border ${
                    selectedPlan === plan.id
                      ? 'border-[#FF4B6B] bg-gradient-to-b from-[#FF4B6B]/10 to-transparent'
                      : 'border-[#8B31FF]/10 bg-[#1D1919]'
                  } hover:border-[#FF4B6B] transition-all duration-300 cursor-pointer h-full flex flex-col`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-3xl font-bold text-[#FF4B6B] mb-6">{plan.price}</p>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-gray-300">
                          <span className="text-[#FF4B6B] mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => handleContratarAgora(plan)}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                      selectedPlan === plan.id
                        ? 'bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-white'
                        : 'bg-[#2a2a2e] text-white hover:bg-[#FF4B6B] hover:text-white'
                    }`}
                  >
                    Contratar Agora
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefícios (após planos) */}
        <section className="w-full py-10 md:py-16 bg-[#171313] flex justify-center items-center">
          <div className="max-w-6xl w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
            {[
              {
                title: 'Design moderno e responsivo',
                icon: <DevicePhoneMobileIcon className="w-12 h-12 text-[#31A8FF] mb-2" />
              },
              {
                title: 'Otimização para SEO',
                icon: <MagnifyingGlassIcon className="w-12 h-12 text-[#8B31FF] mb-2" />
              },
              {
                title: 'Carregamento rápido',
                icon: <BoltIcon className="w-12 h-12 text-[#FF4B6B] mb-2" />
              },
              {
                title: 'Suporte técnico completo',
                icon: <WrenchScrewdriverIcon className="w-12 h-12 text-[#31A8FF] mb-2" />
              },
              {
                title: 'Hospedagem inclusa',
                icon: <CloudIcon className="w-12 h-12 text-[#8B31FF] mb-2" />
              },
              {
                title: 'Domínio personalizado',
                icon: <GlobeAltIcon className="w-12 h-12 text-[#31A8FF] mb-2" />
              }
            ].map((item, i) => (
              <div key={i} className="bg-[#1D1919]/80 border border-[#8B31FF]/20 rounded-xl shadow flex flex-col items-center justify-center py-8 px-4 text-center">
                {item.icon}
                <span className="font-semibold text-lg text-white">{item.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-[#FF4B6B]/10 via-[#8B31FF]/10 to-[#31A8FF]/10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Comece Agora Mesmo seu Projeto
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Escolha o plano ideal para seu negócio e tenha seu site no ar em poucos dias!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
                <Link 
                  href="/todos-os-servicos/criacao-de-sites/plano-basico"
                  className="bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-white py-4 px-8 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105"
                >
                  Ver Plano Básico
                </Link>
                <Link 
                  href="/todos-os-servicos/criacao-de-sites/plano-profissional"
                  className="bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] text-white py-4 px-8 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105"
                >
                  Ver Plano Profissional
                </Link>
                <Link 
                  href="/todos-os-servicos/criacao-de-sites/plano-empresarial"
                  className="bg-gradient-to-r from-[#31A8FF] to-[#FF4B6B] text-white py-4 px-8 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105"
                >
                  Ver Plano Empresarial
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <AdSenseBanner />
      <Footer />
    </>
  );
} 