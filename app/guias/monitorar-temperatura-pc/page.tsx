import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Monitorar a Temperatura do PC e Notebook (Guia 2026)";
const description = "Seu PC está esquentando demais? Aprenda a monitorar as temperaturas da CPU e GPU, entenda os limites seguros e saiba quando é hora de limpar em 2026.";
const keywords = [
    'como ver temperatura do pc windows 11 2026',
    'temperatura ideal cpu e gpu para jogar tutorial',
    'melhor programa para ver graus do processador gratuito',
    'notebook esquentando muito o que fazer guia 2026',
    'limites de temperatura ryzen e intel 2026'
];

export const metadata: Metadata = createGuideMetadata('monitorar-temperatura-pc', title, description, keywords);

export default function TemperatureGuide() {
    const summaryTable = [
        { label: "Software #1", value: "Core Temp (Simples / Leve)" },
        { label: "Software #2", value: "HWiNFO64 (Completo / Avançado)" },
        { label: "Temp. Ideal (Carga)", value: "65ºC a 80ºC" },
        { label: "Temp. Perigosa", value: "Acima de 90ºC" }
    ];

    const contentSections = [
        {
            title: "O Calor é o inimigo nº 1 do seu PC",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, com processadores cada vez mais potentes em espaços menores, o calor é o principal causador de lentidão (Thermal Throttling) e desligamentos inesperados. Monitorar a temperatura não é apenas para entusiastas; é uma manutenção preventiva que pode salvar o seu notebook ou placa de vídeo de uma queima prematura. Se o seu PC sopra um ar "vibrante" e barulhento, é hora de olhar os números.
        </p>
      `
        },
        {
            title: "1. Core Temp: Foco no Processador",
            content: `
        <p class="mb-4 text-gray-300">Se você quer apenas saber se o seu processador está fritando:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Baixe o <strong>Core Temp</strong> (gratuito).</li>
            <li>Ao abrir, ele mostrará a temperatura de cada núcleo (Core) do seu processador na barra de tarefas.</li>
            <li><strong>Dica:</strong> Se em repouso (apenas navegando) o PC estiver acima de 50ºC, sua pasta térmica pode estar seca ou o cooler mal encaixado.</li>
        </ol>
      `
        },
        {
            title: "2. HWiNFO64: A visão Raio-X",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Monitoramento Total:</h4>
            <p class="text-sm text-gray-300">
                O HWiNFO64 é essencial para quem usa notebooks gamer de 2026. Ele mostra a temperatura do <strong>Hotspot da GPU</strong> (o ponto mais quente do chip) e a temperatura da <strong>VRAM</strong>. Muitas vezes a placa de vídeo marca 70ºC, mas as memórias estão operando a 105ºC, o que causa artefatos e travamentos no jogo.
            </p>
        </div>
      `
        },
        {
            title: "3. Qual é a Temperatura Segura em 2026?",
            content: `
        <p class="mb-4 text-gray-300">
            Cada geração de hardware tem seus limites, mas aqui está a regra geral para 2026:
            <br/>- <strong>Idle (Parado):</strong> 35ºC a 50ºC.
            <br/>- <strong>Jogando (Gaming):</strong> 65ºC a 82ºC.
            <br/>- <strong>Limite de Alerta:</strong> 90ºC para CPUs e 85ºC para GPUs.
            <br/>Se o seu notebook atingir 95ºC com frequência, o sistema vai reduzir a velocidade de processamento para não derreter, fazendo seu jogo travar (drop de frames).
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/limpeza-fisica-pc-gamer",
            title: "Limpeza Física",
            description: "Abaixe a temperatura limpando o pó."
        },
        {
            href: "/guias/importancia-pasta-termica-pc",
            title: "Pasta Térmica",
            description: "Quando e como trocar a pasta."
        },
        {
            href: "/guias/monitoramento-sistema",
            title: "Monitorar Sistema",
            description: "Veja temperatura e FPS ao mesmo tempo."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
