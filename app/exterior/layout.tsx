import type { Metadata } from "next";
import "../globals.css";

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
    "formatação remota para expatriados",
    "otimização de pc para brasileiros no exterior",
    "correção de erros windows mac",
    "remoção de vírus malware",
    "otimização para gamers",
    "correção de erros em jogos",
    "gta cs2 cyberpunk valorant",
    "recuperação de dados perdidos",
    "instalação de programas remota",
    "configuração de redes wi-fi",
    "suporte a serviços em nuvem",
    "google workspace microsoft 365",
    "vpn para acesso seguro",
    "backup em nuvem internacional",
    "segurança digital para expatriados",
    "consultoria ti internacional",
    "trabalho remoto brasil exterior",
    "negócios internacionais brasil",
    "suporte técnico 24 horas",
    "profissionais brasileiros ti",
    "serviços tecnológicos para expatriados"
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

export default function ExteriorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}