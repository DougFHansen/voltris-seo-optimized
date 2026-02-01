import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Project Zomboid FPS Boost: Como Rodar com Hordas Gigantes sem Travar (2026)";
const description = "Louisville está injogável? O sangue no chão e o zoom matam seu FPS. Veja como configurar o arquivo .bat para alocar mais RAM e os mods essenciais de limpeza.";
const keywords = ['project zomboid fps boost', 'zomboid travando muito zoombie', 'aumentar memoria ram project zomboid', 'melhores mods performance zomboid', 'rain wash blood mod', 'desativar sangue zomboid'];

export const metadata: Metadata = createGuideMetadata('project-zomboid-fps-boost', title, description, keywords);

export default function ZomboidGuide() {
    const summaryTable = [
        { label: "Matador de FPS", value: "Poças de Sangue" },
        { label: "Mod Essencial", value: "Rain Wash" },
        { label: "RAM", value: "Editar .BAT" },
        { label: "Zoom", value: "250% é pesado" }
    ];

    const contentSections = [
        {
            title: "Desativando o Sangue (Blood Decals)",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Cada zumbi morto deixa uma poça. Depois de matar 500 zumbis, o jogo precisa renderizar 500 poças. Isso explode a CPU.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-6">
            <li>Vá em Opções > Exibição.</li>
            <li><strong>Decalques de Sangue (Blood Decals):</strong> Mude de 100% para <strong>10%</strong> ou <strong>Nenhum</strong>.</li>
            <li>Isso triplica o FPS em cidades grandes.</li>
        </ul>
      `,
            subsections: []
        },
        {
            title: "Alocando Mais RAM Manualmente",
            content: `
        <p class="mb-4 text-gray-300">
            O jogo vem configurado para usar pouco. Se você tem 16GB, dê mais comida pro bicho.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 mb-6">
            <li>Vá na pasta do jogo na Steam.</li>
            <li>Clique direito no arquivo <code>ProjectZomboid64.json</code> (ou edite o arquivo .bat se usar versão antiga).</li>
            <li>Procure por <code>-Xmx3072m</code> (Isso significa 3GB).</li>
            <li>Mude para <code>-Xmx8192m</code> (8GB) se você tiver 16GB de RAM.</li>
            <li>Salve e abra o jogo. O loading vai ser instantâneo.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Mods Obrigatórios",
            content: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-800 p-4 rounded border-l-4 border-blue-500">
                <strong class="text-white block">Rain Wash</strong>
                <p class="text-gray-300 text-sm">
                    Faz a chuva limpar o sangue do chão automaticamente. Mantém seu save leve a longo prazo.
                </p>
            </div>
            <div class="bg-gray-800 p-4 rounded border-l-4 border-green-500">
                <strong class="text-white block">Better FPS</strong>
                <p class="text-gray-300 text-sm">
                    Otimiza a renderização de zumbis distantes.
                </p>
            </div>
        </div>
      `,
            subsections: []
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
            summaryTable={summaryTable}
        />
    );
}
