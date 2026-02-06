import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'limpar-memoria-ram-windows',
    title: "Como Limpar Memória RAM e Reduzir Standby List (2026)",
    description: "Jogos travando após algumas horas? Pode ser a Lista de Espera (Standby List) cheia. Aprenda a usar o ISLC para limpar o cache da RAM automaticamente sem fechar jogos.",
    category: 'software',
    difficulty: 'Intermediário',
    time: '15 min'
};

const title = "Guia de Memória RAM: Como Resolver Falta de Memória e Stuttering (ISLC)";
const description = "Ter 16GB de RAM não adianta se o Windows consome 8GB em cache. Descubra como gerenciar a memória virtual e o bug do Standby List no Windows 10/11.";

const keywords = [
    'limpar standby list windows 11 islc',
    ' Intelligent Standby List Cleaner tutorial',
    'jogos travando falta de memoria ram',
    'reduzir uso memoria ram windows 11',
    'memória virtual paginação arquivo pagefile',
    'rammap sysinternals como usar',
    'chrome consumindo muita ram fix',
    'fuga de memoria memory leak jogos'
];

export const metadata: Metadata = createGuideMetadata('limpar-memoria-ram-windows', title, description, keywords);

export default function RAMGuide() {
    const summaryTable = [
        { label: "Problema", value: "Standby List Cache" },
        { label: "Sintoma", value: "Jogo engasga após 1 hora" },
        { label: "Ferramenta", value: "ISLC (Wagnardsoft)" },
        { label: "Arquivo de Paginação", value: "Deixe 'Gerenciado pelo Sistema'" },
        { label: "Chrome", value: "Use 'Economia de Memória'" },
        { label: "Limpeza", value: "Automática via Software" }
    ];

    const contentSections = [
        {
            title: "O Bug do Standby List",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Windows tem um gerenciamento de memória agressivo: ele mantém arquivos fechados na memória RAM ("Em Espera" ou Standby) caso você queira abri-los de novo. A teoria é boa. Na prática, quando um jogo pede RAM livre, o Windows às vezes demora para liberar essa memória em espera, causando uma micro-travada (Stutter).
        </p>

        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 my-8">
            <h4 class="text-[#31A8FF] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">🧠</span> Smart RAM Voltris
            </h4>
            <p class="text-gray-300 mb-4">
                Programas de "Limpar RAM" de 2010 são fakes. O <strong>Voltris Optimizer</strong> usa a mesma tecnologia do ISLC, monitorando a Standby List silenciosamente. Se ela crescer demais durante um jogo, o Voltris a esvazia instantaneamente sem tocar na memória ativa do jogo, prevenindo stutters.
            </p>
            <a href="/voltrisoptimizer" class="group relative inline-flex px-8 py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] items-center justify-center gap-2">
                Gerenciar RAM
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        </div>
      `
        },
        {
            title: "Solução: ISLC (Intelligent Standby List Cleaner)",
            content: `
        <p class="mb-4 text-gray-300">
            Ferramenta gratuita criada pelo mesmo desenvolvedor do DDU.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 bg-[#0A0A0F] p-4 rounded-xl border border-white/5 font-mono text-sm">
            <li>Baixe o <strong>ISLC</strong>.</li>
            <li>Marque "Start ISLC Minimized" e "Launch ISLC on user logon".</li>
            <li>Configuração sugerida:
                <ul class="ml-6 mt-2 text-[#31A8FF] list-disc">
                    <li>The list size is at least: <strong>1024 MB</strong>.</li>
                    <li>Free memory is lower than: <strong>2048 MB</strong> (Se você tem 8GB) ou <strong>4096 MB</strong> (Se tem 16GB).</li>
                </ul>
            </li>
            <li>Clique em <strong>Start</strong>.</li>
            <li>Agora, sempre que a memória livre cair abaixo do limite e o cache estiver cheio, ele limpa sozinho. Isso elimina o stuttering em jogos de mundo aberto como Warzone e Fortnite.</li>
        </ol>
      `
        },
        {
            title: "Navegadores: O ladrão de RAM",
            content: `
        <p class="mb-4 text-gray-300">
            Você joga com o Chrome/Edge aberto tocando música?
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>Vá nas Configurações do Navegador > Desempenho.</li>
            <li>Ative a <strong>"Economia de Memória"</strong>.</li>
            <li>Isso congela abas inativas, liberando até 2GB de RAM para o seu jogo.</li>
        </ul>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Arquivo de Paginação (Pagefile): Desativar é bom?",
            content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-white font-bold mb-4 text-xl">NÃO DESATIVE!</h4>
                <p class="text-gray-300 mb-4">
                    Um mito antigo diz para desativar a memória virtual se tiver muita RAM. Errado. Alguns jogos e o próprio Windows PRECISAM do pagefile para alocar endereços de memória, mesmo que não usem. Se desativar, jogos como Cyberpunk 2077 podem crashar no boot.
                </p>
                <p class="text-gray-300 text-sm">
                    <strong>Recomendação:</strong> Deixe em "Gerenciado pelo Sistema" no seu SSD mais rápido. Não coloque em HD mecânico, pois causa lentidão.
                </p>
            </div>
            `
        }
    ];

    const additionalContentSections = [
        {
            title: "Diagnóstico com RAMMap",
            content: `
            <p class="mb-4 text-gray-300">
                Quer ver exatamente o que está na Standby List? Baixe o <strong>RAMMap</strong> da Microsoft Sysinternals. Ele mostra graficamente cada arquivo cacheado. É ótimo para descobrir qual programa está vazando memória (Memory Leak).
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Preciso de 32GB de RAM para jogar?",
            answer: "Em 2026, 16GB é o mínimo recomendado. 32GB é o ideal para ficar tranquilo jogando com Discord e Chrome abertos. Com 8GB, o uso do ISLC e debloat do Windows é OBRIGATÓRIO."
        },
        {
            question: "Posso usar Pen Drive como RAM (ReadyBoost)?",
            answer: "Não. O ReadyBoost era útil no Windows Vista com HDs lentos. Hoje, qualquer Pen Drive é muito mais lento que a RAM, e usar isso em um SSD na verdade piora o desempenho."
        },
        {
            question: "Limpar RAM fecha meus jogos?",
            answer: "O comando de limpar a Standby List NÃO toca nos dados ativos. Seus programas abertos continuam funcionando perfeitamente. Ele só apaga dados de programas que você JÁ FECHOU."
        }
    ];

    const externalReferences = [
        { name: "ISLC Download (Wagnardsoft)", url: "https://www.wagnardsoft.com/forums/viewtopic.php?t=1256" },
        { name: "RAMMap (Microsoft)", url: "https://learn.microsoft.com/en-us/sysinternals/downloads/rammap" }
    ];

    const relatedGuides = [
        {
            href: "/guias/debloating-windows-11",
            title: "Reduzir Consumo",
            description: "Menos processos = Mais RAM livre."
        },
        {
            href: "/guias/otimizacao-processos-segundo-plano",
            title: "Processos Inúteis",
            description: "Identifique quem come sua memória."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Pagefile no SSD",
            description: "Configuração ideal de memória virtual."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            externalReferences={externalReferences}
        />
    );
}
