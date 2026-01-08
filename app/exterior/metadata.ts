import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "VOLTRIS Exterior - Suporte Técnico para Brasileiros no Exterior",
    template: "%s | VOLTRIS Exterior"
  },
  description: "Suporte técnico especializado em português para brasileiros que moram fora do Brasil. Atendimento remoto global, criação de sites multilíngues, migração de dados internacionais e consultoria de TI para expatriados.",
  keywords: [
    "suporte técnico para brasileiros no exterior",
    "atendimento remoto para expatriados",
    "suporte técnico em português internacional",
    "brasileiros fora do brasil suporte",
    "expatriados brasil suporte ti",
    "suporte técnico global brasil",
    "serviços de ti para brasileiros no exterior",
    "suporte remoto internacional",
    "criação de sites para brasileiros no exterior",
    "migração de dados internacional",
    "consultoria ti expatriados",
    "suporte nuvem para brasileiros",
    "vpn para brasileiros no exterior",
    "configuração de redes internacionais",
    "backup internacional brasil",
    "segurança digital para expatriados"
  ],
  authors: [{ name: "VOLTRIS" }],
  creator: "VOLTRIS",
  publisher: "VOLTRIS",
  metadataBase: new URL('https://voltris.com.br/exterior'),
  alternates: {
    canonical: '/exterior',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://voltris.com.br/exterior',
    siteName: 'VOLTRIS Exterior',
    title: 'VOLTRIS Exterior - Suporte Técnico para Brasileiros no Exterior',
    description: 'Suporte técnico especializado em português para brasileiros que moram fora do Brasil. Atendimento remoto global e soluções tecnológicas internacionais.',
    images: [
      {
        url: '/logo-exterior.png',
        width: 1200,
        height: 630,
        alt: 'VOLTRIS Exterior - Suporte para Brasileiros no Mundo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VOLTRIS Exterior - Suporte Técnico para Brasileiros no Exterior',
    description: 'Suporte técnico especializado em português para brasileiros que moram fora do Brasil.',
    images: ['/logo-exterior.png'],
    creator: '@voltris',
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
  category: 'technology',
};