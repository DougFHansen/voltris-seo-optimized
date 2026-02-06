import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'debloat-windows-11-otimizacao-powershell',
    title: "Debloat Windows 11 (2026): Scripts Seguros (Chris Titus)",
    description: "Remova a Cortana, OneDrive, Telemetria e Apps inúteis que roubam RAM. Use o Chris Titus Tech WinUtil, o script mais seguro e confiável.",
    category: 'windows',
    difficulty: 'Intermediário',
    time: '20 min'
};

const title = "Windows 11 Lite (2026): Debloat Seguro";
const description = "O Windows 11 vem inchado. 30% da RAM é usada por serviços que você nunca usa. Vamos limpar isso sem quebrar o sistema (nada de Windows 'Ghost Spectre' pirata).";

const keywords = [
    'chris titus tech winutil powershell command',
    'como remover cortana e onedrive windows 11',
    'desativar telemetria microsoft spy',
    'debloat windows 11 script 2026',
    'serviços desnecessarios para desativar gaming',
    'ooo shutup10 settings',
    'voltris optimizer debloat',
    'remover widgets barra de tarefas'
];

export const metadata: Metadata = createGuideMetadata('debloat-windows-11-otimizacao-powershell', title, description, keywords);

export default function DebloatGuide() {
    const summaryTable = [
        { label: "Ferramenta", value: "CTT WinUtil (PowerShell)" },
        { label: "Método", value: "IRM (Instalação Remota)" },
        { label: "Desktop", value: "Excluir Atalhos" },
        { label: "Serviços", value: "Disable Telemetry" },
        { label: "Updates", value: "Security Only" },
        { label: "RAM Save", value: "~1GB a 2GB" }
    ];

    const contentSections = [
        {
            title: "Introdução: Lite Original vs Modificado",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Baixar ISOs "Gamer" modificadas (Ghost Spectre, tiny11) é perigoso (podem ter keyloggers ou estar desatualizadas).
          <br/>O jeito certo é instalar o Windows Original e rodar um script de limpeza. É seguro, estável e reversível.
        </p>
      `
        },
        {
            title: "Capítulo 1: O Comando Mágico",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Chris Titus Tech WinUtil</h4>
                <p class="text-gray-400 text-xs text-justify">
                    1. Abra o PowerShell como Administrador.
                    <br/>2. Cole o comando: <code>irm christitus.com/win | iex</code>
                    <br/>3. Aperte Enter.
                    <br/>Uma janela gráfica vai abrir com todas as ferramentas que você precisa.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Tweaks (Aba Tweaks)",
            content: `
        <p class="mb-4 text-gray-300">
            Na aba "Tweaks", selecione "Desktop" (se for PC de mesa) ou "Laptop".
            <br/>Clique em <strong>"Run Tweaks"</strong>.
            <br/>O que ele faz?
            <br/>- Remove Telemetria (Espionagem da MS).
            <br/>- Desativa Hibernação (Libera espaço no SSD).
            <br/>- Remove Limites de Throttling de Rede.
            <br/>- Configura serviços para Manual (Print Spooler, etc).
        </p>
      `
        },
        {
            title: "Capítulo 3: Config (Aba Config)",
            content: `
        <p class="mb-4 text-gray-300">
            Aqui você pode instalar recursos ou corrigir o Windows.
            <br/>- <strong>Disable Bing Search in Start Menu:</strong> Essencial. Faz a busca do Windows ficar instantânea (parar de procurar na web).
            <br/>- <strong>Disable Sticky Keys:</strong> Para não apitar quando apertar Shift 5 vezes.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Updates (Aba Updates)",
            content: `
        <p class="mb-4 text-gray-300">
            Recomendado: <strong>"Security Updates Only"</strong>.
            <br/>Isso adia as atualizações de "Recursos" (que trazem bugs e mudam a interface) por 1 ou 2 anos, mas mantém o antivirus e correções de segurança em dia. Estabilidade empresarial no seu PC gamer.
        </p>
      `
        },
        {
            title: "Capítulo 5: O&O ShutUp10++ (Alternativa)",
            content: `
        <p class="mb-4 text-gray-300">
            Outra ferramenta excelente gratuita.
            <br/>O&O ShutUp10 dá chaves (switches) granulares para você desligar: "Enviar dados de escrita", "Acesso à localização", "ID de Publicidade".
            <br/>Use a configuração "Recommended" (Verde). A "Recommended + Somewhat" (Amarela) pode quebrar algumas coisas.
        </p>
      `
        },
        {
            title: "Capítulo 6: Removendo o OneDrive",
            content: `
        <p class="mb-4 text-gray-300">
            O OneDrive sincroniza sua pasta de Jogos e Documentos sem pedir, causando lag e upload constante.
            <br/>No WinUtil, clique em "Remove OneDrive" se você não usa. Cuidado: Seus arquivos na nuvem não somem, mas param de sincronizar no PC.
        </p>
      `
        },
        {
            title: "Capítulo 7: Plano de Energia (Ultimate Performance)",
            content: `
        <p class="mb-4 text-gray-300">
            O script pode habilitar o plano "Desempenho Máximo".
            <br/>Ele força a CPU a ficar em 100% clock o tempo todo. Use apenas em Desktops com bom cooler. Em notebooks, vai drenar a bateria em 20 minutos.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Limpeza de Disco",
            content: `
            <p class="mb-4 text-gray-300">
                Aba "Clean". Roda o Disk Cleanup nativo e limpa logs antigos.
                <br/>Pode liberar 5GB a 20GB após um grande update do Windows (Windows.old).
            </p>
            `
        },
        {
            title: "Capítulo 9: Restaurar",
            content: `
            <p class="mb-4 text-gray-300">
                O WinUtil cria um Ponto de Restauração antes de aplicar.
                <br/>Se algo quebrar (ex: impressora parou), é só voltar.
            </p>
            `
        },
        {
            title: "Capítulo 10: Performance Real",
            content: `
            <p class="mb-4 text-gray-300">
                Debloat não aumenta FPS máximo (ex: de 100 pra 200).
                <br/>Debloat melhora o FPS MÍNIMO (1% Lows) e reduz o uso de RAM em idle. O sistema fica mais responsivo e com menos stutter.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "É seguro rodar scripts da net?",
            answer: "O script do Chris Titus é open-source no GitHub, auditado por milhares de devs. É seguro. Evite scripts .bat desconhecidos do YouTube."
        },
        {
            question: "Posso atualizar o Windows depois?",
            answer: "Sim. Mas alguns bloatwares (Candy Crush) podem voltar. Rode o script novamente após grandes updates (24H2)."
        }
    ];

    const externalReferences = [
        { name: "Chris Titus Tech WinUtil (GitHub)", url: "https://github.com/ChrisTitusTech/winutil" },
        { name: "O&O ShutUp10++", url: "https://www.oo-software.com/en/shutup10" }
    ];

    const relatedGuides = [
        {
            href: "/guias/formatacao-limpa-windows-11-rufus-gpt",
            title: "Formatação",
            description: "Passo anterior."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD",
            description: "Otimizações de disco."
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
