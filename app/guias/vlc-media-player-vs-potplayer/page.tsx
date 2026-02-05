import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'vlc-media-player-vs-potplayer',
  title: "VLC vs PotPlayer: Qual o melhor player de vídeo em 2026?",
  description: "Procurando o melhor player de vídeo para o Windows 11? Comparamos o clássico VLC com o ultra-customizável PotPlayer em 2026.",
  category: 'windows-geral',
  difficulty: 'Intermediário',
  time: '15 min'
};

const title = "VLC vs PotPlayer: Qual o melhor player de vídeo em 2026?";
const description = "Procurando o melhor player de vídeo para o Windows 11? Comparamos o clássico VLC com o ultra-customizável PotPlayer em 2026.";
const keywords = [
    'vlc vs potplayer comparativo 2026',
    'melhor player de video windows 11 gratuito guia',
    'potplayer é seguro tutorial de configuração 2026',
    'vlc media player ainda vale a pena guia 2026',
    'player de video leve para pc fraco tutorial'
];

export const metadata: Metadata = createGuideMetadata('vlc-media-player-vs-potplayer', title, description, keywords);

export default function VideoPlayerComparisonGuide() {
    const summaryTable = [
        { label: "VLC", value: "Simples, Open Source, Roda Tudo" },
        { label: "PotPlayer", value: "Extremamente Rápido, Customizável, Ótimo HDR" },
        { label: "Veredito 2026", value: "PotPlayer para entusiastas, VLC para usuários comuns" },
        { label: "Sistemas", value: "Windows, Linux, macOS (VLC apenas)" }
    ];

    const contentSections = [
        {
            title: "O fim do Windows Media Player",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, embora os serviços de streaming dominem, muitos usuários ainda preferem ter seus arquivos de vídeo (4K, MKV, HDR) localmente. O player nativo do Windows 11 evoluiu, mas ainda perde feio para as opções de terceiros quando o assunto é suporte a legendas e codecs complexos. Escolher entre o **VLC** e o **PotPlayer** depende de quão profundo você quer ir nas configurações de imagem.
        </p>
      `
        },
        {
            title: "1. VLC Media Player: O canivete suíço",
            content: `
        <p class="mb-4 text-gray-300">O favorito de todos por uma razão:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Compatibilidade:</strong> Se você tem um arquivo bizarro de 20 anos atrás, o VLC vai rodar.</li>
            <li><strong>Código Aberto:</strong> Sem anúncios, sem rastreamento, 100% gratuito para sempre.</li>
            <li><strong>Foco:</strong> Sua interface é simples e direta. Você arrasta o vídeo e ele toca. Ponto final.</li>
        </ul >
      `
        },
        {
            title: "2. PotPlayer: A potência coreana",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Performance Máxima:</h4>
            <p class="text-sm text-gray-300">
                O <strong>PotPlayer</strong> é conhecido por ser extremamente leve, carregando vídeos gigantes de 50GB instantaneamente. <br/><br/>
                Ele oferece suporte superior a tecnologias modernas de 2026, como o mapeamento de tons HDR para monitores SDR e aceleração de hardware via GPU muito mais eficiente que a do VLC. Se você gosta de personalizar cada detalhe da interface e das legendas, o PotPlayer é imbatível. (Atenção: Durante a instalação, ele pode sugerir programas extras; recuse todos para manter a instalação limpa).
            </p>
        </div>
      `
        },
        {
            title: "3. Qual escolher?",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Escolha o VLC se:</strong> Você quer algo que apenas funcione em qualquer sistema operacional (inclusive Mac e Celular) sem precisar configurar nada.
            <br/><br/>
            <strong>Escolha o PotPlayer se:</strong> Você joga no PC e quer a melhor qualidade de imagem possível usando sua placa de vídeo, ou se você costuma assistir animes e filmes com legendas complexas traduzidas por fãs (fansubs).
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/formatfactory-vs-handbrake-converter-video",
            title: "Converter Vídeos",
            description: "Aprenda a mudar o formato dos seus arquivos."
        },
        {
            href: "/guias/hdr-windows-vale-a-pena-jogos",
            title: "Guia HDR",
            description: "Melhore a imagem dos seus filmes."
        },
        {
            href: "/guias/aceleracao-hardware-gpu-agendamento",
            title: "Aceleração GPU",
            description: "Faça seus players rodarem mais liso."
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
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
