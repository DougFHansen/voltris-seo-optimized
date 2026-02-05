import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'overclock-gpu-msi-afterburner',
  title: "Overclock de GPU com MSI Afterburner: Guia Seguro (2026)",
  description: "Quer ganhar FPS extra de graça? Aprenda como usar o MSI Afterburner para fazer overclock na sua placa de vídeo com segurança total em 2026.",
  category: 'otimizacao',
  difficulty: 'Intermediário',
  time: '40 min'
};

const title = "Overclock de GPU com MSI Afterburner: Guia Seguro (2026)";
const description = "Quer ganhar FPS extra de graça? Aprenda como usar o MSI Afterburner para fazer overclock na sua placa de vídeo com segurança total em 2026.";
const keywords = [
    'como fazer overclock placa de video msi afterburner 2026',
    'msi afterburner tutorial passo a passo 2026',
    'ganhar fps com overclock gpu guia seguro',
    'overclock rtx 4060 msi afterburner tutorial',
    'configurar curva de ventoinha msi afterburner 2026'
];

export const metadata: Metadata = createGuideMetadata('overclock-gpu-msi-afterburner', title, description, keywords);

export default function GPUOverclockGuide() {
    const summaryTable = [
        { label: "Ferramenta", value: "MSI Afterburner (Oficial)" },
        { label: "Ganhos Estimados", value: "5% a 15% de FPS" },
        { label: "Risco", value: "Baixo (Se não mexer na voltagem)" },
        { label: "Dificuldade", value: "Intermediário" }
    ];

    const contentSections = [
        {
            title: "O que é o Overclock de GPU?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Fazer overclock significa aumentar a velocidade de operação da sua placa de vídeo para que ela processe quadros mais rapidamente. Em 2026, com o MSI Afterburner, esse processo é muito mais seguro do que era antigamente, pois as placas modernas possuem limitadores de energia que impedem que elas "queimem" por excesso de clock.
        </p>
      `
        },
        {
            title: "1. Preparação: O download correto",
            content: `
        <div class="bg-red-900/10 p-5 rounded-xl border border-red-500/30 mb-6">
            <p class="text-red-400 font-bold mb-2">Atenção ao Site Oficial!</p>
            <p class="text-sm text-gray-300">
                Em 2026, existem centenas de sites falsos do MSI Afterburner que instalam mineradores de vírus. Baixe **apenas** no domínio oficial <code>msi.com</code>.
            </p>
        </div>
        <p class="mb-4 text-gray-300">Antes de começar, tenha um benchmark aberto (como Unigine Heaven ou 3DMark) para testar a estabilidade.</p>
      `
        },
        {
            title: "2. Passo a Passo do Overclock",
            content: `
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li><strong>Core Clock:</strong> Aumente em passos de +25 MHz. Teste por 2 minutos no benchmark. Se não houver travamentos ou "riscos" na tela (artifacts), aumente mais 25.</li>
            <li><strong>Memory Clock:</strong> Garante maior largura de banda. Aumente em passos de +100 MHz.</li>
            <li><strong>Power Limit:</strong> Arraste o slider para o máximo. Isso permite que a placa use mais energia se precisar manter um clock alto.</li>
            <li><strong>Fan Curve:</strong> Clique no ícone de engrenagem > Ventoinha. Crie uma curva agressiva (ex: 70% de velocidade quando chegar a 70°C).</li>
        </ol>
      `
        },
        {
            title: "3. Identificando Instabilidade",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Como saber se exagerei?</strong> 
            <br/><br/>Se durante o jogo você notar flashes coloridos, texturas piscando ou se o driver de vídeo "resetar" (a tela pisca e volta para a área de trabalho), você atingiu o limite. Volte ao Afterburner e reduza os valores em 50 MHz. O segredo de um bom overclock em 2026 não é o valor mais alto, mas sim o valor mais alto que consegue rodar por horas sem nenhum erro.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/atualizacao-drivers-video",
            title: "Drivers de Vídeo",
            description: "Essencial para estabilidade no overclock."
        },
        {
            href: "/guias/testar-fonte-pc-multimetro",
            title: "Testar Fonte",
            description: "Garanta que sua fonte aguenta o consumo extra."
        },
        {
            href: "/guias/limitar-fps-rivatuner-nvidia",
            title: "RivaTuner (RTSS)",
            description: "Acompanhe o consumo e temperatura em tempo real."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="40 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
