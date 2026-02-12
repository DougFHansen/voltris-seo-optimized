import { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';

export const metadata: Metadata = {
  title: 'Suporte Técnico Remoto em Informática | VOLTRIS OPTIMIZER - Otimização de PC, Formatação e Serviços de TI',
  description: 'Suporte técnico remoto especializado, VOLTRIS OPTIMIZER (software SaaS de otimização com controle remoto), formatação, otimização de PC, remoção de vírus e criação de sites profissionais. Atendimento rápido e seguro em todo o Brasil.',
  keywords: 'suporte técnico remoto, técnico de informática online, formatação de pc remoto, limpeza de vírus online, otimização de pc gamer, voltris optimizer, software saas brasileiro, controle remoto de otimização, aumentar fps, melhorar desempenho windows, criação de sites profissionais, suporte windows remoto, assistência técnica informática online, otimizar pc para jogos, pc lento solução',
  openGraph: {
    title: 'Suporte Técnico Remoto em Informática | VOLTRIS OPTIMIZER - Otimização de PC, Formatação e Serviços de TI',
    description: 'Soluções em informática sem sair de casa. VOLTRIS OPTIMIZER (primeiro software SaaS brasileiro com controle remoto), formatação, performance e segurança para seu computador.',
    url: 'https://voltris.com.br',
    siteName: 'Voltris',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: 'https://voltris.com.br/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Voltris Suporte Técnico Remoto',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Suporte Técnico Remoto em Informática | VOLTRIS OPTIMIZER - Otimização de PC, Formatação e Serviços de TI',
    description: 'Suporte técnico especializado e VOLTRIS OPTIMIZER - primeiro software SaaS brasileiro de otimização com controle remoto.',
    creator: '@voltris',
  },
  alternates: {
    canonical: 'https://voltris.com.br',
  },
};

export default function Home() {
  return <HomeClient />;
}