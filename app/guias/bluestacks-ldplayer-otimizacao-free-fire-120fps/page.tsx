import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'bluestacks-ldplayer-otimizacao-free-fire-120fps',
    title: "Android no PC (2026): O Guia Definitivo de Otimização (120 FPS)",
    description: "Quer rodar Free Fire, PUBG ou Ragnarok liso no PC? Aprenda a configurar BlueStacks e LDPlayer, ativar Virtualização (VT-x) e debloatar o emulador.",
    category: 'emulacao',
    difficulty: 'Intermediário',
    time: '30 min'
};

const title = "Android no PC (2026): O Guia Definitivo de Otimização (120 FPS)";
const description = "Emuladores Android são pesados por natureza. Sem a configuração certa, até um PC Gamer sofre. Aprenda a alocar núcleos, RAM e ativar a virtualização para voar.";

const keywords = [
    'melhor emulador android para pc fraco 2026',
    'bluestacks 5 configuração 120 fps free fire',
    'ldplayer 9 otimizacao leve',
    'ativar virtualização vt-x bios para emulador',
    'como fazer root bluestacks 5 bstweaker 6',
    'tft mobile pc desempenho'
];

export const metadata: Metadata = createGuideMetadata('bluestacks-ldplayer-otimizacao-free-fire-120fps', title, description, keywords);

export default function AndroidEmuGuide() {
    const summaryTable = [
        { label: "O Melhor para FPS", value: "LDPlayer 9 (Leve)" },
        { label: "O Mais Compatível", value: "BlueStacks 5 (Estável)" },
        { label: "Requisito #1", value: "Virtualização (VT-x) ON" },
        { label: "CPU Cores", value: "4 Núcleos (Ideal)" },
        { label: "RAM", value: "4 GB (Não coloque mais)" },
        { label: "Hyper-V", value: "DESLIGADO (Importante)" }
    ];

    const contentSections = [
        {
            title: "Passo 0: A Regra de Ouro (Virtualização)",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          99% dos casos de "emulador travando" são culpa da Virtualização desligada.
          <br/>Sem VT-x (Intel) ou SVM (AMD) ativados na BIOS, o emulador roda em "Modo Software" usando apenas 1 núcleo, o que é inútil para jogos.
          <br/><strong>Ação:</strong> Reinicie o PC, entre na BIOS e ative a Virtualização AGORA.
        </p>
      `
        },
        {
            title: "BlueStacks 5: Configuração Competitiva",
            content: `
        <p class="mb-4 text-gray-300">
          O BS5 é o padrão da indústria. Vamos configurá-lo para performance máxima.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
            <li>Abra as Configurações (Engrenagem).</li>
            <li><strong>Performance:</strong>
                <ul class="list-disc ml-8 mt-2 text-sm text-gray-400">
                    <li>CPU: Escolha "Médio (2 núcleos)" se tiver um i3/i5 antigo. Escolha "Alto (4 núcleos)" se tiver um Ryzen 5/i7 recente. <strong>NUNCA use todos os núcleos.</strong> O Windows precisa de folga.</li>
                    <li>RAM: "Alto (4 GB)". O Android x86 de 32 bits não usa mais que isso eficientemente.</li>
                    <li>Modo de Desempenho: "Alta Performance".</li>
                    <li>Taxa de Quadros: Ative "FPS Alto" e arraste para 120 ou 240.</li>
                </ul>
            </li>
            <li><strong>Visualização:</strong> Use 1600x900 (Melhor que 1080p para FPS) ou 1280x720 (PC Fraco).</li>
            <li><strong>Gráficos:</strong> 
                <br/>- Engine: Desempenho (Legacy).
                <br/>- Renderizador: OpenGL (Mais estável) ou Vulkan (Teste se tiver AMD).
                <br/>- Texturas ASTC: Desativado (Software decode pesa CPU).
            </li>
        </ol>
      `
        },
        {
            title: "LDPlayer 9: A Escolha Leve",
            content: `
        <p class="mb-4 text-gray-300">
           Para PCs mais fracos ou quem quer resposta de mouse (input lag) menor, o LDPlayer 9 é superior.
           <br/>1. Vá em Settings > Advanced.
           <br/>2. CPU: 2 Cores | RAM: 3072M (3GB).
           <br/>3. Model: Escolha "ROG Phone II" para desbloquear 90/120 FPS em jogos como PUBG e Free Fire.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Otimizações de Sistema (Debloat)",
            content: `
        <h4 class="text-white font-bold mb-3">Removendo o Lixo</h4>
        <p class="mb-4 text-gray-300">
            Emuladores vêm cheios de "Launchers" pesados e apps patrocinados.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div class="bg-gray-800/50 p-4 rounded-lg border border-red-500/30">
                <h5 class="font-bold text-white mb-2">BS Tweaker (Para BlueStacks)</h5>
                <p class="text-sm text-gray-300">
                    Baixe o BS Tweaker 6. Ele permite fazer Root, remover anúncios e desativar abas "Game Center" que consomem RAM à toa.
                </p>
            </div>
            <div class="bg-gray-800/50 p-4 rounded-lg border border-yellow-500/30">
                <h5 class="font-bold text-white mb-2">Nova Launcher</h5>
                <p class="text-sm text-gray-300">
                    Instale o Nova Launcher na Play Store do emulador e defina como padrão. A tela inicial ficará limpa e leve, sem carregar banners de propaganda.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Hyper-V: O Inimigo",
            content: `
        <p class="mb-4 text-gray-300">
            Se seu emulador dá Tela Azul (BSOD) ou parece lento, é o Hyper-V do Windows atrapalhando a virtualização do emulador.
            <br/>Abra o CMD como Admin e digite:
            <br/><code class="bg-black p-1 rounded">bcdedit /set hypervisorlaunchtype off</code>
            <br/>Reinicie o PC. (Isso desativa o Subsistema Linux/Docker, mas salva o emulador).
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Dicas de Mapeamento (Smart Keymapping)",
            content: `
        <h4 class="text-white font-bold mb-3">Subindo Capa</h4>
        <p class="mb-4 text-gray-300">
            Use as configs de "Smart Controls" do BlueStacks para o Free Fire. Elas detectam automaticamente se você está no menu ou no jogo, liberando o mouse sozinho.
            <br/>Ajuste a sensibilidade Y (Vertical) para ser maior que a X (Horizontal) para facilitar headshots.
        </p>
      `
        }
    ];

    const faqItems = [
        {
            question: "Qual o melhor emulador para PC com 4GB RAM?",
            answer: "LDPlayer versão 3 ou 5 (32 bits). É extremamente leve. O BlueStacks 5 também roda bem se configurado no modo Eco."
        },
        {
            question: "Fui banido do COD Mobile/PUBG usando emulador?",
            answer: "Jogos competitivos separam emuladores em lobbies de emuladores. Se você usar hacks ou tentar esconder que está emulando (Bypass), você será banido. Jogue limpo."
        },
        {
            question: "Devo usar 64-bit (Pie/Nougat)?",
            answer: "Geralmente NÃO. A versão 32-bit (Nougat) é mais leve e compatível. Só use 64-bit se o jogo exigir (ex: TFT, Genshin Impact)."
        }
    ];

    const externalReferences = [
        { name: "BlueStacks 5 Download", url: "https://www.bluestacks.com/" },
        { name: "LDPlayer 9 Download", url: "https://pt.ldplayer.net/" },
        { name: "BS Tweaker (Ferramenta Root)", url: "https://bstweaker.tk/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/atualizar-bios-seguro",
            title: "Habilitar VT-x",
            description: "Tutorial de BIOS."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD Rápido",
            description: "Carregue o emulador em 5 segundos."
        },
        {
            href: "/guias/como-escolher-processador-2026",
            title: "Processador para Emular",
            description: "O que importa mais: núcleos ou clock?"
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
            difficultyLevel="Intermediário"
            author="Voltris Emu Team"
            lastUpdated="2026-02-06"
            contentSections={contentSections}
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            faqItems={faqItems}
            externalReferences={externalReferences}
            relatedGuides={relatedGuides}
        />
    );
}
