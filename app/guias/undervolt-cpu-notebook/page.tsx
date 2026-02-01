import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Undervolt em Notebooks: Reduza 10°C em 5 Minutos - Voltris";
const description = "Seu notebook esquenta e faz barulho? Aprenda a fazer Undervolt seguro com Throttlestop para baixar a temperatura sem perder performance.";
const keywords = ['undervolt notebook', 'throttlestop tutorial', 'notebook esquentando', 'reduzir temperatura cpu', 'undervolt intel'];

export const metadata: Metadata = createGuideMetadata('undervolt-cpu-notebook', title, description, keywords);

export default function UndervoltGuide() {
    const summaryTable = [
        { label: "Risco", value: "Baixo" },
        { label: "Resultado", value: "-10°C a -15°C" },
        { label: "Software", value: "Throttlestop" }
    ];

    const contentSections = [
        {
            title: "O que é Undervolt?",
            content: `
        <p class="mb-4">Processadores vêm de fábrica recebendo mais voltagem do que precisam (para garantir estabilidade em qualquer chip). O Undervolt remove esse excesso. O chip trabalha igual, mas esquenta menos.</p>
        <p class="text-green-400 font-bold mb-4">Menos Calor = Menos Barulho = Mais Bateria.</p>
      `,
            subsections: []
        },
        {
            title: "Configurando o Throttlestop (Intel)",
            content: `
        <ol class="space-y-4 text-gray-300 list-decimal list-inside ml-4">
            <li>Baixe o Throttlestop.</li>
            <li>Clique no botão <strong>FIVR</strong>.</li>
            <li>Marque "Unlock Adjustable Voltage" (se disponível).</li>
            <li>Em "CPU Core", reduza o "Offset Voltage" para <strong>-50mV</strong>.</li>
            <li>Faça o mesmo em "CPU Cache".</li>
            <li>Clique em Apply e rode um teste (TS Bench).</li>
            <li>Se não travar, tente -80mV, depois -100mV... até o PC reiniciar (o limite varia por chip).</li>
        </ol>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 minutos"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
