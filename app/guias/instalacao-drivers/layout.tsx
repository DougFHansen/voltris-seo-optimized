import { metadata as guideMetadata } from './metadata';
import Script from 'next/script';

export const metadata = guideMetadata;

export default function InstalacaoDriversLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Instalação e Atualização de Drivers",
    "description": "Guia completo passo a passo para instalar, atualizar e gerenciar drivers do computador.",
    "image": "https://voltris.com.br/logo.png",
    "totalTime": "PT45M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Identificar Drivers Necessários",
        "text": "Usar o Gerenciador de Dispositivos para identificar quais drivers precisam ser instalados ou atualizados."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Instalação Automática pelo Windows",
        "text": "Usar Windows Update para instalar drivers automaticamente."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Baixar do Fabricante",
        "text": "Baixar drivers diretamente dos sites oficiais dos fabricantes de hardware."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Instalar na Ordem Correta",
        "text": "Instalar drivers na ordem recomendada: chipset, rede, vídeo, áudio e outros."
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Solução de Problemas",
        "text": "Resolver problemas comuns relacionados a instalação e funcionamento de drivers."
      }
    ]
  };

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Instalação e Atualização de Drivers",
    "description": "Guia completo sobre como instalar, atualizar e gerenciar drivers do computador.",
    "image": "https://voltris.com.br/logo.png",
    "author": {
      "@type": "Organization",
      "name": "VOLTRIS",
      "url": "https://voltris.com.br"
    },
    "publisher": {
      "@type": "Organization",
      "name": "VOLTRIS",
      "logo": {
        "@type": "ImageObject",
        "url": "https://voltris.com.br/logo.png"
      }
    },
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://voltris.com.br/guias/instalacao-drivers"
    }
  };

  return (
    <>
      <Script
        id="instalacao-drivers-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Script
        id="instalacao-drivers-article-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      {children}
    </>
  );
}

