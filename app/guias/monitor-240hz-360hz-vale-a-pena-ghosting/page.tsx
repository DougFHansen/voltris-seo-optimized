import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'monitor-240hz-360hz-vale-a-pena-ghosting',
    title: "Monitores 240Hz/360Hz (2026): Configuração, Overdrive e Ghosting",
    description: "Comprou um monitor rápido e a imagem está borrada? Aprenda a configurar o Overdrive correto, ativar o Hz máximo no Windows e testar Ghosting (UFO Test).",
    category: 'hardware',
    difficulty: 'Intermediário',
    time: '20 min'
};

const title = "Setup de Monitor Pro (2026): Zero Ghosting";
const description = "Ter 360Hz não adianta se o pixel demora a mudar de cor (Ghosting) ou se tem Overshoot (Inverse Ghosting). Calibre seu monitor para clareza de movimento total.";

const keywords = [
    'monitor 240hz vs 144hz difference worth it',
    'ufo test ghosting fix overdrive settings',
    'elmb sync vs g-sync input lag',
    'dyac+ benq zowie settings valorant',
    'monitor piscando 240hz cabo displayport',
    'inverse ghosting corona artifacts',
    'melhor overdrive normal fast extreme',
    'voltris optimizer display',
    'icc profile calibracao cores'
];

export const metadata: Metadata = createGuideMetadata('monitor-240hz-360hz-vale-a-pena-ghosting', title, description, keywords);

export default function MonitorGuide() {
    const summaryTable = [
        { label: "Hz Windows", value: "Verificar (Avançado)" },
        { label: "Overdrive", value: "Normal / Fast (Nunca Extreme)" },
        { label: "G-Sync", value: "ON (Casual) / OFF (Pro)" },
        { label: "ELMB/DyAc", value: "ON (Motion Clarity)" },
        { label: "Cabo", value: "DisplayPort 1.4" },
        { label: "Gamma", value: "2.2" },
        { label: "Digital Vibrance", value: "70% (Cores)" }
    ];

    const contentSections = [
        {
            title: "Introdução: Hertz vs Pixel Response",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Hz é quantas vezes a tela atualiza. Pixel Response é a velocidade que a cor muda. Se a tela atualiza (360Hz) mas o pixel é lento (IPS barato), você vê um rastro borrado atrás dos inimigos. O Overdrive corrige isso.
        </p>
      `
        },
        {
            title: "Capítulo 1: Configurando o Hz no Windows",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Erro Clássico</h4>
                <p class="text-gray-400 text-xs text-justify">
                    50% dos gamers compram monitor 240Hz e usam em 60Hz por anos.
                    <br/>Vá em Configurações > Sistema > Tela > Exibição Avançada.
                    <br/>Mude a Taxa de Atualização para o máximo possível.
                    <br/>Se o máximo não aparecer, você está usando cabo HDMI velho. Use o <strong>DisplayPort</strong> que veio na caixa.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Overdrive (Trace Free / Response Time)",
            content: `
        <p class="mb-4 text-gray-300">
            No menu físico do monitor (OSD):
            <br/>Procure por "Overdrive", "Response Time" ou "Trace Free".
            <br/>Nunca coloque no MÁXIMO (Extreme/Fastest). Isso causa <strong>Inverse Ghosting</strong> (um rastro branco brilhante horrível).
            <br/>Geralmente a configuração média ("Fast" ou "Normal") é a melhor.
            <br/>Teste em <strong>testufo.com</strong> e veja qual deixa os OVNIs mais nítidos.
        </p>
      `
        },
        {
            title: "Capítulo 3: DyAc / ELMB (Black Frame Insertion)",
            content: `
        <p class="mb-4 text-gray-300">
            Tecnologias de "Strobing" (Zowie DyAc, Asus ELMB) piscam a luz de fundo preto entre cada frame.
            <br/>Isso limpa a visão de forma absurda (CRT feelings).
            <br/>Custo: O brilho da tela cai pela metade.
            <br/>Para CS2/Valorant, vale MUITO a pena. Você vê o inimigo nítido enquanto gira a câmera.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: G-Sync/FreeSync vs Input Lag",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>G-Sync On:</strong> Imagem lisa, sem cortes (tearing). Adiciona ~1ms de input lag (se configurado certo com FPS Cap -3).
            - <strong>G-Sync Off:</strong> Latência bruta mínima. Tem tearing (imagem cortada). Pros preferem OFF.
            <br/>Se você tem 360Hz, o tearing é quase invisível. Pode deixar OFF.
            <br/>Se tem 144Hz, talvez prefira ON.
        </p>
      `
        },
        {
            title: "Capítulo 5: Calibração de Cores (ICC)",
            content: `
        <p class="mb-4 text-gray-300">
            Monitores gamer vêm com cores lavadas.
            <br/>Baixe o perfil ICC do seu modelo no site Rtings ou TFTCentral.
            <br/>Aplique no "Gerenciamento de Cores" do Windows.
            <br/>Em jogos competitivos, aumente o <strong>Digital Vibrance</strong> (Nvidia) ou <strong>Saturation</strong> (AMD) para 70-80% para ver inimigos mais fácil.
        </p>
      `
        },
        {
            title: "Capítulo 6: Black Equalizer / Shadow Boost",
            content: `
        <p class="mb-4 text-gray-300">
            Função que clareia apenas as áreas escuras da tela.
            <br/>Ótimo para ver campers no escuro em COD/Tarkov.
            <br/>Péssimo para filmes (o preto vira cinza). Ative só ao jogar.
        </p>
      `
        },
        {
            title: "Capítulo 7: Monitor de 24.5'' ou 27''?",
            content: `
        <p class="mb-4 text-gray-300">
            Para 1080p competitivo: 24.5 polegadas é o limite. 27 polegadas em 1080p fica pixelado (baixa PPI), ruim para ver cabeças de longe.
            <br/>Para 1440p: 27 polegadas é o ideal.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Taxa de Contraste (IPS vs TN vs OLED)",
            content: `
            <p class="mb-4 text-gray-300">
                - <strong>TN:</strong> Rápido, cores ruins. (Old School Pro).
                - <strong>IPS:</strong> Cores lindas, velocidade boa. (Padrão 2026).
                - <strong>OLED:</strong> Velocidade INSTANTÂNEA (0.03ms), contraste infinito. O melhor dos mundos, mas caro e pode ter burn-in com HUDs estáticos.
            </p>
            `
        },
        {
            title: "Capítulo 9: Limpeza da Tela",
            content: `
            <p class="mb-4 text-gray-300">
                Apenas pano de microfibra levemente úmido com água destilada. NUNCA use álcool ou Vidrex. Remove a película anti-reflexo.
            </p>
            `
        },
        {
            title: "Capítulo 10: CRU (Custom Resolution Utility)",
            content: `
            <p class="mb-4 text-gray-300">
                Se seu monitor suporta, você pode fazer Overclock nele (ex: de 144Hz para 165Hz) usando o CRU. Risco baixo, mas teste estabilidade.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Cabo HDMI suporta 240Hz?",
            answer: "Só HDMI 2.0 ou 2.1. O HDMI 1.4 comum trava em 120Hz ou 144Hz. DisplayPort é sempre mais seguro para PC."
        },
        {
            question: "Dead Pixel (Ponto morto)?",
            answer: "Pressione levemente com um pano macio (massagem) ou use vídeos de pixels piscantes (Epilepsy Warning) por 1 hora. Às vezes o pixel 'acorda'."
        }
    ];

    const externalReferences = [
        { name: "TestUFO (Ghosting Test)", url: "https://www.testufo.com/" },
        { name: "Rtings (ICC Profiles)", url: "https://www.rtings.com/monitor" }
    ];

    const relatedGuides = [
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Nvidia",
            description: "G-Sync setup."
        },
        {
            href: "/guias/hdr-windows-11-calibracao-jogos",
            title: "HDR",
            description: "Calibração."
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
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            externalReferences={externalReferences}
        />
    );
}
