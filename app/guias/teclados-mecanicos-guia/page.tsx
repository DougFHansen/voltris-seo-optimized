import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Teclados Mecânicos em 2026: O que saber antes de comprar";
const description = "Quer entrar no mundo dos teclados mecânicos? Conheça as novas tecnologias de 2026, como Rapid Trigger, Hall Effect e teclados Hot-swappable.";
const keywords = [
  'guia teclados mecanicos 2026 o que saber',
  'melhor teclado mecanico custo beneficio 2026 guia',
  'o que é rapid trigger teclado mecanico tutorial',
  'teclado mecanico hot swap vale a pena guia 2026',
  'como escolher teclado mecanico para jogos e trabalho'
];

export const metadata: Metadata = createGuideMetadata('teclados-mecanicos-guia', title, description, keywords);

export default function MechanicalKeyboardGuide() {
  const summaryTable = [
    { label: "Tecnologia do Ano", value: "Switches Magnéticos (Hall Effect)" },
    { label: "Recurso Essencial", value: "Hot-swap (Troca de switches sem solda)" },
    { label: "Construção", value: "Gasket Mount (Mais conforto e som melhor)" },
    { label: "Dificuldade", value: "Fácil" }
  ];

  const contentSections = [
    {
      title: "O Padrão dos Teclados em 2026",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, o teclado mecânico deixou de ser apenas um "dispositivo barulhento" para se tornar uma peça de engenharia altamente personalizada. A grande mudança foi a democratização dos switches magnéticos e das estruturas que priorizam a acústica (thock!), transformando a digitação em uma experiência prazerosa tanto para trabalho quanto para jogos competitivos de alto nível.
        </p>
      `
    },
    {
      title: "1. Switches Magnéticos e Rapid Trigger",
      content: `
        <p class="mb-4 text-gray-300">A maior inovação para gamers em 2026:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Hall Effect:</strong> Ao contrário dos switches comuns (que usam contato metálico), esses usam ímãs. Isso permite que você ajuste o ponto de ativação da tecla (ex: a tecla registra ao apertar apenas 0.1mm).</li>
            <li><strong>Rapid Trigger:</strong> Permite que o comando pare no exato momento em que você começa a levantar o dedo. Em jogos como Valorant, isso permite que o personagem pare instantaneamente para atirar com precisão.</li>
        </ul >
      `
    },
    {
      title: "2. A importância do Hot-swap",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Manutenção Fácil:</h4>
            <p class="text-sm text-gray-300">
                Nunca compre um teclado mecânico que não seja <strong>Hot-swappable</strong> em 2026. <br/><br/>
                Esta tecnologia permite que você remova um switch com defeito e coloque um novo em segundos, sem precisar de ferro de solda. Além disso, permite que você personalize o seu teclado, colocando switches silenciosos nas teclas de letras e switches barulhentos no Espaço, por exemplo. Isso aumenta a vida útil do produto para décadas.
            </p>
        </div>
      `
    },
    {
      title: "3. Formatos: Do 100% ao 60%",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>Qual tamanho escolher?</strong> <br/>
            - <strong>Full Size (100%):</strong> Se você trabalha muito com números (Excel). <br/>
            - <strong>TKL (80%):</strong> Sem o teclado numérico, ideal para ganhar espaço para o mouse. <br/>
            - <strong>60% ou 65%:</strong> Ultra compactos, favoritos dos gamers. <br/><br/>
            <strong>Dica:</strong> Para a maioria dos usuários em 2026, o formato <strong>75%</strong> é o campeão de produtividade, pois mantém as setas e as teclas F, mas ocupa muito menos espaço que o padrão.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/teclados-mecanicos-switches-guia",
      title: "Guia de Switches",
      description: "Conheça as cores e sons dos switches."
    },
    {
      href: "/guias/mousepad-speed-vs-control",
      title: "Mousepads",
      description: "Complete o seu setup periférico."
    },
    {
      href: "/guias/teclado-mecanico-vs-membrana-qual-o-melhor",
      title: "Mecânico vs Membrana",
      description: "Entenda por que o mecânico vence."
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
