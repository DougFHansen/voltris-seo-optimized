import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'mouse-clique-duplo-falhando-fix',
  title: "Mouse com Clique Duplo ou Falhando? Como consertar sem gastar",
  description: "Seu mouse está clicando sozinho ou falhando ao arrastar? Aprenda a resolver problemas de 'Double Click' com software e limpeza física simples.",
  category: 'games-fix',
  difficulty: 'Intermediário',
  time: '20 min'
};

const title = "Mouse com Clique Duplo ou Falhando? Como consertar sem gastar";
const description = "Seu mouse está clicando sozinho ou falhando ao arrastar? Aprenda a resolver problemas de 'Double Click' com software e limpeza física simples.";
const keywords = [
    'como consertar mouse clique duplo software fix',
    'mouse falhando o clique ao arrastar como resolver',
    'limpar switch de mouse com alcool isopropilico',
    'mouse gamer logitech double click fix 2026',
    'ajustar debounce time mouse para parar clique duplo'
];

export const metadata: Metadata = createGuideMetadata('mouse-clique-duplo-falhando-fix', title, description, keywords);

export default function MouseFixGuide() {
    const summaryTable = [
        { label: "Causa Principal", value: "Oxidação ou Desgaste do Switch" },
        { label: "Solução Software", value: "Aumentar Debounce Time" },
        { label: "Solução Física", value: "Limpeza com Álcool Isopropílico" },
        { label: "Dificuldade", value: "Fácil a Média" }
    ];

    const contentSections = [
        {
            title: "O que é o Clique Duplo?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O erro de **Clique Duplo** é quando você aperta o botão uma vez, mas o computador registra dois cliques. Isso acontece devido à "fadiga de metal" dentro do pequeno interruptor (switch) do mouse ou por causa de poeira e eletricidade estática acumulada. Antes de jogar seu mouse gamer caro no lixo, tente estas soluções.
        </p>
      `
        },
        {
            title: "1. A Solução do 'Clique Estático' (O Truque da Respiração)",
            content: `
        <p class="mb-4 text-gray-300">Muitas vezes, o erro é causado por energia estática acumulada no plástico. Tente isso:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Desconecte o mouse do PC (ou remova a pilha se for sem fio).</li>
            <li>Clique repetidamente e com força moderada em todos os botões por 60 segundos.</li>
            <li>Dê um "sopro" quente com a boca nas frestas do botão (a umidade ajuda a dissipar a estática).</li>
            <li>Reconecte e teste. Parece mágica, mas resolve 30% dos casos temporariamente.</li>
        </ol>
      `
        },
        {
            title: "2. Ajuste de Debounce Time (Software)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Pulo do Gato para Gamers:</h4>
            <p class="text-sm text-gray-300">
                Se você tem um mouse da Logitech, Razer, Glorious ou Redragon, abra o software da marca. Procure pela opção <strong>'Debounce Time'</strong>. Aumente este valor (ex: de 4ms para 12ms). Isso faz com que o Windows ignore cliques fantasmas que acontecem muito rápido, "filtrando" o clique duplo eletronicamente.
            </p>
        </div>
      `
        },
        {
            title: "3. Limpeza com Álcool Isopropílico",
            content: `
        <p class="mb-4 text-gray-300">
            Se você tiver coragem de abrir o mouse: 
            <br/>Pingue uma gota minúscula de <strong>Álcool Isopropílico 99%</strong> dentro do botão branco/preto do switch. Clique nele várias vezes para o álcool entrar e limpar a oxidação interna. Espere secar por 10 minutos antes de ligar. Isso costuma restaurar o mouse para o estado de novo.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/diagnostico-hardware",
            title: "Diagnóstico Hardware",
            description: "Saiba se é bug de driver ou peça ruim."
        },
        {
            href: "/guias/limpeza-fisica-pc-gamer",
            title: "Limpeza Física",
            description: "Outras dicas de limpeza de periféricos."
        },
        {
            href: "/guias/cs2-melhores-comandos-console-fps",
            title: "Performance CS2",
            description: "O clique duplo pode estragar seu spray no CS."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
