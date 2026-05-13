import { Metadata } from 'next';
import { GuideTemplate } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'elder-scrolls-6-pc-requisitos-configuracoes',
    title: "Elder Scrolls 6 PC: TAMRIEL 4K 60FPS!",
    description: "Explore Tamriel em 4K! Requisitos oficiais, configurações para 60 FPS estáveis e otimização para o mundo aberto maior da história dos RPGs.",
    category: 'games-fix',
    difficulty: 'Avançado',
    time: '35 min'
};

const title = "Elder Scrolls 6 PC: TAMRIEL 4K 60FPS!";
const description = "Elder Scrolls 6 promete o mundo aberto mais ambicioso já criado. Aprenda as configurações exatas para explorar Tamriel com performance máxima.";

const keywords = [
    'elder scrolls 6 pc requirements',
    'elder scrolls 6 optimization settings',
    'elder scrolls 6 4k 60fps configuration',
    'elder scrolls 6 benchmark rtx 4090',
    'elder scrolls 6 world size performance',
    'elder scrolls 6 creation engine 2',
    'elder scrolls 6 dlss 3 support',
    'elder scrolls 6 modding performance'
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
                url: '/elder-scrolls-6-og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Elder Scrolls 6 PC Configurações'
            }
        ]
    },
    alternates: {
        canonical: 'https://www.voltris.com.br/guias/elder-scrolls-6-pc-requisitos-configuracoes'
    }
};

const contentSections = [
    {
        title: 'Requisitos Estimados Elder Scrolls 6',
        content: `<p>Elder Scrolls 6 exige hardware potente para rodar Creation Engine 2.0 com ray tracing.</p><h3>Mínimo (1080p 30 FPS)</h3><ul><li>GPU: RTX 3070 8GB</li><li>CPU: Ryzen 5 5600X</li><li>RAM: 16GB DDR4</li><li>VRAM: 8GB+</li><li>Storage: 200GB SSD NVMe</li></ul><h3>Recomendado (1440p 60 FPS)</h3><ul><li>GPU: RTX 4080 16GB</li><li>CPU: Ryzen 7 7800X3D</li><li>RAM: 32GB DDR5</li><li>VRAM: 12GB+</li><li>Storage: 200GB NVMe Gen4</li></ul><h3>Ultra (4K 60 FPS)</h3><ul><li>GPU: RTX 4090 24GB</li><li>CPU: Ryzen 9 7950X3D</li><li>RAM: 64GB DDR5</li><li>VRAM: 16GB+</li><li>Storage: 200GB NVMe Gen4</li></ul>`
    },
    {
        title: 'Configurações Creation Engine 2.0',
        content: `<p>Elder Scrolls 6 usa Creation Engine 2.0 com suporte total a ray tracing e DLSS 3.</p><h3>Configuração 1440p Sweet Spot</h3><ul><li>Resolution: 1440p</li><li>DLSS: Quality</li><li>Frame Generation: ON</li><li>Ray Tracing: Medium</li><li>Object Detail: Ultra</li><li>Actor Detail: High</li><li>Grass: High</li><li>Trees: Ultra</li><li>Shadows: High</li><li>View Distance: Ultra</li></ul><h3>Configuração 4K Ultra</h3><ul><li>Resolution: 4K</li><li>DLSS: Balanced</li><li>Frame Generation: ON</li><li>Ray Tracing: High</li><li>Object Detail: Ultra</li><li>Actor Detail: Ultra</li><li>Grass: Ultra</li><li>Trees: Ultra</li><li>Shadows: Ultra</li><li>View Distance: Ultra</li></ul>`
    },
    {
        title: 'Otimização para Mundo Aberto',
        content: `<h3>CPU Optimization</h3><ul><li>Priority: High</li><li>Affinity: All cores</li><li>Power Plan: Ultimate</li><li>VBS: Disabled</li><li>Core Parking: Disabled</li><li>Temperature: &lt;85C</li></ul><h3>RAM Management</h3><ul><li>Page File: Automatic</li><li>Standby List: Clean</li><li>Background Apps: Minimal</li><li>Discord: Game Mode</li><li>Browser: Closed</li><li>Voltris Optimizer: ON</li></ul>`
    },
    {
        title: 'Modding Performance',
        content: `<p>Elder Scrolls 6 terá suporte nativo a mods. Performance com mods:</p><h3>Textura Mods (4K)</h3><p>Requer 24GB+ VRAM para 4K. Use 2K textures se VRAM limitada.</p><h3>Weather & Lighting</h3><p>Pode reduzir 15-25% FPS. Use configurações balanced.</p><h3>Script Mods</h3><p>Impacto mínimo na performance, mas pode causar stuttering.</p>`
    }
];

const summaryTable = [
    { label: 'Dificuldade', value: 'Avançado' },
    { label: 'Tempo', value: '35 min' },
    { label: 'Categoria', value: 'Games Fix' },
    { label: 'FPS Alvo', value: '60 FPS' }
];

const keyPoints = [
    'Configurações para Creation Engine 2.0',
    'Otimização para mundo aberto massivo',
    'Suporte a mods pesados',
    'DLSS 3 e Ray Tracing'
];

export default function ElderScrolls6Guide() {
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
            pathname="/guias/elder-scrolls-6-pc-requisitos-configuracoes"
            category={guideMetadata.category}
        />
    );
}
