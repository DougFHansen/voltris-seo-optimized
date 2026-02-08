import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'gravação-tela-windows-nativa-dicas',
    title: "Como Gravar Tela do Windows: Guia Definitivo de Edição e Criação (2026)",
    description: "Não instale nada! Aprenda a gravar gameplay 4K, reuniões e tutoriais usando apenas ferramentas nativas do Windows 11. Inclui edição no Clipchamp e configurações de bitstream.",
    category: 'criacao-conteudo',
    difficulty: 'Iniciante',
    time: '20 min'
};

const title = "Como Gravar Tela do Windows: Guia Definitivo de Edição e Criação (2026)";
const description = "Não instale nada! Aprenda a gravar gameplay 4K, reuniões e tutoriais usando apenas ferramentas nativas do Windows 11. Inclui edição no Clipchamp e configurações de bitstream.";
const keywords = [
    'gravar tela windows 11 com audio interno e microfone',
    'xbox game bar nao grava tela preta jogos',
    'ferramenta de captura video sem marca dagua',
    'clipchamp editor gratis cortar video rapido',
    'configurar replay buffer windows 11 clipes',
    'melhor bitrate gravacao youtube 1080p 60fps',
    'obs studio vs game bar performance'
];

export const metadata: Metadata = createGuideMetadata('gravação-tela-windows-nativa-dicas', title, description, keywords);

export default function NativeRecordingGuide() {
    const summaryTable = [
        { label: "Método Gamer (Clips)", value: "Win + Alt + R (Game Bar)" },
        { label: "Método Trabalho (Reunião)", value: "Win + Shift + S (Snipping Tool)" },
        { label: "Qualidade Máxima", value: "4K 60FPS (HDR)" },
        { label: "Formato Padrão", value: "MP4 (H.264)" },
        { label: "Edição Grátis", value: "Clipchamp (Nativo)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Estúdio Portátil no seu Windows",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, você não precisa mais baixar softwares pesados e cheios de anúncios (como Bandicam ou FRAPS) para gravar sua tela. As ferramentas nativas do Windows 11 evoluíram para níveis profissionais. A <strong>Xbox Game Bar</strong> agora usa aceleração de hardware da GPU (NVENC/AMF) para gravar sem perder FPS, e a <strong>Ferramenta de Captura</strong> permite selecionar áreas precisas para tutoriais rápidos.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Neste guia expandido, vamos além do botão "Gravar". Vamos ensinar como configurar o áudio para não ficar estourado, como editar cortes rápidos sem recodificar o vídeo e como usar o recurso de "Replay" para salvar momentos que já aconteceram.
        </p>
      `
        },
        {
            title: "Capítulo 1: Xbox Game Bar (A Central de Jogos)",
            content: `
        <div class="space-y-6">
            <h4 class="text-white font-bold text-xl mb-3">Comandos de Teclado Essenciais</h4>
            <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-gray-800 p-4 rounded-lg border-l-4 border-green-500">
                    <strong class="text-green-400 block mb-1">Win + Alt + R</strong>
                    <span class="text-gray-300 text-sm">Iniciar/Parar gravação instantânea (Sem menus).</span>
                </div>
                <div class="bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
                    <strong class="text-blue-400 block mb-1">Win + Alt + G</strong>
                    <span class="text-gray-300 text-sm">Salvar os últimos 30 segundos (Clip de Replay).</span>
                </div>
                <div class="bg-gray-800 p-4 rounded-lg border-l-4 border-purple-500">
                    <strong class="text-purple-400 block mb-1">Win + G</strong>
                    <span class="text-gray-300 text-sm">Abrir o Painel (Overlay) para ajustar volumes.</span>
                </div>
            </div>

            <h4 class="text-white font-bold text-xl mt-6 mb-3">Configurando o "Replay Buffer" (Gravar o Passado)</h4>
            <p class="text-gray-300 text-md">
                O recurso mais poderoso da Game Bar é gravar o que JÁ aconteceu. Isso consome um pouco de RAM, mas garante que você nunca perca um momento épico.
            </p>
            <ol class="list-decimal list-inside text-gray-300 space-y-2 bg-gray-900/40 p-5 rounded-lg">
                <li>Vá em <strong>Configurações > Jogos > Capturas</strong>.</li>
                <li>Ative a opção <strong>"Gravar o que aconteceu"</strong>.</li>
                <li>Defina o tempo para "30 segundos" ou "1 minuto" (Mais que isso pode causar lag no jogo).</li>
                <li>Agora, sempre que algo legal acontecer, aperte <code>Win + Alt + G</code> e o vídeo será salvo na pasta Vídeos.</li>
            </ol>
        </div>
      `
        },
        {
            title: "Capítulo 2: Ferramenta de Captura (Tutoriais e Reuniões)",
            content: `
        <p class="text-gray-300 mb-4">
            A Xbox Game Bar não grava a Área de Trabalho (Desktop) nem o Explorador de Arquivos por segurança. Para isso (e para gravar apenas uma janela específica do navegador), usamos a Ferramenta de Captura evoluída.
        </p>

        <ol class="list-decimal list-inside text-gray-300 space-y-4 bg-gray-900 border border-gray-700 p-6 rounded-xl">
            <li>
                <strong>Atalho Mestre:</strong> Pressione <code>Win + Shift + S</code>.
            </li>
            <li>
                <strong>Mude o Modo:</strong> No topo da tela, clique no ícone de <strong>Filmadora</strong> (câmera de vídeo).
            </li>
            <li>
                <strong>Selecione a Área:</strong> Arraste o mouse para desenhar um quadrado na área que deseja gravar.
            </li>
            <li>
                <strong>Áudio:</strong> Antes de começar, clique no ícone de Microfone no topo para garantir que sua voz será gravada. Se quiser gravar o som do PC também, ative o ícone de Som do Sistema.
            </li>
            <li>
                <strong>Finalizar:</strong> Clique no quadrado vermelho ou na notificação para parar. O vídeo abrirá para preview.
            </li>
        </ol>
      `
        },
        {
            title: "Capítulo 3: Configurações de Qualidade (Bitrate e FPS)",
            content: `
        <p class="text-gray-300 mb-4">
            O Windows vem configurado para "Economia de Espaço", o que deixa os vídeos pixelados e travados a 30fps. Vamos mudar isso para qualidade de YouTube (1080p60).
        </p>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-300 border-collapse border border-gray-700 rounded-lg">
                <thead class="bg-gray-800 text-white">
                    <tr>
                        <th class="p-3 border border-gray-700">Configuração</th>
                        <th class="p-3 border border-gray-700 text-red-400">Padrão (Ruim)</th>
                        <th class="p-3 border border-gray-700 text-green-400">Recomendado (YouTube)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="bg-gray-900/50">
                        <td class="p-3 border border-gray-700 font-bold">Taxa de Quadros</td>
                        <td class="p-3 border border-gray-700">30 fps</td>
                        <td class="p-3 border border-gray-700"><strong>60 fps</strong> (Fluidez total)</td>
                    </tr>
                    <tr>
                        <td class="p-3 border border-gray-700 font-bold">Qualidade de Vídeo</td>
                        <td class="p-3 border border-gray-700">Padrão</td>
                        <td class="p-3 border border-gray-700"><strong>Alta</strong> (Bitrate ~15Mbps)</td>
                    </tr>
                    <tr class="bg-gray-900/50">
                        <td class="p-3 border border-gray-700 font-bold">Qualidade de Áudio</td>
                        <td class="p-3 border border-gray-700">128 kbps</td>
                        <td class="p-3 border border-gray-700"><strong>192 kbps</strong> (Voz cristalina)</td>
                    </tr>
                    <tr>
                        <td class="p-3 border border-gray-700 font-bold">Mouse</td>
                        <td class="p-3 border border-gray-700">Ligado</td>
                        <td class="p-3 border border-gray-700">Desligado (Para jogos cinemáticos)</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p class="text-xs text-gray-400 mt-2">
            Acesse essas opções em: <strong>Configurações > Jogos > Capturas</strong>.
        </p>
      `
        },
        {
            title: "Capítulo 4: Edição Rápida (Clipchamp e Fotos)",
            content: `
        <p class="text-gray-300 mb-4 h-full">
            Você gravou 1 hora de jogo, mas só quer os 5 minutos finais. Não precisa baixar o Adobe Premiere.
        </p>

        <div class="grid md:grid-cols-2 gap-8 mt-6">
            <div>
                <h4 class="text-white font-bold text-lg mb-2">Método 1: App Fotos (Corte sem Perdas)</h4>
                <p class="text-gray-400 text-sm mb-2">
                    Abra o vídeo no player padrão do Windows. Clique em <strong>Ctrl + E</strong> (Editar).
                    <br/><br/>
                    Arraste as bolinhas brancas na barra de tempo para marcar o início e o fim. Clique em "Salvar cópia".
                    <br/><strong class="text-green-400">Vantagem:</strong> É instantâneo. O vídeo não é recodificado, zero perda de qualidade.
                </p>
            </div>
            
            <div>
                <h4 class="text-white font-bold text-lg mb-2">Método 2: Clipchamp (Edição Completa)</h4>
                <p class="text-gray-400 text-sm mb-2">
                    O editor oficial do Windows 11. Arraste o vídeo para lá.
                    <br/><br/>
                    Adicione textos, músicas de fundo (tem biblioteca grátis), transições e até legendas automáticas com IA. Na hora de exportar, escolha 1080p (Grátis).
                    <br/><strong class="text-blue-400">Vantagem:</strong> Ferramentas criativas.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Diagnóstico de Problemas (FAQ)",
            content: `
        <div class="space-y-6 bg-gray-800/20 p-6 rounded-xl">
            <div>
                <h4 class="font-bold text-white text-lg">Tela Preta em Jogos (DirectX 12)</h4>
                <p class="text-gray-300 text-sm mt-1">
                    Alguns jogos (como CS2 ou Valorant) em modo "Tela Cheia Exclusiva" bloqueiam a renderização da Game Bar. 
                    <br/><strong>Solução:</strong> Mude o modo de vídeo do jogo para "Janela sem Bordas" (Borderless Window). A perda de FPS hoje em dia é negligenciável e permite gravar sem problemas.
                </p>
            </div>
            <div>
                <h4 class="font-bold text-white text-lg">Áudio do Microfone baixo ou mudo</h4>
                <p class="text-gray-300 text-sm mt-1">
                    Abra a Game Bar (Win+G). No widget de "Áudio", vá na aba "Voz". Certifique-se de que o microfone correto está selecionado (às vezes o Windows escolhe a webcam por padrão). Aumente o volume lá.
                </p>
            </div>
            <div>
                <h4 class="font-bold text-white text-lg">Vídeo travando muito</h4>
                <p class="text-gray-300 text-sm mt-1">
                    Se você grava no mesmo HD onde o jogo está instalado, o disco não aguenta ler o jogo e escrever o vídeo ao mesmo tempo.
                    <br/><strong>Solução:</strong> Mude a pasta de Capturas para um segundo HD/SSD.
                </p>
            </div>
        </div>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/como-usar-obs-studio-gravar-tela",
            title: "Tutorial Avançado: OBS Studio",
            description: "Quando as ferramentas nativas não bastam: Streamlabs, Cenas e Fontes."
        },
        {
            href: "/guias/atalhos-produtividade-windows",
            title: "Atalhos Secretos",
            description: "Domine seu teclado para trabalhar 10x mais rápido."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Otimizar Disco",
            description: "Como garantir que seu SSD está na velocidade máxima para gravação."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
