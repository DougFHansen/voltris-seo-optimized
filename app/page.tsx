import { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';

export const metadata: Metadata = {
  title: 'Voltris Optimizer | Otimização de PC e Suporte de TI Remoto',
  description: 'Software SaaS para otimização de PC (aumente FPS e reduza lag). Suporte técnico remoto especializado para empresas e gamers em todo o Brasil. Atendimento imediato.',
  keywords: [
    'voltris optimizer',
    'otimização de pc',
    'suporte técnico remoto',
    'técnico de informática online',
    'aumentar fps',
    'reduzir input lag',
    'gestão de ti',
    'suporte corporativo',
    'formatação de pc remoto',
    'limpeza de vírus online',
    'software saas otimização',
    'otimizar pc gamer'
  ],
  openGraph: {
    title: 'Voltris Optimizer | Performance e Suporte de TI Avançado',
    description: 'Aumente o FPS do seu jogo ou a produtividade da sua empresa com nosso Software SaaS e suporte remoto especializado.',
    url: 'https://voltris.com.br',
    siteName: 'Voltris',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: 'https://voltris.com.br/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Voltris Optimizer SaaS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voltris Optimizer | Performance e Suporte de TI Avançado',
    description: 'Aumente o FPS do seu jogo ou a produtividade da sua empresa com nosso Software SaaS de otimização remota.',
    creator: '@voltris',
  },
  alternates: {
    canonical: 'https://voltris.com.br',
  },
};

export default function Home() {
  return <HomeClient />;
}