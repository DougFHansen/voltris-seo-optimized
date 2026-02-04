import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Atualizar Drivers de Vídeo (NVIDIA, AMD e Intel) em 2026";
const description = "Seu jogo está travando ou com artefatos? Aprenda a manter seus drivers de vídeo atualizados e como fazer uma instalação limpa para máxima performance.";
const keywords = [
  'como atualizar drivers de vídeo nvidia amd intel 2026',
  'melhor driver nvidia para performance tutorial',
  'atualizar driver amd adrenalin passo a passo',
  'erro de driver de video parou de responder como resolver',
  'instalar driver de video windows 11 manual ou automatico'
];

export const metadata: Metadata = createGuideMetadata('atualizacao-drivers-video', title, description, keywords);

export default function VideoDriverGuide() {
  const summaryTable = [
    { label: "NVIDIA", value: "NVIDIA App / GeForce Experience" },
    { label: "AMD", value: "AMD Software: Adrenalin Edition" },
    { label: "Intel", value: "Assistente de Driver e Suporte Intel" },
    { label: "Check Vital", value: "Remover driver antigo antes de trocar placa" }
  ];

  const contentSections = [
    {
      title: "Por que os Drivers são tão importantes?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O driver de vídeo é o manual de instruções que o Windows usa para conversar com a sua placa de vídeo. Sem ele, sua GPU de R$ 3.000 é apenas um pedaço de metal caro. Em 2026, as fabricantes lançam atualizações chamadas 'Game Ready' quase toda semana, corrigindo bugs específicos de lançamentos de jogos e otimizando o uso de novas tecnologias como o Ray Tracing.
        </p>
      `
    },
    {
      title: "1. Onde baixar os Drivers Oficiais?",
      content: `
        <p class="mb-4 text-gray-300">Nunca use programas de "Driver Booster" ou similares. Eles instalam drivers genéricos que podem causar tela azul. Use apenas os sites oficiais:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>NVIDIA:</strong> nvidia.com.br/Download. Baixe o <strong>NVIDIA App</strong> (sucessor do GeForce Experience).</li>
            <li><strong>AMD:</strong> amd.com/support. Baixe o <strong>Software Adrenalin</strong> para ter controle total sobre cores e FPS.</li>
            <li><strong>Intel:</strong> intel.com.br/support. Essencial para quem usa os novos gráficos Intel Arc ou processadores com vídeo integrado.</li>
        </ul >
      `
    },
    {
      title: "2. Instalação Expressa vs Instalação Limpa",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Quando o jogo trava:</h4>
            <p class="text-sm text-gray-300">
                Se você está tendo erros gráficos, não basta apenas "atualizar". Na instalação da NVIDIA, selecione <strong>'Personalizada'</strong> e marque a caixa <strong>'Executar instalação limpa'</strong>. Isso apaga todas as configurações antigas que podem estar conflitando com a versão nova. Para usuários avançados, o uso do <strong>DDU</strong> é recomendado.
            </p>
        </div>
      `
    },
    {
      title: "3. Drivers Beta e Opcionais",
      content: `
        <p class="mb-4 text-gray-300">
            Muitas vezes, o Windows Update oferece um driver de vídeo em 'Atualizações Opcionais'. 
            <br/><strong>Dica:</strong> Evite-os. Os drivers do Windows Update costumam ser versões simplificadas (DCH) que não possuem o painel de controle da placa de vídeo. Sempre prefira o driver baixado diretamente do site do fabricante (NVIDIA/AMD) para ter todos os recursos de performance ativos.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/como-usar-ddu-driver-uninstaller",
      title: "Guia DDU",
      description: "Como apagar drivers de forma definitiva."
    },
    {
      href: "/guias/pos-instalacao-windows-11",
      title: "Pós-Instalação",
      description: "Checklist de outros drivers vitais."
    },
    {
      href: "/guias/aceleracao-hardware-gpu-agendamento",
      title: "Agendamento de GPU",
      description: "Configure sua placa para renderizar mais rápido."
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
