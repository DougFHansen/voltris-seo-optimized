import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'o-que-sao-ai-agents-guia-completo',
    title: "O que são AI Agents? Guia Definitivo de Agentes Autônomos e CrewAI (2026)",
    description: "Dossiê completo sobre a revolução da Internet Agêntica. Aprenda a arquitetura cognitiva dos agentes, tutorial prático de CrewAI com Python e como criar trabalhadores digitais que pensam.",
    category: 'inteligencia-artificial',
    difficulty: 'Intermediário',
    time: '45 min'
};

const title = "O que são AI Agents? Guia Definitivo de Agentes Autônomos e CrewAI (2026)";
const description = "Dossiê completo sobre a revolução da Internet Agêntica. Aprenda a arquitetura cognitiva dos agentes, tutorial prático de CrewAI com Python e como criar trabalhadores digitais que pensam.";
const keywords = [
    'ai agents python tutorial completo 2026',
    'crewai passo a passo agente autonomo',
    'langchain vs crewai vs autogen qual melhor',
    'como criar equipe de ia autonoma',
    'arquitetura cognitiva agentes memoria rag',
    'agentes de vendas autonomos ia',
    'custo api gpt-4 para agentes'
];

export const metadata: Metadata = createGuideMetadata('o-que-sao-ai-agents-guia-completo', title, description, keywords);

export default function AIAgentsGuide() {
    const summaryTable = [
        { label: "Tecnologia Base", value: "LLMs (GPT-4o, Claude 3.5)" },
        { label: "Framework Líder", value: "CrewAI (Orquestração)" },
        { label: "Principal Uso", value: "Automação de Processos Inteiros" },
        { label: "Custo Médio", value: "$0.10 - $2.00 por execução" },
        { label: "Nível Técnico", value: "Python Intermediário" }
    ];

    const contentSections = [
        {
            title: "Introdução: Bem-vindos à Internet Agêntica",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Até 2024, vivemos a era dos "Chatbots". Você fazia uma pergunta ao ChatGPT (` + "`Prompt`" + `), e ele te dava uma resposta (` + "`Completion`" + `). Era uma interação passiva.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, entramos na era <strong>Agêntica</strong>. Um <strong>AI Agent</strong> não espera você perguntar. Ele recebe um objetivo amplo (ex: "Descubra prospects no LinkedIn e mande e-mails personalizados") e trabalha sozinho por horas. Ele navega na web, ele raciocina se encontrou a pessoa certa, ele usa ferramentas (CRM, Gmail) e ele corrige seus próprios erros.
        </p>
        <div class="bg-purple-900/20 border-l-4 border-purple-500 p-6 rounded-r-lg my-8">
            <h4 class="text-purple-400 font-bold text-xl mb-2">A Definição Técnica</h4>
            <p class="text-gray-300 text-lg">
                <em>"Um Agente é um sistema que usa um LLM como cérebro para perceber o ambiente, raciocinar sobre como atingir um objetivo e executar ações usando ferramentas."</em>
            </p>
        </div>
      `
        },
        {
            title: "Capítulo 1: Anatomia de um Agente (Arquitetura Cognitiva)",
            content: `
        <p class="mb-6 text-gray-300 text-lg">
            Para construir um agente, você não escreve "ifs" e "elses". Você projeta uma mente. Andrew Ng e Andrej Karpathy definem a arquitetura moderna em 4 pilares:
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div class="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all">
                <div class="text-4xl mb-4">🧠</div>
                <h4 class="text-blue-400 font-bold text-xl mb-2">1. O Cérebro (Core LLM)</h4>
                <p class="text-gray-400">
                    O modelo de linguagem (GPT-4o, Claude 3.5 Sonnet). Ele não armazena dados, ele processa lógica. Ele decide "O que fazer a seguir?".
                    <br/><strong class="text-white">Dica 2026:</strong> Claude 3.5 Sonnet é atualmente o melhor "raciocinador" para agentes, superando o GPT-4o em seguir instruções complexas.
                </p>
            </div>
            
            <div class="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-green-500/50 transition-all">
                <div class="text-4xl mb-4">🛠️</div>
                <h4 class="text-green-400 font-bold text-xl mb-2">2. Ferramentas (Tool Use)</h4>
                <p class="text-gray-400">
                    Sem ferramentas, o agente é apenas um cérebro numa jarra. As ferramentas conectam ele ao mundo:
                    <ul class="list-disc list-inside mt-2 text-sm">
                        <li><strong>Google Search (Serper):</strong> Para ler a internet atual.</li>
                        <li><strong>Python Repl:</strong> Para fazer cálculos (LLMs são ruins de matemática).</li>
                        <li><strong>API do Gmail/Slack:</strong> Para se comunicar.</li>
                    </ul>
                </p>
            </div>

            <div class="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-yellow-500/50 transition-all">
                <div class="text-4xl mb-4">💾</div>
                <h4 class="text-yellow-400 font-bold text-xl mb-2">3. Memória (RAG + Context)</h4>
                <p class="text-gray-400">
                    <strong>Curto Prazo:</strong> O histórico da conversa atual.
                    <br/><strong>Longo Prazo:</strong> Bancos de dados vetoriais (Pinecone, ChromaDB) onde o agente guarda informações para acessar semanas depois.
                </p>
            </div>

            <div class="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-red-500/50 transition-all">
                <div class="text-4xl mb-4">🗺️</div>
                <h4 class="text-red-400 font-bold text-xl mb-2">4. Planejamento (ReAct)</h4>
                <p class="text-gray-400">
                    A capacidade de quebrar uma tarefa grande ("Ficar rico") em subtarefas executáveis. O agente faz um pensamento crítico: <em>"Eu tentei X e falhou, então agora vou tentar Y."</em>
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Batalha dos Frameworks (CrewAI vs LangChain)",
            content: `
        <p class="mb-6 text-gray-300">
            Você não precisa codar tudo do zero. Existem frameworks que facilitam a orquestração.
        </p>

        <div class="overflow-x-auto mb-8">
            <table class="w-full text-left text-sm text-gray-300 border-collapse border border-gray-700 rounded-lg">
                <thead class="bg-gray-900 text-white uppercase tracking-wider">
                    <tr>
                        <th class="p-4 border border-gray-700">Framework</th>
                        <th class="p-4 border border-gray-700">Filosofia</th>
                        <th class="p-4 border border-gray-700">Curva de Aprendizado</th>
                        <th class="p-4 border border-gray-700">Veredito 2026</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="hover:bg-gray-800/50 transition-colors">
                        <td class="p-4 border border-gray-700 font-bold text-orange-400">CrewAI</td>
                        <td class="p-4 border border-gray-700">Focado em "Equipes" e "Roleplay". Você define cargos (Analista, Redator) e eles conversam.</td>
                        <td class="p-4 border border-gray-700">⭐⭐ (Fácil)</td>
                        <td class="p-4 border border-gray-700 text-green-400 font-bold">A Escolha Padrão</td>
                    </tr>
                    <tr class="hover:bg-gray-800/50 transition-colors">
                        <td class="p-4 border border-gray-700 font-bold text-blue-400">LangChain / LangGraph</td>
                        <td class="p-4 border border-gray-700">Baixo nível. Controle grafo a grafo. Extremamente flexível, mas verboso.</td>
                        <td class="p-4 border border-gray-700">⭐⭐⭐⭐⭐ (Difícil)</td>
                        <td class="p-4 border border-gray-700 text-gray-400">Para Engenheiros Sênior</td>
                    </tr>
                    <tr class="hover:bg-gray-800/50 transition-colors">
                        <td class="p-4 border border-gray-700 font-bold text-purple-400">Microsoft AutoGen</td>
                        <td class="p-4 border border-gray-700">Agentes conversacionais focados em geração de código.</td>
                        <td class="p-4 border border-gray-700">⭐⭐⭐ (Médio)</td>
                        <td class="p-4 border border-gray-700 text-gray-400">Para Dev Tools</td>
                    </tr>
                </tbody>
            </table>
        </div>
      `
        },
        {
            title: "Capítulo 3: Tutorial Prático - Sua Agência de Notícias Automatizada",
            content: `
        <p class="mb-4 text-gray-300">
            Vamos botar a mão na massa. Vamos usar <strong>Python</strong> e <strong>CrewAI</strong> para criar uma empresa que funciona enquanto você dorme.
            <br/>Nossa empresa terá dois funcionários digitais:
        </p>
        <ul class="list-disc list-inside text-gray-300 mb-6 ml-4">
            <li><strong>Agente 1 (Jornalista):</strong> Varre a internet atrás de novidades sobre um tema.</li>
            <li><strong>Agente 2 (Editor Chefe):</strong> Transforma os dados técnicos em um post viral para LinkedIn.</li>
        </ul>

        <div class="bg-[#1e1e1e] border border-gray-700 p-6 rounded-xl font-mono text-sm overflow-x-auto shadow-2xl">
            <div class="flex items-center gap-2 mb-4 text-gray-500 border-b border-gray-700 pb-2">
                <span class="w-3 h-3 rounded-full bg-red-500"></span>
                <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span class="w-3 h-3 rounded-full bg-green-500"></span>
                <span class="ml-2">main.py</span>
            </div>
<pre><code class="language-python text-gray-300">
import os
from crewai import Agent, Task, Crew, Process
from langchain_community.tools import DuckDuckGoSearchRun

# 0. Configuração (Você precisa de uma chave da OpenAI ou Anthropic)
os.environ["OPENAI_API_KEY"] = "sk-..."

# 1. Ferramentas
# Damos aos agentes a capacidade de pesquisar no Google
search_tool = DuckDuckGoSearchRun()

# 2. Definindo os Agentes (Os Funcionários)
pesquisador = Agent(
    role='Analista Sênior de Tecnologia',
    goal='Descobrir as tendências mais recentes e impactantes sobre IA',
    backstory="""Você é um analista veterano com faro para notícias que 
    vão mudar o mercado. Você ignora hype e foca em fatos.""",
    verbose=True, # Mostra o pensamento do agente no terminal
    allow_delegation=False,
    tools=[search_tool] # Ele pode usar o Google!
)

redator = Agent(
    role='Estrategista de Conteúdo LinkedIn',
    goal='Escrever posts que viralizam baseados em fatos técnicos',
    backstory="""Você transforma assuntos complexos em narrativas 
    envolventes. Você usa formatação, emojis e gatilhos mentais.""",
    verbose=True,
    allow_delegation=True
)

# 3. Definindo as Tarefas (O Trabalho)
tarefa_pesquisa = Task(
    description="""Pesquise as 3 principais novidades sobre 'AI Agents' 
    nas últimas 24 horas. Identifique empresas, lançamentos e polêmicas.""",
    agent=pesquisador,
    expected_output="Um resumo técnico de 3 parágrafos com fontes."
)

tarefa_escrita = Task(
    description="""Baseado na pesquisa do analista, escreva um post para 
    o LinkedIn. O post deve ter um gancho forte, 3 bullet points e 
    uma chamada para ação (CTA) no final.""",
    agent=redator,
    expected_output="Um texto formatado em Markdown pronto para publicar."
)

# 4. Formando a Equipe e Rodando
tech_news_crew = Crew(
    agents=[pesquisador, redator],
    tasks=[tarefa_pesquisa, tarefa_escrita],
    process=Process.sequential, # Um trabalha depois do outro
    verbose=2
)

print("### Iniciando a Reunião Matinal dos Agentes ###")
resultado = tech_news_crew.kickoff()

print("######################")
print("## POST FINAL GERADO ##")
print("######################")
print(resultado)
</code></pre>
        </div>
        
        <div class="mt-6 p-6 bg-blue-900/10 border border-blue-500/30 rounded-xl">
            <h4 class="text-blue-400 font-bold text-lg mb-2">O que acontece quando você roda isso?</h4>
            <ol class="list-decimal list-inside text-gray-300 space-y-2">
                <li>O script inicia. O <strong>Pesquisador</strong> acessa o DuckDuckGo.</li>
                <li>Ele lê vários sites (o LLM lê e resume). Se não achar nada bom, ele refaz a busca com outros termos (autonomia!).</li>
                <li>Quando satisfeito, ele passa o relatório para o <strong>Redator</strong>.</li>
                <li>O Redator lê, critica, e escreve o post no estilo pedido.</li>
                <li>O resultado final aparece na sua tela. Você acabou de economizar 2 horas de trabalho.</li>
            </ol>
        </div>
      `
        },
        {
            title: "Capítulo 4: Custos e Desafios Reais",
            content: `
        <p class="mb-4 text-gray-300">
            Nem tudo são flores. Rodar agentes custa dinheiro e exige supervisão.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-800 p-5 rounded-lg border-l-4 border-red-500">
                <h5 class="text-red-400 font-bold mb-2">💸 O Custo da "Loopite"</h5>
                <p class="text-sm text-gray-300">
                    Agentes podem entrar em loops infinitos ("Tentei pesquisar, falhou. Tentei de novo, falhou..."). Se você usar GPT-4, isso pode queimar $10 em minutos.
                    <br/><strong>Solução:</strong> Use modelos mais baratos (GPT-4o-mini ou Haiku) para tarefas simples e estabeleça um limite de "max_iterations".
                </p>
            </div>
            <div class="bg-gray-800 p-5 rounded-lg border-l-4 border-yellow-500">
                <h5 class="text-yellow-400 font-bold mb-2">🐌 Latência</h5>
                <p class="text-sm text-gray-300">
                    Ao contrário de um chat instantâneo, um agente pode levar 2 a 5 minutos para completar uma tarefa complexa de pesquisa. Eles são feitos para trabalhar em background ("Fire and Forget"), não para conversas em tempo real.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Conclusão: O Futuro do Trabalho",
            content: `
        <p class="text-gray-300 text-lg leading-relaxed">
            A revolução dos AI Agents não é sobre substituir humanos, mas sobre <strong>superpoderes</strong>. Imagine ter 10 estagiários digitais incansáveis trabalhando para você. Um lê notícias, outro organiza seu CRM, outro responde e-mails básicos.
        </p>
        <p class="mt-4 text-gray-300 text-lg leading-relaxed">
            Quem dominar frameworks como CrewAI agora (2026) será o "Arquiteto de Agentes" do futuro, uma das profissões mais bem pagas da década. Comece pequeno, teste, falhe barato e escale seus agentes.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/como-programar-com-ia-vibe-coding",
            title: "Vibe Coding",
            description: "Use IA para escrever o código dos seus agentes 10x mais rápido."
        },
        {
            href: "/guias/rodar-llm-local-pc-ollama",
            title: "Agentes Grátis (Local)",
            description: "Como rodar o cérebro do seu agente (Llama 3) no seu próprio PC para custo zero."
        },
        {
            href: "/guias/melhores-navegadores-custo-beneficio",
            title: "Browser Use",
            description: "Ferramentas para agentes navegarem na web (MultiOn, Selenium)."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="45 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
