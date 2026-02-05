import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'geometry-dash-4gb-patch-lag',
  title: "Geometry Dash: Como usar o 4GB Patch para acabar com o Lag",
  description: "Seu Geometry Dash trava em níveis com muitos objetos? Aprenda a aplicar o patch de 4GB para permitir que o jogo use mais RAM e rode liso sem crashar.",
  category: 'windows-geral',
  difficulty: 'Iniciante',
  time: '10 min'
};

const title = "Geometry Dash: Como usar o 4GB Patch para acabar com o Lag";
const description = "Seu Geometry Dash trava em níveis com muitos objetos? Aprenda a aplicar o patch de 4GB para permitir que o jogo use mais RAM e rode liso sem crashar.";
const keywords = [
    'como instalar 4gb patch geometry dash 2026',
    'geometry dash lag fix pc 2026 tutorial',
    'geometry dash crashando em niveis pesados como resolver',
    'aumentar ram geometry dash 2.2 patch',
    'megahack geometry dash 4gb patch embutido'
];

export const metadata: Metadata = createGuideMetadata('geometry-dash-4gb-patch-lag', title, description, keywords);

export default function GeometryDashPatchGuide() {
    const summaryTable = [
        { label: "Aplicação", value: "GeomeryDash.exe" },
        { label: "O que faz", value: "Permite usar 4GB de RAM (em vez de 2GB)" },
        { label: "Requisito", value: "Windows 64 bits" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "Por que o Geometry Dash trava mesmo em PCs Fortes?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Geometry Dash é um programa de 32 bits. Por padrão, o Windows limita esse tipo de programa a usar apenas **2GB de memória RAM**. Em níveis modernos da comunidade ("Extreme Demons") com milhares de objetos e efeitos, o jogo atinge esse limite rapidamente e fecha sozinho ou começa a rodar em câmera lenta.
        </p>
      `
        },
        {
            title: "1. Como aplicar o 4GB Patch",
            content: `
        <p class="mb-4 text-gray-300">O 4GB Patch é uma ferramenta minúscula que muda um "flag" dentro do executável do jogo.</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Baixe o <strong>4GB Patch</strong> (de sites confiáveis como o da NTCore).</li>
            <li>Abra o programa e selecione o arquivo <code>GeometryDash.exe</code> na sua pasta da Steam. <br/> (Geralmente em: <code>C:/Program Files (x86)/Steam/steamapps/common/Geometry Dash</code>)</li>
            <li>O programa dirá "Executable successfully patched!".</li>
            <li>Pronto! Agora o jogo pode usar até 4GB de RAM, o dobro do normal.</li>
        </ol>
      `
        },
        {
            title: "2. Mega Hack e FPS Bypass",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Alternativa Moderna:</h4>
            <p class="text-sm text-gray-300">
                Se você usa o <strong>Mega Hack</strong> (v7 ou v8), o patch de 4GB já vem embutido e é aplicado automaticamente. Além disso, use o 'FPS Bypass' para jogar a 144Hz ou 240Hz mesmo que o seu monitor seja 60Hz, o que reduz o input lag drasticamente nos pulos.
            </p>
        </div>
      `
        },
        {
            title: "3. Dica: Smooth Fix e LDM",
            content: `
        <p class="mb-4 text-gray-300">
            Dentro do jogo, sempre ative o <strong>LDM (Low Detail Mode)</strong> nos níveis que oferecem essa opção. Desative o 'Smooth Fix' nas configurações de vídeo, pois ele pode fazer o jogo rodar em câmera lenta se o seu PC não mantiver o FPS estável, o que estraga o timing da música.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-performance",
            title: "Otimizar PC",
            description: "Aumente o desempenho geral do Windows."
        },
        {
            href: "/guias/roblox-fps-unlocker-tutorial",
            title: "FPS Unlocker",
            description: "Dicas similares para o Roblox."
        },
        {
            href: "/guias/atualizacao-drivers-video",
            title: "Drivers de Vídeo",
            description: "Garanta que sua GPU suporte os novos efeitos da 2.2."
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
            relatedGuides={relatedGuides}
        />
    );
}
