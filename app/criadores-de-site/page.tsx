import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { MonitorSmartphone, Laptop2, ShieldCheck, HardDrive, GaugeCircle, Database, Package, Printer, MapPin, Clock, Star, Users, CheckCircle, Globe, Code, Palette, Smartphone, Zap, Award, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: "Criadores de Site - Equipe Especializada em Desenvolvimento Web | VOLTRIS",
  description: "Criadores de site profissionais e especializados. Equipe experiente em desenvolvimento web, design responsivo e SEO. Sites que convertem visitantes em clientes com qualidade garantida.",
  keywords: [
    "criadores de site",
    "desenvolvedores web",
    "equipe criação sites",
    "profissionais web",
    "desenvolvimento sites",
    "programadores web",
    "designers web",
    "agência web",
    "estúdio web",
    "criadores site profissional",
    "desenvolvedor frontend",
    "designer UI/UX",
    "programador React",
    "desenvolvedor Next.js",
    "criador site WordPress",
    "equipe desenvolvimento",
    "profissionais tecnologia",
    "especialistas web",
    "criadores site responsivo",
    "desenvolvedores site SEO"
  ],
  openGraph: {
    title: "Criadores de Site - Equipe Especializada em Desenvolvimento Web | VOLTRIS",
    description: "Criadores de site profissionais e especializados. Equipe experiente em desenvolvimento web, design responsivo e SEO.",
    url: "https://voltris.com.br/criadores-de-site",
    type: "website",
    images: [
      {
        url: "/remotebanner.jpg",
        width: 1200,
        height: 630,
        alt: "Criadores de Site - Equipe Especializada VOLTRIS"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Criadores de Site - Equipe Especializada em Desenvolvimento Web | VOLTRIS",
    description: "Criadores de site profissionais e especializados. Equipe experiente em desenvolvimento web.",
    images: ["/remotebanner.jpg"]
  },
  alternates: {
    canonical: "https://voltris.com.br/criadores-de-site"
  }
};

const team = [
  {
    name: "Desenvolvedores Frontend",
    description: "Especialistas em React, Next.js e TypeScript",
    icon: <Code className="w-12 h-12 text-[#31A8FF]" />
  },
  {
    name: "Designers UI/UX",
    description: "Criação de interfaces modernas e intuitivas",
    icon: <Palette className="w-12 h-12 text-[#8B31FF]" />
  },
  {
    name: "Especialistas SEO",
    description: "Otimização para motores de busca",
    icon: <Target className="w-12 h-12 text-[#31A8FF]" />
  },
  {
    name: "Analistas de Performance",
    description: "Sites rápidos e otimizados",
    icon: <Zap className="w-12 h-12 text-[#8B31FF]" />
  }
];

const services = [
  {
    title: "Sites Institucionais",
    description: "Sites profissionais para empresas",
    price: "A partir de R$ 997,90",
    icon: <MonitorSmartphone className="w-8 h-8 text-[#31A8FF]" />
  },
  {
    title: "E-commerce",
    description: "Lojas virtuais completas",
    price: "A partir de R$ 2.997,90",
    icon: <Globe className="w-8 h-8 text-[#8B31FF]" />
  },
  {
    title: "Landing Pages",
    description: "Páginas de conversão otimizadas",
    price: "A partir de R$ 497,90",
    icon: <Target className="w-8 h-8 text-[#31A8FF]" />
  },
  {
    title: "Blogs Profissionais",
    description: "Blogs com SEO otimizado",
    price: "A partir de R$ 797,90",
    icon: <Code className="w-8 h-8 text-[#8B31FF]" />
  }
];

const expertise = [
  "React.js e Next.js",
  "TypeScript",
  "Tailwind CSS",
  "WordPress",
  "SEO Avançado",
  "Performance Web",
  "Design Responsivo",
  "E-commerce"
];

const benefits = [
  "Equipe experiente",
  "Projetos entregues no prazo",
  "Suporte pós-lançamento",
  "Código limpo e organizado",
  "Documentação completa",
  "Treinamento para cliente"
];

export default function CriadoresDeSitePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "VOLTRIS - Criadores de Site",
            "description": "Equipe especializada em criação de sites profissionais e desenvolvimento web",
            "url": "https://voltris.com.br",
            "logo": "https://voltris.com.br/logo.png",
            "employee": [
              {
                "@type": "Person",
                "jobTitle": "Desenvolvedor Frontend",
                "name": "Equipe VOLTRIS"
              },
              {
                "@type": "Person",
                "jobTitle": "Designer UI/UX",
                "name": "Equipe VOLTRIS"
              },
              {
                "@type": "Person",
                "jobTitle": "Especialista SEO",
                "name": "Equipe VOLTRIS"
              }
            ],
            "serviceArea": {
              "@type": "Country",
              "name": "Brasil"
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
                Criadores de <span className="text-[#31A8FF]">Site</span> Profissionais
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
                Equipe especializada em desenvolvimento web com anos de experiência. 
                Criamos sites profissionais, responsivos e otimizados para SEO 
                que convertem visitantes em clientes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link 
                  href="/todos-os-servicos/criacao-sites"
                  className="bg-[#31A8FF] hover:bg-[#2B8FD9] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                >
                  Solicitar Orçamento
                </Link>
                <Link 
                  href="/about"
                  className="border-2 border-[#31A8FF] text-[#31A8FF] hover:bg-[#31A8FF] hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
                >
                  Conhecer Equipe
                </Link>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#31A8FF] mb-2">5+</div>
                <div className="text-gray-600">Anos Experiência</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#31A8FF] mb-2">100+</div>
                <div className="text-gray-600">Projetos Entregues</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#31A8FF] mb-2">100%</div>
                <div className="text-gray-600">Satisfação</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#31A8FF] mb-2">24/7</div>
                <div className="text-gray-600">Suporte</div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nossa Equipe de Criadores de Site
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Profissionais especializados em diferentes áreas do desenvolvimento web, 
                trabalhando em conjunto para criar sites excepcionais.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-center mb-4">
                    {member.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{member.name}</h3>
                  <p className="text-gray-600">{member.description}</p>
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
                Serviços de Criação de Site
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Oferecemos uma ampla gama de serviços para atender todas as necessidades 
                de desenvolvimento web da sua empresa.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-white rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-4">
                    {service.icon}
                    <h3 className="text-xl font-semibold text-gray-900 ml-3">{service.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="text-[#31A8FF] font-semibold">{service.price}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Expertise Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nossas Especialidades
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Utilizamos as tecnologias mais modernas e eficientes para criar 
                sites de alta qualidade e performance.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {expertise.map((tech, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300">
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
                Por que escolher nossos criadores de site?
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Oferecemos vantagens exclusivas que garantem um projeto 
                de qualidade e sucesso para sua empresa.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-lg p-6 text-center">
                  <Award className="w-12 h-12 text-[#31A8FF] mx-auto mb-4" />
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
              Pronto para trabalhar com criadores de site profissionais?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Nossa equipe está pronta para transformar sua ideia em um site 
              profissional e eficiente que gere resultados.
            </p>
            <Link 
              href="/todos-os-servicos/criacao-sites"
              className="bg-[#31A8FF] hover:bg-[#2B8FD9] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 inline-block"
            >
              Iniciar Projeto
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
} 