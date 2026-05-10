import { Metadata } from 'next';
import { GuideTemplate } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'resident-evil-9-pc-configuracoes',
    title: "Resident Evil 9 PC: SOBREVIVA EM 4K!",
    description: "Enfrente o terror com performance máxima! Configurações para ray tracing avançado, 4K 120FPS e otimização para a experiência de terror mais imersiva.",
    category: 'games-fix',
    difficulty: 'Avançado',
    time: '25 min'
};

const title = "Resident Evil 9 PC: SOBREVIVA EM 4K!";
const description = "Resident Evil 9 chega com RE Engine 2.0 e gráficos photorealísticos. Aprenda as configurações exatas para sobreviver ao horror com FPS estáveis e máxima imersão.";

const keywords = [
    'resident evil 9 pc requirements',
    'resident evil 9 optimization settings',
    'resident evil 9 ray tracing configuration',
    'resident evil 9 4k 120fps settings',
    'resident evil 9 re engine 2 performance',
    'resident evil 9 benchmark rtx 4080',
    'resident evil 9 horror immersion settings',
    'resident evil 9 dlss 3 frame generation'
];

export const metadata: Metadata = {
    title,
    description,
    keywords,
    openGraph: {
        title,
        description,
        type: 'article',
        images: [
            {
                url: '/resident-evil-9-og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Resident Evil 9 PC Configurações'
            }
        ]
    },
    alternates: {
        canonical: 'https://voltris.com.br/guias/resident-evil-9-pc-configuracoes'
    }
};

const contentSections = [
    {
        title: 'Requisitos Resident Evil 9',
        content: `
            <p>Resident Evil 9 exige hardware potente para rodar RE Engine 2.0 com path tracing. Veja os requisitos mínimos, recomendados e ultra.</p>
            <h3>Mínimo (1080p 60 FPS)</h3>
            <ul>
                <li>GPU: RTX 3060 8GB</li>
                <li>CPU: Ryzen 5 5600X</li>
                <li>RAM: 16GB DDR4</li>
                <li>VRAM: 8GB+</li>
                <li>Storage: 120GB SSD NVMe</li>
            </ul>
            <h3>Recomendado (1440p 120 FPS)</h3>
            <ul>
                <li>GPU: RTX 4070 Ti 12GB</li>
                <li>CPU: Ryzen 7 7700X</li>
                <li>RAM: 32GB DDR5</li>
                <li>VRAM: 12GB+</li>
                <li>Storage: 120GB NVMe Gen4</li>
            </ul>
            <h3>Ultra (4K 120 FPS)</h3>
            <ul>
                <li>GPU: RTX 4090 24GB</li>
                <li>CPU: Ryzen 9 7950X3D</li>
                <li>RAM: 32GB DDR5</li>
                <li>VRAM: 16GB+</li>
                <li>Storage: 120GB NVMe Gen4</li>
            </ul>
        `
    },
    {
        title: 'Configurações RE Engine 2.0',
        content: `
            <p>Resident Evil 9 usa RE Engine 2.0 com ray tracing path tracing e iluminação volumétrica avançada.</p>
            <h3>Configuração 1440p Immersive</h3>
            <ul>
                <li>Resolution: 1440p</li>
                <li>DLSS: Quality</li>
                <li>Frame Generation: ON</li>
                <li>Ray Tracing: Path Tracing Medium</li>
                <li>Volumetric Lighting: High</li>
                <li>Shadow Quality: High</li>
                <li>Texture Quality: Ultra</li>
                <li>Model Detail: Ultra</li>
                <li>Anti-Aliasing: TAA</li>
                <li>Depth of Field: High</li>
            </ul>
            <h3>Configuração 4K Ultra Horror</h3>
            <ul>
                <li>Resolution: 4K</li>
                <li>DLSS: Balanced</li>
                <li>Frame Generation: ON</li>
                <li>Ray Tracing: Path Tracing High</li>
                <li>Volumetric Lighting: Ultra</li>
                <li>Shadow Quality: Ultra</li>
                <li>Texture Quality: Ultra</li>
                <li>Model Detail: Ultra</li>
                <li>Anti-Aliasing: TAA Ultra</li>
                <li>Depth of Field: Ultra</li>
            </ul>
        `
    },
    {
        title: 'Configurações de Imersão',
        content: `
            <h3>Áudio 3D</h3>
            <ul>
                <li>Audio: Dolby Atmos</li>
                <li>Headphones: ON</li>
                <li>Spatial Audio: ON</li>
                <li>HRTF: ON</li>
                <li>Volume: 80-90%</li>
                <li>Bass Boost: Moderate</li>
            </ul>
            <h3>Visual Horror</h3>
            <ul>
                <li>Brightness: 40-50%</li>
                <li>Contrast: High</li>
                <li>Chromatic Aberration: ON</li>
                <li>Film Grain: Low</li>
                <li>Motion Blur: Low</li>
                <li>Lens Flare: ON</li>
            </ul>
        `
    },
    {
        title: 'Performance vs Horror',
        content: `
            <h3>Path Tracing Impact</h3>
            <p>Path Tracing reduz 30-40% FPS. Use Medium para balance entre visual e performance em 1440p.</p>
            <h3>Volumetric Lighting</h3>
            <p>Essencial para atmosfera de terror. Reduza para Medium se FPS &lt; 60 em cenas escuras.</p>
            <h3>VRAM Optimization</h3>
            <p>4K Ultra consome 12-16GB VRAM. Monitore uso e reduza Texture Quality se necessário.</p>
        `
    }
];

const summaryTable = [
    { label: 'Dificuldade', value: 'Avançado' },
    { label: 'Tempo', value: '25 min' },
    { label: 'Categoria', value: 'Games Fix' },
    { label: 'FPS Alvo', value: '120 FPS' }
];

const keyPoints = [
    'Configurações para RE Engine 2.0',
    'Otimização de Path Tracing',
    'Configurações de imersão de terror',
    'Suporte a DLSS 3 e Ray Tracing'
];

export default function ResidentEvil9Guide() {
    const aiSummary = "Resident Evil 9 requer RTX 3060 8GB mínimo para 1080p 60 FPS. Para 1440p 120 FPS, use RTX 4070 Ti 12GB com Ryzen 7 7700X e 32GB DDR5. Configure DLSS Quality + Frame Generation ON, Ray Tracing Path Tracing Medium, Volumetric Lighting High e Audio Dolby Atmos. Para 4K 120 FPS Ultra, use RTX 4090 24GB com Ryzen 9 7950X3D.";

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime={guideMetadata.time}
            difficultyLevel={guideMetadata.difficulty}
            contentSections={contentSections}
            summaryTable={summaryTable}
            keyPoints={keyPoints}
            showVoltrisOptimizerCTA={true}
            pathname="/guias/resident-evil-9-pc-configuracoes"
            category={guideMetadata.category}
            aiSummary={aiSummary}
        />
    );
}
