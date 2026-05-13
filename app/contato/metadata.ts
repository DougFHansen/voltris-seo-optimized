import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contato | Fale Conosco | VOLTRIS',
  description: 'Entre em contato com a VOLTRIS. Suporte técnico remoto, criação de sites e soluções em tecnologia. Telefone, WhatsApp, e-mail e horário de atendimento.',
  keywords: [
    'contato voltris',
    'fale conosco',
    'suporte técnico contato',
    'telefone voltris',
    'whatsapp voltris',
    'email voltris',
    'suporte remoto contato',
    'serviço voltris',
    'telefone suporte técnico',
    'contato ti'
  ],
  openGraph: {
    title: 'Contato | Fale Conosco | VOLTRIS',
    description: 'Entre em contato com a VOLTRIS. Telefone, WhatsApp, e-mail e horário de atendimento.',
    url: 'https://www.voltris.com.br/contato',
    siteName: 'VOLTRIS',
    images: [
      {
        url: 'https://www.voltris.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'Contato VOLTRIS',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contato | VOLTRIS',
    description: 'Entre em contato conosco. Telefone, WhatsApp e e-mail.',
    images: ['https://www.voltris.com.br/logo.png'],
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
    canonical: 'https://www.voltris.com.br/contato',
  },
};

