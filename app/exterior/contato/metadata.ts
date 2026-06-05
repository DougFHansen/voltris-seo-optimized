import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contato Internacional | Suporte Técnico Remoto Global | VOLTRIS',
  description: 'Entre em contato com a VOLTRIS para suporte técnico remoto internacional. Atendimento especializado em português para brasileiros no exterior. Disponível 24/7.',
  keywords: 'contato voltris exterior, suporte técnico internacional, atendimento português exterior, contato voltris global, VOLTRIS contato',
  openGraph: {
    title: 'Contato Internacional | Suporte Técnico Remoto Global | VOLTRIS',
    description: 'Entre em contato com a VOLTRIS para suporte técnico remoto internacional. Atendimento especializado em português para brasileiros no exterior.',
    url: 'https://www.voltris.com.br/exterior/contato',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'VOLTRIS',
    images: [
      {
        url: 'https://www.voltris.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'VOLTRIS - Contato Internacional'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contato Internacional | Suporte Técnico Remoto Global | VOLTRIS',
    description: 'Entre em contato com a VOLTRIS para suporte técnico remoto internacional. Atendimento em português 24/7.',
    images: ['https://www.voltris.com.br/logo.png'],
    creator: '@voltris'
  },
  alternates: {
    canonical: 'https://www.voltris.com.br/exterior/contato'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};
