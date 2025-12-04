import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manutenção Preventiva de Computadores | Guia Completo | VOLTRIS',
  description: 'Rotinas de manutenção que você pode fazer regularmente para manter seu computador funcionando perfeitamente. Guia completo sobre limpeza física, atualizações, verificações de sistema e práticas preventivas.',
  keywords: [
    'manutenção preventiva',
    'manutenção computador',
    'limpeza PC',
    'manutenção PC',
    'cuidados computador',
    'manutenção preventiva Windows',
    'limpeza física computador',
    'manutenção hardware',
    'cuidados notebook',
    'prevenir problemas PC',
    'manutenção sistema',
    'checklist manutenção',
    'rotina manutenção',
    'preservar computador',
    'prolongar vida PC'
  ],
  openGraph: {
    title: 'Manutenção Preventiva de Computadores | Guia Completo | VOLTRIS',
    description: 'Rotinas de manutenção que você pode fazer regularmente para manter seu computador funcionando perfeitamente.',
    url: 'https://voltris.com.br/guias/manutencao-preventiva',
    siteName: 'VOLTRIS',
    images: [
      {
        url: 'https://voltris.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'Guia de Manutenção Preventiva - VOLTRIS',
      },
    ],
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manutenção Preventiva de Computadores | VOLTRIS',
    description: 'Rotinas de manutenção para manter seu computador funcionando perfeitamente.',
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
    canonical: 'https://voltris.com.br/guias/manutencao-preventiva',
  },
};

