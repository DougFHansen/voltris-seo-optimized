import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'guia-compra-monitores',
  title: "Guia Definitivo de Monitores 2026: OLED, Hz, HDR e Motion Blur",
  description: "Não compre monitor errado. Entenda a diferença entre GtG e MPRT, por que HDR 400 é marketing, e quando escolher OLED, IPS ou TN para jogos competitivos.",
  category: 'perifericos',
  difficulty: 'Avançado',
  time: '35 min'
};

const title = "Guia Definitivo de Monitores 2026: OLED, Hz, HDR e Motion Blur";
const description = "Não compre monitor errado. Entenda a diferença entre GtG e MPRT, por que HDR 400 é marketing, e quando escolher OLED, IPS ou TN para jogos competitivos.";

const keywords = [
  'melhor monitor gamer 2026 guia',
  'ips vs va vs oled vs tn diferença',
  'tempo de resposta gtg vs mprt explicado',
  'hdr400 vs hdr1000 vale a pena',
  'motion blur reduction dyac elmb vale a pena',
  'hdmi 2.1 vs displayport 1.4 bandwidth',
  'monitor 240hz vs 360hz vs 540hz'
];

export const metadata: Metadata = createGuideMetadata('guia-compra-monitores', title, description, keywords);

export default function MonitorBuyingGuide() {
  const summaryTable = [
    { label: "Competitivo (CS2)", value: "TN/OLED 360Hz+ com DyAc/BFI" },
    { label: "AAA / Imersão", value: "OLED / Mini-LED 4K HDR" },
    { label: "Custo-Benefício", value: "IPS 165Hz/180Hz" },
    { label: "Evite", value: "Telas VA baratas (Ghosting)" },
    { label: "Marketing Enganoso", value: "1ms (sempre verifique GtG)" },
    { label: "HDR Real", value: "Requer Dimming Zones (Mini-LED/OLED)" }
  ];

  const contentSections = [
    {
      title: "Introdução: O Gargalo Invisível",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Você pode ter um PC da NASA com uma RTX 5090, mas se seu monitor for ruim, sua experiência será ruim. Em 2026, o mercado de monitores está infestado de marketing enganoso. "1ms", "HDR" e "Contraste Dinâmico" muitas vezes são mentiras técnicas. Este guia vai te ensinar a ler as entrelinhas das especificações para não gastar dinheiro em ghosting e cores lavadas.
        </p>
      `
    },
    {
      title: "1. A Guerra dos Painéis: IPS vs VA vs TN vs OLED",
      content: `
        <div class="space-y-6">
            <div class="bg-[#0A0A0F] p-5 rounded-xl border-l-4 border-blue-500">
                <h4 class="text-blue-400 font-bold text-xl mb-2">IPS (In-Plane Switching)</h4>
                <p class="text-gray-300 mb-2"><strong>O Padrão de Ouro do Custo-Benefício.</strong></p>
                <ul class="list-disc list-inside text-gray-400 text-sm space-y-1">
                    <li><strong>Prós:</strong> Cores precisas, melhores ângulos de visão (a imagem não escurece se você olhar de lado).</li>
                    <li><strong>Contras:</strong> "IPS Glow" (brilho prateado nos cantos em cenas escuras) e contraste fraco (pretos parecem cinza escuro).</li>
                    <li><strong>Para quem:</strong> 90% dos gamers. É o melhor equilíbrio.</li>
                </ul>
            </div>

            <div class="bg-[#0A0A0F] p-5 rounded-xl border-l-4 border-purple-500">
                <h4 class="text-purple-400 font-bold text-xl mb-2">VA (Vertical Alignment)</h4>
                <p class="text-gray-300 mb-2"><strong>Amado por uns, Odiado por outros.</strong></p>
                <ul class="list-disc list-inside text-gray-400 text-sm space-y-1">
                    <li><strong>Prós:</strong> Contraste 3x melhor que IPS. Pretos profundos, ótimo para filmes e jogos de terror em sala escura.</li>
                    <li><strong>Contras:</strong> <strong>Black Smearing (Ghosting Escuro)</strong>. Em transições de preto para cinza, a imagem borra horrivelmente. Apenas painéis VA de elite (Samsung Odyssey G7/G9) corrigiram isso. Evite VAs baratos para jogos rápidos.</li>
                    <li><strong>Para quem:</strong> Simuladores e jogos Single Player lentos.</li>
                </ul>
            </div>

            <div class="bg-[#0A0A0F] p-5 rounded-xl border-l-4 border-yellow-500">
                <h4 class="text-yellow-400 font-bold text-xl mb-2">TN (Twisted Nematic)</h4>
                <p class="text-gray-300 mb-2"><strong>A Relíquia dos Pro-Players.</strong></p>
                <ul class="list-disc list-inside text-gray-400 text-sm space-y-1">
                    <li><strong>Prós:</strong> O mais rápido e barato. Clareza de movimento excepcional em modelos Zowie.</li>
                    <li><strong>Contras:</strong> Cores horríveis, ângulos de visão péssimos. A imagem muda de cor se você mexer a cabeça.</li>
                    <li><strong>Para quem:</strong> Apenas jogadores Tryhard de CS2/Valorant que não ligam para gráficos, só para a vitória.</li>
                </ul>
            </div>

            <div class="bg-[#0A0A0F] p-5 rounded-xl border-l-4 border-red-500 animate-pulse-slow">
                <h4 class="text-red-400 font-bold text-xl mb-2">OLED / QD-OLED</h4>
                <p class="text-gray-300 mb-2"><strong>O Santo Graal (Endgame).</strong></p>
                <ul class="list-disc list-inside text-gray-400 text-sm space-y-1">
                    <li><strong>Prós:</strong> Tempo de resposta INSTANTÂNEO (0.03ms reais). Contraste infinito (pixel se apaga para fazer o preto). Cores perfeitas.</li>
                    <li><strong>Contras:</strong> Risco de <strong>Burn-in</strong> (imagem fantasma permanente de elementos estáticos como HUD ou barra de tarefas) com o tempo, embora modelos 2025/2026 tenham muita proteção. Brilho máximo menor em tela cheia (ABL). Custo altíssimo.</li>
                    <li><strong>Para quem:</strong> Quem tem orçamento ilimitado e quer a melhor experiência visual possível.</li>
                </ul>
            </div>
        </div>
      `
    },
    {
      title: "2. A Grande Mentira do '1ms' (GtG vs MPRT)",
      content: `
        <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-6">
            <p class="text-gray-300 mb-4">
                Quando você vê "1ms" na caixa, é marketing. Existem duas formas de medir:
            </p>
            <ul class="space-y-4">
                <li>
                    <strong class="text-[#31A8FF] text-lg">GtG (Gray-to-Gray):</strong>
                    <br/><span class="text-gray-400 text-sm">Tempo que um pixel leva para mudar de uma cor cinza para outra. A maioria dos IPS rápidos hoje faz 3ms a 4ms reais. Para chegar em "1ms GtG", os fabricantes aplicam uma voltagem excessiva (Overdrive) nos pixels.</span>
                    <br/><span class="text-red-400 text-xs font-bold">Consequência:</span> Overshoot/Inverse Ghosting. Rastros brilhantes/coronas ao redor de objetos em movimento. Geralmente, o modo "Fastest" ou "Extreme" do monitor é inutilizável. Use o modo "Normal" ou "Fast".
                </li>
                <li>
                    <strong class="text-[#31A8FF] text-lg">MPRT (Moving Picture Response Time):</strong>
                    <br/><span class="text-gray-400 text-sm">Mede a persistência da imagem na sua retina. Só é possível atingir 1ms MPRT ligando o modo de <strong>Strobing (BFI)</strong>.</span>
                </li>
            </ul>
        </div>
        <div class="bg-indigo-900/20 p-4 rounded border-l-4 border-indigo-500">
            <h5 class="text-indigo-400 font-bold mb-1">O que é DyAc / ELMB / BFI?</h5>
            <p class="text-gray-300 text-sm">
                São tecnologias que piscam a luz de fundo do monitor (black frame insertion) entre cada frame. Isso "limpa" a imagem na sua retina, eliminando o borrão de movimento.
                <br/><strong>Prós:</strong> Claridade de movimento absurda (CRT-like).
                <br/><strong>Contras:</strong> Reduz o brilho da tela e pode causar dor de cabeça em pessoas sensíveis. O DyAc+ da Zowie e o ULMB 2 da NVIDIA são as melhores implementações disso.
            </p>
        </div>
      `
    }
  ];

  const advancedContentSections = [
    {
      title: "3. HDR: Não caia no golpe do HDR400",
      content: `
        <p class="mb-4 text-gray-300">
            HDR (High Dynamic Range) precisa de duas coisas: brilho muito alto em pontos específicos e preto absoluto em outros.
        </p>
        <div class="overflow-x-auto mb-6">
            <table class="w-full text-sm text-left text-gray-300 border border-gray-700">
                <thead class="bg-gray-800">
                    <tr>
                        <th class="p-3">Selo</th>
                        <th class="p-3">Realidade</th>
                        <th class="p-3">Veredito</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-t border-gray-700">
                        <td class="p-3 font-bold text-gray-500">HDR 400 / HDR10</td>
                        <td class="p-3">O monitor apenas aceita o sinal HDR e aumenta o brilho de TUDO. Preto vira cinza claro. Cores lavadas.</td>
                        <td class="p-3 text-red-500 font-bold">Mantenha DESLIGADO. Pior que SDR.</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/20">
                        <td class="p-3 font-bold text-yellow-500">HDR 600</td>
                        <td class="p-3">Começa a ter "Local Dimming" (zonas que apagam), mas poucas (8-16 zonas).</td>
                        <td class="p-3 text-yellow-500">Aceitável ("HDR de entrada").</td>
                    </tr>
                    <tr class="border-t border-gray-700">
                        <td class="p-3 font-bold text-emerald-400">HDR 1000 / True Black</td>
                        <td class="p-3">Requer Full Array Local Dimming (FALD) ou OLED. Milhares de zonas ou pixels individuais.</td>
                        <td class="p-3 text-emerald-400 font-bold">HDR Real. Experiência transformadora.</td>
                    </tr>
                </tbody>
            </table>
        </div>
      `
    },
    {
      title: "4. Hz e Resolução: O Sweet Spot 2026",
      content: `
        <ul class="space-y-4 mb-6">
            <li class="bg-gray-800 p-4 rounded-lg">
                <span class="text-[#31A8FF] font-bold block mb-1">1080p (FHD) @ 360Hz / 540Hz</span>
                <span class="text-sm text-gray-400">Exclusivo para Esports Profissional. A resolução baixa garante FPS máximo, e os Hz extremos reduzem a latência ao mínimo absoluto. Requer CPU monstra.</span>
            </li>
            <li class="bg-gray-800 p-4 rounded-lg border border-[#31A8FF]/30 shadow-[0_0_15px_rgba(49,168,255,0.1)]">
                <span class="text-[#31A8FF] font-bold block mb-1">1440p (QHD) @ 240Hz OLED</span>
                <span class="text-sm text-gray-300"><strong>A Recomendação Voltris 2026.</strong> A nitidez do 1440p é perfeita para 27", e 240Hz no OLED tem a clareza de movimento de um LCD 360Hz. É o monitor "faz-tudo" perfeito.</span>
            </li>
            <li class="bg-gray-800 p-4 rounded-lg">
                <span class="text-[#31A8FF] font-bold block mb-1">4K (UHD) @ 144Hz+</span>
                <span class="text-sm text-gray-400">Luxo para Single Player e trabalho. Exige RTX 4080/4090 ou RX 7900 XTX para rodar bem. Em 2026, monitores "Dual-Mode" (4K 120Hz ou 1080p 240Hz num botão) estão populares.</span>
            </li>
        </ul>
      `
    },
    {
      title: "5. Conectividade: HDMI 2.1 vs DP 1.4",
      content: `
          <p class="mb-4 text-gray-300">
              O monitor pode limitar sua GPU se você usar o cabo errado.
              <br/><br/>
              <strong>DisplayPort 1.4 (DSC):</strong> O padrão para PC. Suporta até 4K 144Hz com DSC (compressão visualmente sem perdas). Sempre use DP no PC para garantir G-Sync compatível.
              <br/><br/>
              <strong>HDMI 2.1:</strong> Essencial para <strong>Consoles (PS5/Xbox)</strong> fazerem 4K 120Hz + VRR. No PC, só é necessário se você quiser usar a TV OLED como monitor (LG C3/C4/C5).
              <br/><br/>
              <span class="text-yellow-500 font-bold">Aviso:</span> Muitos monitores baratos têm porta HDMI 2.0. Eles NÃO rodam 4K 120Hz ou 1440p 144Hz 10-bit. Verifique a versão da porta!
          </p>
        `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/calibrar-cores-monitor",
      title: "Calibrar Monitor",
      description: "Ajuste as cores após a compra para fidelidade."
    },
    {
      href: "/guias/hdr-windows-vale-a-pena-jogos",
      title: "Guia de HDR",
      description: "Como configurar HDR no Windows 11 corretamente."
    },
    {
      href: "/guias/g-sync-freesync-configuracao-correta",
      title: "G-Sync e FreeSync",
      description: "Como ativar VRR sem input lag."
    }
  ];

  const faqItems = [
    {
      question: "O que é Dead Pixel e Stuck Pixel?",
      answer: "Dead Pixel é um ponto preto (pixel morto). Stuck Pixel é travado em uma cor (vermelho, verde, azul). Stuck pixels podem às vezes ser 'desbloqueados' com softwares que piscam cores rápidas (como JScreenFix), mas dead pixels são permanentes. Verifique a política de garantia da marca."
    },
    {
      question: "Monitor Curvo vale a pena?",
      answer: "Para painéis VA (como Odyssey), sim, pois a curva melhora os ângulos de visão nos cantos. Para IPS 16:9, é desnecessário e pode distorcer linhas retas (ruim para design). Para Ultrawide, é obrigatório."
    },
    {
      question: "O que é VRR Flicker?",
      answer: "Alguns monitores (principalmente VA e OLED) piscam o brilho em telas de loading ou menus quando o FPS varia muito com G-Sync ligado. É uma limitação da tecnologia do painel, não defeito."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="35 min"
      difficultyLevel="Avançado"
      contentSections={contentSections}
      advancedContentSections={advancedContentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
      faqItems={faqItems}
    />
  );
}
