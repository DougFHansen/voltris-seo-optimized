import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'perda-de-pacote-packet-loss-fix',
  title: "Perda de Pacote (Packet Loss): Como diagnosticar e resolver (2026)",
  description: "Seu personagem está 'teletransportando' ou o jogo trava do nada? Aprenda a resolver a Perda de Pacote e estabilize sua conexão para jogos em 2026.",
  category: 'games-fix',
  difficulty: 'Intermediário',
  time: '15 min'
};

const title = "Perda de Pacote (Packet Loss): Como diagnosticar e resolver (2026)";
const description = "Seu personagem está 'teletransportando' ou o jogo trava do nada? Aprenda a resolver a Perda de Pacote e estabilize sua conexão para jogos em 2026.";
const keywords = [
    'como resolver perda de pacote jogos 2026 tutorial',
    'packet loss fix valorant cs2 lol guia',
    'o que causa perda de pacote no wifi tutorial 2026',
    'comando cmd para ver perda de pacotes tutorial',
    'exitlag resolve perda de pacotes guia definitivo'
];

export const metadata: Metadata = createGuideMetadata('perda-de-pacote-packet-loss-fix', title, description, keywords);

export default function PacketLossGuide() {
    const summaryTable = [
        { label: "O que é", value: "Dados que 'somem' entre seu PC e o Servidor" },
        { label: "Sintoma", value: "Teletransporte, ações que não saem" },
        { label: "Causa #1", value: "Internet via Wi-Fi ou Cabos ruins" },
        { label: "Solução Pro", value: "Software de Rotas (ExitLag/NoPing)" }
    ];

    const contentSections = [
        {
            title: "O que é o Packet Loss?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Imagine que você está jogando Valorant. Você clica para atirar, mas o tiro não sai. No segundo seguinte, você aparece morto em outro lugar. Isso é o **Packet Loss**. Ao contrário do "Ping alto" (onde o dado demora a chegar), na Perda de Pacote o dado **simplesmente não chega**. Em 2026, com redes 5G e fibra óptica, a perda de pacotes geralmente acontece dentro da sua casa ou na "rota" que a sua operadora usa.
        </p>
      `
        },
        {
            title: "1. Diagnóstico via CMD",
            content: `
        <p class="mb-4 text-gray-300">Descubra onde o dado está sumindo:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Abra o Prompt de Comando (CMD).</li>
            <li>Digite: <code>ping google.com -t</code>.</li>
            <li>Deixe rodar por 1 minuto. Observe se aparece a mensagem <strong>'Esgotado o tempo limite do pedido'</strong>.</li>
            <li>Se aparecer mais de 1%, você tem um problema físico na sua rede ou na sua operadora.</li>
        </ol>
      `
        },
        {
            title: "2. Wi-Fi vs Cabo (O Grande Culpado)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Inimigo do Gamer:</h4>
            <p class="text-sm text-gray-300">
                O Wi-Fi, mesmo o Wi-Fi 6 ou 7 de 2026, sofre interferências de paredes, fornos micro-ondas e redes de vizinhos. Essas interferências causam quedas momentâneas de pacotes. <strong>Para jogos competitivos, o cabo Ethernet (preferencialmente CAT6) é obrigatório</strong>. Se você não puder passar um cabo, considere adaptadores Powerline, que usam a fiação elétrica da casa.
            </p>
        </div>
      `
        },
        {
            title: "3. Problemas de Rota da Operadora",
            content: `
        <p class="mb-4 text-gray-300">
            Às vezes, sua internet está perfeita, mas o "caminho" que ela faz até o servidor do jogo está congestionado. 
            <br/><br/><strong>Dica:</strong> Use softwares de tunelamento como <strong>ExitLag</strong> ou <strong>NoPing</strong> em 2026. Eles não diminuem o seu ping fisicamente, mas eles mudam a sua rota para uma estrada privada e livre de trânsito, o que elimina quase 100% da perda de pacotes causada pela infraestrutura da sua operadora.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/reduzir-ping-jogos-online",
            title: "Reduzir Ping",
            description: "Dicas extras de conectividade."
        },
        {
            href: "/guias/melhor-dns-jogos-2026",
            title: "Melhor DNS",
            description: "Ajude o sistema a encontrar rotas melhores."
        },
        {
            href: "/guias/troubleshooting-internet",
            title: "Reparo de Rede",
            description: "Como resetar drivers de rede bugados."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
