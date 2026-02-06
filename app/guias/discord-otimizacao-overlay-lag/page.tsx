import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'discord-otimizacao-overlay-lag',
    title: "Discord (2026): Otimização, Overlay e Redução de Uso de CPU",
    description: "Seu Discord consome 20% da CPU? Aprenda a desativar a Aceleração de Hardware corretamente, configurar o Overlay para não lagar o jogo e melhorar a qualidade do áudio.",
    category: 'software',
    difficulty: 'Fácil',
    time: '20 min'
};

const title = "Discord Lite (2026): Zero Lag em Jogos";
const description = "O Discord é essencial, mas pesado. Ele é basicamente um navegador Chrome rodando no fundo. Vamos colocá-lo em dieta para que seu FPS no jogo não sofra.";

const keywords = [
    'discord consumindo muita cpu fix',
    'desativar overlay discord aumenta fps',
    'aceleracao de hardware discord ligar ou desligar',
    'discord travando stream tela preta',
    'como configurar krisp discord',
    'discord developer mode ativar',
    'reduzir uso de ram discord',
    'notificacoes discord atrapalhando jogo',
    'modo streamer discord automatico',
    'prioridade alta audiodg.exe discord'
];

export const metadata: Metadata = createGuideMetadata('discord-otimizacao-overlay-lag', title, description, keywords);

export default function DiscordGuide() {
    const summaryTable = [
        { label: "Hardware Accel", value: "OFF (Se GPU fraca)" },
        { label: "Overlay", value: "OFF (Recomendado)" },
        { label: "Noise Suppress", value: "Krisp (CPU) ou Standard" },
        { label: "Quality", value: "64kbps (Padrão)" },
        { label: "Echo Cancel", value: "On" },
        { label: "Advanced Voice", value: "Off (Se travar)" },
        { label: "GIFs", value: "Autoplay Off" }
    ];

    const contentSections = [
        {
            title: "Introdução: Electron Bloat",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Discord usa a estrutura Electron. Isso significa que ele carrega um "Chromium" inteiro só para mostrar o chat. Em PCs com CPU fraca (i3/i5 antigos), isso compete recursos com o jogo.
        </p>
      `
        },
        {
            title: "Capítulo 1: Aceleração de Hardware (O Dilema)",
            content: `
        <div class="space-y-4">
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Hardware Acceleration (GPU)</h4>
                <p class="text-gray-400 text-xs">
                    Configurações > Avançado > Aceleração de Hardware.
                </p>
                <div class="grid grid-cols-2 gap-4 mt-2">
                    <div class="bg-red-900/20 p-2 rounded">
                        <p class="text-red-300 text-xs font-bold">DESLIGUE SE:</p>
                        <p class="text-gray-400 text-xs">Você tem uma GPU fraca (GTX 1050, Integrada) e o jogo está usando 100% da GPU. O Discord vai travar a live/voz se faltar GPU.</p>
                    </div>
                    <div class="bg-emerald-900/20 p-2 rounded">
                        <p class="text-emerald-300 text-xs font-bold">LIGUE SE:</p>
                        <p class="text-gray-400 text-xs">Você tem CPU fraca mas GPU forte (RTX 3060+). Isso tira a carga da CPU e joga na GPU.</p>
                    </div>
                </div>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Overlay (Inimigo do FPS)",
            content: `
        <p class="mb-4 text-gray-300">
            Aquele overlay ("Quem está falando") injeta código no DirectX do jogo.
            <br/>Isso causa perda de 5 a 15 FPS e é a causa #1 de crash em jogos como CS2 e Destiny 2.
            <br/><strong>Recomendação:</strong> Desative o Overlay In-Game nas configurações globais. Se precisar muito, ative apenas para jogos específicos na aba "Jogos Registrados".
        </p>
      `
        },
        {
            title: "Capítulo 3: Qualidade de Voz e Krisp",
            content: `
        <p class="mb-4 text-gray-300">
            Configurações > Voz e Vídeo.
            <br/>- <strong>Supressão de Ruído:</strong> Use <strong>Krisp</strong>. É a melhor tecnologia de IA do mercado. Mas atenção: ele usa CPU. Se sua CPU estiver em 100% no jogo, sua voz vai cortar (robótica). Se isso acontecer, mude para "Standard".
            <br/>- <strong>Cancelamento de Eco:</strong> On.
            <br/>- <strong>Controle Automático de Ganho:</strong> On (Evita que você fique muito baixo).
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Reduzindo Animações (CPU)",
            content: `
        <p class="mb-4 text-gray-300">
            Configurações > Acessibilidade.
            <br/>- <strong>Enable Reduced Motion:</strong> On.
            <br/>- <strong>Automatically play GIFs:</strong> Off.
            <br/>- <strong>Stickers:</strong> Never animate.
            <br/>Um servidor cheio de GIFs e stickers animados consome muita CPU renderizando as animações. Desligar isso deixa o Discord "estático" e leve.
        </p>
      `
        },
        {
            title: "Capítulo 5: Stream e Go Live",
            content: `
        <p class="mb-4 text-gray-300">
            Configurações > Voz e Vídeo (Lá em baixo em Compartilhamento de Tela).
            <br/>- <strong>Use our latest technology to capture screen:</strong> On.
            <br/>- <strong>Use an experimental method to capture audio:</strong> On.
            <br/>Se sua stream para amigos fica travando (slideshow), o culpado pode ser o "OpenH264 Video Codec" (primeira opção lá em cima). Tente desligar/ligar a Aceleração de Hardware (OpenH264) para testar compatibilidade.
        </p>
      `
        },
        {
            title: "Capítulo 6: Configurações de Janela do Windows",
            content: `
        <p class="mb-4 text-gray-300">
            Minimize o Discord para a bandeja (Tray) quando estiver jogando.
            <br/>Não deixe ele aberto no segundo monitor se não estiver lendo.
            <br/>Quando minimizado, o Electron "congela" a renderização visual, liberando recursos.
        </p>
      `
        },
        {
            title: "Capítulo 7: Cache do Discord (Clean)",
            content: `
        <p class="mb-4 text-gray-300">
            O Discord acumula imagens (memes) no cache infinitamente. Pode chegar a 10GB.
            <br/>Feche o Discord.
            <br/>Vá em <code>%appdata%\\discord\\Cache</code>, <code>Code Cache</code> e <code>GPUCache</code>.
            <br/>Delete tudo dentro dessas pastas. O Discord vai abrir limpo e rápido.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Modo Streamer",
            content: `
            <p class="mb-4 text-gray-300">
                Ative "Habilitar Modo Streamer Automaticamente".
                <br/>Isso esconde seu e-mail e discriminador (#Tag) quando o OBS ou um jogo estiver aberto, evitando vazamento de dados acidental em live.
            </p>
            `
        },
        {
            title: "Capítulo 9: Developer Mode (ID)",
            content: `
            <p class="mb-4 text-gray-300">
                Configurações > Avançado > Modo de Desenvolvedor.
                <br/>Ative. Isso permite clicar com botão direito em qualquer usuário/servidor e "Copiar ID". Essencial para moderadores e para reportar problemas.
            </p>
            `
        },
        {
            title: "Capítulo 10: Notificações",
            content: `
            <p class="mb-4 text-gray-300">
                Desative "Ativar Notificações na Área de Trabalho".
                <br/>Receber um pop-up do Windows no meio do clutch do CS:GO minimiza o jogo ou trava a tela. Use apenas o som de notificação, sem banner visual.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Discord não detecta meu jogo?",
            answer: "Vá em 'Jogos Registrados' e clique em 'Adicionar!'. Aponte para o executável do jogo. Às vezes, rodar o Discord como Administrador é necessário para ele detectar jogos admin."
        },
        {
            question: "Voz robótica (Lag de Voz)?",
            answer: "Geralmente é falta de upload ou CPU 100%. No Gerenciador de Tarefas, vá em Detalhes, ache o `audiodg.exe` (processo do Windows Áudio), botão direito > Definir Prioridade > Alta. Isso garante que o áudio seja processado antes do jogo."
        },
        {
            question: "BetterDiscord é permitido?",
            answer: "É contra os ToS (Termos de Serviço). O Discord oficial não bane ativamente usuários do BetterDiscord/Vencord a menos que usem plugins maliciosos, mas tecnicamente é proibido. Use o cliente oficial para segurança máxima."
        }
    ];

    const externalReferences = [
        { name: "Discord Status", url: "https://discordstatus.com/" },
        { name: "Krisp AI Noise Cancelling", url: "https://krisp.ai/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/obs-studio-melhores-configuracoes-stream",
            title: "OBS Studio",
            description: "Capture o áudio do Discord separado."
        },
        {
            href: "/guias/reduzir-ping-regedit-cmd-jogos",
            title: "Rede",
            description: "Discord usa UDP igual jogos."
        },
        {
            href: "/guias/mic-chiando-ruido-estatico-fix",
            title: "Microfone",
            description: "Melhore a qualidade antes do Discord."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Fácil"
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
