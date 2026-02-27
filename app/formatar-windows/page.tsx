import { Metadata } from 'next';
import FormatarWindowsClient from './FormatarWindowsClient';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Formatação de Windows Profissional - Suporte Técnico Remoto | VOLTRIS',
  description: 'Serviço especializado de formatação de Windows 10 e 11. Instalação limpa, backup de dados, drivers atualizados e otimização para games. Atendimento remoto seguro 24h.',
  keywords: [
    'formatação de windows', 'formatar pc remoto', 'instalação windows 11', 'instalação windows 10',
    'suporte técnico informática', 'formatar notebook', 'backup de arquivos', 'otimização windows'
  ],
  alternates: {
    canonical: 'https://voltris.com.br/formatar-windows',
  },
  openGraph: {
    title: 'Formatação de Windows Profissional e Otimizada | VOLTRIS',
    description: 'Deixe seu computador como novo. Formatação profissional com backup e otimização gamer.',
    url: 'https://voltris.com.br/formatar-windows',
    type: 'website',
  }
};

export default function WindowsFormattingPage() {
  return (
    <>
      <JsonLd
        type="Service"
        data={{
          name: "Formatação de Windows Profissional",
          description: "Instalação limpa de Windows com backup e otimização de performance.",
          provider: {
            "@type": "Organization",
            "name": "VOLTRIS",
            "url": "https://voltris.com.br"
          },
          serviceType: "Suporte Técnico de Informática",
          areaServed: { "@type": "Country", "name": "Brasil" },
          offers: {
            "@type": "Offer",
            "price": "120.00",
            "priceCurrency": "BRL"
          }
        }}
      />
      <JsonLd
        type="FAQPage"
        data={{
          mainEntity: [
            {
              "@type": "Question",
              "name": "Quanto tempo demora a formatação do Windows?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "O processo leva entre 2 a 4 horas, garantindo backup completo e instalação de todos os drivers otimizados."
              }
            },
            {
              "@type": "Question",
              "name": "A formatação inclui otimização para jogos?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sim, em nossos planos Premium e Gamer incluímos o tuning do sistema para máximo FPS e menor latência."
              }
            }
          ]
        }}
      />
      <FormatarWindowsClient />
    </>
  );
}