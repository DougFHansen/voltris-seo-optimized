import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'yuzu-ryujinx-otimizacao-zelda-mario-60fps-guia',
    title: "Emuladores Switch (2026): Yuzu/Ryujinx Otimizados (60FPS)",
    description: "Como configurar emuladores de Switch para rodar Zelda TOTK e Mario Wonder a 60FPS em 4K. Guia de Firmware, Keys, Mods e Graphics Settings.",
    category: 'emulacao',
    difficulty: 'Avançado',
    time: '40 min'
};

const title = "Switch no PC: Yuzu vs Ryujinx (Guia Definitivo)";
const description = "Quer jogar seus backups de Switch com gráficos melhorados? Aprenda qual emulador usar para cada jogo e como instalar mods de performance.";

const keywords = [
    'melhor configuração yuzu zelda tears of the kingdom 60fps',
    'ryujinx vs yuzu mario wonder',
    'como instalar firmware e prod keys yuzu atualizado',
    'yuzu early access vs mainline',
    'totk dynamic fps mod install',
    'configurar controle de movimento motion yuzu',
    'voltris optimizer emulation',
    'shader cache stutter fix yuzu'
];

export const metadata: Metadata = createGuideMetadata('yuzu-ryujinx-otimizacao-zelda-mario-60fps-guia', title, description, keywords);

export default function YuzuGuide() {
    const summaryTable = [
        { label: "API", value: "Vulkan (Sempre)" },
        { label: "CPU", value: "Accuracy: Auto" },
        { label: "GPU", value: "High / Normal" },
        { label: "Resolution", value: "2x (1440p/4K)" },
        { label: "VSync", value: "Immediate (Off) / Mailbox" },
        { label: "Mods", value: "Ctrl + U (Unlock)" },
        { label: "Docked", value: "Yes (Melhor gráfico)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Fim do Yuzu e Ryujinx",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Nota: O projeto Yuzu foi descontinuado judicialmente. Hoje usamos forks como **Suyu** ou **Sudachi**, ou o **Ryujinx** que continua ativo. As configurações são similares.
        </p>
      `
        },
        {
            title: "Capítulo 1: Setup Inicial (Legalmente)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Firmware e Keys</h4>
                <p class="text-gray-400 text-xs text-justify">
                    Para o emulador funcionar, você precisa despejar (dump) as <code>prod.keys</code> e o Firmware do seu próprio Nintendo Switch desbloqueado.
                    <br/>Coloque as chaves na pasta: <code>AppData/Roaming/Ryujinx/system</code>.
                    <br/>Instale o Firmware via menu: Tools > Install Firmware.
                    <br/>Sem isso, o emulador não descriptografa nenhum jogo.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Melhores Configurações Gráficas",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Graphics API:</strong> Vulkan. (OpenGL é legado e lento, só use se Vulkan bugar).
            - <strong>Resolution Scale:</strong> 2x (1440p/4K). Switch nativo é 720p/1080p e fica feio no monitor. 2x deixa nítido sem pesar muito na CPU.
            - <strong>Anti-Aliasing:</strong> SMAA (melhor visual) ou FXAA (mais leve).
            - <strong>ASTC Textures:</strong> Recompress BC3 (Economiza VRAM em GPUs de 4GB/6GB).
        </p>
      `
        },
        {
            title: "Capítulo 3: Configurações de CPU",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Accuracy:</strong> Auto. Colocar em "Paranoid" ou "High" mata a performance sem ganho visível na maioria dos jogos.
            - <strong>VSync:</strong> Mailbox (Ideal para G-Sync/FreeSync) ou Immediate (Latência mínima, mas com Tearing).
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Zelda TOTK (O Gigante)",
            content: `
        <p class="mb-4 text-gray-300">
            Para rodar TOTK liso:
            <br/>1. Use o mod <strong>"TotK Optimizer"</strong>. Ele configura tudo sozinho.
            <br/>2. Ou instale manualmente: <code>UltraCam</code>, <code>DynamicFPS</code> e <code>60fps Static</code>.
            <br/>Sem mods, o jogo trava em 30fps (com quedas para 20fps igual no console). Com mods e um PC bom, roda a 60fps cravados.
        </p>
      `
        },
        {
            title: "Capítulo 5: Mods (60FPS / Widescreen)",
            content: `
        <p class="mb-4 text-gray-300">
            A maioria dos jogos de Switch é travada em 30fps.
            <br/>Clique com botão direito no jogo > Open Mods Directory.
            <br/>Baixe mods no site "HolographicWings" ou GitHub.
            <br/>Mods de "Disable Dynamic Resolution" são essenciais para manter a imagem nítida (o console baixa a resolução dinâmica quando a ação pesa).
        </p>
      `
        },
        {
            title: "Capítulo 6: Cache de Shaders (Pipeline)",
            content: `
        <p class="mb-4 text-gray-300">
            Na primeira vez que você joga, o emulador compila shaders. Isso causa pequenas travadinhas (stutter).
            <br/>Na segunda vez, é liso.
            <br/>Ative "Vulkan Pipeline Cache" e "Asynchronous Shader Building" (Isso reduz stutters, mas pode causar glitches visuais momentâneos).
        </p>
      `
        },
        {
            title: "Capítulo 7: Motion Controls (Giroscópio)",
            content: `
        <p class="mb-4 text-gray-300">
            Essencial para puzzles do Zelda.
            <br/>Controles de PS4/PS5 oficial e Switch Pro têm giroscópio nativo.
            <br/>No Ryujinx/Yuzu, configure o Input e ative "Motion". Balance o controle para testar.
            <br/>Se usa controle de Xbox (sem gyro), configure um botão para simular o movimento ou use mods "No Motion Puzzles".
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Ryujinx vs Yuzu/Suyu",
            content: `
            <p class="mb-4 text-gray-300">
                - <strong>Ryujinx:</strong> Mais preciso, roda jogos no lançamento (sem hacks), mas é um pouco mais pesado. Suporta Mac M1/M2 incrivelmente bem.
                - <strong>Yuzu (Suyu/Sudachi):</strong> Mais rápido em PCs fracos (Hacks de velocidade), mas menos preciso.
                <br/>Tenha os dois instalados. Se um jogo bugar em um, teste no outro.
            </p>
            `
        },
        {
            title: "Capítulo 9: Online (LDN / Multiplayer)",
            content: `
            <p class="mb-4 text-gray-300">
                O Ryujinx tem modo LDN (Local Wireless via Internet).
                <br/>Você pode jogar Monster Hunter ou Mario Kart com amigos que também usam emulador, como se estivessem na mesma sala (LAN). Não conecta nos servidores oficiais da Nintendo (o que daria Ban na hora).
            </p>
            `
        },
        {
            title: "Capítulo 10: Amiibo",
            content: `
            <p class="mb-4 text-gray-300">
                Os emuladores suportam Amiibo virtual.
                <br/>Basta baixar os arquivos .bin dos Amiibos na internet e carregar quando o jogo pedir (Menu Actions > Scan Amiibo). Ganhe loots exclusivos no Zelda.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Preciso de um PC da NASA?",
            answer: "Não. CPU é mais importante que GPU. Um i5 de 12ª geração ou Ryzen 5 5600 roda quase tudo. Placa de vídeo GTX 1060 já aguenta 1080p."
        },
        {
            question: "Jogo fecha sozinho (Crash)?",
            answer: "Geralmente é falta de RAM (Memória Paginação) ou Mods incompatíveis com a versão do Update do jogo (ex: Mod 1.1.0 no Jogo 1.2.0)."
        }
    ];

    const externalReferences = [
        { name: "Ryujinx Official", url: "https://ryujinx.org/" },
        { name: "TotK Optimizer", url: "https://github.com/MaxLastBreath/TOTK-mods" }
    ];

    const relatedGuides = [
        {
            href: "/guias/memoria-virtual-pagefile-ssd-otimizacao",
            title: "Pagefile",
            description: "Evitar crash no Zelda."
        },
        {
            href: "/guias/controle-ps4-ps5-overclock-ds4windows",
            title: "Controle",
            description: "Configurar Motion."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="40 min"
            difficultyLevel="Avançado"
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
