import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'hdr-windows-11-calibracao-jogos',
    title: "HDR no Windows 11 (2026): Guia de Calibração e Cores Reais",
    description: "O HDR deixa seu jogo lavado e cinza? O problema não é o Windows, é a configuração. Aprenda a usar o HDR Calibration App e configurar Auto-HDR para jogos antigos.",
    category: 'windows',
    difficulty: 'Intermediário',
    time: '25 min'
};

const title = "HDR Gaming (2026): Cores Vivas e Realismo";
const description = "O HDR bem configurado é mais impactante que Ray Tracing. Mas se você tem um monitor 'HDR400' barato ou não calibrou, fica horrível. Vamos resolver.";

const keywords = [
    'hdr windows 11 cores lavadas fix',
    'windows hdr calibration app tutorial',
    'auto hdr jogos antigos sdr',
    'monitor hdr400 vale a pena',
    'hdr ativado ou desativado em jogos competitivos',
    'oled burn-in hdr gaming',
    'configurar brilho nits hdr',
    'nvidia rtx hdr video',
    'voltris optimizer color profile',
    'dolby vision windows gaming'
];

export const metadata: Metadata = createGuideMetadata('hdr-windows-11-calibracao-jogos', title, description, keywords);

export default function HDRGuide() {
    const summaryTable = [
        { label: "Status", value: "ON (Se OLED/MiniLED)" },
        { label: "Status", value: "OFF (Se IPS Barato)" },
        { label: "Calibração", value: "App Oficial MS" },
        { label: "Auto HDR", value: "ON (SDR Games)" },
        { label: "Nits", value: "400 a 1000+" },
        { label: "SDR Brightness", value: "Ajustar Slider" },
        { label: "Bit Depth", value: "10-bit (Nvidia)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Mito do HDR Lavado",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Muitos gamers ativam o HDR e dizem: "Ficou cinza, sem contraste". Isso acontece porque o Windows tenta enviar um sinal de 1000 Nits para um monitor que só aguenta 300 Nits. O monitor "corta" os brancos e perde o preto. Calibração é a chave.
        </p>
      `
        },
        {
            title: "Capítulo 1: É HDR Real ou Fake?",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">DisplayHDR 400 (O Básico)</h4>
                <p class="text-gray-400 text-xs text-justify">
                    Presente na maioria dos monitores IPS "Gamer" baratos. Ele aceita o sinal HDR, mas não tem brilho suficiente nem Local Dimming.
                    <br/><strong>Veredito:</strong> Geralmente é melhor deixar <span class="text-red-400">DESLIGADO</span>. SDR com boas cores é melhor que HDR simulado ruim.
                </p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">HDR 600 / 1000 / True Black (OLED)</h4>
                <p class="text-gray-400 text-xs">
                    Monitores OLED (Samsung G8, Alienware) ou Mini-LED. Aqui o HDR brilha (literalmente). Mantenha <span class="text-emerald-400">LIGADO</span>.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Windows HDR Calibration App",
            content: `
        <p class="mb-4 text-gray-300">
            Baixe o app <strong>"Windows HDR Calibration"</strong> na Microsoft Store (Grátis).
            <br/>Execute-o. Siga os passos:
            <br/>1. Ajuste o preto até parar de ver as formas.
            <br/>2. Ajuste o branco até as formas sumirem (Clipping).
            <br/>Isso gera um perfil de cores que diz ao Windows EXATAMENTE o limite do seu monitor (ex: 450 nits), evitando a imagem lavada.
        </p>
      `
        },
        {
            title: "Capítulo 3: Auto HDR (Mágica)",
            content: `
        <p class="mb-4 text-gray-300">
            Configurações > Sistema > Tela > HDR.
            <br/>Ative <strong>"Auto HDR"</strong>.
            <br/>Isso usa inteligência artificial para injetar HDR em jogos antigos DirectX 11/12 (como Skyrim, GTA V, Rocket League).
            <br/>Funciona surpreendentemente bem, dando brilho a magias e explosões sem estragar a arte original.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Configuração de 10-bit (Nvidia)",
            content: `
        <p class="mb-4 text-gray-300">
            HDR exige 10 bits de cor para evitar "Color Banding" (faixas no céu).
            <br/>No Painel Nvidia > Mudar Resolução.
            <br/>Em "Profundidade de cor de saída", mude de 8 bpc para <strong>10 bpc</strong>.
            <br/>Se não aparecer, talvez você precise baixar a frequência (Hz) ou usar um cabo DisplayPort 1.4 melhor.
        </p>
      `
        },
        {
            title: "Capítulo 5: Slider de Brilho SDR",
            content: `
        <p class="mb-4 text-gray-300">
            Quando o HDR está ligado no Windows, o desktop (Chrome, Word) pode ficar escuro ou muito brilhante.
            <br/>Em Configurações > HDR, use o slider <strong>"Brilho de conteúdo SDR"</strong>.
            <br/>Ajuste para ficar confortável aos olhos para leitura. Isso não afeta o brilho dentro dos jogos.
        </p>
      `
        },
        {
            title: "Capítulo 6: RTX Video HDR",
            content: `
        <p class="mb-4 text-gray-300">
            Se você tem uma GPU RTX 30/40.
            <br/>No Painel Nvidia > Ajustar configurações de imagem de vídeo.
            <br/>Ative <strong>RTX Video HDR</strong>.
            <br/>Isso transforma qualquer vídeo do YouTube/Netflix (SDR) em HDR usando IA. Incrível para assistir animes e filmes antigos.
        </p>
      `
        },
        {
            title: "Capítulo 7: atalho Win+Alt+B",
            content: `
        <p class="mb-4 text-gray-300">
            O HDR às vezes buga ao sair de um jogo (tela fica estourada).
            <br/>Use o atalho <strong>Windows + Alt + B</strong>.
            <br/>Isso reinicia o driver de vídeo e liga/desliga o HDR instantaneamente sem precisar ir nos menus.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Jogos com HDR Nativo Quebrado",
            content: `
            <p class="mb-4 text-gray-300">
                Alguns jogos (Red Dead Redemption 2, Cyberpunk no lançamento) têm implementações HDR ruins.
                <br/>Nesses casos, às vezes o Auto HDR do Windows fica melhor que o HDR "Nativo" do jogo. Teste desligar o HDR no menu do jogo mas manter ligado no Windows.
            </p>
            `
        },
        {
            title: "Capítulo 9: HDMI 2.1 vs DP 1.4",
            content: `
            <p class="mb-4 text-gray-300">
                Para 4K 120Hz com HDR 10-bit, você precisa de largura de banda massiva.
                <br/>Use cabos <strong>HDMI 2.1</strong> certificados (Ultra High Speed). Cabos HDMI velhos vão piscar a tela ou limitar a 60Hz.
            </p>
            `
        },
        {
            title: "Capítulo 10: Print Screen no HDR",
            content: `
            <p class="mb-4 text-gray-300">
                Tirar prints com HDR ligado deixava as imagens estouradas.
                <br/>Use o <strong>Game Bar (Win+G)</strong> para tirar prints em formato JXR (HDR) ou PNG (Tone-mapped para SDR). O Print Screen padrão do teclado já melhorou no Windows 11 2025+, mas o Game Bar é mais confiável.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "HDR diminui FPS?",
            answer: "Marginalmente (1-2%). O processamento é feito no chip do monitor na maioria das vezes. O Auto HDR da Microsoft consome um pouco de GPU, mas insignificante em GPUs modernas."
        },
        {
            question: "Posso usar HDR em jogos competitivos (CS2)?",
            answer: "Pode, mas não recomendamos. HDR adiciona brilho intenso (Flashbangs cegam de verdade) e pode dificultar ver inimigos em sombras escuras. Pro players usam SDR com Digital Vibrance alto."
        },
        {
            question: "Meu monitor fica trocando de modo e a tela pisca.",
            answer: "Normal. É o monitor mudando o perfil de backlight de SDR para HDR ao entrar/sair de jogos. O atalho Win+Alt+B ajuda a gerenciar isso."
        }
    ];

    const externalReferences = [
        { name: "Windows HDR Calibration App", url: "https://apps.microsoft.com/store/detail/windows-hdr-calibration/9N7F2SM5D1LR" },
        { name: "DisplayHDR Tests", url: "https://displayhdr.org/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/monitor-hz-configuracao-correta",
            title: "Configurar Monitor",
            description: "Cores e Hz corretos."
        },
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Nvidia",
            description: "10-bit color tutorial."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Windows 11",
            description: "Sistema base para Auto HDR."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="25 min"
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
