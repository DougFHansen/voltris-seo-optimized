import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "HDR no Windows 11: Vale a Pena em Jogos ou Fica Lavado?";
const description = "Ativou o HDR e as cores ficaram cinzas? Entenda o porquê e aprenda a usar o Windows HDR Calibration para ter cores vibrantes em monitores compatíveis.";
const keywords = ['hdr windows 11 lavado', 'calibrar hdr windows', 'jogos hdr vale a pena', 'auto hdr windows', 'monitor hdr400 vs hdr1000'];

export const metadata: Metadata = createGuideMetadata('hdr-windows-vale-a-pena-jogos', title, description, keywords);

export default function HDRGuide() {
    const summaryTable = [
        { label: "Obrigatório", value: "App Calibração HDR" },
        { label: "Auto HDR", value: "Ativar" }
    ];

    const contentSections = [
        {
            title: "O Problema das Cores Lavadas",
            content: `
        <p class="mb-4">Se seu monitor é barato (HDR400 ou sem certificação), ativar o HDR no Windows geralmente piora a imagem (o preto fica cinza). O HDR só brilha de verdade em telas OLED ou Mini-LED.</p>
      `,
            subsections: []
        },
        {
            title: "Windows HDR Calibration (A Salvação)",
            content: `
        <p class="text-gray-300">A Microsoft lançou um app na loja chamado <strong>Windows HDR Calibration</strong>. Baixe ele. Ele vai te guiar para configurar o nível de preto e o brilho máximo (nits) real do seu monitor, corrigindo o efeito lavado.</p>
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
            summaryTable={summaryTable}
        />
    );
}
