import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Formatação de PC Remota Profissional | VOLTRIS - Limpeza Completa',
  description: 'Serviço profissional de formatação de PC remota com backup seguro, instalação limpa do Windows e programas essenciais. Atendimento em todo Brasil.',
  keywords: [
    'formatação de pc',
    'formatação remota',
    'limpeza de sistema',
    'instalação windows',
    'formatação pc',
    'backup seguro',
    'instalação programas',
    'formatação notebook',
    'restauração sistema',
    'limpeza profunda',
    'formatação windows',
    'instalação limpa',
    'recuperação sistema',
    'manutenção preventiva',
    'formatação computador',
    'backup dados'
  ],
  openGraph: {
    title: 'Formatação de PC Remota Profissional | VOLTRIS',
    description: 'Serviço profissional de formatação de PC remota com backup seguro, instalação limpa do Windows e programas essenciais.',
    url: 'https://voltris.com.br/formatacao-pc',
    siteName: 'VOLTRIS',
    images: [
      {
        url: '/formatacao-pc.jpg',
        width: 1200,
        height: 630,
        alt: 'Formatação de PC Remota Profissional VOLTRIS',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Formatação de PC Remota Profissional | VOLTRIS',
    description: 'Formatação remota com backup seguro e instalação limpa do Windows.',
    images: ['/formatacao-pc.jpg'],
    creator: '@voltris',
  },
  alternates: {
    canonical: 'https://voltris.com.br/formatacao-pc',
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

export default function FormatacaoPCPage() {
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
              <span className="text-sm font-bold text-[#31A8FF] tracking-widest uppercase">Formatação Profissional</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">Formatação de PC</span> <br />
              <span className="text-white">Remota com Backup Seguro</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
              Serviço profissional de formatação remota com backup seguro, instalação limpa do Windows e programas essenciais. Revitalize seu computador sem sair de casa.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/adquirir-licenca"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-white/10 border border-white/10 rounded-lg hover:bg-white hover:text-black hover:border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 backdrop-blur-sm overflow-hidden"
              >
                <span className="mr-2">Contratar Formatação</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="https://wa.me/5511996716235?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20a%20formata%C3%A7%C3%A3o%20de%20PC"
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

      {/* Process Section */}
      <section className="py-20 relative z-10 bg-[#050510]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Nosso Processo de <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">Formatação</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Procedimento completo e seguro para revitalizar seu computador
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#31A8FF]/10 flex items-center justify-center text-[#31A8FF] font-bold">1</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Backup Seguro</h3>
                  <p className="text-slate-400">
                    Cópia de segurança de todos seus arquivos importantes para armazenamento temporário seguro.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#8B31FF]/10 flex items-center justify-center text-[#8B31FF] font-bold">2</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Formatação Completa</h3>
                  <p className="text-slate-400">
                    Limpeza total do disco rígido com exclusão de todo conteúdo para garantir uma base limpa.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF4B6B]/10 flex items-center justify-center text-[#FF4B6B] font-bold">3</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Instalação Limpa do Windows</h3>
                  <p className="text-slate-400">
                    Instalação limpa e original do sistema operacional com as últimas atualizações.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#31A8FF]/10 flex items-center justify-center text-[#31A8FF] font-bold">4</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Instalação de Drivers</h3>
                  <p className="text-slate-400">
                    Configuração dos drivers mais recentes e compatíveis com seu hardware específico.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#8B31FF]/10 flex items-center justify-center text-[#8B31FF] font-bold">5</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Programas Essenciais</h3>
                  <p className="text-slate-400">
                    Instalação de softwares básicos e essenciais para uso diário, trabalho e lazer.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF4B6B]/10 flex items-center justify-center text-[#FF4B6B] font-bold">6</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Restauração de Dados</h3>
                  <p className="text-slate-400">
                    Devolução segura de todos seus arquivos pessoais para o computador reformulado.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1A1A2E] to-[#0A0A0F] rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Benefícios da Formatação</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-[#0F0F16] rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-[#31A8FF]"></div>
                  <span className="text-slate-300">Eliminação de vírus e malware</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#0F0F16] rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-[#8B31FF]"></div>
                  <span className="text-slate-300">Velocidade máxima do sistema</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#0F0F16] rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-[#FF4B6B]"></div>
                  <span className="text-slate-300">Estabilidade total</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#0F0F16] rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-[#31A8FF]"></div>
                  <span className="text-slate-300">Sistema limpo e otimizado</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#0F0F16] rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-[#8B31FF]"></div>
                  <span className="text-slate-300">Sem arquivos desnecessários</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#0F0F16] rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-[#FF4B6B]"></div>
                  <span className="text-slate-300">Travamentos eliminados</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 relative z-10 bg-[#08080C]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Segurança em <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">Primeiro Lugar</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Procedimentos rigorosos para proteger seus dados durante toda a formatação
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-[#31A8FF]/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#31A8FF]/10 flex items-center justify-center mb-6 text-[#31A8FF]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Backup Seguro</h3>
              <p className="text-slate-400">
                Cópia de segurança de todos seus arquivos importantes em local seguro antes da formatação.
              </p>
            </div>

            <div className="bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-[#8B31FF]/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#8B31FF]/10 flex items-center justify-center mb-6 text-[#8B31FF]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Criptografia</h3>
              <p className="text-slate-400">
                Proteção dos dados armazenados temporariamente com criptografia avançada.
              </p>
            </div>

            <div className="bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-[#FF4B6B]/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#FF4B6B]/10 flex items-center justify-center mb-6 text-[#FF4B6B]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Verificação</h3>
              <p className="text-slate-400">
                Verificação completa dos dados antes e após a restauração para garantir integridade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10 bg-[#050510]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-[#1A1A2E] to-[#0A0A0F] rounded-3xl p-12 border border-white/10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Revitalize Seu <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">Computador</span>
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Formatação profissional com backup seguro e restauração de dados garantida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/adquirir-licenca"
                className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all"
              >
                Contratar Formatação Profissional
              </a>
              <a
                href="https://wa.me/5511996716235?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20a%20formata%C3%A7%C3%A3o%20de%20PC"
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