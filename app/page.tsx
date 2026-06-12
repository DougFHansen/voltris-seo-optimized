import { Metadata } from 'next';
import HomeServer from '@/components/HomeServer';
import HomeClient from '@/components/HomeClient';

export const metadata: Metadata = {
  title: 'Voltris | Otimizador de PC e Suporte Técnico Remoto Especializado',
  description: 'Aumente o FPS com nosso Software (Voltris Optimizer) ou agende Formatação e Otimização Remota com especialistas reais. Atendimento online em todo o Brasil.',
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
    'software otimização',
    'otimizar pc gamer'
  ],
  openGraph: {
    title: 'Voltris | Otimizador de PC e Suporte Técnico Remoto Especializado',
    description: 'Aumente o FPS em jogos com nosso Software ou resolva problemas instantaneamente com nosso Suporte Remoto Profissional.',
    url: 'https://www.voltris.com.br',
    siteName: 'Voltris',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: 'https://www.voltris.com.br/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Voltris Optimizer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voltris | Otimizador de PC e Suporte Técnico Remoto Especializado',
    description: 'Aumente o FPS em jogos com nosso Software ou resolva problemas instantaneamente com nosso Suporte Remoto Profissional.',
    creator: '@voltris',
  },
  alternates: {
    canonical: 'https://www.voltris.com.br',
    languages: {
      'pt-BR': 'https://www.voltris.com.br',
      'pt-PT': 'https://www.voltris.com.br/exterior',
      'x-default': 'https://www.voltris.com.br/exterior',
    },
  },
};

export default function Home() {
  return (
    <>
      {/* Server Component: Renders SEO content on server (Hero, About, Services, Optimizer section, FAQ, schema markup) */}
      <HomeServer />
      
      {/* Client Component: Adds interactivity on client (particles, animations, OAuth callback, WhatsApp float) */}
      <HomeClient />
    </>
  );
}
