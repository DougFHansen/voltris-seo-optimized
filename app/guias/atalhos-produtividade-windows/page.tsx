import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Atalhos do Windows: Como navegar no sistema sem o mouse";
const description = "Domine o Windows 11 com os atalhos de teclado mais úteis para produtividade. Aprenda a gerenciar janelas, áreas de trabalho e ferramentas ocultas em 2026.";
const keywords = [
  'melhores atalhos windows 11 produtividade 2026',
  'como usar atalhos de janelas windows snap layout',
  'atalhos teclado windows para abrir gerenciador de tarefas',
  'alternar entre area de trabalho virtual atalho',
  'comando de atalho para tirar print da tela windows'
];

export const metadata: Metadata = createGuideMetadata('atalhos-produtividade-windows', title, description, keywords);

export default function WindowsShortcutsGuide() {
  const summaryTable = [
    { label: "Mudar de Janela", value: "Alt + Tab" },
    { label: "Abrir Explorer", value: "Win + E" },
    { label: "Bloquear PC", value: "Win + L" },
    { label: "Captura de Tela", value: "Win + Shift + S" }
  ];

  const contentSections = [
    {
      title: "O Teclado é mais rápido que o Mouse",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          No Windows 11, a Microsoft adicionou dezenas de novos atalhos para facilitar a vida de quem trabalha com muitas janelas abertas. Usar a tecla <strong>Windows (Win)</strong> em combinação com outras teclas pode transformar ações que levariam segundos de "caça aos ícones" em algo instantâneo.
        </p>
      `
    },
    {
      title: "1. Organização de Janelas (Snap Layouts)",
      content: `
        <p class="mb-4 text-gray-300">Pare de redimensionar janelas manualmente:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Win + Seta para Esquerda/Direita:</strong> "Gruda" a janela em metade da tela.</li>
            <li><strong>Win + Z:</strong> Abre o menu de layouts de encaixe (exclusivo Windows 11).</li>
            <li><strong>Win + D:</strong> Minimiza tudo e mostra a área de trabalho. Aperte novamente para voltar tudo como estava.</li>
            <li><strong>Win + M:</strong> Minimiza todas as janelas (diferente do Win+D, ele não 'restaura' ao apertar de novo).</li>
        </ul >
      `
    },
    {
      title: "2. Ferramentas Indispensáveis",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Poupe Cliques:</h4>
            <p class="text-sm text-gray-300">
                - <strong>Win + V:</strong> Abre o <strong>Histórico da Área de Transferência</strong>. Permite escolher entre os últimos 20 itens que você copiou (textos ou fotos). <br/>
                - <strong>Win + . (ponto):</strong> Abre o seletor de Emojis, GIFs e Símbolos matemáticos. <br/>
                - <strong>Ctrl + Shift + Esc:</strong> Abre o Gerenciador de Tarefas direto, sem passar pela tela azul do 'Ctrl+Alt+Del'. <br/>
                - <strong>Win + I:</strong> Abre as Configurações do Windows.
            </p>
        </div>
      `
    },
    {
      title: "3. Áreas de Trabalho Virtuais",
      content: `
        <p class="mb-4 text-gray-300">
            Quer separar o trabalho dos jogos sem fechar nada? 
            <br/>Aperte <strong>Win + Tab</strong> para ver todas as áreas de trabalho. Use <strong>Ctrl + Win + D</strong> para criar uma nova e <strong>Ctrl + Win + Setas</strong> para alternar entre elas. É como ter dois ou três monitores em um só.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/atalhos-navegador-produtividade",
      title: "Atalhos Navegador",
      description: "Combine com os atalhos do Windows."
    },
    {
      href: "/guias/grava%C3%A7%C3%A3o-tela-windows-nativa-dicas",
      title: "Gravar Tela",
      description: "Atalhos para capturar vídeos."
    },
    {
      href: "/guias/otimizacao-performance",
      title: "Otimizar Sistema",
      description: "Melhore a resposta do sistema aos comandos."
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
      relatedGuides={relatedGuides}
    />
  );
}
