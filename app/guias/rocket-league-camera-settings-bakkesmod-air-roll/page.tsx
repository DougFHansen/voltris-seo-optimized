import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'rocket-league-camera-settings-bakkesmod-air-roll',
    title: "Rocket League (2026): Camera Settings, BakkesMod e Air Roll",
    description: "Jogue como um Grand Champ. Guia de Camera Settings, instalação do BakkesMod, Air Roll Direita/Esquerda e Deadzone quadrado.",
    category: 'otimizacao',
    difficulty: 'Iniciante',
    time: '15 min'
};

const title = "Rocket League Pro: Câmera e Controles";
const description = "Rocket League com as configurações padrão é injogável. O 'Camera Shake' te deixa tonto e o FOV limitado te deixa cego. Aprenda a configurar como os profissionais da RLCS.";

const keywords = [
    'melhores camera settings rocket league 2026',
    'bakkesmod download epic games steam',
    'air roll left vs right qual usar',
    'deadzone quadrado controller settings',
    'rocket league input lag fix pc',
    'alpha console textures',
    'voltris optimizer rl'
];

export const metadata: Metadata = createGuideMetadata('rocket-league-camera-settings-bakkesmod-air-roll', title, description, keywords);

export default function RLGuide() {
    const summaryTable = [
        { label: "FOV", value: "110 (Máximo)" },
        { label: "Distance", value: "260 - 280" },
        { label: "Height/Angle", value: "100 / -4.00" },
        { label: "Camera Shake", value: "OFF (Crime)" },
        { label: "BakkesMod", value: "Essencial (Treino)" },
        { label: "FPS", value: "Uncapped / 360" },
        { label: "Air Roll", value: "Directional (L/R)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Básico Obrigatório",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Abra o jogo agora. Vá em Settings > Camera.
          <br/>Desligue <strong>Camera Shake</strong>.
          <br/>Se você joga com isso ligado, você está jogando no modo Hard. A tela treme a cada toque na bola, impedindo precisão.
        </p>
      `
        },
        {
            title: "Capítulo 1: Camera Settings (O Padrão Pro)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Configuração RLCS</h4>
                <p class="text-gray-400 text-xs text-justify">
                    - <strong>Field of View:</strong> 110.
                    - <strong>Distance:</strong> 270.
                    - <strong>Height:</strong> 100.
                    - <strong>Angle:</strong> -4.00 ou -3.00.
                    - <strong>Stiffness:</strong> 0.40 a 0.50 (Quanto maior, mais "dura" a câmera fica presa no carro. Menor = atrasa mais no supersônico).
                    - <strong>Swivel Speed:</strong> 4.00 a 6.00.
                    - <strong>Transition Speed:</strong> 1.20 a 1.50 (Velocidade da troca Carro/Bola).
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Controles e Deadzone",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Steering Sensitivity:</strong> 1.30 a 1.70. (Comece com 1.40).
            - <strong>Aerial Sensitivity:</strong> 1.30 a 1.70.
            - <strong>Controller Deadzone:</strong> 0.05 a 0.10. (Use o menor possível sem o carro virar sozinho/drift). Quanto menor, mais rápido o carro responde.
            - <strong>Dodge Deadzone:</strong> 0.50 a 0.80. (Evita que você dê backflip sem querer quando quer voar rápido).
        </p>
      `
        },
        {
            title: "Capítulo 3: BakkesMod (O Poder em suas mãos)",
            content: `
        <p class="mb-4 text-gray-300">
            Funciona na Steam e Epic Games.
            <br/>1. Baixe em bakkesmod.com.
            <br/>2. Instale. (Pressione F2 no jogo para abrir).
            <br/>Recursos:
            <br/>- <strong>Freeplay:</strong> Aperte setas no D-Pad para a bola vir até você, ir pro teto ou pro gol.
            <br/>- <strong>Items:</strong> Use qualquer decalque (Alpha Boost, White Zombas) de graça (só você vê, client-side).
            <br/>- <strong>Plugins:</strong> Mostra MMR nas partidas casuais/ranked.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Air Roll Direcional",
            content: `
        <p class="mb-4 text-gray-300">
            Não use apenas o "Air Roll" geral (aquele que você segura e usa o analógico).
            <br/>Mapeie "Air Roll Right" ou "Air Roll Left" em botões específicos (Quadrado/Círculo ou Bumpers L1/R1).
            <br/>Isso permite girar no eixo E virar o carro ao mesmo tempo (Tornado Spin), impossível com o Air Roll normal. Essencial para mecânicas aéreas.
        </p>
      `
        },
        {
            title: "Capítulo 5: Deadzone Quadrado (Steam Input)",
            content: `
        <p class="mb-4 text-gray-300">
            O analógico é redondo. Mas os cantos (diagonais perfeitas) são essenciais para speedflip.
            <br/>Alguns pros mudam a deadzone para "Square" ou "Cross" via Steam Controller Settings ou DS4Windows.
            <br/>Isso faz com que o carro atinja 100% do input diagonal mais rápido. Teste e veja se gosta.
        </p>
      `
        },
        {
            title: "Capítulo 6: Video Settings para FPS",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Anti-Aliasing:</strong> OFF.
            - <strong>Render Quality:</strong> High Quality. (Não baixe isso, a bola fica pixelada longe).
            - <strong>Render Detail:</strong> Performance ou High Quality (texturas do chão).
            - <strong>World Detail:</strong> Performance (Remove grama e torcida, ajuda a concentrar e ganha FPS).
            - <strong>Transparent Goalposts:</strong> ON (Obrigatório, senão você não vê através da trave).
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 7: Workshop Maps (Epic Games)",
            content: `
            <p class="mb-4 text-gray-300">
                Na Steam é fácil. Na Epic, instale o plugin do BakkesMod "Rocket Plugin" ou "Workshop Map Loader".
                <br/>Baixe mapas de treino de Rings (Anéis) para treinar voo.
            </p>
            `
        },
        {
            title: "Capítulo 8: Som",
            content: `
            <p class="mb-4 text-gray-300">
                Gameplay Audio: High.
                <br/>Ambient/Crowd: Mute ou baixo. O barulho da torcida atrapalha ouvir o boost do inimigo.
            </p>
            `
        },
        {
            title: "Capítulo 9: Cross-Network Play",
            content: `
            <p class="mb-4 text-gray-300">
                Deixe ligado. Jogadores de console geralmente têm input lag maior e FPS menor (vantagem para você no PC).
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "BakkesMod dá ban?",
            answer: "Não. A Psyonix aprovou o uso do BakkesMod desde que não dê vantagem injusta (como prever onde a bola vai cair em partidas online)."
        },
        {
            question: "Qual melhor carro?",
            answer: "Octane (All-round) e Fennec (Hitbox igual Octane, mas visual quadrado ajuda a entender o toque). Dominus (Plano, bom para flicks)."
        }
    ];

    const externalReferences = [
        { name: "BakkesMod", url: "https://bakkesmod.com/" },
        { name: "Liquipedia Camera Settings", url: "https://liquipedia.net/rocketleague/List_of_player_camera_settings" }
    ];

    const relatedGuides = [
        {
            href: "/guias/controle-ps4-ps5-overclock-ds4windows",
            title: "Overclock Controle",
            description: "Essencial."
        },
        {
            href: "/guias/dns-mais-rapido-para-jogos-benchmark",
            title: "Ping",
            description: "Corrigir Packet Loss."
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
