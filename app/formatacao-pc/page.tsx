import { Metadata } from 'next';
import FormatacaoPCClient from './FormatacaoPCClient';

export const metadata: Metadata = {
  title: 'Formatação de PC Remota Profissional | VOLTRIS - Limpeza Completa',
  description: 'Serviço profissional de formatação de PC remota com backup seguro, instalação limpa do Windows e programas essenciais. Atendimento em todo Brasil.',
  keywords: [
    'formatação de pc', 'formatação remota', 'limpeza de sistema', 'instalação windows',
    'formatação pc', 'backup seguro', 'instalação programas', 'formatação notebook',
    'restauração sistema', 'limpeza profunda', 'formatação windows', 'instalação limpa',
    'recuperação sistema', 'manutenção preventiva', 'formatação computador', 'backup dados'
  ],
  openGraph: {
    title: 'Formatação de PC Remota Profissional | VOLTRIS',
    description: 'Serviço profissional de formatação de PC remota com backup seguro, instalação limpa do Windows e programas essenciais.',
    url: 'https://voltris.com.br/formatacao-pc',
    siteName: 'VOLTRIS',
    images: [{ url: '/remotebanner.jpg', width: 1200, height: 630, alt: 'Formatação de PC Remota Profissional VOLTRIS' }],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Formatação de PC Remota Profissional | VOLTRIS',
    description: 'Formatação remota com backup seguro e instalação limpa do Windows.',
    images: ['/remotebanner.jpg'],
    creator: '@voltris',
  },
  alternates: {
    canonical: 'https://voltris.com.br/formatacao-pc',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function FormatacaoPCPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            'name': 'Formatação de PC Remota Profissional',
            'description': 'Serviço profissional de formatação de PC remota com backup seguro, instalação limpa do Windows e programas essenciais.',
            'provider': { '@type': 'Organization', 'name': 'VOLTRIS', 'url': 'https://voltris.com.br', 'telephone': '+5511996716235' },
            'serviceType': 'Formatação de Computador',
            'areaServed': { '@type': 'Country', 'name': 'Brasil' },
            'offers': { '@type': 'Offer', 'priceSpecification': { '@type': 'PriceSpecification', 'priceCurrency': 'BRL', 'price': '99.90' } }
          })
        }}
      />
      <FormatacaoPCClient />
    </>
  );
}