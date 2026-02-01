import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Limpeza de Disco Profunda: Arquivos Temporários que o CCleaner Esquece (2026)";
const description = "Seu SSD está cheio? Aprenda a limpar pastas ocultas como Prefetch, SoftwareDistribution e hiberfil.sys para liberar até 20GB de espaço.";
const keywords = ['limpeza de disco windows 11', 'liberar espaço ssd', 'pasta temp onde fica', 'apagar prefetch é seguro', 'hiberfil.sys desativar', 'powercfg -h off'];

export const metadata: Metadata = createGuideMetadata('limpeza-disco-profunda-arquivos-temporarios', title, description, keywords);

export default function DiskCleanGuide() {
    const summaryTable = [
        { label: "Ganho", value: "5GB a 30GB" },
        { label: "Ferramenta", value: "Executar (Win+R)" },
        { label: "Segurança", value: "Alta" },
        { label: "Frequência", value: "Mensal" }
    ];

    const contentSections = [
        {
            title: "1. As Pastas Temporárias (O Básico)",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          O Windows tem duas lixeiras ocultas. Delete tudo que estiver dentro delas (se der erro de "Arquivo em uso", apenas clique em Ignorar).
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
            <li>Win + R > Digite <code>temp</code> > Delete tudo.</li>
            <li>Win + R > Digite <code>%temp%</code> > Delete tudo.</li>
            <li>Win + R > Digite <code>prefetch</code> > Delete tudo (Isso recria o cache de inicialização de apps, a primeira abertura será lenta, depois normaliza).</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "2. O Monstro da Hibernação (hiberfil.sys)",
            content: `
        <div class="bg-red-900/20 p-6 rounded-xl border border-red-500 mb-6">
            <h4 class="text-white font-bold mb-2">Você usa Hibernar?</h4>
            <p class="text-gray-300 text-sm">
                Se você tem 16GB de RAM, o Windows reserva um arquivo fixo de 16GB no seu SSD só para salvar o estado do PC caso você hiberne. Se você nunca hiberna (sempre desliga o PC), delete isso agora.
            </p>
            <p class="text-white mt-4 font-bold">Comando para deletar:</p>
            <ol class="list-decimal list-inside text-gray-300 text-sm ml-4">
                <li>Abra o CMD como Administrador.</li>
                <li>Digite: <code>powercfg -h off</code></li>
                <li>Pronto. Você acabou de ganhar gigabytes de espaço instantaneamente.</li>
            </ol>
        </div>
      `,
            subsections: []
        },
        {
            title: "3. Cache de Update (SoftwareDistribution)",
            content: `
        <p class="text-gray-300 mb-4">
            Quando o Windows baixa uma atualização e falha, o arquivo fica lá morto ocupando espaço.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
            <li>Pare o serviço Windows Update (veja nosso guia de Windows Update se não souber).</li>
            <li>Vá em <code>C:\Windows\SoftwareDistribution\Download</code>.</li>
            <li>Apague TUDO dentro dessa pasta.</li>
            <li>Reinicie o Windows Update.</li>
        </ol>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
