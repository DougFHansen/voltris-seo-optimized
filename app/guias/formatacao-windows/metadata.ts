import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guia Completo de Formatação do Windows | Tutorial Passo a Passo | VOLTRIS',
  description: 'Aprenda como formatar seu computador Windows de forma segura e completa. Guia passo a passo com backup de dados, instalação limpa, drivers e configuração inicial. Tutorial profissional e detalhado.',
  keywords: [
    'formatação Windows',
    'como formatar computador',
    'formatar PC Windows',
    'instalação Windows limpa',
    'formatação completa Windows',
    'backup antes formatação',
    'instalar Windows do zero',
    'formatar notebook',
    'formatação remota',
    'tutorial formatação Windows',
    'guia formatação PC',
    'formatação Windows passo a passo',
    'reset Windows',
    'reinstalar Windows',
    'formatação segura Windows'
  ],
  openGraph: {
    title: 'Guia Completo de Formatação do Windows | Tutorial Passo a Passo | VOLTRIS',
    description: 'Aprenda como formatar seu computador Windows de forma segura e completa. Guia passo a passo profissional.',
    url: 'https://voltris.com.br/guias/formatacao-windows',
    siteName: 'VOLTRIS',
    images: [
      {
        url: 'https://voltris.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'Guia de Formatação do Windows - VOLTRIS',
      },
    ],
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guia Completo de Formatação do Windows | VOLTRIS',
    description: 'Aprenda como formatar seu computador Windows de forma segura. Tutorial passo a passo completo.',
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
    canonical: 'https://voltris.com.br/guias/formatacao-windows',
  },
  other: {
    'article:published_time': new Date().toISOString(),
    'article:author': 'VOLTRIS',
    'article:section': 'Guias e Tutoriais',
  },
};

