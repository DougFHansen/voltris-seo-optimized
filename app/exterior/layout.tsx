import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "VOLTRIS Exterior - Suporte Técnico para Brasileiros no Exterior",
    template: "%s | VOLTRIS Exterior"
  },
  description: "Suporte técnico em português para brasileiros no exterior. Pague em Reais (PIX). Atendimento remoto para EUA, Portugal, Europa e Mundo. Formatação, otimização e TI.",
  keywords: [
    "suporte técnico brasileiros exterior",
    "técnico de informática em portugal",
    "técnico de informática em orlando",
    "suporte ti eua em português",
    "formatar pc pagamento pix",
    "brasileiros na europa",
    "suporte técnico remoto internacional",
    "conserto de pc em português",
    "técnico brasileiro em londres",
    "ajuda com notebook eua",
    "configurar windows abnt2",
    "voltris exterior"
  ],
  authors: [{ name: "VOLTRIS" }],
  creator: "VOLTRIS",
  publisher: "VOLTRIS",
  metadataBase: new URL('https://voltris.com.br'),
  alternates: {
    canonical: '/exterior',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://voltris.com.br/exterior',
    siteName: 'VOLTRIS Exterior',
    title: 'Suporte Técnico para Brasileiros no Exterior | Pague em Reais',
    description: 'Resolva problemas no seu computador com técnico brasileiro, sem sair de casa. Pagamento facilitado em Reais (PIX) e atendimento no seu fuso horário.',
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
    title: 'Suporte Técnico Brasileiro no Exterior',
    description: 'Atendimento em português para EUA, Europa e Mundo. Pague em Reais (PIX).',
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