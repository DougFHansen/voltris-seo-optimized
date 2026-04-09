import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'reshade-instalacao-configuracao',
  title: "ReShade: Instalação e Configuração Completa (2026)",
  description: "Aprenda a instalar e configurar o ReShade para gráficos ultra-realistas. Tutorial completo com presets, shaders e otimização.",
  category: 'windows-geral',
  difficulty: 'Avançado',
  time: '25 min'
};

const title = "ReShade: Instalação e Configuração Completa (2026)";
const description = "Aprenda a instalar e configurar o ReShade para gráficos ultra-realistas. Tutorial completo com presets, shaders e otimização.";
const keywords = [
    'reshade instalação 2026 tutorial completo',
    'como instalar reshade windows 10 11',
    'configurar reshade para jogos',
    'melhores presets reshade 2026',
    'reshade shaders tutorial',
    'reshade performance otimização',
    'reshade vs sweetfx',
    'reshade para jogos antigos',
    'reshade ray tracing shader',
    'configurar reshade para fps',
    'reshade não funciona solução',
    'reshade para steam epic games',
    'melhores shaders reshade 2026',
    'reshade configurar teclas de atalho',
    'reshade para minecraft gta',
    'reshade para cyberpunk 2077',
    'reshade para elden ring'
];

export const metadata: Metadata = createGuideMetadata('reshade-instalacao-configuracao', title, description, keywords);

export default function ReShadeGuide() {
    const summaryTable = [
        { label: "Nível de Dificuldade", value: "Avançado" },
        { label: "Tempo Estimado", value: "25 minutos" },
        { label: "Impacto Visual", value: "Gráfico ultra-realista" }
    ];

    const contentSections = [
        {
            title: "O Que é ReShade?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          <strong>ReShade</strong> é uma <strong>interface de injeção de shaders</strong> avançada que permite <strong>melhorar drasticamente os gráficos</strong> de jogos DirectX 9/10/11/12 e OpenGL/Vulkan. Em 2026, tornou-se a ferramenta preferida de gamers que buscam <strong>qualidade visual cinematográfica</strong>.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Com ReShade, você pode adicionar <strong>ray tracing em jogos antigos</strong>, <strong>melhorar texturas</strong>, <strong>otimizar cores</strong> e criar <strong>efeitos pós-processamento</strong> que transformam completamente a aparência visual dos jogos.
        </p>
        `
        },
        {
            title: "Requisitos de Sistema",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Para usar ReShade com <strong>performance adequada</strong>, seu sistema precisa atender a estes requisitos:
        </p>
        <div class="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-blue-400">💻 Requisitos Mínimos:</h3>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-blue-300 mb-2">🎮 Hardware Essencial:</h4>
              <ul class="space-y-2 text-gray-300">
                <li><strong>Processador:</strong> Intel i5-8400 ou Ryzen 5 3600</li>
                <li><strong>Placa de Vídeo:</strong> GTX 1060 6GB ou RX 580 8GB</li>
                <li><strong>Memória RAM:</strong> 8GB DDR4 2666MHz</li>
                <li><strong>Armazenamento:</strong> 2GB livres para shaders</li>
              </ul>
            </div>
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-blue-300 mb-2">🖥️ Software Requerido:</h4>
              <ul class="space-y-2 text-gray-300">
                <li><strong>Windows:</strong> 10/11 (64-bit)</li>
                <li><strong>DirectX:</strong> End-User Runtime atualizado</li>
                <li><strong>Visual C++:</strong> Redistributable 2019-2022</li>
                <li><strong>.NET Framework:</strong> 4.7.2 ou superior</li>
              </ul>
            </div>
          </div>
        </div>
        `
        },
        {
            title: "Instalação Passo a Passo",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Instalação do ReShade é <strong>simples</strong> mas requer atenção aos detalhes:
        </p>
        <div class="bg-blue-900/20 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-blue-400">📥 Processo de Instalação:</h3>
          <ol class="space-y-4 text-gray-300 list-decimal list-inside">
            <li class="mb-4">
              <strong>1. Baixar ReShade:</strong>
              <ul class="space-y-1 text-gray-300 ml-4">
                <li>Acesse <a href="https://reshade.me/" class="text-blue-400 underline">reshade.me</a></li>
                <li>Baixe a versão mais recente (geralmente 5.9.0+)</li>
                <li>Escolha "Download with generic installer"</li>
              </ul>
            </li>
            <li class="mb-4">
              <strong>2. Executar o Instalador:</strong>
              <ul class="space-y-1 text-gray-300 ml-4">
                <li>Execute o arquivo .exe como administrador</li>
                <li>Clique "Select game executable"</li>
                <li>Navegue até a pasta do jogo desejado</li>
                <li>Selecione o executável principal (.exe)</li>
              </ul>
            </li>
            <li class="mb-4">
              <strong>3. Configurar API:</strong>
              <ul class="space-y-1 text-gray-300 ml-4">
                <li>Selecione a API correta (DirectX 11 para jogos modernos)</li>
                <li>Marque "Create desktop shortcut"</li>
                <li>Clique em "Install ReShade"</li>
              </ul>
            </li>
            <li class="mb-4">
              <strong>4. Baixar Shaders:</strong>
              <ul class="space-y-1 text-gray-300 ml-4">
                <li>Visite <a href="https://reshade.me/forum/" class="text-blue-400 underline">fórum oficial</a></li>
                <li>Baixe shaders populares (qUINT, MartyMcFly, Pascal)</li>
                <li>Extraia para a pasta "reshade-shaders"</li>
              </ul>
            </li>
            <li class="mb-4">
              <strong>5. Primeiro Teste:</strong>
              <ul class="space-y-1 text-gray-300 ml-4">
                <li>Inicie o jogo através do atalho criado</li>
                <li>Pressione SHIFT+F2 para abrir o menu ReShade</li>
                <li>Selecione um preset e teste</li>
              </ul>
            </li>
          </ol>
        </div>
        `
        },
        {
            title: "Configurações Essenciais",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Configure o ReShade para <strong>equilíbrio perfeito</strong> entre qualidade e performance:
        </p>
        <div class="bg-purple-900/20 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-purple-400">⚙️ Configurações Principais:</h3>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-purple-300 mb-2">🎨 Configurações Visuais:</h4>
              <ul class="space-y-2 text-gray-300">
                <li><strong>Técnica de Cor:</strong> ReShade (padrão)</li>
                <li><strong>Pre-processamento:</strong> SMAA 1x (anti-aliasing)</li>
                <li><strong>Depth:</strong> Ativado para efeitos 3D</li>
                <li><strong>Buffer de Quadros:</strong> 1 (para estabilidade)</li>
              </ul>
            </div>
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-purple-300 mb-2">⚡ Performance:</h4>
              <ul class="space-y-2 text-gray-300">
                <li><strong>Multi-threading:</strong> Ativado se suportado</li>
                <li><strong>Cache de Texturas:</strong> 256MB</li>
                <li><strong>Buffer de Comando:</strong> 8MB</li>
                <li><strong>Limite de FPS:</strong> Desativado (para benchmark)</li>
              </ul>
            </div>
          </div>
        </div>
        `
        },
        {
            title: "Melhores Shaders de 2026",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Shaders são o <strong>coração</strong> do ReShade. Estes são os mais recomendados para 2026:
        </p>
        <div class="space-y-4">
          <div class="bg-gray-800 rounded-lg p-6 mb-4">
            <h3 class="text-xl font-bold mb-4 text-green-400">🎨 Shaders de Qualidade:</h3>
            <ul class="space-y-2 text-gray-300">
              <li><strong>qUINT:</strong> Melhor para qualidade geral e cores</li>
              <li><strong>MartyMcFly:</strong> Ótimo para jogos mais antigos</li>
              <li><strong>ReShade Enhanced Shaders:</strong> Pacote completo</li>
              <li><strong>Prod80:</strong> Efeitos cinematográficos</li>
            </ul>
          </div>
          <div class="bg-gray-800 rounded-lg p-6 mb-4">
            <h3 class="text-xl font-bold mb-4 text-blue-400">⚡ Shaders de Performance:</h3>
            <ul class="space-y-2 text-gray-300">
              <li><strong>FXAA:</strong> Anti-aliasing leve</li>
              <li><strong>LumaSharpen:</strong> Nitidez sem custo</li>
              <li><strong>Vibrance:</strong> Cores mais vivas</li>
              <li><strong>Clarity:</strong> Melhora detalhes</li>
            </ul>
          </div>
          <div class="bg-gray-800 rounded-lg p-6 mb-4">
            <h3 class="text-xl font-bold mb-4 text-purple-400">🌟 Shaders Especiais:</h3>
            <ul class="space-y-2 text-gray-300">
              <li><strong>RTGI:</strong> Ray tracing global</li>
              <li><strong>ScreenSpaceReflections:</strong> Reflexos em tempo real</li>
              <li><strong>AmbientOcclusion:</strong> Sombreamento dinâmico</li>
              <li><strong>Bloom:</strong> Efeito de brilho em luzes</li>
            </ul>
          </div>
        </div>
        `
        },
        {
            title: "Presets Populares",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Presets são <strong>conjuntos de configurações</strong> prontas para diferentes estilos e necessidades:
        </p>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-gray-800 rounded-lg p-6">
            <h3 class="text-xl font-bold mb-4 text-yellow-400">🎬 Presets Cinematográficos:</h3>
            <ul class="space-y-2 text-gray-300">
              <li><strong>Cinematic:</strong> Cores fílmicas, contraste suave</li>
              <li><strong>Realistic:</strong> Aparência natural e detalhada</li>
              <li><strong>GameMode:</strong> Cores vibrantes, alto contraste</li>
              <li><strong>Legacy:</strong> Estilo retrô com melhoria moderna</li>
            </ul>
          </div>
          <div class="bg-gray-800 rounded-lg p-6">
            <h3 class="text-xl font-bold mb-4 text-green-400">🎮 Presets Competitivos:</h3>
            <ul class="space-y-2 text-gray-300">
              <li><strong>Performance:</strong> Máximo FPS, qualidade mínima</li>
              <li><strong>Competitive:</strong> Nitidez, cores destacadas</li>
              <li><strong>E-Sports:</strong> Visibilidade máxima em FPS</li>
              <li><strong>Stream:</strong> Equilíbrio para streaming</li>
            </ul>
          </div>
        </div>
        `
        },
        {
            title: "Resolução de Problemas",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Problemas comuns e suas <strong>soluções rápidas</strong>:
        </p>
        <div class="space-y-4">
          <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-4">
            <h3 class="text-xl font-bold mb-4 text-red-400">🚨 ReShade Não Funciona:</h3>
            <ul class="space-y-2 text-gray-300">
              <li><strong>Verifique compatibilidade do jogo</strong></li>
              <li><strong>Execute como administrador</strong></li>
              <li><strong>Atualize DirectX e drivers</strong></li>
              <li><strong>Desative overlays conflitantes</strong></li>
            </ul>
          </div>
          <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mb-4">
            <h3 class="text-xl font-bold mb-4 text-yellow-400">⚠️ FPS Baixo:</h3>
            <ul class="space-y-2 text-gray-300">
              <li><strong>Reduza resolução</strong></li>
              <li><strong>Desative shaders pesados</strong></li>
              <li><strong>Use preset Performance</strong></li>
              <li><strong>Configure multi-threading</strong></li>
            </ul>
          </div>
          <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-4">
            <h3 class="text-xl font-bold mb-4 text-blue-400">🔧 Erros de Shader:</h3>
            <ul class="space-y-2 text-gray-300">
              <li><strong>Verifique versão do shader</strong></li>
              <li><strong>Atualize ReShade</strong></li>
              <li><strong>Limpe cache de shaders</strong></li>
              <li><strong>Teste com diferentes APIs</strong></li>
            </ul>
          </div>
        </div>
        `
        }
    ];

    const faqItems = [
        {
            question: "ReShade é seguro para usar online?",
            answer: "Sim, ReShade é seguro para jogos single-player. Para jogos online, verifique os termos de serviço - alguns consideram cheats. Use com moderação."
        },
        {
            question: "Qual a diferença entre ReShade e ENB?",
            answer: "ReShade é mais moderno e compatível com mais jogos. ENB é mais poderoso mas limitado a jogos específicos. ReShade é mais fácil de configurar."
        },
        {
            question: "Como remover ReShade de um jogo?",
            answer: "Delete os arquivos d3d9.dll, dxgi.dll, opengl32.dll da pasta do jogo. Ou execute o instalador e selecione 'Uninstall'."
        },
        {
            question: "ReShade funciona com anti-cheat?",
            answer: "Depende do jogo. Alguns anti-cheat bloqueiam ReShade. Verifique fóruns específicos de cada jogo antes de usar em partidas online."
        }
    ];

    const externalReferences = [
        { name: "ReShade Official", url: "https://reshade.me/" },
        { name: "ReShade Forum", url: "https://reshade.me/forum/" },
        { name: "Shaders Collection", url: "https://github.com/crosire/reshade-shaders" }
    ];

    const relatedGuides = [
        {
            href: "/guias/aumentar-fps-pc-gamer",
            title: "Aumentar FPS",
            description: "Técnicas avançadas para mais performance"
        },
        {
            href: "/guias/painel-de-controle-nvidia",
            title: "Painel de Controle NVIDIA",
            description: "Configurações avançadas da NVIDIA"
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
            summaryTable={summaryTable}
            faqItems={faqItems}
            externalReferences={externalReferences}
            relatedGuides={relatedGuides}
        />
    );
}
