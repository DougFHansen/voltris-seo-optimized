import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'melhores-navegadores-custo-beneficio',
    title: "Chrome, Edge, Brave ou GX: Qual o Melhor Navegador para Gamer? (2026)",
    description: "Testamos o consumo de RAM e CPU dos principais navegadores. Descubra qual browser rouba menos FPS do seu jogo e se o 'Gamer Browser' (Opera GX) é realmente útil.",
    category: 'software',
    difficulty: 'Iniciante',
    time: '15 min'
};

const title = "Batalha dos Navegadores 2026: Quem consome menos RAM?";
const description = "Chrome é pesadão? Edge é bom? Opera GX funciona? Fizemos os testes com 20 abas abertas para você escolher o navegador perfeito para usar enquanto joga.";

const keywords = [
    'melhor navegador para pc fraco 2026',
    'opera gx aumenta fps ou mito',
    'chrome vs edge consumo ram',
    'brave browser é seguro',
    'navegador mais leve para jogar',
    'como limitar ram do navegador',
    'thorium browser review',
    'firefox vs chrome privacidade'
];

export const metadata: Metadata = createGuideMetadata('melhores-navegadores-custo-beneficio', title, description, keywords);

export default function BrowserGuide() {
    const summaryTable = [
        { label: "Mais Rápido", value: "Thorium (Base Chromium)" },
        { label: "Mais Leve", value: "Microsoft Edge (Modo Efficiency)" },
        { label: "Gamer", value: "Opera GX (Limitadores)" },
        { label: "Privacidade", value: "Brave ou Firefox" },
        { label: "Padrão", value: "Chrome (Comilão de RAM)" },
        { label: "Recomendado", value: "Edge (Já vem instalado)" }
    ];

    const contentSections = [
        {
            title: "O Mito do Opera GX",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Opera GX ficou famoso pelo design "Gamer" e limitadores de RAM. Ele funciona? <strong>Sim e Não.</strong> O limitador de RAM realmente impede o navegador de passar do limite (ex: 2GB), mas isso deixa o navegador <em>lento</em>. As abas recarregam toda hora. É bom para não travar o jogo, mas ruim para navegar.
        </p>

        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 my-8">
            <h4 class="text-[#31A8FF] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">🌐</span> Browser Mode Voltris
            </h4>
            <p class="text-gray-300 mb-4">
                Em vez de mudar de navegador, use o que você gosta. O <strong>Voltris Optimizer</strong> tem um recurso que detecta quando você abre um jogo e envia um comando para o Windows "congelar" (Trim Process) o navegador em segundo plano, reduzindo o uso de RAM de 3GB para 100MB instantaneamente, sem fechar suas abas.
            </p>
            <a href="/voltrisoptimizer" class="group relative inline-flex px-8 py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] items-center justify-center gap-2">
                Otimizar Navegador
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        </div>
      `
        },
        {
            title: "Microsoft Edge: O Rei do Sleeping Tabs",
            content: `
        <p class="mb-4 text-gray-300">
            A Microsoft fez um trabalho incrível no Edge. O recurso <strong>Guias em Suspensão (Sleeping Tabs)</strong> é matador.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>Depois de 5 minutos de inatividade, a aba "dorme" e para de usar CPU.</li>
            <li>Você pode ter 50 abas abertas e o consumo de CPU ser 0%.</li>
            <li>Como é nativo do Windows, ele desperta mais rápido que os outros.</li>
            <li><strong>Veredito:</strong> Melhor opção para quem joga e deixa YouTube/Twitch aberto de fundo.</li>
        </ul>
      `
        },
        {
            title: "Chrome: O Confortável",
            content: `
        <p class="mb-4 text-gray-300">
            O Google Chrome adicionou recentemente o "Economia de Memória". Melhorou, mas ainda é o mais pesado da lista. Ele cria muitos processos separados para cada extensão. Se você tem 8GB de RAM, fuja do Chrome enquanto joga. Se tem 32GB, use à vontade.
        </p>
      `
        },
        {
            title: "Brave: Sem Anúncios, Mais Velocidade",
            content: `
        <p class="mb-4 text-gray-300">
            O Brave bloqueia anúncios e rastreadores nativamente. Isso significa que sites pesados (como portais de notícia) carregam 3x mais rápido porque ele não baixa os scripts de propaganda. Menos script = Menos uso de CPU = Mais CPU para o seu jogo.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Thorium: Para usuários Hardcore",
            content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-white font-bold mb-4 text-xl">O Mais Rápido do Mundo?</h4>
                <p class="text-gray-300 mb-4">
                    O Thorium é uma versão modificada do Chromium compilada com instruções AVX2 especiais para processadores modernos. Ele abre páginas até 10% mais rápido que o Chrome.
                </p>
                <p class="text-gray-300 text-sm">
                    Contra: Sincronização com conta Google é chata de configurar e ele atualiza menos frequentemente (risco de segurança leve). Use por sua conta e risco.
                </p>
            </div>
            `
        }
    ];

    const additionalContentSections = [
        {
            title: "Dica: Desative Aceleração de Hardware (as vezes)",
            content: `
            <p class="mb-4 text-gray-300">
                Se você tem uma GPU fraca e assiste Twitch/YouTube no 2º monitor enquanto joga, o navegador compete com o jogo pela placa de vídeo.
            </p>
            <p class="text-gray-300 text-sm">
                Desativar a "Aceleração de Hardware" nas configurações do navegador joga a carga de vídeo para a CPU. Se sua CPU for forte e GPU fraca, isso melhora o FPS do jogo. Se sua CPU for fraca, vai travar tudo. Teste!
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Firefox é bom para jogos?",
            answer: "O Firefox usa uma engine diferente (Gecko). Ele é excelente para privacidade, mas em testes brutos de performance JavaScript, ele perde levemente para os baseados em Chromium (Edge/Chrome). A diferença é imperceptível para a maioria."
        },
        {
            question: "Extensões deixam lento?",
            answer: "MUITO. Cada extensão é um mini-programa rodando em cada aba. Honey, Corretores, VPNs... Se for jogar, desative ou use um perfil limpo."
        }
    ];

    const externalReferences = [
        { name: "Thorium Browser", url: "https://thorium.rocks/" },
        { name: "Microsoft Edge Sleeping Tabs Info", url: "https://blogs.windows.com/windowsexperience/2020/09/23/announcing-windows-10-insider-preview-build-20221/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/limpar-memoria-ram-windows",
            title: "Limpar RAM",
            description: "Gerencie o consumo do navegador."
        },
        {
            href: "/guias/extensoes-produtividade-chrome",
            title: "Extensões Úteis",
            description: "Quais extensões valem o peso."
        },
        {
            href: "/guias/atalhos-navegador-produtividade",
            title: "Atalhos",
            description: "Navegue mais rápido."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Iniciante"
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
