import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Windows 11 Debloat: Remova Apps Inúteis e Ganhe Velocidade - Voltris";
const description = "Script e tutorial para remover bloatware, telemetria e apps pré-instalados do Windows 11 com segurança. Deixe seu PC mais leve.";
const keywords = ['debloat windows 11', 'remover bloatware', 'windows 11 lento', 'otimizar windows 11', 'remover cortana', 'desativar telemetria'];

export const metadata: Metadata = createGuideMetadata('debloating-windows-11', title, description, keywords);

export default function DebloatGuide() {
    const summaryTable = [
        { label: "Dificuldade", value: "Intermediário" },
        { label: "Risco", value: "Médio" },
        { label: "Ganho de RAM", value: "~1.5 GB" }
    ];

    const contentSections = [
        {
            title: "O que é Bloatware?",
            content: `
        <p class="mb-4">Bloatware são os softwares que vêm pré-instalados no Windows 11 que você nunca usa (Notícias, Xbox Game Bar, Clima, Cortana, TikTok, etc). Eles rodam em segundo plano e consomem sua RAM e internet.</p>
      `,
            subsections: []
        },
        {
            title: "Método 1: O Caminho Fácil (PowerShell)",
            content: `
        <p class="mb-4">Existe uma comunidade incrível no GitHub que cria scripts confiáveis para isso. O mais famoso é do Chris Titus Tech.</p>
        <ol class="space-y-4 text-gray-300 list-decimal list-inside ml-4">
          <li>Clique com botão direito no Menu Iniciar > <strong>Terminal (Admin)</strong> ou PowerShell (Admin).</li>
          <li>Copie e cole este comando: <code class="bg-[#121218] p-1 text-[#31FF8B]">iwr -useb https://christitus.com/win | iex</code> e dê Enter.</li>
          <li>Uma janela gráfica vai abrir. Vá na aba "Tweaks".</li>
          <li>Recomendamos marcar "Laptop" ou "Desktop" (dependendo do seu PC) e clicar em "Run Tweaks".</li>
        </ol>
        <div class="bg-red-900/20 border-l-4 border-red-500 p-4 my-4">
          <p class="text-red-400 font-bold text-sm">Aviso</p>
          <p class="text-gray-300 text-sm">Isso pode remover a Loja do Windows ou o Xbox se você selecionar a opção errada. Leia antes de clicar.</p>
        </div>
      `
        }
    ];

    const relatedGuides = [
        { href: "/guias/otimizacao-ssd-windows-11", title: "Otimização de SSD", description: "Combine o debloat com ajustes de SSD." }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 minutos"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            relatedGuides={relatedGuides}
            summaryTable={summaryTable}
        />
    );
}
