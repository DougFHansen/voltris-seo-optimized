import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'discord-nitro-qualidade-voz-krisp',
    title: "Discord (2026): Otimização de Qualidade de Voz e Streaming",
    description: "Seu microfone corta ou o som do jogo sai no Discord? Aprenda a configurar Cancelamento de Eco (Krisp), Bitrate alto e Aceleração de Hardware correta.",
    category: 'software',
    difficulty: 'Iniciante',
    time: '15 min'
};

const title = "Discord Tuning (2026): Voz Cristalina e Sem Lag";
const description = "O Discord é pesado. Ele é basicamente um navegador Chrome rodando o tempo todo. Vamos otimizar para ele não roubar FPS do seu jogo.";

const keywords = [
    'discord hardware acceleration on or off',
    'krisp noise suppression discord settings',
    'discord stream lag fix 60fps',
    'voice activity sensitivity cutting out',
    'discord overlay fps drop',
    'high packet priority discord',
    'quality of service high packet priority',
    'voltris optimizer electron',
    'discord nao detecta jogo'
];

export const metadata: Metadata = createGuideMetadata('discord-nitro-qualidade-voz-krisp', title, description, keywords);

export default function DiscordGuide() {
    const summaryTable = [
        { label: "Hardware Accel", value: "OFF (Se GPU fraca)" },
        { label: "Hardware Accel", value: "ON (Se usar Live)" },
        { label: "Krisp", value: "ON (Ruído)" },
        { label: "Echo Cancellation", value: "ON" },
        { label: "Overlay", value: "OFF (FPS)" },
        { label: "Quality of Service", value: "High Packet On" },
        { label: "Input Sensitivity", value: "Manual (-60dB)" }
    ];

    const contentSections = [
        {
            title: "Introdução: Electron Pesado",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Discord usa a tecnologia Electron (Chromium). Ele consome 300MB a 1GB de RAM. A "Aceleração de Hardware" usa sua GPU para renderizar GIFs e Emojis.
        </p>
      `
        },
        {
            title: "Capítulo 1: Hardware Acceleration (O Dilema)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Avançado > Aceleração de Hardware</h4>
                <p class="text-gray-400 text-xs text-justify">
                    - <strong>DESLIGUE</strong> se você joga com a GPU em 99% (gargalo de GPU). O Discord vai parar de usar a GPU para desenhar a interface, liberando recursos para o jogo.
                    <br/>- <strong>LIGUE</strong> se você faz Transmissão (Go Live). Sem aceleração, sua live vai ficar travando a 5 frames por segundo pois a CPU não aguenta encodar.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Voz e Vídeo (Krisp)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Krisp (Supressão de Ruído):</strong> A melhor tecnologia da década. Ative. Ele remove latidos de cachorro, teclado mecânico e ventilador usando IA.
            - <strong>Echo Cancellation:</strong> Ligue se usar caixas de som. Desligue se usar fone de ouvido (Headset), pois distorce levemente a voz.
        </p>
      `
        },
        {
            title: "Capítulo 3: Overlay (Interface em Jogo)",
            content: `
        <p class="mb-4 text-gray-300">
            O Overlay (aqueles avatares que aparecem no canto do jogo) causa:
            <br/>1. Queda de FPS.
            <br/>2. Conflito com Anti-Cheat.
            <br/>3. Bug do mouse solto na tela.
            <br/>Recomendação: <strong>DESATIVE</strong> o Overlay em Jogos Competitivos (Settings > Game Overlay). Deixe ligado só para MMOs/Casuais.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Sensibilidade de Entrada",
            content: `
        <p class="mb-4 text-gray-300">
            Nunca use "Determinar automaticamente". O Discord corta o início das suas frases.
            <br/>Desmarque a opção.
            <br/>Fale normalmente e ajuste a barra amarela para ficar um pouco à esquerda do seu volume de voz.
            <br/>Assim, ele só abre o mic quando você fala alto, mas não corta sílabas.
        </p>
      `
        },
        {
            title: "Capítulo 5: Quality of Service (QoS)",
            content: `
        <p class="mb-4 text-gray-300">
            Em Voz e Vídeo > "Habilitar Qualidade de Serviço de Pacotes Alta".
            <br/>Isso diz ao seu roteador: "A voz do Discord é urgente".
            <br/>AJUDA muito a não ter voz robótica quando alguém baixa algo na rede. Deixe <strong>LIGADO</strong>.
            <br/>(Nota: Alguns roteadores velhos bugam com isso, se a voz ficar ruim, desligue).
        </p>
      `
        },
        {
            title: "Capítulo 6: Atenuação (Ducking)",
            content: `
        <p class="mb-4 text-gray-300">
            A configuração que baixa o volume do jogo quando alguém fala.
            <br/>Isso é horrível para jogos de tiro (você não ouve passos quando o time fala).
            <br/>Defina a Atenuação para <strong>0%</strong>.
        </p>
      `
        },
        {
            title: "Capítulo 7: Cache do Discord (Lixo)",
            content: `
        <p class="mb-4 text-gray-300">
            O Discord guarda cache de todas as imagens que seus amigos mandam. A pasta pode chegar a 10GB.
            <br/>Local: <code>%appdata%/discord/Cache</code>.
            <br/>Pode deletar tudo lá dentro seguramente para liberar espaço no SSD.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Modo Streamer (Privacidade)",
            content: `
            <p class="mb-4 text-gray-300">
                Se for transmitir, ative o Modo Streamer.
                <br/>Ele esconde seu email, tags de Discord e convites de servidor na tela para evitar vazamentos.
            </p>
            `
        },
        {
            title: "Capítulo 9: AV1 Streaming",
            content: `
            <p class="mb-4 text-gray-300">
                Para quem tem RTX 4000, o Discord agora suporta streamar em AV1. A qualidade é incrível em 60fps, mesmo com bitrate baixo. Seus amigos precisam ter hardware compatível para assistir (decode).
            </p>
            `
        },
        {
            title: "Capítulo 10: Boost de Servidor (Audio 384kbps)",
            content: `
            <p class="mb-4 text-gray-300">
                A qualidade de áudio padrão é 64kbps (ruim).
                <br/>Servidores com Nível 2 ou 3 desbloqueiam 128kbps e 256kbps. Para música ou podcast, a diferença é brutal. Para voz normal, 64kbps basta.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Discord fecha sozinho no jogo?",
            answer: "Geralmente é falta de RAM. O Windows mata o Discord para manter o jogo aberto. Feche abas do Chrome."
        },
        {
            question: "Voz robótica?",
            answer: "Packet Loss na sua internet ou você está conectado num servidor de voz (Região) errado. Tente mudar a Região do canal de voz para 'Brazil' ou 'US East'."
        },
        {
            question: "Tela preta no compartilhamento?",
            answer: "Desative a opção 'Usar nossa tecnologia mais recente para capturar a tela' nas configurações de Voz e Vídeo."
        }
    ];

    const externalReferences = [
        { name: "Discord Krisp Info", url: "https://support.discord.com/hc/en-us/articles/360040843691-Krisp-FAQ" },
        { name: "Discord PT-BR Twitter", url: "https://twitter.com/discord_br" }
    ];

    const relatedGuides = [
        {
            href: "/guias/obs-studio-gravacao-replay-buffer-av1",
            title: "OBS Studio",
            description: "Para separar áudio."
        },
        {
            href: "/guias/bufferbloat-qos-sqm-roteador-ping",
            title: "Bufferbloat",
            description: "Causa da voz robótica."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
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
