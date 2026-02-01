import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Fortnite com Texturas não carregando? Desative o Cosmetic Streaming (2026)";
const description = "Se o seu Fortnite fica com gráficos de massinha/borrados e caindo FPS, o culpado é o 'Streaming de Cosméticos'. Aprenda a baixar as texturas completas para resolver.";
const keywords = ['fortnite texturas nao carregam', 'fortnite grafico massinha', 'desativar cosmetic streaming epic games', 'fortnite travando texturas', 'baixar texturas hd fortnite', 'packet loss fortnite fix'];

export const metadata: Metadata = createGuideMetadata('fortnite-texturas-nao-carregam-streaming', title, description, keywords);

export default function FortniteTextureGuide() {
    const summaryTable = [
        { label: "Problema", value: "Textura Borrada" },
        { label: "Causa", value: "Download em Partida" },
        { label: "Solução", value: "Pré-Download" },
        { label: "Espaço Extra", value: "+10 GB" }
    ];

    const contentSections = [
        {
            title: "O que é 'Cosmetic Streaming'?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Para diminuir o tamanho do jogo (que estava gigante), a Epic Games decidiu não instalar as skins dos inimigos no seu PC. Em vez disso, o jogo <strong>baixa a skin do inimigo da internet no momento em que você encontra ele</strong>.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          O resultado? Se sua internet oscilar, o inimigo fica invisível ou com textura de "massinha". E seu HD fica em 100% tentando salvar o arquivo, causando travadas.
        </p>
      `,
            subsections: []
        },
        {
            title: "Como Corrigir (Obrigatório para PC Fraco)",
            content: `
        <p class="mb-4 text-gray-300">
            Vamos forçar o jogo a baixar tudo de uma vez.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Abra o <strong>Epic Games Launcher</strong>.</li>
            <li>Vá na sua <strong>Biblioteca</strong>.</li>
            <li>Ache o Fortnite, clique nos <strong>3 pontinhos (...)</strong> e depois em <strong>Opções</strong>.</li>
            <li>Marque a caixa: <strong>"Pré-download de recursos transmitidos" (Pre-Download Streamed Assets)</strong>.</li>
            <li>Clique em aplicar.</li>
        </ol>
        <p class="text-white mt-4 font-bold bg-green-900/20 p-4 rounded">
            O jogo vai baixar cerca de 6GB a 15GB adicionais. Depois disso, ele nunca mais vai baixar skins durante a partida. Seu FPS vai estabilizar e as texturas vão carregar na hora.
        </p>
      `,
            subsections: []
        },
        {
            title: "Dica Extra: Texturas em Alta Resolução",
            content: `
        <p class="text-gray-300 mb-4">
            Ainda na mesma tela de Opções, certifique-se de que <strong>"Texturas de Alta Resolução"</strong> esteja DESMARCADO.
        </p>
        <p class="text-gray-300">
            Isso economiza mais 20GB de espaço e evita lag em PCs com pouca VRAM. Texturas HD só servem para quem joga em 4K.
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
