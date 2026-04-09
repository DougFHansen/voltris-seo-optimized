import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';
import JsonLdGuide from '@/components/JsonLdGuide';

export const guideMetadata = {
  id: 'painel-de-controle-nvidia',
  title: "Painel de Controle NVIDIA: Configuração Completa 2026",
  description: "Aprenda a configurar o painel de controle NVIDIA para máximo desempenho em jogos. Tutorial completo com todas as otimizações.",
  category: 'windows-geral',
  difficulty: 'Intermediário',
  time: '20 min'
};

const title = "Painel de Controle NVIDIA: Configuração Completa 2026";
const description = "Aprenda a configurar o painel de controle NVIDIA para máximo desempenho em jogos. Tutorial completo com todas as otimizações.";
const keywords = [
    'painel de controle nvidia 2026 tutorial completo',
    'configurar painel de controle nvidia',
    'nvidia control panel settings 2026',
    'otimizar painel de controle nvidia',
    'nvidia geforce experience 2026',
    'como configurar painel de controle nvidia',
    'melhores configurações painel nvidia 2026',
    'nvidia shadowplay painel de controle',
    'painel de controle nvidia fps boost',
    'ajustar painel de controle nvidia jogos',
    'nvidia control panel performance tuning',
    'configurar nvidia control panel para jogos'
];

export const metadata: Metadata = createGuideMetadata('painel-de-controle-nvidia', title, description, keywords);

export default function PainelControleNVIDIAGuide() {
    const summaryTable = [
        { label: "Nível de Dificuldade", value: "Intermediário" },
        { label: "Tempo Estimado", value: "20 minutos" },
        { label: "Impacto no FPS", value: "+15-25% de ganho" }
    ];

    const steps = [
        { name: "Abrir Painel NVIDIA", text: "Clique com o botão direito na área de trabalho e selecione 'Painel de Controle NVIDIA' ou pesquise no menu Iniciar." },
        { name: "Configurar Modo de Energia", text: "Vá para 'Gerenciamento de Configurações 3D' e configure 'Modo de Energia' para 'Prefer Máximo Desempenho'." },
        { name: "Ajustar Configurações de Jogos", text: "Configure 'Monitor Tecnológico', 'Latência Baixa' e 'Taxa de Quadros' para máximo desempenho." },
        { name: "Otimizar Configurações Globais", text: "Ajuste 'Shader Cache', 'Pré-renderização de Quadros' e outras configurações globais." },
        { name: "Aplicar e Testar", text: "Clique em 'Aplicar' e teste os jogos para verificar o ganho de FPS." }
    ];

    const contentSections = [
        {
            title: "O Que é o Painel de Controle NVIDIA?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O <strong>Painel de Controle NVIDIA</strong> é o software oficial da NVIDIA para gerenciar todas as configurações da sua placa de vídeo. Em 2026, ele evoluiu com recursos avançados de <strong>AI-powered optimization</strong>, <strong>DLSS 3.5</strong> e <strong>Ray Tracing otimizado</strong>.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Com o painel configurado corretamente, você pode extrair o máximo potencial da sua <strong>RTX 4070</strong> ou <strong>RTX 5090</strong>, garantindo <strong>taxas de quadros perfeitas</strong> e <strong>redução de input lag</strong> em todos os jogos.
        </p>
        `
        },
        {
            title: "Por Que Configurar o Painel NVIDIA?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Configurar o painel NVIDIA corretamente é <strong>essencial</strong> para gamers em 2026. As configurações padrão nem sempre oferecem o melhor desempenho, e ajustes finos podem resultar em <strong>ganhos significativos de FPS</strong>.
        </p>
        <div class="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-green-400">🎮 Benefícios da Configuração Correta:</h3>
          <ul class="space-y-2 text-gray-300">
            <li class="flex items-center gap-2">
              <span class="text-green-400">🚀</span>
              <span>+15-25% FPS em jogos modernos</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-400">⚡</span>
              <span>Input lag reduzido em 40%</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-400">🎯</span>
              <span>Ray Tracing com impacto mínimo</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-400">🔧</span>
              <span>Temperatura controlada automaticamente</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-400">🎨</span>
              <span>DLSS 3.5 otimizado automaticamente</span>
            </li>
          </ul>
        </div>
        `
        },
        {
            title: "Configurações Essenciais do Painel NVIDIA",
            content: `
        <div class="bg-blue-900/20 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-blue-400">🎛️ Configurações Globais:</h3>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-blue-300 mb-3">Modo de Energia</h4>
              <ul class="space-y-2 text-gray-300">
                <li><strong>Preferência Máxima:</strong> Configurar para "Prefer Máximo Desempenho"</li>
                <li><strong>Fonte de Alimentação:</strong> Fonte de alimentação preferencial</li>
                <li><strong>Modo USB:</strong> Desativar quando não estiver em uso</li>
              </ul>
            </div>
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-blue-300 mb-3">🎮 Configurações de Jogos</h4>
              <ul class="space-y-2 text-gray-300">
                <li><strong>Monitor Tecnológico:</strong> G-Sync ativado</li>
                <li><strong>Latência Baixa:</strong> Modo Ultra Baixa Latência</li>
                <li><strong>Taxa de Quadros:</strong> Máxima taxa de atualização</li>
                <li><strong>Filtro Sharpen:</strong> Ajustado para 0.5</li>
              </ul>
            </div>
          </div>
        </div>
        `
        },
        {
            title: "Configurações Avançadas para FPS Máximo",
            content: `
        <div class="bg-purple-900/20 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-purple-400">🚀 Otimizações de Performance:</h3>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-purple-300 mb-3">⚙️ Configurações do Driver</h4>
              <ul class="space-y-2 text-gray-300">
                <li><strong>Shader Cache:</strong> Máximo (para reduzir stuttering)</li>
                <li><strong>Pré-renderização de Quadros:</strong> Ativada (para reduzir input lag)</li>
                <li><strong>Renderização Multi-amostra:</strong> 4x MSAA (para qualidade visual)</li>
                <li><strong>Anisotrópico Filtragem:</strong> 16x (para nítido)</li>
              </ul>
            </div>
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-purple-300 mb-3">🎨 Configurações de Qualidade</h4>
              <ul class="space-y-2 text-gray-300">
                <li><strong>DLSS:</strong> Qualidade vs Desempenho (equilibrado)</li>
                <li><strong>Ray Tracing:</strong> Médio (para jogabilidade)</li>
                <li><strong>Upscaling:</strong> NVIDIA Image Scaling (alternativa ao DLSS)</li>
                <li><strong>HDR:</strong> Ativado (para melhor contraste)</li>
              </ul>
            </div>
          </div>
        </div>
        `
        },
        {
            title: "Resolução de Problemas Comuns",
            content: `
        <div class="bg-red-900/20 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-red-400">🔧 Solução de Problemas:</h3>
          <div class="space-y-4">
            <div class="bg-red-800/50 p-4 rounded-lg border border-red-500/30">
              <h4 class="text-lg font-semibold text-red-300 mb-2">🚨 FPS Baixo ou Instável?</h4>
              <ul class="space-y-2 text-gray-300">
                <li>Verifique temperatura da GPU (>85°C)</li>
                <li>Feche programas em segundo plano</li>
                <li>Atualize drivers para versão mais recente</li>
                <li>Desative overlays (Discord, Steam)</li>
                <li>Reduza configurações gráficas</li>
              </ul>
            </div>
            <div class="bg-yellow-800/50 p-4 rounded-lg border border-yellow-500/30">
              <h4 class="text-lg font-semibold text-yellow-300 mb-2">⚠️ Tela Cortando ou Travando?</h4>
              <ul class="space-y-2 text-gray-300">
                <li>Verifique uso de VRAM (>90%)</li>
                <li>Ative G-Sync no monitor</li>
                <li>Desative V-Sync no jogo</li>
                <li>Use cabo DisplayPort de qualidade</li>
              </ul>
            </div>
            <div class="bg-green-800/50 p-4 rounded-lg border border-green-500/30">
              <h4 class="text-lg font-semibold text-green-300 mb-2">✅ Melhores Práticas:</h4>
              <ul class="space-y-2 text-gray-300">
                <li>Monitore temperatura e uso de recursos</li>
                <li>Atualize drivers mensalmente</li>
                <li>Limpe ventiladores e dissipadores</li>
                <li>Use perfil de energia adequado</li>
              </ul>
            </div>
          </div>
        </div>
        `
        }
    ];

    const faqItems = [
        {
            question: "Qual a diferença entre G-Sync e V-Sync?",
            answer: "G-Sync sincroniza o monitor com a GPU, eliminando screen tearing. V-Sync sincroniza apenas com taxa de atualização vertical do monitor. G-Sync oferece menor input lag."
        },
        {
            question: "DLSS 3.5 realmente melhora a qualidade?",
            answer: "Sim! DLSS 3.5 usa IA para reconstruir pixels, oferecendo qualidade próxima ao nativa com impacto mínimo de performance. É ideal para 4K."
        },
        {
            question: "Como saber se meu PC suporta Ray Tracing?",
            answer: "Verifique se sua placa NVIDIA é RTX 2060 ou superior. GPUs mais antigas podem ter suporte, mas com desempenho muito reduzido."
        }
    ];

    const externalReferences = [
        { name: "NVIDIA GeForce Experience", url: "https://www.nvidia.com/geforce/geforce-experience/" },
        { name: "Guia de DLSS", url: "https://www.nvidia.com/pt-br/geforce/technologies/dlss/" },
        { name: "Drivers NVIDIA", url: "https://www.nvidia.com/Download/index.aspx" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-windows-11-para-games",
            title: "Otimização Windows 11",
            description: "Configure o Windows para máximo desempenho"
        },
        {
            href: "/guias/aumentar-fps-pc-gamer",
            title: "Aumentar FPS",
            description: "Técnicas avançadas para mais performance"
        },
        {
            href: "/guias/melhor-placa-de-video-pc",
            title: "Melhor Placa de Vídeo",
            description: "Escolha a GPU ideal para suas necessidades"
        }
    ];

    return (
        <>
            <JsonLdGuide
                title={title}
                description={description}
                url="https://voltris.com.br/guias/painel-de-controle-nvidia"
                image="https://voltris.com.br/logo.png"
                estimatedTime="20"
                difficulty="Intermediário"
                category="Configuração NVIDIA"
                steps={steps}
                faqItems={faqItems}
            />
            <GuideTemplate
                title={title}
                description={description}
                keywords={keywords}
                estimatedTime="20 min"
                difficultyLevel="Intermediário"
                contentSections={contentSections}
                summaryTable={summaryTable}
                faqItems={faqItems}
                externalReferences={externalReferences}
                relatedGuides={relatedGuides}
            />
        </>
    );
}
