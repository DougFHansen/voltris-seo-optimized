import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'obs-studio-streaming-twitch-youtube-guia-completo',
    title: "OBS Studio (2026): Configuração PERFEITA de Streaming (Twitch/YouTube)",
    description: "Faça lives com qualidade profissional. Guia de Bitrate, Encoder NVENC AV1/H.264, filtros de microfone e cenas profissionais.",
    category: 'software',
    difficulty: 'Intermediário',
    time: '30 min'
};

const title = "Setup de Streaming Profissional";
const description = "Uma live pixelada ou travando afasta o público. Aprenda a equilibrar sua internet (Upload) com o poder do seu PC para entregar a melhor imagem possível, seja na Twitch (6000kbps) ou YouTube (4K).";

const keywords = [
    'melhor bitrate obs twitch 1080p 60fps',
    'nvenc new vs x264 encoder streaming',
    'filtros microfone obs noise suppression',
    'obs tela preta captura jogo fix',
    'av1 youtube streaming settings',
    'como configurar cenas e fontes obs',
    'voltris optimizer streaming',
    'transmissão travando frame drop'
];

export const metadata: Metadata = createGuideMetadata('obs-studio-streaming-twitch-youtube-guia-completo', title, description, keywords);

export default function OBSStreamGuide() {
    const summaryTable = [
        { label: "Encoder", value: "NVIDIA NVENC H.264 (New)" },
        { label: "Rate Control", value: "CBR (Constant Bitrate)" },
        { label: "Bitrate (Twitch)", value: "6000 - 8000 Kbps" },
        { label: "Bitrate (YouTube)", value: "15000 - 30000 Kbps" },
        { label: "Keyframe", value: "2s (Obrigatorio)" },
        { label: "Profile", value: "High" },
        { label: "Audio", value: "160/320 Kbps AAC" }
    ];

    const contentSections = [
        {
            title: "Introdução: Twitch vs YouTube",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          - <strong>Twitch:</strong> Limitada a ~8000 Kbps. Exige eficiência. H.264 é o padrão.
          - <strong>YouTube:</strong> Aceita 50.000 Kbps e 4K. Aceita codecs novos como AV1 e HEVC (H.265).
          <br/>Este guia foca nos dois.
        </p>
      `
        },
        {
            title: "Capítulo 1: Aba Output (Saída)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Configuração de Vídeo</h4>
                <p class="text-gray-400 text-xs text-justify">
                    Output Mode: <strong>Advanced</strong>.
                    <br/><strong>Encoder:</strong> NVIDIA NVENC H.264 (Se tiver GPU Nvidia) ou AMD HW H.264 (Se tiver AMD). Nunca use x264 (CPU) a menos que tenha um PC de Streaming dedicado.
                    <br/><strong>Rate Control:</strong> CBR (Sempre CBR para lives).
                    <br/><strong>Bitrate:</strong>
                    <br/>- 1080p 60fps: 6000 Kbps (Mínimo) a 8000 Kbps.
                    <br/>- 900p 60fps: 4500 - 6000 Kbps.
                    <br/>- 720p 60fps: 3000 - 4500 Kbps.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Configurações Avançadas de Encoder",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Keyframe Interval:</strong> 2 s. (Twitch EXIGE isso. Se colocar auto ou 0, sua live desconecta).
            - <strong>Preset:</strong> P7 (Slow/Best Quality) se tiver RTX 30/40. P5 se tiver GTX 10/16.
            - <strong>Tuning:</strong> High Quality.
            - <strong>Multipass Mode:</strong> Single Pass (Menos lag no jogo) ou Two Pass (Melhor qualidade visual). Use Single Pass se seu jogo perder FPS.
            - <strong>Look-ahead e Psycho Visual Tuning:</strong> Marque ambos para jogos de movimento rápido (FPS).
        </p>
      `
        },
        {
            title: "Capítulo 3: Áudio (Não ignore!)",
            content: `
        <p class="mb-4 text-gray-300">
            A imagem pode ser média, mas o áudio tem que ser perfeito.
            <br/>Clique na engrenagem do Microfone > Filters.
            <br/>Ordem dos filtros:
            <br/>1. <strong>Noise Suppression (RNNoise):</strong> Remove ventilador/teclado.
            <br/>2. <strong>Compressor:</strong> Iguala o volume. Quando você grita, ele abaixa. Quando sussurra, ele mantém. (Ratio 4:1, Threshold -18dB).
            <br/>3. <strong>Limiter:</strong> Impede estourar. (Threshold -1dB). Nunca deixe o áudio bater no vermelho.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Jogando em 2K/4K, Transmitindo em 1080p",
            content: `
        <p class="mb-4 text-gray-300">
            Aba <strong>Video</strong>.
            <br/>- <strong>Base Resolution:</strong> A resolução do seu monitor (ex: 2560x1440).
            <br/>- <strong>Output (Scaled) Resolution:</strong> A resolução da Live (ex: 1920x1080).
            <br/>- <strong>Downscale Filter:</strong> Lanczos (36 samples). Melhor nitidez.
            <br/>Isso garante que seu HUD fique certo na live.
        </p>
      `
        },
        {
            title: "Capítulo 5: YouTube e AV1 (O Futuro)",
            content: `
        <p class="mb-4 text-gray-300">
            Se for streamar no YouTube e tiver RTX 4000 ou Radeon RX 7000:
            <br/>Use encoder <strong>AV1</strong>.
            <br/>O AV1 entrega qualidade de 10.000 Kbps gastando apenas 6.000 Kbps. Sem quadriculados.
            <br/>A Twitch ainda não suporta AV1 (está em beta).
        </p>
      `
        },
        {
            title: "Capítulo 6: Fontes e Cenas (Captura Correta)",
            content: `
        <p class="mb-4 text-gray-300">
            Sempre use <strong>Game Capture</strong> (Captura de Jogo).
            <br/>Evite <strong>Display Capture</strong> (Captura de Tela).
            <br/>Por quê?
            <br/>1. Game Capture é mais performático (injeta direto no DirectX).
            <br/>2. Display Capture vaza seu desktop, emails e notificações (Risco de privacidade).
            <br/>Se o jogo não capturar, execute o OBS como Administrador. Importante!
        </p>
      `
        },
        {
            title: "Capítulo 7: Estatísticas (Stats Dock)",
            content: `
        <p class="mb-4 text-gray-300">
            Vá em Docks > Stats.
            <br/>Fique de olho em:
            <br/>- <strong>Frames missed due to rendering lag:</strong> GPU sobrecarregada. Limite o FPS do seu jogo ou baixe os gráficos.
            <br/>- <strong>Dropped frames (Network):</strong> Internet ruim. Abaixe o Bitrate.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Modo Vertical (TikTok/Shorts)",
            content: `
            <p class="mb-4 text-gray-300">
                Instale o plugin <strong>Aitum Vertical</strong>.
                <br/>Ele cria um segundo canvas 1080x1920 (9:16) paralelo.
                <br/>Você streama horizontal pra Twitch e vertical pro TikTok ao mesmo tempo (precisa de internet boa).
            </p>
            `
        },
        {
            title: "Capítulo 9: Chat na Tela",
            content: `
            <p class="mb-4 text-gray-300">
                Use o StreamElements ou StreamLabs para gerar um widget de chat.
                <br/>Adicione como "Browser Source" no OBS.
                <br/>Use CSS customizado para deixar transparente.
            </p>
            `
        },
        {
            title: "Capítulo 10: VOD Track (Música sem Copyright)",
            content: `
            <p class="mb-4 text-gray-300">
                Na Twitch, você pode separar o áudio.
                <br/>Em Output > Streaming, marque "Twitch VOD Track" (Track 2).
                <br/>Coloque suas músicas (Spotify) na Faixa 1, mas NÃO na Faixa 2.
                <br/>Assim, a live tem música, mas o vídeo salvo (VOD) fica mudo na parte da música, evitando strike de DMCA.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Upload mínimo?",
            answer: "Para 1080p, recomendamos 10 Mbps de Upload mínimo (para usar 6 Mbps estáveis). Teste no speedtest.net."
        },
        {
            question: "Stream travando para quem assiste?",
            answer: "Provavelmente seu Bitrate está muito alto e a internet do espectador não aguenta baixar, ou o servidor da Twitch está instável. Tente reduzir para 4500 Kbps."
        }
    ];

    const externalReferences = [
        { name: "OBS Studio Download", url: "https://obsproject.com/" },
        { name: "Twitch Broadcast Guidelines", url: "https://help.twitch.tv/s/article/broadcast-guidelines" }
    ];

    const relatedGuides = [
        {
            href: "/guias/obs-studio-gravacao-replay-buffer-av1",
            title: "OBS Gravação",
            description: "Para clipes."
        },
        {
            href: "/guias/discord-nitro-qualidade-voz-krisp",
            title: "Microfone",
            description: "Melhorar áudio."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
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
