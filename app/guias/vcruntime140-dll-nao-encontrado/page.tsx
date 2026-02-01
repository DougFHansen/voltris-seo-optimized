import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Erro VCRUNTIME140.dll e MSVCP140.dll não encontrado: Solução Rápida (2026)";
const description = "Ao abrir GTA V, The Sims 4 ou Office, aparece 'VCRUNTIME140.dll está faltando'. Não baixe DLLs soltas! Veja como instalar o pacote oficial Visual Studio 2015-2022.";
const keywords = ['vcruntime140.dll missing', 'msvcp140.dll nao encontrado', 'baixar vcruntime140.dll', 'erro the sims 4 dll', 'visual c++ 2015-2022 download'];

export const metadata: Metadata = createGuideMetadata('vcruntime140-dll-nao-encontrado', title, description, keywords);

export default function VCRuntimeGuide() {
    const summaryTable = [
        { label: "Arquivos", value: "VCRUNTIME140 / MSVCP140" },
        { label: "Solução", value: "Instalador Oficial" },
        { label: "Perigo", value: "Sites de DLL" },
        { label: "Versão", value: "x86 + x64" }
    ];

    const contentSections = [
        {
            title: "Por que esse erro é tão comum?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Essas duas DLLs são bibliotecas básicas da linguagem C++ usada para criar a maioria dos jogos e programas modernos. Se você formatou o PC recentemente, elas não vêm instaladas por padrão.
        </p>
        <div class="bg-red-900/20 p-6 rounded-xl border border-red-500 mb-6">
            <h4 class="text-white font-bold mb-2">⚠ NÃO BAIXE O ARQUIVO .DLL SOLTO!</h4>
            <p class="text-gray-300 text-sm">
                Sites como "dll-files.com" oferecem o arquivo solto. Se você baixar e colocar na pasta System32, você vai criar o erro "0xc00007b" (que é muito pior de resolver). As DLLs precisam ser registradas no sistema pelo instalador oficial.
            </p>
        </div>
      `,
            subsections: []
        },
        {
            title: "A Solução Certa (Instalador Unificado)",
            content: `
        <p class="mb-4 text-gray-300">
            A Microsoft facilitou nossa vida e criou um único instalador que contém as bibliotecas de 2015, 2017, 2019 e 2022.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 mb-6">
            <li>Pesquise no Google: <strong>"Visual C++ Redistributable latest supported downloads"</strong>.</li>
            <li>Entre no primeiro link (learn.microsoft.com).</li>
            <li>Baixe DOIS arquivos:
                <ul class="list-disc list-inside ml-6 mt-2 text-green-400 font-mono text-sm">
                    <li>vc_redist.x86.exe</li>
                    <li>vc_redist.x64.exe</li>
                </ul>
            </li>
        </ol>
        <p class="text-gray-300 border-l-4 border-yellow-500 pl-4 bg-yellow-900/20 p-2">
            <strong>"Mas meu Windows é 64 bits, preciso do x86?"</strong>
            <br/>SIM! Muitos jogos (como LoL e GTA V) são aplicativos de 32 bits (x86), mesmo rodando num Windows 64 bits. Eles precisam da versão x86 instalada. Instale ambos.
        </p>
      `,
            subsections: []
        },
        {
            title: "Passo Extra: Reparar Instalação",
            content: `
        <p class="text-gray-300">
            Se você já tem instalado e o erro continua:
            <br/>1. Baixe os instaladores acima.
            <br/>2. Execute-os.
            <br/>3. Em vez de "Instalar", clique no botão <strong>REPARAR</strong>.
        </p>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="5 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
