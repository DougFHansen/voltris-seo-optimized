import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'debloat-windows-11-otimizacao-powershell',
    title: "Guia Definitivo de Debloat Windows 11: Remova Bloatware e Zere Processos (2026)",
    description: "Seu Windows 11 consome 4GB de RAM parado? Aprenda a remover apps inúteis (Candy Crush, Xbox, Clima) com PowerShell e reduza o uso de CPU em 30%.",
    category: 'otimizacao',
    difficulty: 'Avançado',
    time: '45 min'
};

const title = "Guia Definitivo de Debloat Windows 11: Remova Bloatware e Zere Processos (2026)";
const description = "Seu Windows 11 consome 4GB de RAM parado? Aprenda a remover apps inúteis (Candy Crush, Xbox, Clima) com PowerShell e reduza o uso de CPU em 30%.";
const keywords = [
    'debloat windows 11 powershell script 2026',
    'como aumetar fps removendo processos windows',
    'lista de servicos para desativar windows 11 seguro',
    'ferramenta chris titus tech ou voltris optimizer',
    'remover telemetria windows 11 cmd'
];

export const metadata: Metadata = createGuideMetadata('debloat-windows-11-otimizacao-powershell', title, description, keywords);

export default function DebloatGuide() {
    const summaryTable = [
        { label: "Risco", value: "Médio (Crie Ponto de Restauração)" },
        { label: "Ferramenta", value: "PowerShell (Admin)" },
        { label: "Ganho de RAM", value: "Até 1.5 GB" },
        { label: "Ganho de CPU", value: "5-10% (Menos Processos)" },
        { label: "Tempo Necessário", value: "30-45 min" }
    ];

    const contentSections = [
        {
            title: "O Problema: Seu PC não é seu",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Quando você instala o Windows 11 hoje, ele vem com mais de 70 aplicativos pré-instalados. De "Disney+" a "Clipchamp", passando por rastreadores de telemetria ("DiagTrack"). Isso não é apenas irritante; esses apps rodam em segundo plano, consumindo ciclos da sua CPU e alocando memória RAM que deveria estar indo para o seu jogo.
        </p>
        <div class="bg-yellow-900/10 border-l-4 border-yellow-500 p-6 rounded-r-lg mb-8">
             <h4 class="text-yellow-400 font-bold mb-2">⚠️ Aviso de Segurança</h4>
             <p class="text-gray-300 text-sm">
                Antes de começar, crie um Ponto de Restauração. Aperte a tecla Windows, digite "Criar ponto de restauração" e salve o estado atual do PC. Se você remover algo errado (como a Loja), poderá voltar atrás.
             </p>
        </div>
      `
        },
        {
            title: "Método 1: A Limpeza Manual (O básico)",
            content: `
        <p class="mb-4 text-gray-300">
            Antes de usar scripts complexos, vamos remover o lixo visível.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 bg-gray-900 p-6 rounded-xl border border-gray-700">
            <li>Vá em <strong>Configurações > Aplicativos > Aplicativos Instalados</strong>.</li>
            <li>Procure e desinstale sem dó:
                <ul class="list-disc ml-8 mt-2 text-sm text-gray-400 space-y-1">
                    <li>Todos os "Solitaire", "Candy Crush", "TikTok".</li>
                    <li>"Notícias", "Clima" (se não usar), "Dicas".</li>
                    <li>"Cortana" (já morreu, mas o arquivo continua lá).</li>
                    <li>"OneDrive" (se você não usa, é um dos maiores vilões de performance).</li>
                </ul>
            </li>
        </ol>
      `
        },
        {
            title: "Método 2: PowerShell Cirúrgico (Avançado)",
            content: `
        <p class="mb-4 text-gray-300">
            Muitos apps não têm botão "Desinstalar". Para eles, usamos o PowerShell como Administrador.
        </p>

        <div class="bg-[#1e1e1e] border border-gray-700 p-6 rounded-xl font-mono text-xs overflow-x-auto">
            <p class="text-gray-500 mb-2"># Aperte Win+X > Terminal (Admin) e cole um por um:</p>

            <div class="space-y-4">
                <div>
                    <p class="text-green-400 font-bold"># Remover Xbox Game Bar (Se não usa)</p>
                    <p class="text-blue-300">Get-AppxPackage *xbox* | Remove-AppxPackage</p>
                </div>
                <div>
                    <p class="text-green-400 font-bold"># Remover "Seu Telefone" (Phone Link)</p>
                    <p class="text-blue-300">Get-AppxPackage *yourphone* | Remove-AppxPackage</p>
                </div>
                <div>
                    <p class="text-green-400 font-bold"># Remover Mapas</p>
                    <p class="text-blue-300">Get-AppxPackage *maps* | Remove-AppxPackage</p>
                </div>
                <div>
                    <p class="text-green-400 font-bold"># Remover Todos os Apps "Built-in" (Cuidado Extremo!)</p>
                    <p class="text-red-400 opacity-50"># Get-AppxPackage -AllUsers | Remove-AppxPackage (Não rode isso sem saber o que faz!)</p>
                </div>
            </div>
        </div>
      `
        },
        {
            title: "Método 3: Desativando Serviços Inúteis (Services.msc)",
            content: `
        <p class="mb-4 text-gray-300">
            Serviços são programas que rodam invisíveis. Desativar os certos libera muita RAM.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2">
            <li><strong>Experiências de Usuário Conectado e Telemetria (DiagTrack):</strong> O Espião do Windows. Desative.</li>
            <li><strong>SysMain (Antigo Superfetch):</strong> Se você usa SSD, pode causar escritas desnecessárias. Em HDs, deixe ligado.</li>
            <li><strong>Windows Search:</strong> Se você nunca busca arquivos pelo menu iniciar, desativar isso recupera muito uso de disco.</li>
            <li><strong>Spooler de Impressão:</strong> Não tem impressora? Desative.</li>
        </ul>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Otimizar SSD",
            description: "Complemente o Debloat com um disco rápido."
        },
        {
            href: "/guias/como-escolher-memoria-ram",
            title: "Guia de RAM",
            description: "8GB é pouco? Veja se precisa de upgrade."
        },
        {
            href: "/guias/remocao-virus-malware",
            title: "Remover Vírus",
            description: "Às vezes a lentidão não é bloatware, é malware."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="45 min"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            showVoltrisOptimizerCTA={true}
        />
    );
}
