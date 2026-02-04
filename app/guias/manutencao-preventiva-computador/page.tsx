import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Manutenção Preventiva de Computador: Como evitar gastos no futuro";
const description = "Aprenda a rotina ideal de manutenção preventiva para o seu PC ou Notebook. Saiba o que fazer a cada mês para garantir que seu computador dure 10 anos ou mais.";
const keywords = [
    'manutenção preventiva computador passo a passo 2026',
    'checklist manutenção de pc gamer mensal',
    'como fazer o pc durar mais tempo tutorial',
    'manutenção preventiva software e hardware 2026',
    'limpeza e otimização periódica windows 11'
];

export const metadata: Metadata = createGuideMetadata('manutencao-preventiva-computador', title, description, keywords);

export default function PreventiveMaintenanceGuide() {
    const summaryTable = [
        { label: "Hardware", value: "Limpeza física a cada 6 meses" },
        { label: "Software", value: "Limpeza de disco mensal" },
        { label: "Segurança", value: "Backups semanais" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "O que é Manutenção Preventiva?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          A maioria das pessoas só leva o PC na assistência técnica quando ele para de ligar. A **Manutenção Preventiva** é o conjunto de pequenas ações que você faz <strong>antes</strong> do problema acontecer. É muito mais barato gastar 15 minutos por mês limpando o sistema do que pagar por uma placa-mãe nova que queimou por superaquecimento.
        </p>
      `
        },
        {
            title: "1. Rotina de Software (Mensal)",
            content: `
        <p class="mb-4 text-gray-300">Mantenha o cérebro do seu PC limpo:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Verificar Drivers:</strong> Use o Winget ou sites oficiais para ver se há atualizações de estabilidade.</li>
            <li><strong>Limpeza de Arquivos:</strong> Rode o <code>cleanmgr</code> para tirar atualizações velhas do Windows.</li>
            <li><strong>Check de integridade:</strong> Abra o PowerShell como Admin e digite <code>sfc /scannow</code> para o Windows auto-corrigir arquivos de boot.</li>
            <li><strong>Desinstalar Inúteis:</strong> Vá em 'Apps Instalados' e remova tudo o que você não usou nos últimos 30 dias.</li>
        </ul >
      `
        },
        {
            title: "2. Rotina de Hardware (Semestral)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Checklist Físico:</h4>
            <p class="text-sm text-gray-300">
                1. Verifique se todas as ventoinhas estão girando sem barulho de "areia". <br/>
                2. Use ar comprimido para limpar os filtros de ar. <br/>
                3. Confira se os cabos estão bem encaixados (especialmente os de energia da placa de vídeo). <br/>
                4. Veja se há estufamento em capacitores da placa-mãe ou sinais de ferrugem/oxidação.
            </p>
        </div>
      `
        },
        {
            title: "3. O \"Seguro\" dos seus Dados",
            content: `
        <p class="mb-4 text-gray-300">
            Hardware a gente compra outro, mas seus dados (fotos, documentos, save de jogos) são únicos. A manutenção definitiva é ter um backup. 
            <br/>Configure o <strong>OneDrive</strong> ou <strong>Google Drive</strong> para sincronizar sua pasta 'Documentos' e 'Imagens'. Assim, se o seu SSD morrer amanhã, você só terá o prejuízo financeiro, não emocional.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/limpeza-fisica-pc-gamer",
            title: "Limpeza Física",
            description: "Aprenda a limpar o hardware de verdade."
        },
        {
            href: "/guias/backup-dados",
            title: "Guia de Backup",
            description: "Estratégias para não perder nada."
        },
        {
            href: "/guias/verificar-saude-hd-ssd-crystaldiskinfo",
            title: "Saúde do Disco",
            description: "Como prever a morte de um HD ou SSD."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
