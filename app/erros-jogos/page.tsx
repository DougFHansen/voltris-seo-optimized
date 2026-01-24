import { Metadata } from 'next';
import ErrosJogosClient from './ErrosJogosClient';

export const metadata: Metadata = {
  title: 'Correção de Erros em Jogos - GTA, CS2, Cyberpunk e Mais | VOLTRIS',
  description: 'Correção de erros em jogos populares como GTA, CS2, Cyberpunk 2077, Valorant, League of Legends e outros. Suporte técnico especializado em jogos. Atendimento remoto 24h.',
  keywords: [
    'erros GTA', 'erros CS2', 'erros Cyberpunk', 'erros jogos', 'correção erros jogos',
    'suporte técnico gamer', 'fps baixo fix', 'erro dll jogo', 'crash jogo fix', 'valorant vanguard fix'
  ],
  openGraph: {
    title: 'Correção de Erros em Jogos - GTA, CS2, Cyberpunk e Mais | VOLTRIS',
    description: 'Correção de erros em jogos populares como GTA, CS2, Cyberpunk 2077, Valorant, League of Legends e outros. Atendimento remoto 24h.',
    url: 'https://voltris.com.br/erros-jogos',
    type: 'website',
    images: [{ url: '/remotebanner.jpg', width: 1200, height: 630 }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Correção de Erros em Jogos - GTA, CS2, Cyberpunk e Mais | VOLTRIS',
    images: ['/remotebanner.jpg']
  }
};

export default function ErrosJogosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Correção de Erros em Jogos",
            "description": "Suporte técnico remoto para correção de erros em jogos populares (GTA, CS2, etc).",
            "provider": {
              "@type": "Organization",
              "name": "VOLTRIS",
              "url": "https://voltris.com.br"
            },
            "serviceType": "Suporte Técnico para Jogos",
            "areaServed": { "@type": "Country", "name": "Brasil" }
          })
        }}
      />
      <ErrosJogosClient />
    </>
  );
}
