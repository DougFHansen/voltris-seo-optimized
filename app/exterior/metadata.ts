import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Serviços Internacionais | Suporte Técnico Remoto Global | VOLTRIS',
  description: 'Suporte técnico remoto especializado para brasileiros no exterior. Formatação, otimização de PC e criação de sites com atendimento em português 24/7. Atendimento global.',
  keywords: 'suporte técnico remoto internacional, formatação pc exterior, otimização computador global, TI brasileiros exterior, suporte em português, VOLTRIS global',
  openGraph: {
    title: 'Serviços Internacionais | Suporte Técnico Remoto Global | VOLTRIS',
    description: 'Suporte técnico remoto especializado para brasileiros no exterior. Formatação, otimização e criação de sites com atendimento em português 24/7.',
    url: 'https://www.voltris.com.br/exterior',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'VOLTRIS',
    images: [
      {
        url: 'https://www.voltris.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'VOLTRIS - Serviços Internacionais'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Serviços Internacionais | Suporte Técnico Remoto Global | VOLTRIS',
    description: 'Suporte técnico remoto especializado para brasileiros no exterior. Atendimento em português 24/7.',
    images: ['https://www.voltris.com.br/logo.png'],
    creator: '@voltris'
  },
  alternates: {
    canonical: 'https://www.voltris.com.br/exterior'
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
