import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '[2025] Otimizador de Games Profissional - Aumente FPS e Elimine Lag | VOLTRIS',
  description: '✓ Aumente até 25% de FPS ✓ Elimine stutter e lag ✓ Otimização automática para 100+ jogos ✓ Redução de input lag em até 40% ✓ Setup instantâneo ✓ Otimizador de PC para games competitivos',
  keywords: [
    'otimizador de games',
    'aumentar fps em jogos',
    'eliminar lag em games',
    'otimização de pc para jogos',
    'melhorar performance em games',
    'reduzir stutter em jogos',
    'otimizador de sistema para gaming',
    'aumentar fps no pc',
    'eliminar input lag',
    'otimização de games competitivos',
    'setup para games',
    'performance em jogos online',
    'otimizador de hardware para games',
    'melhorar ping em jogos',
    'reduzir latência em games'
  ],
  authors: [{ name: "VOLTRIS" }],
  creator: "VOLTRIS",
  publisher: "VOLTRIS",
  metadataBase: new URL('https://voltris.com.br/gamers'),
  alternates: {
    canonical: '/gamers',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://voltris.com.br/gamers',
    siteName: 'VOLTRIS Gamers',
    title: '[2025] Otimizador de Games Profissional - Aumente FPS e Elimine Lag | VOLTRIS',
    description: 'Otimizador de PC profissional para gamers. Aumente FPS, elimine lag e stutter, reduza input lag em até 40%. Suporte para 100+ jogos com setup automático.',
    images: [
      {
        url: '/optimizer-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'VOLTRIS Optimizer - Otimizador de Games Profissional para Gamers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '[2025] Otimizador de Games Profissional - Aumente FPS e Elimine Lag | VOLTRIS',
    description: 'Aumente até 25% de FPS, elimine stutter e lag. Otimizador de PC para games competitivos com setup automático.',
    images: ['/optimizer-banner.jpg'],
    creator: '@voltris',
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