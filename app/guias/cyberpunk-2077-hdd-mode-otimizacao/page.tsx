import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Cyberpunk 2077 Otimização: Modo HDD, Densidade de Multidão e Melhores Settings (2026)";
const description = "Cyberpunk 2077 roda pesado no seu PC? Aprenda a usar o Modo de Disco Rígido Lento, reduzir a Multidão (Crowd Density) e ganhar 30 FPS.";
const keywords = ['cyberpunk 2077 otimizacao', 'cyberpunk modo hdd lento', 'aumentar fps cyberpunk 2077', 'dlss vs fsr cyberpunk', 'densidade multidão cpu', 'melhores graficos cyberpunk pc fraco'];

export const metadata: Metadata = createGuideMetadata('cyberpunk-2077-hdd-mode-otimizacao', title, description, keywords);

export default function CyberpunkGuide() {
    const summaryTable = [
        { label: "CPU Killer", value: "Multidão (Crowd)" },
        { label: "GPU Killer", value: "Ray Tracing" },
        { label: "HDD Mode", value: "Obrigatório (Se HD)" },
        { label: "DLSS/FSR", value: "Qualidade" }
    ];

    const contentSections = [
        {
            title: "O Mito do Ray Tracing",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Cyberpunk 2077 é o garoto propaganda do Ray Tracing. Mas a verdade é: <strong>Se você tem menos que uma RTX 4070, DESLIGUE o Ray Tracing</strong>. O jogo já é lindo com iluminação rasterizada padrão. O RT come 50% do seu FPS para adicionar reflexos que você nem nota no tiroteio.
        </p>
      `,
            subsections: []
        },
        {
            title: "Settings Críticos (Ganhe 40 FPS)",
            content: `
        <div class="space-y-4">
            <div class="bg-red-900/20 p-4 rounded border-l-4 border-red-500">
                <strong class="text-white block">Densidade de Multidão (Crowd Density)</strong>
                <p class="text-gray-300 text-sm">
                    Essa opção fica na aba "Jogabilidade" (Gameplay), não em Gráficos. Mude de Alta para <strong>Baixa</strong>.
                    <br/>Isso alivia seu Processador (CPU) absurdamente. É a diferença entre 40 FPS e 60 FPS na cidade.
                </p>
            </div>
            <div class="bg-yellow-900/20 p-4 rounded border-l-4 border-yellow-500">
                <strong class="text-white block">Cascata de Sombras (Cascaded Shadows)</strong>
                <p class="text-gray-300 text-sm">
                    Diminua a resolução e o alcance das sombras. Sombras distantes consomem muita GPU. Coloque em Médio.
                </p>
            </div>
            <div class="bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
                <strong class="text-white block">Screen Space Reflections (SSR)</strong>
                <p class="text-gray-300 text-sm">
                    Isso faz o chão brilhar. No "Psycho" ou "Ultra", é pesado. Coloque em <strong>Alto</strong> ou Médio. A diferença visual é mínima, mas o FPS dobra.
                </p>
            </div>
        </div>
      `,
            subsections: []
        },
        {
            title: "Instalou no HD? Ative o Modo HDD",
            content: `
        <p class="mb-4 text-gray-300">
            A CD Projekt Red incluiu uma opção para quem não tem SSD. O jogo carrega texturas mais devagar e diminui a variedade de carros para não engasgar.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2">
            <li>Vá em Jogabilidade > <strong>Modo de Disco Rígido Lento (HDD Mode)</strong>.</li>
            <li>Coloque em <strong>Ligado</strong>.</li>
            <li>Isso elimina aquelas travadas onde você dirige rápido e o chão some.</li>
        </ul>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
