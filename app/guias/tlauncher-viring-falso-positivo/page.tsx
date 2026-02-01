import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "TLauncher tem Vírus? A Verdade sobre Spywares no Launcher Pirata (2026)";
const description = "Rumores dizem que o TLauncher instala um vírus espião no PC. Analisamos o código, revisamos o relatório de segurança e explicamos as alternativas seguras (Legacy/SK).";
const keywords = ['tlauncher tem virus', 'tlauncher spyware removedor', 'tlauncher é seguro 2026', 'sklauncher vs tlauncher', 'legacy launcher minecraft', 'baixar minecraft gratis seguro'];

export const metadata: Metadata = createGuideMetadata('tlauncher-viring-falso-positivo', title, description, keywords);

export default function TLauncherGuide() {
    const summaryTable = [
        { label: "Status", value: "Suspeito (Adware)" },
        { label: "Alternativa", value: "Legacy Launcher" },
        { label: "Alternativa 2", value: "SKlauncher" },
        { label: "Risco", value: "Médio" }
    ];

    const contentSections = [
        {
            title: "O Dossiê TLauncher",
            content: `
        <div class="bg-red-900/20 p-6 rounded-xl border border-red-500 mb-6">
            <h4 class="text-white font-bold mb-4">A Controvérsia de 2023</h4>
            <p class="text-gray-300 mb-4">
                Pesquisadores de segurança descobriram que o TLauncher (a versão russa famosa) modifica arquivos do Java no seu PC para exibir anúncios e coletar dados de uso. Embora não tenham encontrado um "keylogger" (roubador de senhas) explícito, o comportamento do software é classificado como <strong>Spyware/Adware</strong>.
            </p>
            <p class="text-gray-300">
                Além disso, eles roubaram o nome do launcher original (criado pelo turhat), forçando a remoção do verdadeiro TLauncher (agora chamado de Legacy Launcher) da internet.
            </p>
        </div>
      `,
            subsections: []
        },
        {
            title: "Alternativas Seguras e Open Source",
            content: `
        <p class="mb-4 text-gray-300">
            Não arrisque seus dados. Existem launchers piratas (Non-Premium) feitos pela comunidade open-source que são 100% limpos.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-indigo-900/20 p-4 rounded-xl border border-indigo-500">
                <h4 class="text-white font-bold mb-2">1. Legacy Launcher (O Original)</h4>
                <p class="text-gray-300 text-sm">
                    Este é o TLauncher original antes de ter a marca roubada. É leve, não tem anúncios e suporta todas as versões, skins e mods (Ely.by).
                    <br/><a href="#" class="text-indigo-400 underline">Pesquise: Legacy Launcher (llaun.ch)</a>
                </p>
            </div>
            <div class="bg-purple-900/20 p-4 rounded-xl border border-purple-500">
                <h4 class="text-white font-bold mb-2">2. SKlauncher</h4>
                <p class="text-gray-300 text-sm">
                    Visual moderno, suporta skins em alta resolução e capas. Código limpo e verificado pela comunidade. É o favorito atualmente.
                </p>
            </div>
        </div>
      `,
            subsections: []
        },
        {
            title: "Como desinstalar o TLauncher Corretamente",
            content: `
        <p class="mb-4 text-gray-300">
            Apenas deletar o ícone não resolve.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
            <li>Vá em <strong>Adicionar ou Remover Programas</strong> e desinstale-o.</li>
            <li>Aperte <strong>Win + R</strong>, digite <code>%appdata%</code>.</li>
            <li>Delete a pasta <code>.tlauncher</code> e <code>.minecraft</code> (Faça backup dos seus mundos na pasta 'saves' antes!).</li>
            <li>Baixe o <strong>Malwarebytes</strong> (versão gratuita) e faça uma varredura completa para garantir que nenhum resquício de adware ficou.</li>
        </ol>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
