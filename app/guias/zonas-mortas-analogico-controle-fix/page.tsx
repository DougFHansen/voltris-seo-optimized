import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Drift no Controle? Como configurar Zonas Mortas (Deadzone) no PC";
const description = "Seu personagem anda sozinho ou a câmera mexe sem você tocar no controle? Aprenda a configurar zonas mortas no Windows e na Steam para corrigir o Drift.";
const keywords = [
    'como consertar drift analógico controle no pc 2026',
    'configurar zona morta controle steam tutorial 2026',
    'analógico mexendo sozinho no pc como resolver fix',
    'deadzone settings valorant fortnite cod controle',
    'testar drift controle online ferramenta gratis'
];

export const metadata: Metadata = createGuideMetadata('zonas-mortas-analogico-controle-fix', title, description, keywords);

export default function DeadzoneFixGuide() {
    const summaryTable = [
        { label: "O que é Drift", value: "Leitura de sinal quando o analógico está em repouso" },
        { label: "Solução Software", value: "Aumentar Deadzone (Zona Morta)" },
        { label: "Ferramenta de Teste", value: "Gamepad Tester (Site)" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "O pesadelo do Drift em 2026",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Seja em um controle de PS5, Xbox ou Nintendo Switch, o **Drift** é causado pelo desgaste físico dos potenciômetros do analógico. Eles começam a enviar pequenos sinais elétricos mesmo quando você não está tocando neles. No PC, temos a vantagem de poder "filtrar" esses sinais usando softwares de zona morta.
        </p>
      `
        },
        {
            title: "1. Como Testar seu Controle",
            content: `
        <p class="mb-4 text-gray-300">Antes de ajustar, você precisa ver a "sujeira" do sinal:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Acesse o site <strong>gamepad-tester.com</strong>.</li>
            <li>Conecte seu controle e mexa os analógicos.</li>
            <li>Solte-os. Veja os valores de 'Axis 0' a 'Axis 3'. Se eles não voltarem para 0.0000 e ficarem oscilando (ex: 0.057), você tem Drift.</li>
            <li>Anote o valor máximo da oscilação.</li>
        </ol>
      `
        },
        {
            title: "2. Configurando na Steam (Global)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Válido para todos os jogos:</h4>
            <p class="text-sm text-gray-300">
                1. Abra a <strong>Steam</strong> e vá em Configurações > Controle. <br/>
                2. Clique em 'Calibragem e Zonas Mortas'. <br/>
                3. Aumente o valor da 'Zona Morta' até que o ponto azul na tela pare de brilhar quando o controle estiver parado. <br/>
                Isso criará um "buraco negro" no centro do analógico onde o Windows ignorará qualquer movimento pequeno.
            </p>
        </div>
      `
        },
        {
            title: "3. Zonas Mortas dentro dos Jogos",
            content: `
        <p class="mb-4 text-gray-300">
            Jogos competitivos como <strong>Call of Duty, Fortnite e Valorant</strong> têm suas próprias configurações de deadzone. 
            <br/><br/><strong>Dica:</strong> Sempre tente manter a deadzone o menor possível para não perder a precisão. Se o seu drift é de 0.05, coloque a deadzone em 0.07. Não coloque em 0.20 de uma vez, ou o seu personagem parecerá "pesado" para começar a andar.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/mouse-clique-duplo-falhando-fix",
            title: "Consertar Mouse",
            description: "Dicas para outros tipos de drift de sinal."
        },
        {
            href: "/guias/pos-instalacao-windows-11",
            title: "Drivers de Controle",
            description: "Mantenha o firmware do controle atualizado."
        },
        {
            href: "/guias/diagnostico-hardware",
            title: "Diagnóstico",
            description: "Identifique falhas em outros periféricos."
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
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
