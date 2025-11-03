import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Como Fazer Backup dos Seus Dados | Guia Completo de Backup | VOLTRIS',
  description: 'Aprenda métodos eficazes para fazer backup completo dos seus arquivos importantes. Guia completo sobre backup em nuvem, HD externo, métodos automatizados e estratégia 3-2-1.',
  keywords: [
    'fazer backup',
    'backup dados',
    'backup computador',
    'backup arquivos',
    'backup nuvem',
    'backup HD externo',
    'backup automático',
    'como fazer backup',
    'backup Windows',
    'backup fotos',
    'backup documentos',
    'estrategia backup',
    'backup segurança',
    'restaurar backup',
    'backup online',
    'sincronização nuvem',
    'backup completo',
    'proteção dados'
  ],
  openGraph: {
    title: 'Como Fazer Backup dos Seus Dados | Guia Completo de Backup | VOLTRIS',
    description: 'Aprenda métodos eficazes para fazer backup completo dos seus arquivos importantes. Guia completo passo a passo.',
    url: 'https://voltris.com.br/guias/backup-dados',
    siteName: 'VOLTRIS',
    images: [
      {
        url: 'https://voltris.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'Guia de Backup de Dados - VOLTRIS',
      },
    ],
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Como Fazer Backup dos Seus Dados | VOLTRIS',
    description: 'Aprenda métodos eficazes para fazer backup completo dos seus arquivos importantes.',
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
    canonical: 'https://voltris.com.br/guias/backup-dados',
  },
};

