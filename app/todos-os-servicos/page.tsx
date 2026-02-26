'use client';

import Link from 'next/link';
import { 
  Wrench, 
  Zap, 
  Download, 
  Monitor, 
  MapPin, 
  Package, 
  Star, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';



export default function AllServicesPage() {
  const serviceCategories = [
    {
      icon: <Download className="w-12 h-12 text-blue-500" />,
      title: "Formatação de Windows",
      description: "Instalação limpa, drivers atualizados e configurações otimizadas",
      href: "/formatar-windows",
      cta: "Solicitar Formatação",
      color: "blue"
    },
    {
      icon: <Zap className="w-12 h-12 text-green-500" />,
      title: "Otimização de PC",
      description: "Aumente FPS em jogos, velocidade e desempenho do sistema",
      href: "/otimizacao-pc",
      cta: "Otimizar PC Agora",
      color: "green"
    },
    {
      icon: <Wrench className="w-12 h-12 text-purple-500" />,
      title: "Assistência Técnica",
      description: "Reparo de hardware, software e manutenção preventiva",
      href: "/assistencia-tecnica",
      cta: "Abrir Chamado",
      color: "purple"
    },
    {
      icon: <Monitor className="w-12 h-12 text-cyan-500" />,
      title: "Voltris Optimizer",
      description: "Software SaaS de otimização de PC com controle remoto",
      href: "/voltris-optimizer",
      cta: "Experimentar Grátis",
      color: "cyan"
    }
  ];

  const additionalServices = [
    {
      title: "Pacotes Combinados",
      description: "Economize com nossos pacotes de serviços integrados",
      href: "/servicos-combinados",
      icon: <Package className="w-8 h-8 text-yellow-500" />
    },
    {
      title: "Serviços em SP",
      description: "Atendimento local em toda a Grande São Paulo",
      href: "/servicos-sp",
      icon: <MapPin className="w-8 h-8 text-orange-500" />
    }
  ];

  const stats = [
    { number: "500+", label: "Computadores Formatados" },
    { number: "10k+", label: "Downloads do Software" },
    { number: "1000+", label: "Reparos Realizados" },
    { number: "98%", label: "Taxa de Satisfação" }
  ];

  const features = [
    "Técnicos certificados",
    "Garantia de qualidade",
    "Atendimento personalizado",
    "Peças originais",
    "Suporte pós-venda",
    "Orçamento transparente"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4">
        <div className="absolute inset-0 bg-[url('/background-grid.svg')] opacity-10"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-blue-500">Todos os Nossos</span><br />
              Serviços Técnicos
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Soluções completas para seu computador: formatação, otimização, assistência e software especializado. 
              Tudo que você precisa em um só lugar.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6">
                <div className="text-3xl font-bold text-blue-500 mb-2">{stat.number}</div>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Serviços Principais</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Soluções completas para seu computador
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {serviceCategories.map((service, index) => (
              <div 
                key={index} 
                className={`bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-${service.color}-500 transition-all`}
              >
                <div className="flex items-start gap-6">
                  <div className="mt-2">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                    <p className="text-gray-400 mb-6">{service.description}</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link 
                        href={service.href} 
                        className={`bg-${service.color}-600 hover:bg-${service.color}-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2`}
                      >
                        {service.cta}
                        <ArrowRight size={16} />
                      </Link>
                      <Link 
                        href={`${service.href}/orcamento`} 
                        className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        Solicitar Orçamento
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-gray-900 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Outros Serviços</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Soluções complementares para suas necessidades
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                    <p className="text-gray-400 mb-6">{service.description}</p>
                    
                    <Link 
                      href={service.href} 
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
                    >
                      Saiba Mais
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que escolher nossos serviços?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Diferenciais que fazem a diferença no resultado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl p-6 flex items-start gap-4">
                <CheckCircle2 className="text-green-500 mt-1" size={24} />
                <div>
                  <h3 className="text-xl font-bold">{feature}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#31A8FF]/20 via-[#8B31FF]/20 to-[#FF4B6B]/20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para transformar seu PC?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Escolha o serviço ideal para suas necessidades
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {serviceCategories.map((service, index) => (
              <Link 
                key={index}
                href={service.href} 
                className="bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] hover:from-[#8B31FF] hover:to-[#FF4B6B] text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center gap-2"
              >
                {service.cta}
                <ArrowRight size={16} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}