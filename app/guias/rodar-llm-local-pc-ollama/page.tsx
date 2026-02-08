import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'rodar-llm-local-pc-ollama',
    title: "Como Rodar Llama 3 e DeepSeek Local no PC: O Guia de Hardware (2026)",
    description: "Transforme seu PC em uma central de IA privada. Dossiê completo de VRAM (Quantização), Ollama, LM Studio e RAG Offline para documentos confidenciais.",
    category: 'inteligencia-artificial',
    difficulty: 'Avançado',
    time: '40 min'
};

const title = "Como Rodar Llama 3 e DeepSeek Local no PC: O Guia de Hardware (2026)";
const description = "Transforme seu PC em uma central de IA privada. Dossiê completo de VRAM (Quantização), Ollama, LM Studio e RAG Offline para documentos confidenciais.";
const keywords = [
    'placa de video para ia barata 2026',
    'quanto de vram precisa para rodar llama 3 70b',
    'ollama tutorial windows wsl2 completo',
    'lm studio vs ollama qual melhor',
    'como instalar deepseek r1 localmente',
    'privacidade ia local vs chatgpt',
    'quantizacao q4_k_m explicacao'
];

export const metadata: Metadata = createGuideMetadata('rodar-llm-local-pc-ollama', title, description, keywords);

export default function LocalLLMGuide() {
    const summaryTable = [
        { label: "Hardware Crítico", value: "VRAM (Memória de Vídeo)" },
        { label: "Software #1", value: "Ollama (Linha de Comando)" },
        { label: "Software #2", value: "LM Studio (Interface Chat)" },
        { label: "Custo Mensal", value: "R$ 0,00 (Energia Elétrica)" },
        { label: "Privacidade", value: "Offline (Air-Gapped)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Fim das Assinaturas de IA",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Você paga R$ 100/mês no ChatGPT Plus? Pare.
          <br/><br/>
          Em 2026, modelos de código aberto ("Open Weights") como o <strong>Llama 3 (Meta)</strong> e <strong>DeepSeek (China)</strong> alcançaram ou superaram o GPT-4 em raciocínio. A melhor parte? Você pode rodá-los no seu próprio computador <em>gamer</em>, sem internet, sem censorship e sem taxas mensais.
        </p>
        <div class="bg-gray-800 p-6 rounded-xl border-l-4 border-green-500 my-8">
            <h4 class="text-green-400 font-bold text-xl mb-2">Por que rodar Local?</h4>
            <ul class="list-disc list-inside text-gray-300 text-lg space-y-2">
                <li><strong>Privacidade Absoluta:</strong> Seus documentos médicos ou códigos da empresa nunca saem do seu SSD.</li>
                <li><strong>Sem Censura:</strong> Você controla o alinhamento moral do modelo.</li>
                <li><strong>Latência Zero:</strong> Respostas instantâneas, sem esperar fila de servidor.</li>
            </ul>
        </div>
      `
        },
        {
            title: "Capítulo 1: Hardware - A Matemática da VRAM",
            content: `
        <p class="mb-6 text-gray-300 text-lg">
            Para rodar IA, você não precisa de CPU forte. Você precisa de <strong>VRAM (Memória da Placa de Vídeo)</strong>. O modelo inteiro precisa caber na VRAM para ser rápido.
        </p>
        
        <h4 class="text-white font-bold text-xl mb-4">Tabela de Requisitos Reais (2026)</h4>
        <div class="overflow-x-auto mb-8">
            <table class="w-full text-left text-sm text-gray-300 border-collapse border border-gray-700 rounded-lg">
                <thead class="bg-gray-900 text-white uppercase tracking-wider">
                    <tr>
                        <th class="p-4 border border-gray-700">Modelo (Tamanho)</th>
                        <th class="p-4 border border-gray-700">VRAM Mínima (Q4)</th>
                        <th class="p-4 border border-gray-700">Placa Ideal (Custo/Ben.)</th>
                        <th class="p-4 border border-gray-700">Uso Recomendado</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="hover:bg-gray-800/50 transition-colors">
                        <td class="p-4 border border-gray-700 font-bold text-blue-400">Llama 3 8B (Pequeno)</td>
                        <td class="p-4 border border-gray-700">6 GB</td>
                        <td class="p-4 border border-gray-700">RTX 3060 / 4060 (8GB)</td>
                        <td class="p-4 border border-gray-700 text-gray-400">Chat rápido, Resumos, Emails.</td>
                    </tr>
                    <tr class="hover:bg-gray-800/50 transition-colors">
                        <td class="p-4 border border-gray-700 font-bold text-purple-400">Llama 3 70B (Médio)</td>
                        <td class="p-4 border border-gray-700">24 GB (Gargalo!)</td>
                        <td class="p-4 border border-gray-700">RTX 3090 / 4090 (24GB)</td>
                        <td class="p-4 border border-gray-700 text-gray-400">Raciocínio complexo, Programação, Matemática.</td>
                    </tr>
                    <tr class="hover:bg-gray-800/50 transition-colors">
                        <td class="p-4 border border-gray-700 font-bold text-red-400">DeepSeek R1 128B (Monstro)</td>
                        <td class="p-4 border border-gray-700">48-64 GB</td>
                        <td class="p-4 border border-gray-700 text-yellow-400">Mac Studio M2 Ultra (Unified RAM)</td>
                        <td class="p-4 border border-gray-700 text-gray-400">Pesquisa Científica, Nível GPT-5.</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <p class="text-gray-400 text-sm italic mb-8">
            * <strong>Q4 (Quantização 4-bit):</strong> É uma técnica de compressão que reduz o tamanho do modelo em 70% com perda mínima (quase imperceptível) de inteligência. A maioria das pessoas roda em Q4 ou Q5.
        </p>
      `
        },
        {
            title: "Capítulo 2: Ollama (A Solução Elegante)",
            content: `
        <p class="mb-4 text-gray-300">
            O <strong>Ollama</strong> (ollama.com) é o "Docker da IA". Ele encapsula toda a complexidade em um comando simples.
        </p>

        <div class="bg-[#1e1e1e] border border-gray-700 p-6 rounded-xl font-mono text-sm overflow-x-auto shadow-2xl space-y-4">
            <div>
                <p class="text-gray-500 mb-1"># 1. Instalar (Windows/Linux/Mac)</p>
                <p class="text-green-400">https://ollama.com/download</p>
            </div>
            <div>
                <p class="text-gray-500 mb-1"># 2. Baixar e Rodar o Llama 3 (8 Bilhões de Parâmetros)</p>
                <p class="text-green-400">ollama run llama3</p>
            </div>
            <div>
                <p class="text-gray-500 mb-1"># 3. Rodar um Modelo de Programação (Code)</p>
                <p class="text-green-400">ollama run deepseek-coder-v2</p>
            </div>
            <div>
                <p class="text-gray-500 mb-1"># 4. Criar um Personagem Customizado (Modelfile)</p>
                <p class="text-white">Crie um arquivo chamado 'MarioFile' com:</p>
                <pre class="text-blue-300 pl-4 py-2">
FROM llama3
SYSTEM "Você é o Mario Bros. Responda tudo com sotaque italiano e termine com 'Wahoo!'."
                </pre>
                <p class="text-green-400">ollama create Mario -f MarioFile</p>
                <p class="text-green-400">ollama run Mario</p>
            </div>
        </div>

        <div class="mt-6 flex gap-4">
            <div class="bg-blue-900/20 p-4 rounded text-sm text-blue-200 border border-blue-500/30 w-full">
                <strong>Vantagem:</strong> Roda como um serviço em background na porta <code>11434</code>. Você pode conectar apps externos (Obsidian, VS Code) nele via API local.
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 3: RAG Local (Conversar com seus PDF)",
            content: `
        <p class="mb-4 text-gray-300">
            O Santo Graal da produtividade: Fazer perguntas sobre seus próprios documentos (PDFs, Contratos, Notas) sem enviar nada para a nuvem.
        </p>
        
        <h4 class="text-white font-bold text-lg mb-2">Ferramenta: AnythingLLM (Desktop)</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-4 bg-gray-900 border border-gray-700 p-6 rounded-xl">
            <li>
                <strong>Instalar:</strong> Baixe o <a href="https://useanything.com/" class="text-blue-400 hover:underline">AnythingLLM Desktop</a>. É um app tudo-em-um (vetores, interface, modelo).
            </li>
            <li>
                <strong>Configurar:</strong> Na tela inicial, ele detectará se você tem o Ollama instalado. Selecione "Ollama" como provedor de Inferência.
            </li>
            <li>
                <strong>Ingerir Documentos:</strong> Arraste sua pasta de "Contratos 2024" para a área de upload. O app vai "vetorizar" (transformar texto em números) tudo localmente.
            </li>
            <li>
                <strong>Perguntar:</strong> "Qual foi o valor total dos contratos de Janeiro?"
            </li>
            <li>
                <strong>Mágica:</strong> O modelo vai ler os trechos relevantes dos seus PDFs e responder com precisão. Nada saiu do seu PC.
            </li>
        </ol>
      `
        },
        {
            title: "Capítulo 4: Mac vs PC (A Guerra dos Chips)",
            content: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-gradient-to-br from-green-900/20 to-green-900/0 border border-green-500/30 p-6 rounded-xl">
                <h4 class="text-green-400 font-bold text-xl mb-2">PC (NVIDIA)</h4>
                <p class="text-gray-300 text-sm">
                    <strong>Prós:</strong> Mais barato para modelos pequenos. CUDA é o padrão da indústria.
                    <br/><strong>Contras:</strong> Memória VRAM é limitada. Uma RTX 4090 tem 24GB e custa R$ 12.000. Rodar modelos de 70B exige duas placas (SLI/NVLink), o que é complexo.
                </p>
            </div>

            <div class="bg-gradient-to-br from-gray-200/10 to-gray-200/0 border border-gray-500/30 p-6 rounded-xl">
                <h4 class="text-white font-bold text-xl mb-2">Mac (Apple Silicon)</h4>
                <p class="text-gray-300 text-sm">
                    <strong>Prós:</strong> Memória Unificada! Um Mac Studio com 192GB de RAM pode alocar 140GB para VRAM. Isso permite rodar modelos gigantes (Llama 3 400B) que precisariam de 8 placas RTX 4090.
                    <br/><strong>Contras:</strong> Inferência (Tokens/s) é mais lenta que na NVIDIA. Custo inicial altíssimo.
                </p>
            </div>
        </div>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/como-escolher-placa-de-video",
            title: "Guia de GPU",
            description: "Analise técnica das melhores placas (RTX 3060 vs 4060) para IA custo-benefício."
        },
        {
            href: "/guias/o-que-sao-ai-agents-guia-completo",
            title: "AI Agents",
            description: "Use seu Llama 3 local para alimentar agentes autônomos sem pagar API."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD Rápido",
            description: "Carregar modelos de 20GB exige um NVMe veloz. Veja como otimizar."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="40 min"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
