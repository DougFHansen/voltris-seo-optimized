import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'como-programar-com-ia-vibe-coding',
    title: "Vibe Coding: O Futuro da Programação com IA (Guia Definitivo 2026)",
    description: "Esqueça a sintaxe. Aprenda a programar usando Cursor, Claude 3.5 e Copilot focando na lógica e no produto. O guia completo para developers modernos.",
    category: 'inteligencia-artificial',
    difficulty: 'Iniciante',
    time: '20 min'
};

const title = "Vibe Coding: O Futuro da Programação com IA (Guia Definitivo 2026)";
const description = "Esqueça a sintaxe. Aprenda a programar usando Cursor, Claude 3.5 e Copilot focando na lógica e no produto. O guia completo para developers modernos.";
const keywords = [
    'vibe coding o que é',
    'cursor ide tutorial iniciante',
    'como usar claude 3.5 sonnet para programar',
    'github copilot workspace dicas',
    'programacao com ia substitui dev juniors',
    'como criar apps sem saber programar ia'
];

export const metadata: Metadata = createGuideMetadata('como-programar-com-ia-vibe-coding', title, description, keywords);

export default function VibeCodingGuide() {
    const summaryTable = [
        { label: "Melhor IDE", value: "Cursor (Fork do VS Code)" },
        { label: "Melhor Modelo", value: "Claude 3.5 Sonnet (Anthropic)" },
        { label: "Conceito Chave", value: "Intenção > Sintaxe" },
        { label: "Risco Principal", value: "Alucinação de Código (Bugs Silenciosos)" },
        { label: "Produtividade", value: "+300% (Estimado)" }
    ];

    const contentSections = [
        {
            title: "O que é Vibe Coding?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2024, Andrej Karpathy (ex-OpenAI) cunhou o termo. Em 2026, é o padrão. 
          <br/><br/>
          <strong>Vibe Coding</strong> é a prática de programar onde o humano foca no "Vibe" (a intenção, o design, a experiência do usuário) e a IA cuida da implementação bruta (a sintaxe, as funções, o boilerplate).
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Não é "No-Code". Você ainda precisa entender lógica. Mas em vez de gastar 4 horas escrevendo CSS para centralizar uma div, você diz ao Cursor: <em>"Faz essa div flutuar no canto e ter um brilho neon rosa quando passa o mouse"</em>, e ele gera o código Tailwind perfeito em 2 segundos.
        </p>
      `
        },
        {
            title: "As Ferramentas Obrigatórias em 2026",
            content: `
        <div class="grid gap-6">
            <div class="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl border border-blue-500/30">
                <div class="flex items-center gap-4 mb-3">
                    <span class="text-3xl">🖱️</span>
                    <h4 class="text-xl font-bold text-white">1. Cursor (O Novo Rei)</h4>
                </div>
                <p class="text-gray-300 mb-2">
                    O Cursor é um fork do VS Code. Tudo o que funciona no VS Code funciona nele. A diferença mágica é a integração nativa com IA.
                </p>
                <ul class="list-disc list-inside text-gray-400 text-sm space-y-1">
                    <li><strong>Ctrl+K:</strong> Edita o código selecionado com comando de texto natural.</li>
                    <li><strong>Ctrl+L:</strong> Chat com acesso total ao contexto de todos os arquivos do projeto.</li>
                    <li><strong>Tab:</strong> Autocomplete de múltiplas linhas que "adivinha" onde você vai clicar.</li>
                </ul>
            </div>

            <div class="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl border border-purple-500/30">
                <div class="flex items-center gap-4 mb-3">
                    <span class="text-3xl">🧠</span>
                    <h4 class="text-xl font-bold text-white">2. Claude 3.5 Sonnet (O Cérebro)</h4>
                </div>
                <p class="text-gray-300 mb-2">
                    Enquanto o GPT-4o é bom em conversar, o <strong>Claude 3.5 Sonnet</strong> provou ser superior em lógica de programação. Ele comete menos erros de sintaxe e entende melhor arquiteturas complexas.
                </p>
                <strong class="text-green-400 text-sm">Dica Pro:</strong> Configure o Cursor para usar a API do Claude 3.5 em vez do modelo padrão.
            </div>
        </div>
      `
        },
        {
            title: "O Perigo: A Ilusão de Competência",
            content: `
        <p class="mb-4 text-gray-300">
            Programar com IA é como dirigir um Tesla com Autopilot. É relaxante, mas se você dormir no volante, vai bater.
        </p>
        <div class="bg-red-900/10 border-l-4 border-red-500 p-4 rounded-r-lg">
            <h5 class="text-red-400 font-bold mb-2">Bugs de Alucinação</h5>
            <p class="text-gray-300 text-sm">
                A IA pode inventar uma biblioteca que não existe (` + "`import super_fast_json`" + `) ou usar uma função que foi depreciada em 2023. O Vibe Coder precisa ser um excelente <strong>Revisor de Código</strong> (Code Reviewer). Nunca aceite um código da IA sem ler e entender o que ele faz.
            </p>
        </div>
        <p class="mt-4 text-gray-300">
            <strong>Dica de Segurança:</strong> Sempre peça para a IA escrever testes unitários (` + "`Unit Tests`" + `) junto com a funcionalidade. Se o teste passar, a chance de alucinação diminui drasticamente.
        </p>
      `
        },
        {
            title: "Como Configurar o Cursor para Máxima Eficiência (.cursorrules)",
            content: `
        <p class="mb-4 text-gray-300">
            O segredo dos profissionais é o arquivo <code>.cursorrules</code> na raiz do projeto. Ele diz à IA como se comportar.
        </p>
        <div class="bg-gray-950 p-4 rounded-lg font-mono text-xs overflow-x-auto border border-gray-700">
<pre class="text-gray-300">
# .cursorrules
Role: Senior FullStack Developer (Next.js 15, Tailwind)

Rules:
1. Sempre use Functional Components com TypeScript.
2. Nunca use ` + "`any`" + ` como tipo. Defina interfaces.
3. Use ` + "`lucide-react`" + ` para ícones.
4. Prefira Server Actions em vez de API Routes.
5. Se a resposta for longa, quebre em passos e pergunte se pode continuar.
6. Mantenha o código DRY (Don't Repeat Yourself).
</pre>
        </div>
        <p class="text-gray-400 text-sm mt-2">
            Copie isso para o seu projeto e veja a qualidade do código gerado subir de nível instantaneamente.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/o-que-sao-ai-agents-guia-completo",
            title: "AI Agents",
            description: "Leve o Vibe Coding para o próximo nível criando agentes autônomos."
        },
        {
            href: "/guias/atalhos-produtividade-windows",
            title: "Produtividade",
            description: "Atalhos de teclado essenciais para programadores."
        },
        {
            href: "/guias/melhores-navegadores-custo-beneficio",
            title: "Ferramentas Web",
            description: "Navegadores otimizados para desenvolvimento (Arc, Edge Dev)."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
