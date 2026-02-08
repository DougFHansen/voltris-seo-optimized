import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'gravação-tela-windows-nativa-dicas',
    title: "Como Gravar Tela do Windows: Guia Definitivo e Edição Básica (2026)",
    description: "Três métodos nativos para gravar a tela do Desktop, Jogos e Tutoriais. Aprenda configurações profissionais, gravação em segundo plano (Clip) e edição gratuita no Windows.",
    category: 'criacao-conteudo',
    difficulty: 'Iniciante',
    time: '15 min'
};

const title = "Como Gravar Tela do Windows: Guia Definitivo e Edição Básica (2026)";
const description = "Três métodos nativos para gravar a tela do Desktop, Jogos e Tutoriais. Aprenda configurações profissionais, gravação em segundo plano (Clip) e edição gratuita no Windows.";
const keywords = [
    'como gravar tela windows 11 com audio interno',
    'xbox game bar clipes 30 segundos setup',
    'ferramenta de captura ou obs studio comparativo',
    'como gravar o mouse no windows 11',
    'gravar apenas uma janela especifica windows',
    'clipchamp editor nativo windows tutorial',
    'atalho gravar tela rápido sem lag'
];

export const metadata: Metadata = createGuideMetadata('gravação-tela-windows-nativa-dicas', title, description, keywords);

export default function NativeRecordingGuide() {
    const summaryTable = [
        { label: "Método Gamer (Clips)", value: "Xbox Game Bar (Win+G)" },
        { label: "Método Trabalho (Reunião)", value: "Ferramenta de Captura (Win+Shift+S)" },
        { label: "Resolução Máxima", value: "4K 60FPS (HDR)" },
        { label: "Formato do Arquivo", value: "MP4 (H.264)" },
        { label: "Edição Grátis", value: "Clipchamp ou Fotos" }
    ];

    const contentSections = [
        {
            title: "Gravação Nativa: O Segredo do Windows 11",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, a necessidade de softwares terceiros para gravar a tela praticamente desapareceu. O Windows 11, em suas atualizações mais recentes, transformou a <strong>Xbox Game Bar</strong> e a <strong>Ferramenta de Captura</strong> em estúdios portáteis poderosos.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Neste guia expandido, vamos além do "gravar": ensinaremos como configurar o <em>Replay Buffer</em> (gravar o passado), como editar seus vídeos sem baixar nada e como otimizar o áudio para parecer profissional.
        </p>
      `
        },
        {
            title: "1. Xbox Game Bar: A Central de Jogos",
            content: `
        <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20 mb-4">
            <h4 class="text-green-400 font-bold mb-2">Comandos Essenciais:</h4>
            <ul class="list-none space-y-2 text-sm text-gray-300">
                <li><code>Win + Alt + R</code>: Iniciar/Parar Gravação.</li>
                <li><code>Win + Alt + G</code>: Gravar últimos 30 segundos (Clip).</li>
                <li><code>Win + G</code>: Abrir Painel de Controle de Áudio/Performance.</li>
            </ul>
        </div>
        
        <h4 class="text-white font-bold mb-2 mt-4">Configurando o "Gravar isso" (Replay):</h4>
        <p class="text-gray-300 text-sm mb-4">
            Muitas vezes, o momento épico acontece *antes* de você apertar gravar. A Game Bar pode gravar em segundo plano constantemente (como o ShadowPlay da NVIDIA).
            <br/><br/>
            Vá em <strong>Configurações > Jogos > Capturas</strong> e ative "Gravar o que aconteceu". <br/>
            <strong>Atenção:</strong> Isso consome um pouco de RAM e Disco. Recomendamos deixar em 30 segundos ou 1 minuto para não pesar no PC.
        </p>
      `
        },
        {
            title: "2. Ferramenta de Captura: A Evolução do Print",
            content: `
        <p class="text-gray-300 mb-4">
            A antiga "Ferramenta de Recorte" agora grava vídeo com áudio do sistema e microfone. É perfeita para tutoriais rápidos de software ou gravar reuniões do Teams/Zoom sem notificar os outros participantes (use com ética!).
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 bg-gray-900/30 p-6 rounded-xl border border-gray-700">
            <li>Pressione <strong>Win + Shift + S</strong> ou abra "Ferramenta de Captura".</li>
            <li>Selecione o ícone de <strong>Filmadora</strong>.</li>
            <li>Arraste o mouse para selecionar apenas a área de interesse (ex: janela do navegador).</li>
            <li>Clique em 'Iniciar'. 
                <span class="text-yellow-400 text-xs ml-2">Dica: Clique no ícone de Microfone no topo para ativar sua voz durante a gravação.</span>
            </li>
        </ol>
      `
        },
        {
            title: "3. Configurações Profissionais (Bitrate e 60 FPS)",
            content: `
        <p class="text-gray-300 mb-4">
            Seus vídeos estão saindo pixelados ou travando? O Windows prioriza tamanho de arquivo pequeno. Vamos mudar para qualidade.
        </p>
        <div class="space-y-4">
            <div>
                <p class="text-gray-300 text-sm font-bold bg-gray-800 p-2 rounded inline-block">
                    Caminho: Configurações > Jogos > Capturas
                </p>
            </div>
            <ul class="list-disc list-inside text-gray-300 space-y-2 text-sm">
                <li><strong>Taxa de Quadros:</strong> Mude para <strong>60 fps</strong>. Vídeos em 30 fps parecem lentos em 2026.</li>
                <li><strong>Qualidade de Vídeo:</strong> Mude para <strong>Alta</strong>. Isso aumenta o bitrate para cerca de 10-15 Mbps (ideal para YouTube 1080p).</li>
                <li><strong>Áudio:</strong> Aumente para <strong>192kbps</strong>. A diferença na clareza da voz é notável.</li>
                <li><strong>Mouse:</strong> Em tutoriais, deixe ativado. Em jogos cinemáticos, desative "Capturar cursor do mouse".</li>
            </ul>
        </div>
      `
        },
        {
            title: "4. Edição Rápida sem Instalar Nada (Clipchamp)",
            content: `
        <p class="mb-4 text-gray-300">
            Você gravou, mas o vídeo ficou longo ou tem partes inúteis. O Windows 11 vem com o <strong>Clipchamp</strong> pré-instalado (ou disponível na loja).
        </p>
        <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-purple-900/10 p-4 rounded-xl border border-purple-500/20">
                <h4 class="text-purple-400 font-bold text-sm mb-2">Com o App "Fotos":</h4>
                <p class="text-gray-400 text-xs">
                    Abra o vídeo, clique em Edição (Ctrl+E) e use a ferramenta de "Cortar" (Trim) para remover o início e o fim. É instantâneo e não recodifica o vídeo (sem perda de qualidade).
                </p>
            </div>
            <div class="bg-blue-900/10 p-4 rounded-xl border border-blue-500/20">
                <h4 class="text-blue-400 font-bold text-sm mb-2">Com o Clipchamp:</h4>
                <p class="text-gray-400 text-xs">
                    Arraste seu vídeo para lá. Você pode adicionar textos, legendas automáticas, músicas de fundo e transições. Na versão gratuita, exporta em 1080p sem marca d'água.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Diagnóstico e Limitações",
            content: `
        <div class="space-y-6">
            <div>
                <h4 class="font-bold text-white text-lg">Tela Preta em Jogos (DirectX 12)</h4>
                <p class="text-gray-300 text-sm mt-1">
                    Alguns jogos em modo "Tela Cheia Exclusiva" bloqueiam overlays. Tente mudar o jogo para "Janela sem Bordas" (Borderless Window) ou use a Ferramenta de Captura (Win+Shift+S) focada na janela.
                </p>
            </div>
            <div>
                <h4 class="font-bold text-white text-lg">Gravando Múltiplos Monitores</h4>
                <p class="text-gray-300 text-sm mt-1">
                    A Game Bar grava a tela onde o jogo "Ativo" está. Para garantir, clique dentro do jogo antes de iniciar. A Ferramenta de Captura permite selecionar monitores específicos manualmente.
                </p>
            </div>
            <div>
                <h4 class="font-bold text-white text-lg">Quando usar OBS ou ShadowPlay?</h4>
                <p class="text-gray-300 text-sm mt-1">
                    Se você precisa de câmera (Webcam) sobreposta ao jogo, ou precisa separar o áudio do Discord do áudio do jogo em faixas diferentes para edição, as ferramentas nativas não servem. Nesse caso, o <strong>OBS Studio</strong> é o padrão da indústria.
                </p>
            </div>
        </div>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/como-usar-obs-studio-gravar-tela",
            title: "Tutorial OBS Studio",
            description: "Aprenda a configurar Cenas e Fontes para live."
        },
        {
            href: "/guias/atalhos-produtividade-windows",
            title: "Atalhos de Produtividade",
            description: "Domine o Win+Shift+S para printscreens rápidos."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Melhorar Desempenho",
            description: "Evite travamentos no vídeo usando um SSD rápido."
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
