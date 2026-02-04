import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Otimização para Notebook Gamer: Mais FPS e Frieza (2026)";
const description = "Seu notebook gamer esquenta muito ou trava em jogos? Aprenda técnicas de undervolt, limpeza e configurações de energia para 2026.";
const keywords = [
    'otimização notebook gamer 2026 guia',
    'como diminuir temperatura notebook gamer tutorial',
    ' Notebook gamer travando em jogos como resolver',
    'melhor plano de energia para notebook gamer 2026',
    'ganhar fps no notebook gamer tutorial passo a passo'
];

export const metadata: Metadata = createGuideMetadata('otimizacoes-para-notebook-gamer', title, description, keywords);

export default function LaptopGamingOptimizationGuide() {
    const summaryTable = [
        { label: "Check de Temperatura", value: "Ideal: 70°C - 85°C (Em carga)" },
        { label: "Vilão", value: "Modo Economia de Bateria ligado na tomada" },
        { label: "Dica de Ouro", value: "Elevar a traseira do notebook (Airflow)" },
        { label: "Dificuldade", value: "Médio" }
    ];

    const contentSections = [
        {
            title: "O desafio do calor em notebooks",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, os notebooks gamers estão mais potentes do que nunca, mas as leis da física não mudaram: componentes potentes em espaços pequenos geram calor extremo. Se o seu notebook atinge 95°C, ele entra em <strong>Thermal Throttling</strong>, cortando o desempenho pela metade para não derreter. Otimizar um notebook é, acima de tudo, gerenciar a temperatura.
        </p>
      `
        },
        {
            title: "1. O Erro da Bateria",
            content: `
        <p class="mb-4 text-gray-300">Jogar na bateria é o maior erro que você pode cometer:</p>
        <p class="text-sm text-gray-300">
            Notebooks gamers são projetados para entregar 100% de força apenas quando conectados à fonte (tomada). Na bateria, o sistema limita o clock da GPU e CPU para economizar energia, resultando em quedas fatais de FPS. <br/><br/>
            <strong>Configuração:</strong> Vá em Configurações > Sistema > Energia e suspensão. Garanta que, ao estar conectado, o modo seja <strong>"Melhor Desempenho"</strong>.
        </p>
      `
        },
        {
            title: "2. Elevação e Fluxo de Ar (Airflow)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">A Solução de 0 Reais:</h4>
            <p class="text-sm text-gray-300">
                A maioria dos notebooks gamers puxa ar frio pela parte de baixo. Se ele estiver colado na mesa, as ventoinhas não conseguem "respirar". <br/><br/>
                Apenas **elevar a parte traseira** do notebook em 2 ou 3 centímetros (usando um livro ou suporte) pode reduzir a temperatura em até 5°C imediatamente. Evite usar o notebook em superfícies macias como camas ou sofás, que bloqueiam totalmente as entradas de ar.
            </p>
        </div>
      `
        },
        {
            title: "3. Limpeza Interna em 2026",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>O pó é um isolante térmico:</strong> 
            <br/><br/>Se você tem seu notebook há mais de 6 meses, há uma grande chance de as saídas de ar estarem obstruídas por poeira. Em 2026, recomendamos o uso de ar comprimido para limpezas superficiais. Se a temperatura continuar alta mesmo após as otimizações de software, a troca da **pasta térmica** (por uma de alta qualidade como Liquid Metal ou PTM7950) é o próximo passo necessário.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/undervolt-cpu-notebook",
            title: "Guia de Undervolt",
            description: "A forma definitiva de baixar as temps."
        },
        {
            href: "/guias/saude-bateria-notebook",
            title: "Vida Útil Bateria",
            description: "Como fazer a bateria durar anos."
        },
        {
            href: "/guias/atualizacao-drivers-video",
            title: "Drivers Mobile",
            description: "Dicas específicas para GPUs de notebook."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Médio"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
