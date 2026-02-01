import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "HDMI 2.1 vs DisplayPort 1.4: Qual Cabo Usar para 144Hz, 240Hz e 4K? (2026)";
const description = "Vai conectar seu monitor gamer? Descubra se você deve usar HDMI ou DisplayPort para ter G-Sync, HDR e alta taxa de atualização sem tela preta.";
const keywords = ['hdmi 2.1 vs displayport 1.4', 'cabo monitor 144hz', 'displayport vs hdmi fps', 'cabo para 240hz', 'diferença hdmi displayport jogos', 'cabo displayport 1.2 vs 1.4'];

export const metadata: Metadata = createGuideMetadata('hdmi-2.1-vs-displayport-1.4-diferencas', title, description, keywords);

export default function CableGuide() {
    const summaryTable = [
        { label: "PC Gamer", value: "DisplayPort" },
        { label: "Console (PS5)", value: "HDMI 2.1" },
        { label: "TV 4K", value: "HDMI 2.1" },
        { label: "G-Sync", value: "DisplayPort" }
    ];

    const contentSections = [
        {
            title: "Regra Geral (The Golden Rule)",
            content: `
        <div class="bg-blue-900/20 p-6 rounded-xl border border-blue-500 mb-6 text-center">
            <h4 class="text-white font-bold text-xl mb-4">No Computador, use sempre DisplayPort.</h4>
            <p class="text-gray-300">
                O DisplayPort foi feito para computadores. O HDMI foi feito para TVs. Só com DisplayPort você garante compatibilidade total com G-Sync, FreeSync e overclock de monitor.
            </p>
        </div>
      `,
            subsections: []
        },
        {
            title: "Tabela de Capacidade (Resolução x Hz)",
            content: `
        <p class="mb-4 text-gray-300">Veja o que cada cabo aguenta (sem compressão).</p>
        <table class="w-full text-left border-collapse mb-6">
            <thead>
                <tr class="text-[#31A8FF] border-b border-gray-700">
                    <th class="p-2">Versão do Cabo</th>
                    <th class="p-2">1080p</th>
                    <th class="p-2">1440p (2K)</th>
                    <th class="p-2">4K</th>
                </tr>
            </thead>
            <tbody class="text-gray-300 text-sm">
                <tr class="border-b border-gray-800">
                    <td class="p-3 font-bold text-gray-400">HDMI 1.4 (Antigo)</td>
                    <td class="p-3">144Hz</td>
                    <td class="p-3">75Hz</td>
                    <td class="p-3">30Hz</td>
                </tr>
                <tr class="border-b border-gray-800">
                    <td class="p-3 font-bold text-white">HDMI 2.0 (Comum)</td>
                    <td class="p-3">240Hz</td>
                    <td class="p-3">144Hz</td>
                    <td class="p-3">60Hz</td>
                </tr>
                 <tr class="border-b border-gray-800 bg-green-900/20">
                    <td class="p-3 font-bold text-green-400">HDMI 2.1 (PS5)</td>
                    <td class="p-3">400Hz+</td>
                    <td class="p-3">240Hz</td>
                    <td class="p-3">120Hz</td>
                </tr>
                <tr class="border-b border-gray-800">
                    <td class="p-3 font-bold text-white">DisplayPort 1.2</td>
                    <td class="p-3">240Hz</td>
                    <td class="p-3">144Hz</td>
                    <td class="p-3">60Hz</td>
                </tr>
                 <tr class="border-b border-gray-800 bg-blue-900/20">
                    <td class="p-3 font-bold text-blue-400">DisplayPort 1.4</td>
                    <td class="p-3">360Hz</td>
                    <td class="p-3">240Hz</td>
                    <td class="p-3">120Hz</td>
                </tr>
            </tbody>
        </table>
      `,
            subsections: []
        },
        {
            title: "O Problema do G-Sync no HDMI",
            content: `
        <p class="mb-4 text-gray-300">
            A tecnologia <strong>NVIDIA G-Sync Compatible</strong> (que elimina cortes na tela) só funciona oficialmente via DisplayPort na maioria dos monitores. Via HDMI, muitas vezes você fica limitado apenas ao "HDMI Forum VRR" que é inferior.
        </p>
        <p class="text-gray-300">
            Se você comprar um monitor de 144Hz e usar o cabo HDMI que veio na caixa, pode ser que ele limite a 120Hz ou 60Hz. Sempre compre um cabo DisplayPort 1.4 de boa qualidade (pino 20 isolado).
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
