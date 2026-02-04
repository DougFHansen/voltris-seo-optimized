import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Minecraft Lento: Como ganhar FPS em qualquer PC em 2026";
const description = "Seu Minecraft está rodando como um slide? Aprenda a otimizar o Windows e o Java para rodar o Minecraft liso, mesmo em computadores e notebooks antigos.";
const keywords = [
    'minecraft lento como ganhar fps guia 2026',
    'como tirar lag do minecraft pc ultra fraco',
    'configurações de video minecraft para mais fps tutorial',
    'minecraft travando no windows 11 como resolver',
    'melhores argumentos java minecraft performance 2026'
];

export const metadata: Metadata = createGuideMetadata('minecraft-lento-como-ganhar-fps', title, description, keywords);

export default function MinecraftSlowFixGuide() {
    const summaryTable = [
        { label: "Prioridade Java", value: "Alta (Gerenciador de Tarefas)" },
        { label: "Alcance Visual", value: "6-8 Chunks (Ideal para PC Fraco)" },
        { label: "Driver de Video", value: "Deve estar sempre atualizado" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "Por que o Minecraft 'engasga' tanto?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Embora seja feito de quadrados, o **Minecraft** é um dos jogos mais pesados para o processador (CPU) em 2026. Isso acontece porque o jogo processa milhões de blocos ao mesmo tempo em um mundo infinito. Se o seu jogo está "em câmera lenta", o problema geralmente não é a placa de vídeo, mas sim o processador tentando calcular a inteligência artificial dos mobs e a luz dos blocos.
        </p>
      `
        },
        {
            title: "1. As Configurações de Vídeo 'Assassinas'",
            content: `
        <p class="mb-4 text-gray-300">Dentro das opções de vídeo, ajuste estes itens para um ganho imediato:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Alcance de Renderização (Render Distance):</strong> Não use mais que 8. É a opção que mais pesa.</li>
            <li><strong>Gráficos:</strong> Mude de 'Fabulosos' para 'Rápidos'. Isso retira efeitos de transparência que pesam na GPU.</li>
            <li><strong>Iluminação Suave:</strong> Desligue. Faz os blocos parecerem mais "quadrados", mas salva muitos frames.</li>
            <li><strong>Partículas:</strong> Mude para 'Mínimas'. Em explosões ou farms de XP, isso evita que seu PC trave.</li>
        </ul >
      `
        },
        {
            title: "2. O truque do Processo Java",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Foco Total:</h4>
            <p class="text-sm text-gray-300">
                1. Com o jogo aberto, dê <strong>Alt + Tab</strong>. <br/>
                2. Abra o Gerenciador de Tarefas > Detalhes. <br/>
                3. Encontre o <code>javaw.exe</code> (ou <code>Minecraft.exe</code> se estiver usando uma versão moderna). <br/>
                4. Botão direito > Definir Prioridade > <strong>Alta</strong>. <br/>
                Isso força o Windows a dar prioridade para os cálculos do Minecraft antes de qualquer tarefa de fundo do sistema.
            </p>
        </div>
      `
        },
        {
            title: "3. Minecraft no SSD é Obrigatório",
            content: `
        <p class="mb-4 text-gray-300">
            Se você sente que o jogo trava apenas quando você caminha pelo mapa (loading de novos pedaços do mundo), o problema é o seu HD. 
            <br/><br/>Em 2026, rodar Minecraft em um disco rígido mecânico causa o famoso "Lag de Chunk". Mova a pasta <code>.minecraft</code> para o seu SSD. A velocidade de leitura fará com que o mundo carregue instantaneamente, eliminando aquelas travadas chatas de 2 segundos durante a exploração.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/minecraft-alocar-mais-ram",
            title: "Alocar mais RAM",
            description: "Dê fôlego para o Java trabalhar."
        },
        {
            href: "/guias/minecraft-aumentar-fps-fabric-sodium",
            title: "Sodium e Fabric",
            description: "Os melhores mods de performance."
        },
        {
            href: "/guias/otimizacao-performance",
            title: "Otimizar Sistema",
            description: "Ajuste o Windows para jogos pesados."
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
