import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Otimização de Computador Profissional | VOLTRIS - Acelere Seu PC',
  description: 'Serviço profissional de otimização de computador para aumentar velocidade, desempenho e estabilidade do seu PC ou notebook. Técnicas avançadas de limpeza, configuração e ajustes finos.',
  keywords: [
    'otimização de computador',
    'acelerar pc',
    'desempenho do windows',
    'otimização de pc',
    'computador lento',
    'limpeza de sistema',
    'aumentar velocidade do pc',
    'otimizar windows',
    'desfragmentação de disco',
    'limpeza de registry',
    'ajustes de desempenho',
    'melhorar performance do pc',
    'otimização de sistema',
    'pc com mais desempenho',
    'otimização windows 10',
    'otimização windows 11'
  ],
  openGraph: {
    title: 'Otimização de Computador Profissional | VOLTRIS',
    description: 'Serviço profissional de otimização de computador para aumentar velocidade, desempenho e estabilidade do seu PC ou notebook.',
    url: 'https://voltris.com.br/otimizacao-computador',
    siteName: 'VOLTRIS',
    images: [
      {
        url: '/otimizacao-computador.jpg',
        width: 1200,
        height: 630,
        alt: 'Otimização de Computador Profissional VOLTRIS',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Otimização de Computador Profissional | VOLTRIS',
    description: 'Acelere seu PC com nosso serviço profissional de otimização de computador.',
    images: ['/otimizacao-computador.jpg'],
    creator: '@voltris',
  },
  alternates: {
    canonical: 'https://voltris.com.br/otimizacao-computador',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function OtimizacaoComputadorPage() {
  return (
    <div className="min-h-screen bg-[#050510] font-sans">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#31A8FF]/10 blur-[150px] rounded-full pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-[#8B31FF]/10 blur-[150px] rounded-full pointer-events-none animate-pulse-slow"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#31A8FF]/10 border border-[#31A8FF]/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#31A8FF] animate-pulse"></span>
              <span className="text-sm font-bold text-[#31A8FF] tracking-widest uppercase">Otimização Profissional</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">Otimização de Computador</span> <br />
              <span className="text-white">Profissional para Máxima Performance</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
              Técnicas avançadas de otimização para acelerar seu PC, aumentar desempenho e estabilidade. Eliminamos travamentos, lentidão e gargalos de performance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/adquirir-licenca"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-white/10 border border-white/10 rounded-lg hover:bg-white hover:text-black hover:border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 backdrop-blur-sm overflow-hidden"
              >
                <span className="mr-2">Adquirir Serviço de Otimização</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="https://wa.me/5511996716235?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20a%20otimiza%C3%A7%C3%A3o%20de%20computador"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 font-semibold text-[#050510] transition-all duration-200 bg-[#00FF94] rounded-lg hover:bg-[#00CC76] hover:shadow-[0_0_20px_rgba(0,255,148,0.4)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00FF94]"
              >
                <svg className="mr-2 text-lg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.387c-.3-.1-1.7-.8-1.9-1.4-.3-.5-.1-.8.2-1.1.3-.3.6-.7.9-1.1.3-.4.4-.5.6-.5.2 0 .4-.1.5-.4.1-.3 0-.8-.4-1.5-.5-.8-1.4-2.1-2.6-2.1-1.3 0-2.1.8-2.9 1.6-.8.8-1.3 1.3-2.5 1.3-.8 0-1.4-.4-1.9-.9-.5-.5-.7-.7-1.2-1.1 0 0-.4-.3-.6-.8-.2-.5-.6-1.5-.6-2.9 0-1.4.9-2.7 2.1-3.7 1.1-1 2.5-1.6 4.1-1.6 1.7 0 3.1.6 4.2 1.6 1 .9 1.6 2.1 1.6 3.5 0 1.4-.6 2.6-1.6 3.4zm-6.5-3.2c.2 1.1.8 2 1.6 2.6.9.6 2.1.9 3.2.9 1.1 0 2.3-.3 3.2-.9.8-.6 1.4-1.5 1.6-2.6.2-1.1-.1-2.3-.7-3.2-.6-.8-1.5-1.4-2.6-1.6-1.1-.2-2.3.1-3.2.7-.8.6-1.4 1.5-1.6 2.6z" />
                </svg>
                Falar com Especialista
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 relative z-10 bg-[#050510]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Benefícios da <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">Otimização Profissional</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Nossa abordagem técnica e profunda garante resultados reais e duradouros
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-[#31A8FF]/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#31A8FF]/10 flex items-center justify-center mb-6 text-[#31A8FF]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Aumento de Velocidade</h3>
              <p className="text-slate-400">
                Aceleramos seu computador em até 40% com técnicas avançadas de otimização de sistema.
              </p>
            </div>

            <div className="bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-[#8B31FF]/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#8B31FF]/10 flex items-center justify-center mb-6 text-[#8B31FF]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Estabilidade</h3>
              <p className="text-slate-400">
                Eliminamos travamentos, erros e instabilidades com configurações precisas.
              </p>
            </div>

            <div className="bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-[#FF4B6B]/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#FF4B6B]/10 flex items-center justify-center mb-6 text-[#FF4B6B]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Experiência do Usuário</h3>
              <p className="text-slate-400">
                Resposta imediata aos comandos, inicialização rápida e navegação fluida.
              </p>
            </div>

            <div className="bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-[#31A8FF]/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#31A8FF]/10 flex items-center justify-center mb-6 text-[#31A8FF]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Configurações Avançadas</h3>
              <p className="text-slate-400">
                Ajustes profundos no kernel, rede TCP/IP e gerenciamento de recursos.
              </p>
            </div>

            <div className="bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-[#8B31FF]/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#8B31FF]/10 flex items-center justify-center mb-6 text-[#8B31FF]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Manutenção Preventiva</h3>
              <p className="text-slate-400">
                Técnicas que previnem lentidão futura e mantêm o desempenho constante.
              </p>
            </div>

            <div className="bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-[#FF4B6B]/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#FF4B6B]/10 flex items-center justify-center mb-6 text-[#FF4B6B]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Resultados Garantidos</h3>
              <p className="text-slate-400">
                Medição objetiva de ganhos de performance antes e depois da otimização.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 relative z-10 bg-[#08080C]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Nosso Processo de <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">Otimização</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Técnicas avançadas aplicadas com precisão para resultados profissionais
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#31A8FF]/10 flex items-center justify-center text-[#31A8FF] font-bold">1</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Diagnóstico Completo</h3>
                  <p className="text-slate-400">
                    Análise detalhada do hardware, software e configurações atuais do sistema.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#8B31FF]/10 flex items-center justify-center text-[#8B31FF] font-bold">2</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Limpeza Profunda</h3>
                  <p className="text-slate-400">
                    Remoção de arquivos temporários, cache, registros inválidos e software desnecessário.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF4B6B]/10 flex items-center justify-center text-[#FF4B6B] font-bold">3</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Configurações Avançadas</h3>
                  <p className="text-slate-400">
                    Ajustes profundos no kernel do Windows, rede TCP/IP e gerenciamento de recursos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#31A8FF]/10 flex items-center justify-center text-[#31A8FF] font-bold">4</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Testes e Validação</h3>
                  <p className="text-slate-400">
                    Verificação de estabilidade, desempenho e medição objetiva dos ganhos obtidos.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1A1A2E] to-[#0A0A0F] rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Técnicas Especializadas</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-[#0F0F16] rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-[#31A8FF]"></div>
                  <span className="text-slate-300">Otimização de Kernel e Threads CPU</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#0F0F16] rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-[#8B31FF]"></div>
                  <span className="text-slate-300">Configuração de Rede TCP/IP</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#0F0F16] rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-[#FF4B6B]"></div>
                  <span className="text-slate-300">Ajustes de Desfragmentação Inteligente</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#0F0F16] rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-[#31A8FF]"></div>
                  <span className="text-slate-300">Gerenciamento de Serviços do Sistema</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#0F0F16] rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-[#8B31FF]"></div>
                  <span className="text-slate-300">Configuração de Planos de Energia</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#0F0F16] rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-[#FF4B6B]"></div>
                  <span className="text-slate-300">Ajustes de Latência DPC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10 bg-[#050510]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-[#1A1A2E] to-[#0A0A0F] rounded-3xl p-12 border border-white/10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto para <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">Acelerar seu Computador?</span>
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Nossa equipe de especialistas está pronta para aplicar técnicas avançadas de otimização em seu computador.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/adquirir-licenca"
                className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all"
              >
                Contratar Otimização Profissional
              </a>
              <a
                href="https://wa.me/5511996716235?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20a%20otimiza%C3%A7%C3%A3o%20de%20computador"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#00FF94] text-[#050510] font-bold rounded-xl hover:bg-[#00CC76] transition-all"
              >
                Falar com Especialista
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}