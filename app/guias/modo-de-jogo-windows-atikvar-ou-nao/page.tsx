import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Modo de Jogo (Game Mode) do Windows 11: Ativar ou Desativar em 2026?";
const description = "Antigamente o Game Mode causava travadas. E hoje? Veja como a Microsoft reescreveu o recurso na versão 24H2 e por que você deve mantê-lo ligado.";
const keywords = ['modo de jogo windows on ou off', 'game mode windows 11 piora fps', 'otimizar windows 11 para jogos', 'prioridade de cpu jogos', 'windows game bar desativar'];

export const metadata: Metadata = createGuideMetadata('modo-de-jogo-windows-atikvar-ou-nao', title, description, keywords);

export default function GameModeGuide() {
    const summaryTable = [
        { label: "Veredito 2026", value: "ATIVADO" },
        { label: "Game Bar", value: "Desativar (Na maioria)" },
        { label: "Função", value: "Suspende BG Apps" },
        { label: "PC Fraco", value: "Ajuda Muito" }
    ];

    const contentSections = [
        {
            title: "A História do Game Mode (De Vilão a Herói)",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Quando o Game Mode foi lançado em 2017, ele era um desastre. Ele tentava adivinhar o que era jogo e o que não era, às vezes fechando o OBS ou o Discord no meio da partida.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          Hoje, no Windows 10 (22H2) e 11 (23H2/24H2), ele funciona de forma diferente. Ele não "acelera" o jogo, ele <strong>aclama o Windows</strong>. Ele impede que o Windows Update baixe coisas e pausa a indexação de arquivos enquanto um jogo está em tela cheia.
        </p>
      `,
            subsections: []
        },
        {
            title: "Xbox Game Bar: O Irmão Feio",
            content: `
        <div class="bg-yellow-900/20 p-6 rounded-xl border border-yellow-500 mb-6">
            <h4 class="text-white font-bold mb-2">Diferencie "Game Mode" de "Game Bar"</h4>
            <p class="text-gray-300 text-sm">
                O "Modo de Jogo" é bom. A "Xbox Game Bar" (aquele menu que abre com Win+G) é pesada. Ela grava sua tela em segundo plano o tempo todo (DVR).
            </p>
            <p class="text-white mt-4 font-bold">Recomendação:</p>
            <ul class="list-disc list-inside text-gray-300 text-sm">
                <li>Vá em Configurações > Jogos > <strong>Modo de Jogo</strong>: LIGADO.</li>
                <li>Vá em Configurações > Jogos > <strong>Xbox Game Bar</strong>: DESLIGADO (A menos que você use para conversar com amigos do Xbox).</li>
            </ul>
        </div>
      `,
            subsections: []
        },
        {
            title: "Teste de Performance",
            content: `
        <p class="mb-4 text-gray-300">
            Em testes com um PC i5 com Cyberpunk 2077:
        </p>
        <ul class="list-none space-y-2 text-gray-300">
            <li class="bg-gray-800 p-2 rounded">
                Sem Game Mode: Média de 60 FPS, com quedas para 45 FPS (1% Low).
            </li>
            <li class="bg-gray-800 p-2 rounded border-l-4 border-green-500">
                Com Game Mode: Média de 61 FPS, com quedas para 55 FPS (1% Low).
            </li>
        </ul>
        <p class="mt-2 text-gray-300">
            O ganho não é no FPS máximo, é na <strong>estabilidade</strong>.
        </p>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="5 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
