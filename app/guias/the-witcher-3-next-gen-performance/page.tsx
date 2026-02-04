import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "The Witcher 3 Next Gen: Guia de Performance PC (2026)";
const description = "Quer rodar The Witcher 3 com Ray Tracing e FPS estável? Aprenda as melhores configurações para a versão Next Gen e como evitar o stuttering em 2026.";
const keywords = [
    'the witcher 3 next gen performance guide 2026',
    'como aumentar fps the witcher 3 next gen tutorial',
    'the witcher 3 dx12 stuttering fix guia 2026',
    'melhores configurações graficas the witcher 3 pc tutorial',
    'the witcher 3 next gen pc fraco guia de otimização 2026'
];

export const metadata: Metadata = createGuideMetadata('the-witcher-3-next-gen-performance', title, description, keywords);

export default function Witcher3PerformanceGuide() {
    const summaryTable = [
        { label: "API Recomendada", value: "DirectX 12 (Para Ray Tracing/DLSS) / DX11 (PC Fraco)" },
        { label: "Ajuste de Ouro", value: "Densidade de Erva (Médio) / Sombras (Alto)" },
        { label: "Tecnologia", value: "DLSS 3 / FSR 3 / XeSS" },
        { label: "Dificuldade", value: "Média" }
    ];

    const contentSections = [
        {
            title: "O Desafio da Nova Geração",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **The Witcher 3 Next Gen** transformou um jogo de 2015 em um título extremamente exigente para os padrões de 2026. Com a adição de **Global Illumination** via Ray Tracing e novos assets em 4K, o jogo agora exige muito mais do processador e da placa de vídeo. Se você sente que o jogo está "pesado" mesmo em hardware potente, o segredo está no balanceamento correto entre o DirectX 12 e as tecnologias de Upscaling.
        </p>
      `
        },
        {
            title: "1. Ray Tracing: Vale a pena?",
            content: `
        <p class="mb-4 text-gray-300">Em 2026, o Ray Tracing no Witcher 3 é um comedor de performance:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>RT Global Illumination:</strong> Deixa as cores muito mais realistas, mas corta o seu FPS pela metade.</li>
            <li><strong>Reflexos e Sombras RT:</strong> Desative este primeiro. O ganho visual é pequeno perto do custo de performance.</li>
            <li><strong>Dica:</strong> Se você não possui uma RTX 4070 ou superior, mantenha o RT desligado e foque na configuração 'Ultra+' para o restante dos gráficos.</li>
        </ul >
      `
        },
        {
            title: "2. Otimizando configurações de alto impacto",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Máximo ganho visual:</h4>
            <p class="text-sm text-gray-300">
                - <strong>Densidade de Erva (Foliage Density):</strong> No Ultra+, isso mata seu PC em Beauclair. Coloque no Médio ou Alto. <br/>
                - <strong>Visibilidade da Vegetação:</strong> Alto (Garante que as árvores não apareçam do nada). <br/>
                - <strong>Pós-processamento:</strong> Desative o 'Motion Blur' e o 'Chromatic Aberration' para uma imagem mais nítida. <br/>
                - <strong>Nvidia HairWorks:</strong> Desative totalmente, a menos que você queira ver os pelos do Geralt em 4K custando 20 FPS.
            </p>
        </div>
      `
        },
        {
            title: "3. Resolvendo Stuttering no DX12",
            content: `
        <p class="mb-4 text-gray-300">
            Muitos jogadores reclamam de travadinhas constantes na versão DirectX 12. 
            <br/><br/><strong>Dica de 2026:</strong> Certifique-se de que o **Shader Cache** no driver da sua placa de vídeo está configurado para 'Ilimitado'. Além disso, use o <strong>DLSS Frame Generation</strong> (se disponível) ou o <strong>FSR 3.0</strong>. Essas tecnologias de geração de quadros são essenciais para manter o frametime estável nas ruas lotadas de Novigrad.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/red-dead-redemption-2-melhores-configuracoes-rdr2",
            title: "Otimizar RDR2",
            description: "Dicas de performance para outro épico AAA."
        },
        {
            href: "/guias/hdr-windows-vale-a-pena-jogos",
            title: "HDR Witcher 3",
            description: "Melhore as cores do por do sol em Velen."
        },
        {
            href: "/guias/como-usar-ddu-driver-uninstaller",
            title: "Drivers de Vídeo",
            description: "Limpeza essencial para o DX12 rodar liso."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="25 min"
            difficultyLevel="Médio"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
