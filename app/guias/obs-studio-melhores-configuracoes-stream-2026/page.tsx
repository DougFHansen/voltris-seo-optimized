import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "OBS Studio: Melhores Configurações para Live Stream (2026)";
const description = "Quer fazer Live na Twitch ou YouTube sem travar? Aprenda a configurar o bitrate, o codificador e a resolução do OBS Studio para uma transmissão profissional.";
const keywords = [
    'melhores configurações obs studio para stream 2026',
    'bitrate ideal para live twitch 1080p 60fps',
    'como configurar obs para stream pc fraco 2026',
    'obs studio vs streamelements qual o melhor',
    'configurar nvenc para live streaming profissional'
];

export const metadata: Metadata = createGuideMetadata('obs-studio-melhores-configuracoes-stream-2026', title, description, keywords);

export default function OBSStreamGuide() {
    const summaryTable = [
        { label: "Bitrate (1080p 60fps)", value: "6.000 a 8.000 Kbps" },
        { label: "Codificador", value: "NVIDIA NVENC H.264 (CBR)" },
        { label: "Perfil de Uso", value: "Qualidade Máxima" },
        { label: "Dificuldade", value: "Média" }
    ];

    const contentSections = [
        {
            title: "A diferença entre Gravar e Fazer Stream",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Muitos iniciantes cometem o erro de usar as mesmas configurações para ambos. Ao gravar, o céu é o limite para a qualidade. Ao fazer Live, você depende da sua **velocidade de upload** da internet. Se você tentar enviar mais dados do que sua internet aguenta, sua live vai ficar "pulando frames", parecendo um slide de fotos.
        </p>
      `
        },
        {
            title: "1. Calculando seu Bitrate",
            content: `
        <p class="mb-4 text-gray-300">Faça um teste de velocidade. Seu Bitrate deve ser cerca de 80% do seu Upload real:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>720p 60fps:</strong> 4.500 Kbps.</li>
            <li><strong>1080p 60fps:</strong> 6.000 Kbps (Mínimo da Twitch) a 8.000 Kbps (Recomendado).</li>
            <li><strong>AV1:</strong> Em 2026, se você tem uma placa RTX 40 ou RX 7000, use o codificador <strong>YouTube AV1</strong>. Ele entrega muito mais qualidade com a metade do bitrate.</li>
        </ul >
      `
        },
        {
            title: "2. O Poder do NVENC",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Dica de Performance:</h4>
            <p class="text-sm text-gray-300">
                Nunca use o codificador 'x264' (CPU) se você tem uma placa de vídeo dedicada. O <strong>NVENC</strong> (NVIDIA) ou <strong>AMF</strong> (AMD) possui um chip físico separado apenas para encodar o vídeo, o que significa que fazer a live não vai tirar quase nenhum FPS do seu jogo.
            </p>
        </div>
      `
        },
        {
            title: "3. Reduzindo o Input Lag (Atraso)",
            content: `
        <p class="mb-4 text-gray-300">
            Sua live demora 20 segundos para responder o chat?
            <br/>1. Vá em Configurações > Transmissão.
            <br/>2. Conecte sua conta da Twitch/YouTube diretamente (em vez de usar chave).
            <br/>3. Escolha o modo <strong>'Latência Baixa'</strong>. Isso reduz o atraso para apenas 2 ou 3 segundos, permitindo conversar em tempo real com seu público.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/como-usar-obs-studio-gravar-tela",
            title: "Gravar Tela",
            description: "Dicas para vídeos offline."
        },
        {
            href: "/guias/reduzir-ping-jogos-online",
            title: "Reduzir Ping",
            description: "Dicas para melhorar sua internet de upload."
        },
        {
            href: "/guias/aceleracao-hardware-gpu-agendamento",
            title: "Performance GPU",
            description: "Ajude o OBS a capturar o jogo liso."
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
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
