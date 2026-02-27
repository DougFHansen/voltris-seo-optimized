import { Metadata } from 'next';
import ManutencaoComputadorClient from './ManutencaoComputadorClient';

export const metadata: Metadata = {
  title: 'Manutenção de Computador Profissional | VOLTRIS - Limpeza, Peças e Manutenção Preventiva',
  description: 'Serviço profissional de manutenção de computador com diagnóstico completo, limpeza interna, troca de peças e manutenção preventiva. Técnicos certificados com garantia e atendimento em todo Brasil.',
  keywords: [
    'manutenção de computador', 'limpeza de pc', 'troca de peça de computador',
    'manutenção preventiva de pc', 'diagnóstico de hardware', 'reparo de computador',
    'assistência técnica', 'manutenção de notebook', 'troca de cooler', 'troca de fonte',
    'manutenção de desktop', 'revisão de computador', 'peças de computador originais',
    'manutenção preventiva', 'limpeza interna de pc', 'troca de pasta térmica'
  ],
  openGraph: {
    title: 'Manutenção de Computador Profissional | VOLTRIS',
    description: 'Serviço profissional de manutenção de computador com diagnóstico completo, limpeza interna, troca de peças e manutenção preventiva.',
    url: 'https://voltris.com.br/manutencao-computador',
    siteName: 'VOLTRIS',
    images: [{ url: '/remotebanner.jpg', width: 1200, height: 630, alt: 'Manutenção de Computador Profissional VOLTRIS' }],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manutenção de Computador Profissional | VOLTRIS',
    description: 'Técnicos certificados para manutenção completa do seu computador.',
    images: ['/remotebanner.jpg'],
    creator: '@voltris',
  },
  alternates: {
    canonical: 'https://voltris.com.br/manutencao-computador',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function ManutencaoComputadorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            'name': 'Manutenção de Computador Profissional',
            'description': 'Serviço profissional de manutenção de computador com diagnóstico completo, limpeza interna, troca de peças e manutenção preventiva.',
            'provider': { '@type': 'Organization', 'name': 'VOLTRIS', 'url': 'https://voltris.com.br', 'telephone': '+5511996716235' },
            'serviceType': 'Manutenção de Hardware',
            'areaServed': { '@type': 'Country', 'name': 'Brasil' }
          })
        }}
      />
      <ManutencaoComputadorClient />
    </>
  );
}