import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'debloating-windows-11',
    title: "Debloating Windows 11: Remova Lixo e Ganhe Performance (2026)",
    description: "O Windows 11 vem cheio de bloatwates (TikTok, OneDrive, Xbox) que consomem RAM. Aprenda a usar o PowerShell para limpar seu sistema e deixá-lo leve como o Windows 7.",
    category: 'windows-geral',
    difficulty: 'Intermediário',
    time: '30 min'
};

const title = "Guia Definitivo de Debloat no Windows 11: Scripts Seguros e Manuais (2026)";
const description = "Seu PC novo já veio lento? A culpa é dos 50 aplicativos pré-instalados pela Microsoft. Descubra como remover a Telemetria, Cortana e Apps inúteis sem quebrar o sistema.";

const keywords = [
    'debloat windows 11 powershell script 2026',
    'como remover onedrive definitivamente',
    'desinstalar aplicativos nativos windows 11',
    'otimizar windows 11 para jogos debloater',
    'remover cortana e edge via cmd',
    'chris titus tech winutil guide',
    'windows 11 lite como fazer',
    'reduzir processos segundo plano windows'
];

export const metadata: Metadata = createGuideMetadata('debloating-windows-11', title, description, keywords);

export default function DebloatGuide() {
    const summaryTable = [
        { label: "Ferramenta", value: "PowerShell (Admin)" },
        { label: "Risco", value: "Médio (Crie Ponto de Restauração)" },
        { label: "Ganho", value: "-1.5GB de RAM usados" },
        { label: "Alvo", value: "Apps UWP (Loja) e Telemetria" },
        { label: "Reversível", value: "Sim (Reinstalar via Store)" },
        { label: "Segurança", value: "Scripts Open Source" }
    ];

    const contentSections = [
        {
            title: "O que é Bloatware e por que remover?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          "Bloatware" (Software Inchado) são aplicativos que vêm pré-instalados no Windows 11 que você nunca pediu e provavelmente nunca vai usar. Exemplos: Disney+, Clipchamp, Notícias, Clima, OneDrive e a assistente Cortana.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          Eles não ocupam apenas espaço em disco; eles rodam processos em segundo plano para buscar notificações e atualizações, consumindo CPU e Memória RAM que deveriam ir para seus jogos ou trabalho.
        </p>

        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 my-8">
            <h4 class="text-[#31A8FF] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">🚀</span> Debloat Seguro com 1 Clique
            </h4>
            <p class="text-gray-300 mb-4">
                Mexer no PowerShell pode assustar. O <strong>Voltris Optimizer</strong> tem um módulo "Smart Debloat" que identifica o que é seguro remover e o que é vital para o sistema, limpando seu PC sem quebrar a Loja ou o Windows Update.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a href="https://github.com/DougFHansen/voltris-releases/releases/download/v2.0/VoltrisOptimizerInstaller.exe" className="px-8 py-3 bg-[#31A8FF] text-white font-bold rounded-xl hover:bg-[#2b93df] transition-all shadow-[0_0_30px_rgba(49,168,255,0.4)] flex items-center justify-center gap-2">
                    Baixar Voltris Optimizer (x64)
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:translate-y-[2px] transition-transform duration-300">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                </a>
                <a href="https://github.com/DougFHansen/voltris-releases/releases/download/v2.0/VoltrisOptimizerInstallerX86.exe" className="px-8 py-3 bg-white/5 text-white border border-white/10 font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center text-xs">
                    Versão x86
                </a>
            </div>
        </div>
      `
        },
        {
            title: "Método 1: PowerShell (Manual e Seguro)",
            content: `
        <p class="mb-4 text-gray-300">
            Vamos usar o comando <code>Remove-AppxPackage</code> para desinstalar apps que não têm o botão "Desinstalar" nas configurações.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 bg-[#0A0A0F] p-4 rounded-xl border border-white/5 font-mono text-sm">
            <li>Clique com botão direito no Botão Iniciar > Terminal (Admin) ou PowerShell (Admin).</li>
            <li>Para remover o <strong>Xbox Game Bar</strong> (se você não usa):<br/>
                <code class="text-[#31A8FF]">Get-AppxPackage Microsoft.XboxGamingOverlay | Remove-AppxPackage</code>
            </li>
            <li>Para remover o <strong>Cortana</strong>:<br/>
                <code class="text-[#31A8FF]">Get-AppxPackage -allusers Microsoft.549981C3F5F10 | Remove-AppxPackage</code>
            </li>
            <li>Para remover o <strong>Seu Telefone (Phone Link)</strong>:<br/>
                <code class="text-[#31A8FF]">Get-AppxPackage Microsoft.YourPhone | Remove-AppxPackage</code>
            </li>
             <li>Para remover o <strong>Mapas</strong>:<br/>
                <code class="text-[#31A8FF]">Get-AppxPackage *windowsmaps* | Remove-AppxPackage</code>
            </li>
        </ol>
      `
        },
        {
            title: "Método 2: Scripts Automatizados (WinUtil)",
            content: `
        <p class="mb-4 text-gray-300">
            A comunidade criou ferramentas incríveis. O script do Chris Titus Tech (CTT) é o padrão ouro em 2026.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>Abra o PowerShell como Admin.</li>
            <li>Digite: <code>iwr -useb https://christitus.com/win | iex</code></li>
            <li>Uma janela gráfica abrirá. Vá na aba <strong>"Tweaks"</strong>.</li>
            <li>Selecione "Desktop" (se for PC de mesa) ou "Laptop".</li>
            <li>Clique em <strong>"Run Tweaks"</strong>.</li>
            <li>Isso vai desativar Telemetria, Wi-Fi Sense, Activity History e remover bloatwares temporários.</li>
        </ul>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Removendo o OneDrive à Força",
            content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-orange-400 font-bold mb-4 text-xl">⚠️ Atenção aos seus Arquivos</h4>
                <p class="text-gray-300 mb-4">
                    Antes de remover o OneDrive, certifique-se de que seus arquivos da Área de Trabalho e Documentos estão salvos localmente. O OneDrive costuma "sequestrar" essas pastas.
                </p>
            </div>
            <p class="text-gray-300 mb-4 text-sm">
                No CMD (Prompt de Comando) como Admin, execute:
            </p>
            <div class="bg-[#0A0A0F] p-4 rounded-lg border border-white/10 font-mono text-sm space-y-2">
                <p class="text-gray-300">taskkill /f /im OneDrive.exe</p>
                <p class="text-gray-300">%SystemRoot%\\System32\\OneDriveSetup.exe /uninstall</p>
                <p class="text-gray-300">%SystemRoot%\\SysWOW64\\OneDriveSetup.exe /uninstall</p>
            </div>
            `
        }
    ];

    const additionalContentSections = [
        {
            title: "Consequências do Debloat",
            content: `
            <div class="space-y-4">
               <div class="bg-gray-800 p-4 rounded-lg">
                    <h5 class="text-green-400 font-bold mb-2">Benefícios</h5>
                    <p class="text-gray-300 text-sm">
                        Menos processos (de 180 para 110), boot mais rápido, menus mais responsivos e mais RAM livre para jogos pesados.
                    </p>
               </div>
               <div class="bg-gray-800 p-4 rounded-lg">
                    <h5 class="text-red-400 font-bold mb-2">Efeitos Colaterais</h5>
                    <p class="text-gray-300 text-sm">
                        A busca do Windows pode ficar limitada (sem resultados da web). Widgets podem parar de funcionar. A Loja da Microsoft ainda funciona, mas updates automáticos podem ser pausados.
                    </p>
               </div>
            </div>
            `
        }
    ];

    const faqItems = [
        {
            question: "Posso reinstalar a Calculadora se eu apagar sem querer?",
            answer: "Sim. Abra a Microsoft Store, pesquise por 'Windows Calculator' e instale. Todos os apps nativos estão na loja."
        },
        {
            question: "Debloat aumenta FPS?",
            answer: "Diretamente, pouco (1-3 FPS). Indiretamente, evita quedas de FPS (Stuttering) causadas por processos de fundo que acordam a CPU no meio do jogo. Em PCs com 8GB de RAM ou menos, a diferença é brutal."
        },
        {
            question: "Isso quebra o Windows Update?",
            answer: "Os métodos listados aqui (PowerShell) NÃO quebram o Windows Update. Scripts agressivos de 'Windows Lite' (ISOs modificadas) quebram, mas este guia foca em manter o sistema original e estável."
        }
    ];

    const externalReferences = [
        { name: "Chris Titus Tech WinUtil GitHub", url: "https://github.com/ChrisTitusTech/winutil" },
        { name: "Microsoft Docs - Remove-AppxPackage", url: "https://learn.microsoft.com/en-us/powershell/module/appx/remove-appxpackage" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-processos-segundo-plano",
            title: "Processos em 2º Plano",
            description: "Como identificar o que está comendo sua CPU."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Otimizar SSD",
            description: "O par perfeito para um sistema limpo."
        },
        {
            href: "/guias/privacidade-windows-telemetria",
            title: "Desativar Telemetria",
            description: "Impeça o Windows de enviar dados para a Microsoft."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
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
