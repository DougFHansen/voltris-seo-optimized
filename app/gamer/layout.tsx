import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Otimização Gamer Profissional | +FPS & -Input Lag | VOLTRIS",
  description: "Dobre seu FPS e reduza o input lag com otimização profissional para eSports. Especialistas em VALORANT, CS2, Warzone e Fortnite. 100% Remoto.",
  keywords: ["otimização gamer", "ganhar fps", "reduzir input lag", "tuning windows gamer", "overclock seguro ram", "suporte gamer remoto"],
  openGraph: {
    title: "Domine o Servidor com a VOLTRIS Gamer",
    description: "Tuning profissional de PC para quem busca competitividade máxima.",
    images: [{ url: '/logo.png' }],
  }
};

export default function GamerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
