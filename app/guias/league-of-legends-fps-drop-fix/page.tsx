import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "League of Legends: Como resolver quedas de FPS e Travadas (2026)";
const description = "Seu LoL está travando em lutas de equipe (Teamfights)? Aprenda as melhores configurações para ganhar FPS e remover o lag no League of Legends em 2026.";
const keywords = [
    'league of legends queda de fps 2026 como resolver',
    'lol travando na teamfight pc fraco tutorial',
    'melhores configurações de video lol para fps',
    'como aumentar fps league of legends notebook gamer 2026',
    'corrigir erro de lag de entrada lol windows 11'
];

export const metadata: Metadata = createGuideMetadata('league-of-legends-fps-drop-fix', title, description, keywords);

export default function LoLPerformanceGuide() {
    const summaryTable = [
        { label: "Modo de Janela", value: "Sem Bordas (Borderless) ou Tela Cheia" },
        { label: "Check de Hardware", value: "Desativar Movimento Relativo (In-game)" },
        { label: "Sombras", value: "DESATIVADO (Ganho massivo de FPS)" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "O Desafio do LoL em 2026",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Mesmo em 2026, o **League of Legends** continua sendo um jogo que depende muito de um único núcleo do processador (Single-Core Performance). É comum ver jogadores com placas de vídeo potentes sofrendo com quedas de FPS para menos de 60 durante lutas com muitos efeitos visuais. O segredo para estabilizar o LoL não é apenas baixar tudo para o mínimo, mas sim configurar o Windows para não interromper o processo do jogo.
        </p>
      `
        },
        {
            title: "1. A Configuração 'Mágica' das Sombras",
            content: `
        <p class="mb-4 text-gray-300">No League of Legends, as sombras são processadas totalmente pela CPU:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Sombras:</strong> Coloque em <strong>Desativado</strong>. Sim, o jogo perde um pouco de profundidade visual, mas as quedas de FPS em lutas de equipe serão reduzidas em até 40%.</li>
            <li><strong>Qualidade dos Personagens:</strong> Pode manter no Médio ou Alto, o impacto é baixo.</li>
            <li><strong>Qualidade dos Efeitos:</strong> Se estiver no Ultra, as skills (habilidades) podem causar travadinhas quando são usadas pela primeira vez na partida. Recomendamos o <strong>Médio</strong>.</li>
        </ul >
      `
        },
        {
            title: "2. DirectX 9 de Legado (Dica para PCs Antigos)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Compatibilidade:</h4>
            <p class="text-sm text-gray-300">
                Se você joga em um PC muito antigo que não suporta bem o DirectX 11, o LoL tem uma opção secreta no cliente (engrenagem) chamada <strong>'Preferir Modo de Legado DX9'</strong>. Isso pode estabilizar o FPS em máquinas de 2015-2018, mas evite usá-lo em PCs modernos de 2026, pois o DX11 é muito mais eficiente em hardware recente.
            </p>
        </div>
      `
        },
        {
            title: "3. Limite de FPS e Input Lag",
            content: `
        <p class="mb-4 text-gray-300">
            Nunca deixe o FPS como "Ilimitado". Se o seu monitor é de 75Hz e seu PC alcança 200 FPS, a CPU está trabalhando dobrado sem necessidade, o que causa calor e eventuais quedas bruscas. 
            <br/><br/><strong>Dica:</strong> Trave o FPS em um valor estável que seu PC consiga manter sempre (ex: 144 FPS). Isso garante um <strong>Frametime</strong> constante, o que é muito mais importante para a sua memória muscular de cliques do que um número alto que oscila.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/league-of-legends-tela-preta-carregamento",
            title: "Erro de Tela Preta",
            description: "Resolva problemas ao entrar na partida."
        },
        {
            href: "/guias/reduzir-ping-jogos-online",
            title: "Reduzir Ping",
            description: "Dicas de rede para evitar o 'Lag' no LoL."
        },
        {
            href: "/guias/otimizacao-performance",
            title: "Performance Windows",
            description: "Ajuste o Windows para jogos leves."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
