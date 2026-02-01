import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Roblox: Guia Avançado para Desbloquear FPS (Acima de 60) e Reduzir Lag (2026)";
const description = "Cansado de jogar travado em 60 FPS? Aprenda a usar o Roblox FPS Unlocker, configurar o Bloxstrap e otimizar jogos pesados como Blox Fruits e Brookhaven.";
const keywords = ['roblox fps unlocker 2026', 'como tirar lag roblox', 'roblox acima de 60 fps', 'bloxstrap tutorial', 'otimizar roblox pc fraco', 'client settings roblox'];

export const metadata: Metadata = createGuideMetadata('roblox-fps-unlocker-tutorial', title, description, keywords);

export default function RobloxGuide() {
    const summaryTable = [
        { label: "Ferramenta", value: "Bloxstrap / FPS Unlocker" },
        { label: "Limite Padrão", value: "60 FPS (Travado)" },
        { label: "Limite Novo", value: "Ilimitado" },
        { label: "Gráficos", value: "Manual" }
    ];

    const contentSections = [
        {
            title: "Introdução: Por que o Roblox trava em 60 FPS?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            Por padrão, a engine do Roblox limita todos os jogadores a 60 quadros por segundo (FPS). Isso é feito para evitar bugs de física em jogos antigos. Porém, em 2026, com monitores de 144Hz comuns, esse limite é horrível e causa sensação de lentidão.
        </p>
      `,
            subsections: []
        },
        {
            title: "Método 1: Bloxstrap (A Melhor Solução Moderna)",
            content: `
        <p class="mb-4 text-gray-300">
            O Bloxstrap é um substituto open-source e seguro para o launcher padrão do Roblox. Ele já vem com tudo embutido.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Baixe o <strong>Bloxstrap</strong> no GitHub oficial (pizzaboxer/bloxstrap).</li>
            <li>Instale e abra o menu.</li>
            <li>Vá em <strong>Fast Flags</strong>.</li>
            <li>Procure por <strong>Framerate Limit</strong> e coloque <strong>9999</strong> ou a frequência do seu monitor (ex: 165).</li>
            <li>Selecione também o "Rendering Mode" para <strong>D3D11</strong> ou <strong>Vulkan</strong> (Vulkan costuma ser melhor em PCs fracos).</li>
            <li>Pronto! Abra o Roblox pelo atalho do Bloxstrap e voe.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Método 2: rbxfpsunlocker (Clássico)",
            content: `
        <p class="mb-4 text-gray-300">
            Se você não quer trocar de launcher, use o desbloqueador clássico.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2">
            <li>Baixe o <strong>rbxfpsunlocker</strong> (axstin) no GitHub.</li>
            <li>Extraia o arquivo.</li>
            <li>Execute o <code>rbxfpsunlocker.exe</code> antes de abrir o jogo.</li>
            <li>Ele vai ficar minimizado na bandeja do sistema. Clique com botão direito nele > FPS Cap > None.</li>
            <li>Nota: A cada atualização do Roblox, ele pode parar de funcionar por 1 dia até ser atualizado.</li>
        </ul>
      `
        },
        {
            title: "3. Configurações Gráficas Corretas (In-Game)",
            content: `
            <p class="mb-4 text-gray-300">
                Nunca deixe os gráficos no "Automático". O Roblox é péssimo em adivinhar a força do seu PC.
            </p>
            <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
                <li>Entre no jogo.</li>
                <li>Aperte ESC > Configurações.</li>
                <li>Mude "Modo de Gráficos" para <strong>Manual</strong>.</li>
                <li>Observe a barra de qualidade:
                    <br/>- <strong>1 a 3 barrinhas:</strong> Remove sombras e luzes complexas. (Ideal para PvP).
                    <br/>- <strong>8 a 10 barrinhas:</strong> Ativa a renderização distante.
                </li>
            </ol>
            <p class="text-green-400 mt-2 bg-gray-800 p-2 rounded">
                Dica Pro: Use 2 ou 3 barrinhas em jogos competitivos (Bed Wars, Arsenal) para ver através de algumas paredes finas e remover fumaça.
            </p>
        `
        },
        {
            title: "4. ClientSettings (Otimização Avançada)",
            content: `
            <p class="text-gray-300 mb-4">
                Você pode criar uma pasta chamada <code>ClientSettings</code> dentro da pasta de versões do Roblox para forçar configurações.
            </p>
            <p class="text-gray-300">
                Dentro dela, crie um arquivo <code>ClientAppSettings.json</code> com códigos FFlag para desativar texturas. (O Bloxstrap já faz isso visualmente, recomendo usar ele).
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
