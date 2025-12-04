import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { MonitorSmartphone, Laptop2, ShieldCheck, HardDrive, GaugeCircle, Database, Package, Printer, MapPin, Clock, Star, Users, CheckCircle, Globe, Code, Palette, Smartphone, Zap } from 'lucide-react';
import AdSenseBanner from '../components/AdSenseBanner';

export const metadata: Metadata = {
  title: "Criar Site - Desenvolvimento de Sites Profissionais e Responsivos | VOLTRIS",
  description: "Criar site profissional e responsivo para sua empresa. Desenvolvimento web moderno, SEO otimizado, design personalizado e suporte completo. Sites que convertem visitantes em clientes.",
  keywords: [
    "criar site",
    "criar site profissional",
    "desenvolvimento de sites",
    "criação de sites",
    "site responsivo",
    "site empresarial",
    "design de sites",
    "desenvolvimento web",
    "site institucional",
    "site e-commerce",
    "landing page",
    "site otimizado SEO",
    "site moderno",
    "site personalizado",
    "programação web",
    "frontend development",
    "site WordPress",
    "site React",
    "site Next.js",
    "site mobile first"
  ],
  openGraph: {
    title: "Criar Site - Desenvolvimento de Sites Profissionais e Responsivos | VOLTRIS",
    description: "Criar site profissional e responsivo para sua empresa. Desenvolvimento web moderno, SEO otimizado, design personalizado e suporte completo.",
    url: "https://voltris.com.br/criar-site",
    type: "website",
    images: [
      {
        url: "/remotebanner.jpg",
        width: 1200,
        height: 630,
        alt: "Criar Site - Desenvolvimento Web Profissional VOLTRIS"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Criar Site - Desenvolvimento de Sites Profissionais e Responsivos | VOLTRIS",
    description: "Criar site profissional e responsivo para sua empresa. Desenvolvimento web moderno e SEO otimizado.",
    images: ["/remotebanner.jpg"]
  },
  alternates: {
    canonical: "https://voltris.com.br/criar-site"
  }
};

const plans = [
  {
    name: "Plano Básico",
    price: "R$ 997,90",
    description: "Site institucional simples e responsivo",
    features: [
      "Design responsivo",
      "Até 5 páginas",
      "Formulário de contato",
      "Otimização SEO básica",
      "Suporte por 30 dias",
      "Hospedagem inclusa"
    ],
    icon: <MonitorSmartphone className="w-8 h-8 text-[#31A8FF]" />
  },
  {
    name: "Plano Profissional",
    price: "R$ 1.997,90",
    description: "Site profissional com recursos avançados",
    features: [
      "Design personalizado",
      "Até 10 páginas",
      "Blog integrado",
      "Otimização SEO completa",
      "Analytics integrado",
      "Suporte por 90 dias",
      "Hospedagem inclusa"
    ],
    icon: <Code className="w-8 h-8 text-[#8B31FF]" />
  },
  {
    name: "Plano Empresarial",
    price: "R$ 2.997,90",
    description: "Site completo com e-commerce",
    features: [
      "Design exclusivo",
      "Páginas ilimitadas",
      "E-commerce integrado",
      "SEO avançado",
      "Marketing digital",
      "Suporte por 1 ano",
      "Hospedagem premium"
    ],
    icon: <Globe className="w-8 h-8 text-[#31A8FF]" />
  }
];

const technologies = [
  "React.js",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "WordPress",
  "SEO Otimizado",
  "Mobile First",
  "Performance"
];

const benefits = [
  "Design moderno e responsivo",
  "Otimização para SEO",
  "Carregamento rápido",
  "Suporte técnico completo",
  "Hospedagem inclusa",
  "Domínio personalizado"
];

export default function CriarSitePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Criar Site - Desenvolvimento Web Profissional",
            "description": "Serviços de criação de sites profissionais e responsivos com design moderno e SEO otimizado",
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
            "offers": {
              "@type": "Offer",
              "price": "997.90",
              "priceCurrency": "BRL",
              "availability": "https://schema.org/InStock"
            }
          })
        }}
      />
      
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Criar <span className="text-[#31A8FF]">Site</span> Profissional
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
                Desenvolvimento de sites profissionais e responsivos para sua empresa. 
                Design moderno, SEO otimizado e suporte completo para sites que convertem.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link 
                  href="/todos-os-servicos/criacao-sites"
                  className="bg-[#31A8FF] hover:bg-[#2B8FD9] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                >
                  Solicitar Orçamento
                </Link>
                <Link 
                  href="/todos-os-servicos/criacao-sites/plano-basico"
                  className="border-2 border-[#31A8FF] text-[#31A8FF] hover:bg-[#31A8FF] hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
                >
                  Ver Planos
                </Link>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#31A8FF] mb-2">100+</div>
                <div className="text-gray-600">Sites Criados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#31A8FF] mb-2">100%</div>
                <div className="text-gray-600">Responsivos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#31A8FF] mb-2">SEO</div>
                <div className="text-gray-600">Otimizado</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#31A8FF] mb-2">24/7</div>
                <div className="text-gray-600">Suporte</div>
              </div>
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Planos para Criar Site
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Escolha o plano ideal para criar seu site profissional. 
                Todos os planos incluem design responsivo e otimização SEO.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div key={index} className={`bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-all duration-300 ${index === 1 ? 'ring-2 ring-[#31A8FF] bg-white' : ''}`}>
                  <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                      {plan.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-[#31A8FF] mb-2">{plan.price}</div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-[#31A8FF] mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link 
                    href={`/todos-os-servicos/criacao-sites/${index === 0 ? 'plano-basico' : index === 1 ? 'plano-profissional' : 'plano-empresarial'}`}
                    className={`w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                      index === 1 
                        ? 'bg-[#31A8FF] hover:bg-[#2B8FD9] text-white' 
                        : 'border-2 border-[#31A8FF] text-[#31A8FF] hover:bg-[#31A8FF] hover:text-white'
                    }`}
                  >
                    Escolher Plano
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Tecnologias Modernas
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Utilizamos as melhores tecnologias para criar sites rápidos, 
                seguros e otimizados para SEO.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {technologies.map((tech, index) => (
                <div key={index} className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300">
                  <h3 className="text-lg font-semibold text-gray-900">{tech}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#31A8FF] to-[#8B31FF]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Por que escolher nossos serviços para criar site?
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Oferecemos vantagens exclusivas que garantem um site profissional 
                e eficiente para sua empresa.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-lg p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-[#31A8FF] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto para criar seu site profissional?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Nossa equipe está pronta para desenvolver o site perfeito 
              para sua empresa, com design moderno e SEO otimizado.
            </p>
            <Link 
              href="/todos-os-servicos/criacao-sites"
              className="bg-[#31A8FF] hover:bg-[#2B8FD9] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 inline-block"
            >
              Começar Agora
            </Link>
          </div>
        </section>
      </main>
      <AdSenseBanner />
      <Footer />
    </>
  );
} 