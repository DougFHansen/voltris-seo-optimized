import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "GTA V err_gfx_d3d_init Crash Fix: Soluções Definitivas (2026)";
const description = "GTA 5 fechando sozinho com erro 'ERR_GFX_D3D_INIT'? Geralmente é culpa do overclock da GPU ou DirectX corrompido. Veja como editar o settings.xml para resolver.";
const keywords = ['gta v err_gfx_d3d_init fix', 'gta 5 fechando sozinho erro', 'erro gfx d3d init gta v', 'gta 5 crashando pc', 'underclock gta 5', 'directx gta 5 value 0'];

export const metadata: Metadata = createGuideMetadata('gta-v-err-gfx-d3d-init-crash', title, description, keywords);

export default function GTAErrorGuide() {
    const summaryTable = [
        { label: "Erro", value: "ERR_GFX_D3D_INIT" },
        { label: "Causa", value: "Instabilidade GPU" },
        { label: "Solução 1", value: "DirectX 0/1" },
        { label: "Solução 2", value: "Underclock" }
    ];

    const contentSections = [
        {
            title: "O que significa ERR_GFX_D3D_INIT?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Significa "Erro na Inicialização do Direct3D Gráfico". Em português: O driver de vídeo parou de responder por um milissegundo e o GTA V entrou em pânico e fechou.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          Isso acontece muito em placas com Overclock de fábrica (OC Editions) ou quando o DirectX do jogo está conflitando com o overlay do Windows.
        </p>
      `,
            subsections: []
        },
        {
            title: "Solução 1: Mudar a versão do DirectX (Settings.xml)",
            content: `
        <p class="mb-4 text-gray-300">
            Vamos forçar o jogo a usar DX10 ou DX11 via arquivo de texto (já que o jogo não abre).
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 mb-6">
            <li>Vá em <code>Documentos\Rockstar Games\GTA V</code>.</li>
            <li>Abra o arquivo <strong>settings.xml</strong> com o Bloco de Notas.</li>
            <li>Dê Ctrl+F e procure por: <code>DX_Version</code>.</li>
            <li>Mude o valor:
                <br/>- De <code>2</code> (DX11) para <code>0</code> (DX10) ou <code>1</code> (DX10.1).
            </li>
            <li>Salve e tente abrir o jogo. O gráfico vai ficar um pouco pior, mas o crash deve parar.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Solução 2: Remover Overclock (MSI Afterburner)",
            content: `
        <p class="mb-4 text-gray-300">
            Se você fez overclock na GPU, desfaça. O GTA V é extremamente sensível a clocks instáveis.
        </p>
        <p class="text-gray-300">
            Se sua placa já vem com overclock de fábrica, abra o MSI Afterburner e diminua o <strong>Core Clock</strong> em <strong>-50 MHz</strong>.
        </p>
      `
        },
        {
            title: "Solução 3: Tela sem Bordas",
            content: `
        <p class="text-gray-300">
            Mude o modo de tela de "Tela Cheia" para "Janela Sem Bordas" (Windowed Borderless). O Windows gerencia melhor a VRAM nesse modo, evitando crashes de TDR.
        </p>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
