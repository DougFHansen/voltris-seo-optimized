import { Metadata } from 'next';
import GamersClient from './GamersClient';

export const metadata: Metadata = {
  title: 'Melhor Programa para Otimizar PC Gamer e Aumentar FPS [2025] | VOLTRIS',
  description: 'Otimize seu PC com o software líder para gamers. Aumente FPS, reduza input lag e elimine stutters. Alternativa superior a otimizadores tradicionais. Baixe agora.',
  keywords: [
    // Keywords Primárias (High Volume)
    'otimizar pc',
    'programa para otimizar pc',
    'otimizador de pc',
    'otimizar notebook',
    'aumentar fps',
    'limpeza de pc',
    'acelerar windows',
    'melhor otimizador de jogos',
    'game booster pc',
    'como deixar o pc mais rapido',

    // Keywords Secundárias/LSI (Semantic)
    'reduzir input lag',
    'eliminar stutter',
    'desfragmentação ssd',
    'limpeza de registro windows',
    'otimização de kernel',
    'process lasso alternative',
    'parar processos em segundo plano',
    'otimização nvidia',
    'otimização amd',
    'modo jogo windows',
    'overclock seguro',
    'monitoramento de hardware'
  ],
  alternates: {
    canonical: 'https://voltris.com.br/gamers',
  },
  openGraph: {
    title: 'Transforme seu PC em uma Máquina Gamer | VOLTRIS Optimizer',
    description: 'Aumente FPS em até 30% e reduza a latência. O software de otimização definitivo para jogadores competitivos.',
    url: 'https://voltris.com.br/gamers',
    type: 'website',
  },
};

export default function GamersPagina() {
  return <GamersClient />;
}
