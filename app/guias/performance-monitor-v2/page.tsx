import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Medir a Performance do seu PC: Guia de Benchmarks 2026";
const description = "Seu PC está rendendo o que deveria? Aprenda a usar o Cinebench, 3DMark e UserBenchmark para comparar seus resultados com outros usuários e detectar gargalos.";
const keywords = [
    'como fazer benchmark pc gamer',
    'testar performance placa de video 2026',
    'cinebench r23 tutorial portugues',
    'medir velocidade do processador pc',
    'comparar pc com outros usuarios'
];

export const metadata: Metadata = createGuideMetadata('performance-monitor-v2', title, description, keywords);

export default function BenchmarkGuide() {
    const summaryTable = [
        { label: "Teste de CPU", value: "Cinebench R23 / 2024" },
        { label: "Teste de GPU", value: "3DMark / Superposition" },
        { label: "Teste Geral", value: "PCMark 10" },
        { label: "Dificuldade", value: "Intermediária" }
    ];

    const contentSections = [
        {
            title: "Por que fazer um Benchmark?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Fazer um benchmark não é apenas ver "números crescendo". É uma ferramenta de diagnóstico. Se você tem um processador i7 e ele marca menos pontos que um i3 no teste, significa que algo está errado: pode ser superaquecimento, driver mal instalado ou até um vírus minerando em segundo plano.
        </p>
      `
        },
        {
            title: "Cinebench: O Teste do Processador",
            content: `
        <p class="mb-4 text-gray-300">O Cinebench coloca seu processador para renderizar uma imagem 3D ultra complexa. É o melhor teste para saber se o seu cooler está aguentando o tranco.</p>
        <div class="bg-gray-800 p-5 rounded-xl border border-gray-700">
            <h4 class="text-white font-bold mb-2">Como ler o resultado:</h4>
            <ul class="list-disc list-inside text-gray-300 text-sm space-y-2">
                <li><strong>Single Core:</strong> Importante para jogos antigos e navegação web.</li>
                <li><strong>Multi Core:</strong> Importante para lives, edição de vídeo e jogos modernos (como Cyberpunk).</li>
                <li>Compare seu "Score" com sites como o CPU-Monkey para saber se sua marca está na média.</li>
            </ul>
        </div>
      `
        },
        {
            title: "3DMark: O Teste da Placa de Vídeo",
            content: `
        <p class="mb-4 text-gray-300">
            O 3DMark (Time Spy ou Steel Nomad) testa a capacidade da sua GPU em DirectX 12. 
        </p>
        <p class="text-gray-300 bg-blue-900/10 p-4 rounded border-l-4 border-blue-500">
            Dica: Se o seu PC travar ou der tela azul durante o benchmark, é um sinal claro de que sua fonte está fraca ou sua placa de vídeo está com overclock instável. O benchmark é o "exame de sangue" do seu hardware.
        </p>
      `
        },
        {
            title: "UserBenchmark: O teste rápido",
            content: `
        <p class="mb-4 text-gray-300">
            Embora polêmico entre entusiastas, o <strong>UserBenchmark</strong> é excelente para iniciantes porque ele testa tudo (RAM, SSD, GPU, CPU) em 2 minutos e te mostra um gráfico de "percentil". Se você estiver abaixo do percentual 50, seu PC precisa de otimização urgente.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/diagnostico-hardware",
            title: "Diagnóstico Completo",
            description: "O que fazer após detectar um erro no benchmark."
        },
        {
            href: "/guias/monitorar-temperatura-pc",
            title: "Monitorar Calor",
            description: "Acompanhe as temps enquanto o benchmark roda."
        },
        {
            href: "/guias/otimizacao-performance",
            title: "Otimizar PC",
            description: "Técnicas para subir sua pontuação nos testes."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
