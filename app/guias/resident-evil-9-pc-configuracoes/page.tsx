import { Metadata } from 'next';

export const guideMetadata = {
    id: 'resident-evil-9-pc-configuracoes',
    title: "Resident Evil 9 PC: SOBREVIVA EM 4K! (Ray Tracing 2026)",
    description: "Enfrente o terror com performance máxima! Configurações para ray tracing avançado, 4K 120FPS e otimização para a experiência de terror mais imersiva.",
    category: 'otimizacao',
    difficulty: 'Avançado',
    time: '25 min'
};

const title = "Resident Evil 9 PC: SOBREVIVA EM 4K! (Ray Tracing 2026)";
const description = "Resident Evil 9 chega com RE Engine 2.0 e gráficos photorealísticos. Aprenda as configurações exatas para sobreviver ao horror com FPS estáveis e máxima imersão.";

const keywords = [
    'resident evil 9 pc requirements',
    'resident evil 9 optimization settings',
    'resident evil 9 ray tracing configuration',
    'resident evil 9 4k 120fps settings',
    'resident evil 9 re engine 2 performance',
    'resident evil 9 benchmark rtx 4080',
    'resident evil 9 horror immersion settings',
    'resident evil 9 dlss 3 frame generation'
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
                url: '/resident-evil-9-og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Resident Evil 9 PC Configurações'
            }
        ]
    },
    alternates: {
        canonical: 'https://voltris.com.br/guias/resident-evil-9-pc-configuracoes'
    }
};

export default function ResidentEvil9Guide() {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-6">{title}</h1>
                <p className="text-xl text-gray-300 mb-8">{description}</p>
                
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Requisitos Resident Evil 9</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-red-900/20 p-4 rounded">
                            <h3 className="text-red-400 font-bold mb-2">Mínimo (1080p 60 FPS)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 3060 8GB</li>
                                <li>CPU: Ryzen 5 5600X</li>
                                <li>RAM: 16GB DDR4</li>
                                <li>VRAM: 8GB+</li>
                                <li>Storage: 120GB SSD NVMe</li>
                            </ul>
                        </div>
                        <div className="bg-yellow-900/20 p-4 rounded">
                            <h3 className="text-yellow-400 font-bold mb-2">Recomendado (1440p 120 FPS)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 4070 Ti 12GB</li>
                                <li>CPU: Ryzen 7 7700X</li>
                                <li>RAM: 32GB DDR5</li>
                                <li>VRAM: 12GB+</li>
                                <li>Storage: 120GB NVMe Gen4</li>
                            </ul>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded">
                            <h3 className="text-green-400 font-bold mb-2">Ultra (4K 120 FPS)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 4090 24GB</li>
                                <li>CPU: Ryzen 9 7950X3D</li>
                                <li>RAM: 32GB DDR5</li>
                                <li>VRAM: 16GB+</li>
                                <li>Storage: 120GB NVMe Gen4</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Configurações RE Engine 2.0</h2>
                    <p className="text-gray-300 mb-4">
                        Resident Evil 9 usa RE Engine 2.0 com ray tracing path tracing e iluminação volumétrica avançada.
                    </p>
                    <div className="bg-purple-900/20 p-4 rounded mb-4">
                        <h3 className="text-purple-400 font-bold mb-2">Configuração 1440p Immersive</h3>
                        <ul className="text-sm space-y-1">
                            <li>Resolution: 1440p</li>
                            <li>DLSS: Quality</li>
                            <li>Frame Generation: ON</li>
                            <li>Ray Tracing: Path Tracing Medium</li>
                            <li>Volumetric Lighting: High</li>
                            <li>Shadow Quality: High</li>
                            <li>Texture Quality: Ultra</li>
                                <li>Model Detail: Ultra</li>
                            <li>Anti-Aliasing: TAA</li>
                            <li>Depth of Field: High</li>
                        </ul>
                    </div>
                    <div className="bg-blue-900/20 p-4 rounded">
                        <h3 className="text-blue-400 font-bold mb-2">Configuração 4K Ultra Horror</h3>
                        <ul className="text-sm space-y-1">
                            <li>Resolution: 4K</li>
                            <li>DLSS: Balanced</li>
                            <li>Frame Generation: ON</li>
                            <li>Ray Tracing: Path Tracing High</li>
                            <li>Volumetric Lighting: Ultra</li>
                            <li>Shadow Quality: Ultra</li>
                            <li>Texture Quality: Ultra</li>
                            <li>Model Detail: Ultra</li>
                            <li>Anti-Aliasing: TAA Ultra</li>
                            <li>Depth of Field: Ultra</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Configurações de Imersão</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-orange-900/20 p-4 rounded">
                            <h3 className="text-orange-400 font-bold mb-2">Áudio 3D</h3>
                            <ul className="text-sm space-y-1">
                                <li>Audio: Dolby Atmos</li>
                                <li>Headphones: ON</li>
                                <li>Spatial Audio: ON</li>
                                <li>HRTF: ON</li>
                                <li>Volume: 80-90%</li>
                                <li>Bass Boost: Moderate</li>
                            </ul>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded">
                            <h3 className="text-green-400 font-bold mb-2">Visual Horror</h3>
                            <ul className="text-sm space-y-1">
                                <li>Brightness: 40-50%</li>
                                <li>Contrast: High</li>
                                <li>Chromatic Aberration: ON</li>
                                <li>Film Grain: Low</li>
                                <li>Motion Blur: Low</li>
                                <li>Lens Flare: ON</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Performance vs Horror</h2>
                    <div className="space-y-4">
                        <div className="bg-red-900/20 p-4 rounded">
                            <h3 className="text-red-400 font-bold mb-2">Path Tracing Impact</h3>
                            <p className="text-sm text-gray-300">
                                Path Tracing reduz 30-40% FPS. Use Medium para balance 
                                entre visual e performance em 1440p.
                            </p>
                        </div>
                        <div className="bg-yellow-900/20 p-4 rounded">
                            <h3 className="text-yellow-400 font-bold mb-2">Volumetric Lighting</h3>
                            <p className="text-sm text-gray-300">
                                Essencial para atmosfera de terror. Reduza para Medium 
                                se FPS &lt; 60 em cenas escuras.
                            </p>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded">
                            <h3 className="text-green-400 font-bold mb-2">VRAM Optimization</h3>
                            <p className="text-sm text-gray-300">
                                4K Ultra consome 12-16GB VRAM. Monitore uso e 
                                reduza Texture Quality se necessário.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-3xl">?</span>
                        Voltris Optimizer: SOBREVIVA AO TERROR SEM LAG!
                    </h2>
                    <p className="text-white mb-6">
                        Resident Evil 9 com Ray Tracing Path Tracing exige otimização! O Voltris Optimizer configura automaticamente:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded">
                            <h3 className="font-bold text-white mb-2">Otimizações Horror</h3>
                            <ul className="text-sm text-white/90 space-y-1">
                                <li>Perfil GPU para Path Tracing</li>
                                <li>Otimização de VRAM para terror</li>
                                <li>Desativação de processos desnecessários</li>
                                <li>Configurações para imersão máxima</li>
                            </ul>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded">
                            <h3 className="font-bold text-white mb-2">Resultados</h3>
                            <ul className="text-sm text-white/90 space-y-1">
                                <li>+25-35% FPS estáveis</li>
                                <li>Sem stutter em momentos de terror</li>
                                <li>Imersão total sem lag</li>
                                <li>Áudio 3D perfeito</li>
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
