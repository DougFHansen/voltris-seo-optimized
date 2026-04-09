import { Metadata } from 'next';

export const guideMetadata = {
    id: 'forza-motorsport-2026-pc-configuracoes',
    title: "Forza Motorsport 2026: 4K 120FPS ULTRA! (Ray Tracing)",
    description: "Configure seu PC para o simulador de corrida mais realista! Ray Tracing em tempo real, 4K 120FPS e configurações de wheel para experiência máxima.",
    category: 'otimizacao',
    difficulty: 'Avançado',
    time: '30 min'
};

const title = "Forza Motorsport 2026: 4K 120FPS ULTRA! (Ray Tracing)";
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

export default function ForzaMotorsport2026Guide() {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-6">{title}</h1>
                <p className="text-xl text-gray-300 mb-8">{description}</p>
                
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Requisitos Forza Motorsport 2026</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-red-900/20 p-4 rounded">
                            <h3 className="text-red-400 font-bold mb-2">Mínimo (1080p 60 FPS)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 3060 8GB</li>
                                <li>CPU: Ryzen 5 3600X</li>
                                <li>RAM: 16GB DDR4</li>
                                <li>Storage: 150GB SSD NVMe</li>
                                <li>DirectX: 12 Ultimate</li>
                            </ul>
                        </div>
                        <div className="bg-yellow-900/20 p-4 rounded">
                            <h3 className="text-yellow-400 font-bold mb-2">Recomendado (1440p 120 FPS)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 4070 Ti 12GB</li>
                                <li>CPU: Ryzen 7 7700X</li>
                                <li>RAM: 32GB DDR5</li>
                                <li>Storage: 150GB NVMe Gen4</li>
                                <li>DirectX: 12 Ultimate</li>
                            </ul>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded">
                            <h3 className="text-green-400 font-bold mb-2">Ultra (4K 120 FPS + RT)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 4090 24GB</li>
                                <li>CPU: Ryzen 9 7950X3D</li>
                                <li>RAM: 32GB DDR5</li>
                                <li>Storage: 150GB NVMe Gen4</li>
                                <li>DirectX: 12 Ultimate</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Configurações Gráficas 4K Ultra</h2>
                    <p className="text-gray-300 mb-4">
                        Forza Motorsport 2026 usa ray tracing em tempo real para reflexos e iluminação global.
                    </p>
                    <div className="bg-purple-900/20 p-4 rounded mb-4">
                        <h3 className="text-purple-400 font-bold mb-2">Configuração 4K 120FPS Ray Tracing</h3>
                        <ul className="text-sm space-y-1">
                            <li>Resolution: 4K (3840x2160)</li>
                            <li>Frame Rate: 120 FPS</li>
                            <li>Ray Tracing: High (carros e ambiente)</li>
                            <li>DLSS: Quality</li>
                            <li>Frame Generation: ON</li>
                            <li>Car Detail: Ultra</li>
                            <li>Environment Detail: Ultra</li>
                            <li>Track Detail: Ultra</li>
                            <li>Shadows: Ultra</li>
                            <li>Reflections: Ray Traced</li>
                        </ul>
                    </div>
                    <div className="bg-blue-900/20 p-4 rounded">
                        <h3 className="text-blue-400 font-bold mb-2">Configuração Performance (1440p 240Hz)</h3>
                        <ul className="text-sm space-y-1">
                            <li>Resolution: 1440p</li>
                            <li>Frame Rate: 240 FPS</li>
                            <li>Ray Tracing: Medium</li>
                            <li>DLSS: Performance</li>
                            <li>Frame Generation: ON</li>
                            <li>Car Detail: High</li>
                            <li>Environment Detail: High</li>
                            <li>Track Detail: High</li>
                            <li>Shadows: Medium</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Configurações de Racing Wheel</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-orange-900/20 p-4 rounded">
                            <h3 className="text-orange-400 font-bold mb-2">Logitech G29/G923</h3>
                            <ul className="text-sm space-y-1">
                                <li>Rotation: 900°</li>
                                <li>FFB Strength: 80-100%</li>
                                <li>Damping: 20%</li>
                                <li>Spring: 15%</li>
                                <li>Center Spring: 0%</li>
                                <li>Operating Range: 900°</li>
                            </ul>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded">
                            <h3 className="text-green-400 font-bold mb-2">Fanatec CSL Elite</h3>
                            <ul className="text-sm space-y-1">
                                <li>Rotation: 900° (GT3) / 540° (F1)</li>
                                <li>FFB: 100%</li>
                                <li>Shock: 80%</li>
                                <li>Damper: 20%</li>
                                <li>Spring: 15%</li>
                                <li>Sensitivity: Linear</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Otimização Avançada</h2>
                    <div className="space-y-4">
                        <div className="bg-red-900/20 p-4 rounded">
                            <h3 className="text-red-400 font-bold mb-2">VRAM Management</h3>
                            <p className="text-sm text-gray-300">
                                4K Ultra com ray tracing consome 16-20GB VRAM. Monitore uso e 
                                reduza Environment Detail se VRAM &gt; 90%.
                            </p>
                        </div>
                        <div className="bg-yellow-900/20 p-4 rounded">
                            <h3 className="text-yellow-400 font-bold mb-2">CPU Bottleneck</h3>
                            <p className="text-sm text-gray-300">
                                Use Ryzen 7+ ou Intel i7+ para 120FPS estáveis. 
                                Desative processos background e use modo Ultimate Performance.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-3xl">?</span>
                        Voltris Optimizer: 4K 120FPS SEM LAG!
                    </h2>
                    <p className="text-white mb-6">
                        Forza Motorsport 2026 com Ray Tracing exige otimização! O Voltris Optimizer configura automaticamente:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded">
                            <h3 className="font-bold text-white mb-2">Otimizações Forza</h3>
                            <ul className="text-sm text-white/90 space-y-1">
                                <li>Perfil GPU para Ray Tracing</li>
                                <li>Otimização de VRAM para 4K</li>
                                <li>Configurações de Racing Wheel</li>
                                <li>Overclock seguro automático</li>
                            </ul>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded">
                            <h3 className="font-bold text-white mb-2">Resultados</h3>
                            <ul className="text-sm text-white/90 space-y-1">
                                <li>+20-30% FPS estáveis</li>
                                <li>Sem micro-stutter em curvas</li>
                                <li>Input lag zero para wheel</li>
                                <li>Temperatura controlada</li>
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
