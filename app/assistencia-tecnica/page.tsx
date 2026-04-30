import { Metadata } from 'next';
import Link from 'next/link';
import {
  Wrench,
  Shield,
  Clock,
  CheckCircle2,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  Download,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';


export const metadata: Metadata = {
  title: 'Assistência Técnica VOLTRIS | Reparo e Manutenção de Computadores',
  description: 'Assistência técnica especializada em computadores, notebooks e redes. Reparo de hardware, manutenção preventiva, instalação de sistemas e configuração avançada em todo o Brasil.',
  keywords: [
    'assistência técnica',
    'reparo de computador',
    'manutenção de pc',
    'tecnico informatica',
    'assistência notebook',
    'reparo hardware',
    'instalação windows',
    'configuração rede',
    'limpeza computador',
    'substituição peças',
    'manutenção preventiva',
    'suporte técnico hardware'
  ],
  openGraph: {
    title: 'Assistência Técnica VOLTRIS | Reparo e Manutenção Especializada',
    description: 'Serviços completos de assistência técnica para computadores e notebooks. Reparo, manutenção e configuração por especialistas.',
    url: 'https://voltris.com.br/assistencia-tecnica',
    siteName: 'VOLTRIS',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: 'https://voltris.com.br/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Assistência Técnica VOLTRIS - Reparo de Computadores',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Assistência Técnica VOLTRIS | Reparo e Manutenção',
    description: 'Serviços completos de assistência técnica especializada em computadores.',
    creator: '@voltris',
  },
  alternates: {
    canonical: 'https://voltris.com.br/assistencia-tecnica',
  },
};

export default function TechnicalSupportPage() {
  const services = [
    {
      icon: <HardDrive className="w-8 h-8 text-blue-500" />,
      title: "Reparo de Hardware",
      description: "Substituição de peças danificadas, upgrade e manutenção preventiva",
      includes: ["Troca de HD/SSD", "Substituição de memória", "Reparo de placa-mãe", "Troca de cooler"]
    },
    {
      icon: <Wrench className="w-8 h-8 text-green-500" />,
      title: "Manutenção Preventiva",
      description: "Limpeza, lubrificação e ajustes para prolongar a vida útil do equipamento",
      includes: ["Limpeza de cooler", "Substituição de pasta térmica", "Verificação de cabos", "Calibração de bateria"]
    },
    {
      icon: <Monitor className="w-8 h-8 text-purple-500" />,
      title: "Configuração e Instalação",
      description: "Instalação de sistemas operacionais, programas e configurações avançadas",
      includes: ["Instalação de Windows", "Configuração de drivers", "Instalação de programas", "Configuração de rede"]
    },
    {
      icon: <Wifi className="w-8 h-8 text-cyan-500" />,
      title: "Redes e Conectividade",
      description: "Configuração de redes Wi-Fi, cabeamento e resolução de problemas de conectividade",
      includes: ["Configuração de roteadores", "Redes Wi-Fi", "Problemas de conexão", "Compartilhamento de impressoras"]
    }
  ];

  const benefits = [
    {
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      title: "Técnicos Certificados",
      description: "Profissionais treinados e experientes em diferentes marcas e modelos"
    },
    {
      icon: <Clock className="w-8 h-8 text-green-500" />,
      title: "Atendimento Rápido",
      description: "Diagnóstico em até 24h e reparos realizados com agilidade"
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-purple-500" />,
      title: "Garantia de Qualidade",
      description: "Todos os serviços contam com garantia contra defeitos de execução"
    },
    {
      icon: <MapPin className="w-8 h-8 text-cyan-500" />,
      title: "Atendimento Local",
      description: "Atendimento em domicílio ou em nosso laboratório especializado"
    }
  ];

  const testimonials = [
    {
      name: "Fernanda Alves",
      role: "Cliente",
      text: "Excelente serviço! Meu notebook estava com problema de superaquecimento e resolveram rapidamente. Recomendo demais!",
      rating: 5,
      color: "from-[#FF4B6B] to-[#FF8F6B]"
    },
    {
      name: "Marcos Oliveira",
      role: "Cliente",
      text: "Precisei de assistência emergencial para meu desktop. Equipe super profissional e preço justo.",
      rating: 5,
      color: "from-[#8B31FF] to-[#B96BFF]"
    },
    {
      name: "Carla Santos",
      role: "Cliente",
      text: "Fiz a manutenção preventiva do meu computador e ele voltou a funcionar como novo. Excelente trabalho!",
      rating: 5,
      color: "from-[#31A8FF] to-[#6BA8FF]"
    }
  ];

  return (
    <>
      <Header />
      <JsonLd
        type="Service"
        data={{
          name: "Assistência Técnica de Informática e Suporte Remoto",
          description: "Manutenção de computadores, reparo de hardware e suporte técnico remoto 24h para hardware e software em todo o Brasil.",
          provider: {
            "@type": "Organization",
            "name": "VOLTRIS",
            "url": "https://voltris.com.br"
          },
          serviceType: "Suporte Técnico",
          areaServed: { "@type": "Country", "name": "Brasil" },
          offers: {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "BRL",
            "description": "Orçamento Gratuito"
          }
        }}
      />
      <JsonLd
        type="FAQPage"
        data={{
          mainEntity: [
            {
              "@type": "Question",
              "name": "Como funciona a assistência técnica remota?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Através de softwares seguros de acesso remoto, nossos técnicos resolvem problemas de software, vírus e lentidão sem você sair de casa."
              }
            },
            {
              "@type": "Question",
              "name": "Vocês consertam hardware de notebook?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sim, possuímos laboratório avançado para reparos em placas-mãe, troca de telas e componentes de hardware em geral."
              }
            }
          ]
        }}
      />
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 px-4">
          {/* Background Ambience */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-0"></div>
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-purple-200/30 blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-200/30 blur-[100px] mix-blend-screen" />

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 border border-blue-200 backdrop-blur-md mb-4">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]"></span>
                  <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text tracking-wide">Assistência Técnica Especializada</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight font-sans mb-6">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">Assistência Técnica de Informática</span> <br className="hidden lg:block" />
                  <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl text-gray-700">Suporte Remoto e Presencial em Todo Brasil</span>
                </h1>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Serviço especializado em reparo, manutenção e suporte técnico de computadores.
                  Atendimento remoto instantâneo para todo o Brasil e presencial com técnicos certificados.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    href="https://wa.me/5511996716235"
                    className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-gray-900 transition-all duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-sm"
                  >
                    <span className="mr-2">Abrir Chamado</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="https://wa.me/5511996716235"
                    className="inline-flex items-center justify-center px-8 py-4 font-semibold text-gray-900 transition-all duration-200 bg-emerald-500 rounded-lg hover:bg-emerald-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    <MessageCircle className="mr-2" size={20} />
                    Falar no WhatsApp
                  </Link>
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-500" size={20} />
                    <span>Orçamento Grátis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-500" size={20} />
                    <span>Peças Originais</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-500" size={20} />
                    <span>Garantia de 3 meses</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white backdrop-blur-xl rounded-3xl p-6 border border-gray-200 shadow-lg">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                        <Wrench className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Assistência Técnica</h3>
                      <p className="text-gray-600 text-sm">Reparo e manutenção de computadores</p>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Clock className="text-blue-600" size={24} />
                      <div>
                        <p className="font-bold text-gray-900">Atendimento</p>
                        <p className="text-sm text-gray-500">24/7</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="text-emerald-500" size={24} />
                      <div>
                        <p className="font-bold text-gray-900">Garantia</p>
                        <p className="text-sm text-gray-500">3 meses</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">1000+</div>
                <p className="text-gray-600">Reparos Realizados</p>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 text-transparent bg-clip-text">99%</div>
                <p className="text-gray-600">Taxa de Sucesso</p>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-pink-600 to-purple-600 text-transparent bg-clip-text">7+</div>
                <p className="text-gray-600">Anos de Experiência</p>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-blue-600 to-purple-600 text-transparent bg-clip-text">24h</div>
                <p className="text-gray-600">Prazo Diagnóstico</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 bg-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="text-xs font-bold text-blue-600 tracking-widest uppercase">Por que escolher nossa assistência?</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                Benefícios exclusivos que <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">fazem a diferença</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                O que nos diferencia no mercado de assistência técnica
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="group relative bg-white backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  <div className="relative z-10 text-center">
                    <div className="mx-auto mb-6">
                      <div className="w-16 h-16 rounded-xl bg-gray-100 backdrop-blur-sm border border-gray-200 flex items-center justify-center mx-auto group-hover:bg-blue-100 group-hover:border-blue-200 transition-all duration-300 shadow-sm">
                        <div className="transform transition-transform duration-300 group-hover:scale-110 text-blue-600">
                          {benefit.icon}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all text-gray-900">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-white px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                Nossos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Serviços</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Soluções completas para seu computador
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {services.map((service, index) => (
                <div key={index} className="group relative bg-gray-50 border border-gray-200 hover:border-purple-300 rounded-3xl p-1 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  <div className="relative h-full bg-white rounded-[20px] p-8 flex flex-col items-start overflow-hidden">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 backdrop-blur-sm border border-gray-200 flex items-center justify-center group-hover:bg-blue-100 group-hover:border-blue-200 transition-all duration-300 shadow-sm">
                          <div className="transform transition-transform duration-300 group-hover:scale-110 text-blue-600">
                            {service.icon}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all text-gray-900">{service.title}</h3>
                        <p className="text-gray-600 mb-4">{service.description}</p>

                        <ul className="space-y-2">
                          {service.includes.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle2 className="text-emerald-500" size={16} />
                              <span className="text-sm text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 px-4 bg-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                Como <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Funciona</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Um processo simples e transparente para seu reparo
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: 1,
                  title: "Agendamento",
                  description: "Entre em contato e agende seu atendimento"
                },
                {
                  step: 2,
                  title: "Diagnóstico",
                  description: "Analisamos seu equipamento para identificar o problema"
                },
                {
                  step: 3,
                  title: "Orçamento",
                  description: "Apresentamos o orçamento sem compromisso"
                },
                {
                  step: 4,
                  title: "Reparo",
                  description: "Realizamos o reparo com garantia e qualidade"
                }
              ].map((item, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4 text-white group-hover:scale-110 transition-transform duration-300 shadow-md">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                O Que Nossos Clientes <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Dizem</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Histórias reais de satisfação
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="group relative bg-gray-50 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:border-gray-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent group-hover:via-gray-300 transition-all"></div>

                  <div className="flex items-center gap-1 mb-6 text-yellow-500">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-gray-600 mb-8 relative z-10 italic">"{testimonial.text}"</p>

                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{testimonial.name}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Services */}
        <section className="py-20 bg-gray-50 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                Serviços <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Relacionados</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Combine com outros serviços para resultados ainda melhores
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              <Link href="/formatar-windows" className="group relative bg-white border border-gray-200 hover:border-purple-300 rounded-3xl p-1 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="relative h-full bg-gray-50 rounded-[20px] p-8 flex flex-col items-start overflow-hidden">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 backdrop-blur-sm border border-gray-200 flex items-center justify-center mb-8 group-hover:bg-blue-100 group-hover:border-blue-200 transition-all duration-300 shadow-sm">
                    <div className="transform transition-transform duration-300 group-hover:scale-110 text-blue-600">
                      <Download className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all">Formatação de Windows</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    Instalação limpa e configurações otimizadas
                  </p>
                  <div className="mt-auto w-full pt-6 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-blue-600 text-sm font-medium">Saiba mais</span>
                    <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-900 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/otimizacao-pc" className="group relative bg-white border border-gray-200 hover:border-purple-300 rounded-3xl p-1 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="relative h-full bg-gray-50 rounded-[20px] p-8 flex flex-col items-start overflow-hidden">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 backdrop-blur-sm border border-gray-200 flex items-center justify-center mb-8 group-hover:bg-blue-100 group-hover:border-blue-200 transition-all duration-300 shadow-sm">
                    <div className="transform transition-transform duration-300 group-hover:scale-110 text-yellow-500">
                      <div className="w-8 h-8 text-yellow-500">⚡</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all">Otimização de PC</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    Aumente FPS em jogos e velocidade do sistema
                  </p>
                  <div className="mt-auto w-full pt-6 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-blue-600 text-sm font-medium">Saiba mais</span>
                    <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-900 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/voltris-optimizer" className="group relative bg-white border border-gray-200 hover:border-purple-300 rounded-3xl p-1 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="relative h-full bg-gray-50 rounded-[20px] p-8 flex flex-col items-start overflow-hidden">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 backdrop-blur-sm border border-gray-200 flex items-center justify-center mb-8 group-hover:bg-blue-100 group-hover:border-blue-200 transition-all duration-300 shadow-sm">
                    <div className="transform transition-transform duration-300 group-hover:scale-110 text-blue-600">
                      <Monitor className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all">Voltris Optimizer</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    Software de otimização contínua
                  </p>
                  <div className="mt-auto w-full pt-6 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-blue-600 text-sm font-medium">Saiba mais</span>
                    <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-900 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Precisa de assistência técnica?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Entre em contato agora e receba um diagnóstico gratuito
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://wa.me/5511996716235"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-gray-900 transition-all duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-sm"
              >
                <span className="mr-2">Abrir Chamado</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="tel:+5511996716235"
                className="inline-flex items-center justify-center px-8 py-4 font-semibold text-gray-900 transition-all duration-200 bg-emerald-500 rounded-lg hover:bg-emerald-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <Phone className="mr-2" size={20} />
                (11) 99671-6235
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}