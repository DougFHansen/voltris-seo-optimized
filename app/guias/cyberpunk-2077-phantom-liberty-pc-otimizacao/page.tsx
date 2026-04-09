import { Metadata } from 'next';

export const guideMetadata = {
    id: 'cyberpunk-2077-phantom-liberty-pc-otimizacao',
    title: "Cyberpunk 2077 Phantom Liberty: NIGHT CITY 4K 60FPS! (2026)",
    description: "Configure Night City para performance máxima! Ray Tracing Path Tracing, DLSS 3.5 e overclock para rodar liso em qualquer hardware.",
    category: 'otimizacao',
    difficulty: 'Avançado',
    time: '35 min'
};

const title = "Cyberpunk 2077 Phantom Liberty: NIGHT CITY 4K 60FPS! (2026)";
const description = "Phantom Liberty transformou Cyberpunk 2077 com ray tracing path tracing. Aprenda as configurações exatas para rodar o jogo mais bonito do mercado com FPS estáveis.";

const keywords = [
    'cyberpunk 2077 phantom liberty pc settings',
    'cyberpunk 2077 path tracing optimization',
    'cyberpunk 2077 dlss 3.5 frame generation',
    'cyberpunk 2077 rtx 4090 benchmark 4k',
    'cyberpunk 2077 ray tracing ultra settings',
    'cyberpunk 2077 phantom liberty requirements',
    'cyberpunk 2077 overclock gpu cpu',
    'night city performance optimization'
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
                url: '/cyberpunk-2077-og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Cyberpunk 2077 Phantom Liberty PC Configurações'
            }
        ]
    },
    alternates: {
        canonical: 'https://voltris.com.br/guias/cyberpunk-2077-phantom-liberty-pc-otimizacao'
    }
};

export default function Cyberpunk2077Guide() {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-6">{title}</h1>
                <p className="text-xl text-gray-300 mb-8">{description}</p>
                
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Requisitos Phantom Liberty (Path Tracing)</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-red-900/20 p-4 rounded">
                            <h3 className="text-red-400 font-bold mb-2">Mínimo (1080p RT Medium)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 3060 Ti 8GB</li>
                                <li>CPU: Ryzen 5 5600X</li>
                                <li>RAM: 16GB DDR4</li>
                                <li>VRAM: 8GB+</li>
                                <li>Storage: 85GB SSD NVMe</li>
                            </ul>
                        </div>
                        <div className="bg-yellow-900/20 p-4 rounded">
                            <h3 className="text-yellow-400 font-bold mb-2">Recomendado (1440p RT High)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 4070 Ti 12GB</li>
                                <li>CPU: Ryzen 7 7700X</li>
                                <li>RAM: 32GB DDR5</li>
                                <li>VRAM: 12GB+</li>
                                <li>Storage: 85GB NVMe Gen4</li>
                            </ul>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded">
                            <h3 className="text-green-400 font-bold mb-2">Ultra (4K Path Tracing)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 4090 24GB</li>
                                <li>CPU: Ryzen 9 7950X3D</li>
                                <li>RAM: 64GB DDR5</li>
                                <li>VRAM: 16GB+</li>
                                <li>Storage: 85GB NVMe Gen4</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Configurações Path Tracing</h2>
                    <p className="text-gray-300 mb-4">
                        Path Tracing é o futuro da renderização. Phantom Liberty foi o primeiro jogo a implementar RT completo.
                    </p>
                    <div className="bg-purple-900/20 p-4 rounded mb-4">
                        <h3 className="text-purple-400 font-bold mb-2">Configuração 1440p Path Tracing Sweet Spot</h3>
                        <ul className="text-sm space-y-1">
                            <li>Ray Tracing: Path Tracing Medium</li>
                            <li>DLSS: DLSS 3.5 Quality</li>
                            <li>Frame Generation: ON</li>
                            <li>NVIDIA Reflex: ON + Boost</li>
                            <li>Texture Quality: Ultra</li>
                            <li>Dynamic Resolution: OFF</li>
                            <li>Screen Space Reflections: OFF (substituído por RT)</li>
                        </ul>
                    </div>
                    <div className="bg-blue-900/20 p-4 rounded">
                        <h3 className="text-blue-400 font-bold mb-2">Configuração 4K Path Tracing Ultra</h3>
                        <ul className="text-sm space-y-1">
                            <li>Ray Tracing: Path Tracing Psycho</li>
                            <li>DLSS: DLSS 3.5 Performance</li>
                            <li>Frame Generation: ON</li>
                            <li>NVIDIA Reflex: ON + Boost</li>
                            <li>Texture Quality: Psycho</li>
                            <li>Dynamic Resolution: 75% (se necessário)</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Overclock para Maximum Performance</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-orange-900/20 p-4 rounded">
                            <h3 className="text-orange-400 font-bold mb-2">GPU Overclock (RTX 40-Series)</h3>
                            <ul className="text-sm space-y-1">
                                <li>Core Clock: +150 MHz</li>
                                <li>Memory Clock: +1000 MHz</li>
                                <li>Power Limit: 115-120%</li>
                                <li>Temp Limit: 85°C</li>
                                <li>Use MSI Afterburner</li>
                            </ul>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded">
                            <h3 className="text-green-400 font-bold mb-2">CPU Optimization</h3>
                            <ul className="text-sm space-y-1">
                                <li>PBO: Enabled (AMD)</li>
                                <li>Thermal Velocity Boost: ON (Intel)</li>
                                <li>Windows Power: Ultimate Performance</li>
                                <li>VBS: Disabled</li>
                                <li>Core Parking: Disabled</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Troubleshooting Comum</h2>
                    <div className="space-y-4">
                        <div className="bg-red-900/20 p-4 rounded">
                            <h3 className="text-red-400 font-bold mb-2">Stuttering em Áreas Densas</h3>
                            <p className="text-sm text-gray-300">
                                Reduza Crowd Density para Medium, ativa DLSS 3.5 Performance e 
                                aumente VRAM allocation no launcher.
                            </p>
                        </div>
                        <div className="bg-yellow-900/20 p-4 rounded">
                            <h3 className="text-yellow-400 font-bold mb-2">VRAM Insuficiente (8GB)</h3>
                            <p className="text-sm text-gray-300">
                                Use Texture Quality High, desative Cascaded Shadows Resolution 
                                e configure Specialized Lighting para Medium.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-3xl">?</span>
                        Voltris Optimizer: NIGHT CITY 4K SEM LAG!
                    </h2>
                    <p className="text-white mb-6">
                        Phantom Liberty com Ray Tracing Path Tracing exige otimização! O Voltris Optimizer configura automaticamente:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded">
                            <h3 className="font-bold text-white mb-2">Otimizações Cyberpunk</h3>
                            <ul className="text-sm text-white/90 space-y-1">
                                <li>Perfil GPU para Path Tracing</li>
                                <li>Otimização de VRAM para RT</li>
                                <li>Overclock seguro automático</li>
                                <li>Configurações de rede para multiplayer</li>
                            </ul>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded">
                            <h3 className="font-bold text-white mb-2">Resultados</h3>
                            <ul className="text-sm text-white/90 space-y-1">
                                <li>+25-35% FPS com RT</li>
                                <li>Sem stuttering em Night City</li>
                                <li>Temperatura controlada</li>
                                <li>Carregamento ultra rápido</li>
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
