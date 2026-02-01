import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia de Processadores 2026: Intel Core Ultra ou AMD Ryzen 9000? Qual escolher?";
const description = "Vai montar um PC em 2026? Entenda as novas arquiteturas Arrow Lake (Intel) e Zen 5 (AMD), soquetes LGA 1851 vs AM5, e qual CPU entrega mais FPS por Real.";
const keywords = ['processador 2026', 'intel core ultra vs ryzen 9000', 'melhor cpu jogos 2026', 'lga 1851 vs am5', 'ryzen 7 9800x3d vale a pena', 'intel arrow lake problemas'];

export const metadata: Metadata = createGuideMetadata('como-escolher-processador-2026', title, description, keywords);

export default function CPUGuide() {
    const contentSections = [
        {
            title: "Introdução: O Fim da Nomenclatura Antiga",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Se você estava acostumado com "Core i5, i7, i9", esqueça. A Intel mudou tudo em 2025/2026 com a linha <strong>Core Ultra (Série 200)</strong>. Do lado vermelho, a AMD refinou sua arquitetura Zen 5 nos Ryzen 9000.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          A escolha hoje não é apenas sobre velocidade, mas sobre <strong>Eficiência Energética</strong> e <strong>Longevidade da Plataforma</strong>.
        </p>
      `,
            subsections: []
        },
        {
            title: "1. AMD Ryzen 9000 (Plataforma AM5)",
            content: `
        <div class="bg-gray-800 border-l-4 border-red-600 p-6 rounded-xl mb-6">
            <h4 class="text-white font-bold text-xl mb-2">A Escolha do Gamer (X3D)</h4>
            <p class="text-gray-300 mb-4">
                A AMD continua dominando o mercado de jogos com a tecnologia <strong>3D V-Cache</strong>. Processadores como o Ryzen 7 9800X3D possuem uma memória cache empilhada verticalmente que dobra o FPS em jogos competitivos como Valorant, CS2 e MMOs.
            </p>
            <ul class="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>Soquete AM5:</strong> Confirmado suporte até 2027+. Você compra uma placa-mãe hoje e poderá trocar de CPU no futuro.</li>
                <li><strong>Pontos Fortes:</strong> Eficiência absurda (gasta pouca luz), performance imbatível em jogos.</li>
                <li><strong>Pontos Fracos:</strong> Preço alto no lançamento, produtividade (render) levemente inferior à Intel no mesmo preço.</li>
            </ul>
        </div>
      `,
            subsections: []
        },
        {
            title: "2. Intel Core Ultra Série 200 (Arrow Lake)",
            content: `
        <div class="bg-gray-800 border-l-4 border-blue-600 p-6 rounded-xl mb-6">
            <h4 class="text-white font-bold text-xl mb-2">A Revolução dos Tiles</h4>
            <p class="text-gray-300 mb-4">
                A Intel abandonou o design monolítico e removeu o Hyper-Threading (sim, um Core Ultra 7 agora tem threads iguais aos núcleos físicos). Isso reduziu drasticamente o consumo de energia e calor, resolvendo o problema das gerações 13/14.
            </p>
            <ul class="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>Soquete LGA 1851:</strong> Nova plataforma. Requer memória DDR5 obrigatória (sem suporte a DDR4).</li>
                <li><strong>NPU Integrada:</strong> Foco total em Inteligência Artificial local.</li>
                <li><strong>Pontos Fortes:</strong> Excelente para trabalho (Premiere, Blender), muito frio.</li>
                <li><strong>Pontos Fracos:</strong> Ganho em jogos foi pequeno comparado à geração 14. Plataforma cara (Placas Z890).</li>
            </ul>
        </div>
      `
        },
        {
            title: "3. Tabela Comparativa: Qual comprar?",
            content: `
            <table class="w-full text-left border-collapse mb-6 mt-4">
                <thead>
                    <tr class="text-[#31A8FF] border-b border-gray-700">
                        <th class="p-3">Perfil de Uso</th>
                        <th class="p-3">Recomendação AMD</th>
                        <th class="p-3">Recomendação Intel</th>
                    </tr>
                </thead>
                <tbody class="text-gray-300 text-sm">
                    <tr class="border-b border-gray-800 bg-gray-900/40">
                        <td class="p-3 font-bold">PC Custo-Benefício</td>
                        <td class="p-3 text-red-300">Ryzen 5 7600 (Rei do CxB)</td>
                        <td class="p-3 text-blue-300">Core i5-12400F (Ainda vive)</td>
                    </tr>
                    <tr class="border-b border-gray-800">
                        <td class="p-3 font-bold">Gamer Competitivo (360Hz)</td>
                        <td class="p-3 text-red-300 font-bold">Ryzen 7 9800X3D</td>
                        <td class="p-3 text-gray-500">Não compensa</td>
                    </tr>
                    <tr class="border-b border-gray-800 bg-gray-900/40">
                        <td class="p-3 font-bold">Produtor de Conteúdo</td>
                        <td class="p-3 text-red-300">Ryzen 9 9950X</td>
                        <td class="p-3 text-blue-300 font-bold">Core Ultra 9 285K</td>
                    </tr>
                    <tr class="border-b border-gray-800">
                        <td class="p-3 font-bold">Escritório / Estudos</td>
                        <td class="p-3 text-red-300">Ryzen 5 8600G (Vídeo forte)</td>
                        <td class="p-3 text-blue-300">Core Ultra 5 245K</td>
                    </tr>
                </tbody>
            </table>
        `
        },
        {
            title: "Veredito Final",
            content: `
            <p class="text-gray-300 mb-4">
                Se o seu foco é <strong>100% jogos</strong>, a AMD vence com a linha X3D. O cache extra faz diferença onde a placa de vídeo sobra (Low Resolution).
            </p>
            <p class="text-gray-300">
                Se você trabalha com edição e precisa de estabilidade e QuickSync (encode de vídeo), a Intel com a nova arquitetura fria e eficiente é a melhor escolha híbrida.
            </p>
        `
        }
    ];

    const summaryTable = [
        { label: "Melhor Jogo", value: "AMD Ryzen 7 9800X3D" },
        { label: "Melhor Trabalho", value: "Intel Ultra 9 285K" },
        { label: "Custo-Benefício", value: "Ryzen 5 7600" },
        { label: "Eficiência", value: "Empate (Novo Intel)" }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
