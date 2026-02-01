import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Genshin Impact travando no PC? Correção de Stuttering e Desbloqueio de FPS (2026)";
const description = "Seu Genshin congela a cada 10 segundos? Aprenda a corrigir o Shader Compilation Stutter e como desbloquear o FPS acima de 60 com segurança.";
const keywords = ['genshin impact stuttering fix', 'genshin fps unlocker 2026 ban', 'genshin travando pc gamer', 'dx11 shader cache genshin', 'otimizar genshin impact pc fraco', 'melhores graficos genshin'];

export const metadata: Metadata = createGuideMetadata('genshin-impact-stuttering-fix-pc', title, description, keywords);

export default function GenshinGuide() {
    const summaryTable = [
        { label: "Limite Padrão", value: "60 FPS" },
        { label: "Tool", value: "Genshin FPS Unlocker" },
        { label: "Risco", value: "Baixíssimo" },
        { label: "Stutter Fix", value: "DX11 Cache" }
    ];

    const contentSections = [
        {
            title: "O Problema do Stuttering (Travadinhas)",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Genshin Impact no PC sofre de um problema crônico: ele compila os efeitos visuais (shaders) na hora que eles aparecem, em vez de carregar antes. Isso causa uma micro-travada na primeira vez que você usa uma ult ou vê um inimigo novo.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          <strong>Solução:</strong> Infelizmente, a única solução real é jogar. Depois de uns 20 minutos rodando pelo mapa, o cache é criado e o jogo fica liso. Mas você pode acelerar isso garantindo que seu driver de vídeo tenha o "Shader Cache" configurado para ILIMITADO no painel da NVIDIA.
        </p>
      `,
            subsections: []
        },
        {
            title: "Como Desbloquear FPS (Acima de 60)",
            content: `
        <p class="mb-4 text-gray-300">
            A HoYoverse teima em travar o jogo em 60 FPS, mesmo em PCs de R$ 20.000.
        </p>
        <div class="bg-gray-800 p-6 rounded-xl border border-purple-500 mb-6">
            <h4 class="text-white font-bold mb-2">Genshin Impact FPS Unlocker</h4>
            <p class="text-gray-300 text-sm mb-2">
                Existe uma ferramenta open-source no GitHub (34736384/genshin-fps-unlocker) que injeta código na memória para liberar o limite.
            </p>
            <p class="text-yellow-400 text-sm font-bold">
                Isso dá ban?
            </p>
            <p class="text-gray-300 text-sm">
                Em 4 anos de existência da ferramenta, <strong>zero</strong> contas foram banidas por usá-la. A HoYoverse parece tolerar, desde que não seja cheat (god mode, damage hack). Mas use por sua conta e risco.
            </p>
        </div>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
            <li>Baixe o unlocker.</li>
            <li>Abra o jogo.</li>
            <li>Abra o unlocker como Administrador.</li>
            <li>Defina o alvo (ex: 144 FPS).</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Configuração Gráfica Otimizada",
            content: `
        <ul class="list-disc list-inside text-gray-300 space-y-2">
            <li><strong>Render Resolution:</strong> 1.0 (Nativo) ou 0.8 (PC Fraco).</li>
            <li><strong>Shadow Quality:</strong> Low (Médio/Alto consome MUITA CPU).</li>
            <li><strong>Visual Effects:</strong> Medium.</li>
            <li><strong>SFX Quality:</strong> Low.</li>
            <li><strong>Volumetric Fog:</strong> OFF (Desligue a neblina, ganha 10 FPS e clareia a visão).</li>
            <li><strong>Motion Blur:</strong> OFF (Sempre).</li>
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
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
