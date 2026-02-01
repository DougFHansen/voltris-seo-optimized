import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Webcam Piscando ou Tela Preta? Guia de Reparo Rápido - Voltris";
const description = "Sua câmera liga e desliga sozinha? Pode ser falta de luz (60Hz vs 50Hz) ou driver genérico. Veja como consertar Logitech, Redragon e genéricas.";
const keywords = ['webcam piscando', 'webcam tela preta', 'webcam flickers fix', 'configurar 60hz webcam', 'driver camera windows'];

export const metadata: Metadata = createGuideMetadata('webcam-piscando-tela-preta-fix', title, description, keywords);

export default function WebcamGuide() {
    const summaryTable = [
        { label: "Causa Comum", value: "Frequência de Luz" },
        { label: "Padrão BR", value: "60Hz" }
    ];

    const contentSections = [
        {
            title: "O Segredo dos 60Hz",
            content: `
        <p class="mb-4">No Brasil, a energia elétrica oscila a 60Hz. Se sua webcam estiver configurada para 50Hz (padrão Europa), a luz do seu quarto vai "brigar" com o obturador da câmera, causando piscadas.</p>
        <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4">
            <li>Abra o software da câmera (Logitech G Hub, OBS, ou o app Câmera do Windows).</li>
            <li>Procure por "Anti-Flicker" ou "Correção de Cintilação".</li>
            <li>Mude para <strong>60Hz</strong> ou NTSC.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Tela Preta (Permissões)",
            content: `
        <p class="text-gray-300">Se a tela fica preta, o Windows pode estar bloqueando o acesso por privacidade. Vá em Configurações > Privacidade e Segurança > Câmera > Ative <strong>"Permitir que os aplicativos acessem sua câmera"</strong>.</p>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="5 minutos"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
        />
    );
}
