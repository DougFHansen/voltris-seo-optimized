'use client';

import Link from 'next/link';
import { 
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

export default function CombinedServicesPage() {
  const packages = [
    {
      name: "Básico",
      price: "R$ 220",
      services: [
        "Formatação de Windows",
        "Instalação de programas essenciais",
        "Otimização básica do sistema",
        "Configurações iniciais"
      ],
      description: "Ideal para quem precisa de uma base sólida"
    },
    {
      name: "Premium",
      price: "R$ 350",
      services: [
        "Formatação de Windows completa",
        "Instalação de todos os programas",
        "Otimização avançada do sistema",
        "Configurações personalizadas",
        "Instalação do Voltris Optimizer"
      ],
      description: "Para desempenho máximo em jogos e produtividade",
      featured: true
    },
    {
      name: "Pro Gaming",
      price: "R$ 420",
      services: [
        "Formatação de Windows gamer",
        "Otimização para jogos",
        "Aumento de FPS garantido",
        "Configurações para streaming",
        "Instalação do Voltris Optimizer Pro"
      ],
      description: "O pacote completo para gamers e streamers"
    },
    {
      name: "Empresarial",
      price: "R$ 550",
      services: [
        "Formatação de Windows corporativo",
        "Otimização de segurança",
        "Configurações de rede empresarial",
        "Política de grupo",
        "Instalação do Voltris Optimizer Empresa"
      ],
      description: "Para empresas que precisam de desempenho e segurança"
    }
  ];

  const benefits = [
    {
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      title: "Garantia Combinada",
      description: "Todos os serviços com garantia estendida"
    },
    {
      icon: <Clock className="w-8 h-8 text-green-500" />,
      title: "Economia de Tempo",
      description: "Mesmo técnico faz todos os serviços"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      title: "Suporte Integrado",
      description: "Suporte único para todos os serviços contratados"
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-cyan-500" />,
      title: "Desconto Progressivo",
      description: "Quanto mais serviços, maior o desconto"
    }
  ];

  const testimonials = [
    {
      name: "Lucas Ferreira",
      role: "Empresário",
      text: "Contratei o pacote empresarial e a produtividade dos meus funcionários aumentou consideravelmente. Recomendo demais!",
      rating: 5
    },
    {
      name: "Juliana Silva",
      role: "Gamer Profissional",
      text: "O pacote Pro Gaming transformou meu setup. Agora jogo com 200+ FPS em todos os jogos!",
      rating: 5
    },
    {
      name: "Roberto Santos",
      role: "Autônomo",
      text: "Fiz o pacote Premium e meu computador voltou a funcionar como novo. Excelente trabalho!",
      rating: 5
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
              <span className="text-blue-500">Pacotes de Serviços</span><br />
              Técnicos Combinados
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Economize tempo e dinheiro com nossos pacotes combinados de formatação, otimização e assistência técnica.
              O melhor desempenho com o menor custo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/servicos-combinados/orcamento" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-center transition-all"
            >
              Solicitar Pacote
            </Link>
            <Link 
              href="/servicos" 
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-xl text-center transition-all"
            >
              Ver Serviços Individuais
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl p-6 text-center">
                <div className="mx-auto mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossos Pacotes Combinados</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Escolha o pacote que melhor atende às suas necessidades
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packages.map((pkg, index) => (
              <div 
                key={index} 
                className={`bg-gray-800 rounded-2xl p-8 border ${
                  pkg.featured ? 'border-blue-500 relative' : 'border-gray-700'
                }`}
              >
                {pkg.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      MAIS POPULAR
                    </span>
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <div className="text-4xl font-bold text-blue-500 mb-4">{pkg.price}</div>
                <p className="text-gray-400 mb-6">{pkg.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {pkg.services.map((service, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="text-green-500" size={20} />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const message = `Olá, gostaria de contratar o pacote ${encodeURIComponent(pkg.name)}`;
                    window.open(`https://wa.me/5511996716235?text=${message}`, '_blank');
                  }}
                  className={`block w-full py-3 px-6 rounded-lg text-center font-bold transition-all ${
                    pkg.featured 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  Contratar Pacote
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gray-900 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Serviços Incluídos</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Cada pacote combina os melhores serviços para seu PC
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <Wrench className="w-12 h-12 text-blue-500" />
                <h3 className="text-2xl font-bold">Assistência Técnica</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <span>Diagnóstico completo</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <span>Reparo de hardware</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <span>Configuração de rede</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <span>Manutenção preventiva</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <Monitor className="w-12 h-12 text-green-500" />
                <h3 className="text-2xl font-bold">Otimização de PC</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <span>Aumento de FPS em jogos</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <span>Otimização de sistema</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <span>Redução de input lag</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <span>Configurações avançadas</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <Download className="w-12 h-12 text-purple-500" />
                <h3 className="text-2xl font-bold">Formatação Windows</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <span>Instalação limpa do Windows</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <span>Drivers atualizados</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <span>Programas solicitados</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <span>Cópia de segurança</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">O Que Nossos Clientes Dizem</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Resultados reais com pacotes combinados
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-500 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
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
            Escolha um dos nossos pacotes combinados e economize tempo e dinheiro
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/servicos-combinados/orcamento" 
              className="bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] hover:from-[#8B31FF] hover:to-[#FF4B6B] text-white font-bold py-4 px-8 rounded-xl text-center transition-all"
            >
              Solicitar Pacote Agora
            </Link>
            <Link 
              href="https://wa.me/5511996716235" 
              className="bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#13803B] text-white font-bold py-4 px-8 rounded-xl text-center transition-all"
            >
              Falar com Especialista
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}