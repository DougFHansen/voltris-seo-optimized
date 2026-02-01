import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Roblox Tela Branca, Travando ou Fechando Sozinho? Correção Definitiva (2026)";
const description = "Seu Roblox abre, fica com a tela branca/cinza e fecha? O problema pode ser o cache do navegador, driver de vídeo ou conflito com MSI Afterburner e RTSS.";
const keywords = ['roblox tela branca fix', 'roblox fechando sozinho pc', 'roblox nao carrega', 'limpar cache roblox appdata', 'roblox crash fix 2026', 'rtss crash roblox'];

export const metadata: Metadata = createGuideMetadata('roblox-tela-branca-travada-fix', title, description, keywords);

export default function RobloxCrashGuide() {
    const summaryTable = [
        { label: "Erro", value: "Tela Branca/Crash" },
        { label: "Culpado 1", value: "Cache Corrompido" },
        { label: "Culpado 2", value: "RTSS / Overlays" },
        { label: "Solução", value: "Limpeza Limpa" }
    ];

    const contentSections = [
        {
            title: "Solução 1: O Conflito com Overlays (RTSS/Discord)",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          O novo anti-cheat do Roblox (Hyperion/Byfron) de 64 bits odeia programas que "desenham" em cima da tela.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-6">
            <li>Se você usa <strong>MSI Afterburner / RivaTuner (RTSS)</strong>: Feche-os completamente.</li>
            <li>Se você usa <strong>Discord Overlay</strong>: Desative nas configurações.</li>
            <li>Se você usa <strong>GeForce Experience</strong>: Desative o overlay.</li>
        </ul>
        <p class="text-gray-300">
            Tente abrir o jogo. Se funcionou, o problema era esse.
        </p>
      `,
            subsections: []
        },
        {
            title: "Solução 2: Limpeza Profunda do Cache",
            content: `
        <p class="mb-4 text-gray-300">
            Às vezes os arquivos temporários do Roblox corrompem. Vamos apagar tudo.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Aperte <strong>Win + R</strong>.</li>
            <li>Digite <code>%localappdata%</code> e dê Enter.</li>
            <li>Encontre a pasta <strong>Roblox</strong> e delete-a inteira. (Calma, sua conta está salva no servidor, você só vai ter que logar de novo).</li>
            <li>Aperte Win + R de novo. Digite <code>%temp%</code> e delete tudo que tiver o nome "Roblox".</li>
            <li>Reinstale o Roblox baixando do site oficial.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Solução 3: Driver de Vídeo (Tela Cinza)",
            content: `
        <p class="text-gray-300">
            Se a tela fica cinza e você ouve o som do jogo, seu driver de vídeo está desatualizado.
            <br/>Atualize seus drivers da Intel/AMD/NVIDIA. Se sua placa for muito antiga (Intel HD Graphics 2000/3000), infelizmente o Roblox parou de suportar muitas delas em 2025.
        </p>
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
