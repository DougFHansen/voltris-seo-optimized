import { metadata as guideMetadata } from './metadata';
import Script from 'next/script';

export const metadata = guideMetadata;

export default function SegurancaDigitalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Guia de Segurança Digital Essencial",
    "description": "Guia completo passo a passo para proteger seu computador contra vírus, malware e ataques cibernéticos.",
    "image": "https://voltris.com.br/logo.png",
    "totalTime": "PT2H",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Instalar e Configurar Antivírus",
        "text": "Escolher, instalar e configurar adequadamente um antivírus profissional para proteção contra malware."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Configurar Firewall",
        "text": "Ativar e configurar o firewall do Windows corretamente para controlar tráfego de rede."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Criar Senhas Seguras",
        "text": "Criar senhas fortes e usar gerenciadores de senhas, além de ativar autenticação de dois fatores."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Navegação Segura",
        "text": "Aprender a reconhecer sites seguros, proteger-se contra phishing e manter navegadores atualizados."
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Proteção Contra Ransomware",
        "text": "Implementar medidas específicas para proteção contra ransomware e outros tipos de malware."
      },
      {
        "@type": "HowToStep",
        "position": 6,
        "name": "Atualizações de Segurança",
        "text": "Manter Windows e todos os programas atualizados para corrigir vulnerabilidades de segurança."
      }
    ]
  };

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Guia de Segurança Digital Essencial",
    "description": "Guia completo para proteger seu computador contra vírus, malware e ataques cibernéticos.",
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
      "@id": "https://voltris.com.br/guias/seguranca-digital"
    }
  };

  return (
    <>
      <Script
        id="seguranca-digital-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Script
        id="seguranca-digital-article-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      {children}
    </>
  );
}

