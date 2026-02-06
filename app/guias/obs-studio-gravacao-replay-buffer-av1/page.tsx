import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'obs-studio-gravacao-replay-buffer-av1',
    title: "OBS Studio (2026): Replay Buffer, AV1 e Gravação Sem Lag",
    description: "Substitua o ShadowPlay pesado pelo OBS Studio otimizado. Aprenda a usar o Replay Buffer na RAM e o codec AV1 para clipar jogadas com qualidade máxima.",
    category: 'software',
    difficulty: 'Avançado',
    time: '30 min'
};

const title = "OBS Studio (2026): A Melhor Configuração de Clipes";
const description = "O GeForce Experience (ShadowPlay) às vezes buga ou pesa. O OBS Studio configurado corretamente é mais leve, tem qualidade superior e usa encoders modernos.";

const keywords = [
    'obs replay buffer vs shadowplay performance',
    'obs av1 recording settings quality',
    'configurar obs para pc fraco gravar jogos',
    'obs studio tela preta captura de jogo fix',
    'melhor bitrate gravação 1080p 60fps',
    'cqp vs cbr gravação obs',
    'nvidia nvenc h.264 new vs hevc',
    'voltris optimizer streaming',
    'audio separado discord obs jogo'
];

export const metadata: Metadata = createGuideMetadata('obs-studio-gravacao-replay-buffer-av1', title, description, keywords);

export default function OBSGuide() {
    const summaryTable = [
        { label: "Encoder", value: "Nvidia NVENC AV1 / HEVC" },
        { label: "Rate Control", value: "CQP (Qualidade)" },
        { label: "CQ Level", value: "20 (Equilíbrio)" },
        { label: "Replay Buffer", value: "ON (120s)" },
        { label: "Process Priority", value: "High (No Lag)" },
        { label: "Game Capture", value: "Admin Mode" },
        { label: "Format", value: "MKV (Segurança)" }
    ];

    const contentSections = [
        {
            title: "Introdução: Por que OBS > ShadowPlay?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O OBS permite separar o áudio do Discord do jogo, usar encoders mais eficientes (AV1) e personalizar overlays. Com o "Replay Buffer", ele funciona exatamente igual ao "Instant Replay", salvando os últimos minutos apenas quando você aperta um botão.
        </p>
      `
        },
        {
            title: "Capítulo 1: Configuração de Encoder (AV1)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Output > Recording</h4>
                <p class="text-gray-400 text-xs text-justify">
                    - <strong>Video Encoder:</strong>
                    <br/>- Se tem RTX 4000+: Use <strong>NVIDIA NVENC AV1</strong>. (40% mais qualidade com mesmo tamanho).
                    <br/>- Se tem RTX 2000/3000: Use <strong>NVIDIA NVENC HEVC (H.265)</strong>.
                    <br/>- Se tem GTX 1000: Use <strong>NVIDIA NVENC H.264</strong>.
                    <br/>- <strong>Rate Control:</strong> CQP (Constant Quantization Parameter).
                    <br/>- <strong>CQ Level:</strong> 20. (Menor = Mais qualidade e arquivo gigante. 15 é quase lossless. 25 é leve).
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Replay Buffer (O Segredo)",
            content: `
        <p class="mb-4 text-gray-300">
            Vá em Output > Replay Buffer.
            <br/>Marque "Enable Replay Buffer".
            <br/>Defina o tempo (ex: 120s = 2 minutos).
            <br/>O OBS vai gravar constantemente na memória RAM. Quando você apertar a Hotkey de salvar, ele escreve no disco.
            <br/>Isso evita desgaste do SSD com gravação constante.
        </p>
      `
        },
        {
            title: "Capítulo 3: Captura de Áudio Separada (Beta)",
            content: `
        <p class="mb-4 text-gray-300">
            Use o recurso <strong>"Application Audio Capture" (BETA)</strong> nas Fontes.
            <br/>Adicione uma fonte para o Jogo.
            <br/>Adicione outra para o Discord.
            <br/>Adicione outra para o Spotify.
            <br/>No Mixer de Áudio, você pode mutar o Spotify na gravação para não tomar Copyright no YouTube, enquanto continua ouvindo no fone.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Prioridade de Processo",
            content: `
        <p class="mb-4 text-gray-300">
            Se seu OBS trava (laga a gravação) quando a GPU chega a 99% de uso no jogo:
            <br/>Vá em Settings > Advanced.
            <br/>Mude "Process Priority" para <strong>High</strong>.
            <br/>Isso garante que o Windows reserve um pedacinho da GPU para o OBS codificar o vídeo antes de entregar o resto para o jogo. O jogo perde 1-2 FPS, mas a gravação fica fluida.
        </p>
      `
        },
        {
            title: "Capítulo 5: Formato de Arquivo (MKV)",
            content: `
        <p class="mb-4 text-gray-300">
            Grave sempre em <strong>MKV</strong> (Matroska).
            <br/>Se gravar em MP4 e o PC travar (tela azul/luz acabar), você perde o arquivo inteiro (corrompido).
            <br/>No MKV, você salva até o segundo exato da queda de energia.
            <br/>O OBS tem uma função "Remux Recordings" no menu File para converter MKV para MP4 em segundos depois.
        </p>
      `
        },
        {
            title: "Capítulo 6: Captura de Jogo (Game Capture)",
            content: `
        <p class="mb-4 text-gray-300">
            Sempre use "Game Capture" (Captura de Jogo). É o método mais eficiente que injeta direto na API gráfica.
            <br/>"Display Capture" (Captura de Tela) é lento, mostra suas notificações do Windows e tem menos FPS.
            <br/>Se o Game Capture ficar preto, execute o OBS como Administrador.
        </p>
      `
        },
        {
            title: "Capítulo 7: Lookahead e Psycho Visual Tuning",
            content: `
        <p class="mb-4 text-gray-300">
            Nas configurações do NVENC:
            <br/>- <strong>Lookahead:</strong> OFF (A menos que tenha jogo com pouco movimento).
            <br/>- <strong>Psycho Visual Tuning:</strong> ON. Melhora a qualidade subjetiva em movimentos rápidos usando aceleração CUDA.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Codec AV1 (O Futuro)",
            content: `
            <p class="mb-4 text-gray-300">
                O AV1 (presente nas placas RTX 4000 e RX 7000) tem qualidade de imagem superior ao H.264 em bitrates baixos.
                <br/>YouTube e Twitch já suportam AV1. Se puder, use. Seus vídeos ficarão sem aqueles "quadrados" (artifacts) em cenas rápidas.
            </p>
            `
        },
        {
            title: "Capítulo 9: Screenshots em Alta Resolução",
            content: `
            <p class="mb-4 text-gray-300">
                Você pode usar o OBS para tirar screenshots limpas (sem HUD, se configurar a fonte corretamente) e salvas em PNG Lossless instantaneamente. Configure o atalho.
            </p>
            `
        },
        {
            title: "Capítulo 10: Virtual Camera",
            content: `
            <p class="mb-4 text-gray-300">
                Use a "Câmera Virtual" para jogar a imagem do OBS (com filtros de cor e overlay) direto no Discord ou Zoom como se fosse sua webcam.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Gravar pesa no FPS?",
            answer: "Com NVENC (GPU), muito pouco (3-5%). A placa tem um chip dedicado só para isso. Se usar x264 (CPU), pesa muito."
        },
        {
            question: "Onde ficam salvos os vídeos?",
            answer: "Settings > Output > Recording Path. Configure para sua pasta de Vídeos no HD secundário para não lotar o SSD do sistema."
        },
        {
            question: "Áudio do microfone baixo?",
            answer: "No Mixer de Áudio, clique na engrenagem > Advanced Audio Properties. Aumente o volume (dB) ou adicione um filtro de 'Gain' e 'Compressor' no microfone."
        }
    ];

    const externalReferences = [
        { name: "OBS Studio Download", url: "https://obsproject.com/" },
        { name: "Nvidia NVENC Guide", url: "https://www.nvidia.com/en-us/geforce/guides/broadcasting-guide-ods-quick-start/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/discord-otimizacao-overlay-lag",
            title: "Discord",
            description: "Streaming pelo Discord."
        },
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Nvidia",
            description: "Drivers para NVENC."
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
