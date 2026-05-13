import { Metadata } from 'next';
import { GuideTemplate } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'stalker-2-pc-configuracoes-otimizacao',
    title: "S.T.A.L.K.E.R. 2 PC: ZONA EXCLUSIVA!",
    description: "Sobreviva na Zona com performance máxima! Configurações para ray tracing avançado, 4K 60FPS e otimização para o mundo pós-apocalíptico mais realista.",
    category: 'games-fix',
    difficulty: 'Avançado',
    time: '30 min'
};

const title = "S.T.A.L.K.E.R. 2 PC: ZONA EXCLUSIVA!";
const description = "S.T.A.L.K.E.R. 2 chega com Unreal Engine 5 e gráficos revolucionários. Aprenda as configurações exatas para explorar a Zona com FPS estáveis e máxima imersão.";

const keywords = [
    'stalker 2 pc requirements',
    'stalker 2 optimization settings',
    'stalker 2 unreal engine 5 performance',
    'stalker 2 ray tracing configuration',
    'stalker 2 benchmark rtx 4080',
    'stalker 2 4k 60fps settings',
    'stalker 2 dlss 3 frame generation',
    'stalker 2 zone performance optimization'
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
                url: '/stalker-2-og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'S.T.A.L.K.E.R. 2 PC Configurações'
            }
        ]
    },
    alternates: {
        canonical: 'https://www.voltris.com.br/guias/stalker-2-pc-configuracoes-otimizacao'
    }
};

const contentSections = [
    {
        title: 'Requisitos S.T.A.L.K.E.R. 2',
        content: `
            <p>S.T.A.L.K.E.R. 2 exige hardware potente para rodar Unreal Engine 5 com Lumen e Nanite. Veja os requisitos mínimos, recomendados e ultra.</p>
            <h3>Mínimo (1080p 30 FPS)</h3>
            <ul>
                <li>GPU: RTX 3060 8GB</li>
                <li>CPU: Ryzen 5 3600X</li>
                <li>RAM: 16GB DDR4</li>
                <li>VRAM: 8GB+</li>
                <li>Storage: 150GB SSD NVMe</li>
            </ul>
            <h3>Recomendado (1440p 60 FPS)</h3>
            <ul>
                <li>GPU: RTX 4070 Ti 12GB</li>
                <li>CPU: Ryzen 7 7700X</li>
                <li>RAM: 32GB DDR5</li>
                <li>VRAM: 12GB+</li>
                <li>Storage: 150GB NVMe Gen4</li>
            </ul>
            <h3>Ultra (4K 60 FPS)</h3>
            <ul>
                <li>GPU: RTX 4090 24GB</li>
                <li>CPU: Ryzen 9 7950X3D</li>
                <li>RAM: 32GB DDR5</li>
                <li>VRAM: 16GB+</li>
                <li>Storage: 150GB NVMe Gen4</li>
            </ul>
        `
    },
    {
        title: 'Configurações Unreal Engine 5',
        content: `
            <p>S.T.A.L.K.E.R. 2 usa Unreal Engine 5 com Lumen e Nanite para gráficos revolucionários.</p>
            <h3>Configuração 1440p Balanced</h3>
            <ul>
                <li>Resolution: 1440p</li>
                <li>DLSS: Quality</li>
                <li>Frame Generation: ON</li>
                <li>Lumen: Medium</li>
                <li>Nanite: High</li>
                <li>Ray Tracing: Medium</li>
                <li>Shadows: High</li>
                <li>Textures: Ultra</li>
                <li>View Distance: High</li>
                <li>Post Processing: High</li>
            </ul>
            <h3>Configuração 4K Ultra</h3>
            <ul>
                <li>Resolution: 4K</li>
                <li>DLSS: Balanced</li>
                <li>Frame Generation: ON</li>
                <li>Lumen: High</li>
                <li>Nanite: Epic</li>
                <li>Ray Tracing: High</li>
                <li>Shadows: Epic</li>
                <li>Textures: Epic</li>
                <li>View Distance: Epic</li>
                <li>Post Processing: Epic</li>
            </ul>
        `
    },
    {
        title: 'Lumen & Nanite Optimization',
        content: `
            <h3>Lumen Settings</h3>
            <ul>
                <li>Global Illumination: Medium</li>
                <li>Reflections: Medium</li>
                <li>Software Lumen: OFF</li>
                <li>Hardware Lumen: ON</li>
                <li>Lumen Scale: 75%</li>
            </ul>
            <h3>Nanite Settings</h3>
            <ul>
                <li>Nanite Virtualized Geometry: ON</li>
                <li>Max Pixels: 64</li>
                <li>Occlusion: Medium</li>
                <li>LOD Bias: 0</li>
            </ul>
        `
    },
    {
        title: 'Performance na Zona',
        content: `
            <h3>Anomalias & Efeitos Especiais</h3>
            <p>Anomalias consomem muito GPU. Reduza Particle Effects para Medium se FPS cair em áreas com anomalias.</p>
            <h3>NPCs & Mutantes</h3>
            <p>Reduza Actor Distance para 80% em áreas densas. Use DLSS Performance se necessário.</p>
            <h3>Áreas Internas vs Externas</h3>
            <p>Áreas internas rodam melhor. Configure presets diferentes para cada tipo de área.</p>
        `
    }
];

const summaryTable = [
    { label: 'Dificuldade', value: 'Avançado' },
    { label: 'Tempo', value: '30 min' },
    { label: 'Categoria', value: 'Games Fix' },
    { label: 'FPS Alvo', value: '60 FPS' }
];

const keyPoints = [
    'Configurações para Unreal Engine 5',
    'Otimização de Lumen e Nanite',
    'Performance para anomalias e efeitos',
    'Suporte a DLSS 3 e Ray Tracing'
];

export default function Stalker2Guide() {
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
            pathname="/guias/stalker-2-pc-configuracoes-otimizacao"
            category={guideMetadata.category}
        />
    );
}
