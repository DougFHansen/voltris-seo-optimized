import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'teclados-mecanicos-switches-guia',
  title: "Switches de Teclado Mecânico: Guia de Cores e Tipos (2026)",
  description: "Blue, Red, Brown ou Silver? Aprenda a diferença entre todos os switches de teclado mecânico e escolha o ideal para o seu estilo em 2026.",
  category: 'perifericos',
  difficulty: 'Intermediário',
  time: '20 min'
};

const title = "Switches de Teclado Mecânico: Guia de Cores e Tipos (2026)";
const description = "Blue, Red, Brown ou Silver? Aprenda a diferença entre todos os switches de teclado mecânico e escolha o ideal para o seu estilo em 2026.";
const keywords = [
    'guia de switches teclado mecanico 2026 cores',
    'diferença switch azul vermelho marrom tutorial 2026',
    'melhor switch para digitar silencioso guia 2026',
    'switch red vs switch blue qual mais barulhento tutorial',
    'o que é switch optico teclado mecanico guia'
];

export const metadata: Metadata = createGuideMetadata('teclados-mecanicos-switches-guia', title, description, keywords);

export default function SwitchGuide() {
    const summaryTable = [
        { label: "Switch Blue", value: "Clicky (Barulhento) / Feedback Tátil" },
        { label: "Switch Red", value: "Linear (Silencioso) / Rápido para Games" },
        { label: "Switch Brown", value: "Tátil (Silencioso) / Versátil (Trabalho + Jogo)" },
        { label: "Switch Silver", value: "Linear Ultra Rápido / Baixa Ativação" }
    ];

    const contentSections = [
        {
            title: "O coração do seu Teclado",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **Switch** é a mola e o mecanismo que fica embaixo de cada tecla. É ele quem define se a sua digitação será barulhenta, macia, rápida ou pesada. Em 2026, com o avanço da customização, as cores tradicionais (Azul, Vermelho e Marrom) ganharam variações silenciosas e versões ópticas extremamente duráveis. Escolher o switch certo é a parte mais importante para o seu conforto a longo prazo.
        </p>
      `
        },
        {
            title: "1. As Cores Clássicas (A hierarquia)",
            content: `
        <p class="mb-4 text-gray-300">Entenda qual o seu perfil de uso:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Blue (Azul):</strong> Faz um "click" audível. Ótimo para quem gosta da sensação de máquina de escrever, mas pode irritar quem mora com você ou colegas de trabalho.</li>
            <li><strong>Red (Vermelho):</strong> É linear, ou seja, desce reto sem resistência. É o favorito dos gamers competitivos pela leveza e velocidade.</li>
            <li><strong>Brown (Marrom):</strong> O equilíbrio. Tem o "degrauzinho" tátil do azul, mas sem o barulho alto. Perfeito para quem faz home office e também joga.</li>
        </ul >
      `
        },
        {
            title: "2. Switches Ópticos vs Mecânicos",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Velocidade da Luz:</h4>
            <p class="text-sm text-gray-300">
                Switches ópticos de 2026 usam um feixe de luz para registrar o clique em vez de contato metálico. <br/><br/>
                - <strong>Durabilidade:</strong> Como não há atrito entre metais, eles não sofrem com o 'Double Click' e duram o dobro de um switch comum. <br/>
                - <strong>Performance:</strong> O tempo de resposta é quase instantâneo (abaixo de 0.2ms). Marcas como Razer e SteelSeries dominam esta tecnologia em seus modelos de elite.
            </p>
        </div>
      `
        },
        {
            title: "3. O fenómeno 'Thock' em 2026",
            content: `
        <p class="mb-4 text-gray-300">
            Você já deve ter visto vídeos de teclados com som "acolchoado" e gostoso de ouvir. 
            <br/><br/><strong>Dica:</strong> Para conseguir esse som (conhecido como Thock), procure por switches **Pre-lubed** (lubrificados de fábrica). Marcas como Gateron e Akko oferecem switches lubrificados que eliminam o som de "mola rangendo", tornando a digitação muito mais premium e satisfatória sem que você precise abrir o teclado.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "4. Tipos Avançados de Switches em 2026",
            content: `
        <h4 class="text-white font-bold mb-3">🔬 Tecnologia de Switches de Ponta</h4>
        <p class="mb-4 text-gray-300">
            Em 2026, além dos switches tradicionais, surgiram tecnologias avançadas que oferecem experiências únicas:
        </p>
        <div class="space-y-6">
            <div class="border-l-4 border-purple-500 pl-4 py-2 bg-purple-900/10">
                <h5 class="text-purple-400 font-bold mb-2">Switches Hall Effect (Magnéticos)</h5>
                <p class="text-gray-300 text-sm">
                    Utilizam sensores magnéticos para detectar pressionamentos, oferecendo vida útil estendida (até 150 milhões de cliques) e resposta ultrarrápida. Exemplos incluem os switches da série Alps SKCM e os novos switches magnéticos da Logitech.
                </p>
                <ul class="text-sm text-gray-300 space-y-1 mt-2">
                    <li>• Vida útil estendida (150M+ cliques)</li>
                    <li>• Resposta ultrarrápida (<1ms)</li>
                    <li>• Ajuste de ponto de ativação</li>
                    <li>• Resistência a poeira e líquidos</li>
                    <li>• Configuração personalizada por tecla</li>
                </ul>
            </div>
            <div class="border-l-4 border-cyan-500 pl-4 py-2 bg-cyan-900/10">
                <h5 class="text-cyan-400 font-bold mb-2">Switches Optoeletrônicos</h5>
                <p class="text-gray-300 text-sm">
                    Utilizam sensores ópticos para detectar pressionamentos, combinando velocidade e durabilidade. São usados principalmente em teclados de competição profissional.
                </p>
                <ul class="text-sm text-gray-300 space-y-1 mt-2">
                    <li>• Ativação óptica precisa</li>
                    <li>• Tempo de resposta ultrarrápido</li>
                    <li>• Maior confiabilidade</li>
                    <li>• Menos desgaste mecânico</li>
                    <li>• Menor latência de input</li>
                </ul>
            </div>
            <div class="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-900/10">
                <h5 class="text-yellow-400 font-bold mb-2">Switches Lineares Lubrificados</h5>
                <p class="text-gray-300 text-sm">
                    Switches tradicionais com lubrificação pré-aplicada para reduzir ruído e melhorar a sensação de digitação. Popularizados pela comunidade DIY e agora oferecidos por fabricantes.
                </p>
                <ul class="text-sm text-gray-300 space-y-1 mt-2">
                    <li>• Menor ruído de ativação</li>
                    <li>• Sensação mais suave</li>
                    <li>• Menor atrito interno</li>
                    <li>• Redução de "scratch"</li>
                    <li>• Maior durabilidade do mecanismo</li>
                </ul>
            </div>
        </div>
      `
        },
        {
            title: "5. Comparação Detalhada de Switches",
            content: `
        <h4 class="text-white font-bold mb-3">🔧 Tabela Comparativa de Switches</h4>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
                <thead class="bg-gray-800">
                    <tr>
                        <th class="p-3 text-left">Tipo</th>
                        <th class="p-3 text-left">Força</th>
                        <th class="p-3 text-left">Feedback</th>
                        <th class="p-3 text-left">Som</th>
                        <th class="p-3 text-left">Durabilidade</th>
                        <th class="p-3 text-left">Uso Ideal</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">Cherry MX Red</td>
                        <td class="p-3">45cN</td>
                        <td class="p-3">Linear</td>
                        <td class="p-3">Silencioso</td>
                        <td class="p-3">50M cliques</td>
                        <td class="p-3">Gaming e digitação</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">Cherry MX Brown</td>
                        <td class="p-3">45cN</td>
                        <td class="p-3">Tátil</td>
                        <td class="p-3">Moderado</td>
                        <td class="p-3">50M cliques</td>
                        <td class="p-3">Digitação e gaming</td>
                    </tr>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">Cherry MX Blue</td>
                        <td class="p-3">50cN</td>
                        <td class="p-3">Tátil e sonoro</td>
                        <td class="p-3">Barulhento</td>
                        <td class="p-3">50M cliques</td>
                        <td class="p-3">Digitação precisa</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">Cherry MX Silent Red</td>
                        <td class="p-3">45cN</td>
                        <td class="p-3">Linear</td>
                        <td class="p-3">Muito silencioso</td>
                        <td class="p-3">50M cliques</td>
                        <td class="p-3">Ambientes compartilhados</td>
                    </tr>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">Gateron Yellow</td>
                        <td class="p-3">50cN</td>
                        <td class="p-3">Linear</td>
                        <td class="p-3">Silencioso</td>
                        <td class="p-3">50M cliques</td>
                        <td class="p-3">Gaming rápido</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">Razer Green</td>
                        <td class="p-3">50cN</td>
                        <td class="p-3">Tátil e sonoro</td>
                        <td class="p-3">Barulhento</td>
                        <td class="p-3">80M cliques</td>
                        <td class="p-3">Digitação mecânica</td>
                    </tr>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">Logitech Romer-G Tactile</td>
                        <td class="p-3">45cN</td>
                        <td class="p-3">Tátil</td>
                        <td class="p-3">Moderado</td>
                        <td class="p-3">70M cliques</td>
                        <td class="p-3">Gaming e escritório</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">Topre静电容 (15UM)</td>
                        <td class="p-3">45cN</td>
                        <td class="p-3">Tátil</td>
                        <td class="p-3">Suave</td>
                        <td class="p-3">100M cliques</td>
                        <td class="p-3">Digitação premium</td>
                    </tr>
                </tbody>
            </table>
        </div>
      `
        },
        {
            title: "6. Personalização e Modificação de Switches",
            content: `
        <h4 class="text-white font-bold mb-3">🎨 Modding e Personalização de Switches</h4>
        <p class="mb-4 text-gray-300">
            A comunidade de teclados mecânicos desenvolveu técnicas avançadas para personalizar e melhorar a experiência dos switches:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div class="bg-indigo-900/10 p-5 rounded-xl border border-indigo-500/20">
                <h5 class="text-indigo-400 font-bold mb-3">Lubrificação de Switches</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• <strong>Objetivo:</strong> Reduzir atrito e ruído interno</li>
                    <li>• <strong>Produtos comuns:</strong> Krytox GPL 205, Tribosys 3105</li>
                    <li>• <strong>Processo:</strong> Desmontagem, limpeza e aplicação cuidadosa</li>
                    <li>• <strong>Resultados:</strong> Sensação mais suave e "buttery"</li>
                    <li>• <strong>Complexidade:</strong> Moderada a avançada</li>
                </ul>
            </div>
            <div class="bg-cyan-900/10 p-5 rounded-xl border border-cyan-500/20">
                <h5 class="text-cyan-400 font-bold mb-3">Springmods (Modificação de Molas)</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• <strong>Objetivo:</strong> Ajustar força de ativação</li>
                    <li>• <strong>Aplicações:</strong> Redução de força em switches pesados</li>
                    <li>• <strong>Opções:</strong> Molas de diferentes gramaturas</li>
                    <li>• <strong>Resultados:</strong> Switches mais leves ou mais pesados</li>
                    <li>• <strong>Cuidados:</strong> Risco de danificar switch</li>
                </ul>
            </div>
        </div>
        <h4 class="text-white font-bold mb-3 mt-6">🔧 Processos de Modificação</h4>
        <p class="mb-4 text-gray-300">
            Para quem deseja modificar seus switches:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
            <li><strong>Desoldagem:</strong> Remover switches do PCB (se não for hot-swap)</li>
            <li><strong>Desmontagem:</strong> Separar stem, housing e mola</li>
            <li><strong>Lubrificação:</strong> Aplicar lubrificante em pontos específicos</li>
            <li><strong>Polimento:</strong> Lixar partes plásticas para reduzir ruído</li>
            <li><strong>Reconstrução:</strong> Montar novamente com cuidado</li>
            <li><strong>Teste:</strong> Verificar funcionamento antes de reinstalar</li>
        </ul>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/teclados-mecanicos-guia",
            title: "Escolher Teclado",
            description: "Formatos e tecnologias de montagem."
        },
        {
            href: "/guias/teclado-mecanico-vs-membrana-qual-o-melhor",
            title: "Mecânico vs Membrana",
            description: "Diferenças fundamentais entre tecnologias."
        },
        {
            href: "/guias/perifericos-gamer-vale-a-pena-marcas",
            title: "Marcas de Teclado",
            description: "Onde encontrar os melhores switches."
        }
    ];

    const allContentSections = [...contentSections, ...additionalContentSections];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Iniciante"
            contentSections={allContentSections}
            advancedContentSections={[]}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
