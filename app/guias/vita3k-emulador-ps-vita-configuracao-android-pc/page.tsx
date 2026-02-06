import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'vita3k-emulador-ps-vita-configuracao-android-pc',
    title: "Vita3K (2026): Guia de Emulador PS Vita (PC e Android)",
    description: "O primeiro emulador funcional de PS Vita. Aprenda a instalar Firmware, decriptar jogos (Vpk/Zip) e configurar Persona 4 Golden e Uncharted.",
    category: 'emulacao',
    difficulty: 'Avançado',
    time: '20 min'
};

const title = "Vita3K: PS Vita no PC e Celular";
const description = "A emulação de Vita explodiu recentemente. O Vita3K já roda muitos jogos comerciais perfeitamente, inclusive no Android. Veja como configurar.";

const keywords = [
    'vita3k android best settings snapdragon',
    'como instalar pkg e workbin vita3k',
    'persona 4 golden vita3k crash fix',
    'uncharted golden abyss touch controls emulated',
    'vita3k firmware font package download',
    'aumentar resolução ps vita emulador',
    'voltris optimizer vita',
    'maiar dump zrif'
];

export const metadata: Metadata = createGuideMetadata('vita3k-emulador-ps-vita-configuracao-android-pc', title, description, keywords);

export default function VitaGuide() {
    const summaryTable = [
        { label: "Renderer", value: "Vulkan" },
        { label: "Backend", value: "OpenGL (Teste se Vulkan falhar)" },
        { label: "Upscaling", value: "2x (PC) / 1x (Android)" },
        { label: "Memory Mapping", value: "Native (Se possível)" },
        { label: "Instalação", value: ".PKG ou .ZIP (NoNpDrm)" },
        { label: "Touch", value: "Overlay On" }
    ];

    const contentSections = [
        {
            title: "Introdução: Emulador Jovem",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Vita3K ainda é "Experimental". Muitos jogos podem ter glitches gráficos ou de áudio. Mas a lista de compatibilidade cresce todo dia.
        </p>
      `
        },
        {
            title: "Capítulo 1: Instalação de Firmware e Fontes",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Obrigatório</h4>
                <p class="text-gray-400 text-xs text-justify">
                    Ao abrir pela primeira vez, ele pede:
                    <br/>1. <strong>Firmware (PS Vita Update):</strong> Baixe o arquivo <code>PSVUPDAT.PUP</code> oficial da Sony.
                    <br/>2. <strong>Font Package:</strong> Baixe o arquivo <code>PSP2UPDAT.PUP</code> (Fonts) também oficial.
                    <br/>Instale ambos via menu File > Install Firmware. Sem as fontes, os textos dos jogos ficam invisíveis (quadrados).
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Instalando Jogos (.pkg, .zip, .vpk)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>.vpk:</strong> Homebrews. Instala fácil.
            - <strong>.pkg:</strong> Jogos da PSN. Você PRECISA do arquivo <code>work.bin</code> ou chave <code>zRIF</code> correspondente para decriptar a licença.
            - <strong>NoNpDrm (Folder/Zip):</strong> O formato mais comum de dumps. Basta selecionar "Install > Zip" ou apontar para a pasta.
        </p>
      `
        },
        {
            title: "Capítulo 3: Gráficos e Resolução",
            content: `
        <p class="mb-4 text-gray-300">
            Configuration > Settings > GPU.
            <br/>Backend: <strong>Vulkan</strong> é mandatório para Android e GPUs AMD. Nvidia pode usar OpenGL se quiser.
            <br/>Internal Resolution: 2x (1080p). Jogos de Vita ficam lindos em HD.
            <br/>Anisotropic Filtering: 16x.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Touch Traseiro (Rear Touchpad)",
            content: `
        <p class="mb-4 text-gray-300">
            O Vita tinha um touchpad nas costas. Jogos como Uncharted usam isso para subir cordas.
            <br/>No emulador, você pode mapear botões do controle (ex: L3/R3) para simular toques no painel traseiro.
            <br/>Ou usar o Mouse (no PC) e Overlay de toque (no Android).
        </p>
      `
        },
        {
            title: "Capítulo 5: Persona 4 Golden",
            content: `
        <p class="mb-4 text-gray-300">
            O jogo mais popular. Roda 100%.
            <br/>Se tiver crashes nas cutscenes (vídeos), instale os codecs de mídia adicionais (às vezes o emulador pede para baixar ffmpeg no Linux/Android).
        </p>
      `
        },
        {
            title: "Capítulo 6: Memory Mapping (Android)",
            content: `
        <p class="mb-4 text-gray-300">
            No Android, a opção "Memory Mapping" pode triplicar a performance se seu celular suportar.
            <br/>Se o jogo fechar na hora de abrir (Crash), mude para o método "Double Buffer" ou similar. Varia de cada driver (Turnip/Adreno).
        </p>
      `
        },
        {
            title: "Capítulo 7: Custom Drivers (Turnip)",
            content: `
        <p class="mb-4 text-gray-300">
            Para usuários de Android com Snapdragon:
            <br/>Instale drivers <strong>Turnip</strong> (Mesa) nas configurações do Vita3K. Eles corrigem muitos bugs gráficos que os drivers padrão da Samsung/Xiaomi têm.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Save Data",
            content: `
            <p class="mb-4 text-gray-300">
                Os saves ficam em <code>ux0:/user/00/savedata/</code>.
                <br/>A estrutura de arquivos do Vita3K imita o cartão de memória do Vita real (ux0).
            </p>
            `
        },
        {
            title: "Capítulo 9: Multiplayer",
            content: `
            <p class="mb-4 text-gray-300">
                Ainda muito experimental. Não conte com jogar Freedom Wars online por enquanto.
            </p>
            `
        },
        {
            title: "Capítulo 10: Homebrews",
            content: `
            <p class="mb-4 text-gray-300">
                O Vita3K roda excelente ports de homebrew, como o port de GTA San Andreas e Max Payne para Vita.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Roda God of War Collection?",
            answer: "Sim, mas exige CPU forte, pois é um emulador rodando um emulador (o jogo é um port de PS2 para Vita)."
        },
        {
            question: "Onde baixo jogos?",
            answer: "Você deve fazer o dump do seu próprio Vita usando o NoNpDrm. Não fornecemos links."
        }
    ];

    const externalReferences = [
        { name: "Vita3K Compatibility List", url: "https://vita3k.org/compatibility.html" },
        { name: "Sony Firmware Download", url: "https://www.playstation.com/en-us/support/hardware/psvita/system-software/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/rpcs3-otimizacao-configuracao-60fps-patches-guia",
            title: "RPCS3",
            description: "PS3 e Vita são irmãos."
        },
        {
            href: "/guias/retroarch-guia-completo-cores-shaders-crt",
            title: "RetroArch",
            description: "Para PSP (PPSSPP)."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
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
