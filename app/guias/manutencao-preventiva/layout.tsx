import { metadata as guideMetadata } from './metadata';
import Script from 'next/script';

export const metadata = guideMetadata;

export default function ManutencaoPreventivaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Manutenção Preventiva de Computadores",
    "description": "Guia completo sobre rotinas de manutenção preventiva para manter seu computador funcionando perfeitamente.",
    "image": "https://voltris.com.br/logo.png",
    "totalTime": "PT3H",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Manutenção Semanal",
        "text": "Verificação rápida de antivírus, limpeza de arquivos temporários e verificação de espaço em disco."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Manutenção Mensal",
        "text": "Verificação completa de antivírus, atualizações do sistema, verificação de erros no disco e desfragmentação."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Manutenção Trimestral",
        "text": "Limpeza física do computador, verificação de hardware, backup completo e revisão completa de segurança."
      }
    ]
  };

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Manutenção Preventiva de Computadores",
    "description": "Guia completo sobre rotinas de manutenção preventiva para manter seu computador funcionando perfeitamente.",
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
      "@id": "https://voltris.com.br/guias/manutencao-preventiva"
    }
  };

  return (
    <>
      <Script
        id="manutencao-preventiva-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Script
        id="manutencao-preventiva-article-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      {children}
    </>
  );
}

