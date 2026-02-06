import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'obs-studio-melhores-configuracoes-stream',
    title: "OBS Studio 2026: Configuração Profissional de Stream e Gravação (0 LAG)",
    description: "Faça lives na Twitch/YouTube sem perder FPS no jogo. Guia completo de NVENC, AV1, Bitrate, Filtros de Áudio e Overlays otimizados.",
    category: 'software',
    difficulty: 'Avançado',
    time: '60 min'
};

const title = "OBS Studio Masterclass (2026): A Arte do Streaming Otimizado";
const description = "Configurar o OBS errado pode destruir a performance do seu PC. Aprenda a separar as faixas de áudio, usar o encoder correto e transmitir com cristalina qualidade visual.";

const keywords = [
    'obs studio melhores configuracoes pc fraco 2026',
    'nvenc new vs x264 qual melhor stream',
    'bitrate ideal twitch 1080p 60fps',
    'codec av1 youtube obs setup',
    'filtros de audio obs microfone chiado',
    'separar audio discord obs application audio capture',
    'obs travando encoder overloaded fix',
    'configurar replay buffer clipes',
    'overlay streamlabs deixa pc lento',
    'melhor cbr ou vbr gravação'
];

export const metadata: Metadata = createGuideMetadata('obs-studio-melhores-configuracoes-stream', title, description, keywords);

export default function OBSGuide() {
    const summaryTable = [
        { label: "Encoder", value: "NVIDIA NVENC H.264 (New)" },
        { label: "Rate Control", value: "CBR (Twitch) / CQP (Gravação)" },
        { label: "Bitrate", value: "6000-8000 Kbps" },
        { label: "Preset", value: "P6 - Slower (Quality)" },
        { label: "Base Res", value: "1920x1080" },
        { label: "Admin", value: "Executar como Admin (Sempre)" },
        { label: "Game Mode", value: "On (Windows)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O gargalo da Stream",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Streamar e jogar no mesmo PC (Single PC Setup) é um desafio de equilíbrio. Se o OBS tentar usar 100% da GPU, seu jogo trava. Se o jogo usar 100%, sua stream trava (quadros perdidos).
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Neste guia, vamos configurar o OBS para usar chips dedicados da placa de vídeo (NVENC/AMF) e liberar a CPU para o jogo.
        </p>
         <div class="bg-[#0A0A0F] border border-yellow-500/30 p-5 rounded-xl my-6">
            <h4 class="text-yellow-400 font-bold mb-2">Regra #1: Modo Administrador</h4>
            <p class="text-gray-300 text-sm">
                Sempre, SEMPRE abra o OBS como Administrador.
                <br/>Isso permite que o Windows reserve GPU para o OBS renderizar a cena, mesmo que o jogo esteja em 99% de uso. Sem isso, sua live vai parecer um slide show (lagada) para os espectadores.
            </p>
        </div>
      `
        },
        {
            title: "Capítulo 1: Configurações de Saída (Output - Streaming)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Video Encoder</h4>
                <p class="text-white font-mono text-sm mb-2">Recomendado: <span class="text-emerald-400">NVIDIA NVENC H.264</span></p>
                <p class="text-gray-400 text-xs text-justify">
                    Se tiver GPU Nvidia, USE. O NVENC é um chip separado, não afeta o FPS do jogo.
                    <br/>Se tiver AMD: Use <strong>AMD HW H.264</strong>.
                    <br/>Se usar x264 (CPU), seu PC vai fritar e o jogo vai travar, a menos que você tenha um Ryzen 9/i9 sobrando.
                </p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Rate Control & Bitrate</h4>
                <p class="text-white font-mono text-sm mb-2">Recomendado: <span class="text-emerald-400">CBR 6000 Kbps (Twitch)</span></p>
                <p class="text-gray-400 text-xs">
                    A Twitch limita a 6000 (oficial) ou 8000 (unofficial). CBR (Constant Bitrate) é obrigatório para estabilidade.
                    <br/>Para YouTube: Use CBR 15000 Kbps ou mais (O YouTube reprocessa tudo, então envie qualidade alta).
                </p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Preset & Tuning</h4>
                <p class="text-white font-mono text-sm mb-2">Recomendado: <span class="text-emerald-400">P5 ou P6 (Better Quality)</span></p>
                <p class="text-gray-400 text-xs">
                    P7 (Max Quality) pode causar lag visível. P5/P6 são idênticos visualmente e mais leves.
                    <br/>Multipass Mode: Single Pass (Duas passadas consome GPU à toa em live).
                    <br/>Look-ahead e Psycho Visual Tuning: ON (Ajuda em jogos rápidos).
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Configurações de Gravação (Local Recording)",
            content: `
        <p class="mb-4 text-gray-300">
            Não use as mesmas configs da Stream!
            <br/>Vá na aba "Recording".
            <br/>- <strong>Format:</strong> MKV (Se o PC travar, você não perde o arquivo. Converta para MP4 depois no OBS > Remux).
            <br/>- <strong>Encoder:</strong> NVIDIA NVENC HEVC (H.265) ou AV1 (Se tiver RTX 4000). Arquivos menores, qualidade melhor.
            <br/>- <strong>Rate Control:</strong> <span class="text-emerald-400 font-bold">CQP</span>.
            <br/>- <strong>CQ Level:</strong> 18 a 23. (14 é qualidade cinema, 23 é balanceado, 30 é ruim). CQ ajusta o bitrate dinamicamente. Melhor que CBR para gravar.
        </p>
      `
        },
        {
            title: "Capítulo 3: Áudio (Filtros e Separação)",
            content: `
        <p class="mb-4 text-gray-300">
            Microfone ruim estraga a live. Use filtros no OBS (Clique na engrenagem do Mic > Filtros):
        </p>
        <ol class="list-decimal list-inside text-gray-300 text-sm space-y-2">
            <li><strong>Noise Suppression (RNNNoise):</strong> Remove ventilador e teclado mecânico via IA. Essencial.</li>
            <li><strong>Compressor:</strong> Iguala o volume. Quando você grita, ele abaixa pra não estourar. Quando sussurra, ele mantém audível.</li>
            <li><strong>Limiter:</strong> Coloque em -3dB. Garante que o som NUNCA ultrapasse o limite vermelho (clipagem).</li>
        </ol>
        <p class="mt-4 text-gray-300 text-sm">
            <strong>Application Audio Capture (BETA):</strong> Use isso em vez de "Desktop Audio". Adicione uma fonte para o "Spotify" e outra para o "Jogo". Assim você pode ouvir música, mas configurar para ela NÃO sair na live (para evitar DMCA) ou não sair na gravação (VOD Track).
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Vídeo e Resolução (Downscale)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Base (Canvas) Resolution:</strong> A resolução do seu monitor (ex: 1920x1080).
            - <strong>Output (Scaled) Resolution:</strong> A resolução da live.
            <br/>Se você tem pouca internet (upload < 10Mbps), use 1280x720 ou 1664x936 (936p é o segredo dos streamers, divisível por 8 ideal para encode).
            - <strong>Downscale Filter:</strong> Lanczos (Mais nítido).
            - <strong>FPS:</strong> 60 (Padrão) ou 30 (Se o PC for muito fraco).
        </p>
      `
        },
        {
            title: "Capítulo 5: Replay Buffer (Clipar Jogadas)",
            content: `
        <p class="mb-4 text-gray-300">
            Não precisa usar Shadowplay se o OBS já está aberto.
            <br/>Ative o "Replay Buffer" na aba Output. Aloque um tempo (ex: 60s).
            <br/>Configure uma Hotkey. Quando fizer uma jogada, aperte o botão e ele salva os últimos 60 segundos na RAM para o disco, já com seu microfone e overlay da live.
        </p>
      `
        },
        {
            title: "Capítulo 6: Overlays Web (Browser Source)",
            content: `
        <p class="mb-4 text-gray-300">
            Fontes de navegador (Alertas do StreamElements/StreamLabs) são pesadas pois são janelas do Chromium.
            <br/>Dica: Clique duas vezes na fonte > "Control audio via OBS" (Se não tiver som, não use) > <strong class="text-emerald-400">Shutdown source when not visible</strong>.
            <br/>Isso faz a fonte parar de consumir RAM e CPU quando você muda para a cena "Só Jogo".
        </p>
      `
        },
        {
            title: "Capítulo 7: Prioridade de Processo",
            content: `
        <p class="mb-4 text-gray-300">
            Em Configurações > Avançado > Geral > Prioridade do Processo.
            <br/>Defina como <strong>Alta (High)</strong>.
            <br/>Isso garante que o OBS nunca engasgue, mesmo que o jogo esteja sofrendo. A live continua lisa. O espectador prefere ver o jogo a 50 FPS liso do que o jogo a 144 FPS travando a transmissão.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Codec AV1 (Youtube)",
            content: `
            <p class="mb-4 text-gray-300">
                Se você streamar para o YouTube e tiver GPU Nvidia RTX 4000 ou AMD RX 7000.
                <br/>USE O CODEC AV1.
                <br/>Ele tem qualidade 40% superior ao H.264 com o mesmo bitrate. 8000 Kbps em AV1 parece 14000 Kbps. A Twitch não suporta, mas o YouTube sim.
            </p>
            `
        },
        {
            title: "Capítulo 9: Cenas e Coleções",
            content: `
            <p class="mb-4 text-gray-300">
                Crie cenas limpas.
                <br/>- Cena "Jogando": Apenas Game Capture + Câmera + Alertas.
                <br/>- Cena "Just Chatting": Câmera Grande + Chat.
                <br/>Não encha a cena de jogo com Widgets inúteis (meta de bits, lista de subs, etc). Isso polui a visão em jogos competitivos e consome recursos.
            </p>
            `
        },
        {
            title: "Capítulo 10: Game Capture vs Display Capture",
            content: `
            <p class="mb-4 text-gray-300">
                Sempre use <strong>Game Capture (Captura de Jogo)</strong>.
                <br/>Ele injeta direto no DirectX e é muito rápido.
                <br/>Nunca use <strong>Display Capture (Captura de Tela)</strong> para jogos, pois ele é lento, tem tearing e mostra suas notificações do Windows/Desktop acidentalmente (vazamento de dados).
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "StreamLabs OBS ou OBS Studio?",
            answer: "OBS Studio. O StreamLabs é um 'fork' pesado e cheio de bloatware pago. O OBS Studio é leve, open-source e suporta plugins incríveis (como o Vertical Plugin para TikTok)."
        },
        {
            question: "Encoder Overloaded! O que fazer?",
            answer: "Sua GPU está sobrecarregada. 1. Abra como Admin. 2. Baixe o Preset de P6 para P4 (Faster). 3. Limite o FPS do seu jogo (se o jogo usa 99% da GPU, não sobra nada pro encoder). 4. Reduza a resolução de saída para 720p."
        },
        {
            question: "Bitrate flutuando (quadrados vermelhos)?",
            answer: "Instabilidade de upload. Ative 'Dynamic Bitrate' nas configurações Avançadas de Rede do OBS. Isso faz a qualidade cair automaticamente em vez de dropar frames quando a internet oscila, mantendo a live online."
        }
    ];

    const externalReferences = [
        { name: "OBS Project Wiki", url: "https://obsproject.com/wiki/" },
        { name: "EposVox (Canal OBS Master)", url: "https://www.youtube.com/user/EposVox" },
        { name: "Twitch Inspector (Teste sua stream)", url: "https://inspector.twitch.tv/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Drivers",
            description: "Atualize drivers para melhor NVENC."
        },
        {
            href: "/guias/discord-otimizacao-overlay-lag",
            title: "Discord",
            description: "Integre o áudio."
        },
        {
            href: "/guias/reduzir-ping-regedit-cmd-jogos",
            title: "Rede",
            description: "Estabilidade de upload."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="60 min"
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
