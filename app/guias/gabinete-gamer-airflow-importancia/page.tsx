import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Airflow no Gabinete: Como gelar seu PC e evitar o Thermal Throttling";
const description = "Seu PC está esquentando demais e perdendo FPS? Aprenda a configurar o fluxo de ar (Airflow) correto com ventoinhas, pressão positiva e exaustão.";
const keywords = [
    'airflow gabinete de pc gamer tutorial 2026',
    'posição correta das ventoinhas gabinete pc',
    'pressão positiva vs negativa gabinete pc',
    'como reduzir temperatura processador e gpu case',
    'melhorar fluxo de ar pc gabinete fechado'
];

export const metadata: Metadata = createGuideMetadata('gabinete-gamer-airflow-importancia', title, description, keywords);

export default function AirflowGuide() {
    const summaryTable = [
        { label: "Check #1", value: "Ar Frio entra pela frente/baixo" },
        { label: "Check #2", value: "Ar Quente sai por trás/cima" },
        { label: "Pressão Ideal", value: "Positiva (Mais entrada que saída)" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "O que é Airflow e por que ele importa?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **Airflow** é a ciência de movimentar o ar dentro do seu PC. Se o ar quente ficar "preso" dentro do gabinete, as ventoinhas (fans) do seu processador e placa de vídeo só vão circular ar quente, fazendo as temperaturas subirem até o limite de segurança. Quando isso acontece, o PC reduz a velocidade (Thermal Throttling) para não queimar, e você sente as travadas no seu jogo.
        </p>
      `
        },
        {
            title: "1. A Posição das Ventoinhas",
            content: `
        <p class="mb-4 text-gray-300">Quase todas as ventoinhas sopram ar para o lado onde está a 'grade' ou o adesivo da fabricante. Siga a regra:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Frente e Baixo (Intake):</strong> Puxam ar frio de fora para dentro.</li>
            <li><strong>Atrás e Cima (Exhaust):</strong> Empurram o ar quente de dentro para fora.</li>
            <li><strong>Lembre-se:</strong> O ar quente sobe naturalmente. Por isso, as ventoinhas de cima devem ser sempre exaustoras.</li>
        </ul>
      `
        },
        {
            title: "2. Pressão Positiva vs Negativa",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">O Segredo contra a Poeira:</h4>
            <p class="text-sm text-gray-300">
                O ideal para gamers é a <strong>Pressão Positiva</strong>. Isso acontece quando você tem mais ventoinhas jogando ar para dentro do que para fora. Isso força o ar (e a poeira) a sair por todas as frestas do gabinete, impedindo que a sujeira entre pelos buraquinhos sem filtro.
            </p>
        </div>
      `
        },
        {
            title: "3. Gabinetes de Vidro (Frente Fechada)",
            content: `
        <p class="mb-4 text-gray-300">
            Muitos gabinetes modernos têm a frente de vidro temperado. Embora sejam lindos, eles matam o Airflow se não houver frestas laterais grandes. 
            <br/><br/><strong>Dica:</strong> Se você tem um gabinete assim e o seu PC está fervendo, tente remover o painel frontal durante as sessões de jogo mais pesadas. Você verá uma queda imediata de 5ºC a 10ºC.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/importancia-pasta-termica-pc",
            title: "Pasta Térmica",
            description: "O par perfeito para um bom airflow."
        },
        {
            href: "/guias/limpeza-fisica-pc-gamer",
            title: "Limpeza Física",
            description: "Remova a poeira que bloqueia o ar."
        },
        {
            href: "/guias/cable-management-organizacao-cabos-pc",
            title: "Cable Management",
            description: "Tire os cabos da frente do fluxo de ar."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
