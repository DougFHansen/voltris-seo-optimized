import { Metadata } from 'next';

export const guideMetadata = {
    id: 'stalker-2-pc-configuracoes-otimizacao',
    title: "S.T.A.L.K.E.R. 2 PC: ZONA EXCLUSIVA! (Configurações 2026)",
    description: "Sobreviva na Zona com performance máxima! Configurações para ray tracing avançado, 4K 60FPS e otimização para o mundo pós-apocalíptico mais realista.",
    category: 'otimizacao',
    difficulty: 'Avançado',
    time: '30 min'
};

const title = "S.T.A.L.K.E.R. 2 PC: ZONA EXCLUSIVA! (Configurações 2026)";
const description = "S.T.A.L.K.E.R. 2 chega com Unreal Engine 5 e gráficos revolucionários. Aprenda as configurações exatas para explorar a Zona com FPS estáveis e máxima imersão.";

const keywords = [
    'stalker 2 pc requirements',
    'stalker 2 optimization settings',
    'stalker 2 unreal engine 5 performance',
    'stalker 2 ray tracing configuration',
    'stalker 2 benchmark rtx 4080',
    'stalker 2 4k 60fps settings',
    'stalker 2 dlss 3 frame generation',
    'stalker 2 zone performance optimization'
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
                url: '/stalker-2-og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'S.T.A.L.K.E.R. 2 PC Configurações'
            }
        ]
    },
    alternates: {
        canonical: 'https://voltris.com.br/guias/stalker-2-pc-configuracoes-otimizacao'
    }
};

export default function Stalker2Guide() {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-6">{title}</h1>
                <p className="text-xl text-gray-300 mb-8">{description}</p>
                
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Requisitos S.T.A.L.K.E.R. 2</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-red-900/20 p-4 rounded">
                            <h3 className="text-red-400 font-bold mb-2">Mínimo (1080p 30 FPS)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 3060 8GB</li>
                                <li>CPU: Ryzen 5 3600X</li>
                                <li>RAM: 16GB DDR4</li>
                                <li>VRAM: 8GB+</li>
                                <li>Storage: 150GB SSD NVMe</li>
                            </ul>
                        </div>
                        <div className="bg-yellow-900/20 p-4 rounded">
                            <h3 className="text-yellow-400 font-bold mb-2">Recomendado (1440p 60 FPS)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 4070 Ti 12GB</li>
                                <li>CPU: Ryzen 7 7700X</li>
                                <li>RAM: 32GB DDR5</li>
                                <li>VRAM: 12GB+</li>
                                <li>Storage: 150GB NVMe Gen4</li>
                            </ul>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded">
                            <h3 className="text-green-400 font-bold mb-2">Ultra (4K 60 FPS)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 4090 24GB</li>
                                <li>CPU: Ryzen 9 7950X3D</li>
                                <li>RAM: 32GB DDR5</li>
                                <li>VRAM: 16GB+</li>
                                <li>Storage: 150GB NVMe Gen4</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Configurações Unreal Engine 5</h2>
                    <p className="text-gray-300 mb-4">
                        S.T.A.L.K.E.R. 2 usa Unreal Engine 5 com Lumen e Nanite para gráficos revolucionários.
                    </p>
                    <div className="bg-purple-900/20 p-4 rounded mb-4">
                        <h3 className="text-purple-400 font-bold mb-2">Configuração 1440p Balanced</h3>
                        <ul className="text-sm space-y-1">
                            <li>Resolution: 1440p</li>
                            <li>DLSS: Quality</li>
                            <li>Frame Generation: ON</li>
                            <li>Lumen: Medium</li>
                            <li>Nanite: High</li>
                            <li>Ray Tracing: Medium</li>
                            <li>Shadows: High</li>
                            <li>Textures: Ultra</li>
                            <li>View Distance: High</li>
                            <li>Post Processing: High</li>
                        </ul>
                    </div>
                    <div className="bg-blue-900/20 p-4 rounded">
                        <h3 className="text-blue-400 font-bold mb-2">Configuração 4K Ultra</h3>
                        <ul className="text-sm space-y-1">
                            <li>Resolution: 4K</li>
                            <li>DLSS: Balanced</li>
                            <li>Frame Generation: ON</li>
                            <li>Lumen: High</li>
                            <li>Nanite: Epic</li>
                            <li>Ray Tracing: High</li>
                            <li>Shadows: Epic</li>
                            <li>Textures: Epic</li>
                            <li>View Distance: Epic</li>
                            <li>Post Processing: Epic</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Lumen & Nanite Optimization</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-orange-900/20 p-4 rounded">
                            <h3 className="text-orange-400 font-bold mb-2">Lumen Settings</h3>
                            <ul className="text-sm space-y-1">
                                <li>Global Illumination: Medium</li>
                                <li>Reflections: Medium</li>
                                <li>Software Lumen: OFF</li>
                                <li>Hardware Lumen: ON</li>
                                <li>Lumen Scale: 75%</li>
                            </ul>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded">
                            <h3 className="text-green-400 font-bold mb-2">Nanite Settings</h3>
                            <ul className="text-sm space-y-1">
                                <li>Nanite Virtualized Geometry: ON</li>
                                <li>Max Pixels: 64</li>
                                <li>Occlusion: Medium</li>
                                <li>LOD Bias: 0</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Performance na Zona</h2>
                    <div className="space-y-4">
                        <div className="bg-red-900/20 p-4 rounded">
                            <h3 className="text-red-400 font-bold mb-2">Anomalias & Efeitos Especiais</h3>
                            <p className="text-sm text-gray-300">
                                Anomalias consomem muito GPU. Reduza Particle Effects para Medium 
                                se FPS cair em áreas com anomalias.
                            </p>
                        </div>
                        <div className="bg-yellow-900/20 p-4 rounded">
                            <h3 className="text-yellow-400 font-bold mb-2">NPCs & Mutantes</h3>
                            <p className="text-sm text-gray-300">
                                Reduza Actor Distance para 80% em áreas densas. 
                                Use DLSS Performance se necessário.
                            </p>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded">
                            <h3 className="text-green-400 font-bold mb-2">Áreas Internas vs Externas</h3>
                            <p className="text-sm text-gray-300">
                                Áreas internas rodam melhor. Configure presets diferentes 
                                para cada tipo de área.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-3xl">?</span>
                        Voltris Optimizer: SOBREVIVA NA ZONA SEM LAG!
                    </h2>
                    <p className="text-white mb-6">
                        S.T.A.L.K.E.R. 2 com Unreal Engine 5 exige otimização! O Voltris Optimizer configura automaticamente:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded">
                            <h3 className="font-bold text-white mb-2">Otimizações Zona</h3>
                            <ul className="text-sm text-white/90 space-y-1">
                                <li>Perfil GPU para Unreal Engine 5</li>
                                <li>Otimização de Lumen & Nanite</li>
                                <li>Desativação de processos desnecessários</li>
                                <li>Configurações para anomalias</li>
                            </ul>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded">
                            <h3 className="font-bold text-white mb-2">Resultados</h3>
                            <ul className="text-sm text-white/90 space-y-1">
                                <li>+30-40% FPS estáveis</li>
                                <li>Sem stuttering em anomalias</li>
                                <li>Carregamento rápido de áreas</li>
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
