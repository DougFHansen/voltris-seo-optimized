import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'hds-vs-ssd-qual-a-diferenca',
    title: "SSD vs HDD (2026): Vale a pena manter o HD Mecânico?",
    description: "Entenda as diferenças entre HD, SSD SATA, NVMe M.2 Gen 3, Gen 4 e Gen 5. Descubra por que o HD mecânico deve ser aposentado até como armazenamento secundário para jogos.",
    category: 'hardware',
    difficulty: 'Iniciante',
    time: '15 min'
};

const title = "Guia de Armazenamento: SSD NVMe vs SATA vs HDD Antigo (2026)";
const description = "Ainda usa HD de disco rodando? Ele é o motivo do seu PC travar. Compare velocidades, durabilidade e preços dos SSDs modernos.";

const keywords = [
    'diferença ssd sata vs nvme jogos',
    'hdd vs ssd load times 2026',
    'ssd nvme gera 4 vs gen 5 vale a pena',
    'hd mecanico deixa pc lento',
    'clonar hd para ssd tutorial',
    'qual ssd comprar para notebook antigo',
    'vida util ssd vs hd',
    'armazenamento para jogos ssd obrigatório'
];

export const metadata: Metadata = createGuideMetadata('hds-vs-ssd-qual-a-diferenca', title, description, keywords);

export default function StorageGuide() {
    const summaryTable = [
        { label: "HD Mecânico", value: "100 MB/s (Lento / Apenas Arquivos)" },
        { label: "SSD SATA", value: "500 MB/s (Bom / Custo-benefício)" },
        { label: "NVMe Gen 3", value: "3.500 MB/s (Ótimo Padrão)" },
        { label: "NVMe Gen 4", value: "7.000 MB/s (PS5 / High End)" },
        { label: "NVMe Gen 5", value: "12.000 MB/s (Exagero / Caro)" },
        { label: "Recomendação", value: "NVMe para Windows e Jogos" }
    ];

    const contentSections = [
        {
            title: "Por que o HD Mecânico morreu?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O HD (Hard Disk Drive) funciona com um disco magnético girando fisicamente a 7200 RPM e uma agulha lendo dados. Isso cria uma latência física (tempo de busca).
          Em 2026, jogos modernos como <em>Starfield</em> e <em>Cyberpunk</em> exigem SSD. Usar HD causa texturas que não carregam, chão invisível e travadas longas. Use HD apenas para fotos e vídeos, NUNCA para jogos ou Windows.
        </p>

        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 my-8">
            <h4 class="text-[#31A8FF] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">🚀</span> NVMe Booster Voltris
            </h4>
            <p class="text-gray-300 mb-4">
                SSDs perdem performance se não tiverem o comando TRIM executado regularmente. O <strong>Voltris Optimizer</strong> força o re-trim e otimiza o cache de escrita do Windows para garantir que seu NVMe mantenha os 7000MB/s de leitura prometidos na caixa.
            </p>
            <a href="/voltrisoptimizer" class="group relative inline-flex px-8 py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] items-center justify-center gap-2">
                Otimizar SSD Agora
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        </div>
      `
        },
        {
            title: "SATA vs NVMe: Sente diferença?",
            content: `
        <p class="mb-4 text-gray-300">
            A migração de HD para SSD SATA é brutal (o PC liga em 1 min -> 10 seg). A migração de SATA para NVMe é sutil no dia a dia, mas importante para carregamentos pesados.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>SATA (Cabo):</strong> Limitado a 550 MB/s. Bom para dar vida nova a notebooks velhos que não têm slot M.2.</li>
            <li><strong>NVMe M.2 (Placa):</strong> Conecta direto no PCIe. Velocidades de 3000 MB/s a 10000 MB/s. É o padrão atual. Não ocupa espaço com cabos.</li>
        </ul>
      `
        },
        {
            title: "Gen 3 vs Gen 4 vs Gen 5",
            content: `
        <p class="mb-4 text-gray-300">
            Preciso do mais caro?
        </p>
        <div class="space-y-4">
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-white font-bold">Gen 3 (PCIe 3.0)</h4>
                <p class="text-gray-400 text-sm">Velocidade ~3500 MB/s. Perfeito para custo-benefício. O Windows liga tão rápido quanto no Gen 4.</p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-blue-400 font-bold">Gen 4 (PCIe 4.0)</h4>
                <p class="text-gray-400 text-sm">Velocidade ~7000 MB/s. Obrigatório para PS5. Útil para jogos com "DirectStorage" no PC.</p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-purple-400 font-bold">Gen 5 (PCIe 5.0)</h4>
                <p class="text-gray-400 text-sm">Velocidade ~12000 MB/s. Esquentam MUITO (precisam de cooler). Só vale para editores de vídeo 8K profissionais. Desperdício de dinheiro para gamer hoje.</p>
            </div>
        </div>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "DirectStorage: O Futuro",
            content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-white font-bold mb-4 text-xl">Adeus telas de loading</h4>
                <p class="text-gray-300 mb-4">
                    DirectStorage é uma tecnologia que permite a placa de vídeo carregar texturas direto do SSD NVMe, sem passar pela CPU. Isso promete jogos com loading zero.
                </p>
                <p class="text-gray-300 text-sm">
                    Para usar isso, você precisa de um NVMe (SATA não serve) e Windows 11. Jogos como <em>Forspoken</em> e <em>Ratchet & Clank</em> já usam.
                </p>
            </div>
            `
        }
    ];

    const additionalContentSections = [
        {
            title: "Migrar Windows (Clonagem)",
            content: `
            <p class="mb-4 text-gray-300">
                Você não precisa formatar para trocar de disco. Use o software <strong>Macrium Reflect Free</strong> ou <strong>DiskGenius</strong> para clonar seu HD velho para o SSD novo. Ele copia tudo: Windows, arquivos, papel de parede. Tudo igual.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Desfragmentar SSD?",
            answer: "NUNCA! Desfragmentar (Defrag) serve para organizar dados fisicamente no disco magnético do HD. No SSD, isso gasta ciclos de escrita inulmente e diminui a vida útil. O Windows sabe disso e, ao invés de desfragmentar, ele faz o 'Otimizar' (TRIM)."
        },
        {
            question: "SSD cheio fica lento?",
            answer: "Sim. SSDs precisam de espaço livre para mover dados temporários. Tente deixar sempre 10% a 20% do espaço livre. Um SSD lotado até o talo pode ficar mais lento que um HD."
        }
    ];

    const externalReferences = [
        { name: "DiskGenius (Clonagem)", url: "https://www.diskgenius.com/" },
        { name: "Macrium Reflect Free (Trial)", url: "https://www.macrium.com/reflectfree" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Otimizar SSD",
            description: "Passos técnicos pós-instalação."
        },
        {
            href: "/guias/verificar-saude-hd-ssd-crystaldiskinfo",
            title: "Saúde do Disco",
            description: "Como saber se o SSD é original e novo."
        },
        {
            href: "/guias/instalacao-windows-11",
            title: "Formatar",
            description: "Se preferir instalar do zero no SSD novo."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            externalReferences={externalReferences}
        />
    );
}
