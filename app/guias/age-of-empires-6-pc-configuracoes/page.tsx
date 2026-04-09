import { Metadata } from 'next';

export const guideMetadata = {
    id: 'age-of-empires-6-pc-configuracoes',
    title: "Age of Empires 6 PC: DOMINE O CAMPO! (Configurações 2026)",
    description: "Construa seu império sem lag! Configurações para 1000+ unidades, 4K 60FPS e otimização para multiplayer massivo com 8 jogadores.",
    category: 'otimizacao',
    difficulty: 'Intermediário',
    time: '25 min'
};

const title = "Age of Empires 6 PC: DOMINE O CAMPO! (Configurações 2026)";
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

export default function AgeOfEmpires6Guide() {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-6">{title}</h1>
                <p className="text-xl text-gray-300 mb-8">{description}</p>
                
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Requisitos Age of Empires 6</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-red-900/20 p-4 rounded">
                            <h3 className="text-red-400 font-bold mb-2">Mínimo (1080p 60 FPS)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 3060 8GB</li>
                                <li>CPU: Ryzen 5 5600X</li>
                                <li>RAM: 16GB DDR4</li>
                                <li>Storage: 100GB SSD</li>
                                <li>Max Units: 500</li>
                            </ul>
                        </div>
                        <div className="bg-yellow-900/20 p-4 rounded">
                            <h3 className="text-yellow-400 font-bold mb-2">Recomendado (1440p 60 FPS)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 4070 12GB</li>
                                <li>CPU: Ryzen 7 7700X</li>
                                <li>RAM: 32GB DDR5</li>
                                <li>Storage: 100GB NVMe</li>
                                <li>Max Units: 1000</li>
                            </ul>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded">
                            <h3 className="text-green-400 font-bold mb-2">Ultra (4K 60 FPS)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 4080 16GB</li>
                                <li>CPU: Ryzen 9 7950X</li>
                                <li>RAM: 32GB DDR5</li>
                                <li>Storage: 100GB NVMe Gen4</li>
                                <li>Max Units: 2000</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Configurações Gráficas para Batalhas Massivas</h2>
                    <p className="text-gray-300 mb-4">
                        Age of Empires 6 suporta 2000+ unidades em campo. Configurações otimizadas para late game.
                    </p>
                    <div className="bg-purple-900/20 p-4 rounded mb-4">
                        <h3 className="text-purple-400 font-bold mb-2">Configuração 1440p 1000+ Units</h3>
                        <ul className="text-sm space-y-1">
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
                    </div>
                    <div className="bg-blue-900/20 p-4 rounded">
                        <h3 className="text-blue-400 font-bold mb-2">Configuração 4K Ultra (500 Units)</h3>
                        <ul className="text-sm space-y-1">
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
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Multiplayer Optimization</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-orange-900/20 p-4 rounded">
                            <h3 className="text-orange-400 font-bold mb-2">Network Settings</h3>
                            <ul className="text-sm space-y-1">
                                <li>Connection: Ethernet</li>
                                <li>DNS: Cloudflare 1.1.1.1</li>
                                <li>QoS: Gaming Priority</li>
                                <li>Port Forwarding: Enabled</li>
                                <li>UPnP: ON</li>
                                <li>NAT Type: Open</li>
                            </ul>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded">
                            <h3 className="text-green-400 font-bold mb-2">Latency Reduction</h3>
                            <ul className="text-sm space-y-1">
                                <li>Game Mode: ON</li>
                                <li>VBS: Disabled</li>
                                <li>Background Apps: Minimal</li>
                                <li>Discord: Game Mode</li>
                                <li>Overlay: OFF</li>
                                <li>Recording: OFF</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Late Game Performance</h2>
                    <div className="space-y-4">
                        <div className="bg-red-900/20 p-4 rounded">
                            <h3 className="text-red-400 font-bold mb-2">1000+ Units (Imperial Age)</h3>
                            <p className="text-sm text-gray-300">
                                Reduza Unit Scale para High se FPS &lt; 30. 
                                Desative Shadows e use DLSS Performance.
                            </p>
                        </div>
                        <div className="bg-yellow-900/20 p-4 rounded">
                            <h3 className="text-yellow-400 font-bold mb-2">8 Players Multiplayer</h3>
                            <p className="text-sm text-gray-300">
                                Use Terrain Detail Medium e Building Detail High. 
                                Prioritize unit visibility over terrain quality.
                            </p>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded">
                            <h3 className="text-green-400 font-bold mb-2">CPU Bottleneck</h3>
                            <p className="text-sm text-gray-300">
                                Ryzen 7+ ou Intel i7+ recomendado. 
                                Use Voltris Optimizer para otimizar CPU em tempo real.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-3xl">?</span>
                        Voltris Optimizer: DOMINE O CAMPO SEM LAG!
                    </h2>
                    <p className="text-white mb-6">
                        Age of Empires 6 com 2000+ unidades exige otimização! O Voltris Optimizer configura automaticamente:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded">
                            <h3 className="font-bold text-white mb-2">Otimizações Império</h3>
                            <ul className="text-sm text-white/90 space-y-1">
                                <li>Perfil GPU para RTS massivo</li>
                                <li>Otimização de CPU para unidades</li>
                                <li>Desativação de processos desnecessários</li>
                                <li>Configurações de rede para 8 jogadores</li>
                            </ul>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded">
                            <h3 className="font-bold text-white mb-2">Resultados</h3>
                            <ul className="text-sm text-white/90 space-y-1">
                                <li>+40-50% FPS em late game</li>
                                <li>2000+ unidades sem lag</li>
                                <li>8 players multiplayer estável</li>
                                <li>Zero micro-stutter</li>
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
