import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'citra-lime3ds-emulador-3ds-pokemon-hd',
    title: "Citra / Lime3DS (2026): Pokémon e Zelda 3DS em 4K",
    description: "O Citra acabou, viva o Lime3DS. Guia completo para rodar Pokémon X/Y, Omega Ruby e Zelda Link Between Worlds com gráficos HD e sem lag.",
    category: 'emulacao',
    difficulty: 'Intermediário',
    time: '20 min'
};

const title = "3DS Remaster: Lime3DS (Fork do Citra)";
const description = "Após o fechamento do Yuzu/Citra, o Lime3DS assumiu o bastão. Ele roda jogos de 3DS com texturas upscale, suporte a save states e multiplayer local.";

const keywords = [
    'lime3ds vs pablo mk7 citra fork',
    'pokemon x y black screen fix android',
    'zelda ocarina of time 3d 4k texture pack',
    'descriptografar cia 3ds decryptor',
    'configurar duas telas citra layout',
    'multiplayer local 3ds emulador',
    'voltris optimizer nintendo',
    'cheat codes pokemon randomizer'
];

export const metadata: Metadata = createGuideMetadata('citra-lime3ds-emulador-3ds-pokemon-hd', title, description, keywords);

export default function CitraGuide() {
    const summaryTable = [
        { label: "Emulador", value: "Lime3DS / PabloMK7" },
        { label: "API Gráfica", value: "Vulkan" },
        { label: "Resolução", value: "4x Native (1600p)" },
        { label: "Stereoscopic 3D", value: "Off" },
        { label: "Texture Filter", value: "Anime4K (Upscale)" },
        { label: "Layout", value: "Side by Side / Big Screen" },
        { label: "Shader Cache", value: "Separate Shader" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Caos dos Forks",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Com o fim oficial do Citra, surgiram vários clones.
          <br/>Recomendamos o <strong>Lime3DS</strong> ou a versão do <strong>PabloMK7</strong> (que tem multiplayer melhor). Evite versoes antigas.
        </p>
      `
        },
        {
            title: "Capítulo 1: Gráficos (HD)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Configuração Ideal</h4>
                <p class="text-gray-400 text-xs text-justify">
                    Graphics >
                    <br/>- <strong>Internal Resolution:</strong> 4x Native (1600x960). O 3DS original é 240p (pixelado). Em 4x fica lindo.
                    <br/>- <strong>Texture Filter:</strong> Bicubic ou Anime4K (para sprites 2D).
                    <br/>- <strong>Renderer:</strong> Vulkan (melhor performance no Android e PCs AMD).
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Layout de Telas",
            content: `
        <p class="mb-4 text-gray-300">
            O 3DS tem duas telas. No monitor, isso é estranho.
            <br/>View > Screen Layout.
            <br/>- <strong>Large Screen:</strong> Tela de cima grande, de baixo pequena no canto. Ideal para gameplay.
            <br/>- <strong>Side by Side:</strong> Telas iguais lado a lado.
            <br/>- <strong>Hybrid:</strong> Se você tiver um segundo monitor em pé, pode colocar a tela de baixo nele!
        </p>
      `
        },
        {
            title: "Capítulo 3: Pokémon e Lags",
            content: `
        <p class="mb-4 text-gray-300">
            Pokémon X/Y e Sun/Moon exigem shader cache.
            <br/>Na primeira vez que você vê um ataque novo, trava.
            <br/>Ative "Use Disk Shader Cache".
            <br/>Use Cheats de "No Outline" para remover as linhas pretas em volta dos personagens (melhora o visual em HD).
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Mods e Texturas",
            content: `
        <p class="mb-4 text-gray-300">
            Zelda Ocarina of Time 3D tem o projeto "Henriko Magnifico" de texturas 4K.
            <br/>Clique com botão direito no jogo > Open Custom Texture Location.
            <br/>Cole as texturas.
            <br/>Ative "Use Custom Textures" nas opções. O jogo vira um Remake de Switch.
        </p>
      `
        },
        {
            title: "Capítulo 5: Formato .CIA vs .3DS",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>.3DS:</strong> Arquivo de cartucho descriptografado. Roda direto (File > Load).
            - <strong>.CIA:</strong> Arquivo instalado na memória do console. Precisa ir em File > Install CIA. Fica na lista de apps instalados.
            <br/>Para jogar, você previsa desencriptar suas ROMs usando um 3DS real com GodMode9.
        </p>
      `
        },
        {
            title: "Capítulo 6: Multiplayer",
            content: `
        <p class="mb-4 text-gray-300">
            O Lime3DS suporta salas públicas.
            <br/>Menu Multiplayer > Browse Public Rooms.
            <br/>Entre numa sala de Mario Kart 7 e jogue com pessoas do mundo todo (simula o Local Wireless via Internet).
        </p>
      `
        },
        {
            title: "Capítulo 7: Mouse como Touch",
            content: `
        <p class="mb-4 text-gray-300">
            O mouse simula a caneta Stylus.
            <br/>Não precisa configurar nada. Apenas clique na tela de baixo virtual.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: New 3DS Mode",
            content: `
            <p class="mb-4 text-gray-300">
                Alguns jogos (Xenoblade, Hyrule Warriors) exigem poder do "New 3DS".
                <br/>Configurar > System > Emulate Region: Auto, Model: New 3DS.
                <br/>Isso aumenta o clock da CPU emulada (L2 Cache) e melhora o FPS em jogos pesados.
            </p>
            `
        },
        {
            title: "Capítulo 9: Android",
            content: `
            <p class="mb-4 text-gray-300">
                A versão Android do Lime3DS é incrível.
                <br/>Em celulares com Snapdragon 8 Gen 2 ou superior, roda 4x Resolution.
                <br/>Suporta savestates e skins de controle.
            </p>
            `
        },
        {
            title: "Capítulo 10: Amiibo",
            content: `
            <p class="mb-4 text-gray-300">
                Suportado. Carregue o .bin do Amiibo via menu de atalhos (F2).
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Círculo Pad Pro?",
            answer: "Ative em Controls. Permite usar o segundo analógico (C-Stick) em jogos como Resident Evil Revelations e Monster Hunter."
        },
        {
            question: "Áudio estourado?",
            answer: "Ative 'Audio Stretching'. Isso sincroniza o áudio se o FPS cair, evitando ruídos e estalos."
        }
    ];

    const externalReferences = [
        { name: "Lime3DS GitHub", url: "https://github.com/Lime3DS/Lime3DS" },
        { name: "Henriko Magnifico Texture Packs", url: "https://www.henrikomagnifico.com/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/yuzu-ryujinx-otimizacao-zelda-mario-60fps-guia",
            title: "Switch",
            description: "Evolução do 3DS."
        },
        {
            href: "/guias/dolphin-emulador-wii-gamecube-ubershaders-guia",
            title: "Dolphin",
            description: "Zeldas de console."
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
