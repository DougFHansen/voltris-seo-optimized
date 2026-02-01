import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Testar Fonte de PC com Clipe ou Multímetro - Voltris";
const description = "Seu PC não liga? Aprenda a fazer o 'Teste do Clipe' para saber se a fonte queimou e como medir as voltagens de 12V, 5V e 3.3V com multímetro.";
const keywords = ['testar fonte pc', 'teste do clipe fonte', 'multimetro fonte pc', 'fonte queimada sintomas', 'pc nao liga fonte'];

export const metadata: Metadata = createGuideMetadata('testar-fonte-pc-multimetro', title, description, keywords);

export default function PSUGuide() {
    const summaryTable = [
        { label: "Risco", value: "Médio (Choque)" },
        { label: "Ferramenta", value: "Clipe de Papel" },
    ];

    const contentSections = [
        {
            title: "O Teste do Clipe (Jump Start)",
            content: `
        <p class="mb-4">Fontes ATX não ligam só de colocar na tomada, elas precisam do sinal da placa-mãe. Vamos simular esse sinal.</p>
        <div class="bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
            <p class="text-red-400 font-bold">Segurança</p>
            <p class="text-gray-300 text-sm">Faça isso com a fonte desconectada da tomada primeiro. Só ligue na tomada depois de encaixar o clipe.</p>
        </div>
        <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4">
            <li>Pegue o cabo principal de 24 pinos (o grandão).</li>
            <li>Localize o fio <strong>VERDE</strong> (único) e qualquer fio <strong>PRETO</strong> (terra).</li>
            <li>Desdobre um clipe de papel e enfie uma ponta no pino do fio Verde e a outra no fio Preto.</li>
            <li>Ligue a fonte na tomada.</li>
            <li>Se a ventoinha da fonte girar, ela está ligando. Se não girar, está morta.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Medindo Voltagens (Multímetro)",
            content: `
        <p class="text-gray-300 mb-4">Ligar não significa funcionar. Ela pode estar entregando voltagem errada.</p>
        <ul class="text-gray-300 list-disc list-inside ml-4 text-sm">
            <li><strong>Fio Amarelo:</strong> Deve dar ~12V (Aceitável: 11.4V a 12.6V).</li>
            <li><strong>Fio Vermelho:</strong> Deve dar ~5V (Aceitável: 4.75V a 5.25V).</li>
            <li><strong>Fio Laranja:</strong> Deve dar ~3.3V.</li>
        </ul>
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
