import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideMetadata';

const title = "Hibernação vs Suspensão: Qual o melhor para o seu PC? (2026)";
const description = "Você desliga o PC toda noite ou apenas fecha a tampa? Aprenda a diferença entre Hibernar e Suspender e descubra qual modo preserva mais o seu hardware.";
const keywords = [
    'diferença hibernação vs suspensão windows 11 2026',
    'desligar o pc ou suspender toda noite o que é melhor',
    'como desativar hibernação windows para economizar espaço',
    'modo suspensão gasta muita energia tutorial',
    'hibernação estraga o ssd ou hd guia 2026'
];

export const metadata: Metadata = createGuideMetadata('hibernacao-vs-suspensao-qual-o-melhor', title, description, keywords);

export default function HibernationGuide() {
    const summaryTable = [
        { label: "Suspensão", value: "Rápida / Mantém dados na RAM / Consome pouca energia" },
        { label: "Hibernação", value: "Lenta / Salva dados no disco / Consome zero energia" },
        { label: "Desligar", value: "Limpa a memória / Inicia o sistema do zero" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "Dormir ou Desligar?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, com o Windows 11 e os SSDs ultra rápidos, a pergunta "devo desligar o PC?" tem uma resposta técnica complexa. Muita gente confunde os modos de baixo consumo energética, mas a escolha errada pode fazer você perder trabalho não salvo ou até desgastar seu SSD desnecessariamente. Vamos entender o que acontece por baixo do capô.
        </p>
      `
        },
        {
            title: "1. Suspensão (Sleep): Voltando em 1 Segundo",
            content: `
        <p class="mb-4 text-gray-300">Quando você suspende o PC, ele entra em um estado de baixo consumo:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Como funciona:</strong> O Windows mantém os programas abertos na memória RAM. Como a RAM precisa de energia para segurar os dados, o PC continua consumindo uma pequena faísca de eletricidade.</li>
            <li><strong>Ideal para:</strong> Pausas curtas durante o dia (até 2 ou 3 horas).</li>
            <li><strong>Risco:</strong> Se houver uma queda de energia repentina, você perde o que não foi salvo, pois a RAM "esquece" tudo sem energia.</li>
        </ul>
      `
        },
        {
            title: "2. Hibernação: O Sono Profundo",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Puro silêncio:</h4>
            <p class="text-sm text-gray-300">
                A <strong>Hibernação</strong> tira tudo da RAM e escreve um arquivo gigante no seu SSD chamado <code>hiberfil.sys</code>, e então desliga o PC totalmente. <br/><br/>
                - <strong>Prós:</strong> Você pode tirar o notebook da tomada por 1 mês e, ao ligar, ele voltará exatamente onde você parou. <br/>
                - <strong>Contras:</strong> Escrever 16GB ou 32GB de dados no SSD toda vez que você fecha a tampa gera um desgaste (escrita) que, ao longo de anos, pode reduzir a vida útil do disco sólido.
            </p>
        </div>
      `
        },
        {
            title: "3. O "Início Rápido" do Windows (Dica de Ouro)",
            content: `
        <p class="mb-4 text-gray-300">
            Você sabia que quando você clica em "Desligar" no Windows 11, ele não desliga de verdade? 
            <br/><br/>Por padrão, o Windows usa o <strong>Fast Startup</strong>, que é uma hibernação parcial do kernel do sistema. Isso faz o PC ligar mais rápido, mas pode causar bugs estranhos se ficar meses sem um "Reiniciar" de verdade. Se o seu PC está apresentando lentidões aleatórias, clique em <strong>Reiniciar</strong> em vez de Desligar; isso força o Windows a realmente começar o sistema do zero.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Otimizar SSD",
            description: "Como desativar a hibernação para ganhar espaço."
        },
        {
            href: "/guias/saude-bateria-notebook",
            title: "Saúde Bateria",
            description: "Economize energia do jeito certo."
        },
        {
            href: "/guias/pc-lento-formatar-vs-limpar",
            title: "Lentidão Windows",
            description: "Por que reiniciar é melhor que desligar."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
