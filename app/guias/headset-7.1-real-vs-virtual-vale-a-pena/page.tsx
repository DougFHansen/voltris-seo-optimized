import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Headset 7.1 Real vs Virtual: A Maior Mentira do Marketing Gamer? (2026)";
const description = "Vale a pena ativar o som 7.1 Surround no Windows? Entenda como funciona o áudio espacial, HRTF e por que a maioria dos Pro Players joga em Estéreo.";
const keywords = ['headset 7.1 vale a pena', 'som surround vs estereo jogos', 'melhor configuracao audio cs2', 'dolby atmos for headphones', 'dts headphone x', 'razer thx spatial audio'];

export const metadata: Metadata = createGuideMetadata('headset-7.1-real-vs-virtual-vale-a-pena', title, description, keywords);

export default function AudioGuide() {
    const summaryTable = [
        { label: "Competitivo", value: "Estéreo (Puro)" },
        { label: "Filmes/AAA", value: "Virtual 7.1" },
        { label: "Melhor App", value: "Dolby Atmos" },
        { label: "Pior Opção", value: "7.1 Genérico" }
    ];

    const contentSections = [
        {
            title: "O que é 7.1 Virtual?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Você tem apenas dois ouvidos. Fones de ouvido estéreo têm dois alto-falantes (drivers). Como eles simulam som vindo de trás? Usando <strong>HRTF (Head-Related Transfer Function)</strong>.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          O software altera o atraso e a frequência do som sutilmente para enganar seu cérebro. O problema é: a maioria dos softwares "Gamer 7.1" gratuitos faz isso muito mal, criando um eco metálico de banheiro e abafando passos.
        </p>
      `,
            subsections: []
        },
        {
            title: "Estéreo vs 7.1 em Jogos Competitivos",
            content: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-blue-900/20 p-6 rounded-xl border border-blue-500">
                <h4 class="text-white font-bold mb-2">Modo Estéreo (Recomendado)</h4>
                <p class="text-gray-300 text-sm">
                    Jogos modernos (CS2, Valorant, Overwatch 2) já possuem seu próprio motor de áudio HRTF embutido. O jogo sabe exatamente onde o inimigo está e processa o som.
                    <br/><br/>
                    <strong>Se você ativar o 7.1 do Windows em cima do HRTF do jogo, você mistura dois processamentos e estraga tudo.</strong> Inimigos à direita vão soar como se estivessem em todo lugar.
                </p>
            </div>
            <div class="bg-red-900/20 p-6 rounded-xl border border-red-500">
                <h4 class="text-white font-bold mb-2">Modo 7.1 Virtual</h4>
                <p class="text-gray-300 text-sm">
                    Bom para filmes e jogos de mundo aberto (Skyrim, Witcher) onde a imersão importa mais que a precisão. Em jogos de tiro, geralmente dificulta saber a distância exata dos passos.
                </p>
            </div>
        </div>
      `,
            subsections: []
        },
        {
            title: "Dolby Atmos vs Windows Sonic vs DTS",
            content: `
        <p class="mb-4 text-gray-300">
            Se você quer usar virtualização para imersão, use as pagas/oficiais, não a do driver do headset chinês.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Windows Sonic:</strong> Gratuito (vem no Windows). É "ok", mas altera muito o timbre do som.</li>
            <li><strong>Dolby Atmos for Headphones:</strong> Pago. O melhor do mercado. Mantém a clareza do som e melhora muito a separação vertical (saber se o inimigo está em cima ou embaixo em jogos como Warzone).</li>
            <li><strong>DTS Headphone:X:</strong> Bom, mas tende a ter muito grave (bass), o que pode abafar passos.</li>
        </ul>
      `
        },
        {
            title: "Veredito: Como configurar?",
            content: `
            <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>Para CS2 / Valorant:</strong> Desligue TUDO no Windows (som espacial: Desativado). Ative a opção "HRTF" ou "Áudio 3D" dentro das configurações do jogo.</li>
                <li><strong>Para Warzone / Battlefield:</strong> Esses jogos têm áudio ruim nativo. Usar <strong>Dolby Atmos</strong> (modo Jogo ou Performance) ajuda muito a ouvir a direção dos tiros.</li>
                <li><strong>Para Filmes:</strong> Ligue o 7.1 Virtual e seja feliz com as explosões.</li>
            </ol>
        `
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
        />
    );
}
