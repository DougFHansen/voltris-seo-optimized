import React from 'react';
import { Metadata } from 'next';
import TecnicoInformaticaClient from '../tecnico-informatica/TecnicoInformaticaClient';

export const metadata: Metadata = {
  title: "Técnico de Informática que Atende em Casa - Suporte Online | VOLTRIS",
  description: "Suporte técnico remoto e presencial no conforto da sua casa. Resolva problemas de computador, formatação e manutenção sem sair de casa. Atendimento 24h.",
  keywords: [
    "técnico de informática em casa",
    "técnico informática residencial",
    "formatar pc em casa",
    "ajuda computador em casa",
    "técnico informática domicílio",
    "suporte técnico residencial",
    "consertar pc em casa",
    "atendimento técnico em casa"
  ],
  openGraph: {
    title: "Técnico de Informática que Atende em Casa | VOLTRIS",
    description: "Resolva problemas no seu computador sem sair de casa com nosso suporte técnico remoto de elite.",
    url: "https://voltris.com.br/tecnico-informatica-atende-casa",
    type: "website",
    images: [{ url: "/remotebanner.jpg", width: 1200, height: 630 }]
  }
};

export default function TecnicoInformaticaAtendeCasaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Técnico de Informática em Casa",
            "description": "Suporte técnico residencial remoto para computadores e notebooks.",
            "provider": {
              "@type": "Organization",
              "name": "VOLTRIS",
              "url": "https://voltris.com.br"
            }
          })
        }}
      />
      <TecnicoInformaticaClient
        title="Técnico de Informática em Casa"
        description="O conforto do seu lar unido à tecnologia de ponta. Resolvemos problemas de lentidão, vírus e formatação sem que você precise transportar sua máquina."
        badge="Seu Técnico Particular em Casa"
      />
    </>
  );
}
