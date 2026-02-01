import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "50 Atalhos de Navegador para Dobrar sua Produtividade - Voltris";
const description = "Pare de usar o mouse para tudo. Aprenda atalhos essenciais para Chrome, Edge e Firefox: reabrir abas fechadas, navegar entre guias e gerenciar favoritos.";
const keywords = ['atalhos chrome', 'atalhos teclado navegador', 'reabrir aba fechada', 'produtividade pc', 'edge atalhos'];

export const metadata: Metadata = createGuideMetadata('atalhos-navegador-produtividade', title, description, keywords);

export default function ShortcutsGuide() {
    const summaryTable = [
        { label: "Categoria", value: "Produtividade" },
        { label: "Nível", value: "Todos" }
    ];

    const contentSections = [
        {
            title: "Os 'Salva-Vidas' (Tem que decorar)",
            content: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div class="bg-[#121218] p-4 rounded border-l-4 border-[#31A8FF]">
                <code class="text-xl text-white font-bold block mb-2">Ctrl + Shift + T</code>
                <p class="text-gray-400 text-sm">Fechou uma aba sem querer? Ele reabre a última aba fechada. Funciona várias vezes seguidas.</p>
            </div>
             <div class="bg-[#121218] p-4 rounded border-l-4 border-[#31FF8B]">
                <code class="text-xl text-white font-bold block mb-2">Ctrl + L</code>
                <p class="text-gray-400 text-sm">Seleciona a barra de endereços para você digitar um site ou busca na hora.</p>
            </div>
            <div class="bg-[#121218] p-4 rounded border-l-4 border-[#FF4B6B]">
                <code class="text-xl text-white font-bold block mb-2">Ctrl + W</code>
                <p class="text-gray-400 text-sm">Fecha a aba atual instantaneamente.</p>
            </div>
             <div class="bg-[#121218] p-4 rounded border-l-4 border-yellow-400">
                <code class="text-xl text-white font-bold block mb-2">Ctrl + Shift + N</code>
                <p class="text-gray-400 text-sm">Abre uma janela de Navegação Anônima.</p>
            </div>
        </div>
      `,
            subsections: []
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="5 minutos"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
