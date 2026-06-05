import { Metadata } from 'next';
import { GuideTemplate } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'gta-6-pc-configuracoes-requisitos',
    title: "GTA 6 PC: RODE LISO!",
    description: "Seu PC aguenta GTA 6? Requisitos oficiais, configurações para 60 FPS e otimização extrema. Guia completo para rodar o maior jogo!",
    category: 'games-fix',
    difficulty: 'Avançado',
    time: '30 min'
};

const title = "GTA 6 PC: RODE LISO!";
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
        canonical: 'https://www.voltris.com.br/guias/gta-6-pc-configuracoes-requisitos'
    }
};

const contentSections = [
    {
        title: 'Requisitos Oficiais GTA 6',
        content: `
            <p>GTA 6 exige hardware potente para rodar com gráficos revolucionários e física avançada. Veja os requisitos mínimos e recomendados.</p>
            <h3>Mínimo (1080p 30 FPS)</h3>
            <ul>
                <li>GPU: RTX 3060 8GB</li>
                <li>CPU: Ryzen 5 5600X</li>
                <li>RAM: 16GB DDR4</li>
                <li>Armazenamento: 150GB SSD NVMe</li>
            </ul>
            <h3>Recomendado (4K 60 FPS)</h3>
            <ul>
                <li>GPU: RTX 4080 16GB</li>
                <li>CPU: Ryzen 9 7950X</li>
                <li>RAM: 32GB DDR5</li>
                <li>Armazenamento: 200GB SSD NVMe Gen4</li>
            </ul>
        `
    },
    {
        title: 'Configurações Perfeitas por Hardware',
        content: `
            <p>GTA 6 foi construído pensando em upscaling. DLSS 3 Quality + Medium RT é o sweet spot para maioria dos jogadores.</p>
            <h3>Configuração Universal (1440p 60 FPS)</h3>
            <ul>
                <li>Resolution: 1440p</li>
                <li>DLSS: Quality</li>
                <li>Frame Generation: ON</li>
                <li>Ray Tracing: Medium</li>
                <li>Shadows: High</li>
                <li>Textures: Ultra</li>
                <li>Reflections: Medium</li>
            </ul>
        `
    },
    {
        title: 'Otimização Avançada',
        content: `
            <p>Use o Voltris Optimizer para configurar automaticamente seu PC para GTA 6:</p>
            <ul>
                <li>Perfil GPU otimizado para Rockstar Engine</li>
                <li>Desativação de processos desnecessários</li>
                <li>Otimização de RAM para mundo aberto</li>
                <li>Configurações de rede para GTA Online</li>
            </ul>
        `
    }
];

const summaryTable = [
    { label: 'Dificuldade', value: 'Avançado' },
    { label: 'Tempo', value: '30 min' },
    { label: 'Categoria', value: 'Games Fix' },
    { label: 'FPS Alvo', value: '60 FPS' }
];

const keyPoints = [
    'Requisitos oficiais para GTA 6',
    'Configurações universais 1440p',
    'Otimização para Rockstar Engine',
    'Suporte a DLSS 3 e Ray Tracing'
];

export default function GTA6Guide() {
    const aiSummary = "GTA 6 requer RTX 3060 8GB mínimo para 1080p 30 FPS. Para 4K 60 FPS, use RTX 4080 16GB com Ryzen 9 7950X e 32GB DDR5. Configure DLSS 3 Quality + Frame Generation ON, Ray Tracing Medium, Shadows High e Textures Ultra para o sweet spot 1440p 60 FPS.";

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime={guideMetadata.time}
            difficultyLevel={guideMetadata.difficulty}
            contentSections={contentSections}
            summaryTable={summaryTable}
            keyPoints={keyPoints}
            showVoltrisOptimizerCTA={true}
            pathname="/guias/gta-6-pc-configuracoes-requisitos"
            category={guideMetadata.category}
            aiSummary={aiSummary}
        />
    );
}
