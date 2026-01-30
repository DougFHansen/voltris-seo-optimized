import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Entrar na Área do Cliente | VOLTRIS',
  description: 'Acesse sua conta VOLTRIS para gerenciar serviços, pedidos e suporte técnico remoto. Login seguro e rápido.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Entrar na Área do Cliente | VOLTRIS',
    description: 'Acesse sua conta VOLTRIS para gerenciar serviços, pedidos e suporte técnico remoto. Login seguro e rápido.',
    url: 'https://voltris.com.br/login',
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
    title: 'Entrar na Área do Cliente | VOLTRIS',
    description: 'Acesse sua conta VOLTRIS para gerenciar serviços, pedidos e suporte técnico remoto. Login seguro e rápido.',
    images: ['https://voltris.com.br/logo.png']
  }
}; 