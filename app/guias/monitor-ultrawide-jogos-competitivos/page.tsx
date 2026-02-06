import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'monitor-ultrawide-jogos-competitivos',
    title: "Monitor Ultrawide (21:9): Black Bars no Valorant e Fix de HUD",
    description: "Ultrawide é lindo, mas pode ser um pesadelo em jogos competitivos. Aprenda a configurar barras pretas (4:3 ou 16:9) e usar Flawless Widescreen em jogos sem suporte.",
    category: 'hardware',
    difficulty: 'Intermediário',
    time: '20 min'
};

const title = "Ultrawide Gaming (2026): Vantagem ou Dor de Cabeça?";
const description = "Em jogos de corrida, o 21:9 é imbatível. Em Valorant, é proibido. Aprenda a domar seu monitor largo para ter o melhor dos dois mundos.";

const keywords = [
    'valorant ultrawide black bars fix',
    'como jogar cs2 em ultrawide 4:3 esticado',
    'flawless widescreen elden ring tutorial',
    'monitor 21:9 jogos competitivos desvantagem',
    'hud fix ultrawide mods',
    'jogar 16:9 em monitor 21:9 sem distorção',
    'samsung odyssey g9 configuração jogos',
    'melhor fov para ultrawide',
    'voltris optimizer resolution',
    'escala de gpu nvidia painel de controle'
];

export const metadata: Metadata = createGuideMetadata('monitor-ultrawide-jogos-competitivos', title, description, keywords);

export default function UltrawideGuide() {
    const summaryTable = [
        { label: "Valorant", value: "Black Bars (Obrigatório)" },
        { label: "CS2", value: "Suporta 21:9 (Vantagem)" },
        { label: "LoL/Dota", value: "Suporta (Visão Mapa)" },
        { label: "Elden Ring", value: "Mod (Flawless WS)" },
        { label: "Escala", value: "Sem Escala (GPU)" },
        { label: "Stream", value: "16:9 (Canvas)" },
        { label: "HUD", value: "Centralizado" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Problema do FOV",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em jogos competitivos táticos (Valorant, Overwatch), os desenvolvedores bloqueiam o suporte a 21:9 para evitar que você tenha vantagem de visão periférica sobre quem usa 16:9. Já em LoL e CoD, é permitido.
        </p>
      `
        },
        {
            title: "Capítulo 1: Valorant (Fixed Black Bars)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Como jogar sem esticar?</h4>
                <p class="text-gray-400 text-xs text-justify">
                    Se você abrir Valorant em 2560x1080, o jogo vai cortar o topo e o chão (Zoom), te deixando em desvantagem.
                    <br/>Solução: Jogue em <strong>1920x1080 (16:9)</strong> com barras pretas laterais.
                    <br/>No Painel Nvidia > Ajustar tamanho e posição da área de trabalho > Aba "Escala":
                    <br/>Selecione <strong>"Taxa de Proporção"</strong> (Aspect Ratio) e "Executar escala em: <strong>GPU</strong>".
                    <br/>Assim, o monitor exibe o 1080p perfeito no centro, com bordas pretas, sem distorção.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Flawless Widescreen (Jogos Offline)",
            content: `
        <p class="mb-4 text-gray-300">
            Muitos jogos japoneses (Elden Ring, Sekiro, Final Fantasy) não suportam 21:9 nativamente e colocam barras pretas.
            <br/>Baixe o <strong>Flawless Widescreen</strong>.
            <br/>Ele injeta um fix na memória do jogo que remove as barras pretas e ajusta o HUD.
            <br/><em>Atenção:</em> Em Elden Ring, isso exige desativar o Anti-Cheat (modo offline), senão dá ban.
        </p>
      `
        },
        {
            title: "Capítulo 3: Vantagem em MOBA (LoL/Dota)",
            content: `
        <p class="mb-4 text-gray-300">
            Em League of Legends, 21:9 é OP (Overpowered).
            <br/>Você vê o Jungler chegando pelos lados antes de um jogador normal.
            <br/>Recomendação: Ative "Minimapa no lado direito" nas opções, mas cuidado para não cansar o pescoço olhando para os cantos distantes da tela. Aumente a escala do minimapa para compensar.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Streaming (Twitch/YouTube)",
            content: `
        <p class="mb-4 text-gray-300">
            Transmitir em 21:9 é ruim para quem assiste no celular (ficam barras pretas gigantes em cima e embaixo).
            <br/>No OBS Studio:
            <br/>Defina a "Tela Base" como 2560x1080.
            <br/>Defina a "Tela de Saída" como 1920x1080.
            <br/>Isso vai espremer a imagem? Sim.
            <br/>Melhor opção: Mude o jogo para 1920x1080 (Janela sem bordas) ou configure o OBS para cortar as laterais e focar no centro da ação.
        </p>
      `
        },
        {
            title: "Capítulo 5: HUD Centralizado",
            content: `
        <p class="mb-4 text-gray-300">
            Em jogos de tiro (Battlefield, CoD), ter a munição e minimapa nos cantos extremos da tela 21:9 te obriga a tirar o olho da mira.
            <br/>Procure nas opções de vídeo por: <strong>"Safe Area Boundary"</strong> ou "Limites do HUD".
            <br/>Aperte o HUD para o centro, como se fosse um monitor 16:9.
        </p>
      `
        },
        {
            title: "Capítulo 6: 32:9 (Super Ultrawide)",
            content: `
        <p class="mb-4 text-gray-300">
            Monitores como o Odyssey G9 (32:9) são equivalentes a dois monitores de 27" colados.
            <br/>Exigem PLACA DE VÍDEO MUITO FORTE. É quase resolução 4K em número de pixels. Se tiver uma RTX 3060, esqueça jogos modernos no Ultra em 32:9.
        </p>
      `
        },
        {
            title: "Capítulo 7: Windows FancyZones",
            content: `
        <p class="mb-4 text-gray-300">
            Para produtividade e multitarefa enquanto espera a fila do jogo:
            <br/>Instale o <strong>Microsoft PowerToys</strong>.
            <br/>Use o "FancyZones" para dividir seu monitor em 3 áreas virtuais.
            <br/>Centro: Jogo (em modo janela). Esquerda: Discord. Direita: Spotify/Browser.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Cutscenes Esticadas",
            content: `
            <p class="mb-4 text-gray-300">
                Muitos jogos renderizam cutscenes pré-gravadas em 16:9.
                <br/>Em monitor 21:9, elas podem ficar esticadas (Geraldo gordo) ou com barras pretas. Geralmente não há fix para vídeos pré-gravados, aceite.
            </p>
            `
        },
        {
            title: "Capítulo 9: Curved vs Flat",
            content: `
            <p class="mb-4 text-gray-300">
                Em Ultrawide, a curva (1500R ou 1000R) é essencial para trazer as bordas para o seu campo de visão sem distorção de cor (IPS Glow). Evite Ultrawides planos se for sentar perto.
            </p>
            `
        },
        {
            title: "Capítulo 10: 4:3 Stretched no Ultrawide",
            content: `
            <p class="mb-4 text-gray-300">
                É possível jogar CS2 "esticado" no Ultrawide? Sim, os bonecos ficam imensos.
                <br/>Mas a distorção horizontal é tão grande que a sensibilidade do mouse X/Y fica muito diferente. Apenas para quem é maníaco por alvos grandes.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Perco FPS mudando de 1080p pra Ultrawide?",
            answer: "Sim, cerca de 25% a 30% de perda. Um monitor 2560x1080 tem 30% mais pixels que um 1920x1080."
        },
        {
            question: "Valorant vai suportar 21:9 um dia?",
            answer: "A Riot já disse que não. É uma decisão de design competitivo para manter a integridade do e-sport."
        },
        {
            question: "Onde baixar mods ultrawide?",
            answer: "O site PCGamingWiki é a bíblia. Procure o jogo lá e veja a seção 'Ultrawide' para fixes e patches da comunidade."
        }
    ];

    const externalReferences = [
        { name: "Flawless Widescreen Download", url: "https://www.flawlesswidescreen.org/" },
        { name: "PCGamingWiki", url: "https://www.pcgamingwiki.com/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/monitor-hz-configuracao-correta",
            title: "Configurar Hz",
            description: "Garanta que os 144hz funcionem."
        },
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Painel Nvidia",
            description: "Ajuste de escala GPU."
        },
        {
            href: "/guias/obs-studio-melhores-configuracoes-stream",
            title: "OBS Studio",
            description: "Streaming em 21:9."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            externalReferences={externalReferences}
        />
    );
}
