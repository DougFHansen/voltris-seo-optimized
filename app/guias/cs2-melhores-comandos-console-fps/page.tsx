import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'cs2-melhores-comandos-console-fps',
  title: "CS2: Lista de Comandos e Otimização de FPS Definitiva (2026)",
  description: "O Counter-Strike 2 exige mais do seu PC. Descubra os comandos de console que realmente funcionam, configure o Sub-Tick, desative telemetria e otimize a engine Source 2.",
  category: 'otimizacao',
  difficulty: 'Avançado',
  time: '30 min'
};

const title = "CS2: O Guia Definitivo de Comandos de Console e Performance (2026)";
const description = "A era Source 2 chegou. Esqueça os comandos do CS:GO. Aprenda a configurar o CS2 para latência mínima e FPS máximo com a nova lista de cvars atualizada.";

const keywords = [
  'cs2 aumentar fps comandos console',
  'autoexec cs2 2026 download',
  'cs2 travando stutters fix',
  'comando mostrar fps cs2 net_graph',
  'cl_interp cs2 subtick fix',
  'melhores launch options cs2 steam',
  'otimizar nvidia reflex cs2',
  'input lag cs2 vs csgo'
];

export const metadata: Metadata = createGuideMetadata('cs2-melhores-comandos-console-fps', title, description, keywords);

export default function CS2OptimizationGuide() {
  const summaryTable = [
    { label: "Engine", value: "Source 2" },
    { label: "Arquitetura", value: "Sub-Tick (Servidor) + 64-bit" },
    { label: "Principal Gargalo", value: "GPU (Diferente do CS:GO)" },
    { label: "Otimização Chave", value: "Limpar Shader Cache" },
    { label: "Comando Stats", value: "cl_showfps 1 (net_graph morreu)" },
    { label: "Reflex", value: "Obrigatório (On + Boost)" }
  ];

  const contentSections = [
    {
      title: "Adeus Source 1, Olá Source 2: O Que Mudou?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Counter-Strike 2 não é apenas uma atualização visual; é uma reescrita total da engine física e de rede. Enquanto o CS:GO era dependente quase exclusivamente da CPU (single-core speed), o CS2 utiliza a GPU de forma intensiva para renderizar fumaças volumétricas, iluminação sub-surface e texturas PBR de alta resolução.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          Isso significa que muitos comandos antigos de <code>launch options</code> (como <code>-high</code>, <code>-threads</code>, <code>-nod3d9ex</code>) agora são <strong>inúteis ou prejudiciais</strong>. Em 2026, otimizar CS2 exige uma abordagem limpa e moderna, focada no sistema de Sub-Tick e na estabilidade do Frame Time (1% Lows).
        </p>

        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 my-8">
            <h4 class="text-[#31A8FF] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">📡</span> Otimização de Rota e Sub-Tick
            </h4>
            <p class="text-gray-300 mb-4">
                O sistema Sub-Tick do CS2 envia pacotes de input com carimbos de tempo precisos. Qualquer instabilidade na rede (Jitter) faz os tiros "sumirem". O <strong>Voltris Optimizer</strong> ajusta o protocolo TCP/IP do Windows e desativa o "Nagle's Algorithm" para garantir que seus pacotes cheguem ao servidor Valve sem fila de espera no adaptador de rede.
            </p>
            <a href="/voltrisoptimizer" class="group relative inline-flex px-8 py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] items-center justify-center gap-2">
                Estabilizar Ping com Voltris
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        </div>
      `
    },
    {
      title: "Entendendo o Sub-Tick: Por que você erra o tiro?",
      content: `
        <p class="mb-4 text-gray-300">
            No CS:GO, o servidor "lia" suas ações 64 vezes por segundo (ou 128 vezes em Faceit). No CS2, o servidor sabe o momento <strong>exato</strong> entre os ticks que você clicou.
        </p>
        
        <!-- SVG Technical Diagram: Sub-Tick Timing -->
        <div class="my-8 bg-[#0F111A] p-6 rounded-xl border border-white/5 flex flex-col items-center">
            <h4 class="text-white font-bold mb-6 text-center">Tickrate (CS:GO) vs Sub-Tick (CS2)</h4>
            <svg viewBox="0 0 800 250" class="w-full h-auto text-gray-300" xmlns="http://www.w3.org/2000/svg">
                <!-- CS:GO Timeline -->
                <g transform="translate(50, 50)">
                    <text x="0" y="-10" fill="#94a3b8" font-size="12" font-weight="bold">CS:GO (Tick Based)</text>
                    <line x1="0" y1="20" x2="700" y2="20" stroke="#475569" stroke-width="2"/>
                    
                    <!-- Ticks -->
                    <line x1="100" y1="10" x2="100" y2="30" stroke="#fbbf24" stroke-width="2"/>
                    <text x="100" y="45" text-anchor="middle" fill="#fbbf24" font-size="10">Tick 1</text>
                    
                    <line x1="300" y1="10" x2="300" y2="30" stroke="#fbbf24" stroke-width="2"/>
                    <text x="300" y="45" text-anchor="middle" fill="#fbbf24" font-size="10">Tick 2</text>
                    
                    <line x1="500" y1="10" x2="500" y2="30" stroke="#fbbf24" stroke-width="2"/>
                    <text x="500" y="45" text-anchor="middle" fill="#fbbf24" font-size="10">Tick 3</text>

                    <!-- Shot Event -->
                    <circle cx="250" cy="20" r="6" fill="#ef4444"/>
                    <text x="250" y="0" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="bold">Seu Clique</text>
                    
                    <!-- Registered -->
                    <path d="M 250 20 Q 275 10 300 20" fill="none" stroke="#ef4444" stroke-dasharray="4 2"/>
                    <text x="350" y="15" fill="#fbbf24" font-size="10">Delay até Tick 2</text>
                </g>

                <!-- CS2 Timeline -->
                <g transform="translate(50, 150)">
                     <text x="0" y="-10" fill="#94a3b8" font-size="12" font-weight="bold">CS2 (Sub-Tick)</text>
                    <line x1="0" y1="20" x2="700" y2="20" stroke="#475569" stroke-width="2"/>
                    
                    <!-- Ticks -->
                    <line x1="100" y1="10" x2="100" y2="30" stroke="#31A8FF" stroke-width="2"/>
                    <line x1="300" y1="10" x2="300" y2="30" stroke="#31A8FF" stroke-width="2"/>
                    <line x1="500" y1="10" x2="500" y2="30" stroke="#31A8FF" stroke-width="2"/>

                     <!-- Shot Event -->
                    <circle cx="250" cy="20" r="6" fill="#10b981"/>
                    <text x="250" y="0" text-anchor="middle" fill="#10b981" font-size="10" font-weight="bold">Seu Clique</text>

                    <!-- Registered -->
                    <text x="250" y="45" text-anchor="middle" fill="#10b981" font-size="10">Registrado Exatamente Aqui</text>
                    <line x1="250" y1="20" x2="250" y2="35" stroke="#10b981" stroke-width="1"/>
                </g>
            </svg>
            <p class="text-xs text-gray-500 mt-4 italic text-center">Figura 1: No CS2, o tiro sai quando você clica, mas a animação visual às vezes atrasa, causando a sensação de "tiro fantasma".</p>
        </div>
      `
    },
    {
      title: "1. Launch Options: O Que Ainda Funciona?",
      content: `
        <p class="mb-4 text-gray-300">
            Limpe suas opções de inicialização antigas. A maioria dos comandos antigos (<code>-tickrate 128</code>, <code>-novid</code>) foi removida ou incorporada.
        </p>

        <h4 class="text-white font-bold mb-3 mt-4">A Lista Segura para 2026:</h4>
        <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5 font-mono text-sm text-[#31A8FF] break-all">
            -nojoy -softparticlesdefaultoff +fps_max 0 +cl_showfps 1 -vulkan
        </div>
        
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4 mt-4">
            <li><code>-nojoy</code>: Desativa suporte a joystick, liberando uma pequena quantia de RAM.</li>
            <li><code>-softparticlesdefaultoff</code>: Reduz a queda de fps perto de fumaças (smoke).</li>
            <li><code>+fps_max 0</code>: Tira o limite de 400 FPS do menu.</li>
            <li><code>-vulkan</code> (Opcional): Force a API Vulkan em vez de DirectX 11. <strong>Teste isso!</strong> Em placas AMD e Linux, dá +20% FPS. Em Nvidia antigas, pode piorar.</li>
            <li><strong>Mito morto:</strong> <code>-high</code> causa instabilidade de áudio no CS2. Não use.</li>
        </ul>
      `
    },
    {
      title: "2. Comandos de Console Essenciais (Autoexec)",
      content: `
        <p class="mb-4 text-gray-300">
            Você deve criar um arquivo <code>autoexec.cfg</code> em <code>game/csgo/cfg/</code> para carregar esses comandos sempre que abrir o jogo.
        </p>

        <h4 class="text-white font-bold mb-3 mt-4">Comandos de Rede e Performance:</h4>
        <div class="bg-gray-800 p-4 rounded-lg font-mono text-xs text-green-400 space-y-2">
            <p>cl_updaterate 128 // Força a atualização máxima mesmo em sub-tick</p>
            <p>cl_interp 0.015625 // Ajusta a interpolação para conexão estável</p>
            <p>cl_interp_ratio 1 // Reduz o buffer de pacotes (Menos lag, mais risco de teleporte)</p>
            <p>r_fullscreen_gamma 2.2 // Brilho correto (pode variar com monitor)</p>
            <p>engine_no_focus_sleep 0 // Mantém FPS alto mesmo com Alt-Tab (útil para streamers)</p>
            <p>r_show_build_info 0 // Remove o texto da versão no canto da tela</p>
            <p>fps_max 0 // Libera o frame limiter</p>
        </div>

        <h4 class="text-white font-bold mb-3 mt-4">Jump Throw Bind (Ainda necessário?)</h4>
        <p class="text-gray-300 text-sm">
            O CS2 agora tem jump-throw nativo (o jogo detecta se você pulou e soltou a granada no mesmo tempo). Porém, para precisão de pixel perfeita, a bind (alias) ainda é usada por profissionais:
        </p>
        <div class="bg-gray-800 p-4 rounded-lg font-mono text-xs text-orange-400 mt-2">
            alias "+jumpaction" "+jump;"<br/>
            alias "+throwaction" "-attack; -attack2"<br/>
            alias "-jumpaction" "-jump"<br/>
            bind "v" "+jumpaction;+throwaction;"
        </div>
      `
    },
    {
      title: "3. Configurações de Vídeo: Otimizando Source 2",
      content: `
        <p class="mb-4 text-gray-300">
            O menu de vídeo "Advanced Video" mudou tudo.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
            <li><strong>Boost Player Contrast:</strong> <span class="text-green-500 font-bold">Enabled</span>. Essencial para ver inimigos em cantos escuros. Custa 2-3 FPS, vale a pena.</li>
            <li><strong>Vertical Sync:</strong> <span class="text-red-500 font-bold">Disabled</span>. Nunca ative em CS.</li>
            <li><strong>Multisampling Anti-Aliasing Mode (MSAA):</strong> 2x ou 4x. Source 2 fica muito serrilhado sem AA. CMAA2 é uma alternativa mais leve.</li>
            <li><strong>Global Shadow Quality:</strong> <span class="text-green-500 font-bold">High/Medium</span>. No CS2, sombras denunciam posição. No Low você perde a vantagem tática.</li>
            <li><strong>Model / Texture Detail:</strong> Medium. Não afeta muito FPS.</li>
            <li><strong>Shader Detail:</strong> Low. Reduz o brilho excessivo em skins e economiza GPU.</li>
            <li><strong>Particle Detail:</strong> Low. Essencial para não travar na Smoke/HE.</li>
            <li><strong>Ambient Occlusion:</strong> Medium/Disabled. Deixa o jogo bonito, mas custa FPS.</li>
            <li><strong>High Dynamic Range:</strong> Performance.</li>
            <li><strong>FidelityFX Super Resolution (FSR):</strong> Disabled (Quality). Só use FSR se seu PC for muito fraco. No CS2, o FSR adiciona um pouco de "input lag" e borra a visão de longe. Prefira rodar em 4:3 esticado (1280x960) do que usar FSR em 1080p.</li>
            <li><strong>NVIDIA Reflex Low Latency:</strong> <span class="text-green-500 font-bold">Enabled + Boost</span>. Obrigatório.</li>
        </ul>
      `
    }
  ];

  const advancedContentSections = [
    {
      title: "Shader Cache: A Causa dos Stutters",
      content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-purple-400 font-bold mb-4 text-xl">⚠️ Travando na primeira vez que atira?</h4>
                <p class="text-gray-300 mb-4">
                    O CS2 compila shaders sob demanda. Na primeira vez que você vê uma skin ou efeito novo, o jogo trava por 0.1s. Isso melhora com o tempo, mas atualizações de driver resetam isso.
                </p>
            </div>

            <h4 class="text-white font-bold mb-3 text-lg">Como rebuildar shaders corretamente:</h4>
            <p class="text-gray-300 mb-4 text-sm">
                A Valve recomenda deixar o jogo rodando no menu principal por 10-15 minutos após uma atualização grande ou update de driver.
            </p>
            <p class="text-gray-300 mb-4 text-sm font-bold">Solução Avançada (DirectX Shader Cache):</p>
            <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
                <li>Abra a Limpeza de Disco do Windows.</li>
                <li>Selecione C: > Marque <strong>"DirectX Shader Cache"</strong>.</li>
                <li>Execute a limpeza.</li>
                <li>Reinicie o PC.</li>
                <li>Entre em um mapa de DM (Deathmatch) com bots e jogue por 5 minutos. Isso recriará o cache limpo e organizado.</li>
            </ol>
            `
    },
    {
      title: "Áudio 3D e Equalização",
      content: `
            <p class="mb-4 text-gray-300 leading-relaxed">
                O som do CS2 é processado de forma diferente. O comando <code>snd_mixahead</code> padrão (0.025) às vezes causa som "craquelado" em PCs fracos.
            </p>
            <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Se o som falhar: Aumente para <code>snd_mixahead 0.05</code>.</li>
                <li><strong>EQ Profile:</strong> Nas configurações de áudio do jogo, use "Crisp" (Nítido) para destacar passos e reload, ou "Smooth" se os tiros de AWP estiverem machucando seus ouvidos.</li>
                <li><strong>Perspective Correction:</strong> Sim. Ajuda a identificar se o som vem de trás ou da frente.</li>
            </ul>
            `
    }
  ];

  const additionalContentSections = [
    {
      title: "Monitor 4:3 Stretched: Vantagem ou Hábito?",
      content: `
            <div class="space-y-6">
                <div class="flex gap-4">
                    <div class="shrink-0 w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold text-xl">📐</div>
                    <div>
                        <h4 class="text-white font-bold text-lg">Hitbox Maior? Não.</h4>
                        <p class="text-gray-400 text-sm leading-relaxed mt-1">
                            Jogar em 1280x960 (4:3) esticado NÃO aumenta a hitbox do inimigo no código do jogo. Mas aumenta o <strong>modelo visual</strong> na sua tela, tornando mais fácil focar e clicar na cabeça. Além disso, menos pixels = mais FPS.
                        </p>
                    </div>
                </div>

                <div class="flex gap-4">
                    <div class="shrink-0 w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold text-xl">👀</div>
                    <div>
                        <h4 class="text-white font-bold text-lg">Visão Periférica Reduzida</h4>
                        <p class="text-gray-400 text-sm leading-relaxed mt-1">
                            O custo do 4:3 é perder visão lateral (FOV reduzido). Inimigos nos cantos da tela não aparecerão. No nível profissional, a troca vale a pena pelo foco extra. Para casuais, 16:9 Nativo pode ser mais confortável.
                        </p>
                    </div>
                </div>
            </div>
            `
    }
  ];

  const faqItems = [
    {
      question: "O comando 'fps_max 0' aumenta o load time?",
      answer: "Sim, curiosamente. Em alguns PCs, deixar o FPS ilimitado faz o menu de carregamento (loading screen) travar porque a CPU tenta renderizar 900+ frames na tela de load. Se seu jogo trava no load, use `fps_max 400`."
    },
    {
      question: "Como vejo meu FPS sem o net_graph?",
      answer: "A Valve removeu o `net_graph 1` clássico. Agora você deve usar as opções de telemetria nas configurações do jogo (Game Settings > Telemetry) e ativar 'Show FPS and Ping'. Ou usar o comando `cl_showfps 1` (mas ele é feio e pequeno)."
    },
    {
      question: "O Voltris Optimizer reduz var (variance)?",
      answer: "Sim. O 'var' alto geralmente é culpa de processos de fundo disputando a CPU com o CS2. Ao isolar o processo do jogo e limpar a fila de interrupções, o Voltris estabiliza o frametime, que é o principal fator do 'var'."
    }
  ];

  const externalReferences = [
    { name: "Valve Developer Community - CS2 Commands", url: "https://developer.valvesoftware.com/wiki/Counter-Strike_2" },
    { name: "ProSettings.net - CS2 Pro Configs", url: "https://prosettings.net/cs2/" },
    { name: "Reddit r/GlobalOffensive Performance", url: "https://www.reddit.com/r/GlobalOffensive/" }
  ];

  const relatedGuides = [
    {
      href: "/guias/valorant-reduzir-input-lag",
      title: "Input Lag em Valorant",
      description: "Dicas de latência que também servem para CS2."
    },
    {
      href: "/guias/teclado-mecanico-vs-membrana-qual-o-melhor",
      title: "Teclados para FPS",
      description: "Rapid Trigger e Hall Effect valem a pena?"
    },
    {
      href: "/guias/monitor-ips-vs-va-vs-tn-jogos",
      title: "Melhor Painel para CS2",
      description: "Por que TN e OLED dominam o cenário competitivo."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="30 min"
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
