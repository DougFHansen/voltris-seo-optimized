import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Google Play Games Beta PC: Vale a pena ou BlueStacks é melhor? (Análise 2026)";
const description = "A Google lançou seu emulador oficial de Android para Windows. Ele é mais leve que o BlueStacks? Roda Free Fire? Veja os prós e contras.";
const keywords = ['google play games beta pc review', 'google play games pc vs bluestacks', 'baixar google play games pc', 'clash royale pc oficial', 'free fire google play games pc', 'google play games requisitos'];

export const metadata: Metadata = createGuideMetadata('google-play-games-pc-beta-vale-a-pena', title, description, keywords);

export default function GooglePlayGuide() {
    const summaryTable = [
        { label: "Performance", value: "Excelente (Nativo)" },
        { label: "Compatibilidade", value: "Baixa (Poucos Jogos)" },
        { label: "Free Fire?", value: "Sim (Oficial)" },
        { label: "Mapeamento", value: "Limitado" }
    ];

    const contentSections = [
        {
            title: "O que é o Google Play Games PC?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Diferente dos emuladores (BlueStacks/LDPlayer) que criam um celular virtual inteiro, o Google Play Games roda uma camada de tradução otimizada direto no Windows. Resultado: Ele inicia em 3 segundos e usa metade da RAM.
        </p>
      `,
            subsections: []
        },
        {
            title: "Vantagens: Por que instalar?",
            content: `
        <ul class="list-disc list-inside text-gray-300 space-y-3 mb-6">
            <li><strong>Segurança Absoluta:</strong> É da Google. Zero risco de mineradores ou vírus.</li>
            <li><strong>Sincronização Perfeita:</strong> Seu progresso no celular aparece no PC instantaneamente e vice-versa.</li>
            <li><strong>120 FPS Real:</strong> Jogos como Free Fire Max, Clash of Clans e Asphalt 9 rodam liso, sem as engasgadas de compilação de shader dos emuladores chineses.</li>
        </ul>
      `,
            subsections: []
        },
        {
            title: "Desvantagens: Onde o BlueStacks ainda ganha?",
            content: `
        <div class="bg-gray-800 p-6 rounded-xl border border-yellow-500 mb-6">
            <h4 class="text-white font-bold mb-2">Biblioteca Limitada</h4>
            <p class="text-gray-300 text-sm">
                A Google só libera jogos que os desenvolvedores adaptaram. Você NÃO pode baixar um APK qualquer e instalar. Se o jogo não está na loja oficial do app, você não joga.
            </p>
            <h4 class="text-white font-bold mt-4 mb-2">Mapeamento de Teclas</h4>
            <p class="text-gray-300 text-sm">
                No BlueStacks, você coloca um botão onde quiser na tela. No Google Play Games, você é obrigado a usar o esquema de teclas que o desenvolvedor criou (geralmente WASD padrão). Não dá para fazer macros complexas.
            </p>
        </div>
      `,
            subsections: []
        },
        {
            title: "Veredito",
            content: `
        <p class="text-gray-300">
            Se você só joga os "famosos" (Free Fire, Clash, Mobile Legends), use o <strong>Google Play Games</strong>. É a melhor experiência.
            <br/>Se você joga games obscuros, gachas japoneses ou precisa de macros de auto-click, fique no <strong>BlueStacks/LDPlayer</strong>.
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
