import React from 'react';
import { Metadata } from 'next';
import CriarSiteClient from './CriarSiteClient';

export const metadata: Metadata = {
  title: "Criar Site - Desenvolvimento de Sites Profissionais e Responsivos | VOLTRIS",
  description: "Criar site profissional e responsivo para sua empresa. Desenvolvimento web moderno, SEO otimizado, design personalizado e suporte completo. Sites que convertem visitantes em clientes.",
  keywords: [
    "criar site",
    "criar site profissional",
    "desenvolvimento de sites",
    "criação de sites",
    "site responsivo",
    "site empresarial",
    "design de sites",
    "desenvolvimento web",
    "site institucional",
    "site e-commerce",
    "landing page",
    "site otimizado SEO",
    "site moderno",
    "site personalizado",
    "programação web",
    "frontend development",
    "site WordPress",
    "site React",
    "site Next.js",
    "site mobile first"
  ],
  openGraph: {
    title: "Criar Site - Desenvolvimento de Sites Profissionais e Responsivos | VOLTRIS",
    description: "Criar site profissional e responsivo para sua empresa. Desenvolvimento web moderno, SEO otimizado, design personalizado e suporte completo.",
    url: "https://voltris.com.br/criar-site",
    type: "website",
    images: [
      {
        url: "/remotebanner.jpg",
        width: 1200,
        height: 630,
        alt: "Criar Site - Desenvolvimento Web Profissional VOLTRIS"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Criar Site - Desenvolvimento de Sites Profissionais e Responsivos | VOLTRIS",
    description: "Criar site profissional e responsivo para sua empresa. Desenvolvimento web moderno e SEO otimizado.",
    images: ["/remotebanner.jpg"]
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
