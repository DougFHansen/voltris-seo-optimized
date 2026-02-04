import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Limitar o FPS com RivaTuner e NVIDIA (Frametime Perfeito)";
const description = "Quer acabar com o stuttering e ter uma imagem fluida? Aprenda a limitar o seu FPS usando o RivaTuner (RTSS) e o Painel de Controle da NVIDIA em 2026.";
const keywords = [
    'como limitar fps rivatuner rtss tutorial 2026',
    'melhor forma de limitar fps nvidia painel de controle',
    'acabar com stuttering limitando fps guia',
    'limitar fps vs v-sync qual o melhor 2026',
    'como usar rivatuner para frametime estável'
];

export const metadata: Metadata = createGuideMetadata('limitar-fps-rivatuner-nvidia', title, description, keywords);

export default function LimitFPSGuide() {
    const summaryTable = [
        { label: "RivaTuner (RTSS)", value: "Melhor para Frametime estável" },
        { label: "Painel NVIDIA", value: "Menor Input Lag / Mais prático" },
        { label: "V-Sync", value: "Evite se quiser alta performance" },
        { label: "Check de Monitor", value: "Limite sempre no Hertz do monitor ou –1" }
    ];

    const contentSections = [
        {
            title: "Por que Limitar o FPS se meu PC é Potente?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, ter um FPS alto (ex: 300 FPS) nem sempre significa que o jogo está fluido. O que realmente importa para a suavidade da imagem é o **Frametime** (o tempo que cada quadro leva para ser renderizado). Se o seu FPS oscila entre 200 e 300, você sentirá travadinhas. Limitar o FPS em um valor fixo (ex: 144) garante que todos os quadros saiam no mesmo tempo, eliminando o stuttering e reduzindo o calor da sua GPU.
        </p>
      `
        },
        {
            title: "1. RivaTuner (RTSS): A Precisão de Milissegundos",
            content: `
        <p class="mb-4 text-gray-300">O RivaTuner é considerado o limitador mais preciso do mundo:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Abra o RivaTuner Statistics Server (instala junto com o MSI Afterburner).</li>
            <li>No campo <strong>'Framerate limit'</strong>, digite o valor desejado (ex: 144).</li>
            <li>Mude o <strong>'Framerate limit mode'</strong> para 'Async' (para menos lag) ou 'Front-edge' (para mais precisão).</li>
            <li>O RTSS garante que a entrega dos quadros seja milimétrica, resultando em uma linha de frametime perfeitamente reta.</li>
        </ol>
      `
        },
        {
            title: "2. Pelo Painel de Controle NVIDIA (Ultra Rápido)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Sem instalar nada extra:</h4>
            <p class="text-sm text-gray-300">
                1. Clique com o botão direito na área de trabalho > Painel de Controle da NVIDIA. <br/>
                2. Vá em 'Gerenciar as configurações em 3D'. <br/>
                3. Procure por <strong>'Taxa Máxima de Quadros'</strong>. <br/>
                4. Coloque em 'Ligado' e escolha o valor. <br/>
                <strong>Dica:</strong> Se você usa <strong>G-Sync</strong>, limite o FPS para <strong>3 frames abaixo</strong> do Hertz do seu monitor (ex: 141 FPS para um monitor de 144Hz) para garantir que o G-Sync nunca desligue.
            </p>
        </div>
      `
        },
        {
            title: "3. RivaTuner vs NVIDIA: Qual escolher?",
            content: `
        <p class="mb-4 text-gray-300">
            - Use o <strong>RivaTuner</strong> se você sente que o jogo está "tremendo" mesmo com FPS alto. Ele é superior na estabilidade da imagem.
            <br/><br/>
            - Use o <strong>Painel NVIDIA</strong> se você joga competitivamente (Valorant, CS2). Em 2026, o limitador da NVIDIA tem um input lag ligeiramente menor que o do RivaTuner, o que pode fazer a diferença na reação de um tiro.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/overclock-gpu-msi-afterburner",
            title: "MSI Afterburner",
            description: "Como usar o monitor de FPS junto com o RivaTuner."
        },
        {
            href: "/guias/aceleracao-hardware-gpu-agendamento",
            title: "Latency Fix",
            description: "Reduza o input lag do seu sistema."
        },
        {
            href: "/guias/guia-compra-monitores",
            title: "Entenda os Hertz",
            description: "Saiba por que o limite depende do seu monitor."
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
            relatedGuides={relatedGuides}
        />
    );
}
