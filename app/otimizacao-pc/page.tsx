import { Metadata } from 'next';
import OtimizacaoPcClient from './OtimizacaoPcClient';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Otimização de PC e Aumento de FPS - Gamer & Profissional | VOLTRIS',
  description: 'Aumente o desempenho do seu PC Windows. Otimização profissional para jogos (FPS alto), trabalho e softwares pesados. Redução de input lag e travamentos.',
  keywords: [
    'otimização de pc', 'aumentar fps', 'reduzir input lag', 'otimizar windows para jogos',
    'acelerar pc lento', 'tuning windows', 'otimização gamer', 'limpeza de sistema'
  ],
  alternates: {
    canonical: 'https://voltris.com.br/otimizacao-pc',
  },
  openGraph: {
    title: 'Otimização Profissional de PC e Performance Windows | VOLTRIS',
    description: 'Máxima performance para seu computador. Ganhe até 40% mais FPS em seus jogos favoritos.',
    url: 'https://voltris.com.br/otimizacao-pc',
    type: 'website',
  }
};

export default function PcOptimizationPage() {
  return (
    <>
      <JsonLd
        type="Service"
        data={{
          name: "Otimização Profissional de PC",
          description: "Serviço especializado de tuning e otimização de Windows para máxima velocidade.",
          provider: {
            "@type": "Organization",
            "name": "VOLTRIS",
            "url": "https://voltris.com.br"
          },
          serviceType: "Informática e Tecnologia",
          areaServed: { "@type": "Country", "name": "Brasil" },
          offers: {
            "@type": "Offer",
            "price": "49.90",
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
              "name": "Quanto FPS ganho com a otimização da VOLTRIS?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Nossa otimização entregam entre 20% a 40% de ganho de FPS, dependendo do hardware."
              }
            },
            {
              "@type": "Question",
              "name": "O serviço de otimização de PC é seguro?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Totalmente. Nossos ajustes são feitos via registro de software e serviços do Windows."
              }
            }
          ]
        }}
      />
      <OtimizacaoPcClient />
    </>
  );
}