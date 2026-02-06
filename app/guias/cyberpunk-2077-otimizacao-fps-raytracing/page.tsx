import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'cyberpunk-2077-otimizacao-fps-raytracing',
    title: "Cyberpunk 2077 (2026): Otimização Definitiva, Ray Tracing e HDD Mode",
    description: "Night City é pesada. Aprenda a dobrar seu FPS usando DLSS/FSR, configurar a Densidade de Multidão e usar o modo HDD para evitar texturas sumindo.",
    category: 'jogos',
    difficulty: 'Avançado',
    time: '35 min'
};

const title = "Cyberpunk 2077 Tuning (2026): FPS em Night City";
const description = "O jogo mais pesado da geração exige ajustes finos. Não confie no 'Preset Ultra'. Vamos ajustar sombra por sombra para ganhar performance sem perder a beleza neon.";

const keywords = [
    'cyberpunk 2077 melhores configurações graficas 2026',
    'cyberpunk 2077 hdd mode slow texture fix',
    'crowd density fps impact cyberpunk',
    'dlss quality vs balanced vs performance',
    'ray tracing overdrive vale a pena',
    'fsr 3.0 frame generation cyberpunk mod',
    'cascaded shadows resolution otimização',
    'screen space reflections quality',
    'voltris optimizer cyberpunk',
    'como rodar cyberpunk em pc fraco'
];

export const metadata: Metadata = createGuideMetadata('cyberpunk-2077-otimizacao-fps-raytracing', title, description, keywords);

export default function CyberpunkGuide() {
    const summaryTable = [
        { label: "Crowd Density", value: "Low / Medium" },
        { label: "DLSS / FSR", value: "Quality (Obrigatório)" },
        { label: "Cascaded Shadows", value: "Medium" },
        { label: "Volumetric Fog", value: "Low (Ganha muito FPS)" },
        { label: "Screen Space Ref", value: "High (Visual) ou Low" },
        { label: "Ray Tracing", value: "OFF (Se GPU < RTX 3070)" },
        { label: "HDD Mode", value: "Auto / On (Se sem NVMe)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Benchmark de 2026",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Cyberpunk 2077 com a engine REDengine 4 é o teste final para qualquer PC. Mesmo em 2026, rodá-lo no Ultra com Path Tracing exige hardware de ponta. Mas com ajustes, um PC médio roda lindo a 60 FPS.
        </p>
      `
        },
        {
            title: "Capítulo 1: Crowd Density (O Devorador de CPU)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Aba Gameplay (Não Gráficos!)</h4>
                <p class="text-gray-400 text-xs text-justify">
                    Muitos não acham essa opção. Ela fica em "Gameplay".
                    <br/>- <strong>Crowd Density (Densidade da Multidão):</strong> Coloque em <strong>Low</strong> ou <strong>Medium</strong>.
                    <br/>No High, o jogo renderiza centenas de NPCs com IA única. Isso mata qualquer CPU (mesmo i9) em áreas como o Mercado de Kabuki. Baixar para Low estabiliza o FPS drasticamente nas cidades.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: DLSS, FSR e XeSS",
            content: `
        <p class="mb-4 text-gray-300">
            É impossível jogar Cyberpunk nativo em alta resolução sem uma RTX 5090.
            <br/>- <strong>Nvidia:</strong> Use DLSS Quality. Se precisar, DLSS Balanced. Evite Performance em 1080p (fica borrado).
            <br/>- <strong>AMD/Intel/GTX:</strong> Use FSR 2.1/3.0 ou XeSS. O XeSS costuma ter imagem melhor que o FSR em movimento.
            <br/>- <strong>DLSS Frame Gen:</strong> Ative se tiver RTX 4000+. Dobra o FPS "fake", mas aumenta input lag. Use com Nvidia Reflex.
        </p>
      `
        },
        {
            title: "Capítulo 3: Sombras e Iluminação",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Cascaded Shadows Resolution:</strong> Medium. (High dobra o uso de VRAM).
            - <strong>Distant Shadows Resolution:</strong> Low.
            - <strong>Volumetric Fog Resolution:</strong> <span class="text-emerald-400">Low</span>. A neblina do jogo é pesadíssima. No Low ela continua bonita mas roda 20% mais rápido.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Screen Space Reflections (SSR)",
            content: `
        <p class="mb-4 text-gray-300">
            Se você não usa Ray Tracing, o SSR é o que faz o chão molhado brilhar.
            <br/>- <strong>Psycho:</strong> Insanamente pesado.
            <br/>- <strong>High:</strong> Bom equilíbrio.
            <br/>- <strong>Low:</strong> Os reflexos ficam granulados.
            <br/>Recomendação: High se puder, Low se precisar de FPS.
        </p>
      `
        },
        {
            title: "Capítulo 5: HDD Mode (Texturas)",
            content: `
        <p class="mb-4 text-gray-300">
            Opção "Slow HDD Mode" na aba Gameplay.
            <br/>- Se você instalou no HD mecânico (Não faça isso!): LIGUE. Isso reduz a variedade de carros e pedestres para a textura carregar a tempo.
            <br/>- Se tem SSD SATA antigo: AUTO.
            <br/>- Se tem NVMe: OFF.
        </p>
      `
        },
        {
            title: "Capítulo 6: Ray Tracing (Vale a pena?)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Reflections:</strong> O mais impactante visualmente.
            - <strong>Lighting/Shadows:</strong> Impacto sutil, custo alto.
            - <strong>Path Tracing (Overdrive):</strong> Só para screenshots ou RTX 4080/4090.
            <br/>Se tiver performance sobrando, ligue apenas RT Reflections. O resto não vale o custo de FPS em tiroteios frenéticos.
        </p>
      `
        },
        {
            title: "Capítulo 7: Color Precision",
            content: `
        <p class="mb-4 text-gray-300">
            Color Precision: Medium.
            <br/>Difícil notar a diferença para o High a olho nu, mas economiza um pouco de processamento de pós-efeitos.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Mods de Performance",
            content: `
            <p class="mb-4 text-gray-300">
                NexusMods: "General Optimization Mod".
                <br/>Ele reduz a distância de renderização de lixo na rua e papeis voando, que consomem física da CPU desnecessariamente.
            </p>
            `
        },
        {
            title: "Capítulo 9: SMT (AMD Ryzen)",
            content: `
            <p class="mb-4 text-gray-300">
                Cyberpunk tinha um bug com CPUs Ryzen (não usava todos os threads).
                <br/>Hoje (Patch 2.1+), existe uma opção no menu: <strong>AMD SMT (Simultaneous Multithreading)</strong>.
                <br/>Defina como <strong>ON</strong> (não Auto) para garantir que todos os núcleos lógicos sejam usados no talo.
            </p>
            `
        },
        {
            title: "Capítulo 10: Input Lag no Mouse",
            content: `
            <p class="mb-4 text-gray-300">
                O jogo tem uma sensação de "mouse pesado".
                <br/>Em Controls:
                <br/>- Zoom Sensitivity Reduction: 1.
                <br/>- Response Curve: Recommended (Raw não existe, mas Recommended é o mais linear possível).
                <br/>Desligue o V-Sync para reduzir latência.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "O jogo crasha (Flatlined)?",
            answer: "Geralmente é overclock instável de GPU ou RAM. Cyberpunk estressa o hardware mais que Furmark. Remova qualquer overclock e teste."
        },
        {
            question: "Phantom Liberty é mais pesado?",
            answer: "Sim, Dogtown é muito mais densa graficamente que o resto de Night City. Espere perder uns 10-15 FPS lá dentro."
        },
        {
            question: "Frame Generation causa lag?",
            answer: "Frame Gen aumenta a latência de input porque cria quadros falsos. Sempre ative o Nvidia Reflex + Boost junto para compensar."
        }
    ];

    const externalReferences = [
        { name: "Digital Foundry (Cyberpunk Optimization)", url: "https://www.eurogamer.net/digitalfoundry-2020-cyberpunk-2077-pc-best-settings" },
        { name: "Nexus Mods Cyberpunk", url: "https://www.nexusmods.com/cyberpunk2077" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD",
            description: "Obrigatório para texturas."
        },
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Nvidia",
            description: "Atualize drivers sempre."
        },
        {
            href: "/guias/windows-defender-otimizacao-jogos",
            title: "Defender",
            description: "Evite scans durante o jogo."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="35 min"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            externalReferences={externalReferences}
        />
    );
}
