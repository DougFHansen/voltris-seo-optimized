import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Windows Update Travado ou com Erro? Use este Script para Corrigir (2026)";
const description = "O Windows Update não baixa? Dá erro 0x80070002? Aprenda a resetar completamente os componentes de atualização usando o CMD e limpar a pasta SoftwareDistribution.";
const keywords = ['windows update erro', 'resetar windows update cmd', 'erro 0x80070002', 'windows update travado em 0', 'limpar softwaredistribution', 'corrigir atualizacao windows 11'];

export const metadata: Metadata = createGuideMetadata('windows-update-corrigir-erros', title, description, keywords);

export default function WinUpdateGuide() {
    const summaryTable = [
        { label: "Ferramenta", value: "CMD (Admin)" },
        { label: "Risco", value: "Baixo" },
        { label: "Tempo", value: "5 Minutos" },
        { label: "Requer", value: "Reinicialização" }
    ];

    const contentSections = [
        {
            title: "Por que o Windows Update trava?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          O Windows Update é complexo. Ele depende de serviços de criptografia, rede e instaladores em segundo plano. Se o PC desligar no meio de um download ou a internet cair, os arquivos na pasta temporária (SoftwareDistribution) corrompem e o serviço trava para sempre.
        </p>
      `,
            subsections: []
        },
        {
            title: "Solução 1: O Script Definitivo de Reset",
            content: `
        <p class="mb-4 text-gray-300">
            Não perca tempo com a "Solução de Problemas" do Windows, ela nunca funciona. Vamos parar os serviços na força bruta, limpar o cache e reiniciar tudo limpo.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-4 ml-4">
            <li>Abra o <strong>Bloco de Notas</strong>.</li>
            <li>Cole o código abaixo (exatamente assim):</li>
        </ol>

        <div class="bg-black p-4 rounded-xl border border-gray-700 my-4 overflow-x-auto">
            <pre class="text-green-400 font-mono text-sm leading-6">
net stop wuauserv
net stop cryptSvc
net stop bits
net stop msiserver
Ren C:\\Windows\\SoftwareDistribution SoftwareDistribution.old
Ren C:\\Windows\\System32\\catroot2 catroot2.old
net start wuauserv
net start cryptSvc
net start bits
net start msiserver
pause
            </pre>
        </div>

        <ol start={3} class="list-decimal list-inside text-gray-300 space-y-4 ml-4">
            <li>Clique em Arquivo > Salvar Como.</li>
            <li>Nomeie como <strong>fix_update.bat</strong> (o .bat é importante!).</li>
            <li>Em "Tipo", selecione <strong>Todos os arquivos</strong>.</li>
            <li>Salva na Área de Trabalho.</li>
            <li>Clique com botão direito no arquivo criado > <strong>Executar como Administrador</strong>.</li>
        </ol>

        <p class="mt-4 text-gray-300 bg-gray-800 p-4 rounded">
            O script vai parar o Windows Update, renomear a pasta corrompida (forçando o Windows a criar uma nova zerada) e reiniciar os serviços. Depois disso, reinicie o PC e tente atualizar.
        </p>
      `,
            subsections: []
        },
        {
            title: "Solução 2: O Comando DISM e SFC",
            content: `
        <p class="mb-4 text-gray-300">
            Se o script acima não funcionar, pode ser que arquivos de sistema do próprio Windows estejam faltando.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
            <li>Abra o CMD como Administrador.</li>
            <li>Digite: <code class="text-yellow-400 select-all">DISM /Online /Cleanup-Image /RestoreHealth</code> e dê Enter. (Isso pode demorar 20 minutos).</li>
            <li>Quando terminar, digite: <code class="text-yellow-400 select-all">sfc /scannow</code> e dê Enter.</li>
        </ol>
        <p class="mt-2 text-gray-300">
            O DISM baixa arquivos originais direto dos servidores da Microsoft para substituir os corrompidos no seu PC.
        </p>
      `
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
