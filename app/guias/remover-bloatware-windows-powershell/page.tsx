import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Remover Bloatware do Windows 11 com PowerShell (2026)";
const description = "Cansado de apps inúteis no Windows? Aprenda a usar scripts de PowerShell para remover bloatware e deixar seu sistema muito mais leve e rápido em 2026.";
const keywords = [
    'remover bloatware windows 11 powershell skip 2026',
    'script para limpar windows 11 apps inuteis tutorial',
    'win11debloat powershell guia completo 2026',
    'remover cortana e edge windows 11 comando powershell',
    'otimizar windows 11 para games removendo lixo 2026'
];

export const metadata: Metadata = createGuideMetadata('remover-bloatware-windows-powershell', title, description, keywords);

export default function BloatwareRemovalGuide() {
    const summaryTable = [
        { label: "Ferramenta", value: "PowerShell (Admin)" },
        { label: "O que remove", value: "Apps nativos, Telemetria, Widgets" },
        { label: "Risco", value: "Moderado (Crie um ponto de restauração)" },
        { label: "Dificuldade", value: "Intermediário" }
    ];

    const contentSections = [
        {
            title: "O que é Bloatware e por que remover?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Windows 11 em 2026 vem "recheado" de aplicativos que 99% dos usuários nunca abrem: Jogos de cartas, ferramentas de notícias, ferramentas de chat da Microsoft e telemetria constante. Esse "lixo" digital (Bloatware) consome memória RAM e ciclos do processador em segundo plano. Usar o PowerShell permite remover esses itens de forma profunda, algo que o Painel de Controle comum não permite.
        </p>
      `
        },
        {
            title: "1. Preparação: Ponto de Restauração",
            content: `
        <div class="bg-yellow-900/10 p-5 rounded-xl border border-yellow-500/30 mb-6">
            <p class="text-yellow-400 font-bold mb-2">Segurança em primeiro lugar!</p>
            <p class="text-sm text-gray-300">
                Como vamos mexer em arquivos do sistema, é **obrigatório** criar um ponto de restauração. Pesquise por 'Criar ponto de restauração' no Windows e clique em 'Criar'. Se algo parar de funcionar (como a Microsoft Store), você pode voltar no tempo facilmente.
            </p>
        </div>
      `
        },
        {
            title: "2. O Script Recomendado em 2026",
            content: `
        <p class="mb-4 text-gray-300">O método mais seguro e atualizado é o <strong>Win11Debloat</strong> ou o script de Chris Titus:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Clique com o botão direito no botão Iniciar e escolha <strong>Terminal (Administrador)</strong> ou PowerShell.</li>
            <li>Cole o seguinte comando (Script de C. Titus): <code>irm christitus.com/win | iex</code></li>
            <li>Uma interface gráfica será aberta. Vá na aba <strong>Tweaks</strong>.</li>
            <li>Selecione 'Desktop' para aplicar as otimizações recomendadas.</li>
            <li>Clique em 'Run Tweaks' e observe o PowerShell remover centenas de processos inúteis.</li>
        </ol>
      `
        },
        {
            title: "3. O que acontece após o Debloat?",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Resultados imediatos:</strong> 
            <br/><br/>Após a reinicialização, você notará que o uso de memória RAM em repouso cairá de 4GB-5GB para algo próximo de 2GB-2.5GB. O menu Iniciar ficará instantâneo e você não verá mais notícias ou anúncios intrusivos. Em jogos, isso se traduz em menos picos de lag (stuttering) causados por serviços de fundo tentando atualizar enquanto você joga.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/criar-ponto-restauracao-windows",
            title: "Ponto de Restauração",
            description: "Aprenda a criar a salvaguarda do sistema."
        },
        {
            href: "/guias/otimizacao-performance",
            title: "Performance Extrema",
            description: "Próximos passos após remover o bloatware."
        },
        {
            href: "/guias/privacidade-windows-telemetria",
            title: "Guia de Telemetria",
            description: "Entenda o que o script está desativando."
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
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
