import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "GTA IV: Como resolver o Lag e Stuttering (Complete Edition 2026)";
const description = "O GTA 4 roda mal no seu PC potente? Aprenda a usar o DXVK e o FusionFix para transformar o port mal otimizado em um jogo fluido e moderno.";
const keywords = [
    'como rodar gta iv sem lag no pc 2026',
    'gta iv complete edition lag fix dxvk tutorial',
    'melhorar fps gta 4 pc workstation laptop',
    'gta iv stuttering fix windows 11 low fps',
    'comandos commandline.txt gta iv otimização'
];

export const metadata: Metadata = createGuideMetadata('gta-iv-complete-edition-lag-fix', title, description, keywords);

export default function GTAIVLagFixGuide() {
    const summaryTable = [
        { label: "Solução Milagrosa", value: "DXVK (Vulkan Translation Layer)" },
        { label: "Correção de Bugs", value: "GTA IV FusionFix" },
        { label: "Check de Memória", value: "-availablevidmem (Commandline)" },
        { label: "Dificuldade", value: "Média" }
    ];

    const contentSections = [
        {
            title: "O Pior Port da Rockstar na História",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Lançado em 2008, o GTA IV nunca foi devidamente corrigido para os PCs modernos. Mesmo com uma RTX 4090, o jogo pode apresentar quedas de FPS para menos de 30 e travamentos (stuttering) constantes. Isso acontece porque o jogo usa uma versão primitiva do DirectX 9 que não sabe como conversar com os drivers atuais de 2026. A solução não está em diminuir os gráficos, mas em **reescrever como o jogo renderiza**.
        </p>
      `
        },
        {
            title: "1. DXVK: O Salvador do FPS",
            content: `
        <p class="mb-4 text-gray-300">O DXVK converte os comandos DirectX 9 para a API Vulkan, que é muito mais moderna:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Baixe o <strong>DXVK</strong> (versão estável mas recente de 2026) no GitHub.</li>
            <li>Extraia os arquivos <code>d3d9.dll</code> e <code>dxgi.dll</code> da pasta x32 para a pasta raiz do seu GTA IV (onde fica o GTAIV.exe).</li>
            <li>Rode o jogo. No primeiro minuto ele pode dar umas travadas (enquanto compila shaders), mas depois o FPS dobrará e o stuttering desaparecerá 100%.</li>
        </ol>
      `
        },
        {
            title: "2. FusionFix: Consertando os Bugs de 60 FPS",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Correções Essenciais:</h4>
            <p class="text-sm text-gray-300">
                O GTA IV buga se você rodar acima de 30 FPS. Missões como a última (helicóptero) tornam-se impossíveis de completar. O mod <strong>FusionFix</strong> resolve isso, além de consertar texturas que não carregam e sombras que ficam "piscando" em placas de vídeo modernas de 2026.
            </p>
        </div>
      `
        },
        {
            title: "3. O arquivo Commandline.txt",
            content: `
        <p class="mb-4 text-gray-300">
            Se o jogo diz que você tem "0MB de VRAM" e trava as configurações no Mínimo:
            <br/>Crie um arquivo chamado <code>commandline.txt</code> na pasta do jogo e escreva apenas: <code>-availablevidmem 4096</code> (ou o valor total da sua VRAM). Isso forçará o GTA IV a reconhecer sua placa de vídeo corretamente.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/gta-iv-fix-windows-10-11",
            title: "GTA IV no Win 11",
            description: "Dicas de compatibilidade de sistema."
        },
        {
            href: "/guias/gta-san-andreas-correcao-grafica",
            title: "GTA San Andreas",
            description: "Reviva o clássico com gráficos modernos."
        },
        {
            href: "/guias/reduzir-ping-jogos-online",
            title: "Reduzir Ping",
            description: "Dicas para o modo Multiplayer."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
