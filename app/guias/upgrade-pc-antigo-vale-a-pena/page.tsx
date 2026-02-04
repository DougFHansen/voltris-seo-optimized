import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Upgrade em PC Antigo: Ainda vale a pena em 2026?";
const description = "Seu PC de 5 anos atrás está lento? Descubra quais componentes valem o upgrade e quando é melhor economizar para um computador novo em 2026.";
const keywords = [
    'vale a pena fazer upgrade em pc antigo 2026',
    'melhorar desempenho pc velho tutorial 2026',
    'upgrade ssd e ram pc antigo vale a pena guia',
    'gargalo de processador em pc antigo como resolver 2026',
    'transformar pc de escritorio em gamer 2026 guia'
];

export const metadata: Metadata = createGuideMetadata('upgrade-pc-antigo-vale-a-pena', title, description, keywords);

export default function OldPCUpgradeGuide() {
    const summaryTable = [
        { label: "Upgrade Vital", value: "SSD (Sair do HD é obrigatório)" },
        { label: "Upgrade Barato", value: "Memória RAM (Mínimo 16GB)" },
        { label: "O Bottleneck", value: "Processadores com menos de 4 núcleos" },
        { label: "Veredito 2026", value: "Upgrade em CPUs pré-2018 raramente vale a pena" }
    ];

    const contentSections = [
        {
            title: "A Vida Útil de um Computador",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, a tecnologia avançou de tal forma que o Windows 11 exige requisitos mínimos que muitos PCs de 7 ou 8 anos atrás não conseguem entregar nativamente (como o TPM 2.0). Antes de gastar dinheiro em uma placa de vídeo nova ou mais memória, você precisa entender se a base do seu PC (Placa-mãe e Processador) ainda aguenta o tranco das exigências modernas ou se você está apenas "adiando o inevitável".
        </p>
      `
        },
        {
            title: "1. O Trio Milagroso: SSD, RAM e Pasta Térmica",
            content: `
        <p class="mb-4 text-gray-300">Se você quer dar sobrevida a um PC de 2019 a 2022:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>SSD SATA:</strong> Se o seu PC ainda usa HD, colocar um SSD é o upgrade com maior "sentimento" de velocidade. O PC passa a ligar em 15 segundos em vez de 2 minutos.</li>
            <li><strong>RAM:</strong> Se você tem 8GB, pular para 16GB em Dual Channel resolve 90% das travadas em navegação e jogos leves.</li>
            <li><strong>Limpeza Físicia:</strong> Muitas vezes o "PC antigo" está apenas sofrendo com calor. Trocar a pasta térmica seca pode devolver a performance original do processador.</li>
        </ul >
      `
        },
        {
            title: "2. O Gargalo (Bottleneck) de 2026",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Cuidado com GPUs Modernas:</h4>
            <p class="text-sm text-gray-300">
                O erro mais comum é colocar uma RTX 4060 em um processador Intel de 4ª ou 7ª geração. O processador não conseguirá enviar dados rápido o suficiente para a placa de vídeo, resultando em um uso de GPU de apenas 30% e FPS baixo com muitas travadas. Em 2026, se o seu processador tem menos de 6 núcleos físicos (12 threads), ele será o limitador para qualquer placa de vídeo moderna.
            </p>
        </div>
      `
        },
        {
            title: "3. Quando desistir do upgrade?",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Hora de comprar um novo se:</strong>
            <br/><br/>
            - Suas memórias ainda são <strong>DDR3</strong>. <br/>
            - Sua placa-mãe não tem slot para <strong>M.2 NVMe</strong>. <br/>
            - Você precisa comprar Fonte, Gabinete e Placa de Vídeo ao mesmo tempo. <br/><br/>
            Em 2026, plataformas modernas (como o socket AM5 da AMD) garantem que você possa fazer upgrades pelos próximos 5 anos. Investir em plataformas mortas (como Intel de 9ª geração ou inferior) é dinheiro jogado fora a longo prazo.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/pc-gamer-barato-custo-beneficio-2026",
            title: "PC Barato 2026",
            description: "Melhores peças para um PC novo."
        },
        {
            href: "/guias/ssd-vs-hd-qual-melhor",
            title: "SSD vs HD",
            description: "O primeiro upgrade obrigatório."
        },
        {
            href: "/guias/upgrade-memoria-ram",
            title: "Upgrade RAM",
            description: "Dicas para não errar na frequência."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
