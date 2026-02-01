import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "League of Legends: Guia Completo para Corrigir Queda de FPS e Travamento (2026)";
const description = "Seu LoL está travando nas teamfights? Aprenda a configurar o modo DX9 Legacy, otimizar o Cliente Riot e usar a Reparação Hextech para estabilizar seu FPS.";
const keywords = ['lol fps drop fix', 'aumentar fps league of legends', 'lol travando teamfight', 'modo dx9 legacy lol', 'cliente lol lento', 'otimizar cliente riot'];

export const metadata: Metadata = createGuideMetadata('league-of-legends-fps-drop-fix', title, description, keywords);

export default function LoLGuide() {
    const summaryTable = [
        { label: "Cliente", value: "Modo Leve" },
        { label: "DX9 Legacy", value: "Ativado" },
        { label: "Tela", value: "Sem Moldura" },
        { label: "Sons", value: "Desativados" }
    ];

    const contentSections = [
        {
            title: "Introdução: Otimização do LoL",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            League of Legends deveria rodar em qualquer calculadora, mas o spaghetti code da Riot faz com que PCs gamers sofram quedas de FPS brutais durante teamfights. Vamos resolver isso atacando as duas frentes: O Cliente (Lobby) e o Jogo (In-Game).
        </p>
      `,
            subsections: []
        },
        {
            title: "1. Otimizando o Cliente Riot (Lobby)",
            content: `
        <p class="mb-4 text-gray-300">O cliente do LoL é feito em Chromium (como um navegador web) e consome muita CPU, mesmo quando o jogo já começou.</p>
        
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Abra o Cliente e faça login.</li>
            <li>Clique na engrenagem (Configurações) no canto superior direito.</li>
            <li>Na aba <strong>Geral</strong>, marque:
                <ul class="list-disc list-inside ml-6 mt-2 text-green-400">
                    <li>[x] Habilitar modo de Configuração Leve.</li>
                    <li>[x] Fechar cliente durante as partidas. (Isso é OBRIGATÓRIO para PC fraco. Libera uns 500MB de RAM e 10% de CPU).</li>
                </ul>
            </li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "2. Configurações In-Game (Vídeo e Som)",
            content: `
        <p class="mb-4 text-gray-300">Dentro de uma partida (use o modo Treino):</p>
        
        <h3 class="text-xl text-[#31A8FF] font-bold mt-6 mb-4">2.1 Vídeo</h3>
        <ul class="list-disc list-inside text-gray-300 space-y-2">
            <li><strong>Resolução:</strong> Use a nativa do monitor.</li>
            <li><strong>Modo de Tela:</strong> <span class="text-yellow-400">Sem Moldura (Borderless)</span> costuma ser mais estável no LoL para Alt-Tab, mas <span class="text-green-400">Tela Cheia</span> dá mais FPS puro. Teste os dois.</li>
            <li><strong>Anti-Aliasing:</strong> Desligado.</li>
            <li><strong>Aguardar Sincronização Vertical:</strong> Desligado.</li>
            <li><strong>Limite de FPS:</strong> 144 (Se seu monitor for 144Hz) ou Ilimitado. Alguns PCs antigos rodam melhor travado em 60 ou 80 FPS para evitar superaquecimento.</li>
        </ul>

        <h3 class="text-xl text-[#31A8FF] font-bold mt-6 mb-4">2.2 Áudio (Dica Secreta)</h3>
        <p class="text-gray-300 mb-2">Parece mentira, mas o motor de áudio do LoL causa lag.</p>
        <p class="text-gray-300">Vá em Áudio e clique em <strong>"Desabilitar todos os sons"</strong> se você estiver realmente desesperado por performance. Se não, pelo menos desabilite a <span class="text-yellow-400">Música</span> e o <span class="text-yellow-400">Ambiente</span>.</p>
      `
        },
        {
            title: "3. O Truque do Modo DX9 Legacy",
            content: `
            <p class="mb-4 text-gray-300">
                O LoL atualizou para DX11 recentemente, o que causou problemas em placas antigas. Você pode forçar o modo antigo.
            </p>
            <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
                <li>Vá na pasta Config do LoL (geralmente <code>C:\\Riot Games\\League of Legends\\Config</code>).</li>
                <li>Abra o arquivo <strong>game.cfg</strong> com Bloco de Notas.</li>
                <li>Adicione a seguinte linha na seção <code>[General]</code>:</li>
            </ol>
            <code class="block bg-[#121218] p-3 my-4 text-green-400 font-mono text-center">RefererDx9LegacyMode=1</code>
            <p class="text-gray-300 text-sm">
                Isso força o jogo a usar o DirectX 9. Se o jogo parar de abrir, apague a linha.
            </p>
        `
        },
        {
            title: "4. Reparação Hextech (Corrigir Arquivos)",
            content: `
            <p class="mb-4 text-gray-300">
                A cada atualização, arquivos sobram e causam conflito.
            </p>
            <ul class="list-disc list-inside text-gray-300">
                <li>Baixe a <strong>Ferramenta de Reparo Hextech</strong> oficial da Riot.</li>
                <li>Marque as opções "Reinstalar Patch" e "Limpar Firewall".</li>
                <li>Inicie a reparação. Isso resolve 90% dos crashs misteriosos.</li>
            </ul>
        `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
