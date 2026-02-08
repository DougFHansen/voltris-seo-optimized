import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'rodar-llm-local-pc-ollama',
    title: "Como Rodar Inteligência Artificial Local no PC: Guia Definitivo (2026)",
    description: "Tenha seu próprio ChatGPT privado e grátis. Tutorial de instalação do Ollama e LM Studio para rodar Llama 3, Mistral e DeepSeek R1 offline usando sua GPU.",
    category: 'inteligencia-artificial',
    difficulty: 'Intermediário',
    time: '30 min'
};

const title = "Como Rodar Inteligência Artificial Local no PC: Guia Definitivo (2026)";
const description = "Tenha seu próprio ChatGPT privado e grátis. Tutorial de instalação do Ollama e LM Studio para rodar Llama 3, Mistral e DeepSeek R1 offline usando sua GPU.";
const keywords = [
    'como rodar chatgpt local pc',
    'ollama tutorial windows',
    'lm studio vs ollama qual melhor',
    'deepseek r1 local requirements',
    'placa de video para ia vram necessaria',
    'llama 3 8b vs 70b memoria ram',
    'privacidade llm local'
];

export const metadata: Metadata = createGuideMetadata('rodar-llm-local-pc-ollama', title, description, keywords);

export default function LocalLLMGuide() {
    const summaryTable = [
        { label: "Software Recomendado", value: "Ollama (Simples) / LM Studio (Visual)" },
        { label: "Modelo Iniciante", value: "Llama 3 8B (Meta)" },
        { label: "Requisito Mínimo", value: "8GB RAM + GPU 4GB VRAM" },
        { label: "Privacidade", value: "100% Offline (Air-Gapped)" },
        { label: "Custo", value: "Grátis (Open Source)" }
    ];

    const contentSections = [
        {
            title: "Por que rodar IA Localmente?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Enquanto o mundo paga US$ 20/mês pelo ChatGPT Plus, uma revolução silenciosa acontece nos PCs domésticos. Modelos de "Peso Aberto" (Open Weights) como o <strong>Llama 3 (Meta)</strong> e <strong>Mistral (França)</strong> agora rodam em computadores comuns com qualidade surpreendente.
        </p>
        <div class="grid md:grid-cols-3 gap-6 mb-8">
            <div class="bg-gray-800 p-5 rounded-lg border-t-4 border-green-500">
                <h4 class="text-green-400 font-bold mb-2">🔒 Privacidade Total</h4>
                <p class="text-gray-400 text-sm">
                    Seus dados nunca saem do seu quarto. Ideal para analisar documentos sensíveis, códigos proprietários ou conversas pessoais.
                </p>
            </div>
            <div class="bg-gray-800 p-5 rounded-lg border-t-4 border-blue-500">
                <h4 class="text-blue-400 font-bold mb-2">💸 Custo Zero</h4>
                <p class="text-gray-400 text-sm">
                    Sem assinaturas mensais. O único custo é a eletricidade da sua placa de vídeo.
                </p>
            </div>
            <div class="bg-gray-800 p-5 rounded-lg border-t-4 border-purple-500">
                <h4 class="text-purple-400 font-bold mb-2">⚡ Sem Censura</h4>
                <p class="text-gray-400 text-sm">
                    Você controla o modelo. Pode rodar versões "Uncensored" (Dolphin) que respondem a qualquer pergunta sem filtros morais corporativos.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Requisitos de Hardware: O que eu preciso?",
            content: `
        <p class="mb-4 text-gray-300">
            A regra de ouro em IA Local é <strong>VRAM (Memória de Vídeo)</strong>. Quanto mais VRAM sua GPU tiver, maior e mais inteligente o modelo que você pode rodar.
        </p>

        <div class="overflow-x-auto mb-6">
            <table class="w-full text-left text-sm text-gray-300 border-collapse border border-gray-700 rounded-lg">
                <thead class="bg-gray-800 text-white">
                    <tr>
                        <th class="p-3 border border-gray-700">Modelo (Tamanho)</th>
                        <th class="p-3 border border-gray-700">GPU Mínima (VRAM)</th>
                        <th class="p-3 border border-gray-700">GPU Recomendada</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="p-3 border border-gray-700 font-bold">Llama 3 8B (Rápido)</td>
                        <td class="p-3 border border-gray-700">6 GB (GTX 1660)</td>
                        <td class="p-3 border border-gray-700 text-green-400">8 GB (RTX 3060 / 4060)</td>
                    </tr>
                    <tr class="bg-gray-900/50">
                        <td class="p-3 border border-gray-700 font-bold">Mistral Large (Inteligente)</td>
                        <td class="p-3 border border-gray-700">12 GB (RTX 3060 12GB)</td>
                        <td class="p-3 border border-gray-700 text-green-400">16 GB (RTX 4060 Ti 16GB)</td>
                    </tr>
                    <tr>
                        <td class="p-3 border border-gray-700 font-bold">Llama 3 70B (Gênio)</td>
                        <td class="p-3 border border-gray-700">2x 24GB (RTX 3090/4090)</td>
                        <td class="p-3 border border-gray-700 text-yellow-400">MacBook M3 Max (Unified Memory)</td>
                    </tr>
                </tbody>
            </table>
        </div>
      `
        },
        {
            title: "Método 1: Ollama (O Caminho Fácil)",
            content: `
        <p class="mb-4 text-gray-300">
            O <strong>Ollama</strong> democratizou a IA local. Ele é um executável simples que baixa e roda modelos em segundos.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-4 bg-gray-900 border border-gray-700 p-6 rounded-xl">
            <li>
                <strong>Baixar:</strong> Acesse <a href="https://ollama.com" target="_blank" class="text-blue-400 hover:underline">ollama.com</a> e instale a versão para Windows ou Linux (WSL2).
            </li>
            <li>
                <strong>Terminal:</strong> Abra o PowerShell ou CMD.
            </li>
            <li>
                <strong>Rodar Llama 3:</strong> Digite:
                <div class="mt-2 bg-black p-3 rounded font-mono text-green-400">ollama run llama3</div>
                <p class="mt-2 text-sm text-gray-400">Ele baixará cerca de 4.7GB.</p>
            </li>
            <li>
                <strong>Rodar DeepSeek Coder:</strong> Para programação, digite:
                <div class="mt-2 bg-black p-3 rounded font-mono text-green-400">ollama run deepseek-coder</div>
            </li>
        </ol>
      `
        },
        {
            title: "Método 2: LM Studio (Interface Visual)",
            content: `
        <p class="mb-4 text-gray-300">
            Se você tem medo de tela preta (terminal), o <strong>LM Studio</strong> é para você. Ele parece um app de chat normal.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2">
            <li>Baixe em <a href="https://lmstudio.ai" target="_blank" class="text-blue-400 hover:underline">lmstudio.ai</a>.</li>
            <li>Na barra de busca, digite "Hermes 3" ou "Phi 3".</li>
            <li>Ele mostra no lado direito se sua GPU aguenta rodar (barra verde "Likely to run").</li>
            <li>Clique em Download, espere terminar e clique em "Chat" na esquerda.</li>
        </ul>
        <p class="mt-4 text-gray-300 bg-purple-900/20 p-4 rounded border border-purple-500/20">
            <strong>Dica Avançada (Quantização):</strong> Você verá termos como "Q4_K_M" ou "Q8_0". Isso é a compressão.
            <br/>Q4 (4-bit) perde pouquíssima qualidade e usa metade da memória do Q8. <strong>Sempre prefira Q4_K_M ou Q5_K_M</strong> para melhor custo-benefício.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/como-escolher-placa-de-video",
            title: "Guia de GPU",
            description: "Qual placa de vídeo tem mais VRAM pelo menor preço?"
        },
        {
            href: "/guias/o-que-sao-ai-agents-guia-completo",
            title: "AI Agents",
            description: "Conecte seu Ollama local ao CrewAI para agentes gratuitos."
        },
        {
            href: "/guias/debloat-windows-11-otimizacao-powershell",
            title: "Otimizar Windows",
            description: "Libere RAM fechando processos inúteis para o modelo usar."
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
