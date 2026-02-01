import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Microfone Baixo no Windows? Como Aumentar o Volume e Boost";
const description = "Ninguém te ouve no Discord? Veja como aumentar a sensibilidade e o ganho (Boost +20dB) do microfone no Painel de Controle de Som.";
const keywords = ['microfone baixo windows', 'aumentar volume microfone', 'microphone boost', 'microfone muito baixo discord', 'equalizer apo mic'];

export const metadata: Metadata = createGuideMetadata('aumentar-volume-microfone-windows', title, description, keywords);

export default function MicGuide() {
    const contentSections = [
        {
            title: "Painel de Controle de Som (Antigo)",
            content: `
        <p class="mb-4">O menu de configurações novo do Windows 11 esconde o Boost. Precisamos do menu clássico.</p>
        <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4">
            <li>Win + R > Digite <code>mmsys.cpl</code> > Enter.</li>
            <li>Vá na aba <strong>Gravação</strong>.</li>
            <li>Dois cliques no seu Microfone.</li>
            <li>Vá na aba <strong>Níveis</strong>.</li>
            <li>Coloque o volume em 100%.</li>
            <li>Aumente a regua <strong>Sensibilidade do Microfone (Boost)</strong> para +10.0 dB ou +20.0 dB.</li>
            <li>Cuidado: +30dB pode causar chiado estático.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Equalizer APO (Solução Avançada)",
            content: `
        <p class="text-gray-300">Se mesmo com boost ficar baixo, instale o software <strong>Equalizer APO</strong> com a interface <strong>Peace</strong>. Lá você pode adicionar um ganho digital de pre-amplificação (Preamp) infinito.</p>
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
