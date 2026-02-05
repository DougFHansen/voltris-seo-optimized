import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'fortnite-texturas-nao-carregam-streaming',
  title: "Fortnite: Texturas não carregam? Veja como resolver (2026)",
  description: "Seu Fortnite está com construções invisíveis ou texturas borradas? Aprenda como forçar o carregamento de texturas no guia de 2026.",
  category: 'games-fix',
  difficulty: 'Iniciante',
  time: '15 min'
};

const title = "Fortnite: Texturas não carregam? Veja como resolver (2026)";
const description = "Seu Fortnite está com construções invisíveis ou texturas borradas? Aprenda como forçar o carregamento de texturas no guia de 2026.";
const keywords = [
    'fortnite texturas nao carregam como resolver 2026',
    'construcoes invisiveis fortnite pc fix tutorial',
    'fortnite texturas borradas pc fraco guia completo',
    'resolver bug de mapa nao carregar fortnite 2026',
    'como forçar carregamento de texturas fortnite tutorial'
];

export const metadata: Metadata = createGuideMetadata('fortnite-texturas-nao-carregam-streaming', title, description, keywords);

export default function FortniteTexturesFixGuide() {
    const summaryTable = [
        { label: "Causa Principal", value: "Streaming de texturas via internet" },
        { label: "Solução Chave", value: "Pré-baixar ativos no Epic Launcher" },
        { label: "Hardware Culpado", value: "HDD Lento ou falta de VRAM" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "O pesadelo das construções de massinha em 2026",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, com o aumento da fidelidade visual do Fortnite, a Epic implementou um sistema onde o jogo baixa texturas enquanto você joga. Se a sua internet oscila ou se o seu disco (SSD/HD) não consegue ler os arquivos rápido o suficiente, você acaba caindo em um mapa que parece feito de "massinha" ou com construções que não carregam a colisão, fazendo você atravessar o chão.
        </p>
      `
        },
        {
            title: "1. A Solução do Epic Games Launcher",
            content: `
        <p class="mb-4 text-gray-300">Este é o passo mais eficaz para resolver o problema permanentemente:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Feche o jogo e abra o Epic Games Launcher.</li>
            <li>Vá em 'Biblioteca' e clique nos três pontos (...) sob o ícone do Fortnite.</li>
            <li>Clique em <strong>Opções</strong>.</li>
            <li>Certifique-se de que a caixa <strong>'Pré-baixar Ativos de Stream'</strong> esteja MARCADA.</li>
            <li>Desmarque a caixa 'Texturas de Alta Resolução' se você tem menos de 12GB de RAM ou pouco espaço.</li>
        </ol>
      `
        },
        {
            title: "2. Limite de FPS e Uso de Disco",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Poupe o Hardware:</h4>
            <p class="text-sm text-gray-300">
                Se o seu processador está em 100%, ele não consegue processar o carregamento do mapa. <br/><br/>
                No menu de vídeo do jogo, coloque um **Limite de Taxa de Quadros**. Se o seu monitor é 60Hz, limite a 60 FPS ou 120 FPS. Isso libera "folga" para que o seu PC foque em carregar as texturas e malhas de colisão antes que você chegue no solo após pular do ônibus.
            </p>
        </div>
      `
        },
        {
            title: "3. O \"Modo HDD\" e a Qualidade dos Shaders",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Check final 2026:</strong> 
            <br/><br/>Se você ainda joga em um HD mecânico, as construções sempre demorarão. Uma solução temporária é mudar a 'Malha' para o <strong>Baixo</strong> (Geometria Mobile). Isso faz com que o jogo exija muito menos velocidade de leitura do disco, fazendo com que as estruturas apareçam instantaneamente, embora com um visual menos detalhado. <br/><br/>
            <strong>Dica:</strong> Em 2026, certifique-se de que o Windows 11 está configurado para 'Modo de Jogo Ativado' em Configurações > Jogos.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/fortnite-modo-performance-pc-fraco",
            title: "Modo Performance",
            description: "Melhore o seu FPS após carregar as texturas."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Otimizar SSD",
            description: "Aumente a velocidade de leitura do jogo."
        },
        {
            href: "/guias/erro-disco-100-porcento-gerenciador-tarefas",
            title: "Disco 100%",
            description: "Veja se o seu HD é o verdadeiro culpado."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Fácil"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
