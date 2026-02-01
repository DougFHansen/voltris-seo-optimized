import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Instalar Impressora Wi-Fi no Windows (Passo a Passo) - Voltris";
const description = "Aprenda a conectar e instalar qualquer impressora Wi-Fi (HP, Epson, Canon, Brother) no Windows. Solução de problemas de rede e drivers.";
const keywords = ['instalar impressora wifi', 'conectar impressora rede', 'hp smart', 'epson connect', 'impressora offline', 'driver impressora'];

export const metadata: Metadata = createGuideMetadata('instalar-impressora-wifi', title, description, keywords);

export default function ImpressoraGuide() {
    const contentSections = [
        {
            title: "Passo 1: Conectando a Impressora na Rede",
            content: `
        <p class="mb-4">Antes de mexer no PC, a impressora precisa estar no Wi-Fi.</p>
        <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
          <li><strong>Se tiver tela LCD:</strong> Vá em Configurações > Rede/Wi-Fi > Configurar > Selecione sua rede e digite a senha.</li>
          <li><strong>Se NÃO tiver tela (botão WPS):</strong> Aperte o botão WPS do seu Roteador. Em seguida, segure o botão Wi-Fi da impressora por 3 segundos. As luzes vão piscar e estabilizar quando conectar.</li>
        </ul>
      `
        },
        {
            title: "Passo 2: Adicionando no Windows",
            content: `
        <p class="mb-4">Com a impressora na rede:</p>
        <ol class="text-gray-300 list-decimal list-inside ml-4">
          <li>Vá em Configurações > Bluetooth e dispositivos > <strong>Impressoras e scanners</strong>.</li>
          <li>Clique em "Adicionar dispositivo".</li>
          <li>O Windows deve achar ela automaticamente. Clique em "Adicionar dispositivo".</li>
        </ol>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 minutos"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
        />
    );
}
