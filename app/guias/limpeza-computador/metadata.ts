import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Limpeza Completa do Computador | Guia Profissional | VOLTRIS',
  description: 'Técnicas profissionais para limpar arquivos temporários, cache, programas desnecessários e otimizar o espaço em disco. Guia completo sobre limpeza de sistema, navegadores e programas.',
  keywords: [
    'limpeza computador',
    'limpar PC',
    'limpar arquivos temporários',
    'limpar cache',
    'limpeza Windows',
    'liberar espaço disco',
    'limpar navegador',
    'desinstalar programas',
    'limpar logs Windows',
    'limpeza sistema',
    'limpar cache Chrome',
    'limpar downloads',
    'limpeza profunda PC',
    'otimizar espaço disco',
    'limpar arquivos antigos',
    'limpeza completa sistema',
    'remover arquivos desnecessários',
    'limpar cache programas'
  ],
  openGraph: {
    title: 'Limpeza Completa do Computador | Guia Profissional | VOLTRIS',
    description: 'Técnicas profissionais para limpar arquivos temporários, cache e otimizar o espaço em disco do seu computador.',
    url: 'https://voltris.com.br/guias/limpeza-computador',
    siteName: 'VOLTRIS',
    images: [
      {
        url: 'https://voltris.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'Guia de Limpeza de Computador - VOLTRIS',
      },
    ],
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Limpeza Completa do Computador | VOLTRIS',
    description: 'Técnicas profissionais para limpar e otimizar seu computador.',
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
    canonical: 'https://voltris.com.br/guias/limpeza-computador',
  },
};

