import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Hollow Knight com Lag/Stutter? Instale o Mod 'HK Fix' e DXVK (2026)";
const description = "Mesmo sendo 2D, Hollow Knight engasga em PCs modernos? O problema é a Unity Engine limpando o lixo da memória. Veja como consertar.";
const keywords = ['hollow knight stutter fix', 'hollow knight travando pc', 'mod hk fix', 'lumafly hollow knight', 'hollow knight dxvk', 'unity garbage collection lag'];

export const metadata: Metadata = createGuideMetadata('hollow-knight-stuttering-fix-mod', title, description, keywords);

export default function HollowKnightGuide() {
    const summaryTable = [
        { label: "Problema", value: "Unity Garbage" },
        { label: "Solução", value: "Mod HK Fix" },
        { label: "API", value: "Vulkan (DXVK)" },
        { label: "VSync", value: "Desligar" }
    ];

    const contentSections = [
        {
            title: "Por que ele trava a cada 10 segundos?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Hollow Knight foi feito na Unity. A Unity tem um sistema automático de limpeza de memória (Garbage Collection). Quando essa limpeza roda, o jogo congela por 0.1 segundo. No meio de uma luta contra o Nightmare King Grimm, isso mata você.
        </p>
      `,
            subsections: []
        },
        {
            title: "Solução 1: Lumafly e HK Fix",
            content: `
        <p class="mb-4 text-gray-300">
            A comunidade criou um mod que otimiza isso.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 mb-6">
            <li>Baixe o <strong>Lumafly</strong> (É o gerenciador de mods do Hollow Knight).</li>
            <li>Abra o Lumafly e procure pelo mod <strong>"HK Fix"</strong> ou <strong>"Performance Fix"</strong>.</li>
            <li>Clique em Instalar.</li>
            <li>Inicie o jogo pelo Lumafly.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Solução 2: Forçar Vulkan (DXVK)",
            content: `
        <p class="mb-4 text-gray-300">
            A API DirectX 9 original do jogo é antiga. Usar o Vulkan resolve problemas de compatibilidade com placas novas (RTX 3000/4000).
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2">
            <li>Na Steam, clique direito no Jogo > Propriedades.</li>
            <li>Em "Opções de Inicialização", cole: <code>-force-vulkan</code></li>
            <li>Se o jogo não abrir, apague o comando e tente baixar as DLLs do <strong>DXVK</strong> e colocar na pasta do jogo.</li>
        </ul>
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
