import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Atalhos de Teclado Essenciais para Produtividade no Windows";
const description = "Domine o Windows com atalhos de teclado que economizam horas de trabalho. Guia completo para usuários básicos e avançados, incluindo gerenciamento de janelas e desktops virtuais.";
const keywords = ["atalhos windows","produtividade","win key","alt tab","atalhos navegador"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [

    {
      title: "Atalhos de Gerenciamento de Janelas",
      content: `
        <p class="mb-4 text-gray-300">O gerenciamento eficiente de janelas é a base da produtividade. Pare de arrastar janelas com o mouse e comece a usar o teclado.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-[#1E1E22] p-4 rounded-lg border-l-4 border-[#31A8FF]">
              <h4 class="text-white font-bold mb-2">Snap Layouts</h4>
              <ul class="space-y-2 text-sm text-gray-400">
                <li><strong class="text-[#31A8FF]">Win + ← / →</strong>: Fixar janela na metade esquerda ou direita.</li>
                <li><strong class="text-[#31A8FF]">Win + ↑ / ↓</strong>: Maximizar ou minimizar janela.</li>
                <li><strong class="text-[#31A8FF]">Win + Z</strong>: Abrir menu de layouts de encaixe (Windows 11).</li>
              </ul>
            </div>
            <div class="bg-[#1E1E22] p-4 rounded-lg border-l-4 border-[#8B31FF]">
              <h4 class="text-white font-bold mb-2">Desktops Virtuais</h4>
              <ul class="space-y-2 text-sm text-gray-400">
                <li><strong class="text-[#8B31FF]">Win + Tab</strong>: Visão de Tarefas (Timeline).</li>
                <li><strong class="text-[#8B31FF]">Win + Ctrl + D</strong>: Criar novo desktop virtual.</li>
                <li><strong class="text-[#8B31FF]">Win + Ctrl + ← / →</strong>: Alternar entre desktops.</li>
              </ul>
            </div>
          </div>
      `,
      subsections: []
    },

    {
      title: "Navegação e Sistema",
      content: `
        <div class="prose prose-invert max-w-none">
            <p>Atalhos que controlam o sistema operacional e a exploração de arquivos.</p>
            <table class="w-full text-left text-sm text-gray-400 border-collapse">
              <thead class="bg-[#171313] text-gray-200">
                <tr><th class="p-2 border border-gray-700">Atalho</th><th class="p-2 border border-gray-700">Função</th></tr>
              </thead>
              <tbody>
                <tr><td class="p-2 border border-gray-700 font-mono text-[#31A8FF]">Win + E</td><td class="p-2 border border-gray-700">Abrir Explorador de Arquivos</td></tr>
                <tr><td class="p-2 border border-gray-700 font-mono text-[#31A8FF]">Win + X</td><td class="p-2 border border-gray-700">Menu Link Rápido (Menu Iniciar 'secreto')</td></tr>
                <tr><td class="p-2 border border-gray-700 font-mono text-[#31A8FF]">Win + L</td><td class="p-2 border border-gray-700">Bloquear o computador instantaneamente</td></tr>
                <tr><td class="p-2 border border-gray-700 font-mono text-[#31A8FF]">Win + V</td><td class="p-2 border border-gray-700">Histórico da Área de Transferência (Clipboard)</td></tr>
                <tr><td class="p-2 border border-gray-700 font-mono text-[#31A8FF]">Win + Shift + S</td><td class="p-2 border border-gray-700">Captura de Tela (Snipping Tool)</td></tr>
              </tbody>
            </table>
          </div>
      `,
      subsections: []
    },

    {
      title: "Dica Pro: Histórico da Área de Transferência",
      content: `
        <div class="bg-gradient-to-r from-[#171313] to-[#1E1E22] p-6 rounded-xl border border-yellow-500/30">
            <h3 class="text-yellow-400 font-bold mb-3 flex items-center gap-2">🚀 Recurso Subestimado</h3>
            <p class="text-gray-300 mb-4">Muitos usuários ignoram o <strong>Win + V</strong>. Ao ativá-lo, você pode copiar vários itens (textos, imagens) sequencialmente e depois colar qualquer um deles escolhendo na lista. Isso elimina a necessidade de alternar janelas repetidamente para copiar e colar.</p>
            <p class="text-sm text-gray-500">Nota: Requer ativação na primeira vez que você pressiona o atalho.</p>
          </div>
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
