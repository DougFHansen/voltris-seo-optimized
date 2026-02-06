import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'red-dead-redemption-2-melhores-configuracoes',
    title: "Red Dead Redemption 2 (2026): Configurações Otimizadas (Hardware Unboxed)",
    description: "RDR2 é lindo, mas o preset Ultra mata FPS. Use estas configurações otimizadas (baseadas na análise da Hardware Unboxed) para ganhar 40% de performance com visual idêntico.",
    category: 'jogos',
    difficulty: 'Intermediário',
    time: '30 min'
};

const title = "RDR2 Optimized Settings (2026): Ultra Visual, High FPS";
const description = "Rockstar colocou settings no 'Ultra' que nem RTX 4090 aguenta direito (como MSAA e Water Physics). O segredo é saber o que baixar.";

const keywords = [
    'rdr2 melhores configurações graficas pc medio',
    'red dead redemption 2 hardware unboxed settings 2026',
    'rdr2 blurry fix taa sharpening',
    'water physics quality rdr2 fps',
    'tree tessellation rdr2 performance',
    'dlss vs fsr 2.0 rdr2 qualidade',
    'volumetric raymarch resolution rdr2',
    'err_gfx_state crash fix rdr2',
    'voltris optimizer rockstar',
    'vulkan vs dx12 rdr2 benchmark'
];

export const metadata: Metadata = createGuideMetadata('red-dead-redemption-2-melhores-configuracoes', title, description, keywords);

export default function RDR2Guide() {
    const summaryTable = [
        { label: "Textures", value: "Ultra (Sempre)" },
        { label: "Lighting", value: "Medium" },
        { label: "Water Physics", value: "50% (Crucial)" },
        { label: "Shadows", value: "High" },
        { label: "Tree Tessellation", value: "OFF" },
        { label: "TAA", value: "Medium + Sharpening" },
        { label: "API", value: "Vulkan (Geral)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Jogo Mais Bonito da Década",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          RDR2 tem dezenas de opções gráficas. Algumas comem 20 FPS e mudam quase nada visualmente. Vamos aplicar o "Console Settings" turbinado.
        </p>
      `
        },
        {
            title: "Capítulo 1: Texturas e Anisotropia (Não Baixe)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Texture Quality: Ultra</h4>
                <p class="text-gray-400 text-xs text-justify">
                    A diferença do High para o Ultra é brutal. As texturas no High parecem Low.
                    <br/><strong>Mantenha no Ultra</strong> mesmo em placas de 4GB/6GB VRAM. O impacto na performance é nulo se tiver VRAM, o impacto é só na memória.
                </p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Anisotropic Filtering: x16</h4>
                <p class="text-gray-400 text-xs">
                    Custa 1 ou 2 FPS e faz o chão ficar nítido à distância. Nunca baixe isso.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Os Assassinos de FPS (Água e Árvores)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Water Physics Quality:</strong> Defina na <strong>Metade (Slider no meio)</strong>.
            <br/>Se colocar no máximo, a simulação da água consome excessivamente CPU e GPU. Visualmente é idêntico.
            <br/>- <strong>Tree Tessellation:</strong> OFF.
            <br/>Isso dá relevo 3D aos troncos das árvores. Em florestas, isso derruba o FPS pela metade. Desligado continua lindo.
            <br/>- <strong>Reflection Quality:</strong> Medium. (O Ultra renderiza reflexos em espelhos que você quase nunca vê).
        </p>
      `
        },
        {
            title: "Capítulo 3: Iluminação e Sombras",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Global Illumination:</strong> High.
            - <strong>Shadow Quality:</strong> High. (Ultra deixa as sombras muito "duras", High é mais suave e realista).
            - <strong>Far Shadow Quality:</strong> Medium.
            - <strong>Volumetric Quality (Nuvens/Neblina):</strong> Medium. (O Ultra é pesadíssimo).
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: TAA (Anti-Aliasing) e Borrão",
            content: `
        <p class="mb-4 text-gray-300">
            O TAA do RDR2 é famoso por ser borrado.
            <br/>- TAA: Medium.
            <br/>- FXAA: OFF.
            <br/>- MSAA: OFF (Pesa demais).
            <br/>- <strong>TAA Sharpening (Nitidez):</strong> Aumente o slider para 50% ou 70%. Isso remove o borrão de movimento sem criar serrilhados.
        </p>
      `
        },
        {
            title: "Capítulo 5: Vulkan vs DirectX 12",
            content: `
        <p class="mb-4 text-gray-300">
            Opção "Advanced Graphics" (Lá embaixo, desbloqueie).
            <br/>- <strong>Vulkan:</strong> Geralmente mais suave, menos stutters, melhor em hardware AMD.
            <br/>- <strong>DX12:</strong> Pode ter FPS máximo levemente maior, mas costuma ter mais micro-travadas.
            <br/>Recomendação: Comece com <strong>Vulkan</strong>. Se o jogo crashar (ERR_GFX_STATE), mude para DX12.
        </p>
      `
        },
        {
            title: "Capítulo 6: DLSS e FSR",
            content: `
        <p class="mb-4 text-gray-300">
            Se jogar em 1440p ou 4K:
            <br/>Ative o <strong>DLSS Quality</strong>.
            <br/>A implementação do DLSS no RDR2 é excelente e corrige o "shimmering" nas crinas dos cavalos e árvores melhor que o TAA nativo.
            <br/>Para 1080p, tente nativo primeiro, pois DLSS em 1080p pode perder detalhes distantes.
        </p>
      `
        },
        {
            title: "Capítulo 7: Geometria e Decals",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Geometry Level of Detail:</strong> 5/5 (Barrinha cheia). Baixar isso faz pedras aparecerem do nada (Pop-in). Não vale a pena baixar.
            - <strong>Grass Level of Detail:</strong> 4/10. Grama é pesado. 4 é o "sweet spot".
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Fix de Crash (ERR_GFX_STATE)",
            content: `
            <p class="mb-4 text-gray-300">
                Se o jogo fecha do nada:
                <br/>Vá em <code>Documentos\\Rockstar Games\\Red Dead Redemption 2\\Settings</code>.
                <br/>Apague todos os arquivos que começam com <code>sga_</code> (são arquivos de cache Vulkan). O jogo vai recriá-los.
                <br/>Adicione <code>-ignorepipelinecache</code> nos argumentos de inicialização da Steam/Epic.
            </p>
            `
        },
        {
            title: "Capítulo 9: Modo Online",
            content: `
            <p class="mb-4 text-gray-300">
                No Red Dead Online, estabilidade é mais importante que gráficos.
                <br/>Considere baixar a Iluminação Volumétrica para Low para garantir 60 FPS fixos em tiroteios em Saint Denis.
            </p>
            `
        },
        {
            title: "Capítulo 10: HDR em RDR2",
            content: `
            <p class="mb-4 text-gray-300">
                O modo "Cinematic HDR" é melhor que o "Game HDR".
                <br/>Aumente o "Paper White" para ter textos legíveis. O RDR2 tem um dos melhores HDRs em cenas noturnas e de fogueira.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "60 FPS é possível no Ultra?",
            answer: "Só com RTX 4070Ti pra cima em 1440p. No Ultra 'Real' (tudo maximizado), RDR2 é um monstro. Use as configurações otimizadas para ter visual 95% igual com o dobro de FPS."
        },
        {
            question: "Modo Janela sem Bordas causa lag?",
            answer: "No RDR2, sim. O jogo roda melhor e com HDR correto em Tela Cheia Exclusiva. O Alt-Tab pode crashar o jogo, tenha paciência."
        },
        {
            question: "Triple Buffering?",
            answer: "Desligue se tiver V-Sync desligado. Ajuda na latência."
        }
    ];

    const externalReferences = [
        { name: "Hardware Unboxed (Optimization Guide)", url: "https://www.youtube.com/watch?v=385eG1IEZMU" },
        { name: "PCGamingWiki RDR2", url: "https://www.pcgamingwiki.com/wiki/Red_Dead_Redemption_2" }
    ];

    const relatedGuides = [
        {
            href: "/guias/hdr-windows-11-calibracao-jogos",
            title: "HDR",
            description: "Essencial para RDR2."
        },
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Nvidia",
            description: "Sharpening extra."
        },
        {
            href: "/guias/monitor-ultrawide-jogos-competitivos",
            title: "Ultrawide",
            description: "Suporta nativamente."
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
