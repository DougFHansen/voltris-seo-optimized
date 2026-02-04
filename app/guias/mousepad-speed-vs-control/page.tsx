import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Mousepad Speed vs Control: Qual escolher para seu jogo? (2026)";
const description = "Você sabia que o seu mousepad pode ser o motivo de você errar tantos tiros? Entenda a diferença entre tecidos Speed, Control e Híbridos em 2026.";
const keywords = [
    'mousepad speed vs control diferença 2026',
    'qual o melhor mousepad para valorant e cs2',
    'mousepad de vidro vale a pena 2026 guia',
    'como escolher tamanho de mousepad gamer tutorial',
    'limpar mousepad gamer sem estragar o tecido'
];

export const metadata: Metadata = createGuideMetadata('mousepad-speed-vs-control', title, description, keywords);

export default function MousepadGuide() {
    const summaryTable = [
        { label: "Speed", value: "Menos atrito / Deslize ultra rápido" },
        { label: "Control", value: "Mais atrito / Parada precisa (Stopping Power)" },
        { label: "Híbrido", value: "Equilíbrio entre deslize e controle" },
        { label: "Check de Jogo", value: "FPS Tático (Control) vs Fast FPS (Speed)" }
    ];

    const contentSections = [
        {
            title: "O Mousepad é mais que um pedaço de pano",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, com sensores de mouse chegando a 30.000 DPI e pesando menos de 50 gramas, a superfície onde o mouse desliza se tornou crucial. O **Micro-adjustment** (pequenos ajustes de mira) depende diretamente de quanto o mousepad "segura" o mouse. Escolher o tipo errado para o seu jogo pode fazer sua mira parecer "ensaboada" ou "pesada demais".
        </p>
      `
        },
        {
            title: "1. Mousepad Control: Para quem busca Precisão",
            content: `
        <p class="mb-4 text-gray-300">Geralmente possuem uma textura mais rugosa ao toque:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Sensação:</strong> Você sente o mouse "agarrar" um pouco mais. Isso dá o que chamamos de <strong>Stopping Power</strong> (poder de parada).</li>
            <li><strong>Ideal para:</strong> Jogos como Valorant, CS2 e Rainbow Six Siege, onde a mira fica parada esperando o inimigo e o tiro precisa ser certeiro.</li>
            <li><strong>Veredito:</strong> Se você costuma passar da cabeça do inimigo ao tentar mirar, você precisa de um pad Control.</li>
        </ul>
      `
        },
        {
            title: "2. Mousepad Speed: Para quem busca Agilidade",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Deslize Infinito:</h4>
            <p class="text-sm text-gray-300">
                Os modelos Speed (e os novos de **Vidro ou Cordura** de 2026) oferecem quase zero resistência inicial. <br/><br/>
                - <strong>Ideal para:</strong> Jogos de tracking rápido como Apex Legends, Overwatch e Warzone, onde o inimigo se move constantemente e você precisa seguir o alvo com movimentos fluidos. <br/>
                - <strong>Aviso:</strong> Exige muito braço e treino, pois qualquer tremor na sua mão será refletido na mira.
            </p>
        </div>
      `
        },
        {
            title: "3. O Tamanho Importa (DPI Baixo)",
            content: `
        <p class="mb-4 text-gray-300">
            Se você joga com DPI baixo (400 ou 800), você precisa de espaço físico. 
            <br/><br/><strong>Dica:</strong> Evite os mousepads pequenos de escritório. Procure pelos tamanhos <strong>XL ou Extended</strong> (90x40cm) que cobrem a mesa toda. Isso permite que você use o braço todo para mirar, reduzindo o risco de lesões no pulso e melhorando drasticamente a sua consistência nos tiros.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/perifericos-gamer-vale-a-pena-marcas",
            title: "Setup Gamer",
            description: "Marcas que fazem os melhores pads."
        },
        {
            href: "/guias/mouse-clique-duplo-falhando-fix",
            title: "Problemas no Mouse",
            description: "Conserte seu mouse junto com o pad."
        },
        {
            href: "/guias/limpeza-fisica-pc-gamer",
            title: "Manutenção",
            description: "Como lavar seu mousepad gamer."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
