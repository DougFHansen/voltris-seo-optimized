import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Erro DX11 feature level 10.0 is required to run the engine (Valorant Fix)";
const description = "Seu Valorant não abre e dá erro de Feature Level 10.0? Descubra se sua placa de vídeo morreu ou se é apenas um driver corrompido.";
const keywords = ['dx11 feature level 10.0 valorant', 'placa de video nao suporta dx11', 'valorant parou de rodar', 'atualizar directx 11', 'erro de engine valorant', 'gpu antiga valorant'];

export const metadata: Metadata = createGuideMetadata('dx11-feature-level-10.0-error-valorant', title, description, keywords);

export default function DX11Guide() {
    const summaryTable = [
        { label: "Causa", value: "GPU Antiga" },
        { label: "Solução", value: "Trocar GPU" },
        { label: "Mito", value: "dxcpl.exe" },
        { label: "Updates", value: "Driver" }
    ];

    const contentSections = [
        {
            title: "A Verdade Dolorosa: Sua GPU suporta o jogo?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          O Valorant e o CS2 foram atualizados e agora EXIGEM hardware compatível com DirectX 11. Não adianta instalar o software DirectX 11 se a peça física (Placa de Vídeo) parou no DirectX 10.
        </p>
        <div class="bg-red-900/20 p-6 rounded-xl border border-red-500 mb-6">
            <h4 class="text-white font-bold mb-2">Lista de Placas que NÃO RODAM MAIS (Obsoletas):</h4>
            <ul class="list-disc list-inside text-gray-300 text-sm">
                <li>NVIDIA GeForce 9000 Séries (9800 GT, 9500 GT).</li>
                <li>NVIDIA GeForce 200 Séries (GT 210, GT 220, GTS 250).</li>
                <li>Intel HD Graphics de 1ª e 2ª Geração (Core i3/i5 de 2010/2011).</li>
            </ul>
            <p class="text-white mt-4 font-bold">Se você tem uma dessas, nenhuma "dll milagrosa" vai fazer o jogo abrir. Você precisa comprar uma placa nova.</p>
        </div>
      `,
            subsections: []
        },
        {
            title: "Tenho uma placa nova e dá erro (GTX 600+ / HD 4000+)",
            content: `
        <p class="mb-4 text-gray-300">
            Se sua placa é compatível (GTX 750, Intel HD 4000, Radeon HD 5000+) e o erro aparece, é driver corrompido.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Baixe o programa <strong>DDU (Display Driver Uninstaller)</strong>.</li>
            <li>Baixe o driver mais recente da sua placa no site da fabricante.</li>
            <li>Desligue a internet (para o Windows não instalar nada sozinho).</li>
            <li>Abra o DDU e clique em <strong>"Limpar e Reiniciar"</strong>.</li>
            <li>Após reiniciar, instale o driver que você baixou.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "O Golpe do 'dxcpl.exe'",
            content: `
        <p class="text-gray-300 mb-4">
            Muitos vídeos no YouTube mandam você baixar o <code>dxcpl.exe</code> e forçar o "Feature Level 11_0".
        </p>
        <p class="text-gray-300">
            Isso é um emulador oficial da Microsoft para desenvolvedores. Ele faz a CPU "fingir" que é uma GPU. O jogo VAI abrir, mas vai rodar a <strong>1 FPS (Um frame por segundo)</strong>. É impossível jogar. Não perca seu tempo com isso.
        </p>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="5 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
