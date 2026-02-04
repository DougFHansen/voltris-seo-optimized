import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Pasta WinSxS Gigante: Como limpar e ganhar espaço no Windows 11";
const description = "Sua pasta Windows está ocupando muito espaço? Aprenda o que é a pasta WinSxS e qual a forma segura de diminuir seu tamanho sem estragar o sistema em 2026.";
const keywords = [
    'como limpar pasta winsxs windows 11 tutorial 2026',
    'pasta windows muito grande como diminuir tamanho',
    'comando dism limpar winsxs passo a passo 2026',
    'winsxs pode apagar arquivos manual tutorial',
    'liberar espaço hd windows 11 pasta winsxs guia'
];

export const metadata: Metadata = createGuideMetadata('pasta-windows-winsxs-gigante-como-limpar', title, description, keywords);

export default function WinSxSCleanGuide() {
    const summaryTable = [
        { label: "O que é", value: "Armazenamento de componentes e drivers antigos" },
        { label: "Risco", value: "NUNCA delete arquivos manualmente nesta pasta" },
        { label: "Comando Oficial", value: "DISM.exe /Online /Cleanup-Image" },
        { label: "Dificuldade", value: "Média" }
    ];

    const contentSections = [
        {
            title: "O que é a pasta WinSxS?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          A pasta **WinSxS** (Windows Side-by-Side) é necessária para a estabilidade do sistema. Ela guarda cópias de arquivos vitais do Windows, drivers antigos e arquivos de atualizações passadas. Em 2026, com o acúmulo de patches do Windows 11, não é raro essa pasta ultrapassar os 20GB ou 30GB. O Windows mantém esses dados para o caso de você precisar "desinstalar" uma atualização ou recuperar um arquivo corrompido.
        </p>
      `
        },
        {
            title: "1. O Perigo da Exclusão Manual",
            content: `
        <p class="mb-4 text-gray-300">Aviso Crítico:</p>
        <div class="bg-red-900/10 p-5 rounded-xl border border-red-500/30">
            <p class="text-sm text-gray-300">
                Se você entrar na pasta <code>C:/Windows/WinSxS</code> e deletar qualquer arquivo manualmente, seu Windows <strong>não vai mais ligar</strong> ou vai parar de receber atualizações para sempre. Muitos arquivos ali dentro são "links diretos" para o sistema. Se você os apaga, você apaga partes do coração do Windows. Use apenas as ferramentas oficiais abaixo.
            </p>
        </div>
      `
        },
        {
            title: "2. Limpeza profunda via DISM (O Jeito Certo)",
            content: `
        <p class="mb-4 text-gray-300">Force o Windows a apagar versões antigas que não são mais necessárias:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Pesquise por <strong>CMD</strong> e abra como Administrador.</li>
            <li>Digite o comando: <code>Dism.exe /online /Cleanup-Image /StartComponentCleanup</code>.</li>
            <li>Este comando remove versões passadas de componentes que já foram atualizados.</li>
            <li><strong>ResetBase:</strong> Se você tem certeza que não quer voltar a versões de atualizações antigas, use: <code>Dism.exe /online /Cleanup-Image /StartComponentCleanup /ResetBase</code>. Isso reduzirá o tamanho da pasta ao mínimo possível.</li>
        </ol>
      `
        },
        {
            title: "3. Usando a Limpeza de Disco Nativa",
            content: `
        <p class="mb-4 text-gray-300">
            Muitas pessoas esquecem de limpar os arquivos do sistema na ferramenta padrão:
            <br/><br/><strong>Dica:</strong> Procure por 'Limpeza de Disco' no Iniciar. Clique em <strong>'Limpar arquivos do sistema'</strong>. Marque a caixa <strong>'Limpeza de atualizações do Windows'</strong>. Isso instrui o sistema a esvaziar a WinSxS de forma segura após grandes patches de 2026.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/limpeza-disco-profunda-arquivos-temporarios",
            title: "Limpeza Profunda",
            description: "Dicas extras para liberar espaço no C:."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Otimizar SSD",
            description: "Mantenha seu disco rápido após a limpeza."
        },
        {
            href: "/guias/debloating-windows-11",
            title: "Debloating Windows",
            description: "Remova o que é desnecessário no sistema."
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
