import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'o-que-sao-ai-agents-guia-completo',
    title: "O que são AI Agents? O Guia Completo para Criar Agentes Autônomos (2026)",
    description: "Entenda a revolução dos Agentes de IA. Diferença entre Chatbot e Agent, tutorial de CrewAI vs LangChain e como criar seu primeiro trabalhador digital autônomo.",
    category: 'inteligencia-artificial',
    difficulty: 'Intermediário',
    time: '25 min'
};

const title = "O que são AI Agents? O Guia Completo para Criar Agentes Autônomos (2026)";
const description = "Entenda a revolução dos Agentes de IA. Diferença entre Chatbot e Agent, tutorial de CrewAI vs LangChain e como criar seu primeiro trabalhador digital autônomo.";
const keywords = [
    'ai agents tutorial python 2026',
    'crewai vs langchain comparison',
    'como criar um agente de ia autonomo',
    'agentes de ia para automação empresarial',
    'autogen microsoft tutorial',
    'diferenca chatbot e ai agent',
    'o que sao agentes autonomos'
];

export const metadata: Metadata = createGuideMetadata('o-que-sao-ai-agents-guia-completo', title, description, keywords);

export default function AIAgentsGuide() {
    const summaryTable = [
        { label: "Tecnologia Principal", value: "LLMs (GPT-4, Claude 3.5, Llama 3)" },
        { label: "Framework Popular", value: "LangChain & CrewAI" },
        { label: "Principal Uso", value: "Automação de Tarefas Complexas" },
        { label: "Diferencial", value: "Capacidade de usar Ferramentas (Tools)" },
        { label: "Custo", value: "Varia (API Usage)" }
    ];

    const contentSections = [
        {
            title: "Introdução: A Era dos Agentes Digitais",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Até 2024, interagíamos com a IA através de "Chats". Você perguntava, ela respondia. Em 2026, entramos na era "Agentic" (Agêntica). Agora, a IA não apenas fala; ela <strong>faz</strong>.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          <strong>AI Agents (Agentes de IA)</strong> são sistemas que usam um LLM (Large Language Model) como "cérebro" para raciocinar, planejar e executar ações no mundo real. Eles podem navegar na web, enviar e-mails, escrever código, testar softwares e até contratar outros agentes para ajudar. Enquanto um Chatbot é um consultor passivo, um Agente é um funcionário ativo.
        </p>
      `
        },
        {
            title: "A Anatomia de um Agente: Como eles funcionam?",
            content: `
        <p class="mb-4 text-gray-300">
            Para entender como construir um, você precisa entender as 4 partes fundamentais de um Agente Moderno:
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="bg-gray-800 p-6 rounded-xl border border-purple-500/30">
                <h4 class="text-purple-400 font-bold mb-2">1. O Cérebro (Brain)</h4>
                <p class="text-gray-300 text-sm">
                    É o LLM (ex: GPT-4o, Claude 3.5 Sonnet). Ele recebe o objetivo ("Pesquise sobre X e escreva um resumo") e quebra isso em passos lógicos.
                </p>
            </div>
            <div class="bg-gray-800 p-6 rounded-xl border border-blue-500/30">
                <h4 class="text-blue-400 font-bold mb-2">2. Ferramentas (Tools)</h4>
                <p class="text-gray-300 text-sm">
                    São as "mãos" do agente. Pode ser uma Calculadora, uma ferramenta de Busca no Google (SerpAPI), um acesso ao Banco de Dados ou um terminal Python.
                </p>
            </div>
            <div class="bg-gray-800 p-6 rounded-xl border border-green-500/30">
                <h4 class="text-green-400 font-bold mb-2">3. Memória (Memory)</h4>
                <p class="text-gray-300 text-sm">
                    Agentes precisam lembrar do que fizeram no passo anterior. Usamos <strong>Vetores (RAG)</strong> para memória de longo prazo e histórico de chat para curto prazo.
                </p>
            </div>
            <div class="bg-gray-800 p-6 rounded-xl border border-yellow-500/30">
                <h4 class="text-yellow-400 font-bold mb-2">4. Planejamento (Planning)</h4>
                <p class="text-gray-300 text-sm">
                    Técnicas como <em>Chain-of-Thought (CoT)</em> ou <em>ReAct (Reason + Act)</em> permitem que o agente critique seu próprio plano antes de executar.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "CrewAI vs LangChain vs AutoGen: Qual escolher?",
            content: `
        <p class="mb-6 text-gray-300">
            Existem dezenas de frameworks, mas esses três dominam o mercado em 2026.
        </p>

        <div class="overflow-x-auto mb-6">
            <table class="w-full text-left text-sm text-gray-300 border-collapse border border-gray-700 rounded-lg">
                <thead class="bg-gray-800 text-white">
                    <tr>
                        <th class="p-3 border border-gray-700">Framework</th>
                        <th class="p-3 border border-gray-700">Melhor Para...</th>
                        <th class="p-3 border border-gray-700">Curva de Aprendizado</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="p-3 border border-gray-700 font-bold text-green-400">CrewAI</td>
                        <td class="p-3 border border-gray-700">Times de Agentes (Multi-Agent). Foco em "Role Playing" (ex: "Você é um Pesquisador Sênior").</td>
                        <td class="p-3 border border-gray-700">Baixa (Fácil)</td>
                    </tr>
                    <tr class="bg-gray-900/50">
                        <td class="p-3 border border-gray-700 font-bold text-blue-400">LangChain</td>
                        <td class="p-3 border border-gray-700">Construção de baixo nível. Controle total sobre cada passo e integração complexa.</td>
                        <td class="p-3 border border-gray-700">Alta (Difícil)</td>
                    </tr>
                    <tr>
                        <td class="p-3 border border-gray-700 font-bold text-purple-400">Microsoft AutoGen</td>
                        <td class="p-3 border border-gray-700">Agentes que conversam entre si para resolver bugs de código. Ótimo para Devs.</td>
                        <td class="p-3 border border-gray-700">Média</td>
                    </tr>
                </tbody>
            </table>
        </div>
      `
        },
        {
            title: "Tutorial Prático: Seu Primeiro Agente com CrewAI (Python)",
            content: `
        <p class="mb-4 text-gray-300">
            Vamos criar uma equipe simples: Um <strong>Pesquisador</strong> que busca novidades sobre IA e um <strong>Redator</strong> que escreve um post para LinkedIn.
        </p>

        <div class="bg-gray-900 border border-gray-700 p-4 rounded-lg font-mono text-sm overflow-x-auto">
<pre><code class="language-python text-gray-300">
from crewai import Agent, Task, Crew, Process
from langchain_community.tools import DuckDuckGoSearchRun

# 1. Definir as Ferramentas
search_tool = DuckDuckGoSearchRun()

# 2. Definir os Agentes
pesquisador = Agent(
    role='Analista de Tendências de IA',
    goal='Descobrir as notícias mais quentes sobre IA hoje',
    backstory='Você é um especialista em tecnologia obcecado por novidades.',
    tools=[search_tool],
    verbose=True
)

redator = Agent(
    role='Copywriter de LinkedIn',
    goal='Escrever um post engajador sobre as descobertas',
    backstory='Você escreve posts virais usando emojis e linguagem corporativa.',
    verbose=True
)

# 3. Definir as Tarefas
tarefa_pesquisa = Task(
    description='Pesquise as 3 principais notícias de IA das últimas 24h.',
    agent=pesquisador
)

tarefa_escrita = Task(
    description='Escreva um post curto para o LinkedIn baseado na pesquisa.',
    agent=redator
)

# 4. Executar a Equipe (Crew)
equipe = Crew(
    agents=[pesquisador, redator],
    tasks=[tarefa_pesquisa, tarefa_escrita],
    process=Process.sequential
)

resultado = equipe.kickoff()
print(resultado)
</code></pre>
        </div>
        <p class="text-sm text-gray-400 mt-2">
            Este código simples orquestra dois "cérebros" separados. O primeiro usa a ferramenta de busca para ler a internet real. O segundo recebe o texto do primeiro e o formata. Isso é automação agêntica.
        </p>
      `
        },
        {
            title: "O Futuro: O que esperar em 2026/2027?",
            content: `
        <ul class="list-disc list-inside text-gray-300 space-y-4">
            <li>
                <strong>LAMs (Large Action Models):</strong> Modelos treinados não para falar, mas para clicar em interfaces (UI). Ex: Rabbit R1 e a nova geração da OpenAI.
            </li>
            <li>
                <strong>Agentes no SO:</strong> O Windows e macOS terão agentes nativos que "veem" o que você faz na tela e automatizam fluxos sem API.
            </li>
            <li>
                <strong>Economia de Agentes:</strong> Marketplaces onde você aluga um "Agente Vendedor" ou "Agente Designer" por hora.
            </li>
        </ul>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/como-programar-com-ia-vibe-coding",
            title: "Vibe Coding: O que é?",
            description: "Aprenda a programar usando IA sem escrever código boilerplate."
        },
        {
            href: "/guias/rodar-llm-local-pc-ollama",
            title: "IA Local (Privacidade)",
            description: "Como rodar Llama 3 e Mistral no seu próprio PC."
        },
        {
            href: "/guias/automacao-tarefas",
            title: "Automação Clássica",
            description: "Diferença entre Scripts Python simples e Agentes Inteligentes."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="25 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
