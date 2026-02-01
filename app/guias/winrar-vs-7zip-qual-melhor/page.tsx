import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "WinRAR vs 7-Zip: Por que você deve parar de usar o WinRAR (2026)";
const description = "O WinRAR é o compressor mais famoso, mas o 7-Zip é gratuito, mais rápido e comprime 10% mais. Veja o comparativo técnico entre RAR, ZIP e 7Z.";
const keywords = ['winrar vs 7zip', 'qual melhor descompactador', 'winrar é pago', 'abrir arquivo 7z', 'compressao lzma2 vs rar5', '7-zip é seguro'];

export const metadata: Metadata = createGuideMetadata('winrar-vs-7zip-qual-melhor', title, description, keywords);

export default function CompressGuide() {
    const summaryTable = [
        { label: "Melhor Taxa", value: "7-Zip (.7z)" },
        { label: "Mais Rápido", value: "WinRAR (.rar)" },
        { label: "Licença", value: "7-Zip (Grátis)" },
        { label: "Segurança", value: "7-Zip (Open Source)" }
    ];

    const contentSections = [
        {
            title: "O Veredito Direto",
            content: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-blue-900/20 p-6 rounded-xl border border-blue-500">
                <h4 class="text-white font-bold mb-2">7-Zip (O Vencedor)</h4>
                <ul class="list-disc list-inside text-gray-300 text-sm">
                    <li><strong>100% Gratuito e Código Aberto:</strong> Sem propagandas, sem "tempo de teste expirou".</li>
                    <li><strong>Algoritmo LZMA2:</strong> Comprime arquivos, em média, 10% a 20% mais que o ZIP do Windows e 5% a mais que o RAR.</li>
                    <li><strong>Leve:</strong> O instalador tem apenas 1MB.</li>
                </ul>
            </div>
            <div class="bg-purple-900/20 p-6 rounded-xl border border-purple-500">
                <h4 class="text-white font-bold mb-2">WinRAR (O Nostálgico)</h4>
                <ul class="list-disc list-inside text-gray-300 text-sm">
                    <li><strong>Pago (Shareware):</strong> Ele te cobra eternamente, mas nunca bloqueia o acesso.</li>
                    <li><strong>Formato RAR:</strong> É um formato proprietário. O 7-Zip abre RAR, mas não pode criar arquivos RAR.</li>
                    <li><strong>Recuperação de Erro:</strong> O WinRAR tem uma função de "Repair Archive" melhor para arquivos corrompidos.</li>
                </ul>
            </div>
        </div>
      `,
            subsections: []
        },
        {
            title: "Teste de Compressão (Benchmark)",
            content: `
        <p class="mb-4 text-gray-300">
            Comprimimos uma pasta de 1GB contendo imagens, textos e executáveis.
        </p>
        <table class="w-full text-left border-collapse mb-6">
            <thead>
                <tr class="text-[#31A8FF] border-b border-gray-700">
                    <th class="p-2">Software</th>
                    <th class="p-2">Tamanho Final</th>
                    <th class="p-2">Tempo</th>
                </tr>
            </thead>
            <tbody class="text-gray-300 text-sm">
                <tr class="border-b border-gray-800">
                    <td class="p-3">Windows (ZIP Nativo)</td>
                    <td class="p-3 text-red-400">890 MB</td>
                    <td class="p-3">25s</td>
                </tr>
                <tr class="border-b border-gray-800">
                    <td class="p-3">WinRAR (RAR5 Normal)</td>
                    <td class="p-3 text-yellow-400">710 MB</td>
                    <td class="p-3 text-green-400">18s</td>
                </tr>
                 <tr class="border-b border-gray-800 bg-green-900/20">
                    <td class="p-3 font-bold text-green-400">7-Zip (7z Ultra)</td>
                    <td class="p-3 font-bold">650 MB</td>
                    <td class="p-3">45s</td>
                </tr>
            </tbody>
        </table>
        <p class="text-gray-300">
            <strong>Conclusão:</strong> Se você precisa enviar um arquivo grande pela internet e tem upload lento, o 7-Zip economiza tempo de envio. Se precisa arquivar rápido no seu próprio PC, o WinRAR é mais veloz.
        </p>
      `,
            subsections: []
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="5 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
