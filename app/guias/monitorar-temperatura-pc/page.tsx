import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Monitorar Temperatura do PC (CPU e GPU) - Voltris";
const description = "Seu PC desliga sozinho em jogos? Aprenda a monitorar temperaturas com HWMonitor e MSI Afterburner. Veja quais são as temperaturas seguras.";
const keywords = ['monitorar temperatura pc', 'cpu temperatura normal', 'gpu esquentando muito', 'hwmonitor tutorial', 'ver temperatura ingame'];

export const metadata: Metadata = createGuideMetadata('monitorar-temperatura-pc', title, description, keywords);

export default function TempGuide() {
    const summaryTable = [
        { label: "Dificuldade", value: "Iniciante" },
        { label: "Ferramenta", value: "HWMonitor" }
    ];

    const contentSections = [
        {
            title: "Quais são as temperaturas normais?",
            content: `
        <table class="w-full text-left border-collapse my-6">
            <thead>
                <tr class="border-b border-gray-700 text-[#31A8FF]">
                    <th class="p-2">Componente</th>
                    <th class="p-2">Idle (Parado)</th>
                    <th class="p-2">Jogando (Carga)</th>
                    <th class="p-2">Perigo (Throttling)</th>
                </tr>
            </thead>
            <tbody class="text-gray-300 text-sm">
                <tr class="border-b border-gray-800">
                    <td class="p-2">Processador (CPU)</td>
                    <td class="p-2">35°C - 50°C</td>
                    <td class="p-2">60°C - 80°C</td>
                    <td class="p-2 text-red-400">> 90°C</td>
                </tr>
                 <tr>
                    <td class="p-2">Placa de Vídeo (GPU)</td>
                    <td class="p-2">30°C - 50°C</td>
                    <td class="p-2">65°C - 85°C</td>
                    <td class="p-2 text-red-400">> 88°C</td>
                </tr>
            </tbody>
        </table>
      `,
            subsections: []
        },
        {
            title: "Como ver a temperatura DENTRO do jogo?",
            content: `
        <p class="mb-4">Minimizar para olhar o HWMonitor não é prático. Vamos usar o OSD (On Screen Display) do Afterburner.</p>
        <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4">
            <li>Abra as configurações do MSI Afterburner (engrenagem).</li>
            <li>Vá na aba <strong>Monitoramento</strong>.</li>
            <li>Clique em "Temperatura da GPU" na lista.</li>
            <li>Lá embaixo, marque a caixinha <strong>"Exibir nas Informações em Tela (OSD)"</strong>.</li>
            <li>Repita para "Temperatura da CPU" e "Taxa de Quadros" (FPS).</li>
            <li>Abra o jogo. Os números aparecerão no canto da tela.</li>
        </ol>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 minutos"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
