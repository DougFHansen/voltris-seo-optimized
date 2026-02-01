
import { Metadata } from 'next';
import OtimizacaoPcClient from './OtimizacaoPcClient';

export const metadata: Metadata = {
  title: "Otimização de PC Gamer e Notebook Lento | Aumentar FPS - VOLTRIS",
  description: "Serviço de otimização de PC para jogos e trabalho. Aumente seu FPS, remova travamentos e acelere o Windows sem formatar. Atendimento remoto seguro e especializado.",
  keywords: [
    "otimização de pc gamer",
    "aumentar fps jogos",
    "pc lento o que fazer",
    "otimizar notebook",
    "limpeza de computador",
    "acelerar windows 10",
    "acelerar windows 11",
    "diminuir input lag",
    "otimização remota"
  ],
  openGraph: {
    title: "Otimização de PC Gamer e Notebook | Acelere seu Sistema - VOLTRIS",
    description: "Transforme seu computador com nossa otimização avançada. Mais FPS, menos travamentos e boot mais rápido. Garantia de resultado.",
    url: "https://voltris.com.br/otimizacao-pc",
    type: "website",
    images: [{ url: "/optimization-banner.jpg", width: 1200, height: 630 }]
  }
};

export default function OtimizacaoPcPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Otimização de PC Gamer e Workstation",
            "provider": {
              "@type": "Organization",
              "name": "VOLTRIS",
              "url": "https://voltris.com.br"
            },
            "serviceType": "Computer Optimization",
            "areaServed": {
              "@type": "Country",
              "name": "Brasil"
            },
            "offers": {
              "@type": "Offer",
              "price": "79.90",
              "priceCurrency": "BRL"
            }
          })
        }}
      />
      <OtimizacaoPcClient />
    </>
  );
}
