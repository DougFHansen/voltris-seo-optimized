import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guias Técnicos Windows 2026 | Suporte Profissional',
  description: '50+ guias técnicos de Windows: formatação, otimização, segurança e hardware. Passo a passo profissional atualizado 2026. Aprenda com especialistas.',
  keywords: [
    'guias suporte técnico',
    'tutoriais informática',
    'guia formatação Windows',
    'como otimizar PC',
    'guia segurança digital',
    'tutorial backup dados',
    'manutenção preventiva computador',
    'resolver erros Windows',
    'instalação drivers',
    'limpeza computador',
    'guia hardware',
    'dicas internet',
    'segurança wifi',
    'montagem pc gamer'
  ],
  openGraph: {
    title: 'Guias e Tutoriais de Suporte Técnico | VOLTRIS',
    description: 'Aprenda técnicas profissionais de suporte técnico, otimização e manutenção de computadores com nossos guias completos e detalhados.',
    url: 'https://voltris.com.br/guias',
    siteName: 'VOLTRIS',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Guias VOLTRIS',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guias e Tutoriais de Suporte Técnico | VOLTRIS',
    description: 'Aprenda técnicas profissionais de suporte técnico, otimização e manutenção de computadores com nossos guias completos.',
    images: ['/logo.png'],
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
    canonical: 'https://voltris.com.br/guias',
  },
};

