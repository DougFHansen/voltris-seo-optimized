import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "CPU Core Parking: Como desativar para ganhar FPS (2026)";
const description = "Seu processador está 'dormindo' enquanto você joga? Aprenda como desativar o Core Parking no Windows 11 e estabilizar seus frames em 2026.";
const keywords = [
    'como desativar cpu core parking 2026 tutorial',
    'unpark cpu cores performance games guia',
    'estabilizar fps windows 11 tutorial 2026',
    'melhorar tempo de resposta processador jogos guia',
    'cpu cores parking manager tutorial como usar'
];

export const metadata: Metadata = createGuideMetadata('unpark-cpu-cores-performance-jogos', title, description, keywords);

export default function CoreParkingGuide() {
    const summaryTable = [
        { label: "O que é", value: "Recurso de economia que desliga núcleos da CPU" },
        { label: "Efeito em Jogos", value: "Causa micro-stuttering (travadinhas)" },
        { label: "Solução", value: "Mudar esquema de energia para Alto Desempenho" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "Por que o Windows 'desliga' o seu Processador?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **Core Parking** é uma técnica de economia de energia onde o Windows 11 coloca núcleos inativos do processador em um estado de "dormência" profunda. Em 2026, com processadores tendo 16, 24 ou mais núcleos, isso acontece o tempo todo. O problema é que quando o jogo exige poder de fogo, o Windows leva alguns milissegundos para "acordar" os núcleos, o que gera aquelas travadinhas chatas (stuttering) durante a partida.
        </p>
      `
        },
        {
            title: "1. Desativando via Plano de Energia",
            content: `
        <p class="mb-4 text-gray-300">A forma mais segura sem usar programas externos:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Pesquise por 'Escolher um plano de energia' no menu Iniciar.</li>
            <li>Selecione o plano <strong>Desempenho Máximo</strong> (ou Alto Desempenho).</li>
            <li>Se o Desempenho Máximo não aparecer, abra o PowerShell como Admin e cole: <code>powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61</code>.</li>
            <li>Ao ativar este modo, o Windows 11 reduz agressivamente o core parking, mantendo os núcleos prontos para ação.</li>
        </ol>
      `
        },
        {
            title: "2. Usando o QuickCPU ou Unpark-CPU",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Controle Total:</h4>
            <p class="text-sm text-gray-300">
                Se você quer garantir que 100% dos núcleos fiquem ativos: <br/><br/>
                - Baixe o <strong>QuickCPU</strong> (ferramenta padrão em 2026). <br/>
                - Na parte inferior, você verá a barra 'Core Parking'. Arraste para <strong>100%</strong> (Indicates Index). <br/>
                - Faça o mesmo com 'Frequency Scaling' e 'Turbo Boost'. <br/>
                - Clique em Apply. Agora todos os seus núcleos estarão acordados e rodando na frequência máxima permitida pelo clock base.
            </p>
        </div>
      `
        },
        {
            title: "3. Aviso: Notebooks e Temperatura",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Vale a pena para todos?</strong> 
            <br/><br/>Se você usa um Notebook e ele não está na tomada, desativar o Core Parking vai acabar com a sua bateria em tempo recorde. Além disso, em 2026, manter todos os núcleos ativos gera mais calor. Use esta técnica apenas se o seu processador tem temperaturas estáveis e se você busca a **perfeição na estabilidade do Frametime** em jogos competitivos.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/modo-de-jogo-windows-atikvar-ou-nao",
            title: "Modo de Jogo",
            description: "Combine com o Unpark para mais FPS."
        },
        {
            href: "/guias/micro-stuttering-em-jogos-causas",
            title: "Micro-stuttering",
            description: "Entenda outras causas de travadas."
        },
        {
            href: "/guias/otimizacoes-para-notebook-gamer",
            title: "Notebook Gamer",
            description: "Dicas de energia para portáteis."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
