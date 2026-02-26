'use client';

import Link from 'next/link';
import { 
  Zap, 
  Shield, 
  TrendingUp, 
  Download, 
  Star, 
  CheckCircle2, 
  Users, 
  Award, 
  Clock,
  Play,
  Cpu,
  Activity,
  Wifi,
  Wrench
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function VoltrisOptimizerPage() {
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-blue-500" />,
      title: "Aumento de FPS",
      description: "Aumente até 25% de FPS em jogos com otimizações específicas para cada título"
    },
    {
      icon: <Activity className="w-8 h-8 text-green-500" />,
      title: "Redução de Lag",
      description: "Elimine stutter e reduza input lag em até 40% para jogos competitivos"
    },
    {
      icon: <Cpu className="w-8 h-8 text-purple-500" />,
      title: "Otimização de CPU",
      description: "Gerenciamento avançado de threads e prioridades para melhor desempenho"
    },
    {
      icon: <Wifi className="w-8 h-8 text-cyan-500" />,
      title: "Otimização de Rede",
      description: "Reduza ping e melhore a conexão para jogos online e streaming"
    }
  ];

  const testimonials = [
    {
      name: "Rodrigo Santos",
      role: "Gamer Profissional",
      text: "Minha taxa de quadros aumentou em média 30 FPS após usar o Voltris Optimizer. Recomendo demais!",
      rating: 5
    },
    {
      name: "Mariana Oliveira",
      role: "Streamer",
      text: "Minha transmissão ficou muito mais estável e meu PC não trava mais durante lives longas.",
      rating: 5
    },
    {
      name: "Carlos Mendes",
      role: "Empresário",
      text: "Usei para otimizar os PCs da empresa e a produtividade aumentou consideravelmente.",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Grátis",
      price: "R$ 0",
      period: "",
      features: [
        "Otimização básica de sistema",
        "Aceleração de inicialização",
        "Limpeza de arquivos temporários",
        "Suporte por fórum"
      ],
      cta: "Começar Gratuitamente"
    },
    {
      name: "Pro",
      price: "R$ 29",
      period: "/mês",
      features: [
        "Todas as otimizações básicas",
        "Aumento de FPS em jogos",
        "Otimização de rede",
        "Redução de input lag",
        "Suporte prioritário",
        "Atualizações mensais"
      ],
      cta: "Assinar Pro",
      popular: true
    },
    {
      name: "Empresa",
      price: "R$ 99",
      period: "/mês",
      features: [
        "Todas as funcionalidades Pro",
        "Licença para até 10 PCs",
        "Controle remoto via web",
        "Relatórios de desempenho",
        "Suporte dedicado",
        "Configurações personalizadas"
      ],
      cta: "Falar com Vendas"
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-[#050510] to-gray-900 text-white pt-16">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 px-4">
          <div className="absolute inset-0 bg-[url('/background-grid.svg')] opacity-10"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">Software de Otimização de PC</span><br />
                  Aumente FPS e Performance
                </h1>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Voltris Optimizer: O primeiro software brasileiro SaaS de otimização de PC com controle remoto. 
                  Aumente FPS em jogos, otimize Windows e acelere seus computadores.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link 
                    href="/voltris-optimizer/trial" 
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-8 rounded-xl text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                  >
                    <Play className="w-5 h-5" />
                    Experimentar Grátis
                  </Link>
                  <Link 
                    href="/voltris-optimizer/comprar" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-center transition-all shadow-lg shadow-blue-500/20"
                  >
                    Assinar Pro
                  </Link>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-green-500" size={20} />
                    <span>14 dias grátis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-green-500" size={20} />
                    <span>Sem cartão</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-green-500" size={20} />
                    <span>Cancelamento fácil</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
                  <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] mb-4">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Dashboard Voltris Optimizer</h3>
                      <p className="text-gray-300 text-sm">Interface intuitiva para controle total do desempenho</p>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center text-center">
                      <TrendingUp className="text-green-500 mb-2" size={24} />
                      <p className="font-bold">+25% FPS</p>
                      <p className="text-xs text-gray-400">Média de aumento</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <Zap className="text-yellow-500 mb-2" size={24} />
                      <p className="font-bold">-40% Lag</p>
                      <p className="text-xs text-gray-400">Redução média</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <Clock className="text-blue-500 mb-2" size={24} />
                      <p className="font-bold">+60%</p>
                      <p className="text-xs text-gray-400">Velocidade</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-b from-gray-900/50 to-gray-900">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">10k+</div>
                <p className="text-gray-400">Downloads</p>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">98%</div>
                <p className="text-gray-400">Satisfação</p>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">100+</div>
                <p className="text-gray-400">Jogos Suportados</p>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">24/7</div>
                <p className="text-gray-400">Suporte</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">Por que escolher o Voltris Optimizer?</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Recursos exclusivos que fazem a diferença no desempenho do seu PC
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-800/30 backdrop-blur rounded-2xl p-6 text-center border border-gray-700/30 hover:border-[#8B31FF]/50 transition-all group">
                  <div className="mx-auto mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#31A8FF] group-hover:via-[#8B31FF] group-hover:to-[#FF4B6B] transition-all">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-900/50 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">Planos Acessíveis</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Escolha o plano que melhor atende às suas necessidades
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <div 
                  key={index} 
                  className={`bg-gray-800/30 backdrop-blur rounded-2xl p-8 border ${
                    plan.popular ? 'border-[#8B31FF] relative shadow-lg shadow-[#8B31FF]/20' : 'border-gray-700/50'
                  } hover:border-[#8B31FF]/70 transition-all group`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-[#8B31FF] to-[#FF4B6B] text-white px-4 py-1 rounded-full text-sm font-bold">
                        MAIS POPULAR
                      </span>
                    </div>
                  )}
                  
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#31A8FF] group-hover:via-[#8B31FF] group-hover:to-[#FF4B6B] transition-all">{plan.name}</h3>
                  <div className="text-4xl font-bold bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text mb-2">{plan.price}</div>
                  <div className="text-gray-400 mb-6">{plan.period}</div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <CheckCircle2 className="text-green-500" size={20} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      const message = `Olá, gostaria de ${plan.name === 'Grátis' ? 'experimentar' : 'assinar'} o plano ${encodeURIComponent(plan.name)}`;
                      window.open(`https://wa.me/5511996716235?text=${message}`, '_blank');
                    }}
                    className={`block w-full py-3 px-6 rounded-lg text-center font-bold transition-all ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-[#8B31FF] to-[#FF4B6B] hover:from-[#9B41FF] hover:to-[#FF5B7B] shadow-lg shadow-[#8B31FF]/30' 
                        : plan.name === 'Grátis'
                        ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-500/20'
                        : 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 border border-gray-600'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">O Que Nossos Usuários Dizem</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Resultados reais de quem já otimizou seu PC
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-800/30 backdrop-blur rounded-2xl p-6 border border-gray-700/30 hover:border-[#8B31FF]/50 transition-all group">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-500 fill-current" size={20} />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic group-hover:text-gray-200 transition-colors">"{testimonial.text}"</p>
                  <div>
                    <p className="font-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#31A8FF] group-hover:via-[#8B31FF] group-hover:to-[#FF4B6B] transition-all">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Services */}
        <section className="py-20 bg-gradient-to-b from-gray-900/50 to-gray-900 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">Serviços Relacionados</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Combine com outros serviços para resultados ainda melhores
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Link href="/formatar-windows" className="bg-gray-800/30 backdrop-blur rounded-2xl p-6 border border-gray-700/50 hover:border-[#8B31FF]/50 transition-all group">
                <div className="flex items-start gap-4">
                  <Download className="w-8 h-8 text-blue-500 mt-1 group-hover:text-[#31A8FF] transition-colors" />
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#31A8FF] group-hover:via-[#8B31FF] group-hover:to-[#FF4B6B] transition-all">Formatação de Windows</h3>
                    <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors">Instalação limpa e configurações otimizadas</p>
                    <span className="text-[#8B31FF] text-sm font-medium group-hover:translate-x-1 transition-transform">Saiba mais →</span>
                  </div>
                </div>
              </Link>

              <Link href="/otimizacao-pc" className="bg-gray-800/30 backdrop-blur rounded-2xl p-6 border border-gray-700/50 hover:border-[#8B31FF]/50 transition-all group">
                <div className="flex items-start gap-4">
                  <Zap className="w-8 h-8 text-green-500 mt-1 group-hover:text-[#8B31FF] transition-colors" />
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#31A8FF] group-hover:via-[#8B31FF] group-hover:to-[#FF4B6B] transition-all">Otimização de PC</h3>
                    <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors">Aumente FPS em jogos e velocidade do sistema</p>
                    <span className="text-[#8B31FF] text-sm font-medium group-hover:translate-x-1 transition-transform">Saiba mais →</span>
                  </div>
                </div>
              </Link>

              <Link href="/assistencia-tecnica" className="bg-gray-800/30 backdrop-blur rounded-2xl p-6 border border-gray-700/50 hover:border-[#8B31FF]/50 transition-all group">
                <div className="flex items-start gap-4">
                  <Wrench className="w-8 h-8 text-purple-500 mt-1 group-hover:text-[#FF4B6B] transition-colors" />
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#31A8FF] group-hover:via-[#8B31FF] group-hover:to-[#FF4B6B] transition-all">Assistência Técnica</h3>
                    <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors">Reparo de hardware e manutenção preventiva</p>
                    <span className="text-[#8B31FF] text-sm font-medium group-hover:translate-x-1 transition-transform">Saiba mais →</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-[#31A8FF]/10 via-[#8B31FF]/10 to-[#FF4B6B]/10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">Pronto para otimizar seu PC?</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Comece gratuitamente e veja os resultados imediatamente
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/voltris-optimizer/trial" 
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-8 rounded-xl text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
              >
                <Download className="w-5 h-5" />
                Baixar Grátis Agora
              </Link>
              <Link 
                href="/demo" 
                className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-bold py-4 px-8 rounded-xl text-center transition-all border border-gray-600"
              >
                Ver Demonstração
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
