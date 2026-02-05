import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'undervolt-cpu-notebook',
  title: "Undervolt de CPU em Notebook: Como reduzir o calor (2026)",
  description: "Seu notebook ferve enquanto você joga? Aprenda como fazer undervolt na CPU para reduzir a temperatura em até 10°C sem perder performance em 2026.",
  category: 'hardware',
  difficulty: 'Intermediário',
  time: '45 min'
};

const title = "Undervolt de CPU em Notebook: Como reduzir o calor (2026)";
const description = "Seu notebook ferve enquanto você joga? Aprenda como fazer undervolt na CPU para reduzir a temperatura em até 10°C sem perder performance em 2026.";
const keywords = [
    'undervolt cpu notebook como fazer 2026 tutorial',
    'reduzir temperatura notebook gamer tutorial guia',
    'throttlestop tutorial como usar no notebook 2026',
    'undervolt intel core ultra notebook guia completo',
    'como acabar com o thermal throttling notebook 2026'
];

export const metadata: Metadata = createGuideMetadata('undervolt-cpu-notebook', title, description, keywords);

export default function UndervoltGuide() {
    const summaryTable = [
        { label: "O que é", value: "Reduzir a voltagem sem reduzir a velocidade" },
        { label: "Benefício #1", value: "Redução de Temperatura (até 15°C)" },
        { label: "Benefício #2", value: "Fim do Thermal Throttling (Quedas de FPS)" },
        { label: "Dificuldade", value: "Alta (Requer testes de estabilidade)" }
    ];

    const contentSections = [
        {
            title: "O calor: O inimigo do Notebook Gamer",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Notebooks gamers de 2026 são potentes, mas as leis da física não mudam. Ter um processador de 14 ou 24 núcleos em um espaço de 2cm gera um calor absurdo. Quando o processador chega a 95°C, ele entra em **Thermal Throttling**, derrubando sua velocidade pela metade para não derreter. O **Undervolt** consiste em encontrar a menor voltagem estável para o seu processador, fazendo-o consumir menos energia e gerar menos calor, mantendo o mesmo FPS.
        </p>
      `
        },
        {
            title: "1. Desbloqueando o Undervolt em 2026",
            content: `
        <p class="mb-4 text-gray-300">Atenção: A Intel e a AMD bloquearam o undervolt em muitos modelos recentes por segurança (Plundervolt):</p>
        <p class="text-sm text-gray-300">
            Antes de começar, verifique se o seu processador permite mudanças de voltagem. Em 2026, muitas fabricantes exigem que você ative uma opção como 'Overclocking Feature' na BIOS para que softwares como o <strong>ThrottleStop</strong> funcionem. Se as barras de voltagem estiverem cinzas (travadas), você precisará procurar se o seu modelo específico de notebook permite o desbloqueio via BIOS.
        </p>
      `
        },
        {
            title: "2. Usando o ThrottleStop (Passo a Passo)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Procedimento Seguro:</h4>
            <p class="text-sm text-gray-300">
                1. Abra o ThrottleStop e clique em <strong>FIVR</strong>. <br/>
                2. Marque 'Unlock Adjustable Voltage'. <br/>
                3. Em 'Offset Voltage', comece com <strong>-50mV</strong>. <br/>
                4. Aplique a mesma voltagem em 'CPU Core' e 'CPU Cache'. <br/>
                5. Aumente de 10 em 10 (ex: -60mV, -70mV) e rode um teste de stress. Se o PC congelar ou der tela azul, você atingiu o limite. Volte 10mV para trás e esse será o seu ponto ideal de performance.
            </p>
        </div>
      `
        },
        {
            title: "3. Por que isso não é perigoso?",
            content: `
        <p class="mb-4 text-gray-300">
            Diferente do Overclock (que aumenta a voltagem e o risco), o Undervolt **diminui** o estresse sobre o processador. 
            <br/><br/><strong>Dica:</strong> Em 2026, um processador que roda a 80°C durará muito mais anos do que um que trabalha constantemente a 100°C. O único "perigo" é o PC travar e reiniciar, mas isso não causa dano ao hardware e serve apenas como aviso de que você reduziu a voltagem demais.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacoes-para-notebook-gamer",
            title: "Otimizar Notebook",
            description: "Dicas de MUX Switch e RAM."
        },
        {
            href: "/guias/monitorar-temperatura-pc",
            title: "Monitorar Calor",
            description: "Acompanhe as temps enquanto testa."
        },
        {
            href: "/guias/pasta-windows-winsxs-gigante-como-limpar",
            title: "Limpeza de Sistema",
            description: "Mantenha o sistema leve para o processador."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="45 min"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
