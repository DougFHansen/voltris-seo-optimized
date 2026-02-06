import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'cod-warzone-melhores-configuracoes-graficas',
    title: "Call of Duty: Warzone & MW3 (2026) - O Guia Definitivo de FPS",
    description: "Warzone travando? Aprenda a configurar o Spot Cache Ultra, corrigir o uso de VRAM, escolher entre DLSS ou FidelityFX CAS e ajustar o Aim Assist como um Pro.",
    category: 'jogos',
    difficulty: 'Avançado',
    time: '60 min'
};

const title = "Warzone Optimization Bible (2026): Visibilidade e FPS Estável";
const description = "O COD é mal otimizado por natureza. Mas com os ajustes certos no arquivo de configuração e no shader cache, é possível rodar liso. Guia completo para PC.";

const keywords = [
    'warzone fps boost 2026 season',
    'melhores configuracoes graficas warzone pc fraco',
    'dlss vs fidelityfx cas warzone visibilidade',
    'spot cache ultra ou high warzone',
    'vram scale target warzone travando',
    'aim assist type black ops vs default',
    'configurar audio passos warzone loudness eq',
    'texture streaming on demand desligar',
    'corrigir dev error warzone directx',
    'weapon motion blur desligar'
];

export const metadata: Metadata = createGuideMetadata('cod-warzone-melhores-configuracoes-graficas', title, description, keywords);

export default function WarzoneGuide() {
    const summaryTable = [
        { label: "Upscaling", value: "FidelityFX CAS (Nitidez)" },
        { label: "Texture Res", value: "Low/Normal" },
        { label: "Spot Cache", value: "Ultra (Crucial)" },
        { label: "VRAM Target", value: "60-70% (Evita Stutter)" },
        { label: "On-Demand", value: "DESLIGADO" },
        { label: "Reflex", value: "On + Boost" },
        { label: "Aim Assist", value: "Black Ops / Dynamic" }
    ];

    const contentSections = [
        {
            title: "Introdução: O devorador de VRAM",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O motor gráfico do Warzone (IW Engine) tem um problema sério de gerenciamento de memória. Se você deixar as configurações no padrão, ele vai tentar usar 90% da sua VRAM. Quando um efeito novo aparece (explosão), a VRAM estoura e o jogo trava por 1 segundo (stutter).
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            O segredo da fluidez no Warzone não é ter uma RTX 4090, mas sim impedir que o jogo se engasgue com a própria memória.
        </p>
      `
        },
        {
            title: "Capítulo 1: Display & Qualidade (Upscaling)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-orange-500 font-bold mb-1">Upscaling / Sharpening</h4>
                <p class="text-white font-mono text-sm mb-2">Recomendado: <span class="text-emerald-400">FidelityFX CAS</span></p>
                <p class="text-gray-400 text-xs">
                    Só use DLSS ou FSR se seu FPS estiver injogável (abaixo de 60). O DLSS borra a imagem em movimento distantes. O <strong>FidelityFX CAS</strong> não aumenta FPS, mas aplica um filtro de nitidez que faz os inimigos "poparem" na tela. Ajuste a força para 50-70%.
                </p>
            </div>
            
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-orange-500 font-bold mb-1">VRAM Scale Target</h4>
                <p class="text-white font-mono text-sm mb-2">Recomendado: <span class="text-emerald-400">60% a 70%</span></p>
                <p class="text-gray-400 text-xs">
                    NUNCA deixe em 90%. O jogo precisa de margem para o Windows e Discord. Se você alocar 90% pro jogo, qualquer notificação de fundo causa travada. Baixar para 70% resolve 90% dos crashes.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Texturas e Detalhes",
            content: `
        <table class="w-full text-sm text-left text-gray-400">
            <tbody>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Texture Resolution</td>
                    <td class="py-2 text-yellow-400">Low/Normal</td>
                    <td class="py-2">High consome VRAM demais sem ganho visual competitivo.</td>
                </tr>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Texture Filter Anisotropic</td>
                    <td class="py-2 text-emerald-400">High</td>
                    <td class="py-2">Deixa o chão nítido de longe. Custo zero.</td>
                </tr>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Particle Quality Level</td>
                    <td class="py-2 text-yellow-400">Low</td>
                    <td class="py-2">Explosões no High causam queda brusca de FPS.</td>
                </tr>
                 <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Shader Quality</td>
                    <td class="py-2 text-yellow-400">Medium</td>
                    <td class="py-2">Low deixa superfícies horríveis, High é pesado. Medium é o equilíbrio.</td>
                </tr>
                 <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Tessellation</td>
                    <td class="py-2 text-red-400">Off</td>
                    <td class="py-2">Inútil para competitivo.</td>
                </tr>
            </tbody>
        </table>
      `
        },
        {
            title: "Capítulo 3: Shadow & Lighting (A chave)",
            content: `
         <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>Spot Cache:</strong> <span class="text-emerald-400 font-bold">ULTRA</span>. Esta é a configuração mais importante. No Ultra, o jogo salva as sombras no seu disco rígido (SSD). No Low, ele tenta recalcular toda hora. Colocar no Ultra ELIMINA stutters.</li>
            <li><strong>Particle Lighting:</strong> Low.</li>
            <li><strong>Ambient Occlusion:</strong> Off. (Inimigos em cantos escuros ficam impossíveis de ver com isso ligado).</li>
            <li><strong>Screen Space Reflections:</strong> Off. (Reflexos em poças d'água distraem e comem FPS).</li>
        </ul>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Post Processing Effects (Desligue TUDO)",
            content: `
        <p class="mb-4 text-gray-300">
            A visão deve ser limpa. Efeitos cinematográficos só atrapalham.
        </p>
        <div class="bg-gray-800 p-4 rounded text-sm text-red-300">
            <strong>DESLIGUE IMEDIATAMENTE:</strong>
            <br/>- weapon Motion Blur
            <br/>- World Motion Blur
            <br/>- Film Grain (Coloque em 0.00)
            <br/>- Depth of Field (Profundidade de Campo)
        </div>
        <p class="mt-2 text-gray-300 text-sm">
            Com isso desligado, você consegue ver inimigos enquanto gira a câmera rápido.
        </p>
      `
        },
        {
            title: "Capítulo 5: On-Demand Texture Streaming",
            content: `
        <p class="mb-4 text-gray-300">
            Esta opção baixa texturas de alta qualidade da internet ENQUANTO você joga.
            <br/><strong>Recomendação: <span class="text-red-400">DESLIGADO (OFF)</span>.</strong>
            <br/>Isso causa lag de internet (Packet Burst) e uso de disco. Só ligue se você tiver fibra ótica de 1Gbps e não se importar com downloads constantes.
        </p>
      `
        },
        {
            title: "Capítulo 6: Configurações de Controle (Aim Assist)",
            content: `
        <p class="mb-4 text-gray-300">
            Se você joga no controle (o meta do COD):
        </p>
        <ul class="list-disc list-inside text-gray-300 text-sm space-y-2">
            <li><strong>Aim Assist Type:</strong> Default ou Black Ops (A comunidade debate, mas Black Ops parece ter um "rotational aim assist" mais pegajoso de perto).</li>
            <li><strong>Aim Response Curve Type:</strong> Dynamic (Acelera a mira quando você empurra o stick todo, permite flicks rápidos e precisão fina no meio).</li>
            <li><strong>Deadzone Inputs:</strong> Ajuste o "Left Stick Min" para o mínimo possível antes de ter drift (ex: 0.03). Quanto menor, mais rápido o boneco começa a correr.</li>
        </ul>
      `
        },
        {
            title: "Capítulo 7: Áudio (Loudness Equalization)",
            content: `
        <p class="mb-4 text-gray-300">
            O som do Warzone é notoriamente ruim. Passos são abafados por ataques aéreos.
            <br/>Use o <strong>Loudness Equalization</strong> do Windows (veja nosso guia de Áudio) ou use a mixagem de áudio <strong>"Headphone Bass Boost"</strong> ou <strong>"Home Theater"</strong> dentro do jogo.
            <br/><em>Dica:</em> Diminua o "Music Volume" e "Dialogue Volume" para 20%, mantenha "Effects Volume" em 100%.
        </p>
      `
        },
        {
            title: "Capítulo 8: Arquivo de Configuração (options.3.cod22.cst)",
            content: `
        <p class="mb-4 text-gray-300">
            Em <code>Documentos\\Call of Duty\\players</code>.
            <br/>Edite a linha <code>RendererWorkerCount</code>.
            <br/>Defina o valor igual ao número de <strong>Núcleos Físicos</strong> da sua CPU (não Threads).
            <br/>Ex: Ryzen 5600 (6 Cores / 12 Threads) -> Coloque 6.
            <br/>Isso corrige 99% dos problemas de micro-stuttering em CPUs AMD e Intel.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 9: Telemetria e Rede",
            content: `
            <p class="mb-4 text-gray-300">
                Ative a Telemetria para monitorar "Packet Burst" e "Extrapolation".
                <br/>Se você ver "Packet Burst" laranja frequentemente:
                <br/>1. Desligue "On-Demand Texture Streaming".
                <br/>2. Feche Discord/Chrome (Warzone odeia dividir banda).
                <br/>3. Use cabo Ethernet (Wi-Fi é proibido em Warzone).
            </p>
            `
        },
        {
            title: "Capítulo 10: Scan and Repair (Loop Fix)",
            content: `
            <p class="mb-4 text-gray-300">
                Se o jogo vive pedindo "Scan and Repair" e nunca arruma:
                <br/>1. Vá nas configurações do Battle.net > Configurações de Jogo.
                <br/>2. Adicione argumentos de linha de comando: <code>-d3d11</code> (Força DX11, mais estável em GPUs antigas).
                <br/>3. Se não funcionar, delete a pasta "players" nos Documentos (vai resetar suas configs, mas resolve o crash).
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Campo de Visão (FOV) afeta FPS?",
            answer: "Sim, levemente. Um FOV de 120 mostra mais objetos na tela para renderizar. Se você tem um PC muito fraco, tente baixar o FOV para 100 ou 105. Mas competitivamente, 120 é o ideal para informação."
        },
        {
            question: "Nvidia Reflex On ou Boost?",
            answer: "No Warzone, 'On + Boost' pode causar instabilidade em algumas CPUs fracas (gargalo). Comece com 'On'. Se sua CPU for forte (i7/Ryzen 7), use 'On + Boost'."
        },
        {
            question: "O jogo parece embaçado de longe?",
            answer: "Isso é o Anti-Aliasing TAA forçado. A única cura é usar 'FidelityFX CAS' no slot de Upscaling e aumentar a força para 50-70%. Isso restaura a nitidez das bordas."
        }
    ];

    const externalReferences = [
        { name: "JGOD (Warzone Science)", url: "https://www.youtube.com/c/JGODGaming" },
        { name: "ArtIsWar (Audio Tuning)", url: "https://www.youtube.com/c/ArtIsWar" },
        { name: "Trello Oficial de Bugs (Raven Software)", url: "https://trello.com/b/Z5x135qw/warzone-trello-board" }
    ];

    const relatedGuides = [
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Guia Nvidia",
            description: "Cache Ilimitado é crucial para COD."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Guia SSD",
            description: "O jogo tem 200GB, precisa de um SSD rápido."
        },
        {
            href: "/guias/reduzir-ping-regedit-cmd-jogos",
            title: "Rede",
            description: "Evite Packet Burst."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="60 min"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            externalReferences={externalReferences}
        />
    );
}
