import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Monitor IPS, VA ou TN: Qual Melhor Painel para Jogos Competitivos e Trabalho? (2026)";
const description = "Vai comprar um monitor gamer? Entenda as diferenças cruciais entre IPS, VA e TN, o que é Ghosting (Black Smearing) e por que o OLED está mudando tudo.";
const keywords = ['monitor ips vs va vs tn', 'qual melhor painel para jogos', 'ghosting monitor va', 'melhor monitor para design', 'painel fast ips', 'oled vs ips jogos'];

export const metadata: Metadata = createGuideMetadata('monitor-ips-vs-va-vs-tn-jogos', title, description, keywords);

export default function PanelGuide() {
    const summaryTable = [
        { label: "Melhor Cor", value: "IPS / OLED" },
        { label: "Melhor Contraste", value: "VA / OLED" },
        { label: "Mais Rápido", value: "TN / OLED" },
        { label: "Pior Ângulo", value: "TN" }
    ];

    const contentSections = [
        {
            title: "Resumo Rábido: Qual escolher?",
            content: `
        <ul class="space-y-4 list-none text-gray-300">
            <li class="bg-gray-800 p-4 rounded border-l-4 border-blue-500">
                <strong class="text-white block text-lg">IPS (In-Plane Switching)</strong>
                <span class="text-white font-bold">O "Faz Tudo" Perfeito.</span>
                <br/>Cores vibrantes, ótimos ângulos de visão. A tecnologia "Fast IPS" moderna alcança 360Hz com 1ms real. É a escolha padrão para 90% dos gamers hoje.
                <br/><span class="text-red-400 text-sm">Contra: "IPS Glow" (brilho nos cantos em cenas escuras) e contraste fraco (cinza escuro em vez de preto).</span>
            </li>
            <li class="bg-gray-800 p-4 rounded border-l-4 border-yellow-500">
                <strong class="text-white block text-lg">VA (Vertical Alignment)</strong>
                <span class="text-white font-bold">O Rei do Contraste (e do Ghosting).</span>
                <br/>Pretos profundos (quase OLED). Ótimo para filmes e jogos de história (AAA) em quarto escuro.
                <br/><span class="text-red-400 text-sm">Contra: Black Smearing (Rastro preto). Em jogos rápidos, objetos escuros deixam um rastro fantasma horrível. Só compre VA se for modelos topo de linha (Samsung Odyssey G7/G8) que corrigem isso. Evite VAs baratos para CS2/Valorant.</span>
            </li>
            <li class="bg-gray-800 p-4 rounded border-l-4 border-gray-500">
                <strong class="text-white block text-lg">TN (Twisted Nematic)</strong>
                <span class="text-white font-bold">A Lenda Viva (Só para eSports).</span>
                <br/>É o painel mais rápido e barato do mundo. Usado por profissionais de CS que querem 540Hz a todo custo.
                <br/><span class="text-red-400 text-sm">Contra: Cores lavadas e horríveis. Se você olhar de lado, a imagem inverte. Só serve para jogar, não serve para ver filmes ou trabalhar.</span>
            </li>
        </ul>
      `,
            subsections: []
        },
        {
            title: "O Elefante na Sala: OLED e QD-OLED",
            content: `
        <p class="mb-4 text-gray-300">
            Em 2026, os monitores OLED estão ficando acessíveis. Eles têm <strong class="text-green-400">0.03ms</strong> de resposta (instantâneo) e contraste infinito.
        </p>
        <p class="text-gray-300">
            Se você tem orçamento, <strong>OLED vence todos</strong> os outros (IPS, VA e TN) em tudo, exceto em brilho máximo e risco de Burn-in (mancha na tela) se usado para trabalho estático (Excel/Word) por muitas horas.
        </p>
      `
        },
        {
            title: "Glossário Técnico",
            content: `
        <div class="space-y-4">
            <div>
                <h4 class="text-white font-bold">Ghosting</h4>
                <p class="text-gray-400 text-sm">Rastro fantasma que segue objetos em movimento. Comum em painéis VA lentos.</p>
            </div>
            <div>
                <h4 class="text-white font-bold">IPS Glow vs Backlight Bleed</h4>
                <p class="text-gray-400 text-sm">IPS Glow é o brilho natural do painel nos cantos (muda conforme você mexe a cabeça). Backlight Bleed é defeito de fabricação (luz vazando pela borda).</p>
            </div>
            <div>
                <h4 class="text-white font-bold">GtG (Gray to Gray)</h4>
                <p class="text-gray-400 text-sm">Tempo que um pixel leva para mudar de cinza pra cinza. Não confie no "1ms" da caixa, geralmente é marketing (MPRT). Procure reviews reais (Hardware Unboxed).</p>
            </div>
        </div>
      `
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
        />
    );
}
