import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Limpar seu PC Gamer Corretamente (Guia de Limpeza Física)";
const description = "Seu PC está cheio de poeira? Aprenda a limpar as ventoinhas, a placa de vídeo e o gabinete com segurança, usando as ferramentas certas para não queimar nada.";
const keywords = [
    'como limpar pc gamer por dentro 2026',
    'ferramentas para limpeza de pc gamer profissional',
    'como limpar placa de vídeo por dentro poeira',
    'limpeza de poeira pc gamer ar comprimido',
    'pc esquentando muito por causa de poeira fix'
];

export const metadata: Metadata = createGuideMetadata('limpeza-fisica-pc-gamer', title, description, keywords);

export default function PhysicalCleaningGuide() {
    const summaryTable = [
        { label: "Ferramenta Vital", value: "Pincel Antiestático ou Ar Comprimido" },
        { label: "O que NÃO usar", value: "Secador de cabelo quente ou pano úmido" },
        { label: "Frequência", value: "A cada 6 meses" },
        { label: "Dificuldade", value: "Média" }
    ];

    const contentSections = [
        {
            title: "A Poeira: O inimigo silencioso do FPS",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          A poeira atua como um "cobertor" térmico. Ela se acumula entre as aletas dos dissipadores de calor do processador e da placa de vídeo, impedindo que o ar fresco passe. Isso faz com que as temperaturas subam e o PC reduza o desempenho. Além disso, a poeira pode absorver umidade e causar **curto-circuito** em componentes sensíveis.
        </p>
      `
        },
        {
            title: "1. Preparação e Segurança",
            content: `
        <p class="mb-4 text-gray-300">Antes de abrir o gabinete, siga este protocolo:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Desligue o PC e <strong>remova o cabo da tomada</strong>.</li>
            <li>Segure o botão Power por 5 segundos para descarregar os capacitores da fonte.</li>
            <li>Toque em algo metálico aterrado (como a parte traseira sem pintura do gabinete) para descarregar sua eletricidade estática.</li>
            <li>Coloque o gabinete em uma superfície seca e bem iluminada.</li>
        </ol>
      `
        },
        {
            title: "2. Limpando as Ventoinhas (Fans)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Dica de Ouro:</h4>
            <p class="text-sm text-gray-300">
                Nunca deixe uma ventoinha "girar loucamente" ao usar ar comprimido ou soprador. Isso pode gerar energia elétrica (efeito dínamo) e queimar a placa-mãe. <strong>Segure a hélice com o dedo</strong> enquanto limpa as pás com o pincel ou ar.
            </p>
        </div>
      `
        },
        {
            title: "3. O que usar para uma limpeza profunda?",
            content: `
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Álcool Isopropílico (99%):</strong> Único líquido permitido para limpar contatos de memória RAM e placa de vídeo. Ele evapora instantaneamente e não contém água.</li>
            <li><strong>Limpa Contatos:</strong> Excelente para tirar oxidação dos slots da placa-mãe.</li>
            <li><strong>Pincel de Cerdas Macias:</strong> Use para tirar a poeira "grossa" dos filtros de ar na frente e embaixo do gabinete.</li>
        </ul >
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/importancia-pasta-termica-pc",
            title: "Pasta Térmica",
            description: "Aproveite a limpeza para trocar a pasta."
        },
        {
            href: "/guias/gabinete-gamer-airflow-importancia",
            title: "Airflow Gabinete",
            description: "Mantenha o ar circulando corretamente."
        },
        {
            href: "/guias/cable-management-organizacao-cabos-pc",
            title: "Cable Management",
            description: "Organize os cabos para facilitar a próxima limpeza."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="45 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
