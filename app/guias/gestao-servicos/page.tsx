import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Gestão de Serviços do Windows: O que desativar com segurança";
const description = "Seu Windows tem centenas de serviços rodando sem necessidade. Aprenda a gerenciar o services.msc para liberar memória RAM e CPU sem quebrar o sistema.";
const keywords = [
  'quais serviços do windows 11 posso desativar 2026',
  'como abrir o services.msc tutorial windows',
  'desativar serviços inuteis windows para ganhar fps',
  'gestao de serviços windows 10 guia completo',
  'configurar serviços de telemetria e rastreamento'
];

export const metadata: Metadata = createGuideMetadata('gestao-servicos', title, description, keywords);

export default function ServicesManagementGuide() {
  const summaryTable = [
    { label: "Atalho", value: "Win + R > services.msc" },
    { label: "Risco", value: "Moderado (Sempre crie um ponto de restauração)" },
    { label: "Serviço Chave", value: "SysMain / Print Spooler / Telemetria" },
    { label: "Dificuldade", value: "Intermediária" }
  ];

  const contentSections = [
    {
      title: "O que são Serviços e por que gerenciar?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Serviços são programas invisíveis que o Windows carrega antes mesmo de você fazer o login. Eles controlam tudo, desde a sua conexão Wi-Fi até a sua impressora. O problema é que o Windows carrega serviços de telemetria, detecção de erros e serviços legados que você nunca vai usar, mas que continuam consumindo frações do seu processador e memória.
        </p>
      `
    },
    {
      title: "1. Como abrir e entender os Status",
      content: `
        <p class="mb-4 text-gray-300">Aperte <code>Win + R</code> e digite <code>services.msc</code>.</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Automático:</strong> O serviço inicia com o Windows (Mais pesado).</li>
            <li><strong>Manual:</strong> O serviço só inicia quando um programa pedir (Recomendado para maioria).</li>
            <li><strong>Desativado:</strong> O serviço nunca inicia (Ganha mais performance, mas pode quebrar recursos).</li>
        </ul>
      `
    },
    {
      title: "2. Serviços Seguros para Desativar (Ajuste Fino)",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Lista de Sugestões:</h4>
            <ul class="text-sm text-gray-300 space-y-2">
                <li><strong>Spooler de Impressão:</strong> Se você não tem impressora, desative.</li>
                <li><strong>SysMain:</strong> Essencial desativar se você usa um HD mecânico lento.</li>
                <li><strong>Telemetria / Experiência do Usuário Conectado:</strong> Pode desativar sem medo para ganhar privacidade.</li>
                <li><strong>Serviço de Fax / Telefonia:</strong> Obsoletos em 2026.</li>
            </ul>
        </div>
      `
    },
    {
      title: "3. O que NUNCA desativar",
      content: `
        <p class="mb-4 text-gray-300 border-l-4 border-red-500 pl-4 bg-red-900/10 p-4 rounded">
            Cuidado com serviços que contenham nomes como <strong>RPC, DCOM, Plug and Play ou Gerenciador de Contas</strong>. Se você desativar esses serviços vitais, o Windows pode parar de reconhecer seu mouse, teclado ou até mesmo impedir que você faça login novamente.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/debloating-windows-11",
      title: "Debloat Windows",
      description: "Scripts que automatizam a gestão de serviços."
    },
    {
      href: "/guias/criar-ponto-restauracao-windows",
      title: "Ponto de Restauração",
      description: "Crie um backup antes de mexer nos serviços."
    },
    {
      href: "/guias/otimizacao-performance",
      title: "Otimizar PC",
      description: "Maximize o desempenho do seu computador."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="30 min"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}