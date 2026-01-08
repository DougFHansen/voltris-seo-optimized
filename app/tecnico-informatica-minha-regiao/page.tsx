import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { MonitorSmartphone, Laptop2, ShieldCheck, HardDrive, GaugeCircle, Database, Package, Printer, MapPin, Clock, Star, Users, CheckCircle, Globe } from 'lucide-react';


export const metadata: Metadata = {
  title: "Técnico de Informática na Minha Região - Suporte Remoto em Todo Brasil | VOLTRIS",
  description: "Técnico de informática na sua região com suporte remoto. Atendimento em todo Brasil, 100% online. Resolva problemas de computador, formatação, otimização e manutenção de sistemas Windows.",
  keywords: [
    "técnico de informática na minha região",
    "técnico informática região",
    "técnico computador minha cidade",
    "suporte técnico minha região",
    "técnico informática perto de mim",
    "assistência técnica minha região",
    "técnico computador local",
    "suporte remoto minha região",
    "manutenção computador região",
    "formatação computador minha cidade",
    "otimização PC minha região",
    "correção erros Windows região",
    "instalação programas minha cidade",
    "remoção vírus minha região",
    "técnico informática Brasil",
    "suporte técnico remoto Brasil",
    "manutenção sistema minha região",
    "reparo computador minha cidade",
    "configuração computador região",
    "instalação Windows minha região"
  ],
  openGraph: {
    title: "Técnico de Informática na Minha Região - Suporte Remoto em Todo Brasil | VOLTRIS",
    description: "Técnico de informática na sua região com suporte remoto. Atendimento em todo Brasil, 100% online.",
    url: "https://voltris.com.br/tecnico-informatica-minha-regiao",
    type: "website",
    images: [
      {
        url: "/remotebanner.jpg",
        width: 1200,
        height: 630,
        alt: "Técnico de Informática na Minha Região - Suporte Remoto VOLTRIS"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Técnico de Informática na Minha Região - Suporte Remoto em Todo Brasil | VOLTRIS",
    description: "Técnico de informática na sua região com suporte remoto. Atendimento em todo Brasil.",
    images: ["/remotebanner.jpg"]
  },
  alternates: {
    canonical: "https://voltris.com.br/tecnico-informatica-minha-regiao"
  }
};

const regions = [
  {
    name: "São Paulo",
    description: "Capital e região metropolitana",
    icon: <MapPin className="w-6 h-6 text-[#31A8FF]" />
  },
  {
    name: "Rio de Janeiro",
    description: "Capital e região metropolitana",
    icon: <MapPin className="w-6 h-6 text-[#8B31FF]" />
  },
  {
    name: "Minas Gerais",
    description: "Belo Horizonte e região",
    icon: <MapPin className="w-6 h-6 text-[#31A8FF]" />
  },
  {
    name: "Rio Grande do Sul",
    description: "Porto Alegre e região",
    icon: <MapPin className="w-6 h-6 text-[#8B31FF]" />
  },
  {
    name: "Paraná",
    description: "Curitiba e região",
    icon: <MapPin className="w-6 h-6 text-[#31A8FF]" />
  },
  {
    name: "Santa Catarina",
    description: "Florianópolis e região",
    icon: <MapPin className="w-6 h-6 text-[#8B31FF]" />
  },
  {
    name: "Bahia",
    description: "Salvador e região",
    icon: <MapPin className="w-6 h-6 text-[#31A8FF]" />
  },
  {
    name: "Pernambuco",
    description: "Recife e região",
    icon: <MapPin className="w-6 h-6 text-[#8B31FF]" />
  },
  {
    name: "Ceará",
    description: "Fortaleza e região",
    icon: <MapPin className="w-6 h-6 text-[#31A8FF]" />
  },
  {
    name: "Goiás",
    description: "Goiânia e região",
    icon: <MapPin className="w-6 h-6 text-[#8B31FF]" />
  },
  {
    name: "Distrito Federal",
    description: "Brasília e região",
    icon: <MapPin className="w-6 h-6 text-[#31A8FF]" />
  },
  {
    name: "Todas as Regiões",
    description: "Atendimento em todo Brasil",
    icon: <Globe className="w-6 h-6 text-[#8B31FF]" />
  }
];

const services = [
  {
    title: "Formatação Remota",
    description: "Formatação completa do seu computador",
    price: "A partir de R$ 99,90",
    icon: <HardDrive className="w-8 h-8 text-[#31A8FF]" />
  },
  {
    title: "Otimização de Sistema",
    description: "Melhore a performance do seu PC",
    price: "A partir de R$ 79,90",
    icon: <GaugeCircle className="w-8 h-8 text-[#8B31FF]" />
  },
  {
    title: "Remoção de Vírus",
    description: "Limpeza completa de malware",
    price: "R$ 39,90",
    icon: <ShieldCheck className="w-8 h-8 text-[#31A8FF]" />
  },
  {
    title: "Instalação de Programas",
    description: "Instalação e configuração de software",
    price: "A partir de R$ 29,90",
    icon: <Package className="w-8 h-8 text-[#8B31FF]" />
  }
];

const advantages = [
  "Atendimento em todo Brasil",
  "Não precisa sair de casa",
  "Suporte 24/7",
  "Técnicos certificados",
  "Preços acessíveis",
  "Garantia de satisfação"
];

export default function TecnicoInformaticaMinhaRegiaoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Técnico de Informática na Minha Região - Suporte Remoto",
            "description": "Serviços de técnico de informática com atendimento remoto em todas as regiões do Brasil",
            "provider": {
              "@type": "Organization",
              "name": "VOLTRIS",
              "url": "https://voltris.com.br"
            },
            "serviceType": "Suporte Técnico de Informática Remoto",
            "areaServed": {
              "@type": "Country",
              "name": "Brasil"
            },
            "offers": {
              "@type": "Offer",
              "price": "29.90",
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
                Técnico de Informática na <span className="text-[#31A8FF]">Minha Região</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
                Suporte técnico remoto especializado em informática para sua região. 
                Atendimento em todo Brasil, 100% online. Resolva problemas de computador 
                sem sair de casa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link 
                  href="/servicos"
                  className="bg-[#31A8FF] hover:bg-[#2B8FD9] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                >
                  Solicitar Atendimento
                </Link>
                <Link 
                  href="/faq"
                  className="border-2 border-[#31A8FF] text-[#31A8FF] hover:bg-[#31A8FF] hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
                >
                  Ver FAQ
                </Link>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#31A8FF] mb-2">Todo</div>
                <div className="text-gray-600">Brasil</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#31A8FF] mb-2">24/7</div>
                <div className="text-gray-600">Atendimento</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#31A8FF] mb-2">100%</div>
                <div className="text-gray-600">Remoto</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#31A8FF] mb-2">0</div>
                <div className="text-gray-600">Deslocamento</div>
              </div>
            </div>
          </div>
        </section>

        {/* Regions Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Atendimento em Todas as Regiões do Brasil
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Oferecemos suporte técnico remoto em todo o território brasileiro. 
                Não importa onde você esteja, nossa equipe está pronta para ajudar.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regions.map((region, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-3">
                    {region.icon}
                    <h3 className="text-lg font-semibold text-gray-900 ml-3">{region.name}</h3>
                  </div>
                  <p className="text-gray-600">{region.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Serviços Disponíveis na Sua Região
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Todos os nossos serviços estão disponíveis remotamente em qualquer região do Brasil.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-white rounded-lg p-6 hover:shadow-lg transition-all duration-300 text-center">
                  <div className="flex justify-center mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="text-[#31A8FF] font-semibold">{service.price}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Advantages Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#31A8FF] to-[#8B31FF]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Vantagens do Suporte Remoto na Sua Região
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Descubra por que o suporte remoto é a melhor opção para resolver 
                seus problemas de informática.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {advantages.map((advantage, index) => (
                <div key={index} className="bg-white rounded-lg p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-[#31A8FF] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{advantage}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Precisa de um técnico de informática na sua região?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Nossa equipe está pronta para atender você em qualquer lugar do Brasil, 
              com suporte remoto rápido e eficiente.
            </p>
            <Link 
              href="/servicos"
              className="bg-[#31A8FF] hover:bg-[#2B8FD9] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 inline-block"
            >
              Solicitar Atendimento Agora
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
} 
