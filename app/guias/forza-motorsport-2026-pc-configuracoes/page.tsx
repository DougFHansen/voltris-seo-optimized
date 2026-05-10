import { Metadata } from 'next';
import { GuideTemplate } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'forza-motorsport-2026-pc-configuracoes',
    title: "Forza Motorsport 2026: 4K 120FPS ULTRA!",
    description: "Configure seu PC para o simulador de corrida mais realista! Ray Tracing em tempo real, 4K 120FPS e configurações de wheel para experiência máxima.",
    category: 'games-fix',
    difficulty: 'Avançado',
    time: '30 min'
};

const title = "Forza Motorsport 2026: 4K 120FPS ULTRA!";
const description = "Forza Motorsport 2026 chega com ray tracing avançado e física realista. Aprenda as configurações exatas para 4K 120FPS com ray tracing ativado.";

const keywords = [
    'forza motorsport 2026 pc settings',
    'forza motorsport 2026 ray tracing',
    'forza motorsport 2026 4k 120fps',
    'forza motorsport 2026 wheel settings',
    'forza motorsport 2026 requirements pc',
    'forza motorsport 2026 dlss 3',
    'forza motorsport 2026 benchmark',
    'forza motorsport 2026 racing wheel setup'
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
                url: '/forza-motorsport-2026-og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Forza Motorsport 2026 PC Configurações'
            }
        ]
    },
    alternates: {
        canonical: 'https://voltris.com.br/guias/forza-motorsport-2026-pc-configuracoes'
    }
};

const contentSections = [
    {
        title: 'Requisitos Forza Motorsport 2026',
        content: `<p>Forza Motorsport 2026 exige hardware potente para ray tracing em tempo real.</p><h3>Mínimo (1080p 60 FPS)</h3><ul><li>GPU: RTX 3060 8GB</li><li>CPU: Ryzen 5 3600X</li><li>RAM: 16GB DDR4</li><li>Storage: 150GB SSD NVMe</li></ul><h3>Recomendado (1440p 120 FPS)</h3><ul><li>GPU: RTX 4070 Ti 12GB</li><li>CPU: Ryzen 7 7700X</li><li>RAM: 32GB DDR5</li><li>Storage: 150GB NVMe Gen4</li></ul><h3>Ultra (4K 120 FPS + RT)</h3><ul><li>GPU: RTX 4090 24GB</li><li>CPU: Ryzen 9 7950X3D</li><li>RAM: 32GB DDR5</li><li>Storage: 150GB NVMe Gen4</li></ul>`
    },
    {
        title: 'Configurações Gráficas 4K Ultra',
        content: `<p>Forza Motorsport 2026 usa ray tracing em tempo real para reflexos e iluminação global.</p><h3>Configuração 4K 120FPS Ray Tracing</h3><ul><li>Resolution: 4K (3840x2160)</li><li>Frame Rate: 120 FPS</li><li>Ray Tracing: High</li><li>DLSS: Quality</li><li>Frame Generation: ON</li><li>Car Detail: Ultra</li><li>Environment Detail: Ultra</li><li>Track Detail: Ultra</li></ul>`
    },
    {
        title: 'Configurações de Racing Wheel',
        content: `<h3>Logitech G29/G923</h3><ul><li>Rotation: 900</li><li>FFB Strength: 80-100%</li><li>Damping: 20%</li><li>Spring: 15%</li></ul><h3>Fanatec CSL Elite</h3><ul><li>Rotation: 900 (GT3) / 540 (F1)</li><li>FFB: 100%</li><li>Shock: 80%</li><li>Damper: 20%</li></ul>`
    },
    {
        title: 'Otimização Avançada',
        content: `<h3>VRAM Management</h3><p>4K Ultra com ray tracing consome 16-20GB VRAM. Monitore uso e reduza Environment Detail se VRAM &gt; 90%.</p><h3>CPU Bottleneck</h3><p>Use Ryzen 7+ ou Intel i7+ para 120FPS estáveis. Desative processos background.</p>`
    }
];

const summaryTable = [
    { label: 'Dificuldade', value: 'Avançado' },
    { label: 'Tempo', value: '30 min' },
    { label: 'Categoria', value: 'Games Fix' },
    { label: 'FPS Alvo', value: '120 FPS' }
];

const keyPoints = [
    'Configurações para 4K 120FPS',
    'Ray Tracing em tempo real',
    'Configurações de Racing Wheel',
    'Otimização de VRAM e CPU'
];

export default function ForzaMotorsport2026Guide() {
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
            pathname="/guias/forza-motorsport-2026-pc-configuracoes"
            category={guideMetadata.category}
        />
    );
}
