import React from 'react';
import { Metadata } from 'next';
import TecnicoInformaticaClient from './TecnicoInformaticaClient';

export const metadata: Metadata = {
  title: "Técnico de Informática - Suporte Remoto Especializado | VOLTRIS",
  description: "Suporte técnico remoto especializado em informática. Resolva problemas de computador, formatação, otimização e manutenção de sistemas Windows com segurança e eficiência.",
  keywords: [
    "técnico de informática",
    "suporte técnico computador",
    "conserto de computador remoto",
    "manutenção de notebook",
    "técnico windows",
    "suporte ti remoto",
    "assistência técnica informática",
    "formatar pc remoto",
    "limpeza de vírus remota",
    "otimização de windows"
  ],
  openGraph: {
    title: "Técnico de Informática - Suporte Remoto Especializado | VOLTRIS",
    description: "Suporte técnico remoto especializado em informática. Atendimento 24/7 para todo o Brasil.",
    url: "https://voltris.com.br/tecnico-informatica",
    type: "website",
    images: [{ url: "/remotebanner.jpg", width: 1200, height: 630 }]
  }
};

export default function TecnicoInformaticaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Técnico de Informática Especializado",
            "description": "Serviços de suporte técnico remoto em informática para Windows.",
            "provider": {
              "@type": "Organization",
              "name": "VOLTRIS",
              "url": "https://voltris.com.br"
            },
            "areaServed": { "@type": "Country", "name": "Brasil" }
          })
        }}
      />
      <TecnicoInformaticaClient />
    </>
  );
}
