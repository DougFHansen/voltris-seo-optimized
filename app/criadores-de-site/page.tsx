import React from 'react';
import { Metadata } from 'next';
import CriadoresDeSiteClient from './CriadoresClient';

export const metadata: Metadata = {
  title: "Criadores de Site - Equipe Especializada em Desenvolvimento Web | VOLTRIS",
  description: "Criadores de site profissionais e especializados. Equipe experiente em desenvolvimento web, design responsivo e SEO. Sites que convertem visitantes em clientes com qualidade garantida.",
  keywords: [
    "criadores de site",
    "desenvolvedores web",
    "equipe criação sites",
    "profissionais web",
    "desenvolvimento sites",
    "programadores web",
    "designers web",
    "agência web",
    "estúdio web",
    "criadores site profissional",
    "desenvolvedor frontend",
    "designer UI/UX",
    "programador React",
    "desenvolvedor Next.js",
    "criador site WordPress",
    "equipe desenvolvimento",
    "profissionais tecnologia",
    "especialistas web",
    "criadores site responsivo",
    "desenvolvedores site SEO"
  ],
  openGraph: {
    title: "Criadores de Site - Equipe Especializada em Desenvolvimento Web | VOLTRIS",
    description: "Criadores de site profissionais e especializados. Equipe experiente em desenvolvimento web, design responsivo e SEO.",
    url: "https://voltris.com.br/criadores-de-site",
    type: "website",
    images: [
      {
        url: "/remotebanner.jpg",
        width: 1200,
        height: 630,
        alt: "Criadores de Site - Equipe Especializada VOLTRIS"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Criadores de Site - Equipe Especializada em Desenvolvimento Web | VOLTRIS",
    description: "Criadores de site profissionais e especializados. Equipe experiente em desenvolvimento web.",
    images: ["/remotebanner.jpg"]
  },
  alternates: {
    canonical: "https://voltris.com.br/criadores-de-site"
  }
};

export default function CriadoresDeSitePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "VOLTRIS - Criadores de Site",
            "description": "Equipe especializada em criação de sites profissionais e desenvolvimento web",
            "url": "https://voltris.com.br",
            "logo": "https://voltris.com.br/logo.png",
            "employee": [
              {
                "@type": "Person",
                "jobTitle": "Desenvolvedor Frontend",
                "name": "Equipe VOLTRIS"
              },
              {
                "@type": "Person",
                "jobTitle": "Designer UI/UX",
                "name": "Equipe VOLTRIS"
              },
              {
                "@type": "Person",
                "jobTitle": "Especialista SEO",
                "name": "Equipe VOLTRIS"
              }
            ],
            "serviceArea": {
              "@type": "Country",
              "name": "Brasil"
            }
          })
        }}
      />
      <CriadoresDeSiteClient />
    </>
  );
}