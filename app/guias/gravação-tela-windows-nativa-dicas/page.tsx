import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'gravação-tela-windows-nativa-dicas',
    title: "Como Gravar a Tela do Windows Sem Instalar Nada (2026)",
    description: "Três métodos nativos para gravar a tela do Windows 10 e 11. Tutorial completo da Xbox Game Bar, Ferramenta de Captura e Dicas para qualidade profissional.",
    category: 'software',
    difficulty: 'Iniciante',
    time: '12 min'
};

const title = "Como Gravar a Tela do Windows Sem Instalar Nada (2026)";
const description = "Três métodos nativos para gravar a tela do Windows 10 e 11. Tutorial completo da Xbox Game Bar, Ferramenta de Captura e Dicas para qualidade profissional de vídeo e áudio.";
const keywords = [
    'como gravar tela pc windows 11 atalho',
    'xbox game bar gravar jogo nao funciona',
    'ferramenta de captura video windows 11',
    'gravar tela sem marca dagua gratis',
    'gravar reuniao teams ou zoom escondido',
    'diminuir tamanho video gravado windows',
    'obs studio vs xbox game bar'
];

export const metadata: Metadata = createGuideMetadata('gravação-tela-windows-nativa-dicas', title, description, keywords);

export default function NativeRecordingGuide() {
    const summaryTable = [
        { label: "Método Rápido (Jogos/Apps)", value: "Win + Alt + R (Game Bar)" },
        { label: "Método Seletivo (Tutorial)", value: "Win + Shift + S (Snipping Tool)" },
        { label: "Qualidade Máxima", value: "Depende da GPU (NVIDIA/AMD)" },
        { label: "Custa algo?", value: "100% Gratuito e Nativo" },
        { label: "Dificuldade", value: "Muito Fácil" }
    ];

    const contentSections = [
        {
            title: "Gravação Nativa: O Segredo do Windows",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Até pouco tempo, você precisava baixar softwares pesados e cheios de anúncios (como Bandicam ou FRAPS) para gravar uma simples aula ou gameplay. Em 2026, o Windows 10 e 11 possuem gravadores de nível profissional integrados ao sistema, capazes de capturar em 60 FPS com áudio do sistema e microfone.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Neste guia, vamos explorar as duas principais ferramentas (Game Bar e Snipping Tool) e como configurá-las para que seus vídeos não fiquem travando ou sem som.
        </p>
      `
        },
        {
            title: "1. Xbox Game Bar (Para Jogos e Apps em Tela Cheia)",
            content: `
        <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20 mb-4">
            <h4 class="text-green-400 font-bold mb-2">O Atalho Mágico: Win + Alt + R</h4>
            <p class="text-sm text-gray-300">
                Esta combinação inicia e para a gravação instantaneamente, sem abrir menus.
            </p>
        </div>
        <p class="text-gray-300 mb-4">
            A <strong>Game Bar</strong> é otimizada para usar a aceleração da sua placa de vídeo, garantindo que o jogo não perca FPS enquanto grava. Ela é ideal para capturar uma janela específica (o jogo ou o navegador), mas <em>não consegue gravar a Área de Trabalho ou o Explorador de Arquivos</em> por design de segurança.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mt-2">
            <li><strong>Abrir Painel (Overlay):</strong> <code>Win + G</code> (Aqui você controla volumes de cada app separadamente).</li>
            <li><strong>Gravar últimos 30 segundos (Clip):</strong> <code>Win + Alt + G</code> (Precisa ativar nas configurações).</li>
            <li><strong>Capturar Tela (Print):</strong> <code>Win + Alt + PrintScreen</code>.</li>
        </ul>
      `
        },
        {
            title: "2. Ferramenta de Captura (Para Tutoriais e Área de Trabalho)",
            content: `
        <p class="text-gray-300 mb-4">
            A antiga "Ferramenta de Recorte" evoluiu. No Windows 11 atualizado, ela permite gravar vídeos de áreas específicas ou da tela inteira, inclusive do Desktop.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 bg-gray-900/30 p-6 rounded-xl">
            <li>Pressione <strong>Win + Shift + S</strong>.</li>
            <li>No topo da tela, mude do ícone de <strong>Câmera fotográfica</strong> para <strong>Filmadora</strong>.</li>
            <li>Selecione a área que deseja gravar com o mouse.</li>
            <li>Clique em 'Iniciar'. A ferramenta fará uma contagem de 3 segundos.</li>
            <li>Para finalizar, clique no botão de 'Stop' no topo (ou na notificação).</li>
        </ol>
        <p class="text-xs text-gray-400 mt-2">Nota: Esta ferramenta é menos performática que a Game Bar para jogos pesados, mas perfeita para mostrar como usar um site ou programa.</p>
      `
        },
        {
            title: "3. Configurando a Qualidade (Bitrate e 60 FPS)",
            content: `
        <p class="text-gray-300 mb-4">
            Por padrão, o Windows grava em qualidade "Standard" para economizar espaço. Se você quer vídeos nítidos para o YouTube:
        </p>
        <div class="space-y-4">
            <div>
                <p class="text-gray-300 text-sm">
                    Vá em <strong>Configurações > Jogos > Capturas</strong>.
                </p>
            </div>
            <ul class="list-disc list-inside text-gray-300 space-y-2 text-sm">
                <li><strong>Taxa de Quadros de Vídeo:</strong> Mude de 30 fps para <strong>60 fps</strong> (Essencial para fluidez).</li>
                <li><strong>Qualidade de Vídeo:</strong> Mude para <strong>Alta</strong> (Aumenta o bitrate, vídeo fica menos "pixelado").</li>
                <li><strong>Capturar cursor do mouse:</strong> Marque se estiver fazendo tutoriais.</li>
                <li><strong>Qualidade de Áudio:</strong> Suba para <strong>192kbps</strong> para melhor som.</li>
            </ul>
        </div>
      `
        },
        {
            title: "Diagnóstico de Problemas Comuns",
            content: `
        <div class="space-y-6">
            <div>
                <h4 class="font-bold text-white text-lg">O botão de gravar está cinza (indisponível)</h4>
                <p class="text-gray-300 text-sm mt-1">
                    Isso acontece ou porque sua placa de vídeo é muito antiga (não tem encoder de hardware) ou porque você está na Área de Trabalho (a Game Bar não grava o Desktop, use a Ferramenta de Captura nesse caso). Atualize os drivers da GPU.
                </p>
            </div>
            <div>
                <h4 class="font-bold text-white text-lg">Sem som na gravação</h4>
                <p class="text-gray-300 text-sm mt-1">
                    Abra a Game Bar (Win + G) e verifique o widget de "Áudio". Certifique-se de que a "Saída do sistema" e seu "Microfone" não estão mutados <em>dentro da gravação</em>. Às vezes o Windows grava apenas o som do jogo e ignora o Discord/Spotify se não configurado para "Todos os sons".
                </p>
            </div>
            <div>
                <h4 class="font-bold text-white text-lg">Vídeo travando ou com lag</h4>
                <p class="text-gray-300 text-sm mt-1">
                    Seu disco pode estar lento. Tente salvar as capturas em um SSD em vez de HD. Diminuir a qualidade para "Padrão" ou travar a gravação em 30 FPS também ajuda em PCs mais fracos.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Quando migrar para o OBS Studio?",
            content: `
        <p class="mb-4 text-gray-300">
            As ferramentas nativas são ótimas para o básico. Mas você deve instalar o <strong>OBS Studio</strong> se precisar de:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 text-sm bg-blue-900/10 p-4 rounded-xl border border-blue-500/20">
            <li>Webcam sobreposta ao vídeo (Facecam).</li>
            <li>Gravar múltiplas faixas de áudio separadas (Jogo em uma, Voz em outra para editar depois).</li>
            <li>Colocar overlays, alertas ou logomarcas na tela.</li>
            <li>Fazer lives (Streaming) para Twitch/YouTube.</li>
        </ul>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/como-usar-obs-studio-gravar-tela",
            title: "Tutorial OBS Studio",
            description: "O próximo nível: Guia completo para iniciantes no OBS."
        },
        {
            href: "/guias/atalhos-produtividade-windows",
            title: "Atalhos Secretos",
            description: "Aumente sua produtividade dominando teclados."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Otimizar SSD para Gravação",
            description: "Evite travamentos garantindo que seu disco é rápido."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="12 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
