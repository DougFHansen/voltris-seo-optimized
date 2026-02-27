import React from 'react';
import { Metadata } from 'next';
import CriarSiteClient from './CriarSiteClient';

export const metadata: Metadata = {
  title: "Criação de Sites Profissionais: Superando Wix e WordPress | VOLTRIS",
  description: "Crie um site profissional com performance superior ao Wix e WordPress. Desenvolvimento Next.js ultra-rápido, SEO 10/10 nativo e design premium. O melhor custo-benefício para sua empresa.",
  keywords: [
    "criar site profissional", "criação de sites de alta performance", "desenvolvimento web premium",
    "site melhor que wix", "site melhor que wordpress", "como criar um site que vende",
    "empresa de criação de sites", "site responsivo e rápido", "SEO 10/10 para sites",
    "desenvolvedor next.js brasil", "site institucional moderno", "landing page que converte",
    "voltris criação de sites", "site otimizado para google e bing"
  ],
  openGraph: {
    title: "Criação de Sites Profissionais: Alta Performance Superior | VOLTRIS",
    description: "Sua empresa merece um site que carrega em milissegundos. Esqueça soluções genéricas. Vá de VOLTRIS.",
    url: "https://voltris.com.br/criar-site",
    type: "website",
    images: [
      {
        url: "/logo-seo-web.png",
        width: 1200,
        height: 630,
        alt: "Criação de Sites Profissionais VOLTRIS"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Crie um Site Profissional Superior ao WordPress | VOLTRIS",
    images: ["/logo-seo-web.png"]
  },
  alternates: {
    canonical: "https://voltris.com.br/criar-site"
  }
};

export default function CriarSitePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Criar Site - Desenvolvimento Web Profissional",
            "description": "Serviços de criação de sites profissionais e responsivos com design moderno e SEO otimizado",
            "provider": {
              "@type": "Organization",
              "name": "VOLTRIS",
              "url": "https://voltris.com.br"
            },
            "serviceType": "Desenvolvimento Web",
            "areaServed": {
              "@type": "Country",
              "name": "Brasil"
            },
            "offers": {
              "@type": "Offer",
              "price": "997.90",
              "priceCurrency": "BRL",
              "availability": "https://schema.org/InStock"
            }
          })
        }}
      />
      <CriarSiteClient />
    </>
  );
}
