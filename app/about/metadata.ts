import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre a VOLTRIS | Quem Somos',
  description: 'Conheça a história, missão e valores da VOLTRIS. Especialistas em suporte técnico remoto, criação de sites e soluções digitais para todo o Brasil.',
  openGraph: {
    title: 'Sobre a VOLTRIS | Quem Somos',
    description: 'Conheça a história, missão e valores da VOLTRIS. Especialistas em suporte técnico remoto, criação de sites e soluções digitais para todo o Brasil.',
    url: 'https://voltris.com.br/about',
    type: 'website',
    images: [
      {
        url: 'https://voltris.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'Logo VOLTRIS'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sobre a VOLTRIS | Quem Somos',
    description: 'Conheça a história, missão e valores da VOLTRIS. Especialistas em suporte técnico remoto, criação de sites e soluções digitais para todo o Brasil.',
    images: ['https://voltris.com.br/logo.png']
  }
}; 