import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Free Fire em PC Fraco: SmartGaGa, BlueStacks Lite ou LDPlayer? (2026)";
const description = "Seu PC tem 2GB ou 4GB de RAM e você quer jogar Free Fire? Esqueça o BlueStacks 5. Veja como instalar o SmartGaGa modificado (Android 4) para rodar liso.";
const keywords = ['free fire pc fraco 2gb ram', 'smartgaga download 2026', 'bluestacks lite pc fraco', 'melhor emulador free fire pc da xuxa', 'sensibilidade y smartgaga', 'configurar hud free fire pc'];

export const metadata: Metadata = createGuideMetadata('free-fire-pc-fraco-smartgaga', title, description, keywords);

export default function FFGuide() {
    const summaryTable = [
        { label: "PC da NASA", value: "BlueStacks 5" },
        { label: "PC Médio", value: "LDPlayer" },
        { label: "PC Xuxa (2GB)", value: "SmartGaGa" },
        { label: "Sistema", value: "Windows 7 Lite" }
    ];

    const contentSections = [
        {
            title: "Por que emuladores travam tanto?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          O Free Fire é leve, mas emular o Android dentro do Windows é pesado. O BlueStacks moderno exige instruções de processador (AVX) que PCs antigos (Core 2 Duo, i3 1ª Gen) não têm, causando tela azul ou lentidão.
        </p>
      `,
            subsections: []
        },
        {
            title: "A Salvação: SmartGaGa (Titan Engine)",
            content: `
        <div class="bg-blue-900/20 p-6 rounded-xl border border-blue-500 mb-6">
            <h4 class="text-white font-bold mb-2">SmartGaGa 1.1 (Modificado)</h4>
            <p class="text-gray-300 text-sm">
                O SmartGaGa original morreu, mas a comunidade brasileira mantém versões modificadas (como o <strong>SmartGaGa do HTzinho</strong>).
                <br/><br/>
                Ele não usa virtualização pesada. Ele roda uma versão "capada" do Android 4.4 KitKat que consome apenas <strong>200MB de RAM</strong>. É a única opção viável para PC sem placa de vídeo.
            </p>
        </div>
      `,
            subsections: []
        },
        {
            title: "Configuração Suprema para PC Fraco (SmartGaGa)",
            content: `
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Baixe uma versão modificada confiável no YouTube.</li>
            <li>Na instalação, escolha o diretório raiz (C:\\SmartGaGa) para evitar erros de permissão.</li>
            <li>Abra as configurações (Engrenagem):
                <ul class="list-disc list-inside ml-6 mt-2 text-green-400 text-sm">
                    <li><strong>Android:</strong> 4.4.2 (O mais leve).</li>
                    <li><strong>CPU:</strong> 1 Core (Sim, funciona bem).</li>
                    <li><strong>RAM:</strong> 1024M (1GB).</li>
                    <li><strong>Render:</strong> DirectX (Para quem não tem placa de vídeo).</li>
                    <li><strong>Resolução:</strong> 800x600 ou 640x480 (Gráfico de Minecraft, mas 60 FPS cravado).</li>
                </ul>
            </li>
        </ol>
      `
        },
        {
            title: "Sensibilidade Y (O Bug do Capa)",
            content: `
        <p class="text-gray-300">
            No mapeamento de teclas, você pode alterar a "Sensibilidade Y" (Vertical) para ser maior que a X (Horizontal). Coloque Y=2.0 ou 3.0. Isso facilita subir capa com o mouse mexendo pouco a mão.
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
