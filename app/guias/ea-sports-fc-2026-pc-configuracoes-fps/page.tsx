import { Metadata } from 'next';

export const guideMetadata = {
    id: 'ea-sports-fc-2026-pc-configuracoes-fps',
    title: "EA Sports FC 2026: 240FPS NO CAMPO! (Config Pro 2026)",
    description: "Jogue futebol como nunca! Configurações para 240 FPS, input lag ZERO e resposta instantânea. Ideal para Ultimate Team e Pro Clubs!",
    category: 'otimizacao',
    difficulty: 'Intermediário',
    time: '20 min'
};

const title = "EA Sports FC 2026: 240FPS NO CAMPO! (Config Pro 2026)";
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
        canonical: 'https://voltris.com.br/guias/ea-sports-fc-2026-pc-configuracoes-fps'
    }
};

export default function EASportsFC2026Guide() {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-6">{title}</h1>
                <p className="text-xl text-gray-300 mb-8">{description}</p>
                
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Requisitos EA Sports FC 2026</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-red-900/20 p-4 rounded">
                            <h3 className="text-red-400 font-bold mb-2">Mínimo (1080p 60 FPS)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: GTX 1660 Super 6GB</li>
                                <li>CPU: Ryzen 3 3300X</li>
                                <li>RAM: 8GB DDR4</li>
                                <li>Storage: 100GB SSD</li>
                                <li>DirectX: 12</li>
                            </ul>
                        </div>
                        <div className="bg-yellow-900/20 p-4 rounded">
                            <h3 className="text-yellow-400 font-bold mb-2">Recomendado (1440p 120 FPS)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 3060 Ti 8GB</li>
                                <li>CPU: Ryzen 5 5600X</li>
                                <li>RAM: 16GB DDR4</li>
                                <li>Storage: 100GB NVMe</li>
                                <li>DirectX: 12 Ultimate</li>
                            </ul>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded">
                            <h3 className="text-green-400 font-bold mb-2">Competitive (240Hz)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 4070 12GB</li>
                                <li>CPU: Ryzen 7 7800X3D</li>
                                <li>RAM: 32GB DDR5</li>
                                <li>Storage: 100GB NVMe Gen4</li>
                                <li>Monitor: 240Hz+</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Configurações Competitivas (240 FPS)</h2>
                    <p className="text-gray-300 mb-4">
                        Para Ultimate Team e Pro Clubs, cada frame conta. Configurações otimizadas para máxima responsividade.
                    </p>
                    <div className="bg-blue-900/20 p-4 rounded">
                        <h3 className="text-blue-400 font-bold mb-2">Settings 1440p 240Hz</h3>
                        <ul className="text-sm space-y-1">
                            <li>Resolution: 1440p (ou 1080p para FPS máximo)</li>
                            <li>Rendering Quality: Low</li>
                            <li>Player Detail: Medium</li>
                            <li>Stadium Detail: Low</li>
                            <li>Lighting Quality: Medium</li>
                            <li>Shadow Quality: Low</li>
                            <li>Grass Quality: Medium</li>
                            <li>Anti-Aliasing: MSAA 2x</li>
                            <li>Frame Rate: Unlimited</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Input Lag Optimization</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-orange-900/20 p-4 rounded">
                            <h3 className="text-orange-400 font-bold mb-2">Monitor Settings</h3>
                            <ul className="text-sm space-y-1">
                                <li>Overdrive: High</li>
                                <li>Response Time: Fastest</li>
                                <li>G-Sync/FreeSync: ON</li>
                                <li>Refresh Rate: 240Hz</li>
                                <li>Game Mode: ON</li>
                            </ul>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded">
                            <h3 className="text-green-400 font-bold mb-2">Windows & GPU</h3>
                            <ul className="text-sm space-y-1">
                                <li>NVIDIA Reflex: ON + Boost</li>
                                <li>Game Mode: ON</li>
                                <li>Hardware Accelerated GPU: ON</li>
                                <li>VBS: Disabled</li>
                                <li>Mouse Polling Rate: 1000Hz</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">HyperMotion 3.0 Optimization</h2>
                    <p className="text-gray-300 mb-4">
                        HyperMotion 3.0 usa machine learning para animações realistas. Requer CPU potente para cálculos.
                    </p>
                    <div className="bg-purple-900/20 p-4 rounded">
                        <h3 className="text-purple-400 font-bold mb-2">CPU Settings for HyperMotion</h3>
                        <ul className="text-sm space-y-1">
                            <li>Priority: High (Task Manager)</li>
                            <li>Affinity: All cores enabled</li>
                            <li>Power Plan: Ultimate Performance</li>
                            <li>Background processes: Minimal</li>
                            <li>Temperature: &lt;80°C</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
