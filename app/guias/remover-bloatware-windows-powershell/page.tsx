import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Remover Bloatware do Windows 10/11: Script PowerShell para PC Mais Leve (2026)";
const description = "Seu Windows veio cheio de lixo (Xbox, Clima, Notícias)? Use este comando seguro do PowerShell para desinstalar apps nativos que não saem pelo Painel de Controle.";
const keywords = ['remover bloatware windows 11', 'desinstalar xbox game bar powershell', 'debloater windows 2026', 'script limpeza windows 10', 'pc lento cheio de programas', 'remover cortana'];

export const metadata: Metadata = createGuideMetadata('remover-bloatware-windows-powershell', title, description, keywords);

export default function BloatwareGuide() {
    const summaryTable = [
        { label: "Ferramenta", value: "PowerShell" },
        { label: "Método", value: "Winget / Script" },
        { label: "Risco", value: "Baixo" },
        { label: "Ganha FPS?", value: "Libera RAM" }
    ];

    const contentSections = [
        {
            title: "O que é Bloatware?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          São aplicativos pré-instalados pela Microsoft ou pela fabricante do PC (Dell, HP) que você nunca usa, mas que ficam rodando em segundo plano consumindo RAM e enviando dados. Exemplos: "Vincular ao Telefone", "Cortana", "Dicas", "Hub de Comentários".
        </p>
      `,
            subsections: []
        },
        {
            title: "Método Moderno: Win10Debloater (GUI)",
            content: `
        <p class="mb-4 text-gray-300">
            A comunidade criou uma ferramenta com interface gráfica que facilita tudo. Não precisa digitar códigos complexos.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Abra o <strong>PowerShell</strong> como Administrador.</li>
            <li>Copie e cole este comando mágico:</li>
        </ol>
        <div class="bg-black border border-gray-700 p-4 rounded-lg mt-4 mb-4 font-mono text-blue-400 text-sm break-all">
            iwr -useb https://git.io/debloat | iex
        </div>
        <p class="text-gray-300">
            Vai abrir uma janela. Clique em:
            <br/>1. <strong>"Remove All Bloatware"</strong> (Remove o lixo seguro).
            <br/>2. <strong>"Disable Cortana"</strong> (Mata a assistente).
            <br/>3. <strong>"Stop Edge PDF Takeover"</strong> (Impede o Edge de roubar seus PDFs).
        </p>
      `,
            subsections: []
        },
        {
            title: "Método Manual (Se você tem medo de scripts)",
            content: `
        <p class="text-gray-300 mb-4">
            Você pode remover um por um usando o comando <code>Get-AppxPackage</code>.
        </p>
        <div class="bg-gray-800 p-4 rounded text-sm text-gray-300 space-y-2">
            <p><strong class="text-white">Remover Xbox:</strong><br/><code>Get-AppxPackage *xbox* | Remove-AppxPackage</code></p>
            <p><strong class="text-white">Remover Clima/Notícias:</strong><br/><code>Get-AppxPackage *bingweather* | Remove-AppxPackage</code></p>
            <p><strong class="text-white">Remover Calculadora (Cuidado):</strong><br/><code>Get-AppxPackage *calc* | Remove-AppxPackage</code></p>
        </div>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
