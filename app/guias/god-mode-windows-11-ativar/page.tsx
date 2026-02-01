import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "God Mode no Windows 11: Ative Todas as Configurações Secretas";
const description = "Quer ter acesso a 200+ configurações do Windows numa pasta só? Aprenda a criar o atalho God Mode (Modo de Deus) na área de trabalho.";
const keywords = ['god mode windows 11', 'modo de deus windows', 'atalho configurações secretas', 'god mode code', 'painel controle avançado'];

export const metadata: Metadata = createGuideMetadata('god-mode-windows-11-ativar', title, description, keywords);

export default function GodModeGuide() {
    const contentSections = [
        {
            title: "O Código Mágico",
            content: `
        <ol class="space-y-4 text-gray-300 list-decimal list-inside ml-4">
            <li>Crie uma <strong>Nova Pasta</strong> na Área de Trabalho.</li>
            <li>Renomeie a pasta EXATAMENTE para este código:</li>
        </ol>
        <code class="bg-[#121218] p-3 text-yellow-400 block my-4 select-all">GodMode.{ED7BA470-8E54-465E-825C-99712043E01C}</code>
        <p class="text-gray-300">O ícone da pasta vai mudar para um ícone de controle. Abra e veja a mágica.</p>
      `,
            subsections: []
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="2 minutos"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
        />
    );
}
