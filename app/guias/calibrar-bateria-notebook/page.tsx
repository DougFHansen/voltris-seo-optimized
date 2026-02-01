import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Bateria de Notebook Viciada? Como Calibrar e Cuidar - Voltris";
const description = "Seu notebook desliga com 20% de carga? Aprenda a calibrar a bateria e descubra se deixar o notebook ligado na tomada estraga a bateria em 2026.";
const keywords = ['calibrar bateria notebook', 'notebook na tomada vicia', 'bateria descarregando rapido', 'ciclos bateria notebook', 'limite carga bateria'];

export const metadata: Metadata = createGuideMetadata('calibrar-bateria-notebook', title, description, keywords);

export default function BatteryGuide() {
    const summaryTable = [
        { label: "Mito", value: "Tomada Vicia" },
        { label: "Realidade", value: "Calor Vicia" }
    ];

    const contentSections = [
        {
            title: "Como Calibrar (Resetar o Sensor)",
            content: `
        <p class="mb-4">Se o Windows diz 50% mas desliga em 5 minutos, o sensor está descalibrado.</p>
        <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4">
            <li>Carregue até 100%.</li>
            <li>Deixe na tomada por mais 2 horas (para garantir).</li>
            <li>Desligue da tomada e use até o notebook desligar sozinho (0%).</li>
            <li>Deixe ele desligado e sem carga por 2 horas.</li>
            <li>Carregue novamente até 100% sem ligar o notebook.</li>
            <li>Pronto. O Windows agora sabe onde é o 0 e onde é o 100 real.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Devo tirar da tomada?",
            content: `
        <p class="text-gray-300"><strong>Não.</strong> Notebooks modernos usam a energia direto da fonte quando estão cheios, poupando a bateria. O que mata a bateria é o calor. Se for jogar, mantenha na tomada.</p>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 minutos"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
