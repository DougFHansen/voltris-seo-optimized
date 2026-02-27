import { Metadata } from 'next';
import ErrosJogosClient from './ErrosJogosClient';

export const metadata: Metadata = {
  title: 'Correção de Erros em Jogos: VAN9003, GTA V, CS2, Roblox e + | VOLTRIS',
  description: 'Solução imediata para erros críticos: VAN9003 (Valorant), crashes no GTA V/FiveM, Erros de VAC no CS2, Erro 268 no Roblox e falhas de DLL. Suporte técnico gamer remoto especializado.',
  keywords: [
    'correção de erros em jogos', 'VAN9003 fix valorant', 'vanguard secure boot fix',
    'GTA V crash loading fix', 'FiveM handshake error', 'CS2 VAC verification fix',
    'Roblox error 268 fix', 'Minecraft OpenGL 65542 fix', 'Fortnite EAC error',
    'erro de DLL jogo', '0xc000007b fix', 'suporte gamer remoto', 'voltris optimizer games'
  ],
  openGraph: {
    title: 'Correção de Erros em Jogos - Suporte Técnico Gamer Especializado | VOLTRIS',
    description: 'Resolvemos VAN9003, crashes no GTA, Erros de VAC e Roblox 268 remotamente em minutos. Volte a jogar agora!',
    url: 'https://voltris.com.br/erros-jogos',
    type: 'website',
    images: [{ url: '/logo-seo-gamer.png', width: 1200, height: 630 }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Corrija Erros no Valorant, GTA, CS2 e Roblox Agora | VOLTRIS',
    images: ['/logo-seo-gamer.png']
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
