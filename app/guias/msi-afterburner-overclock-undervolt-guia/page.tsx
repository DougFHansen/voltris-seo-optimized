import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'msi-afterburner-overclock-undervolt-guia',
    title: "MSI Afterburner (2026): Guia Seguro de Overclock e Undervolt",
    description: "Aumente o FPS da sua placa de vídeo grátis com Overclock ou reduza a temperatura em 10°C com Undervolt. Guia passo a passo para iniciantes.",
    category: 'hardware',
    difficulty: 'Avançado',
    time: '45 min'
};

const title = "MSI Afterburner: Overclock e Undervolt Seguro";
const description = "Extraia 10% a mais de performance da sua GPU ou faça ela rodar fria e silenciosa. O guia definitivo para Nvidia e AMD.";

const keywords = [
    'como fazer overclock gpu msi afterburner seguro',
    'undervolt rtx 3060 temperatura',
    'msi afterburner curva de ventoinha',
    'power limit gpu safe',
    'core clock vs memory clock fps',
    'kombustor stress test',
    'travando depois do overclock',
    'voltris optimizer gpu',
    'rtx 4060 undervolt tutorial'
];

export const metadata: Metadata = createGuideMetadata('msi-afterburner-overclock-undervolt-guia', title, description, keywords);

export default function AfterburnerGuide() {
    const summaryTable = [
        { label: "Software", value: "MSI Afterburner" },
        { label: "Stress Test", value: "Kombustor / Heaven" },
        { label: "Core Clock", value: "+50 a +150 MHz" },
        { label: "Memory Clock", value: "+200 a +1000 MHz" },
        { label: "Power Limit", value: "Máximo (Slider)" },
        { label: "Temp Limit", value: "83°C (Padrão)" },
        { label: "Undervolt", value: "Ctrl + F (Curva)" }
    ];

    const contentSections = [
        {
            title: "Introdução: Risco vs Recompensa",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Overclock de GPU hoje é muito seguro. As placas modernas têm travas de segurança que desligam o PC antes de queimar. O pior que acontece é o driver de vídeo reiniciar.
        </p>
      `
        },
        {
            title: "Capítulo 1: Preparação",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Passo a Passo</h4>
                <p class="text-gray-400 text-xs text-justify">
                    1. Baixe o <strong>MSI Afterburner</strong> (Site oficial da MSI ou Guru3D). Cuidado com sites falsos!
                    <br/>2. Baixe o <strong>MSI Kombustor</strong> ou <strong>Unigine Heaven</strong> para testar estabilidade.
                    <br/>3. Abra o Afterburner e aumente o <strong>Power Limit</strong> e <strong>Temp Limit</strong> para o máximo permitido. Isso diz para a placa: "Pode usar toda a energia que precisar".
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Overclock (Core Clock)",
            content: `
        <p class="mb-4 text-gray-300">
            Aumente o <strong>Core Clock (MHz)</strong> de 10 em 10.
            <br/>Rode o Kombustor por 1 minuto.
            <br/>Se não travar e não aparecerem artefatos (riscos coloridos na tela), aumente mais 10.
            <br/>Geralmente, +100MHz é seguro. +150MHz é sorte. +200MHz costuma travar.
            <br/>Ao achar o limite, volte uns 10MHz para ter margem de segurança.
        </p>
      `
        },
        {
            title: "Capítulo 3: Overclock (Memory Clock)",
            content: `
        <p class="mb-4 text-gray-300">
            Memória GDDR6 aguenta muito overclock.
            <br/>Comece com +200MHz. Vá subindo de 100 em 100.
            <br/>Muitas placas aguentam +500MHz ou até +1000MHz.
            <br/>Sintoma de erro de memória: Blocos pretos piscando ou textura corrompida. Se ver isso, diminua.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Undervolt (A Técnica Mágica)",
            content: `
        <p class="mb-4 text-gray-300">
            Undervolt mantém o mesmo clock (performance) usando menos voltagem.
            <br/>Resultado: Placa mais fria (-10°C) e ventoinhas mais silenciosas.
            <br/>1. Aperte <strong>Ctrl + F</strong> para abrir a curva de voltagem.
            <br/>2. Escolha uma voltagem (ex: 900mV).
            <br/>3. Suba o ponto dessa voltagem até a frequência desejada (ex: 1900MHz).
            <br/>4. Achate a curva depois desse ponto (linha reta).
            <br/>5. Aplique. Sua placa agora rodará a 1900MHz travado em 900mV, em vez de oscilar para 1050mV e esquentar.
        </p>
      `
        },
        {
            title: "Capítulo 5: Curva de Ventoinha (Fan Curve)",
            content: `
        <p class="mb-4 text-gray-300">
            Não deixe no Auto se sua placa esquenta.
            <br/>Em Settings > Fan: Habilite a curva personalizada.
            <br/>Configure para 100% de ventoinha quando bater 80°C.
            <br/>Configure 0% (Zero Frozr) abaixo de 40°C para silêncio total no desktop.
        </p>
      `
        },
        {
            title: "Capítulo 6: OSD (Monitoramento)",
            content: `
        <p class="mb-4 text-gray-300">
            Como ver FPS e temperatura dentro do jogo?
            <br/>Settings > Monitoring.
            <br/>Clique em "GPU Temperature" e marque "Show in On-Screen Display".
            <br/>Faça o mesmo para "Framerate" e "RAM Usage".
            <br/>Isso instala o RivaTuner automaticamente.
        </p>
      `
        },
        {
            title: "Capítulo 7: Startup (Iniciar com Windows)",
            content: `
        <p class="mb-4 text-gray-300">
            Só marque o botão "Startup" (Windows Logo) DEPOIS de testar seu overclock por dias em vários jogos.
            <br/>Se você marcar Startup numa configuração instável, seu PC vai travar assim que ligar (Loop de boot).
            <br/>Se isso acontecer, entre em Modo de Segurança e desinstale o Afterburner.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Laptop (Notebooks)",
            content: `
            <p class="mb-4 text-gray-300">
                Em notebooks, o Power Limit geralmente é travado pela BIOS.
                <br/>Você só consegue mexer no Core/Memory Clock.
                <br/>O Undervolt é AINDA MAIS IMPORTANTE em notebooks para evitar Thermal Throttling.
            </p>
            `
        },
        {
            title: "Capítulo 9: Nvidia vs AMD",
            content: `
            <p class="mb-4 text-gray-300">
                O Afterburner funciona em ambas. Mas para AMD, o software "Adrenalin" já tem tudo isso integrado na aba Tuning, sendo às vezes melhor de usar lá.
            </p>
            `
        },
        {
            title: "Capítulo 10: Perfil 2D/3D",
            content: `
            <p class="mb-4 text-gray-300">
                Você pode salvar perfis (1 a 5).
                <br/>Crie um Perfil 1 (Stock/Silencioso) para navegar na web.
                <br/>Crie um Perfil 2 (Overclock) para jogar.
                <br/>Use hotkeys para trocar rápido.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Overclock diminui a vida útil?",
            answer: "Teoricamente sim, por eletromigração. Na prática, em vez de durar 15 anos, sua placa dura 14 anos. Você vai trocá-la muito antes disso. O que mata placa é calor excessivo (90°C+), não frequência."
        },
        {
            question: "Tela piscou e resetou configuração?",
            answer: "O driver de vídeo crashou porque o overclock estava instável. O Windows recuperou sozinho. Reduza os clocks e tente de novo."
        },
        {
            question: "Garantia cobre OC?",
            answer: "Geralmente sim, se feito via software. Fabricantes como EVGA (RIP) e MSI incentivam. Não cobre se você alterar a BIOS da placa."
        }
    ];

    const externalReferences = [
        { name: "MSI Afterburner Official", url: "https://www.msi.com/Landing/afterburner/graphics-cards" },
        { name: "Unigine Heaven Benchmark", url: "https://benchmark.unigine.com/heaven" }
    ];

    const relatedGuides = [
        {
            href: "/guias/notebook-gamer-bateria-otimizacao",
            title: "Notebook",
            description: "Dicas térmicas."
        },
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Nvidia",
            description: "Complemento ideal."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="45 min"
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
