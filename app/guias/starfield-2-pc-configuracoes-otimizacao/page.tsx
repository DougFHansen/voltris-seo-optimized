import { Metadata } from 'next';

export const guideMetadata = {
    id: 'starfield-2-pc-configuracoes-otimizacao',
    title: "Starfield 2 PC: EXPLORE O UNIVERSO SEM LAG! (2026)",
    description: "Seu PC está pronto para explorar 100+ sistemas estelares? Configurações para 60 FPS estáveis, otimização de VRAM e segredos de performance!",
    category: 'otimizacao',
    difficulty: 'Intermediário',
    time: '25 min'
};

const title = "Starfield 2 PC: EXPLORE O UNIVERSO SEM LAG! (2026)";
const description = "Starfield 2 expande o universo com planetas 4K, multiplayer e física avançada. Aprenda a configurar seu PC para a melhor experiência espacial possível.";

const keywords = [
    'starfield 2 pc requirements',
    'starfield 2 optimization settings',
    'starfield 2 fps boost pc',
    'starfield 2 dlss 3 performance',
    'starfield 2 vram usage',
    'starfield 2 benchmark rtx 4080',
    'starfield 2 multiplayer pc',
    'bethesda starfield 2 pc specs'
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
                url: '/starfield-2-og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Starfield 2 PC Configurações'
            }
        ]
    },
    alternates: {
        canonical: 'https://voltris.com.br/guias/starfield-2-pc-configuracoes-otimizacao'
    }
};

export default function Starfield2Guide() {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-6">{title}</h1>
                <p className="text-xl text-gray-300 mb-8">{description}</p>
                
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Requisitos Estimados Starfield 2</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-red-900/20 p-4 rounded">
                            <h3 className="text-red-400 font-bold mb-2">Mínimo (1080p 30 FPS)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 3070 8GB</li>
                                <li>CPU: Ryzen 5 5600X</li>
                                <li>RAM: 16GB DDR4</li>
                                <li>VRAM: 8GB+</li>
                                <li>Storage: 125GB SSD</li>
                            </ul>
                        </div>
                        <div className="bg-yellow-900/20 p-4 rounded">
                            <h3 className="text-yellow-400 font-bold mb-2">Recomendado (1440p 60 FPS)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 4070 Ti 12GB</li>
                                <li>CPU: Ryzen 7 7700X</li>
                                <li>RAM: 32GB DDR5</li>
                                <li>VRAM: 12GB+</li>
                                <li>Storage: 150GB NVMe</li>
                            </ul>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded">
                            <h3 className="text-green-400 font-bold mb-2">Ultra (4K 60 FPS)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 4090 24GB</li>
                                <li>CPU: Ryzen 9 7950X3D</li>
                                <li>RAM: 64GB DDR5</li>
                                <li>VRAM: 16GB+</li>
                                <li>Storage: 200GB NVMe</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Configurações de Performance</h2>
                    <p className="text-gray-300 mb-4">
                        Starfield 2 usa Creation Engine 2.0 com suporte total a DLSS 3 e ray tracing avançado.
                    </p>
                    <div className="bg-purple-900/20 p-4 rounded mb-4">
                        <h3 className="text-purple-400 font-bold mb-2">Configuração 1440p Sweet Spot</h3>
                        <ul className="text-sm space-y-1">
                            <li>Resolution: 1440p</li>
                            <li>DLSS: Quality</li>
                            <li>Frame Generation: ON</li>
                            <li>Ray Tracing: Medium (planetas)</li>
                            <li>Shadows: High</li>
                            <li>Textures: Ultra</li>
                            <li>View Distance: Ultra</li>
                            <li>God Rays: Medium</li>
                        </ul>
                    </div>
                    <div className="bg-blue-900/20 p-4 rounded">
                        <h3 className="text-blue-400 font-bold mb-2">Configuração 4K Ultra</h3>
                        <ul className="text-sm space-y-1">
                            <li>Resolution: 4K</li>
                            <li>DLSS: Performance</li>
                            <li>Frame Generation: ON</li>
                            <li>Ray Tracing: High</li>
                            <li>Shadows: Ultra</li>
                            <li>Textures: Ultra</li>
                            <li>View Distance: Ultra</li>
                            <li>God Rays: High</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Otimização Específica</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-orange-900/20 p-4 rounded">
                            <h3 className="text-orange-400 font-bold mb-2">VRAM Management</h3>
                            <p className="text-sm text-gray-300">
                                Starfield 2 consome muita VRAM com texturas de planetas. 
                                Monitore uso e ajuste Textures para High se VRAM &gt; 90%.
                            </p>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded">
                            <h3 className="text-green-400 font-bold mb-2">CPU Optimization</h3>
                            <p className="text-sm text-gray-300">
                                Desative VBS e Core Isolation. Use modo de alto desempenho 
                                e prioridade alta para o processo do jogo.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Multiplayer Performance</h2>
                    <p className="text-gray-300 mb-4">
                        Para multiplayer, estabilidade de conexão é crucial:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>Use DNS Cloudflare (1.1.1.1) para menor latência</li>
                        <li>Configure QoS no roteador para priorizar jogo</li>
                        <li>Feche apps de streaming em background</li>
                        <li>Use cabo ethernet (sem Wi-Fi)</li>
                        <li>Configure firewall para permitir tráfego do jogo</li>
                    </ul>
                </div>

                <div className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-3xl">?</span>
                        Voltris Optimizer: Otimização Automática para Starfield 2
                    </h2>
                    <p className="text-white mb-6">
                        Não perca tempo configurando manualmente! O Voltris Optimizer detecta Starfield 2 e aplica automaticamente:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded">
                            <h3 className="font-bold text-white mb-2">Otimizações Automáticas</h3>
                            <ul className="text-sm text-white/90 space-y-1">
                                <li>Perfil GPU otimizado para Bethesda Engine</li>
                                <li>Desativação de processos desnecessários</li>
                                <li>Otimização de VRAM para planetas 4K</li>
                                <li>Configurações de rede para multiplayer</li>
                            </ul>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded">
                            <h3 className="font-bold text-white mb-2">Benefícios</h3>
                            <ul className="text-sm text-white/90 space-y-1">
                                <li>+15-25% FPS estáveis</li>
                                <li>Redução de stuttering</li>
                                <li>Carregamento mais rápido</li>
                                <li>Multiplayer mais estável</li>
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
