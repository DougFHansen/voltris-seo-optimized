import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Verificar Saúde do HD/SSD com CrystalDiskInfo: Como Ler os Dados SMART (2026)";
const description = "Seu PC está lento ou travando? Pode ser o HD morrendo. Aprenda a interpretar os alertas 'Alerta', 'Critico' e 'Reallocated Sectors Count' no CrystalDiskInfo.";
const keywords = ['crystaldiskinfo como usar', 'saude do hd estado de alerta', 'hd fazendo barulho tic tac', 'reallocated sectors count o que significa', 'ssd vida util restante', 'testar hd defeito'];

export const metadata: Metadata = createGuideMetadata('verificar-saude-hd-ssd-crystaldiskinfo', title, description, keywords);

export default function SmartGuide() {
    const summaryTable = [
        { label: "Software", value: "CrystalDiskInfo" },
        { label: "Azul", value: "Saudável" },
        { label: "Amarelo", value: "Alerta (Backup Já)" },
        { label: "Vermelho", value: "Crítico (Lixo)" }
    ];

    const contentSections = [
        {
            title: "O que é SMART?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Todo HD ou SSD tem um "boletim médico" interno chamado S.M.A.R.T. (Self-Monitoring, Analysis and Reporting Technology). Ele conta quantos erros ocorreram, quantas horas ficou ligado e quantos setores estragaram. O Windows não mostra isso fácil, mas o <strong>CrystalDiskInfo</strong> mostra.
        </p>
      `,
            subsections: []
        },
        {
            title: "Como Ler os Erros (O Significado do Amarelo)",
            content: `
        <p class="mb-4 text-gray-300">
            Se seu Status de Saúde está <strong>Amarelo (Alerta)</strong>, olhe a lista de atributos abaixo. Os mais graves são:
        </p>
        <div class="space-y-4">
            <div class="bg-yellow-900/20 p-4 rounded border-l-4 border-yellow-500">
                <strong class="text-white block text-lg">05: Reallocated Sectors Count</strong>
                <p class="text-gray-300 text-sm">
                    O HD encontrou setores físicos estragados (Bad Blocks) e tentou "esconder" eles usando setores reservas. Se esse número estiver aumentando, <strong>seu HD vai morrer em breve</strong>. Faça backup HOJE.
                </p>
            </div>
            <div class="bg-red-900/20 p-4 rounded border-l-4 border-red-500">
                <strong class="text-white block text-lg">C5: Current Pending Sector Count</strong>
                <p class="text-gray-300 text-sm">
                    Setores instáveis que o HD não conseguiu ler. Isso causa travamentos e tela azul no Windows. É sinal de degradação da superfície magnética.
                </p>
            </div>
            <div class="bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
                <strong class="text-white block text-lg">SSD: Life Remaining (Vida Útil)</strong>
                <p class="text-gray-300 text-sm">
                    SSDs morrem quando atingem o limite de escrita (TBW). Se estiver abaixo de 10%, comece a planejar a compra de um novo.
                </p>
            </div>
        </div>
      `,
            subsections: []
        },
        {
            title: "Temperatura Importa?",
            content: `
        <p class="text-gray-300 mb-4">
            Sim!
            <br/>- <strong>HD (Mecânico):</strong> Ideal entre 30°C e 45°C. Acima de 50°C a vida útil cai pela metade.
            <br/>- <strong>SSD (NVMe):</strong> Eles esquentam mais (até 70°C em carga máxima é aceitável). Se passar de 80°C, ele diminui a velocidade (Throttling).
        </p>
      `
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
