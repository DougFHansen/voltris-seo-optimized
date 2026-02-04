import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Erro no Windows Update: Como destravar e corrigir (2026)";
const description = "Seu Windows Update não baixa atualizações ou trava em uma porcentagem? Aprenda como resetar os serviços de atualização no Windows 11 em 2026.";
const keywords = [
    'erro windows update como resolver 2026 tutorial',
    'windows update travado em 0 ou 100 como resolver guia',
    'resetar serviços do windows update tutorial 2026',
    'limpar pasta softwaredistribution windows 11 tutorial',
    'corrigir erro de download windows update guia 2026'
];

export const metadata: Metadata = createGuideMetadata('windows-update-corrigir-erros', title, description, keywords);

export default function WindowsUpdateFixGuide() {
    const summaryTable = [
        { label: "Erro Famoso", value: "0x80070005 ou 0x80240017" },
        { label: "Solução Rápida", value: "Solução de Problemas do Windows" },
        { label: "Pasta Crítica", value: "C:\\Windows\\SoftwareDistribution" },
        { label: "Dificuldade", value: "Médio" }
    ];

    const contentSections = [
        {
            title: "Por que o Windows Update trava?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **Windows Update** é o coração da segurança do seu PC em 2026. Mas, por vezes, um arquivo de atualização baixado pode vir corrompido, "travando" toda a fila de downloads futuros. Se o seu Windows 11 diz 'Houve um erro' ou fica parado em 99% por horas, o problema quase sempre está nos arquivos temporários antigos que impedem o sistema de processar os novos.
        </p>
      `
        },
        {
            title: "1. A Solução Nativa (O primeiro passo)",
            content: `
        <p class="mb-4 text-gray-300">Antes de comandos complexos, tente a ferramenta oficial:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Vá em Configurações > Sistema > <strong>Solução de Problemas</strong>.</li>
            <li>Clique em 'Outras soluções de problemas'.</li>
            <li>Encontre o 'Windows Update' e clique em <strong>Executar</strong>.</li>
            <li>O Windows tentará reiniciar os serviços e limpar pequenos erros de cache automaticamente. Reinicie o PC após o término.</li>
        </ol>
      `
        },
        {
            title: "2. Reset Profundo: SoftwareDistribution",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Limpando a lousa:</h4>
            <p class="text-sm text-gray-300">
                Se nada resolveu, precisamos apagar a pasta onde o Windows guarda os arquivos de update: <br/><br/>
                1. Abra o CMD como Administrador e digite para parar os serviços: <br/>
                   - <code>net stop wuauserv</code> <br/>
                   - <code>net stop bits</code> <br/>
                2. Vá na pasta <code>C:\\Windows\\SoftwareDistribution</code> e <strong>delete tudo</strong> o que houver lá dentro. <br/>
                3. Volte ao CMD e digite para ligar os serviços: <br/>
                   - <code>net start wuauserv</code> <br/>
                   - <code>net start bits</code> <br/>
                Agora, tente procurar atualizações novamente. O Windows criará arquivos novos e limpos.
            </p>
        </div>
      `
        },
        {
            title: "3. O \"Último Recurso\" em 2026",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Assistente de Atualização:</strong> 
            <br/><br/>Se o Windows Update sumiu ou dá erro constante mesmo após o reset, baixe o <strong>Assistente de Atualização do Windows 11</strong> diretamente do site da Microsoft. Ele funciona de forma independente do sistema, forçando a instalação da versão mais recente sem depender da fila de downloads travada do Painel de Controle.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/como-resolver-tela-azul",
            title: "Tela Azul no Update",
            description: "O que fazer se o PC travar na instalação."
        },
        {
            href: "/guias/pos-instalacao-windows-11",
            title: "Otimizar Sistema",
            description: "Garanta que seu PC suporte novas versões."
        },
        {
            href: "/guias/criar-ponto-restauracao-windows",
            title: "Antes de Atualizar",
            description: "Proteja seu sistema contra updates bugados."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="25 min"
            difficultyLevel="Médio"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
