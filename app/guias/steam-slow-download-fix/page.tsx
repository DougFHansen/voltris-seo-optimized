import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'steam-slow-download-fix',
    title: "Steam (2026): Downloads Mais Rápidos, Limpeza de Cache e Otimização",
    description: "Download lento na Steam? Aprenda a mudar a região do servidor, limpar o cache de download e desabilitar o Overlay e Shader Pre-Caching para ganhar FPS.",
    category: 'software',
    difficulty: 'Fácil',
    time: '20 min'
};

const title = "Steam Turbo (2026): Maximizando Download e FPS";
const description = "A Steam é a maior plataforma de jogos, mas suas configurações padrão podem limitar sua velocidade de download e causar stuttering em jogos DX12.";

const keywords = [
    'steam download lento 2026 fix',
    'como limpar cache de download steam',
    'mudar regiao download steam brasil',
    'shader pre-caching steam desativar ou ativar',
    'steam overlay fps drop desligar',
    'modo big picture travando pc',
    'opções de inicialização steam performance',
    'steam webhelper consumindo cpu',
    'low bandwidth mode steam library',
    'voltris optimizer steam'
];

export const metadata: Metadata = createGuideMetadata('steam-slow-download-fix', title, description, keywords);

export default function SteamGuide() {
    const summaryTable = [
        { label: "Download Region", value: "Mais Perto (Teste)" },
        { label: "Shader Cache", value: "Enable (DX12)" },
        { label: "Overlay", value: "OFF (Competitivo)" },
        { label: "Interface", value: "Low Bandwidth" },
        { label: "Remote Play", value: "OFF" },
        { label: "Broadcasting", value: "Disabled" },
        { label: "WebHelper", value: "No-Browser (Mode)" }
    ];

    const contentSections = [
        {
            title: "Introdução: Otimizando o Cliente",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O cliente da Steam atualizou e ficou mais pesado (agora usa Chromium na biblioteca). Além disso, downloads lentos e "Shader Pre-Caching" infinito são problemas comuns. Vamos resolver.
        </p>
      `
        },
        {
            title: "Capítulo 1: Acelerando Downloads",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Região de Download</h4>
                <p class="text-white font-mono text-sm mb-2">Configurações > Downloads > Região</p>
                <p class="text-gray-400 text-xs">
                    Mude para o servidor mais próximo (ex: Brazil - Sao Paulo). Se estiver lento, TENTE OUTRO (ex: Brazil - Rio de Janeiro ou até US - Miami). Às vezes a rota de SP está congestionada e um servidor gringo baixa mais rápido.
                </p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Limpar Cache de Download</h4>
                <p class="text-white font-mono text-sm mb-2">Configurações > Downloads > Limpar Cache</p>
                <p class="text-gray-400 text-xs">
                    Se o download para e volta ("disk write error" ou velocidade oscilando), limpe o cache. Isso reseta a conexão com os servidores de conteúdo e remove arquivos temporários corrompidos. (Você terá que logar de novo).
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Steam Overlay e FPS",
            content: `
        <p class="mb-4 text-gray-300">
            Configurações > Em Jogo > "Ativar o Painel Steam dentro do jogo".
            <br/><strong>Recomendação:</strong> Desligue para jogos competitivos (CS2, Apex). O overlay consome VRAM e causa input lag.
            <br/>Se você precisa do Chat da Steam, use o shift+tab, mas saiba que custa FPS.
        </p>
      `
        },
        {
            title: "Capítulo 3: Shader Pre-Caching (A Polêmica)",
            content: `
        <p class="mb-4 text-gray-300">
            Configurações > Downloads > Shader Pre-Caching.
            <br/>- <strong>Ativar? SIM.</strong>
            <br/>Isso permite que a Steam baixe shaders compilados para sua GPU antes do jogo abrir. Isso <strong>ELIMINA</strong> stutters na primeira vez que você joga jogos DX12/Vulkan (Elden Ring, CS2, Apex).
            <br/>- <strong>Desvantagem:</strong> Ocupa espaço no disco e usa internet. Mas vale a pena pela fluidez.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Biblioteca Leve (Low Performance Mode)",
            content: `
        <p class="mb-4 text-gray-300">
            Configurações > Biblioteca.
            <br/>- <strong>Modo de largura de banda baixa:</strong> Ative.
            <br/>- <strong>Modo de baixo desempenho:</strong> Ative.
            <br/>Isso desativa as animações, vídeos de autoplay e transições da Biblioteca, economizando cerca de 200-400MB de RAM enquanto a Steam está aberta em segundo plano.
        </p>
      `
        },
        {
            title: "Capítulo 5: Steam Broadcasting e Remote Play",
            content: `
        <p class="mb-4 text-gray-300">
            Muitos não sabem, mas a Steam fica pronta para transmitir seu jogo.
            <br/>- Configurações > Remote Play > Desativar "Enable Remote Play".
            <br/>- Configurações > Broadcasting > "Privacy setting" -> Disabled.
            <br/>Isso impede que o serviço de encoding seja carregado na memória.
        </p>
      `
        },
        {
            title: "Capítulo 6: Friends & Chat (Voz)",
            content: `
        <p class="mb-4 text-gray-300">
            Abra a lista de amigos (Chat) > Engrenagem.
            <br/>- Voice: Desative "Gain Control" e "Echo Cancellation" se você já usa isso no software do microfone ou Discord. O processamento de áudio da Steam é ruim.
            <br/>- Ative "Don't sign into friends when Steam starts" se quiser focar.
        </p>
      `
        },
        {
            title: "Capítulo 7: Launch Options (Comandos Globais)",
            content: `
        <p class="mb-4 text-gray-300">
            Você pode criar um atalho da Steam na área de trabalho com o argumento:
            <br/><code>-no-browser +open steam://open/minigameslist</code>
            <br/>Isso abre a Steam em um modo ultra-minimalista, sem a loja, sem o navegador web, usando apenas 50MB de RAM. Perfeito para PCs muito fracos (4GB RAM) que só querem abrir o jogo.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Verificação de Integridade",
            content: `
            <p class="mb-4 text-gray-300">
                Se um jogo específico está travando:
                <br/>Biblioteca > Botão Direito no Jogo > Propriedades > Arquivos Instalados > "Verificar integridade dos arquivos".
                <br/>Isso conserta texturas corrompidas sem precisar baixar o jogo todo de novo. Frequente em updates do PUBG/Apex.
            </p>
            `
        },
        {
            title: "Capítulo 9: Movendo Jogos (SSD)",
            content: `
            <p class="mb-4 text-gray-300">
                Comprou um SSD novo?
                <br/>Configurações > Armazenamento.
                <br/>Adicione o novo drive. Selecione os jogos no drive antigo e clique em "Mover". A Steam transfere tudo corretamente. Mova seus jogos competitivos para o SSD.
            </p>
            `
        },
        {
            title: "Capítulo 10: Notificações",
            content: `
            <p class="mb-4 text-gray-300">
                Desative "Quando um amigo entrar num jogo" e "Quando um amigo ficar online".
                <br/>Esses pop-ups causam micro-travadas em alguns jogos fullscreen.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Steam WebHelper (steamwebhelper.exe) usando CPU?",
            answer: "É o navegador interno (Loja/Biblioteca). Ative o 'Modo de baixo desempenho' na Biblioteca e desligue a Aceleração de Hardware nas configurações de Interface para reduzir o uso. Ou use o modo '-no-browser'."
        },
        {
            question: "Download lento no final (99%)?",
            answer: "Isso é a Steam descompactando e instalando os arquivos. O uso de disco dispara e o download para. É normal. Um SSD NVMe acelera essa etapa drasticamente."
        },
        {
            question: "Controller não funciona?",
            answer: "Vá em Configurações > Controle. Ative o 'Steam Input' para PlayStation/Xbox. Isso cria um driver virtual que faz qualquer controle funcionar em qualquer jogo (até os antigos)."
        }
    ];

    const externalReferences = [
        { name: "Steam Status (Servers)", url: "https://steamstat.us/" },
        { name: "SteamDB (Database)", url: "https://steamdb.info/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD",
            description: "Escreva no disco mais rápido."
        },
        {
            href: "/guias/internet-lenta-jogos-lag",
            title: "Rede",
            description: "Otimize o download."
        },
        {
            href: "/guias/como-escolher-controle-pc",
            title: "Controle",
            description: "Steam Input explicado."
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
