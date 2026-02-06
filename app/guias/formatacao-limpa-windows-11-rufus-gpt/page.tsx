import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'formatacao-limpa-windows-11-rufus-gpt',
    title: "Formatação Limpa (2026): Windows 11 Gamer (Rufus/GPT)",
    description: "PC lento cheio de lixo? Nada supera uma formatação limpa. Guia passo a passo para criar pendrive bootável, particionar SSD em GPT e instalar drivers.",
    category: 'windows',
    difficulty: 'Avançado',
    time: '60 min'
};

const title = "Instalação Limpa do Windows 11 (2026)";
const description = "Atualizar do Windows 10 para o 11 por cima gera bugs. A melhor performance vem de apagar tudo e começar do zero. O famoso 'Format C:'.";

const keywords = [
    'como formatar pc windows 11 pen drive bootavel',
    'rufus gpt ou mbr uefi',
    'sem tpm 2.0 windows 11 rufus hack',
    'backup arquivos antes de formatar',
    'drivers essenciais pos formatacao',
    'criar conta local windows 11 bypass microsoft',
    'voltris optimizer clean install',
    'ninite install apps'
];

export const metadata: Metadata = createGuideMetadata('formatacao-limpa-windows-11-rufus-gpt', title, description, keywords);

export default function FormatGuide() {
    const summaryTable = [
        { label: "Ferramenta", value: "Rufus + ISO Oficial" },
        { label: "Partição", value: "GPT (UEFI)" },
        { label: "Sistema de Arquivos", value: "NTFS" },
        { label: "Backup", value: "Externo / Nuvem" },
        { label: "Internet", value: "Desligada na Instalação" },
        { label: "Conta", value: "Local (Offline)" }
    ];

    const contentSections = [
        {
            title: "Introdução: Por que Formatar?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Com o tempo, o registro engorda, drivers velhos se acumulam e sobras de programas desinstalados causam conflito. Uma formatação anual é o melhor "upgrade" grátis que você pode dar ao seu PC.
        </p>
      `
        },
        {
            title: "Capítulo 1: O Pendrive Bootável (Rufus)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Passo a Passo</h4>
                <p class="text-gray-400 text-xs text-justify">
                    1. Baixe a ISO do Windows 11 no site da Microsoft.
                    <br/>2. Baixe o <strong>Rufus</strong>.
                    <br/>3. Espete um Pendrive de 8GB+.
                    <br/>4. Selecione a ISO.
                    <br/>5. Esquema de Partição: <strong>GPT</strong> (para PCs novos com UEFI). Use MBR apenas para PCs jurássicos.
                    <br/>6. Sistema de destino: <strong>UEFI (não CSM)</strong>.
                    <br/>7. Iniciar. O Rufus vai perguntar se quer hacks: Marque "Remover exigência de TPM 2.0" e "Criar conta local" se quiser facilitar a vida.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Backup (Salve seus Saves)",
            content: `
        <p class="mb-4 text-gray-300">
            Copie para um HD Externo ou Google Drive:
            <br/>- Pasta Documentos (Saves de jogos estão aqui!).
            <br/>- Pasta Downloads (se tiver algo importante).
            <br/>- Desktop.
            <br/>- Prints e Clips.
            <br/>Jogos da Steam podem ficar num HD secundário (D:), não precisa baixar de novo se não formatar o D:.
        </p>
      `
        },
        {
            title: "Capítulo 3: BIOS e Boot",
            content: `
        <p class="mb-4 text-gray-300">
            Reinicie o PC e aperte DEL (ou F2) para entrar na BIOS.
            <br/>Vá em Boot Priority.
            <br/>Coloque o Pendrive (UEFI: USB Flash Drive) em 1º lugar.
            <br/>Salve e Saia (F10).
            <br/>O instalador vai carregar.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Particionamento (O Momento Tenso)",
            content: `
        <p class="mb-4 text-gray-300">
            Na tela "Onde você quer instalar o Windows?":
            <br/>Se você quer LIMPEZA TOTAL do SSD (C:):
            <br/>Exclua TODAS as partições do Disco 0 (Recuperação, Sistema, MSR...) até sobrar apenas um "Espaço Não Alocado".
            <br/>Selecione o espaço não alocado e clique em Avançar. O Windows cria as partições novas sozinho.
            <br/><strong>CUIDADO:</strong> Não apague o Disco 1 (D:) se for seu HD de backup! Identifique pelo tamanho em GB.
        </p>
      `
        },
        {
            title: "Capítulo 5: O Segredo da Conta Local",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Desconecte o Cabo de Rede</strong> antes de formatar.
            <br/>Quando o Windows pedir para conectar na internet:
            <br/>1. Aperte <strong>Shift + F10</strong>.
            <br/>2. Digite <code>oobe&#92;bypassnro</code> e Enter. O PC reinicia.
            <br/>3. Agora vai aparecer a opção "Não tenho internet".
            <br/>4. Crie uma conta Local (Ex: "Admin"). Isso evita vincular email e OneDrive forçado.
        </p>
      `
        },
        {
            title: "Capítulo 6: Drivers (Ordem Correta)",
            content: `
        <p class="mb-4 text-gray-300">
            Volte para o Windows (reconecte a internet).
            <br/>1. Windows Update (Rode tudo, reinicie quantas vezes precisar).
            <br/>2. Driver de Chipset (Site da AMD/Intel).
            <br/>3. Driver de Vídeo (Nvidia/AMD).
            <br/>O resto o Windows acha sozinho.
        </p>
      `
        },
        {
            title: "Capítulo 7: Ninite (Instalador Rápido)",
            content: `
        <p class="mb-4 text-gray-300">
            Acesse <strong>ninite.com</strong>.
            <br/>Marque Chrome, Discord, Steam, VLC, WinRAR, qBittorrent.
            <br/>Baixe um único instalador que instala tudo de uma vez sem clicar "Next" e sem toolbars indesejadas.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Debloat Pós-Install",
            content: `
            <p class="mb-4 text-gray-300">
                O Windows vem limpo, mas já vem com TikTok e Instagram pré-instalados no Iniciar.
                <br/>Clique com botão direito e Desinstalar.
                <br/>Use nosso guia de "Debloat" para remover o resto.
            </p>
            `
        },
        {
            title: "Capítulo 9: Configar",
            content: `
            <p class="mb-4 text-gray-300">
                Lembre de reativar o XMP na BIOS, setar o Hz do Monitor e configurar o Mouse (Desativar Precisão). Você resetou tudo, afinal.
            </p>
            `
        },
        {
            title: "Capítulo 10: Ativação",
            content: `
            <p class="mb-4 text-gray-300">
                A licença geralmente é digital vinculada à placa-mãe. Ele ativa sozinho.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "GPT ou MBR?",
            answer: "GPT é para UEFI (Moderno, boot rápido, suporta secure boot). MBR é Legacy (Antigo). Use GPT em qualquer PC pós-2015."
        },
        {
            question: "Perco a garantia?",
            answer: "Não. Software não anula garantia de hardware (exceto se você brickar a BIOS, mas formatar disco é seguro)."
        }
    ];

    const externalReferences = [
        { name: "Rufus Download", url: "https://rufus.ie/" },
        { name: "Windows 11 ISO Oficial", url: "https://www.microsoft.com/software-download/windows11" },
        { name: "Ninite (Apps)", url: "https://ninite.com/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/ddu-limpeza-drivers-video-guia",
            title: "DDU",
            description: "Drivers limpos."
        },
        {
            href: "/guias/debloat-windows-11-otimizacao",
            title: "Debloat",
            description: "Passo seguinte."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="60 min"
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
