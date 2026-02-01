import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Consertando DLL Faltando: MSVCP140.dll, VCRUNTIME140.dll e DirectX";
const description = "Seu jogo não abre por falta de DLL? Entenda quais pacotes oficiais da Microsoft você precisa instalar para resolver erros de msvcp, d3dx9 e xinput.";
const keywords = ['msvcp140.dll faltando', 'vcruntime140.dll erro', 'd3dx9_43.dll download', 'instalar directx web setup', 'erro dll jogos'];

export const metadata: Metadata = createGuideMetadata('corrigir-dll-faltando-vcredist-directx', title, description, keywords);

export default function DLLGuide() {
    const summaryTable = [
        { label: "Erro msvcp/vcruntime", value: "Instalar Visual C++" },
        { label: "Erro d3dx9/xinput", value: "Instalar DirectX" }
    ];

    const contentSections = [
        {
            title: "Identificando o Pacote Necessário",
            content: `
        <table class="w-full text-left border-collapse my-6">
            <thead>
                <tr class="border-b border-gray-700 text-[#31A8FF]">
                    <th class="p-2">Nome do Erro</th>
                    <th class="p-2">O que Instalar</th>
                </tr>
            </thead>
            <tbody class="text-gray-300 text-sm">
                <tr class="border-b border-gray-800">
                    <td class="p-2">msvcp140.dll / vcruntime140.dll</td>
                    <td class="p-2">Visual C++ 2015-2022 Redistributable</td>
                </tr>
                 <tr class="border-b border-gray-800">
                    <td class="p-2">d3dx9_43.dll / xinput1_3.dll</td>
                    <td class="p-2">DirectX End-User Runtime Web Installer</td>
                </tr>
                 <tr class="border-b border-gray-800">
                    <td class="p-2">msvcr100.dll</td>
                    <td class="p-2">Visual C++ 2010 (x86 e x64)</td>
                </tr>
            </tbody>
        </table>
      `,
            subsections: []
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 minutos"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
