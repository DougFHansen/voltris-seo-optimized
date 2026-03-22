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
            showVoltrisOptimizerCTA={false}
        >
            <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-[#121218] to-[#050510] border border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#31A8FF]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#31A8FF] to-[#8B31FF] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /><path d="m9.01 19 1.74-4.63a2 2 0 0 1 2.5-1.12l4.63 1.74" /></svg>
                        </div>
                        <div className="flex-grow text-center md:text-left">
                            <h3 className="text-2xl font-bold text-white mb-2">Otimização Automática com Voltris Optimizer</h3>
                            <p className="text-slate-400 mb-6 max-w-2xl">
                                O <strong>Voltris Optimizer</strong> aplica todas as correções deste guia (e mais 200 outras) com um único clique. Otimize Processos, Rede, Input Lag e FPS instantaneamente.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="https://github.com/DougFHansen/voltris-releases/releases/download/v2.0/VoltrisOptimizerInstaller.exe" className="px-8 py-4 bg-[#31A8FF] text-white font-bold rounded-xl hover:bg-[#2b93df] transition-all shadow-[0_0_30px_rgba(49,168,255,0.4)] flex items-center justify-center gap-2">
                                    Baixar Agora (x64)
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-[2px] transition-transform"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                </a>
                                <a href="https://github.com/DougFHansen/voltris-releases/releases/download/v2.0/VoltrisOptimizerInstallerX86.exe" className="px-8 py-4 bg-white/5 text-white border border-white/10 font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center text-xs">
                                    Para sistemas x86
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuideTemplate>
    );
}
