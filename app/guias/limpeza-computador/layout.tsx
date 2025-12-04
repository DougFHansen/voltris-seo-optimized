import { metadata as guideMetadata } from './metadata';
import Script from 'next/script';

export const metadata = guideMetadata;

export default function LimpezaComputadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Limpeza Completa do Computador",
    "description": "Guia passo a passo completo para limpar arquivos temporários, cache, programas desnecessários e otimizar o espaço em disco.",
    "image": "https://voltris.com.br/logo.png",
    "totalTime": "PT1H",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Limpeza de Arquivos Temporários",
        "text": "Usar Limpeza de Disco do Windows e limpar manualmente pastas temporárias para remover arquivos desnecessários."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Limpeza de Cache de Navegadores",
        "text": "Limpar cache, cookies e dados temporários de todos os navegadores instalados (Chrome, Edge, Firefox)."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Desinstalar Programas Não Utilizados",
        "text": "Identificar e desinstalar programas que não são mais utilizados para liberar espaço em disco."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Limpar Arquivos de Sistema e Logs",
        "text": "Limpar logs do Windows e remover arquivos de atualização antigos para liberar espaço adicional."
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Limpar Downloads e Arquivos Grandes",
        "text": "Analisar espaço em disco, limpar pasta de downloads e encontrar/remover arquivos duplicados."
      },
      {
        "@type": "HowToStep",
        "position": 6,
        "name": "Limpar Cache de Programas",
        "text": "Limpar cache acumulado por programas como Spotify, Discord, Steam, Adobe e outros."
      }
    ]
  };

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Limpeza Completa do Computador",
    "description": "Guia completo com técnicas profissionais para limpar arquivos temporários, cache e otimizar o espaço em disco.",
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
      "@id": "https://voltris.com.br/guias/limpeza-computador"
    }
  };

  return (
    <>
      <Script
        id="limpeza-computador-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Script
        id="limpeza-computador-article-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      {children}
    </>
  );
}

