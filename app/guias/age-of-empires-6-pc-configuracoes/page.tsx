import { Metadata } from 'next';
import { GuideTemplate } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'age-of-empires-6-pc-configuracoes',
    title: "Age of Empires 6 PC: DOMINE O CAMPO! (Configurações)",
    description: "Construa seu império sem lag! Configurações para 1000+ unidades, 4K 60FPS e otimização para multiplayer massivo com 8 jogadores.",
    category: 'games-fix',
    difficulty: 'Intermediário',
    time: '25 min'
};

const title = "Age of Empires 6 PC: DOMINE O CAMPO! (Configurações)";
const description = "Age of Empires 6 chega com gráficos ray traced e batalhas massivas. Aprenda as configurações exatas para comandar exércitos de 1000+ unidades com performance máxima.";

const keywords = [
    'age of empires 6 pc requirements',
    'age of empires 6 optimization settings',
    'age of empires 6 4k 60fps configuration',
    'age of empires 6 multiplayer performance',
    'age of empires 6 1000 units optimization',
    'age of empires 6 ray tracing settings',
    'age of empires 6 benchmark rtx 4070',
    'age of empires 6 late game performance'
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
                url: '/age-of-empires-6-og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Age of Empires 6 PC Configurações'
            }
        ]
    },
    alternates: {
        canonical: 'https://voltris.com.br/guias/age-of-empires-6-pc-configuracoes'
    }
};

const contentSections = [
    {
        title: 'Requisitos Age of Empires 6',
        content: `
            <p>Age of Empires 6 exige hardware potente para rodar batalhas massivas com 1000+ unidades. Veja os requisitos mínimos, recomendados e ultra para diferentes resoluções.</p>
            <h3>Mínimo (1080p 60 FPS)</h3>
            <ul>
                <li>GPU: RTX 3060 8GB</li>
                <li>CPU: Ryzen 5 5600X</li>
                <li>RAM: 16GB DDR4</li>
                <li>Storage: 100GB SSD</li>
                <li>Max Units: 500</li>
            </ul>
            <h3>Recomendado (1440p 60 FPS)</h3>
            <ul>
                <li>GPU: RTX 4070 12GB</li>
                <li>CPU: Ryzen 7 7700X</li>
                <li>RAM: 32GB DDR5</li>
                <li>Storage: 100GB NVMe</li>
                <li>Max Units: 1000</li>
            </ul>
            <h3>Ultra (4K 60 FPS)</h3>
            <ul>
                <li>GPU: RTX 4080 16GB</li>
                <li>CPU: Ryzen 9 7950X</li>
                <li>RAM: 32GB DDR5</li>
                <li>Storage: 100GB NVMe Gen4</li>
                <li>Max Units: 2000</li>
            </ul>
        `
    },
    {
        title: 'Configurações Gráficas para Batalhas Massivas',
        content: `
            <p>Age of Empires 6 suporta 2000+ unidades em campo. Configurações otimizadas para late game.</p>
            <h3>Configuração 1440p 1000+ Units</h3>
            <ul>
                <li>Resolution: 1440p</li>
                <li>DLSS: Quality</li>
                <li>Unit Scale: High</li>
                <li>Building Detail: High</li>
                <li>Terrain Detail: Ultra</li>
                <li>Water: High</li>
                <li>Shadows: Medium</li>
                <li>Lighting: High</li>
                <li>Particles: High</li>
                <li>Anti-Aliasing: MSAA 4x</li>
            </ul>
            <h3>Configuração 4K Ultra (500 Units)</h3>
            <ul>
                <li>Resolution: 4K</li>
                <li>DLSS: Balanced</li>
                <li>Unit Scale: Ultra</li>
                <li>Building Detail: Ultra</li>
                <li>Terrain Detail: Ultra</li>
                <li>Water: Ultra</li>
                <li>Shadows: High</li>
                <li>Lighting: Ultra</li>
                <li>Particles: Ultra</li>
                <li>Anti-Aliasing: MSAA 8x</li>
            </ul>
        `
    },
    {
        title: 'Multiplayer Optimization',
        content: `
            <p>Configurações de rede e latência para multiplayer massivo com 8 jogadores.</p>
            <h3>Network Settings</h3>
            <ul>
                <li>Connection: Ethernet</li>
                <li>DNS: Cloudflare 1.1.1.1</li>
                <li>QoS: Gaming Priority</li>
                <li>Port Forwarding: Enabled</li>
                <li>UPnP: ON</li>
                <li>NAT Type: Open</li>
            </ul>
            <h3>Latency Reduction</h3>
            <ul>
                <li>Game Mode: ON</li>
                <li>VBS: Disabled</li>
                <li>Background Apps: Minimal</li>
                <li>Discord: Game Mode</li>
                <li>Overlay: OFF</li>
                <li>Recording: OFF</li>
            </ul>
        `
    },
    {
        title: 'Late Game Performance',
        content: `
            <h3>1000+ Units (Imperial Age)</h3>
            <p>Reduza Unit Scale para High se FPS &lt; 30. Desative Shadows e use DLSS Performance.</p>
            <h3>8 Players Multiplayer</h3>
            <p>Use Terrain Detail Medium e Building Detail High. Prioritize unit visibility over terrain quality.</p>
            <h3>CPU Bottleneck</h3>
            <p>Ryzen 7+ ou Intel i7+ recomendado. Use Voltris Optimizer para otimizar CPU em tempo real.</p>
        `
    }
];

const summaryTable = [
    { label: 'Dificuldade', value: 'Intermediário' },
    { label: 'Tempo', value: '25 min' },
    { label: 'Categoria', value: 'Games Fix' },
    { label: 'Max Units', value: '2000+' }
];

const keyPoints = [
    'Configurações otimizadas para 1000+ unidades',
    'Suporte para 4K 60FPS com DLSS',
    'Otimização de rede para 8 jogadores',
    'Redução de latência e micro-stutter'
];

export default function AgeOfEmpires6Guide() {
    const aiSummary = "Age of Empires 6 requer RTX 3060 8GB mínimo para 60 FPS em 1080p com 500 unidades. Para 1440p 60 FPS com 1000 unidades, use RTX 4070 12GB com Ryzen 7 7700X e 32GB DDR5. Configure DLSS Quality, Unit Scale High e use Ethernet com DNS Cloudflare 1.1.1.1 para multiplayer 8 jogadores.";

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
            pathname="/guias/age-of-empires-6-pc-configuracoes"
            category={guideMetadata.category}
            aiSummary={aiSummary}
        />
    );
}
