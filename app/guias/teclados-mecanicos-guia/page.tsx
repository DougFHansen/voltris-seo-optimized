import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia Completo de Teclados Mecânicos: Switches, Tamanhos e Mods";
const description = "Entenda tudo sobre teclados mecânicos. Diferenças entre switches Blue, Red e Brown, formatos TKL vs Full Size e como escolher o ideal para digitar ou jogar.";
const keywords = ["teclado mecanico","switch cherry mx","outemu","tkl","hot-swappable","lubrificar switch"];

export const metadata: Metadata = createGuideMetadata('teclados-mecanicos-guia', title, description, keywords);

export default function GuidePage() {
  const contentSections = [

    {
      title: "Por que investir em um Teclado Mecânico?",
      content: `
        <p class="mb-4 text-gray-300">Diferente dos teclados de membrana (comuns) que usam uma folha de borracha, teclados mecânicos possuem um interruptor (switch) físico individual para cada tecla. Isso oferece precisão, durabilidade e conforto inigualáveis.</p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
            <div class="bg-[#1E1E22] p-4 rounded text-center border-t-4 border-blue-500">
              <h4 class="text-white font-bold mb-1">Durabilidade</h4>
              <p class="text-xs text-gray-400">50 a 100 milhões de cliques por tecla, contra 5 milhões dos comuns.</p>
            </div>
            <div class="bg-[#1E1E22] p-4 rounded text-center border-t-4 border-purple-500">
              <h4 class="text-white font-bold mb-1">Anti-Ghosting</h4>
              <p class="text-xs text-gray-400">Pressione várias teclas simultaneamente sem que nenhuma seja ignorada (N-Key Rollover).</p>
            </div>
            <div class="bg-[#1E1E22] p-4 rounded text-center border-t-4 border-green-500">
              <h4 class="text-white font-bold mb-1">Customização</h4>
              <p class="text-xs text-gray-400">Troque as capas (keycaps) e até os switches para mudar o visual e a sensação.</p>
            </div>
          </div>
      `,
      subsections: []
    },

    {
      title: "Entendendo os Switches (O Coração do Teclado)",
      content: `
        <p class="mb-4 text-gray-300">A cor do switch dita como ele se comporta. As três categorias principais são:</p>
          <div class="space-y-4">
            <div class="flex items-start gap-4 bg-[#171313] p-4 rounded-lg border border-blue-900/50">
              <div class="w-4 h-4 rounded-full bg-blue-500 mt-1 shadow-[0_0_10px_rgba(59,130,246,0.8)] flex-shrink-0"></div>
              <div>
                <h4 class="text-blue-400 font-bold">Switch Blue (Clicky)</h4>
                <p class="text-gray-400 text-sm">Possui um clique audível e uma resposta tátil (um 'degrau').<br><strong>Ideal para:</strong> Digitação pesada e datilógrafos.<br><strong>Ruim para:</strong> Escritórios silenciosos e jogos rápidos (devido ao ponto de reset).</p>
              </div>
            </div>
            <div class="flex items-start gap-4 bg-[#171313] p-4 rounded-lg border border-red-900/50">
              <div class="w-4 h-4 rounded-full bg-red-500 mt-1 shadow-[0_0_10px_rgba(239,68,68,0.8)] flex-shrink-0"></div>
              <div>
                <h4 class="text-red-400 font-bold">Switch Red (Linear)</h4>
                <p class="text-gray-400 text-sm">Movimento suave direto até o fim, sem clique nem barreira.<br><strong>Ideal para:</strong> Jogos competitivos (FPS) pela rapidez.<br><strong>Ruim para:</strong> Digitação (fácil de esbarrar em teclas erradas).</p>
              </div>
            </div>
            <div class="flex items-start gap-4 bg-[#171313] p-4 rounded-lg border border-yellow-900/50">
              <div class="w-4 h-4 rounded-full bg-[#8B4513] mt-1 shadow-[0_0_10px_rgba(139,69,19,0.8)] flex-shrink-0"></div>
              <div>
                <h4 class="text-[#D2691E] font-bold">Switch Brown (Tátil)</h4>
                <p class="text-gray-400 text-sm">O meio termo. Tem a resposta tátil (degrau) do Blue, mas é silencioso como o Red.<br><strong>Ideal para:</strong> Uso misto (Jogar e Trabalhar). O favorito para iniciantes.</p>
              </div>
            </div>
          </div>
      `,
      subsections: []
    },

    {
      title: "Tamanhos e Layouts",
      content: `
        <ul class="space-y-3 prose prose-invert">
            <li><strong>Full Size (100%):</strong> Padrão completo com numérico. Bom para planilhas. Ocupa muito espaço.</li>
            <li><strong>TKL (Tenkeyless - 80%):</strong> Sem o teclado numérico. Mais ergonômico, deixa mais espaço para o mouse. Padrão gamer.</li>
            <li><strong>60% / 65%:</strong> Ultracompactos. Removem as setas (no 60%) e teclas F1-F12. Para quem precisa de portabilidade máxima.</li>
          </ul>
      `,
      subsections: []
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/otimizacao-performance",
      title: "Otimização de Performance",
      description: "Dicas para deixar seu PC mais rápido."
    },
    {
      href: "/guias/seguranca-digital",
      title: "Segurança Digital",
      description: "Proteja seus dados."
    },
    {
      href: "/guias/manutencao-preventiva",
      title: "Manutenção Preventiva",
      description: "Cuidados essenciais com o hardware."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="15-20 min"
      difficultyLevel="Iniciante"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}
