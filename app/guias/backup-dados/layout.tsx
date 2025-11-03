import { metadata as guideMetadata } from './metadata';
import Script from 'next/script';

export const metadata = guideMetadata;

export default function BackupDadosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Como Fazer Backup dos Seus Dados",
    "description": "Guia completo passo a passo para fazer backup eficaz dos seus arquivos importantes usando diferentes métodos.",
    "image": "https://voltris.com.br/logo.png",
    "totalTime": "PT1H",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Identificar Dados para Backup",
        "text": "Determinar quais arquivos e pastas são importantes e devem ser incluídos no backup."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Backup em HD Externo",
        "text": "Fazer backup manual ou automático dos dados importantes em HD externo ou pen drive."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Backup em Nuvem",
        "text": "Configurar backup automático em serviços de nuvem como Google Drive, OneDrive ou Dropbox."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Backup Completo do Sistema",
        "text": "Criar imagem completa do sistema usando ferramentas do Windows ou software terceirizado."
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Implementar Estratégia 3-2-1",
        "text": "Aplicar a regra 3-2-1: 3 cópias, 2 tipos de mídia diferentes, 1 cópia fora de casa."
      },
      {
        "@type": "HowToStep",
        "position": 6,
        "name": "Verificar e Testar Backups",
        "text": "Testar periodicamente a integridade e capacidade de restauração dos backups."
      }
    ]
  };

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Como Fazer Backup dos Seus Dados",
    "description": "Guia completo sobre métodos eficazes para fazer backup completo dos seus arquivos importantes.",
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
      "@id": "https://voltris.com.br/guias/backup-dados"
    }
  };

  return (
    <>
      <Script
        id="backup-dados-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Script
        id="backup-dados-article-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      {children}
    </>
  );
}

