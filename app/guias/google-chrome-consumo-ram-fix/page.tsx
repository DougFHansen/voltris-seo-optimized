import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'google-chrome-consumo-ram-fix',
    title: "Google Chrome (2026): Reduzindo Uso de RAM e CPU em Jogos",
    description: "Seu Chrome come 4GB de RAM? Aprenda a usar o Memory Saver, desativar apps em segundo plano e a aceleração de hardware para liberar recursos pro seu jogo.",
    category: 'software',
    difficulty: 'Fácil',
    time: '15 min'
};

const title = "Google Chrome Optimization (2026): RAM Cleaner & FPS";
const description = "O Chrome é famoso por devorar memória RAM. Se você joga com o navegador aberto (YouTube/Twitch), isso rouba FPS. Vamos colocar o Chrome em modo dieta.";

const keywords = [
    'google chrome consumindo muita ram 2026',
    'memory saver chrome ativar',
    'chrome travando jogos fps drop',
    'aceleracao de hardware chrome gpu',
    'suspender abas inativas chrome',
    'flags chrome performance',
    'extensoes chrome consumindo cpu',
    'continuar executando aplicativos segundo plano chrome desligar',
    'melhor navegador para jogos gx ou chrome',
    'limpar cache chrome pc lento'
];

export const metadata: Metadata = createGuideMetadata('google-chrome-consumo-ram-fix', title, description, keywords);

export default function ChromeGuide() {
    const summaryTable = [
        { label: "Memory Saver", value: "ON (Agressivo)" },
        { label: "Background Apps", value: "OFF (Crucial)" },
        { label: "Hardware Accel", value: "OFF (Se GPU 100%)" },
        { label: "Energy Saver", value: "ON" },
        { label: "Extensions", value: "Ublock Origin" },
        { label: "Preload Pages", value: "Off" },
        { label: "Theme", value: "Default (Leve)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Monstro da RAM",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Cada aba do Chrome é um processo separado no Windows. Se você tem 16GB de RAM e o Chrome usa 4GB, sobra menos para o jogo e para o cache do sistema. Resultado: Stutters. Felizmente, o Chrome 2025/2026 trouxe ferramentas nativas de eficiência.
        </p>
      `
        },
        {
            title: "Capítulo 1: Economia de Memória (Memory Saver)",
            content: `
        <div class="space-y-4">
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Ativar Economia de Memória</h4>
                <p class="text-white font-mono text-sm mb-2">Configurações > Desempenho > Economia de Memória</p>
                <p class="text-gray-400 text-xs">
                    Ligue isso. O Chrome vai "congelar" as abas que você não está usando (ex: aquele guia que você leu há 1 hora). Elas param de gastar RAM e só recarregam quando você clicar nelas. Isso libera até 2GB de RAM instantaneamente.
                </p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Apps em Segundo Plano (O Vilão)</h4>
                <p class="text-white font-mono text-sm mb-2">Configurações > Sistema</p>
                <p class="text-gray-400 text-xs">
                   Desmarque: <span class="text-red-400 font-bold">"Executar aplicativos em segundo plano quando o Google Chrome for fechado"</span>.
                   <br/>Se isso estiver ligado, o Chrome continua rodando mesmo quando você fecha o navegador (x), roubando recursos invisivelmente.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Aceleração de Hardware",
            content: `
        <p class="mb-4 text-gray-300">
            Em Configurações > Sistema > "Usar aceleração de hardware quando disponível".
            <br/><strong>O Dilema:</strong>
            <br/>- Se você assistir vídeos (YouTube/Twitch) enquanto joga:
            <br/>1. <strong>LIGADO:</strong> O vídeo usa a GPU. Pode tirar performance do jogo se a GPU for fraca (GTX 1060).
            <br/>2. <strong>DESLIGADO:</strong> O vídeo usa a CPU. Pode causar lag se a CPU for fraca (i5 antigo).
            <br/><em>Recomendação:</em> Teste. Geralmente, DESLIGAR ajuda se você prioriza FPS no jogo acima da suavidade do vídeo.
        </p>
      `
        },
        {
            title: "Capítulo 3: Extensões Fantasmas",
            content: `
        <p class="mb-4 text-gray-300">
            Extensões como "Honey", "Grammarly" ou VPNs rodam scripts em TODAS as páginas que você abre. Isso é pesado.
            <br/>Vá em <code>chrome://extensions</code> e remova tudo que não usa.
            <br/>Mantenha apenas um Adblock (Recomendamos <strong>uBlock Origin Lite</strong>, que é mais leve que o AdBlock Plus).
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Chrome Flags (Avançado)",
            content: `
        <p class="mb-4 text-gray-300">
            Digite <code>chrome://flags</code> na barra de endereço.
            <br/>Procure por:
            <br/>- <strong>Smooth Scrolling:</strong> Disabled (Reduz input lag na rolagem).
            <br/>- <strong>GPU Rasterization:</strong> Enabled (Força GPU para desenhar páginas, alivia CPU).
            <br/>- <strong>Choose ANGLE graphics backend:</strong> Tente mudar de Default para D3D11 ou OpenGL se tiver problemas de tela preta na Twitch.
        </p>
      `
        },
        {
            title: "Capítulo 5: Pré-carregamento de Páginas",
            content: `
        <p class="mb-4 text-gray-300">
            Configurações > Desempenho > Velocidade.
            <br/>"Pré-carregar páginas".
            <br/>Defina como <strong>Sem pré-carregamento</strong>.
            <br/>O pré-carregamento tenta adivinhar onde você vai clicar e carrega o site antes. Isso gasta internet e CPU à toa enquanto você joga.
        </p>
      `
        },
        {
            title: "Capítulo 6: Codec AV1 e YouTube",
            content: `
        <p class="mb-4 text-gray-300">
            Se seu PC trava assistindo vídeos em 4K/1080p60.
            <br/>Instale a extensão "h264ify" ou similar para forçar o YouTube a usar o codec H.264, que é mais leve para GPUs antigas decodificarem do que o VP9/AV1.
        </p>
      `
        },
        {
            title: "Capítulo 7: Limpeza de Cache (Reset)",
            content: `
        <p class="mb-4 text-gray-300">
            Se o Chrome está muito lento, não precisa reinstalar.
            <br/>Pressione Ctrl+Shift+Del > "Todo o período" > Imagens e arquivos armazenados em cache.
            <br/>Limpando 1GB de lixo, o navegador para de engasgar no disco.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Opera GX vs Chrome",
            content: `
            <p class="mb-4 text-gray-300">
                O Opera GX tem um "Limitador de RAM". É útil?
                <br/>Sim, mas ele apenas força o navegador a ficar lento se atingir o limite. O Chrome com "Memory Saver" (Capítulo 1) faz um trabalho similar de forma mais inteligente hoje em dia. O Chrome é mais estável.
            </p>
            `
        },
        {
            title: "Capítulo 9: Modo Anônimo para Jogar?",
            content: `
            <p class="mb-4 text-gray-300">
                Não jogue com abas anônimas abertas. Elas não salvam cache, então toda vez que você dá F5, o site baixa tudo de novo, gastando sua internet e causando ping alto no jogo.
            </p>
            `
        },
        {
            title: "Capítulo 10: Task Manager do Chrome",
            content: `
            <p class="mb-4 text-gray-300">
                O Chrome tem seu próprio Gerenciador de Tarefas.
                <br/>Pressione <strong>Shift+Esc</strong> dentro do Chrome.
                <br/>Veja qual aba ou extensão está usando mais CPU. Às vezes uma única aba travada está consumindo 30% do seu processador. Mate o processo por ali.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Devo usar Edge para jogos?",
            answer: "O Edge usa a mesma base (Chromium) do Chrome e tem um modo 'Sleeping Tabs' excelente. Ele é ligeiramente mais leve por ser integrado ao Windows. Vale a pena testar se o Chrome estiver impossível."
        },
        {
            question: "Quanto de RAM é normal o Chrome usar?",
            answer: "Com 5 abas, cerca de 800MB a 1.5GB é normal. Se passar de 3GB, tem algo errado (vazamento de memória ou extensão bugada)."
        },
        {
            question: "Aceleração de Hardware deixa a tela do Discord preta?",
            answer: "Sim, conflito de drivers. Desligue a aceleração no Browser se a transmissão da tela ficar preta para seus amigos no Discord."
        }
    ];

    const externalReferences = [
        { name: "Chrome Enterprise Release Notes", url: "https://support.google.com/chrome/a/answer/7679408" },
        { name: "Chromium Project", url: "https://www.chromium.org/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD",
            description: "Cache rápido."
        },
        {
            href: "/guias/discord-otimizacao-overlay-lag",
            title: "Discord",
            description: "Outro devorador de RAM."
        },
        {
            href: "/guias/windows-defender-otimizacao-jogos",
            title: "Defender",
            description: "Evite scans no browser."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
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
