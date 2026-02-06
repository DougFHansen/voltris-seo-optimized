import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'cemu-emulador-wii-u-zelda-botw-4k-60fps',
    title: "Cemu (2026): Zelda Breath of the Wild em 4K 60FPS (FPS++)",
    description: "O guia definitivo de Cemu 2.0. Como instalar Graphics Packs, mods FPS++, shaders Vulkan e jogar online com contas Cemu.",
    category: 'emulacao',
    difficulty: 'Intermediário',
    time: '30 min'
};

const title = "Wii U Emulator: Cemu 2.0 Guide";
const description = "O Cemu é um milagre da otimização. Ele roda Breath of the Wild melhor que o Switch, com suporte a 4K, 60fps (ou 144fps), Ultrawide e Mods de Ray Tracing (Reshade).";

const keywords = [
    'cemu 2.0 vulkan vs opengl performance',
    'zelda botw fps++ settings guide',
    'mario kart 8 cemu online multiplayer',
    'instalar update e dlc cemu mlc01',
    'xenoblade chronicles x 60fps fix cemu',
    'keys.txt cemu wii u title keys',
    'voltris optimizer nintendo',
    'reshade ray tracing zelda'
];

export const metadata: Metadata = createGuideMetadata('cemu-emulador-wii-u-zelda-botw-4k-60fps', title, description, keywords);

export default function CemuGuide() {
    const summaryTable = [
        { label: "Versão", value: "Cemu 2.0 (Open Source)" },
        { label: "API", value: "Vulkan (Obrigatório Async)" },
        { label: "Mod Essencial", value: "FPS++" },
        { label: "Resolução", value: "2K / 4K (Graphic Packs)" },
        { label: "Shaders", value: "Async Compile (Zero Stutter)" },
        { label: "Controller", value: "Wii U GamePad" },
        { label: "Online", value: "Sim (Requer arquivos do console)" }
    ];

    const contentSections = [
        {
            title: "Introdução: Por que Cemu e não Yuzu?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Para Breath of the Wild e Mario Kart 8, o Cemu (Wii U) é SUPERIOR ao Yuzu (Switch).
          <br/>O Cemu é muito mais leve (roda em i3 antigo) e tem mods de "FPS++" que permitem jogar acima de 60fps sem quebrar a física do jogo. O Yuzu sofre para bater 60fps estáveis.
        </p>
      `
        },
        {
            title: "Capítulo 1: Configuração Básica e Keys",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Keys.txt</h4>
                <p class="text-gray-400 text-xs text-justify">
                    Para o Cemu abrir jogos criptografados (formato .wud/.wux), você precisa do arquivo <code>keys.txt</code> na pasta do emulador contendo as chaves dos jogos que você possui.
                    <br/>Para jogos descomprimidos (Loadiine / pasta 'content'), não precisa de keys. Recomendamos usar o formato Loadiine ou instalar updates/DLCs no formato NAND.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Graphics Packs (A Mágica)",
            content: `
        <p class="mb-4 text-gray-300">
            1. Options > Graphics Packs.
            <br/>2. Clique em "Download latest community graphic packs".
            <br/>3. Abra a aba do jogo (ex: Breath of the Wild).
            <br/>4. <strong>Mods > FPS++:</strong> Marque tudo. Defina "FPS Limit" para 60 (ou 144 se tiver monitor bom). Isso corrige a velocidade do jogo.
            <br/>5. <strong>Graphics:</strong> Resolution > Selecione 2560x1440 (2K) ou 4K.
            <br/>6. <strong>Anti-Aliasing:</strong> Nvidia FXAA (Leve) ou Não (se usar 4K).
        </p>
      `
        },
        {
            title: "Capítulo 3: Vulkan e Async Shaders",
            content: `
        <p class="mb-4 text-gray-300">
            Mude a API Gráfica para Vulkan em General Settings.
            <br/>Ative <strong>"Async Shader Compilation"</strong>.
            <br/>Isso elimina 99% das travadinhas (stutter) de loading de shaders. O jogo roda liso desde o primeiro minuto. O OpenGL compilava shaders travando a tela. O Vulkan compila em background e você nem percebe.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Instalando DLCs e Updates",
            content: `
        <p class="mb-4 text-gray-300">
            Cemu não lê DLCs soltas na pasta. Você precisa instalar na NAND virtual.
            <br/>File > Install Game Title, Update or DLC.
            <br/>Selecione a pasta <code>meta</code> dentro do update que você baixou.
            <br/>O Cemu copia os arquivos para <code>mlc01/usr/title</code>.
            <br/>BotW precisa do Update v208 e DLC v80 para os mods funcionarem.
        </p>
      `
        },
        {
            title: "Capítulo 5: Gyro (Motion Controls)",
            content: `
        <p class="mb-4 text-gray-300">
            Zelda tem Dungeons que exigem girar o controle.
            <br/>Input Settings > Ative "Use Motion".
            <br/>Se usar DualSense/DualShock 4: Funciona nativo via DSU Client (instale DS4Windows se precisar).
            <br/>Se usar Xbox: Clique com botão direito no jogo > GameProfile > Controller > Emulate Motion com Mouse (Botão direito arraste).
        </p>
      `
        },
        {
            title: "Capítulo 6: Xenoblade Chronicles X (60FPS)",
            content: `
        <p class="mb-4 text-gray-300">
            Outro monstro do Wii U.
            <br/>O jogo é travado em 30fps.
            <br/>Use o Graphics Pack > Mods > 60FPS Mod.
            <br/>Aumente o "Game Speed" se as cutscenes ficarem rápidas. O pack da comunidade geralmente já corrige o áudio.
        </p>
      `
        },
        {
            title: "Capítulo 7: Jogando Online (Cemu Network)",
            content: `
        <p class="mb-4 text-gray-300">
            É possível jogar Mario Kart 8 e Splatoon nos servidores oficiais da Nintendo!
            <br/>MAS você precisa de um Wii U real desbloqueado para extrair seus arquivos de conta (OTP, SEEPROM, Account.dat).
            <br/>Não baixe isso da internet (é ban na certa de console ID compartilhado).
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Mods Visuais (Reshade)",
            content: `
            <p class="mb-4 text-gray-300">
                A comunidade criou o "Clarity" e presets de Reshade que adicionam Ray Tracing (RTGI) fake ao Zelda. Fica lindo, mas pesa na GPU.
                <br/>Ative em Graphics Packs > Enhancements > Clarity. Escolha o preset "Serfrost".
            </p>
            `
        },
        {
            title: "Capítulo 9: Cemu 2.0 (Linux)",
            content: `
            <p class="mb-4 text-gray-300">
                A versão 2.0 é nativa de Linux (AppImage).
                <br/>Roda muito bem no Steam Deck (via EmuDeck), consumindo pouca bateria (TDP 8-10W) para rodar Zelda a 40fps.
            </p>
            `
        },
        {
            title: "Capítulo 10: Tela Verde (Vídeos)",
            content: `
            <p class="mb-4 text-gray-300">
                Se as cutscenes ficarem verdes/invertidas, baixe o "Cemuhook" (apenas para versões antigas 1.26). No Cemu 2.0, isso já foi corrigido nativamente via decodificação de software (Debug > Use Cemuhook H264).
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Wii U GamePad Screen?",
            answer: "Segure TAB para ver a tela do GamePad (útil para inventário e mapas em alguns jogos). Ou configure View > Separate GamePad View para um segundo monitor."
        },
        {
            question: "Save sumiu?",
            answer: "Se você mudou de usuário no Cemu, o save muda. Verifique em Options > Active Account. Use a conta '80000001' (Default)."
        }
    ];

    const externalReferences = [
        { name: "Cemu Graphics Packs", url: "https://github.com/CemuUser8/CemuUser8/releases" },
        { name: "Cemu Hook", url: "https://cemuhook.sshnuke.net/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/yuzu-ryujinx-otimizacao-zelda-mario-60fps-guia",
            title: "Yuzu",
            description: "Para TOTK (Sequência)."
        },
        {
            href: "/guias/controle-ps4-ps5-overclock-ds4windows",
            title: "Controle",
            description: "Gyro setup."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
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
