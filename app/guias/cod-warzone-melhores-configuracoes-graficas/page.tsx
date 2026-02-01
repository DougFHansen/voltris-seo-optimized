import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Call of Duty: Warzone - Guia Definitivo de FPS e Visibilidade (2026)";
const description = "Otimize o Warzone para rodar liso. Aprenda a configurar o upscaling (DLSS/FSR), ajustar a memória de vídeo e editar o arquivo adv_options.ini para parar de travar.";
const keywords = ['warzone configuracao fps', 'aumentar fps warzone 3', 'melhor configuracao warzone pc', 'dlss vs fsr warzone', 'adv_options.ini warzone cores', 'visibilidade warzone'];

export const metadata: Metadata = createGuideMetadata('cod-warzone-melhores-configuracoes-graficas', title, description, keywords);

export default function WarzoneGuide() {
    const summaryTable = [
        { label: "Upscaling", value: "FidelityFX CAS" },
        { label: "VRAM Target", value: "70-80%" },
        { label: "Texturas", value: "Baixo (Low)" },
        { label: "Spot Cache", value: "Ultra/High" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Peso do Warzone",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Call of Duty Warzone é notoriamente pesado na CPU e devorador de VRAM. Diferente de jogos como Valorant, aqui a placa de vídeo trabalha muito. O segredo para um jogo fluido não é apenas colocar tudo no "Low", mas sim balancear a carga entre CPU e GPU.
        </p>
      `,
            subsections: []
        },
        {
            title: "1. Configurações de Qualidade (Menu)",
            content: `
        <p class="mb-4 text-gray-300">Vá em Configurações > Gráficos > Qualidade.</p>
        
        <h3 class="text-xl text-[#31A8FF] font-bold mt-6 mb-4">1.1 Upscaling e Sharpening</h3>
        <p class="text-gray-300 mb-4">Aqui mora a maior armadilha. Muitos ativam DLSS ou FSR para ganhar FPS, mas deixam o jogo borrado, impossibilitando ver inimigos de longe.</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Recomendado (Competitivo):</strong> <span class="text-green-400 font-bold">FidelityFX CAS</span>. 
                <p class="text-sm mt-1 ml-6 text-gray-400">Ele não faz upscaling (não baixa a resolução), ele aplica um filtro de nitidez que faz o jogo parecer cristalino. Defina a força em <strong>50-75%</strong>. Se sua GPU aguenta resolução nativa, use isso.</p>
            </li>
            <li><strong>Recomendado (PC Fraco):</strong> <span class="text-yellow-400 font-bold">DLSS (Performance)</span> ou <span class="text-yellow-400 font-bold">FSR 3.0</span>.
                <p class="text-sm mt-1 ml-6 text-gray-400">Só use se você tiver menos de 60 FPS nativo. A imagem vai degradar um pouco.</p>
            </li>
        </ul>

        <h3 class="text-xl text-[#31A8FF] font-bold mt-6 mb-4">1.2 VRAM Scale Target (Escala de Memória de Vídeo)</h3>
        <p class="text-gray-300 mb-2">Define quanto da sua VRAM o jogo pode "reservar".</p>
        <p class="bg-gray-800 p-3 rounded text-green-400 font-mono">Defina em 70% ou 80%.</p>
        <p class="text-gray-300 text-sm mt-2">NUNCA coloque em 90%. O Windows e o Discord precisam de VRAM também. Se o Warzone pegar tudo, o jogo começa a engasgar (stutter) quando você abre o mapa ou mira.</p>
      `
        },
        {
            title: "2. Detalhes e Texturas",
            content: `
        <div class="space-y-4">
            <div class="bg-gray-800/50 p-4 rounded">
                <h4 class="text-white font-bold">Resolução de Texturas</h4>
                <p class="text-gray-400 text-sm"><strong>Baixo (Low)</strong> ou <strong>Muito Baixo</strong>. No calor da batalha, você não vai olhar para a textura da parede. Economiza muita VRAM.</p>
            </div>
            <div class="bg-gray-800/50 p-4 rounded border-l-4 border-green-500">
                <h4 class="text-white font-bold">Spot Cache (Cache de Sombras)</h4>
                <p class="text-gray-400 text-sm">Coloque em <strong>ULTRA</strong> ou <strong>ALTO</strong>. 
                <br/><em>"Mas Ultra não pesa?"</em> — Não! Isso define o tamanho do arquivo de cache no seu HD/SSD. Se você colocar em "Baixo", o jogo vai ter que recalcular sombras toda hora, causando lag. Se colocar no Ultra, ele salva tudo no disco e a CPU folga.</p>
            </div>
            <div class="bg-gray-800/50 p-4 rounded">
                <h4 class="text-white font-bold">Streaming de Textura sob Demanda</h4>
                <p class="text-gray-400 text-sm"><strong>DESLIGADO</strong>. Isso baixa texturas da internet enquanto você joga. Causa Packet Loss e Ping alto.</p>
            </div>
        </div>
      `
        },
        {
            title: "3. Arquivo de Configuração (RendererWorkerCount)",
            content: `
            <p class="mb-4 text-gray-300">O CoD muitas vezes erra a contagem de núcleos do seu processador.</p>
            <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
                <li>Vá em <code>Documentos\\Call of Duty\\players</code>.</li>
                <li>Abra o arquivo <strong>options.3.cod22.cst</strong> (ou similar, dependendo da versão season).</li>
                <li>Procure por <code>RendererWorkerCount</code>.</li>
                <li>Mude o valor para o número de <strong>Núcleos Físicos</strong> do seu processador (Não threads).
                    <br/>- Ryzen 5 5600 (6 cores / 12 threads) -> Coloque <strong>6</strong>.
                    <br/>- i7 12700K -> Coloque o número de P-Cores (ex: 8).
                </li>
            </ol>
            <p class="text-gray-300 mt-2">Isso estabiliza o uso de CPU drasticamente.</p>
        `
        },
        {
            title: "Dica de Visibilidade de Cores",
            content: `
            <p class="text-gray-300 mb-4">Vá em Interface > Personalização de Cor.</p>
            <ul class="list-disc list-inside text-gray-300">
                <li>Filtro de Cor: <strong>Filtro 2</strong>.</li>
                <li>Alvo do Filtro: <strong>Ambos (Mundo e Interface)</strong>.</li>
                <li>Intensidade: <strong>100%</strong>.</li>
            </ul>
            <p class="text-gray-300 mt-2">Isso deixa o jogo mais vibrante e colorido, tirando aquele aspecto cinza e "lavado" padrão do Warzone, facilitando ver inimigos na sombra.</p>
        `
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
        />
    );
}
