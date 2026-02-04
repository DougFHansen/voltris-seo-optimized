import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "GTA IV Fix: Como rodar liso no Windows 10 e 11 (2026)";
const description = "O GTA IV para PC é famoso por ser mal otimizado. Aprenda a instalar o DXVK, FusionFix e corrigir o lag e erros de câmera no Windows moderno.";
const keywords = [
    'gta iv fix windows 11 2026',
    'gta iv lag fix pc fraco',
    'dxvk gta iv tutorial',
    'fusionfix gta iv como instalar',
    'gta iv camera balançando fix'
];

export const metadata: Metadata = createGuideMetadata('gta-iv-fix-windows-10-11', title, description, keywords);

export default function GTAIVFixGuide() {
    const summaryTable = [
        { label: "Problema", value: "Má otimização do DirectX 9" },
        { label: "Solução Chave", value: "DXVK (Vulkan)" },
        { label: "Mod Essencial", value: "FusionFix" },
        { label: "Dificuldade", value: "Média" }
    ];

    const contentSections = [
        {
            title: "Por que GTA IV roda tão mal no PC?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Lançado em 2008, o GTA IV foi feito para o DirectX 9. O Windows 10 e 11 não lidam bem com as chamadas de desenho (Draw Calls) antigas do jogo, o que faz com que ele trave mesmo em uma RTX 4090. Além disso, o jogo tem conflitos com processadores que têm muitos núcleos.
        </p>
      `
        },
        {
            title: "O Milagre do DXVK (Vulkan)",
            content: `
        <p class="mb-4 text-gray-300">Este é o passo ÚNICO que vai triplicar seu FPS. Ele traduz o jogo de DX9 para Vulkan.</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Baixe o <strong>DXVK</strong> no GitHub oficial.</li>
            <li>Extraia os arquivos <code>d3d9.dll</code> e <code>dxgi.dll</code> da pasta x32.</li>
            <li>Cole esses arquivos na pasta principal do jogo (onde fica o <code>GTAIV.exe</code>).</li>
            <li>Abra o jogo. Você notará que o uso da GPU vai subir e o FPS vai ficar muito mais estável.</li>
        </ol>
      `
        },
        {
            title: "GTA IV FusionFix: O Mod Obrigatório",
            content: `
        <p class="mb-4 text-gray-300">
            O FusionFix corrige erros que a Rockstar nunca arrumou, como a proporção da tela (aspect ratio) e as sombras piscando.
        </p>
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <ul class="text-sm text-gray-300 space-y-2">
                <li>Corrige o problema das luzes de postes sumindo à distância.</li>
                <li>Permite pular as intros chatas automaticamente.</li>
                <li>Conserta o bug da mira em resoluções 4K.</li>
                <li>Basta baixar o arquivo .zip e jogar o conteúdo na pasta do jogo.</li>
            </ul>
        </div>
      `
        },
        {
            title: "Corrigindo o Erro de Memória (VRAM)",
            content: `
        <p class="mb-4 text-gray-300">
            Se o jogo diz que você não tem memória de vídeo suficiente (mesmo que tenha 8GB), crie um arquivo de texto chamado <code>commandline.txt</code> na pasta do jogo e cole isto dentro:
        </p>
        <code class="text-yellow-400 bg-black/30 p-2 rounded block"> -availablevidmem 4096 -nomemrestrict -norestrictions</code>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-performance",
            title: "Windows para Jogos",
            description: "Melhore a resposta do sistema antes de abrir o GTA."
        },
        {
            href: "/guias/como-usar-ddu-driver-uninstaller",
            title: "Limpeza de Drivers",
            description: "Evite conflitos de DirectX com drivers antigos."
        },
        {
            href: "/guias/reduzir-ping-jogos-online",
            title: "GTA Online Lag",
            description: "Dicas específicas para o modo multiplayer."
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
