import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "BitLocker Cai FPS? A Verdade sobre Criptografia e SSDs - Voltris";
const description = "Devo ativar o BitLocker no meu PC Gamer? Testes mostram se a criptografia de disco afeta o tempo de loading ou FPS em jogos no Windows 11.";
const keywords = ['bitlocker cai fps', 'desativar bitlocker desempenho', 'bitlocker ssd lento', 'criptografia windows jogos', 'bitlocker windows 11 home'];

export const metadata: Metadata = createGuideMetadata('bitlocker-desempenho-jogos-ssd', title, description, keywords);

export default function BitLockerGuide() {
    const summaryTable = [
        { label: "Impacto SSD", value: "Baixo (~2%)" },
        { label: "Impacto HD", value: "Alto" }

    ];

    const contentSections = [
        {
            title: "O Mito da Lentidão",
            content: `
        <p class="mb-4">Em processadores modernos (i5/Ryzen 5 de 2020 pra cá), o BitLocker é acelerado por hardware. O impacto em FPS é <strong>ZERO</strong>. O loading pode aumentar em 1 ou 2 segundos, imperceptível.</p>
      `,
            subsections: []
        },
        {
            title: "Quando DESATIVAR?",
            content: `
        <p class="text-gray-300">Se você usa um HD Mecânico antigo ou um processador muito fraco (Celeron/Pentium), aí sim o BitLocker pode travar a máquina. No Windows 11 Pro, ele vem ativado por padrão em alguns notebooks.</p>
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
            summaryTable={summaryTable}
        />
    );
}
