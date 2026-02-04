import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Calibrar a Bateria do Notebook em 2026 (Fix Porcentagem)";
const description = "Seu notebook desliga do nada mesmo marcando 20%? Aprenda a calibrar a bateria para ter uma leitura precisa de quanto tempo de carga você ainda tem.";
const keywords = [
    'como calibrar bateria notebook windows 11 2026',
    'notebook desliga sozinho com carga como resolver',
    'calibração de bateria passo a passo tutorial',
    'bateria notebook viciada ou descalibrada guia 2026',
    'resetar contador de bateria windows 11 tutorial'
];

export const metadata: Metadata = createGuideMetadata('calibrar-bateria-notebook', title, description, keywords);

export default function BatteryCalibrationGuide() {
    const summaryTable = [
        { label: "Sintoma", value: "Desligamento súbito em 10% ou 20%" },
        { label: "O que faz", value: "Sincroniza o sensor de carga com a química real" },
        { label: "Frequência", value: "Uma vez a cada 3 meses" },
        { label: "Dificuldade", value: "Médio" }
    ];

    const contentSections = [
        {
            title: "Por que a bateria "mente"?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Com o passar do tempo em 2026, o sensor digital que mede a carga da bateria (Fuel Gauge) pode perder o sincronismo com a capacidade química real das células. Isso faz com que o Windows ache que você ainda tem 15% de bateria, quando na verdade ela já está no fim, causando o desligamento repentino do notebook. A **calibração** não recupera uma bateria morta, mas faz com que a porcentagem mostrada seja real.
        </p>
      `
        },
        {
            title: "1. Passo a Passo do Ciclo Completo",
            content: `
        <p class="mb-4 text-gray-300">Siga este procedimento para resetar o sensor:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Carregue o notebook até <strong>100%</strong> e deixe-o ligado na tomada por mais 2 horas para garantir a carga total.</li>
            <li>Desconecte o carregador e use o aparelho até que ele descarregue completamente e desligue sozinho.</li>
            <li><strong>Importante:</strong> Deixe o notebook desligado e sem carga por cerca de 3 a 5 horas.</li>
            <li>Conecte o carregador e deixe-o carregar ininterruptamente até 100% novamente.</li>
            <li>Agora o Windows terá os novos pontos de referência (0% e 100%) sincronizados.</li>
        </ol>
      `
        },
        {
            title: "2. Preparando o Windows para a Calibração",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Ajuste de Energia:</h4>
            <p class="text-sm text-gray-300">
                Para que o notebook não hiberne antes da hora no passo 2, vá em Opções de Energia > Alterar configurações do plano. <br/><br/>
                Certifique-se de que a opção de 'Hibernar' em bateria esteja marcada como **'Nunca'**. Isso permite que as células de íon-lítio descarreguem até o limite seguro configurado pelo hardware, e não pelo software do Windows.
            </p>
        </div>
      `
        },
        {
            title: "3. Quando a calibração não resolve?",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Dica de 2026:</strong> 
            <br/><br/>Se mesmo após calibrar, o seu notebook continua durando apenas 30 minutos, o problema é o desgaste físico das células (degradação). Use o nosso guia de 'Verificar Saúde da Bateria' para ver o nível de desgaste. Se a capacidade de carga total for menor que 50% da original, a calibração não ajudará mais: você precisará substituir a bateria fisicamente.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/saude-bateria-notebook",
            title: "Verificar Saúde",
            description: "Gere o relatório de bateria do Windows."
        },
        {
            href: "/guias/otimizacoes-para-notebook-gamer",
            title: "Otimizar Notebook",
            description: "Dicas para a bateria durar mais no dia a dia."
        },
        {
            href: "/guias/hibernacao-vs-suspensao-qual-o-melhor",
            title: "Hibernação vs Suspensão",
            description: "Entenda como economizar carga."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="6 horas"
            difficultyLevel="Médio"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
