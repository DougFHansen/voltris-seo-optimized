import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Gamepad2, AlertTriangle, CheckCircle, Clock, Users, Shield } from 'lucide-react';
import AdSenseBanner from '../components/AdSenseBanner';

export const metadata: Metadata = {
  title: 'Correção de Erros em Jogos - GTA, CS2, Cyberpunk e Mais | VOLTRIS',
  description: 'Correção de erros em jogos populares como GTA, CS2, Cyberpunk 2077, Valorant, League of Legends e outros. Suporte técnico especializado em jogos. Atendimento remoto 24h.',
  keywords: [
    'erros GTA',
    'erros CS2',
    'erros Cyberpunk',
    'erros jogos',
    'erros GTA V',
    'erros GTA 6',
    'erros Counter-Strike 2',
    'erros Cyberpunk 2077',
    'erros Valorant',
    'erros League of Legends',
    'erros Fortnite',
    'erros Minecraft',
    'erros Call of Duty',
    'erros Battlefield',
    'erros FIFA',
    'erros PES',
    'erros eFootball',
    'erros Red Dead Redemption',
    'erros The Witcher',
    'erros Assassin\'s Creed',
    'erros Far Cry',
    'erros Watch Dogs',
    'erros Grand Theft Auto',
    'erros Rockstar Games',
    'erros Steam',
    'erros Epic Games',
    'erros Origin',
    'erros Uplay',
    'erros Battle.net',
    'erros GOG',
    'erros itch.io',
    'erros Humble Bundle',
    'erros Green Man Gaming',
    'erros Fanatical',
    'erros G2A',
    'erros Kinguin',
    'erros CDKeys',
    'erros Nuuvem',
    'erros GamersGate',
    'erros IndieGala',
    'erros Bundle Stars',
    'erros Mac Games Store',
    'erros App Store',
    'erros Google Play',
    'erros Microsoft Store',
    'erros Sony PlayStation Store',
    'erros Nintendo eShop',
    'erros Xbox Store',
    'erros Amazon Games',
    'erros GameStop',
    'erros Best Buy',
    'erros Walmart',
    'erros Target',
    'erros Carrefour',
    'erros Extra',
    'erros Casas Bahia',
    'erros Magazine Luiza',
    'erros Americanas',
    'erros Submarino',
    'erros Netshoes',
    'erros Kabum',
    'erros Terabyte',
    'erros Pichau',
    'erros Amazon Brasil',
    'erros Mercado Livre',
    'erros OLX',
    'erros Enjoei',
    'erros B2W Digital',
    'erros Via Varejo',
    'erros Lojas Americanas',
    'erros Ricardo Eletro',
    'erros Fast Shop',
    'erros Saraiva',
    'erros Livraria Cultura',
    'erros Fnac',
    'erros Kalunga',
    'erros Staples',
    'erros Office Depot',
    'erros Staples Brasil',
    'erros Kalunga',
    'erros Saraiva',
    'erros Livraria Cultura',
    'erros Fnac',
    'correção erros jogos',
    'correção erros GTA',
    'correção erros CS2',
    'correção erros Cyberpunk',
    'correção erros Valorant',
    'correção erros League of Legends',
    'correção erros Fortnite',
    'correção erros Minecraft',
    'correção erros Call of Duty',
    'correção erros Battlefield',
    'correção erros FIFA',
    'correção erros PES',
    'correção erros eFootball',
    'correção erros Red Dead Redemption',
    'correção erros The Witcher',
    'correção erros Assassin\'s Creed',
    'correção erros Far Cry',
    'correção erros Watch Dogs',
    'correção erros Grand Theft Auto',
    'correção erros Rockstar Games',
    'correção erros Steam',
    'correção erros Epic Games',
    'correção erros Origin',
    'correção erros Uplay',
    'correção erros Battle.net',
    'correção erros GOG',
    'correção erros itch.io',
    'correção erros Humble Bundle',
    'correção erros Green Man Gaming',
    'correção erros Fanatical',
    'correção erros G2A',
    'correção erros Kinguin',
    'correção erros CDKeys',
    'correção erros Nuuvem',
    'correção erros GamersGate',
    'correção erros IndieGala',
    'correção erros Bundle Stars',
    'correção erros Mac Games Store',
    'correção erros App Store',
    'correção erros Google Play',
    'correção erros Microsoft Store',
    'correção erros Sony PlayStation Store',
    'correção erros Nintendo eShop',
    'correção erros Xbox Store',
    'correção erros Amazon Games',
    'correção erros GameStop',
    'correção erros Best Buy',
    'correção erros Walmart',
    'correção erros Target',
    'correção erros Carrefour',
    'correção erros Extra',
    'correção erros Casas Bahia',
    'correção erros Magazine Luiza',
    'correção erros Americanas',
    'correção erros Submarino',
    'correção erros Netshoes',
    'correção erros Kabum',
    'correção erros Terabyte',
    'correção erros Pichau',
    'correção erros Amazon Brasil',
    'correção erros Mercado Livre',
    'correção erros OLX',
    'correção erros Enjoei',
    'correção erros B2W Digital',
    'correção erros Via Varejo',
    'correção erros Lojas Americanas',
    'correção erros Ricardo Eletro',
    'correção erros Fast Shop',
    'correção erros Saraiva',
    'correção erros Livraria Cultura',
    'correção erros Fnac',
    'correção erros Kalunga',
    'correção erros Staples',
    'correção erros Office Depot',
    'correção erros Staples Brasil',
    'correção erros Kalunga',
    'correção erros Saraiva',
    'correção erros Livraria Cultura',
    'correção erros Fnac',
    'solução erros jogos',
    'solução erros GTA',
    'solução erros CS2',
    'solução erros Cyberpunk',
    'solução erros Valorant',
    'solução erros League of Legends',
    'solução erros Fortnite',
    'solução erros Minecraft',
    'solução erros Call of Duty',
    'solução erros Battlefield',
    'solução erros FIFA',
    'solução erros PES',
    'solução erros eFootball',
    'solução erros Red Dead Redemption',
    'solução erros The Witcher',
    'solução erros Assassin\'s Creed',
    'solução erros Far Cry',
    'solução erros Watch Dogs',
    'solução erros Grand Theft Auto',
    'solução erros Rockstar Games',
    'solução erros Steam',
    'solução erros Epic Games',
    'solução erros Origin',
    'solução erros Uplay',
    'solução erros Battle.net',
    'solução erros GOG',
    'solução erros itch.io',
    'solução erros Humble Bundle',
    'solução erros Green Man Gaming',
    'solução erros Fanatical',
    'solução erros G2A',
    'solução erros Kinguin',
    'solução erros CDKeys',
    'solução erros Nuuvem',
    'solução erros GamersGate',
    'solução erros IndieGala',
    'solução erros Bundle Stars',
    'solução erros Mac Games Store',
    'solução erros App Store',
    'solução erros Google Play',
    'solução erros Microsoft Store',
    'solução erros Sony PlayStation Store',
    'solução erros Nintendo eShop',
    'solução erros Xbox Store',
    'solução erros Amazon Games',
    'solução erros GameStop',
    'solução erros Best Buy',
    'solução erros Walmart',
    'solução erros Target',
    'solução erros Carrefour',
    'solução erros Extra',
    'solução erros Casas Bahia',
    'solução erros Magazine Luiza',
    'solução erros Americanas',
    'solução erros Submarino',
    'solução erros Netshoes',
    'solução erros Kabum',
    'solução erros Terabyte',
    'solução erros Pichau',
    'solução erros Amazon Brasil',
    'solução erros Mercado Livre',
    'solução erros OLX',
    'solução erros Enjoei',
    'solução erros B2W Digital',
    'solução erros Via Varejo',
    'solução erros Lojas Americanas',
    'solução erros Ricardo Eletro',
    'solução erros Fast Shop',
    'solução erros Saraiva',
    'solução erros Livraria Cultura',
    'solução erros Fnac',
    'solução erros Kalunga',
    'solução erros Staples',
    'solução erros Office Depot',
    'solução erros Staples Brasil',
    'solução erros Kalunga',
    'solução erros Saraiva',
    'solução erros Livraria Cultura',
    'solução erros Fnac',
    'reparo jogos',
    'reparo GTA',
    'reparo CS2',
    'reparo Cyberpunk',
    'reparo Valorant',
    'reparo League of Legends',
    'reparo Fortnite',
    'reparo Minecraft',
    'reparo Call of Duty',
    'reparo Battlefield',
    'reparo FIFA',
    'reparo PES',
    'reparo eFootball',
    'reparo Red Dead Redemption',
    'reparo The Witcher',
    'reparo Assassin\'s Creed',
    'reparo Far Cry',
    'reparo Watch Dogs',
    'reparo Grand Theft Auto',
    'reparo Rockstar Games',
    'reparo Steam',
    'reparo Epic Games',
    'reparo Origin',
    'reparo Uplay',
    'reparo Battle.net',
    'reparo GOG',
    'reparo itch.io',
    'reparo Humble Bundle',
    'reparo Green Man Gaming',
    'reparo Fanatical',
    'reparo G2A',
    'reparo Kinguin',
    'reparo CDKeys',
    'reparo Nuuvem',
    'reparo GamersGate',
    'reparo IndieGala',
    'reparo Bundle Stars',
    'reparo Mac Games Store',
    'reparo App Store',
    'reparo Google Play',
    'reparo Microsoft Store',
    'reparo Sony PlayStation Store',
    'reparo Nintendo eShop',
    'reparo Xbox Store',
    'reparo Amazon Games',
    'reparo GameStop',
    'reparo Best Buy',
    'reparo Walmart',
    'reparo Target',
    'reparo Carrefour',
    'reparo Extra',
    'reparo Casas Bahia',
    'reparo Magazine Luiza',
    'reparo Americanas',
    'reparo Submarino',
    'reparo Netshoes',
    'reparo Kabum',
    'reparo Terabyte',
    'reparo Pichau',
    'reparo Amazon Brasil',
    'reparo Mercado Livre',
    'reparo OLX',
    'reparo Enjoei',
    'reparo B2W Digital',
    'reparo Via Varejo',
    'reparo Lojas Americanas',
    'reparo Ricardo Eletro',
    'reparo Fast Shop',
    'reparo Saraiva',
    'reparo Livraria Cultura',
    'reparo Fnac',
    'reparo Kalunga',
    'reparo Staples',
    'reparo Office Depot',
    'reparo Staples Brasil',
    'reparo Kalunga',
    'reparo Saraiva',
    'reparo Livraria Cultura',
    'reparo Fnac',
    'suporte jogos',
    'suporte GTA',
    'suporte CS2',
    'suporte Cyberpunk',
    'suporte Valorant',
    'suporte League of Legends',
    'suporte Fortnite',
    'suporte Minecraft',
    'suporte Call of Duty',
    'suporte Battlefield',
    'suporte FIFA',
    'suporte PES',
    'suporte eFootball',
    'suporte Red Dead Redemption',
    'suporte The Witcher',
    'suporte Assassin\'s Creed',
    'suporte Far Cry',
    'suporte Watch Dogs',
    'suporte Grand Theft Auto',
    'suporte Rockstar Games',
    'suporte Steam',
    'suporte Epic Games',
    'suporte Origin',
    'suporte Uplay',
    'suporte Battle.net',
    'suporte GOG',
    'suporte itch.io',
    'suporte Humble Bundle',
    'suporte Green Man Gaming',
    'suporte Fanatical',
    'suporte G2A',
    'suporte Kinguin',
    'suporte CDKeys',
    'suporte Nuuvem',
    'suporte GamersGate',
    'suporte IndieGala',
    'suporte Bundle Stars',
    'suporte Mac Games Store',
    'suporte App Store',
    'suporte Google Play',
    'suporte Microsoft Store',
    'suporte Sony PlayStation Store',
    'suporte Nintendo eShop',
    'suporte Xbox Store',
    'suporte Amazon Games',
    'suporte GameStop',
    'suporte Best Buy',
    'suporte Walmart',
    'suporte Target',
    'suporte Carrefour',
    'suporte Extra',
    'suporte Casas Bahia',
    'suporte Magazine Luiza',
    'suporte Americanas',
    'suporte Submarino',
    'suporte Netshoes',
    'suporte Kabum',
    'suporte Terabyte',
    'suporte Pichau',
    'suporte Amazon Brasil',
    'suporte Mercado Livre',
    'suporte OLX',
    'suporte Enjoei',
    'suporte B2W Digital',
    'suporte Via Varejo',
    'suporte Lojas Americanas',
    'suporte Ricardo Eletro',
    'suporte Fast Shop',
    'suporte Saraiva',
    'suporte Livraria Cultura',
    'suporte Fnac',
    'suporte Kalunga',
    'suporte Staples',
    'suporte Office Depot',
    'suporte Staples Brasil',
    'suporte Kalunga',
    'suporte Saraiva',
    'suporte Livraria Cultura',
    'suporte Fnac'
  ],
  openGraph: {
    title: 'Correção de Erros em Jogos - GTA, CS2, Cyberpunk e Mais | VOLTRIS',
    description: 'Correção de erros em jogos populares como GTA, CS2, Cyberpunk 2077, Valorant, League of Legends e outros. Suporte técnico especializado em jogos. Atendimento remoto 24h.',
    url: 'https://voltris.com.br/erros-jogos',
    type: 'website',
    images: [
      {
        url: '/remotebanner.jpg',
        width: 1200,
        height: 630,
        alt: 'Correção de Erros em Jogos - VOLTRIS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Correção de Erros em Jogos - GTA, CS2, Cyberpunk e Mais | VOLTRIS',
    description: 'Correção de erros em jogos populares como GTA, CS2, Cyberpunk 2077, Valorant, League of Legends e outros. Suporte técnico especializado em jogos.',
    images: ['/remotebanner.jpg'],
  },
  alternates: {
    canonical: '/erros-jogos',
  },
};

export default function ErrosJogosPage() {
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="bg-[#171313] min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/remotebanner.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
              Correção de Erros em Jogos
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Especialistas em correção de erros em jogos populares como GTA, CS2, Cyberpunk 2077, 
              Valorant, League of Legends e muito mais. Suporte técnico remoto especializado.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 bg-gradient-to-r from-[#FF4B6B]/20 to-[#8B31FF]/20 px-4 py-2 rounded-full border border-[#FF4B6B]/30">
                <CheckCircle className="w-5 h-5 text-[#FF4B6B]" />
                <span className="text-gray-300">Especialistas em Jogos</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-[#8B31FF]/20 to-[#31A8FF]/20 px-4 py-2 rounded-full border border-[#8B31FF]/30">
                <Shield className="w-5 h-5 text-[#8B31FF]" />
                <span className="text-gray-300">Solução Garantida</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-[#31A8FF]/20 to-[#FF4B6B]/20 px-4 py-2 rounded-full border border-[#31A8FF]/30">
                <Clock className="w-5 h-5 text-[#31A8FF]" />
                <span className="text-gray-300">Atendimento 24h</span>
              </div>
            </div>
            <Link 
              href="/servicos?abrir=correcao_windows"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              <Gamepad2 className="w-6 h-6" />
              Corrigir Erros Agora
            </Link>
          </div>
        </div>
      </section>

      {/* Jogos Suportados */}
      <section className="py-20 bg-[#1D1919]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
            Jogos que Corrigimos
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-[#232027] to-[#1D1919] p-6 rounded-xl text-center border border-[#FF4B6B]/20">
              <h3 className="text-xl font-semibold mb-4 text-white">GTA V / GTA 6</h3>
              <p className="text-gray-300 mb-4">
                Correção de erros de inicialização, crashes, problemas de performance e mods.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="bg-gradient-to-r from-[#FF4B6B]/20 to-[#8B31FF]/20 text-[#FF4B6B] px-2 py-1 rounded text-sm border border-[#FF4B6B]/30">Rockstar Games</span>
                <span className="bg-gradient-to-r from-[#8B31FF]/20 to-[#31A8FF]/20 text-[#8B31FF] px-2 py-1 rounded text-sm border border-[#8B31FF]/30">Open World</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#232027] to-[#1D1919] p-6 rounded-xl text-center border border-[#8B31FF]/20">
              <h3 className="text-xl font-semibold mb-4 text-white">Counter-Strike 2</h3>
              <p className="text-gray-300 mb-4">
                Solução de problemas de conectividade, VAC, performance e configurações.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="bg-gradient-to-r from-[#8B31FF]/20 to-[#31A8FF]/20 text-[#8B31FF] px-2 py-1 rounded text-sm border border-[#8B31FF]/30">Valve</span>
                <span className="bg-gradient-to-r from-[#31A8FF]/20 to-[#FF4B6B]/20 text-[#31A8FF] px-2 py-1 rounded text-sm border border-[#31A8FF]/30">FPS</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#232027] to-[#1D1919] p-6 rounded-xl text-center border border-[#31A8FF]/20">
              <h3 className="text-xl font-semibold mb-4 text-white">Cyberpunk 2077</h3>
              <p className="text-gray-300 mb-4">
                Correção de bugs, problemas de renderização, crashes e otimização.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="bg-gradient-to-r from-[#31A8FF]/20 to-[#FF4B6B]/20 text-[#31A8FF] px-2 py-1 rounded text-sm border border-[#31A8FF]/30">CD Projekt Red</span>
                <span className="bg-gradient-to-r from-[#FF4B6B]/20 to-[#8B31FF]/20 text-[#FF4B6B] px-2 py-1 rounded text-sm border border-[#FF4B6B]/30">RPG</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#232027] to-[#1D1919] p-6 rounded-xl text-center border border-[#FF4B6B]/20">
              <h3 className="text-xl font-semibold mb-4 text-white">Valorant</h3>
              <p className="text-gray-300 mb-4">
                Solução de problemas de Vanguard, conectividade e performance.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="bg-gradient-to-r from-[#FF4B6B]/20 to-[#8B31FF]/20 text-[#FF4B6B] px-2 py-1 rounded text-sm border border-[#FF4B6B]/30">Riot Games</span>
                <span className="bg-gradient-to-r from-[#8B31FF]/20 to-[#31A8FF]/20 text-[#8B31FF] px-2 py-1 rounded text-sm border border-[#8B31FF]/30">Tactical FPS</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#232027] to-[#1D1919] p-6 rounded-xl text-center border border-[#8B31FF]/20">
              <h3 className="text-xl font-semibold mb-4 text-white">League of Legends</h3>
              <p className="text-gray-300 mb-4">
                Correção de erros de cliente, problemas de login e performance.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="bg-gradient-to-r from-[#8B31FF]/20 to-[#31A8FF]/20 text-[#8B31FF] px-2 py-1 rounded text-sm border border-[#8B31FF]/30">Riot Games</span>
                <span className="bg-gradient-to-r from-[#31A8FF]/20 to-[#FF4B6B]/20 text-[#31A8FF] px-2 py-1 rounded text-sm border border-[#31A8FF]/30">MOBA</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#232027] to-[#1D1919] p-6 rounded-xl text-center border border-[#31A8FF]/20">
              <h3 className="text-xl font-semibold mb-4 text-white">Fortnite</h3>
              <p className="text-gray-300 mb-4">
                Solução de problemas de Epic Games Launcher e performance.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="bg-gradient-to-r from-[#31A8FF]/20 to-[#FF4B6B]/20 text-[#31A8FF] px-2 py-1 rounded text-sm border border-[#31A8FF]/30">Epic Games</span>
                <span className="bg-gradient-to-r from-[#FF4B6B]/20 to-[#8B31FF]/20 text-[#FF4B6B] px-2 py-1 rounded text-sm border border-[#FF4B6B]/30">Battle Royale</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de Erros */}
      <section className="py-20 bg-[#171313]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
            Tipos de Erros que Corrigimos
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-[#232027] to-[#1D1919] p-8 rounded-xl border border-[#FF4B6B]/20">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white text-center">Erros de Inicialização</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Jogo não abre</li>
                <li>• Tela preta</li>
                <li>• Crashes na inicialização</li>
                <li>• Erros de DLL</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#232027] to-[#1D1919] p-8 rounded-xl border border-[#8B31FF]/20">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] rounded-full flex items-center justify-center">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white text-center">Problemas de Performance</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• FPS baixo</li>
                <li>• Travamentos</li>
                <li>• Input lag</li>
                <li>• Stuttering</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#232027] to-[#1D1919] p-8 rounded-xl border border-[#31A8FF]/20">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-[#31A8FF] to-[#FF4B6B] rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white text-center">Problemas de Conectividade</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Erros de VAC</li>
                <li>• Problemas de rede</li>
                <li>• Desconexões</li>
                <li>• Ping alto</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#232027] to-[#1D1919] p-8 rounded-xl border border-[#FF4B6B]/20">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white text-center">Problemas de Conta</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Login não funciona</li>
                <li>• Problemas de autenticação</li>
                <li>• Conta bloqueada</li>
                <li>• Recuperação de senha</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#232027] to-[#1D1919] p-8 rounded-xl border border-[#8B31FF]/20">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white text-center">Problemas de Atualização</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Atualizações travadas</li>
                <li>• Downloads corrompidos</li>
                <li>• Verificação de arquivos</li>
                <li>• Reinstalação</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#232027] to-[#1D1919] p-8 rounded-xl border border-[#31A8FF]/20">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-[#31A8FF] to-[#FF4B6B] rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white text-center">Configurações</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Otimização de gráficos</li>
                <li>• Configuração de controles</li>
                <li>• Ajustes de áudio</li>
                <li>• Configuração de rede</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Processo */}
      <section className="py-20 bg-[#1D1919]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
            Como Funciona Nossa Correção
          </h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] rounded-full flex items-center justify-center text-2xl font-bold text-white">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Diagnóstico</h3>
              <p className="text-gray-300">
                Analisamos o problema específico do seu jogo e identificamos a causa raiz.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] rounded-full flex items-center justify-center text-2xl font-bold text-white">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Solução</h3>
              <p className="text-gray-300">
                Aplicamos a solução mais adequada para resolver o problema.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-[#31A8FF] to-[#FF4B6B] rounded-full flex items-center justify-center text-2xl font-bold text-white">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Teste</h3>
              <p className="text-gray-300">
                Testamos se o problema foi resolvido e o jogo está funcionando corretamente.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] rounded-full flex items-center justify-center text-2xl font-bold text-white">
                4
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Garantia</h3>
              <p className="text-gray-300">
                Oferecemos garantia de 30 dias para nossa correção.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Pronto para jogar sem problemas?
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Entre em contato agora e resolva os erros do seu jogo favorito!
          </p>
          <Link 
            href="/servicos?abrir=correcao_windows"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
          >
            <Gamepad2 className="w-6 h-6" />
            Corrigir Erros Agora
          </Link>
        </div>
      </section>

      <AdSenseBanner />
      <Footer />
      
      {/* Schema.org structured data for game error correction service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Correção de Erros em Jogos",
            "description": "Correção de erros em jogos populares como GTA, CS2, Cyberpunk 2077, Valorant, League of Legends e outros. Suporte técnico especializado em jogos.",
            "provider": {
              "@type": "Organization",
              "name": "VOLTRIS",
              "url": "https://voltris.com.br",
              "logo": "https://voltris.com.br/logo.png"
            },
            "areaServed": {
              "@type": "Country",
              "name": "Brasil"
            },
            "serviceType": "Correção de Erros em Jogos",
            "category": "Suporte Técnico para Jogos",
            "offers": [
              {
                "@type": "Offer",
                "name": "Correção de Erros Básica",
                "price": "49.90",
                "priceCurrency": "BRL",
                "description": "Correção de erros simples em jogos"
              },
              {
                "@type": "Offer",
                "name": "Correção de Erros Avançada",
                "price": "99.90",
                "priceCurrency": "BRL",
                "description": "Correção de erros complexos e otimização de performance"
              }
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Serviços de Correção de Jogos",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Correção GTA"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Correção CS2"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Correção Cyberpunk"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Correção Valorant"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Correção League of Legends"
                  }
                }
              ]
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "89"
            },
            "review": [
              {
                "@type": "Review",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5"
                },
                "author": {
                  "@type": "Person",
                  "name": "Carlos Santos"
                },
                "reviewBody": "Resolveu meu problema com GTA V em minutos! Muito profissional."
              }
            ]
          })
        }}
      />
    </>
  );
} 