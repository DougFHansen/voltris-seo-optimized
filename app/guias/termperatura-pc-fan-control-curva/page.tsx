import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'termperatura-pc-fan-control-curva',
    title: "Temperatura e Fan Control: Como Evitar Thermal Throttling",
    description: "Seu PC fica lento depois de 30min jogando? Deve ser calor. Aprenda a monitorar temperaturas com HWMonitor e criar curvas de ventoinha customizadas com FanControl.",
    category: 'hardware',
    difficulty: 'Intermediário',
    time: '25 min'
};

const title = "Controle de Temperatura (2026): Silêncio vs Performance";
const description = "O Thermal Throttling é o assassino silencioso de FPS. Se sua CPU bate 95°C, ela reduz a velocidade pela metade para não queimar. Resolva isso agora.";

const keywords = [
    'como usar fan control github tutorial',
    'cpu 90 graus é normal jogando',
    'thermal throttling o que é',
    'curva de fan ideal processador',
    'fan case setup pressure positive negative',
    'hwmonitor como ver temperatura',
    'notebook esquentando muito o que fazer',
    'voltris optimizer cooling',
    'pump speed aio water cooler'
];

export const metadata: Metadata = createGuideMetadata('termperatura-pc-fan-control-curva', title, description, keywords);

export default function TempGuide() {
    const summaryTable = [
        { label: "Software", value: "FanControl (GitHub)" },
        { label: "Monitor", value: "HWMonitor / HWiNFO" },
        { label: "CPU Max", value: "85°C (Seguro)" },
        { label: "GPU Max", value: "80°C (Seguro)" },
        { label: "Hotspot", value: "100°C (Limite)" },
        { label: "Idle Temp", value: "35-45°C" },
        { label: "Pasta Térmica", value: "Trocar a cada 2 anos" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Inimigo Invisível",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O PC não avisa "estou quente". Ele simplesmente começa a travar. Quando a CPU atinge 95°C (Intel) ou 90°C (Ryzen), o clock cai de 5.0GHz para 3.5GHz. Isso se chama Throttling.
        </p>
      `
        },
        {
            title: "Capítulo 1: Monitoramento (Diagnóstico)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">HWMonitor</h4>
                <p class="text-gray-400 text-xs text-justify">
                    1. Baixe e rode o <strong>CPUID HWMonitor</strong>.
                    <br/>2. Jogue por 20 minutos.
                    <br/>3. Dê Alt-Tab e olhe a coluna "Max".
                    <br/>- <strong>CPU Package:</strong> Se > 90°C, problema.
                    <br/>- <strong>GPU Hotspot:</strong> Se > 105°C, problema na pasta térmica da placa.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: FanControl (A Melhor Ferramenta)",
            content: `
        <p class="mb-4 text-gray-300">
            Esqueça a BIOS. Use o <strong>FanControl</strong> (open-source).
            <br/>Ele detecta todas as ventoinhas do PC e permite criar curvas mistas.
            <br/>Exemplo: Você pode fazer a ventoinha do gabinete acelerar baseado na temperatura MAX entre (CPU e GPU). Assim, se QUALQUER UM esquentar, o ar circula.
        </p>
      `
        },
        {
            title: "Capítulo 3: Criando a Curva Ideal",
            content: `
        <p class="mb-4 text-gray-300">
            - Até 50°C: 30% ou 0% (Silêncio).
            - Em 70°C: 60% (Audível mas aceitável).
            - Em 85°C: 100% (Modo turbina de emergência).
            <br/>Ative a "Hysteresis" (Delay). Isso impede que a ventoinha fique oscilando (Womm... Womm...) se a temperatura pula de 69°C para 71°C rápido.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Fluxo de Ar (Airflow)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Pressão Positiva:</strong> Mais ar entrando do que saindo. Bom para evitar poeira (o ar sai pelas frestas).
            - <strong>Configuração Padrão:</strong> Fans da Frente/Baixo jogam ar para DENTRO. Fans de Trás/Topo jogam ar para FORA (ar quente sobe).
            - CPU Air Cooler: A ventoinha deve soprar EM DIREÇÃO ao dissipador e para trás do gabinete.
        </p>
      `
        },
        {
            title: "Capítulo 5: AIO Water Cooler (Bomba)",
            content: `
        <p class="mb-4 text-gray-300">
            A bomba (Pump) do Water Cooler deve rodar sempre a 100% ou perto disso. Ela não faz barulho e precisa circular a água.
            <br/>Só regule a velocidade das ventoinhas do radiador.
            <br/>Se a bomba parar, a CPU vai a 100°C em 5 segundos.
        </p>
      `
        },
        {
            title: "Capítulo 6: Pasta Térmica e VRAM",
            content: `
        <p class="mb-4 text-gray-300">
            Pasta térmica resseca. Se seu PC tem 3 anos e esquenta muito, troque a pasta.
            <br/>Em GPUs, use Thermal Pads nos chips de VRAM. Memórias GDDR6X (RTX 3070ti+) chegam a 110°C fácil se o pad for ruim.
        </p>
      `
        },
        {
            title: "Capítulo 7: Undervolt (Melhor que Fans)",
            content: `
        <p class="mb-4 text-gray-300">
            A forma mais eficiente de baixar temperatura não é aumentar a fan para 100% (barulho), é fazer Undervolt na CPU/GPU.
            <br/>Menos Volts = Menos Watts = Menos Calor.
            <br/>Veja nossos guias de Afterburner e BIOS para isso.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Limpeza de Poeira",
            content: `
            <p class="mb-4 text-gray-300">
                Poeira nos filtros bloqueia o ar. Seu PC sufoca.
                <br/>Limpe os filtros de poeira a cada 3 meses.
                <br/>Use ar comprimido para limpar as aletas do dissipador.
            </p>
            `
        },
        {
            title: "Capítulo 9: Temperatura Ambiente",
            content: `
            <p class="mb-4 text-gray-300">
                Se seu quarto faz 40°C no verão, seu PC vai sofrer.
                <br/>A temperatura do PC é sempre Ambiente + Delta.
                <br/>Não adianta ter o melhor cooler se o ar que entra já está quente. Abra a janela ou ligue o ar condicionado.
            </p>
            `
        },
        {
            title: "Capítulo 10: Notebooks e Bases",
            content: `
            <p class="mb-4 text-gray-300">
                Notebooks Gamer PRECISAM de base refrigerada ou pelo menos levantar a traseira com um livro (não tampe a entrada de ar).
                <br/>5cm de espaço embaixo reduzem 5°C.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Qual a temperatura perigosa?",
            answer: "CPU acima de 100°C desliga o PC. GPU acima de 95°C. Tente manter CPU < 80°C e GPU < 75°C para longevidade."
        },
        {
            question: "FanControl não detecta minhas fans?",
            answer: "Algumas controladoras proprietárias (Corsair iCUE, NZXT CAM) não deixam softwares terceiros lerem. Você terá que usar o software bloatware deles ou conectar as fans direto na placa-mãe."
        },
        {
            question: "Líquido do Water Cooler vaza?",
            answer: "AIOs modernos são selados e muito seguros. Falha na bomba é 100x mais comum que vazamento."
        }
    ];

    const externalReferences = [
        { name: "FanControl Download", url: "https://getfancontrol.com/" },
        { name: "HWMonitor Download", url: "https://www.cpuid.com/softwares/hwmonitor.html" }
    ];

    const relatedGuides = [
        {
            href: "/guias/msi-afterburner-overclock-undervolt-guia",
            title: "Afterburner",
            description: "Curva de fan da GPU."
        },
        {
            href: "/guias/notebook-gamer-bateria-otimizacao",
            title: "Notebook",
            description: "Dicas específicas."
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
