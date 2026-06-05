import { Metadata } from 'next';
import { GuideTemplate } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'ea-sports-fc-2026-pc-configuracoes-fps',
    title: "EA Sports FC 2026: 240FPS NO CAMPO!",
    description: "Jogue futebol como nunca! Configurações para 240 FPS, input lag ZERO e resposta instantânea. Ideal para Ultimate Team e Pro Clubs!",
    category: 'games-fix',
    difficulty: 'Intermediário',
    time: '20 min'
};

const title = "EA Sports FC 2026: 240FPS NO CAMPO!";
const description = "EA Sports FC 2026 chega com HyperMotion 3.0 e gráficos ray traced. Aprenda as configurações exatas para jogar com 240 FPS e resposta instantânea.";

const keywords = [
    'ea sports fc 2026 pc settings',
    'fifa 2026 fps boost configuration',
    'ea sports fc 2026 pro settings',
    'fifa 2026 input lag optimization',
    'ea sports fc 2026 240hz monitor',
    'fifa 2026 ultimate team performance',
    'ea sports fc 2026 requirements pc',
    'fifa 2026 competitive settings'
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
                url: '/ea-sports-fc-2026-og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'EA Sports FC 2026 PC Configurações'
            }
        ]
    },
    alternates: {
        canonical: 'https://www.voltris.com.br/guias/ea-sports-fc-2026-pc-configuracoes-fps'
    }
};

const contentSections = [
    {
        title: 'Requisitos EA Sports FC 2026',
        content: `<p>EA Sports FC 2026 exige hardware para HyperMotion 3.0 e gráficos ray traced.</p><h3>Mínimo (1080p 60 FPS)</h3><ul><li>GPU: GTX 1660 Super 6GB</li><li>CPU: Ryzen 3 3300X</li><li>RAM: 8GB DDR4</li><li>Storage: 100GB SSD</li><li>DirectX: 12</li></ul><h3>Recomendado (1440p 120 FPS)</h3><ul><li>GPU: RTX 3060 Ti 8GB</li><li>CPU: Ryzen 5 5600X</li><li>RAM: 16GB DDR4</li><li>Storage: 100GB NVMe</li><li>DirectX: 12 Ultimate</li></ul><h3>Competitive (240Hz)</h3><ul><li>GPU: RTX 4070 12GB</li><li>CPU: Ryzen 7 7800X3D</li><li>RAM: 32GB DDR5</li><li>Storage: 100GB NVMe Gen4</li><li>Monitor: 240Hz+</li></ul>`
    },
    {
        title: 'Configurações Competitivas (240 FPS)',
        content: `<p>Para Ultimate Team e Pro Clubs, cada frame conta. Configurações otimizadas para máxima responsividade.</p><h3>Settings 1440p 240Hz</h3><ul><li>Resolution: 1440p (ou 1080p para FPS máximo)</li><li>Rendering Quality: Low</li><li>Player Detail: Medium</li><li>Stadium Detail: Low</li><li>Lighting Quality: Medium</li><li>Shadow Quality: Low</li><li>Grass Quality: Medium</li><li>Anti-Aliasing: MSAA 2x</li><li>Frame Rate: Unlimited</li></ul>`
    },
    {
        title: 'Input Lag Optimization',
        content: `<h3>Monitor Settings</h3><ul><li>Overdrive: High</li><li>Response Time: Fastest</li><li>G-Sync/FreeSync: ON</li><li>Refresh Rate: 240Hz</li><li>Game Mode: ON</li></ul><h3>Windows & GPU</h3><ul><li>NVIDIA Reflex: ON + Boost</li><li>Game Mode: ON</li><li>Hardware Accelerated GPU: ON</li><li>VBS: Disabled</li><li>Mouse Polling Rate: 1000Hz</li></ul>`
    },
    {
        title: 'HyperMotion 3.0 Optimization',
        content: `<p>HyperMotion 3.0 usa machine learning para animações realistas. Requer CPU potente para cálculos.</p><h3>CPU Settings for HyperMotion</h3><ul><li>Priority: High (Task Manager)</li><li>Affinity: All cores enabled</li><li>Power Plan: Ultimate Performance</li><li>Background processes: Minimal</li><li>Temperature: &lt;80C</li></ul>`
    }
];

const summaryTable = [
    { label: 'Dificuldade', value: 'Intermediário' },
    { label: 'Tempo', value: '20 min' },
    { label: 'Categoria', value: 'Games Fix' },
    { label: 'FPS Alvo', value: '240 FPS' }
];

const keyPoints = [
    'Configurações para 240 FPS',
    'Input lag ZERO',
    'HyperMotion 3.0 otimizado',
    'Ideal para Ultimate Team'
];

export default function EASportsFC2026Guide() {
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
            pathname="/guias/ea-sports-fc-2026-pc-configuracoes-fps"
            category={guideMetadata.category}
        />
    );
}
