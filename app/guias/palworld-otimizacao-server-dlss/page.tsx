import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'palworld-otimizacao-server-dlss',
    title: "Palworld (2026): Otimização de Servidor, DLSS Mod e Bases Gigantes",
    description: "Bases grandes com 50 Pals travam seu jogo? Aprenda a otimizar o servidor dedicado, instalar o mod de DLSS (grátis) e editar o Engine.ini para mais FPS.",
    category: 'jogos',
    difficulty: 'Intermediário',
    time: '20 min'
};

const title = "Palworld FPS Boost (2026): Performance em End-Game";
const description = "No começo roda liso. Quando você tem 3 bases com automação total, o FPS cai para 20. O problema é a CPU e a rede. Veja como resolver.";

const keywords = [
    'palworld fps drop base grande fix',
    'como instalar dlss mod palworld free',
    'melhores configurações servidor dedicado palworld',
    'engine.ini tweaks palworld performance',
    'view distance palworld fps',
    'palworld memory leak fix ram',
    'reduzir lag servidor palworld',
    'aumentar limite de pals base sem lag',
    'voltris optimizer unreal engine 5',
    'palworld co-op lag fix'
];

export const metadata: Metadata = createGuideMetadata('palworld-otimizacao-server-dlss', title, description, keywords);

export default function PalworldGuide() {
    const summaryTable = [
        { label: "DLSS Mod", value: "PureDark (Install)" },
        { label: "View Distance", value: "Medium" },
        { label: "Shadows", value: "Medium" },
        { label: "Effects", value: "Low" },
        { label: "Max Pals", value: "15 (Se lagar)" },
        { label: "Server FPS", value: "60 (Tickrate)" },
        { label: "RAM Fix", value: "Auto-Restart" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Efeito Bola de Neve",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Palworld usa a Unreal Engine 5. Cada Pal na base é uma IA com física (pathfinding). Com 15 Pals carregando pedras e berry, a CPU gargala.
        </p>
      `
        },
        {
            title: "Capítulo 1: Configurações Gráficas (Base)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">O Essencial</h4>
                <p class="text-gray-400 text-xs text-justify">
                    - <strong>View Distance:</strong> Medium. (High renderiza Pals muito longe, desnecessário).
                    <br/>- <strong>Grass Details:</strong> Medium.
                    <br/>- <strong>Shadows:</strong> Medium.
                    <br/>- <strong>Effects Quality:</strong> Low. Em Raids com fogo e explosões, o Low mantém o FPS estável.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: DLSS Mod (Obrigatório)",
            content: `
        <p class="mb-4 text-gray-300">
            Oficialmente o jogo tem DLSS nativo hoje em dia, mas mods como o <strong>"PureDark"</strong> ou tweaks de Engine.ini oferecem um preset "Ultra Performance" melhor.
            <br/>Se usar nativo: DLSS Performance.
            <br/>Se usar AMD: TSR (Temporal Super Resolution) é melhor que FSR 1.0 neste jogo.
        </p>
      `
        },
        {
            title: "Capítulo 3: Otimização de Servidor (Lag de Rede)",
            content: `
        <p class="mb-4 text-gray-300">
            Se você é o host ou aluga servidor:
            <br/>Edite <code>PalWorldSettings.ini</code>.
            <br/>- <code>DropItemMaxNum=1000</code> (Padrão 3000). Muitos itens no chão causam lag.
            <br/>- <code>PalEggDefaultHatchingTime=1</code> (Não afeta lag, mas qualidade de vida).
            <br/>- <strong>Reinicie o servidor a cada 6 horas.</strong> Palworld tem memory leak no servidor, consumindo RAM até crashar. Reiniciar limpa a RAM.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Engine.ini para FPS",
            content: `
        <p class="mb-4 text-gray-300">
            Vá em <code>%localappdata%\\Pal\\Saved\\Config\\Windows</code>.
            <br/>Adicione no Engine.ini:
            <br/><code>[SystemSettings]</code>
            <br/><code>r.ToneMapper.Sharpen=1</code> (Melhora nitidez do TAA).
            <br/><code>r.Nanite=0</code> (Desativa Nanite se sua GPU for antiga, ganhando FPS bruto).
        </p>
      `
        },
        {
            title: "Capítulo 5: Itens no Chão",
            content: `
        <p class="mb-4 text-gray-300">
            Não deixe milhares de pedras/madeira no chão da base.
            <br/>Use baús. A física de colisão de 500 pedrinhas rolando sobrecarrega a CPU.
            <br/>Construa fundações (chão) planas para evitar que itens caiam através do mapa (o que também consome processamento infinito de queda).
        </p>
      `
        },
        {
            title: "Capítulo 6: Pathfinding AI",
            content: `
        <p class="mb-4 text-gray-300">
            Faça corredores largos na sua base ("3 paredes de largura").
            <br/>Se os Pals ficarem presos ("Stuck"), a IA tenta recalcular a rota 100 vezes por segundo, causando picos de uso de CPU. Bases abertas e planas rodam melhor.
        </p>
      `
        },
        {
            title: "Capítulo 7: Motion Blur e Shake",
            content: `
        <p class="mb-4 text-gray-300">
            Desligue o <strong>Screen Shake</strong> (Tremor da tela) nas opções.
            <br/>Em montarias voadoras, o tremor é irritante e pode causar enjoo.
            <br/>Motion Blur off para ver recursos de longe.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Raid Boss Lag",
            content: `
            <p class="mb-4 text-gray-300">
                Em Bosses de Raid (Bellanoir), o jogo spawna muitos minions.
                <br/>Reduza temporariamente a resolução ou DLSS para "Ultra Performance" apenas para a luta se seu PC travar.
            </p>
            `
        },
        {
            title: "Capítulo 9: Crossplay Steam/Xbox",
            content: `
            <p class="mb-4 text-gray-300">
                A versão da Xbox Game Pass (PC) costuma estar 1 patch atrás da Steam.
                <br/>Isso causa incompatibilidade de mods. Se for jogar com mods, prefira a versão Steam.
            </p>
            `
        },
        {
            title: "Capítulo 10: Backup de Save (Corrupção)",
            content: `
            <p class="mb-4 text-gray-300">
                O jogo ainda está em Early Access/Beta. Saves corrompem.
                <br/>Use o script de Auto-Backup na pasta de saves.
                <br/>Perder 100h de progresso dói.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Como aumentar o limite de 15 Pals?",
            answer: "No World Settings, você pode aumentar para 20. Com mods, para 50+. Mas acima de 20, o lag se torna exponencial."
        },
        {
            question: "Servidor Dedicado ou Co-op Local?",
            answer: "Servidor Dedicado roda melhor para o cliente, pois o processamento do mundo fica no servidor, liberando seu PC para renderizar apenas gráficos."
        },
        {
            question: "Tela preta (UE5 Crash)?",
            answer: "Verifique integridade dos arquivos. Atualize driver de vídeo (UE5 é sensível). Desligue Overclock de GPU."
        }
    ];

    const externalReferences = [
        { name: "Palworld Settings Guide", url: "https://hub.palworld.com/" },
        { name: "Nexus Mods Palworld", url: "https://www.nexusmods.com/palworld" }
    ];

    const relatedGuides = [
        {
            href: "/guias/reduzir-ping-exitlag-noping-dns",
            title: "Ping",
            description: "Para servidores dedicados."
        },
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Nvidia",
            description: "DLSS config."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD",
            description: "Loadings."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Intermediário"
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
