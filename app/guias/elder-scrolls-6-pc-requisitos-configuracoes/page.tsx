import { Metadata } from 'next';

export const guideMetadata = {
    id: 'elder-scrolls-6-pc-requisitos-configuracoes',
    title: "Elder Scrolls 6 PC: TAMRIEL 4K 60FPS! (Configurações 2026)",
    description: "Explore Tamriel em 4K! Requisitos oficiais, configurações para 60 FPS estáveis e otimização para o mundo aberto maior da história dos RPGs.",
    category: 'otimizacao',
    difficulty: 'Avançado',
    time: '35 min'
};

const title = "Elder Scrolls 6 PC: TAMRIEL 4K 60FPS! (Configurações 2026)";
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
        canonical: 'https://voltris.com.br/guias/elder-scrolls-6-pc-requisitos-configuracoes'
    }
};

export default function ElderScrolls6Guide() {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-6">{title}</h1>
                <p className="text-xl text-gray-300 mb-8">{description}</p>
                
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Requisitos Estimados Elder Scrolls 6</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-red-900/20 p-4 rounded">
                            <h3 className="text-red-400 font-bold mb-2">Mínimo (1080p 30 FPS)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 3070 8GB</li>
                                <li>CPU: Ryzen 5 5600X</li>
                                <li>RAM: 16GB DDR4</li>
                                <li>VRAM: 8GB+</li>
                                <li>Storage: 200GB SSD NVMe</li>
                            </ul>
                        </div>
                        <div className="bg-yellow-900/20 p-4 rounded">
                            <h3 className="text-yellow-400 font-bold mb-2">Recomendado (1440p 60 FPS)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 4080 16GB</li>
                                <li>CPU: Ryzen 7 7800X3D</li>
                                <li>RAM: 32GB DDR5</li>
                                <li>VRAM: 12GB+</li>
                                <li>Storage: 200GB NVMe Gen4</li>
                            </ul>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded">
                            <h3 className="text-green-400 font-bold mb-2">Ultra (4K 60 FPS)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 4090 24GB</li>
                                <li>CPU: Ryzen 9 7950X3D</li>
                                <li>RAM: 64GB DDR5</li>
                                <li>VRAM: 16GB+</li>
                                <li>Storage: 200GB NVMe Gen4</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Configurações Creation Engine 2.0</h2>
                    <p className="text-gray-300 mb-4">
                        Elder Scrolls 6 usa Creation Engine 2.0 com suporte total a ray tracing e DLSS 3.
                    </p>
                    <div className="bg-purple-900/20 p-4 rounded mb-4">
                        <h3 className="text-purple-400 font-bold mb-2">Configuração 1440p Sweet Spot</h3>
                        <ul className="text-sm space-y-1">
                            <li>Resolution: 1440p</li>
                            <li>DLSS: Quality</li>
                            <li>Frame Generation: ON</li>
                            <li>Ray Tracing: Medium</li>
                            <li>Object Detail: Ultra</li>
                            <li>Actor Detail: High</li>
                            <li>Grass: High</li>
                            <li>Trees: Ultra</li>
                            <li>Shadows: High</li>
                            <li>View Distance: Ultra</li>
                        </ul>
                    </div>
                    <div className="bg-blue-900/20 p-4 rounded">
                        <h3 className="text-blue-400 font-bold mb-2">Configuração 4K Ultra</h3>
                        <ul className="text-sm space-y-1">
                            <li>Resolution: 4K</li>
                            <li>DLSS: Balanced</li>
                            <li>Frame Generation: ON</li>
                            <li>Ray Tracing: High</li>
                            <li>Object Detail: Ultra</li>
                            <li>Actor Detail: Ultra</li>
                            <li>Grass: Ultra</li>
                            <li>Trees: Ultra</li>
                            <li>Shadows: Ultra</li>
                            <li>View Distance: Ultra</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Otimização para Mundo Aberto</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-orange-900/20 p-4 rounded">
                            <h3 className="text-orange-400 font-bold mb-2">CPU Optimization</h3>
                            <ul className="text-sm space-y-1">
                                <li>Priority: High</li>
                                <li>Affinity: All cores</li>
                                <li>Power Plan: Ultimate</li>
                                <li>VBS: Disabled</li>
                                <li>Core Parking: Disabled</li>
                                <li>Temperature: &lt;85°C</li>
                            </ul>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded">
                            <h3 className="text-green-400 font-bold mb-2">RAM Management</h3>
                            <ul className="text-sm space-y-1">
                                <li>Page File: Automatic</li>
                                <li>Standby List: Clean</li>
                                <li>Background Apps: Minimal</li>
                                <li>Discord: Game Mode</li>
                                <li>Browser: Closed</li>
                                <li>Voltris Optimizer: ON</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Modding Performance</h2>
                    <p className="text-gray-300 mb-4">
                        Elder Scrolls 6 terá suporte nativo a mods. Performance com mods:
                    </p>
                    <div className="space-y-4">
                        <div className="bg-red-900/20 p-4 rounded">
                            <h3 className="text-red-400 font-bold mb-2">Textura Mods (4K)</h3>
                            <p className="text-sm text-gray-300">
                                Requer 24GB+ VRAM para 4K. Use 2K textures se VRAM limitada.
                            </p>
                        </div>
                        <div className="bg-yellow-900/20 p-4 rounded">
                            <h3 className="text-yellow-400 font-bold mb-2">Weather & Lighting</h3>
                            <p className="text-sm text-gray-300">
                                Pode reduzir 15-25% FPS. Use configurações balanced.
                            </p>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded">
                            <h3 className="text-green-400 font-bold mb-2">Script Mods</h3>
                            <p className="text-sm text-gray-300">
                                Impacto mínimo na performance, mas pode causar stuttering.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-3xl">?</span>
                        Voltris Optimizer: EXPLORE TAMRIEL SEM LAG!
                    </h2>
                    <p className="text-white mb-6">
                        Elder Scrolls 6 com mundo aberto massivo exige otimização! O Voltris Optimizer configura automaticamente:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded">
                            <h3 className="font-bold text-white mb-2">Otimizações Tamriel</h3>
                            <ul className="text-sm text-white/90 space-y-1">
                                <li>Perfil GPU para Creation Engine 2.0</li>
                                <li>Otimização de RAM para mundo aberto</li>
                                <li>Desativação de processos desnecessários</li>
                                <li>Configurações para mods pesados</li>
                            </ul>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded">
                            <h3 className="font-bold text-white mb-2">Resultados</h3>
                            <ul className="text-sm text-white/90 space-y-1">
                                <li>+25-35% FPS estáveis</li>
                                <li>Sem stuttering em cidades densas</li>
                                <li>Carregamento ultra rápido</li>
                                <li>1000+ mods sem lag</li>
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
