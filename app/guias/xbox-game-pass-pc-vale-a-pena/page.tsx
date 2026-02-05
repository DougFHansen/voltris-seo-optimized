import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'xbox-game-pass-pc-vale-a-pena',
  title: "Xbox Game Pass para PC: Vale a pena em 2026? (Análise)",
  description: "Será que o Xbox Game Pass ainda é o melhor custo-benefício para gamers em 2026? Analisamos o catálogo, preço e as vantagens do serviço.",
  category: 'windows-geral',
  difficulty: 'Intermediário',
  time: '15 min'
};

const title = "Xbox Game Pass para PC: Vale a pena em 2026? (Análise)";
const description = "Será que o Xbox Game Pass ainda é o melhor custo-benefício para gamers em 2026? Analisamos o catálogo, preço e as vantagens do serviço.";
const keywords = [
    'xbox game pass pc vale a pena 2026 guia',
    'lista de jogos game pass pc 2026 tutorial',
    'preço xbox game pass ultimate 2026 guia',
    'game pass vs compra individual de jogos 2026',
    'cloud gaming xbox pc vale a pena tutorial 2026'
];

export const metadata: Metadata = createGuideMetadata('xbox-game-pass-pc-vale-a-pena', title, description, keywords);

export default function GamePassValueGuide() {
    const summaryTable = [
        { label: "Preço Médio", value: "R$ 49,99 a R$ 59,99 (Ultimate)" },
        { label: "Catálogo", value: "+400 jogos (Incluindo lançamentos Day One)" },
        { label: "Diferencial", value: "Acesso total ao EA Play e Cloud Gaming" },
        { label: "Público", value: "Gamers que jogam +2 títulos novos por mês" }
    ];

    const contentSections = [
        {
            title: "O \"Netflix\" dos Videogames em 2026",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **Xbox Game Pass** revolucionou a forma como consumimos jogos. Em 2026, com os jogos AAA (lançamentos de ponta) custando frequentemente acima de R$ 350,00, a proposta de pagar uma mensalidade fixa para ter centenas de títulos à disposição parece tentadora. Porém, o serviço mudou: novos níveis de assinatura e a inclusão da Activision-Blizzard no catálogo transformaram o cenário.
        </p>
      `
        },
        {
            title: "1. Vantagens do 'Day One'",
            content: `
        <p class="mb-4 text-gray-300">A maior economia do Game Pass:</p>
        <p class="text-sm text-gray-300">
            A Microsoft continua com a política de lançar todos os seus jogos originais (Xbox Game Studios) no primeiro dia no serviço. Em 2026, isso inclui franquias como <strong>Call of Duty, Halo, Forza e Fable</strong>. Se você planeja jogar pelo menos dois desses grandes lançamentos por ano, o serviço já se paga apenas com a economia de não precisar comprar as licenças individuais. 
        </p>
      `
        },
        {
            title: "2. Xbox Cloud Gaming: Jogue sem PC Gamer",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Poder da Nuvem:</h4>
            <p class="text-sm text-gray-300">
                A assinatura Ultimate em 2026 permite que você jogue quase todo o catálogo via streaming. <br/><br/>
                Isso significa que você pode rodar jogos pesados em um notebook de escritório ou até no seu celular, sem precisar de uma placa de vídeo potente. Com a expansão dos servidores no Brasil, o lag reduziu drasticamente, tornando o Cloud Gaming uma opção real para quem não quer investir R$ 5.000 em hardware agora.
            </p>
        </div>
      `
        },
        {
            title: "3. Quando NÃO vale a pena?",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Nem tudo são flores:</strong> 
            <br/><br/>Se você é um jogador que se dedica a apenas um jogo pelo ano inteiro (como CS2, Valorant ou LoL), assinar o Game Pass é desperdício de dinheiro. Além disso, os jogos **não são seus**. Se você parar de pagar, perde o acesso. Para colecionadores que gostam de "ter" o jogo e jogar novamente após 5 anos, as promoções da Steam ainda podem ser um negócio melhor a longo prazo em 2026.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/xbox-app-nao-baixa-jogos-gamepass",
            title: "Corrigir Xbox App",
            description: "Resolva problemas se decidir assinar."
        },
        {
            href: "/guias/pc-gamer-barato-custo-beneficio-2026",
            title: "PC para Games",
            description: "Peças ideais para rodar o catálogo."
        },
        {
            href: "/guias/como-escolher-placa-de-video",
            title: "Escolher GPU",
            description: "Economize nos jogos para investir em hardware."
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
