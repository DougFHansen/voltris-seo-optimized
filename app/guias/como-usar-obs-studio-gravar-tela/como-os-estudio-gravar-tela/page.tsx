import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como usar o OBS Studio para Gravar Tela: Guia 2026";
const description = "Quer começar a gravar seus jogos ou tutoriais? Aprenda como configurar o OBS Studio para ter a melhor qualidade sem lag no Windows 11 em 2026.";
const keywords = [
    'como configurar obs studio para gravar tela 2026',
    'melhores configurações obs studio para pc fraco tutorial',
    'gravar tela e audio jogo obs studio guia completo',
    'configurar bitrate e encoder obs studio tutorial 2026',
    'como gravar gameplay sem lag obs studio guia'
];

export const metadata: Metadata = createGuideMetadata('como-usar-obs-studio-gravar-tela', title, description, keywords);

export default function OBSStudioGuide() {
    const summaryTable = [
        { label: "Software", value: "OBS Studio (Open Broadcaster Software)" },
        { label: "Uso Ideal", value: "Gravação de Jogos, Tutoriais e Lives" },
        { label: "Encoder", value: "NVENC (NVIDIA) / AMF (AMD) / AV1 (2026)" },
        { label: "Dificuldade", value: "Médio" }
    ];

    const contentSections = [
        {
            title: "Por que o OBS Studio é o padrão da indústria?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Diferente da gravação nativa do Windows (Win+G), o **OBS Studio** oferece controle total sobre o que você grava. Você pode separar o áudio do Microfone do áudio do Jogo, adicionar sua Webcam com filtros de cor e, o mais importante, escolher como o seu hardware deve processar o vídeo. Em 2026, ele é a ferramenta indispensável para qualquer criador de conteúdo.
        </p>
      `
        },
        {
            title: "1. Fontes e Cenas (A Lógica do OBS)",
            content: `
        <p class="mb-4 text-gray-300">Entenda como montar a sua imagem:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Cena:</strong> É o "palco". Você pode ter uma cena para o jogo e outra para quando estiver apenas conversando.</li>
            <li><strong>Fontes:</strong> São os atores. Clique no '+' em Fontes e escolha <strong>'Captura de Jogo'</strong> para gravar o game, ou <strong>'Captura de Tela'</strong> para gravar tudo o que você faz no Windows.</li>
            <li><strong>Dica:</strong> Sempre execute o OBS como Administrador para que ele tenha prioridade sobre o jogo e não cause quedas de frames na gravação.</li>
        </ul >
      `
        },
        {
            title: "2. O Segredo da Qualidade sem Lag (Encoder)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Configuração de Saída 2026:</h4>
            <p class="text-sm text-gray-300">
                Vá em Configurações > Saída > Aba Gravação. <br/><br/>
                - <strong>Encoder de Vídeo:</strong> Se você tem uma GPU NVIDIA, use <strong>NVIDIA NVENC H.264 (ou AV1)</strong>. Isso faz com que a placa de vídeo grave o vídeo, deixando seu processador livre para o jogo. <br/>
                - <strong>Bitrate:</strong> Para 1080p 60fps, use entre <strong>12.000 e 20.000 Kbps</strong> para uma imagem cristalina.
            </p>
        </div>
      `
        },
        {
            title: "3. Formato de Arquivo (Nunca grave em .mp4!)",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Dica de Especialista:</strong> 
            <br/><br/>Mude o formato de gravação para <strong>.mkv</strong> ou <strong>.flv</strong>. Por que? Se o seu PC travar ou a energia acabar no meio da gravação, o arquivo .mp4 ficará corrompido e você perderá tudo. Com o .mkv, o vídeo é salvo em tempo real e você terá o arquivo seguro até o exato segundo da queda. Depois, basta ir no menu 'Arquivo' do OBS e clicar em 'Remuxar Gravações' para transformar em .mp4 para edição.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/grava%C3%A7%C3%A3o-tela-windows-nativa-dicas",
            title: "Poupando Tempo",
            description: "Dicas de gravação sem instalar nada."
        },
        {
            href: "/guias/aceleracao-hardware-gpu-agendamento",
            title: "Agendamento GPU",
            description: "Melhore a sincronia da gravação."
        },
        {
            href: "/guias/aumentar-volume-microfone-windows",
            title: "Áudio de Qualidade",
            description: "Ajuste o som da sua voz no OBS."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
            difficultyLevel="Médio"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
