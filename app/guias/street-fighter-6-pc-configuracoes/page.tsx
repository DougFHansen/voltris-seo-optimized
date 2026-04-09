import { Metadata } from 'next';

export const guideMetadata = {
    id: 'street-fighter-6-pc-configuracoes',
    title: "Street Fighter 6 PC: 240FPS COMBO! (Config Pro 2026)",
    description: "Domine o World Tour com 240 FPS! Configurações para input lag ZERO, response perfeita e visual otimizado para competitive fighting.",
    category: 'otimizacao',
    difficulty: 'Intermediário',
    time: '20 min'
};

const title = "Street Fighter 6 PC: 240FPS COMBO! (Config Pro 2026)";
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
        canonical: 'https://voltris.com.br/guias/street-fighter-6-pc-configuracoes'
    }
};

export default function StreetFighter6Guide() {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-6">{title}</h1>
                <p className="text-xl text-gray-300 mb-8">{description}</p>
                
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Requisitos Street Fighter 6</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-red-900/20 p-4 rounded">
                            <h3 className="text-red-400 font-bold mb-2">Mínimo (1080p 60 FPS)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: GTX 1660 Super 6GB</li>
                                <li>CPU: Ryzen 3 3300X</li>
                                <li>RAM: 8GB DDR4</li>
                                <li>Storage: 60GB SSD</li>
                                <li>DirectX: 12</li>
                            </ul>
                        </div>
                        <div className="bg-yellow-900/20 p-4 rounded">
                            <h3 className="text-yellow-400 font-bold mb-2">Recomendado (1440p 120 FPS)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 3060 Ti 8GB</li>
                                <li>CPU: Ryzen 5 5600X</li>
                                <li>RAM: 16GB DDR4</li>
                                <li>Storage: 60GB NVMe</li>
                                <li>DirectX: 12 Ultimate</li>
                            </ul>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded">
                            <h3 className="text-green-400 font-bold mb-2">Tournament (240Hz)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 4070 12GB</li>
                                <li>CPU: Ryzen 7 7800X3D</li>
                                <li>RAM: 32GB DDR5</li>
                                <li>Storage: 60GB NVMe Gen4</li>
                                <li>Monitor: 240Hz+</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Configurações Competitivas (240 FPS)</h2>
                    <p className="text-gray-300 mb-4">
                        Para fighting games, cada frame de input lag conta. Configurações otimizadas para máxima responsividade.
                    </p>
                    <div className="bg-blue-900/20 p-4 rounded">
                        <h3 className="text-blue-400 font-bold mb-2">Settings Tournament 1440p</h3>
                        <ul className="text-sm space-y-1">
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
                                <li>Black Equalizer: 10</li>
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
                                <li>Display Latency: Ultra Low</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Controller & Fight Stick</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-purple-900/20 p-4 rounded">
                            <h3 className="text-purple-400 font-bold mb-2">Fight Stick Settings</h3>
                            <ul className="text-sm space-y-1">
                                <li>Input Delay: 0ms</li>
                                <li>Deadzone: 0%</li>
                                <li>Polling Rate: 1000Hz</li>
                                <li>D-Pad: Digital</li>
                                <li>Gate: Square (8-way)</li>
                                <li>Buttons: 30mm Sanwa</li>
                            </ul>
                        </div>
                        <div className="bg-red-900/20 p-4 rounded">
                            <h3 className="text-red-400 font-bold mb-2">Hitbox Settings</h3>
                            <ul className="text-sm space-y-1">
                                <li>Sensitivity: Medium</li>
                                <li>Deadzone: 5%</li>
                                <li>Polling Rate: 1000Hz</li>
                                <li>Input Display: ON</li>
                                <li>Button Mapping: Tournament Legal</li>
                                <li>Turbo: Disabled</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Netcode & Online</h2>
                    <div className="space-y-4">
                        <div className="bg-blue-900/20 p-4 rounded">
                            <h3 className="text-blue-400 font-bold mb-2">Rollback Netcode</h3>
                            <p className="text-sm text-gray-300">
                                Street Fighter 6 usa rollback netcode moderno. 
                                Configure para 5-7 frames de delay para melhor experiência.
                            </p>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded">
                            <h3 className="text-green-400 font-bold mb-2">Network Optimization</h3>
                            <p className="text-sm text-gray-300">
                                Use Ethernet, configure QoS para gaming, 
                                e use DNS Cloudflare para menor latência.
                            </p>
                        </div>
                        <div className="bg-yellow-900/20 p-4 rounded">
                            <h3 className="text-yellow-400 font-bold mb-2">Tournament Settings</h3>
                            <p className="text-sm text-gray-300">
                                Desative overlays, recording e background apps. 
                                Use modo de janela borderless para melhor performance.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-3xl">?</span>
                        Voltris Optimizer: 240FPS COMBO PERFEITO!
                    </h2>
                    <p className="text-white mb-6">
                        Street Fighter 6 com 240FPS exige otimização extrema! O Voltris Optimizer configura automaticamente:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded">
                            <h3 className="font-bold text-white mb-2">Otimizações Fighting</h3>
                            <ul className="text-sm text-white/90 space-y-1">
                                <li>Perfil GPU para fighting games</li>
                                <li>Otimização de input lag zero</li>
                                <li>Desativação de processos desnecessários</li>
                                <li>Configurações para tournament</li>
                            </ul>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded">
                            <h3 className="font-bold text-white mb-2">Resultados</h3>
                            <ul className="text-sm text-white/90 space-y-1">
                                <li>+15-25% FPS estáveis</li>
                                <li>Input lag zero absoluto</li>
                                <li>Combos perfeitos sem lag</li>
                                <li>Online sem delay</li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a href="/voltrisoptimizer" className="flex-1 bg-white text-[#31A8FF] font-bold text-center px-6 py-3 rounded-lg hover:scale-105 transition-all">
                            Baixar Grátis
                        </a>
                        <a href="/adquirir-licenca" className="flex-1 bg-black/30 text-white font-bold text-center px-6 py-3 rounded-lg hover:bg-black/50 transition-all border border-white/30">
                            Ver Planos PRO
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
