import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';
import FAQSchema, { overwatchFAQs } from '@/components/FAQSchema';

export const guideMetadata = {
    id: 'melhores-jogos-2026-configuracoes-pc',
    title: "TOP JOGOS 2026: Configurações PERFEITAS para PC (FPS Máximo)",
    description: "Quer jogar os lançamentos de 2026 sem lag? Guia completo com otimização exata para GTA 6, Starfield 2, Cyberpunk 2077 Phantom Liberty e mais!",
    category: 'otimizacao',
    difficulty: 'Intermediário',
    time: '25 min'
};

const title = "TOP JOGOS 2026: Configurações PERFEITAS para PC (FPS Máximo)";
const description = "Os maiores lançamentos de 2026 exigem hardware potente. Aprenda as configurações exatas para rodar GTA 6, Starfield 2, Cyberpunk 2077 Phantom Liberty e outros blockbusters com FPS estáveis.";

const keywords = [
    'melhores jogos 2026 pc configurações',
    'gta 6 pc requisitos otimização',
    'starfield 2 fps boost settings',
    'cyberpunk 2077 phantom liberty pc',
    'jogos aaa 2026 otimização completa',
    'configurações gráficas jogos novos',
    'rtx 4090 jogos 2026 benchmarks',
    'dlss 3 frame generation jogos 2026'
];

export const metadata: Metadata = createGuideMetadata('melhores-jogos-2026-configuracoes-pc', title, description, keywords);

export default function TopGames2026Guide() {
    const summaryTable = [
        { label: "GTA 6 (Recomendado)", value: "RTX 4070 + 32GB RAM" },
        { label: "Starfield 2 (Ultra)", value: "RTX 4080 + 64GB RAM" },
        { label: "Cyberpunk 2077 PL", value: "RTX 4060 Ti + DLSS 3" },
        { label: "Fable 4 (Max)", value: "RTX 4070 Ti + Ray Tracing" },
        { label: "Elder Scrolls 6", value: "RTX 4090 + 128GB RAM" },
        { label: "Otimização Essencial", value: "DLSS Quality + FSR 2.1" }
    ];

    const keyPoints = [
        "Configurações exatas para cada blockbuster de 2026",
        "Requisitos mínimos vs recomendados (com benchmarks)",
        "DLSS 3, FSR 2.1 e XeSS: qual usar em cada jogo",
        "Ray Tracing vs Performance: o equilíbrio perfeito",
        "Drivers otimizados para cada lançamento",
        "Hardware futuro-prova para jogos 2026-2027"
    ];

    const contentSections = [
        {
            title: "Os Blockbusters de 2026 - O Que Esperar",
            content: `
        <h3 class="text-2xl font-bold text-white mb-6">GTA 6: O Monstro que Vem</h3>
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O GTA 6 promete ser o jogo mais exigente da história. Com gráficos ray-traced em tempo real, 
          mundo aberto 4x maior que GTA 5 e física avançada, os requisitos são impressionantes.
        </p>
        
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 my-8">
            <h4 class="text-[#31A8FF] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">PC Mínimo vs Recomendado</span>
            </h4>
            <div class="grid md:grid-cols-2 gap-4 text-gray-300">
                <div>
                    <strong class="text-yellow-400">Mínimo (1080p Low):</strong><br/>
                    RTX 3060 / Ryzen 5 5600X / 16GB RAM
                </div>
                <div>
                    <strong class="text-green-400">Recomendado (4K Ultra):</strong><br/>
                    RTX 4080 / Ryzen 9 7950X / 32GB RAM
                </div>
            </div>
        </div>

        <h3 class="text-2xl font-bold text-white mb-6">Starfield 2: O Universo Expandido</h3>
        <p class="mb-6 text-gray-300 leading-relaxed">
          A Bethesda promete planetas com 4K nativo, 100+ sistemas estelares e multiplayer cross-platform. 
          A otimização será crucial para manter 60 FPS estáveis.
        </p>
        `,
        },
        {
            title: "Configurações Gráficas Ideais - FPS vs Qualidade",
            content: `
        <h3 class="text-2xl font-bold text-white mb-6">A Fórmula Perfeita para 2026</h3>
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, a regra mudou: <strong>DLSS 3 Frame Generation é obrigatório</strong>. 
          Jogos modernos foram desenvolvidos pensando em upscaling inteligente.
        </p>

        <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20 my-8">
            <h4 class="text-[#4ADE80] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">Configuração Universal 2026</span>
            </h4>
            <ul class="text-gray-300 space-y-2">
                <li>DLSS Quality (ou FSR 2.1 Balanced)</li>
                <li>Ray Tracing: Médio (não Ultra)</li>
                <li>Shadows: Alto (não Ultra)</li>
                <li>Textures: Ultra (depende da VRAM)</li>
                <li>Frame Generation: ON (se disponível)</li>
            </ul>
        </div>

        <h3 class="text-2xl font-bold text-white mb-6">VRAM: O Novo Gatilho</h3>
        <p class="mb-6 text-gray-300 leading-relaxed">
          Jogos 2026 estão consumindo 12-16GB VRAM em 1440p. RTX 4060 8GB já está no limite. 
          Para futuro-prova, invista em cards com 12GB+ VRAM.
        </p>
        `,
        },
        {
            title: "Hardware Futuro-Proof - O Que Comprar AGORA",
            content: `
        <h3 class="text-2xl font-bold text-white mb-6">Builds Recomendadas por Orçamento</h3>
        
        <div class="grid md:grid-cols-3 gap-6 my-8">
            <div class="bg-purple-900/10 p-5 rounded-xl border border-purple-500/20">
                <h4 class="text-[#A855F7] font-bold mb-3">Entry Level (R$ 5k)</h4>
                <ul class="text-gray-300 text-sm space-y-1">
                    <li>RTX 4060 8GB</li>
                    <li>Ryzen 5 7500F</li>
                    <li>16GB DDR5</li>
                    <li>1TB NVMe</li>
                    <li>1080p High</li>
                </ul>
            </div>
            
            <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
                <h4 class="text-[#31A8FF] font-bold mb-3">Sweet Spot (R$ 10k)</h4>
                <ul class="text-gray-300 text-sm space-y-1">
                    <li>RTX 4070 Ti 12GB</li>
                    <li>Ryzen 7 7800X3D</li>
                    <li>32GB DDR5</li>
                    <li>2TB NVMe</li>
                    <li>1440p Ultra</li>
                </ul>
            </div>
            
            <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20">
                <h4 class="text-[#4ADE80] font-bold mb-3">High End (R$ 20k+)</h4>
                <ul class="text-gray-300 text-sm space-y-1">
                    <li>RTX 4090 24GB</li>
                    <li>Ryzen 9 7950X3D</li>
                    <li>64GB DDR5</li>
                    <li>4TB NVMe</li>
                    <li>4K Ultra + RT</li>
                </ul>
            </div>
        </div>
        `,
        },
        {
            title: "Otimização Avançada - Além das Configurações",
            content: `
        <h3 class="text-2xl font-bold text-white mb-6">Drivers e Bios: O Segredo dos Pros</h3>
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, <strong>drivers específicos por jogo</strong> farão diferença de 20-30% FPS. 
          NVIDIA e AMD estão lançando otimizações sob demanda para cada blockbuster.
        </p>

        <div class="bg-orange-900/10 p-5 rounded-xl border border-orange-500/20 my-8">
            <h4 class="text-[#FB923C] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">Voltris Optimizer: Auto-Otimização 2026</span>
            </h4>
            <p class="text-gray-300 mb-4">
                Nosso software detecta automaticamente jogos 2026 e aplica:
            </p>
            <ul class="text-gray-300 space-y-2">
                <li>Perfil de GPU otimizado por jogo</li>
                <li>Desativação de processos desnecessários</li>
                <li>Otimização de RAM específica</li>
                <li>Configurações de rede para multiplayer</li>
                <li>Monitoramento de temperatura em tempo real</li>
            </ul>
            <a href="/voltrisoptimizer" class="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] text-white font-bold rounded-lg hover:scale-105 transition-all">
                Baixar Agora
            </a>
        </div>

        <h3 class="text-2xl font-bold text-white mb-6">Windows 11: Otimização Essencial</h3>
        <p class="mb-6 text-gray-300 leading-relaxed">
          Modo de Jogo do Windows 11 agora integra com DLSS 3. Ative Hardware Accelerated GPU Scheduling 
          e desative VBS para ganhar 5-10% performance adicional.
        </p>
        `,
        }
    ];

    const faqItems = [
        {
            question: "Vale a pena fazer upgrade agora ou esperar?",
            answer: "Se você tem RTX 20-series ou inferior, upgrade AGORA vale a pena. RTX 30-series ainda aguenta bem 2026 com DLSS. Espere só se você tem RTX 40-series."
        },
        {
            question: "32GB RAM é exagero para jogos?",
            answer: "Em 2026, não. Jogos como Starfield 2 já usam 20-24GB RAM em 1440p. 32GB é o novo padrão para gaming sério."
        },
        {
            question: "DLSS 3 funciona em GPUs AMD?",
            answer: "Não, DLSS 3 é exclusivo NVIDIA. AMD usa FSR 2.1 que oferece qualidade similar em jogos otimizados."
        },
        {
            question: "Ray Tracing vale a pena em 2026?",
            answer: "Sim, mas em Medium/High. Ultra RT ainda muito pesado. A diferença visual é enorme e DLSS 3 compensa a perda de performance."
        }
    ];

    const externalReferences = [
        { name: "NVIDIA DLSS 3 Official Guide", url: "https://www.nvidia.com/dlss-3/" },
        { name: "AMD FSR 2.1 Technical Paper", url: "https://www.amd.com/fsr-2" },
        { name: "PC Gamer 2026 Hardware Guide", url: "https://www.pcgamer.com/hardware" }
    ];

    const relatedGuides = [
        {
            href: "/guias/rtx-4090-vale-pena-2026",
            title: "RTX 4090: Vale a Pena em 2026?",
            description: "Análise completa da melhor GPU do mercado."
        },
        {
            href: "/guias/ssd-vs-hdd-guia",
            title: "SSD vs HDD vs NVMe",
            description: "O armazenamento ideal para jogos 2026."
        },
        {
            href: "/guias/overclock-gpu-seguro-2026",
            title: "Overclock de GPU Seguro",
            description: "Extraia FPS extras sem risco."
        }
    ];

    return (
        <>
            <FAQSchema faqs={overwatchFAQs} />
            <GuideTemplate
                title={title}
                description={description}
                keywords={keywords}
                estimatedTime="25 min"
                difficultyLevel="Intermediário"
                lastUpdated="Abril 2026"
                contentSections={contentSections}
                summaryTable={summaryTable}
                relatedGuides={relatedGuides}
                faqItems={faqItems}
                externalReferences={externalReferences}
                keyPoints={keyPoints}
            />
        </>
    );
}
