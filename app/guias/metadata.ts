import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guias Técnicos Completos de Suporte Windows - Aprenda com Especialistas | VOLTRIS',
  description: '✓ 30+ guias técnicos detalhados ✓ Passo a passo profissional ✓ Formatação, otimização, segurança e manutenção de Windows ✓ Conteúdo criado por especialistas certificados ✓ Atualizado 2025',
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
    'limpeza computador'
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

