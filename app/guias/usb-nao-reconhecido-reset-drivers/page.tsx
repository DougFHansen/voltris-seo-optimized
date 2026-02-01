import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "USB Não Reconhecido (Código 43)? Resetar Controladores USB - Voltris";
const description = "O Windows mostra 'Dispositivo USB não reconhecido'? Não jogue o pen drive fora ainda. Aprenda a desinstalar o Root Hub e forçar a detecção.";
const keywords = ['usb nao reconhecido', 'erro codigo 43 usb', 'resetar portas usb', 'pen drive nao aparece', 'dispositivo desconhecido'];

export const metadata: Metadata = createGuideMetadata('usb-nao-reconhecido-reset-drivers', title, description, keywords);

export default function USBGuide() {
    const contentSections = [
        {
            title: "Descarregando a Energia Estática",
            content: `
        <p class="mb-4">Muitas vezes a porta USB trava por proteção de curto.</p>
        <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4">
            <li>Desligue o PC.</li>
            <li>Tire o cabo da tomada (fonte).</li>
            <li>Segure o botão Power por 30 segundos (isso drena toda a energia residual da placa-mãe).</li>
            <li>Ligue e teste. Funcionou em 50% dos casos.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Reinstalando o Controlador (Root Hub)",
            content: `
        <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4">
            <li>Abra o Gerenciador de Dispositivos.</li>
            <li>Expanda "Controladores USB".</li>
            <li>Clique com botão direito em <strong>USB Root Hub</strong> (todos eles) > Desinstalar dispositivo.</li>
            <li>Reinicie o PC. O Windows vai reinstalar os drivers do zero automaticamente.</li>
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
            difficultyLevel="Intermediário"
            contentSections={contentSections}
        />
    );
}
