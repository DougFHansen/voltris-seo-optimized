import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Backup Automático na Nuvem: Como configurar em 2026";
const description = "Nunca mais perca seus arquivos! Aprenda como configurar o backup automático no Google Drive, OneDrive e iCloud no Windows 11 em 2026.";
const keywords = [
    'backup automatico nuvem windows 11 tutorial 2026',
    'configurar onedrive backup pastas pc guia',
    'google drive para desktop como usar tutorial 2026',
    'melhor armazenamento em nuvem para fotos e documentos',
    'sincronização de arquivos windows 11 nuvem guia completo'
];

export const metadata: Metadata = createGuideMetadata('backup-automatico-nuvem', title, description, keywords);

export default function CloudBackupGuide() {
    const summaryTable = [
        { label: "Serviço Padrão", value: "OneDrive (Integrado ao Windows)" },
        { label: "Melhor para Fotos", value: "Google Photos / iCloud" },
        { label: "Vantagem", value: "Acesso de qualquer lugar do mundo" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "O fim do medo de perder o HD",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, salvar arquivos apenas no seu computador é um erro grave. HDs e SSDs podem falhar sem aviso, e o Ransomware pode sequestrar seus dados locais. O **Backup na Nuvem** sincroniza suas pastas mais importantes (Documentos, Imagens, Desktop) em tempo real. Se o seu notebook for roubado ou quebrar, basta logar em outro aparelho para ter tudo de volta.
        </p>
      `
        },
        {
            title: "1. Usando a Nuvem Nativa: OneDrive",
            content: `
        <p class="mb-4 text-gray-300">O OneDrive já vem no Windows 11 e é a opção mais prática:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Clique no ícone da nuvem na barra de tarefas.</li>
            <li>Vá em Configurações > Aba Backup > <strong>Gerenciar Backup</strong>.</li>
            <li>Selecione 'Área de Trabalho', 'Documentos' e 'Imagens'.</li>
            <li><strong>Dica:</strong> Em 2026, use o recurso 'Arquivos sob Demanda' para não ocupar espaço no seu SSD local; o arquivo fica na nuvem e só baixa quando você clica nele.</li>
        </ol>
      `
        },
        {
            title: "2. Google Drive e a Integração com Fotos",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Para Usuários Android:</h4>
            <p class="text-sm text-gray-300">
                Se você usa Android, o **Google Drive para Desktop** é a melhor escolha. Ele permite criar uma unidade virtual (disco G:) no seu Windows. Tudo o que você joga lá é sincronizado instantaneamente. Além disso, ele gerencia o upload de fotos do seu celular para o Google Fotos de forma automática e organizada.
            </p>
        </div>
      `
        },
        {
            title: "3. Segurança e Privacidade na Nuvem",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Cuidado com o que você sobe:</strong> 
            <br/><br/>Nem toda nuvem é segura para dados sensíveis. Se você vai salvar planilhas bancárias ou cópias de documentos, certifique-se de usar o **Cofre Pessoal** do OneDrive (que exige biometria) ou use ferramentas de criptografia antes de fazer o upload. Em 2026, a nuvem é segura, mas o acesso à sua conta precisa estar protegido com 2FA.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/autenticacao-dois-fatores",
            title: "Proteger Nuvem",
            description: "Ative 2FA para ninguém acessar seus arquivos."
        },
        {
            href: "/guias/protecao-ransomware",
            title: "Regra do Backup 3-2-1",
            description: "Por que a nuvem sozinha não basta."
        },
        {
            href: "/guias/substituicao-ssd",
            title: "Trocar de Disco",
            description: "Restaure seus dados após o upgrade."
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
