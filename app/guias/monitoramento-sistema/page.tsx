import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = 'Monitoramento Completo do Sistema Windows';
const description = 'Aprenda a monitorar recursos do sistema em tempo real, identificar gargalos de performance e prevenir problemas antes que eles afetem seu trabalho. Ferramentas profissionais e métricas essenciais.';
const keywords = [
  'monitoramento sistema',
  'performance Windows',
  'uso CPU',
  'uso memória RAM',
  'monitoramento disco',
  'temperatura sistema',
  'ferramentas monitoramento',
  'Task Manager avançado',
  'Resource Monitor',
  'Performance Monitor',
  'análise sistema',
  'otimização performance',
  'identificar gargalos'
];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function MonitoramentoSistemaGuide() {
  const contentSections = [
    {
      title: "Importância do Monitoramento do Sistema",
      content: `
        <p class="mb-4">O monitoramento contínuo do sistema permite identificar problemas de performance antes que eles impactem sua produtividade. Muitos usuários só percebem que há um problema quando o computador já está extremamente lento ou travando.</p>
        <p class="mb-4">Com monitoramento proativo, você pode:</p>
        <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
          <li>Identificar programas que consomem recursos excessivos</li>
          <li>Prevenir superaquecimento de componentes</li>
          <li>Detectar vazamentos de memória</li>
          <li>Planejar upgrades de hardware</li>
          <li>Otimizar o uso de recursos do sistema</li>
        </ul>
        <p>Esta prática é essencial tanto para usuários domésticos quanto para ambientes corporativos, onde downtime pode ter custos significativos.</p>
      `,
      subsections: []
    },
    {
      title: "Ferramentas de Monitoramento Nativas do Windows",
      content: "",
      subsections: [
        {
          subtitle: "Gerenciador de Tarefas Avançado",
          content: `
            <p>O Gerenciador de Tarefas vai além do básico:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Pressione <kbd class="bg-[#2a2a2e] px-2 py-1 rounded">Ctrl + Shift + Esc</kbd></li>
              <li>Vá na aba "Desempenho" para visão geral</li>
              <li>Clique em cada componente (CPU, Memória, Disco, Rede) para detalhes</li>
              <li>Na aba "Detalhes", veja todos os processos em execução</li>
              <li>Ordene por colunas para identificar os maiores consumidores de recursos</li>
            </ol>
            <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30 mt-4">
              <p class="text-white font-semibold mb-2">💡 Dica Profissional:</p>
              <p class="text-gray-300 leading-relaxed">
                Configure o Gerenciador de Tarefas para iniciar minimizado: Opções > Iniciar minimizado na área de notificação.
              </p>
            </div>
          `
        },
        {
          subtitle: "Monitor de Recursos (Resource Monitor)",
          content: `
            <p>Ferramenta mais detalhada que o Gerenciador de Tarefas:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Pressione <kbd class="bg-[#2a2a2e] px-2 py-1 rounded">Windows + R</kbd></li>
              <li>Digite <code class="bg-[#2a2a2e] px-2 py-1 rounded">resmon</code> e pressione Enter</li>
              <li>Visualize uso detalhado de CPU, Disco, Rede e Memória</li>
              <li>Identifique processos associados a arquivos e portas específicas</li>
              <li>Monitore processos em espera e bloqueios de recursos</li>
            </ol>
          `
        },
        {
          subtitle: "Monitor de Desempenho (Performance Monitor)",
          content: `
            <p>Para monitoramento avançado e histórico:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Pressione <kbd class="bg-[#2a2a2e] px-2 py-1 rounded">Windows + R</kbd></li>
              <li>Digite <code class="bg-[#2a2a2e] px-2 py-1 rounded">perfmon</code> e pressione Enter</li>
              <li>Adicione contadores para monitorar métricas específicas</li>
              <li>Crie logs históricos de performance</li>
              <li>Configure alertas para valores críticos</li>
            </ol>
          `
        }
      ]
    },
    {
      title: "Métricas Críticas para Monitorar",
      content: "",
      subsections: [
        {
          subtitle: "CPU (Processador)",
          content: `
            <p>Indicadores importantes:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li><strong>Uso médio:</strong> Ideal abaixo de 80% durante uso normal</li>
              <li><strong>Picos:</strong> Momentâneos acima de 90% são normais</li>
              <li><strong>Temperatura:</strong> Abaixo de 80°C sob carga</li>
              <li><strong>Frequência:</strong> Deve variar conforme demanda</li>
            </ul>
          `
        },
        {
          subtitle: "Memória RAM",
          content: `
            <p>Parâmetros essenciais:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li><strong>Uso total:</strong> Abaixo de 85% do total disponível</li>
              <li><strong>Commit charge:</strong> Não deve ultrapassar memória física</li>
              <li><strong>Paging:</strong> Taxa de paginação baixa (< 10 MB/s)</li>
              <li><strong>Standby list:</strong> Grande parte da memória deve estar aqui</li>
            </ul>
          `
        },
        {
          subtitle: "Disco Rígido/SSD",
          content: `
            <p>Métricas de armazenamento:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li><strong>Utilização:</strong> Abaixo de 100% continuamente</li>
              <li><strong>Latência média:</strong> Abaixo de 100ms para HDD, 10ms para SSD</li>
              <li><strong>Taxa de transferência:</strong> Próxima às especificações do drive</li>
              <li><strong>Fila de espera:</strong> Abaixo de 2 para bom desempenho</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Ferramentas de Terceiros Recomendadas",
      content: "",
      subsections: [
        {
          subtitle: "HWiNFO64",
          content: `
            <p>Monitoramento completo de hardware:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li>Temperaturas de todos os componentes</li>
              <li>Voltagens e frequências reais</li>
              <li>Informações detalhadas de hardware</li>
              <li>Histórico de leituras</li>
              <li>Alertas configuráveis</li>
            </ul>
          `
        },
        {
          subtitle: "Process Explorer",
          content: `
            <p>Substituto avançado do Gerenciador de Tarefas:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li>Hierarquia completa de processos</li>
              <li>Handles e DLLs carregadas</li>
              <li>Análise de consumo detalhada</li>
              <li>Kill de processos problemáticos</li>
            </ul>
          `
        },
        {
          subtitle: "CrystalDiskInfo",
          content: `
            <p>Específico para saúde de discos:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li>Status S.M.A.R.T. em tempo real</li>
              <li>Temperatura do disco</li>
              <li>Horas de uso acumuladas</li>
              <li>Previsão de falhas</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Criação de Scripts de Monitoramento",
      content: `
        <p>Você pode automatizar o monitoramento com scripts PowerShell:</p>
        <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30 mt-4">
          <p class="text-white font-semibold mb-2">📝 Script de Monitoramento Básico:</p>
          <pre class="text-gray-300 text-sm overflow-x-auto">
# Monitorar uso de CPU e memória
while ($true) {
  $cpu = (Get-Counter "\Processor(_Total)\% Processor Time").CounterSamples.CookedValue
  $mem = (Get-Counter "\Memory\Available MBytes").CounterSamples.CookedValue
  
  Write-Host "CPU: $([math]::Round($cpu, 2))% | Memória Disponível: $mem MB" -ForegroundColor Green
  Start-Sleep 5
}
          </pre>
        </div>
      `,
      subsections: []
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/diagnostico-hardware",
      title: "Diagnóstico de Falhas de Hardware",
      description: "Identifique problemas físicos de componentes com ferramentas especializadas."
    },
    {
      href: "/guias/otimizacao-performance",
      title: "Otimização de Performance",
      description: "Técnicas avançadas para melhorar o desempenho do seu sistema."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="25 minutos"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
      author="Equipe Técnica Voltris"
      lastUpdated="Janeiro 2025"
    />
  );
}