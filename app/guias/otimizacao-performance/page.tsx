import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Otimização de Performance: Como deixar seu PC voando em 2026";
const description = "Seu Windows está lento? Aprenda as melhores técnicas de otimização de sistema para reduzir o uso de RAM e CPU e ter a máxima performance em jogos e trabalho.";
const keywords = [
  'como otimizar windows 11 para performance 2026',
  'melhorar desempenho pc lento windows 10 tutorial',
  'otimização de sistema para ganhar fps 2026',
  'limpeza e aceleração de windows profissional',
  'deixar windows 11 mais rápido guia definitivo'
];

export const metadata: Metadata = createGuideMetadata('otimizacao-performance', title, description, keywords);

export default function PerformanceOptimizationGuide() {
  const summaryTable = [
    { label: "Check #1", value: "Desativar Apps em Segundo Plano" },
    { label: "Check #2", value: "Ajustar Efeitos Visuais (Melhor Desempenho)" },
    { label: "Check #3", value: "Plano de Energia (Alta Performance)" },
    { label: "Dificuldade", value: "Fácil" }
  ];

  const contentSections = [
    {
      title: "O que realmente funciona na Otimização?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Muitos programas prometem "acelerar o PC com um clique", mas a maioria é apenas publicidade. A verdadeira otimização consiste em remover o que não é usado e garantir que o Windows não limite o poder do seu hardware. Em 2026, com o Windows 11 mais pesado, esses ajustes manuais são a diferença entre um PC que "engasga" e um que responde instantaneamente.
        </p>
      `
    },
    {
      title: "1. Efeitos Visuais: Menos Estética, Mais Velocidade",
      content: `
        <p class="mb-4 text-gray-300">As transparências e animações do Windows consomem ciclos da sua GPU. Vamos desativá-las:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Pesquise por <strong>'Ajustar a aparência e o desempenho do Windows'</strong>.</li>
            <li>Selecione 'Ajustar para obter o melhor desempenho'.</li>
            <li>Marque apenas: <i>'Usar sombras subjacentes em rótulos de ícones'</i> e <i>'Mostrar sombras sob janelas'</i> para não ficar feio demais.</li>
            <li>Clique em Aplicar. As janelas abrirão muito mais rápido agora.</li>
        </ol>
      `
    },
    {
      title: "2. Gerenciamento de Inicialização",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Truque da RAM:</h4>
            <p class="text-sm text-gray-300">
                Aperte <code>Ctrl + Shift + Esc</code> e vá na aba <strong>Aplicativos de Inicialização</strong>. Desative TUDO o que você não precisa que ligue com o Windows (Spotify, Steam, Cortana, etc). Isso reduz o tempo de boot e libera RAM preciosa para seus jogos.
            </p>
        </div>
      `
    },
    {
      title: "3. O Plano de Energia Oculto",
      content: `
        <p class="mb-4 text-gray-300">
            O Windows costuma vir no modo 'Equilibrado' para economizar luz. Se quiser potência total:
            <br/>Vá em Painel de Controle > Hardware e Sons > Opções de Energia. Escolha <strong>'Alto Desempenho'</strong>. Se você tiver um processador Ryzen ou Core de 13ª/14ª geração, procure pelo modo 'Desempenho Máximo' (Ultimate Performance).
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/debloating-windows-11",
      title: "Debloat Windows",
      description: "Aprofunde a limpeza com scripts."
    },
    {
      href: "/guias/aceleracao-hardware-gpu-agendamento",
      title: "Agendamento de GPU",
      description: "Dica vital para Windows 11 e placas modernas."
    },
    {
      href: "/guias/manutencao-preventiva-computador",
      title: "Manutenção Preventiva",
      description: "Como manter o PC sempre rápido."
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
