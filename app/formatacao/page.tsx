
import { Metadata } from 'next';
import FormatacaoClient from './FormatacaoClient';

export const metadata: Metadata = {
  title: "Formatação de PC e Notebook Remota | Instalação Windows Limpa - VOLTRIS",
  description: "Serviço de formatação de PC remota com backup seguro. Instalação limpa do Windows 10/11, drivers e programas essenciais. Atendimento técnico especializado.",
  keywords: [
    "formatar pc remoto",
    "formatação de notebook",
    "instalar windows 11 remoto",
    "limpeza de vírus",
    "pc travando formatação",
    "backup e formatação",
    "técnico de informática formatar"
  ],
  openGraph: {
    title: "Formatação de Computador Remota | Instalação Windows Profissional",
    description: "Deixe seu PC como novo novamente. Serviço de formatação online com segurança total de dados e garantia.",
    url: "https://voltris.com.br/formatacao",
    type: "website",
    images: [{ url: "/format-banner.jpg", width: 1200, height: 630 }]
  }
};

export default function FormatacaoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Formatação de Computador Remota",
            "provider": {
              "@type": "Organization",
              "name": "VOLTRIS",
              "url": "https://voltris.com.br"
            },
            "serviceType": "Computer Repair",
            "areaServed": {
              "@type": "Country",
              "name": "Brasil"
            },
            "offers": {
              "@type": "Offer",
              "price": "99.90",
              "priceCurrency": "BRL"
            }
          })
        }}
      />
      <FormatacaoClient />
    </>
  );
}
