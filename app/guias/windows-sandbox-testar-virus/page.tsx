import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Windows Sandbox: Como Testar Programas Suspeitos sem Pegar Vírus";
const description = "Vai baixar um arquivo e não confia? Veja como ativar o Windows Sandbox, uma máquina virtual temporária que se autodestrói quando você fecha.";
const keywords = ['windows sandbox ativar', 'testar virus com segurança', 'maquina virtual temporaria windows', 'sandbox windows 11 home', 'abrir arquivo suspeito'];

export const metadata: Metadata = createGuideMetadata('windows-sandbox-testar-virus', title, description, keywords);

export default function SandboxGuide() {
    const summaryTable = [
        { label: "Requisito", value: "Windows Pro/Enterprise" },
        { label: "Segurança", value: "Total (Isolado)" }
    ];

    const contentSections = [
        {
            title: "Como Ativar",
            content: `
        <ol class="space-y-4 text-gray-300 list-decimal list-inside ml-4">
            <li>Pesquise por <strong>Ativar ou desativar recursos do Windows</strong>.</li>
            <li>Na lista, marque a caixinha <strong>Área Restrita do Windows</strong> (ou Windows Sandbox).</li>
            <li>Dê OK e reinicie o PC.</li>
            <li>Agora procure por "Windows Sandbox" no Iniciar. É um Windows novo, dentro do seu Windows. Tudo o que você fizer lá dentro, some quando fechar.</li>
        </ol>
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
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
