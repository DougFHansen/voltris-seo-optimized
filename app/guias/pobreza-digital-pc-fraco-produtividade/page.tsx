import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'pobreza-digital-pc-fraco-produtividade',
  title: "Pobreza Digital: Como ser Produtivo com um PC Fraco em 2026",
  description: "Você não precisa do PC mais caro para estudar ou trabalhar. Aprenda as técnicas de otimização extrema e softwares leves para vencer a pobreza digital ...",
  category: 'windows-geral',
  difficulty: 'Iniciante',
  time: '20 min'
};

const title = "Pobreza Digital: Como ser Produtivo com um PC Fraco em 2026";
const description = "Você não precisa do PC mais caro para estudar ou trabalhar. Aprenda as técnicas de otimização extrema e softwares leves para vencer a pobreza digital em 2026.";
const keywords = [
    'ser produtivo com pc fraco 2026 tutorial',
    'como estudar com notebook antigo e lento guia',
    'softwares leves para pc fraco produtividade 2026',
    'pobreza digital como superar com tecnologia tutorial',
    'otimização extrema windows 11 pc fraco trabalho'
];

export const metadata: Metadata = createGuideMetadata('pobreza-digital-pc-fraco-produtividade', title, description, keywords);

export default function DigitalPovertyGuide() {
    const summaryTable = [
        { label: "Foco", value: "Eficiência sobre estética" },
        { label: "Navegador", value: "Brave ou Edge (Modo Econômico)" },
        { label: "Sistema", value: "Windows 11 Lite ou Linux (Opcional)" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "O que é a Pobreza Digital?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, a desigualdade não é apenas financeira, mas de acesso à informação rápida. Ter um PC que trava ao abrir um PDF ou um vídeo de aula coloca você em desvantagem. No entanto, o hardware não define o seu potencial. Com as configurações certas, um notebook de 2018 pode ser tão produtivo quanto um de 2026 para tarefas de estudo e trabalho. O segredo é saber o que **remover** para que o PC foque apenas no que importa.
        </p>
      `
        },
        {
            title: "1. Escolha a Ferramenta Leve (Software alternativo)",
            content: `
        <p class="mb-4 text-gray-300">Pare de usar programas pesados se o seu PC tem pouca RAM:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Em vez de Word:</strong> Use o Google Docs (Online) ou o <strong>AbiWord</strong> (Extra leve).</li>
            <li><strong>Em vez de Adobe Reader:</strong> Use o <strong>SumatraPDF</strong>. Ele abre instantaneamente e usa quase 0 de RAM.</li>
            <li><strong>Em vez de Chrome:</strong> Use o <strong>Brave</strong> com bloqueio de anúncios agressivo. Menos anúncios = menos processamento.</li>
        </ul >
      `
        },
        {
            title: "2. O Poder da Web (SaaS)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Processamento na Nuvem:</h4>
            <p class="text-sm text-gray-300">
                Se o seu PC é fraco demais para editar vídeos ou fotos, use ferramentas que rodam nos servidores de outras empresas. <br/><br/>
                - <strong>Canva:</strong> Para design sem precisar de Photoshop. <br/>
                - <strong>CapCut Web:</strong> Para edição de vídeo direto no navegador. <br/>
                - <strong>Google Colab:</strong> Se você estuda programação, use os servidores do Google para rodar o seu código de graça.
            </p>
        </div>
      `
        },
        {
            title: "3. Otimização Visual do Windows",
            content: `
        <p class="mb-4 text-gray-300">
            O Windows 11 gasta muita energia para deixar as janelas bonitas e transparentes. 
            <br/><br/><strong>Dica:</strong> Pesquise por 'Ajustar a aparência e o desempenho do Windows'. Selecione <strong>'Ajustar para obter um melhor desempenho'</strong>. As fontes ficarão um pouco mais simples e as janelas não terão animação, mas a resposta do seu clique será imediata. Sinta a velocidade, não o visual.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/limpar-memoria-ram-windows",
            title: "Limpar RAM",
            description: "Essencial para quem tem 4GB ou menos."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Otimizar SSD",
            description: "O maior upgrade de performance possível."
        },
        {
            href: "/guias/melhores-navegadores-custo-beneficio",
            title: "Navegadores",
            description: "Escolha o que menos engasga no seu PC."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
