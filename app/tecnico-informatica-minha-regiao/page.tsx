import React from 'react';
import { Metadata } from 'next';
import TecnicoInformaticaClient from '../tecnico-informatica/TecnicoInformaticaClient';

export const metadata: Metadata = {
  title: "Técnico de Informática na Minha Região - Suporte Remoto Nacional | VOLTRIS",
  description: "Técnico de informática na sua região com suporte remoto. Atendimento em todo Brasil, 100% online. Resolva problemas de computador sem sair de casa.",
  keywords: [
    "técnico de informática na minha região",
    "técnico informática perto de mim",
    "assistência técnica minha cidade",
    "suporte técnico local",
    "técnico computador região",
    "técnico informática bairro",
    "conserto computador perto"
  ],
  openGraph: {
    title: "Técnico de Informática na Minha Região | VOLTRIS",
    description: "Atendimento em todo Brasil com suporte remoto imediato. O técnico mais próximo de você está a um clique.",
    url: "https://voltris.com.br/tecnico-informatica-minha-regiao",
    type: "website",
    images: [{ url: "/remotebanner.jpg", width: 1200, height: 630 }]
  }
};

export default function TecnicoInformaticaMinhaRegiaoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Técnico de Informática Regional",
            "description": "Suporte técnico remoto regionalizado para todas as cidades do Brasil.",
            "provider": {
              "@type": "Organization",
              "name": "VOLTRIS",
              "url": "https://voltris.com.br"
            }
          })
        }}
      />
      <TecnicoInformaticaClient
        title="Técnico de Informática na Sua Região"
        description="Não importa onde você esteja no Brasil, nossa equipe atende sua região com suporte remoto instantâneo. Qualidade de assistência técnica local com a rapidez da internet."
        badge="Atendimento Nacional Imediato"
      />
    </>
  );
}
