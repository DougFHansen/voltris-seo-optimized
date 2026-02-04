import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Elden Ring: Como corrigir Stuttering e Travadas (DX12 Fix 2026)";
const description = "Sofrendo com lentidão nas Terras Intermédias? Aprenda a corrigir o stuttering do Elden Ring no DirectX 12 e ganhar estabilidade em 2026.";
const keywords = [
    'elden ring stuttering fix 2026 windows 11',
    'como aumentar fps elden ring pc fraco tutorial',
    'corrigir travadas elden ring dx12 guia completo',
    'melhores configurações elden ring performance 2026',
    'elden ring pc lag fix nvidia amd tutorial 2026'
];

export const metadata: Metadata = createGuideMetadata('eld-ring-stuttering-fix-dx12', title, description, keywords);

export default function EldenRingFixGuide() {
    const summaryTable = [
        { label: "Causa Principal", value: "Compilação de Shaders em tempo real" },
        { label: "Otimização Chave", value: "Shader Cache Ilimitado (NVIDIA)" },
        { label: "Modo Vital", value: "Desativar Ray Tracing (Se GPU for média)" },
        { label: "Dificuldade", value: "Médio" }
    ];

    const contentSections = [
        {
            title: "O desafio técnico de Elden Ring em 2026",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Mesmo anos após o lançamento, o **Elden Ring** ainda apresenta problemas de stuttering (micro-travamentos) no Windows 11. Isso acontece principalmente devido à forma como o jogo gerencia o DirectX 12, compilando shaders enquanto você corre pelo mapa. Em 2026, com o DLC Shadow of the Erdtree exigindo ainda mais do hardware, configurar o cache de sombra e o gerenciamento de energia é essencial para uma experiência fluida.
        </p>
      `
        },
        {
            title: "1. Shader Cache Ilimitado (NVIDIA)",
            content: `
        <p class="mb-4 text-gray-300">Este é o ajuste mais importante para acabar com os pulos de FPS:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Abra o Painel de Controle da NVIDIA.</li>
            <li>Vá em 'Gerenciar as configurações em 3D'.</li>
            <li>Procure por <strong>'Tamanho do Cache de Sombreador' (Shader Cache Size)</strong>.</li>
            <li>Mude de 'Padrão' para <strong>'Ilimitado' (Unlimited)</strong> ou 10GB.</li>
            <li>Isso impede que o jogo apague shaders antigos, reduzindo drasticamente as travadas em áreas já visitadas.</li>
        </ol>
      `
        },
        {
            title: "2. Desativando o Ray Tracing Oculto",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Atenção ao Menu:</h4>
            <p class="text-sm text-gray-300">
                Muitas vezes, após uma atualização, o Elden Ring ativa o **Ray Tracing** automaticamente. Mesmo no 'Baixo', o Ray Tracing consome quase 40% da performance da sua GPU sem oferecer uma mudança visual drástica no estilo artístico do jogo. Certifique-se de que ele está DESATIVADO nas configurações gráficas para manter os 60 FPS constantes.
            </p>
        </div>
      `
        },
        {
            title: "3. Prioridade de Energia e Windows 11",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Estabilidade Máxima em 2026:</strong> 
            <br/><br/>No Windows 11, vá em Configurações > Sistema > Tela > Gráficos. Adicione o executável do Elden Ring (eldenring.exe) e defina como **'Alto Desempenho'**. Além disso, em Opções de Energia, use o plano 'Desempenho Máximo'. Isso garante que o clock do seu processador não caia durante as lutas contra chefes, onde qualquer milissegundo de lag pode ser fatal.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/aceleracao-hardware-gpu-agendamento",
            title: "Agendamento GPU",
            description: "Essencial para a fluidez do DX12."
        },
        {
            href: "/guias/limitar-fps-rivatuner-nvidia",
            title: "Limitar FPS",
            description: "Mantenha o frame pacing perfeito."
        },
        {
            href: "/guias/rtx-4060-vale-a-pena-2026",
            title: "Performance RTX",
            description: "Veja como placas modernas rodam o jogo."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Médio"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
