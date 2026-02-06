import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'limpeza-fisica-pc-gamer',
    title: "Limpeza Física de PC Gamer: Guia Completo e Seguro (2026)",
    description: "Poeira causa superaquecimento e curto-circuito. Aprenda a limpar seu PC com segurança usando pincel, ar comprimido e álcool isopropílico. Não use secador de cabelo!",
    category: 'hardware',
    difficulty: 'Iniciante',
    time: '45 min'
};

const title = "Como Limpar o PC Gamer Corretamente: O Fim do Superaquecimento";
const description = "Seu PC está 'bufando' e esquentando? Provavelmente é poeira nos filtros e dissipadores. Veja o passo a passo para desmontar, limpar e trocar a pasta térmica.";

const keywords = [
    'como limpar pc gamer poeira',
    'pode usar secador de cabelo limpar pc',
    'limpar placa de video com pincel pode',
    'alcool isopropilico placa mae',
    'trocar pasta termica frequencia',
    'limpar filtro de poeira gabinete',
    'organizar cabos pc gamer',
    'limpeza de fans ventoinhas barulho'
];

export const metadata: Metadata = createGuideMetadata('limpeza-fisica-pc-gamer', title, description, keywords);

export default function CleaningGuide() {
    const summaryTable = [
        { label: "Ferramentas", value: "Pincel Macio, Ar Comprimido" },
        { label: "Pasta Térmica", value: "Trocar a cada 1-2 anos" },
        { label: "Líquido", value: "Apenas Álcool Isopropílico (99%)" },
        { label: "Proibido", value: "Secador Quente, Água, Veja" },
        { label: "Risco", value: "Estática (Descarregue antes)" },
        { label: "Frequência", value: "Limpeza leve a cada 3 meses" }
    ];

    const contentSections = [
        {
            title: "Por que limpar?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          A poeira age como um cobertor térmico, impedindo o calor de sair das peças. Além disso, em dias úmidos, a poeira pode conduzir eletricidade e queimar a placa-mãe. PC limpo roda mais frio, mais silencioso e dura mais.
        </p>
      `
        },
        {
            title: "O que você precisa",
            content: `
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>Pincel de cerdas macias</strong> (tipo trincha de pintura nova).</li>
            <li><strong>Soprador de ar / Lata de Ar Comprimido</strong> (Ideal).</li>
            <li><strong>Pano de microfibra</strong>.</li>
            <li><strong>Álcool Isopropílico 99%</strong> (Para limpar contatos e pasta velha).</li>
            <li><strong>Pasta Térmica</strong> (Se for remover o cooler do processador).</li>
            <li>Chave Philips.</li>
        </ul>
      `
        },
        {
            title: "Passo a Passo Seguro",
            content: `
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
            <li><strong>Desligue tudo:</strong> Tire o PC da tomada. Aperte o botão Power algumas vezes para descarregar a energia residual dos capacitores.</li>
            <li><strong>Abra a lateral:</strong> Remova o vidro/tampa.</li>
            <li><strong>Ventoinhas (Fans):</strong> Use o pincel para soltar a poeira das pás. Segure a pá com o dedo para ela não girar loucamente se usar ar comprimido (girar muito rápido pode gerar voltagem reversa e queimar o motor).</li>
            <li><strong>Filtros de Poeira:</strong> Remova os filtros (frente/baixo) e lave-os com água. Seque 100% antes de colocar de volta.</li>
            <li><strong>Placa de Vídeo:</strong> Limpe apenas a carcaça e o backplate com pincel. O ideal é soprar ar no dissipador.</li>
        </ol>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Troca de Pasta Térmica (Avançado)",
            content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-orange-400 font-bold mb-4 text-xl">Só faça se necessário</h4>
                <p class="text-gray-300 mb-4">
                    Não troque a pasta térmica de uma placa de vídeo nova (perde garantia). Do processador, troque se as temperaturas estiverem altas.
                </p>
                <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4 text-sm">
                    <li>Solte os parafusos do cooler em X (cruz).</li>
                    <li>Gire levemente o cooler para soltar (se for AMD, cuidado para não arrancar o processador junto).</li>
                    <li>Limpe a pasta velha cinza com papel toalha e Álcool Isopropílico até brilhar.</li>
                    <li>Aplique uma gota do tamanho de uma ervilha no centro.</li>
                    <li>Recoloque o cooler.</li>
                </ol>
            </div>
            `
        }
    ];

    const additionalContentSections = [
        {
            title: "Erro Comum: Secador de Cabelo",
            content: `
            <p class="mb-4 text-gray-300">
                Nunca use secador no modo quente. O calor excessivo pode derreter soldas ou plásticos. No modo frio é aceitável, mas aspirador de pó é perigoso (gera muita estática no bico de plástico). O melhor é soprador específico para eletrônicos.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Borracha branca limpa memória RAM?",
            answer: "Sim. A borracha escolar branca é excelente para limpar os contatos dourados da memória RAM e placa de vídeo se o PC não estiver dando vídeo. Passe levemente e tire os farelos depois."
        },
        {
            question: "Com que frequência devo limpar?",
            answer: "Depende do ambiente. Chão carpete/animais de estimação = a cada 2-3 meses. Ambiente limpo/ar condicionado = a cada 6 meses."
        }
    ];

    const externalReferences = [
        { name: "Linus Tech Tips - PC Cleaning Guide", url: "https://www.youtube.com/watch?v=W9T6WGFmam0" }
    ];

    const relatedGuides = [
        {
            href: "/guias/monitorar-temperatura-pc",
            title: "Monitorar Temps",
            description: "Veja o 'antes e depois' da limpeza."
        },
        {
            href: "/guias/verificar-saude-hd-ssd-crystaldiskinfo",
            title: "Saúde Peças",
            description: "Cheque se o calor não danificou nada."
        },
        {
            href: "/guias/importancia-pasta-termica-pc",
            title: "Guia Pasta Térmica",
            description: "Qual comprar? Prata ou Cerâmica?"
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="45 min"
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
