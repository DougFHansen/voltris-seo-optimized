import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'como-programar-com-ia-vibe-coding',
    title: "Vibe Coding: O Futuro da Programação com Intenção e IA (Dossiê 2026)",
    description: "Esqueça a briga com a sintaxe. Aprenda a filosofia 'Vibe Coding', domine o Cursor IDE com Claude 3.5 Sonnet e construa produtos reais focando 100% na lógica e design.",
    category: 'inteligencia-artificial',
    difficulty: 'Iniciante',
    time: '35 min'
};

const title = "Vibe Coding: O Futuro da Programação com Intenção e IA (Dossiê 2026)";
const description = "Esqueça a briga com a sintaxe. Aprenda a filosofia 'Vibe Coding', domine o Cursor IDE com Claude 3.5 Sonnet e construa produtos reais focando 100% na lógica e design.";
const keywords = [
    'vibe coding andrej karpathy explicacao',
    'cursor ide tutorial completo portugues',
    'claude 3.5 sonnet vs gpt-4o para programar',
    'como instalar cursorrules nextjs',
    'programar sem saber sintaxe python',
    'segurança código gerado por ia',
    'devin vs cursor composer review'
];

export const metadata: Metadata = createGuideMetadata('como-programar-com-ia-vibe-coding', title, description, keywords);

export default function VibeCodingGuide() {
    const summaryTable = [
        { label: "Ferramenta Core", value: "Cursor (VS Code Fork)" },
        { label: "Modelo Cérebro", value: "Claude 3.5 Sonnet (Anthropic)" },
        { label: "Filosofia", value: "Gerente de Código (Manager)" },
        { label: "Produtividade", value: "10x em Projetos MVP" },
        { label: "Risco", value: "Alucinação Silenciosa" }
    ];

    const contentSections = [
        {
            title: "O que é Vibe Coding? (A Definição de Andrej Karpathy)",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2024, Andrej Karpathy (ex-Diretor de IA da Tesla e OpenAI) twittou algo que mudou a indústria: <em>"Eu não escrevo mais código. Eu apenas descrevo a 'Vibe' (a intenção), reviso o diff, e aceito."</em>
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          <strong>Vibe Coding</strong> não é sobre "não saber programar". É sobre <strong>elevar o nível de abstração</strong>. Em vez de se preocupar se é ` + "`float: left`" + ` ou ` + "`flex-direction: row`" + `, você foca na arquitetura do sistema, na segurança e na experiência do usuário. A IA é o seu "Junior Developer" incansável que digita a sintaxe chata para você.
        </p>
        <div class="bg-gray-800 p-6 rounded-xl border-l-4 border-purple-500 my-8">
            <h4 class="text-purple-400 font-bold mb-2">A Nova Habilidade: Code Review</h4>
            <p class="text-gray-300 text-sm">
                Antes, seu valor era medido por quantas linhas você escrevia. Agora, é medido por quão bem você <strong>lê e critica</strong> o código da IA. Se você aceitar tudo o que o Claude sugere, seu app vai quebrar. O Vibe Coder é um Editor Chefe.
            </p>
        </div>
      `
        },
        {
            title: "Capítulo 1: O Cursor IDE (A Arma Secreta)",
            content: `
        <p class="mb-6 text-gray-300">
            Esqueça o VS Code padrão com plugins lentos. O <strong>Cursor</strong> é um fork (uma cópia melhorada) do VS Code que integra a IA no nível do kernel do editor.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div class="bg-gray-900 border border-gray-700 p-6 rounded-xl hover:border-blue-500 transition-colors">
                <div class="flex items-center gap-3 mb-4">
                    <span class="text-2xl">🎹</span>
                    <h4 class="text-blue-400 font-bold text-xl">Ctrl + K (Edit Inline)</h4>
                </div>
                <p class="text-gray-400 text-sm">
                    Selecione um bloco de código bugado e aperte Ctrl+K. Digite: "Arrume o erro de tipagem aqui". A IA lê o contexto, corrige e mostra o "Diff" (Antes vs Depois) instantaneamente.
                </p>
            </div>

            <div class="bg-gray-900 border border-gray-700 p-6 rounded-xl hover:border-green-500 transition-colors">
                <div class="flex items-center gap-3 mb-4">
                    <span class="text-2xl">💬</span>
                    <h4 class="text-green-400 font-bold text-xl">Ctrl + L (Chat Global)</h4>
                </div>
                <p class="text-gray-400 text-sm">
                    Um chat lateral que "vê" todos os arquivos abertos. Você pode perguntar: "Onde está a função de login?" ou "Explique como esse componente React funciona".
                </p>
            </div>

            <div class="bg-gray-900 border border-gray-700 p-6 rounded-xl hover:border-purple-500 transition-colors">
                <div class="flex items-center gap-3 mb-4">
                    <span class="text-2xl">🎼</span>
                    <h4 class="text-purple-400 font-bold text-xl">Composer (Ctrl + I)</h4>
                </div>
                <p class="text-gray-400 text-sm">
                    A funcionalidade "Matadora" (Killer Feature) de 2026. O Composer permite editar <strong>múltiplos arquivos ao mesmo tempo</strong>. Você diz: "Mude a cor do botão para azul em todas as páginas e atualize o arquivo de tema global". Ele abre 5 arquivos, edita todos e pede sua aprovação.
                </p>
            </div>

            <div class="bg-gray-900 border border-gray-700 p-6 rounded-xl hover:border-yellow-500 transition-colors">
                <div class="flex items-center gap-3 mb-4">
                    <span class="text-2xl">👀</span>
                    <h4 class="text-yellow-400 font-bold text-xl">Tab (Copilot++)</h4>
                </div>
                <p class="text-gray-400 text-sm">
                    Não é apenas completar a linha. O Cursor prevê <strong>onde você vai clicar</strong> e o que vai escrever nas próximas 3 linhas. É quase telepático.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: O Cérebro (Claude 3.5 Sonnet vs GPT-4o)",
            content: `
        <p class="mb-6 text-gray-300">
            A ferramenta é o Cursor, mas quem "pensa" é o Modelo de Linguagem (LLM). Em 2026, a batalha é clara:
        </p>

        <div class="overflow-x-auto mb-8">
            <table class="w-full text-left text-sm text-gray-300 border-collapse border border-gray-700 rounded-lg">
                <thead class="bg-gray-800 text-white">
                    <tr>
                        <th class="p-3 border border-gray-700">Modelo</th>
                        <th class="p-3 border border-gray-700">Ponto Forte</th>
                        <th class="p-3 border border-gray-700">Ponto Fraco</th>
                        <th class="p-3 border border-gray-700">Veredito Dev</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="p-3 border border-gray-700 font-bold text-orange-400">Claude 3.5 Sonnet</td>
                        <td class="p-3 border border-gray-700">Raciocínio Lógico, Arquitetura, Menos Alucinação, Contexto Gigante.</td>
                        <td class="p-3 border border-gray-700">Ligeiramente mais lento que o Haiku.</td>
                        <td class="p-3 border border-gray-700 text-green-400 font-bold">👑 O REI DO CÓDIGO</td>
                    </tr>
                    <tr class="bg-gray-900/50">
                        <td class="p-3 border border-gray-700 font-bold text-blue-400">GPT-4o</td>
                        <td class="p-3 border border-gray-700">Conversação fluida, Multimodal (vê imagens de UI).</td>
                        <td class="p-3 border border-gray-700">Tende a ser "preguiçoso" (Lazy code), omite partes do código.</td>
                        <td class="p-3 border border-gray-700">Bom para Frontend/Design</td>
                    </tr>
                    <tr>
                        <td class="p-3 border border-gray-700 font-bold text-red-400">DeepSeek Coder V3</td>
                        <td class="p-3 border border-gray-700">Extremamente barato, Open Source, Especializado em Python/C++.</td>
                        <td class="p-3 border border-gray-700">Menos "criativo" em soluções abstratas.</td>
                        <td class="p-3 border border-gray-700">Ótimo Custo-Benefício</td>
                    </tr>
                </tbody>
            </table>
        </div>
      `
        },
        {
            title: "Capítulo 3: Configurando o .cursorrules (As Regras do Jogo)",
            content: `
        <p class="mb-4 text-gray-300">
            Você sabia que pode "treinar" o Cursor para codar exatamente como você gosta? Basta criar um arquivo chamado <code>.cursorrules</code> na raiz do seu projeto. A IA lê esse arquivo antes de responder qualquer coisa.
        </p>

        <div class="bg-[#1e1e1e] border border-gray-700 p-6 rounded-xl font-mono text-xs overflow-x-auto shadow-2xl relative group">
            <button class="absolute top-4 right-4 bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-white text-xs transition-colors opacity-0 group-hover:opacity-100">Copiar</button>
            <p class="text-gray-500 mb-2"># .cursorrules (Exemplo para Next.js Expert)</p>
<pre class="text-gray-300">
Role: Senior Next.js 15 & TypeScript Developer sent from the future (2026).

Behavior:
- Be concise. Don't explain basic concepts. Just give the code.
- Always use "const" over "let".
- Prefer Functional Components with React Hooks.
- Use Tailwind CSS for styling (mobile-first approach).
- Zod for validation.
- Lucide React for icons.

Tech Stack:
- Framework: Next.js 15 (App Router)
- UI: Shadcn/UI + Tailwind
- State: Zustand
- DB: Supabase / Prisma

Coding Rules:
1. NEVER use 'any' type. Define interfaces in a 'types' folder.
2. Structure: Keep components small (< 200 lines). Break huge files.
3. Errors: Wrap risky code in try/catch blocks.
4. Comments: Document complex logic only. Code should be self-documenting.

Safety:
- Do not expose API Keys in client components.
- Validate all inputs on server actions.
</pre>
        </div>
        <p class="text-gray-400 text-sm mt-4">
            Com esse arquivo, a IA para de te dar soluções genéricas e começa a agir como um Sênior contratado para o seu projeto específico.
        </p>
      `
        },
        {
            title: "Capítulo 4: Segurança e Ética (O Lado Sombrio)",
            content: `
        <p class="mb-4 text-gray-300">
            "Se a IA escreveu, quem é o dono?" e "Esse código é seguro?". Questões críticas para 2026.
        </p>
        
        <div class="space-y-4">
            <div class="bg-red-900/10 p-5 rounded-lg border-l-4 border-red-500">
                <h5 class="text-red-400 font-bold mb-2">🚨 Alucinação de Dependências (Typosquatting)</h5>
                <p class="text-sm text-gray-300">
                    Às vezes, a IA pode sugerir instalar um pacote que <em>parece</em> real (ex: ` + "`npm install fast-json-react`" + `) mas que não existe ou é um vírus.
                    <br/><strong>Regra de Ouro:</strong> Nunca instale um pacote sugerido sem antes verificar se ele tem estrelas no GitHub e downloads no NPM.
                </p>
            </div>
            
            <div class="bg-yellow-900/10 p-5 rounded-lg border-l-4 border-yellow-500">
                <h5 class="text-yellow-400 font-bold mb-2">🔐 Vazamento de Segredos</h5>
                <p class="text-sm text-gray-300">
                    Se você usar o chat da IA e colar suas chaves de API (AWS_KEY, OPENAI_KEY), esses dados podem ser usados para treinar o modelo (dependendo das configurações de privacidade).
                    <br/><strong>Solução:</strong> Use o modo "Privacy Mode" no Cursor (Business tier) ou remova segredos antes de colar código.
                </p>
            </div>
        </div>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/o-que-sao-ai-agents-guia-completo",
            title: "AI Agents",
            description: "Leve sua programação para o próximo nível criando agentes autônomos."
        },
        {
            href: "/guias/atalhos-navegador-produtividade",
            title: "Produtividade Real",
            description: "Como usar o navegador Arc para pesquisar docs 2x mais rápido."
        },
        {
            href: "/guias/debloat-windows-11-otimizacao-powershell",
            title: "PC Rápido",
            description: "Prepare seu Windows para rodar compiladores e Docker sem travar."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="35 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
