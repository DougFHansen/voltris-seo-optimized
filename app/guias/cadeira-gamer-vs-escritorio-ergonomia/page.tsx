import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Cadeira Gamer vs Escritório: Qual a melhor para sua coluna? (2026)";
const description = "Sofrendo com dor nas costas? Descubra as principais diferenças entre cadeiras gamer e ergonômicas de escritório e qual escolher em 2026.";
const keywords = [
    'cadeira gamer vs escritório qual a melhor 2026',
    'melhor cadeira para dor nas costas guia 2026',
    'cadeira gamer vale a pena para trabalhar tutorial',
    'cadeira ergonomica de escritorio benefícios guia',
    'como escolher cadeira para pc setup 2026'
];

export const metadata: Metadata = createGuideMetadata('cadeira-gamer-vs-escritorio-ergonomia', title, description, keywords);

export default function ChairComparisonGuide() {
    const summaryTable = [
        { label: "Cadeira Gamer", value: "Estilo esportivo / Ajustes de inclinação exagerados" },
        { label: "Cadeira Escritório", value: "Foco em respiração (Mesh) / Suporte Lombar preciso" },
        { label: "Durabilidade", value: "Escritório (Standard) > Gamer (Espuma barata)" },
        { label: "Veredito 2026", value: "Trabalho/Estudo: Escritório | Estética: Gamer" }
    ];

    const contentSections = [
        {
            title: "O dilema do conforto em 2026",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, com o aumento do trabalho remoto e longas sessões de jogos competitivos, passamos mais de 8 horas sentados por dia. Escolher entre uma **Cadeira Gamer** (com visual de banco de carro de corrida) e uma **Cadeira de Escritório Ergonômica** não é apenas uma decisão estética, mas uma questão de saúde para a sua coluna a longo prazo.
        </p>
      `
        },
        {
            title: "1. Cadeira Gamer: Estilo e Imersão",
            content: `
        <p class="mb-4 text-gray-300">As cadeiras gamer são populares pela sua aparência chamativa:</p>
        <p class="text-sm text-gray-300">
            Elas geralmente permitem inclinar até 180 graus (ótimo para descansar) e possuem braços 3D ou 4D que se movem em várias direções. No entanto, muitas usam **espuma de baixa densidade** e revestimento de "couro" sintético que descasca rápido no clima quente do Brasil e não deixa a pele respirar, causando suor e desconforto após algumas horas.
        </p>
      `
        },
        {
            title: "2. Cadeira de Escritório: Ergonomia Pura",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">O Poder do Mesh:</h4>
            <p class="text-sm text-gray-300">
                Cadeiras ergonômicas de alta qualidade (como as de tela Mesh) em 2026 são projetadas para se adaptar à curvatura natural da sua lombar. Elas não tentam prender o seu corpo em um formato rígido de "concha", permitindo micro-movimentos que evitam a fadiga muscular. Além disso, a tela mesh permite a circulação de ar, sendo muito mais fresca para o uso diário.
            </p>
        </div>
      `
        },
        {
            title: "3. O que verificar antes de comprar?",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Checklist Vital:</strong> 
            <br/><br/>- <strong>Pistão:</strong> Garanta que é Classe 4 (suporta mais peso e dura mais). <br/>
            - <strong>Ajuste de Lombar:</strong> Deve ser ajustável em altura para alinhar com o fundo da sua coluna. <br/>
            - <strong>Base:</strong> Prefira bases de metal ou nylon reforçado a plástico simples. <br/>
            Em 2026, uma cadeira de R$ 1.500 ergonômica costuma oferecer muito mais saúde do que uma cadeira gamer de R$ 1.500 que foca apenas em luzes e cores.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/posicionamento-monitor-ergonomia",
            title: "Posicionar Monitor",
            description: "Evite dores no pescoço após a cadeira."
        },
        {
            href: "/guias/perifericos-gamer-vale-a-pena",
            title: "Periféricos Gamer",
            description: "Melhore seu conforto geral no setup."
        },
        {
            href: "/guias/montagem-pc-gamer-erros-comuns",
            title: "Erros de Montagem",
            description: "Organize seu espaço da forma correta."
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
