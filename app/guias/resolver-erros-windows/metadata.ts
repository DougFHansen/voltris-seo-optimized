import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Como Resolver Erros Comuns do Windows | Guia de Troubleshooting | VOLTRIS',
  description: 'Guia completo para diagnosticar e resolver os erros mais frequentes no Windows, incluindo tela azul (BSOD), travamentos, mensagens de erro, problemas de inicialização e outros erros comuns do sistema operacional.',
  keywords: [
    'resolver erros Windows',
    'tela azul Windows',
    'BSOD solução',
    'Windows não inicia',
    'computador travando',
    'erros Windows',
    'troubleshooting Windows',
    'corrigir erros sistema',
    'repair Windows',
    'problemas Windows',
    'tela azul solução',
    'Windows congelando',
    'erros sistema Windows',
    'diagnóstico Windows',
    'correção erros',
    'repair boot Windows',
    'modo seguro Windows',
    'restauração sistema'
  ],
  openGraph: {
    title: 'Como Resolver Erros Comuns do Windows | Guia de Troubleshooting | VOLTRIS',
    description: 'Guia completo para diagnosticar e resolver os erros mais frequentes no Windows.',
    url: 'https://voltris.com.br/guias/resolver-erros-windows',
    siteName: 'VOLTRIS',
    images: [
      {
        url: 'https://voltris.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'Guia de Resolução de Erros Windows - VOLTRIS',
      },
    ],
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Como Resolver Erros Comuns do Windows | VOLTRIS',
    description: 'Guia completo para diagnosticar e resolver erros do Windows.',
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
    canonical: 'https://voltris.com.br/guias/resolver-erros-windows',
  },
};

