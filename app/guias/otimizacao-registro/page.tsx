import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'otimizacao-registro-windows',
  title: "Otimização de Registro do Windows: Tweaks Reais vs Mitos (2026)",
  description: "Aprenda quais chaves do Regedit realmente melhoram a latência e responsividade (MenuShowDelay, Win32Priority) e quais são puro efeito placebo.",
  category: 'otimizacao',
  difficulty: 'Avançado',
  time: '25 min'
};

const title = "Guia de Regedit: Otimizações de Verdade para Windows 11 (Sem Placebo)";
const description = "Pare de copiar arquivos .reg da internet que estragam seu PC. Saiba exatamente o que o MenuShowDelay, WaitToKillServiceTimeout e SystemResponsiveness fazem.";

const keywords = [
  'melhores tweaks regedit windows 11',
  'diminuir delay menu iniciar regedit',
  'win32priorityseparation jogos valor ideal',
  'networkthrottlingindex ffffffff funciona',
  'desativar dvr jogos regedit',
  'systemresponsiveness games',
  'backup registro windows como fazer',
  'regedit mouse fix acceleration'
];

export const metadata: Metadata = createGuideMetadata('otimizacao-registro-windows', title, description, keywords);

export default function RegistryGuide() {
  const summaryTable = [
    { label: "Ferramenta", value: "Editor de Registro (Regedit)" },
    { label: "Risco", value: "Alto (Faça Backup!)" },
    { label: "MenuShowDelay", value: "Deixa menus instantâneos" },
    { label: "Prioridade de CPU", value: "Prioriza programa em foco" },
    { label: "Mito", value: "Regedit não aumenta FPS bruto" },
    { label: "Foco", value: "Responsividade e Latência" }
  ];

  const contentSections = [
    {
      title: "O que é o Registro do Windows?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Registro é o cérebro do Windows. É um banco de dados gigante onde ficam todas as configurações. Alterar valores aqui pode mudar comportamentos profundos que não existem no menu de Configurações.
        </p>

        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 my-8">
            <h4 class="text-[#31A8FF] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">⚠️</span> Backup Automático Voltris
            </h4>
            <p class="text-gray-300 mb-4">
                Um erro de digitação no Regedit pode impedir o Windows de ligar. O <strong>Voltris Optimizer</strong> faz um backup automático de chaves críticas antes de aplicar qualquer otimização, permitindo desfazer tudo com um clique se algo der errado.
            </p>
            <a href="/voltrisoptimizer" class="group relative inline-flex px-8 py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] items-center justify-center gap-2">
                Otimizar com Segurança
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        </div>
      `
    },
    {
      title: "Tweak 1: Menus Instantâneos (MenuShowDelay)",
      content: `
        <p class="mb-4 text-gray-300">
            O Windows espera 400ms (quase meio segundo) propositalmente antes de abrir um submenu quando você passa o mouse. Vamos zerar isso.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 bg-[#0A0A0F] p-4 rounded-xl border border-white/5 font-mono text-sm">
            <li>Win + R > regedit.</li>
            <li>Navegue até: <code>HKEY_CURRENT_USER\\Control Panel\\Desktop</code>.</li>
            <li>No lado direito, ache <strong>MenuShowDelay</strong>.</li>
            <li>Mude o valor de 400 para <strong>0</strong> (ou 50 se achar muito rápido).</li>
            <li>Reinicie o PC. A sensação de fluidez é imediata.</li>
        </ol>
      `
    },
    {
      title: "Tweak 2: Prioridade de Jogos (Win32PrioritySeparation)",
      content: `
        <p class="mb-4 text-gray-300">
            Define quanta CPU o Windows dá para o programa em primeiro plano (Jogo) vs serviços de fundo.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>Caminho: <code>HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl</code>.</li>
            <li>Chave: <strong>Win32PrioritySeparation</strong>.</li>
            <li>Valor (Hexadecimal):
                <ul class="ml-6 mt-1 text-[#31A8FF]">
                    <li><strong>26</strong> (Hex) ou 38 (Decimal): Padrão otimizado para processos em primeiro plano. Equilíbrio ideal para a maioria.</li>
                    <li><strong>16</strong> (Hex) ou 22 (Decimal): Foco agressivo no primeiro plano. Pode causar stutter em Discord/OBS de fundo.</li>
                </ul>
            </li>
        </ul>
      `
    },
    {
      title: "Tweak 3: Throttling de Rede (NetworkThrottlingIndex)",
      content: `
        <p class="mb-4 text-gray-300">
            O Windows limita o tráfego de rede de processos não-multimídia para economizar bateria/recursos. Em redes Gigabit modernas, isso é desnecessário.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>Caminho: <code>HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile</code>.</li>
            <li>Chave: <strong>NetworkThrottlingIndex</strong>.</li>
            <li>Valor padrão: 10 (Decimal).</li>
            <li>Mude para: <strong>FFFFFFFF</strong> (Hexadecimal). Isso desativa o limitador completamente.</li>
        </ul>
      `
    }
  ];

  const advancedContentSections = [
    {
      title: "CUIDADO: O Mito do 'LargeSystemCache'",
      content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-yellow-400 font-bold mb-4 text-xl">Não ative isso!</h4>
                <p class="text-gray-300 mb-4">
                    Muitos guias mandam ativar o <code>LargeSystemCache</code> dizendo que melhora jogos. Isso é FALSO. Essa configuração é para SERVIDORES de arquivos.
                </p>
                <p class="text-gray-300 text-sm">
                    Ativar isso em um PC Gamer faz o Windows roubar toda a memória RAM física para cache de disco, tirando RAM do jogo e causando travamentos (Swap). Mantenha em 0.
                </p>
            </div>
            `
    }
  ];

  const additionalContentSections = [
    {
      title: "GameDVR (Gravação de Fundo)",
      content: `
            <p class="mb-4 text-gray-300">
                Se você não usa o Xbox Game Bar para clipar, desative via Regedit para garantir que ele não está gravando escondido.
            </p>
            <p class="text-gray-300 text-sm font-mono">
                HKEY_CURRENT_USER\\System\\GameConfigStore -> GameDVR_Enabled = 0.<br/>
                HKEY_LOCAL_MACHINE\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR -> AllowGameDVR = 0.
            </p>
            `
    }
  ];

  const faqItems = [
    {
      question: "Como faço backup do registro?",
      answer: "No Regedit, clique em 'Arquivo' (topo esquerdo) > 'Exportar'. Salve como 'Backup_Antes_De_Mexer.reg'. Se algo der errado, é só dar duplo clique nesse arquivo para restaurar tudo."
    },
    {
      question: "Cleaners de registro (CCleaner) prestam?",
      answer: "Eles removem chaves órfãs (de programas desinstalados), o que libera alguns KB de espaço, mas NÃO melhora desempenho. O risco de deletar uma chave importante é maior que o benefício. O Windows moderno lida bem com chaves órfãs."
    },
    {
      question: "Preciso reiniciar?",
      answer: "Sim. Nenhuma alteração no Registro (HKEY_LOCAL_MACHINE) tem efeito até o Windows reiniciar e reler o banco de dados."
    }
  ];

  const externalReferences = [
    { name: "Microsoft Docs - Registry Optimization", url: "https://learn.microsoft.com/en-us/windows-server/administration/performance-tuning/role/file-server/" },
    { name: "Backup Registry Guide", url: "https://support.microsoft.com/en-us/topic/how-to-back-up-and-restore-the-registry-in-windows-855140ad-e318-2a13-2829-d428a2ab0692" }
  ];

  const relatedGuides = [
    {
      href: "/guias/reduzir-ping-regedit-cmd-jogos",
      title: "Regedit Network",
      description: "Chaves focadas em TcpAckFrequency e Nagle."
    },
    {
      href: "/guias/otimizacao-ssd-windows-11",
      title: "SSD Tweaks",
      description: "Ajustes de registro para storport."
    },
    {
      href: "/guias/debloating-windows-11",
      title: "Limpeza Geral",
      description: "Menos processos = Registro menos acessado."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="25 min"
      difficultyLevel="Avançado"
      contentSections={contentSections}
      advancedContentSections={advancedContentSections}
      additionalContentSections={additionalContentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
      faqItems={faqItems}
      externalReferences={externalReferences}
    />
  );
}