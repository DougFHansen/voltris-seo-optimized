import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'cyberpunk-2077-hdd-mode-otimizacao',
  title: "Cyberpunk 2077: Otimização HDD Mode e FPS no Windows 11 (2026)",
  description: "Sofrendo com travadas no Cyberpunk 2077? Aprenda a configurar o HDD Mode, DLSS 3.5 e como ganhar frames em Night City em 2026.",
  category: 'otimizacao',
  difficulty: 'Intermediário',
  time: '25 min'
};

const title = "Cyberpunk 2077: Otimização HDD Mode e FPS no Windows 11 (2026)";
const description = "Sofrendo com travadas no Cyberpunk 2077? Aprenda a configurar o HDD Mode, DLSS 3.5 e como ganhar frames em Night City em 2026.";
const keywords = [
    'cyberpunk 2077 otimização pc fraco 2026',
    'como ativar hdd mode cyberpunk 2077 guia',
    'melhores configurações graficas cyberpunk phantom liberty 2026',
    'ganhar fps cyberpunk 2077 nvidia dlss amd fsr tutorial',
    'resolver crash cyberpunk 2077 windows 11 guia completo'
];

export const metadata: Metadata = createGuideMetadata('cyberpunk-2077-hdd-mode-otimizacao', title, description, keywords);

export default function CyberpunkOptimizationGuide() {
    const summaryTable = [
        { label: "Upscaling", value: "DLSS 3.5 Path Tracing / FSR 3.0 Frame Gen" },
        { label: "Modo Vital", value: "HDD Mode (Ativar se não tiver NVMe Gen4+)" },
        { label: "Destaque 2026", value: "Reconstrução de Raios (Ray Reconstruction)" },
        { label: "Dificuldade", value: "Médio" }
    ];

    const contentSections = [
        {
            title: "Night City na máxima performance em 2026",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **Cyberpunk 2077 (Phantom Liberty)** continua sendo o "benchmark" supremo para qualquer PC Gamer em 2026. Com a introdução do Path Tracing total, até as placas de vídeo mais potentes sofrem. No entanto, o maior gargalo para a maioria dos usuários é a velocidade com que os dados do mundo são carregados. Ajustar as configurações de transmissão (streaming) é a chave para remover o stuttering.
        </p>
      `
        },
        {
             title: "1. O \"HDD Mode\": Não é apenas para HDs antigos",
            content: `
        <p class="mb-4 text-gray-300">Este ajuste pode salvar o seu gameplay even em SSDs comuns:</p>
        <p class="text-sm text-gray-300">
            Vá em Configurações > Jogabilidade > **Modo HDD Lento**. <br/><br/>
            Mesmo que você tenha um SSD SATA ou um NVMe de entrada, ativar essa opção faz com que o jogo carregue os modelos e texturas com mais antecedência, evitando que objetos e pessoas "apareçam do nada" (pop-in) enquanto você dirige rápido pela cidade. Em 2026, com o aumento do detalhamento de Night City, essa opção é vital para manter um frametime estável.
        </p>
      `
        },
        {
            title: "2. Tecnologias de Elite: DLSS 3.5 e FSR 3",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Multiplicadores de FPS:</h4>
            <p class="text-sm text-gray-300">
                - <strong>NVIDIA Frame Generation:</strong> Essencial para quem tem uma série RTX 40 ou superior. Dobra o FPS gerando quadros falsos de altíssima qualidade. <br/>
                - <strong>NVIDIA Ray Reconstruction:</strong> Melhora a nitidez dos reflexos sem pesar tanto quanto o Ray Tracing tradicional. <br/>
                - <strong>AMD FSR 3.0:</strong> Permite que usuários de placas antigas (NVIDIA e AMD) tenham acesso ao Frame Generation via software.
            </p>
        </div>
      `
        },
        {
            title: "3. Ajustes Cirúrgicos de Performance",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>O que realmente pesa:</strong> 
            <br/><br/>Se o seu FPS está baixo, reduza estes três itens primeiro: <br/>
            1. <strong>Cascaded Shadows Resolution:</strong> Coloque em Médio. Isso tem um impacto visual baixo mas economiza muito processamento de sombras. <br/>
            2. <strong>Crowd Density:</strong> Se você não se importa com calçadas mais vazias, coloque em Baixo para dar fôlego para o seu processador. <br/>
            3. <strong>Screen Space Reflections:</strong> Desative ou use no Baixo se não estiver usando Ray Tracing.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/aceleracao-hardware-gpu-agendamento",
            title: "Agendamento GPU",
            description: "Obrigatório para o Frame Generation funcionar."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Otimizar SSD",
            description: "Melhore a velocidade de leitura para o jogo."
        },
        {
            href: "/guias/rtx-4060-vale-a-pena-2026",
            title: "Benchmark RTX 4060",
            description: "Veja como a placa se sai em Night City."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="25 min"
            difficultyLevel="Médio"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
