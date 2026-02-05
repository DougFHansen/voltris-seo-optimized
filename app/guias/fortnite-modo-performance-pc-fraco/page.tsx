import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'fortnite-modo-performance-pc-fraco',
  title: "Fortnite Modo Performance: Como ganhar FPS em 2026",
  description: "Quer rodar Fortnite a 240 FPS ou em um PC fraco? Aprenda como configurar o Modo Desempenho e otimizar o Windows 11 para o jogo em 2026.",
  category: 'games-fix',
  difficulty: 'Iniciante',
  time: '15 min'
};

const title = "Fortnite Modo Performance: Como ganhar FPS em 2026";
const description = "Quer rodar Fortnite a 240 FPS ou em um PC fraco? Aprenda como configurar o Modo Desempenho e otimizar o Windows 11 para o jogo em 2026.";
const keywords = [
    'fortnite modo performance pc fraco 2026',
    'como aumentar fps fortnite no notebook tutorial',
    'fortnite delay fix modo desempenho guia 2026',
    'melhores configurações fortnite pro settings tutorial',
    'ganhar fps fortnite windows 11 gamer guia'
];

export const metadata: Metadata = createGuideMetadata('fortnite-modo-performance-pc-fraco', title, description, keywords);

export default function FortnitePerformanceGuide() {
    const summaryTable = [
        { label: "Renderizador", value: "Desempenho (Fidelidade Gráfica Baixa)" },
        { label: "Check Vital", value: "Pré-baixar Texturas (Epic Launcher)" },
        { label: "Vantagem", value: "Menor Input Lag possível" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "O segredo dos Pros em 2026",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, o **Fortnite (Capítulo 7+)** é um jogo visualmente deslumbrante na Unreal Engine 5. Mas para quem quer competitividade, a beleza visual atrapalha. O **Modo de Desempenho** não serve apenas para computadores antigos; os melhores jogadores do mundo o utilizam para garantir que o FPS não caia no final da partida (end-game) e para que o atraso de resposta (input delay) seja o menor que a física permite.
        </p>
      `
        },
        {
            title: "1. Ativando o Modo Desempenho do jeito certo",
            content: `
        <p class="mb-4 text-gray-300">Não basta apenas mudar a opção no menu, você precisa configurar os sub-itens:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Vá em Configurações > Vídeo > Modo de Renderização.</li>
            <li>Selecione <strong>'Desempenho - Fidelidade Gráfica Baixa'</strong>.</li>
            <li>Reinicie o jogo.</li>
            <li>Agora, em Distância de Visão, use <strong>Longe (Epic)</strong> para enxergar inimigos, mas mantenha Texturas e Malhas no <strong>Baixo</strong>.</li>
        </ol>
      `
        },
        {
            title: "2. O erro fatal: Streaming de Texturas",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Libere seu HD/SSD:</h4>
            <p class="text-sm text-gray-300">
                Muitos jogadores sofrem com construções invisíveis ou texturas borradas em 2026. <br/><br/>
                Vá no Epic Games Launcher > Biblioteca > Clique nos 3 pontinhos do Fortnite > Opções. <br/>
                Marque a caixa <strong>'Desativar Streaming de Texturas'</strong> e <strong>'Pré-baixar Texturas de Alta Resolução'</strong>. Isso baixará cerca de 20GB extras, mas impedirá que o jogo tente baixar os modelos no meio da partida, acabando com as quedas bruscas de FPS.
            </p>
        </div>
      `
        },
        {
            title: "3. NVIDIA Reflex e Latência 2026",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Resposta Instantânea:</strong> 
            <br/><br/>No menu de vídeo embaixo, ative o **NVIDIA Reflex + Boost**. No Fortnite de 2026, isso reduz o tempo que leva para a sua construção aparecer na tela após o clique no mouse. Em monitores de alta frequência (144Hz+), a diferença na fluidez dos "edits" (edições) é brutal, te dando uma vantagem desleal contra quem joga no modo DirectX 12 com tudo no Ultra.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/fortnite-texturas-nao-carregam-streaming",
            title: "Fix Texturas",
            description: "Resolva o problema das construções que não carregam."
        },
        {
            href: "/guias/nvidia-refelx-on-vs-boost-diferenca",
            title: "Guia NVIDIA Reflex",
            description: "Entenda a tecnologia por trás do delay zero."
        },
        {
            href: "/guias/reduzir-ping-jogos-online",
            title: "Reduzir Ping",
            description: "Dicas para não dar lag nas builds."
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
