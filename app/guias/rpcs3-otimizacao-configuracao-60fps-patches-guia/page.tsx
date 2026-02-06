import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'rpcs3-otimizacao-configuracao-60fps-patches-guia',
    title: "RPCS3 (2026): Otimização de Emulador PS3 (GOW 3, TLoU)",
    description: "Emular o PlayStation 3 exige CPU forte. Aprenda a configurar SPU Threads, Write Color Buffers e instalar Patches para jogar The Last of Us e God of War 3.",
    category: 'emulacao',
    difficulty: 'Muito Avançado',
    time: '60 min'
};

const title = "RPCS3: O Monstro da CPU (Guia de Configuração)";
const description = "O processador Cell do PS3 é extremamente complexo. Emular isso requer ajustes finos. Não espere rodar tudo no Ultra sem configurar cada jogo.";

const keywords = [
    'melhor configuração rpcs3 god of war 3 60fps',
    'the last of us rpcs3 black screen fix',
    'write color buffers on or off rpcs3',
    'spu block size safe vs mega',
    'desbloquear fps demons souls rpcs3 60fps patch',
    'firmware ps3 install rpcs3',
    'voltris optimizer ps3',
    'avx-512 cpu rpcs3 performance'
];

export const metadata: Metadata = createGuideMetadata('rpcs3-otimizacao-configuracao-60fps-patches-guia', title, description, keywords);

export default function RPCS3Guide() {
    const summaryTable = [
        { label: "CPU Requisitada", value: "8 Núcleos (AVX-512 ajuda)" },
        { label: "Renderer", value: "Vulkan" },
        { label: "SPU Block Size", value: "Safe (Padrão) / Mega" },
        { label: "Write Color Buffers", value: "ON (Corrige gráficos)" },
        { label: "Resolution Scale", value: "150% (1080p)" },
        { label: "FSR", value: "ON (Upscaling)" },
        { label: "Patches", value: "Manager (Essencial)" }
    ];

    const contentSections = [
        {
            title: "Introdução: A Complexidade do Cell",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Emular PS3 não é plug-and-play. Jogos como Demon's Souls rodam bem. Jogos como The Last of Us e MGS4 exigem CPUs de topo de linha (i7/i9 13th gen ou Ryzen 7000/9000 com AVX-512) para atingir 30fps estáveis.
        </p>
      `
        },
        {
            title: "Capítulo 1: Instalação e Firmware",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">O Básico</h4>
                <p class="text-gray-400 text-xs text-justify">
                    1. Baixe o RPCS3 do site oficial (Atualize sempre, updates diários).
                    <br/>2. Baixe o <strong>PS3 Firmware (4.91+)</strong> no site da Sony.
                    <br/>3. File > Install Firmware.
                    <br/>4. O emulador vai compilar módulos PPU (demora uns minutos).
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Configuração Global (CPU/GPU)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>CPU:</strong>
            <br/> PPU Decoder: Recompiler (LLVM).
            <br/> SPU Decoder: Recompiler (LLVM).
            <br/>- <strong>GPU:</strong>
            <br/> Renderer: Vulkan.
            <br/> Framelimit: Auto ou Off (Use VSync se tiver tearing).
            <br/> Resolution Scale: Default Resolution (720p) e Scale para 150% (1080p) ou 300% (4K).
        </p>
      `
        },
        {
            title: "Capítulo 3: SPU Block Size (Performance)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Safe:</strong> Funciona em todos os jogos.
            - <strong>Mega:</strong> Pode aumentar muito o FPS em CPUs Intel, mas quebra o áudio ou trava em alguns jogos. Teste jogo a jogo.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Write Color Buffers (Gráficos Quebrados)",
            content: `
        <p class="mb-4 text-gray-300">
            Muitos jogos (Skate 3, Dante's Inferno, GOW) têm luzes estouradas ou tela preta sem isso.
            <br/>Vá na aba GPU e ative <strong>"Write Color Buffers"</strong>.
            <br/>Isso custa performance, mas é obrigatório para renderizar corretamente certos efeitos de iluminação do PS3.
        </p>
      `
        },
        {
            title: "Capítulo 5: Patch Manager (60FPS Unlock)",
            content: `
        <p class="mb-4 text-gray-300">
            O RPCS3 tem um sistema de patches integrado incrível.
            <br/>Manage > Game Patches.
            <br/>Baixe os patches mais recentes.
            <br/>Busque seu jogo (ex: Demon's Souls).
            <br/>Ative: "Unlock FPS", "Disable Motion Blur", "Skip Intro".
            <br/>Agora o jogo, que era travado em 30fps no console, pode rodar a 60fps ou até 120fps no emulador.
        </p>
      `
        },
        {
            title: "Capítulo 6: Multithreaded RSX (GPU Boost)",
            content: `
        <p class="mb-4 text-gray-300">
            Na aba GPU, "Multithreaded RSX" separa a carga da GPU em outra thread.
            <br/>Ajuda muito se sua GPU for fraca (GTX 1050), mas pode causar instabilidade. Mantenha OFF se tiver uma RTX.
        </p>
      `
        },
        {
            title: "Capítulo 7: Compilação de Shaders (Stutter)",
            content: `
        <p class="mb-4 text-gray-300">
            Assim como no Switch, o RPCS3 compila shaders.
            <br/>Ative "Asynchronous Texture Streaming".
            <br/>Espere o jogo "gaguejar" nos primeiros minutos. Depois fica liso.
            <br/>O RPCS3 salva o cache para a próxima vez.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Wiki do RPCS3 (A Bíblia)",
            content: `
            <p class="mb-4 text-gray-300">
                Pulo do Gato: Antes de abrir qualquer jogo, pesquise "RPCS3 [Nome do Jogo]" no Google e abra a Wiki oficial.
                <br/>Lá diz EXATAMENTE as configurações que aquele jogo precisa (ex: "Ative Read Color Buffers", "Set Driver Wake-Up Delay 200us"). Siga aquilo à risca.
            </p>
            `
        },
        {
            title: "Capítulo 9: DLCs e Updates (.pkg)",
            content: `
            <p class="mb-4 text-gray-300">
                Instale arquivos .pkg (Updates de jogos, DLCs) via File > Install Packages/Raps.
                <br/>Você precisa do arquivo .RAP (licença) junto com o .PKG para funcionar se for conteúdo da PSN.
            </p>
            `
        },
        {
            title: "Capítulo 10: Performance em Handhelds",
            content: `
            <p class="mb-4 text-gray-300">
                O Steam Deck roda jogos leves de PS3 (Lollipop Chainsaw, HD Collections).
                <br/>Jogos pesados (GOW3, RDR1) rodam a 15-20fps em slow motion. O hardware do Deck não tem força bruta de CPU suficiente para o Cell.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Tela preta ao iniciar?",
            answer: "Provavelmente faltou instalar o Firmware oficial ou o jogo está corrompido / pasta errada."
        },
        {
            question: "God of War 3 roda a 60fps?",
            answer: "Só com CPUs monstras (i9-13900K, Ryzen 7950X). Em CPUs normais, espere 30-40fps instáveis."
        }
    ];

    const externalReferences = [
        { name: "RPCS3 Compatibility List", url: "https://rpcs3.net/compatibility" },
        { name: "RPCS3 Wiki", url: "https://wiki.rpcs3.net/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/pcsx2-otimizacao-4k-widescreen-texturas-guia",
            title: "PCSX2",
            description: "PS2 Emulation."
        },
        {
            href: "/guias/termperatura-pc-fan-control-curva",
            title: "Temperatura",
            description: "CPU vai esquentar."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="60 min"
            difficultyLevel="Muito Avançado"
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
