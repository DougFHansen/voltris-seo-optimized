import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'cadeira-gamer-ergonomia-postura-aim',
    title: "Ergonomia no Setup (2026): Postura, Cadeira e Mira",
    description: "Dor nas costas e pulso destrói sua mira. Aprenda a ajustar a altura da cadeira, monitor e mesa para jogar por horas sem lesão (L.E.R).",
    category: 'hardware',
    difficulty: 'Iniciante',
    time: '15 min'
};

const title = "Guia de Ergonomia Gamer (2026): Jogue sem Dor";
const description = "A consistência da mira vem da estabilidade do corpo. Se você está torto, seu cérebro gasta energia compensando o equilíbrio em vez de focar no headshot.";

const keywords = [
    'altura correta mesa gamer ergonomia',
    'cadeira gamer vs cadeira de escritorio herman miller',
    'dor no pulso mousepad altura',
    'posicao correta monitor olhos',
    'apoio de pe ergonomia gamer',
    'como sentar corretamente para jogar fps',
    'lesao por esforço repetitivo ler gamer',
    'voltris optimizer health',
    'exercicios alongamento mao gamer'
];

export const metadata: Metadata = createGuideMetadata('cadeira-gamer-ergonomia-postura-aim', title, description, keywords);

export default function ErgoGuide() {
    const summaryTable = [
        { label: "Cotovelos", value: "90 Graus (Apoiados)" },
        { label: "Monitor", value: "Topo na linha dos olhos" },
        { label: "Distância Tela", value: "Um braço esticado" },
        { label: "Pés", value: "Plantados no chão" },
        { label: "Lombar", value: "Apoiada (Almofada)" },
        { label: "Pausas", value: "A cada 1 hora" },
        { label: "Mouse", value: "Braço leve, não tenso" }
    ];

    const contentSections = [
        {
            title: "Introdução: A Física da Mira",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Muitos Pros jogam com a "cara na tela" ou teclado torto. Isso funciona por 5 anos, depois vem a tendinite. O objetivo aqui é longevidade e consistência mecânica.
        </p>
      `
        },
        {
            title: "Capítulo 1: Altura da Mesa e Cadeira",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">A Regra dos 90 Graus</h4>
                <p class="text-gray-400 text-xs text-justify">
                    Sente-se e relaxe os ombros.
                    <br/>Seus cotovelos devem estar na mesma altura do tampo da mesa, formando um ângulo de 90 graus.
                    <br/>- Se a mesa for alta: Levante a cadeira e use um apoio para os pés (livros/caixa).
                    <br/>- Se a mesa for baixa: Você vai curvar as costas (Corcunda). Erga a mesa com calços.
                    <br/>O antebraço deve repousar reto sobre o mousepad.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Monitor (Neck Pain)",
            content: `
        <p class="mb-4 text-gray-300">
            A borda SUPERIOR do monitor deve estar na altura dos seus olhos.
            <br/>Nós olhamos naturalmente levemente para baixo (15 graus).
            <br/>Se o monitor estiver alto, você força o pescoço para trás.
            <br/>Se estiver baixo (laptop), você curva o pescoço (Text Neck).
            <br/>Incline o monitor levemente para cima se ele estiver baixo.
        </p>
      `
        },
        {
            title: "Capítulo 3: Cadeira (Gamer vs Office)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Cadeira Gamer (Racing):</strong> Bonita, mas geralmente tem "abas" no ombro que empurram você para frente e assento de balde que aperta as coxas. As almofadas lombares soltas são ruins.
            - <strong>Cadeira de Escritório (Mesh):</strong> Feitas para ergonomia real. O encosto de tela (Mesh) respira e se molda às costas.
            <br/>Se usar Gamer, remova a almofada de cabeça se ela empurrar seu pescoço para frente.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Braço no Mouse (Arm vs Wrist Aiming)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Wrist Aim (Pulso):</strong> Apoia o pulso na borda da mesa. Causa pressão no Túnel do Carpo. Alta sensibilidade necessária. Arriscado.
            - <strong>Arm Aim (Braço):</strong> Apoia o antebraço inteiro na mesa. O pivô é o cotovelo. Baixa sensibilidade. Distribui a pressão e é mais saudável e preciso a longo prazo.
            <br/>Empurre o monitor para trás e libere espaço na mesa para apoiar o braço todo.
        </p>
      `
        },
        {
            title: "Capítulo 5: A Pega do Mouse (Grip Style)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Palm Grip:</strong> Mão toda no mouse. Relaxado.
            - <strong>Claw/Fingertip:</strong> Dedos arqueados. Mais tensão.
            <br/>Não force um grip que dói. Use o mouse do tamanho certo para sua mão (Rocket Jump Ninja Size Guide). Mouse pequeno demais causa cãibra.
        </p>
      `
        },
        {
            title: "Capítulo 6: Iluminação do Quarto (Bias Lighting)",
            content: `
        <p class="mb-4 text-gray-300">
            Jogar no escuro total com monitor brilhante cansa a vista (contraste excessivo).
            <br/>Coloque uma fita LED (branca quente) atrás do monitor refletindo na parede.
            <br/>Essa luz ambiente suave equilibra a pupila e reduz dor de cabeça.
        </p>
      `
        },
        {
            title: "Capítulo 7: Alongamentos (Hand Yoga)",
            content: `
        <p class="mb-4 text-gray-300">
            Entre as partidas (no lobby/fila):
            <br/>1. Estique o braço e puxe os dedos para trás (palma para frente).
            <br/>2. Feche o punho e gire lentamente.
            <br/>3. Pisque os olhos com força. (Gamers piscam 60% menos focados, ressecando a córnea).
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Hidratação",
            content: `
            <p class="mb-4 text-gray-300">
                Desidratação reduz o tempo de reação e a função cognitiva.
                <br/>Mantenha uma garrafa d'água na mesa.
            </p>
            `
        },
        {
            title: "Capítulo 9: Pés",
            content: `
            <p class="mb-4 text-gray-300">
                Se seus pés balançam, sua coluna fica instável.
                <br/>Pés firmes no chão dão base para o "Core" (abdômen) segurar a postura.
            </p>
            `
        },
        {
            title: "Capítulo 10: Frio nas Mãos",
            content: `
            <p class="mb-4 text-gray-300">
                Mãos geladas = Reflexos lentos.
                <br/>Se seu quarto é frio, use um aquecedor de mãos USB ou coloque as mãos sob as pernas entre os rounds. Pro players usam Hand Warmers no palco.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Cadeira cara vale a pena?",
            answer: "Uma Herman Miller usada (R$3000) dura 15 anos e salva suas costas. Uma gamer barata (R$800) dura 2 anos e estraga sua postura. Invista na sua saúde."
        },
        {
            question: "Minha mesa balança quando jogo.",
            answer: "Isso atrapalha a mira. Aperte os parafusos ou encoste a mesa na parede para estabilizar."
        }
    ];

    const externalReferences = [
        { name: "Dr. Levi (Gamer Exercises)", url: "https://www.youtube.com/user/drlevifitness" },
        { name: "Rocket Jump Ninja (Mouse Guide)", url: "https://www.rocketjumpninja.com/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/mouse-otimizacao-windows-precisao",
            title: "Mouse",
            description: "Ajuste de sensibilidade."
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
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            externalReferences={externalReferences}
        />
    );
}
