import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'valorant-reduzir-input-lag',
    title: "Valorant (2026): Guia Extremo de FPS e Latência Zero",
    description: "Quer sair do Ouro? Comece otimizando seu PC. Aprenda a configurar Raw Input Buffer, Nvidia Reflex, Multithreaded Rendering e tweaks no GameUserSettings.ini.",
    category: 'jogos',
    difficulty: 'Avançado',
    time: '55 min'
};

const title = "Valorant Optimization (2026): Input Lag Mínimo e FPS Máximo";
const description = "Valorant é um jogo de CPU. Se sua CPU engasgar, você erra o tiro. Este guia ajusta o Windows e o jogo para garantir que o seu tempo de reação seja o único limite.";

const keywords = [
    'valorant fps boost 2026 config',
    'input lag valorant nvidia reflex on boost',
    'raw input buffer valorant on or off',
    'multithreaded rendering valorant o que é',
    'configurar som hrtf valorant',
    'resolução esticada valorant aumenta boneco',
    'vanguard high cpu usage fix',
    'gameusersettings.ini valorant tweak',
    'network buffering minimum moderate',
    'voltris optimizer valorant priority'
];

export const metadata: Metadata = createGuideMetadata('valorant-reduzir-input-lag', title, description, keywords);

export default function ValorantGuide() {
    const summaryTable = [
        { label: "Reflex", value: "On + Boost" },
        { label: "Raw Input", value: "On (Mouse 8KHz)" },
        { label: "Multithread", value: "On (Se tiver 6+ cores)" },
        { label: "Material", value: "Low" },
        { label: "UI", value: "Low" },
        { label: "Vignette", value: "Off" },
        { label: "Anti-Aliasing", value: "MSAA 2x/4x" }
    ];

    const contentSections = [
        {
            title: "Introdução: CPU Bound",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Valorant roda até em torradeira, mas rodar a 60 FPS e rodar a 300 FPS faz uma diferença enorme no "Peeker's Advantage". Como o jogo depende muito de um único núcleo da CPU (Single Thread), qualquer processo de fundo do Windows pode causar uma micro-travada.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Neste guia, não vamos só mexer no menu. Vamos editar o arquivo <code>.ini</code> e configurar o Windows para dar prioridade total ao processo <code>VALORANT-Win64-Shipping.exe</code>.
        </p>
        
        <div class="bg-[#0A0A0F] border border-red-500/30 p-5 rounded-xl my-6">
            <h4 class="text-red-400 font-bold mb-2">Vanguard e Performance</h4>
            <p class="text-gray-300 text-sm">
                O anti-cheat da Riot (Vanguard/vgc.exe) roda no nível do Kernel (Ring 0). Ele é agressivo. Às vezes, ele entra em conflito com drivers de RGB (iCUE, Razer Synapse) ou antivírus de terceiros (Avast/Kaspersky).
                <br/><strong>Dica Voltris:</strong> Se seu Valorant trava, desinstale softwares de RGB e use apenas o Windows Defender. O Voltris Optimizer tem um modo "Riot Compatible" que desativa serviços conflitantes sem desligar a segurança.
            </p>
        </div>
      `
        },
        {
            title: "Capítulo 1: Configurações de Vídeo (Geral)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#FF4655] font-bold mb-1">Nvidia Reflex Low Latency</h4>
                <p class="text-white font-mono text-sm mb-2">Recomendado: <span class="text-emerald-400">On + Boost</span></p>
                <p class="text-gray-400 text-xs">Mantém a GPU em clock máximo e elimina a fila de renderização. Essencial.</p>
            </div>
            
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#FF4655] font-bold mb-1">Multithreaded Rendering</h4>
                <p class="text-white font-mono text-sm mb-2">Recomendado: <span class="text-emerald-400">On</span></p>
                <p class="text-gray-400 text-xs">Ligue se sua CPU tem 6 núcleos ou mais e 12 threads. Se você tem um i3 antigo ou dual-core, desligue, pois pode causar stutter.</p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Gráficos (Qualidade vs Clareza)",
            content: `
        <table class="w-full text-sm text-left text-gray-400">
            <tbody>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Material, Texture, UI Quality</td>
                    <td class="py-2 text-yellow-400">Low</td>
                    <td class="py-2">Menos detalhes = Inimigo destaca mais.</td>
                </tr>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Vignette</td>
                    <td class="py-2 text-red-400">Off</td>
                    <td class="py-2">Escurece as bordas da tela. Péssimo.</td>
                </tr>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">VSync</td>
                    <td class="py-2 text-red-400">Off</td>
                    <td class="py-2">Latência pura. Nunca ligue.</td>
                </tr>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Anti-Aliasing</td>
                    <td class="py-2 text-emerald-400">MSAA 4x</td>
                    <td class="py-2">Sem AA, as cercas e fios tremem. MSAA 2x ou 4x é leve e limpa a visão. Evite FXAA (borrado).</td>
                </tr>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Anisotropic Filtering</td>
                    <td class="py-2">4x ou 8x</td>
                    <td class="py-2">Melhora texturas de chão em ângulos oblíquos. Baixo custo.</td>
                </tr>
                 <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Bloom/Distortion/Shadows</td>
                    <td class="py-2 text-red-400">Off</td>
                    <td class="py-2">Poluição visual. Desligue tudo.</td>
                </tr>
            </tbody>
        </table>
      `
        },
        {
            title: "Capítulo 3: Raw Input Buffer (A revolução)",
            content: `
        <p class="mb-4 text-gray-300">
            Nas configurações de "Geral" > "Mouse".
            <br/><strong>Raw Input Buffer:</strong> <span class="text-emerald-400 font-bold">LIGADO (On)</span>.
            <br/>Isso faz o jogo ler os dados do mouse direto da API do hardware, ignorando o Windows.
            <br/><em>Por que?</em> Se você tem um mouse de 1000Hz (padrão gamer) ou 4000Hz/8000Hz (High Polling), o Windows pode engasgar processando tanto movimento. O Raw Input resolve isso. Mesmo com mouse simples, a sensação de mira fica mais "crua" e direta.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Stretched Resolution (O Mito)",
            content: `
        <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
            <h4 class="text-orange-400 font-bold mb-4 text-xl">Diferença do CS2</h4>
            <p class="text-gray-300 mb-4">
                No CS2, usar 4:3 esticado deixa os bonecos mais gordos. <strong>No Valorant, NÃO.</strong>
                <br/>A Riot bloqueou isso. Se você colocar 1280x960, apenas o HUD (interface, mapa, vida) fica esticado. Os modelos de personagem continuam com a mesma largura (FOV fixo de 103 na horizontal).
            </p>
            <p class="text-white text-sm font-bold">Então por que os pros usam?</p>
            <ul class="list-disc list-inside text-gray-300 text-sm">
                <li>Mira (Crosshair) fica maior e mais visível.</li>
                <li>Menos pixels para a GPU renderizar = Mais FPS (bom para PCs fracos).</li>
                <li>Hábito do CS.</li>
            </ul>
        </div>
      `
        },
        {
            title: "Capítulo 5: GameUserSettings.ini (Tweak)",
            content: `
        <p class="mb-4 text-gray-300">
            Para forçar configurações gráficas abaixo do Low.
            <br/>Arquivo em: <code>%localappdata%\\VALORANT\\Saved\\Config\\(SeuID)\\Windows\\GameUserSettings.ini</code>.
        </p>
        <div class="bg-black/50 p-4 rounded font-mono text-xs text-gray-300 overflow-x-auto">
            [ScalabilityGroups]<br/>
            sg.ResolutionQuality=100.000000<br/>
            sg.ViewDistanceQuality=0<br/>
            sg.AntiAliasingQuality=0<br/>
            sg.ShadowQuality=0<br/>
            sg.PostProcessQuality=0<br/>
            sg.TextureQuality=0<br/>
            sg.EffectsQuality=0<br/>
            sg.FoliageQuality=0<br/>
            sg.ShadingQuality=0
        </div>
        <p class="mt-2 text-xs text-gray-400">
            Defina o arquivo como "Somente Leitura" após editar para o jogo não sobrescrever.
        </p>
      `
        },
        {
            title: "Capítulo 6: Otimização de Rede (Network Buffering)",
            content: `
        <p class="mb-4 text-gray-300">
            Em Geral > Rede:
            <br/><strong>Network Buffering:</strong>
            <br/>- <strong class="text-emerald-400">Minimum:</strong> Para ping baixo (0-30ms) e estável. Menor delay possível.
            <br/>- <strong>Moderate:</strong> Para ping instável ou alto (60ms+). Adiciona um leve delay para suavizar a movimentação dos inimigos e evitar teletransportes.
            <br/>Nunca use "Maximum".
        </p>
      `
        },
        {
            title: "Capítulo 7: HRTF (Áudio 3D)",
            content: `
        <p class="mb-4 text-gray-300">
            Em Áudio > Speaker Configuration: <strong>Stereo</strong>.
            <br/>Embaixo, ative <strong>HRTF (Head-Related Transfer Function)</strong>.
            <br/>O HRTF simula som 3D em fones estéreo. É essencial para saber se os passos vêm de cima (Heaven) ou de baixo (Hell) em mapas como Haven.
            <br/><em>Nota:</em> Desative qualquer "7.1 Surround" virtual do seu headset (Razer/Logitech). Deixe o som puro e deixe o HRTF do jogo fazer o trabalho.
        </p>
      `
        },
        {
            title: "Capítulo 8: Prioridade de Processo (Regedit)",
            content: `
        <p class="mb-4 text-gray-300">
            Podemos dizer ao Windows para sempre dar prioridade "Alta" ao Valorant via registro.
            <br/>Chave: <code>HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\VALORANT-Win64-Shipping.exe\\PerfOptions</code>
            <br/>Valor DWORD: <code>CpuPriorityClass</code> = 3 (High).
            <br/><strong>O Voltris Optimizer</strong> aplica isso com um clique.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 9: Stats (O que monitorar?)",
            content: `
            <p class="mb-4 text-gray-300">
                Ligue em Vídeo > Estatísticas:
                <br/>- <strong>Client FPS:</strong> Text Only.
                <br/>- <strong>Network RTT (Ping):</strong> Text Only.
                <br/>- <strong>Packet Loss:</strong> Graph (Para ver picos).
                <br/>- <strong>Render Time (CPU/GPU):</strong> Útil para saber qual o gargalo. Se CPU Time > GPU Time, você é CPU Bound.
            </p>
            `
        },
        {
            title: "Capítulo 10: Otimização de SSD (Loading)",
            content: `
            <p class="mb-4 text-gray-300">
                Instale o Valorant no SSD. Se alguém demora para carregar na seleção de agentes, todo mundo espera.
                <br/>Além disso, assets carregados do HD durante o jogo (skins novas) podem causar travadas.
                <br/>Confira nosso <a href="/guias/otimizacao-ssd-windows-11" class="text-blue-400 underline">Guia de Otimização de SSD</a> para garantir velocidade máxima.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Devo limitar o FPS no menu?",
            answer: "Sim! Limite a 30 FPS ou 60 FPS no menu. Isso deixa sua GPU esfriar entre as partidas. Não tem motivo para renderizar o menu a 500 FPS gastando energia."
        },
        {
            question: "Nvidia Low Latency no Painel ou no Jogo?",
            answer: "No jogo (Reflex). Se o jogo tem Reflex, a opção do painel Nvidia é ignorada automaticamente. Deixe Reflex On + Boost dentro do Valorant."
        },
        {
            question: "Mapas carregam, mas texturas demoram?",
            answer: "Isso é streaming de textura lento. Comum em HDs ou VRAM baixa. Reduza a qualidade de textura para Low e feche navegadores em segundo plano para liberar VRAM."
        }
    ];

    const externalReferences = [
        { name: "Riot Support - Specs & Performance", url: "https://support-valorant.riotgames.com/hc/en-us/articles/360044136134-Minimum-Recommended-PC-Specs" },
        { name: "Battle(non)sense (Input Lag Analysis)", url: "https://www.youtube.com/user/xFPxAUTh0rT" },
        { name: "Voltris Optimizer (Riot Compatible Mode)", url: "/voltrisoptimizer" }
    ];

    const relatedGuides = [
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Guia Nvidia",
            description: "Ajuste o painel para complementar o jogo."
        },
        {
            href: "/guias/mouse-dpi-polling-rate-ideal",
            title: "Guia Mouse",
            description: "800 DPI vs 1600 DPI no Valorant."
        },
        {
            href: "/guias/monitor-hz-configuracao-correta",
            title: "Guia Monitor",
            description: "DyAc é perfeito para Valorant."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="55 min"
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
