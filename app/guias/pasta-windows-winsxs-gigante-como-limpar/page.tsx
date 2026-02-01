import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Pasta WinSxS Gigante: Como Limpar e usá-la Corretamente (DISM Cleanup) (2026)";
const description = "A pasta WinSxS pode ocupar 20GB ou mais. NÃO delete ela manualmente! Use o comando DISM StartComponentCleanup para remover versões antigas de arquivos.";
const keywords = ['pasta winsxs muito grande', 'limpar winsxs windows 11', 'dism startcomponentcleanup', 'reduzir tamanho windows', 'winsxs pode apagar', 'analisar armazenamento cmd'];

export const metadata: Metadata = createGuideMetadata('pasta-windows-winsxs-gigante-como-limpar', title, description, keywords);

export default function WinSxSGuide() {
    const summaryTable = [
        { label: "O que é", value: "Banco de DLLs" },
        { label: "Pode Apagar?", value: "NÃO (Manualmente)" },
        { label: "Ferramenta", value: "DISM (CMD)" },
        { label: "Ganho", value: "2GB a 10GB" }
    ];

    const contentSections = [
        {
            title: "O que é a pasta WinSxS?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          WinSxS (Windows Side by Side) é onde o Windows guarda cópias de segurança de todos os arquivos de sistema. Se uma atualização corromper seu PC, é de lá que ele tira o backup. Por isso ela cresce tanto: ela guarda as versões antigas de cada DLL atualizada.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed font-bold text-red-400">
            NUNCA tente deletar essa pasta pelo Windows Explorer. Você vai quebrar o Windows irreparavelmente.
        </p>
      `,
            subsections: []
        },
        {
            title: "O Comando Mágico de Limpeza",
            content: `
        <p class="mb-4 text-gray-300">
            O Windows tem uma ferramenta oficial para limpar versões obsoletas da WinSxS que não são mais necessárias (ex: updates de 2 anos atrás).
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-4 ml-4">
            <li>Abra o <strong>CMD</strong> como Administrador.</li>
            <li>Copie e cole este comando:</li>
        </ol>
        <div class="bg-black border border-gray-700 p-4 rounded-lg mt-4 mb-4 font-mono text-green-400 text-sm break-all">
            dism.exe /online /Cleanup-Image /StartComponentCleanup
        </div>
        <p class="text-gray-300">
            Isso vai demorar uns 10 ou 15 minutos. Ele analisa arquivo por arquivo.
        </p>
        <p class="text-white mt-4 font-bold">
            Se quiser ser mais radical (e perder a chance de desinstalar updates recentes):
        </p>
        <div class="bg-black border border-gray-700 p-4 rounded-lg mt-2 font-mono text-yellow-400 text-sm break-all">
            dism.exe /online /Cleanup-Image /StartComponentCleanup /ResetBase
        </div>
        <p class="text-gray-400 text-sm mt-2">
            O <code>/ResetBase</code> torna as atualizações atuais permanentes. Você não poderá "reverter atualização" depois disso, mas libera o máximo de espaço possível.
        </p>
      `,
            subsections: []
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
