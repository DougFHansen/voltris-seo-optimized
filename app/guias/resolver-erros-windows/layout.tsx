import { metadata as guideMetadata } from './metadata';
import Script from 'next/script';

export const metadata = guideMetadata;

export default function ResolverErrosWindowsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Como Resolver Erros Comuns do Windows",
    "description": "Guia completo passo a passo para diagnosticar e resolver os erros mais frequentes no Windows.",
    "image": "https://voltris.com.br/logo.png",
    "totalTime": "PT2H",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Entender o Erro",
        "text": "Identificar o tipo específico de erro, anotar códigos de erro e mensagens exatas para pesquisa."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Resolver Tela Azul (BSOD)",
        "text": "Anotar código de erro, verificar hardware, atualizar drivers e diagnosticar problemas de memória."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Resolver Problemas de Inicialização",
        "text": "Usar Reparação Automática, Restauração do Sistema ou comandos de reparo via Prompt de Comando."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Resolver Travamentos",
        "text": "Verificar temperaturas, testar memória RAM, verificar disco rígido e diagnosticar drivers."
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Usar Ferramentas de Diagnóstico",
        "text": "Utilizar SFC, DISM, Visualizador de Eventos e outras ferramentas do Windows para diagnóstico avançado."
      }
    ]
  };

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Como Resolver Erros Comuns do Windows",
    "description": "Guia completo para diagnosticar e resolver os erros mais frequentes no Windows.",
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
      "@id": "https://voltris.com.br/guias/resolver-erros-windows"
    }
  };

  return (
    <>
      <Script
        id="resolver-erros-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Script
        id="resolver-erros-article-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      {children}
    </>
  );
}

