import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Problemas no Sensor do Mouse: Como resolver a Mira 'Pulando' (2026)";
const description = "Seu mouse gamer está dando 'pixel skip' ou a mira trava do nada? Aprenda a limpar o sensor e configurar o LOD e o Polling Rate em 2026.";
const keywords = [
    'mouse gamer mira pulando como resolver 2026',
    'limpar sensor de mouse gamer tutorial 2026',
    'polling rate 4000hz travando jogos tutorial',
    'o que é lod mouse gamer como configurar 2026',
    'mouse skipping pixels fix windows 11 guia'
];

export const metadata: Metadata = createGuideMetadata('problemas-mouse-gamer-sensor', title, description, keywords);

export default function MouseSensorGuide() {
    const summaryTable = [
        { label: "Causa #1", value: "Sujeira ou Pelo no Prisma do Sensor" },
        { label: "Causa #2", value: "Polling Rate alto demais para a CPU" },
        { label: "Polling Rate", value: "1000Hz (Padrão) / 4000Hz+ (Entusiasta)" },
        { label: "Dificuldade", value: "Iniciante" }
    ];

    const contentSections = [
        {
            title: "Por que o Mouse falha no momento decisivo?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, os mouses gamers atingiram resoluções absurdas de 30.000 DPI e taxas de atualização de 8.000Hz. No entanto, quanto mais sensível o sensor, mais fácil é para uma **única partícula de poeira** ou um **fio de cabelo** atrapalhar a leitura do laser. Se a sua mira está "pulando" ou se o mouse para de responder por um milissegundo, o problema pode ser tanto físico quanto uma configuração de software incompatível.
        </p>
      `
        },
        {
            title: "1. A Limpeza de Precisão",
            content: `
        <p class="mb-4 text-gray-300">Não assopre o sensor! Isso pode piorar as coisas:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Use um <strong>cotonete levemente umedecido</strong> com álcool isopropílico (ou apenas seco, se a poeira for visível).</li>
            <li>Passe suavemente no espelho do sensor na parte de baixo do mouse.</li>
            <li>Verifique o seu mousepad. Sensores modernos de 2026 são muito exigentes; manchas de gordura ou fibras soltas no pad podem fazer o mouse "se perder" na leitura.</li>
        </ol>
      `
        },
        {
            title: "2. O Perigo dos 4.000Hz / 8.000Hz",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Gargalo de CPU:</h4>
            <p class="text-sm text-gray-300">
                Mouses ultra modernos de 2026 permitem o **Polling Rate** acima de 1000Hz. O problema é que isso exige que seu processador leia a posição do mouse 4 mil ou 8 mil vezes por segundo. <br/><br/>
                Se o seu processador não for de última geração, usar 4000Hz causará <strong>quedas bruscas de FPS</strong> nos jogos toda vez que você mexer o mouse rápido. Se o seu jogo está travando, diminua o Polling Rate para 1000Hz no software do mouse; a diferença na mira é imperceptível, mas a estabilidade do jogo será muito maior.
            </p>
        </div>
      `
        },
        {
            title: "3. LOD: Lift-Off Distance",
            content: `
        <p class="mb-4 text-gray-300">
            Se o mouse para de funcionar toda vez que você o levanta um pouco da mesa:
            <br/><br/><strong>Dica:</strong> No software do seu mouse (G-Hub, Synapse, etc), procure por <strong>LOD</strong>. Se estiver no 'Baixo', o sensor desliga quase encostado no pad. Aumente para 'Médio' ou 'Alto' se você tem o hábito de reposicionar o mouse levantando-o com frequência. Isso evita as falhas de rastreio durante movimentos bruscos de mira.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/mousepad-speed-vs-control",
            title: "Escolher Mousepad",
            description: "Melhore a leitura do seu sensor."
        },
        {
            href: "/guias/mouse-clique-duplo-falhando-fix",
            title: "Clique Duplo",
            description: "Resolva problemas nos botões."
        },
        {
            href: "/guias/perifericos-gamer-vale-a-pena-marcas",
            title: "Marcas de Mouse",
            description: "Quais marcas têm os melhores sensores."
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
