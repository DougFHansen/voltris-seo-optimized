import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'antivirus-para-jogos-windows-defender-exclusao',
    title: "Antivírus para Gamers (2026): Windows Defender Otimizado",
    description: "Não pague por Norton ou McAfee. Eles deixam o PC lento. Aprenda a configurar o Windows Defender para ignorar a pasta 'SteamApps' e ganhar performance.",
    category: 'windows',
    difficulty: 'Iniciante',
    time: '10 min'
};

const title = "Segurança Gamer (2026): Defender Leve";
const description = "Antivírus terceiros são bloatware hoje em dia. O Windows Defender é excelente e leve, MAS precisa ser configurado para não escanear seus jogos enquanto você joga.";

const keywords = [
    'melhor antivirus para pc gamer leve',
    'desativar windows defender temporariamente',
    'adicionar exclusão pasta steam antivirus',
    'kaspersky free vs bitdefender gaming mode',
    'antimalware service executable alta cpu',
    'falso positivo cheat engine virus',
    'voltris optimizer security',
    'ransomware protection games save'
];

export const metadata: Metadata = createGuideMetadata('antivirus-para-jogos-windows-defender-exclusao', title, description, keywords);

export default function AntivirusGuide() {
    const summaryTable = [
        { label: "Software", value: "Windows Defender (Nativo)" },
        { label: "Pasta Steam", value: "Adicionar Exclusão" },
        { label: "Proteção em Tempo Real", value: "LIGADO (Segurança)" },
        { label: "Verificação", value: "Agendar para Madrugada" },
        { label: "Kaspersky/Norton", value: "Desinstalar (Pesado)" },
        { label: "Malwarebytes", value: "Apenas Scanner (Manual)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Monstro da CPU",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Toda vez que o jogo carrega um mapa, ele lê 5.000 arquivos do HD. O antivírus intercepta cada leitura para ver se é vírus. Isso dobra o tempo de loading e causa stutter.
        </p>
      `
        },
        {
            title: "Capítulo 1: Configurando Exclusões (O Pulo do Gato)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Evitando Escaneamento Inútil</h4>
                <p class="text-gray-400 text-xs text-justify">
                    Jogos originais da Steam/Epic são seguros. Não precisamos escanear toda hora.
                    <br/>1. Iniciar > Segurança do Windows > Proteção contra vírus e ameaças.
                    <br/>2. Gerenciar configurações > Exclusões > Adicionar ou remover exclusões.
                    <br/>3. Adicionar > Pasta.
                    <br/>4. Selecione: <code>C:/Program Files (x86)/Steam/steamapps</code>.
                    <br/>5. Faça o mesmo para Epic Games, Battlenet, etc.
                    <br/>Pronto. O Defender vai ignorar essas pastas, acelerando o loading drasticamente.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: MsMpEng.exe (Antimalware Service Executable)",
            content: `
        <p class="mb-4 text-gray-300">
            Se esse processo estiver usando 30% da CPU:
            <br/>Geralmente ele está escaneando a si mesmo ou um update do Windows travado.
            <br/>Adicione o próprio arquivo do Defender nas exclusões (Processo > MsMpEng.exe) para ele parar de loopar. (Dica de Regedit avançada, cuidado).
        </p>
      `
        },
        {
            title: "Capítulo 3: Outros Antivírus (Bloatware)",
            content: `
        <p class="mb-4 text-gray-300">
            Avast, AVG, McAfee: Desinstale. Use o <strong>Revo Uninstaller</strong> para remover tudo.
            <br/>Eles instalam plugins no navegador, "Game Boosters" falsos e pop-ups de venda.
            <br/>O Defender já é nível Enterprise em detecção.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Malwarebytes (O Companheiro)",
            content: `
        <p class="mb-4 text-gray-300">
            Tenha o <strong>Malwarebytes Free</strong> instalado.
            <br/>Mas vá em Configurações > Segurança e DESATIVE "Iniciar com Windows".
            <br/>Use ele apenas para fazer uma varredura manual 1x por mês ou se você baixar algo suspeito (pirataria). Não deixe ele rodando junto com o jogo (ele come FPS).
        </p>
      `
        },
        {
            title: "Capítulo 5: SmartScreen",
            content: `
        <p class="mb-4 text-gray-300">
            O "SmartScreen" bloqueia apps desconhecidos.
            <br/>Para gamers que usam mods ou ferramentas do GitHub (como CapFrameX, FanControl), isso atrapalha.
            <br/>Pode desativar o "Controle de aplicativos e navegador" se você sabe o que está baixando.
        </p>
      `
        },
        {
            title: "Capítulo 6: Controlled Folder Access (Proteção Ransomware)",
            content: `
        <p class="mb-4 text-gray-300">
            Essa função impede que programas gravem na pasta Meus Documentos.
            <br/>Muitos jogos salvam o progresso lá. Se isso estiver ativado, o jogo não salva (Erro de Save Corrompido).
            <br/>Se ativar, lembre-se de autorizar o executável do jogo manualmente.
        </p>
      `
        },
        {
            title: "Capítulo 7: Isolamento de Núcleo (VBS/HVCI)",
            content: `
        <p class="mb-4 text-gray-300">
            Segurança do Dispositivo > Isolamento de Núcleo > Integridade de Memória.
            <br/>Isso usa Virtualização para proteger o Kernel.
            <br/><strong>Custa 5% a 10% de FPS</strong> em alguns jogos.
            <br/>Se você só joga e não acessa bancos corporativos no PC, pode desativar para ganhar performance extra.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Falsos Positivos (Trainers/Mods)",
            content: `
            <p class="mb-4 text-gray-300">
                Se você usa Cheat Engine ou WeMod em jogos offline, o AV vai detectar como HackTool.
                <br/>Não é vírus, mas é uma ferramenta de injeção de memória. Você precisa permitir no dispositivo.
            </p>
            `
        },
        {
            title: "Capítulo 9: AdBlock (A linha de frente)",
            content: `
            <p class="mb-4 text-gray-300">
                O melhor antivírus é não clicar no botão "Download" verde falso.
                <br/>Use uBlock Origin no Chrome/Edge. Ele bloqueia os scripts maliciosos antes de baixarem.
            </p>
            `
        },
        {
            title: "Capítulo 10: Vírus de Pendrive",
            content: `
            <p class="mb-4 text-gray-300">
                Desative o "AutoRun" (Reprodução Automática) de pendrives. É a forma mais comum de infecção offline.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Defender é suficiente?",
            answer: "Sim, para 99% dos usuários domésticos. Ele ganha prêmios de segurança (AV-Test) constantemente e é integrado ao Kernel."
        },
        {
            question: "Preciso pagar antivírus?",
            answer: "Não. A indústria de antivírus pago vive de medo. Invista em VPN ou Gerenciador de Senhas (Bitwarden), não em AV."
        }
    ];

    const externalReferences = [
        { name: "AV-Test Results", url: "https://www.av-test.org/en/antivirus/home-windows/" },
        { name: "Malwarebytes Free", url: "https://www.malwarebytes.com/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Windows",
            description: "Otimizações gerais."
        },
        {
            href: "/guias/cheat-engine-speedhack-jogos-offline",
            title: "Cheat Engine",
            description: "Lidando com detecções."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Iniciante"
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
