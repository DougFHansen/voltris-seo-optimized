import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Como Otimizar a Performance do Seu PC | Guia Profissional | VOLTRIS',
  description: 'Descubra técnicas profissionais para acelerar seu computador, liberar espaço em disco, otimizar a inicialização e melhorar o desempenho geral do sistema. Guia completo passo a passo.',
  keywords: [
    'otimizar PC',
    'acelerar computador',
    'melhorar desempenho Windows',
    'otimização sistema',
    'como otimizar Windows',
    'acelerar inicialização Windows',
    'liberar espaço disco',
    'otimizar memória RAM',
    'limpar arquivos temporários',
    'otimizar registro Windows',
    'melhorar velocidade PC',
    'desfragmentar disco',
    'otimização performance',
    'técnicas otimização PC',
    'guia otimização computador'
  ],
  openGraph: {
    title: 'Como Otimizar a Performance do Seu PC | Guia Profissional | VOLTRIS',
    description: 'Técnicas profissionais para acelerar seu computador e melhorar significativamente o desempenho do sistema.',
    url: 'https://voltris.com.br/guias/otimizacao-performance',
    siteName: 'VOLTRIS',
    images: [
      {
        url: 'https://voltris.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'Guia de Otimização de Performance - VOLTRIS',
      },
    ],
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Como Otimizar a Performance do Seu PC | VOLTRIS',
    description: 'Técnicas profissionais para acelerar seu computador e melhorar o desempenho.',
    images: ['https://voltris.com.br/logo.png'],
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
  alternates: {
    canonical: 'https://voltris.com.br/guias/otimizacao-performance',
  },
};

