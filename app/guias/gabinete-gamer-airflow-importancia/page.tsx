import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Gabinete Gamer: A Importância do Airflow (Fluxo de Ar) - Voltris";
const description = "Vidro temperado na frente é bonito, mas frita seu PC. Aprenda a escolher gabinetes Mesh e posicionar ventoinhas para criar pressão positiva.";
const keywords = ['gabinete airflow', 'fluxo de ar pc', 'puxar ou empurrar ar', 'pressão positiva negativa', 'gabinete frente mesh'];

export const metadata: Metadata = createGuideMetadata('gabinete-gamer-airflow-importancia', title, description, keywords);

export default function AirflowGuide() {
    const contentSections = [
        {
            title: "Mesh vs Vidro (A batalha térmica)",
            content: `
        <p class="mb-4">Gabinetes com vidro na frente sufocam as ventoinhas. O ar não tem por onde entrar. Prefira gabinetes com frente em <strong>Mesh</strong> (Grade Furada).</p>
      `,
            subsections: []
        },
        {
            title: "Como Posicionar as Fans",
            content: `
        <ol class="space-y-4 text-gray-300 list-decimal list-inside ml-4">
            <li><strong>Frente:</strong> Jogando ar FRIO para DENTRO.</li>
            <li><strong>Traseira:</strong> Jogando ar QUENTE para FORA.</li>
            <li><strong>Topo:</strong> Jogando ar QUENTE para FORA (o ar quente sobe naturalmente).</li>
        </ol>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 minutos"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
        />
    );
}
