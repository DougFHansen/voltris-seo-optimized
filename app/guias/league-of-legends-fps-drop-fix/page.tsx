import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'league-of-legends-fps-drop-fix',
    title: "League of Legends (2026): Config, FPS Boost e Fix de Drops",
    description: "LoL travando na teamfight? Aprenda a usar o modo DX9 Legacy, configurar o PersistedSettings.json, desativar sons inúteis e otimizar o cliente.",
    category: 'jogos',
    difficulty: 'Fácil',
    time: '35 min'
};

const title = "League of Legends Optimization (2026): Adeus FPS Drop";
const description = "O LoL é leve, mas o código espaguete de 15 anos causa drops em PCs modernos. Este guia foca em estabilidade para que sua ult nunca trave.";

const keywords = [
    'league of legends fps drop fix 2026',
    'lol travando teamfight pc bom',
    'modo legacy dx9 league of legends ativar',
    'client lol modo configuração leve',
    'fechar cliente durante a partida lol',
    'persistedsettings.json fps boost lol',
    'limite de fps lol uncap ou 144',
    'como aumentar fps lol notebook fraco',
    'sombras league of legends desativar',
    'wait for vertical sync lol desligar'
];

export const metadata: Metadata = createGuideMetadata('league-of-legends-fps-drop-fix', title, description, keywords);

export default function LoLGuide() {
    const summaryTable = [
        { label: "Sombra", value: "Desativada" },
        { label: "Personagem", value: "Medium/High" },
        { label: "Ambiente", value: "Low" },
        { label: "Efeitos", value: "Low/Medium" },
        { label: "Cliente", value: "Fechar ao jogar" },
        { label: "DX9 Legacy", value: "On (Se travar)" },
        { label: "FPS Cap", value: "144/240" }
    ];

    const contentSections = [
        {
            title: "Introdução: Otimizando o Espaguete",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O LoL roda em qualquer batata, mas manter 144 FPS estáveis em uma luta de 5v5 com Baron e Dragão Ancião na tela é difícil até para PCs gamers. O problema geralmente não é sua GPU, mas o uso ineficiente de CPU e sons.
        </p>
      `
        },
        {
            title: "Capítulo 1: Configurações do Cliente (Launcher)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Habilitar Modo de Configuração Leve</h4>
                <p class="text-white font-mono text-sm mb-2">Engrenagem > Geral > Modo Leve</p>
                <p class="text-gray-400 text-xs">Isso desativa animações do launcher, economizando RAM antes do jogo começar.</p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Fechar cliente durante as partidas</h4>
                <p class="text-white font-mono text-sm mb-2">Engrenagem > Geral > Opções</p>
                <p class="text-gray-400 text-xs">
                    <span class="text-emerald-400 font-bold">SEMPRE ATIVE ISSO.</span> O cliente do LoL (baseado em Chromium) consome 500MB+ de RAM e CPU em segundo plano. Fechar ele libera recursos para a partida (Game.exe). A única desvantagem é que demora 5 segundos a mais para voltar à tela de honra no final.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Ajustes In-Game",
            content: `
        <table class="w-full text-sm text-left text-gray-400">
            <tbody>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Sombras</td>
                    <td class="py-2 text-red-400">Desativado</td>
                    <td class="py-2">Sombras no LoL são apenas borrões pretos que comem 30% do FPS. Desligue.</td>
                </tr>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Qualidade do Personagem</td>
                    <td class="py-2 text-emerald-400">High</td>
                    <td class="py-2">É importante ver detalhes das skins e habilidades (hitboxes). Não pesa muito.</td>
                </tr>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Qualidade do Ambiente</td>
                    <td class="py-2 text-yellow-400">Low/Very Low</td>
                    <td class="py-2">O mapa (chão) é estático. Low remove matinhos decorativos e borboletas que distraem.</td>
                </tr>
                 <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Qualidade de Efeitos</td>
                    <td class="py-2 text-yellow-400">Medium</td>
                    <td class="py-2">Low pode fazer skillshots ficarem invisíveis. Medium é seguro.</td>
                </tr>
                 <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Aguardar Sincronização Vertical</td>
                    <td class="py-2 text-red-400">Desligado</td>
                    <td class="py-2">V-Sync causa input lag no mouse. Você vai errar o farm/kiting.</td>
                </tr>
            </tbody>
        </table>
      `
        },
        {
            title: "Capítulo 3: Sombras vs Eye Candy",
            content: `
        <p class="mb-4 text-gray-300">
            A opção "Hide Eye Candy" (Ocultar belezas visuais) remove borboletas, água se movendo no rio e pequenos animais.
            <br/><strong>Ative isso.</strong> Menos distração visual = Mais foco no combate e mais FPS.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: DX9 Legacy Mode",
            content: `
        <p class="mb-4 text-gray-300">
            O LoL atualizou para DX11, mas algumas GPUs antigas odeiam isso.
            <br/>Se seu jogo trava ou a tela pisca:
            <br/>No Cliente > Configurações > Jogo > Marque <strong>"Preferir modo DX9 Legacy"</strong>.
            <br/>Isso força o jogo a usar a API antiga, que é ultra estável em hardware velho.
        </p>
      `
        },
        {
            title: "Capítulo 5: Sons (O vilão oculto)",
            content: `
        <p class="mb-4 text-gray-300">
            O LoL processa cada som de skill separadamente. Em uma teamfight, são 50 sons simultâneos.
            <br/>Vá em Áudio e <strong>Desative a Música</strong> (Toca música do Spotify se quiser).
            <br/>Desative sons de ambiente.
            <br/>Mantenha apenas Efeitos Sonoros, Ping e Voz. Isso alivia a CPU.
        </p>
      `
        },
        {
            title: "Capítulo 6: PersistedSettings.json (FPS Cap)",
            content: `
        <p class="mb-4 text-gray-300">
            Não edite game.cfg, edite este arquivo em <code>Riot Games\\League of Legends\\Config</code>.
            <br/>Procure por "FrameCapType" e defina para um valor fixo (ex: 2).
            <br/><strong>Nota:</strong> Dentro do jogo, limite o FPS (144, 240). "Ilimitado" faz o personagem "teletransportar" (rubberbanding) porque o servidor do LoL roda a 30 ticks e desincroniza se o seu cliente estiver a 900 FPS. Estabilidade > Velocidade Máxima.
        </p>
      `
        },
        {
            title: "Capítulo 7: Interface e Chat",
            content: `
        <p class="mb-4 text-gray-300">
            Reduza o tamanho da interface (HUD) para 20-30%.
            <br/>Desative "Mostrar Nomes de Invocadores" (Poluição visual).
            <br/>Desative "Enable Smooth Camera" (Deixa a câmera lenta/pesada).
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Reparação Hextech",
            content: `
            <p class="mb-4 text-gray-300">
                Se o FPS caiu após um patch:
                <br/>Baixe a "Ferramenta de Reparo Hextech" oficial da Riot.
                <br/>Marque "Reinstalar Patch" e "Limpar Logs". Force uma repatch limpa. Arquivos corrompidos de patch são a causa #1 de drops repentinos.
            </p>
            `
        },
        {
            title: "Capítulo 9: Modo Tela Cheia",
            content: `
            <p class="mb-4 text-gray-300">
                Muitos jogam em "Sem Bordas".
                <br/>Mude para <strong>Tela Cheia (Fullscreen)</strong>.
                <br/>Isso dá prioridade exclusiva à GPU e desabilita a composição do Windows, reduzindo o input lag do mouse drasticamente. O Alt+Tab fica mais lento, mas o jogo fica mais fluido.
            </p>
            `
        },
        {
            title: "Capítulo 10: Mouse DPI e Kiting",
            content: `
            <p class="mb-4 text-gray-300">
                Para ADC/Kiting (Orbwalk):
                <br/>Use DPI alto (1600+) e sensibilidade baixa no jogo (30-40) para evitar pular pixels (pixel skipping).
                <br/>Desative "Aprimorar precisão do ponteiro" no Windows (Aceleração). Mantenha a memória muscular consistente.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Meu FPS cai para 0 quando abro a loja?",
            answer: "Isso é carregamento do HDD. A loja carrega ícones. Instale o LoL no SSD. Se não tiver SSD, ative o Modo Leve no cliente."
        },
        {
            question: "Anti-Aliasing vale a pena?",
            answer: "Não. No LoL, o anti-aliasing borra um pouco o contorno dos minions, dificultando o last hit. A maioria dos pros joga com AA Desligado para nitidez máxima."
        },
        {
            question: "Ping aumentou do nada?",
            answer: "O cliente pode estar baixando skins em segundo plano. Feche o cliente durante a partida (Capítulo 1)."
        }
    ];

    const externalReferences = [
        { name: "Ferramenta de Reparo Hextech", url: "https://support-leagueoflegends.riotgames.com/hc/pt-br/articles/224826367-Automatizando-a-solu%C3%A7%C3%A3o-de-problemas-Ferramenta-de-Reparo-Hextech" },
        { name: "LoL Server Status", url: "https://status.riotgames.com/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD Speed",
            description: "Carregue a partida em 10s."
        },
        {
            href: "/guias/como-escolher-mouse-gamer",
            title: "Mouse",
            description: "Evite double-click falho."
        },
        {
            href: "/guias/internet-lenta-jogos-lag",
            title: "Ping",
            description: "Reduza lag spike."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="35 min"
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