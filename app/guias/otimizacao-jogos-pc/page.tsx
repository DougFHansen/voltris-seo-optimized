import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia de Otimização Extrema para Jogos (FPS Boost 2025)";
const description = "Aprenda a configurar Windows, NVIDIA/AMD e hardware para extrair cada gota de performance, reduzir input lag e estabilizar o frametime.";
const keywords = ["aumentar fps","otimizar windows jogos","input lag fix","nvidia painel","configuração esports"];

export const metadata: Metadata = createGuideMetadata('otimizacao-jogos-pc', title, description, keywords);

export default function GuidePage() {
  const contentSections = [
    {
      title: "Introdução e Visão Geral",
      content: `
        <p class="mb-4 text-lg text-gray-300 leading-relaxed">O Windows vem configurado para "uso geral", o que significa economia de energia e processos de fundo que prejudicam jogos. Este guia foca em latência mínima e FPS máximo.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div class="bg-[#171313] p-6 rounded-xl border border-[#31A8FF]/30 hover:border-[#31A8FF]/50 transition-colors">
            <h3 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span class="text-[#31A8FF]">✓</span> Benefícios
            </h3>
            <ul class="text-gray-300 space-y-2">
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Redução de Input Lag (atraso do mouse)</li><li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Estabilidade de 0.1% e 1% Low FPS (menos travadas)</li><li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Desativação de telemetria inútil</li><li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Melhor visibilidade competitiva</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-6 rounded-xl border border-[#FF4B6B]/30 hover:border-[#FF4B6B]/50 transition-colors">
            <h3 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span class="text-[#FF4B6B]">⚠</span> Requisitos
            </h3>
            <ul class="text-gray-300 space-y-2">
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4B6B] flex-shrink-0"></span>Drivers de vídeo atualizados</li><li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4B6B] flex-shrink-0"></span>Acesso de Administrador</li><li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4B6B] flex-shrink-0"></span>Paciência para testar cada mudança</li>
            </ul>
          </div>
        </div>
      `,
    },
    
    {
      title: "Otimizações do Windows",
      content: `<p class="mb-4 text-gray-300 leading-relaxed">Configurações profundas do sistema operacional.</p>`,
      subsections: [
        
        {
          subtitle: "Modo de Jogo e Gráficos",
          content: `
            <div class="prose prose-invert max-w-none">
              
              <ul class="list-disc list-inside space-y-2">
                <li>Vá em <strong>Configurações > Jogos > Modo de Jogo</strong>: ATIVE. (Melhorou muito no Windows 11 2024+).</li>
                <li>Vá em <strong>Configurações > Sistema > Tela > Elementos Gráficos</strong>: Clique em "Alterar configurações de gráficos padrão" e ative <strong>"Agendamento de GPU acelerado por hardware"</strong> (Hardware-accelerated GPU scheduling). Reinicie o PC.</li>
              </ul>
            </div>
          `
        },
        
        {
          subtitle: "Otimização de Tela Cheia",
          content: `
            <div class="prose prose-invert max-w-none">
              
              <p>Para jogos competitivos (CS2, Valorant):</p>
              <ol class="list-decimal list-inside">
                <li>Vá até o executável do jogo (.exe).</li>
                <li>Botão direito > Propriedades > Compatibilidade.</li>
                <li>Marque <strong>"Desabilitar otimizações de tela inteira"</strong>.</li>
                <li>Isso previne o Windows de aplicar overlays híbridos que aumentam o input lag.</li>
              </ol>
            </div>
          `
        }
      ]
    },
    
    {
      title: "Painel de Controle NVIDIA",
      content: `<p class="mb-4 text-gray-300 leading-relaxed">A configuração padrão da NVIDIA foca em qualidade, não performance.</p>`,
      subsections: [
        
        {
          subtitle: "Configurações 3D Globais",
          content: `
            <div class="prose prose-invert max-w-none">
              
              <div class="bg-black p-4 rounded border border-green-500/30 font-mono text-sm text-green-400">
                <p>Gerenciamento de Energia: Preferência por desempenho máximo</p>
                <p>Modo de Latência Baixa: Ultra (apenas se sua GPU estiver aguentando 95%+ de uso)</p>
                <p>Filtragem de textura - Qualidade: Alto Desempenho</p>
                <p>G-Sync: Ative para Single Player, Desative para CS/Valorant se quiser latência zero absoluta.</p>
              </div>
            </div>
          `
        }
      ]
    }
    ,
    {
      title: "Solução de Problemas Comuns (Troubleshooting)",
      content: `
        <div class="space-y-6">
          
          <div class="bg-[#1E1E22] p-5 rounded-lg border-l-4 border-[#8B31FF]">
            <h4 class="text-white font-bold text-lg mb-2">Stuttering (Travadinhas) após otimizar</h4>
            <div class="text-gray-300 text-sm pl-4 border-l border-gray-700">
              <p class="mb-2"><strong class="text-[#8B31FF]">Solução:</strong> O cache de sombreador (Shader Cache) pode ter sido resetado.</p>
              <ul class="list-disc list-inside text-gray-400 mt-2">
                <li>Jogue algumas partidas. O stuttering deve sumir conforme o cache é reconstruído.</li><li>Verifique se o 'HAGS' (Agendamento de GPU) causou instabilidade no seu jogo específico. Alguns jogos antigos não gostam.</li>
              </ul>
            </div>
          </div>
          
        </div>
      `
    },
    {
      title: "Conclusão Profissional",
      content: `
        <div class="bg-gradient-to-r from-[#1E1E22] to-[#171313] p-6 rounded-xl border border-gray-800">
          <p class="mb-4 text-gray-300 leading-relaxed">
            Dominar <strong>Guia de Otimização Extrema para Jogos (FPS Boost 2025)</strong> é fundamental para garantir um ambiente digital seguro, rápido e eficiente. 
            Seguindo este guia, você aplicou configurações de nível profissional que otimizam seu fluxo de trabalho e protegem seu hardware.
          </p>
          <p class="text-gray-400 italic border-l-2 border-[#31A8FF] pl-4">
            Lembre-se: A tecnologia evolui rapidamente. Recomendamos revisar estas configurações a cada 6 meses ou sempre que houver grandes atualizações de sistema.
          </p>
        </div>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/manutencao-preventiva",
      title: "Manutenção Preventiva",
      description: "Guia completo de manutenção."
    },
    {
      href: "/guias/otimizacao-performance",
      title: "Otimização Avançada",
      description: "Técnicas de otimização de sistema."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="35 min"
      difficultyLevel="Avançado"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}
