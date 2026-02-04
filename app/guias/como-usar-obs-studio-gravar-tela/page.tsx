import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como usar o OBS Studio para Gravar Tela (Tutorial Completo)";
const description = "Quer gravar suas partidas ou tutoriais com qualidade profissional? Aprenda a configurar o OBS Studio para gravação de tela leve e sem lags em 2026.";
const keywords = [
    'como usar obs studio para gravar tela pc 2026',
    'melhores configurações obs studio gravação fps',
    'gravar tela e áudio do jogo simultaneamente tutorial',
    'configurar obs studio para pc fraco gravação leve',
    'onde baixar e como instalar obs studio oficial'
];

export const metadata: Metadata = createGuideMetadata('como-usar-obs-studio-gravar-tela', title, description, keywords);

export default function OBSRecordingGuide() {
    const summaryTable = [
        { label: "Formato de Arquivo", value: "MKV (Mais seguro) ou MP4" },
        { label: "Encoder Recomendado", value: "NVIDIA NVENC / AMD AMF" },
        { label: "Resolução", value: "Base 1080p / Saída 1080p" },
        { label: "Dificuldade", value: "Média" }
    ];

    const contentSections = [
        {
            title: "Por que o OBS Studio é o padrão da indústria?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Diferente de gravadores simples, o **OBS Studio** (Open Broadcaster Software) oferece controle total. Ele permite separar o áudio do seu microfone do áudio do jogo, criar cenas com webcam e, o mais importante: usar o chip da sua placa de vídeo para gravar sem perder FPS no jogo. Em 2026, ele continua sendo a ferramenta mais poderosa e gratuita para criadores de conteúdo.
        </p>
      `
        },
        {
            title: "1. Configurações de Saída (Aumentando a Qualidade)",
            content: `
        <p class="mb-4 text-gray-300">Vá em Configurações > Saída e mude o Modo de Saída para 'Avançado':</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Tipo:</strong> Padrão.</li>
            <li><strong>Caminho da Gravação:</strong> Escolha uma pasta em um SSD rápido.</li>
            <li><strong>Formato de Gravação:</strong> Use <strong>MKV</strong>. Se o seu PC travar ou a luz acabar, você não perde o vídeo. Depois, você pode converter para MP4 no próprio OBS (Arquivo > Remux Gravações).</li>
            <li><strong>Encodificador:</strong> Selecione o da sua placa de vídeo (NVIDIA NVENC H.264/AV1 ou AMD HW). Isso tira o peso do seu processador.</li>
        </ul>
      `
        },
        {
            title: "2. Gravação sem Lag em PCs Fracos",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Truque de Performance:</h4>
            <p class="text-sm text-gray-300">
                Se o seu vídeo está saindo "travado", mude o Controle de Taxa de Bits para <strong>CQP</strong> em vez de CBR. Use um valor de CQP entre <strong>18 e 23</strong>. Quanto menor o número, maior a qualidade e o peso do arquivo. O CQP garante que o OBS use apenas os recursos necessários para capturar a imagem com fidelidade, sem desperdiçar processamento.
            </p>
        </div>
      `
        },
        {
            title: "3. Captura de Jogo vs Captura de Tela",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Captura de Jogo:</strong> É o modo mais eficiente. O OBS "trava" no jogo e nada mais aparece, preservando sua privacidade (notificações do Windows não aparecem no vídeo).
            <br/><br/>
            <strong>Captura de Tela:</strong> Use apenas para tutoriais onde você precisa mostrar o Windows inteiro. Em 2026, esse modo ainda consome um pouco mais de recursos do sistema que a captura direta de jogo.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/obs-studio-melhores-configuracoes-stream-2026",
            title: "Configurar Stream",
            description: "Aprenda a fazer Lives no Twitch/YouTube."
        },
        {
            href: "/guias/grava%C3%A7%C3%A3o-tela-windows-nativa-dicas",
            title: "Gravador Nativo",
            description: "Uma alternativa rápida do próprio Windows."
        },
        {
            href: "/guias/atualizacao-drivers-video",
            title: "Drivers de Vídeo",
            description: "Essencial para o NVENC/AMF funcionarem bem."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
