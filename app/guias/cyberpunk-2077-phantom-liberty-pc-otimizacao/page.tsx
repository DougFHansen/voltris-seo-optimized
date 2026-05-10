import { Metadata } from 'next';
import { GuideTemplate } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'cyberpunk-2077-phantom-liberty-pc-otimizacao',
    title: "Cyberpunk 2077 Phantom Liberty: NIGHT CITY 4K 60FPS!",
    description: "Configure Night City para performance máxima! Ray Tracing Path Tracing, DLSS 3.5 e overclock para rodar liso em qualquer hardware.",
    category: 'games-fix',
    difficulty: 'Avançado',
    time: '35 min'
};

const title = "Cyberpunk 2077 Phantom Liberty: NIGHT CITY 4K 60FPS!";
const description = "Phantom Liberty transformou Cyberpunk 2077 com ray tracing path tracing. Aprenda as configurações exatas para rodar o jogo mais bonito do mercado com FPS estáveis.";

const keywords = [
    'cyberpunk 2077 phantom liberty pc settings',
    'cyberpunk 2077 path tracing optimization',
    'cyberpunk 2077 dlss 3.5 frame generation',
    'cyberpunk 2077 rtx 4090 benchmark 4k',
    'cyberpunk 2077 ray tracing ultra settings',
    'cyberpunk 2077 phantom liberty requirements',
    'cyberpunk 2077 overclock gpu cpu',
    'night city performance optimization'
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
                url: '/cyberpunk-2077-og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Cyberpunk 2077 Phantom Liberty PC Configurações'
            }
        ]
    },
    alternates: {
        canonical: 'https://voltris.com.br/guias/cyberpunk-2077-phantom-liberty-pc-otimizacao'
    }
};

const contentSections = [
    {
        title: 'Requisitos Phantom Liberty (Path Tracing)',
        content: `<p>Phantom Liberty exige hardware potente para Path Tracing. Veja os requisitos mínimos, recomendados e ultra.</p><h3>Mínimo (1080p RT Medium)</h3><ul><li>GPU: RTX 3060 Ti 8GB</li><li>CPU: Ryzen 5 5600X</li><li>RAM: 16GB DDR4</li><li>VRAM: 8GB+</li><li>Storage: 85GB SSD NVMe</li></ul><h3>Recomendado (1440p RT High)</h3><ul><li>GPU: RTX 4070 Ti 12GB</li><li>CPU: Ryzen 7 7700X</li><li>RAM: 32GB DDR5</li><li>VRAM: 12GB+</li><li>Storage: 85GB NVMe Gen4</li></ul><h3>Ultra (4K Path Tracing)</h3><ul><li>GPU: RTX 4090 24GB</li><li>CPU: Ryzen 9 7950X3D</li><li>RAM: 64GB DDR5</li><li>VRAM: 16GB+</li><li>Storage: 85GB NVMe Gen4</li></ul>`
    },
    {
        title: 'Configurações Path Tracing',
        content: `<p>Path Tracing é o futuro da renderização. Phantom Liberty foi o primeiro jogo a implementar RT completo.</p><h3>Configuração 1440p Path Tracing Sweet Spot</h3><ul><li>Ray Tracing: Path Tracing Medium</li><li>DLSS: DLSS 3.5 Quality</li><li>Frame Generation: ON</li><li>NVIDIA Reflex: ON + Boost</li><li>Texture Quality: Ultra</li><li>Dynamic Resolution: OFF</li><li>Screen Space Reflections: OFF (substituído por RT)</li></ul><h3>Configuração 4K Path Tracing Ultra</h3><ul><li>Ray Tracing: Path Tracing Psycho</li><li>DLSS: DLSS 3.5 Performance</li><li>Frame Generation: ON</li><li>NVIDIA Reflex: ON + Boost</li><li>Texture Quality: Psycho</li><li>Dynamic Resolution: 75% (se necessário)</li></ul>`
    },
    {
        title: 'Overclock para Maximum Performance',
        content: `<h3>GPU Overclock (RTX 40-Series)</h3><ul><li>Core Clock: +150 MHz</li><li>Memory Clock: +1000 MHz</li><li>Power Limit: 115-120%</li><li>Temp Limit: 85C</li><li>Use MSI Afterburner</li></ul><h3>CPU Optimization</h3><ul><li>PBO: Enabled (AMD)</li><li>Thermal Velocity Boost: ON (Intel)</li><li>Windows Power: Ultimate Performance</li><li>VBS: Disabled</li><li>Core Parking: Disabled</li></ul>`
    },
    {
        title: 'Troubleshooting Comum',
        content: `<h3>Stuttering em Áreas Densas</h3><p>Reduza Crowd Density para Medium, ativa DLSS 3.5 Performance e aumente VRAM allocation no launcher.</p><h3>VRAM Insuficiente (8GB)</h3><p>Use Texture Quality High, desative Cascaded Shadows Resolution e configure Specialized Lighting para Medium.</p>`
    }
];

const summaryTable = [
    { label: 'Dificuldade', value: 'Avançado' },
    { label: 'Tempo', value: '35 min' },
    { label: 'Categoria', value: 'Games Fix' },
    { label: 'FPS Alvo', value: '60 FPS' }
];

const keyPoints = [
    'Path Tracing completo',
    'DLSS 3.5 Frame Generation',
    'Overclock seguro automático',
    'Troubleshooting Night City'
];

export default function Cyberpunk2077Guide() {
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
            pathname="/guias/cyberpunk-2077-phantom-liberty-pc-otimizacao"
            category={guideMetadata.category}
        />
    );
}
