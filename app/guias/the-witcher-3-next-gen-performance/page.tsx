import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "The Witcher 3 Next-Gen: DX11 vs DX12 e Como Rodar Leve (2026)";
const description = "A atualização Next-Gen quebrou a performance? Veja como voltar para o DirectX 11 Clássico para ganhar 50% de FPS ou otimizar o Ray Tracing no DX12.";
const keywords = ['witcher 3 next gen travando', 'witcher 3 dx11 vs dx12', 'como aumentar fps witcher 3 next gen', 'hairworks witcher 3 vale a pena', 'otimizar witcher 3 rtx', 'witcher 3 classic version'];

export const metadata: Metadata = createGuideMetadata('the-witcher-3-next-gen-performance', title, description, keywords);

export default function WitcherGuide() {
    const summaryTable = [
        { label: "Mais FPS", value: "DX11 (Clássico)" },
        { label: "Mais Beleza", value: "DX12 (Ray Tracing)" },
        { label: "HairWorks", value: "Desligado" },
        { label: "DLSS/FSR", value: "Apenas no DX12" }
    ];

    const contentSections = [
        {
            title: "O Desastre do DX12",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          A versão "Next-Gen" (4.0+) introduziu o DirectX 12 para suportar Ray Tracing. Porém, a implementação é um "wrapper" (uma gambiarra) em cima do código antigo, o que causa uso excessivo de CPU e stutters (travadas).
        </p>
        <div class="bg-gray-800 p-6 rounded-xl border border-green-500 mb-6">
            <h4 class="text-white font-bold mb-2">A Solução Mágica: Voltar para DX11</h4>
            <p class="text-gray-300 text-sm">
                No Launcher do jogo (REDlauncher), antes de clicar em Jogar, mude a versão do DirectX de 12 para <strong>11</strong>.
                <br/><br/>
                <strong>Vantagens:</strong> O jogo roda liso, sem travar, e seu FPS dobra.
                <br/><strong>Desvantagens:</strong> Você perde o Ray Tracing e o DLSS/FSR. Mas o jogo continua com texturas 4K bonitas.
            </p>
        </div>
      `,
            subsections: []
        },
        {
            title: "Configurando o Grafico (Se você ficar no DX12)",
            content: `
        <p class="mb-4 text-gray-300">
            Se você tem uma RTX 4000 e quer usar Ray Tracing, configure assim:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2">
            <li><strong>NVIDIA HairWorks:</strong> DESLIGADO. (O cabelo do Geralt fica bonito, mas cada fio é simulado individualmente. Come 20 FPS).</li>
            <li><strong>Ray Tracing Global Illumination:</strong> Modo Performance ou Equilibrado. O modo "Qualidade" é injogável.</li>
            <li><strong>Densidade da Grama:</strong> Alto (No Ultra, a grama é desenhada até o horizonte infinito, matando a CPU).</li>
        </ul>
      `
        },
        {
            title: "Modo Foto vs Gameplay",
            content: `
        <p class="text-gray-300">
            O jogo tem um "Modo Foto" que aumenta os gráficos quando você pausa. Não tente jogar com essas configurações ativas o tempo todo. Use o preset "High" (Alto), não "Ultra+", se sua placa for média (RTX 3060 / RX 6600).
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
