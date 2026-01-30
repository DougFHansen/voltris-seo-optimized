import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Serviços de TI - Suporte Técnico Remoto e Criação de Sites | VOLTRIS',
  description: 'Suporte técnico remoto, formatação de PC, otimização Windows, criação de sites e instalação de programas. Conheça nossos serviços de TI com atendimento em todo o Brasil.',
  openGraph: {
    title: 'Serviços de TI - Suporte Técnico Remoto e Criação de Sites | VOLTRIS',
    description: 'Suporte técnico remoto, formatação, otimização e criação de sites. Serviços de TI com atendimento em todo o Brasil.',
    url: 'https://voltris.com.br/servicos',
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
    title: 'Serviços de TI - Suporte Técnico e Criação de Sites | VOLTRIS',
    description: 'Suporte técnico remoto, formatação, otimização e criação de sites. Atendimento em todo o Brasil.',
    images: ['https://voltris.com.br/logo.png']
  }
};
