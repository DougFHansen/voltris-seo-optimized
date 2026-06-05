import { Metadata } from 'next';
import { GuideTemplate } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'street-fighter-6-pc-configuracoes',
    title: "Street Fighter 6 PC: 240FPS COMBO! (Config Pro)",
    description: "Domine o World Tour com 240 FPS! Configurações para input lag ZERO, response perfeita e visual otimizado para competitive fighting.",
    category: 'games-fix',
    difficulty: 'Intermediário',
    time: '20 min'
};

const title = "Street Fighter 6 PC: 240FPS COMBO! (Config Pro)";
const description = "Street Fighter 6 chega com RE Engine e gráficos cel-shaded. Aprenda as configurações exatas para combos perfeitos e resposta instantânea.";

const keywords = [
    'street fighter 6 pc settings',
    'street fighter 6 240fps configuration',
    'street fighter 6 input lag optimization',
    'street fighter 6 competitive settings',
    'street fighter 6 rollback netcode',
    'street fighter 6 frame data',
    'street fighter 6 monitor settings',
    'street fighter 6 tournament configuration'
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
                url: '/street-fighter-6-og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Street Fighter 6 PC Configurações'
            }
        ]
    },
    alternates: {
        canonical: 'https://www.voltris.com.br/guias/street-fighter-6-pc-configuracoes'
    }
};

const contentSections = [
    {
        title: 'Requisitos Street Fighter 6',
        summary: 'Street Fighter 6 requer GPU GTX 1660 Super mínimo para 60 FPS em 1080p, RTX 3060 Ti para 120 FPS em 1440p, e RTX 4070 com Ryzen 7 7800X3D para 240 FPS competitivos em monitores 240Hz.',
        content: `
            <p>Street Fighter 6 exige hardware balanceado para rodar com 240 FPS em monitores competitivos. Veja os requisitos mínimos, recomendados e tournament.</p>
            <h3>Mínimo (1080p 60 FPS)</h3>
            <ul>
                <li>GPU: GTX 1660 Super 6GB</li>
                <li>CPU: Ryzen 3 3300X</li>
                <li>RAM: 8GB DDR4</li>
                <li>Storage: 60GB SSD</li>
                <li>DirectX: 12</li>
            </ul>
            <h3>Recomendado (1440p 120 FPS)</h3>
            <ul>
                <li>GPU: RTX 3060 Ti 8GB</li>
                <li>CPU: Ryzen 5 5600X</li>
                <li>RAM: 16GB DDR4</li>
                <li>Storage: 60GB NVMe</li>
                <li>DirectX: 12 Ultimate</li>
            </ul>
            <h3>Tournament (240Hz)</h3>
            <ul>
                <li>GPU: RTX 4070 12GB</li>
                <li>CPU: Ryzen 7 7800X3D</li>
                <li>RAM: 32GB DDR5</li>
                <li>Storage: 60GB NVMe Gen4</li>
                <li>Monitor: 240Hz+</li>
            </ul>
        `
    },
    {
        title: 'Configurações Competitivas (240 FPS)',
        summary: 'Desative V-Sync, Motion Blur e configure Graphics Quality em Medium. Use resolução 1440p ou 1080p para FPS máximo com Frame Rate Unlimited para input lag mínimo.',
        content: `
            <p>Para fighting games, cada frame de input lag conta. Configurações otimizadas para máxima responsividade.</p>
            <h3>Settings Tournament 1440p</h3>
            <ul>
                <li>Resolution: 1440p (ou 1080p para FPS máximo)</li>
                <li>Frame Rate: Unlimited</li>
                <li>V-Sync: OFF</li>
                <li>Graphics Quality: Medium</li>
                <li>Shadow Quality: Low</li>
                <li>Texture Quality: High</li>
                <li>Effects Quality: Medium</li>
                <li>Anti-Aliasing: FXAA</li>
                <li>Motion Blur: OFF</li>
                <li>Bloom: Low</li>
            </ul>
        `
    },
    {
        title: 'Input Lag Optimization',
        summary: 'Configure monitor com Overdrive High, Response Time Fastest e Refresh Rate 240Hz. No Windows, ative NVIDIA Reflex, Game Mode e desative VBS para latência ultra-baixa.',
        content: `
            <h3>Monitor Settings</h3>
            <ul>
                <li>Overdrive: High</li>
                <li>Response Time: Fastest</li>
                <li>G-Sync/FreeSync: ON</li>
                <li>Refresh Rate: 240Hz</li>
                <li>Game Mode: ON</li>
                <li>Black Equalizer: 10</li>
            </ul>
            <h3>Windows & GPU</h3>
            <ul>
                <li>NVIDIA Reflex: ON + Boost</li>
                <li>Game Mode: ON</li>
                <li>Hardware Accelerated GPU: ON</li>
                <li>VBS: Disabled</li>
                <li>Mouse Polling Rate: 1000Hz</li>
                <li>Display Latency: Ultra Low</li>
            </ul>
        `
    },
    {
        title: 'Controller & Fight Stick',
        summary: 'Configure Fight Stick com Input Delay 0ms, Deadzone 0% e Polling Rate 1000Hz. Para Hitbox, use Sensitivity Medium, Deadzone 5% e Polling Rate 1000Hz para resposta máxima.',
        content: `
            <h3>Fight Stick Settings</h3>
            <ul>
                <li>Input Delay: 0ms</li>
                <li>Deadzone: 0%</li>
                <li>Polling Rate: 1000Hz</li>
                <li>D-Pad: Digital</li>
                <li>Gate: Square (8-way)</li>
                <li>Buttons: 30mm Sanwa</li>
            </ul>
            <h3>Hitbox Settings</h3>
            <ul>
                <li>Sensitivity: Medium</li>
                <li>Deadzone: 5%</li>
                <li>Polling Rate: 1000Hz</li>
                <li>Input Display: ON</li>
                <li>Button Mapping: Tournament Legal</li>
                <li>Turbo: Disabled</li>
            </ul>
        `
    },
    {
        title: 'Netcode & Online',
        summary: 'Street Fighter 6 usa rollback netcode. Configure para 5-7 frames de delay. Use Ethernet, QoS para gaming e DNS Cloudflare para menor latência online.',
        content: `
            <h3>Rollback Netcode</h3>
            <p>Street Fighter 6 usa rollback netcode moderno. Configure para 5-7 frames de delay para melhor experiência.</p>
            <h3>Network Optimization</h3>
            <p>Use Ethernet, configure QoS para gaming, e use DNS Cloudflare para menor latência.</p>
            <h3>Tournament Settings</h3>
            <p>Desative overlays, recording e background apps. Use modo de janela borderless para melhor performance.</p>
        `
    }
];

const summaryTable = [
    { label: 'Dificuldade', value: 'Intermediário' },
    { label: 'Tempo', value: '20 min' },
    { label: 'Categoria', value: 'Games Fix' },
    { label: 'FPS Alvo', value: '240 FPS' }
];

const keyPoints = [
    'Configurações para input lag ZERO',
    'Otimização para 240 FPS competitivos',
    'Settings para tournament e competitive',
    'Otimização de controller e fight stick'
];

export default function StreetFighter6Guide() {
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
            pathname="/guias/street-fighter-6-pc-configuracoes"
            category={guideMetadata.category}
        />
    );
}
