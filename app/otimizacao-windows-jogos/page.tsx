import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const gameOptimizations = [
  {
    title: 'Valorant',
    url: '/otimizar-windows-11-para-valorant',
    description: 'Otimizações específicas para Valorant: reduzir input lag, aumentar FPS, configurações de rede',
    icon: '🎯'
  },
  {
    title: 'CS2 / Counter-Strike 2',
    url: '/otimizar-windows-para-counter-strike-2-cs2',
    description: 'Configurações competitivas para CS2: maximizar FPS, estabilidade de frame time, redução de stutter',
    icon: '🔫'
  },
  {
    title: 'Fortnite',
    url: '/otimizar-windows-para-fortnite-2026',
    description: 'Otimizações para Fortnite: modo performance, redução de input lag, melhorar streaming de texturas',
    icon: '🚀'
  },
  {
    title: 'Warzone',
    url: '/otimizar-windows-11-para-warzone-2026',
    description: 'Configurações para Warzone: aumentar FPS, reduzir lag, otimização de CPU para grandes mapas',
    icon: '⚔️'
  },
  {
    title: 'League of Legends',
    url: '/otimizar-windows-para-league-of-legends-2026',
    description: 'Otimizações para LoL: reduzir input lag, aumentar FPS, estabilidade em teamfights',
    icon: '🏆'
  },
  {
    title: 'Minecraft',
    url: '/otimizar-windows-para-minecraft-ultra-fps',
    description: 'Otimizações para Minecraft: aumentar FPS, reduzir lag, otimização para shaders',
    icon: '⛏️'
  },
  {
    title: 'GTA V RP',
    url: '/otimizar-windows-11-para-gta-v-rp',
    description: 'Configurações para GTA V RP: otimização de CPU, reduzir stutter, melhorar streaming',
    icon: '🚗'
  },
  {
    title: 'Streaming',
    url: '/otimizar-windows-para-streaming-twitch-youtube',
    description: 'Otimizações para streaming: OBS, encoder, distribuição de CPU/GPU',
    icon: '📺'
  },
  {
    title: 'Edição de Vídeo',
    url: '/otimizar-windows-para-edicao-de-video',
    description: 'Configurações para edição: Premiere, DaVinci, renderização acelerada',
    icon: '🎬'
  },
  {
    title: 'Photoshop',
    url: '/otimizar-windows-para-edicao-de-foto-photoshop',
    description: 'Otimizações para Photoshop: GPU acceleration, performance brushes',
    icon: '🖼️'
  },
  {
    title: 'Desenvolvimento',
    url: '/otimizar-windows-para-programacao-desenvolvimento',
    description: 'Configurações para devs: IDEs, Docker, compiladores',
    icon: '💻'
  },
  {
    title: 'Arquitetura BIM',
    url: '/otimizar-windows-para-architectura-bim-autocad',
    description: 'Otimizações para AutoCAD/BIM: GPU acceleration, renderização',
    icon: '🏗️'
  },
  {
    title: 'Ciência de Dados',
    url: '/otimizar-windows-para-estatistica-ciencia-dados',
    description: 'Configurações para data science: Python, R, Jupyter, GPU',
    icon: '📊'
  }
];

export default function OtimizacaoWindowsJogosPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-[#050510] to-gray-900 text-white pt-16">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 px-4">
          <div className="absolute inset-0 bg-[url('/background-grid.svg')] opacity-10"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">
                  Otimização de Windows para Jogos
                </span>
                <br />
                <span className="text-white">Guia Completo 2026</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Configurações profissionais de Windows para maximizar FPS, reduzir lag e melhorar desempenho em jogos.
                Guias específicos para cada título e caso de uso.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/voltrisoptimizer"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-green-500/20"
                >
                  Baixar Voltris Optimizer
                </Link>
                <Link
                  href="/servicos"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-blue-500/20"
                >
                  Serviços de Otimização
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Game Optimizations Grid */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">
              Otimizações por Jogo e Caso de Uso
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gameOptimizations.map((game, index) => (
                <Link
                  key={index}
                  href={game.url}
                  className="bg-gray-800/30 backdrop-blur rounded-2xl p-6 border border-gray-700/30 hover:border-[#8B31FF]/50 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl group-hover:scale-110 transition-transform">
                      {game.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#31A8FF] group-hover:via-[#8B31FF] group-hover:to-[#FF4B6B] transition-all">
                        {game.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3 group-hover:text-gray-300 transition-colors">
                        {game.description}
                      </p>
                      <span className="text-[#8B31FF] text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">
                        Ver guia →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-[#31A8FF]/10 via-[#8B31FF]/10 to-[#FF4B6B]/10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-transparent bg-clip-text">
              Precisa de Ajuda Profissional?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Nossa equipe pode otimizar seu PC remotamente com configurações personalizadas para seus jogos favoritos.
            </p>
            <Link
              href="/contato"
              className="bg-gradient-to-r from-[#8B31FF] to-[#FF4B6B] hover:from-[#9B41FF] hover:to-[#FF5B7B] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-[#8B31FF]/30 inline-block"
            >
              Falar com Especialista
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
