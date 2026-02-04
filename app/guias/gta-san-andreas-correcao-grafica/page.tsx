import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "GTA San Andreas: Como corrigir Gráficos e Bugs no Windows 10 e 11";
const description = "O GTA San Andreas clássico está bugado no seu PC moderno? Aprenda a instalar o SilentPatch, Widescreen Fix e SkyGfx para ter a melhor experiência definitiva.";
const keywords = [
    'gta san andreas fix windows 11',
    'silentpatch gta sa download 2026',
    'gta sa widescreen fix tutorial',
    'corrigir mouse gta san andreas windows 10',
    'gta sa graphics mod essentials'
];

export const metadata: Metadata = createGuideMetadata('gta-san-andreas-correcao-grafica', title, description, keywords);

export default function GTASAFixGuide() {
    const summaryTable = [
        { label: "Mod Essencial", value: "SilentPatch" },
        { label: "Correção de Tela", value: "Widescreen Fix" },
        { label: "Visual PS2", value: "SkyGfx" },
        { label: "Dificuldade", value: "Média (Modding)" }
    ];

    const contentSections = [
        {
            title: "O Problema das Versões Modernas",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O GTA San Andreas (v1.0 original) é um dos melhores jogos da história, mas roda muito mal em sistemas modernos. Se você tem a versão da Steam ou Rockstar Launcher, ela é cheia de bugs. Se você tem a "Definitive Edition", os gráficos podem não agradar. A melhor forma de jogar é a versão clássica com **Mods de Correção**.
        </p>
      `
        },
        {
            title: "1. SilentPatch (Obrigatório)",
            content: `
        <p class="mb-4 text-gray-300">Este mod corrige centenas de bugs, incluindo:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-2">
            <li>O mouse que para de funcionar do nada.</li>
            <li>A física do jogo que quebra acima de 30 FPS.</li>
            <li>Texturas que piscam.</li>
            <li>Luzes que não acendem à noite.</li>
        </ul>
        <p class="mt-4 text-sm text-gray-400 font-mono italic">Basta arrastar os arquivos do SilentPatch para a pasta raiz do jogo.</p>
      `
        },
        {
            title: "2. Widescreen Fix e SkyGfx",
            content: `
        <p class="mb-4 text-gray-300">
            O jogo original foi feito para monitores "quadrados" (4:3). Em monitores 16:9, a imagem fica esticada. O <strong>Widescreen Fix</strong> corrige isso e adiciona suporte a 1080p e 4K.
        </p>
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Dica Estética: SkyGfx</h4>
            <p class="text-sm text-gray-300">
                Sente falta daquele "clima alaranjado" da versão de PS2? O SkyGfx traz de volta a iluminação original, os reflexos nos carros e a grama que foi removida na versão de PC. É a forma definitiva de ver o jogo.
            </p>
        </div>
      `
        },
        {
            title: "O Bug do Frame Limiter",
            content: `
        <p class="mb-4 text-gray-300">
            Nunca jogue GTA SA com o FPS totalmente destravado (acima de 100). Isso quebra a física do CJ (ele nada muito devagar) e os carros demoram uma eternidade para frear. Use o SilentPatch para limitar o jogo em <strong>60 FPS</strong> estáveis.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/gta-iv-fix-windows-10-11",
            title: "GTA IV Fix",
            description: "Correções para o capítulo seguinte da saga."
        },
        {
            href: "/guias/gta-v-otimizar-fps-pc-fraco",
            title: "GTA V Otimização",
            description: "Como rodar o GTA V em PCs humildes."
        },
        {
            href: "/guias/atualizacao-drivers-video",
            title: "Drivers de Vídeo",
            description: "Mantenha sua placa pronta para jogos clássicos."
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
