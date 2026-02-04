import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Limpeza de Disco Profunda: Como liberar Gigabytes no Windows";
const description = "Seu SSD está cheio? Aprenda a fazer uma limpeza profunda no Windows 11 para apagar arquivos temporários, sobras de atualizações e lixo do sistema.";
const keywords = [
    'como fazer limpeza de disco profunda windows 11',
    'apagar arquivos temporários windows 10 comando temp',
    'liberar espaço no ssd windows 2026 tutorial',
    'remover arquivos de otimização de entrega windows',
    'limpeza de sistema avançada passo a passo'
];

export const metadata: Metadata = createGuideMetadata('limpeza-disco-profunda-arquivos-temporarios', title, description, keywords);

export default function DeepDiskCleanupGuide() {
    const summaryTable = [
        { label: "Ferramenta Nativa", value: "Limpeza de Disco (cleanmgr)" },
        { label: "Pasta de Lixo #1", value: "%temp%" },
        { label: "Pasta de Lixo #2", value: "Prefetch" },
        { label: "Ganhos em média", value: "5GB a 20GB" }
    ];

    const contentSections = [
        {
            title: "Onde o Windows esconde o lixo?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Windows é um acumulador digital. Cada atualização instalada deixa para trás uma cópia de segurança "por precaução". Cada programa que você abre cria um arquivo temporário que deveria ser apagado ao fechar, mas que muitas vezes permanece no disco para sempre. Com o tempo, esse lixo pode ocupar 30GB ou mais do seu SSD.
        </p>
      `
        },
        {
            title: "1. Limpeza de Arquivos do Sistema (Avançada)",
            content: `
        <p class="mb-4 text-gray-300">Não use apenas a limpeza básica. Siga este caminho:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Pesquise por <strong>Limpeza de Disco</strong> no Menu Iniciar.</li>
            <li>Selecione a unidade C: e clique em OK.</li>
            <li>Quando a janela abrir, clique no botão <strong>'Limpar arquivos do sistema'</strong>.</li>
            <li>Marque todas as caixas, especialmente <strong>'Limpeza de Atualização do Windows'</strong> e 'Arquivos de Log'.</li>
            <li>Clique em OK. (Isso pode demorar alguns minutos dependendo da sua velocidade de disco).</li>
        </ol>
      `
        },
        {
            title: "2. O Comando dos Temporários",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Comandos Rápidos:</h4>
            <p class="text-sm text-gray-300">
                Aperte <code>Win + R</code> e limpe as seguintes pastas (pode apagar tudo o que tiver dentro delas): <br/>
                - <strong>%temp%</strong> (Arquivos de apps do usuário) <br/>
                - <strong>temp</strong> (Arquivos do Windows) <br/>
                - <strong>prefetch</strong> (Arquivos de pré-carregamento) <br/><br/>
                Se algum arquivo disser que "está em uso", apenas clique em <strong>'Ignorar'</strong>. Isso significa que um programa aberto está usando aquele arquivo agora.
            </p>
        </div>
      `
        },
        {
            title: "3. Sensor de Armazenamento (Automático)",
            content: `
        <p class="mb-4 text-gray-300">
            O Windows 11 tem um "faxineiro" automático. 
            <br/>Vá em <strong>Configurações > Sistema > Armazenamento</strong> e ative o <strong>Sensor de Armazenamento</strong>. Configure-o para rodar toda semana e limpar sua lixeira e pasta de downloads automaticamente se eles tiverem mais de 30 dias.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Otimizar SSD",
            description: "Dicas extras de performance para disco sólido."
        },
        {
            href: "/guias/debloating-windows-11",
            title: "Debloat Windows",
            description: "Remova apps que geram lixo no sistema."
        },
        {
            href: "/guias/manutencao-preventiva-computador",
            title: "Manutenção PC",
            description: "Dicas de hardware e software."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
