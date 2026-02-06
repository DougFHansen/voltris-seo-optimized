import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'dolphin-emulador-wii-gamecube-ubershaders-guia',
    title: "Dolphin (2026): Configuração Perfeita para Wii e GameCube",
    description: "Jogue Super Mario Galaxy e Metroid Prime em 4K sem travadas. Guia de Ubershaders (Stutter Fix), controle de movimento emulado e texturas HD.",
    category: 'emulacao',
    difficulty: 'Intermediário',
    time: '25 min'
};

const title = "Dolphin Emulator: O Rei da Emulação";
const description = "O Dolphin é o emulador mais otimizado que existe. Mas para eliminar aquelas travadinhas chatas (compilação de shader), precisamos configurar os Ubershaders.";

const keywords = [
    'dolphin emulator stutter fix ubershaders asynchronous',
    'configurar controle wii no dolphin mouse e teclado',
    'super mario galaxy hd texture pack dolphin',
    'jogar online wii dolphin wiimmfi',
    'melhor backend dolphin vulkan ou direct3d',
    'gecko codes cheats dolphin',
    'voltris optimizer nintendo',
    'rvz vs iso compression'
];

export const metadata: Metadata = createGuideMetadata('dolphin-emulador-wii-gamecube-ubershaders-guia', title, description, keywords);

export default function DolphinGuide() {
    const summaryTable = [
        { label: "Backend", value: "Vulkan (Recomendado)" },
        { label: "Shader Compilation", value: "Hybrid Ubershaders" },
        { label: "Compile Shaders", value: "Before Starting (Opcional)" },
        { label: "Resolução", value: "3x Native (1080p)" },
        { label: "Anti-Aliasing", value: "4x MSAA" },
        { label: "Anisotrópico", value: "16x" },
        { label: "Controle", value: "Emulated Wii Remote" }
    ];

    const contentSections = [
        {
            title: "Introdução: Ubershaders",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O "Stutter" clássico da emulação acontece quando um efeito novo aparece na tela e a GPU precisa compilar o shader. O Dolphin resolveu isso com "Ubershaders": um shader gigante genérico que roda enquanto o específico compila, eliminando a pausa.
        </p>
      `
        },
        {
            title: "Capítulo 1: Configuração Gráfica (Graphics)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Aba General</h4>
                <p class="text-gray-400 text-xs text-justify">
                    - <strong>Backend:</strong> Vulkan (Mais rápido na maioria das GPUs modernas). D3D11 se Vulkan der tela preta.
                    - <strong>Shader Compilation:</strong> Hybrid Ubershaders (O melhor dos dois mundos).
                    <br/>Marque "Compile Shaders Before Starting" se você odeia qualquer tipo de lag e não se importa em esperar 10 segundos antes de abrir o jogo.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Melhorias Visuais (Enhancements)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Internal Resolution:</strong> 3x Native (1080p) ou 4x (1440p). O Wii nativo é 480p (borrado).
            - <strong>Anti-Aliasing:</strong> 4x MSAA deixa as bordas lisas.
            - <strong>Anisotropic Filtering:</strong> 16x.
            - <strong>Widescreen Hack:</strong> Ative se quiser forçar 16:9 em jogos que eram 4:3 (pode bugar menus ou objetos nas bordas - Culling).
        </p>
      `
        },
        {
            title: "Capítulo 3: Configurando o Wiimote (Motion)",
            content: `
        <p class="mb-4 text-gray-300">
            Controllers > Wii Remotes > Emulated Wii Remote.
            <br/>Clique em Configure.
            <br/>- <strong>Device:</strong> Seu Mouse/Teclado ou Gamepad.
            <br/>- <strong>Motion Simulation:</strong> Na aba "Motion Input", mapeie o "Point" para o Mouse Cursor. Isso permite usar o mouse como apontador na tela.
            <br/>- <strong>Shake:</strong> Mapeie uma tecla (ex: Botão do Meio do Mouse) para simular o "Chacoalhar" (Spin no Mario).
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Conectando Wiimote Real (DolphinBar)",
            content: `
        <p class="mb-4 text-gray-300">
            Para a experiência perfeita, compre uma "Mayflash DolphinBar" USB.
            <br/>Ela age como Sensor Bar e Bluetooth ao mesmo tempo.
            <br/>Selecione "Real Wii Remote" no Dolphin e conecte seus controles originais do Wii. Funciona 100%.
        </p>
      `
        },
        {
            title: "Capítulo 5: Texturas HD (Texture Packs)",
            content: `
        <p class="mb-4 text-gray-300">
            Jogos como Xenoblade Chronicles e Resident Evil 4 têm packs de textura 4K feitos por fãs.
            <br/>1. Baixe o pack (pastas com códigos de 3 letras).
            <br/>2. Coloque em <code>Documents/Dolphin Emulator/Load/Textures/</code>.
            <br/>3. Em Graphics > Advanced, marque "Load Custom Textures" e "Prefetch Custom Textures" (para carregar na RAM e não travar).
        </p>
      `
        },
        {
            title: "Capítulo 6: Netplay (Multiplayer)",
            content: `
        <p class="mb-4 text-gray-300">
            Tools > Start Netplay.
            <br/>Você pode jogar Mario Party ou Smash Bros Brawl online com amigos.
            <br/>Exige que todos tenham a MESMA versão do Dolphin e a MESMA ISO (Hash Check).
        </p>
      `
        },
        {
            title: "Capítulo 7: Hack de 60FPS",
            content: `
        <p class="mb-4 text-gray-300">
            Jogos como Super Mario Sunshine rodavam a 30fps.
            <br/>Clique com botão direito no jogo > Properties > Gecko Codes.
            <br/>Baixe códigos de "60FPS" da Wiki do Dolphin. Ative o cheat.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Formato RVZ (Compressão)",
            content: `
            <p class="mb-4 text-gray-300">
                ISOs de Wii têm 4.7GB (cheias de lixo dummy).
                <br/>Converta suas ISOs para <strong>RVZ</strong> dentro do próprio Dolphin (Right Click > Convert).
                <br/>O tamanho cai para 1GB-2GB sem perder qualidade (Lossless). Economize SSD.
            </p>
            `
        },
        {
            title: "Capítulo 9: GameCube BIOS",
            content: `
            <p class="mb-4 text-gray-300">
                O Dolphin não exige BIOS para rodar GameCube, mas se você quiser ver a animação do logo (cubo roxo) iniciando, desmarque "Skip BIOS" na config.
            </p>
            `
        },
        {
            title: "Capítulo 10: Android",
            content: `
            <p class="mb-4 text-gray-300">
                No celular, o Dolphin roda bem em Snapdragons modernos. Use o formato RVZ para economizar espaço interno e mantenha a resolução em 1x ou 2x.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Som picotando?",
            answer: "O jogo não está rodando a 100% de velocidade (60fps ou 30fps). Seu PC não está aguentando. Baixe a resolução interna."
        },
        {
            question: "Tela preta no Zelda Twilight Princess?",
            answer: "Ative o 'Hyrule Field Speed Hack' (já vem ativado por padrão nas versões novas). Atualize seu Dolphin para a versão Beta ou Dev (evite a Stable velha)."
        }
    ];

    const externalReferences = [
        { name: "Dolphin Emulator Wiki", url: "https://wiki.dolphin-emu.org/" },
        { name: "HD Texture Packs Forum", url: "https://forums.dolphin-emu.org/Forum-custom-texture-projects" }
    ];

    const relatedGuides = [
        {
            href: "/guias/yuzu-ryujinx-otimizacao-zelda-mario-60fps-guia",
            title: "Switch",
            description: "Para jogos novos."
        },
        {
            href: "/guias/controle-ps4-ps5-overclock-ds4windows",
            title: "Controle",
            description: "Mapeamento."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="25 min"
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
