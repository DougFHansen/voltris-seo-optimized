import { metadata as guideMetadata } from './metadata';
import Script from 'next/script';

export const metadata = guideMetadata;

export default function FormatacaoWindowsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Guia Completo de Formatação do Windows",
    "description": "Aprenda como formatar seu computador Windows de forma segura e completa com este guia passo a passo profissional.",
    "image": "https://voltris.com.br/logo.png",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "BRL",
      "value": "0"
    },
    "totalTime": "PT4H",
    "tool": [
      {
        "@type": "HowToTool",
        "name": "Mídia de instalação do Windows"
      },
      {
        "@type": "HowToTool",
        "name": "HD externo ou pen drive para backup"
      },
      {
        "@type": "HowToTool",
        "name": "Chave de produto do Windows"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Backup Completo dos Dados",
        "text": "Fazer backup completo de todos os arquivos importantes antes de iniciar a formatação.",
        "image": "https://voltris.com.br/logo.png"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Preparação para Formatação",
        "text": "Criar mídia de instalação do Windows e baixar drivers do fabricante.",
        "image": "https://voltris.com.br/logo.png"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Processo de Formatação",
        "text": "Configurar boot pela mídia de instalação e executar instalação limpa do Windows.",
        "image": "https://voltris.com.br/logo.png"
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Configuração Inicial e Pós-Instalação",
        "text": "Instalar drivers, atualizações do Windows e restaurar dados do backup.",
        "image": "https://voltris.com.br/logo.png"
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Otimizações Iniciais",
        "text": "Configurar desempenho, desativar programas desnecessários na inicialização e otimizar planos de energia.",
        "image": "https://voltris.com.br/logo.png"
      }
    ]
  };

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Guia Completo de Formatação do Windows",
    "description": "Aprenda como formatar seu computador Windows de forma segura e completa. Guia passo a passo profissional.",
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
      "@id": "https://voltris.com.br/guias/formatacao-windows"
    }
  };

  return (
    <>
      <Script
        id="formatacao-windows-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Script
        id="formatacao-windows-article-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      {children}
    </>
  );
}

