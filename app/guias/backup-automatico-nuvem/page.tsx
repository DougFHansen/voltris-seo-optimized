import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Backup Automático na Nuvem: Proteja seus Arquivos - Voltris";
const description = "Como configurar backup automático no Google Drive, OneDrive e MEGA. Nunca mais perca fotos ou documentos por falha no HD.";
const keywords = ['backup automatico nuvem', 'google drive backup pc', 'onedrive sincronização', 'segurança de dados', 'backup fotos'];

export const metadata: Metadata = createGuideMetadata('backup-automatico-nuvem', title, description, keywords);

export default function BackupGuide() {
    const contentSections = [
        {
            title: "Por que não confiar apenas no HD externo?",
            content: `
        <p class="mb-4">HDs externos caem, oxidam e podem ser roubados. A nuvem é segura, criptografada e acessível de qualquer lugar. A regra de ouro do backup é <strong>3-2-1</strong>:</p>
        <ul class="text-gray-300 list-decimal list-inside ml-4">
            <li><strong>3</strong> cópias dos dados.</li>
            <li><strong>2</strong> mídias diferentes (HD e PC).</li>
            <li><strong>1</strong> cópia fora de casa (Nuvem).</li>
        </ul>
      `
        },
        {
            title: "Configurando o Google Drive para Desktop",
            content: `
        <ol class="space-y-4 text-gray-300 list-decimal list-inside ml-4">
            <li>Baixe o "Google Drive para Desktop" (antigo Backup & Sync).</li>
            <li>Instale e faça login na sua conta Google.</li>
            <li>Nas preferências, escolha <strong>"Adicionar pasta"</strong>.</li>
            <li>Selecione suas pastas vitais: Área de Trabalho, Documentos e Imagens.</li>
            <li>Marque "Sincronizar com o Google Drive".</li>
            <li>Pronto. Tudo que você salvar nessas pastas vai subir automaticamente.</li>
        </ol>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="25 minutos"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
        />
    );
}
