import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog de Tecnologia, Dicas e Tutoriais | VOLTRIS',
  description: 'Conteúdo exclusivo sobre tecnologia, dicas de informática, tutoriais, novidades e tendências. Aprimore seu conhecimento com a VOLTRIS.',
  openGraph: {
    title: 'Blog de Tecnologia, Dicas e Tutoriais | VOLTRIS',
    description: 'Conteúdo exclusivo sobre tecnologia, dicas de informática, tutoriais, novidades e tendências. Aprimore seu conhecimento com a VOLTRIS.',
    url: 'https://voltris.com.br/blog',
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
    title: 'Blog de Tecnologia, Dicas e Tutoriais | VOLTRIS',
    description: 'Conteúdo exclusivo sobre tecnologia, dicas de informática, tutoriais, novidades e tendências. Aprimore seu conhecimento com a VOLTRIS.',
    images: ['https://voltris.com.br/logo.png']
  }
}; 