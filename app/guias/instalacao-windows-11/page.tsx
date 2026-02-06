import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'instalacao-windows-11',
  title: "Como Instalar o Windows 11 do Zero: Tutorial Completo de Formatação (2026)",
  description: "Aprenda a criar um Pen Drive Bootável com Rufus, contornar requisitos de TPM 2.0 (se necessário) e fazer uma instalação limpa e otimizada do Windows 11.",
  category: 'windows-geral',
  difficulty: 'Intermediário',
  time: '60 min'
};

const title = "Instalação Limpa do Windows 11: Guia Passo a Passo com Otimização Inicial (2026)";
const description = "Formatar é a melhor forma de recuperar o desempenho. Guia detalhado desde o backup, criação da mídia de instalação até a configuração inicial sem conta Microsoft.";

const keywords = [
  'como formatar pc windows 11 pen drive',
  'instalar windows 11 pc não compatível rufus',
  'criar pen drive bootavel windows 11 media creation tool',
  'instalar windows 11 sem conta microsoft',
  'formatar ssd nvme gpt uefi',
  'windows 11 iso download oficial',
  'drivers pós formatação quais baixar',
  'backup arquivos antes formatar'
];

export const metadata: Metadata = createGuideMetadata('instalacao-windows-11', title, description, keywords);

export default function InstallWindowsGuide() {
  const summaryTable = [
    { label: "Ferramenta", value: "Rufus ou Media Creation Tool" },
    { label: "Pen Drive", value: "Mínimo 8GB" },
    { label: "Modo BIOS", value: "UEFI (Não use Legacy)" },
    { label: "Partição", value: "GPT (Obrigatório para Win11)" },
    { label: "Internet", value: "Desconecte na instalação" },
    { label: "TPM", value: "Rufus pode remover requisito" }
  ];

  const contentSections = [
    {
      title: "Por que fazer Instalação Limpa?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Atualizar do Windows 10 para o 11 pelo Windows Update geralmente traz "lixo" do sistema antigo: drivers obsoletos, entradas de registro quebradas e arquivos temporários. Uma <strong>Instalação Limpa</strong> (Clean Install) apaga tudo e instala o sistema fresco, garantindo máxima velocidade e estabilidade.
        </p>

        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 my-8">
            <h4 class="text-[#31A8FF] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">📦</span> Pós-Instalação Automática
            </h4>
            <p class="text-gray-300 mb-4">
                O pesadelo de formatar é reinstalar drivers e configurar tudo de novo. O <strong>Voltris Optimizer</strong> atua como um "Ninite" turbinado: ele instala seus Visual C++, DirectX, navegadores e otimiza o Windows recém-instalado em um único clique.
            </p>
            <a href="/voltrisoptimizer" class="group relative inline-flex px-8 py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] items-center justify-center gap-2">
                Preparar Pós-Instalação
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        </div>
      `
    },
    {
      title: "Passo 1: Criando o Pen Drive (Rufus)",
      content: `
        <p class="mb-4 text-gray-300">
            Recomendamos o Rufus em vez da ferramenta oficial da Microsoft, pois ele permite personalizações úteis.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
            <li>Baixe a ISO do Windows 11 no site oficial da Microsoft.</li>
            <li>Baixe e abra o Rufus.</li>
            <li>Selecione seu Pen Drive em "Dispositivo".</li>
            <li>Selecione a ISO que você baixou.</li>
            <li><strong>Esquema de Partição:</strong> GPT.</li>
            <li><strong>Sistema de Destino:</strong> UEFI (não CSM).</li>
            <li>Clique em Iniciar. Uma janela abrirá perguntando sobre "Hacks".
                <ul class="ml-6 mt-2 text-sm text-[#31A8FF] list-none space-y-1">
                    <li>[x] Remover requisitos de 4GB RAM e Secure Boot (Marque se seu PC for antigo).</li>
                    <li>[x] Remover necessidade de Conta Microsoft Online (Essencial para privacidade).</li>
                    <li>[x] Desativar coleta de dados (Perguntas de privacidade).</li>
                </ul>
            </li>
            <li>Aguarde finalizar.</li>
        </ol>
      `
    },
    {
      title: "Passo 2: BIOS e Boot",
      content: `
        <p class="mb-4 text-gray-300">
            Com o Pen Drive pronto, reinicie o PC.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>Ao ligar, fique apertando a tecla de BOOT MENU (Geralmente F8, F11, F12 ou Delete, dependendo da placa-mãe).</li>
            <li>Selecione o Pen Drive (ex: "UEFI: SanDisk").</li>
            <li>O instalador do Windows iniciará.</li>
        </ul>
      `
    },
    {
      title: "Passo 3: Particionamento",
      content: `
        <p class="mb-4 text-gray-300">
            Na tela "Onde você quer instalar o Windows?":
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>Se você quer apagar tudo (Clean Install): Exclua TODAS as partições do Disco 0 até sobrar apenas "Espaço Não Alocado".</li>
            <li>Selecione o espaço não alocado e clique em Avançar. O Windows criará as partições de recuperação e sistema automaticamente.</li>
            <li><strong>Dica:</strong> Se tiver mais de um HD/SSD, cuidado para não apagar o disco errado (Backup/Jogos). Identifique pelo tamanho (GB).</li>
        </ul>
      `
    }
  ];

  const advancedContentSections = [
    {
      title: "Instalando Sem Conta Microsoft (OOBE Bypass)",
      content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-white font-bold mb-4 text-xl">O Truque do "Eu não tenho internet"</h4>
                <p class="text-gray-300 mb-4">
                    Se você não usou o Rufus para remover a conta online, o Windows 11 te obriga a conectar na internet.
                </p>
                <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
                    <li>Na tela de "Vamos conectar você a uma rede", pressione <strong>Shift + F10</strong>.</li>
                    <li>O CMD abrirá. Digite: <code>OOBE\\BYPASSNRO</code> e dê Enter.</li>
                    <li>O PC vai reiniciar.</li>
                    <li>Agora aparecerá um botão "Eu não tenho internet". Clique nele e prossiga com Conta Local.</li>
                </ol>
            </div>
            `
    }
  ];

  const additionalContentSections = [
    {
      title: "Drivers Essenciais Pós-Formatação",
      content: `
            <div class="space-y-4">
               <div class="bg-gray-800 p-4 rounded-lg">
                    <h5 class="text-blue-400 font-bold mb-2">1. Windows Update</h5>
                    <p class="text-gray-300 text-sm">
                        Rode o Windows Update até não ter mais nada. Ele instala 90% dos drivers (Chipset, Áudio, Rede).
                    </p>
               </div>
               <div class="bg-gray-800 p-4 rounded-lg">
                    <h5 class="text-green-400 font-bold mb-2">2. Driver de Vídeo (GPU)</h5>
                    <p class="text-gray-300 text-sm">
                        Baixe manualmente no site da Nvidia/AMD. O driver do Windows Update é uma versão genérica e desatualizada.
                    </p>
               </div>
            </div>
            `
    }
  ];

  const faqItems = [
    {
      question: "Perco minha licença original do Windows?",
      answer: "Não. Se o seu PC já veio com Windows 10/11 ou você comprou e ativou, a licença está atrelada à placa-mãe (Licença Digital). Ao formatar e conectar na internet, o Windows se ativa sozinho. Escolha 'Não tenho a chave do produto' durante a instalação."
    },
    {
      question: "GPT ou MBR?",
      answer: "Para Windows 11, use <strong>GPT</strong>. O padrão MBR é antigo (Legacy BIOS) e não suporta Secure Boot nem discos maiores que 2TB. Só use MBR se seu PC for muito antigo (pré-2012)."
    },
    {
      question: "Formatar estraga o SSD?",
      answer: "Não. A formatação moderna é apenas uma escrita de dados. O SSD tem vida útil de centenas de terabytes. Formatar uma vez por ano não faz nem cócegas na vida útil dele."
    }
  ];

  const externalReferences = [
    { name: "Microsoft - Download Windows 11 ISO", url: "https://www.microsoft.com/software-download/windows11" },
    { name: "Rufus - Create Bootable USB", url: "https://rufus.ie/" }
  ];

  const relatedGuides = [
    {
      href: "/guias/debloating-windows-11",
      title: "O que fazer após instalar?",
      description: "Aprenda a remover o lixo que vem na instalação padrão."
    },
    {
      href: "/guias/otimizacao-ssd-windows-11",
      title: "Otimizar SSD",
      description: "Configurações essenciais para seu NVMe novo."
    },
    {
      href: "/guias/instalacao-limpa-drivers-nvidia-amd",
      title: "Instalar Drivers Corretamente",
      description: "Evite conflitos instalando a GPU do jeito certo."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="60 min"
      difficultyLevel="Intermediário"
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
