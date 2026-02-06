import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'como-usar-ddu-driver-uninstaller',
    title: "Como usar DDU (Display Driver Uninstaller): Guia Seguro (2026)",
    description: "Drivers de vídeo corrompidos causam tela azul e queda de FPS. Aprenda a usar o DDU para remover completamente drivers da Nvidia/AMD/Intel e fazer uma instalação limpa.",
    category: 'software',
    difficulty: 'Avançado',
    time: '20 min'
};

const title = "Tutorial DDU: Como Reinstalar Drivers de Vídeo do Zero (Nvidia/AMD/Intel)";
const description = "Simplesmente clicar em 'Atualizar driver' não remove os arquivos velhos. O DDU é a única forma de garantir que seu PC esteja 100% livre de conflitos de driver.";

const keywords = [
    'como usar ddu display driver uninstaller',
    'remover driver de video completamente',
    'instalação limpa driver nvidia ddu',
    'tela preta após instalar driver amd',
    'entrar modo de segurança windows 11 ddu',
    'ddu safe mode tutorial',
    'limpar driver intel arc',
    'nvlddmkm.sys erro fix ddu'
];

export const metadata: Metadata = createGuideMetadata('como-usar-ddu-driver-uninstaller', title, description, keywords);

export default function DDUGuide() {
    const summaryTable = [
        { label: "Ferramenta", value: "DDU (Wagnardsoft)" },
        { label: "Modo Obrigatório", value: "Modo de Segurança (Safe Mode)" },
        { label: "Conexão", value: "Desligar Internet (Crucial)" },
        { label: "Uso", value: "Troca de GPU ou Bugs Graves" },
        { label: "Tempo", value: "10-15 Minutos" },
        { label: "Risco", value: "Baixo (Se usar Ponto de Restauração)" }
    ];

    const contentSections = [
        {
            title: "Quando usar o DDU?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Você não precisa usar o DDU toda vez que sai uma atualização de driver. Use-o apenas em três situações: 1) Você trocou de placa de vídeo (ex: saiu de AMD para Nvidia), 2) O driver atual está travando/dando tela azul, ou 3) Jogos estão com desempenho muito abaixo do esperado.
        </p>

        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 my-8">
            <h4 class="text-[#31A8FF] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">🧹</span> Modo Limpeza Driver Voltris
            </h4>
            <p class="text-gray-300 mb-4">
                Entrar no Modo de Segurança é chato. O <strong>Voltris Optimizer</strong> tem um modo "Driver Clean" que reinicia o PC em modo seguro, executa a limpeza e bloqueia o Windows Update temporariamente para evitar que ele instale drivers genéricos antes de você instalar o oficial.
            </p>
            <a href="/voltrisoptimizer" class="group relative inline-flex px-8 py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] items-center justify-center gap-2">
                Limpeza Fácil com Voltris
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        </div>
      `
        },
        {
            title: "Passo 0: Preparação (Não pule!)",
            content: `
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Baixe o <strong>DDU</strong> no site oficial (Wagnardsoft).</li>
            <li>Baixe o driver de vídeo <strong>MAIS NOVO</strong> para sua placa (site da Nvidia/AMD/Intel). Deixe o instalador na Área de Trabalho.</li>
            <li><strong>DESCONECTE A INTERNET (Wi-Fi ou Cabo).</strong> Isso é vital. Se você reiniciar com internet ligada, o Windows Update vai baixar e instalar um driver genérico em segundos, estragando todo o processo.</li>
        </ol>
      `
        },
        {
            title: "Passo 1: Entrando no Modo de Segurança",
            content: `
        <p class="mb-4 text-gray-300">
            O DDU funciona melhor sem outros programas rodando.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>Segure a tecla <strong>SHIFT</strong> no teclado.</li>
            <li>Enquanto segura Shift, vá no Menu Iniciar > Ligar/Desligar > Reiniciar.</li>
            <li>O PC vai abrir uma tela azul de opções.</li>
            <li>Navegue em: <strong>Solução de Problemas > Opções Avançadas > Configurações de Inicialização > Reiniciar</strong>.</li>
            <li>O PC reiniciará de novo. Aperte a tecla <strong>4</strong> ou <strong>F4</strong> (Habilitar Modo de Segurança).</li>
            <li>A tela ficará com resolução baixa e fundo preto. É normal.</li>
        </ul>
      `
        },
        {
            title: "Passo 2: Usando o DDU",
            content: `
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
            <li>Abra o DDU.exe.</li>
            <li>No lado direito, selecione "GPU".</li>
            <li>Selecione a marca (NVIDIA, AMD ou INTEL).</li>
            <li>Clique no botão <strong>"Limpar e Reiniciar"</strong> (Clean and Restart).</li>
            <li>O programa vai demorar uns 2 minutos removendo chaves de registro, arquivos e pastas.</li>
            <li>O PC reiniciará automaticamente em modo normal.</li>
        </ol>
      `
        },
        {
            title: "Passo 3: Instalação Limpa",
            content: `
        <p class="mb-4 text-gray-300">
            Agora que você está no Windows normal (ainda sem internet e com a tela meio pixelada):
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
            <li>Execute o instalador do driver que você baixou no Passo 0.</li>
            <li>Na instalação (Nvidia), escolha "Personalizada" e marque <strong>"Executar instalação limpa"</strong> (apenas por garantia).</li>
            <li>Após instalar, reinicie o PC mais uma vez.</li>
            <li>Agora pode ligar a internet.</li>
        </ol>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Resolvendo problemas de áudio HDMI",
            content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-yellow-400 font-bold mb-4 text-xl">Monitor sem som?</h4>
                <p class="text-gray-300 mb-4">
                    Às vezes, drivers de áudio da GPU (Nvidia High Definition Audio) entram em conflito com o Realtek da placa-mãe.
                </p>
                <p class="text-gray-300 text-sm">
                    No DDU, no lugar de "GPU", selecione "Audio" e remova os drivers de áudio da Nvidia/AMD se você não usa o som do monitor/TV. Isso força o Windows a usar o som Padrão, resolvendo conflitos e chiados.
                </p>
            </div>
            `
        }
    ];

    const additionalContentSections = [
        {
            title: "NVCleanInstall (Alternativa para Experientes)",
            content: `
            <p class="mb-4 text-gray-300">
                Se você tem GPU Nvidia, existe uma ferramenta chamada <strong>NVCleanInstall</strong>. Ela permite instalar o driver <em>sem</em> a Telemetria, sem o GeForce Experience (se você não usa) e sem drivers 3D Vision inúteis. É um "Debloat" para o driver de vídeo, deixando-o mais leve e com menos processos de fundo.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "O DDU apaga meus jogos?",
            answer: "Não! Ele só apaga os arquivos do driver (sistema). Seus jogos, saves e configurações pessoais continuam intactos. Porém, suas configurações do Painel Nvidia (Cores, Resolução Personalizada) serão resetadas."
        },
        {
            question: "Preciso fazer isso em toda atualização?",
            answer: "Não. Fazer isso todo mês é perda de tempo. Só faça se tiver problemas ou trocar de placa. Para updates normais, a instalação 'Expressa' do GeForce Experience é suficiente."
        },
        {
            question: "Funciona para drivers de Chipset?",
            answer: "O DDU foca em GPU e Audio. Para Chipset (AMD Ryzen/Intel), o ideal é desinstalar pelo Painel de Controle > Programas e Recursos e instalar o novo por cima."
        }
    ];

    const externalReferences = [
        { name: "Wagnardsoft (Site Oficial do DDU)", url: "https://www.wagnardsoft.com/" },
        { name: "NVCleanInstall", url: "https://www.techpowerup.com/download/techpowerup-nvcleanstall/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/instalacao-limpa-drivers-nvidia-amd",
            title: "Drivers Nvidia/AMD",
            description: "Dicas de configuração do Painel de Controle."
        },
        {
            href: "/guias/como-resolver-tela-azul",
            title: "Tela Azul",
            description: "Como diagnosticar se o driver era o culpado."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Otimizar Sistema",
            description: "Melhore o desempenho geral do Windows."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Avançado"
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
