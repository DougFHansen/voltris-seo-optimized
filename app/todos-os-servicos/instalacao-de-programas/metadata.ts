import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Instalação de Programas e Softwares | Serviços de TI | VOLTRIS',
  description: 'Serviço profissional de instalação de programas e softwares. Instalamos Office, Adobe, ferramentas de produtividade e softwares especializados com configuração completa.',
  keywords: 'instalação programas, instalar software, instalação office, instalação adobe, configuração software, VOLTRIS TI',
  openGraph: {
    title: 'Instalação de Programas e Softwares | Serviços de TI | VOLTRIS',
    description: 'Serviço profissional de instalação de programas e softwares. Instalamos Office, Adobe, ferramentas de produtividade e softwares especializados.',
    url: 'https://www.voltris.com.br/todos-os-servicos/instalacao-de-programas',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'VOLTRIS',
    images: [
      {
        url: 'https://www.voltris.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'VOLTRIS - Instalação de Programas'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instalação de Programas e Softwares | Serviços de TI | VOLTRIS',
    description: 'Serviço profissional de instalação de programas e softwares. Instalamos Office, Adobe e ferramentas de produtividade.',
    images: ['https://www.voltris.com.br/logo.png'],
    creator: '@voltris'
  },
  alternates: {
    canonical: 'https://www.voltris.com.br/todos-os-servicos/instalacao-de-programas'
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
