import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Melhores Drivers NVIDIA Antigos para FPS e Estabilidade (Lista 2026)";
const description = "Driver novo nem sempre é melhor. Conheça as versões lendárias (537.58, 457.30) que a comunidade competitiva usa para ter menor latência no CS2 e Valorant.";
const keywords = ['melhor driver nvidia cs2', 'driver nvidia 537.58', 'driver nvidia mais leve', 'latencia driver nvidia', 'fps drop driver novo', 'reverter driver nvidia'];

export const metadata: Metadata = createGuideMetadata('melhores-drivers-nvidia-antigos', title, description, keywords);

export default function DriverGuide() {
    const summaryTable = [
        { label: "O Rei Atual", value: "537.58" },
        { label: "O Clássico", value: "457.30" },
        { label: "RTX 4000+", value: "Mais Novo" },
        { label: "GTX 1000", value: "Antigos" }
    ];

    const contentSections = [
        {
            title: "Por que usar drivers antigos?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          A cada atualização, a NVIDIA adiciona suporte para novos jogos AAA e novas placas. Isso aumenta o tamanho do driver ("Bloatware"). Para quem joga apenas CS2 ou Valorant em uma placa antiga (GTX 1060, 1650), drivers novos muitas vezes trazem stutters.
        </p>
      `,
            subsections: []
        },
        {
            title: "O Hall da Fama dos Drivers",
            content: `
        <div class="space-y-4">
            <div class="bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
                <strong class="text-white block text-lg">Versão 537.58 (Lançado: Out/2023)</strong>
                <p class="text-gray-300 text-sm">
                    Considerado pela comunidade o driver <strong>mais estável da era moderna</strong>. Funciona perfeitamente em RTX 2000, 3000 e 4000. Tem input lag extremamente baixo e quase zero stutters no CS2.
                </p>
            </div>
             <div class="bg-yellow-900/20 p-4 rounded border-l-4 border-yellow-500">
                <strong class="text-white block text-lg">Versão 457.30 (Lançado: 2020)</strong>
                <p class="text-gray-300 text-sm">
                    Lendário para a série <strong>GTX 1000 (1050 Ti, 1060)</strong> e 1600. É super leve. Porém, muitos jogos novos (The Finals, COD MW3) podem se recusar a abrir com ele. Use apenas se você só joga eSports antigos.
                </p>
            </div>
            <div class="bg-green-900/20 p-4 rounded border-l-4 border-green-500">
                <strong class="text-white block text-lg">Versão Mais Recente</strong>
                <p class="text-gray-300 text-sm">
                    Use o mais recente APENAS se você joga lançamentos AAA (Cyberpunk, Alan Wake 2) ou tem uma RTX 4070/4080/4090. Placas novas precisam de otimizações novas.
                </p>
            </div>
        </div>
      `,
            subsections: []
        },
        {
            title: "Como instalar driver antigo sem bugar tudo?",
            content: `
        <p class="mb-4 text-gray-300">
            Você não pode simplesmente instalar por cima.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
            <li>Baixe o driver específico no site "NVIDIA Advanced Driver Search".</li>
            <li>Baixe o <strong>NVCleanstall</strong> (Software incrível que remove a telemetria do instalador da NVIDIA).</li>
            <li>Use o NVCleanstall para selecionar o arquivo que você baixou.</li>
            <li>Marque apenas: "Display Driver" e "PhysX". Desmarque tudo o resto (GeForce Experience, USB-C Driver, Telemetry).</li>
            <li>Instale.</li>
        </ol>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
