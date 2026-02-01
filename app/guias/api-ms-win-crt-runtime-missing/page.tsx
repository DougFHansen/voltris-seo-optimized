import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Erro api-ms-win-crt-runtime-missing: Instale o Universal C Runtime (2026)";
const description = "Ao abrir um programa, aparece 'O programa não pode ser iniciado porque está faltando api-ms-win-crt-runtime-l1-1-0.dll'. Veja como instalar a atualização correta da Microsoft.";
const keywords = ['api-ms-win-crt-runtime-missing', 'erro dll faltando windows 7', 'atualizacao kb2999226', 'visual c++ 2015 erro', 'instalar universal c runtime'];

export const metadata: Metadata = createGuideMetadata('api-ms-win-crt-runtime-missing', title, description, keywords);

export default function APIGuide() {
    const summaryTable = [
        { label: "Erro", value: "KB2999226 Faltando" },
        { label: "Sistema", value: "Windows 7 / 8.1" },
        { label: "Solução", value: "Windows Update" },
        { label: "Pacote", value: "Visual C++ 2015" }
    ];

    const contentSections = [
        {
            title: "Você está usando Windows 7 sem atualizar?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Esse erro é exclusivo de quem usa Windows 7 ou 8.1 desatualizado. O arquivo <code>api-ms-win-crt-runtime</code> faz parte do "Universal C Runtime", uma tecnologia que a Microsoft lançou em 2015 para unificar o funcionamento de apps no Windows 10.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          Se você não tem esse arquivo, seu Windows está parado no tempo (antes de 2015).
        </p>
      `,
            subsections: []
        },
        {
            title: "Solução 1: Instalar a Atualização KB2999226 Manualmente",
            content: `
        <p class="mb-4 text-gray-300">
            A Microsoft disponibiliza um instalador standalone para isso.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Acesse o Catálogo do Microsoft Update ou pesquise no Google por <strong>"Download KB2999226"</strong> (Site oficial Microsoft).</li>
            <li>Baixe a versão para sua arquitetura:
                <br/>- x64 (Para Windows 64 bits).
                <br/>- x86 (Para Windows 32 bits).
            </li>
            <li>Execute o arquivo `.msu`.</li>
            <li>Reinicie o PC.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Solução 2: Visual C++ 2015-2022 (AIO)",
            content: `
        <p class="mb-4 text-gray-300">
            Muitas vezes, apenas instalar o pacote redistribuível resolve.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2">
            <li>Baixe o <strong>vc_redist.x64.exe</strong> e o <strong>vc_redist.x86.exe</strong> (Sim, instale os dois) no site da Microsoft.</li>
            <li>Se der erro na instalação dizendo "Falha na instalação", é porque seu Windows está MUITO desatualizado. Você precisará instalar o <strong>Service Pack 1 (SP1)</strong> do Windows 7 primeiro.</li>
        </ul>
      `
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
        />
    );
}
