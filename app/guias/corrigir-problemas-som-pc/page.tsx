import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'corrigir-problemas-som-pc',
  title: "Corrigir Problemas de Som no PC (2026) - Guia Completo",
  description: "Seu PC está com áudio chiando, estático ou cortando? Aprenda a diagnosticar e resolver todos os problemas de som no Windows 10/11.",
  category: 'windows-geral',
  difficulty: 'Intermediário',
  time: '15 min'
};

const title = "Corrigir Problemas de Som no PC (2026) - Guia Completo";
const description = "Seu PC está com áudio chiando, estático ou cortando? Aprenda a diagnosticar e resolver todos os problemas de som no Windows 10/11.";
const keywords = [
    'corrigir problemas de som pc 2026 tutorial',
    'áudio chiando no windows 10 solução',
    'como resolver áudio estático pc',
    'som cortando no windows 11 2026',
    'configurações de áudio windows problemas',
    'driver de áudio corrompido',
    'áudio estático windows 10 11 solução',
    'resolução de problemas de áudio pc',
    'audio stuttering windows 11 solução',
    'melhor qualidade de áudio windows',
    'configurar áudio windows 10 11',
    'ajustar buffer de áudio windows',
    'windows audio enhancement desativar'
];

export const metadata: Metadata = createGuideMetadata('corrigir-problemas-som-pc', title, description, keywords);

export default function CorrigirProblemasSomPCGuide() {
    const summaryTable = [
        { label: "Nível de Dificuldade", value: "Intermediário" },
        { label: "Tempo Estimado", value: "15 minutos" },
        { label: "Problemas Resolvidos", value: "5+ problemas comuns" }
    ];

    const contentSections = [
        {
            title: "Por Que o Áudio Fica Ruim?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Problemas de áudio no PC podem <strong>arruinar completamente sua experiência</strong> com jogos, streaming e comunicação. As causas mais comuns incluem drivers desatualizados, configurações incorretas e conflitos de software.
        </p>
        <div class="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-red-400">🔥 Principais Causas:</h3>
          <ul class="space-y-2 text-gray-300">
            <li class="flex items-start gap-2">
              <span class="text-red-400">⚠️</span>
              <span>Drivers de áudio desatualizados ou corrompidos</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-400">⚠️</span>
              <span>Configurações de áudio incorretas no Windows</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-400">⚠️</span>
              <span>Conflitos com outros softwares de áudio</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-400">⚠️</span>
              <span>Hardware com defeito (fones, cabos, placa)</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-400">⚠️</span>
              <span>Configurações de buffer muito altas</span>
            </li>
          </ul>
        </div>
        `
        },
        {
            title: "Diagnóstico Rápido",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Antes de começar a resolver problemas, vamos <strong>identificar a causa raiz</strong>. Use estas ferramentas do Windows para diagnóstico rápido:
        </p>
        <div class="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-blue-400">🔧 Ferramentas de Diagnóstico:</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-blue-400 mb-2">🎵 Solucionador de Problemas</h4>
              <p class="text-gray-300 text-sm mb-2">Executar <kbd class="bg-gray-700 px-2 py-1 rounded">msdt /online</kbd> para detectar problemas automaticamente.</p>
              <p class="text-gray-300 text-sm">Verifica drivers, configurações de áudio e hardware.</p>
            </div>
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-blue-400 mb-2">🎛️ Gerenciador de Dispositivos</h4>
              <p class="text-gray-300 text-sm mb-2">Pressione <kbd class="bg-gray-700 px-2 py-1 rounded">Win + X</kbd> para abrir rapidamente.</p>
              <p class="text-gray-300 text-sm">Teste diferentes dispositivos de saída de áudio.</p>
            </div>
          </div>
        </div>
        `
        },
        {
            title: "Drivers e Configurações",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          <strong>Drivers atualizados</strong> são fundamentais para um áudio funcionar perfeitamente. Vamos atualizar tudo passo a passo:
        </p>
        <div class="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-green-400">🔄 Atualização de Drivers:</h3>
          <ol class="space-y-2 text-gray-300 list-decimal list-inside">
            <li class="mb-2">
              <strong>1. Identificar Hardware:</strong>
              <p class="text-gray-300 text-sm">Use <kbd class="bg-gray-700 px-2 py-1 rounded">dxdiag</kbd> para ver sua placa de som e drivers.</p>
            </li>
            <li class="mb-2">
              <strong>2. Baixar Drivers Oficiais:</strong>
              <p class="text-gray-300 text-sm mb-2">Visite o site do fabricante (Realtek, NVIDIA, Intel).</p>
            </li>
            <li class="mb-2">
              <strong>3. Instalar em Modo Seguro:</strong>
              <p class="text-gray-300 text-sm mb-2">Desative temporariamente o antivírus durante instalação.</p>
            </li>
            <li class="mb-2">
              <strong>4. Reiniciar o PC:</strong>
              <p class="text-gray-300 text-sm mb-2">Após instalação, reinicie para aplicar as mudanças.</p>
            </li>
          </ol>
        </div>
        <div class="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-yellow-400">⚙️ Configurações do Windows:</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-yellow-400 mb-2">🎛️ Serviços de Áudio</h4>
              <p class="text-gray-300 text-sm mb-2">Pressione <kbd class="bg-gray-700 px-2 py-1 rounded">Win + R</kbd> → digite <kbd class="bg-gray-700 px-2 py-1 rounded">services.msc</kbd> → encontre <kbd class="bg-gray-700 px-2 py-1 rounded">Windows Audio</kbd>.</p>
              <p class="text-gray-300 text-sm mb-2">Reinicie o serviço se necessário.</p>
            </div>
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-yellow-400 mb-2">🎚️ Propriedades de Som</h4>
              <p class="text-gray-300 text-sm mb-2">Clique com botão direito no ícone de som → Propriedades → Avançado.</p>
              <p class="text-gray-300 text-sm mb-2">Ajuste configurações de qualidade e efeitos.</p>
            </div>
          </div>
        </div>
        `
        },
        {
            title: "Soluções Específicas",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Soluções detalhadas para os problemas de áudio mais <strong>comuns</strong> no Windows:
        </p>
        <div class="space-y-4">
          <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-6">
            <h3 class="text-xl font-bold mb-4 text-red-400">🔴 Áudio Chiando ou Estático:</h3>
            <div class="space-y-2 text-gray-300">
              <p class="mb-2"><strong>Causa:</strong> Drivers corrompidos ou buffer muito alto.</p>
              <p class="mb-2"><strong>Solução:</strong></p>
              <ol class="space-y-2 text-gray-300 list-decimal list-inside">
                <li>Atualize drivers do fabricante</li>
                <li>Reinicie serviço de áudio do Windows</li>
                <li>Reduza buffer para 64-128ms</li>
                <li>Desative "Enhancements" de áudio de terceiros</li>
              </ol>
            </div>
          </div>
          <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mb-6">
            <h3 class="text-xl font-bold mb-4 text-yellow-400">🔊 Som Cortando ou Desincronizado:</h3>
            <div class="space-y-2 text-gray-300">
              <p class="mb-2"><strong>Causa:</strong> Buffer inadequado ou conflito de software.</p>
              <p class="mb-2"><strong>Solução:</strong></p>
              <ol class="space-y-2 text-gray-300 list-decimal list-inside">
                <li>Configure buffer para 32-64ms</li>
                <li>Desative processos desnecessários</li>
                <li>Use cabo HDMI de qualidade</li>
                <li>Verifique configurações de sincronização</li>
              </ol>
            </div>
          </div>
          <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
            <h3 class="text-xl font-bold mb-4 text-blue-400">🎤 Microfone Não Funciona:</h3>
            <div class="space-y-2 text-gray-300">
              <p class="mb-2"><strong>Causa:</strong> Hardware com defeito ou configurações incorretas.</p>
              <p class="mb-2"><strong>Solução:</strong></p>
              <ol class="space-y-2 text-gray-300 list-decimal list-inside">
                <li>Teste microfone em outro dispositivo</li>
                <li>Verifique permissões de acesso ao microfone</li>
                <li>Atualize drivers de áudio</li>
                <li>Configure dispositivo de áudio padrão</li>
                <li>Verifique cabos e conexões</li>
              </ol>
            </div>
          </div>
        </div>
        `
        },
        {
            title: "Prevenção e Manutenção",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          <strong>Evite problemas futuros</strong> com estas práticas de manutenção preventiva:
        </p>
        <div class="bg-gray-800 rounded-lg p-6 mb-6">
          <div class="grid md:grid-cols-2 gap-4">
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-green-400 mb-2">🛡️ Manutenção de Hardware:</h4>
              <ul class="space-y-2 text-gray-300">
                <li>Limpeza regular de conectores e portas</li>
                <li>Atualização periódica de drivers</li>
                <li>Verificação de temperatura dos componentes</li>
                <li>Teste com diferentes fones e cabos</li>
              </ul>
            </div>
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-green-400 mb-2">🔄 Manutenção de Software:</h4>
              <ul class="space-y-2 text-gray-300">
                <li>Desinstale softwares de áudio desnecessários</li>
                <li>Use o Windows Update para drivers</li>
                <li>Crie pontos de restauração do sistema</li>
                <li>Execute limpeza de arquivos temporários</li>
              </ul>
            </div>
          </div>
        </div>
        `
        }
    ];

    const faqItems = [
        {
            question: "Como sei se meu problema é de hardware ou software?",
            answer: "Se o problema persiste após atualizar drivers e mudar configurações, provavelmente é hardware. Teste com outro microfone, cabo ou placa de som para isolar a causa."
        },
        {
            question: "Com que frequência devo atualizar os drivers?",
            answer: "Verifique atualizações mensalmente. Para gamers, recomendo verificar a cada 15-30 dias. Drivers de placa de vídeo podem ser atualizados com mais frequência."
        },
        {
            question: "É seguro desativar o antivírus para instalar drivers?",
            answer: "Sim, mas apenas temporariamente. Use o Windows Defender ou desative temporariamente. Após instalação, reative o antivírus e faça uma verificação completa."
        },
        {
            question: "Como testar se meu áudio está funcionando?",
            answer: "Use o Teste de Áudio do Windows. Pressione Win + R, digite 'msdt' e execute o teste. Também pode usar aplicativos online de teste de áudio."
        }
    ];

    const externalReferences = [
        { name: "Suporte Microsoft Áudio", url: "https://support.microsoft.com/pt-br/windows/sound/" },
        { name: "Drivers Realtek", url: "https://www.realtek.com/pt-br/downloads/" },
        { name: "Documentação Áudio Windows", url: "https://learn.microsoft.com/pt-br/windows/audio/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/ajustar-configuracoes-audio-windows",
            title: "Ajustar Configurações de Áudio",
            description: "Configurações avançadas de áudio"
        },
        {
            href: "/guias/otimizacao-windows-11-para-games",
            title: "Otimização Windows 11",
            description: "Performance máxima para jogos"
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            faqItems={faqItems}
            externalReferences={externalReferences}
            relatedGuides={relatedGuides}
        />
    );
}
