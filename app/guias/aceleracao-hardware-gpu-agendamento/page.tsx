import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'aceleracao-hardware-gpu-agendamento',
  title: "GPU Hardware Scheduling (HAGS): Ativar ou não em 2026?",
  description: "O Agendamento de GPU Acelerado por Hardware melhora o FPS ou causa bugs? Entenda a função vital para o DLSS 3 e Frame Gen, e quando ela deve ficar desligada.",
  category: 'otimizacao',
  difficulty: 'Intermediário',
  time: '12 min'
};

const title = "Guia HAGS: O que é Agendamento de GPU e como ele afeta seu FPS";
const description = "Uma chave secreta no Windows que muda como sua placa de vídeo conversa com a memória. Essencial para RTX 4000, mas polêmico em placas antigas (GTX 10/16).";

const keywords = [
  'agendamento de gpu acelerado por hardware ativar ou não',
  'hags on or off valorant cs2',
  'gpu scheduling windows 11 stuttering',
  'dlss 3 frame generation requires hags',
  'obs tela preta gpu scheduling fix',
  'hardware accelerated gpu scheduling benchmark',
  'input lag gpu scheduling reduce',
  'nvidia reflex vs hags'
];

export const metadata: Metadata = createGuideMetadata('aceleracao-hardware-gpu-agendamento', title, description, keywords);

export default function HAGSGuide() {
  const summaryTable = [
    { label: "Placas RTX 4000/3000", value: "ATIVAR (Obrigatório p/ DLSS 3)" },
    { label: "Placas GTX 10/16", value: "TESTAR (Pode causar lag)" },
    { label: "OBS Studio", value: "Pode conflitar (Update corrigiu)" },
    { label: "Latência", value: "Reduz Latência de CPU" },
    { label: "VRAM", value: "Gerenciamento mais eficiente" },
    { label: "Local", value: "Configurações > Tela > Gráficos" }
  ];

  const contentSections = [
    {
      title: "O que é HAGS (Hardware Accelerated GPU Scheduling) e como funciona",
      summary: "HAGS (Hardware Accelerated GPU Scheduling) permite que placa de vídeo gerencie sua própria memória (VRAM), tirando carga do processador. Tradicionalmente, CPU dizia para GPU o que renderizar e gerenciava VRAM. Com HAGS, GPU ganha autonomia para gerenciar VRAM.",
      content: `
        <p class="mb-6 text-gray-700 leading-relaxed text-lg">
          Tradicionalmente, a CPU (Processador) dizia para a GPU o que renderizar e gerenciava a memória de vídeo (VRAM). Com o <strong>Agendamento de GPU Acelerado por Hardware</strong> (HAGS), a Placa de Vídeo ganha autonomia para gerenciar sua própria memória. Isso tira carga do processador.
        </p>

      `
    },
    {
      title: "Quando ATIVAR HAGS: Placas compatíveis e cenários recomendados",
      summary: "ATIVAR se tem RTX Série 40 (4060, 4070...) - OBRIGATÓRIO, Frame Generation (DLSS 3) não funciona sem HAGS. ATIVAR se CPU é fraca (gargalo de CPU) - HAGS ajuda aliviar processador, pode dar 5-10 FPS extra em cenários cpu-bound. ATIVAR em jogos modernos (Cyberpunk, Alan Wake 2) geralmente se beneficiam.",
      content: `
        <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li><strong>Se você tem RTX Série 40 (4060, 4070...):</strong> OBRIGATÓRIO. O Frame Generation (DLSS 3) não funciona sem isso.</li>
            <li><strong>Se sua CPU é fraca (Gargalo de CPU):</strong> O HAGS ajuda a aliviar o processador, podendo dar uns 5-10 FPS extra em cenários cpu-bound.</li>
            <li><strong>Jogos Modernos (Cyberpunk, Alan Wake 2):</strong> Geralmente se beneficiam.</li>
        </ul>
      `
    },
    {
      title: "Quando DESATIVAR HAGS: Placas incompatíveis e problemas conhecidos",
      summary: "DESATIVAR em placas antigas (GTX 1060, 1660) - muitos usuários relatam micro-stuttering com HAGS ligado nessas placas, driver não lida bem com arquitetura Pascal/Turing antiga. DESATIVAR se problemas com OBS/Discord - se stream trava ou tela compartilhada pisca, HAGS prioriza jogo e esquece de renderizar vídeo do OBS.",
      content: `
        <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li><strong>Placas Antigas (GTX 1060, 1660):</strong> Muitos usuários relatam micro-stuttering (travadinhas) com o HAGS ligado nessas placas. O driver parece não lidar bem com a arquitetura Pascal/Turing antiga.</li>
            <li><strong>Problemas com OBS/Discord:</strong> Se sua stream fica travando ou a tela compartilhada do Discord pisca, experimente desligar. O HAGS prioriza tanto o jogo que "esquece" de renderizar o vídeo do OBS. (Versões recentes do OBS 29+ corrigiram isso, mas ainda acontece).</li>
            <li><strong>Jogos Competitivos Leves (Valorant, CS):</strong> Não faz diferença positiva, e alguns pros preferem desligado por "feeling" de mouse (embora tecnicamente devesse reduzir o input lag).</li>
        </ul>
      `
    },
    {
      title: "Como Ativar ou Desativar HAGS no Windows 11",
      summary: "Vá em Configurações > Sistema > Tela. Role até embaixo e clique em Elementos Gráficos (ou Configurações de Elementos Gráficos). Clique em 'Alterar configurações de gráficos padrão'. Mude a chave 'Agendamento de GPU acelerado por hardware'. REINICIE O PC - mudança não funciona sem reiniciar.",
      content: `
        <ol class="list-decimal list-inside text-gray-700 space-y-3 ml-4 bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
            <li>Vá em <strong>Configurações > Sistema > Tela</strong>.</li>
            <li>Role até embaixo e clique em <strong>Elementos Gráficos</strong> (ou Configurações de Elementos Gráficos).</li>
            <li>Clique em "Alterar configurações de gráficos padrão".</li>
            <li>Mude a chave "Agendamento de GPU acelerado por hardware".</li>
            <li><strong>REINICIE O PC.</strong> A mudança não funciona sem reiniciar.</li>
        </ol>
      `
    }
  ];

  const advancedContentSections = [
    {
      title: "Relação com Nvidia Reflex",
      content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-green-400 font-bold mb-4 text-xl">Latência do Sistema</h4>
                <p class="text-gray-700 mb-4">
                    O HAGS e o Nvidia Reflex trabalham em áreas diferentes. O Reflex limpa a fila de renderização (Render Queue) para garantir que a CPU não mande frames demais que a GPU não aguenta. O HAGS otimiza como esses frames chegam na VRAM.
                </p>
                <p class="text-gray-700 text-sm">
                    <strong>Melhor Combo:</strong> HAGS Ligado + Reflex On + Boost. Isso garante a menor latência matematicamente possível no Windows 11.
                </p>
            </div>
            `
    }
  ];

  const additionalContentSections = [
    {
      title: "Não aparece a opção pra mim?",
      content: `
            <p class="mb-4 text-gray-700">
                Se a opção não existe no seu Windows:
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Sua placa de vídeo é muito antiga (pré-GTX 1000).</li>
                <li>Seu driver de vídeo está desatualizado (Atualize!).</li>
                <li>Seu Windows 10 é uma versão muito antiga (Update para 2004 ou mais novo).</li>
            </ul>
            `
    }
  ];

  const faqItems = [
    {
      question: "AMD tem HAGS?",
      answer: "Sim, nas placas RX 7000 e 6000 com drivers recentes, a opção aparece no Windows. O efeito é similar ao da Nvidia."
    },
    {
      question: "Blue Screen com HAGS?",
      answer: "Raro, mas acontece se a VRAM da placa de vídeo estiver com defeito. O HAGS estressa mais o gerenciador de memória. Se dá tela azul ao ligar, é um teste de estresse não intencional que revelou defeito de hardware."
    }
  ];

  const externalReferences = [
    { name: "Microsoft Dev Blog - HAGS Explained", url: "https://devblogs.microsoft.com/directx/hardware-accelerated-gpu-scheduling/" }
  ];

  const relatedGuides = [
    {
      href: "/guias/modo-de-jogo-windows-atikvar-ou-nao",
      title: "Game Mode",
      description: "Outra configuração nativa do Windows."
    },
    {
      href: "/guias/otimizacoes-para-notebook-gamer",
      title: "Notebooks",
      description: "HAGS ajuda muito em notebooks com power limit."
    },
    {
      href: "/guias/atualizacao-drivers-video",
      title: "Drivers",
      description: "Mantenha o driver em dia para o HAGS funcionar."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="12 min"
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
