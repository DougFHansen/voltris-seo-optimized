import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'monitor-hz-configuracao-correta',
    title: "Monitor Ultimate Guide 2026: Hz, Overclock e Motion Blur Reduction",
    description: "Seu monitor de 144Hz pode estar rodando a 60Hz. Aprenda a verificar, fazer overclock com CRU, configurar DyAc/ELMB e calibrar cores para vantagem competitiva.",
    category: 'hardware',
    difficulty: 'Intermediário',
    time: '40 min'
};

const title = "Engenharia de Displays (2026): Hz, Strobing e Latência Zero";
const description = "Comprar um monitor 240Hz não te faz pro player. Configurar ele corretamente sim. Um guia científico sobre Motion Clarity, Pixel Response Times e Overdrive.";

const keywords = [
    'monitor 144hz rodando a 60hz fix',
    'como fazer overclock monitor cru custom resolution utility',
    'dyac benq vs elmb asus vs ulmb 2 nvidia',
    'painel tn vs ips vs oled input lag',
    'teste ufo ghosting overshoot fix',
    'calibrar cores monitor jogos competitivo',
    'displayport 1.4 vs hdmi 2.1 largura de banda',
    'hdr windows 11 jogos cores lavadas',
    'setup dois monitores hz diferentes lag',
    'tempo de resposta gtg vs mprt diferenca'
];

export const metadata: Metadata = createGuideMetadata('monitor-hz-configuracao-correta', title, description, keywords);

export default function MonitorGuide() {
    const summaryTable = [
        { label: "Ferramenta", value: "UFO Test / CRU" },
        { label: "Cabo", value: "DisplayPort (Sempre)" },
        { label: "Overdrive", value: "Normal/Fast (Nunca Extreme)" },
        { label: "Strobing", value: "Ligado (Apenas em FPS)" },
        { label: "Cor", value: "Digital Vibrance 70%" },
        { label: "HDR", value: "Desligado (Para Competição)" },
        { label: "Limpeza", value: "Apenas Água Destilada" }
    ];

    const contentSections = [
        {
            title: "Introdução: Hertz não é tudo",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Muitos gamers gastam R$ 3.000 em um monitor 240Hz, conectam o cabo HDMI antigo e jogam a 60Hz por anos sem saber. Pior ainda: ativam o modo "Overdrive Extreme" achando que estão ganhando performance, mas estão criando um rastro de "Inverse Ghosting" que piora a mira.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Neste guia enciclopédico, vamos calibrar seu monitor com ferramentas profissionais (TestUFO) e softwares de engenharia (CRU) para garantir que cada pixel troque de cor no tempo certo.
        </p>
      `
        },
        {
            title: "Capítulo 1: O Básico Bem Feito (Hz Real)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-5 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-2">Checklist de Ouro</h4>
                <ol class="list-decimal list-inside text-gray-400 text-sm space-y-2">
                    <li>Use o cabo <strong>DisplayPort</strong> que veio na caixa. (HDMI antigo limita Hz).</li>
                    <li>No Windows: Configurações > Sistema > Tela > Exibição Avançada > <strong>Taxa de atualização</strong>. Mude de 60Hz para o máximo.</li>
                    <li>No Monitor (Botões físicos): Desative o "Eco Mode" ou "Power Saving". Esses modos limitam o brilho e às vezes o Hz.</li>
                </ol>
                <div class="mt-4 bg-gray-800 p-3 rounded text-center">
                    <p class="text-white text-sm">Teste agora: <a href="https://www.testufo.com" target="_blank" class="text-blue-400 underline">testufo.com</a></p>
                    <p class="text-xs text-gray-500">Se aparecer "60 fps" no site e seu monitor é 144Hz, algo está errado.</p>
                </div>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Overdrive e Ghosting (Ajuste Fino)",
            content: `
        <p class="mb-4 text-gray-300">
            Monitores LCD demoram para mudar a cor do pixel (GtG - Gray to Gray). O "Overdrive" aplica uma voltagem extra para acelerar isso.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-black/40 p-3 rounded border border-white/10">
                <h5 class="text-white font-bold text-sm">Overdrive: Desligado</h5>
                <p class="text-gray-400 text-xs">Muitos borrões (Ghosting). O rastro segue o movimento.</p>
            </div>
            <div class="bg-emerald-900/40 p-3 rounded border border-emerald-500">
                <h5 class="text-emerald-400 font-bold text-sm">Overdrive: Normal/Fast</h5>
                <p class="text-gray-300 text-xs"><strong>Ponto Doce.</strong> Nitidez boa sem artefatos.</p>
            </div>
            <div class="bg-red-900/40 p-3 rounded border border-red-500">
                <h5 class="text-red-400 font-bold text-sm">Overdrive: Extreme</h5>
                <p class="text-gray-300 text-xs text-red-300"><strong>PERIGO.</strong> Causa "Inverse Ghosting" (Corona). Um rastro branco brilhante aparece atrás dos objetos. Piora a precisão em FPS.</p>
            </div>
        </div>
        <p class="mt-4 text-gray-300 text-sm">
            Vá no menu do monitor e teste as opções "Trace Free", "Response Time" ou "Overdrive" enquanto olha o site TestUFO. Escolha a que deixa o OVNI mais nítido sem criar rastro branco.
        </p>
      `
        },
        {
            title: "Capítulo 3: Strobing (DyAc, ELMB, ULMB)",
            content: `
        <p class="mb-4 text-gray-300">
            A tecnologia secreta dos Pros de CS2. O monitor pisca a luz de fundo (backlight) preto entre cada frame para limpar a persistência de visão na sua retina.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>BenQ:</strong> DyAc / DyAc+ (O melhor do mercado).</li>
            <li><strong>ASUS:</strong> ELMB (Extreme Low Motion Blur).</li>
            <li><strong>Nvidia:</strong> ULMB 2 (Ultra Low Motion Blur).</li>
        </ul>
        <p class="mt-2 text-gray-300 text-sm bg-blue-900/20 p-3 rounded">
            <strong>Veredito:</strong> LIGUE para CS, Valorant e R6. A imagem fica um pouco mais escura, mas a clareza de movimento é CRT-Level (como monitores de tubo antigos). Para jogos Single Player, desligue, pois pode causar dor de cabeça (PWM flickering).
        </p>
      `
        },
        {
            title: "Capítulo 4: Tecnologias de Painel (TN vs IPS vs OLED)",
            content: `
        <p class="mb-4 text-gray-300">
            Qual a diferença real em 2026?
        </p>
        <table class="w-full text-sm text-left text-gray-400">
            <thead class="text-xs text-gray-200 uppercase bg-gray-800">
                <tr>
                    <th class="px-4 py-2">Painel</th>
                    <th class="px-4 py-2">Velocidade</th>
                    <th class="px-4 py-2">Cores</th>
                    <th class="px-4 py-2">Uso Ideal</th>
                </tr>
            </thead>
            <tbody>
                <tr class="bg-gray-900 border-b border-gray-800">
                    <td class="px-4 py-2 font-bold text-yellow-400">TN</td>
                    <td class="px-4 py-2">Ultra Rápido</td>
                    <td class="px-4 py-2">Ruim (Lavadas)</td>
                    <td class="px-4 py-2">Apenas CS2/Valorant Pro</td>
                </tr>
                <tr class="bg-gray-900 border-b border-gray-800">
                    <td class="px-4 py-2 font-bold text-blue-400">IPS</td>
                    <td class="px-4 py-2">Muito Rápido</td>
                    <td class="px-4 py-2">Excelentes</td>
                    <td class="px-4 py-2">O melhor All-Rounder</td>
                </tr>
                <tr class="bg-gray-900 border-b border-gray-800">
                    <td class="px-4 py-2 font-bold text-purple-400">OLED</td>
                    <td class="px-4 py-2">Instantâneo (0.03ms)</td>
                    <td class="px-4 py-2">Perfeitas (HDR)</td>
                    <td class="px-4 py-2">O futuro (mas caro)</td>
                </tr>
            </tbody>
        </table>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 5: Overclock de Monitor (CRU)",
            content: `
        <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
            <h4 class="text-orange-400 font-bold mb-4 text-xl">Custom Resolution Utility (Hacking)</h4>
            <p class="text-gray-300 mb-4">
                Você pode forçar seu monitor de 60Hz para 75Hz, ou 144Hz para 165Hz. É seguro (o monitor apenas mostra "Out of Range" se não aguentar).
            </p>
            <ol class="list-decimal list-inside text-gray-300 text-sm space-y-2">
                <li>Baixe o <strong>CRU (Custom Resolution Utility)</strong>.</li>
                <li>Abra, selecione seu monitor.</li>
                <li>Em "Detailed Resolutions", clique em Edit.</li>
                <li>Mude o "Refresh Rate" em passos de 5Hz (ex: 60 -> 65 -> 70).</li>
                <li>Dê OK e rode o "restart64.exe" incluso no CRU para reiniciar o driver.</li>
                <li>Vá nas configs do Windows e tente aplicar o novo Hz. Se a tela ficar preta, espere 15s que volta. Se funcionar, suba mais.</li>
            </ol>
            <p class="mt-2 text-xs text-gray-500">
                Muitos painéis de laptop 60Hz chegam a 90Hz facilmente com esse método.
            </p>
        </div>
      `
        },
        {
            title: "Capítulo 6: Calibração de Cores (ICC Profiles)",
            content: `
        <p class="mb-4 text-gray-300">
            Baixar um perfil ICC do site "Rtings" ou "TFTCentral" para seu modelo específico pode corrigir o tom amarelado/azulado de fábrica.
            <br/>Para instalar: Digite "Gerenciamento de Cores" no Windows > Adicionar > Selecione o arquivo .icm > Definir como Perfil Padrão.
        </p>
      `
        },
        {
            title: "Capítulo 7: Cabos e Bandwidth",
            content: `
        <p class="mb-4 text-gray-300">
            Por que usar DisplayPort?
            <br/>- HDMI 1.4 (Comum): Max 144Hz em 1080p.
            <br/>- HDMI 2.0: Max 240Hz em 1080p.
            <br/>- <strong>DisplayPort 1.2/1.4:</strong> Suporta G-Sync (HDMI geralmente não suporta G-Sync Compatible oficial, apenas FreeSync via HDMI que é inferior).
            <br/>Sempre priorize a porta DisplayPort da sua GPU.
        </p>
      `
        },
        {
            title: "Capítulo 8: Dual Monitor Setup (O Mito)",
            content: `
        <p class="mb-4 text-gray-300">
            <em>"Ter um monitor 144Hz e um 60Hz buga o sistema?"</em>
            <br/>Antigamente (Windows 7/10 antigo), sim. O DWM travava o Hz do monitor rápido para 60Hz se tivesse animação no monitor lento (ex: OBS/Twitch).
            <br/>No <strong>Windows 10 (20H2+) e Windows 11</strong>, isso foi corrigido com o "Multiplane Overlay". Você pode rodar Hz misturados sem problemas hoje em dia. Apenas garanta que o jogo esteja em "Tela Cheia Exclusiva" ou "Borderless Otimizado".
        </p>
      `
        },
        {
            title: "Capítulo 9: HDR no Windows",
            content: `
        <p class="mb-4 text-gray-300">
            A menos que você tenha um monitor <strong>OLED</strong> ou <strong>Mini-LED</strong> caro (R$ 5.000+), <strong>DESLIGUE O HDR</strong>.
            <br/>Monitores IPS/VA "HDR400" comuns não têm brilho suficiente nem Local Dimming. Ao ligar o HDR, o Windows lava as cores e deixa o preto cinza. HDR barato é pior que SDR bem calibrado.
        </p>
      `
        },
        {
            title: "Capítulo 10: Cuidados e Limpeza",
            content: `
        <p class="mb-4 text-gray-300">
            Nunca use álcool, Veja ou limpa-vidros. Isso destrói a camada anti-reflexo do monitor (a tela fica manchada para sempre).
            <br/><strong>Método Correto:</strong> Pano de microfibra limpo + Água Destilada (ou filtrada). Umedeça o pano (não encharque), passe suavemente. Use outro pano seco para finalizar.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Voltris Display Tools",
            content: `
            <p class="mb-4 text-gray-300">
                O <strong>Voltris Optimizer</strong> inclui uma ferramenta de "Monitor Diagnostics" que verifica Dead Pixels, Backlight Bleed e uniformidade de cor, além de aplicar perfis de cores otimizados para eSports automaticamente.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Curvo vs Plano?",
            answer: "Painel Curvo (1000R/1500R) é imersivo para jogos de história e simulação, mas muitos pro players de FPS preferem Plano. A curva pode distorcer linhas retas (como miras de sniper) na visão periférica. É preferência pessoal, mas Plano é o padrão de campeonatos."
        },
        {
            question: "24 polegadas vs 27 polegadas?",
            answer: "Para 1080p, fique em 24/25 polegadas. Em 27 polegadas, 1080p fica pixelado (PPI baixo). Se quer 27 polegadas, invista em um monitor 1440p (QHD)."
        },
        {
            question: "G-Sync Compatible vs G-Sync Nativo?",
            answer: "Nativo tem um chip físico dentro do monitor da Nvidia (mais caro). Compatible usa o padrão VESA Adaptive Sync (FreeSync). Hoje em dia, a diferença de performance é mínima. Compatible funciona perfeitamente bem."
        }
    ];

    const externalReferences = [
        { name: "BlurBusters UFO Test", url: "https://www.testufo.com/" },
        { name: "Rtings Monitor Reviews (ICC Profiles)", url: "https://www.rtings.com/monitor" },
        { name: "Custom Resolution Utility (CRU)", url: "https://www.monitortests.com/forum/Thread-Custom-Resolution-Utility-CRU" }
    ];

    const relatedGuides = [
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Guia Nvidia",
            description: "Configure G-Sync no driver."
        },
        {
            href: "/guias/g-sync-freesync-configuracao-correta",
            title: "G-Sync Deep Dive",
            description: "Entenda a matemática da sincronia."
        },
        {
            href: "/guias/mouse-dpi-polling-rate-ideal",
            title: "Input Lag",
            description: "O monitor é apenas metade da equação."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="40 min"
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
