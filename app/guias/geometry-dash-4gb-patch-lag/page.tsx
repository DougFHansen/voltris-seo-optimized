import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Geometry Dash Lag em Níveis com Muitos Objetos? Instale o 4GB Patch (2026)";
const description = "Níveis como 'White Space' ou 'Change of Scene' travam seu jogo? O Geometry Dash é um aplicativo de 32-bits que precisa ser 'patcheado' para usar mais RAM.";
const keywords = ['geometry dash 4gb patch', 'gd travando ntsw', 'geometry dash lag fix 2.2', 'melhorar fps geometry dash', 'hack fps bypass geometry dash', 'megahack v8 performance'];

export const metadata: Metadata = createGuideMetadata('geometry-dash-4gb-patch-lag', title, description, keywords);

export default function GDGuide() {
    const summaryTable = [
        { label: "Ferramenta", value: "4GB Patch" },
        { label: "Safe?", value: "Sim (Oficial)" },
        { label: "FPS Hack", value: "MegaHack / Geode" },
        { label: "Lag Fix", value: "LDM" }
    ];

    const contentSections = [
        {
            title: "O Problema do 2GB",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Por padrão, executáveis antigos (como o GD) só podem usar 2GB de RAM. Quando você carrega um nível com 300.000 objetos, o jogo atinge esse teto e crasha ou derruba o FPS para 10.
        </p>
      `,
            subsections: []
        },
        {
            title: "Como Aplicar o 4GB Patch",
            content: `
        <p class="mb-4 text-gray-300">
            Isso modifica o <code>geometry-dash.exe</code> para permitir acesso a 4GB de RAM.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 mb-6">
            <li>Baixe o <strong>4GB Patch</strong> (ntcore.com).</li>
            <li>Abra o patcher.</li>
            <li>Navegue até a pasta da Steam (<code>steamapps/common/Geometry Dash</code>).</li>
            <li>Selecione o executável.</li>
            <li>Clique em OK. Vai aparecer "Executable Successfully Patched".</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Geode Mod Loader (A Nova Era)",
            content: `
        <p class="mb-4 text-gray-300">
            Não use hacks antigos. Instale o <strong>Geode</strong>. É a loja de mods oficial da comunidade.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2">
            <li>Dentro do Geode, instale o mod <strong>"QOLMod"</strong> ou <strong>"Performance+"</strong>.</li>
            <li>Eles corrigem bugs de input lag e optimizam o renderizador de partículas.</li>
            <li>Ative o <strong>Smooth Fix</strong> nas opções do jogo se tiver travamentos de áudio, mas cuidado: isso pode desincronizar a música.</li>
        </ul>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="5 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
