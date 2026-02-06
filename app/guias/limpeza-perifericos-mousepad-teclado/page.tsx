import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'limpeza-perifericos-mousepad-teclado',
    title: "Limpeza de Setup (2026): Mousepad, Teclado e PC",
    description: "Mousepad lento e teclado engasgando? Aprenda a lavar mousepad de tecido sem estragar, lubrificar switches e limpar poeira do PC corretamente.",
    category: 'hardware',
    difficulty: 'Iniciante',
    time: '20 min'
};

const title = "Guia de Limpeza Gamer (2026): Performance Restaurada";
const description = "Poeira causa aquecimento. Mousepad sujo causa mira inconsistente. Teclado sujo falha teclas. Manter o setup limpo é manter a performance alta.";

const keywords = [
    'como lavar mousepad gamer speed control secar',
    'limpar teclado mecanico tirar teclas switch',
    'limpar tela monitor gamer pano correto',
    'tirar poeira do pc ar comprimido ou aspirador',
    'lubrificar switch teclado spray',
    'alcool isopropilico limpeza pc',
    'voltris optimizer clean',
    'mouse double click contact cleaner'
];

export const metadata: Metadata = createGuideMetadata('limpeza-perifericos-mousepad-teclado', title, description, keywords);

export default function CleaningGuide() {
    const summaryTable = [
        { label: "Mousepad", value: "Água morna + Sabão Neutro" },
        { label: "Teclado", value: "Pincel + Ar Comprimido" },
        { label: "Monitor", value: "Microfibra + Água Destilada" },
        { label: "PC (Poeira)", value: "Soprador (Nunca Aspirador)" },
        { label: "Contatos", value: "Álcool Isopropílico" }
    ];

    const contentSections = [
        {
            title: "Introdução: A Sujeira Invisível",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Seu mousepad acumula gordura da mão, pele morta e suor. Isso cria zonas de atrito irregular ("lama") que prendem o mouse. Lavar o pad a cada 3 meses faz ele parecer novo.
        </p>
      `
        },
        {
            title: "Capítulo 1: Lavando o Mousepad (Tecido)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">No Banheiro</h4>
                <p class="text-gray-400 text-xs text-justify">
                    1. Jogue água morna (não quente) no pad (no box ou pia).
                    <br/>2. Aplique detergente neutro ou shampoo suave.
                    <br/>3. Esfregue suavemente com o lado AMARELO (macio) da esponja ou com a mão. Não use escovas duras para não desfiar o tecido.
                    <br/>4. Enxágue muito bem até sair todo o sabão.
                    <br/>5. Deixe secar à sombra esticado (24h). Não coloque no sol nem use secador (derrete a borracha).
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Teclado Mecânico",
            content: `
        <p class="mb-4 text-gray-300">
            1. Tire uma foto do teclado (para lembrar onde ficam as teclas).
            <br/>2. Remova as keycaps com o puxador (keycap puller).
            <br/>3. Lave as keycaps numa bacia com água e sabão. Deixe secar 100%.
            <br/>4. No teclado (switches), use um pincel macio para soltar a poeira e pelos. Vire de cabeça para baixo.
            <br/>5. Use um soprador de ar para tirar o resto.
            <br/>6. Se houve derramamento de refri (tecla grudando), use Álcool Isopropílico 99% com cotonete no switch (com o cabo desconectado).
        </p>
      `
        },
        {
            title: "Capítulo 3: Monitor (Cuidado Extremo)",
            content: `
        <p class="mb-4 text-gray-300">
            Telas modernas têm camadas anti-reflexo sensíveis.
            <br/>- NUNCA use álcool, Windex, Vidrex ou papel toalha (risca).
            <br/>- Use dois panos de microfibra limpos.
            <br/>1. Umedeça o pano 1 com um pouco de água destilada (ou filtrada). Passe suavemente.
            <br/>2. Passe o pano 2 seco imediatamente para não deixar manchas de água.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Dentro do PC (Fans)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Aspirador de Pó:</strong> PERIGO. Gera eletricidade estática que pode fritar a placa mãe. Só use se for específico para eletrônicos (ESD safe).
            - <strong>Ar Comprimido / Soprador:</strong> O ideal.
            <br/>Segure a ventoinha com o dedo para ela não girar livremente com o jato de ar (se girar muito rápido, gera voltagem reversa e queima o LED/Motor).
        </p>
      `
        },
        {
            title: "Capítulo 5: Limpa Contatos (RAM/GPU)",
            content: `
        <p class="mb-4 text-gray-300">
            Se o PC não liga ou dá tela azul:
            <br/>Tire as memórias RAM.
            <br/>Passe uma borracha escolar branca macia nos contatos dourados.
            <br/>Limpe o resto de borracha com pincel seco.
            <br/>Isso remove oxidação que causa mal contato.
        </p>
      `
        },
        {
            title: "Capítulo 6: Fone de Ouvido (Pads)",
            content: `
        <p class="mb-4 text-gray-300">
            As almofadas (Earpads) acumulam suor e fedem.
            <br/>- Couro Sintético: Pano úmido com álcool. Hidrate depois com hidratante de pele (pouco) para não descascar.
            <br/>- Tecido (Veludo): Tire e lave com água e sabão igual roupa.
            <br/>Limpe a cera da grade do driver com uma escova de dentes seca e macia.
        </p>
      `
        },
        {
            title: "Capítulo 7: Mouse (Scroll e Sensor)",
            content: `
        <p class="mb-4 text-gray-300">
            - Roda do mouse falhando? Sopre forte na fresta ou use limpa contatos (spray) sem desmontar. Geralmente é poeira no encoder.
            - Sensor: Cotonete seco.
            - Pés (Skates): Limpe a borda com palito de dente para tirar a "crosta" de sujeira que se forma ao redor.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: A Cadeira",
            content: `
            <p class="mb-4 text-gray-300">
                Aspire o assento (migalhas).
                <br/>Verifique os parafusos embaixo. Eles soltam com o tempo e a cadeira fica "bamba". Aperte-os a cada 6 meses.
                <br/>Limpe as rodinhas (cabelos enrolados travam a roda).
            </p>
            `
        },
        {
            title: "Capítulo 9: Filtros de Poeira",
            content: `
            <p class="mb-4 text-gray-300">
                Lave os filtros magnéticos do gabinete na torneira. Seque bem antes de por de volta.
            </p>
            `
        },
        {
            title: "Capítulo 10: Organização de Cabos",
            content: `
            <p class="mb-4 text-gray-300">
                Aproveite a limpeza para arrumar os cabos atrás da mesa.
                <br/>Cabos emaranhados acumulam bolas de poeira gigantes. Use abraçadeiras de velcro.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Posso secar o mousepad com secador?",
            answer: "NÃO. O calor deforma a borracha da base e descola o tecido. Deixe secar naturalmente."
        },
        {
            question: "Lavar placa-mãe funciona?",
            answer: "Técnica avançada (lavagem isopropílica). Não recomendamos para iniciantes. Risco de corrosão se não secar 100%."
        }
    ];

    const externalReferences = [
        { name: "How to Clean Mech Keyboard", url: "https://www.reddit.com/r/MechanicalKeyboards/wiki/keyboardmaintenanceguides/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/termperatura-pc-fan-control-curva",
            title: "Temperatura",
            description: "Menos poeira = Menos calor."
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
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            externalReferences={externalReferences}
        />
    );
}
