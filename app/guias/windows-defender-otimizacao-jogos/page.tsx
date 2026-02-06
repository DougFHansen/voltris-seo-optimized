import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'windows-defender-otimizacao-jogos',
    title: "Windows Defender (2026): Otimização para Jogos sem Desativar",
    description: "O Antimalware Service Executable está usando 100% do Disco? Aprenda a configurar exclusões de pastas, limitar o uso de CPU do scan e evitar travadas jogando.",
    category: 'windows',
    difficulty: 'Intermediário',
    time: '25 min'
};

const title = "Windows Defender Gaming (2026): Segurança sem Lag";
const description = "Desativar o Defender é perigoso. O segredo é configurá-lo para ignorar seus jogos confiáveis, impedindo que ele escaneie cada arquivo de textura enquanto você joga.";

const keywords = [
    'antimalware service executable alta cpu fix',
    'windows defender usando muito disco jogos',
    'adicionar exclusão pasta jogos defender',
    'mpcmdrun limitar uso de cpu scan',
    'desativar proteção em tempo real windows 11 jogos',
    'agendador de tarefas defender idle',
    'proteção contra violação defender desativar',
    'isolamento de núcleo fps drop',
    'voltris optimizer defender mode',
    'msmpeng.exe high memory usage'
];

export const metadata: Metadata = createGuideMetadata('windows-defender-otimizacao-jogos', title, description, keywords);

export default function DefenderGuide() {
    const summaryTable = [
        { label: "Exclusões", value: "Pastas de Jogos (Steam)" },
        { label: "Real Time", value: "On (Com exclusões)" },
        { label: "CPU Limit", value: "10% e 20% (PowerShell)" },
        { label: "Tamper Prot", value: "On" },
        { label: "Core Isolation", value: "Off (Se CPU antiga)" },
        { label: "Cloud Protection", value: "On" },
        { label: "Sample Submit", value: "Off (Privacidade)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O MsMpEng.exe",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O processo <strong>Antimalware Service Executable</strong> (MsMpEng.exe) é o motor do Defender. Ele verifica arquivos em tempo real. O problema: quando você abre um jogo de 100GB, ele tenta verificar milhares de arquivos .dll e texturas, causando uso de disco e CPU extremos.
        </p>
      `
        },
        {
            title: "Capítulo 1: Configurando Exclusões (O Segredo)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Passo a Passo</h4>
                <p class="text-white font-mono text-sm mb-2">Segurança do Windows > Proteção contra vírus e ameaças > Gerenciar configurações > Exclusões.</p>
                <p class="text-gray-400 text-xs">
                    Adicione uma "Pasta". Selecione a pasta onde seus jogos estão instalados (ex: <code>C:\\SteamLibrary</code> ou <code>D:\\Games</code>).
                </p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Por que fazer isso?</h4>
                <p class="text-gray-400 text-xs text-justify">
                    A Steam e Epic Games verificam a integridade dos jogos. É redundante o Defender verificar também. Ao excluir a pasta "Games", o Defender para de scanear cada arquivo de textura lido pelo jogo, eliminando o lag de disco sem deixar seu sistema vulnerável (vírus geralmente vão para a pasta Downloads ou Windows, não para dentro da pasta do CS2).
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Limitando o uso de CPU (PowerShell)",
            content: `
        <p class="mb-4 text-gray-300">
            Você pode dizer ao Defender para nunca usar mais que X% da sua CPU durante um scan.
            <br/>Abra o PowerShell como Admin e digite:
        </p>
        <code class="block bg-black/50 p-3 rounded text-green-400 font-mono text-sm mb-3">
            Set-MpPreference -ScanAvgCPULoadFactor 20
        </code>
        <p class="text-gray-300 text-sm">
            Isso limita o uso a 20%. O scan vai demorar mais, mas seu PC não vai travar enquanto ele acontece. O padrão é 50%.
        </p>
      `
        },
        {
            title: "Capítulo 3: Isolamento de Núcleo (Memory Integrity)",
            content: `
        <p class="mb-4 text-gray-300">
            Segurança do Dispositivo > Isolamento de Núcleo > Integridade da Memória.
            <br/>- <strong>CPUs Novas (12th Gen+):</strong> Pode deixar ligado (Impacto mínimo).
            <br/>- <strong>CPUs Antigas (i7 7700 pra baixo):</strong> <span class="text-emerald-400 font-bold">DESLIGUE</span>.
            <br/>Essa função usa virtualização para proteger a RAM. Em CPUs velhas, isso causa uma perda de 10-15% de FPS em jogos.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Agendamento de Tarefas",
            content: `
        <p class="mb-4 text-gray-300">
            Às vezes o Defender decide fazer um "Scan Completo" no meio da sua partida.
            <br/>Vá no Agendador de Tarefas > Microsoft > Windows > Windows Defender.
            <br/>Nas propriedades de "Windows Defender Scheduled Scan" > Condições.
            <br/>Marque: <strong>"Iniciar a tarefa apenas se o computador estiver ocioso"</strong> por 10 minutos.
            <br/>Marque: "Parar se o computador deixar de estar ocioso".
            <br/>Isso garante que o scan pare assim que você mexer no mouse.
        </p>
      `
        },
        {
            title: "Capítulo 5: Envio de Amostras Automático",
            content: `
        <p class="mb-4 text-gray-300">
            Nas configurações do Defender: "Envio automático de amostra".
            <br/>Recomendação: <strong>Desativado</strong>.
            <br/>Isso envia arquivos suspeitos (como cracks ou mods de jogos) para a Microsoft analisar. Além de privacidade, isso gasta upload.
        </p>
      `
        },
        {
            title: "Capítulo 6: Proteção contra Violação",
            content: `
        <p class="mb-4 text-gray-300">
            Mantenha a "Tamper Protection" <strong>LIGADA</strong>.
            <br/>Ela impede que vírus desativem o Defender. Não desative isso a menos que saiba muito bem o que está fazendo (ex: instalando outro Antivírus).
        </p>
      `
        },
        {
            title: "Capítulo 7: Exclusão de Processos",
            content: `
        <p class="mb-4 text-gray-300">
            Além de pastas, você pode excluir processos .exe.
            <br/>Adicione o processo do seu jogo (ex: <code>cs2.exe</code>).
            <br/>Isso impede que o Defender monitore o comportamento do executável em tempo real, reduzindo overhead de CPU.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Modo Jogo (Game Mode)",
            content: `
            <p class="mb-4 text-gray-300">
                O "Modo de Jogo" do Windows 10/11 teoricamente impede que o Windows Update e o Defender façam instalações durante jogos.
                <br/>Mas a configuração manual de exclusões (Capítulo 1) é muito mais eficaz e garantida. Use os dois.
            </p>
            `
        },
        {
            title: "Capítulo 9: Defender vs Antivírus Grátis",
            content: `
            <p class="mb-4 text-gray-300">
                O Defender hoje é tão bom quanto Avast/AVG e muito mais leve.
                <br/>Antivírus de terceiros instalam "Web Shields", "Game Boosters" falsos e pop-ups de venda que pioram o desempenho.
                <br/>Fique com o Defender otimizado + Bom senso.
            </p>
            `
        },
        {
            title: "Capítulo 10: O Bug do 100% Disco",
            content: `
            <p class="mb-4 text-gray-300">
                Se mesmo com tudo isso o MsMpEng.exe usar 100% do disco:
                <br/>Você pode ter um arquivo corrompido muito grande (ISO ou ZIP) que ele está travado tentando ler. Exclua a pasta de Downloads das verificações ou apague arquivos grandes antigos.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Posso desativar o Defender permanentemente?",
            answer: "Pode (via Regedit/DControl), mas não recomendamos. Sem antivírus, um clique errado baixa um Ransomware que encripta todos os seus arquivos. O ganho de FPS desligando totalmente vs configurando exclusões é de 1-2 FPS. Não vale o risco."
        },
        {
            question: "Isolamento de Núcleo sumiu?",
            answer: "Se você não vê essa opção, talvez a Virtualização (VT-x / SVM) esteja desligada na BIOS. Para jogos, isso é bom (menos camadas de virtualização)."
        },
        {
            question: "SmartScreen atrapalha jogos?",
            answer: "O SmartScreen verifica apps na hora de abrir. Ele pode causar demora no lançamento do jogo, mas não afeta o FPS durante a partida."
        }
    ];

    const externalReferences = [
        { name: "Microsoft Docs (Defender Performance)", url: "https://docs.microsoft.com/en-us/microsoft-365/security/defender-endpoint/configure-extension-file-exclusions-microsoft-defender-antivirus" },
        { name: "AV-Test (Defender Ranking)", url: "https://www.av-test.org/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD",
            description: "Ajuda no scan rápido."
        },
        {
            href: "/guias/instalacao-windows-11",
            title: "Windows Limpo",
            description: "Menos processos."
        },
        {
            href: "/guias/google-chrome-consumo-ram-fix",
            title: "Chrome",
            description: "Evite vírus."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="25 min"
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
