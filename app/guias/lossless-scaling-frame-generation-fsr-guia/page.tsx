import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'lossless-scaling-frame-generation-fsr-guia',
    title: "Lossless Scaling (2026): Frame Generation em Qualquer GPU (Guia)",
    description: "Dobre o FPS de qualquer jogo usando o app Lossless Scaling (LSFG). Guia de como configurar Frame Gen em emuladores e jogos travados a 30fps.",
    category: 'software',
    difficulty: 'Iniciante',
    time: '10 min'
};

const title = "FPS Infinito: O Guia do Lossless Scaling";
const description = "Você não precisa de uma RTX 4000 para ter Frame Generation. O app Lossless Scaling na Steam ($5) faz isso via software em qualquer placa (GTX 1060, Intel HD, AMD).";

const keywords = [
    'lossless scaling configuracao melhor lsfg 2.0',
    'como usar frame generation em emulador yuzu',
    'triplicar fps elden ring pc fraco',
    'lsfg ghosting fix latency',
    'nvidia image scaling vs fsr vs ls1',
    'jogar a 30fps com fluidez de 60fps',
    'voltris optimizer tools',
    'windowed mode exclusive fullscreen fix'
];

export const metadata: Metadata = createGuideMetadata('lossless-scaling-frame-generation-fsr-guia', title, description, keywords);

export default function LSGuide() {
    const summaryTable = [
        { label: "Ferramenta", value: "Lossless Scaling (Steam)" },
        { label: "Modo de Janela", value: "Windowed / Borderless" },
        { label: "Frame Gen", value: "LSFG 2.1" },
        { label: "Scaling Type", value: "LS1 / AMD FSR" },
        { label: "Multiplicador", value: "X2 ou X3" },
        { label: "Latência", value: "Média (Mouse)" },
        { label: "Visual", value: "Pequenos Artefatos (Ghost)" }
    ];

    const contentSections = [
        {
            title: "Introdução: Magia Negra?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Lossless Scaling captura a janela do jogo e insere frames fake (interpolados) entre os frames reais usando IA leve.
          <br/>Se seu jogo roda a 30fps, ele gera 1 frame falso a cada real -> 60fps visuais.
          <br/>Se usar modo X3 -> 90fps.
        </p>
      `
        },
        {
            title: "Capítulo 1: Configuração Obrigatória",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">O Jogo</h4>
                <p class="text-gray-400 text-xs text-justify">
                    1. O jogo OBRIGATORIAMENTE deve estar em <strong>Modo Janela</strong> ou <strong>Janela Sem Bordas</strong>. Em Tela Cheia Exclusiva o app não consegue capturar.
                    <br/>2. Trave o FPS do jogo (usando RivaTuner ou VSync) num valor estável que sua GPU aguenta (ex: 30fps ou 60fps). Se o FPS variar muito, o LSFG cria artefatos horríveis.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Configurando o App",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Scaling Mode:</strong> Auto (Aspect Ratio).
            - <strong>Scaling Type:</strong>
            <br/> LS1 (Performance): Leve e nítido.
            <br/> AMD FSR: Bom para upscaling de resoluções baixas.
            <br/> Off: Se você já está na resolução nativa e quer só o frame gen, deixe Off.
            - <strong>Frame Generation:</strong> LSFG 2.1 (O melhor atual).
            <br/> Mode: X2 (Dobra) ou X3 (Triplica). X3 adiciona muita latência, use só em RPGs lentos.
        </p>
      `
        },
        {
            title: "Capítulo 3: Aplicando (Scale)",
            content: `
        <p class="mb-4 text-gray-300">
            1. Configure o app.
            2. Clique no botão azul "Scale".
            3. Você tem 5 segundos para clicar na janela do jogo.
            4. A tela pisca e volta em tela cheia com os frames fluídos.
            <br/>Atalho: Ctrl+Alt+S.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Reduzindo a Latência",
            content: `
        <p class="mb-4 text-gray-300">
            Gerar frames gasta tempo (ms). O jogo parece rodar a 60fps, mas o input lag é de 30fps (ou pior).
            <br/>- Use <strong>Nvidia Reflex</strong> no jogo se tiver.
            <br/>- Ative "Allow Tearing" no Lossless Scaling se não ligar para cortes na tela (reduz lag).
            <br/>- Mouse: Aumente o DPI.
            <br/>- Não use LSFG em jogos competitivos (CS2/Valorant). É para Single Player.
        </p>
      `
        },
        {
            title: "Capítulo 5: Emuladores (Yuzu/Cemu)",
            content: `
        <p class="mb-4 text-gray-300">
            Perfeto para emulação.
            <br/>Zelda TOTK travado a 30fps no Yuzu?
            <br/>Ative LSFG X2.
            <br/>Visualmente vira 60fps. A fluidez de câmera é incrível.
            <br/>Como emuladores já têm input lag natural, a latência extra é menos perceptível.
        </p>
      `
        },
        {
            title: "Capítulo 6: Assistindo Vídeos (Anime 60fps)",
            content: `
        <p class="mb-4 text-gray-300">
            Você pode usar no Chrome/VLC!
            <br/>Abra um anime ou filme no YouTube. Aplique o Lossless Scaling.
            <br/>O vídeo roda interpolado (Soap Opera Effect). Alguns amam.
        </p>
      `
        },
        {
            title: "Capítulo 7: Capture API (DXGI vs WGC)",
            content: `
        <p class="mb-4 text-gray-300">
            Em Settings > Capture API.
            <br/>- <strong>DXGI:</strong> Padrão, mais rápido.
            <br/>- <strong>WGC (Windows Graphics Capture):</strong> Use se o DXGI der tela preta ou não capturar o overlay (menus) do jogo.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Ghosting (Fantasmas)",
            content: `
            <p class="mb-4 text-gray-300">
                O LSFG pode deixar rastros na interface (HUD) se ela for estática e o fundo mover rápido.
                <br/>O LSFG 2.1 melhorou muito isso, mas ainda acontece. É o preço a se pagar por performance mágica.
            </p>
            `
        },
        {
            title: "Capítulo 9: GPU Load",
            content: `
            <p class="mb-4 text-gray-300">
                O app usa a GPU para gerar frames. Se sua GPU já estiver em 100% rodando o jogo, o Lossless Scaling vai travar.
                <br/>Você precisa deixar uma folga na GPU (limite o FPS do jogo para usar 80-90% da GPU) para o app funcionar.
            </p>
            `
        },
        {
            title: "Capítulo 10: Alternativa Grátis? (Magpie)",
            content: `
            <p class="mb-4 text-gray-300">
                Existe o <strong>Magpie</strong> (Open Source), mas ele é focado em FSR (Upscaling) e não tem um Frame Generation tão bom quanto o LSFG pago.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Funciona em Monitor 60Hz?",
            answer: "Sim. Se o jogo roda a 30fps, ele dobra para 60fps e enche seu monitor. Se você tem monitor 144Hz, pode fazer 48fps -> 96fps (X2) ou 72fps -> 144fps."
        },
        {
            question: "Dá ban?",
            answer: "Teoricamente não, pois ele não injeta código no jogo (apenas captura a tela como o OBS). Mas anti-cheats chatos podem reclamar. Use por conta e risco em online."
        }
    ];

    const externalReferences = [
        { name: "Lossless Scaling Steam", url: "https://store.steampowered.com/app/993090/Lossless_Scaling/" },
        { name: "LSFG Showcase", url: "https://www.youtube.com/results?search_query=lossless+scaling+lsfg+2.1" }
    ];

    const relatedGuides = [
        {
            href: "/guias/nvidia-dlss-vs-fsr-vs-xess-qual-usar",
            title: "DLSS/FSR",
            description: "Entenda Upscaling."
        },
        {
            href: "/guias/yuzu-ryujinx-otimizacao-zelda-mario-60fps-guia",
            title: "Emuladores",
            description: "Onde usar."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Iniciante"
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
