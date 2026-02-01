import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Stardew Valley com Lag (Mods)? Instale o SpriteMaster e Otimize o SMAPI (2026)";
const description = "Colocou 200 mods no Stardew Valley e o loading demora 5 minutos? Aprenda a acelerar o SMAPI e usar o SpriteMaster para dobrar o FPS.";
const keywords = ['stardew valley lag mods', 'smapi demorando carregar', 'spritemaster stardew valley', 'stardew valley expanded travando', 'aumentar fps stardew valley', 'clear cache smapi'];

export const metadata: Metadata = createGuideMetadata('stardew-valley-mods-lag-fix', title, description, keywords);

export default function StardewGuide() {
    const summaryTable = [
        { label: "Mod Essencial", value: "SpriteMaster" },
        { label: "Carregamento", value: "FastLoads" },
        { label: "SMAPI", value: "Console Off" },
        { label: "RAM", value: "4GB+" }
    ];

    const contentSections = [
        {
            title: "O Problema dos Mods (SMAPI)",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          O Stardew Valley é leve. O SMAPI (carregador de mods) não é. Quando você instala o "Stardew Valley Expanded" + 100 mods, o jogo precisa recalcular texturas a cada frame.
        </p>
      `,
            subsections: []
        },
        {
            title: "A Solução: SpriteMaster",
            content: `
        <div class="bg-blue-900/20 p-6 rounded-xl border border-blue-500 mb-6">
            <h4 class="text-white font-bold mb-2">SpriteMaster Resample</h4>
            <p class="text-gray-300 text-sm">
                Esse mod faz duas coisas:
                <br/>1. Suaviza os gráficos (você pode desligar isso se gostar dos pixels).
                <br/>2. <strong>Otimiza o código do jogo</strong> (Isso é o importante).
            </p>
            <p class="text-white mt-4 font-bold">Como configurar:</p>
            <ul class="list-disc list-inside text-gray-300 text-sm">
                <li>Baixe o SpriteMaster no Nexus Mods.</li>
                <li>Instale na pasta Mods.</li>
                <li>Dentro do jogo, aperte <strong>F11</strong> para abrir o menu do mod.</li>
                <li>Desmarque "Resample" (se quiser pixel art original).</li>
                <li>Mantenha "Optimize" ligado. Isso reduz o tempo de loading pela metade.</li>
            </ul>
        </div>
      `,
            subsections: []
        },
        {
            title: "Acelerar o SMAPI (Tirar o Console)",
            content: `
        <p class="text-gray-300 mb-4">
            Aquela janela preta cheia de texto colorido que abre junto com o jogo consome CPU para escrever os logs.
        </p>
        <p class="text-gray-300">
            Adicione <code>--no-terminal</code> nas opções de inicialização da Steam. A janela preta some e o jogo abre mais rápido (mas você não verá erros de mods se crashar).
        </p>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
