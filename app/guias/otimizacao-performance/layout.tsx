import { metadata as guideMetadata } from './metadata';
import Script from 'next/script';

export const metadata = guideMetadata;

export default function OtimizacaoPerformanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Como Otimizar a Performance do Seu PC",
    "description": "Guia completo passo a passo para otimizar e acelerar seu computador Windows usando técnicas profissionais.",
    "image": "https://voltris.com.br/logo.png",
    "totalTime": "PT1H",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Limpeza Profunda de Arquivos Temporários",
        "text": "Remover arquivos temporários e cache usando ferramentas do Windows e limpeza manual."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Otimização de Programas na Inicialização",
        "text": "Gerenciar e desabilitar programas desnecessários que iniciam automaticamente com o Windows."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Otimização de Memória RAM",
        "text": "Liberar memória RAM fechando programas não utilizados e otimizando serviços do sistema."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Otimização do Disco Rígido",
        "text": "Desfragmentar disco (HDD) e verificar erros no disco para melhorar performance."
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Otimização do Registro do Windows",
        "text": "Limpar entradas inválidas e órfãs do registro do Windows (com cautela e backup)."
      },
      {
        "@type": "HowToStep",
        "position": 6,
        "name": "Otimização de Rede",
        "text": "Ajustar configurações TCP/IP e limpar cache DNS para melhorar conectividade."
      }
    ]
  };

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Como Otimizar a Performance do Seu PC",
    "description": "Guia completo com técnicas profissionais para acelerar e otimizar seu computador Windows.",
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
      "@id": "https://voltris.com.br/guias/otimizacao-performance"
    }
  };

  return (
    <>
      <Script
        id="otimizacao-performance-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Script
        id="otimizacao-performance-article-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      {children}
    </>
  );
}

