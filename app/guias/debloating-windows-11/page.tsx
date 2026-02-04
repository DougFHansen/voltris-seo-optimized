import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Debloating Windows 11: Guia Definitivo 2026";
const description = "O Windows 11 vem cheio de programas que você não usa. Aprenda a fazer o debloat completo usando scripts seguros e libere memória RAM e CPU para jogos em 2026.";
const keywords = [
    'como fazer debloat windows 11 tutorial 2026',
    'remover bloatware windows 11 powershell script',
    'desativar telemetria e rastreamento windows 11',
    'debulhador de windows 11 chris titus tutorial',
    'deixar windows 11 mais rápido para jogos 2026'
];

export const metadata: Metadata = createGuideMetadata('debloating-windows-11', title, description, keywords);

export default function DebloatGuide() {
    const summaryTable = [
        { label: "O que remove", value: "OneDrive, Teams, Widgets, Telemetria" },
        { label: "Ganhos em RAM", value: "500MB a 1.2GB" },
        { label: "Check Vital", value: "Sempre criar Ponto de Restauração" },
        { label: "Dificuldade", value: "Intermediário" }
    ];

    const contentSections = [
        {
            title: "O que é o Debloat em 2026?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Ao instalar o Windows 11 em 2026, ele vem com dezenas de serviços e aplicativos que rodam em segundo plano (como notícias, widgets, telemetria e apps de terceiros sugeridos como TikTok e Instagram). **Debloating** é o processo de limpar essa "sujeira" digital, fazendo com que o sistema use menos processos (threads) e foque todo o poder de fogo no seu trabalho ou nos seus jogos.
        </p>
      `
        },
        {
            title: "1. A Ferramenta Indispensável: CTT Windows Utility",
            content: `
        <p class="mb-4 text-gray-300">A forma mais segura e eficiente de limpar o sistema hoje:</p>
        <p class="text-sm text-gray-300">
            A ferramenta do Chris Titus Tech (CTT) é o padrão ouro da comunidade. <br/><br/>
            - Abra o PowerShell como Administrador. <br/>
            - Execute o comando oficial via site ctt.com. <br/>
            - Vá na aba **Tweaks** e selecione 'Desktop'. <br/>
            - Clique em **'Run Tweaks'**. <br/><br/>
            Isso vai desativar a telemetria, remover o OneDrive (opcional), configurar o Windows Update para um modo menos intrusivo e desativar serviços de rastreamento que consomem ciclos de CPU preciosos.
        </p>
      `
        },
        {
            title: "2. Matando os Widgets e o Sentry",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Engasgos no Explorer:</h4>
            <p class="text-sm text-gray-300">
                Os **Widgets** do Windows 11 são responsáveis por muitos travamentos na barra de tarefas. <br/><br/>
                Para remover permanentemente via comando, use: <br/> 
                <code>winget uninstall "Windows Web Experience Pack"</code>. <br/><br/>
                Isso liberta o seu 'explorer.exe' de carregar notícias e propagandas em segundo plano, tornando a transição entre abas e janelas instantânea.
            </p>
        </div>
      `
        },
        {
            title: "3. O que NÃO desativar",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Cuidado com o excesso:</strong> 
            <br/><br/>Muitos scripts de "Ultra-Performance" desativam o **Windows Update** completamente ou o **Windows Defender**. Em 2026, isso é extremamente perigoso devido ao aumento de vulnerabilidades de segurança. O debloat perfeito deve remover a "futilidade" visual e publicitária, mas manter as defesas e a capacidade de atualização do sistema intactas.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/remover-bloatware-windows-powershell",
            title: "Comandos Manuais",
            description: "Remova apps específicos via linha de comando."
        },
        {
            href: "/guias/criar-ponto-restauracao-windows",
            title: "Ponto de Restauração",
            description: "Faça isso ANTES do debloat."
        },
        {
            href: "/guias/otimizacao-performance",
            title: "Guia de Performance",
            description: "Próximos passos após a limpeza."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
