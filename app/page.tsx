import { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';

export const metadata: Metadata = {
  title: 'VOLTRIS - Suporte Técnico Remoto e Criação de Sites | Atendimento Online',
  description: 'Suporte técnico remoto especializado, formatação, otimização de PC, remoção de vírus e criação de sites profissionais. Atendimento rápido e seguro em todo o Brasil.',
  keywords: 'suporte técnico remoto, técnico de informática online, formatação de pc remoto, limpeza de vírus online, otimização de pc gamer, criação de sites profissionais, suporte windows remoto, assistência técnica informática online',
  openGraph: {
    title: 'VOLTRIS - Suporte Técnico Remoto e Criação de Sites',
    description: 'Soluções em informática sem sair de casa. Formatação, performance e segurança para seu computador.',
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
    title: 'VOLTRIS - Suporte Técnico Remoto',
    description: 'Suporte técnico especializado e criação de sites.',
    creator: '@voltris',
  },
  alternates: {
    canonical: 'https://voltris.com.br',
  },
};

export default function Home() {
  return <HomeClient />;
}