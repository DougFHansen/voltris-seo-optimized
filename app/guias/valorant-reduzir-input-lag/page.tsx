import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'valorant-reduzir-input-lag',
  title: "Como Reduzir o Input Lag no Valorant: Guia Completo (2026)",
  description: "Sente o mouse pesado no Valorant? Aprenda como reduzir o input lag, configurar o NVIDIA Reflex e otimizar o Windows 11 para máxima resposta em 2026.",
  category: 'games-fix',
  difficulty: 'Iniciante',
  time: '15 min'
};

const title = "Como Reduzir o Input Lag no Valorant: Guia Completo (2026)";
const description = "Sente o mouse pesado no Valorant? Aprenda como reduzir o input lag, configurar o NVIDIA Reflex e otimizar o Windows 11 para máxima resposta em 2026.";
const keywords = [
    'como reduzir input lag valorant 2026 tutorial',
    'mouse pesado valorant como resolver guia 2026',
    'configuração nvidia reflex valorant tutorial guia',
    'otimização windows 11 para valorant input lag 2026',
    'melhores configurações valorant para menos atraso guia'
];

export const metadata: Metadata = createGuideMetadata('valorant-reduzir-input-lag', title, description, keywords);

export default function ValorantInputLagGuide() {
    const summaryTable = [
        { label: "Ajuste Principal", value: "NVIDIA Reflex: On + Boost" },
        { label: "Modo de Tela", value: "Sempre Tela Cheia (Fullscreen)" },
        { label: "Taxa de Polling", value: "1000Hz (ou 4000Hz/8000Hz se suportado)" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "O que é o Input Lag no Valorant?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          No **Valorant**, a diferença entre ganhar ou perder um duelo de mira é medida em milissegundos. O input lag é o tempo total que leva desde o seu clique físico até o tiro sair dentro do jogo. Em 2026, com monitores ultra velozes, qualquer pequeno atraso no processamento do mouse pelo Windows ou pela placa de vídeo pode fazer sua mira parecer "lenta" ou "pesada", prejudicando sua performance competitiva.
        </p>
      `
        },
        {
            title: "1. NVIDIA Reflex e AMD Anti-Lag",
            content: `
        <p class="mb-4 text-gray-300">As tecnologias vitais de 2026 para sincronia CPU/GPU:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>NVIDIA Reflex:</strong> Dentro do jogo, mude para <strong>'Ligado + Impulso' (On + Boost)</strong>. Isso reduz a fila de renderização da GPU ao mínimo possível.</li>
            <li><strong>Raw Input Buffer:</strong> Certifique-se de que o 'Buffer de Entrada Direta' está <strong>Ligado</strong> nas configurações de mouse do Valorant. Isso pula o processamento do Windows e lê os dados do mouse diretamente.</li>
        </ul >
      `
        },
        {
            title: "2. Otimizações de Compatibilidade",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Desativando o Delay do Windows:</h4>
            <p class="text-sm text-gray-300">
                1. Vá até a pasta de instalação do Valorant (<code>VALORANT\\live\\ShooterGame\\Binaries\\Win64</code>). <br/>
                2. Clique com o botão direito no <code>VALORANT-Win64-Shipping.exe</code> e vá em Propriedades. <br/>
                3. Na aba 'Compatibilidade', marque <strong>'Desativar otimizações de tela inteira'</strong>. <br/>
                4. Clique em 'Alterar configurações de DPI alto' e marque a última caixa. Isso garante que o motor gráfico do jogo tenha controle total sobre os frames sem interferência da interface do Windows 11.
            </p>
        </div>
      `
        },
        {
            title: "3. Polling Rate e Performance",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Dica de 2026:</strong> Mouses modernos agora suportam 4000Hz ou até 8000Hz de Polling Rate. 
            <br/><br/>Embora isso reduza o input lag, consome MUITA CPU. Se você não tem um processador topo de linha de 2026, usar 8000Hz no mouse pode causar quedas de FPS brutais (FPS Drops) enquanto você gira a câmera. Teste se o seu PC aguenta; se o FPS cair demais, volte para os estáveis 1000Hz.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/nvidia-refelx-on-vs-boost-diferenca",
            title: "Reflex On vs Boost",
            description: "Análise técnica do impacto térmico."
        },
        {
            href: "/guias/problemas-mouse-gamer-sensor",
            title: "Sensor do Mouse",
            description: "Garanta que seu mouse está rastreando bem."
        },
        {
            href: "/guias/unpark-cpu-cores-performance-jogos",
            title: "Unpark CPU",
            description: "Estabilize o processamento dos inputs."
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
            relatedGuides={relatedGuides}
        />
    );
}
