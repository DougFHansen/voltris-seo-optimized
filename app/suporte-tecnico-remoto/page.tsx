import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Suporte Técnico Remoto Profissional | VOLTRIS - Assistência Técnica Online',
  description: 'Serviço de suporte técnico remoto especializado para Windows, resolução de problemas, formatação, otimização e manutenção de sistemas. Atendimento em todo Brasil.',
  keywords: [
    'suporte técnico remoto',
    'assistência técnica online',
    'suporte técnico windows',
    'resolução de problemas windows',
    'formatação remota',
    'manutenção de computador',
    'suporte remoto windows',
    'técnico de informática online',
    'correção de erros windows',
    'recuperação de dados',
    'instalação de programas',
    'remoção de vírus',
    'otimização de pc',
    'ajuste de desempenho',
    'suporte online',
    'atendimento técnico remoto'
  ],
  openGraph: {
    title: 'Suporte Técnico Remoto Profissional | VOLTRIS',
    description: 'Serviço de suporte técnico remoto especializado para Windows, resolução de problemas, formatação e manutenção de sistemas.',
    url: 'https://voltris.com.br/suporte-tecnico-remoto',
    siteName: 'VOLTRIS',
    images: [
      {
        url: '/suporte-tecnico-remoto.jpg',
        width: 1200,
        height: 630,
        alt: 'Suporte Técnico Remoto Profissional VOLTRIS',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Suporte Técnico Remoto Profissional | VOLTRIS',
    description: 'Assistência técnica remota especializada para Windows e problemas de sistema.',
    images: ['/suporte-tecnico-remoto.jpg'],
    creator: '@voltris',
  },
  alternates: {
    canonical: 'https://voltris.com.br/suporte-tecnico-remoto',
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

export default function SuporteTecnicoRemotoPage() {
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
              <span className="text-sm font-bold text-[#31A8FF] tracking-widest uppercase">Assistência Técnica Profissional</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">Suporte Técnico Remoto</span> <br />
              <span className="text-white">Especializado em Windows</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
              Resolução de problemas complexos, formatação remota, otimização e manutenção de sistemas Windows. Atendimento especializado sem que você precise sair de casa.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/adquirir-licenca"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-white/10 border border-white/10 rounded-lg hover:bg-white hover:text-black hover:border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 backdrop-blur-sm overflow-hidden"
              >
                <span className="mr-2">Contratar Suporte Técnico</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="https://wa.me/5511996716235?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20o%20suporte%20t%C3%A9cnico%20remoto"
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

      {/* Services Section */}
      <section className="py-20 relative z-10 bg-[#050510]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Nossos <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">Serviços de Suporte</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Soluções completas para todos os problemas do seu sistema Windows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-[#31A8FF]/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#31A8FF]/10 flex items-center justify-center mb-6 text-[#31A8FF]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Resolução de Problemas</h3>
              <p className="text-slate-400">
                Correção de erros de sistema, telas azuis, falhas de inicialização e problemas de desempenho.
              </p>
            </div>

            <div className="bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-[#8B31FF]/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#8B31FF]/10 flex items-center justify-center mb-6 text-[#8B31FF]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Formatação Remota</h3>
              <p className="text-slate-400">
                Formatação completa com backup seguro, instalação limpa do Windows e programas essenciais.
              </p>
            </div>

            <div className="bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-[#FF4B6B]/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#FF4B6B]/10 flex items-center justify-center mb-6 text-[#FF4B6B]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Otimização de PC</h3>
              <p className="text-slate-400">
                Aceleração remota para computadores lentos, melhorando desempenho e reduzindo travamentos.
              </p>
            </div>

            <div className="bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-[#31A8FF]/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#31A8FF]/10 flex items-center justify-center mb-6 text-[#31A8FF]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Remoção de Vírus</h3>
              <p className="text-slate-400">
                Remoção completa de vírus, malwares e ameaças com reforço de segurança do sistema.
              </p>
            </div>

            <div className="bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-[#8B31FF]/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#8B31FF]/10 flex items-center justify-center mb-6 text-[#8B31FF]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Recuperação de Dados</h3>
              <p className="text-slate-400">
                Recuperação remota de arquivos apagados, dados corrompidos e documentos importantes.
              </p>
            </div>

            <div className="bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-[#FF4B6B]/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#FF4B6B]/10 flex items-center justify-center mb-6 text-[#FF4B6B]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instalação de Programas</h3>
              <p className="text-slate-400">
                Instalação e configuração remota de programas essenciais para trabalho, estudo e uso pessoal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 relative z-10 bg-[#08080C]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Por Que Escolher Nosso <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">Suporte Técnico?</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Mais de 100.000 clientes atendidos com excelência e avaliação média de 8.9
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#31A8FF]/10 flex items-center justify-center text-[#31A8FF]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Especialistas em Windows</h3>
                  <p className="text-slate-400">
                    Equipe técnica especializada em soluções para sistemas Windows, com conhecimento avançado em otimização e segurança.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#8B31FF]/10 flex items-center justify-center text-[#8B31FF]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Atendimento Remoto Seguro</h3>
                  <p className="text-slate-400">
                    Conexão segura via controle remoto para diagnóstico e resolução de problemas sem que você saia de casa.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF4B6B]/10 flex items-center justify-center text-[#FF4B6B]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Soluções Personalizadas</h3>
                  <p className="text-slate-400">
                    Abordagem personalizada para cada tipo de problema, garantindo a solução mais eficaz para seu sistema.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#31A8FF]/10 flex items-center justify-center text-[#31A8FF]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Garantia de Resultado</h3>
                  <p className="text-slate-400">
                    Compromisso com qualidade e eficácia nas soluções, com acompanhamento pós-serviço para garantir estabilidade.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1A1A2E] to-[#0A0A0F] rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Estatísticas do Serviço</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-[#0F0F16] rounded-lg">
                  <span className="text-slate-300">Clientes Atendidos</span>
                  <span className="text-2xl font-bold text-[#31A8FF]">100.000+</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#0F0F16] rounded-lg">
                  <span className="text-slate-300">Avaliação Média</span>
                  <span className="text-2xl font-bold text-[#8B31FF]">8.9</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#0F0F16] rounded-lg">
                  <span className="text-slate-300">Tempo de Resposta</span>
                  <span className="text-2xl font-bold text-[#FF4B6B]">Imediato</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#0F0F16] rounded-lg">
                  <span className="text-slate-300">Taxa de Sucesso</span>
                  <span className="text-2xl font-bold text-[#31A8FF]">98%</span>
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
              Precisa de <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">Suporte Técnico?</span>
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Nossa equipe de especialistas está pronta para resolver qualquer problema do seu sistema Windows remotamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/adquirir-licenca"
                className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all"
              >
                Contratar Suporte Técnico
              </a>
              <a
                href="https://wa.me/5511996716235?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20o%20suporte%20t%C3%A9cnico%20remoto"
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