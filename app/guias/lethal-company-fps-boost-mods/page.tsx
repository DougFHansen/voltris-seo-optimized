import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'lethal-company-fps-boost-mods',
    title: "Lethal Company (2026): FPS Boost, Mods e Lag Fix",
    description: "Lethal Company é leve, mas mods como MoreCompany pesam. Aprenda a instalar mods sem perder FPS e usar o HDLethalCompany para gráficos melhores.",
    category: 'jogos',
    difficulty: 'Iniciante',
    time: '15 min'
};

const title = "Lethal Company (2026): Performance e Mods";
const description = "O jogo viral 'low poly' roda em qualquer batata? Quase. Quando você instala 50 mods e coloca 16 pessoas no servidor, a história muda.";

const keywords = [
    'lethal company fps boost mod 2026',
    'more company mod lag fix',
    'hdll lethal company graphics settings',
    'thunderstore mod manager tutorial',
    'bepinex lethal company install',
    'lethal company tela preta fix',
    'ship loot lag fix',
    'voltris optimizer zeekerss',
    'mic lag lethal company'
];

export const metadata: Metadata = createGuideMetadata('lethal-company-fps-boost-mods', title, description, keywords);

export default function LethalGuide() {
    const summaryTable = [
        { label: "Mod Manager", value: "R2Modman / Thunderstore" },
        { label: "Performance", value: "HDLethalCompany (Mod)" },
        { label: "Lobby Size", value: "Vanilla (4) / Modded (32)" },
        { label: "Microfone", value: "Push to Talk" },
        { label: "Resolution", value: "Nativa (Pixel Art)" },
        { label: "Shadows", value: "Low (Padrão)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Charme Low Poly",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O jogo propositalmente renderiza em resolução baixa (512x512 esticado) para parecer fita VHS. Isso é leve para a GPU. O gargalo é a CPU e a sincronização de mods entre jogadores.
        </p>
      `
        },
        {
            title: "Capítulo 1: Thunderstore / RModman",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Gerenciador Obrigatório</h4>
                <p class="text-gray-400 text-xs text-justify">
                    Não instale mods manualmente jogando na pasta.
                    <br/>1. Baixe o <strong>R2Modman</strong> (ou Thunderstore App).
                    <br/>2. Selecione Lethal Company.
                    <br/>3. Instale "BepInExPack" (A base de tudo).
                    <br/>Isso garante que os mods carreguem na ordem certa e você possa compartilhar o "Code" do perfil com amigos para todos terem os mesmos mods.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Mods de Performance (HDLethal)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>HDLethalCompany:</strong> Permite aumentar a resolução interna do jogo, remover o serrilhado e ajustar sombras. Se tiver PC forte, use para deixar o jogo lindo. Se tiver fraco, use para baixar a neblina.
            - <strong>CullFactory:</strong> Um mod que melhora o "Occlusion Culling", fazendo o jogo não renderizar salas que você não está vendo dentro da fábrica. Ganha +20 FPS em interiores.
        </p>
      `
        },
        {
            title: "Capítulo 3: MoreCompany / BiggerLobby",
            content: `
        <p class="mb-4 text-gray-300">
            Jogar com 16 amigos é caos puro.
            <br/>Contudo, o voice chat de 16 pessoas sobrecarrega a banda.
            <br/>Se todos falarem ao mesmo tempo na nave, o FPS cai.
            <br/>Recomendação: Usem Walkie-Talkies para separar os grupos e aliviar o áudio espacial de proximidade.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Loot na Nave (Ship Lag)",
            content: `
        <p class="mb-4 text-gray-300">
            Acumular 500 sucatas no chão da nave causa lag.
            <br/>A física de colisão de cada parafuso é calculada.
            <br/>Venda a sucata regularmente na "Company Building". Não acumule por 10 dias ("High Quota run") se seu PC não aguentar.
        </p>
      `
        },
        {
            title: "Capítulo 5: Late Join Mod",
            content: `
        <p class="mb-4 text-gray-300">
            Permite que amigos entrem no meio da partida (orbit).
            <br/>Essencial para não ter que refazer o lobby cada vez que alguém cai ou chega atrasado.
        </p>
      `
        },
        {
            title: "Capítulo 6: Resolução e Aspect Ratio",
            content: `
        <p class="mb-4 text-gray-300">
            O jogo força 4:3 ou 16:9. Em Ultrawide fica com barras pretas.
            <br/>Mods de Ultrawide existem, mas quebram a UI do capacete (HUD). Jogue em 16:9 para a experiência "correta" pretendida pelo Zeekerss.
        </p>
      `
        },
        {
            title: "Capítulo 7: Voice Chat Lag",
            content: `
        <p class="mb-4 text-gray-300">
            Se a voz dos outros corta ou laga:
            <br/>Não é sua internet, é o processamento de áudio do Unity.
            <br/>Feche o Discord se estiver usando o chat do jogo. Rodar dois processamentos de voz pesa na CPU.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Skinwalker Mod (Cuidado)",
            content: `
            <p class="mb-4 text-gray-300">
                O mod que grava a voz dos seus amigos e faz os monstros repetirem.
                <br/>Ele grava áudio no disco. Isso pode causar micro-travadas (stutter) quando o monstro "fala", se seu jogo não estiver no SSD.
            </p>
            `
        },
        {
            title: "Capítulo 9: Lanterna e Sombras",
            content: `
            <p class="mb-4 text-gray-300">
                A lanterna projeta sombras dinâmicas.
                <br/>Se tiver 4 jogadores com lanternas acesas num corredor apertado, o FPS cai.
                <br/>Apaguem as lanternas se não precisarem. (Ecologicamente correto e salva FPS).
            </p>
            `
        },
        {
            title: "Capítulo 10: Tela Preta (Mods Incompatíveis)",
            content: `
            <p class="mb-4 text-gray-300">
                Se o jogo não abrir:
                <br/>Desative todos os mods no R2Modman. Ative um por um.
                <br/>Geralmente é conflito entre versões diferentes do BepInEx ou mods desatualizados após um patch do jogo.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Preciso de PC Gamer?",
            answer: "Não. Lethal Company roda em vídeo integrado (Vega 8, Intel Iris) a 30-40 FPS tranquilamente no Low."
        },
        {
            question: "Como instalar mods para todos?",
            answer: "No R2Modman, vá em Settings > Profile > Export profile as code. Mande o código (ex: a-1234) para seus amigos. Eles vão em Import > From Code. Pronto, 100% sincronizado."
        },
        {
            question: "Monstros invisíveis?",
            answer: "Desync. O Host viu o monstro, você não. Saiam e entrem na lua novamente (re-land)."
        }
    ];

    const externalReferences = [
        { name: "Thunderstore (Mods)", url: "https://thunderstore.io/c/lethal-company/" },
        { name: "Zeekerss (Dev)", url: "https://twitter.com/ZeekerssRBLX" }
    ];

    const relatedGuides = [
        {
            href: "/guias/discord-otimizacao-overlay-lag",
            title: "Discord",
            description: "Alternativa de voz."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD",
            description: "Ajuda nos mods."
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
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            externalReferences={externalReferences}
        />
    );
}
