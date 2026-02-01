import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Wi-Fi Desconectando Sozinho? Desative a Economia de Energia - Voltris";
const description = "Se o seu Wi-Fi cai do nada e volta, o Windows pode estar desligando sua placa de rede. Aprenda a configurar o Plano de Energia para performance máxima.";
const keywords = ['wifi desconectando sozinho', 'internet cai toda hora', 'adaptador wifi desliga', 'configurar energia wifi', 'windows derruba wifi'];

export const metadata: Metadata = createGuideMetadata('wifi-desconectando-sozinho-windows', title, description, keywords);

export default function WifiDropGuide() {
    const contentSections = [
        {
            title: "O Problema Oculto",
            content: `
        <p class="mb-4">Por padrão, o Windows está configurado para desligar o adaptador Wi-Fi se ele achar que você não está usando muito a internet. Isso causa quedas em jogos.</p>
      `,
            subsections: []
        },
        {
            title: "Passo 1: Gerenciador de Dispositivos",
            content: `
        <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4">
            <li>Botão direito no Iniciar > Gerenciador de Dispositivos.</li>
            <li>Abra Adaptadores de Rede.</li>
            <li>Dois cliques na sua placa Wi-Fi (Intel, Realtek, Qualcomm).</li>
            <li>Aba <strong>Gerenciamento de Energia</strong>.</li>
            <li><strong>DESMARQUE</strong> "O computador pode desligar o dispositivo para economizar energia".</li>
        </ol>
      `
        },
        {
            title: "Passo 2: Plano de Energia",
            content: `
        <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4">
            <li>Digite "Editar Plano de Energia" no Iniciar.</li>
            <li>Clique em "Alterar configurações de energia avançadas".</li>
            <li>Abra "Configurações de Adaptadores Sem Fio" > "Modo de Economia de Energia".</li>
            <li>Mude para <strong>Desempenho Máximo</strong> (tanto na bateria quanto na tomada).</li>
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
