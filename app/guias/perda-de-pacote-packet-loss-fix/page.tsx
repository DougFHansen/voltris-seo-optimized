import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Perda de Pacote (Packet Loss): Como Identificar e Resolver (Modem e Roteador) (2026)";
const description = "Seu boneco teletransporta ou o tiro não registra? Isso é Packet Loss. Aprenda a testar se o problema é no seu cabo, no Wi-Fi ou na Operadora.";
const keywords = ['packet loss fix', 'perda de pacote como resolver', 'teste de packet loss cmd', 'boneco teletransportando jogo', 'cabo ethernet vs wifi packet loss', 'trocar cabo rede cat5e cat6'];

export const metadata: Metadata = createGuideMetadata('perda-de-pacote-packet-loss-fix', title, description, keywords);

export default function PacketLossGuide() {
    const summaryTable = [
        { label: "Sintoma", value: "Teletransporte" },
        { label: "Causa #1", value: "Wi-Fi (Sinal)" },
        { label: "Causa #2", value: "Cabo Ruim" },
        { label: "Teste", value: "Pathping" }
    ];

    const contentSections = [
        {
            title: "Diagnóstico: Onde está o defeito?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Packet Loss é quando você envia "Eu atirei", mas a carta se perde no correio e nunca chega no servidor. O servidor acha que você não atirou.
        </p>
        <p class="mb-4 text-gray-300 font-bold">
            Vamos usar o comando <code>pathping</code> para rastrear a rota.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 mb-6">
            <li>Abra o CMD.</li>
            <li>Digite: <code>pathping 8.8.8.8</code> (Vamos testar a rota até o Google).</li>
            <li>Espere uns 3 minutos. Ele vai listar cada salto (hop).</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Interpretando o Resultado",
            content: `
        <div class="space-y-4">
            <div class="bg-red-900/20 p-4 rounded border-l-4 border-red-500">
                <strong class="text-white block">Perda no Salto 0 ou 1 (Seu Roteador)</strong>
                <p class="text-gray-300 text-sm">
                    Se aparecer "1% Loss" logo na primeira linha, o problema é NA SUA CASA.
                    <br/>- Se usa Wi-Fi: É interferência. Mude para cabo ou canal 5GHz.
                    <br/>- Se usa Cabo: Seu cabo está quebrado ou a porta do roteador está oxidada. Troque o cabo.
                </p>
            </div>
            <div class="bg-yellow-900/20 p-4 rounded border-l-4 border-yellow-500">
                <strong class="text-white block">Perda no Salto 2 ou 3 (ISP)</strong>
                <p class="text-gray-300 text-sm">
                    Isso é na rede do seu provedor (poste da rua/central). Ligue para eles e envie o print desse teste. Eles são obrigados a arrumar.
                </p>
            </div>
        </div>
      `,
            subsections: []
        },
        {
            title: "Hardware: Cat5e vs Cat6",
            content: `
        <p class="text-gray-300 mb-4">
            Muitos usam cabos de rede de 10 anos atrás.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2">
            <li><strong>Cat5 (Sem o 'e'):</strong> Lixo. Jogue fora. Suporta só 100Mbps.</li>
            <li><strong>Cat5e:</strong> Padrão. Suporta 1Gbps. Bom para até 50 metros.</li>
            <li><strong>Cat6:</strong> Blindado. Tem um plástico no meio que separa os fios para evitar interferência elétrica. Melhora MUITO a estabilidade em distâncias longas. Invista em um Cat6.</li>
        </ul>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
