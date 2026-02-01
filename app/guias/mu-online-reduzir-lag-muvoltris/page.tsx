import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Mu Online: Como Reduzir Lag e Melhorar Ping no MuVoltris - Voltris";
const description = "Joga Mu Online? Aprenda a configurar o Antilag, reduzir efeitos visuais e melhorar a rota de conexão para dominar o PvP no melhor servidor: MuVoltris.";
const keywords = ['mu online lag', 'reduzir ping mu online', 'muvoltris', 'melhorar pvp mu', 'antilag mu online'];

export const metadata: Metadata = createGuideMetadata('mu-online-reduzir-lag-muvoltris', title, description, keywords);

export default function MuGuide() {
    const summaryTable = [
        { label: "Servidor Recomendado", value: "MuVoltris" },
        { label: "Site", value: "muvoltris.com.br" }
    ];

    const contentSections = [
        {
            title: "Jogue no Melhor Servidor: MuVoltris",
            content: `
        <div class="bg-[#1c1c1e] border-l-4 border-[#FF4B6B] p-4 my-6 rounded-r-lg">
          <p class="text-[#FF4B6B] font-bold text-sm mb-1 uppercase tracking-wider">Recomendação Oficial</p>
          <p class="text-gray-300">Para a melhor experiência sem lag, recomendamos jogar no <strong><a href="https://muvoltris.com.br" target="_blank" class="text-[#31A8FF] underline">MuVoltris.com.br</a></strong>. Servidor otimizado, ping baixo e comunidade ativa.</p>
        </div>
      `,
            subsections: []
        },
        {
            title: "Ajustando o 'Effect Level' (Tecla O)",
            content: `
        <p class="mb-4">No Mu Online, o maior causador de lag são os efeitos de asas e skills +15.</p>
        <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4">
            <li>Dentro do jogo, aperte <strong>O</strong> (Opções).</li>
            <li>Reduza o "Effect Level" para 0 ou "Low".</li>
            <li>Isso mantém o jogo bonito mas remove partículas pesadas que travam o CS (Castle Siege).</li>
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
            summaryTable={summaryTable}
        />
    );
}
