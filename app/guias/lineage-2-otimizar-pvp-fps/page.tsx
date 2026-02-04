import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Lineage 2: Como aumentar o FPS em PVP e Cidades (2026)";
const description = "Sofrendo com 10 FPS nas cidades do Lineage 2? Aprenda a otimizar o motor antigo do L2 para rodar fluido em Mass PVPs e Cercos de Castelo.";
const keywords = [
    'lineage 2 aumentar fps pvp tutorial 2026',
    'como reduzir lag lineage 2 interlude high five',
    'otimização engine lineage 2 pc moderno fix',
    'melhorar desempenho l2 mass pvp castle siege',
    'limpar arquivos desnecessários pasta lineage 2'
];

export const metadata: Metadata = createGuideMetadata('lineage-2-otimizar-pvp-fps', title, description, keywords);

export default function L2OtimizacaoGuide() {
    const summaryTable = [
        { label: "Motor Gráfico", value: "Unreal Engine 2.5 (Altamente CPU-bound)" },
        { label: "Solução #1", value: "Desativar Nomes e Títulos (Alt + L)" },
        { label: "Solução #2", value: "Ajuste de Cache no L2.ini" },
        { label: "Dificuldade", value: "Média" }
    ];

    const contentSections = [
        {
            title: "O desafio de rodar um motor de 2003 em 2026",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **Lineage 2** foi construído sobre uma versão modificada da Unreal Engine 2.5. O maior problema desse motor gráfico é que ele não sabe usar múltiplos núcleos do processador nem o poder das placas de vídeo modernas. Em 2026, mesmo com uma CPU de última geração, você terá quedas de FPS em cidades cheias como Giran ou Aden se não fizer os ajustes coretos nos arquivos do jogo.
        </p>
      `
        },
        {
            title: "1. Limpeza de Interface no Mass PVP",
            content: `
        <p class="mb-4 text-gray-300">O que mais pesa no L2 não são os modelos 3D, mas sim o texto na tela:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Alt + L:</strong> Esconde os nomes dos jogadores e NPCs. Em um cerco de castelo, isso pode dobrar seu FPS instantaneamente.</li>
            <li><strong>Lower Detail:</strong> No menu de opções, carregue o 'Minimum' para texturas de terreno. A geometria do L2 é o que causa o "freeze" (travamento) ao girar a câmera.</li>
            <li><strong>Limitador de Personagem:</strong> Ajuste a barra de <i>PC Limit</i> para o mínimo em áreas lotadas. O jogo deixará de renderizar personagens distantes que você não precisa ver.</li>
        </ul >
      `
        },
        {
            title: "2. Otimização do arquivo L2.ini",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Ajuste de Memória:</h4>
            <p class="text-sm text-gray-300">
                O L2 vem configurado de fábrica para usar apenas 32MB de cache, o que é ridículo para 2026. <br/><br/>
                Usando um editor de arquivos <code>.ini</code> (decodificador L2), procure por <strong>CacheSizeMegs</strong>. Mude de 32 para 256 ou 512. Isso reduzirá drasticamente aquelas "travadinhas" de 1 segundo que acontecem quando você corre pelo mapa e o jogo tenta carregar novos assets.
            </p>
        </div>
      `
        },
        {
            title: "3. Prioridade de Processo e SSD",
            content: `
        <p class="mb-4 text-gray-300">
            O Lineage 2 lê arquivos constantemente. 
            <br/><br/><strong>Dica:</strong> É obrigatório que o jogo esteja em um <strong>SSD NVMe</strong>. Em HDs mecânicos, o tempo de busca dos arquivos na pasta <code>StaticMeshes</code> é lento demais, resultando em personagens invisíveis por vários segundos após teletransportes. Além disso, defina a prioridade do <code>l2.exe</code> para 'Tempo Real' ou 'Alta' no Gerenciador de Tarefas.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/mu-online-reduzir-lag-muvoltris",
            title: "Mu Online Fix",
            description: "Dicas para outros MMORPGs clássicos."
        },
        {
            href: "/guias/reduzir-ping-jogos-online",
            title: "Reduzir Ping",
            description: "Melhore o tempo de resposta das skills."
        },
        {
            href: "/guias/otimizacao-performance",
            title: "Performance CPU",
            description: "Ajuste o Windows para jogos de núcleo único."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
