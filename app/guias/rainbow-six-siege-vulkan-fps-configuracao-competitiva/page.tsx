import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'rainbow-six-siege-vulkan-fps-configuracao-competitiva',
    title: "Rainbow Six Siege (2026): Configuração Competitiva (Vulkan)",
    description: "Guia para R6 Siege. Vulkan vs DX11, como usar Nvidia Reflex, e configurações de T-AA Sharpness para ver inimigos em pixels distantes.",
    category: 'otimizacao',
    difficulty: 'Intermediário',
    time: '15 min'
};

const title = "R6 Siege Pro Settings: Visibility & FPS";
const description = "No R6, um pixel faz diferença. Aprenda a configurar o Vulkan para estabilidade, ajustar o T-AA para nitidez perfeita e calibrar o FOV e Aspect Ratio como os profissionais.";

const keywords = [
    'rainbow six siege vulkan vs dx11 desempenho',
    'melhores configurações graficas r6 siege 2026',
    't-aa sharpness render scaling settings',
    'nvidia reflex low latency r6',
    'aspect ratio 4:3 vs 16:9 r6',
    'raw input mouse multiplier',
    'voltris optimizer fps',
    'som night mode vs hi-fi r6'
];

export const metadata: Metadata = createGuideMetadata('rainbow-six-siege-vulkan-fps-configuracao-competitiva', title, description, keywords);

export default function R6Guide() {
    const summaryTable = [
        { label: "API", value: "Vulkan (Menos stutter)" },
        { label: "Anti-Aliasing", value: "T-AA (Necessário)" },
        { label: "Render Scale", value: "85% - 100%" },
        { label: "Sharpness", value: "50% - 100%" },
        { label: "Reflex", value: "On + Boost" },
        { label: "Aspect Ratio", value: "4:3 (Esticado) / 16:10" },
        { label: "Som", value: "Night Mode (Dynamic Range)" }
    ];

    const contentSections = [
        {
            title: "Introdução: Vulkan vs DX11",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O R6 oferece duas versões de lançamento.
          <br/><strong>Vulkan:</strong> Melhor gerenciamento de VRAM e CPU (menos drops de FPS). Suporta Nvidia Reflex. RECOMENDADO.
          <br/><strong>DX11:</strong> Mais instável em FPS, mas alguns preferem a "sensação" do mouse. Hoje em dia, Vulkan é superior em 90% dos casos.
        </p>
      `
        },
        {
            title: "Capítulo 1: Gráficos (Clean Vision)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Qualidade Visual</h4>
                <p class="text-gray-400 text-xs text-justify">
                    - <strong>Texture Quality:</strong> Medium. (High ocupa muita VRAM e não muda nada competitivo).
                    - <strong>Texture Filtering:</strong> Anisotropic 16x.
                    - <strong>LOD Quality:</strong> Ultra/High. (Importante para renderizar cabeças de inimigos em frestas distantes).
                    - <strong>Shading Quality:</strong> Low. (Deixa os operadores mais visíveis, sem brilho).
                    - <strong>Shadow Quality:</strong> Medium. (Essencial para ver a sombra dinâmica do inimigo antes dele aparecer).
                    - <strong>Reflection Quality:</strong> Low.
                    - <strong>Lens Effects / Zoom-in Depth of Field:</strong> OFF. (Ambos atrapalham).
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Anti-Aliasing (O Grande Segredo)",
            content: `
        <p class="mb-4 text-gray-300">
            A maioria desliga AA em jogos FPS. No R6, desligar deixa os pixels serrilhados "tremendo", o que distrai em ângulos longos.
            <br/>Pro Players usam <strong>T-AA</strong>.
            <br/>- <strong>Render Scale:</strong> Se tiver GPU boa, 100%. Se precisar de FPS, baixe até 85%.
            <br/>- <strong>T-AA Sharpness:</strong> Aumente para 50% a 100%. Isso recupera a nitidez perdida pelo blur do T-AA.
            <br/>Resultado: Imagem limpa, estável e nítida.
        </p>
      `
        },
        {
            title: "Capítulo 3: Aspect Ratio e FOV",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>4:3:</strong> Deixa os inimigos "gordos", mais fáceis de acertar HS. Reduz o campo de visão lateral. Favorito dos fraggers.
            - <strong>16:10:</strong> O meio termo.
            - <strong>16:9:</strong> Padrão. Melhor visão periférica.
            - <strong>FOV:</strong> 90 (máximo). Combinação clássica: 4:3 com FOV 90.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Áudio (Night Mode)",
            content: `
        <p class="mb-4 text-gray-300">
            Em Audio > Dynamic Range.
            <br/>Escolha <strong>Night Mode</strong>.
            <br/>Ele comprime o áudio: sons altos (explosões) ficam mais baixos, sons baixos (passos) ficam mais altos.
            <br/>Em Hi-Fi, a explosão te ensurdece e você não ouve o flanco. No Night Mode, você ouve tudo.
        </p>
      `
        },
        {
            title: "Capítulo 5: Nvidia Reflex (Latência)",
            content: `
        <p class="mb-4 text-gray-300">
            Só disponível no Vulkan.
            <br/>Ative <strong>On + Boost</strong>.
            <br/>Mantém a GPU em clock alto e impede fila de frames pré-renderizados. Reduz o input lag significativamente.
        </p>
      `
        },
        {
            title: "Capítulo 6: Raw Input",
            content: `
        <p class="mb-4 text-gray-300">
            Em Controls > Raw Input - Mouse / Keyboard: ON.
            <br/>Lê os dados direto do driver, ignorando a aceleração do Windows.
        </p>
      `
        },
        {
            title: "Capítulo 7: Mouse Multiplier (Ajuste Fino)",
            content: `
        <p class="mb-4 text-gray-300">
            Se você acha a sensibilidade 4 muito lenta e 5 muito rápida.
            <br/>Você pode editar o arquivo <code>GameSettings.ini</code> em Documentos/My Games/Rainbow Six.
            <br/>Mude o <code>MouseSensitivityMultiplierUnit=0.02</code> para <code>0.002</code> ou outro valor para ter ajuste decimal na sensibilidade.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Benchmark Tool",
            content: `
            <p class="mb-4 text-gray-300">
                O R6 tem um benchmark excelente.
                <br/>Rode-o após cada mudança. Observe o "Mínimo FPS" (1% low). O jogo precisa ficar acima de 144 fps o tempo todo nas explosões.
            </p>
            `
        },
        {
            title: "Capítulo 9: Skins de Mira",
            content: `
            <p class="mb-4 text-gray-300">
                Em Accessibility.
                <br/>Mude a cor da mira (Optic Color) para algo que contraste. Violeta, Verde Neon ou Turquesa são ótimos. Vermelho se mistura com sangue e tapetes.
            </p>
            `
        },
        {
            title: "Capítulo 10: Server Data Center",
            content: `
            <p class="mb-4 text-gray-300">
                Se o jogo te conectar no servidor errado (EUA em vez de BR):
                <br/>Edite o <code>GameSettings.ini</code>.
                <br/>Procure por <code>DataCenterHint=default</code> e mude para <code>playfab/brazilsouth</code>.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "DLSS vale a pena?",
            answer: "No competitivo, não. O DLSS adiciona um leve blur em movimento que pode esconder pixel peeks. Use T-AA com Render Scale menor se precisar de FPS."
        },
        {
            question: "Som abafado?",
            answer: "O som do R6 simula propagação real (atravessa paredes destruídas). Abra buracos nas paredes com soco/tiro para ouvir melhor o outro lado (Sound Holes)."
        }
    ];

    const externalReferences = [
        { name: "R6Fix (Report Bugs)", url: "https://r6fix.ubi.com/" },
        { name: "ProSettings R6", url: "https://prosettings.net/rainbow-6-siege-pro-settings-gear-list/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/overwatch-2-otimizacao-fps-input-lag-reduce-buffering",
            title: "Overwatch 2",
            description: "FPS Competitivo."
        },
        {
            href: "/guias/valorant-reduzir-input-lag",
            title: "Valorant",
            description: "Otimização."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
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
