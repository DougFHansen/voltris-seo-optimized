import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Serviços de TI - Suporte Remoto & Criação de Sites | VOLTRIS',
  description: 'Suporte técnico remoto, formatação de PC, otimização do Windows e criação de sites. Serviços de TI especializados com atendimento rápido no Brasil.',
  keywords: 'suporte técnico remoto, formatação de computador, otimização Windows, assistência técnica informática, criação de sites, instalação de programas, TI Brasil, VOLTRIS',
  openGraph: {
    title: 'Serviços de TI - Suporte Remoto & Criação de Sites | VOLTRIS',
    description: 'Suporte técnico remoto, formatação de PC, otimização do Windows e criação de sites. Serviços de TI especializados no Brasil.',
    url: 'https://www.voltris.com.br/servicos',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'VOLTRIS',
    images: [
      {
        url: 'https://www.voltris.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'VOLTRIS Logo'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Serviços de TI - Suporte Remoto & Criação de Sites | VOLTRIS',
    description: 'Suporte técnico remoto, formatação de PC, otimização do Windows e criação de sites. Atendimento rápido no Brasil.',
    images: ['https://www.voltris.com.br/logo.png']
  },
  alternates: {
    canonical: 'https://www.voltris.com.br/servicos'
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
