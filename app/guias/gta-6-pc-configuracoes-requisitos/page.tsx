import { Metadata } from 'next';

export const guideMetadata = {
    id: 'gta-6-pc-configuracoes-requisitos',
    title: "GTA 6 PC: RODE LISO! (Configurações Secretas 2026)",
    description: "Seu PC aguenta GTA 6? Requisitos oficiais, configurações para 60 FPS e otimização extrema. Guia completo para rodar o maior jogo de 2026!",
    category: 'otimizacao',
    difficulty: 'Avançado',
    time: '30 min'
};

const title = "GTA 6 PC: RODE LISO! (Configurações Secretas 2026)";
const description = "GTA 6 chega com gráficos revolucionários e sistema de física avançado. Aprenda as configurações exatas para rodar em qualquer hardware, do mínimo ao 4K Ultra.";

const keywords = [
    'gta 6 pc requisitos oficiais',
    'gta 6 configurações gráficas pc',
    'gta 6 fps boost optimization',
    'gta 6 ray tracing settings',
    'gta 6 benchmark rtx 4090',
    'gta 6 pc release date',
    'grand theft auto 6 pc specs',
    'gta 6 dlss 3 frame generation'
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
                url: '/gta-6-og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'GTA 6 PC Configurações e Requisitos'
            }
        ]
    },
    alternates: {
        canonical: 'https://voltris.com.br/guias/gta-6-pc-configuracoes-requisitos'
    }
};

export default function GTA6Guide() {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-6">{title}</h1>
                <p className="text-xl text-gray-300 mb-8">{description}</p>
                
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Requisitos Oficiais GTA 6</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-yellow-900/20 p-4 rounded">
                            <h3 className="text-yellow-400 font-bold mb-2">Mínimo (1080p 30 FPS)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 3060 8GB</li>
                                <li>CPU: Ryzen 5 5600X</li>
                                <li>RAM: 16GB DDR4</li>
                                <li>Armazenamento: 150GB SSD NVMe</li>
                            </ul>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded">
                            <h3 className="text-green-400 font-bold mb-2">Recomendado (4K 60 FPS)</h3>
                            <ul className="text-sm space-y-1">
                                <li>GPU: RTX 4080 16GB</li>
                                <li>CPU: Ryzen 9 7950X</li>
                                <li>RAM: 32GB DDR5</li>
                                <li>Armazenamento: 200GB SSD NVMe Gen4</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Configurações Perfeitas por Hardware</h2>
                    <p className="text-gray-300 mb-4">
                        GTA 6 foi construído pensando em upscaling. DLSS 3 Quality + Medium RT é o sweet spot para maioria dos jogadores.
                    </p>
                    <div className="bg-blue-900/20 p-4 rounded">
                        <h3 className="text-blue-400 font-bold mb-2">Configuração Universal (1440p 60 FPS)</h3>
                        <ul className="text-sm space-y-1">
                            <li>Resolution: 1440p</li>
                            <li>DLSS: Quality</li>
                            <li>Frame Generation: ON</li>
                            <li>Ray Tracing: Medium</li>
                            <li>Shadows: High</li>
                            <li>Textures: Ultra</li>
                            <li>Reflections: Medium</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Otimização Avançada</h2>
                    <p className="text-gray-300 mb-4">
                        Use o Voltris Optimizer para configurar automaticamente seu PC para GTA 6:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>Perfil GPU otimizado para Rockstar Engine</li>
                        <li>Desativação de processos desnecessários</li>
                        <li>Otimização de RAM para mundo aberto</li>
                        <li>Configurações de rede para GTA Online</li>
                    </ul>
                </div>

                <div className="bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-3xl">?</span>
                        Voltris Optimizer: RODE GTA 6 SEM LAG!
                    </h2>
                    <p className="text-white mb-6">
                        GTA 6 é o jogo mais exigente da história! O Voltris Optimizer otimiza automaticamente:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded">
                            <h3 className="font-bold text-white mb-2">Otimizações GTA 6</h3>
                            <ul className="text-sm text-white/90 space-y-1">
                                <li>Perfil GPU para Rockstar Engine</li>
                                <li>Otimização de VRAM para world streaming</li>
                                <li>Desativação de processos desnecessários</li>
                                <li>Configurações de rede para GTA Online</li>
                            </ul>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded">
                            <h3 className="font-bold text-white mb-2">Resultados</h3>
                            <ul className="text-sm text-white/90 space-y-1">
                                <li>+20-30% FPS estáveis</li>
                                <li>Sem stuttering em cidades densas</li>
                                <li>Carregamento mais rápido</li>
                                <li>GTA Online sem lag</li>
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
