import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'amd-adrenalin-configuracao-competitiva',
    title: "AMD Radeon Software 2026: O Guia Definitivo de Otimização e Undervolt",
    description: "Possui uma RX 6000 ou 7000? Descubra como configurar o Radeon Anti-Lag 2, Radeon Super Resolution (RSR), fazer Undervolt seguro e corrigir os stutters de Shader Cache.",
    category: 'otimizacao',
    difficulty: 'Avançado',
    time: '50 min'
};

const title = "AMD Adrenalin Edition (2026): Extraindo o Máximo da sua Radeon";
const description = "O software da AMD é mais moderno que o da Nvidia, mas cheio de armadilhas. Aprenda a desligar recursos que causam lag e ativar as joias escondidas como o Radeon Chill e Anti-Lag 2.";

const keywords = [
    'amd adrenalin melhores configurações competitivo 2026',
    'radeon anti-lag 2 cs2 ativar input lag',
    'radeon super resolution vs fsr diferenca',
    'amd shader cache stuttering fix regedit',
    'undervolt rx 6600 rx 7600 seguro',
    'amd noise suppression audio',
    'freesync premium pro configuração',
    'radeon chill vs frame rate target control',
    'driver only install vs full install',
    'voltris optimizer amd fix'
];

export const metadata: Metadata = createGuideMetadata('amd-adrenalin-configuracao-competitiva', title, description, keywords);

export default function AmdGuide() {
    const summaryTable = [
        { label: "Software", value: "Adrenalin 24.x+" },
        { label: "Anti-Lag", value: "Ligado (Nível 2 em CS2)" },
        { label: "RSR", value: "Depende (Ver guia)" },
        { label: "Tessellation", value: "Override (x8 ou x16)" },
        { label: "Texture Filtering", value: "Performance" },
        { label: "FreeSync", value: "Ligado" },
        { label: "Surface Format", value: "Desativado" },
        { label: "Voltris", value: "Recomendado" }
    ];

    const contentSections = [
        {
            title: "Introdução: A Filosofia Radeon",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Diferente do painel Nvidia que é sóbrio, o AMD Adrenalin é um hub completo de jogos. Isso é bom e ruim. Bom porque temos ferramentas de Overclock embutidas (WattMan). Ruim porque ele vem entupido de recursos como "Radeon Boost" que prometem performance mas destroem a qualidade da imagem dinamicamente.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          Neste guia extenso, vamos limpar a casa. Vamos desativar o "bloatware" visual e focar puramente na latência de quadros e estabilidade de clock. Se você sofre com <strong>"Driver Timeout" (Tela preta que volta)</strong>, este guia também é a solução.
        </p>

        <div class="bg-[#0A0A0F] border border-red-500/30 p-5 rounded-xl my-6">
            <h4 class="text-red-400 font-bold mb-2">Instalação: Minimalista vs Completa</h4>
            <p class="text-gray-300 text-sm mb-4">
                Ao instalar o driver, a AMD pergunta: "Full Install", "Minimal" ou "Driver Only".
                <br/><strong>Recomendação Voltris:</strong> Use <strong class="text-white">Full Install</strong> se você quer fazer Undervolt e usar Anti-Lag. Use <strong>Driver Only</strong> se você tem um PC muito fraco e quer zero processos em background (mas você perde o painel de controle). O meio termo "Minimal" não vale a pena.
            </p>
        </div>
      `
        },
        {
            title: "Aba Gaming: Configurações Globais",
            content: `
        <p class="mb-4 text-gray-300">
            Vá em <strong>Gaming > Global Graphics</strong>. Ignore os perfis "eSports" ou "Gaming" predefinidos. Vamos customizar.
        </p>
        
        <div class="space-y-6">
            <div class="bg-[#0A0A0F] p-5 rounded-xl border border-white/5">
                <h4 class="text-[#FF4B6B] font-bold mb-2">Radeon Anti-Lag & Anti-Lag 2</h4>
                <p class="text-gray-400 text-sm mb-3">
                    <strong>O que faz:</strong> Sincroniza a CPU com a GPU, similar ao Nvidia Low Latency.
                </p>
                <p class="text-white font-mono text-sm border-l-2 border-[#FF4B6B] pl-3">
                    Recomendação: <strong>LIGADO</strong>.
                </p>
                <p class="text-gray-400 text-xs mt-2">
                    Em jogos suportados (como CS2), o Anti-Lag 2 aparece. Ele é superior pois se integra ao jogo. Mantenha sempre ligado para reduzir o input lag em até 30%.
                </p>
            </div>

            <div class="bg-[#0A0A0F] p-5 rounded-xl border border-white/5">
                <h4 class="text-[#FF4B6B] font-bold mb-2">Radeon Boost</h4>
                <p class="text-gray-400 text-sm mb-3">
                    <strong>O que faz:</strong> Reduz a resolução dinamicamente quando você move o mouse rápido.
                </p>
                <p class="text-white font-mono text-sm border-l-2 border-[#FF4B6B] pl-3">
                    Recomendação: <strong>DESLIGADO (OFF)</strong>.
                </p>
                <p class="text-gray-400 text-xs mt-2">
                    Isso causa uma sensação horrível de incosistência. Sua mira fica "leve" e depois "pesada" porque o framerate flutua. Nunca use isso em jogos competitivos.
                </p>
            </div>

            <div class="bg-[#0A0A0F] p-5 rounded-xl border border-white/5">
                <h4 class="text-[#FF4B6B] font-bold mb-2">Radeon Image Sharpening (RIS)</h4>
                <p class="text-gray-400 text-sm mb-3">
                    <strong>O que faz:</strong> Filtro de nitidez pós-processamento.
                </p>
                <p class="text-white font-mono text-sm border-l-2 border-[#FF4B6B] pl-3">
                    Recomendação: <strong>Ligado (10% a 20%)</strong>.
                </p>
                <p class="text-gray-400 text-xs mt-2">
                    Diferente da Nvidia, o filtro da AMD tem custo de performance quase zero (Cas). Ajuda a remover o borrão de antialiasing TAA em jogos como Warzone. Não passe de 20% ou a imagem fica granulada.
                </p>
            </div>

            <div class="bg-[#0A0A0F] p-5 rounded-xl border border-white/5">
                <h4 class="text-[#FF4B6B] font-bold mb-2">Radeon Chill</h4>
                <p class="text-gray-400 text-sm mb-3">
                    <strong>O que faz:</strong> Limitador de FPS dinâmico para economizar energia.
                </p>
                <p class="text-white font-mono text-sm border-l-2 border-[#FF4B6B] pl-3">
                    Recomendação: <strong>Desligado</strong> (Para Máxima Performance).
                </p>
                <p class="text-gray-400 text-xs mt-2">
                    No entanto, se você quer apenas travar o FPS, use o "Frame Rate Target Control" na aba Avançada, ou o Chill definindo Min e Max para o mesmo valor (ex: 144). O Chill é muito eficiente para notebooks gamers para evitar superaquecimento.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Aba Avançada: Onde a Performance Mora",
            content: `
        <p class="mb-4 text-gray-300">
            Role para baixo e abra a seção "Advanced". É aqui que ganhamos FPS de graça.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
            <li><strong>Frame Rate Target Control:</strong> Desativado (Use o limitador do jogo ou RivaTuner).</li>
            <li><strong>Anti-Aliasing:</strong> Use Application Settings.</li>
            <li><strong>Anti-Aliasing Method:</strong> Multisampling (Os outros, como Supersampling, matam o FPS).</li>
            <li><strong>Morphological Anti-Aliasing:</strong> <span class="text-red-400 font-bold">DESLIGADO</span>. Isso borra toda a tela, incluindo textos. Nunca use.</li>
            <li><strong>Anisotropic Filtering:</strong> Disabled (Deixe o jogo controlar).</li>
            <li><strong>Texture Filtering Quality:</strong> <span class="text-emerald-400 font-bold">Performance</span>. A diferença visual pra "High" é nula, mas ganha estabilidade.</li>
            <li><strong>Surface Format Optimization:</strong> <span class="text-emerald-400 font-bold">Enabled</span>. Permite o driver mudar formatos de textura antigos para novos mais rápidos.</li>
            <li><strong>Tessellation Mode:</strong> <span class="text-yellow-400 font-bold">Override application settings</span>.
                <br/><span class="text-sm text-gray-400 ml-6">Configure o <strong>Maximum Tessellation Level</strong> para <strong>8x ou 16x</strong>. Por padrão é 64x. A diferença visual é imperceptível, mas em jogos como The Witcher 3 ou Crysis, baixar de 64x para 8x dobra o FPS.</span>
            </li>
        </ul>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "RSR (Radeon Super Resolution): O DLSS para Todos",
            content: `
        <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
            <h4 class="text-[#FF4B6B] font-bold mb-4 text-xl">Como usar o RSR corretamente</h4>
            <p class="text-gray-300 mb-4">
                O RSR é um upscaler espacial que funciona no nível do driver. Ele pega uma imagem 720p ou 900p e estica para 1080p com nitidez.
            </p>
            <ol class="list-decimal list-inside text-gray-300 text-sm space-y-2">
                <li>Ative o RSR no painel AMD.</li>
                <li>Entre no jogo.</li>
                <li>Mude a resolução do jogo para uma MENOR que a do monitor (ex: 1600x900 em monitor 1080p) e coloque em Tela Cheia Exclusiva.</li>
                <li>O driver detecta automaticamente e aplica o upscale.</li>
            </ol>
            <p class="mt-3 text-sm text-yellow-400">
                <strong>Atenção:</strong> Se o jogo tiver FSR (FidelityFX Super Resolution) nativo nas opções, USE O FSR. O FSR nativo é melhor que o RSR do driver, porque o FSR processa a imagem antes do HUD (interface), enquanto o RSR aplica filtro na tela toda, podendo deixar o texto e minimapa feios.
            </p>
        </div>
      `
        },
        {
            title: "Performance Tuning (Undervolt & Overclock)",
            content: `
        <p class="mb-4 text-gray-300">
            Aba <strong>Performance > Tuning</strong>. Aceite o aviso de responsabilidade.
            <br/>Placas AMD (RDNA2/3) vêm com voltagem muito alta de fábrica. Fazer Undervolt na verdade AUMENTA a performance porque a placa esquenta menos e sustenta clocks mais altos.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-[#0A0A0F] p-4 border border-white/5 rounded-lg">
                <h5 class="text-white font-bold">Passo a Passo Seguro</h5>
                <ol class="list-decimal list-inside text-gray-400 text-xs mt-2 space-y-1">
                    <li>Ative "Custom" no Tuning Control.</li>
                    <li>Ative "Voltage / Frequency".</li>
                    <li>Reduza a voltagem (mV) em passos de -25mV.</li>
                    <li>Exemplo RX 6600: Padrão 1150mV -> Seguro 1100mV.</li>
                    <li>Rode um benchmark (TimeSpy ou jogo). Se não crashar, baixe mais 10mV.</li>
                </ol>
            </div>
            <div class="bg-[#0A0A0F] p-4 border border-white/5 rounded-lg">
                <h5 class="text-white font-bold">Curva de Fan</h5>
                <p class="text-gray-400 text-xs mt-2">
                    Desative o "Zero RPM" se quiser temperaturas menores em idle.
                    <br/>Ajuste a curva para atingir 100% de fan apenas se passar de 75°C. Placas AMD aguentam até 95°C (Junction Temp) tranquilamente, não precisa ter medo de calor.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Correção de Stutters: Shader Cache Reset",
            content: `
        <p class="mb-4 text-gray-300">
            Placas AMD sofrem mais com corrupção de cache de shader que Nvidia. Se seu jogo (Fortnite/Warzone) começar a travar do nada após um update:
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
            <li>Vá em <strong>Gaming > Graphics</strong>.</li>
            <li>Role até o final e clique em <strong>Reset Shader Cache</strong>.</li>
            <li>Reinicie o PC.</li>
            <li>Abra o jogo. A primeira partida vai travar um pouco (recompilando), mas depois ficará lisa.</li>
            <li><strong class="text-[#FF4B6B]">Dica Voltris:</strong> O nosso otimizador faz isso automaticamente e ainda ajusta a chave de registro do Windows (DXCache) para evitar que o cache fique fragmentado.</li>
        </ol>
      `
        },
        {
            title: "FreeSync Premium Pro",
            content: `
        <p class="mb-4 text-gray-300">
            Na aba <strong>Display</strong>. Verifique se o FreeSync está "Enabled".
            <br/>Se você joga competitivo (CS2), alguns puristas preferem desligar. Mas o FreeSync moderno da AMD adiciona menos de 1ms de latência. A suavidade visual de não ter "tearing" (rasgos na tela) ajuda muito no rastreamento de alvos (tracking) em jogos como Apex Legends.
            <br/><strong>Configuração Ideal:</strong> FreeSync ON no Driver + V-Sync OFF no Jogo + Cap de FPS (Hz - 3).
        </p>
      `
        },
        {
            title: "Gravando Clips: Radeon ReLive",
            content: `
        <p class="mb-4 text-gray-300">
            Em <strong>Record & Stream</strong>. O codec da AMD (AMF/VCE) melhorou muito.
            <br/>Para gravar sem perder FPS:
            <br/>- Use codec <strong>HEVC (H.265)</strong> se for apenas gravar para editar e postar no YouTube (arquivo fica menor e melhor qualidade).
            <br/>- Use <strong>AVC (H.264)</strong> se for fazer stream na Twitch (Twitch não suporta H.265 bem ainda).
            <br/>- Bitrate de Gravação: 30 Mb/s para 1080p60 é suficiente.
            <br/>- Desative "Instant Gift" (o buffer de replay) se tiver pouca RAM (8GB), pois ele reserva RAM para o buffer.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Diagnóstico de Erros (Driver Timeout)",
            content: `
            <div class="bg-red-900/10 p-5 rounded-xl border border-red-500/20">
                <h4 class="text-red-400 font-bold mb-3 text-xl">A maldição do "AMD Driver Timeout"</h4>
                <p class="text-gray-300 mb-4">
                    Se sua tela congela e o software avisa que o driver crashou. Causas comuns:
                </p>
                <ul class="list-disc list-inside text-gray-300 text-sm space-y-2">
                    <li><strong>MPO (Multi-Plane Overlay):</strong> Assim como na Nvidia, o MPO do Windows buga drivers AMD. O Voltris Optimizer desativa isso.</li>
                    <li><strong>Memória RAM Instável:</strong> O driver AMD é muito sensível a RAM ruim. Se o XMP estiver instável, o driver de vídeo é o primeiro a cair. Teste desativar o XMP da BIOS.</li>
                    <li><strong>Windows Update:</strong> O Windows adora substituir o driver AMD oficial por uma versão "Basic Display Adapter" antiga. Use a ferramenta "Show/Hide Updates" da Microsoft para bloquear updates de driver de vídeo ou use o DDU com a opção "Prevent Windows Update" marcada.</li>
                </ul>
            </div>
            `
        },
        {
            title: "Apêndice: Cores 10-Bit e Pixel Format",
            content: `
            <p class="mb-4 text-gray-300">
                Na aba <strong>Display</strong>, verifique "Pixel Format".
                <br/>Deve estar em <strong>RGB 4:4:4 Pixel Format PC Standard (Full RGB)</strong>.
                <br/>Se seu monitor suportar, ative <strong>10-bit Color Depth</strong>. A AMD tem excelente suporte a 10-bit (melhores gradientes de cor) em OpenGL e DirectX, superior à Nvidia em aplicações profissionais.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "AMD Noise Suppression vale a pena?",
            answer: "É bom, mas consome um pouco de processamento da GPU usando os 'AI Accelerators' (na série 7000) ou Shaders (na série 6000). Se você tem uma CPU forte, prefira usar o Krisp do Discord. Se precisa suprimir ruído em gravação local (OBS), o da AMD é excelente."
        },
        {
            question: "Devo usar o 'Enhanced Sync'?",
            answer: "Cuidado. O Enhanced Sync permite FPS ilimitado sem tearing, mas pode causar micro-stutters (pulos de frame). Para competitivo, FreeSync normal é mais consistente. Só use Enhanced Sync se você tem um monitor 60Hz e quer jogar a 200 FPS sem rasgar a tela."
        },
        {
            question: "O driver 'Pro' (azul) é melhor que o Adrenalin (vermelho)?",
            answer: "Para jogos, não. O driver Pro é certificado para CAD/SolidWorks e atualiza raramente. O Adrenalin recebe otimizações de jogos ('Game Ready') todo mês. Fique com o vermelho (Adrenalin)."
        }
    ];

    const externalReferences = [
        { name: "AMD Anti-Lag 2 Technical Docs", url: "https://gpuopen.com/technologies/anti-lag-2/" },
        { name: "Ancient Gameplays (Canal especialista em AMD)", url: "https://www.youtube.com/@AncientGameplays" },
        { name: "MorePowerTool (Tweak avançado de BIOS AMD)", url: "https://www.igorslab.de/en/red-bios-editor-and-morepowertool-adjust-and-optimize-your-vbios-and-more-stable-overclocking-navi-unlimited/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/como-usar-ddu-driver-uninstaller",
            title: "Guia DDU",
            description: "Crucial para quem migrou de Nvidia para AMD."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Guia SSD",
            description: "Carregamento rápido de texturas."
        },
        {
            href: "/guias/monitor-hz-configuracao-correta",
            title: "Monitor Setup",
            description: "Configure o FreeSync no monitor."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="50 min"
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
