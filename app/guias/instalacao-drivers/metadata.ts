import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Instalação e Atualização de Drivers | Guia Completo | VOLTRIS',
  description: 'Aprenda como instalar, atualizar e gerenciar drivers do seu computador. Guia completo sobre onde encontrar drivers, métodos de instalação e solução de problemas relacionados a drivers.',
  keywords: [
    'instalar drivers',
    'atualizar drivers',
    'drivers Windows',
    'driver placa de vídeo',
    'driver áudio',
    'driver Wi-Fi',
    'Gerenciador Dispositivos',
    'baixar drivers',
    'drivers Dell',
    'drivers HP',
    'drivers Lenovo',
    'driver NVIDIA',
    'driver AMD',
    'instalar driver manual',
    'problemas drivers',
    'driver corrompido',
    'driver desatualizado',
    'Windows Update drivers'
  ],
  openGraph: {
    title: 'Instalação e Atualização de Drivers | Guia Completo | VOLTRIS',
    description: 'Aprenda como instalar, atualizar e gerenciar drivers do seu computador para garantir que todos os dispositivos funcionem corretamente.',
    url: 'https://voltris.com.br/guias/instalacao-drivers',
    siteName: 'VOLTRIS',
    images: [
      {
        url: 'https://voltris.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'Guia de Instalação de Drivers - VOLTRIS',
      },
    ],
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instalação e Atualização de Drivers | VOLTRIS',
    description: 'Guia completo sobre instalação e gerenciamento de drivers.',
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
    canonical: 'https://voltris.com.br/guias/instalacao-drivers',
  },
};

