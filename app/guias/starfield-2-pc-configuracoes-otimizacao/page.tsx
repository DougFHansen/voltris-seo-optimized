import { Metadata } from 'next';
import { GuideTemplate } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'starfield-2-pc-configuracoes-otimizacao',
    title: "Starfield 2 PC: EXPLORE O UNIVERSO SEM LAG!",
    description: "Seu PC está pronto para explorar 100+ sistemas estelares? Configurações para 60 FPS estáveis, otimização de VRAM e segredos de performance!",
    category: 'games-fix',
    difficulty: 'Intermediário',
    time: '25 min'
};

const title = "Starfield 2 PC: EXPLORE O UNIVERSO SEM LAG!";
const description = "Starfield 2 expande o universo com planetas 4K, multiplayer e física avançada. Aprenda a configurar seu PC para a melhor experiência espacial possível.";

const keywords = [
    'starfield 2 pc requirements',
    'starfield 2 optimization settings',
    'starfield 2 fps boost pc',
    'starfield 2 dlss 3 performance',
    'starfield 2 vram usage',
    'starfield 2 benchmark rtx 4080',
    'starfield 2 multiplayer pc',
    'bethesda starfield 2 pc specs'
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
                url: '/starfield-2-og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Starfield 2 PC Configurações'
            }
        ]
    },
    alternates: {
        canonical: 'https://voltris.com.br/guias/starfield-2-pc-configuracoes-otimizacao'
    }
};

const contentSections = [
    {
        title: 'Requisitos Estimados Starfield 2',
        content: `
            <p>Starfield 2 exige hardware potente para rodar planetas 4K e física avançada. Veja os requisitos mínimos, recomendados e ultra.</p>
            <h3>Mínimo (1080p 30 FPS)</h3>
            <ul>
                <li>GPU: RTX 3070 8GB</li>
                <li>CPU: Ryzen 5 5600X</li>
                <li>RAM: 16GB DDR4</li>
                <li>VRAM: 8GB+</li>
                <li>Storage: 125GB SSD</li>
            </ul>
            <h3>Recomendado (1440p 60 FPS)</h3>
            <ul>
                <li>GPU: RTX 4070 Ti 12GB</li>
                <li>CPU: Ryzen 7 7700X</li>
                <li>RAM: 32GB DDR5</li>
                <li>VRAM: 12GB+</li>
                <li>Storage: 150GB NVMe</li>
            </ul>
            <h3>Ultra (4K 60 FPS)</h3>
            <ul>
                <li>GPU: RTX 4090 24GB</li>
                <li>CPU: Ryzen 9 7950X3D</li>
                <li>RAM: 64GB DDR5</li>
                <li>VRAM: 16GB+</li>
                <li>Storage: 200GB NVMe</li>
            </ul>
        `
    },
    {
        title: 'Configurações de Performance',
        content: `
            <p>Starfield 2 usa Creation Engine 2.0 com suporte total a DLSS 3 e ray tracing avançado.</p>
            <h3>Configuração 1440p Sweet Spot</h3>
            <ul>
                <li>Resolution: 1440p</li>
                <li>DLSS: Quality</li>
                <li>Frame Generation: ON</li>
                <li>Ray Tracing: Medium (planetas)</li>
                <li>Shadows: High</li>
                <li>Textures: Ultra</li>
                <li>View Distance: Ultra</li>
                <li>God Rays: Medium</li>
            </ul>
            <h3>Configuração 4K Ultra</h3>
            <ul>
                <li>Resolution: 4K</li>
                <li>DLSS: Performance</li>
                <li>Frame Generation: ON</li>
                <li>Ray Tracing: High</li>
                <li>Shadows: Ultra</li>
                <li>Textures: Ultra</li>
                <li>View Distance: Ultra</li>
                <li>God Rays: High</li>
            </ul>
        `
    },
    {
        title: 'Otimização Específica',
        content: `
            <h3>VRAM Management</h3>
            <p>Starfield 2 consome muita VRAM com texturas de planetas. Monitore uso e ajuste Textures para High se VRAM &gt; 90%.</p>
            <h3>CPU Optimization</h3>
            <p>Desative VBS e Core Isolation. Use modo de alto desempenho e prioridade alta para o processo do jogo.</p>
        `
    },
    {
        title: 'Multiplayer Performance',
        content: `
            <p>Para multiplayer, estabilidade de conexão é crucial:</p>
            <ul>
                <li>Use DNS Cloudflare (1.1.1.1) para menor latência</li>
                <li>Configure QoS no roteador para priorizar jogo</li>
                <li>Feche apps de streaming em background</li>
                <li>Use cabo ethernet (sem Wi-Fi)</li>
                <li>Configure firewall para permitir tráfego do jogo</li>
            </ul>
        `
    }
];

const summaryTable = [
    { label: 'Dificuldade', value: 'Intermediário' },
    { label: 'Tempo', value: '25 min' },
    { label: 'Categoria', value: 'Games Fix' },
    { label: 'FPS Alvo', value: '60 FPS' }
];

const keyPoints = [
    'Configurações para 60 FPS estáveis',
    'Otimização de VRAM para planetas 4K',
    'Suporte a DLSS 3 e Ray Tracing',
    'Otimização para multiplayer'
];

export default function Starfield2Guide() {
    const aiSummary = "Starfield 2 requer RTX 3070 8GB mínimo para 1080p 30 FPS. Para 1440p 60 FPS, use RTX 4070 Ti 12GB com Ryzen 7 7700X e 32GB DDR5. Configure DLSS Quality + Frame Generation ON, Ray Tracing Medium para planetas, e monitore VRAM reduzindo Textures para High se uso > 90%. Use Ethernet com DNS Cloudflare para multiplayer.";

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
            pathname="/guias/starfield-2-pc-configuracoes-otimizacao"
            category={guideMetadata.category}
            aiSummary={aiSummary}
        />
    );
}
