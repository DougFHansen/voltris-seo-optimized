import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'starfield-otimizacao-dlss-mods',
    title: "Starfield (2026): Otimização, DLSS Mod e Custom INI",
    description: "Starfield é pesado e exingente de CPU. Aprenda a instalar o Mod de DLSS 3.5 (se necessário) e usar arquivos INI customizados para rodar em PCs médios.",
    category: 'jogos',
    difficulty: 'Avançado',
    time: '35 min'
};

const title = "Starfield Performance (2026): Explorando o Espaço a 60 FPS";
const description = "A Creation Engine 2 é faminta por banda de memória e CPU. Sem SSD, o jogo nem roda (o áudio dessincroniza). Vamos otimizar para exploração fluida.";

const keywords = [
    'starfield dlss frame generation mod free',
    'starfield performance boost ini file',
    'starfield audio desincronizado ssd fix',
    'melhores configurações graficas starfield',
    'crowd density starfield fps',
    'shadow quality medium vs high',
    'fsr 3 starfield settings',
    'inventory lag starfield fix',
    'voltris optimizer bethesda',
    'starfield com dlss nativo'
];

export const metadata: Metadata = createGuideMetadata('starfield-otimizacao-dlss-mods', title, description, keywords);

export default function StarfieldGuide() {
    const summaryTable = [
        { label: "Upscaling", value: "DLSS / FSR 3" },
        { label: "Shadows", value: "Medium" },
        { label: "Volumetric", value: "Low" },
        { label: "Crowd", value: "Low (Cidades)" },
        { label: "Motion Blur", value: "Off" },
        { label: "VRS", value: "On" },
        { label: "Install", value: "SSD (Obrigatório)" }
    ];

    const contentSections = [
        {
            title: "Introdução: CPU Bound",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Diferente de Cyberpunk, Starfield é limitado pela CPU e Memória RAM na maioria dos casos (cidades como New Atlantis e Akila). Ter GPU forte não garante 60 FPS se sua RAM for lenta.
        </p>
      `
        },
        {
            title: "Capítulo 1: Custom INI (StarfieldCustom.ini)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Como Criar</h4>
                <p class="text-gray-400 text-xs text-justify">
                    Vá em <code>Documentos\\My Games\\Starfield</code>.
                    <br/>Crie um arquivo texto <code>StarfieldCustom.ini</code>.
                    <br/>Adicione comandos essenciais para desativar o TAA borrado ou ajustar o FOV:
                    <br/><code>[Display]</code>
                    <br/><code>fDefaultFOV=100</code> (O padrão é estreito demais, causando enjoo).
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Configurações Gráficas Pesadas",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Shadow Quality:</strong> Medium. (High processa sombras para cada pedrinha no chão, matando a CPU).
            - <strong>Volumetric Lighting:</strong> Low. A luz entrando na nave é bonita, mas pesa muito.
            - <strong>Crowd Density:</strong> Low. Reduz a quantidade de cidadãos "sem nome" andando em New Atlantis. Essencial para manter FPS na cidade.
            - <strong>GTAO (Oclusão Ambiental):</strong> Medium.
        </p>
      `
        },
        {
            title: "Capítulo 3: DLSS e FSR 3 (Frame Generation)",
            content: `
        <p class="mb-4 text-gray-300">
            A Bethesda adicionou suporte nativo a DLSS e FSR 3 depois do lançamento.
            <br/>- <strong>Render Resolution:</strong> Defina para 67% (Quality) ou 58% (Balanced). 100% não vale a pena.
            - <strong>Frame Generation:</strong> Ative se tiver GPU compatível. Starfield é um jogo lento (RPG), então o input lag extra do Frame Gen não atrapalha tanto quanto em FPS competitivos.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Mods de Performance (Texture 1K)",
            content: `
        <p class="mb-4 text-gray-300">
            Se tem menos de 8GB de VRAM:
            <br/>Baixe o mod <strong>"Starfield Optimized Textures"</strong> (1K ou 2K).
            <br/>As texturas originais do jogo são 4K não otimizadas. Usar versões recompactadas em 2K economiza VRAM e reduz stutters sem perda visual perceptível.
        </p>
      `
        },
        {
            title: "Capítulo 5: SSD (Requisito Mínimo)",
            content: `
        <p class="mb-4 text-gray-300">
            Se o jogo trava por 2 segundos a cada tiro ou o áudio da fala sai depois da boca mexer:
            <br/>Você instalou no HD.
            <br/><strong>Solução Única:</strong> Mova para um SSD. Não existe fix de software para HD mecânico neste jogo. A engine exige streaming instantâneo.
        </p>
      `
        },
        {
            title: "Capítulo 6: VRS (Variable Rate Shading)",
            content: `
        <p class="mb-4 text-gray-300">
            Mantenha o <strong>VRS</strong> LIGADO.
            <br/>Ele reduz a qualidade de sombreamento nas bordas escuras da tela onde você não está olhando. Ganho de performance "grátis".
        </p>
      `
        },
        {
            title: "Capítulo 7: Atualização de Drivers (Starfield Ready)",
            content: `
            <p class="mb-4 text-gray-300">
                A Nvidia e a Intel (Arc) lançaram drivers específicos que dão +20% de performance em Starfield.
                <br/>Se você não atualiza driver há 6 meses, faça isso AGORA. A diferença para este jogo específico é massiva.
            </p>
            `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Inventário Lento (Lag nos Menus)",
            content: `
            <p class="mb-4 text-gray-300">
                Se o menu de armas trava ao abrir:
                <br/>É porque você tem milhares de itens (Recursos).
                <br/>Venda o excesso ou guarde no baú da Lodge (o baú infinito). Carregar 5000kg de ferro no inventário pessoal faz a CPU recalcular peso a cada frame do menu.
            </p>
            `
        },
        {
            title: "Capítulo 9: Navegação Espacial",
            content: `
            <p class="mb-4 text-gray-300">
                No espaço (batalha de nave), o desempenho é sempre melhor que no planeta.
                <br/>Você pode aumentar os gráficos para High no espaço, mas terá que baixar ao pousar. Mantenha no Medium para consistência.
            </p>
            `
        },
        {
            title: "Capítulo 10: Limite de FPS (Cap)",
            content: `
            <p class="mb-4 text-gray-300">
                A engine fica instável acima de 120 FPS (física de objetos voando).
                <br/>Limite o FPS a 60, 90 ou 120 no Painel Nvidia. Não deixe Ilimitado.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Funciona em GTX 1650?",
            answer: "Com FSR no modo Performance e Low settings, você consegue 30 FPS estáveis. Em New Atlantis pode cair para 20. Mods de 'Potato Graphics' podem ajudar."
        },
        {
            question: "Loading Screens são longos?",
            answer: "São frequentes. Starfield não é seamless. Ter um SSD NVMe reduz o loading de 10s para 2s, tornando a experiência tolerável."
        },
        {
            question: "Achievements com Mods?",
            answer: "Usar console commands ou mods desativa conquistas. Instale o mod 'Achievement Enabler' (requer SFSE) para reativá-las se você se importa com isso."
        }
    ];

    const externalReferences = [
        { name: "Nexus Mods Starfield", url: "https://www.nexusmods.com/starfield" },
        { name: "Starfield Script Extender (SFSE)", url: "https://www.nexusmods.com/starfield/mods/106" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD",
            description: "Obrigatório."
        },
        {
            href: "/guias/bios-otimizacao-xmp-tpm",
            title: "BIOS",
            description: "RAM rápida ajuda a CPU."
        },
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Nvidia",
            description: "Cap FPS."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="35 min"
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
