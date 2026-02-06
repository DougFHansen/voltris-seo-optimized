import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'team-fortress-2-mastercomfig-fps-competitivo',
    title: "Team Fortress 2 (2026): Mastercomfig, DX8 e Otimização Competitiva",
    description: "TF2 tem 20 anos de spaghetti code. Aprenda a usar o Mastercomfig para limpar o jogo, forçar DX8 para FPS máximo e melhorar o netcode.",
    category: 'jogos',
    difficulty: 'Avançado',
    time: '20 min'
};

const title = "TF2 Competitivo (2026): 300 FPS e Netcode Perfeito";
const description = "A Source Engine antiga roda mal em hardware novo. Mastercomfig é a bíblia sagrada para corrigir isso e fazer Rocket Jumps fluidos.";

const keywords = [
    'tf2 mastercomfig download install',
    'team fortress 2 dx8 vs dx9 fps',
    'como instalar configs tf2 autoexec',
    'interp settings tf2 projectile',
    'hud custom tf2 rayshud',
    'remove explosion particles tf2',
    'null cancel movement script tf2',
    'voltris optimizer valve',
    'fix stutter tf2 2026'
];

export const metadata: Metadata = createGuideMetadata('team-fortress-2-mastercomfig-fps-competitivo', title, description, keywords);

export default function TF2Guide() {
    const summaryTable = [
        { label: "Config", value: "Mastercomfig Low/Medium" },
        { label: "DirectX", value: "DX 8.1 (Max FPS)" },
        { label: "DirectX", value: "DX 9.5 (Skins/Sheens)" },
        { label: "Netcode", value: "Interp 0.0152 (Hitscan)" },
        { label: "Netcode", value: "Interp 0.0303 (Projétil)" },
        { label: "HUD", value: "Custom (RaysHUD/ToonHUD)" },
        { label: "Ragdolls", value: "Off (Limpeza)" }
    ];

    const contentSections = [
        {
            title: "Introdução: Source Engine Spaghetti",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          TF2 é CPU bound. Uma RTX 4090 fica em 40% de uso. O segredo é otimizar o uso de Single Core da CPU e limpar partículas (chapéus com efeitos Unusual comem FPS).
        </p>
      `
        },
        {
            title: "Capítulo 1: Mastercomfig (A Base)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Instalação</h4>
                <p class="text-gray-400 text-xs text-justify">
                    1. Acesse <strong>mastercomfig.com</strong>.
                    <br/>2. Escolha o preset:
                    <br/>- <strong>Low:</strong> Para PC da batata ou FPS maníaco. Jogo fica feio (Minecraft), mas roda a 500 FPS. Deixa o jogo muito limpo visualmente.
                    <br/>- <strong>Medium High:</strong> Equilíbrio visual/performance.
                    <br/>3. Baixe o <code>.vpk</code> e coloque na pasta <code>tf/custom</code>.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: DX8 vs DX9 (Launch Options)",
            content: `
        <p class="mb-4 text-gray-300">
            Nas opções de inicialização da Steam:
            <br/>- <code>-dxlevel 81</code>: Modo DirectX 8. Remove brilhos (Sheens de Killstreak), algumas skins ficam foscas, e Ubercharge não brilha tanto. GANHO MASSIVO DE FPS.
            <br/>- <code>-dxlevel 95</code>: Modo DirectX 9. Se você pagou caro em skins Australium e quer vê-las brilhando, use esse.
            <br/><em>Nota:</em> O competitivo geralmente aceita DX8, mas DX9 é melhor para streams.
        </p>
      `
        },
        {
            title: "Capítulo 3: Netcode e Interp",
            content: `
        <p class="mb-4 text-gray-300">
            TF2 tem configurações de rede de 2007 (feitas para internet discada).
            <br/>No <code>autoexec.cfg</code> (ou nos módulos do Mastercomfig):
            <br/>- <strong>Snapshot Buffer:</strong> Low (0.0152s) para Hitscan (Sniper/Scout). Resposta instantânea.
            <br/>- <strong>Snapshot Buffer:</strong> Safe (0.0303s) para Projéteis (Soldier/Demo). Evita foguetes falhando se o ping oscilar.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Custom HUD",
            content: `
        <p class="mb-4 text-gray-300">
            O HUD padrão é ruim (dano longe da mira).
            <br/>Baixe um HUD em <strong>huds.tf</strong> (ex: RaysHUD, ToonHUD, BudHUD).
            <br/>Eles centralizam a vida e munição, permitindo focar na mira. Instale na pasta <code>tf/custom</code>.
        </p>
      `
        },
        {
            title: "Capítulo 5: Ragdolls e Gibs",
            content: `
        <p class="mb-4 text-gray-300">
            Quando alguém morre, o corpo voa (Ragdoll) e explode em pedaços (Gibs).
            <br/>Calculando física desses corpos em um servidor 12v12 consome CPU.
            <br/>Use o comando (ou mastercomfig module) para desativar Ragdolls. Os inimigos somem ao morrer. Menos distração visual e +FPS.
        </p>
      `
        },
        {
            title: "Capítulo 6: Null-Cancelling Movement",
            content: `
        <p class="mb-4 text-gray-300">
            Script essencial para Scout.
            <br/>Ele impede que você pare se apertar A e D ao mesmo tempo. Em vez de parar, ele prioriza a última tecla apertada, garantindo movimento constante.
            <br/>Adicione o script no seu <code>autoexec.cfg</code>.
        </p>
      `
        },
        {
            title: "Capítulo 7: No-Hats Mod (Casual)",
            content: `
        <p class="mb-4 text-gray-300">
            Existe um mod que remove todos os chapéus (Hats) do jogo.
            <br/>Funciona apenas em servidores da comunidade com <code>sv_pure 0</code>.
            <br/>No Casual oficial da Valve (<code>sv_pure 1</code>), ele não funciona. Mastercomfig é a única saída para Casual.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Sombras do Jogador",
            content: `
            <p class="mb-4 text-gray-300">
                Desative sombras dinâmicas (<code>r_shadows 0</code>).
                <br/>Em mapas fechados, a sombra entrega sua posição na esquina? Sim. Mas ganhar 20 FPS ajuda mais a ganhar o duelo do que a informação da sombra (que é bugada no TF2).
            </p>
            `
        },
        {
            title: "Capítulo 9: Hitsound e Killsound",
            content: `
            <p class="mb-4 text-gray-300">
                Ative o som de acerto nas opções avançadas.
                <br/>Pitch (Tom): Low para dano alto (Boom), High para dano baixo (Tink).
                <br/>Ajuda a saber instantaneamente quanto dano seu foguete deu sem olhar os números.
            </p>
            `
        },
        {
            title: "Capítulo 10: Server FPS",
            content: `
            <p class="mb-4 text-gray-300">
                O TF2 roda a 66 ticks por segundo.
                <br/>Seu FPS deve ser sempre maior que 66.
                <br/>O ideal é FPS = Taxa de Hz do Monitor x 2 + 1. (Ex: 144hz -> cap a 289 fps) para minimizar input lag.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Como abrir o console?",
            answer: "Opções > Teclado > Avançado > Habilitar Console de Desenvolvedor. Asperte aspas (')."
        },
        {
            question: "FOV (Campo de Visão)?",
            answer: "Sempre use FOV 90 (<code>fov_desired 90</code>). Menos que isso é visão de túnel. Viewmodel FOV (arma) também pode ser aumentado para não tampar a tela (<code>viewmodel_fov 70</code>)."
        },
        {
            question: "Funciona em Mac/Linux?",
            answer: "Sim, TF2 roda nativo em Linux (Vulcano) até melhor que no Windows às vezes."
        }
    ];

    const externalReferences = [
        { name: "Mastercomfig", url: "https://mastercomfig.com/" },
        { name: "HUDS.TF", url: "https://huds.tf/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/cs2-otimizacao-fps-competitivo",
            title: "CS2",
            description: "Mesma engine Source (evoluída)."
        },
        {
            href: "/guias/reduzir-ping-exitlag-noping-dns",
            title: "Ping",
            description: "Ajuda no Hitreg."
        },
        {
            href: "/guias/mouse-acceleration-raw-accel-guia",
            title: "Mouse",
            description: "Mira de Sniper."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Avançado"
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
