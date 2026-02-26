'use client';

import Link from 'next/link';
import { 
  MapPin, 
  Wrench, 
  Zap, 
  Monitor, 
  Download, 
  CheckCircle2, 
  Star, 
  Clock, 
  Shield, 
  Users 
} from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';

export default function TechServicesSPPage() {
  const services = [
    {
      icon: <Download className="w-8 h-8 text-blue-500" />,
      title: "Formatação de Windows",
      description: "Instalação limpa, drivers atualizados e configurações otimizadas",
      cities: ["São Paulo", "Guarulhos", "Campinas", "São Bernardo", "Santo André"],
      startingPrice: "R$ 120"
    },
    {
      icon: <Zap className="w-8 h-8 text-green-500" />,
      title: "Otimização de PC",
      description: "Aumente FPS em jogos, velocidade e desempenho do sistema",
      cities: ["São Paulo", "Osasco", "Santos", "Ribeirão Preto", "Sorocaba"],
      startingPrice: "R$ 150"
    },
    {
      icon: <Wrench className="w-8 h-8 text-purple-500" />,
      title: "Assistência Técnica",
      description: "Reparo de hardware, software e manutenção preventiva",
      cities: ["São Paulo", "São Caetano", "Mauá", "Diadema", "Barueri"],
      startingPrice: "R$ 100"
    },
    {
      icon: <Monitor className="w-8 h-8 text-cyan-500" />,
      title: "Software Voltris Optimizer",
      description: "Otimização automática com nosso software SaaS brasileiro",
      cities: ["Todo Estado", "Online", "Remoto", "Atendimento", "Suporte"],
      startingPrice: "R$ 29/mês"
    }
  ];

  const cities = [
    "São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santo André",
    "Osasco", "Sorocaba", "Ribeirão Preto", "Santos", "Mauá", "São José dos Campos",
    "Carapicuíba", "São Caetano do Sul", "Diadema", "Itaquaquecetuba", "Piracicaba",
    "Indaiatuba", "Barueri", "Suzano", "Mogi das Cruzes"
  ];

  const benefits = [
    {
      icon: <MapPin className="w-8 h-8 text-blue-500" />,
      title: "Atendimento Local",
      description: "Técnicos em toda a Grande São Paulo"
    },
    {
      icon: <Clock className="w-8 h-8 text-green-500" />,
      title: "Agendamento Flexível",
      description: "Horários que combinam com você"
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-500" />,
      title: "Técnicos Certificados",
      description: "Profissionais qualificados e experientes"
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-cyan-500" />,
      title: "Garantia de Qualidade",
      description: "Todos os serviços contam com garantia"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4">
        <div className="absolute inset-0 bg-[url('/background-grid.svg')] opacity-10"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-blue-500">Serviços Técnicos</span><br />
              em São Paulo
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Formatação de Windows, otimização de PC, assistência técnica e software de otimização. 
              Atendimento local na Grande São Paulo com técnicos certificados e garantia.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/contato" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-center transition-all"
            >
              Solicitar Serviço
            </Link>
            <Link 
              href="https://wa.me/5511996716235" 
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-center transition-all flex items-center justify-center gap-2"
            >
              <MapPin size={20} />
              Agendar em SP
            </Link>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-center">Atendemos em toda a Grande São Paulo</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {cities.slice(0, 15).map((city, index) => (
                <div key={index} className="text-center py-2 px-3 bg-gray-700 rounded-lg">
                  <MapPin className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                  <span className="text-sm">{city}</span>
                </div>
              ))}
            </div>
            <p className="text-center mt-4 text-gray-400">
              E mais {cities.length - 15} cidades no estado de São Paulo
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossos Serviços em SP</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Especializados em diferentes necessidades técnicas
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                    <p className="text-gray-400 mb-4">{service.description}</p>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-2">Áreas de atendimento:</p>
                      <div className="flex flex-wrap gap-2">
                        {service.cities.map((city, idx) => (
                          <span key={idx} className="bg-gray-700 text-blue-400 text-xs px-3 py-1 rounded-full">
                            {city}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-lg font-bold text-blue-500">A partir de {service.startingPrice}</p>
                    
                    <Link 
                      href={`/servicos-sp/${service.title.toLowerCase().replace(' ', '-')}`}
                      className="inline-block mt-4 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
                    >
                      Saiba Mais
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-900 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que escolher em SP?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Benefícios exclusivos do nosso atendimento local
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl p-6 text-center">
                <div className="mx-auto mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Area */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Área de Cobertura</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Atendemos em toda a região metropolitana e interior de SP
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {cities.map((city, index) => (
                <div key={index} className="flex items-center gap-2 p-3 hover:bg-gray-700 rounded-lg transition-all">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>{city}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#31A8FF]/20 via-[#8B31FF]/20 to-[#FF4B6B]/20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Precisa de serviços técnicos em SP?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Entre em contato agora e agende seu atendimento na sua cidade
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contato" 
              className="bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] hover:from-[#8B31FF] hover:to-[#FF4B6B] text-white font-bold py-4 px-8 rounded-xl text-center transition-all"
            >
              Solicitar Atendimento
            </Link>
            <Link 
              href="tel:+5511996716235" 
              className="bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#13803B] text-white font-bold py-4 px-8 rounded-xl text-center transition-all flex items-center justify-center gap-2"
            >
              <MapPin size={20} />
              (11) 99671-6235
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}